# 📚 MEMORY INDEX - TechNova

Índice de memoria persistente. Se carga automáticamente en cada conversación con Claude para mantener contexto sin re-explicarlo.

---

## Tier 1: Contexto del Negocio
- [`memory/technova_business_context.md`](./memory/technova_business_context.md) — Misión/visión, nicho PyMEs MX, paquetes **START / GROWTH / SCALE** en MXN, KPIs (CAC < $1K · LTV > 5× CAC · NPS > 50), equipo y rates por hora, decisiones comerciales D-004 / D-005 / D-006, timeline de mercado 2026.

## Tier 2: Stack Técnico
- [`memory/technova_technical_stack.md`](./memory/technova_technical_stack.md) — Stack con versiones exactas de `package.json`: **Next.js 16.2.4 · React 19.2.4 · Tailwind v4 · Drizzle 0.45 · Neon · Resend 6.12 · Stripe 22.1 (TEST activo) · Zod 4.4 · Upstash (rate limit)**. Decisiones D-001 / D-002 / D-003 / D-007 / D-008. Estructura de carpetas, env vars, performance targets.

## Tier 3: Estándares de Desarrollo
- [`memory/technova_development_standards.md`](./memory/technova_development_standards.md) — Convenciones derivadas de **code review real**: naming (PascalCase / camelCase / snake_case en DB), patrón Server vs Client, orden de imports, API routes con `NextResponse.json`, Tailwind v4 patterns, Git workflow (sin `develop`), checklist de PR.

## Tier 4: Preferencias del Founder
- [`memory/technova_user_preferences.md`](./memory/technova_user_preferences.md) — Vic: español, directo, autonomía total en ejecución, reportes en `docs/BITACORA.md`, escalación por tipo de decisión, prioridades (Revenue > Speed > Scale > Quality > Docs), qué funcionó / qué evitar.

---

## 🎯 Cómo Funciona

1. Nueva conversación → Claude carga este `MEMORY.md`.
2. Claude carga los 4 archivos de `memory/`.
3. Claude tiene contexto completo, sin explicaciones repetidas.
4. Trabajo productivo inmediato.

---

## 📐 Documentación Técnica Viva (`docs/technical/`) — 11 docs, 100% completa

Generada en Fases 2-4. Consultar el relevante antes de tocar código:

| Doc | Para qué |
|-----|----------|
| `TECHNICAL_ARCHITECTURE.md` | Stack, estructura, patrones, breaking changes Next 16 |
| `DATABASE_SCHEMA.md` | Tablas `services` / `leads` / `orders`, migrations |
| `API_DOCUMENTATION.md` | `/api/leads`, `/api/checkout`, `/api/checkout/webhook` |
| `ONBOARDING_DEVELOPER.md` | Setup en 30 min para dev nuevo |
| `DEPLOYMENT_GUIDE.md` | Vercel, env vars, rollback, troubleshooting real |
| `SECURITY_CHECKLIST.md` | 12 controles con status, auditoría trimestral |
| `ERROR_HANDLING_GUIDE.md` | Recovery checklists, retry de Stripe, post-mortem |
| `TESTING_STRATEGY.md` | Vitest + Playwright (plan, aún sin instalar) |
| `COMPONENTS_LIBRARY.md` | Catálogo de componentes, a11y, gotchas Tailwind |
| `CI_CD_PIPELINE.md` | Workflows GitHub Actions, pre-commit, branch protection |
| `MONITORING_OBSERVABILITY.md` | Logging, Sentry (plan), alerting S0-S3, debug prod |

---

## 📈 Phase C: Growth Platform + Content Engine (2026-05-23)

