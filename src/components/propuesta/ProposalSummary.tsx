interface ProposalModule {
  modulo_id: string;
  nombre: string;
  precio_total: number; // MXN
  horas: number;
  justificacion: string;
  componentes: string[];
}

interface AuditFinding {
  item: string;
  status: 'verde' | 'amarillo' | 'rojo';
  recomendacion: string;
}

interface ProposalSummaryProps {
  empresa: string;
  leadName: string;
  auditScore: number;
  auditSummary: string;
  priorityAreas: string[];
  modulos: ProposalModule[];
  precioSubtotal: number; // MXN
  pmFee: number;          // MXN
  precioTotal: number;    // MXN
  timelineDias: number;
  fechaEntrega: string;
  createdAt: string;
  expiresAt: string;
}

function scoreColor(score: number) {
  if (score >= 70) return { ring: '#22c55e', bg: '#dcfce7', text: '#15803d', label: 'Buen estado' };
  if (score >= 45) return { ring: '#f59e0b', bg: '#fef3c7', text: '#b45309', label: 'Necesita mejoras' };
  return { ring: '#ef4444', bg: '#fee2e2', text: '#b91c1c', label: 'Requiere atención urgente' };
}

export default function ProposalSummary({
  empresa, leadName, auditScore, auditSummary, priorityAreas,
  modulos, precioSubtotal, pmFee, precioTotal, timelineDias,
  fechaEntrega, createdAt, expiresAt,
}: ProposalSummaryProps) {
  const sc = scoreColor(auditScore);
  const fmt = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-card p-6">
        <p className="text-xs uppercase tracking-widest text-cyan-300 mb-1">TechNova · Propuesta personalizada</p>
        <h1 className="text-2xl font-extrabold text-white mb-1">Propuesta para {empresa}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span>Preparada para: <span className="text-white">{leadName}</span></span>
          <span>Fecha: <span className="text-white">{fmt(createdAt)}</span></span>
          <span className="text-amber-400">Válida hasta: <span className="font-semibold">{fmt(expiresAt)}</span></span>
        </div>
      </div>

      {/* Audit summary */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">🔍 Auditoría de tu sitio</h2>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full font-extrabold text-2xl border-4 shrink-0"
            style={{ borderColor: sc.ring, backgroundColor: sc.bg, color: sc.text }}
          >
            {auditScore}
          </div>
          <div>
            <p className="font-semibold text-white">{sc.label}</p>
            <p className="text-sm text-slate-400">{auditSummary}</p>
          </div>
        </div>
        {priorityAreas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {priorityAreas.map(a => (
              <span key={a} className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full px-3 py-1">
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">✨ Módulos seleccionados</h2>
        <div className="space-y-3">
          {modulos.map((m, i) => (
            <div key={m.modulo_id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{m.nombre}</p>
                    <p className="text-xs text-slate-400 mt-1">{m.justificacion}</p>
                    <p className="text-xs text-slate-500 mt-1">{m.horas}h de trabajo</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-cyan-300">${m.precio_total.toLocaleString('es-MX')}</p>
                  <p className="text-xs text-slate-500">MXN</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">💰 Desglose de inversión</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal técnico</span>
            <span>${precioSubtotal.toLocaleString('es-MX')} MXN</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Gestión del proyecto (20%)</span>
            <span>${pmFee.toLocaleString('es-MX')} MXN</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-3 text-lg font-extrabold text-white">
            <span>TOTAL</span>
            <span className="text-gradient">${precioTotal.toLocaleString('es-MX')} MXN</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
            <p className="text-xs text-green-400 font-semibold mb-1">Pago inicial (50%)</p>
            <p className="font-bold text-white">${Math.round(precioTotal / 2).toLocaleString('es-MX')} MXN</p>
          </div>
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-center">
            <p className="text-xs text-blue-400 font-semibold mb-1">Al iniciar proyecto (50%)</p>
            <p className="font-bold text-white">${Math.round(precioTotal / 2).toLocaleString('es-MX')} MXN</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">⏱️ Timeline</h2>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-3xl font-extrabold text-gradient">{timelineDias}</p>
            <p className="text-slate-400">días</p>
          </div>
          <div className="space-y-1 text-slate-300">
            <p>Entrega estimada: <span className="text-white font-medium">{fmt(fechaEntrega)}</span></p>
            <p className="text-slate-400 text-xs">Una vez aprobado y con pago inicial recibido</p>
          </div>
        </div>
      </div>

    </div>
  );
}
