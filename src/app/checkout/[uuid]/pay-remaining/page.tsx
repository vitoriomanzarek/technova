'use client';

import { useState, useEffect } from 'react';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

interface ProposalData {
  id: string;
  precio_total: number; // cents
  modulos_seleccionados: Array<{ nombre: string; horas: number }>;
  lead: { name: string; email: string; empresa: string | null } | null;
}

export default function PayRemainingPage({ params }: PageProps) {
  const [uuid, setUuid] = useState<string | null>(null);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => { params.then(p => setUuid(p.uuid)); }, [params]);

  useEffect(() => {
    if (!uuid) return;
    fetch(`/api/checkout/${uuid}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setProposal(d); setLoading(false); });
  }, [uuid]);

  async function handlePay() {
    if (!proposal) return;
    setPayLoading(true);
    const precioTotal = Math.round(proposal.precio_total / 100);
    const half = Math.round(precioTotal / 2);
    const res = await fetch(`/api/checkout/${uuid}/pay`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: proposal.lead?.email ?? '',
        total_mxn: precioTotal,
        payment_percentage: 50,
        modulos_seleccionados: proposal.modulos_seleccionados,
      }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setPayLoading(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-96 text-slate-400">
      <span className="animate-pulse">Cargando…</span>
    </div>
  );

  if (!proposal || !proposal.lead) return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Propuesta no encontrada</h1>
      <a href="/" className="text-cyan-400 hover:underline">Volver al inicio</a>
    </div>
  );

  const precioTotal = Math.round(proposal.precio_total / 100);
  const half = Math.round(precioTotal / 2);
  const empresa = proposal.lead.empresa ?? proposal.lead.name;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-cyan-300 mb-1">TechNova · Pago final</p>
        <h1 className="text-2xl font-extrabold text-gradient">Completar pago del proyecto</h1>
        <p className="text-slate-400 text-sm mt-2">{empresa}</p>
      </div>

      <div className="glass-card p-6 mb-6 space-y-4">
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-4 text-center">
          <p className="text-xs text-amber-400 font-semibold mb-1">Segundo pago (50% restante)</p>
          <p className="text-3xl font-extrabold text-white">${half.toLocaleString('es-MX')} MXN</p>
          <p className="text-xs text-slate-400 mt-1">Total del proyecto: ${precioTotal.toLocaleString('es-MX')} MXN</p>
        </div>

        <div className="text-sm text-slate-300 space-y-1">
          <p>✅ Primer pago (50%): ${half.toLocaleString('es-MX')} MXN — <span className="text-green-400">Pagado</span></p>
          <p>⏳ Este pago (50%): ${half.toLocaleString('es-MX')} MXN — <span className="text-amber-400">Pendiente</span></p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-xs text-slate-400 mb-3">
            Al completar este pago, tu proyecto pasará a estado activo y comenzará oficialmente.
          </p>
          <button
            onClick={handlePay}
            disabled={payLoading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-60 px-5 py-4 font-bold text-white text-base transition-all"
          >
            {payLoading ? 'Redirigiendo…' : `💳 Pagar $${half.toLocaleString('es-MX')} MXN`}
          </button>
          <p className="text-xs text-center text-slate-500 mt-2">Pago seguro vía Stripe</p>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        ¿Dudas? <a href="mailto:hola@tech-nova.mx" className="text-cyan-400 hover:underline">hola@tech-nova.mx</a>
        {' '}·{' '}
        <a href="https://wa.me/527221669672" className="text-cyan-400 hover:underline">WhatsApp</a>
      </div>
    </div>
  );
}
