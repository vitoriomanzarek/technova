import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Parser de BACKLOG_MASTER.md → estado tipado del proyecto.
 *
 * Extrae cuatro cosas:
 *   1. La tabla "EXECUTIVE SUMMARY" (fases + progreso curado por Vic).
 *   2. Los items del sprint SEC (`### SEC-N: …` + su `**Status:**`).
 *   3. El progreso global contando `- [x]` vs `- [ ]` en todo el archivo.
 *   4. Una lista derivada de "próximos pasos" (SEC pendientes + 1ª área B).
 *
 * Mismo patrón que `decision-parser.ts`: fs + regex, sin dependencias extra.
 * No intenta parsear el 100% del markdown — solo lo necesario para el dashboard.
 */

export type ItemStatus = 'done' | 'in_progress' | 'pending' | 'not_started';

/** Clasifica un texto con emojis/keywords a un status normalizado. */
export function classifyStatus(raw: string): ItemStatus {
  const s = raw.toUpperCase();
  if (/✅|🟢|DONE|COMPLETAD|EN PRODUCCIÓN|RESUELTO/.test(s)) return 'done';
  if (/🔄|IN PROGRESS|EN PROGRESO|PARCIAL/.test(s)) return 'in_progress';
  if (/🟡|🟠|PENDIENTE|SCHEDULED|MEDIA/.test(s)) return 'pending';
  if (/🔴|NO INICIADO|BLOQUEAD|NOT STARTED/.test(s)) return 'not_started';
  return 'pending';
}

export type PhaseRow = {
  phase: string; // "A", "B.4", "SEC", …
  statusLabel: string; // "✅ COMPLETADA" sin markdown
  status: ItemStatus;
  duration: string;
  focus: string;
  progress: number; // 0-100; -1 si no aplica ("—")
};

export type SecItem = {
  id: string; // "SEC-1"
  title: string;
  statusLabel: string;
  status: ItemStatus;
  priority: string | null; // "🔴 CRÍTICA", "🟠 ALTA", …
  estimate: string | null;
};

export type SubItem = {
  id: string; // "A.1", "B.1.1", "OP-3", "SEC-2"
  title: string;
  status: ItemStatus;
};

export type NextStep = {
  label: string;
  detail: string;
  priority: 'CRÍTICA' | 'ALTA' | 'MEDIA';
  estimate: string | null;
};

export type BacklogData = {
  lastUpdated: string | null;
  global: { done: number; total: number; pct: number };
  phases: PhaseRow[];
  secItems: SecItem[];
  secProgress: { done: number; total: number; pct: number };
  subItems: SubItem[];
  nextSteps: NextStep[];
};

const BACKLOG_PATH = path.join(process.cwd(), 'BACKLOG_MASTER.md');

