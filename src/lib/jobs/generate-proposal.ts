import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/db';
import { leads, audits, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateProposalPrompt } from '@/lib/prompts/generate-proposal.prompt';
import { proposalSchema, type ProposalJSON } from '@/lib/schemas/proposal';
import { proposalGeneratedNotification } from '@/lib/emails/proposalGeneratedNotification';
import type { AuditReport } from '@/lib/jobs/audit-website';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function parseClaudeJson(raw: string): ProposalJSON {
  // Strip optional ```json ... ``` wrapper Claude sometimes adds
  const clean = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(clean);
  const result = proposalSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Propuesta inválida: ${result.error.message}`);
  }
  return result.data;
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

export async function generateProposal(leadId: number, auditId: string): Promise<void> {
  console.log(`[proposal] Starting for lead ${leadId}, audit ${auditId}`);

  // Fetch lead
  const leadRows = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!leadRows.length) {
    console.error(`[proposal] Lead ${leadId} not found`);
    return;
  }
  const lead = leadRows[0];

  // Fetch audit
  const auditRows = await db.select().from(audits).where(eq(audits.id, auditId)).limit(1);
  if (!auditRows.length) {
    console.error(`[proposal] Audit ${auditId} not found`);
    return;
  }
  const audit = auditRows[0];

  if (audit.status !== 'completed') {
    console.error(`[proposal] Audit ${auditId} not completed (status: ${audit.status})`);
    return;
  }

  // Build Claude Haiku prompt
  const prompt = generateProposalPrompt({
    lead: {
      nombre: lead.name,
      empresa: lead.empresa,
      presupuesto_estimado: lead.presupuesto_estimado,
      timeline: lead.timeline,
      prioridades: lead.prioridades,
    },
    audit: audit as unknown as AuditReport,
  });

  // Call Claude Haiku — retry once on failure
  let proposalJson: ProposalJSON;
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });
      const raw = (message.content[0] as { type: string; text: string }).text;
      proposalJson = parseClaudeJson(raw);
      lastError = undefined;
      break;
    } catch (err) {
      lastError = err;
      console.error(`[proposal] Claude attempt ${attempt} failed for lead ${leadId}:`, err);
    }
  }

  if (lastError || !proposalJson!) {
    console.error(`[proposal] All Claude attempts failed for lead ${leadId}. Skipping.`);
    return;
  }

  // Convert MXN → cents for storage
  const subtotalCents = Math.round(proposalJson.precio_subtotal_tecnico * 100);
  const pmFeeCents = Math.round(proposalJson.pm_fee_20_pct * 100);
  const totalCents = Math.round(proposalJson.precio_total * 100);
  const fechaEntrega = addDays(proposalJson.timeline_dias);

  // Persist proposal
  const [inserted] = await db.insert(proposals).values({
    lead_id: leadId,
    audit_id: auditId,
    status: 'pending_vic_review',
    modulos_seleccionados: proposalJson.modulos_seleccionados,
    precio_subtotal_tecnico: subtotalCents,
    pm_fee_20_pct: pmFeeCents,
    precio_total: totalCents,
    horas_totales: proposalJson.horas_totales,
    timeline_dias: proposalJson.timeline_dias,
    fecha_entrega_estimada: fechaEntrega,
    justificacion_general: proposalJson.justificacion_general,
    observaciones: proposalJson.observaciones ?? null,
  }).returning({ id: proposals.id });

  console.log(`[proposal] Saved proposal ${inserted.id} for lead ${leadId}. Total: $${proposalJson.precio_total.toLocaleString('es-MX')} MXN`);

  // Notify Vic — fire and forget
  const tpl = proposalGeneratedNotification({
    leadName: lead.name,
    empresa: lead.empresa ?? lead.name,
    presupuestoEstimado: lead.presupuesto_estimado,
    precioTotal: proposalJson.precio_total,
    modulosCount: proposalJson.modulos_seleccionados.length,
    timelineDias: proposalJson.timeline_dias,
    proposalId: inserted.id,
  });

  resend.emails
    .send({ from: FROM_EMAIL, to: NOTIFY_EMAIL, subject: tpl.subject, html: tpl.html })
    .catch(e => console.error('[proposal] Notify email failed:', e));
}
