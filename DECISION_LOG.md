# 📋 DECISION LOG - TechNova Solutions
## Registro de Decisiones Técnicas y Comerciales

**Propósito:** Documentar decisiones importantes, el contexto, y alternativas consideradas. Evita arrepentimientos futuros y ayuda a nuevos miembros entender por qué hacemos las cosas así.

**Formato:** [DECISIÓN] | Fecha | Dueño | Status

---

## 🏗️ DECISIONES ARQUITECTÓNICAS

### D-001: Framework Frontend - Next.js 16 (App Router)
**Fecha:** 2026-04-21  
**Dueño:** Agente Desarrollador  
**Status:** ✅ IMPLEMENTADO

**Decisión:**  
Migrar de Vite + React Router a **Next.js 16** con **App Router**.

**Contexto:**
- Necesitamos SSR para SEO (blog, landing pages)
- Necesitamos API Routes nativas (no servidor separado)
- Necesitamos deployment simple (Vercel native)
- Team es pequeño (~2-3 devs), no tenemos DevOps dedicado

**Alternativas Consideradas:**
1. **Remix** - Más elegante, pero menos ecosystem
2. **Astro** - Bueno para sitios estáticos, pero limitado en interactividad
3. **SvelteKit** - Excelente, pero team no conoce Svelte
4. **Vite + Node.js** - Más control, pero más complejo de mantener

**Por qué Next.js ganó:**
- Vercel backing = confianza en futuro
- SSR + SSG + ISR = máxima flexibilidad
- API Routes = sin necesidad de backend separado
- Deployment = push a GitHub → automático en Vercel
- Ecosystem = librerías maduras (auth, payments, analytics)

**Trade-offs:**
- ❌ Menos control que custom Node.js
- ❌ Vendor lock-in parcial (Vercel)
- ✅ Pero: mantenibilidad > control

**Reversible?** Difícil (refactor de 1-2 semanas), pero probablemente no sea necesario en 3 años.

**KPI de Éxito:** Core Web Vitals green, TTL < 2s, deployment < 1 min

---

### D-002: ORM - Drizzle ORM (vs TypeORM, Prisma)
**Fecha:** 2026-04-21  
**Dueño:** Agente Desarrollador  
**Status:** ✅ IMPLEMENTADO

**Decisión:**  
Usar **Drizzle ORM** con **Neon Postgres** como base de datos.

**Contexto:**
- Necesitamos type-safe queries (TypeScript)
- Queremos evitar generación de código (no Prisma)
- Necesitamos máximo control sobre SQL
- Cost: Neon tiene tier gratuito generoso para MVP

**Alternativas:**
1. **Prisma** - Fácil, pero genera código y queries grandes
2. **TypeORM** - Type-safe pero heavy, genera migrations complejas
3. **Sequelize** - Demasiado ORM tradicional
4. **Raw SQL + zod** - Máximo control, pero más boilerplate

**Por qué Drizzle ganó:**
- Zero runtime: no genera código extra
- SQL-like syntax: escribes casi SQL pero type-safe
- Relational queries: perfecto para nuestro schema simple
- Neon: serverless Postgres con buena DX

**Trade-offs:**
- ❌ Comunidad más pequeña que Prisma
- ❌ Menos tooling listo (vs Prisma)
- ✅ Pero: menos magic = más predictibilidad

**Reversible?** Medianamente (reescritura de queries, ~1 semana)

**KPI de Éxito:** Queries < 100ms, schema versioning claro, 0 N+1 issues

---

### D-003: Styling - Tailwind CSS v4
**Fecha:** 2026-04-21  
**Dueño:** Agente Desarrollador  
**Status:** ✅ IMPLEMENTADO

**Decisión:**  
**Tailwind CSS v4** (latest) para styling.

**Contexto:**
- Necesitamos rapidez (no tenemos designer full-time)
- Consistencia en todo el proyecto
- Team pequeño = mantener cosas simples

**Alternativas:**
1. **Styled Components** - Runtime overhead
2. **CSS Modules** - Mejor para equipos grandes
3. **Pico CSS** - Muy minimalista
4. **Custom CSS** - Demasiado boilerplate

**Por qué Tailwind ganó:**
- Velocidad prototipado: construyes en código
- Consistency: limitada paleta = buena UX
- Bundle size: purgado automático
- v4: JIT improvements, mejor performance

**Trade-offs:**
- ❌ Markup "sucio" (muchas clases)
- ❌ Curva aprendizaje para nuevos
- ✅ Pero: velocidad > purismo

**Reversible?** Difícil (refactor de componentes, ~2 semanas)

**KPI de Éxito:** CSS bundle < 50KB, 0 runtime CSS-in-JS

---

## 💳 DECISIONES COMERCIALES

### D-004: Precios en Pesos Mexicanos (no USD)
**Fecha:** 2026-04-22  
**Dueño:** Vic (Fundador)  
**Status:** ✅ IMPLEMENTADO

**Decisión:**  
Fijar precios en **MXN** (pesos mexicanos) y adaptar para mercado mexicano.

**Contexto:**
- Mercado target = PyMEs México
- USD intimida a clientes pequeños
- Competencia local también en MXN
- Pricing psicológico: $18,000 MXN = $1,000 USD pero se siente más accesible

**Alternativas:**
1. USD (global) - Más profesional pero less accesible
2. EUR - Irrelevante para mercado MX
3. Hybrid (USD + MXN) - Confusión

**Por qué MXN ganó:**
- Psychologically: cliente ve número más grande = mejor deal
- Simplicity: una sola moneda, sin conversiones
- Market: 90% de competencia en MXN
- Payment processors: Stripe soporta MXN directamente

**Trade-offs:**
- ❌ Menos atractivo para clientes USD/EUR
- ✅ Pero: foco en nicho MX ahora, internacionalizar después

**Reversible?** Sí, fácil (cambiar en PRICING_PROPOSAL_MX.md y landing)

**KPI de Éxito:** Conversion rate on pricing page > 5%, LTV > 5x CAC

---

