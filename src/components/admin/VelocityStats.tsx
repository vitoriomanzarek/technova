import type { VelocityStats as Stats } from '@/lib/bitacora-parser';

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gradient">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function VelocityStats({ velocity }: { velocity: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Stat
        label="Velocity"
        value={`${velocity.tasksPerWeek}`}
        hint="tareas / semana"
      />
      <Stat
        label="Completadas"
        value={`${velocity.completedTasks}`}
        hint={`de ${velocity.totalTasks} registradas`}
      />
      <Stat
        label="Span"
        value={`${velocity.spanDays}d`}
        hint={
          velocity.firstDate && velocity.lastDate
            ? `${velocity.firstDate} → ${velocity.lastDate}`
            : 'sin datos'
        }
      />
      <Stat
        label="ETA proyectada"
        value={velocity.projectedCompletion ?? '—'}
        hint={velocity.projectedCompletion ? 'fases restantes' : 'sin pendientes'}
      />
    </div>
  );
}
