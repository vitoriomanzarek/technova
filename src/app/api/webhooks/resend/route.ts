import { NextResponse } from 'next/server';
import { db } from '@/db';
import { emailEvents, leads } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  // Basic signature check: Resend sends SVIX headers. For MVP, accept if secret matches query param.
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (webhookSecret) {
    const providedSecret = new URL(request.url).searchParams.get('secret');
    if (providedSecret !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const event = body as { type: string; data: { email_id?: string; to?: string[]; created_at?: string } };
  const { type, data } = event;
  const resendEventId = data?.email_id;
  const now = new Date();

  if (!resendEventId) {
    return NextResponse.json({ received: true, note: 'No email_id' });
  }

  // Find the emailEvent by resend_event_id
  const rows = await db.select().from(emailEvents).where(eq(emailEvents.resend_event_id, resendEventId)).limit(1);
  const emailEvent = rows[0];

  if (!emailEvent) {
    // Event for an email we didn't log — ignore gracefully
    return NextResponse.json({ received: true, note: 'Event not tracked' });
  }

  switch (type) {
    case 'email.opened':
      if (!emailEvent.opened_at) {
        await db.update(emailEvents).set({ opened_at: now }).where(eq(emailEvents.id, emailEvent.id));
        // Update proposal_opened_at on lead if it's a proposal email
        if (emailEvent.email_type === 'proposal_sent') {
          await db.update(leads).set({ proposal_opened_at: now }).where(eq(leads.id, emailEvent.lead_id));
        }
      }
      break;

    case 'email.clicked':
      if (!emailEvent.clicked_at) {
        await db.update(emailEvents).set({ clicked_at: now }).where(eq(emailEvents.id, emailEvent.id));
      }
      break;

    case 'email.bounced':
      await db.update(emailEvents).set({ bounced_at: now }).where(eq(emailEvents.id, emailEvent.id));
      console.warn(`[resend-webhook] Email bounced for lead ${emailEvent.lead_id}`);
      break;

    case 'email.complained':
      await db.update(emailEvents).set({ complained_at: now }).where(eq(emailEvents.id, emailEvent.id));
      // Mark lead as unsubscribed
      await db.update(leads).set({ unsubscribed: 1 }).where(eq(leads.id, emailEvent.lead_id));
      console.warn(`[resend-webhook] Unsubscribe complaint from lead ${emailEvent.lead_id}`);
      break;

    default:
      console.log(`[resend-webhook] Unhandled event type: ${type}`);
  }

  return NextResponse.json({ received: true, type });
}