### D-005: Paquetes Modulares (START/GROWTH/SCALE)
**Fecha:** 2026-04-22  
**Dueño:** Vic (Fundador)  
**Status:** ✅ IMPLEMENTADO

**Decisión:**  
Ofrecer 3 paquetes **modulares** basados en Inventario Maestro de Recursos (IMR).

**Contexto:**
- Mercado MX tiene presupuestos muy variados
- Necesitamos vender desde $5K hasta $50K+
- Clientes no saben qué necesitan: wizard ayuda
- Escalabilidad: IMR permite reutilizar componentes

**Alternativas:**
1. **Hora a hora** (time & materials) - Flexible pero impredecible para cliente
2. **Valor basado** - Difícil de calcular, requiere auditoría
3. **Paquetes fijos** - Inflexible, cliente se siente limitado
4. **Modular (elegido)** - Cliente ve value, nosotros escalamos

**Por qué Modular (IMR) ganó:**
- Clarity: cliente ve qué paga y por qué
- Scalability: +20 paquetes = 0 nuevo código
- Data: trackear qué components venden más
- Upsell: "empezaste con START, ahora usa GROWTH"

**Trade-offs:**
- ❌ Complejidad en pricing logic (wizard)
- ❌ Potential scope creep si no controlamos bien
- ✅ Pero: ROI positivo después de 10 ventas

**Reversible?** Sí, medianamente (cambiar pricing strategy)

**KPI de Éxito:** Conversion rate 20%+ en wizard, CAC < $1,000 MXN

---

## 📊 DECISIONES DE PRODUCTO

### D-006: Lead Magnet = "Auditoría Web Express Gratis"
**Fecha:** 2026-04-22  
**Dueño:** Vic (Fundador)  
**Status:** ✅ IMPLEMENTADO

**Decisión:**  
Lead magnet es una **"Auditoría Web Express Gratuita"** (5 puntos clave evaluados).

**Contexto:**
- 95% de PyMEs no sabe si su web funciona bien
- Auditoría = diagnosis = pain point identificado
- Posiciona a TechNova como "experto" no "vendor"

**Alternativas:**
1. **Checklist de SEO** - Genérico, aburrido
2. **Template de presupuesto** - Menos relevante
3. **Guía de "errores comunes"** - Static, no personalizado
4. **Auditoría (elegido)** - Personalizado, actionable

**Por qué Auditoría ganó:**
- Personalization: cliente ve SU web analizada
- Urgency: "tu web tiene 3 problemas graves"
- Qualification: sabemos si vale la pena contactar
- Retention: cliente espera la auditoría, abre emails

**Trade-offs:**
- ❌ Toma tiempo hacer auditoría (we offset con Cursor/Claude)
- ✅ Pero: 50x mejor conversion que checklist genérico

**Reversible?** Sí fácil (cambiar lead magnet copy/form)

**KPI de Éxito:** Lead Magnet conversion > 15%, lead quality > 30% calificado

---

### D-007: Integración con Stripe (pagos)
**Fecha:** 2026-04-21  
**Dueño:** Agente Desarrollador  
**Status:** ✅ INFRAESTRUCTURA LISTA, PENDIENTE KEYS PROD

**Decisión:**  
Usar **Stripe** para pagos (vs Mercado Pago, OpenPay).

**Contexto:**
- Stripe = standard global
- Documentación excelente
- Tax handling complejo en MX: Stripe maneja
- Support en español (importante para clientes)

**Alternativas:**
1. **Mercado Pago** - Local, pero ecosystem limitado
2. **OpenPay** - Good, pero menos documentación
3. **PayPal** - Fees altos, reputation worse en MX
4. **Stripe (elegido)** - Global, trusted, best DX

**Por qué Stripe ganó:**
- International: si escalamos fuera MX, 0 cambios
- Payout: directamente a banco mexicano
- Webhooks: confiables, bien documentadas
- PCI compliance: Stripe maneja, nosotros somos simples

**Trade-offs:**
- ❌ Fees: 2.9% + $0.30 USD por transacción
- ❌ Menos "local" que Mercado Pago
- ✅ Pero: worth it para futuro scaling

**Reversible?** Medianamente (cambio de SDK, ~3 días de refactor)

**KPI de Éxito:** 0 pagos fallidos, payout < 48h, chargeback rate < 0.1%

---

## 🔐 DECISIONES DE SEGURIDAD

### D-008: Auth = Sin Auth (MVP), luego Auth0
**Fecha:** 2026-04-21  
**Dueño:** Agente Desarrollador  
**Status:** ✅ PENDIENTE IMPLEMENTACIÓN FULL

**Decisión:**  
MVP = cero autenticación (admin manual). **Fase 2** → Auth0 para dashboard de clientes.

**Contexto:**
- MVP: solo landing + lead capture
- No hay "dashboard" de cliente todavía
- Añadir auth = complejidad + delay
- Mejor: vender antes, auth después

**Plan Fase 2:**
- Clientes necesitan dashboard (ver auditoría, estado proyecto)
- Auth0 = OAuth, SSO, MFA, 0 código
- Alternativa: NextAuth.js (open source, pero mantenimiento)

**Por qué Auth0 > NextAuth:**
- Compliance: GDPR, CCPA ready
- MFA: incluyendo biometric
- Cost: $0 hasta 1,000 usuarios
- Support: soporte en español

**Trade-offs:**
- ❌ Vendor lock-in
- ❌ Fee post-1,000 usuarios
- ✅ Pero: security > DIY auth

**KPI de Éxito:** 0 unauthorized access, password reset < 1 min

---

## 📝 DECISIONES DE DOCUMENTACIÓN & PROCESOS

### D-009: Documentación = Markdown en Git (not Notion/Wiki)
**Fecha:** 2026-05-19  
**Dueño:** Vic (Arquitecto)  
**Status:** ✅ IMPLEMENTADO (ARCHITECTURE.md hoy)

**Decisión:**  
Toda documentación **versionada en Git**, formato Markdown (not Notion/Confluence).

