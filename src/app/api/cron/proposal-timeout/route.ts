import { NextResponse } from 'next/server';
import { requireCronAuth } from '@/lib/cron-auth';
import { runProposalTimeoutJob } from '@/lib/jobs/proposal-timeout-job';

// Vercel Cron: run daily at 9 AM Mexico City time (UTC-6)
// Add to vercel.json: { "crons": [{ "path": "/api/cron/proposal-timeout", "schedule": "0 15 * * *" }] }

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // SEC-2 (2026-06-12): auth fail-closed centralizada en src/lib/cron-auth.ts
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await runProposalTimeoutJob();
    console.log('[cron/proposal-timeout] Done:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/proposal-timeout] Failed:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
