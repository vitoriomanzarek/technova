import type { Metadata } from 'next';
import { getProjectStatus } from '@/lib/bitacora-parser';
import { getActiveDecisionsSafe } from '@/lib/decision-parser';
import ProgressCard from '@/components/admin/ProgressCard';
import TimelineView from '@/components/admin/TimelineView';
import BlockersAlert from '@/components/admin/BlockersAlert';
import VelocityStats from '@/components/admin/VelocityStats';
import RefreshButton from '@/components/admin/RefreshButton';

// Lee BITACORA.md fresco en cada request — nunca cachear.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Status · TechNova',
  robots: { index: false, follow: false },
};

export default async function ProjectStatusPage() {
  const status = await getProjectStatus();
  const decisions = await getActiveDecisionsSafe();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            TechNova · Internal
          </p>
          <h1 className="mt-1 text-3xl font-extrabold text-gradient sm:text-4xl">
            Project Status Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Vive de{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">
              docs/BITACORA.md
            </code>{' '}
            · {decisions.length} decisiones activas en{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">
              DECISION_LOG.md
            </code>
          </p>
        </div>
        <RefreshButton />
      </header>

      {/* Progreso general */}
      <section className="glass-card mb-6 p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            📊 Progreso general
          </h2>
          <span className="text-2xl font-bold text-gradient">
            {status.overallPercent}%
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 transition-all duration-700 animate-progress-glow"
            style={{ width: `${status.overallPercent}%` }}
          />
        </div>
      </section>

      {/* Fases */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        {status.phases.map((phase) => (
          <ProgressCard key={phase.number} phase={phase} />
        ))}
      </section>

      {/* Blockers */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-white">⚠️ Blockers</h2>
        <BlockersAlert blockers={status.blockers} />
      </section>

      {/* Velocity */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-white">
          📈 Velocity & métricas
        </h2>
        <VelocityStats velocity={status.velocity} />
      </section>

      {/* Timeline */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">
          📅 Timeline (últimas 10 acciones)
        </h2>
        <div className="glass-card p-6">
          <TimelineView events={status.events} limit={10} />
        </div>
      </section>

      <footer className="border-t border-white/10 pt-4 text-xs text-slate-500">
        Generado en tiempo de lectura ·{' '}
        {new Date(status.generatedAt).toLocaleString('es-MX')} ·{' '}
        {status.events.length} eventos parseados
      </footer>
    </div>
  );
}
