import { NextResponse } from 'next/server';
import { runSecondPaymentJob } from '@/lib/jobs/second-payment-job';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET ?? process.env.ADMIN_DASHBOARD_TOKEN;
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
    ?? new URL(request.url).searchParams.get('token');

  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runSecondPaymentJob();
    console.log('[cron/second-payment-reminder] Done:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/second-payment-reminder] Failed:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
