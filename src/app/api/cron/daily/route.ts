import { NextResponse } from 'next/server';
import { runProposalTimeoutJob } from '@/lib/jobs/proposal-timeout-job';
import { runSecondPaymentJob } from '@/lib/jobs/second-payment-job';
import { runDailyDigest } from '@/lib/jobs/daily-digest';

/**
 * Cron diario orquestador — 7am CDMX (13:00 UTC), ver vercel.json.
 *
 * Orden: primero los jobs de negocio (sus resultados van al digest),
 * después el Morning Brief que los reporta junto con salud + insights.
 * Cada job va en try/catch propio: si uno falla, el digest sale igual
 * y reporta el fallo.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET ?? process.env.ADMIN_DASHBOARD_TOKEN;
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
    ?? new URL(request.url).searchParams.get('token');

  if (cronSecret && token !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobResults: Record<string, unknown> = {};

  try {
    jobResults.proposalTimeout = await runProposalTimeoutJob();
  } catch (err) {
    console.error('[cron/daily] proposal-timeout failed:', err);
    jobResults.proposalTimeout = { error: String(err) };
  }

  try {
    jobResults.secondPaymentReminder = await runSecondPaymentJob();
  } catch (err) {
    console.error('[cron/daily] second-payment failed:', err);
    jobResults.secondPaymentReminder = { error: String(err) };
  }

  try {
    const digest = await runDailyDigest(jobResults);
    console.log('[cron/daily] Digest done. Email sent:', digest.emailSent);
    return NextResponse.json({
      success: true,
      emailSent: digest.emailSent,
      salud: digest.insights?.salud ?? 'sin-insights',
      systems: digest.systems,
      jobResults,
    });
  } catch (err) {
    console.error('[cron/daily] Digest failed:', err);
    return NextResponse.json({ success: false, error: String(err), jobResults }, { status: 500 });
  }
}
