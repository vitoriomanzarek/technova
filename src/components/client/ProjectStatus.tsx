interface ProjectModule {
  nombre: string;
  horas: number;
}

interface ProjectStatusProps {
  empresa: string;
  status: string;
  paymentStatus: string;
  modulos: ProjectModule[];
  timelineDias: number;
  kickoffDate: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; pct: number }> = {
  awaiting_kickoff: { label: 'Esperando kickoff', color: 'text-amber-400', pct: 5 },
  in_progress:      { label: 'En progreso',       color: 'text-blue-400',  pct: 50 },
  delivered:        { label: 'Entregado',          color: 'text-green-400', pct: 90 },
  completed:        { label: 'Completado',         color: 'text-green-400', pct: 100 },
  on_hold:          { label: 'En pausa',           color: 'text-slate-400', pct: 0 },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  half_paid:       { label: '50% pagado', color: 'text-amber-400' },
  fully_paid:      { label: 'Pagado completo', color: 'text-green-400' },
  payment_overdue: { label: 'Pago vencido', color: 'text-red-400' },
};

export default function ProjectStatus({ empresa, status, paymentStatus, modulos, timelineDias, kickoffDate }: ProjectStatusProps) {
  const statusCfg = STATUS_CONFIG[status] ?? { label: status, color: 'text-slate-400', pct: 0 };
  const paymentCfg = PAYMENT_CONFIG[paymentStatus] ?? { label: paymentStatus, color: 'text-slate-400' };
  const kickoffFmt = kickoffDate
    ? new Date(kickoffDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Por definir';

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400 mb-1">Tu proyecto</p>
          <h2 className="text-xl font-extrabold text-white">{empresa}</h2>
        </div>
        <div className="text-right">
          <p className={`font-bold text-sm ${statusCfg.color}`}>{statusCfg.label}</p>
          <p className={`text-xs ${paymentCfg.color}`}>{paymentCfg.label}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progreso</span>
          <span>{statusCfg.pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700"
            style={{ width: `${statusCfg.pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <p className="text-slate-400 text-xs">Kickoff</p>
          <p className="text-white font-medium">{kickoffFmt}</p>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <p className="text-slate-400 text-xs">Timeline</p>
          <p className="text-white font-medium">{timelineDias} días</p>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-3 col-span-2">
          <p className="text-slate-400 text-xs mb-1">Módulos ({modulos.length})</p>
          <div className="flex flex-wrap gap-1">
            {modulos.map((m, i) => (
              <span key={i} className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/20 rounded-full px-2 py-0.5">
                {m.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
