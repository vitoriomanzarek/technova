import Anthropic from '@anthropic-ai/sdk';
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { leads, audits, proposals, orders, emailEvents } from '@/db/schema';
import { dailyDigestEmail } from '@/lib/emails/dailyDigestEmail';
import { Resend } from 'resend';

/**
 * Morning Brief diario (B.5 preview) — corre vía /api/cron/daily a las 7am CDMX.
 *
 * Tres capas:
 *  1. Systems   — ¿está todo vivo? (HTTP checks + DB latency + env sanity)
 *  2. Activity  — ¿qué pasó en las últimas 24h? (leads, audits, propuestas, pagos, emails)
 *  3. Insights  — Claude analiza funnel + blockers y genera recomendaciones UX/negocio
 *
 * El resultado se envía por email a NOTIFY_EMAIL. Si Claude falla, el email
 * sale igual con los datos crudos — los insights son enhancement, no dependencia.
 */

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tech-nova.mx';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---------- Capa 1: Systems ----------

export interface SystemCheck {
  name: string;
  ok: boolean;
  detail: string; // "200 · 312ms" o el error
}

async function httpCheck(name: string, url: string, expectStatus: number[]): Promise<SystemCheck> {
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), cache: 'no-store' });
    const ms = Date.now() - start;
    const ok = expectStatus.includes(res.status);
    return { name, ok, detail: `${res.status} · ${ms}ms` };
  } catch (err) {
    return { name, ok: false, detail: String(err).slice(0, 120) };
  }
}

async function checkSystems(): Promise<SystemCheck[]> {
  const checks = await Promise.all([
    httpCheck('Homepage', BASE_URL, [200]),
    httpCheck('Stripe webhook', `${BASE_URL}/api/checkout/webhook`, [405]), // GET no permitido = handler vivo
    httpCheck('Sitemap', `${BASE_URL}/sitemap.xml`, [200]),
    (async (): Promise<SystemCheck> => {
      const start = Date.now();
      try {
        await db.execute(sql`SELECT 1`);
        return { name: 'Neon DB', ok: true, detail: `OK · ${Date.now() - start}ms` };
      } catch (err) {
        return { name: 'Neon DB', ok: false, detail: String(err).slice(0, 120) };
      }
    })(),
  ]);

  // Env sanity — si alguna de estas falta, algo se rompió silenciosamente
  const requiredEnv = ['ANTHROPIC_API_KEY', 'RESEND_API_KEY', 'STRIPE_SECRET_KEY', 'DATABASE_URL'];
  const missing = requiredEnv.filter(k => !process.env[k]);
  checks.push({
    name: 'Env vars críticas',
    ok: missing.length === 0,
    detail: missing.length === 0 ? `${requiredEnv.length}/${requiredEnv.length} presentes` : `FALTAN: ${missing.join(', ')}`,
  });

  return checks;
}

// ---------- Capa 2: Activity (24h) + Funnel ----------

export interface ActivityData {
  newLeads24h: number;
  auditsCompleted24h: number;
  auditsFailed24h: { url: string; error: string }[];
  proposalsGenerated24h: number;
  proposalsPendingVic: { count: number; oldestHours: number };
  ordersPaid24h: { count: number; totalMxn: number };
  abandonedCheckouts: number; // orders pending > 24h
  emails7d: { sent: number; opened: number; bounced: number };
  funnelByStatus: Record<string, number>;
  staleLeads: number; // status 'new' > 3 días sin avanzar
}

