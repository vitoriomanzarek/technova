#!/usr/bin/env node
// @ts-check

/**
 * generate:status — valida que docs/BITACORA.md sea parseable y reporta
 * métricas del proyecto. SOLO lectura: no modifica archivos del repo.
 *
 *   npm run generate:status
 *
 * Exit 1 si BITACORA.md no existe o el parse no produce eventos.
 * Warning (no crash) si DECISION_LOG.md falta.
 *
 * Mantiene una copia ligera de la lógica de src/lib/bitacora-parser.ts para
 * correr en Node puro sin paso de compilación TS.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BITACORA_PATH = path.join(ROOT, 'docs', 'BITACORA.md');
const DECISION_PATH = path.join(ROOT, 'DECISION_LOG.md');

const t0 = Date.now();

/** @param {string} message */
function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

if (!fs.existsSync(BITACORA_PATH)) {
  fail(`No se encontró BITACORA.md en ${BITACORA_PATH}`);
}

const markdown = fs.readFileSync(BITACORA_PATH, 'utf8');
const lines = markdown.split(/\r?\n/);

/** @type {{date:string,title:string,status:string,tasks:{completed:boolean}[]}[]} */
const events = [];
/** @type {(typeof events)[number] | null} */
let current = null;

const COMPLETED = '✅';
const BLOCKED = ['🔴', '⛔', '🚫'];

/** @param {string} raw */
function classify(raw) {
  if (raw.includes(COMPLETED)) return 'completed';
  if (BLOCKED.some((e) => raw.includes(e))) return 'blocked';
  if (raw.includes('⏳')) return 'in-progress';
  return 'pending';
}

for (const line of lines) {
  const header = line.match(/^##\s+\[(\d{4}-\d{2}-\d{2})\]\s*-?\s*(.*)$/);
  if (header) {
    current = { date: header[1], title: header[2].trim(), status: 'pending', tasks: [] };
    events.push(current);
    continue;
  }
  if (!current) continue;

  const status = line.match(/^\*\*Status:\*\*\s*(.*)$/i);
  if (status) {
    current.status = classify(status[1]);
    continue;
  }

  const checkbox = line.trim().match(/^[-*]\s+\[([ xX])\]/);
  if (checkbox) {
    current.tasks.push({ completed: checkbox[1].toLowerCase() === 'x' });
    continue;
  }
  const emojiTask = line.trim().match(/^[-*]\s+([✅🔴⛔🚫⏳])/);
  if (emojiTask) {
    current.tasks.push({ completed: emojiTask[1] === COMPLETED });
  }
}

if (events.length === 0) {
  fail('El parser no produjo eventos — revisa el formato de BITACORA.md (## [YYYY-MM-DD] - Título).');
}

const allTasks = events.flatMap((e) => e.tasks);
const completedTasks = allTasks.filter((t) => t.completed).length;
const completedEvents = events.filter((e) => e.status === 'completed').length;
const blocked = events.filter((e) => e.status === 'blocked').length;

const dates = events.map((e) => e.date).filter(Boolean).sort();
const firstDate = dates[0];
const lastDate = dates[dates.length - 1];
const spanDays = Math.max(
  0,
  Math.round((new Date(lastDate).getTime() - new Date(firstDate).getTime()) / 86400000),
);
const weeks = Math.max(spanDays / 7, 1 / 7);
const tasksPerWeek = Math.round((completedTasks / weeks) * 10) / 10;

if (!fs.existsSync(DECISION_PATH)) {
  console.warn('⚠️  DECISION_LOG.md no encontrado — el dashboard mostrará 0 decisiones.');
}

const stamp = new Date().toISOString();
console.log('✅ Project status updated', `(${stamp})`);
console.log(`   eventos:        ${events.length} (${completedEvents} ✅ · ${blocked} 🔴)`);
console.log(`   tareas:         ${completedTasks}/${allTasks.length} completadas`);
console.log(`   velocity:       ${tasksPerWeek} tareas/semana`);
console.log(`   rango:          ${firstDate} → ${lastDate} (${spanDays}d)`);
console.log(`   parse:          ${Date.now() - t0}ms`);
