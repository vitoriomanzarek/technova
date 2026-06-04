interface FunnelStage {
  key: string;
  label: string;
  icon: string;
  color: string;
}

const STAGES: FunnelStage[] = [
  { key: 'new',               label: 'Nuevo',            icon: '🆕', color: 'bg-slate-500/20 text-slate-300' },
  { key: 'captured',          label: 'Capturado',        icon: '👤', color: 'bg-blue-500/20 text-blue-300' },
  { key: 'audit_completed',   label: 'Auditado',         icon: '🔍', color: 'bg-cyan-500/20 text-cyan-300' },
  { key: 'proposal_generated',label: 'Propuesta IA',     icon: '🤖', color: 'bg-purple-500/20 text-purple-300' },
  { key: 'proposal_sent',     label: 'Propuesta Enviada',icon: '📧', color: 'bg-indigo-500/20 text-indigo-300' },
  { key: 'client_reviewing',  label: 'Cliente Viendo',   icon: '👁️', color: 'bg-yellow-500/20 text-yellow-300' },
  { key: 'in_checkout',       label: 'En Checkout',      icon: '🛒', color: 'bg-orange-500/20 text-orange-300' },
  { key: 'paid',              label: 'Pagado',           icon: '✅', color: 'bg-green-500/20 text-green-300' },
];

interface LeadFunnelProps {
  byStatus: Record<string, number>;
  total: number;
  onFilter: (status: string) => void;
  activeFilter: string;
}

export default function LeadFunnel({ byStatus, total, onFilter, activeFilter }: LeadFunnelProps) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">🎯 Funnel de Leads</h2>
        <span className="text-sm font-bold text-white">{total} total</span>
      </div>
      <div className="space-y-2">
        {STAGES.map(stage => {
          const count = byStatus[stage.key] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isActive = activeFilter === stage.key;
          return (
            <button
              key={stage.key}
              onClick={() => onFilter(isActive ? '' : stage.key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors text-left ${
                isActive ? 'bg-purple-500/20 border border-purple-500/40' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="text-base shrink-0">{stage.icon}</span>
              <span className="flex-1 text-sm text-slate-300">{stage.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-xs font-bold w-6 text-right ${count > 0 ? 'text-white' : 'text-slate-600'}`}>
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      {activeFilter && (
        <button onClick={() => onFilter('')} className="mt-3 text-xs text-slate-500 hover:text-slate-300 w-full text-center">
          ✕ Quitar filtro
        </button>
      )}
    </div>
  );
}
