import type { ProposalCalculation } from '@/lib/checkout/calculate-proposal';

interface PriceBreakdownProps {
  calc: ProposalCalculation;
  presupuestoMax?: number | null;
}

export default function PriceBreakdown({ calc, presupuestoMax }: PriceBreakdownProps) {
  const half = Math.round(calc.total / 2);

  return (
    <div className="glass-card p-5 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Desglose actualizado</h3>

      <div className="space-y-1.5 text-sm">
        {calc.modulos.map(m => (
          <div key={m.modulo_id} className="flex justify-between text-slate-300">
            <span className="truncate mr-2">{m.nombre}</span>
            <span className="shrink-0">${m.precio_total.toLocaleString('es-MX')}</span>
          </div>
        ))}

        <div className="border-t border-white/10 pt-2 space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal técnico</span>
            <span>${calc.subtotal.toLocaleString('es-MX')}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Gestión (20% PM fee)</span>
            <span>${calc.pmFee.toLocaleString('es-MX')}</span>
          </div>
        </div>

        <div className="border-t-2 border-purple-500/40 pt-2">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-white text-base">TOTAL</span>
            <span className="font-extrabold text-gradient text-xl">
              ${calc.total.toLocaleString('es-MX')} MXN
            </span>
          </div>
        </div>

        {calc.exceedsBudget && presupuestoMax != null && (
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2">
            <p className="text-xs text-amber-300">
              ⚠️ Excede tu presupuesto en ${calc.budgetOverage.toLocaleString('es-MX')} MXN
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-2 text-center">
          <p className="text-green-400 font-semibold mb-0.5">Pago inicial (50%)</p>
          <p className="text-white font-bold">${half.toLocaleString('es-MX')} MXN</p>
        </div>
        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2 text-center">
          <p className="text-blue-400 font-semibold mb-0.5">Al iniciar (50%)</p>
          <p className="text-white font-bold">${half.toLocaleString('es-MX')} MXN</p>
        </div>
      </div>

      <div className="text-xs text-slate-400 flex items-center gap-2">
        <span>⏱️</span>
        <span>{calc.diasEstimados} días estimados · {calc.horas} horas de trabajo</span>
      </div>
    </div>
  );
}
