import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { orders, proposals, leads } from '@/db/schema';
import { paymentConfirmedEmail } from '@/lib/emails/paymentConfirmedEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function POST(request: Request) {
  // Stripe verifica HMAC del raw body — NO usar request.json() (alteraría el payload).
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotency note: Stripe puede reentregar el mismo evento. Para MVP confiamos en
  // que UPDATEs basados en stripe_session_id son idempotentes. Si crece el dominio,
  // añadir tabla processed_events(event_id PK).

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const piId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

        await db.update(orders)
          .set({ status: 'paid', paid_at: new Date(), stripe_payment_intent_id: piId })
          .where(eq(orders.stripe_session_id, session.id));

        console.log(`[stripe] Order marked paid: session=${session.id} pi=${piId}`);

        // B.4.5 — if linked to a proposal, update proposal status and notify
        const proposalId = session.metadata?.proposal_id;
        const paymentPct = Number(session.metadata?.payment_percentage ?? 50);
        if (proposalId) {
          const propRows = await db
            .select({ proposal: proposals, lead: leads })
            .from(proposals)
            .leftJoin(leads, eq(proposals.lead_id, leads.id))
            .where(eq(proposals.id, proposalId))
            .limit(1);

          if (propRows.length) {
            const { proposal, lead } = propRows[0];
            await db.update(proposals)
              .set({ status: 'client_confirmed', updated_at: new Date() })
              .where(eq(proposals.id, proposalId));

            // Email to client
            if (lead) {
              const montoPagado = Math.round((session.amount_total ?? 0) / 100);
              const tpl = paymentConfirmedEmail({
                leadName: lead.name,
                empresa: lead.empresa ?? lead.name,
                montoPagado,
                precioTotal: Math.round(proposal.precio_total / 100),
                timelineDias: proposal.timeline_dias,
                fechaEntrega: proposal.fecha_entrega_estimada,
                proposalId,
              });
              resend.emails
                .send({ from: FROM_EMAIL, to: lead.email, subject: tpl.subject, html: tpl.html })
                .catch(e => console.error('[stripe/webhook] client email failed:', e));

              // Notify Vic
              resend.emails.send({
                from: FROM_EMAIL,
                to: NOTIFY_EMAIL,
                subject: `💰 Nuevo pago recibido — ${lead.empresa ?? lead.name} ($${montoPagado.toLocaleString('es-MX')} MXN)`,
                html: `<p><strong>${lead.empresa ?? lead.name}</strong> pagó $${montoPagado.toLocaleString('es-MX')} MXN (${paymentPct}% inicial). Propuesta ID: ${proposalId}</p><p>Contacta al cliente para el kickoff call.</p>`,
              }).catch(() => {});
            }
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await db.update(orders)
          .set({ status: 'expired' })
          .where(eq(orders.stripe_session_id, session.id));
        break;
      }

      case 'payment_intent.succeeded': {
        // Redundante con checkout.session.completed para flujo Checkout. Log para debugging.
        const pi = event.data.object as Stripe.PaymentIntent;
        console.log(`[stripe] PaymentIntent succeeded: ${pi.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn(`[stripe] PaymentIntent failed: ${pi.id} reason=${pi.last_payment_error?.message ?? 'unknown'}`);
        // TODO: notificar al cliente por email + ofrecer retry.
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const piId = typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id;
        if (piId) {
          await db.update(orders)
            .set({ status: 'refunded' })
            .where(eq(orders.stripe_payment_intent_id, piId));
        }
        console.log(`[stripe] Refund processed for charge=${charge.id}`);
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        const chargeId = typeof dispute.charge === 'string' ? dispute.charge : dispute.charge.id;
        const charge = await stripe.charges.retrieve(chargeId);
        const piId = typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id;
        if (piId) {
          await db.update(orders)
            .set({ status: 'disputed' })
            .where(eq(orders.stripe_payment_intent_id, piId));
        }
        console.warn(`[stripe] Dispute created for charge=${chargeId} amount=${dispute.amount}`);
        // TODO: alertar al equipo (Slack/email) — Stripe da ~7 días para responder.
        break;
      }

      // --- Suscripciones (suscritos para evitar volver a Stripe dashboard, sin handler todavía) ---
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'invoice.paid':
      case 'invoice.payment_failed':
        console.log(`[stripe] Subscription event received (no handler yet): ${event.type}`);
        // TODO: implementar cuando lancemos plan SCALE con suscripción mensual.
        break;

      default:
        console.log(`[stripe] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook event:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
