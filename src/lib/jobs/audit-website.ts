import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/db';
import { leads, audits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auditWebsitePrompt, type ExtractedSiteData } from '@/lib/prompts/audit-website.prompt';
import { auditCompleteNotification } from '@/lib/emails/auditCompleteNotification';
import { generateProposal } from '@/lib/jobs/generate-proposal';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface AuditFinding {
  item: string;
  status: 'verde' | 'amarillo' | 'rojo';
  score: number;
  recomendacion: string;
}

export interface AuditReport {
  score: number;
  findings: AuditFinding[];
  summary: string;
  priority_areas: string[];
}

function validateUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`URL inválida: ${url}`);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`Protocolo no soportado: ${parsed.protocol}`);
  }
  if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
    throw new Error('No se permiten URLs localhost en producción');
  }
}

async function extractSiteData(url: string): Promise<ExtractedSiteData> {
  const start = Date.now();

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TechNova-Audit/1.0; +https://tech-nova.mx)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al obtener ${url}`);
  }

  const html = await response.text();
  const loadTimeMs = Date.now() - start;

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    ?.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() ?? null;

  const metaDescription =
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1]?.trim() ??
    html.match(/<meta[^>]+content=["']([^"']*)[^>]+name=["']description["']/i)?.[1]?.trim() ??
    null;

  const htmlLang = html.match(/<html[^>]+lang=["']([^"']+)["']/i)?.[1] ?? null;

  const imgTags = [...html.matchAll(/<img([^>]*)/gi)].map(m => m[1]);

  return {
    url,
    loadTimeMs,
    isHttps: url.startsWith('https://'),
    title,
    metaDescription,
    htmlLang,
    hasViewportMeta: /<meta[^>]+name=["']viewport["']/i.test(html),
    hasCharset: /<meta[^>]+charset/i.test(html),
    hasDoctype: /<!doctype\s+html/i.test(html),
    h1Count: (html.match(/<h1[\s>]/gi) ?? []).length,
    h2Count: (html.match(/<h2[\s>]/gi) ?? []).length,
    h3Count: (html.match(/<h3[\s>]/gi) ?? []).length,
    formCount: (html.match(/<form[\s>]/gi) ?? []).length,
    totalImages: imgTags.length,
    imagesWithoutAlt: imgTags.filter(attrs => !/alt=["'][^"']+["']/.test(attrs)).length,
    hasGA4: /gtag\s*\(|G-[A-Z0-9]{6,}|googletagmanager\.com/i.test(html),
    hasMetaPixel: /fbq\s*\(|facebook\.net\/en_US\/fbevents/i.test(html),
    hasCookiePolicyLink: /href=["'][^"']*(?:privacidad|privacy|cookie|aviso-legal)[^"']*["']/i.test(html),
    coreWebVitals: { lcp: null, fid: null, cls: null },
    lighthousePerformance: null,
    lighthouseAccessibility: null,
    lighthouseBestPractices: null,
    lighthouseSeo: null,
  };
}

function parseClaudeJson(raw: string): AuditReport {
  // Strip optional ```json ... ``` wrapper
  const clean = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  const parsed = JSON.parse(clean) as AuditReport;
  if (
    typeof parsed.score !== 'number' ||
    !Array.isArray(parsed.findings) ||
    typeof parsed.summary !== 'string' ||
    !Array.isArray(parsed.priority_areas)
  ) {
    throw new Error('Respuesta de Claude no tiene la estructura esperada');
  }
  return parsed;
}

async function callClaudeHaiku(extractedData: ExtractedSiteData): Promise<AuditReport> {
  const prompt = auditWebsitePrompt(extractedData);
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });
  const raw = (message.content[0] as { type: string; text: string }).text;
  return parseClaudeJson(raw);
}

export async function auditWebsite(leadId: number, websiteUrl: string): Promise<void> {
  console.log(`[audit] Starting for lead ${leadId}: ${websiteUrl}`);

  try {
    validateUrl(websiteUrl);
  } catch (err) {
    console.error(`[audit] Invalid URL for lead ${leadId}:`, err);
    await db.insert(audits).values({
      lead_id: leadId,
      site_url: websiteUrl,
      score: 0,
      findings: [],
      summary: '',
      priority_areas: [],
      status: 'error',
      error_message: String(err),
    });
    return;
  }

  let extractedData: ExtractedSiteData;
  try {
    extractedData = await extractSiteData(websiteUrl);
  } catch (err) {
    console.error(`[audit] Puppeteer attempt 1 failed for lead ${leadId}:`, err);
    // Retry once
    try {
      extractedData = await extractSiteData(websiteUrl);
    } catch (err2) {
      console.error(`[audit] Puppeteer attempt 2 failed for lead ${leadId}:`, err2);
      await db.insert(audits).values({
        lead_id: leadId,
        site_url: websiteUrl,
        score: 0,
        findings: [],
        summary: '',
        priority_areas: [],
        status: 'error',
        error_message: `Puppeteer failed: ${String(err2)}`,
      });
      return;
    }
  }

  let report: AuditReport;
  try {
    report = await callClaudeHaiku(extractedData);
  } catch (err) {
    console.error(`[audit] Claude Haiku failed for lead ${leadId}:`, err);
    await db.insert(audits).values({
      lead_id: leadId,
      site_url: websiteUrl,
      score: 0,
      findings: [],
      summary: '',
      priority_areas: [],
      extracted_data: extractedData,
      status: 'error',
      error_message: `Claude failed: ${String(err)}`,
    });
    return;
  }

  // Persist audit — capture ID to trigger proposal generation
  const [insertedAudit] = await db.insert(audits).values({
    lead_id: leadId,
    site_url: websiteUrl,
    score: report.score,
    findings: report.findings,
    summary: report.summary,
    priority_areas: report.priority_areas,
    extracted_data: extractedData,
    status: 'completed',
  }).returning({ id: audits.id });

  console.log(`[audit] Completed for lead ${leadId}. Score: ${report.score}`);

  // Notify Vic — fire and forget
  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  const leadData = lead[0];
  if (leadData) {
    const tpl = auditCompleteNotification({
      leadName: leadData.name,
      empresa: leadData.empresa ?? leadData.name,
      websiteUrl,
      score: report.score,
      priorityAreas: report.priority_areas,
    });
    resend.emails
      .send({ from: FROM_EMAIL, to: NOTIFY_EMAIL, subject: tpl.subject, html: tpl.html })
      .catch(e => console.error('[audit] Notify email failed:', e));
  }

  // B.4.2 — trigger proposal generation automatically after audit completes
  if (insertedAudit?.id) {
    generateProposal(leadId, insertedAudit.id).catch(err =>
      console.error(`[proposal] async trigger failed for lead ${leadId}:`, err)
    );
  }
}
