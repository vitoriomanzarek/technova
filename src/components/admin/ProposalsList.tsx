'use client';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending_vic_review: { label: 'Pendiente', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  approved:           { label: 'Aprobada',  color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  modified:           { label: 'Modificada', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  rejected:           { label: 'Rechazada', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  client_reviewing:   { label: 'Cliente viendo', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  client_confirmed:   { label: 'Confirmada', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
};

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-400';
  if (score >= 45) return 'text-amber-400';
  return 'text-red-400';
}

export interface ProposalRow {
  id: string;
  status: string;
  precio_total: number; // cents
  timeline_dias: number;
  created_at: string | null;
  lead: { id: number | undefined; name: string; empresa: string | null; email: string };
  audit_score: number;
}

interface ProposalsListProps {
  proposals: ProposalRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export default function ProposalsList({ proposals, selectedId, onSelect, loading }: ProposalsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <span className="animate-pulse">Cargando propuestas…</span>
      </div>
    );
  }

  if (!proposals.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
        <span className="text-2xl">📭</span>
        <span>Sin propuestas en este filtro</span>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {proposals.map(p => {
        const cfg = STATUS_CONFIG[p.status] ?? { label: p.status, color: 'bg-white/10 text-slate-300 border-white/20' };
        const isSelected = p.id === selectedId;
        const priceMXN = Math.round(p.precio_total / 100);
        const date = p.created_at ? new Date(p.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '—';

        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`w-full text-left px-4 py-3 transition-colors hover:bg-white/5 ${isSelected ? 'bg-purple-500/10 border-l-2 border-purple-500' : 'border-l-2 border-transparent'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {p.lead.empresa ?? p.lead.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{p.lead.name} · {p.lead.email}</p>
              </div>
              <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
              <span className={`font-medium ${scoreColor(p.audit_score)}`}>
                {p.audit_score}/100
              </span>
              <span>${priceMXN.toLocaleString('es-MX')} MXN</span>
              <span>{p.timeline_dias}d</span>
              <span className="ml-auto">{date}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
