import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads, audits, proposals, emailEvents } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

const ALL_STATUSES = [
  'new', 'captured', 'audit_completed', 'proposal_generated',
  'proposal_sent', 'client_reviewing', 'in_checkout', 'paid',
  'project_active', 'completed',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  // Fetch all leads with basic info
  const rows = await db
    .select({
      lead: leads,
      auditScore: audits.score,
      proposalStatus: proposals.status,
      proposalId: proposals.id,
      proposalTotal: proposals.precio_total,
    })
    .from(leads)
    .leftJoin(audits, eq(audits.lead_id, leads.id))
    .leftJoin(proposals, eq(proposals.lead_id, leads.id))
    .orderBy(desc(leads.created_at))
    .limit(200);

  // Filter
  let filtered = rows;
  if (statusFilter) filtered = filtered.filter(r => r.lead.status === statusFilter);
  if (search) filtered = filtered.filter(r =>
    r.lead.name.toLowerCase().includes(search) ||
    r.lead.email.toLowerCase().includes(search) ||
    (r.lead.empresa ?? '').toLowerCase().includes(search)
  );

  // Status counts
  const byCounts: Record<string, number> = {};
  for (const s of ALL_STATUSES) byCounts[s] = 0;
  for (const r of rows) {
    const s = r.lead.status;
    byCounts[s] = (byCounts[s] ?? 0) + 1;
  }

  // Recent email events for activity timeline (last 24h)
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentEvents = await db.select({
    event: emailEvents,
    leadName: leads.name,
    leadEmail: leads.email,
    empresa: leads.empresa,
  })
    .from(emailEvents)
    .leftJoin(leads, eq(emailEvents.lead_id, leads.id))
    .where(sql`${emailEvents.sent_at} > ${cutoff}`)
    .orderBy(desc(emailEvents.sent_at))
    .limit(20);

  return NextResponse.json({
    leads: filtered.map(r => ({
      id: r.lead.id,
      name: r.lead.name,
      email: r.lead.email,
      empresa: r.lead.empresa,
      status: r.lead.status,
      lead_score: r.lead.lead_score,
      created_at: r.lead.created_at,
      captured_at: r.lead.captured_at,
      audit_completed_at: r.lead.audit_completed_at,
      proposal_sent_at: r.lead.proposal_sent_at,
      paid_at: r.lead.paid_at,
      last_email_type: r.lead.last_email_type,
      last_email_sent_at: r.lead.last_email_sent_at,
      audit_score: r.auditScore ?? null,
      proposal_id: r.proposalId ?? null,
      proposal_total_mxn: r.proposalTotal ? Math.round(r.proposalTotal / 100) : null,
    })),
    total: filtered.length,
    by_status: byCounts,
    recent_activity: recentEvents.map(e => ({
      email_type: e.event.email_type,
      sent_at: e.event.sent_at,
      lead_name: e.leadName,
      lead_email: e.leadEmail,
      empresa: e.empresa,
    })),
  });
}
