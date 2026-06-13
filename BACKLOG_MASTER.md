# 📋 BACKLOG MASTER
## Consolidación Completa del Roadmap por Fases

**Dueño:** Vic (Fundador/CEO)  
**Autoridad:** Vic (APROBADO)  
**Última actualización:** 2026-06-12 ← auditoría general del proyecto → nuevo sprint SEC (hardening) priorizado antes de B.1-B.3  
**Status:** 🟢 MASTER REFERENCE DOCUMENT

---

## 🎯 EXECUTIVE SUMMARY

TechNova está estructurado en 4 fases de desarrollo. Este documento consolida TODO el trabajo planificado:

| Fase | Status | Duration | Focus | Progress |
|------|--------|----------|-------|----------|
| **A** | ✅ COMPLETADA | May 20 – Jun 2, 2026 | Foundation & Architecture | 100% |
| **B.4** | 🟢 **EN PRODUCCIÓN** | Jun 3-4, 2026 | Commercial Flow (TODOS 8 stages) | **100% ✅** |
| **SEC** | 🔴 **PRÓXIMO — BLOQUEANTE** | Jun 2026 (~1 semana) | Sprint Hardening (auth, crons, tests de pago) | 0% |
| **B.1** | 🟠 SCHEDULED | Jun-Jul 2026 | Imagery (Portfolio, team, testimonials) | 0% |
| **B.2** | 🟠 SCHEDULED | Jun-Jul 2026 | Marketing Funnel (Blog, ads, email) | 0% |
| **B.3** | 🟠 SCHEDULED | Jul-Aug 2026 | NOVA AI (Chat advisor autónomo) | 0% |
| **B.5** | 🟠 SCHEDULED | Aug 2026 | Dashboard & Autonomía (Backlog manager) | 0% |
| **C** | 🟠 SCHEDULED | Sep – Oct 2026 | Polish & DevOps | 0% |
| **Future** | 🟡 Backlog | Q1 2027+ | Advanced Features | — |

---

## ✅ FASE A: FOUNDATION & ARCHITECTURE — COMPLETADA
**Status:** ✅ COMPLETADA (2026-06-02)  
**Timeline:** May 20 – Jun 2, 2026  
**Owner:** Claude Code + Vic  
**Result:** Sitio live en tech-nova.mx, leads funcionando, emails funcionando, pagos en test mode

### A.1 Homepage & Core Pages ✅
- [x] Hero section con fondos animados (ParticleBackground)
- [x] NovaAI Section (wizard cotizador)
- [x] Services section (8 servicios)
- [x] Benefits, Process, Testimonials, Team sections
- [x] Lead magnet section + PDF "Auditoría Web Express"
- [x] Final CTA

### A.2 About Us Page (/nosotros) ✅
- [x] Hero, misión, visión, valores
- [x] Diseño responsive, tema oscuro

### A.3 Pricing Page (/pricing) ✅
- [x] 3 tiers (Start, Growth, Scale)
- [x] FAQ, CTA final, animaciones

### A.4 Start Project Form (/start-project) ✅
- [x] Form multi-paso, validación, email de notificación

### A.5 Database & Backend ✅
- [x] **Neon Postgres** (no Supabase — decisión D-002)
- [x] **Drizzle ORM** type-safe
- [x] Tabla `leads` (id, name, email, phone, message, website_url, project_type, created_at)
- [x] Tabla `orders` (Stripe checkout, estados: pending/paid/expired/refunded/disputed)
- [x] API `/api/leads` — rate limited, validación Zod, email decouple
- [x] API `/api/checkout` + `/api/checkout/webhook` (Stripe)

### A.6 Email Setup ✅
- [x] **Resend** (no Mailchimp — decisión por DX y pricing)
- [x] Persona **"Sofia de TechNova"** `sofia@tech-nova.mx`
- [x] Template `leadAuditWelcome.ts` — email cálido espacial para auditoría
- [x] Template `newLeadNotification.ts` — notificación interna con botón "Abrir sitio a auditar"
- [x] Email de bienvenida solo para `project_type === 'auditoria-web'` (⚠️ ver pendientes)
- [x] `notified: true` solo si Resend confirma sin error (fix del false-positive)

### A.7 Navigation & Layout ✅
- [x] Navbar con dropdown, responsive, hamburger mobile
- [x] Footer completo
- [x] Metadata SEO por página
- [x] Páginas legales: `/privacidad`, `/terminos`
- [x] Página `/gracias` post-conversión

