'use client';

import { useState, useEffect, useCallback } from 'react';
import ProposalsList, { type ProposalRow } from '@/components/admin/ProposalsList';
import ProposalDetailPanel from '@/components/admin/ProposalDetailPanel';

const STATUS_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'pending_vic_review', label: '🟡 Pendientes' },
  { value: 'modified', label: '🔵 Modificadas' },
  { value: 'approved', label: '🟢 Aprobadas' },
  { value: 'rejected', label: '🔴 Rechazadas' },
];

export default function ProposalsReviewPage() {
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending_vic_review');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/proposals?${params}`);
    const data = await res.json();
    setProposals(data.proposals ?? []);
    setPendingCount(data.pending_count ?? 0);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchProposals(); }, [fetchProposals]);

  function handleActionDone() {
    setSelectedId(null);
    fetchProposals();
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-white/10 px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">TechNova · Admin</p>
            <h1 className="mt-0.5 text-2xl font-extrabold text-gradient">Proposals Review</h1>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm px-3 py-1 font-semibold">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                statusFilter === f.value
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar empresa…"
            className="ml-auto rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-40"
          />
        </div>
      </header>

      {/* Main content — two columns */}
      <div className="flex flex-1 overflow-hidden">
        {/* Proposals list — left */}
        <aside className={`shrink-0 overflow-y-auto border-r border-white/10 transition-all ${selectedId ? 'w-80' : 'w-full max-w-xl mx-auto'}`}>
          <ProposalsList
            proposals={proposals}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={loading}
          />
        </aside>

        {/* Detail panel — right */}
        {selectedId && (
          <main className="flex-1 overflow-hidden">
            <ProposalDetailPanel
              key={selectedId}
              proposalId={selectedId}
              onActionDone={handleActionDone}
            />
          </main>
        )}

        {!selectedId && proposals.length > 0 && (
          <main className="hidden lg:flex flex-1 items-center justify-center text-slate-500 text-sm">
            ← Selecciona una propuesta para ver detalles
          </main>
        )}
      </div>
    </div>
  );
}
