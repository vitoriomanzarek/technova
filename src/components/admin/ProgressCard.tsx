import type { Phase } from '@/lib/bitacora-parser';
import { STATUS_STYLES } from './statusStyles';

export default function ProgressCard({ phase }: { phase: Phase }) {
  const s = STATUS_STYLES[phase.status];

  return (
    <div className="glass-card p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
          <div>
            <p className="text-sm font-semibold text-white">
              Fase {phase.number}
            </p>
            <p className="text-xs text-slate-400">{phase.name}</p>
          </div>
        </div>
        <span className={`text-sm font-bold ${s.text}`}>
          {s.emoji} {phase.percent}%
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${s.bar} transition-all duration-700`}
          style={{ width: `${phase.percent}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>
          {phase.totalTasks > 0
            ? `${phase.completedTasks}/${phase.totalTasks} tareas`
            : s.label}
        </span>
        <span>
          {phase.status === 'completed' && phase.completedDate
            ? `✓ ${phase.completedDate}`
            : phase.startDate
              ? `desde ${phase.startDate}`
              : '—'}
        </span>
      </div>
    </div>
  );
}