**Contexto:**
- Documentación = código, debe versionar
- Git = source of truth
- Markdown = portable, readable en cualquier editor
- Evita: "dónde está ese doc?" problema de Notion

**Alternativas:**
1. **Notion** - Pretty pero siloed, no en Git
2. **Confluence** - Enterprise, overkill
3. **Google Docs** - Colaborativo pero no versionado
4. **Markdown en Git (elegido)** - Simple, portable, versionado

**Por qué Markdown en Git ganó:**
- Version control: git blame = quién escribió qué
- Offline: leo sin conexión
- Portable: cambio de editor = 0 lock-in
- CICD: docs en PR = review automático
- Searchable: grep en toda documentación

**Trade-offs:**
- ❌ Menos "pretty" que Notion
- ❌ Colaboración no-real-time
- ✅ Pero: durabilidad > aesthetics

**KPI de Éxito:** 100% docs in Git, 0 docs in Notion, PR rate > 1/week

---

### D-010: Memory System = 4 archivos persistentes /memory
**Fecha:** 2026-05-19  
**Dueño:** Vic (Arquitecto)  
**Status:** ✅ IMPLEMENTADO (2026-05-20)

**Decisión:**  
Claude mantendrá **4 archivos de memoria persistente** que carga automáticamente cada sesión.

**Contexto:**
- Problema: cada conversación nueva = cero contexto
- Solución: memoria persistente (como un "brain dump" legible)
- Archivos: negocio, stack técnico, estándares dev, preferencias Vic

**Alternativas:**
1. **Notion Database** - Bonito pero Claude no tiene acceso
2. **Obsidian** - Local, pero requiere plugin custom
3. **Markdown en /memory** - Simple, versionado, accesible
4. **SQL Database** - Overkill para memoria

**Por qué Markdown en /memory ganó:**
- Accessible: Claude puede leerlo directamente
- Versionable: cambios en Git
- Durable: en el repo, no en "cloud"
- Readable: humanos + AI pueden editarlo

**Trade-offs:**
- ❌ Manual de actualizar (vs auto-sync)
- ✅ Pero: actualizaciones semanales = suficiente

**KPI de Éxito:** 0 preguntas repetidas sobre contexto, ramp-up < 5 min

---

### D-011: Database Provider — Neon Postgres (vs Supabase, RDS, PlanetScale)
**Fecha:** 2026-05-19
**Dueño:** Claude Code (Arquitecto)
**Status:** ✅ IMPLEMENTADO

**Decisión:**
Usar **Neon Postgres** (serverless puro) como provider de DB.

**Contexto:**
- Postgres ya decidido (D-002 → Drizzle requiere Postgres)
- Workload serverless friendly (Vercel + API Routes en Edge / Node)
- Auth lo manejará Auth0 después (D-008) — no necesitamos suite "todo-en-uno"
- MVP: free tier importa; cero ops para team pequeño

**Alternativas:**
1. **Supabase** — incluye auth + storage + realtime + edge functions
2. **AWS RDS / Aurora** — control total, pero requiere DevOps
3. **PlanetScale** — MySQL serverless con branching (cambia DB engine, descartado)
4. **Railway / Render** — Postgres simple pero sin serverless real

**Por qué Neon ganó:**
- **Postgres puro:** sin SDK propio (a diferencia de Supabase client) — portable a cualquier otro Postgres si toca
- **Branching por PR:** cada feature branch puede tener su propia DB (preview environment perfecto, único en su clase)
- **Scale-to-zero:** $0 cuando no hay tráfico — clave para MVP pre-revenue
- **Driver HTTP** (`@neondatabase/serverless`): sin pool persistente, ideal para serverless
- **Por qué NO Supabase:** auth/storage/realtime son overkill cuando ya planeamos Auth0 (D-008) y no necesitamos realtime aún. SDK propio = lock-in.

**Trade-offs:**
- ❌ Sin auth/storage incluidos (los añadiremos por separado cuando toque)
- ❌ Cold start ocasional en free tier (mitigable con plan Scale)
- ✅ Pero: portabilidad de Postgres puro + branching + free tier > convenience de all-in-one

**Reversible?** Sí, fácilmente (es Postgres estándar — `pg_dump`/`pg_restore` a otro provider, ~2 días si la SQL es portable)

**KPI de Éxito:** Cold start < 500ms p95, $0 MXN/mes hasta primer cliente pagado, branching funcional en cada PR

---

### D-012: Email Transaccional — Resend (vs SendGrid, Postmark, SES, Brevo)
**Fecha:** 2026-05-19
**Dueño:** Claude Code (Arquitecto)
**Status:** ✅ IMPLEMENTADO (dominio prod pendiente)

**Decisión:**
Usar **Resend** para email transaccional (lead magnet, nurturing, confirmaciones).

**Contexto:**
- Lead magnet (D-006) dispara email automático → requiere servicio confiable
- Equipo pequeño: no queremos manejar SMTP, deliverability, bounces manualmente
- Templates como código (React Email) alineados con el resto del stack (React 19 / TypeScript)
- Tier gratuito: 3,000 emails/mes (suficiente para MVP)

**Alternativas:**
1. **SendGrid** — standard enterprise, UI lenta, pricing escala feo
2. **Postmark** — excelente deliverability, caro
3. **AWS SES** — barato pero config compleja (verificación, warm-up, templates aparte)
4. **Brevo (ex-Sendinblue)** — fragmenta stack
5. **Mailgun** — legacy, DX inferior
6. **Nodemailer + SMTP** — hack, no escala, deliverability mala

**Por qué Resend ganó:**
- **API tipo Stripe:** una línea para enviar (`resend.emails.send({...})`)
- **React Email:** templates como componentes React — consistente con stack
- **Pricing:** 3K/mes free + $20/100K (vs SendGrid $20/50K)
- **Verificación de dominio:** 5 min vs días con SES
- **Webhooks:** delivery, bounce, complaint tracking out-of-the-box
- **Founders ex-Vercel:** alineados con stack y filosofía DX

