import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { proposals, leads, audits, proposalTracking } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProposalSummary from '@/components/propuesta/ProposalSummary';
import ProposalActions from '@/components/propuesta/ProposalActions';
import type { ProposalModule } from '@/lib/schemas/proposal';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Tu propuesta personalizada · TechNova',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function ProposalLandingPage({ params }: PageProps) {
  const { uuid } = await params;

  const rows = await db
    .select({ proposal: proposals, lead: leads, audit: audits, tracking: proposalTracking })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .leftJoin(audits, eq(proposals.audit_id, audits.id))
    .leftJoin(proposalTracking, eq(proposalTracking.proposal_id, proposals.id))
    .where(eq(proposals.id, uuid))
    .limit(1);

  if (!rows.length || !rows[0].lead) {
    notFound();
  }

  const { proposal, lead, audit, tracking } = rows[0];

  // Mark as opened on first visit (fire and forget)
  if (tracking && !tracking.opened_at) {
    db.update(proposalTracking)
      .set({ opened_at: new Date(), status: 'opened' })
      .where(eq(proposalTracking.id, tracking.id))
      .catch(() => {});
  }

  if (proposal.status === 'rejected') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Esta propuesta no está disponible</h1>
        <p className="text-slate-400">Contáctanos para más información.</p>
        <a href="mailto:hola@tech-nova.mx" className="mt-6 inline-block text-cyan-400 hover:underline">
          hola@tech-nova.mx
        </a>
      </div>
    );
  }

  const modulos = proposal.modulos_seleccionados as ProposalModule[];
  const empresa = lead!.empresa ?? lead!.name;
  const precioSubtotal = Math.round(proposal.precio_subtotal_tecnico / 100);
  const pmFee = Math.round(proposal.pm_fee_20_pct / 100);
  const precioTotal = Math.round(proposal.precio_total / 100);
  const sentAt = proposal.sent_at ?? proposal.created_at!;
  const expiresAt = new Date(new Date(sentAt).getTime() + 14 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const isExpired = proposal.status === 'expired' ||
    new Date() > new Date(new Date(sentAt).getTime() + 14 * 24 * 60 * 60 * 1000);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

      {isExpired && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
          <p className="text-amber-300 font-semibold">⏰ Esta propuesta venció</p>
          <p className="text-sm text-slate-400 mt-1">
            Contáctanos a{' '}
            <a href="mailto:hola@tech-nova.mx" className="text-amber-300 hover:underline">hola@tech-nova.mx</a>
            {' '}para renovarla.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Summary — main column */}
        <div className="lg:col-span-3">
          <ProposalSummary
            empresa={empresa}
            leadName={lead!.name}
            auditScore={audit?.score ?? 0}
            auditSummary={audit?.summary ?? ''}
            priorityAreas={(audit?.priority_areas as string[]) ?? []}
            modulos={modulos}
            precioSubtotal={precioSubtotal}
            pmFee={pmFee}
            precioTotal={precioTotal}
            timelineDias={proposal.timeline_dias}
            fechaEntrega={proposal.fecha_entrega_estimada}
            createdAt={proposal.created_at!.toISOString()}
            expiresAt={expiresAt}
          />
        </div>

        {/* Actions — sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            {!isExpired ? (
              <ProposalActions
                proposalId={uuid}
                leadEmail={lead!.email}
                precioTotal={precioTotal}
                empresa={empresa}
              />
            ) : (
              <div className="glass-card p-6 text-center space-y-3">
                <p className="text-amber-300 font-semibold">⏰ Propuesta vencida</p>
                <a
                  href={`mailto:hola@tech-nova.mx?subject=Renovar propuesta ${empresa}`}
                  className="block w-full rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-3 font-bold text-white text-sm transition-colors"
                >
                  Solicitar nueva propuesta
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
        TechNova · hola@tech-nova.mx · tech-nova.mx
      </footer>
    </div>
  );
}
