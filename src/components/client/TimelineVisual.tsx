interface TimelinePhase {
  phase: string;
  description: string;
  durationDays: number;
  startDate: Date;
  endDate: Date;
}

interface TimelineVisualProps {
  kickoffDate: Date | null;
  timelineDias: number;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function buildPhases(kickoff: Date, totalDays: number): TimelinePhase[] {
  const devDays = Math.max(3, totalDays - 7);
  let cursor = kickoff;

  const phases: TimelinePhase[] = [
    { phase: 'Kickoff Call',  description: 'Reunión de inicio y presentación del equipo',   durationDays: 1, startDate: cursor, endDate: addDays(cursor, 1) },
    { phase: 'Setup',         description: 'Preparación de repos, accesos y documentación', durationDays: 2, startDate: cursor = addDays(cursor, 1), endDate: addDays(cursor, 2) },
    { phase: 'Desarrollo',    description: 'Implementación de módulos seleccionados',        durationDays: devDays, startDate: cursor = addDays(cursor, 2), endDate: addDays(cursor, devDays) },
    { phase: 'QA',            description: 'Pruebas de calidad y ajustes finales',           durationDays: 2, startDate: cursor = addDays(cursor, devDays), endDate: addDays(cursor, 2) },
    { phase: 'Deploy',        description: 'Lanzamiento en producción',                     durationDays: 1, startDate: cursor = addDays(cursor, 2), endDate: addDays(cursor, 1) },
    { phase: 'Entrega',       description: '✅ Entrega final y soporte 30 días incluido',   durationDays: 0, startDate: cursor = addDays(cursor, 1), endDate: cursor },
  ];
  return phases;
}

export default function TimelineVisual({ kickoffDate, timelineDias }: TimelineVisualProps) {
  if (!kickoffDate) {
    return (
      <div className="glass-card p-5 text-center text-slate-400 text-sm">
        El timeline se mostrará una vez que se confirme la fecha de kickoff.
      </div>
    );
  }

  const phases = buildPhases(kickoffDate, timelineDias);
  const now = new Date();

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-5">📅 Timeline del proyecto</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-3 bottom-3 w-px bg-white/10" />

        <div className="space-y-5">
          {phases.map((p, i) => {
            const isPast = p.endDate < now;
            const isActive = p.startDate <= now && p.endDate >= now;
            const dotColor = isPast ? 'bg-green-500' : isActive ? 'bg-cyan-400 animate-pulse' : 'bg-white/20';
            const textColor = isPast ? 'text-slate-400' : isActive ? 'text-white' : 'text-slate-300';
            const dateStr = p.startDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

            return (
              <div key={i} className="flex items-start gap-4 pl-2">
                <div className={`relative z-10 mt-1 w-3 h-3 rounded-full border-2 border-white/20 shrink-0 ${dotColor}`} />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`font-semibold text-sm ${textColor}`}>{p.phase}</p>
                    <p className="text-xs text-slate-500 shrink-0">{dateStr}{p.durationDays > 1 ? ` · ${p.durationDays}d` : ''}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
