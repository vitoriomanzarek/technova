import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auditWebsite } from '@/lib/jobs/audit-website';

const schema = z.object({
  lead_id: z.number().int().positive(),
  website_url: z.string().url('URL inválida'),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid input', issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { lead_id, website_url } = parsed.data;

  const lead = await db.select().from(leads).where(eq(leads.id, lead_id)).limit(1);
  if (!lead.length) {
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  }

  // Fire and forget — client does not wait for Puppeteer + Claude to finish
  const jobId = crypto.randomUUID();
  auditWebsite(lead_id, website_url).catch(err =>
    console.error(`[audit] background job ${jobId} failed:`, err)
  );

  return NextResponse.json({
    success: true,
    audit_job_id: jobId,
    message: 'Auditoría iniciada. Te notificaremos cuando esté lista.',
    estimated_time: '5-10 minutos',
  });
}
