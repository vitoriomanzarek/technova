import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { leads, audits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateProposal } from '@/lib/jobs/generate-proposal';

const schema = z.object({
  lead_id: z.number().int().positive(),
  audit_id: z.string().uuid('audit_id debe ser un UUID válido'),
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

  const { lead_id, audit_id } = parsed.data;

  const lead = await db.select().from(leads).where(eq(leads.id, lead_id)).limit(1);
  if (!lead.length) {
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  }

  const audit = await db.select().from(audits).where(eq(audits.id, audit_id)).limit(1);
  if (!audit.length) {
    return NextResponse.json({ success: false, error: 'Audit not found' }, { status: 404 });
  }

  if (audit[0].status !== 'completed') {
    return NextResponse.json(
      { success: false, error: `Audit not ready (status: ${audit[0].status})` },
      { status: 422 }
    );
  }

  // Fire and forget
  const jobId = crypto.randomUUID();
  generateProposal(lead_id, audit_id).catch(err =>
    console.error(`[proposal] background job ${jobId} failed:`, err)
  );

  return NextResponse.json({
    success: true,
    job_id: jobId,
    message: 'Propuesta en generación. Te notificaremos cuando esté lista.',
    estimated_time: '2-3 minutos',
  });
}
