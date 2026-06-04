'use client';

import { useState, useEffect, useCallback } from 'react';
import LeadFunnel from '@/components/admin/LeadFunnel';
import LeadActivityTimeline from '@/components/admin/LeadActivityTimeline';

interface LeadRow {
  id: number;
  name: string;
  email: string;
  empresa: string | null;
  status: string;
  lead_score: number | null;
  created_at: string | null;
  audit_completed_at: string | null;
  proposal_sent_at: string | null;
  paid_at: string | null;
  last_email_type: string | null;
  last_email_sent_at: string | null;
  audit_score: number | null;
  proposal_id: string | null;
  proposal_total_mxn: number | null;
}

interface CrmData {
  leads: LeadRow[];
  total: number;
  by_status: Record<string, number>;
  recent_activity: Array<{ email_type: string; sent_at: string | null; lead_name: string | null; lead_email: string | null; empresa: string | null }>;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo', captured: 'Capturado', audit_completed: 'Auditado',
  proposal_generated: 'Propuesta IA', proposal_sent: 'Propuesta enviada',
  client_reviewing: 'Viendo', in_checkout: 'Checkout', paid: 'Pagado',
  project_active: 'Proyecto activo', completed: 'Completado',
};

function daysInStage(dateStr: string | null): string {
  if (!dateStr) return '—';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return `${days}d`;
}

function scoreColor(score: number | null): string {
  if (score == null) return 'text-slate-500';
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

export default function CrmPage() {
  const [data, setData] = useState<CrmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/leads?${params}`);
    const d = await res.json();
    setData(d);
    setLoading(false);
  }, [statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">TechNova · Admin</p>
          <h1 className="mt-0.5 text-2xl font-extrabold text-gradient">CRM Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar lead…"
            className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 w-40"
          />
          <button onClick={fetchData} className="rounded-full bg-purple-600/20 border border-purple-500/30 px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-600/30 transition-colors">
            Actualizar
          </button>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-4">
        {/* Funnel + Activity — left sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {data && (
            <>
              <LeadFunnel
                byStatus={data.by_status}
                total={data.total}
                onFilter={setStatusFilter}
                activeFilter={statusFilter}
              />
              <LeadActivityTimeline activity={data.recent_activity} />
            </>
          )}
          {loading && <div className="glass-card p-5 animate-pulse h-64" />}
        </div>

        {/* Leads table — main area */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Leads {statusFilter ? `· ${STATUS_LABELS[statusFilter] ?? statusFilter}` : ''}
              </h2>
              {data && <span className="text-xs text-slate-400">{data.leads.length} resultados</span>}
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 animate-pulse">Cargando…</div>
            ) : data?.leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Sin leads en este filtro</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Lead', 'Status', 'Score', 'Días', 'Último email', 'Propuesta', 'Acciones'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data?.leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white truncate max-w-[140px]">{lead.empresa ?? lead.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{lead.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-white/10 text-slate-300 rounded-full px-2 py-0.5 whitespace-nowrap">
                            {STATUS_LABELS[lead.status] ?? lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-sm ${scoreColor(lead.lead_score)}`}>
                            {lead.lead_score ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {daysInStage(lead.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-400 truncate max-w-[120px]">
                            {lead.last_email_type ?? '—'}
                          </p>
                          <p className="text-xs text-slate-600">
                            {lead.last_email_sent_at ? daysInStage(lead.last_email_sent_at) + ' ago' : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {lead.proposal_total_mxn
                            ? `$${lead.proposal_total_mxn.toLocaleString('es-MX')}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {lead.proposal_id && (
                              <a
                                href={`/admin/proposals-review`}
                                className="text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 rounded px-2 py-1 transition-colors"
                              >
                                Propuesta
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
