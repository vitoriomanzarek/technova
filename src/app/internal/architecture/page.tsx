import type { Metadata } from 'next';
import { getActiveDecisionsSafe } from '@/lib/decision-parser';
import TechStackGrid from '@/components/internal/TechStackGrid';
import ArchitectureDiagram from '@/components/internal/ArchitectureDiagram';
import DataFlowVisualization from '@/components/internal/DataFlowVisualization';
import IntegrationMap from '@/components/internal/IntegrationMap';
import FolderTree from '@/components/internal/FolderTree';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Architecture · TechNova',
  robots: { index: false, follow: false },
};

const ENV_VARS: { group: string; vars: { name: string; note: string }[] }[] = [
  {
    group: 'Producción',
    vars: [
      { name: 'DATABASE_URL', note: 'Neon (pooled)' },
      { name: 'DATABASE_URL_UNPOOLED', note: 'Neon (migraciones)' },
      { name: 'RESEND_API_KEY', note: 'email transaccional' },
      { name: 'RESEND_FROM_EMAIL', note: 'remitente verificado' },
      { name: 'STRIPE_SECRET_KEY', note: 'pagos (server)' },
      { name: 'STRIPE_WEBHOOK_SECRET', note: 'verificación HMAC' },
      { name: 'UPSTASH_REDIS_REST_URL', note: 'rate limiting' },
      { name: 'UPSTASH_REDIS_REST_TOKEN', note: 'rate limiting' },
      { name: 'ADMIN_DASHBOARD_TOKEN', note: 'gate /admin · /internal' },
    ],
  },
  {
    group: 'Públicas (NEXT_PUBLIC_*)',
    vars: [
      { name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', note: 'Stripe.js (client)' },
      { name: 'NEXT_PUBLIC_BASE_URL', note: 'success/cancel URLs' },
    ],
  },
];

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-6">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

export default async function ArchitecturePage() {
  const decisions = await getActiveDecisionsSafe();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
          TechNova · Internal · Developers
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-gradient sm:text-4xl">
          Architecture Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Stack, flujos e integraciones del sistema. Punto de entrada para
          developers nuevos.
        </p>
        <nav className="mt-3 text-xs">
          <a
            href="/internal/project-status"
            className="text-cyan-300 hover:text-cyan-200"
          >
            Project Status Dashboard →
          </a>
        </nav>
      </header>

      <Section title="🛠️ Tech Stack">
        <TechStackGrid />
      </Section>

      <Section title="🏗️ System Architecture">
        <ArchitectureDiagram />
      </Section>

      <Section title="📊 Data Flows">
        <DataFlowVisualization />
      </Section>

      <Section title="🔗 Integraciones externas">
        <IntegrationMap />
      </Section>

      <Section title="📁 Estructura de carpetas">
        <FolderTree />
      </Section>

      <Section id="key-decisions" title="🎯 Decisiones clave">
        <div className="grid gap-3 md:grid-cols-2">
          {decisions.map((d) => (
            <div
              key={d.id}
              id={d.id}
              className="glass-card scroll-mt-6 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-cyan-200">
                  {d.id}: {d.title}
                </p>
                {d.statusLabel && (
                  <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                    {d.statusLabel}
                  </span>
                )}
              </div>
              {d.summary && (
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {d.summary}
                </p>
              )}
              <p className="mt-2 text-[10px] text-slate-600">
                {d.date} · {d.owner}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Fuente:{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">
            DECISION_LOG.md
          </code>{' '}
          · {decisions.length} decisiones activas
        </p>
      </Section>

      <Section title="🔐 Environment Variables">
        <div className="grid gap-4 md:grid-cols-2">
          {ENV_VARS.map((group) => (
            <div key={group.group} className="glass-card p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {group.group}
              </p>
              <ul className="space-y-1.5">
                {group.vars.map((v) => (
                  <li
                    key={v.name}
                    className="flex items-baseline justify-between gap-2"
                  >
                    <code className="font-mono text-xs text-emerald-300">
                      {v.name}
                    </code>
                    <span className="text-[11px] text-slate-500">{v.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