**Trade-offs:**
- ❌ Empresa joven (2023) — riesgo de pivote o adquisición
- ❌ Sin features avanzadas tipo segmentación (eso es Mailchimp/Customer.io territory, no transaccional)
- ✅ Pero: para volumen MVP/Growth es ideal

**Status actual:** integrado en [`src/app/api/leads/route.ts:6`](./src/app/api/leads/route.ts). Hoy envía desde `onboarding@resend.dev` (dominio testing).
**TODO:** verificar dominio prod (ej. `mail.technova.mx`) antes de campaign launch.

**Reversible?** Sí, fácil (~1 día — intercambiar SDK; los templates HTML son portables)

**KPI de Éxito:** Deliverability > 98%, bounce rate < 2%, open rate auditoría > 40%

---

### D-013: Estructura de Carpetas — `src/` flat + agrupación por feature en `components/`
**Fecha:** 2026-05-19
**Dueño:** Claude Code (Arquitecto)
**Status:** ✅ DOCUMENTADO (estructura real verificada post `chore: move next.js project to root`)

**Decisión:**
Estructura **flat** dentro de `src/` con agrupación temática en `components/` (no por tipo, no monorepo).

**Estructura REAL hoy:**
```
src/
├── app/                  ← App Router (rutas, layouts, api)
│   ├── api/              ← Route handlers (leads, checkout)
│   ├── services/         ← Sub-rutas EN (8 verticals: chatbot, crm, data-analysis, ecommerce, landing-page, lms, marketing, support, web-app)
│   ├── servicios/        ← Versión ES (multi-idioma parcial)
│   ├── pricing/, nosotros/, contacto/, start-project/, privacidad/, terminos/
│   └── layout.tsx, page.tsx, globals.css
├── components/
│   ├── home/             ← Hero, Sections, NovaAISection, LeadMagnetSection, ParticleBackground…
│   ├── layout/           ← Navbar, Footer, AdLandingLayout
│   ├── wizard/           ← Wizard cotizador
│   ├── funnel/           ← Lead magnet UI
│   ├── navigator/        ← TechNova Navigator (IMR)
│   └── shared/           ← Componentes reutilizables
├── db/                   ← Drizzle schema + cliente Neon
├── data/                 ← Datos estáticos
├── hooks/                ← React hooks custom
└── pages/services/       ← ⚠️ LEGACY Pages Router (pendiente borrar)
```

**Path alias:** `@/*` → `./src/*` (definido en `tsconfig.json`).

**Contexto:**
- Migración desde Vite con react-router (D-001) requirió reorganización
- `web-app/` existía como nombre legacy; movido a raíz para deploy directo en Vercel (commit `chore: move next.js project to root`)
- Team pequeño: estructura debe ser intuitiva sin docs adicionales

**Alternativas:**
1. **Por tipo** (`components/`, `containers/`, `pages/`, `utils/`) — legacy React, no alinea con App Router
2. **Por dominio (DDD):** `features/leads/`, `features/wizard/` con co-location UI+lógica+tests — buena para proyectos grandes, overkill ahora
3. **Monorepo:** `apps/web`, `apps/admin`, `packages/ui` — overkill para 1 app
4. **Flat por feature (elegido):** balance simplicidad ↔ crecimiento futuro

**Por qué Flat + feature ganó:**
- App Router lo prefiere: rutas en `app/` son self-contained, no duplican estructura
- `components/<feature>/` escala bien — cuando una feature crece, mover a `features/` es trivial
- Path alias `@/*` evita imports relativos largos sin necesidad de monorepo
- Onboarding < 5 min: dev nuevo encuentra todo sin guía

**Trade-offs:**
- ❌ `components/shared/` puede convertirse en cajón de sastre — hay que disciplinarse
- ❌ Lógica + UI no co-localizada (lógica en `hooks/` o inline)
- ✅ Pero: mejor lo simple ahora que abstracciones prematuras

**Deuda técnica documentada (pendientes):**
- 🗑️ Borrar `src/pages/services/` (legacy Pages Router post-migración a App Router)
- 🗑️ Limpiar `web-app/` en raíz (residual del layout pre-migración a root)
- 📁 Crear `docs/technical/` cuando arranque Fase 2 (TECHNICAL_ARCHITECTURE.md, etc.)

**⚠️ Nota:** Versiones previas de este decision documentaban una estructura inventada con `pricing/`, `ui/`, `types/`, `utils/`, `env.ts` — esas carpetas **NO existen** en el repo. La estructura listada arriba es la verificada en disco al 2026-05-19.

**Reversible?** Sí, fácilmente (mover archivos + ajustar imports — los path aliases ayudan)

**KPI de Éxito:** Dev nuevo encuentra archivo objetivo en < 30s sin guía, < 10% imports relativos `../../../`

---

## 🚀 DECISIONES DE FASE B - GROWTH & CREDIBILITY

### D-014: Marketing Funnel Architecture — 4-Phase System (Awareness → Conversion → Loyalty)
**Fecha:** 2026-05-20  
**Dueño:** Vic (Estrategia Comercial) + Claude (Implementación)  
**Status:** ✅ ARQUITECTURA DOCUMENTADA (implementación Fase B)

**Decisión:**  
Implementar **funnel de marketing de 4 fases** con email automation, paid ads multi-canal, blog SEO, y analytics.

**Contexto:**
- MVP (Fase A) = landing + lead capture (no funnel)
- Fase B = growth sistemático hacia 500+ visitors/mes, 30-50 leads/mes, 5-10 clientes/mes
- Necesitamos automatización (email sequences, ads, retargeting) sin agregar 3 FTEs
- ROI debe justificar budget: $2,500/mes total ads ($1,300 Google, $700 Facebook, $500 LinkedIn)

**Arquitectura 4-Fases:**
1. **Awareness** (Ads + Blog) — traer visitantes iniciales
   - Google Ads: $1,300/mes en palabras clave ("desarrollo web mexico", "landing pages", etc.)
   - Facebook/Instagram: $700/mes remarketing + lookalike audiences
   - Blog: 2 posts/semana SEO-optimizados, 3 meses para autoridad
