import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { proposals, leads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { proposalApprovedNotification } from '@/lib/emails/proposalApprovedNotification';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const schema = z.object({
  notas_internas: z.string().max(2000).optional(),
  aprobado_por: z.string().max(255).default('Vic'),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid input', issues: parsed.error.issues }, { status: 400 });
  }

  const existing = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  if (!existing.length) {
    return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
  }

  const proposal = existing[0];
  if (proposal.status === 'rejected') {
    return NextResponse.json({ success: false, error: 'No se puede aprobar una propuesta rechazada' }, { status: 422 });
  }

  await db.update(proposals).set({
    status: 'approved',
    aprobado_por: parsed.data.aprobado_por,
    aprobado_at: new Date(),
    notas_internas_vic: parsed.data.notas_internas ?? proposal.notas_internas_vic,
    updated_at: new Date(),
  }).where(eq(proposals.id, id));

  // Notify Vic — fire and forget
  const leadRows = await db.select().from(leads).where(eq(leads.id, proposal.lead_id)).limit(1);
  const lead = leadRows[0];

  if (lead) {
    const tpl = proposalApprovedNotification({
      empresa: lead.empresa ?? lead.name,
      leadName: lead.name,
      precioTotal: Math.round(proposal.precio_total / 100),
      timelineDias: proposal.timeline_dias,
      proposalId: id,
      aprobadoPor: parsed.data.aprobado_por,
      notas: parsed.data.notas_internas,
    });
    resend.emails
      .send({ from: FROM_EMAIL, to: NOTIFY_EMAIL, subject: tpl.subject, html: tpl.html })
      .catch(e => console.error('[proposal/approve] email failed:', e));
  }

  return NextResponse.json({ success: true, status: 'approved' });
}
