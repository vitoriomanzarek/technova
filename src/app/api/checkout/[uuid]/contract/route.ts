import { NextResponse } from 'next/server';
import { db } from '@/db';
import { proposals, leads, audits, contracts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateContractPdf } from '@/lib/contracts/generate-contract-pdf';
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

  // SEC-4b: respuesta uniforme anti-enumeración; detalle solo en logs.
  if (!rows.length || !rows[0].lead) {
    console.error(`[checkout/contract] Proposal or lead not found: ${uuid}`);
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  const { proposal, lead } = rows[0];
  const modulos = proposal.modulos_seleccionados as ProposalModule[];
  const today = new Date().toISOString().split('T')[0];
  const fechaFin = proposal.fecha_entrega_estimada;
  // Kickoff is ~3 business days from today
  const kickoffDate = new Date();
  kickoffDate.setDate(kickoffDate.getDate() + 3);
  const fechaInicio = kickoffDate.toISOString().split('T')[0];

  // Record contract generation (idempotent — just log, don't fail if already exists)
  db.insert(contracts).values({
    proposal_id: uuid,
    generated_at: new Date(),
    signed_by: lead!.email,
  }).catch(() => {});

  try {
    const pdfBuffer = await generateContractPdf({
      empresa: lead!.empresa ?? lead!.name,
      leadName: lead!.name,
      leadEmail: lead!.email,
      modulos,
      precioSubtotal: Math.round(proposal.precio_subtotal_tecnico / 100),
      pmFee: Math.round(proposal.pm_fee_20_pct / 100),
      precioTotal: Math.round(proposal.precio_total / 100),
      timelineDias: proposal.timeline_dias,
      fechaInicio,
      fechaFin,
      proposalId: uuid,
      generatedAt: today,
    });

    const empresa = (lead!.empresa ?? lead!.name).replace(/[^a-zA-Z0-9]/g, '_');
    return new Response(pdfBuffer.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Contrato_TechNova_${empresa}.pdf"`,
      },
    });
  } catch (err) {
    console.error('[contract/pdf] Generation failed:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}
