import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const key = process.env.RESEND_API_KEY ?? '';
  return NextResponse.json({
    RESEND_API_KEY_prefix: key.slice(0, 10) + '...',
    RESEND_API_KEY_length: key.length,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? '(empty)',
    NOTIFY_EMAIL: process.env.NOTIFY_EMAIL ?? '(empty)',
    VERCEL_ENV: process.env.VERCEL_ENV ?? '(empty)',
  });
}
