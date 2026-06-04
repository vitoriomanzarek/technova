import { NextResponse } from 'next/server';
import { runProposalTimeoutJob } from '@/lib/jobs/proposal-timeout-job';

// Vercel Cron: run daily at 9 AM Mexico City time (UTC-6)
// Add to vercel.json: { "crons": [{ "path": "/api/cron/proposal-timeout", "schedule": "0 15 * * *" }] }

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Protect with cron secret or admin token
  const cronSecret = process.env.CRON_SECRET ?? process.env.ADMIN_DASHBOARD_TOKEN;
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') ?? new URL(request.url).searchParams.get('token');

  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runProposalTimeoutJob();
    console.log('[cron/proposal-timeout] Done:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/proposal-timeout] Failed:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
