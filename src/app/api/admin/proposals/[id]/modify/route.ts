import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { proposalModuleSchema } from '@/lib/schemas/proposal';

const schema = z.object({
  modulos_seleccionados: z.array(proposalModuleSchema).min(1).max(8),
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

  if (existing[0].status === 'rejected') {
    return NextResponse.json({ success: false, error: 'No se puede modificar una propuesta rechazada' }, { status: 422 });
  }

  const modulos = parsed.data.modulos_seleccionados;
  const subtotalMXN = modulos.reduce((sum, m) => sum + m.precio_total, 0);
  const pmFeeMXN = Math.round(subtotalMXN * 0.20);
  const totalMXN = subtotalMXN + pmFeeMXN;
  const horasTotales = modulos.reduce((sum, m) => sum + m.horas, 0);

  // Convert to cents for DB
  const subtotalCents = Math.round(subtotalMXN * 100);
  const pmFeeCents = Math.round(pmFeeMXN * 100);
  const totalCents = Math.round(totalMXN * 100);

  await db.update(proposals).set({
    status: 'modified',
    modulos_seleccionados: modulos,
    precio_subtotal_tecnico: subtotalCents,
    pm_fee_20_pct: pmFeeCents,
    precio_total: totalCents,
    horas_totales: horasTotales,
    notas_internas_vic: parsed.data.notas_internas_vic ?? existing[0].notas_internas_vic,
    updated_at: new Date(),
  }).where(eq(proposals.id, id));

  return NextResponse.json({
    success: true,
    status: 'modified',
    precio_total: totalCents,
    horas_totales: horasTotales,
  });
}
