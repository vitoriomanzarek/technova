import { NextResponse } from 'next/server';
import { db } from '@/db';
import { proposals, leads, audits } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search')?.toLowerCase();

  const rows = await db
    .select({
      proposal: proposals,
      lead: leads,
      auditScore: audits.score,
      auditPriorityAreas: audits.priority_areas,
    })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .leftJoin(audits, eq(proposals.audit_id, audits.id))
    .where(status ? eq(proposals.status, status) : undefined)
    .orderBy(desc(proposals.created_at))
    .limit(100);

  const filtered = search
    ? rows.filter(r =>
        r.lead?.name.toLowerCase().includes(search) ||
        r.lead?.empresa?.toLowerCase().includes(search) ||
        r.lead?.email.toLowerCase().includes(search)
      )
    : rows;

  const pendingCount = rows.filter(r => r.proposal.status === 'pending_vic_review').length;

  return NextResponse.json({
    proposals: filtered.map(r => ({
      id: r.proposal.id,
      status: r.proposal.status,
      precio_total: r.proposal.precio_total,
      timeline_dias: r.proposal.timeline_dias,
      created_at: r.proposal.created_at,
      lead: {
        id: r.lead?.id,
        name: r.lead?.name ?? '—',
        empresa: r.lead?.empresa ?? null,
        email: r.lead?.email ?? '—',
      },
      audit_score: r.auditScore ?? 0,
    })),
    total: filtered.length,
    pending_count: pendingCount,
  });
}
