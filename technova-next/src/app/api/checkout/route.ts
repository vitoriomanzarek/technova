import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2023-10-16',
// });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId } = body;

    // Placeholder logic for Stripe Checkout Session
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: 'usd',
    //         product_data: {
    //           name: 'TechNova Service', // Should fetch from DB
    //         },
    //         unit_amount: 50000, // Amount in cents
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    // });

    // return NextResponse.json({ url: session.url });

    return NextResponse.json({ success: true, url: '/success' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Checkout failed' }, { status: 500 });
  }
}
