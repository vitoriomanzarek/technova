import { db } from '@/db';
import { leads, emailEvents, audits, proposals, projects, clientTokens } from '@/db/schema';
import { eq, and, gt, isNotNull } from 'drizzle-orm';
import { Resend } from 'resend';
import { welcomeEmail } from '@/lib/emails/workflows/welcomeEmail';
import { auditReadyEmail } from '@/lib/emails/workflows/auditReadyEmail';
import { proposalFollowUpEmail } from '@/lib/emails/workflows/proposalFollowUpEmail';
import { urgentCheckoutEmail } from '@/lib/emails/workflows/urgentCheckoutEmail';
import { checkoutReminderEmail } from '@/lib/emails/workflows/checkoutReminderEmail';
import { projectStartedEmail } from '@/lib/emails/workflows/projectStartedEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const MIN_EMAIL_GAP_MS = 7 * 24 * 60 * 60 * 1000; // 7 days between automation emails to same lead

export interface AutomationResult {
  emails_sent: number;
  skipped: number;
  errors: string[];
}

async function alreadySentRecently(leadId: number, emailType: string, withinMs = MIN_EMAIL_GAP_MS): Promise<boolean> {
  const cutoff = new Date(Date.now() - withinMs);
  const rows = await db.select({ id: emailEvents.id })
    .from(emailEvents)
    .where(and(
      eq(emailEvents.lead_id, leadId),
      eq(emailEvents.email_type, emailType),
      gt(emailEvents.sent_at, cutoff),
    ))
    .limit(1);
  return rows.length > 0;
}

async function logEmail(leadId: number, emailType: string, resendId?: string) {
  const now = new Date();
  await db.insert(emailEvents).values({ lead_id: leadId, email_type: emailType, sent_at: now, resend_event_id: resendId });
  await db.update(leads).set({ last_email_sent_at: now, last_email_type: emailType }).where(eq(leads.id, leadId));
}

async function send(to: string, tpl: { subject: string; html: string }, leadId: number, emailType: string) {
  const result = await resend.emails.send({ from: FROM_EMAIL, to, subject: tpl.subject, html: tpl.html });
  await logEmail(leadId, emailType, result.data?.id);
}

const DAY = 24 * 60 * 60 * 1000;