/** Quita emojis de estado y markdown de negrita de una etiqueta. */
function cleanLabel(raw: string): string {
  return raw
    .replace(/\*\*/g, '')
    .replace(/[✅🟢🟡🟠🔴🔄⚠️⏳🎉]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseLastUpdated(markdown: string): string | null {
  const m = markdown.match(/\*\*Última actualización:\*\*\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i);
  return m ? m[1] : null;
}

/** Cuenta `- [x]` vs `- [ ]` en un bloque de markdown. */
function countCheckboxes(block: string): { done: number; total: number } {
  const done = (block.match(/^\s*-\s*\[x\]/gim) || []).length;
  const open = (block.match(/^\s*-\s*\[ \]/gim) || []).length;
  return { done, total: done + open };
}

function pct(done: number, total: number): number {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

/**
 * Parsea la tabla del EXECUTIVE SUMMARY:
 * `| **A** | ✅ COMPLETADA | May 20 … | Foundation | 100% |`
 */
export function parsePhaseTable(markdown: string): PhaseRow[] {
  const rows: PhaseRow[] = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    // Fila de tabla con exactamente 5 columnas de datos.
    if (!/^\|/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 5) continue;
    const phaseRaw = cells[0];
    // El header y el separador no tienen un nombre de fase tipo **X**.
    const phaseMatch = phaseRaw.match(/\*\*(.+?)\*\*/);
    if (!phaseMatch) continue;
    const progRaw = cells[4];
    const progNum = progRaw.match(/(\d+)\s*%/);
    rows.push({
      phase: phaseMatch[1].trim(),
      statusLabel: cleanLabel(cells[1]),
      status: classifyStatus(cells[1]),
      duration: cells[2],
      focus: cells[3],
      progress: progNum ? parseInt(progNum[1], 10) : -1,
    });
  }
  return rows;
}

/**
 * Parsea los items del sprint SEC. Busca headers `### SEC-N: Título`
 * y la primera línea `**Status:** …` debajo de cada uno.
 */
export function parseSecItems(markdown: string): SecItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: SecItem[] = [];
  let current: SecItem | null = null;

  for (const line of lines) {
    const header = line.match(/^###\s+(SEC-\d+):\s*(.*)$/);
    if (header) {
      current = {
        id: header[1],
        title: cleanLabel(header[2]),
        statusLabel: '',
        status: 'not_started',
        priority: null,
        estimate: null,
      };
      items.push(current);
      continue;
    }
    if (!current) continue;

    const status = line.match(/^\*\*Status:\*\*\s*(.*)$/i);
    if (status && !current.statusLabel) {
      // La línea puede traer Status | Priority | Estimado en un solo renglón.
      const segments = status[1].split('|').map((s) => s.trim());
      current.statusLabel = cleanLabel(segments[0]);
      current.status = classifyStatus(segments[0]);
      for (const seg of segments.slice(1)) {
        const prio = seg.match(/\*\*Priority:\*\*\s*(.*)/i);
        if (prio) current.priority = prio[1].replace(/\*\*/g, '').trim();
        const est = seg.match(/\*\*Estimado:\*\*\s*(.*)/i);
        if (est) current.estimate = est[1].replace(/\*\*/g, '').trim();
      }
      continue;
    }
  }
  return items;
}

/**
 * Parsea sub-items con id (`### A.1 …`, `#### B.1.1 …`, `### OP-3 …`, `### SEC-2 …`).
 * El status sale del emoji en el propio header, o si no, de la primera línea
 * `**Status:**` que le sigue antes del próximo header.
 */
export function parseSubItems(markdown: string): SubItem[] {
  const lines = markdown.split(/\r?\n/);
  const items: SubItem[] = [];
  let current: SubItem | null = null;
  let statusFromHeader = false;

  const idPattern = /^#{3,4}\s+((?:[ABC]\.\d+(?:\.\d+)?)|SEC-\d+|OP-\d+)\b[:\s]?\s*(.*)$/;

  for (const line of lines) {
    const header = line.match(idPattern);
    if (header) {
      const rest = header[2];
      const hasEmoji = /[✅🟢🟡🟠🔴🔄⚠️]/.test(rest);
      current = {
        id: header[1],
        title: cleanLabel(rest) || header[1],
        status: hasEmoji ? classifyStatus(rest) : 'not_started',
      };
      statusFromHeader = hasEmoji;
      items.push(current);
      continue;
    }
    if (!current || statusFromHeader) continue;

    const status = line.match(/^\*\*Status:\*\*\s*(.*)$/i);
    if (status) {
      current.status = classifyStatus(status[1].split('|')[0]);
      statusFromHeader = true; // ya tenemos status; ignora el resto del bloque
    }
  }
  return items;
}

/** Mapea un label de prioridad SEC a uno de los tres niveles del banner. */
function priorityLevel(priority: string | null): NextStep['priority'] {
  const s = (priority || '').toUpperCase();
  if (/CRÍTICA|CRITICA/.test(s)) return 'CRÍTICA';
  if (/ALTA/.test(s)) return 'ALTA';
  return 'MEDIA';
}

/**
 * Deriva los próximos pasos accionables: items SEC no terminados (ordenados por
 * prioridad) + la primera área de Fase B agendada. Top 3.
 */
export function deriveNextSteps(secItems: SecItem[], phases: PhaseRow[]): NextStep[] {
  const order: Record<NextStep['priority'], number> = { CRÍTICA: 0, ALTA: 1, MEDIA: 2 };
  const pendingSec = secItems
    .filter((s) => s.status !== 'done')
    .map<NextStep>((s) => ({
      label: `${s.id}: ${s.title}`,
      detail: s.statusLabel || 'Pendiente',
      priority: priorityLevel(s.priority),
      estimate: s.estimate,
    }))
    .sort((a, b) => order[a.priority] - order[b.priority]);

  const steps = [...pendingSec];

  // Primera área de Fase B no iniciada (B.1, B.2, …), excluyendo B.4 (done).
  const nextPhaseB = phases.find(
    (p) => /^B\.\d/.test(p.phase) && p.phase !== 'B.4' && p.status !== 'done',
  );
  if (nextPhaseB) {
    steps.push({
      label: `${nextPhaseB.phase}: ${nextPhaseB.focus}`,
      detail: `${nextPhaseB.statusLabel} · ${nextPhaseB.duration}`,
      priority: 'ALTA',
      estimate: null,
    });
  }

  return steps.slice(0, 3);
}

export function parseBacklog(markdown: string): BacklogData {
  const phases = parsePhaseTable(markdown);
  const secItems = parseSecItems(markdown);
  const global = countCheckboxes(markdown);
  const secDone = secItems.filter((s) => s.status === 'done').length;

  return {
    lastUpdated: parseLastUpdated(markdown),
    global: { ...global, pct: pct(global.done, global.total) },
    phases,
    secItems,
    secProgress: { done: secDone, total: secItems.length, pct: pct(secDone, secItems.length) },
    subItems: parseSubItems(markdown),
    nextSteps: deriveNextSteps(secItems, phases),
  };
}

const EMPTY_BACKLOG: BacklogData = {
  lastUpdated: null,
  global: { done: 0, total: 0, pct: 0 },
  phases: [],
  secItems: [],
  secProgress: { done: 0, total: 0, pct: 0 },
  subItems: [],
  nextSteps: [],
};

/** Lee BACKLOG_MASTER.md y lo parsea. En prod (Vercel) los .md no existen → fallback vacío. */
export async function getBacklogDataSafe(): Promise<BacklogData> {
  try {
    const markdown = await readFile(BACKLOG_PATH, 'utf8');
    return parseBacklog(markdown);
  } catch {
    return EMPTY_BACKLOG;
  }
}
