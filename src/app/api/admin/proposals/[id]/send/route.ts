import { NextResponse } from 'next/server';
import { db } from '@/db';
import { proposals, leads, audits, proposalTracking } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { proposalSentToClient } from '@/lib/emails/proposalSentToClient';
import { Resend } from 'resend';
import type { ProposalModule } from '@/lib/schemas/proposal';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const now = new Date();

  const rows = await db
    .select({ proposal: proposals, lead: leads, audit: audits })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .leftJoin(audits, eq(proposals.audit_id, audits.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!rows.length) {
    return NextResponse.json({ success: false, error: 'Proposal not found' }, { status: 404 });
  }

  const { proposal, lead, audit } = rows[0];

  if (!lead) {
    return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
  }

  if (!['approved', 'modified'].includes(proposal.status)) {
    return NextResponse.json(
      { success: false, error: `Cannot send proposal with status "${proposal.status}". Must be approved or modified.` },
      { status: 422 }
    );
  }

  const modulos = proposal.modulos_seleccionados as ProposalModule[];
  const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const tpl = proposalSentToClient({
    leadName: lead.name,
    empresa: lead.empresa ?? lead.name,
    leadEmail: lead.email,
    auditScore: audit?.score ?? 0,
    priorityAreas: (audit?.priority_areas as string[]) ?? [],
    modulos,
    precioSubtotal: Math.round(proposal.precio_subtotal_tecnico / 100),
    pmFee: Math.round(proposal.pm_fee_20_pct / 100),
    precioTotal: Math.round(proposal.precio_total / 100),
    timelineDias: proposal.timeline_dias,
    proposalId: proposal.id,
    expiresAt,
  });

  const emailResult = await resend.emails.send({
    from: FROM_EMAIL,
    to: lead.email,
    subject: tpl.subject,
    html: tpl.html,
  });

  if (emailResult.error) {
    console.error('[proposal/send] Resend error:', emailResult.error);
    return NextResponse.json({ success: false, error: 'Email delivery failed' }, { status: 502 });
  }

  // Update proposal status + sent_at
  await db.update(proposals).set({
    status: 'client_reviewing',
    sent_at: now,
    updated_at: now,
  }).where(eq(proposals.id, id));

  // Create tracking entry
  await db.insert(proposalTracking).values({
    proposal_id: id,
    sent_at: now,
    status: 'sent',
  });

  return NextResponse.json({
    success: true,
    email_sent: true,
    proposal_link: `${BASE_URL}/propuesta/${id}`,
    message: `Propuesta enviada a ${lead.email}`,
  });
}