### A.8 Design System ✅
- [x] Tailwind v4, tema oscuro cosmos (#0a0a14)
- [x] Paleta: cyan (#0ea5e9), violeta (#7c3aed), cosmos negro
- [x] Componentes reutilizables, animaciones framer-motion

### A.9 Deployment & Hosting ✅
- [x] **Vercel** proyecto `technova-next` (prj_TIPXMWs783BkRFQRMZQCxRGvnVuJ)
- [x] Dominio `tech-nova.mx` conectado + SSL
- [x] Variables de entorno configuradas en Vercel production
- [x] `.vercel/project.json` apuntando al proyecto correcto

### A.10 Analytics Setup ✅
- [x] **Google Analytics 4** (GTM-55RLL2LW)
- [x] **Meta Pixel** (718504998021592)
- [x] Timezone GA4: Ciudad de México
- [x] Evento `lead_magnet_downloaded` en GA4
- [x] Google Search Console conectado, sitemap enviado

### A.11 QA Bugs ✅ RESUELTO
- [x] BUG 2: Navbar dropdown opacidad
- [x] BUG 3: Sección "casos de éxito" renombrada
- [x] BUG 4: Botones blancos con buen contraste
- [x] BUG 5: Dropdown presupuesto legible
- [x] BUG 6: Email real configurado
- [x] BUG 7: Teléfono +52 722 166 9672
- [x] BUG 8: Botón blanco en presupuesto
- [~] BUG 1: Hero text-gradient — sin acción (decisión aceptada)

### A.12 Infraestructura de Seguridad y Pagos ✅ (no estaba en backlog original)
- [x] **Stripe** test mode activo — webhook `we_1TZD1ILk0zEvx0OqP87KrvOW`
- [x] **Rate limiting** Upstash Redis — 5 req/min leads, 3 req/min checkout
- [x] **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, etc.
- [x] Credenciales hardcodeadas removidas de git history (incidente seg. resuelto)
- [x] Password Neon DB rotada post-exposición

### A.13 Lead Magnet "Auditoría Web Express" ✅ (no estaba en backlog original)
- [x] PDF `public/assets/auditoria-web-express.pdf` (6 páginas, ~70 KB)
- [x] Auto-descarga al registrarse en el form
- [x] Identidad "Sofia Torres, Navegante Digital" + branding espacial
- [x] `BRAND_IDENTITY.md` — conceptualización del viaje espacial

### A.14 Admin Dashboards Internos ✅ (no estaba en backlog original)
- [x] `/admin/project-status` — lee BITACORA.md en vivo
- [x] `/internal/architecture` — visualiza stack, datos, integraciones
- [x] Auth gate con `ADMIN_DASHBOARD_TOKEN` (constant-time comparison)
- [x] `ADMIN_DASHBOARD_TOKEN` configurado en Vercel (2026-06-02)

### A.15 SEO Técnico ✅ (no estaba en backlog original)
- [x] `sitemap.ts` → `/sitemap.xml` con 18 URLs
- [x] GSC verificado, sitemap enviado
- [x] Política de privacidad actualizada (Mayo 2026)

---

## ⚡ PENDIENTES OPERATIVOS (antes de arrancar Fase B)

Estas tareas son rápidas pero afectan la operación del día a día:

### OP-1: Email de bienvenida para /contacto ✅
**Status:** ✅ RESUELTO (2026-06-02)  
**Template:** `src/lib/emails/leadContactWelcome.ts` — Sofia firma, echo del mensaje, links a servicios/pricing/PDF/WhatsApp.  
**route.ts:** dispatch por `project_type` — `auditoria-web` → audit email, `contacto` → contact email, otros → solo notificación interna.

### OP-2: Verificar dominio en Resend ✅
**Status:** ✅ YA ESTABA RESUELTO (verificado May 20, 2026)  
**Descripción:** `tech-nova.mx` está `Verified` en Resend (DNS verificado en 1 min vía Cloudflare). Emails salen de `sofia@tech-nova.mx` sin fallback.

### OP-3: Gmail filter para auditorías 🟡
**Status:** 🟡 PENDIENTE  
**Impacto:** Medio — organización operativa  
**Descripción:** Leads de `project_type: 'auditoria-web'` deberían ir a label "Auditoría Pendiente" en Gmail  
**Acción:** Gmail → Settings → Filters → From: `sofia@tech-nova.mx` + subject "Nuevo lead" → label  
**Tiempo estimado:** ~15 min

### OP-4: Stripe live mode ✅
**Status:** ✅ RESUELTO (2026-06-11) — producción cobra con llaves LIVE  
**Detalle:** KYC aprobado en cuenta `acct_1TPB2oLKfaFU4dyj` (charges_enabled ✓). Webhook live `we_1TgzDd...` registrado. Llaves live en Vercel + redeploy. Sesiones `cs_live_` verificadas.  
**Nota:** `payouts_enabled` se activa solo (retención inicial estándar). Existe una 2ª cuenta Stripe vieja (`acct_1TPB37Lk...`) que quedó solo para test/dev local.  
**Pendiente menor:** pago real de validación + reembolso (en curso)

### OP-6: Validaciones pendientes — HACER MAÑANA (2026-06-11) 🔴
**Status:** 🔴 PROGRAMADO para mañana  
**Contexto:** Sesión 2026-06-10/11 cerrada con estos cabos sueltos. Los recordatorios cron de Claude murieron al cerrar la sesión — este item es el respaldo.

- [ ] **Pago real de validación live** — Vic paga $50 MXN con tarjeta real (Claude genera URL nueva si la anterior expiró) → Claude verifica orden `paid` vía webhook live → reembolso inmediato por API. Cierra la validación de Stripe live mode.
- [ ] **Verificar eventos custom** — En GA4 (G-N3B58MJZVY): confirmar que aparecen `cta_click`, `form_start`, `form_submit`, `wizard_start`. En Clarity (x4y36nosox): confirmar Smart Events filtrables. Si no hay datos, hacer visita de prueba al sitio.
- [ ] **GA4 key event** — marcar `form_submit` como key event (Admin → Eventos) cuando ya liste el evento (~24h post-deploy).
- [ ] **Clarity (si no se ha hecho)** — suscribirse al Weekly Digest + conectar integración nativa con GA4.

### OP-5: Template de diagnóstico manual ✅
**Status:** ✅ RESUELTO (2026-06-02)  
**Archivo:** `docs/OP-5-AUDIT-TEMPLATE.md`  
**Contenido:** Checklist 17 puntos, scoring 0-100, template email, 3 ejemplos reales, gotchas operativos. Decisión D-028: .md en repo (no Google Doc).

---

## 🔴 SEC: SPRINT DE HARDENING (Auditoría 2026-06-12) — BLOQUEANTE ANTES DE B.1-B.3

**Origen:** Auditoría general del proyecto (2026-06-12). Hallazgo central: el flujo comercial está completo y cobrando en LIVE, pero varios endpoints internos quedaron sin autenticación y la cobertura de tests (~6%) no protege el path que mueve dinero real.  
**Decisión:** D-029 — hardening antes de invertir en tráfico (B.2 ads traería atacantes además de clientes).  
**Estimado total:** ~1 semana  
**Owner:** Claude Code + Vic

### SEC-1: Autenticación en endpoints internos ✅
**Status:** ✅ COMPLETADO (2026-06-12) | **Priority:** 🔴 CRÍTICA

Verificado en auditoría: `/api/proposals/generate` tenía Zod pero cero auth — cualquiera con la URL disparaba llamadas a Claude API (DoS económico). Mismo patrón en `/api/audits/create` (IDOR).

- [x] Inventario completo de las 23 rutas API clasificadas: pública / admin / interna
- [x] `/api/proposals/generate` — protegido vía gate admin en `src/proxy.ts` (requiere `x-admin-token`)
- [x] `/api/audits/create` — ídem (ambos añadidos al matcher del proxy)
- [x] Verificado: el pipeline real invoca `auditWebsite()`/`generateProposal()` como función directa — nada interno depende de estas rutas por HTTP, cero breaking changes
- [x] Resto de rutas revisadas: públicas son intencionales (leads, checkout, webhooks con firma) — `/api/proposals/[uuid]/pdf` queda para SEC-4 (anti-enumeración)

### SEC-2: Proteger crons con CRON_SECRET ✅
**Status:** ✅ COMPLETADO (2026-06-12) | **Priority:** 🔴 CRÍTICA

Matiz vs auditoría: los 4 crons SÍ tenían check, pero **fail-open** (sin env vars pasaba cualquiera) y comparación no constant-time.

- [x] Helper compartido `src/lib/cron-auth.ts` — **fail-closed** (503 sin secret, 401 sin match), constant-time
- [x] 4 cron routes migradas (daily, email-automation, proposal-timeout, second-payment-reminder)
- [x] Eliminado `?token=` por query param (quedaba en logs de Vercel); acepta `Authorization: Bearer CRON_SECRET` (Vercel lo manda solo) o `x-admin-token` para triggers manuales
- [ ] **Vic post-deploy:** confirmar que `CRON_SECRET` existe en Vercel production (el Morning Brief llega → casi seguro sí) y que el cron de las 7am sigue llegando al día siguiente

### SEC-3: Confirmar rotación de claves expuestas 🔴
**Status:** 🔴 NO INICIADO | **Priority:** 🔴 CRÍTICA | **Estimado:** 1-2 h

Historial git ya limpiado con filter-repo y password Neon rotada (A.12 ✅). Falta confirmar el resto de claves que vivieron en el `.env` commiteado:

- [ ] Resend API key — rotar o confirmar rotación
- [ ] Stripe keys test (cuenta vieja) — rotar o confirmar
- [ ] Upstash Redis token — rotar o confirmar
- [ ] Vercel token — rotar o confirmar
- [ ] Registrar resultado en BITACORA

### SEC-4: Anti-enumeración y rate limit en checkout/propuestas 🟠
**Status:** 🔴 NO INICIADO | **Priority:** 🟠 ALTA | **Estimado:** medio día

- [ ] Rate limit Upstash en `/api/checkout/[uuid]/*` y `/propuesta/[uuid]`
- [ ] Verificar que los UUIDs sean v4 aleatorios (no secuenciales/predecibles)
- [ ] Respuestas 404 uniformes (no filtrar existencia de recursos)

### SEC-5: Tests de integración del flujo de pago 🟠
**Status:** 🔴 NO INICIADO | **Priority:** 🟠 ALTA | **Estimado:** 2-3 días

Cobertura actual ~6% (7 archivos de test, solo lógica pura). El flujo lead→pago cobra dinero real sin un solo test de endpoint.

- [ ] Tests de `/api/leads` (validación, rate limit, dispatch de emails)
- [ ] Tests de `/api/checkout` + webhook Stripe (firma, idempotencia, transiciones de orden)
- [ ] Tests de `/api/proposals/*` (auth nueva de SEC-1 incluida)
- [ ] Tests del catalog.ts (cálculo de precios + 20% PM fee)
- [ ] Meta: path crítico lead→pago cubierto (no perseguir % global)

### SEC-6: Consolidación documental 🟡
**Status:** 🔴 NO INICIADO | **Priority:** 🟡 MEDIA | **Estimado:** medio día

- [ ] Consolidar COMMERCIAL_FLOW.md vs COMMERCIAL_FLOW_v2_FINAL.md en uno solo (archivar el otro en docs/archive/)
- [ ] Actualizar docs/technical/ donde dice "rate limiting TODO" (ya implementado en proxy.ts)
- [ ] Actualizar CLAUDE.md con referencias actuales
- [ ] Mover docs históricos de raíz (PHASE1-4_KICKOFF, TODAY_SUMMARY, etc.) a docs/archive/

---

## 🔴 FASE B: GROWTH & CREDIBILITY
**Status:** 🔴 INICIANDO (Julio 2026)  
**Timeline:** Jul 1 – Sep 30, 2026 (8-10 semanas)  
**Owner:** Vic + Claude Code  
**Success Metrics:** 500+ visitors/mes, 30+ leads/mes, conversion rate >20%

### B.0 REFERENCIA A DOCUMENTOS KICKOFF

**IMPORTANTE:** Estas tareas tienen especificaciones detalladas en documentos separados. Consulta:

- **IMAGERY_AGENT_KICKOFF.md** → Cubre B.1 (todas las tareas de imagery)
- **MARKETING_FUNNEL_AGENT_KICKOFF.md** → Cubre B.2 (blog, ads, email sequences)
- **NOVA_AI_REPLANNING.md** → Cubre B.3 (NOVA AI rediseño como asesor autónomo)
- **COMMERCIAL_FLOW.md** → Cubre B.4 (flujo lead → auditoría IA → propuesta IA → Vic revisa → cliente → checkout → pago)
- **AUTONOMOUS_BACKLOG_MANAGEMENT_PLAN.md** → Cubre B.5 (dashboard admin interno + agent autónomo)

Cada KICKOFF doc tiene: especificación completa, timeline, dependencias, ejemplos, y éxitometricas.

---

### B.1 CREDIBILIDAD VISUAL (Imagery)

**Documentación:** `IMAGERY_AGENT_KICKOFF.md`  
**Agente:** IMAGERY_AGENT (ejecutará todas estas tareas)

#### B.1.1 Portfolio / Casos de Éxito 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA — lo que más impacta la conversión

- [ ] Página `/casos-de-exito`
- [ ] 3-5 case studies (aunque sean semi-reales o proyectos propios)
- [ ] Estructura de datos `case-studies.ts`
- [ ] Componentes `CaseStudyCard`, `CaseStudyDetail`
- [ ] Imágenes: antes/después, main image, logo cliente, avatar
- [ ] Schema markup, SEO

**Timeline:** Semana 1-2 de Fase B

---

#### B.1.2 Servicios — Visuales 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 ALTA

- [ ] 8 mockups/screenshots por servicio (600x400px)
- [ ] Actualizar `ServiceCard` con imágenes
- [ ] Carpeta `/public/images/services/`

**Timeline:** Semana 2-3 de Fase B

---

#### B.1.3 Fotos del Equipo 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA

- [ ] Foto profesional de Vic (400x400px)
- [ ] Fotos o avatares del equipo
- [ ] Estructura `team.ts` + componente `TeamMember`

**Timeline:** Semana 3-4 de Fase B

---

#### B.1.4 Testimoniales con visuals 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA

- [ ] Avatares de clientes (80x80px)
- [ ] Logos de empresas (120x60px)
- [ ] Actualizar `TestimonialCard` + rating stars

**Timeline:** Semana 2-3 de Fase B

---

### B.2 MARKETING FUNNEL

**Documentación:** `MARKETING_FUNNEL_AGENT_KICKOFF.md`  
**Agente:** MARKETING_FUNNEL_AGENT (ejecutará todas estas tareas)  
**Arquitectura:** 4 fases (Awareness → Consideration → Conversion → Loyalty) con ads, email sequences, analytics

#### B.2.1 Blog System 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA — única fuente de tráfico orgánico gratis

- [ ] `/blog/page.tsx` (hub/listado)
- [ ] `/blog/[slug]/page.tsx` (post individual)
- [ ] Estructura `blog-posts.ts`
- [ ] Componentes: `BlogCard`, `BlogHero`, `TableOfContents`
- [ ] 6-12 posts SEO-optimizados (México, desarrollo web, IA)
- [ ] Cover images por post (1200x800px)
- [ ] Meta tags + internal linking

**Timeline:** Semana 1-3 de Fase B

---

#### B.2.2 Google Ads 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] Cuenta Google Ads
- [ ] 4 campañas de búsqueda: Landing pages / eCommerce / SaaS / Brand
- [ ] Campañas display (remarketing)
- [ ] Creativos (headlines, descriptions, CTAs)
- [ ] Conversion tracking conectado a GA4
- [ ] Presupuesto inicial sugerido: ~$1,300/mes

**Timeline:** Semana 3-4 de Fase B

---

#### B.2.3 Facebook / Instagram Ads 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 ALTA

- [ ] Cuenta Facebook Ads
- [ ] Audiencias: emprendedores México (awareness) + retargeting visitantes
- [ ] Creativos: imagen estática, carrusel, video
- [ ] Meta Pixel ya instalado ✅ — conectar conversiones
- [ ] Presupuesto sugerido: ~$700/mes

**Timeline:** Semana 4-5 de Fase B

---

#### B.2.4 LinkedIn Ads 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA

- [ ] Campaign Manager
- [ ] Thought Leadership + Lead Gen campaigns
- [ ] Target: emprendedores, directores, decision makers MX
- [ ] Presupuesto sugerido: ~$500/mes

**Timeline:** Semana 5 de Fase B

---

#### B.2.5 Secuencias de Email 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA  
**Nota:** Se usa **Resend** (no Mailchimp como decía el backlog original)

- [ ] Welcome series (5 emails, 10 días) — post lead magnet
- [ ] Secuencia pricing visitors (3 emails, 5 días)
- [ ] Secuencia post-blog (3 emails, 7 días)
- [ ] Secuencia post-delivery (4 emails, 30 días)
- [ ] Newsletter mensual template
- [ ] Upsells: mantenimiento, nuevo servicio, proyecto adicional
- [ ] Automatización vía Resend Broadcasts / webhooks

**Timeline:** Semana 1-4 de Fase B

---

#### B.2.6 Optimización páginas de consideración 🔴
**Status:** 🔴 NO INICIADO

- [ ] `/pricing` — screenshots reales, más transparencia
- [ ] `/nosotros` — fotos equipo, trust signals
- [ ] `/servicios` — visuales, testimoniales
- [ ] Logos de clientes en servicios
- [ ] FAQ en pricing

**Timeline:** Semana 2-4 de Fase B

---

#### B.2.7 Dashboard Marketing Analytics 🔴
**Status:** 🔴 NO INICIADO

- [ ] `/admin/marketing-analytics` — métricas en vivo
- [ ] Visitors por fuente, CPA, email metrics, ad performance
- [ ] Reportes semanales/mensuales

**Timeline:** Semana 6-7 de Fase B

---

### B.3 NOVA AI

**Documentación:** `NOVA_AI_REPLANNING.md`  
**Agente:** NOVA_AI_AGENT (ejecutará todas estas tareas)  
**Arquitectura:** Chat interface → Qualificación automática → Propuesta generada por Claude Haiku → Routing (auto-checkout/manual/reject)  
**Cambio mayor:** NO es un simple wizard. Es un asesor inteligente que hace preguntas y toma decisiones autónomas.

#### B.3.1 NOVA AI Core Engine 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] `/nova-ai/page.tsx` — chat interface
- [ ] Componentes: message bubbles, typing indicator, templates
- [ ] API `/api/nova-ai/messages`, `/api/nova-ai/analyze`, `/api/nova-ai/generate-proposal`

**Timeline:** Semana 1-3 de Fase B

---

#### B.3.2 Lógica de Calificación 🔴
**Status:** 🔴 NO INICIADO

- [ ] Scoring formula (budget, claridad, timeline, viabilidad, intención)
- [ ] Routing: auto-checkout (80%+), revisión manual (60-79%), rechazo (<60%)
- [ ] `/lib/nova/qualify.ts`

---

#### B.3.3 Integración Claude API 🔴
**Status:** 🔴 NO INICIADO

- [ ] 4 sets de prompts: análisis inicial, follow-up, propuesta, calificación
- [ ] claude-sonnet-4-6 (o claude-opus-4 para propuestas)
- [ ] Error handling + fallbacks + streaming opcional
- [ ] `/lib/nova/analyze.ts`, `/lib/nova/generate.ts`

---

#### B.3.4 Sistema de Propuestas 🔴
**Status:** 🔴 NO INICIADO

- [ ] Template components de propuesta
- [ ] JSON estructura de propuesta
- [ ] Customización (timeline/budget)
- [ ] Descarga / email / integración con checkout

---

#### B.3.5 Base de Datos NOVA AI 🔴
**Status:** 🔴 NO INICIADO

- [ ] Tabla `nova_conversations` (session, email, responses JSON, score, routing, proposal JSON)
- [ ] Tabla `nova_leads` (lead_id, score, conversion_status, proposal_amount)

---

#### B.3.6 QA + Lanzamiento 🔴
**Status:** 🔴 NO INICIADO

- [ ] QA 5 flujos de conversación
- [ ] Load testing
- [ ] A/B test tono de mensajes
- [ ] Video demo (3-5 min)
- [ ] Update landing page con NOVA AI highlight
- [ ] Email a leads existentes

---

### B.4 COMMERCIAL FLOW (CRÍTICO — Foundation para todo lo demás)

**Documentación:** `COMMERCIAL_FLOW_v2_FINAL.md` (validado con Vic)  
**Priority:** 🔴 CRÍTICA — Sin esto, nada funciona  
**Contexto:** Define el flujo **completo** desde que un lead entra (3 entry points) hasta que paga y comienza onboarding. 9 stages, multi-canal, automático + manual intervention.

**Key decisions:**
- 3 Entry Points: LeadMagnet (COLD) + /contacto (WARM) + /cotizador (HOT)
- Precios FIJOS (catalog.ts modular, sin variación por tipo)
- Contrato local + pago 50%+50% default
- Calendly Pro para scheduling (MVP)
- Email sequences automáticas (5 secuencias diferentes)

#### B.4.1 Auditoría Automática (IA + Puppeteer) ✅
**Status:** ✅ COMPLETADO (2026-06-03, 9m 32s)  
**Priority:** 🔴 CRÍTICA

- [x] Setup Puppeteer (headless browser) para auditar sitios web
- [x] API `/api/audits/create` que recibe URL del cliente
- [x] Claude Haiku prompt para generar reporte 17-puntos
- [x] Tabla `audits` en DB con resultados, score 0-100
- [x] Trigger automático cuando lead entra (background job)
- [x] Email a Vic cuando auditoría completa

**Timeline:** Semana 1-2 de Fase B.4 ✅

---

#### B.4.2 Generación Automática de Propuestas (IA) ✅
**Status:** ✅ COMPLETADO (2026-06-03, 11m 45s)  
**Priority:** 🔴 CRÍTICA

- [x] Claude Haiku prompt para generar propuesta basada en:
  - Audit report (resultados 17 puntos)
  - Preferencias cliente (presupuesto, timeline, prioridades)
  - catalog.ts (12 módulos, 56 componentes + precios MXN)
- [x] API `/api/proposals/generate`
- [x] Tabla `proposals` en DB (+ campos enriquecidos en `leads`)
- [x] Zod schema para validación de propuesta (módulos, precio, horas, timeline)
- [x] Trigger automático después de auditoría
- [x] Email a Vic: "Propuesta generada, requiere revisión"

**Timeline:** Semana 1-2 de Fase B.4 ✅

---

#### B.4.3 Panel de Revisión para Vic (Dashboard Admin) ✅
**Status:** ✅ COMPLETADO (2026-06-03, 10m 18s)  
**Priority:** 🔴 CRÍTICA

- [x] Nueva página `/admin/proposals-review` (client component con dos columnas)
- [x] Lista con filtros: status, búsqueda por empresa
- [x] Panel de detalles: lead info + audit report + módulos de propuesta
- [x] Botones: Aprobar / Modificar / Rechazar
- [x] ModuleSelector: multi-select con recálculo de precio en vivo
- [x] 5 endpoints API (/list, /detail, /approve, /modify, /reject)
- [x] Auth middleware extendido a `/api/admin/*`
- [x] Email a Vic cuando propuesta aprobada

**Timeline:** Semana 2 de Fase B.4 ✅

---

#### B.4.4 Envío de Propuesta a Cliente ✅
**Status:** ✅ COMPLETADO (2026-06-03, 9m 17s)  
**Priority:** 🔴 CRÍTICA

- [x] Email profesional a cliente con resumen + CTA
- [x] Landing `/propuesta/{uuid}` con propuesta visual completa
- [x] PDF descargable (Puppeteer, generado desde datos de propuesta)
- [x] Botón "Aprobar y pagar 50%" → Stripe checkout
- [x] Botón "Reservar llamada" → Calendly
- [x] API `/api/admin/proposals/[id]/send` (admin protected)
- [x] Tabla `proposal_tracking` en BD + campo `sent_at` en proposals
- [x] Timeout: reminder día 10, expiración día 14
- [x] Cron endpoint `/api/cron/proposal-timeout`
- [x] 3 emails: sent, reminder, expired
- [x] Botón "Enviar a cliente" en B.4.3 dashboard
- [ ] Fecha de expiración (7 días)
- [ ] Tabla `propuesta_emails` para tracking

**Timeline:** Semana 3 de Fase B.4

---

#### B.4.5 Ecommerce Dinámico (Cliente elige módulos) ✅
**Status:** ✅ COMPLETADO (2026-06-03, 7m 12s)  
**Priority:** 🔴 CRÍTICA

- [x] Página `/checkout/{uuid}` con módulos del catálogo
- [x] Módulos preseleccionados de la propuesta (con checkboxes)
- [x] Cliente puede QUITAR módulos (precio recalcula en vivo)
- [x] Cliente puede AGREGAR módulos a la carte (catálogo completo)
- [x] Presupuesto recalcula en vivo (subtotal + 20% PM fee)
- [x] Timeline estimado actualiza automáticamente
- [x] "Pagar 50%" → Stripe Checkout Session (con módulos actualizados)
- [x] "Solicitar cambios" → email a Vic con diff + notas
- [x] "Guardar para después" → localStorage
- [x] Webhook Stripe actualizado: proposal → client_confirmed + emails
- [x] Schema: proposal_id + payment_percentage en orders

**Timeline:** Semana 2 de Fase B.4 ✅

---

#### B.4.6 Integración Stripe + Contrato + Pago 50%+50% ✅
**Status:** ✅ COMPLETADO (2026-06-04)  
**Priority:** 🔴 CRÍTICA

- [x] Contrato PDF dinámico (Puppeteer) con términos legales completos
- [x] GET /api/checkout/{uuid}/contract → descarga PDF
- [x] `contracts` table — registra generación + firma implícita
- [x] `projects` table — creado tras pago (idempotent via proposal_id check)
- [x] Webhook extendido: crea proyecto, registra contrato, envía emails ricos
- [x] Email a cliente: projectStartedToClient (kickoff date, módulos, próximos pasos)
- [x] Email a Vic: projectStartedToVic (resumen completo con action items)
- [x] Email contractForSignature con link al contrato + checkout
- [x] Success page `/checkout/{uuid}/success` con resumen de proyecto
- [x] Botón "Revisar contrato" en CheckoutActions
- [x] success_url apunta a `/checkout/{uuid}/success`

**Timeline:** Semana 2 de Fase B.4 ✅

---

#### B.4.7 Onboarding Cliente + Dashboard ✅
**Status:** ✅ COMPLETADO (2026-06-04)  
**Priority:** 🟡 MEDIA

- [x] Dashboard `/cliente/dashboard` — protegido con token en cookie (90 días)
- [x] ProjectStatus: badge de estado, barra de progreso, módulos
- [x] TimelineVisual: fases (Kickoff→Setup→Dev→QA→Deploy→Entrega) calculadas dinámicamente
- [x] ResourcesList: links a repo, Figma, assets, docs, contrato PDF
- [x] Booking Kickoff Call (link a Calendly)
- [x] PaymentSection: estado de pagos + botón pagar 50% restante
- [x] `client_tokens` table — tokens seguros generados post-pago
- [x] `GET /api/cliente/project` — datos del proyecto vía token
- [x] Token generado en webhook post-pago → email con link al dashboard
- [x] Email `dashboardAccessEmail` con link personalizado al dashboard
- [x] `secondPaymentReminderEmail` — recordatorio 3 días antes y urgente el día del kickoff
- [x] `runSecondPaymentJob()` + cron `/api/cron/second-payment-reminder`
- [x] `/checkout/{uuid}/pay-remaining` — página para segundo pago 50%
- [x] Middleware extendido: `/cliente/*` protegido por token cookie

**Timeline:** Semana 2 de Fase B.4 ✅

---

#### B.4.8 CRM + Email Workflows Automáticos ✅ 🎉
**Status:** ✅ COMPLETADO (2026-06-04) — **FASE B.4 COMPLETA**  
**Priority:** 🟡 MEDIA

- [x] Lead lifecycle states en tabla `leads` (new→captured→audit_completed→proposal_sent→in_checkout→paid→project_active)
- [x] Timestamps de cada etapa (captured_at, audit_completed_at, proposal_sent_at, paid_at, etc.)
- [x] `lead_score` + `unsubscribed` + `email_sequence_stage`
- [x] `email_events` table — delivery tracking (sent, opened, clicked, bounced, complained)
- [x] Email automation engine: 6 workflows automáticos (welcome, audit_ready, follow_up, urgent, checkout_reminder, project_started)
- [x] Cron `/api/cron/email-automation` — cada 4h, con idempotency via emailEvents
- [x] CRM Dashboard `/admin/crm` — funnel visual, activity timeline, leads table con filtros
- [x] `GET /api/admin/leads` — leads con status counts, recent activity
- [x] Resend webhook `/api/webhooks/resend` — actualiza opened_at, clicked_at, bounced_at, unsubscribe
- [x] Lead scoring function (0-100) + routing (high/medium/low)

**Timeline:** Semana 2 de Fase B.4 ✅

### 🎉 COMERCIAL FLOW B.4: 8/8 COMPLETADO — 100%

---

---

### B.5 DASHBOARD ADMIN INTERNO & AUTONOMÍA

**Documentación:** `AUTONOMOUS_BACKLOG_MANAGEMENT_PLAN.md`  
**Agente:** BACKLOG_MANAGER_AGENT (corre automáticamente)

#### B.5.1 Dashboard para Vic 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA (implementar después de B.4.3 estar listo)

- [ ] Página `/admin/project-status` (mejorada)
- [ ] Muestra: propuestas pendientes, conversión rate, revenue
- [ ] Gráficos: visitantes/día, leads/semana, ingresos
- [ ] Botones quick-action

**Timeline:** Semana 5 de Fase B

---

#### B.5.2 Agent Autónomo de Backlog 🟡
**Status:** 🟡 PARCIAL — Morning Brief diario implementado (2026-06-10)  
**Priority:** 🟠 BAJA (nice to have, implementar al final)

- [x] ~~Genera reportes automáticos~~ → **Morning Brief**: cron diario 7am CDMX (`/api/cron/daily`) con system checks + actividad 24h + funnel + insights de Claude → email a Vic
- [ ] Agent que lee BITACORA.md + BACKLOG_MASTER.md diariamente
- [ ] Detecta riesgos, sugiere reprioritización
- [ ] Envía Slack status message diarios a Vic (hoy es email)

**Timeline:** Semana 7-8 de Fase B

---

#### B.5.3 Observabilidad & UX Insights 🔴 (NUEVO 2026-06-10)
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA — alimenta los insights del Morning Brief con datos de comportamiento real

Ideas surgidas al construir el Morning Brief. Orden = valor estimado:

- [x] **Microsoft Clarity** ✅ instalado 2026-06-10 (project `x4y36nosox`, directo en layout.tsx) — heatmaps + grabaciones en clarity.microsoft.com
- [x] **Eventos custom en CTAs** ✅ 2026-06-10 — `src/lib/analytics.ts` (trackEvent → GA4 + Clarity). Eventos: cta_click (hero, NOVA, contacto), form_start/submit/error (contacto, lead_magnet, wizard), wizard_start/segment. form_start sin form_submit = abandono medible. Nota: se usó GA4+Clarity en vez de Vercel Analytics (custom events requieren plan Pro).
- [ ] **Brief semanal profundo** (lunes) — tendencias semana vs. semana, conversión por etapa del funnel, no solo snapshot diario. Extiende `daily-digest.ts`.
- [ ] **UptimeRobot** (gratis) — ping externo cada 5 min con alerta inmediata. Necesario porque el cron corre DENTRO de Vercel: si Vercel cae, el cron cae con él. Alternativa: Sentry Uptime Monitoring (ya tenemos cuenta).
- [ ] **Lighthouse CI semanal** — evita que SEO/accesibilidad/performance se degraden silenciosamente con cada deploy.

**Relacionado:** C.3 Monitoring & Observability (Fase C) — estos items lo adelantan.

---

### B.6 CHECKLIST FASE B COMPLETA

**Documentación:** Todos los items arriba → refiere a KICKOFF docs

- [ ] **B.1 Credibilidad visual:** portfolio, servicios, equipo, testimoniales (IMAGERY_AGENT_KICKOFF.md)
- [ ] **B.2 Marketing Funnel:** Blog live 6-12 posts + Google/Meta/LinkedIn Ads + Email sequences (MARKETING_FUNNEL_AGENT_KICKOFF.md)
- [ ] **B.3 NOVA AI:** Chat interface + auto-qualification + propuestas automáticas (NOVA_AI_REPLANNING.md)
- [ ] **B.4 Commercial Flow:** Lead → Auditoría IA → Propuesta IA → Vic revisa → Cliente → Ecommerce → Stripe → Onboarding (COMMERCIAL_FLOW.md)
- [ ] **B.5 Dashboard & Autonomía:** Panel Vic + Agent autónomo (AUTONOMOUS_BACKLOG_MANAGEMENT_PLAN.md)

**Métricas objetivo Fase B:**
- 500+ monthly visitors
- 30-50 monthly leads
- 5-10 customers acquired (conversión rate >20%)
- NOVA AI conversion rate >30%
- Blog getting organic traffic (100+ visits from Google/mes)

**Timeline total Fase B:** 8-10 semanas (Jul 1 – Sep 30, 2026)

---

## 🟠 FASE C: POLISH & DEVOPS
**Status:** 🟠 SCHEDULED (Oct – Nov 2026)  
**Success Metric:** Lighthouse >90, CI/CD automatizado, 99.9% uptime

### C.1 Librería de Componentes
- [ ] Auditar componentes existentes
- [ ] Estandarizar nombres
- [ ] Storybook (documentación de componentes)
- [ ] UI kit Figma

### C.2 CI/CD Pipeline
- [ ] GitHub Actions workflows (lint, build, test, deploy)
- [ ] Husky + lint-staged pre-commit hooks
- [ ] Automated performance checks post-deploy

### C.3 Monitoring & Observability
- [x] **Sentry** — ✅ activo desde 2026-06-10 (errores + source maps + session replay)
- [ ] Uptime monitoring → ver B.5.3 (UptimeRobot / Sentry Uptime)
- [ ] Alertas Slack
- [ ] PostHog — comportamiento de usuario + funnel NOVA AI (B.5.3 Clarity es el primer paso gratis)

### C.4 Performance Optimization
- [ ] next/image en todas las imágenes
- [ ] Code splitting + lazy loading
- [ ] Database query optimization
- [ ] Lighthouse score >90

### C.5 SEO Final Pass
- [x] Sitemap.xml (18 URLs) ✅ ya hecho
- [x] GSC conectado ✅ ya hecho
- [ ] Schema markup (LocalBusiness, Organization, Product)
- [ ] robots.txt
- [ ] Alt text en todas las imágenes
- [ ] Internal linking strategy
- [ ] Core Web Vitals optimization

### C.6 Security Hardening
- [x] HTTPS/SSL ✅ Vercel
- [x] Env vars seguros ✅ rotados y en Vercel
- [x] Rate limiting ✅ Upstash
- [x] Security headers ✅ next.config.ts
- [x] Input validation ✅ Zod
- [ ] CSP (Content Security Policy) — pendiente por scripts de terceros
- [ ] CSRF protection review

### C.7 Documentación
- [ ] Guía de deployment
- [ ] API documentation
- [ ] Runbook de tareas comunes

---

## 🟡 FUTURE FEATURES (Q1 2027+)

```
Q1 2027:
├── Customer Dashboard (tracking de proyectos)
├── Payment Plans (pagos flexibles)
├── Referral Program
└── Knowledge Base / Support Portal

Q2 2027:
├── Video testimonials (auto-transcripción)
├── Webinar system
├── Advanced analytics (predictive)
└── Customer Portal (archivos, actualizaciones)

Q3 2027:
├── App móvil (iOS/Android)
├── NOVA AI multimodal (voz/video)
├── AI content generation (blog, ads)
└── Automated project scheduling
```

---

## 📈 OKRs por Fase

### Fase A 🎯 ✅ COMPLETADA
- [x] Sitio live y funcional
- [x] Leads capturándose en DB
- [x] Emails funcionando (Sofia persona)
- [x] Pagos en test mode (Stripe)
- [x] Analytics activos (GA4 + Meta Pixel)

### Fase B 🎯
- [ ] 500+ monthly visitors
- [ ] 30-50 monthly leads
- [ ] 5-10 customers acquired
- [ ] NOVA AI conversion rate >30%
- [ ] Blog getting organic traffic

### Fase C 🎯
- [ ] Lighthouse score >90
- [ ] Deployment automated
- [ ] Error rate <0.1%
- [ ] MTTR <30 min
- [ ] 99.9% uptime

### Overall (End of 2026) 🎯
- [ ] Established credibility ($20K+/month MRR)
- [ ] Repeatable customer acquisition
- [ ] Automated operations
- [ ] Ready for scaling

---

**Preparado por:** Claude (Arquitecto)  
**Para:** Vic (Fundador/CEO)  
**Status:** ✅ MASTER REFERENCE — sincronizado 2026-06-02
