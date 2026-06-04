'use client';

import { MODULES, calcModuleCost } from '@/data/catalog';
import type { ProposalModule } from '@/lib/schemas/proposal';

interface ModuleSelectorProps {
  selected: ProposalModule[];
  onChange: (modules: ProposalModule[]) => void;
  maxPresupuesto?: number | null; // MXN
}

export default function ModuleSelector({ selected, onChange, maxPresupuesto }: ModuleSelectorProps) {
  const selectedIds = new Set(selected.map(m => m.modulo_id));

  const subtotal = selected.reduce((s, m) => s + m.precio_total, 0);
  const pmFee = Math.round(subtotal * 0.20);
  const total = subtotal + pmFee;
  const overBudget = maxPresupuesto != null && total > maxPresupuesto;

  function toggle(moduleId: string) {
    if (selectedIds.has(moduleId)) {
      onChange(selected.filter(m => m.modulo_id !== moduleId));
    } else {
      const mod = MODULES.find(m => m.id === moduleId);
      if (!mod) return;
      const { cost, hours } = calcModuleCost(moduleId);
      const newModule: ProposalModule = {
        modulo_id: mod.id,
        nombre: mod.name,
        componentes: mod.components,
        precio_total: Math.round(cost),
        horas: hours,
        justificacion: mod.description,
      };
      onChange([...selected, newModule]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2">
        {MODULES.map(mod => {
          const { cost, hours } = calcModuleCost(mod.id);
          const isSelected = selectedIds.has(mod.id);
          return (
            <label
              key={mod.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                isSelected
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(mod.id)}
                className="mt-0.5 accent-purple-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{mod.name}</span>
                  <span className="shrink-0 text-sm font-semibold text-cyan-300">
                    ${Math.round(cost).toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">{mod.description}</p>
                <p className="mt-0.5 text-xs text-slate-500">{hours}h · {mod.id}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Price summary */}
      <div className={`rounded-lg border p-4 space-y-1.5 ${overBudget ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-white/5'}`}>
        <div className="flex justify-between text-sm text-slate-300">
          <span>Subtotal técnico</span>
          <span>${subtotal.toLocaleString('es-MX')} MXN</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>PM Fee (20%)</span>
          <span>${pmFee.toLocaleString('es-MX')} MXN</span>
        </div>
        <div className={`flex justify-between border-t pt-1.5 font-bold ${overBudget ? 'text-red-400' : 'text-white'}`}>
          <span>Total</span>
          <span>${total.toLocaleString('es-MX')} MXN</span>
        </div>
        {maxPresupuesto != null && (
          <div className={`text-xs ${overBudget ? 'text-red-400' : 'text-slate-400'}`}>
            Presupuesto cliente: ${maxPresupuesto.toLocaleString('es-MX')} MXN
            {overBudget && ' ⚠️ Excede presupuesto'}
          </div>
        )}
      </div>
    </div>
  );
}
