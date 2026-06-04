import { NextResponse } from 'next/server';
import { db } from '@/db';
import { proposals, leads, audits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateProposalPdf } from '@/lib/pdf/generate-proposal-pdf';
import type { ProposalModule } from '@/lib/schemas/proposal';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  const rows = await db
    .select({ proposal: proposals, lead: leads, audit: audits })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .leftJoin(audits, eq(proposals.audit_id, audits.id))
    .where(eq(proposals.id, uuid))
    .limit(1);

  if (!rows.length || !rows[0].lead) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { proposal, lead, audit } = rows[0];
  const modulos = proposal.modulos_seleccionados as ProposalModule[];
  const today = new Date().toISOString().split('T')[0];
  const expiresAt = proposal.sent_at
    ? new Date(new Date(proposal.sent_at).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : new Date(new Date(proposal.created_at!).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  try {
    const pdfBuffer = await generateProposalPdf({
      empresa: lead!.empresa ?? lead!.name,
      leadName: lead!.name,
      leadEmail: lead!.email,
      auditScore: audit?.score ?? 0,
      priorityAreas: (audit?.priority_areas as string[]) ?? [],
      auditSummary: audit?.summary ?? '',
      modulos,
      precioSubtotal: Math.round(proposal.precio_subtotal_tecnico / 100),
      pmFee: Math.round(proposal.pm_fee_20_pct / 100),
      precioTotal: Math.round(proposal.precio_total / 100),
      timelineDias: proposal.timeline_dias,
      fechaEntrega: proposal.fecha_entrega_estimada,
      fechaPropuesta: proposal.created_at?.toISOString().split('T')[0] ?? today,
      expiresAt,
    });

    const empresa = (lead!.empresa ?? lead!.name).replace(/[^a-zA-Z0-9]/g, '_');
    return new Response(pdfBuffer.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Propuesta_${empresa}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[pdf] Generation failed:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