2. **Consideration** (Email + Retargeting) — nutrir prospects
   - Email sequences automáticas: welcome (5 emails), pricing page visitor (3), blog reader (3), abandoned form (2)
   - LinkedIn: $500/mes thought leadership, content sponsoring
   - Pixel retargeting en Google + Facebook
3. **Conversion** (NOVA AI + Checkout) — cerrar deals
   - NOVA AI como lead qualifier automático (conversacional, propuestas auto-generadas)
   - Checkout integrado (Stripe), no redirección manual
4. **Loyalty** (Retention Sequences) — upsell + renewal
   - Post-delivery email secuence (4 emails)
   - Upsell sequences para nuevos servicios / plan mensual de mantenimiento
   - NPS survey automático

**Email Sequences Detalladas:**
- Welcome series: 5 emails en 7 días (descubrimiento → valor → social proof → urgencia → CTA)
- Pricing visitor: 3 emails en 3 días (aclaración de precios → ROI → cierre)
- Blog reader: 3 emails en 14 días (contenido relacionado → consultation offer)
- Abandoned form: 2 emails en 24h + 5 días (rescate soft → reframing beneficios)
- Post-delivery: 4 emails en 60 días (onboarding → feedback → upsell → renewal)

**Paid Ad Targeting:**
- Google Search: palabras clave high-intent (desarrollo web, landing page, ecommerce, etc.)
- Facebook/Instagram: lookalike audiencias de leads históricos + retargeting pixel
- LinkedIn: targeting geográfico + industry + seniority + interests
- Retargeting: audiencia de website visitors (Google Ads, Facebook CAPI)

**Blog Strategy:**
- 2 posts/semana (10 posts/mes, 30 posts en Fase B)
- SEO optimizado (target keywords con intención comercial)
- Thought leadership (case studies, opiniones sobre market)
- Republishing en LinkedIn, newsletter

**Analytics Dashboard:**
- `/admin/marketing-analytics` con métricas por funnel stage
- Metrics: traffic by source, conversion rates, email open/click rates, cost per lead, LTV
- Data warehouse: Supabase + manual queries (no GA4 necesario)

**Alternativas Consideradas:**
1. **Influencer marketing** — cara, poco ROI para B2B MX local
2. **Trade shows / Presenciales** — post-MVP cuando haya proof of concept
3. **Affiliate program** — demasiado prematuro sin base de clientes
4. **Solo organic** — demasiado lento, burn resources

**Por qué 4-Phase Automation ganó:**
- Scalable: email + retargeting sin agregar headcount
- Data-driven: every step medible → optimizar CAC/LTV
- Integrated: NOVA AI como mecanismo de conversión (no manual handoff)
- Proven: modelos están validados en SaaS / servicios digitales

**Trade-offs:**
- ❌ Requiere disciplina con email list management (unsubscribes, spam rate)
- ❌ Google Ads learning phase: $500-$800 antes de optimization (month 1)
- ✅ Pero: ROI payback en 4-5 meses si conversion > 3%

**Reversible?** Sí, parcialmente (pausar ads fácil; email list migrable a otro ESP)

**Blockers para ejecución:**
- B.2.1: Blog posts listos
- B.2.2: Email sequences configuradas en Mailchimp
- B.2.3: Pixel retargeting instalado
- B.2.4: NOVA AI funcional (D-015)

**KPI de Éxito:** 
- 500+ website visitors/mes by end Fase B
- 30-50 qualified leads/mes
- CAC < $2,000 MXN
- ROAS > 2.5x on paid ads
- Email open rate > 35%

---

### D-015: NOVA AI Redesign — Autonomous Advisor (Conversational + Auto-Qualification + Auto-Proposal)
**Fecha:** 2026-05-20  
**Dueño:** Vic (Producto) + Claude (Arquitectura)  
**Status:** ✅ ESPECIFICACIÓN COMPLETA (desarrollo Fase B, demo Sept 2026)

**Decisión:**  
Rediseñar **NOVA AI de formulario wizard → conversacional advisor autónomo** que califica leads automáticamente y genera propuestas sin intervención humana.

**Contexto:**
- Fase A: NOVA fue un form wizard (6 preguntas → PDF presupuesto manual)
- Problema: conversión baja (~15%), requería follow-up manual
- Oportunidad: Claude API permite conversación → análisis profundo → propuesta auto-generada
- Visión: "asesor autónomo que no necesita intervención humana"

**Arquitectura Nueva:**

**User Journey (5 pasos):**
1. **Welcome** — "Cuéntame sobre tu proyecto" (conversación abierta)
2. **Qualification** — Bot hace 8-10 preguntas dinámicas por categoría (eCommerce, SaaS, landing page, etc.)
3. **Deep-Dive** — Preguntas category-specific (ej: para eCommerce = productos, integraciones, volumen; para SaaS = features, users, MVP vs scale)
4. **AI Analysis** — Claude API + contexto del usuario → scoring de 0-100%
5. **Outcome:**
   - Score 80%+: propuesta auto-generada + instant checkout (Stripe)
   - Score 60-79%: propuesta auto-generada + "revisar con especialista" (humano toma después)
   - Score <60%: decline automático ("no es buen fit ahora, mejor cuando X condición")

**Qualification Scoring (Fórmula):**
```
Score = (Budget × 0.25) + (Clarity × 0.25) + (Timeline × 0.20) + (Viability × 0.20) + (Intent × 0.10)

Donde:
- Budget [0-100]: ¿presupuesto es realista para scope? 0=imposible, 100=abundante
- Clarity [0-100]: ¿cliente sabe qué necesita? 0=vago, 100=especificidad quirúrgica
- Timeline [0-100]: ¿timeline es realista? 0=mañana, 100=3+ meses
- Viability [0-100]: ¿proyecto es técnicamente viable? 0=impossible, 100=trivial
- Intent [0-100]: ¿intención de compra es genuina? 0=curiosidad, 100=decision-ready
```

