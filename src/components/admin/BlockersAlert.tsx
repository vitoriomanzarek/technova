import type { Blocker } from '@/lib/bitacora-parser';

export default function BlockersAlert({ blockers }: { blockers: Blocker[] }) {
  if (blockers.length === 0) {
    return (
      <div className="glass-card flex items-center gap-3 border border-emerald-400/20 p-4">
        <span className="text-xl">✅</span>
        <p className="text-sm text-emerald-300">
          Sin blockers activos. Camino despejado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
        <span>⚠️</span>
        <span>
          {blockers.length} blocker{blockers.length > 1 ? 's' : ''} activo
          {blockers.length > 1 ? 's' : ''}
        </span>
      </div>
      {blockers.map((b, i) => (
        <div
          key={`${b.date}-${i}`}
          className={`glass-card border-l-4 p-4 ${
            b.severity === 'blocked'
              ? 'border-l-rose-500'
              : 'border-l-amber-400'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-white">{b.eventTitle}</p>
            <span className="shrink-0 text-xs text-slate-400">{b.date}</span>
          </div>
          <p className="mt-1 text-sm text-slate-300">{b.text}</p>
        </div>
      ))}
    </div>
  );
}
