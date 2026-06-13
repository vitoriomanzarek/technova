import { NextResponse } from 'next/server';
import { requireCronAuth } from '@/lib/cron-auth';
import { runEmailAutomationWorkflow } from '@/lib/workflows/email-automation';

export const dynamic = 'force-dynamic';

// Run every 4 hours via Vercel Cron:
// { "crons": [{ "path": "/api/cron/email-automation", "schedule": "0 6,10,14,18,22 * * *" }] }

export async function GET(request: Request) {
  // SEC-2 (2026-06-12): auth fail-closed centralizada en src/lib/cron-auth.ts
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await runEmailAutomationWorkflow();
    console.log('[cron/email-automation] Done:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/email-automation] Failed:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
