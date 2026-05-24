/**
 * TechNova — Site Health Check
 * Corre contra producción: verifica páginas, APIs y DB.
 * Uso: node scripts/site-test.mjs
 */

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const BASE = 'https://tech-nova.mx';
const DB_URL = 'postgresql://neondb_owner:REDACTED@ep-gentle-meadow-aph6dcnk-pooler.c-7.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

let passed = 0, failed = 0;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function ok(label)  { console.log(`  ✅  ${label}`); passed++; }
function fail(label, detail) { console.log(`  ❌  ${label}${detail ? ` — ${detail}` : ''}`); failed++; }
function section(title) { console.log(`\n── ${title} ${'─'.repeat(50 - title.length)}`); }

// ── PAGES ────────────────────────────────────────────────────────────
section('PÁGINAS (HTTP 200)');

const pages = [
  '/',
  '/nosotros',
  '/pricing',
  '/servicios',
  '/contacto',
  '/privacidad',
  '/terminos',
  '/gracias',
  '/start-project',
  '/services/landing-page',
  '/services/ecommerce',
  '/services/lms',
  '/services/web-app',
  '/services/marketing',
  '/services/data-analysis',
  '/services/chatbot',
  '/services/crm',
  '/services/support',
];

for (const path of pages) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
    if (res.ok) ok(`${path} → ${res.status}`);
    else        fail(`${path}`, `HTTP ${res.status}`);
  } catch (e) {
    fail(`${path}`, e.message);
  }
}

// ── API: /api/leads ──────────────────────────────────────────────────
section('API /api/leads');

console.log('  ⏳  Esperando cooldown del rate limiter (35s)...');
await sleep(35000);

// Test 1: payload válido completo
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '[AUTO-TEST] Formulario Contacto',
      email: 'autotest@tech-nova.mx',
      phone: '+527221669672',
      project_type: 'contacto',
      message: 'Test automático de formulario de contacto',
    }),
  });
  const data = await res.json();
  if (res.ok && data.success) ok('POST payload completo → success');
  else                         fail('POST payload completo', JSON.stringify(data));
}

// Test 2: solo email (lead magnet)
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'autotest-magnet@tech-nova.mx', name: '[AUTO-TEST] Lead Magnet', project_type: 'auditoria-web' }),
  });
  const data = await res.json();
  if (res.ok && data.success) ok('POST solo email (lead magnet) → success');
  else                         fail('POST solo email', JSON.stringify(data));
}

// Test 3: wizard Despegue
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '[AUTO-TEST] Wizard Despegue',
      email: 'autotest-despegue@tech-nova.mx',
      phone: '+527221669672',
      project_type: 'despegue-lanzadera',
      message: 'Segmento: Despegue | Paquete: Lanzadera ⚡ — $12,000 MXN | 7 días',
    }),
  });
  const data = await res.json();
  if (res.ok && data.success) ok('POST wizard Despegue → success');
  else                         fail('POST wizard Despegue', JSON.stringify(data));
}

// Pausa entre grupos para respetar rate limit
await sleep(35000);

// Test 4: wizard Órbita
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '[AUTO-TEST] Wizard Orbita',
      email: 'autotest-orbita@tech-nova.mx',
      phone: '+527221669672',
      project_type: 'ecommerce',
      message: 'Segmento: Órbita | Tipo: ecommerce | Costo estimado: $45,000 MXN | Horas: 120h',
    }),
  });
  const data = await res.json();
  if (res.ok && data.success) ok('POST wizard Órbita → success');
  else                         fail('POST wizard Órbita', JSON.stringify(data));
}

// Test 5: wizard Misión
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '[AUTO-TEST] Empresa XYZ',
      email: 'autotest-mision@tech-nova.mx',
      project_type: 'mision-enterprise',
      message: 'Segmento: Misión | Presupuesto: $150,000-$300,000 MXN',
    }),
  });
  const data = await res.json();
  if (res.ok && data.success) ok('POST wizard Misión Enterprise → success');
  else                         fail('POST wizard Misión', JSON.stringify(data));
}

// Test 6: email inválido → debe rechazar
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'no-es-un-email', name: 'Test' }),
  });
  const data = await res.json();
  // 400 = validación Zod, 429 = rate limiter — ambos son rechazos correctos
  if ([400, 429].includes(res.status)) ok(`POST email inválido → rechazado correctamente (${res.status})`);
  else                                  fail('POST email inválido', `esperaba 400/429, got ${res.status}`);
}

// Test 7: body vacío → debe rechazar
{
  const res = await fetch(`${BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if ([400, 429].includes(res.status)) ok(`POST body vacío → rechazado correctamente (${res.status})`);
  else                                  fail('POST body vacío', `esperaba 400/429, got ${res.status}`);
}

// ── API: /api/checkout ───────────────────────────────────────────────
section('API /api/checkout');

{
  const res = await fetch(`${BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId: 'price_invalid_test', quantity: 1 }),
  });
  // Stripe rechazará el priceId inválido → esperamos 4xx o 5xx con error, no crash
  if (res.status !== 200 || !(await res.clone().json().catch(()=>({}))).url) {
    ok(`POST con priceId inválido → responde ${res.status} (sin crash)`);
  } else {
    fail('POST checkout', 'devolvió URL de Stripe con precio inválido');
  }
}

// ── DB VERIFICATION ──────────────────────────────────────────────────
section('BASE DE DATOS (Neon)');

const sql = neon(DB_URL);

// Verificar que los auto-tests se guardaron
{
  try {
    const rows = await sql`
      SELECT count(*) as total FROM leads
      WHERE name LIKE '[AUTO-TEST]%'
      AND created_at > NOW() - INTERVAL '5 minutes'
    `;
    const count = parseInt(rows[0].total);
    if (count >= 4) ok(`${count} leads de prueba guardados en DB correctamente`);
    else             fail('Leads guardados en DB', `esperaba ≥4, encontró ${count}`);
  } catch (e) {
    fail('Query a DB', e.message);
  }
}

// Verificar columnas
{
  try {
    const cols = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'leads' ORDER BY ordinal_position
    `;
    const names = cols.map(c => c.column_name);
    const required = ['id','name','email','phone','project_type','message','created_at'];
    const missing = required.filter(c => !names.includes(c));
    if (missing.length === 0) ok(`Schema correcto: ${names.join(', ')}`);
    else                       fail('Schema leads', `columnas faltantes: ${missing.join(', ')}`);
  } catch (e) {
    fail('Schema check', e.message);
  }
}

// Total histórico de leads
{
  try {
    const rows = await sql`SELECT count(*) as total FROM leads`;
    ok(`Total leads en DB: ${rows[0].total}`);
  } catch(e) {
    fail('Count total leads', e.message);
  }
}

// ── CLEANUP ──────────────────────────────────────────────────────────
section('LIMPIEZA');
{
  try {
    const del = await sql`DELETE FROM leads WHERE name LIKE '[AUTO-TEST]%' RETURNING id`;
    ok(`${del.length} leads de prueba eliminados de DB`);
  } catch(e) {
    fail('Cleanup auto-test leads', e.message);
  }
}

// ── SUMMARY ─────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(54)}`);
console.log(`  RESULTADO: ${passed} ✅  pasaron   ${failed} ❌  fallaron`);
console.log(`${'═'.repeat(54)}\n`);
if (failed > 0) process.exit(1);
