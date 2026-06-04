# 📋 BACKLOG MASTER
## Consolidación Completa del Roadmap por Fases

**Dueño:** Vic (Fundador/CEO)  
**Autoridad:** Vic (APROBADO)  
**Última actualización:** 2026-06-02 ← sincronizado con realidad  
**Status:** 🟢 MASTER REFERENCE DOCUMENT

---

## 🎯 EXECUTIVE SUMMARY

TechNova está estructurado en 4 fases de desarrollo. Este documento consolida TODO el trabajo planificado:

| Fase | Status | Duration | Focus |
|------|--------|----------|-------|
| **A** | ✅ COMPLETADA | May 20 – Jun 2, 2026 | Foundation & Architecture |
| **B** | 🔴 Iniciando | Jul 2026 – Sep 2026 | Growth & Credibility |
| **C** | 🟠 Scheduled | Oct – Nov 2026 | Polish & DevOps |
| **Future** | 🟡 Backlog | Q1 2027+ | Advanced Features |

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

### OP-4: Stripe live mode 🟡
**Status:** 🟡 BLOQUEADO EN STRIPE  
**Impacto:** Alto — sin esto no se puede cobrar en producción  
**Descripción:** KYC pendiente en Stripe dashboard. Hoy está en test mode.  
**Acción:** Completar KYC en Stripe → activar live mode → actualizar keys en Vercel  
**Tiempo estimado:** Depende de Stripe (1-3 días hábiles)

### OP-5: Template de diagnóstico manual ✅
**Status:** ✅ RESUELTO (2026-06-02)  
**Archivo:** `docs/OP-5-AUDIT-TEMPLATE.md`  
**Contenido:** Checklist 17 puntos, scoring 0-100, template email, 3 ejemplos reales, gotchas operativos. Decisión D-028: .md en repo (no Google Doc).

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

#### B.4.1 Auditoría Automática (IA + Puppeteer) 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] Setup Puppeteer (headless browser) para auditar sitios web
- [ ] API `/api/audits` que recibe URL del cliente
- [ ] Claude Haiku prompt para generar reporte 17-puntos
- [ ] Tabla `audits` en DB con resultados, score 0-100
- [ ] Trigger automático cuando lead entra (background job)
- [ ] Email a Vic cuando auditoría completa

**Timeline:** Semana 1-2 de Fase B.4

---

#### B.4.2 Generación Automática de Propuestas (IA) 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] Claude Haiku prompt para generar propuesta basada en:
  - Audit report (resultados 17 puntos)
  - Preferencias cliente (presupuesto, timeline, prioridades)
  - catalog.ts (56 componentes + precios MXN)
- [ ] API `/api/proposals/generate`
- [ ] Tabla `proposals` en DB
- [ ] JSON schema para propuesta (módulos, precio, horas, timeline)
- [ ] Trigger automático después de auditoría
- [ ] Email a Vic: "Propuesta generada, requiere revisión"

**Timeline:** Semana 2-3 de Fase B.4

---

#### B.4.3 Panel de Revisión para Vic (Dashboard Admin) 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] Nueva página `/admin/proposals-review`
- [ ] Muestra: lead info + audit report + propuesta generada
- [ ] Botones: Aprobar / Modificar / Rechazar
- [ ] Si modifica: puede quitar/agregar módulos, precio recalcula
- [ ] Si aprueba: trigger envío a cliente
- [ ] Tabla de histórico

**Timeline:** Semana 3 de Fase B.4

---

#### B.4.4 Envío de Propuesta a Cliente 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] Email con propuesta PDF (generado desde JSON)
- [ ] Landing privado `/propuesta/{uuid}`
- [ ] Cliente ve propuesta, botón "Ir a checkout"
- [ ] Fecha de expiración (7 días)
- [ ] Tabla `propuesta_emails` para tracking

**Timeline:** Semana 3 de Fase B.4

---

#### B.4.5 Ecommerce Dinámico (Cliente elige módulos) 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🔴 CRÍTICA

- [ ] Página `/checkout/{proposal_uuid}`
- [ ] Módulos propuestos (preseleccionados)
- [ ] Cliente puede QUITAR módulos (precio ↓)
- [ ] Cliente puede AGREGAR módulos a la carte (precio ↑)
- [ ] Precio recalcula en vivo
- [ ] Timeline estimado se actualiza
- [ ] Carrito JSON guardado en DB

**Timeline:** Semana 3-4 de Fase B.4

---

#### B.4.6 Integración Stripe (Pago) 🔴
**Status:** 🔴 PENDIENTE (Stripe en test mode, switch a live)  
**Priority:** 🔴 CRÍTICA

- [ ] Crear Payment Intent desde carrito
- [ ] Stripe checkout embed en `/checkout/{uuid}`
- [ ] Webhook `/api/webhooks/stripe` — confirma pago
- [ ] Crear proyecto en tabla `projects` cuando pago confirma
- [ ] Email a cliente: "¡Bienvenido! Tu proyecto inicia el..."
- [ ] Email a Vic: "Nuevo cliente, inicia mañana"

**Timeline:** Semana 4 de Fase B.4

---

#### B.4.7 Onboarding Cliente 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA

- [ ] Dashboard cliente `/cliente/dashboard`
- [ ] Resumen proyecto, roadmap 4 semanas, documentos
- [ ] Link a Figma, repo, assets
- [ ] Booking call (Calendly embed)
- [ ] Actualizar DB `projects.status` → "onboarding_iniciado"

**Timeline:** Semana 4 de Fase B.4

---

#### B.4.8 Lead Management & Tracking 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟡 MEDIA

- [ ] Lead lifecycle states (nueva → capturada → propuesta_generada → propuesta_revisada → propuesta_enviada → cliente_viendo → en_checkout → pagada)
- [ ] Tabla `leads` actualizada con estados
- [ ] Email automáticos según estado (workflows)
- [ ] Admin dashboard `/admin/lead-management`
- [ ] Tracking: tiempo de propuesta → tiempo de decisión

**Timeline:** Semana 2-4 de Fase B.4

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

#### B.5.2 Agent Autónomo de Backlog 🔴
**Status:** 🔴 NO INICIADO  
**Priority:** 🟠 BAJA (nice to have, implementar al final)

- [ ] Agent que lee BITACORA.md + BACKLOG_MASTER.md diariamente
- [ ] Genera reportes automáticos
- [ ] Detecta riesgos, sugiere reprioritización
- [ ] Envía Slack status message diarios a Vic

**Timeline:** Semana 7-8 de Fase B

---

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
- [ ] **Sentry** — error tracking en producción (mayor gap actual)
- [ ] Uptime monitoring
- [ ] Alertas Slack
- [ ] PostHog — comportamiento de usuario + funnel NOVA AI

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