**Claude API Integration (4 Prompts):**
1. **Initial Analysis** — Primera respuesta → classify por industria + problem type
2. **Follow-up Generator** — Basado en respuesta anterior, generar siguiente pregunta (max 8 preguntas)
3. **Proposal Generator** — Convertir conversation log → propuesta estructurada (timeline, budget breakdown, success metrics)
4. **Qualification Decision** — Decision logic: route a checkout / manual review / decline

**Database Schema (Supabase):**
```sql
CREATE TABLE nova_conversations (
  id UUID PRIMARY KEY,
  user_id UUID,
  category VARCHAR (ecommerce, saas, landing, corporate, other),
  conversation_log JSONB,  -- [{role: 'user'|'assistant', content: '...'}]
  score NUMERIC,
  status VARCHAR (ongoing, completed, qualified, rejected),
  proposal_generated JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Propuesta Auto-Generada (contenido):**
- Resumen del proyecto (1 párrafo)
- Scope desglosado (3-5 componentes principales)
- Timeline (fases, semanas estimadas)
- Budget breakdown (desarrollo, diseño, infraestructura, testing)
- Success metrics (qué mide "éxito" del proyecto)
- Payment terms (50% upfront, 50% entrega)
- Next steps (si auto-checkout no se ejecuta)

**Technology Stack:**
- Frontend: React component `/app/nova-ai/` con chat UI (Vercel AI SDK para streaming)
- Backend: `/api/nova/` route handlers (analysis, proposal generation, classification)
- LLM: Claude API (model: `claude-opus-4-6` para análisis complejo)
- Storage: Supabase (conversations table)
- Checkout: Stripe embedded (para score 80%+)
- Monitoring: logs en Supabase + error tracking

**Alternativas Consideradas:**
1. **Keep wizard** — Mantener form wizard, mejorar follow-up manual
   - ❌ No escalable, requiere Vic interviniendo en cada lead
2. **Third-party chatbot (Drift, HubSpot)** 
   - ❌ Loss of control, vendor lock-in, no integración con NOVA branding
3. **GPT-based (OpenAI)** 
   - ❌ API cost > Anthropic, menos control sobre output
4. **Claude conversational (elegido)**
   - ✅ Anthropic API proven, DX excelente, output quality, mejor cost

**Por qué Claude Conversational ganó:**
- Output quality: Claude mejor que GPT-3.5 en análisis de texto
- Cost: token pricing es favorable para long conversations
- Control: prompts custom = output predecible
- Branding: "NOVA es inteligente" = Claude reputation
- Integration: Resend + Stripe + Supabase all work seamlessly

**Trade-offs:**
- ❌ Cold start time en first message (~3-5 segundos esperando Claude)
- ❌ Cost grows con volumen (cada conversation = X tokens) — mitigable con caching
- ✅ Pero: value of auto-qualification >> cost per conversation

**Demo Plan (Septiembre 2026):**
- Live demo en website
- 100 initial conversations históricos
- Conversion rate target: > 30% de conversations → checkout
- Accuracy of scoring: > 80% (vs historical manual qualify rate)

**Blockers:**
- B.3.1: Core engine conversational (chat UI, storage)
- B.3.2: Qualification scoring (formula, prompts)
- B.3.3: Claude API integration (analysis + proposal generation)
- B.3.4: Proposal generator (templates, Stripe integration)
- B.3.5: Database & conversation logging
- B.3.6: Testing & optimization
- B.3.7: Demo & launch

**Reversible?** Parcialmente (si requiere cambio de LLM, ~1 semana de refactor)

**KPI de Éxito:**
- Qualification accuracy > 80%
- Conversion rate auto-checkout > 60% (score 80%+)
- Manual review rate 15-25% (score 60-79%)
- Decline rate < 15%
- Average conversation duration: 3-5 minutes
- Claude API cost < $0.50 USD per conversation

---

### D-016: Autonomous Backlog Management System — Daily AI Analysis + Auto-Recommendations
**Fecha:** 2026-05-20  
**Dueño:** Vic (Estrategia) + Claude (Arquitectura)  
**Status:** ✅ ARQUITECTURA DOCUMENTADA (desarrollo Fase B)

**Decisión:**  
Crear **agente autónomo que corre diario**, analiza BITACORA.md + BACKLOG_MASTER.md, detecta blockers, y recomienda reordenamiento de prioridades.

**Contexto:**
- Proyecto complejo: 3 fases, 50+ tareas, dependencias cruzadas
- Vic no puede monitorear estado manualmente cada sesión
- Riesgo: task dependencies no vistas → fases se atrasan
- Solución: Claude agent corriendo daily, actúa como "project manager AI"

**Flujo de Ejecución (Diario @ 09:00 UTC):**
1. **READ** — Lee BITACORA.md (event log), BACKLOG_MASTER.md (plan), DECISION_LOG.md (contexto), últimos commits Git
2. **ANALYZE** — Evalúa:
   - Progress tracking (% complete per phase)
   - Burndown rate (vs timeline)
   - Dependency impact (si Task X atrasa, qué tasks se bloquean)
   - Risk identification (tasks en rojo, technical debt acumulado)
   - Velocity trend (horas completadas vs planeadas)
3. **DECIDE** — Genera recomendaciones:
   - Priority reordering (si Phase B se atrasa, qué tareas son críticas)
   - Scope adjustments (cortar features non-essential si es necesario)
   - Next task recommendations (qué debe atacar mañana Vic/Claude)
4. **ACT** — Acciones automáticas:
   - Update BACKLOG_MASTER.md con status actual
   - Send Slack message to Vic con reporte
   - Commit cambios a Git (tracked in BITACORA.md)
5. **OUTPUT** — Genera 2 reportes:
   - Automated daily standup (Slack)
   - Burndown chart (PNG, embebido en dashboard `/admin/project-status`)

**Data Sources (Input):**
- **BITACORA.md** — Event log (timestamps, tareas completadas, decisiones, blockers encontrados)
- **BACKLOG_MASTER.md** — Master plan (fases, tasks, timelines, dependencies)
- **DECISION_LOG.md** — Strategic context (por qué hacemos esto así)
- **Git commits** — Cambios reales en código (verificación de progress)
- **Optional:** Manual input vía `/admin/standup` form (Vic entra data si no git commit automático)

**Analysis Engine (Claude API):**

**Progress Tracking Prompts:**
```
"Analiza BITACORA.md desde hace 7 días.
¿Qué tareas se completaron? ¿Qué % de Fase A está listo?
¿Hay tasks que están stuck por >3 días sin progress?
Ranking tasks por criticidad (bloquean dependencias downstream)."
```

**Burndown Calculation:**
```
Planned hours Fase B: 900
Completed hours so far: X (from BITACORA.md)
Remaining: 900 - X
Days left: 70 (hasta Sept 30, 2026)
Required velocity: (900 - X) / 70 horas/día

