import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Parser de DECISION_LOG.md → decisiones tipadas.
 * Extrae los bloques `### D-NNN: Título` con su fecha, dueño, status y decisión.
 * Las decisiones marcadas como archivadas se excluyen del output.
 */

export type DecisionStatus =
  | 'implemented'
  | 'pending'
  | 'partial'
  | 'archived'
  | 'unknown';

export type Decision = {
  id: string; // "D-001"
  title: string;
  date: string | null;
  owner: string | null;
  statusLabel: string;
  status: DecisionStatus;
  summary: string;
};

const DECISION_PATH = path.join(process.cwd(), 'DECISION_LOG.md');

function classifyStatus(raw: string): DecisionStatus {
  const upper = raw.toUpperCase();
  if (/ARCHIVAD|DEPRECAD|OBSOLET/.test(upper)) return 'archived';
  if (/PENDIENTE/.test(upper) && /IMPLEMENT/.test(upper)) return 'partial';
  if (/INFRAESTRUCTURA LISTA|PARCIAL|PENDIENTE/.test(upper)) return 'partial';
  if (/IMPLEMENTAD|APLICAD|DOCUMENTAD/.test(upper)) return 'implemented';
  return 'unknown';
}

export function parseDecisionContent(markdown: string): Decision[] {
  const lines = markdown.split(/\r?\n/);
  const decisions: Decision[] = [];

  let current: Decision | null = null;
  let collectingDecision = false;
  const summaryLines: string[] = [];

  const flush = () => {
    if (!current) return;
    current.summary = summaryLines.join(' ').replace(/\s+/g, ' ').trim().slice(0, 280);
    decisions.push(current);
  };

  for (const line of lines) {
    const header = line.match(/^###\s+(D-\d+):\s*(.*)$/);
    if (header) {
      flush();
      summaryLines.length = 0;
      collectingDecision = false;
      current = {
        id: header[1],
        title: header[2].trim(),
        date: null,
        owner: null,
        statusLabel: '',
        status: 'unknown',
        summary: '',
      };
      continue;
    }

    if (!current) continue;

    const date = line.match(/^\*\*Fecha:\*\*\s*(.*)$/i);
    if (date) {
      current.date = date[1].trim() || null;
      continue;
    }

    const owner = line.match(/^\*\*Dueño:\*\*\s*(.*)$/i);
    if (owner) {
      current.owner = owner[1].trim() || null;
      continue;
    }

    const status = line.match(/^\*\*Status:\*\*\s*(.*)$/i);
    if (status) {
      current.statusLabel = status[1].replace(/[✅🔴⚠️⏳]/g, '').trim();
      current.status = classifyStatus(status[1]);
      continue;
    }

    if (/^\*\*Decisión:\*\*/i.test(line)) {
      collectingDecision = true;
      const inline = line.replace(/^\*\*Decisión:\*\*/i, '').trim();
      if (inline) summaryLines.push(inline.replace(/\*\*/g, ''));
      continue;
    }

    // Recolecta el cuerpo de "Decisión:" hasta el siguiente campo en negrita.
    if (collectingDecision) {
      if (/^\*\*\w+.*:\*\*/.test(line) || /^#{2,4}\s/.test(line)) {
        collectingDecision = false;
      } else if (line.trim()) {
        summaryLines.push(line.replace(/\*\*/g, '').trim());
      }
    }
  }

  flush();
  return decisions;
}

/** Lee DECISION_LOG.md y devuelve solo decisiones activas (no archivadas). */
export async function getActiveDecisions(): Promise<Decision[]> {
  const markdown = await readFile(DECISION_PATH, 'utf8');
  return parseDecisionContent(markdown).filter((d) => d.status !== 'archived');
}

/** Variante segura: si el archivo no existe, devuelve []. */
export async function getActiveDecisionsSafe(): Promise<Decision[]> {
  try {
    return await getActiveDecisions();
  } catch {
    return [];
  }
}