async function collectActivity(): Promise<ActivityData> {
  const [
    [newLeadsRow],
    [auditsOkRow],
    failedAudits,
    [propGenRow],
    [propPendingRow],
    [paidRow],
    [abandonedRow],
    [emailsRow],
    statusRows,
    [staleRow],
  ] = await Promise.all([
    db.execute(sql`SELECT count(*)::int AS n FROM leads WHERE created_at > now() - interval '24 hours'`).then(r => r.rows),
    db.execute(sql`SELECT count(*)::int AS n FROM audits WHERE status = 'completed' AND created_at > now() - interval '24 hours'`).then(r => r.rows),
    db.execute(sql`SELECT site_url, error_message FROM audits WHERE status = 'error' AND created_at > now() - interval '24 hours' LIMIT 5`).then(r => r.rows),
    db.execute(sql`SELECT count(*)::int AS n FROM proposals WHERE created_at > now() - interval '24 hours'`).then(r => r.rows),
    db.execute(sql`
      SELECT count(*)::int AS n,
             coalesce(extract(epoch FROM now() - min(created_at)) / 3600, 0)::int AS oldest_hours
      FROM proposals WHERE status = 'pending_vic_review'
    `).then(r => r.rows),
    db.execute(sql`
      SELECT count(*)::int AS n, coalesce(sum(amount_cents), 0)::bigint AS cents
      FROM orders WHERE status = 'paid' AND created_at > now() - interval '24 hours'
    `).then(r => r.rows),
    db.execute(sql`SELECT count(*)::int AS n FROM orders WHERE status = 'pending' AND created_at < now() - interval '24 hours'`).then(r => r.rows),
    db.execute(sql`
      SELECT count(*)::int AS sent,
             count(opened_at)::int AS opened,
             count(bounced_at)::int AS bounced
      FROM email_events WHERE sent_at > now() - interval '7 days'
    `).then(r => r.rows),
    db.execute(sql`SELECT status, count(*)::int AS n FROM leads GROUP BY status ORDER BY n DESC`).then(r => r.rows),
    db.execute(sql`SELECT count(*)::int AS n FROM leads WHERE status = 'new' AND created_at < now() - interval '3 days'`).then(r => r.rows),
  ]);

  const funnelByStatus: Record<string, number> = {};
  for (const row of statusRows as { status: string; n: number }[]) {
    funnelByStatus[row.status] = row.n;
  }

  return {
    newLeads24h: (newLeadsRow as { n: number }).n,
    auditsCompleted24h: (auditsOkRow as { n: number }).n,
    auditsFailed24h: (failedAudits as { site_url: string; error_message: string }[])
      .map(a => ({ url: a.site_url, error: (a.error_message ?? '').slice(0, 150) })),
    proposalsGenerated24h: (propGenRow as { n: number }).n,
    proposalsPendingVic: {
      count: (propPendingRow as { n: number }).n,
      oldestHours: (propPendingRow as { oldest_hours: number }).oldest_hours,
    },
    ordersPaid24h: {
      count: (paidRow as { n: number }).n,
      totalMxn: Math.round(Number((paidRow as { cents: bigint }).cents) / 100),
    },
    abandonedCheckouts: (abandonedRow as { n: number }).n,
    emails7d: {
      sent: (emailsRow as { sent: number }).sent,
      opened: (emailsRow as { opened: number }).opened,
      bounced: (emailsRow as { bounced: number }).bounced,
    },
    funnelByStatus,
    staleLeads: (staleRow as { n: number }).n,
  };
}

// ---------- Capa 3: Insights con Claude ----------

export interface DigestInsights {
  salud: 'verde' | 'amarillo' | 'rojo';
  resumen: string;
  alertas: string[];
  recomendaciones: string[];
}

async function generateInsights(
  systems: SystemCheck[],
  activity: ActivityData,
  jobResults: Record<string, unknown>,
): Promise<DigestInsights | null> {
  try {
    const prompt = `Eres el analista de operaciones de TechNova, una agencia de desarrollo web mexicana.
Su funnel: lead entra por el sitio → auditoría automática IA de su web → propuesta generada por IA → Vic (founder) la revisa y aprueba → se envía al cliente → cliente paga por Stripe (50% anticipo).

Datos de esta mañana (JSON):

SISTEMAS: ${JSON.stringify(systems)}
ACTIVIDAD: ${JSON.stringify(activity)}
JOBS_NOCTURNOS: ${JSON.stringify(jobResults)}

Analiza y responde SOLO con JSON válido (sin markdown fences):
{
  "salud": "verde" | "amarillo" | "rojo",
  "resumen": "2-3 frases: estado general y lo más importante de hoy",
  "alertas": ["cosas que requieren acción HOY — sistemas caídos, propuestas esperando a Vic, checkouts abandonados, bounces. Vacío si no hay."],
  "recomendaciones": ["mejoras concretas de UX/funnel basadas en los datos — ej: si hay leads estancados, auditorías fallando con cierto patrón, emails sin abrirse. Máximo 3, accionables. Vacío si no hay datos suficientes."]
}

Reglas: salud=rojo si un sistema crítico está caído; amarillo si hay alertas operativas; verde si todo fluye. Sé específico con números. No inventes datos que no estén en el JSON.`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text;
    const clean = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(clean) as DigestInsights;
    if (!parsed.salud || !parsed.resumen) throw new Error('Estructura inesperada');
    return parsed;
  } catch (err) {
    console.error('[daily-digest] Claude insights failed (email sale sin insights):', err);
    return null;
  }
}

// ---------- Orquestador ----------

export interface DigestResult {
  systems: SystemCheck[];
  activity: ActivityData;
  insights: DigestInsights | null;
  emailSent: boolean;
}

export async function runDailyDigest(jobResults: Record<string, unknown> = {}): Promise<DigestResult> {
  console.log('[daily-digest] Starting...');

  const systems = await checkSystems();
  const activity = await collectActivity();
  const insights = await generateInsights(systems, activity, jobResults);

  const tpl = dailyDigestEmail({ systems, activity, insights, baseUrl: BASE_URL });

  let emailSent = false;
  try {
    const sent = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: tpl.subject,
      html: tpl.html,
    });
    if (sent.error) throw new Error(JSON.stringify(sent.error));
    emailSent = true;
    console.log('[daily-digest] Email sent:', sent.data?.id);
  } catch (err) {
    console.error('[daily-digest] Email send failed:', err);
  }

  return { systems, activity, insights, emailSent };
}
