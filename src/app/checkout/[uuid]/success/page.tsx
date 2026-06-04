import type { Metadata } from 'next';
import { db } from '@/db';
import { proposals, leads, projects, orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { ProposalModule } from '@/lib/schemas/proposal';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: '¡Pago confirmado! · TechNova',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default async function CheckoutSuccessPage({ params }: PageProps) {
  const { uuid } = await params;

  const rows = await db
    .select({ proposal: proposals, lead: leads })
    .from(proposals)
    .leftJoin(leads, eq(proposals.lead_id, leads.id))
    .where(eq(proposals.id, uuid))
    .limit(1);

  const projectRows = await db
    .select().from(projects).where(eq(projects.proposal_id, uuid)).limit(1);

  const orderRows = await db
    .select().from(orders)
    .where(eq(orders.proposal_id, uuid))
    .orderBy(orders.id)
    .limit(1);

  const { proposal, lead } = rows[0] ?? {};
  const project = projectRows[0];
  const order = orderRows[0];

  if (!proposal || !lead) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Información no disponible</h1>
        <a href="/" className="text-cyan-400 hover:underline">Volver al inicio</a>
      </div>
    );
  }

  const empresa = lead.empresa ?? lead.name;
  const precioTotal = Math.round(proposal.precio_total / 100);
  const montoPagado = order ? Math.round(order.amount_cents / 100) : Math.round(precioTotal / 2);
  const montoRestante = precioTotal - montoPagado;
  const modulos = proposal.modulos_seleccionados as ProposalModule[];

  const fmtDate = (d: string | Date | null | undefined) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold text-gradient mb-2">¡Pago confirmado!</h1>
        <p className="text-slate-300 text-lg">
          {lead.name.split(' ')[0]}, tu proyecto con TechNova está en marcha.
        </p>
      </div>

      {/* Payment confirmation card */}
      <div className="glass-card p-6 mb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border-2 border-green-500">
            <span className="text-green-400 text-xl">✓</span>
          </div>
          <div>
            <p className="font-bold text-white text-lg">${montoPagado.toLocaleString('es-MX')} MXN pagados</p>
            <p className="text-sm text-slate-400">50% inicial · {empresa}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <dt className="text-slate-400">Empresa</dt>
          <dd className="text-white font-medium">{empresa}</dd>
          <dt className="text-slate-400">Contacto</dt>
          <dd className="text-white">{lead.name}</dd>
          {project && (
            <>
              <dt className="text-slate-400">Kickoff</dt>
              <dd className="text-purple-300 font-semibold">{fmtDate(project.kickoff_date)}</dd>
              <dt className="text-slate-400">Entrega estimada</dt>
              <dd className="text-white">{fmtDate(project.estimated_completion)}</dd>
            </>
          )}
          <dt className="text-slate-400">Timeline</dt>
          <dd className="text-white">{proposal.timeline_dias} días</dd>
          <dt className="text-amber-400 font-semibold">Pago restante</dt>
          <dd className="text-amber-400 font-semibold">${montoRestante.toLocaleString('es-MX')} MXN (al iniciar)</dd>
        </dl>
      </div>

      {/* Modules summary */}
      <div className="glass-card p-5 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Módulos del proyecto</h2>
        <div className="space-y-2">
          {modulos.map(m => (
            <div key={m.modulo_id} className="flex justify-between text-sm">
              <span className="text-slate-300">{m.nombre}</span>
              <span className="text-slate-400">{m.horas}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="glass-card p-5 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">📋 ¿Qué sigue?</h2>
        <ol className="space-y-3">
          {[
            'Recibirás un email de confirmación con todos los detalles.',
            'Vic te contactará en 24 horas para agendar el kickoff call.',
            `El kickoff call es el día de inicio del proyecto.`,
            `Al iniciar, deberás pagar el 50% restante ($${montoRestante.toLocaleString('es-MX')} MXN).`,
            'Tendrás actualizaciones semanales del progreso.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-300">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <a
          href={`/api/checkout/${uuid}/contract`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 font-medium text-slate-200 text-sm transition-colors"
        >
          📄 Descargar contrato de servicios (PDF)
        </a>
        <div className="flex gap-3">
          <a href="mailto:hola@tech-nova.mx"
            className="flex-1 text-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition-colors">
            📧 hola@tech-nova.mx
          </a>
          <a href="https://wa.me/527221669672"
            className="flex-1 text-center rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 px-4 py-2.5 text-sm text-green-300 transition-colors">
            💬 WhatsApp
          </a>
        </div>
      </div>

      <footer className="mt-10 text-center text-xs text-slate-500">
        TechNova · tech-nova.mx ·{' '}
        {project?.id && <span>Proyecto: {project.id.slice(0, 8).toUpperCase()}</span>}
      </footer>
    </div>
  );
}
