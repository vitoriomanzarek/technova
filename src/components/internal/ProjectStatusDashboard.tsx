import type { BacklogData, ItemStatus, SubItem } from '@/lib/backlog-parser';
import type { BitacoraSession } from '@/lib/bitacora-parser';
import type { Decision } from '@/lib/decision-parser';
import PhaseProgressCard, { STATUS_META } from '@/components/internal/PhaseProgressCard';
import BacklogItemList from '@/components/internal/BacklogItemList';
import SprintStatusPanel from '@/components/internal/SprintStatusPanel';
import NextStepsBanner from '@/components/internal/NextStepsBanner';

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {hint && <span className="text-[11px] text-slate-500">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="glass-card p-4">
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${accent ?? 'text-white'}`}>{value}</p>
    </div>
  );
}

function progressOf(items: SubItem[]): { pct: number; status: ItemStatus; done: number; total: number } {
  const total = items.length;
  const done = items.filter((i) => i.status === 'done').length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  let status: ItemStatus = 'not_started';
  if (pct === 100) status = 'done';
  else if (done > 0) status = 'in_progress';
  return { pct, status, done, total };
}

export default function ProjectStatusDashboard({
  backlog,
  sessions,
  decisions,
  daysSinceStart,
  projectStartDate,
  today,
  filesAvailable,
}: {
  backlog: BacklogData;
  sessions: BitacoraSession[];
  decisions: Decision[];
  daysSinceStart: number;
  projectStartDate: string;
  today: string;
  filesAvailable: boolean;
}) {
  const faseA = backlog.subItems.filter((i) => /^A\.\d/.test(i.id));
  const opItems = backlog.subItems.filter((i) => /^OP-\d/.test(i.id));
  const secSub = backlog.subItems.filter((i) => /^SEC-\d/.test(i.id));

  const faseAProg = progressOf(faseA);
  const opProg = progressOf(opItems);

  // Áreas de Fase B aún por venir (B.1, B.2, B.3, B.5). B.4 ya está en
  // producción → se cuenta en el global, no en "lo que viene".
  const faseBRows = backlog.phases.filter(
    (p) => /^B\.\d/.test(p.phase) && p.phase !== 'B.4',
  );
  const faseBPct =
    faseBRows.length === 0
      ? 0
      : Math.round(
          faseBRows.reduce((s, p) => s + Math.max(0, p.progress), 0) / faseBRows.length,
        );
  const faseBStatus: ItemStatus = faseBPct === 100 ? 'done' : faseBPct > 0 ? 'in_progress' : 'not_started';

  const sprintLabel = `Sprint SEC — ${backlog.secProgress.done}/${backlog.secProgress.total} (${backlog.secProgress.pct}%)`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-purple-300">
          TechNova · Internal · CEO View
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-gradient sm:text-4xl">
          Project Status Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Estado del proyecto en vivo, leído de{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">BACKLOG_MASTER.md</code>,{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">BITACORA.md</code> y{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">DECISION_LOG.md</code>.
        </p>
        <nav className="mt-3 text-xs">
          <a href="/internal/architecture" className="text-cyan-300 hover:text-cyan-200">
            ← Architecture Dashboard
          </a>
        </nav>
      </header>

      {!filesAvailable && (
        <div className="mb-8 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-200">
          ⚠️ Los archivos <code>.md</code> no están disponibles en este entorno
          (probablemente producción/Vercel). Esta página está pensada para uso
          local de Vic. Los paneles aparecen vacíos.
        </div>
      )}

      {/* Panel 1 — Resumen Ejecutivo */}
      <Section title="📊 Resumen Ejecutivo">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Completado global"
            value={`${backlog.global.pct}%`}
            accent="text-gradient"
          />
          <Stat
            label="Sprint actual"
            value={`${backlog.secProgress.pct}%`}
            accent="text-green-300"
          />
          <Stat label="Días de proyecto" value={`D-${daysSinceStart}`} />
          <Stat
            label="Última actualización"
            value={backlog.lastUpdated ?? '—'}
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {sprintLabel} · {backlog.global.done}/{backlog.global.total} checklist items ✅ ·
          inicio {projectStartDate} · hoy {today}
        </p>
      </Section>

      {/* Panel 2 — Progreso por Fase */}
      <Section title="🚀 Progreso por Fase" hint="datos en vivo de BACKLOG_MASTER.md">
        <div className="grid gap-4 md:grid-cols-2">
          <PhaseProgressCard
            title="Fase A — Foundation & Architecture"
            subtitle="May 20 – Jun 2, 2026"
            statusLabel={faseAProg.pct === 100 ? '✅ COMPLETADA' : `${faseAProg.pct}%`}
            status={faseAProg.status}
            progress={faseAProg.pct}
          >
            <BacklogItemList items={faseA} summaryLabel={`${faseAProg.done}/${faseAProg.total} secciones`} />
          </PhaseProgressCard>

          <PhaseProgressCard
            title="Pendientes Operativos (OP)"
            subtitle="tareas de operación día a día"
            statusLabel={`${opProg.done}/${opProg.total} resueltos`}
            status={opProg.pct === 100 ? 'done' : opProg.done > 0 ? 'in_progress' : 'not_started'}
            progress={opProg.pct}
          >
            <BacklogItemList items={opItems} summaryLabel={`${opProg.done}/${opProg.total} items`} />
          </PhaseProgressCard>

          <PhaseProgressCard
            title="Sprint SEC — Hardening"
            subtitle="bloqueante antes de invertir en tráfico"
            statusLabel={`${backlog.secProgress.done}/${backlog.secProgress.total}`}
            status={backlog.secProgress.pct === 100 ? 'done' : 'in_progress'}
            progress={backlog.secProgress.pct}
          >
            <BacklogItemList items={secSub} summaryLabel="ver items SEC" />
          </PhaseProgressCard>

          <PhaseProgressCard
            title="Fase B — Growth & Credibility"
            subtitle="Jul – Sep 2026 · imagery, marketing, NOVA AI"
            statusLabel={faseBPct === 0 ? '🔴 NOT STARTED' : `${faseBPct}%`}
            status={faseBStatus}
            progress={faseBPct}
          >
            <BacklogItemList
              items={faseBRows.map((p) => ({
                id: p.phase,
                title: p.focus,
                status: p.status,
              }))}
              summaryLabel={`${faseBRows.length} áreas`}
            />
          </PhaseProgressCard>
        </div>
      </Section>

      {/* Panel 3 — Sprint Actual SEC */}
      <Section title="🔒 Sprint Actual — SEC">
        <SprintStatusPanel items={backlog.secItems} progress={backlog.secProgress} />
      </Section>

      {/* Panel 4 — Fase B: lo que viene */}
      <Section title="🌱 Fase B — Lo que viene">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {faseBRows.map((area) => {
            const meta = STATUS_META[area.status];
            return (
              <div key={area.phase} className="glass-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-cyan-200">
                    {area.phase}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}>
                    {area.statusLabel || meta.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white">{area.focus}</p>
                <p className="mt-1 text-[11px] text-slate-500">{area.duration}</p>
              </div>
            );
          })}
        </div>
        <div className="glass-card mt-4 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Success metrics Fase B
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {['500+ visitors/mes', '30+ leads/mes', 'conversión >20%', 'NOVA AI >30%'].map((m) => (
              <span key={m} className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                {m}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Panel 5 — Próximos 3 pasos */}
      <Section title="🎯 Próximos 3 pasos">
        <NextStepsBanner steps={backlog.nextSteps} />
      </Section>

      {/* Panel 6 — Bitácora: últimas sesiones */}
      <Section title="📖 Bitácora — Últimas sesiones" hint="BITACORA.md">
        <div className="space-y-3">
          {sessions.length === 0 && (
            <p className="text-sm text-slate-500">Sin sesiones parseadas.</p>
          )}
          {sessions.map((s, i) => {
            const meta = STATUS_META[
              s.status === 'completed'
                ? 'done'
                : s.status === 'blocked'
                  ? 'not_started'
                  : s.status === 'in-progress'
                    ? 'in_progress'
                    : 'pending'
            ];
            return (
              <div key={`${s.date}-${i}`} className="glass-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{s.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}>
                    {s.statusLabel || meta.label}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {s.date}
                  {s.owner ? ` · ${s.owner}` : ''}
                </p>
                {s.summary && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.summary}</p>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Panel 7 — Decisiones activas */}
      <Section title="🧭 Decisiones activas" hint={`${decisions.length} en DECISION_LOG.md`}>
        <div className="grid gap-3 md:grid-cols-2">
          {decisions.slice(-5).reverse().map((d) => (
            <div key={d.id} className="glass-card p-4">
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
              <p className="mt-2 text-[10px] text-slate-600">
                {d.date} · {d.owner}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
