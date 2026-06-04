import { db } from '@/db';
import { projects, leads, proposals } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { Resend } from 'resend';
import { secondPaymentReminderEmail } from '@/lib/emails/secondPaymentReminderEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface SecondPaymentJobResult {
  reminders_sent: number;
  urgent_sent: number;
  overdue_marked: number;
  errors: string[];
}

export async function runSecondPaymentJob(): Promise<SecondPaymentJobResult> {
  const result: SecondPaymentJobResult = { reminders_sent: 0, urgent_sent: 0, overdue_marked: 0, errors: [] };
  const now = new Date();

  const activeProjects = await db
    .select({ project: projects, lead: leads, proposal: proposals })
    .from(projects)
    .leftJoin(proposals, eq(projects.proposal_id, proposals.id))
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .where(eq(projects.payment_status, 'half_paid'));

  for (const row of activeProjects) {
    const { project, lead, proposal } = row;
    if (!project.kickoff_date || !lead || !proposal) continue;

    const kickoff = new Date(project.kickoff_date);
    const daysUntilKickoff = Math.floor((kickoff.getTime() - now.getTime()) / MS_PER_DAY);
    const empresa = lead.empresa ?? lead.name;
    const precioTotal = Math.round(proposal.precio_total / 100);
    const montoRestante = Math.round(precioTotal / 2);

    try {
      // Day -3: send reminder
      if (daysUntilKickoff === 3) {
        const tpl = secondPaymentReminderEmail({
          leadName: lead.name, empresa, montoRestante,
          kickoffDate: kickoff.toISOString().split('T')[0],
          proposalId: project.proposal_id,
          daysUntilKickoff: 3, urgent: false,
        });
        await resend.emails.send({ from: FROM_EMAIL, to: lead.email, subject: tpl.subject, html: tpl.html });
        result.reminders_sent++;
        console.log(`[second-payment] 3-day reminder sent for project ${project.id}`);
      }

      // Day 0: urgent — kickoff day
      if (daysUntilKickoff <= 0 && daysUntilKickoff > -2) {
        const tpl = secondPaymentReminderEmail({
          leadName: lead.name, empresa, montoRestante,
          kickoffDate: kickoff.toISOString().split('T')[0],
          proposalId: project.proposal_id,
          daysUntilKickoff: 0, urgent: true,
        });
        await resend.emails.send({ from: FROM_EMAIL, to: lead.email, subject: tpl.subject, html: tpl.html });

        // Notify Vic
        resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `⚠️ Pago pendiente día de kickoff — ${empresa}`,
          html: `<p><strong>${empresa}</strong> tiene kickoff hoy pero aún no ha pagado el 50% restante ($${montoRestante.toLocaleString('es-MX')} MXN). Contacta al cliente.</p>`,
        }).catch(() => {});
        result.urgent_sent++;
      }

      // Day -1 or later: mark overdue
      if (daysUntilKickoff < -1) {
        await db.update(projects)
          .set({ payment_status: 'payment_overdue', updated_at: now })
          .where(and(eq(projects.id, project.id), eq(projects.payment_status, 'half_paid')));
        result.overdue_marked++;
        console.log(`[second-payment] Marked overdue: project ${project.id}`);
      }
    } catch (err) {
      result.errors.push(`project ${project.id}: ${String(err)}`);
      console.error(`[second-payment] Error for project ${project.id}:`, err);
    }
  }

  return result;
}
