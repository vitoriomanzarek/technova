import { NextResponse } from 'next/server';
import { db } from '@/db';
import { proposals, leads, audits } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rows = await db
    .select({
      proposal: proposals,
      lead: leads,
      audit: audits,
    })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .leftJoin(audits, eq(proposals.audit_id, audits.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!rows.length) {
    return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
  }

  const { proposal, lead, audit } = rows[0];

  return NextResponse.json({
    id: proposal.id,
    status: proposal.status,
    modulos_seleccionados: proposal.modulos_seleccionados,
    precio_subtotal_tecnico: proposal.precio_subtotal_tecnico,
    pm_fee_20_pct: proposal.pm_fee_20_pct,
    precio_total: proposal.precio_total,
    horas_totales: proposal.horas_totales,
    timeline_dias: proposal.timeline_dias,
    fecha_entrega_estimada: proposal.fecha_entrega_estimada,
    justificacion_general: proposal.justificacion_general,
    observaciones: proposal.observaciones,
    aprobado_por: proposal.aprobado_por,
    aprobado_at: proposal.aprobado_at,
    notas_internas_vic: proposal.notas_internas_vic,
    created_at: proposal.created_at,
    lead: lead
      ? {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          empresa: lead.empresa,
          presupuesto_estimado: lead.presupuesto_estimado,
          timeline: lead.timeline,
          prioridades: lead.prioridades,
          website_url: lead.website_url,
        }
      : null,
    audit: audit
      ? {
          id: audit.id,
          score: audit.score,
          summary: audit.summary,
          priority_areas: audit.priority_areas,
          findings: audit.findings,
          site_url: audit.site_url,
        }
      : null,
  });
}
