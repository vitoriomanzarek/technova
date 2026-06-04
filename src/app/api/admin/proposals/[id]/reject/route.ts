import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';

const REJECT_REASONS = [
  'presupuesto_bajo',
  'scope_poco_claro',
  'no_viable',
  'lead_no_califica',
  'otro',
] as const;

const schema = z.object({
  razon: z.enum(REJECT_REASONS),
  notas_internas_vic: z.string().max(2000).optional(),
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

  const notasConRazon = `[RECHAZADA: ${parsed.data.razon}] ${parsed.data.notas_internas_vic ?? ''}`.trim();

  await db.update(proposals).set({
    status: 'rejected',
    notas_internas_vic: notasConRazon,
    updated_at: new Date(),
  }).where(eq(proposals.id, id));

  return NextResponse.json({ success: true, status: 'rejected' });
}
