import type { Metadata } from 'next';
import { getBacklogDataSafe } from '@/lib/backlog-parser';
import { getRecentSessionsSafe } from '@/lib/bitacora-parser';
import { getActiveDecisionsSafe } from '@/lib/decision-parser';
import ProjectStatusDashboard from '@/components/internal/ProjectStatusDashboard';

// Lee los .md frescos en cada request (no en build) para reflejar ediciones.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Status · TechNova',
  robots: { index: false, follow: false },
};

// Inicio del proyecto = arranque de Fase A (ver BACKLOG_MASTER.md, timeline Fase A).
const PROJECT_START = '2026-05-20';

function daysBetween(fromIso: string, to: Date): number {
  const ms = to.getTime() - new Date(fromIso).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export default async function ProjectStatusPage() {
  const [backlog, sessions, decisions] = await Promise.all([
    getBacklogDataSafe(),
    getRecentSessionsSafe(3),
    getActiveDecisionsSafe(),
  ]);

  const now = new Date();
  const daysSinceStart = daysBetween(PROJECT_START, now);
  const today = now.toISOString().slice(0, 10);
  const filesAvailable = backlog.phases.length > 0 || backlog.secItems.length > 0;

  return (
    <ProjectStatusDashboard
      backlog={backlog}
      sessions={sessions}
      decisions={decisions}
      daysSinceStart={daysSinceStart}
      projectStartDate={PROJECT_START}
      today={today}
      filesAvailable={filesAvailable}
    />
  );
}
