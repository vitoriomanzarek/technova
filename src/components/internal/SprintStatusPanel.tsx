import type { SecItem } from '@/lib/backlog-parser';
import { STATUS_META, ProgressBar } from '@/components/internal/PhaseProgressCard';

/**
 * Panel del sprint actual (SEC): tabla SEC-1…SEC-N con status por color,
 * barra de progreso global del sprint y nota de bloqueo si aplica.
 */
export default function SprintStatusPanel({
  items,
  progress,
}: {
  items: SecItem[];
  progress: { done: number; total: number; pct: number };
}) {
  if (!items.length) {
    return (
      <div className="glass-card p-4 text-sm text-slate-400">
        No se encontraron items SEC en BACKLOG_MASTER.md.
      </div>
    );
  }

  const blocked = items.filter((i) => i.status === 'not_started' && /CRÍTICA|CRITICA/i.test(i.priority ?? ''));

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">
          Sprint SEC — Hardening
        </p>
        <span className="text-xs text-slate-400">
          {progress.done}/{progress.total} completados ·{' '}
          <span className="text-green-300">{progress.pct}%</span>
        </span>
      </div>

      <ProgressBar pct={progress.pct} status={progress.pct === 100 ? 'done' : 'in_progress'} />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-slate-500">
              <th className="pb-2 pr-3 font-medium">Item</th>
              <th className="pb-2 pr-3 font-medium">Status</th>
              <th className="pb-2 font-medium">Prioridad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => {
              const meta = STATUS_META[item.status];
              return (
                <tr key={item.id}>
                  <td className="py-2 pr-3 align-top">
                    <span className="font-mono text-cyan-200">{item.id}</span>
                    <span className="ml-2 text-slate-300">{item.title}</span>
                  </td>
                  <td className="py-2 pr-3 align-top">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                      {item.statusLabel || meta.label}
                    </span>
                  </td>
                  <td className="py-2 align-top text-slate-400">
                    {item.priority ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {blocked.length > 0 && (
        <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
          ⚠️ {blocked.length} item(s) crítico(s) sin iniciar:{' '}
          {blocked.map((b) => b.id).join(', ')} — bloquean el cierre del sprint.
        </p>
      )}
    </div>
  );
}