Alert si actual velocity < required by 20%
```

**Dependency Impact:**
```
"Si Task B.2.3 (Mailchimp setup) se atrasa 2 semanas:
- Task B.2.4 (Email sequences) está bloqueada → 3 semanas delay
- Task B.2.6 (Marketing analytics) puede proceder en paralelo
- Critical path impact: overall Fase B delay de 2 semanas"
```

**Output Format (Slack + Dashboard):**

**Daily Standup (Slack message):**
```
📊 TechNova Project Status — May 20, 2026 09:00 UTC

🟢 Phase A: 85% complete (30.5/36 weeks)
🟡 On track for Phase B kickoff May 28
⚠️ BUG ALERT: 8 critical bugs identified (see PHASE_A_BUG_LIST.md)

📈 This week:
- 12 hours completed (vs 14 planned) — 86% velocity
- 3 tasks done: bug audits, NOVA AI spec, marketing funnel doc
- 2 tasks blocked: none

🔴 Blockers: None (all dependencies resolved)

📋 Recommended next tasks:
1. Fix 8 Phase A bugs (critical, blocks Phase B)
2. Setup Mailchimp (unblocks all marketing)
3. Finalize NOVA AI schema (unblocks B.3.1)

✅ On track for September launch (confidence: 85%)
```

**Burndown Chart (Dashboard):**
- Planned vs actual curve
- Velocity trend (7-day rolling average)
- Risk zone (if actual < 80% of planned)

**Decision Engine (Reordering Logic):**
```
IF Fase_B_velocity < required_velocity THEN
  RECOMMEND prioritize:
    B.3 (NOVA AI — highest ROI)
    B.2 (Marketing funnel — drives leads)
    B.1 (Imagery — nice-to-have)
ELSE
  PROCEED with original priority
