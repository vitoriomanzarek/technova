'use client';

import { useState } from 'react';

interface ProposalActionsProps {
  proposalId: string;
  leadEmail: string;
  precioTotal: number; // MXN
  empresa: string;
}

export default function ProposalActions({ proposalId, leadEmail, precioTotal, empresa }: ProposalActionsProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const halfAmount = Math.round(precioTotal / 2);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          amount_mxn: halfAmount,
          description: `Propuesta TechNova — ${empresa} (50% inicial)`,
          plan: 'custom',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="glass-card p-6 space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">🚀 ¿Listo para empezar?</h2>

      {/* Primary CTA */}
      <button
        onClick={handleCheckout}
        disabled={checkoutLoading}
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-60 px-6 py-4 font-bold text-white text-base transition-all shadow-lg shadow-purple-500/20"
      >
        {checkoutLoading ? 'Redirigiendo a pago…' : `✅ Aprobar y pagar 50% — $${Math.round(precioTotal / 2).toLocaleString('es-MX')} MXN`}
      </button>

      <p className="text-xs text-slate-400 text-center -mt-2">
        Pago seguro vía Stripe · Tarjeta de crédito / débito
      </p>

      {/* Download PDF */}
      <a
        href={`/api/proposals/${proposalId}/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 font-medium text-slate-200 text-sm transition-colors"
      >
        📄 Descargar propuesta en PDF
      </a>

      {/* Schedule call */}
      <a
        href="https://calendly.com/technova/consulta"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 font-medium text-slate-200 text-sm transition-colors"
      >
        📅 Reservar llamada con Sofía (30 min)
      </a>

      {/* Contact */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        <p className="text-xs text-slate-400 font-semibold">¿Tienes preguntas?</p>
        <div className="flex gap-3">
          <a href="mailto:hola@tech-nova.mx"
            className="flex-1 text-center text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-slate-300 transition-colors">
            📧 hola@tech-nova.mx
          </a>
          <a href="https://wa.me/527221669672"
            className="flex-1 text-center text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg px-3 py-2 text-green-300 transition-colors">
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
