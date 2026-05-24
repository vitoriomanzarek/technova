import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const key = process.env.RESEND_API_KEY ?? '';
  const stripe = process.env.STRIPE_SECRET_KEY ?? '';
  const upstash = process.env.UPSTASH_REDIS_REST_TOKEN ?? '';
  return NextResponse.json({
    RESEND_API_KEY_prefix: key.slice(0, 15) + '...',
    RESEND_API_KEY_length: key.length,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? '(empty)',
    NOTIFY_EMAIL: process.env.NOTIFY_EMAIL ?? '(empty)',
    VERCEL_ENV: process.env.VERCEL_ENV ?? '(empty)',
    STRIPE_SK_prefix: stripe.slice(0, 15) + '...',
    STRIPE_SK_length: stripe.length,
    UPSTASH_token_prefix: upstash.slice(0, 10) + '...',
    UPSTASH_token_length: upstash.length,
    DATABASE_URL_prefix: (process.env.DATABASE_URL ?? '').slice(0, 40) + '...',
    NODE_ENV: process.env.NODE_ENV ?? '(empty)',
  });
}