```

**Technology Stack:**
- **Scheduler:** GitHub Actions or cron (runs `/api/backlog-manager` daily @ 09:00 UTC)
- **Claude API:** model claude-opus-4-6 para análisis profundo
- **Database:** Supabase (backlog_snapshots table, stores daily analysis results)
- **Output:** 
  - Slack bot (envia mensaje daily)
  - Dashboard `/admin/project-status` (chart + latest standup)
  - Git commits (BITACORA.md updated + pushed)

**Database Schema (Supabase):**
```sql
CREATE TABLE backlog_snapshots (
  id UUID PRIMARY KEY,
  snapshot_date DATE,
  phase_a_completion_percent NUMERIC,
  phase_b_completion_percent NUMERIC,
  overall_velocity NUMERIC (hours/day),
  required_velocity NUMERIC,
  blockers TEXT [],
  recommendations TEXT,
  burndown_data JSONB,
  created_at TIMESTAMP
);
```

**Alternativas Consideradas:**
1. **Manual standup** — Vic updates daily → no, too time consuming
2. **Jira / Linear automation** — Locked into tool, less flexible
3. **Simple Excel tracker** — No insights, manual updates
4. **Claude agent (elegido)** — Intelligent analysis, learns from data, no tool lock-in

**Por qué Claude Agent ganó:**
- Intelligence: can contextualize delays (external factors, technical debt, team capacity)
- Learning: improves recommendations over time (better velocity prediction)
- Flexibility: reads Markdown, Git, Slack — no tool lock-in
- Cost: runs once daily = minimal API spend (~$0.50 USD/día)
- Ownership: Vic owns the analysis (not vendor dashboard)

**Trade-offs:**
- ❌ Requires discipline keeping BITACORA.md updated (garbage in = garbage out)
- ❌ Slack integration requires manual setup (webhook auth)
- ✅ Pero: 5+ hours/week saved on manual status tracking

**Reversible?** Sí, totalmente (pause agent = manual tracking resumes)

**Implementation Checklist:**
- [ ] Create `backlog_snapshots` table in Supabase
- [ ] Build `/api/backlog-manager` endpoint (Claude calls + analysis)
- [ ] Setup GitHub Actions workflow for daily 09:00 UTC trigger
- [ ] Configure Slack bot integration + webhook
- [ ] Build `/admin/project-status` dashboard (burndown chart)
- [ ] Test with historical data (run analysis for past 2 weeks)
- [ ] Deploy to production (Fase B start)

**KPI de Éxito:**
- Prediction accuracy: > 80% (actual finish date vs predicted)
- False alarm rate: < 10% (alerts that turn out to not be blockers)
- Action rate: > 80% (recommendations that Vic acts on)
- Time saved: 5+ hours/week (vs manual standup)
- Confidence level: > 85% on-time Fase B delivery

---

### D-017: Phase A Bug Priority & Fix Timeline — 8 Bugs, 7.5 Hours, CRITICAL Blocker for Fase B
**Fecha:** 2026-05-20  
**Dueño:** Vic (QA Owner) + Claude Code (Implementación)  
**Status:** ✅ BUGS DOCUMENTADOS (fixes comienzan inmediatamente)

**Decisión:**  
**Pausar Fase B planning** hasta que se corrijan 8 bugs críticos encontrados en website review. 7.5 horas estimadas. **Blocker.**

**Contexto:**
- Live website review reveló 8 UI/UX bugs (text invisible, broken dropdowns, button contrast)
- Bugs afectan credibilidad + conversión (visitantes no pueden interactuar)
- Better to fix ahora en Fase A que permitir bugs llegar a Fase B launch
- Estimación: 7.5 horas de trabajo (4 CRITICAL, 4 MEDIA)

**Bug List (Por Severidad):**

**🔴 CRITICAL (Bloquea Fase B):**
1. **Navbar dropdown invisible** (BUG 2) — `src/components/layout/Header.tsx`
   - Problema: bg-white/5 demasiado transparente, texto gris invisible
   - Fix: cambiar a bg-darker/95 + border
   - Tiempo: 1.5 horas

2. **Botones blancos sin texto** (BUG 4, BUG 8) — Multiple buttons
   - Problema: bg-white sin text-darker = CTA invisible
   - Fix: audit all buttons, añadir text-darker + font-bold
   - Tiempo: 2 horas

3. **Dropdown presupuesto invisible** (BUG 5) — `src/app/start-project/page.tsx`
   - Problema: text color claro, no contrasta con fondo oscuro
   - Fix: text-white + bg-darker en options
   - Tiempo: 1 hora

4. **Banner texto gradient no visible** (BUG 1) — `src/components/home/Hero.tsx`
   - Problema: text-gradient sin contraste suficiente
   - Fix: aumentar saturación + agregar text-shadow
   - Tiempo: 1 hora

**🟡 MEDIA (Nice-to-have):**
5. **Email setup hola@technova.com** (BUG 6)
   - Problema: email no existe, configuración pendiente
   - Fix: crear Gmail account + set forwarding → victorsm2893@gmail.com
   - Tiempo: 30 minutos

6. **Teléfono correcto** (BUG 7) — `src/app/contacto/page.tsx`
   - Problema: placeholder "+1 (234) 567-890" en vez de real
   - Fix: cambiar a 722 166 9672
   - Tiempo: 15 minutos

7. **Casos de éxito confusión** (BUG 3) — `src/app/page.tsx`
   - Problema: sección "Casos de Éxito" muestra servicios, no casos reales
   - Fix: renombrar a "Servicios" o remover sección temporalmente
   - Tiempo: 30 minutos

**Total Estimación:**
| Bug | Severity | Est. Time | Task |
|-----|----------|-----------|------|
| BUG 1 | CRITICAL | 1h | Hero text gradient contrast |
| BUG 2 | CRITICAL | 1.5h | Navbar dropdown visibility |
| BUG 3 | MEDIA | 0.5h | Cases section rename |
| BUG 4 | CRITICAL | 2h | Button contrast audit + fixes |
| BUG 5 | CRITICAL | 1h | Dropdown presupuesto |
| BUG 6 | MEDIA | 0.5h | Email setup |
| BUG 7 | MEDIA | 0.25h | Phone number |
| **TOTAL** | | **7.5h** | |

**Implementation Order (Critical first, parallel MEDIA):**
1. **BUG 2 + BUG 5** (dropdowns) — 2.5 horas [parallel tasks]
2. **BUG 4** (button audit) — 2 horas [depends on #1 for test coverage]
3. **BUG 1** (hero text) — 1 hora [quick, visual check]
4. **BUG 3, 6, 7** (easy wins) — 1.25 horas [parallel MEDIA tasks]

**Alternativas Consideradas:**
1. **Defer to Fase B** — Arriesgar imagen de professionalism, visitors bouncing
2. **Workaround (CSS-only band-aids)** — Problemas persisten, peor experiencia
3. **Rewrite components** (overkill) — 5+ horas innecesarias
4. **Fix now (elegido)** — Clean, fast, blocks nothing else

**Por qué Fix Now ganó:**
- Impacto: bugs visibles a todo visitante (no atrasa dev, rápido retorno)
- Credibilidad: site profesional > site con bugs obvios
- Unblocks: una vez fixed, Fase B puede proceder sin distracciones
- Psychological: "we care about quality" vs "we ship broken"

**Trade-offs:**
- ❌ 7.5 horas delay en Fase B prep (BUT: prep puede continuar en paralelo)
- ✅ Pero: evita bugs llegando a clientes / Fase B launch

**Blockers para ejecución:**
- Access a codebase (repo en Vercel)
- CSS + component refactoring skills (moderate)
- Testing en live site (visual regression)

**Reversible?** N/A (fixes son mejoras, no decisión reversible)

**Testing Strategy:**
- Visual regression: antes/después screenshots en 3+ browsers
- Mobile: responsive test en Safari + Chrome mobile
- Accessibility: axe DevTools scan para contrast ratios

**KPI de Éxito:**
- All 8 bugs fixed & verified (0 regressions)
- WCAG AA compliance on contrast (> 4.5:1 for text)
- Visual regression: 0 breaking changes
- Completion: before May 28 (Fase B kickoff)

---

## 📌 PRÓXIMOS REGISTROS

Los siguientes registros se añadirán aquí conforme se tomen nuevas decisiones:
- D-018: Validación de inputs API (Zod vs alternativa) — bloquea hardening
- D-019: Estrategia i18n (multi-idioma — hoy ES default, EN parcial bajo `/services`)
- D-020: Modelo de servicio post-entrega (soporte, SLA, tiers de mantenimiento)
- D-021: Estrategia de hiring (roles prioritarios, criterios)
- D-022: Toast/notificaciones UI (librería cuando se añadan más formularios)
- ...

---

## 🔗 REFERENCIAS

**Documentación relacionada:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documento maestro
- [TECHNICAL_ARCHITECTURE.md](./docs/technical/TECHNICAL_ARCHITECTURE.md) - Stack en detalle
- [Technova.md](./Technova.md) - Plan de negocio
- [strategy.md](./strategy.md) - Estrategia simplificada

---

**Última actualización:** 2026-05-19  
**Próxima revisión:** Cuando se tome decisión nueva  
**Owner:** Vic (Arquitecto) + Equipo TechNova
