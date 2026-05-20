# 🏛️ Arquitectura Técnica — TechNova

> **Audiencia:** developers nuevos o agentes IA que tocan código de TechNova.
> **Objetivo:** entender en 10-12 min cómo está construida la app, qué patrones seguir, y dónde vive cada cosa.
> **Última verificación contra código:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Stack en una mirada](#stack-en-una-mirada)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Componentes React](#componentes-react)
4. [API Routes](#api-routes)
5. [Base de Datos & Drizzle](#base-de-datos--drizzle)
6. [Styling con Tailwind v4](#styling-con-tailwind-v4)
7. [TypeScript & Type Safety](#typescript--type-safety)
8. [Integraciones](#integraciones)
9. [Convenciones de código](#convenciones-de-código)
10. [Breaking changes a tener presente (Next.js 16)](#breaking-changes-next-16)

---

## Stack en una mirada

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | **Next.js** (App Router) | 16.2.4 |
| UI | **React** | 19.2.4 |
| Estilos | **Tailwind CSS** | v4 |
| Tipos | **TypeScript** | ^5 (strict) |
| ORM | **Drizzle ORM** | ^0.45.2 |
| Database | **Neon Postgres** (serverless) | driver `@neondatabase/serverless ^1.1.0` |
| Email | **Resend** | ^6.12.2 |
| Pagos | **Stripe** (TEST mode activo) | SDK ^22.1.1 |
| Validación | **Zod** | ^4.4.3 |
| Animaciones | **framer-motion** | ^12.38.0 |
| Iconos | **lucide-react** | ^1.8.0 |
| Hosting | **Vercel** | — |

Todas las versiones están pineadas en [`package.json`](../../package.json). Los racionales por cada elección viven en [`DECISION_LOG.md`](../../DECISION_LOG.md) (D-001 a D-013).

---

## Estructura de Carpetas

```
/technova
├── src/
│   ├── app/                  ← App Router (rutas, layouts, route handlers)
│   │   ├── api/              ← Endpoints HTTP
│   │   │   ├── leads/        ← POST /api/leads (lead magnet)
│   │   │   └── checkout/
│   │   │       ├── route.ts          ← POST /api/checkout (crea Stripe Session)
│   │   │       └── webhook/route.ts  ← POST /api/checkout/webhook (verifica firma)
│   │   ├── services/         ← Sub-rutas EN de servicios (8 verticals)
│   │   ├── servicios/        ← Versión ES (multi-idioma parcial)
│   │   ├── checkout/         ← /checkout/success y /checkout/cancel
│   │   ├── pricing/, nosotros/, contacto/, start-project/, privacidad/, terminos/
│   │   ├── layout.tsx        ← Root layout (Navbar, Footer, scripts GTM/Pixel)
│   │   ├── page.tsx          ← Home
│   │   └── globals.css       ← Variables CSS, theme custom (@theme inline)
│   ├── components/
│   │   ├── home/             ← Hero, Sections, NovaAISection, LeadMagnetSection…
│   │   ├── layout/           ← Navbar, Footer, ServiceLayout
│   │   ├── wizard/           ← Step* del cotizador IMR
│   │   ├── funnel/           ← Wizard.tsx para captura post-lead
│   │   ├── navigator/        ← NavigatorLayout (TechNova Navigator)
│   │   └── shared/           ← AccordionItem, DeviceMockup
│   ├── lib/
│   │   ├── stripe.ts         ← Singleton del cliente Stripe (apiVersion fija)
│   │   └── emails/           ← Templates de email (welcomeAuditEmail, etc.)
│   ├── db/
│   │   ├── index.ts          ← Cliente Neon + Drizzle inicializado
│   │   └── schema.ts         ← Definición de tablas (services, leads, orders)
│   ├── data/                 ← Datos estáticos (catálogos, copy)
│   ├── hooks/                ← React hooks custom
│   └── pages/                ← Páginas legacy del Vite/Pages Router (a borrar)
├── docs/                     ← Docs de negocio y operación
│   └── technical/            ← Docs técnicos vivos (este archivo, schema, API, onboarding)
├── memory/                   ← Memoria persistente para Claude entre sesiones
├── public/, img/             ← Assets estáticos
├── drizzle/                  ← Migrations generadas por drizzle-kit
└── *.md                      ← ARCHITECTURE, DECISION_LOG, MEMORY, AGENTS, README…
```

### Por qué feature-based y no layer-based

Decisión documentada en `DECISION_LOG.md` D-013. Resumen:
- Cuando trabajas en una feature (ej. Hero), abres una sola carpeta (`components/home/`) y tienes todo cerca.
- Layer-based (`components/`, `containers/`, `pages/`, `utils/`) obliga a saltar entre 4 carpetas para una sola feature.
- App Router favorece este patrón porque `app/` ya agrupa rutas por su propio path; duplicar esa estructura en `components/` sería redundante.

### Path alias

`@/*` → `./src/*` (definido en [`tsconfig.json`](../../tsconfig.json)). Úsalo siempre para imports cross-directory en vez de `../../../`.

```tsx
import { db } from '@/db';                              // ✅
import { db } from '../../../db';                        // ❌
import Hero from '@/components/home/Hero';              // ✅
import { stripe } from '@/lib/stripe';                  // ✅
```

---

## Componentes React

### Server Components por default

En Next.js 16 (App Router), **todo es Server Component salvo que pongas `'use client'` en la primera línea**. Server Components corren **solo en el servidor**, no envían JavaScript al browser, pueden hacer `await` directamente en el cuerpo y leer `process.env` sin filtrar secretos.

### Cuándo `'use client'`

Necesitas la directiva cuando el componente usa:
- `useState`, `useEffect`, `useRef`, otros hooks de React
- Event handlers (`onClick`, `onChange`, etc.)
- Librerías que tocan el DOM o browser APIs (`framer-motion`, `localStorage`, etc.)

Ejemplo real ([`src/app/pricing/page.tsx`](../../src/app/pricing/page.tsx)):

```tsx
"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Check, ChevronDown, Zap, Star, Shield } from 'lucide-react';

const plans = [ /* data estática fuera del componente */ ];
const faqs = [ /* ... */ ];

const Pricing = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    // ...
    return ( /* JSX */ );
};

export default Pricing;
```

### Patrón estándar

1. Directiva `"use client"` solo si hace falta.
2. Imports en orden: React/Next → third-party → alias internos (`@/...`) → relativos.
3. **Data estática se declara fuera del componente** (no en cada render).
4. Componente como `const Name = () => { ... }`.
5. `export default Name;` al final del archivo.

### Server Components con datos

Las páginas (`page.tsx`) pueden ser `async` y hacer queries directas. Ejemplo (`src/app/checkout/success/page.tsx`):

```tsx
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

// searchParams es Promise<{...}> en Next 16 (breaking change vs 15).
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return <SuccessContent searchParams={searchParams} />;
}

async function SuccessContent({ searchParams }: {...}) {
  const { session_id } = await searchParams;
  return ( /* JSX */ );
}
```

### Animaciones con framer-motion

Patrón consistente en el repo: `motion.div` con `initial`/`animate` para entrada, `whileInView` con `viewport={{ once: true }}` para scroll-triggered.

```tsx
<motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-4xl md:text-6xl font-bold mb-6"
>
    Multiplica tus Ventas sin <br />
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight to-accent">
        Contratar Más Personal
    </span>
</motion.h1>
```

Usar Tailwind para layout y framer-motion solo para animación.

---

## API Routes

### Estructura

Las API routes viven en `src/app/api/<recurso>/route.ts`. Cada archivo exporta funciones nombradas `GET`, `POST`, `PUT`, `DELETE`, etc.

Patrón canónico (ver [`src/app/api/leads/route.ts`](../../src/app/api/leads/route.ts)):

```ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/db';
import { leads } from '@/db/schema';

const leadSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1).max(255).optional(),
  // ...
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    // ... lógica ...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}
```

### Convenciones

- **`NextResponse.json`** para todas las respuestas (NO `Response.json` plano).
- **Validar con Zod antes de tocar DB o servicios externos.** Devolver 400 con `issues` en caso de fallo.
- **try/catch envolvente** con `console.error` + 500 genérico — no leakear stack traces.
- **Shape de respuesta consistente:** `{ success: boolean, message?: string, error?: string, issues?: ZodIssue[] }`.

### Webhooks (firma HMAC)

Para webhooks (ej. Stripe), **NO usar `request.json()`** porque altera el payload. Verificación de firma necesita el raw body:

```ts
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  // ...
  event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  // ...
}
```

Detalles en [`src/app/api/checkout/webhook/route.ts`](../../src/app/api/checkout/webhook/route.ts) y en [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

---

## Base de Datos & Drizzle

### Cliente

[`src/db/index.ts`](../../src/db/index.ts) inicializa Drizzle sobre el driver HTTP de Neon:

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

El driver HTTP de Neon es serverless-friendly: **no mantiene conexiones persistentes**, ideal para route handlers que se ejecutan en Edge/Node sin pool.

### Schema

[`src/db/schema.ts`](../../src/db/schema.ts) define 3 tablas:

```ts
export const services = pgTable('services', { /* catálogo de paquetes */ });
export const leads    = pgTable('leads',    { /* capturas del lead magnet */ });
export const orders   = pgTable('orders',   { /* órdenes de pago Stripe */ });
```

Detalle de columnas, tipos, índices y relaciones en [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md).

### Queries

Drizzle expone una API SQL-like type-safe:

```ts
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orders } from '@/db/schema';

// INSERT
await db.insert(orders).values({
  stripe_session_id: session.id,
  customer_email: email,
  amount_cents,
  currency: 'mxn',
  status: 'pending',
});

// UPDATE
await db.update(orders)
  .set({ status: 'paid', paid_at: new Date() })
  .where(eq(orders.stripe_session_id, session.id));

// SELECT (no usado todavía, ejemplo)
const order = await db.select().from(orders).where(eq(orders.id, 1));
```

### Migrations

- Editas [`src/db/schema.ts`](../../src/db/schema.ts).
- Corres `npx drizzle-kit push` (sync directo a Neon, recomendado para dev y MVP).
- O `npx drizzle-kit generate` + `npx drizzle-kit migrate` cuando quieras versionado formal en `drizzle/`.

Config en [`drizzle.config.ts`](../../drizzle.config.ts).

---

## Styling con Tailwind v4

### Setup

Tailwind v4 elimina `tailwind.config.js`. La configuración vive **dentro del CSS** ([`src/app/globals.css`](../../src/app/globals.css)) vía `@theme inline` y variables CSS HSL.

Theme actual: paleta espacial dark (azul profundo, morado nebulosa, cian brillante). Los colores se exponen como variables CSS y se consumen con clases como `bg-dark`, `text-highlight`, `text-accent`, `text-primary`.

### Utilities personalizadas

`globals.css` define utilities reutilizables:

```css
.glass-card     /* glassmorphism con backdrop-blur + borde sutil */
.glow-cyan      /* halo cian para CTAs y elementos destacados */
.glow-purple    /* halo morado, segunda jerarquía */
.text-gradient  /* gradiente cian→morado para títulos */
.border-gradient /* borde gradient con técnica mask */
.animate-float, .animate-pulse-glow, .animate-twinkle, .animate-drift, etc.
```

### Patrones recurrentes

- **Mobile-first:** `text-4xl md:text-6xl`, `flex-col sm:flex-row`.
- **Gradientes texto:** `bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent`.
- **Glassmorphism inline:** `bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl`.
- **Container:** `container mx-auto px-4 relative z-10` para secciones full-width.
- **Clases condicionales:** usa `clsx` + `tailwind-merge` (ya instalados) en vez de string concat con backticks.

### Orden de clases (no es regla dura, pero ayuda a la lectura)

`layout → spacing → background/border → color/typography → interactions`

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>
```

---

## TypeScript & Type Safety

[`tsconfig.json`](../../tsconfig.json) tiene **`strict: true`**. Reglas clave:

- **Sin `any`.** Si no sabes el tipo, usa `unknown` y haz type guards.
- **Type imports separados** cuando es solo tipo:
  ```ts
  import type { Metadata } from 'next';
  import type Stripe from 'stripe';
  ```
- **Inline para props simples:**
  ```ts
  export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>)
  ```
- **Generics en hooks:** `useState<number | null>(null)`.
- **Tipos de Drizzle:** `InferInsertModel<typeof leads>` / `InferSelectModel<typeof leads>` cuando necesites tipar payload o resultado.
- **Tipos de Zod:** `z.infer<typeof leadSchema>` antes de duplicar definiciones.

---

## Integraciones

### Resend (email transaccional)

- Cliente: `new Resend(process.env.RESEND_API_KEY)` en [`src/app/api/leads/route.ts`](../../src/app/api/leads/route.ts).
- `from:` configurable vía `RESEND_FROM_EMAIL` (con fallback a `onboarding@resend.dev` para dev sin dominio).
- Templates en [`src/lib/emails/`](../../src/lib/emails/) — un archivo por template, exporta función que retorna `{ subject, html }`.

Convención: **los templates HTML viven fuera del route handler**. El handler solo orquesta. Esto facilita iterar el copy sin tocar lógica.

### Stripe (pagos)

- SDK: `stripe ^22.1.1` con `apiVersion: '2026-04-22.dahlia'`.
- Cliente singleton: [`src/lib/stripe.ts`](../../src/lib/stripe.ts).
- Endpoint creación de sesión: [`src/app/api/checkout/route.ts`](../../src/app/api/checkout/route.ts).
- Webhook con firma: [`src/app/api/checkout/webhook/route.ts`](../../src/app/api/checkout/webhook/route.ts).
- Tabla local: `orders` (ver `DATABASE_SCHEMA.md`).

11 eventos suscritos en el dashboard de Stripe (checkout + payment_intent + charge + 5 subscription). Detalle en `API_DOCUMENTATION.md`.

### Neon (Postgres serverless)

- Driver HTTP: `@neondatabase/serverless`.
- Sin connection pooling persistente (no hace falta — cada request abre y cierra HTTP).
- Branching por PR disponible (preview DB automática) — pendiente de configurar.

### Google Tag Manager + Meta Pixel

Ambos cargan desde [`src/app/layout.tsx`](../../src/app/layout.tsx) vía `<Script strategy="afterInteractive">` y `<noscript>` fallback.

- GTM: `GTM-55RLL2LW`
- Meta Pixel: `718504998021592`

Si añades más scripts de tracking, sigue ese patrón (no `<script>` raw en `<head>`).

---

## Convenciones de código

### Naming

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes React | `PascalCase` | `Hero`, `Pricing`, `NovaAISection` |
| Archivos de componente | `PascalCase.tsx` | `Hero.tsx` |
| Rutas App Router | `kebab-case` | `start-project/`, `data-analysis/` |
| Archivos especiales Next | `lowercase` | `page.tsx`, `layout.tsx`, `route.ts` |
| Variables / funciones | `camelCase` | `openFaq`, `toggleFaq` |
| Tipos / interfaces | `PascalCase` | `Metadata`, `HeroProps` |
| Env vars | `SCREAMING_SNAKE_CASE` | `DATABASE_URL`, `RESEND_API_KEY` |
| Tablas DB | plural minúscula | `leads`, `services`, `orders` |
| Columnas DB | `snake_case` | `project_type`, `stripe_session_id` |

### Imports — orden

1. Directiva (`"use client"`)
2. React/Next core
3. Third-party (framer-motion, lucide-react, zod, drizzle-orm)
4. Alias internos `@/...`
5. Relativos `./Component`
6. CSS al final

### Comentarios

- Solo cuando el "por qué" no es obvio.
- Sin JSDoc en componentes (los tipos cuentan la historia).
- En JSX, marcar secciones largas con `{/* 1. Hero */}` numerado.

### Git

- Conventional Commits **sin scope**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Mensajes en inglés, imperativo, < 70 chars en el título.
- Branch naming: `feature/<desc>`, `fix/<desc>`, `docs/<desc>`, `chore/<desc>`.
- Las branches de Claude Code se llaman `claude/<worktree-name>`.

### Errores comunes a evitar

- ❌ `Response.json(...)` — usa `NextResponse.json(...)`.
- ❌ Insertar a DB sin validar con Zod.
- ❌ Importar relativo `../../../db` — usa `@/db`.
- ❌ `style={{}}` cuando Tailwind cubre el caso.
- ❌ Data estática dentro del componente (recrea en cada render).
- ❌ `console.log` huérfanos en producción (solo `console.error` con razón clara).

---

## Breaking changes Next 16

`AGENTS.md` advierte: "This is NOT the Next.js you know". Los breaking changes más relevantes que ya están en este código:

| Cambio | Antes (Next 13-15) | Ahora (Next 16) |
|--------|-------------------|-----------------|
| `params` en pages | objeto sincrónico | **`Promise<{...}>`** — hay que `await` |
| `searchParams` | objeto sincrónico | **`Promise<{...}>`** — hay que `await` |
| `cookies()`, `headers()` | sincrónicos | **async** — hay que `await` |
| Turbopack | flag | **default** en `next dev` y `next build` |
| App Router | opt-in | **único soportado** (Pages Router considerado legacy) |

Antes de usar APIs de Next.js que no estén en este código, **lee el doc correspondiente en `node_modules/next/dist/docs/01-app/`** (viene empacado con el SDK).

---

## Para seguir leyendo

- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — tablas, columnas, migrations.
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — todos los endpoints con request/response.
- [`ONBOARDING_DEVELOPER.md`](./ONBOARDING_DEVELOPER.md) — guía paso a paso para un dev nuevo.
- [`../../DECISION_LOG.md`](../../DECISION_LOG.md) — por qué elegimos cada herramienta.
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md) — visión de alto nivel del proyecto.
- [`../../memory/technova_development_standards.md`](../../memory/technova_development_standards.md) — versión corta de estas convenciones (para sesiones de Claude).

---

**Última actualización:** 2026-05-20
**Próxima revisión:** cuando se introduzca testing, validación adicional, o un cambio mayor de stack.
