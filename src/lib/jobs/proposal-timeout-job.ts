import { db } from '@/db';
import { proposals, proposalTracking, leads } from '@/db/schema';
import { eq, and, isNull, lt } from 'drizzle-orm';
import { Resend } from 'resend';
import { proposalReminderEmail } from '@/lib/emails/proposalReminderEmail';
import { proposalExpiredEmail } from '@/lib/emails/proposalExpiredEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface TimeoutJobResult {
  reminders_sent: number;
  expired: number;
  errors: string[];
}

export async function runProposalTimeoutJob(): Promise<TimeoutJobResult> {
  const result: TimeoutJobResult = { reminders_sent: 0, expired: 0, errors: [] };
  const now = new Date();

  // Get all proposals currently under client review with a sent_at date
  const activeRows = await db
    .select({ proposal: proposals, lead: leads, tracking: proposalTracking })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .leftJoin(proposalTracking, eq(proposalTracking.proposal_id, proposals.id))
    .where(eq(proposals.status, 'client_reviewing'));

  for (const row of activeRows) {
    const { proposal, lead, tracking } = row;
    if (!tracking?.sent_at || !lead) continue;

    const sentAt = new Date(tracking.sent_at);
    const daysSinceSent = Math.floor((now.getTime() - sentAt.getTime()) / MS_PER_DAY);
    const expiresAt = new Date(sentAt.getTime() + 14 * MS_PER_DAY).toISOString().split('T')[0];
    const empresa = lead.empresa ?? lead.name;
    const precioTotal = Math.round(proposal.precio_total / 100);

    try {
      // Day 10+: send reminder (only once)
      if (daysSinceSent >= 10 && daysSinceSent < 14 && !tracking.reminder_sent_at) {
        const tpl = proposalReminderEmail({
          leadName: lead.name,
          empresa,
          precioTotal,
          proposalId: proposal.id,
          expiresAt,
        });
        await resend.emails.send({ from: FROM_EMAIL, to: lead.email, subject: tpl.subject, html: tpl.html });
        await db.update(proposalTracking)
          .set({ reminder_sent_at: now, status: 'reminder_sent' })
          .where(eq(proposalTracking.id, tracking.id));
        result.reminders_sent++;
        console.log(`[timeout] Reminder sent for proposal ${proposal.id} (day ${daysSinceSent})`);
      }

      // Day 14+: expire
      if (daysSinceSent >= 14 && !tracking.expired_at) {
        const tpl = proposalExpiredEmail({ leadName: lead.name, empresa, precioTotal });
        await resend.emails.send({ from: FROM_EMAIL, to: lead.email, subject: tpl.subject, html: tpl.html });

        await db.update(proposals)
          .set({ status: 'expired', updated_at: now })
          .where(eq(proposals.id, proposal.id));
        await db.update(proposalTracking)
          .set({ expired_at: now, status: 'expired' })
          .where(eq(proposalTracking.id, tracking.id));

        // Notify Vic
        resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `⏰ Propuesta vencida: ${empresa}`,
          html: `<p>La propuesta para <strong>${empresa}</strong> ($${precioTotal.toLocaleString('es-MX')} MXN) venció sin respuesta del cliente.</p><p>¿Quieres renovarla?</p>`,
        }).catch(() => {});

        result.expired++;
        console.log(`[timeout] Proposal ${proposal.id} expired (day ${daysSinceSent})`);
      }
    } catch (err) {
      result.errors.push(`proposal ${proposal.id}: ${String(err)}`);
      console.error(`[timeout] Error processing proposal ${proposal.id}:`, err);
    }
  }

  return result;
}
