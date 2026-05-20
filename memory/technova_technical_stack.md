---
name: technova-technical-stack
description: Stack técnico de TechNova con versiones exactas de package.json, racional de cada herramienta y alternativas descartadas
metadata:
  type: project
---

# ⚙️ TechNova — Stack Técnico

> **Fuentes vivas:** `package.json`, `DECISION_LOG.md` (D-001 / D-002 / D-003 / D-007 / D-008), `AGENTS.md`.

> ⚠️ **AGENTS.md dice:** "This is NOT the Next.js you know — breaking changes en 16.x." Antes de escribir código nuevo de Next.js, consultar `node_modules/next/dist/docs/`.

---

## 1. Stack Instalado (verificado en `package.json`)

### Runtime / Framework
| Paquete | Versión exacta | Notas |
|---------|----------------|-------|
| `next` | **16.2.4** | App Router (no Pages). Server Components por default. |
| `react` | **19.2.4** | React 19 — `use()`, Actions, async transitions. |
| `react-dom` | **19.2.4** | |
| `typescript` | **^5** | Strict mode. |
| `eslint` | `^9` | Flat config (`eslint.config.mjs`). |
| `eslint-config-next` | `16.2.4` | |

### Estilos & UI
| Paquete | Versión | Notas |
|---------|---------|-------|
| `tailwindcss` | **^4** | v4: JIT mejorado, `@theme` inline, sin `tailwind.config.js` tradicional. |
| `@tailwindcss/postcss` | `^4` | Plugin oficial de PostCSS para v4. |
| `clsx` | `^2.1.1` | Composición de clases (instalado, uso opcional). |
| `tailwind-merge` | `^3.5.0` | Resolver conflictos de clases Tailwind. |
| `framer-motion` | `^12.38.0` | Animaciones (Hero, Pricing, secciones). |
| `lucide-react` | `^1.8.0` | Iconos. |

### Base de Datos
| Paquete | Versión | Notas |
|---------|---------|-------|
| `drizzle-orm` | `^0.45.2` | ORM type-safe sin codegen. |
| `drizzle-kit` | `^0.31.10` | Migrations / introspection (`drizzle.config.ts`). |
| `@neondatabase/serverless` | `^1.1.0` | Driver HTTP para Neon Postgres (serverless-friendly). |

### Email / Externos
| Paquete | Versión | Notas |
|---------|---------|-------|
| `resend` | `^6.12.2` | Email transaccional (lead magnet, nurturing). |
| `dotenv` | `^17.4.2` | Solo para scripts standalone (Next.js carga `.env` nativo). |
| `tsx` | `^4.21.0` | Ejecutar scripts TS (`migrate.mjs`, `create_routes.mjs`). |

### ⚠️ Mencionado en docs PERO NO instalado
- **`stripe` SDK** — `app/api/checkout/route.ts` es **boilerplate sin SDK**. D-007 status: *"infraestructura lista, pendiente keys producción"*. Cuando se active → `npm install stripe`.
- **Auth0 / NextAuth** — cero auth en MVP (D-008). Plan Fase 2 = Auth0.
- **Vitest / Jest / Playwright / React Testing Library** — sin testing instalado.
- **Headless UI / Shadcn / Radix** — no instalados (a pesar de menciones en versiones previas de este doc).
- **Zod** — no instalado todavía; validación pendiente para APIs.

---

## 2. Racional por Herramienta (resumen de DECISION_LOG)

### D-001 · Next.js 16 + App Router
- **Por qué ganó:** SSR + SSG + ISR + API Routes nativos, deploy en Vercel sin DevOps, ecosystem maduro.
- **Descartadas:** Remix (menos ecosystem), Astro (limitado interactividad), SvelteKit (team no sabe Svelte), Vite + Node (más complejo).
- **Trade-off aceptado:** vendor lock-in parcial con Vercel.

### D-002 · Drizzle ORM + Neon Postgres
- **Por qué Drizzle ganó:** zero runtime / zero codegen, sintaxis SQL-like type-safe, sin migraciones XML.
- **Descartadas (ORM):** Prisma (codegen, queries grandes), TypeORM (heavy), Sequelize (legacy), Raw SQL + Zod (boilerplate).
- **Por qué Neon vs Supabase:** Neon = solo Postgres serverless con autoscaling y **branching por PR** (preview DB automática). Supabase incluye auth + storage + realtime — overkill cuando ya planeamos Auth0 (D-008) y no necesitamos realtime. DX similar a Vercel.

### D-003 · Tailwind CSS v4
- **Por qué ganó:** velocidad prototipado, bundle purgado automático, JIT mejorado en v4.
- **Descartadas:** Styled Components (runtime overhead), CSS Modules (team grande), Pico/Custom CSS.

