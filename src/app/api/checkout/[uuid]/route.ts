import { NextResponse } from 'next/server';
import { db } from '@/db';
import { proposals, leads } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  const rows = await db
    .select({ proposal: proposals, lead: leads })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .where(eq(proposals.id, uuid))
    .limit(1);

  // SEC-4b: respuesta uniforme para "no existe" y "no disponible" — distinguirlas
  // permitiría enumerar UUIDs válidos. El detalle va a logs, nunca al response.
  if (!rows.length) {
    console.error(`[checkout] Proposal not found: ${uuid}`);
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const { proposal, lead } = rows[0];

  // Only allow checkout for proposals that have been sent to client
  const allowedStatuses = ['client_reviewing', 'approved', 'modified', 'client_requesting_changes'];
  if (!allowedStatuses.includes(proposal.status)) {
    console.error(`[checkout] Proposal ${uuid} not ready for checkout (status: ${proposal.status})`);
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: proposal.id,
    status: proposal.status,
    modulos_seleccionados: proposal.modulos_seleccionados,
    precio_total: proposal.precio_total,
    timeline_dias: proposal.timeline_dias,
    fecha_entrega_estimada: proposal.fecha_entrega_estimada,
    lead: lead
      ? {
          name: lead.name,
          email: lead.email,
          empresa: lead.empresa,
          presupuesto_estimado: lead.presupuesto_estimado,
        }
      : null,
  });
}
