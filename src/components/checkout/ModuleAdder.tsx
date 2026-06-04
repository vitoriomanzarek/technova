'use client';

import type { CartModule } from '@/lib/checkout/calculate-proposal';
import { getAvailableModules } from '@/lib/checkout/calculate-proposal';

interface ModuleAdderProps {
  currentModuleIds: string[];
  presupuestoMax?: number | null; // MXN
  currentTotal: number;           // MXN
  onAdd: (module: CartModule) => void;
}

export default function ModuleAdder({ currentModuleIds, presupuestoMax, currentTotal, onAdd }: ModuleAdderProps) {
  const available = getAvailableModules(currentModuleIds);

  if (!available.length) {
    return (
      <p className="text-xs text-slate-500 text-center py-2">
        Ya tienes todos los módulos del catálogo seleccionados.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-400 mb-3">
        Selecciona módulos adicionales para agregar a tu propuesta:
      </p>
      {available.map(m => {
        const newTotal = currentTotal + m.precio_total * 1.20;
        const wouldExceed = presupuestoMax != null && newTotal > presupuestoMax;
        return (
          <div
            key={m.modulo_id}
            className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{m.nombre}</p>
              <p className="text-xs text-slate-400 truncate">{m.justificacion}</p>
              <p className="text-xs text-slate-500">{m.horas}h</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {wouldExceed && (
                <span className="text-xs text-amber-400">⚠️ excede presupuesto</span>
              )}
              <span className="text-sm font-semibold text-cyan-300">
                +${m.precio_total.toLocaleString('es-MX')}
              </span>
              <button
                onClick={() => onAdd(m)}
                className="rounded-lg bg-purple-600 hover:bg-purple-500 px-3 py-1.5 text-xs font-bold text-white transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
