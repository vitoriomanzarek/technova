import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Parser de docs/BITACORA.md → estructuras tipadas para el dashboard
 * /admin/project-status. Todo se lee fresco desde disco en cada render
 * (la página es force-dynamic), así que editar BITACORA.md y refrescar
 * muestra el estado nuevo sin rebuild.
 */

export type EventStatus = 'completed' | 'in-progress' | 'blocked' | 'pending';

export type BitacoraTask = {
  name: string;
  completed: boolean;
};

export type BitacoraEvent = {
  date: string; // "2026-05-20"
  title: string;
  status: EventStatus;
  statusLabel: string; // texto crudo después del emoji, ej. "EN PRODUCCIÓN"
  description: string;
  tasks: BitacoraTask[];
};

export type Blocker = {
  date: string;
  eventTitle: string;
  text: string;
  severity: 'blocked' | 'warning';
};

export type Phase = {
  number: number;
  name: string;
  status: EventStatus;
  completedTasks: number;
  totalTasks: number;
  percent: number;
  startDate: string | null;
  completedDate: string | null;
  tasks: BitacoraTask[];
};

export type VelocityStats = {
  totalTasks: number;
  completedTasks: number;
  tasksPerWeek: number;
  spanDays: number;
  firstDate: string | null;
  lastDate: string | null;
  projectedCompletion: string | null;
};

export type ProjectStatus = {
  events: BitacoraEvent[];
  phases: Phase[];
  blockers: Blocker[];
  velocity: VelocityStats;
  overallPercent: number;
  generatedAt: string;
};

const BITACORA_PATH = path.join(process.cwd(), 'BITACORA.md');

// Nombres de fase (los títulos descriptivos viven en los kickoff docs, no en
// BITACORA). El status, fechas y tareas se derivan de los eventos parseados.
const PHASE_NAMES: Record<number, string> = {
  1: 'Memoria & Fundamentos',
  2: 'Documentación Técnica',
  3: 'Operaciones & Seguridad',
  4: 'Polish & Hardening',
};

const COMPLETED_EMOJIS = ['✅'];
const BLOCKED_EMOJIS = ['🔴', '⛔', '🚫'];
const IN_PROGRESS_EMOJIS = ['⏳', '🔄', '🚧'];

function classifyStatus(raw: string): EventStatus {
  if (COMPLETED_EMOJIS.some((e) => raw.includes(e))) return 'completed';
  if (BLOCKED_EMOJIS.some((e) => raw.includes(e))) return 'blocked';
  if (IN_PROGRESS_EMOJIS.some((e) => raw.includes(e))) return 'in-progress';
  return 'pending';
}

function stripStatusEmoji(raw: string): string {
  return raw
    .replace(/[✅🔴⛔🚫⏳🔄🚧]/g, '')
    .replace(/\*\*/g, '')
    .trim();
}

// Reconoce items de checklist markdown y listas con marcador de estado emoji.
function parseTaskLine(line: string): BitacoraTask | null {
  const trimmed = line.trim();

  // - [x] / - [ ]
  const checkbox = trimmed.match(/^[-*]\s+\[([ xX])\]\s+(.*)$/);
  if (checkbox) {
    return {
      completed: checkbox[1].toLowerCase() === 'x',
      name: checkbox[2].replace(/\*\*/g, '').trim(),
    };
  }

  // - ✅ texto / - 🔴 texto / - �en línea
  const emojiList = trimmed.match(/^[-*]\s+([✅🔴⛔🚫⏳🔄🚧])\s*\*{0,2}(.*)$/);
  if (emojiList) {
    return {
      completed: COMPLETED_EMOJIS.includes(emojiList[1]),
      name: emojiList[2].replace(/\*\*/g, '').trim(),
    };
  }

  return null;
}