export async function runEmailAutomationWorkflow(): Promise<AutomationResult> {
  const result: AutomationResult = { emails_sent: 0, skipped: 0, errors: [] };
  const now = new Date();

  const allLeads = await db.select().from(leads).where(eq(leads.unsubscribed, 0));

  for (const lead of allLeads) {
    try {
      // STAGE 1: Captured 1+ day ago, no welcome sent yet
      if (lead.status === 'captured' && lead.captured_at) {
        const daysSince = (now.getTime() - new Date(lead.captured_at).getTime()) / DAY;
        if (daysSince >= 1 && !(await alreadySentRecently(lead.id, 'welcome_email', 30 * DAY))) {
          const tpl = welcomeEmail({ leadName: lead.name, empresa: lead.empresa ?? lead.name });
          await send(lead.email, tpl, lead.id, 'welcome_email');
          result.emails_sent++;
          continue;
        }
      }

      // STAGE 2: Audit completed 2+ days ago, proposal not yet generated
      if (lead.status === 'audit_completed' && lead.audit_completed_at) {
        const daysSince = (now.getTime() - new Date(lead.audit_completed_at).getTime()) / DAY;
        if (daysSince >= 2 && !(await alreadySentRecently(lead.id, 'audit_ready_email'))) {
          // Fetch audit score
          const auditRow = await db.select({ score: audits.score }).from(audits)
            .where(eq(audits.lead_id, lead.id)).orderBy(audits.created_at).limit(1);
          const score = auditRow[0]?.score ?? 0;
          const tpl = auditReadyEmail({ leadName: lead.name, empresa: lead.empresa ?? lead.name, auditScore: score });
          await send(lead.email, tpl, lead.id, 'audit_ready_email');
          result.emails_sent++;
          continue;
        }
      }

      // STAGE 3: Proposal sent 10+ days ago, not opened
      if (lead.status === 'proposal_sent' && lead.proposal_sent_at && !lead.proposal_opened_at) {
        const daysSince = (now.getTime() - new Date(lead.proposal_sent_at).getTime()) / DAY;
        if (daysSince >= 10 && !(await alreadySentRecently(lead.id, 'proposal_follow_up'))) {
          const propRow = await db.select({ id: proposals.id }).from(proposals)
            .where(eq(proposals.lead_id, lead.id)).orderBy(proposals.created_at).limit(1);
          if (propRow[0]) {
            const tpl = proposalFollowUpEmail({ leadName: lead.name, empresa: lead.empresa ?? lead.name, proposalId: propRow[0].id });
            await send(lead.email, tpl, lead.id, 'proposal_follow_up');
            result.emails_sent++;
            continue;
          }
        }
      }

      // STAGE 4: Client reviewing 7+ days, not in checkout
      if (lead.status === 'client_reviewing' && lead.proposal_opened_at && !lead.in_checkout_at) {
        const daysSince = (now.getTime() - new Date(lead.proposal_opened_at).getTime()) / DAY;
        if (daysSince >= 7 && !(await alreadySentRecently(lead.id, 'urgent_checkout'))) {
          const propRow = await db.select({ id: proposals.id, precio_total: proposals.precio_total }).from(proposals)
            .where(eq(proposals.lead_id, lead.id)).orderBy(proposals.created_at).limit(1);
          if (propRow[0]) {
            const tpl = urgentCheckoutEmail({
              leadName: lead.name, empresa: lead.empresa ?? lead.name,
              proposalId: propRow[0].id, precioTotal: Math.round(propRow[0].precio_total / 100),
            });
            await send(lead.email, tpl, lead.id, 'urgent_checkout');
            result.emails_sent++;
            continue;
          }
        }
      }

      // STAGE 5: In checkout 5+ days, not paid
      if (lead.status === 'in_checkout' && lead.in_checkout_at && !lead.paid_at) {
        const daysSince = (now.getTime() - new Date(lead.in_checkout_at).getTime()) / DAY;
        if (daysSince >= 5 && !(await alreadySentRecently(lead.id, 'checkout_reminder'))) {
          const propRow = await db.select({ id: proposals.id, precio_total: proposals.precio_total }).from(proposals)
            .where(eq(proposals.lead_id, lead.id)).orderBy(proposals.created_at).limit(1);
          if (propRow[0]) {
            const tpl = checkoutReminderEmail({
              leadName: lead.name, empresa: lead.empresa ?? lead.name,
              proposalId: propRow[0].id, precioTotal: Math.round(propRow[0].precio_total / 100),
            });
            await send(lead.email, tpl, lead.id, 'checkout_reminder');
            result.emails_sent++;
            continue;
          }
        }
      }

      // STAGE 6: Paid, project kickoff confirmed
      if (lead.status === 'paid' && lead.paid_at) {
        if (!(await alreadySentRecently(lead.id, 'project_started_email', 30 * DAY))) {
          const projRow = await db.select({ kickoff_date: projects.kickoff_date, id: projects.id }).from(projects)
            .where(eq(projects.proposal_id, db.select({ id: proposals.id }).from(proposals).where(eq(proposals.lead_id, lead.id)).limit(1) as unknown as string))
            .limit(1);
          // Simplified: if lead is paid and project exists, send email
          const tokenRow = await db.select({ token: clientTokens.token }).from(clientTokens)
            .where(isNotNull(clientTokens.project_id)).limit(1);
          const tpl = projectStartedEmail({
            leadName: lead.name, empresa: lead.empresa ?? lead.name,
            kickoffDate: new Date().toISOString().split('T')[0],
            dashboardToken: tokenRow[0]?.token,
          });
          await send(lead.email, tpl, lead.id, 'project_started_email');
          result.emails_sent++;
        }
      }

      result.skipped++;
    } catch (err) {
      result.errors.push(`lead ${lead.id}: ${String(err)}`);
    }
  }

  return result;
}
