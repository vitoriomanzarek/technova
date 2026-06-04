interface PaymentSectionProps {
  paymentStatus: string;
  precioTotal: number;   // MXN
  proposalId: string;
  kickoffDate: string | null;
}

export default function PaymentSection({ paymentStatus, precioTotal, proposalId, kickoffDate }: PaymentSectionProps) {
  const half = Math.round(precioTotal / 2);
  const kickoffFmt = kickoffDate
    ? new Date(kickoffDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })
    : null;
  const isOverdue = paymentStatus === 'payment_overdue';
  const isFullyPaid = paymentStatus === 'fully_paid';
  const payUrl = `/checkout/${proposalId}/pay-remaining`;

  if (isFullyPaid) {
    return (
      <div className="glass-card p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">💳 Pagos</h2>
        <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
          <p className="text-green-400 font-bold">✅ Proyecto pagado al 100%</p>
          <p className="text-xs text-slate-400 mt-1">Total: ${precioTotal.toLocaleString('es-MX')} MXN</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">💳 Pagos</h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-green-400 font-medium">✅ Primer pago (50%)</span>
            <p className="text-xs text-slate-500">${half.toLocaleString('es-MX')} MXN — Pagado</p>
          </div>
        </div>

        <div className={`rounded-lg border p-4 ${isOverdue ? 'border-red-500/40 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-semibold text-sm ${isOverdue ? 'text-red-400' : 'text-amber-300'}`}>
                {isOverdue ? '⚠️ Pago vencido' : '⏳ Segundo pago (50%)'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                ${half.toLocaleString('es-MX')} MXN
                {kickoffFmt && ` · vence el ${kickoffFmt}`}
              </p>
            </div>
          </div>
          <a
            href={payUrl}
            className={`mt-3 block text-center rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-colors ${
              isOverdue
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-purple-600 hover:bg-purple-500'
            }`}
          >
            {isOverdue ? '⚠️ Pagar ahora (urgente)' : '💳 Pagar segundo 50%'}
          </a>
        </div>
      </div>
    </div>
  );
}