### D-007 · Stripe (pagos)
- **Por qué ganó:** standard global, soporta MXN, payouts a banco mexicano, webhooks confiables, PCI handled por ellos.
- **Descartadas:** Mercado Pago (ecosystem limitado), OpenPay (menos docs), PayPal (fees + mala reputación MX).
- **Status:** infraestructura preparada, **SDK no instalado**, keys producción pendientes.

### Resend (email) — racional no formalizado aún en DECISION_LOG
- **Por qué Resend:** API tipo Stripe (DX excelente), pricing pay-as-you-go (3K emails/mes free), soporta React Email para templates como componentes, verificación de dominio rápida.
- **Descartadas:** SendGrid (UI lenta, más caro), Postmark (caro), AWS SES (config compleja, sin templates UI), Mailgun (legacy).
- **TODO:** verificar dominio prod — hoy se usa `onboarding@resend.dev` testing (`src/app/api/leads/route.ts:21`).

---

## 3. Estructura de Carpetas (actual, post `chore: move next.js project to root`)

```
/technova
├── src/
│   ├── app/              ← App Router (routes, layouts, api)
│   │   ├── api/          ← Route handlers (leads, checkout)
│   │   ├── services/     ← Sub-rutas EN de servicios (8 verticals)
│   │   ├── servicios/    ← Versión ES (multi-idioma parcial)
│   │   ├── pricing/, nosotros/, contacto/, start-project/, privacidad/, terminos/
│   │   └── layout.tsx, page.tsx, globals.css
│   ├── components/
│   │   ├── home/         ← Hero, Sections, NovaAISection, LeadMagnetSection…
│   │   ├── layout/       ← Navbar, Footer, AdLandingLayout
│   │   ├── wizard/       ← Wizard cotizador
│   │   ├── funnel/       ← Lead magnet UI
│   │   ├── navigator/    ← TechNova Navigator (IMR)
│   │   └── shared/       ← Componentes reutilizables
│   ├── db/               ← Drizzle schema + cliente Neon
│   ├── data/             ← Datos estáticos
│   ├── hooks/            ← React hooks custom
│   └── pages/services/   ← ⚠️ Legacy de Pages Router — pendiente limpieza
├── docs/                 ← Documentación de negocio
│   └── technical/        ← (pendiente, Fase 2) docs técnicos vivos
├── memory/               ← Memoria persistente Claude (este archivo)
├── public/, img/         ← Assets estáticos
├── web-app/              ← ⚠️ Legacy del antiguo layout pre-migración — pendiente limpieza
└── *.md                  ← ARCHITECTURE, DECISION_LOG, AGENTS, README, MEMORY, etc.
```

**Path alias:** `@/*` → `./src/*` (definido en `tsconfig.json`).

---

## 4. Constraints Técnicos

- **Hosting:** Vercel (target, no confirmado prod). Build con `next build`, deploy push-to-GitHub.
- **Database:** Neon Postgres serverless via HTTP driver (sin pool persistente).
- **Email:** Resend con dominio testing — pendiente verificar dominio prod.
- **Pagos:** Stripe en standby (sin SDK instalado todavía).
- **Browser support:** moderno (ES2022+). Next 16 + React 19 no soportan IE.
- **Bundle target:** Core Web Vitals green, TTL < 2s (D-001).
- **Idioma:** ES (default `<html lang="es">`), EN parcial bajo `/services` vs `/servicios`.

---

## 5. Variables de Entorno (verificado contra el código)

```
DATABASE_URL=postgres://...neon...         # usado en src/db/
RESEND_API_KEY=re_...                       # src/app/api/leads/route.ts:6
# STRIPE_SECRET_KEY=sk_...                  # pendiente (D-007)
# STRIPE_WEBHOOK_SECRET=whsec_...           # pendiente
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_...      # pendiente
```

Tracking embebido en `src/app/layout.tsx`:
- GTM: `GTM-55RLL2LW`
- Meta Pixel: `718504998021592`

---

## 6. Performance Targets
- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1
- **Bundle JS** < 200 KB gzipped
- **API p95** < 500ms
- **CSS bundle** < 50 KB (D-003)
- **DB queries** < 100ms (D-002)

---

## 7. Monitoring (pendiente Fase 3)
- Vercel Analytics + Speed Insights (built-in al deploy)
- Sentry (errores en producción)
- PostHog (comportamiento de usuario, funnel del wizard)

---

**Última actualización:** 2026-05-19
**Próxima revisión:** cuando se actualice una major (Next, React, Tailwind, Drizzle), se instale Stripe SDK o se añada Auth0.
