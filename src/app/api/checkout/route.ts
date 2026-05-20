import { NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { orders } from '@/db/schema';

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  amount_mxn: z.number().int().positive().max(1_000_000), // MXN enteros, cap defensivo
  description: z.string().min(1).max(500),
  plan: z.enum(['START', 'GROWTH', 'SCALE', 'custom']).optional(),
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, amount_mxn, description, plan } = parsed.data;
    const amount_cents = amount_mxn * 100;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: { name: description },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/cancel`,
      metadata: {
        plan: plan ?? 'custom',
      },
    });

    // Persiste la orden como "pending". El webhook la marca "paid" cuando llega checkout.session.completed.
    await db.insert(orders).values({
      stripe_session_id: session.id,
      customer_email: email,
      amount_cents,
      currency: 'mxn',
      description,
      status: 'pending',
    });

    return NextResponse.json({ success: true, url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout failed' },
      { status: 500 }
    );
  }
}
