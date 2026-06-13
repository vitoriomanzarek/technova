import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { proposals, leads } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { clientRequestedChangesNotification } from '@/lib/emails/clientRequestedChangesNotification';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const moduleSchema = z.object({
  modulo_id: z.string(),
  nombre: z.string(),
  precio_total: z.number(),
});

const schema = z.object({
  removidos: z.array(moduleSchema).default([]),
  agregados: z.array(moduleSchema).default([]),
  notas: z.string().max(2000).default(''),
  precio_nuevo_total: z.number().positive(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', issues: parsed.error.issues }, { status: 400 });
  }

  const { removidos, agregados, notas, precio_nuevo_total } = parsed.data;

  const rows = await db
    .select({ proposal: proposals, lead: leads })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .where(eq(proposals.id, uuid))
    .limit(1);

  // SEC-4b: respuesta uniforme anti-enumeración; detalle solo en logs.
  if (!rows.length) {
    console.error(`[checkout/request-changes] Proposal not found: ${uuid}`);
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const { proposal, lead } = rows[0];
  const empresa = lead?.empresa ?? lead?.name ?? 'Cliente';
  const precioAnterior = Math.round(proposal.precio_total / 100);

  // Update proposal status
  await db.update(proposals).set({
    status: 'client_requesting_changes',
    updated_at: new Date(),
  }).where(eq(proposals.id, uuid));

  // Email Vic
  const tpl = clientRequestedChangesNotification({
    empresa,
    proposalId: uuid,
    removidos,
    agregados,
    notas,
    precioAnterior,
    precioNuevo: precio_nuevo_total,
  });
  resend.emails
    .send({ from: FROM_EMAIL, to: NOTIFY_EMAIL, subject: tpl.subject, html: tpl.html })
    .catch(e => console.error('[checkout/request-changes] email failed:', e));

  return NextResponse.json({
    success: true,
    message: 'Cambios enviados. Vic revisará y te responderá en 24 horas.',
  });
}
