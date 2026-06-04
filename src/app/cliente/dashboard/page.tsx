import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateClientToken } from '@/lib/client-auth';
import { db } from '@/db';
import { projects, proposals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProjectStatus from '@/components/client/ProjectStatus';
import TimelineVisual from '@/components/client/TimelineVisual';
import ResourcesList from '@/components/client/ResourcesList';
import PaymentSection from '@/components/client/PaymentSection';
import { CLIENT_TOKEN_COOKIE } from '@/lib/client-auth/constants';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mi Proyecto · TechNova',
  robots: { index: false, follow: false },
};

export default async function ClientDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_TOKEN_COOKIE)?.value;

  if (!token) redirect('/');

  const projectId = await validateClientToken(token);
  if (!projectId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Acceso no válido</h1>
        <p className="text-slate-400 mb-6">Tu link de acceso expiró o no es válido. Solicita uno nuevo a tu asesor.</p>
        <a href="mailto:hola@tech-nova.mx" className="text-cyan-400 hover:underline">hola@tech-nova.mx</a>
      </div>
    );
  }

  const projectRows = await db
    .select({ project: projects, proposal: proposals })
    .from(projects)
    .leftJoin(proposals, eq(projects.proposal_id, proposals.id))
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!projectRows.length) redirect('/');

  const { project, proposal } = projectRows[0];

  // Track first dashboard access
  if (!project.client_dashboard_accessed_at) {
    db.update(projects)
      .set({ client_dashboard_accessed_at: new Date() })
      .where(eq(projects.id, projectId))
      .catch(() => {});
  }

  const modulos = (project.modules_json as Array<{ nombre: string; horas: number }>) ?? [];
  const precioTotal = Math.round(project.total_amount / 100);
  const proposalId = project.proposal_id;
  const calendlyUrl = process.env.CALENDLY_URL ?? 'https://calendly.com/technova/kickoff';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">TechNova · Tu proyecto</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gradient">
          Bienvenido, {project.empresa} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Aquí puedes seguir el progreso de tu proyecto en tiempo real.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-5">
          <ProjectStatus
            empresa={project.empresa}
            status={project.status}
            paymentStatus={project.payment_status}
            modulos={modulos}
            timelineDias={proposal?.timeline_dias ?? 0}
            kickoffDate={project.kickoff_date?.toISOString().split('T')[0] ?? null}
          />

          <TimelineVisual
            kickoffDate={project.kickoff_date}
            timelineDias={proposal?.timeline_dias ?? 21}
          />

          <ResourcesList
            proposalId={proposalId}
            repositoryUrl={project.repository_url ?? null}
            figmaUrl={project.figma_url ?? null}
            assetsUrl={project.assets_url ?? null}
            documentationUrl={project.documentation_url ?? null}
          />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Kickoff booking */}
          <div className="glass-card p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">📅 Reservar kickoff call</h2>
            {project.kickoff_call_booked_at ? (
              <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-center">
                <p className="text-green-400 font-semibold text-sm">✅ Kickoff agendado</p>
                {project.kickoff_call_date && (
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(project.kickoff_call_date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 mb-3">
                  Agenda tu reunión de inicio con Vic (30 min). Elige el horario que mejor te acomode.
                </p>
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-4 py-3 font-bold text-white text-sm transition-all"
                >
                  📅 Reservar Kickoff Call
                </a>
              </>
            )}
          </div>

          <PaymentSection
            paymentStatus={project.payment_status}
            precioTotal={precioTotal}
            proposalId={proposalId}
            kickoffDate={project.kickoff_date?.toISOString().split('T')[0] ?? null}
          />

          {/* Contact */}
          <div className="glass-card p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">💬 Contacto directo</h2>
            <div className="space-y-2">
              <a href="mailto:hola@tech-nova.mx"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                <span>📧</span> hola@tech-nova.mx
              </a>
              <a href="https://wa.me/527221669672"
                className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                <span>💬</span> +52 722 166 9672 (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