/** Parsea el markdown crudo de BITACORA en eventos tipados. */
export function parseBitacoraContent(markdown: string): BitacoraEvent[] {
  const lines = markdown.split(/\r?\n/);
  const events: BitacoraEvent[] = [];

  let current: BitacoraEvent | null = null;
  const descriptionLines: string[] = [];

  const flush = () => {
    if (!current) return;
    current.description = descriptionLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, 600);
    events.push(current);
  };

  for (const line of lines) {
    // Encabezado de evento: ## [2026-05-20] - Título
    const header = line.match(/^##\s+\[(\d{4}-\d{2}-\d{2})\]\s*-?\s*(.*)$/);
    if (header) {
      flush();
      descriptionLines.length = 0;
      current = {
        date: header[1],
        title: header[2].trim() || '(sin título)',
        status: 'pending',
        statusLabel: '',
        description: '',
        tasks: [],
      };
      continue;
    }

    if (!current) continue;

    // Status line: **Status:** ✅ EN PRODUCCIÓN
    const statusLine = line.match(/^\*\*Status:\*\*\s*(.*)$/i);
    if (statusLine) {
      current.status = classifyStatus(statusLine[1]);
      current.statusLabel = stripStatusEmoji(statusLine[1]);
      continue;
    }

    const task = parseTaskLine(line);
    if (task) {
      current.tasks.push(task);
      continue;
    }

    // Texto de descripción (evita líneas de metadata y subtítulos de tabla).
    if (
      !/^\*\*Realizado por:\*\*/i.test(line) &&
      !/^#{3,}\s/.test(line) &&
      !/^\|/.test(line) &&
      !/^```/.test(line)
    ) {
      if (line.trim()) descriptionLines.push(line.trim());
    }
  }

  flush();
  return events;
}

/** Deriva fases (1-4) a partir de los eventos que mencionan "FASE N". */
export function derivePhases(events: BitacoraEvent[]): Phase[] {
  const byPhase = new Map<number, BitacoraEvent[]>();

  for (const ev of events) {
    const match = ev.title.match(/FASE\s+(\d+)/i);
    if (!match) continue;
    const n = Number(match[1]);
    if (!byPhase.has(n)) byPhase.set(n, []);
    byPhase.get(n)!.push(ev);
  }

  const numbers = new Set<number>([
    ...Object.keys(PHASE_NAMES).map(Number),
    ...byPhase.keys(),
  ]);

  return [...numbers]
    .sort((a, b) => a - b)
    .map((number) => {
      const phaseEvents = byPhase.get(number) ?? [];
      const tasks = phaseEvents.flatMap((e) => e.tasks);
      const completedTasks = tasks.filter((t) => t.completed).length;
      const totalTasks = tasks.length;

      const dates = phaseEvents.map((e) => e.date).sort();
      const isCompleted = phaseEvents.some(
        (e) =>
          e.status === 'completed' &&
          /(COMPLETAD|ENTREGAD|EN PRODUCCIÓN|APLICAD|IMPLEMENTAD)/i.test(
            `${e.title} ${e.statusLabel}`,
          ),
      );
      const isBlocked = phaseEvents.some((e) => e.status === 'blocked');

      let status: EventStatus;
      if (isCompleted) status = 'completed';
      else if (isBlocked) status = 'blocked';
      else if (phaseEvents.length > 0) status = 'in-progress';
      else status = 'pending';

      let percent: number;
      if (status === 'completed') percent = 100;
      else if (totalTasks > 0)
        percent = Math.round((completedTasks / totalTasks) * 100);
      else if (status === 'in-progress') percent = 20;
      else percent = 0;

      return {
        number,
        name: PHASE_NAMES[number] ?? `Fase ${number}`,
        status,
        completedTasks,
        totalTasks,
        percent,
        startDate: dates[0] ?? null,
        completedDate: status === 'completed' ? (dates.at(-1) ?? null) : null,
        tasks,
      };
    });
}

/** Busca blockers activos: [BLOQUEADOR], status blocked, o líneas ⚠️. */
export function extractBlockers(events: BitacoraEvent[]): Blocker[] {
  const blockers: Blocker[] = [];

  for (const ev of events) {
    if (ev.status === 'blocked') {
      blockers.push({
        date: ev.date,
        eventTitle: ev.title,
        text: ev.statusLabel || 'Evento marcado como bloqueado',
        severity: 'blocked',
      });
    }

    const haystack = `${ev.title}\n${ev.description}`;
    const bloqueadorMatches = haystack.match(/\[BLOQUEADOR\][^\n]*/gi);
    if (bloqueadorMatches) {
      for (const m of bloqueadorMatches) {
        blockers.push({
          date: ev.date,
          eventTitle: ev.title,
          text: m.trim(),
          severity: 'blocked',
        });
      }
    }
  }

  return blockers;
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + Math.ceil(days));
  return d.toISOString().slice(0, 10);
}

export function computeVelocity(
  events: BitacoraEvent[],
  phases: Phase[],
): VelocityStats {
  const allTasks = events.flatMap((e) => e.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.completed).length;

  const dates = events
    .map((e) => e.date)
    .filter(Boolean)
    .sort();
  const firstDate = dates[0] ?? null;
  const lastDate = dates.at(-1) ?? null;

  const spanDays = firstDate && lastDate ? daysBetween(firstDate, lastDate) : 0;
  const weeks = Math.max(spanDays / 7, 1 / 7); // mínimo ~1 día para no dividir por 0
  const tasksPerWeek = Math.round((completedTasks / weeks) * 10) / 10;

  // Proyección: tareas restantes en fases no completadas / velocidad.
  const remainingTasks = phases
    .filter((p) => p.status !== 'completed')
    .reduce((sum, p) => sum + Math.max(0, p.totalTasks - p.completedTasks), 0);

  const tasksPerDay = tasksPerWeek / 7;
  let projectedCompletion: string | null = null;
  if (remainingTasks > 0 && tasksPerDay > 0 && lastDate) {
    projectedCompletion = addDays(lastDate, remainingTasks / tasksPerDay);
  }

  return {
    totalTasks,
    completedTasks,
    tasksPerWeek,
    spanDays,
    firstDate,
    lastDate,
    projectedCompletion,
  };
}

/** Lee BITACORA.md de disco y devuelve el estado completo del proyecto. */
export async function getProjectStatus(): Promise<ProjectStatus> {
  const markdown = await readFile(BITACORA_PATH, 'utf8');
  const events = parseBitacoraContent(markdown);
  const phases = derivePhases(events);
  const blockers = extractBlockers(events);
  const velocity = computeVelocity(events, phases);

  const overallPercent = phases.length
    ? Math.round(phases.reduce((s, p) => s + p.percent, 0) / phases.length)
    : 0;

  return {
    events,
    phases,
    blockers,
    velocity,
    overallPercent,
    generatedAt: new Date().toISOString(),
  };
}
