import type { ItemStatus } from '@/lib/backlog-parser';

/**
 * Estilos compartidos por status (reusados por SprintStatusPanel y BacklogItemList).
 * Dark theme cosmos: verde = done, amarillo = in-progress, naranja = pending,
 * rojo = not-started.
 */
export const STATUS_META: Record<
  ItemStatus,
  { label: string; dot: string; text: string; chip: string; bar: string }
> = {
  done: {
    label: 'DONE',
    dot: 'bg-green-400',
    text: 'text-green-300',
    chip: 'bg-green-400/15 text-green-300',
    bar: 'bg-green-400',
  },
  in_progress: {
    label: 'IN PROGRESS',
    dot: 'bg-yellow-400',
    text: 'text-yellow-300',
    chip: 'bg-yellow-400/15 text-yellow-300',
    bar: 'bg-yellow-400',
  },
  pending: {
    label: 'PENDIENTE',
    dot: 'bg-orange-400',
    text: 'text-orange-300',
    chip: 'bg-orange-400/15 text-orange-300',
    bar: 'bg-orange-400',
  },
  not_started: {
    label: 'NOT STARTED',
    dot: 'bg-red-400',
    text: 'text-red-300',
    chip: 'bg-red-400/15 text-red-300',
    bar: 'bg-red-400',
  },
};

export function ProgressBar({ pct, status }: { pct: number; status: ItemStatus }) {
  const safe = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${STATUS_META[status].bar} transition-all`}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

export default function PhaseProgressCard({
  title,
  subtitle,
  statusLabel,
  status,
  progress,
  children,
}: {
  title: string;
  subtitle?: string;
  statusLabel: string;
  status: ItemStatus;
  progress: number; // 0-100; <0 → oculta la barra
  children?: React.ReactNode;
}) {
  const meta = STATUS_META[status];
  const hasBar = progress >= 0;

  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.chip}`}
        >
          {statusLabel || meta.label}
        </span>
      </div>

      {hasBar && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px] text-slate-400">
            <span>Progreso</span>
            <span className={meta.text}>{progress}%</span>
          </div>
          <ProgressBar pct={progress} status={status} />
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
