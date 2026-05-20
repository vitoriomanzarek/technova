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

## 📌 PRÓXIMOS REGISTROS

Los siguientes registros se añadirán aquí conforme se tomen nuevas decisiones:
- D-014: Estrategia de contenido (blog, video, formato y cadencia)
- D-015: Modelo de servicio post-entrega (soporte, SLA, tiers de mantenimiento)
- D-016: Estrategia de hiring (roles prioritarios, criterios)
- D-017: Toast/notificaciones UI (librería cuando se añadan más formularios)
- D-018: Validación de inputs API (Zod vs alternativa) — bloquea hardening
- D-019: Estrategia i18n (multi-idioma — hoy ES default, EN parcial bajo `/services`)
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
