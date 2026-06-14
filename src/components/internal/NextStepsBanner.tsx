import type { NextStep } from '@/lib/backlog-parser';

const PRIORITY_CHIP: Record<NextStep['priority'], string> = {
  CRÍTICA: 'bg-red-400/15 text-red-300 border-red-400/30',
  ALTA: 'bg-orange-400/15 text-orange-300 border-orange-400/30',
  MEDIA: 'bg-yellow-400/15 text-yellow-300 border-yellow-400/30',
};

/**
 * Banner "próximos 3 pasos": items accionables priorizados, derivados de los
 * pendientes del backlog (SEC sin terminar + 1ª área de Fase B).
 */
export default function NextStepsBanner({ steps }: { steps: NextStep[] }) {
  if (!steps.length) {
    return (
      <div className="glass-card p-4 text-sm text-slate-400">
        Sin pasos pendientes detectados. 🎉
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map((step, i) => (
        <div key={step.label} className="glass-card flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-2xl font-extrabold text-gradient">{i + 1}</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_CHIP[step.priority]}`}
            >
              {step.priority}
            </span>
          </div>
          <p className="text-sm font-semibold text-white">{step.label}</p>
          <p className="mt-1 flex-1 text-xs text-slate-400">{step.detail}</p>
          {step.estimate && (
            <p className="mt-2 text-[11px] text-slate-500">⏱ {step.estimate}</p>
          )}
        </div>
      ))}
    </div>
  );
}
