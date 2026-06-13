import { NextResponse } from 'next/server';
import { requireCronAuth } from '@/lib/cron-auth';
import { runSecondPaymentJob } from '@/lib/jobs/second-payment-job';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // SEC-2 (2026-06-12): auth fail-closed centralizada en src/lib/cron-auth.ts
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await runSecondPaymentJob();
    console.log('[cron/second-payment-reminder] Done:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/second-payment-reminder] Failed:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
