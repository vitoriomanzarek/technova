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
  // Dynamic import so the module can load in serverless without bundling issues at build time
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; TechNova-Audit/1.0; +https://tech-nova.mx)'
    );
    page.setDefaultNavigationTimeout(60_000);

    const start = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2' });
    // Extra settle time for JS-heavy sites
    await new Promise(r => setTimeout(r, 3_000));
    const loadTimeMs = Date.now() - start;

    const data = await page.evaluate(() => {
      const getMeta = (name: string) =>
        (document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null)?.content ??
        (document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement | null)?.content ??
        null;

      const scripts = Array.from(document.querySelectorAll('script[src]'))
        .map(s => (s as HTMLScriptElement).src);
      const inlineScripts = Array.from(document.querySelectorAll('script:not([src])'))
        .map(s => s.textContent ?? '');
      const allScriptText = [...scripts, ...inlineScripts].join(' ');

      const images = Array.from(document.querySelectorAll('img'));

      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ((a as HTMLAnchorElement).href ?? '').toLowerCase());

      return {
        title: document.title || null,
        metaDescription: getMeta('description'),
        hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
        hasCharset: !!document.querySelector('meta[charset]'),
        hasDoctype: document.doctype !== null,
        htmlLang: document.documentElement.getAttribute('lang'),
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        h3Count: document.querySelectorAll('h3').length,
        formCount: document.querySelectorAll('form').length,
        totalImages: images.length,
        imagesWithoutAlt: images.filter(img => !img.getAttribute('alt')).length,
        hasGA4: allScriptText.includes('gtag') || allScriptText.includes('G-') || allScriptText.includes('googletagmanager'),
        hasMetaPixel: allScriptText.includes('fbq') || allScriptText.includes('facebook.net/en_US/fbevents'),
        hasCookiePolicyLink: links.some(href =>
          href.includes('privacidad') ||
          href.includes('privacy') ||
          href.includes('cookie') ||
          href.includes('aviso-legal')
        ),
      };
    });

    const isHttps = url.startsWith('https://');

    // Core Web Vitals via PerformanceObserver are async — best-effort
    let coreWebVitals = { lcp: null as number | null, fid: null as number | null, cls: null as number | null };
    try {
      const vitals = await page.evaluate(() => {
        return new Promise<{ lcp: number | null; cls: number | null }>((resolve) => {
          let lcp: number | null = null;
          let cls: number | null = null;
          const lcpObs = new PerformanceObserver(list => {
            const entries = list.getEntries();
            if (entries.length) lcp = entries[entries.length - 1].startTime;
          });
          const clsObs = new PerformanceObserver(list => {
            list.getEntries().forEach(e => {
              // @ts-ignore
              cls = (cls ?? 0) + (e.value ?? 0);
            });
          });
          try { lcpObs.observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
          try { clsObs.observe({ type: 'layout-shift', buffered: true }); } catch {}
          setTimeout(() => resolve({ lcp, cls }), 2000);
        });
      });
      coreWebVitals = { ...vitals, fid: null };
    } catch {
      // Core Web Vitals not available — leave as null
    }

    return {
      url,
      loadTimeMs,
      isHttps,
      coreWebVitals,
      // Lighthouse scores: not running full Lighthouse (requires separate CLI/API), set null
      lighthousePerformance: null,
      lighthouseAccessibility: null,
      lighthouseBestPractices: null,
      lighthouseSeo: null,
      ...data,
    };
  } finally {
    await browser.close();
  }
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
    model: 'claude-3-5-haiku-20241022',
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
