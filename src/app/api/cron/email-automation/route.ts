import { NextResponse } from 'next/server';
import { runEmailAutomationWorkflow } from '@/lib/workflows/email-automation';

export const dynamic = 'force-dynamic';

// Run every 4 hours via Vercel Cron:
// { "crons": [{ "path": "/api/cron/email-automation", "schedule": "0 6,10,14,18,22 * * *" }] }

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET ?? process.env.ADMIN_DASHBOARD_TOKEN;
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
    ?? new URL(request.url).searchParams.get('token');

  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runEmailAutomationWorkflow();
    console.log('[cron/email-automation] Done:', result);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('[cron/email-automation] Failed:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
