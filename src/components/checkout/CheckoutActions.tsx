'use client';

import { useState } from 'react';
import type { CartModule } from '@/lib/checkout/calculate-proposal';

interface CheckoutActionsProps {
  proposalId: string;
  leadEmail: string;
  total: number;       // MXN
  originalModules: CartModule[];
  currentModules: CartModule[];
  disabled: boolean;
  onSaved: () => void;
}

export default function CheckoutActions({
  proposalId, leadEmail, total, originalModules, currentModules, disabled, onSaved,
}: CheckoutActionsProps) {
  const [payLoading, setPayLoading] = useState(false);
  const [showChangesForm, setShowChangesForm] = useState(false);
  const [changesNotes, setChangesNotes] = useState('');
  const [sendingChanges, setSendingChanges] = useState(false);
  const [changesSent, setChangesSent] = useState(false);

  const half = Math.round(total / 2);

  async function handlePay() {
    setPayLoading(true);
    try {
      const res = await fetch(`/api/checkout/${proposalId}/pay`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: leadEmail,
          total_mxn: total,
          payment_percentage: 50,
          modulos_seleccionados: currentModules,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPayLoading(false);
    }
  }

  async function handleRequestChanges() {
    setSendingChanges(true);
    const originalIds = new Set(originalModules.map(m => m.modulo_id));
    const currentIds = new Set(currentModules.map(m => m.modulo_id));

    const removidos = originalModules.filter(m => !currentIds.has(m.modulo_id));
    const agregados = currentModules.filter(m => !originalIds.has(m.modulo_id));

    await fetch(`/api/checkout/${proposalId}/request-changes`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        removidos: removidos.map(m => ({ modulo_id: m.modulo_id, nombre: m.nombre, precio_total: m.precio_total })),
        agregados: agregados.map(m => ({ modulo_id: m.modulo_id, nombre: m.nombre, precio_total: m.precio_total })),
        notas: changesNotes,
        precio_nuevo_total: total,
      }),
    });
    setSendingChanges(false);
    setChangesSent(true);
  }

  function handleSave() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`checkout_${proposalId}`, JSON.stringify(currentModules));
      onSaved();
    }
  }

  if (changesSent) {
    return (
      <div className="glass-card p-5 text-center space-y-2">
        <p className="text-green-400 font-semibold">✅ Cambios enviados a TechNova</p>
        <p className="text-sm text-slate-400">Vic revisará tus cambios y te responderá en máximo 24 horas.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Acciones</h3>

      {/* Pay */}
      <button
        onClick={handlePay}
        disabled={disabled || payLoading}
        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 px-5 py-4 font-bold text-white text-base transition-all shadow-lg shadow-purple-500/20"
      >
        {payLoading ? 'Redirigiendo a pago…' : `🚀 Pagar 50% y comenzar — $${half.toLocaleString('es-MX')} MXN`}
      </button>
      <p className="text-xs text-center text-slate-500">Pago seguro · Stripe · Tarjeta crédito/débito</p>

      {/* Request changes */}
      {!showChangesForm ? (
        <button
          onClick={() => setShowChangesForm(true)}
          className="w-full rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-5 py-3 font-semibold text-blue-300 text-sm transition-colors"
        >
          ✏️ Solicitar cambios al presupuesto
        </button>
      ) : (
        <div className="space-y-2">
          <label className="text-xs text-slate-400">¿Qué cambias y por qué?</label>
          <textarea
            value={changesNotes}
            onChange={e => setChangesNotes(e.target.value)}
            rows={3}
            placeholder="Ej: Quiero quitar el módulo de SEO y agregar ecommerce…"
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRequestChanges}
              disabled={sendingChanges}
              className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-sm font-bold text-white transition-colors"
            >
              {sendingChanges ? 'Enviando…' : '📧 Enviar solicitud'}
            </button>
            <button
              onClick={() => setShowChangesForm(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Save locally */}
      <button
        onClick={handleSave}
        className="w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 font-medium text-slate-400 text-sm transition-colors"
      >
        💾 Guardar presupuesto para después
      </button>
    </div>
  );
}
