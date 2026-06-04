'use client';

import { useState, useEffect, useCallback } from 'react';
import ModuleList from '@/components/checkout/ModuleList';
import ModuleAdder from '@/components/checkout/ModuleAdder';
import PriceBreakdown from '@/components/checkout/PriceBreakdown';
import CheckoutActions from '@/components/checkout/CheckoutActions';
import { calculateProposal, dbModuleToCart, type CartModule } from '@/lib/checkout/calculate-proposal';

interface ProposalData {
  id: string;
  status: string;
  modulos_seleccionados: CartModule[];
  precio_total: number; // cents in DB
  timeline_dias: number;
  lead: {
    name: string;
    email: string;
    empresa: string | null;
    presupuesto_estimado: number | null; // MXN
  } | null;
}

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default function CheckoutPage({ params }: PageProps) {
  const [uuid, setUuid] = useState<string | null>(null);
  const [proposal, setProposal] = useState<ProposalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [cartModules, setCartModules] = useState<CartModule[]>([]);
  const [showAdder, setShowAdder] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // Resolve params
  useEffect(() => {
    params.then(p => setUuid(p.uuid));
  }, [params]);

  // Load proposal data
  useEffect(() => {
    if (!uuid) return;
    fetch(`/api/checkout/${uuid}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setNotFound(true); setLoading(false); return; }
        setProposal(data);
        // Restore from localStorage if available
        const saved = typeof window !== 'undefined' ? localStorage.getItem(`checkout_${uuid}`) : null;
        const rawModules = (data.modulos_seleccionados as Record<string, unknown>[]).map(dbModuleToCart);
        setCartModules(saved ? JSON.parse(saved) : rawModules);
        setLoading(false);
      });
  }, [uuid]);

  const toggleModule = useCallback((moduleId: string) => {
    setCartModules(prev => {
      if (prev.length <= 1 && prev.some(m => m.modulo_id === moduleId)) return prev;
      return prev.filter(m => m.modulo_id !== moduleId);
    });
  }, []);

  const addModule = useCallback((module: CartModule) => {
    setCartModules(prev => [...prev, module]);
    setShowAdder(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 text-slate-400">
        <span className="animate-pulse">Cargando presupuesto…</span>
      </div>
    );
  }

  if (notFound || !proposal || !proposal.lead) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Propuesta no encontrada</h1>
        <a href="/" className="text-cyan-400 hover:underline">Volver al inicio</a>
      </div>
    );
  }

  const originalModules = (proposal.modulos_seleccionados as unknown as Record<string, unknown>[]).map(dbModuleToCart);
  const presupuesto = proposal.lead.presupuesto_estimado;
  const calc = calculateProposal(cartModules, presupuesto);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">TechNova · Checkout</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gradient">Finaliza tu presupuesto</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
          <span>Empresa: <span className="text-white">{proposal.lead.empresa ?? proposal.lead.name}</span></span>
          <span>Contacto: <span className="text-white">{proposal.lead.name}</span></span>
          {presupuesto && (
            <span>Presupuesto: <span className="text-white">${presupuesto.toLocaleString('es-MX')} MXN</span></span>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: module editor */}
        <div className="lg:col-span-3 space-y-5">

          <section className="glass-card p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">
              ✅ Módulos seleccionados
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Puedes quitar módulos para ajustar el precio. Mínimo 1 módulo requerido.
            </p>
            <ModuleList modules={cartModules} onToggle={toggleModule} />
          </section>

          <section className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
                ➕ Agregar módulos
              </h2>
              <button
                onClick={() => setShowAdder(v => !v)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                {showAdder ? 'Cerrar' : 'Ver catálogo'}
              </button>
            </div>
            {showAdder && (
              <ModuleAdder
                currentModuleIds={cartModules.map(m => m.modulo_id)}
                presupuestoMax={presupuesto}
                currentTotal={calc.total}
                onAdd={addModule}
              />
            )}
            {!showAdder && (
              <p className="text-xs text-slate-500">
                {12 - cartModules.length} módulos adicionales disponibles en el catálogo.
              </p>
            )}
          </section>

        </div>

        {/* Right: price + actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="sticky top-6 space-y-4">
            <PriceBreakdown calc={calc} presupuestoMax={presupuesto} />

            {savedMsg && (
              <p className="text-xs text-green-400 text-center">✅ Presupuesto guardado localmente</p>
            )}

            <CheckoutActions
              proposalId={proposal.id}
              leadEmail={proposal.lead.email}
              total={calc.total}
              originalModules={originalModules}
              currentModules={cartModules}
              disabled={cartModules.length === 0}
              onSaved={() => { setSavedMsg(true); setTimeout(() => setSavedMsg(false), 3000); }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
