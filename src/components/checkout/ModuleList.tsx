'use client';

import type { CartModule } from '@/lib/checkout/calculate-proposal';

interface ModuleListProps {
  modules: CartModule[];
  onToggle: (moduleId: string) => void;
}

export default function ModuleList({ modules, onToggle }: ModuleListProps) {
  return (
    <div className="space-y-3">
      {modules.map(m => (
        <label
          key={m.modulo_id}
          className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-white/20"
        >
          <input
            type="checkbox"
            checked
            onChange={() => onToggle(m.modulo_id)}
            className="mt-1 accent-purple-500 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-white">{m.nombre}</span>
              <span className="shrink-0 font-bold text-cyan-300">
                ${m.precio_total.toLocaleString('es-MX')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{m.justificacion}</p>
            <p className="text-xs text-slate-500 mt-1">
              {m.horas}h · {m.modulo_id}
              {modules.length === 1 && (
                <span className="ml-2 text-amber-400">(mínimo 1 módulo requerido)</span>
              )}
            </p>
            {modules.length > 1 && (
              <p className="text-xs text-slate-500 mt-0.5">
                Si lo quitas: −${m.precio_total.toLocaleString('es-MX')} + 20% PM fee
              </p>
            )}
          </div>
        </label>
      ))}

      {modules.length === 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400">Debes tener al menos 1 módulo seleccionado</p>
        </div>
      )}
    </div>
  );
}
