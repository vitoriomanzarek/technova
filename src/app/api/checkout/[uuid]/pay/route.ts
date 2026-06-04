import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { proposals, leads, orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

const schema = z.object({
  email: z.string().email(),
  total_mxn: z.number().int().positive().max(2_000_000),
  payment_percentage: z.literal(50).or(z.literal(100)).default(50),
  modulos_seleccionados: z.array(z.object({
    modulo_id: z.string(),
    nombre: z.string(),
    precio_total: z.number(),
    horas: z.number(),
    justificacion: z.string(),
    componentes: z.array(z.string()),
  })).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 400 });
  }

  const { email, total_mxn, payment_percentage, modulos_seleccionados } = parsed.data;

  // Load proposal
  const rows = await db
    .select({ proposal: proposals, lead: leads })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .where(eq(proposals.id, uuid))
    .limit(1);

  if (!rows.length) {
    return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
  }

  const { proposal, lead } = rows[0];
  const allowedStatuses = ['client_reviewing', 'approved', 'modified'];
  if (!allowedStatuses.includes(proposal.status)) {
    return NextResponse.json(
      { error: `Cannot pay for proposal with status "${proposal.status}"` },
      { status: 422 }
    );
  }

  const amountMxn = Math.round(total_mxn * (payment_percentage / 100));
  const amountCents = amountMxn * 100;
  const empresa = lead?.empresa ?? lead?.name ?? 'Cliente';
  const description = `TechNova · ${empresa} · ${payment_percentage}% inicial`;

  // If client customized modules, update the proposal
  if (modulos_seleccionados?.length) {
    const subtotalMxn = modulos_seleccionados.reduce((s, m) => s + m.precio_total, 0);
    const pmFeeMxn = Math.round(subtotalMxn * 0.20);
    const totalMxn = subtotalMxn + pmFeeMxn;
    await db.update(proposals).set({
      modulos_seleccionados,
      precio_subtotal_tecnico: Math.round(subtotalMxn * 100),
      pm_fee_20_pct: Math.round(pmFeeMxn * 100),
      precio_total: Math.round(totalMxn * 100),
      horas_totales: modulos_seleccionados.reduce((s, m) => s + m.horas, 0),
      updated_at: new Date(),
    }).where(eq(proposals.id, uuid));
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'mxn',
        product_data: { name: description },
        unit_amount: amountCents,
      },
      quantity: 1,
    }],
    success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/propuesta/${uuid}`,
    metadata: { proposal_id: uuid, payment_percentage: String(payment_percentage) },
  });

  // Persist pending order linked to proposal
  await db.insert(orders).values({
    stripe_session_id: session.id,
    customer_email: email,
    amount_cents: amountCents,
    currency: 'mxn',
    description,
    status: 'pending',
    proposal_id: uuid,
    payment_percentage,
  });

  return NextResponse.json({ success: true, url: session.url, sessionId: session.id });
}