### Estrategia de Contenido & Leads
- [`LEAD_MANAGEMENT_PLATFORM.md`](./LEAD_MANAGEMENT_PLATFORM.md) — Sistema propietario de gestión de leads (Supabase + Next.js). Schema (5 tablas), 6 endpoints API, dashboard `/admin/leads`, integración Resend/Stripe/Claude API, roadmap 4 semanas (Jun 1-28). KPI: 100+ leads/mes, 60%+ qualification, 1+ deals.
- [`BLOG_AUTOMATION_STRATEGY.md`](./BLOG_AUTOMATION_STRATEGY.md) — Máquina de contenido diario (1 post/día = 30/mes). Batch Friday (7 posts), auto-publish Mon-Sun 8am UTC, Claude Haiku API ($1.50/mes). Lead magnets por tipo, secuencias email Resend, distribución multi-canal (blog → Twitter → LinkedIn → email). 90-día targets: 150-250 leads, $3k-$25k revenue.
- [`CONTENT_STRATEGY.md`](./CONTENT_STRATEGY.md) — Fundación estratégica completa. Buyer journey (Awareness 40% / Consideration 35% / Conversion 20% / Loyalty 5%), 3 personas (Dev Director / Founder / Growth Manager), 5 content clusters, calendar Jun 26-30 posts con keywords y lead magnets, SEO checklist 20 items, año 1 vision (300+ posts, 50k+/mes pageviews, 1.5k+ leads, $50k+ revenue).

### Decisiones Logradas
- **D-018:** Lead HUB propietario (Supabase + Next.js vs SaaS), timeline Jun 1-28, reversible después de 4 semanas si ROI < $1k.
- **D-019:** Blog 1 post/día (no 2/semana), 100% AI-generated (Claude Haiku), rotación manual si se consigue writer.
- **D-020:** Email Resend free tier → Loops at 20k/mes threshold, cost <$20/mes Phase C.

---

---

## 🚨 AGENT PROTOCOLS (CRÍTICO — Pasar a TODO agente)

- [`AGENT_DOCUMENTATION_PROTOCOL.md`](./AGENT_DOCUMENTATION_PROTOCOL.md) — **OBLIGATORIO para todos los agentes.** Cómo documentar trabajo: BITACORA → DECISION_LOG → memory → Git. Incluir en todo prompt de agente. Esto previene "work without docs".

---

## 🔍 Referencias Cruzadas (no se cargan automáticamente, consultar bajo demanda)

| Documento | Ubicación | Para qué |
|-----------|-----------|----------|
| **ARCHITECTURE.md** | `/` | Auditoría completa, gaps, plan de ejecución 4 fases |
| **DECISION_LOG.md** | `/` | 13 decisiones con contexto, alternativas, trade-offs, KPIs |
| **PHASE1-4_KICKOFF.md** | `/` | Planes operativos de cada fase |
| **PROPOSAL.md** / **EXECUTIVE_SUMMARY.md** | `/` | Propuesta original + resumen ejecutivo |
| **Technova.md** | `/` | Plan de negocio extenso (fuente autoritativa) |
| **strategy.md** | `/` | Estrategia simplificada (3 pilares, lead-to-sale) |
| **docs/BITACORA.md** | `/docs/` | Registro histórico — leer para "qué pasó cuándo" |
| **docs/PRICING_PROPOSAL_MX.md** | `/docs/` | Precios MXN canónicos (fuente para Tier 1) |
| **docs/technical/** | `/docs/technical/` | 11 docs técnicos (ver tabla arriba) |

---

## 🔄 Mantenimiento

### Cuándo actualizar
- **Decisión técnica/comercial nueva** → añadir a `DECISION_LOG.md` (luego reflejar en memory si afecta stack o negocio).
- **Cambio de preferencias de Vic** → `technova_user_preferences.md`.
- **Cambio de stack** (deps, versión major, nueva tool) → `technova_technical_stack.md`.
- **Nueva convención observada en código** → `technova_development_standards.md`.
- **Cambio de paquetes / precios / nicho** → `technova_business_context.md`.

### Quién actualiza
- **Claude Code:** día a día (post-task, post-code-review).
- **Vic:** cambios de dirección estratégica del negocio.

### Git
- Archivos en `/memory/` se versionan en Git.
- Commit pattern sugerido: `docs(memory): update <filename>`.

---

**Última actualización:** 2026-05-24  
**Status:** ✅ **Fases 1-4 entregadas.** Producción viva en `tech-nova.mx` (lead funnel + Stripe TEST + rate limit + security headers). **P