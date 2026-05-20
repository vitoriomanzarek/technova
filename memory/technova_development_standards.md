---
name: technova-development-standards
description: Convenciones de código observadas en el repo TechNova (Next.js 16 + React 19 + Tailwind v4) — derivadas de code review real
metadata:
  type: project
---

# 📐 TechNova — Estándares de Desarrollo

> **Cómo se llenó este doc:** code review directo de `src/app/page.tsx`, `src/components/home/Hero.tsx`, `src/app/api/leads/route.ts`, `src/app/layout.tsx`, `src/app/pricing/page.tsx` (2026-05-19). Estas convenciones son **descriptivas** (lo que el repo hace hoy), no prescriptivas a futuro.

> ⚠️ **AGENTS.md:** Next.js 16 trae breaking changes — consultar `node_modules/next/dist/docs/` antes de inventar patrones nuevos.

---

## 1. Naming

| Elemento | Convención | Ejemplo real |
|----------|-----------|--------------|
| Componentes React | `PascalCase` | `Hero`, `Pricing`, `NovaAISection`, `RootLayout` |
| Archivos de componente | `PascalCase.tsx` | `Hero.tsx`, `ParticleBackground.tsx`, `LeadMagnetSection.tsx` |
| Rutas App Router (segmentos) | `kebab-case` | `start-project/`, `data-analysis/`, `landing-page/` |
| Archivos especiales Next | `lowercase` | `page.tsx`, `layout.tsx`, `route.ts`, `globals.css` |
| Variables / funciones | `camelCase` | `openFaq`, `toggleFaq`, `plans`, `faqs` |
| Constantes/data inline | `camelCase` array de objetos | `const plans = [{...}]` |
| Tipos / interfaces | `PascalCase` | `Metadata`, `HeroProps` |
| Variables de env | `SCREAMING_SNAKE_CASE` | `DATABASE_URL`, `RESEND_API_KEY` |
| Tablas DB (Drizzle) | plural minúsculas | `leads`, `services` |
| Columnas DB (observado en `leads` insert) | `snake_case` | `project_type` |
| React hooks custom | `use` prefix | `useFormData()` |

> **Nota:** versiones previas de este doc afirmaban "columnas en camelCase" — el código real usa `snake_case` (ver `src/app/api/leads/route.ts:14-17`). Mantener `snake_case` para nuevas columnas.

---

## 2. Estructura de Componente (patrón observado)

```tsx
"use client";                          // 1. Directiva (si interactivo)
import { useState } from 'react';       // 2. React/Next
import { motion } from 'framer-motion'; // 3. Third-party
import Link from 'next/link';
import { Check } from 'lucide-react';
import Hero from '@/components/home/Hero'; // 4. Alias internos
import ParticleBackground from './ParticleBackground'; // 5. Relativos

// 6. Data constants FUERA del componente (no recrear en cada render)
const plans = [ /* ... */ ];

// 7. Arrow function + default export al final
const Pricing = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    // ...
    return ( /* JSX */ );
};

export default Pricing;
```

### Reglas de oro
- **`"use client"`** solo cuando se usa `useState`, `useEffect`, handlers de eventos o librerías client-only (framer-motion, hooks de browser). Layouts y API routes son **Server / Server-only** por default.
- **Data estática** (`plans`, `faqs`) se declara **fuera** del componente.
- **Export default al final**, no inline.
- **Indent:** 4 espacios en componentes de página (`Hero.tsx`, `pricing/page.tsx`), 2 espacios en `layout.tsx` y API routes. ⚠️ Inconsistente — **al editar, respeta el indent del archivo**, no impongas uno nuevo.

---

## 3. Orden de Imports

1. Directiva (`"use client"` / `"use server"`).
2. React + Next core (`react`, `next/link`, `next/font`, `next/script`, `next/server`).
3. Third-party (`framer-motion`, `lucide-react`, `clsx`, `resend`).
4. Alias internos `@/components/...`, `@/db`, `@/data`, `@/hooks`.
5. Imports relativos `./Component`.
6. CSS al final: `import "./globals.css"`.

Separar grupos con línea en blanco es **opcional** (no es regla dura).

---

## 4. TypeScript

- **Strict mode** (`tsconfig.json`).
- **Type imports** separados cuando es solo tipo: `import type { Metadata } from "next";`
- **Inline types** para props: `Readonly<{ children: React.ReactNode }>`.
- **Generics en hooks:** `useState<number | null>(null)`.
- **Sin interfaces** para data shapes inline — los arrays como `plans` se infieren. Para schemas DB usar tipos generados por Drizzle (`InferInsertModel`, `InferSelectModel`).
- **Evitar `any`.**
- **Cuando se añada Zod:** usar `z.infer<typeof schema>` en vez de duplicar tipos.

---

## 5. Estilos (Tailwind v4)

### Patrones recurrentes
- **Mobile-first responsive:** `text-4xl md:text-6xl`, `flex-col sm:flex-row`.
- **Gradientes:** `bg-gradient-to-r from-cyan-400 to-purple-500` + `bg-clip-text text-transparent` para texto degradado.
- **Glassmorphism:** `bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl`.
- **Colores custom del theme:** `bg-dark`, `bg-darker`, `text-highlight`, `text-accent`, `text-primary` — definidos en `globals.css` (Tailwind v4 usa `@theme` inline).
- **Animaciones complejas:** `framer-motion` (`<motion.div initial={...} animate={...}>`) en vez de CSS puro.
- **Scroll-triggered:** `whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}`.
- **Container pattern:** `container mx-auto px-4 relative z-10` para secciones full-width.

### Orden de clases (cuando lo decidas explícitamente)
1. Layout (`flex`, `grid`, `w-`, `h-`, `min-h-`)
2. Spacing (`p-`, `m-`, `gap-`)
3. Background / borders (`bg-`, `border-`)
4. Color / typography (`text-`, `font-`, `leading-`)
5. Interacciones (`hover:`, `focus:`, `transition-`)

### Reglas
- **No mezclar `style={{}}` con Tailwind** salvo casos justificados (noscript `display:none`).
- **Usar `clsx` / `tailwind-merge`** cuando hay clases condicionales o sobrescritura — están instalados, aprovéchalos en lugar de string concatenation con backticks.

---

## 6. API Routes (App Router · `app/api/.../route.ts`)

Patrón real (`src/app/api/leads/route.ts`):

```ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(leads).values({ /* ... */ });
    return NextResponse.json({ success: true, message: '...' });
  } catch (error) {
    console.error("Error capturing lead:", error);
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}
```

### Convenciones
- **`NextResponse.json`** para respuestas (NO `Response.json` plano).
- **try/catch envolvente** con `console.error` + respuesta 500 genérica.
- **Shape de respuesta:** `{ success: boolean, message?: string, error?: string }`.
- **Status codes:** 200/201 OK · 400 client error · 401 unauth · 404 not found · 500 server.
- **No leakear stack traces** al cliente.
- **TODO / mejora futura:** validación con Zod (no implementada). Cuando se añada auth, validar con middleware.

---

## 7. Manejo de Errores

- **Servidor:** try/catch + `console.error` + status apropiado.
- **Cliente:** sin patrón estandarizado todavía. Cuando se necesite usar `error.tsx` por segmento de App Router.
- **Toast / feedback al usuario:** sin librería todavía (TODO: definir antes de añadir más formularios).

---

## 8. Comentarios

- **JSX:** comentarios numerados para marcar secciones largas (`{/* 1. Hero */}`, `{/* 4. Por qué elegirnos */}`).
- **No JSDoc** en componentes (los tipos cuentan la historia).
- **Comentarios solo cuando el "por qué" no es obvio** — ej. `// Se usa el dominio testing de resend` en `leads/route.ts:21`.

---

## 9. Git Workflow

### Branch naming
- `feature/<descripción-kebab>` — features
- `fix/<descripción>` — bugs
- `docs/<descripción>` — documentación
- `chore/<descripción>` — limpieza, mover archivos, deps
- `claude/<nombre-worktree>` — branches automáticas creadas por Claude Code

> Branch `develop` **no existe**. Workflow es: feature branch → PR → `main` → Vercel deploy.

### Commit style (observado en `git log`)
Conventional Commits **sin scope** en formato corto:
- `feat: next.js migration, neon db setup, and docs`
- `chore: move next.js project to root`
- `fix: build errors due to unused imports and DeviceMockup type`

Mensajes en inglés, descripción imperativa, < 70 chars en el título.

---

## 10. Testing

**Estado actual:** sin testing instalado en `package.json`.

**Plan (Fase 3 de `ARCHITECTURE.md`):**
- **Unit:** Vitest + React Testing Library
- **E2E:** Playwright (cubrir golden path del wizard y lead capture; checkout cuando Stripe esté activo)
- **Load:** k6 para endpoints API críticos
- **Coverage target:** 70 % en lógica de negocio, 0 % en componentes puramente visuales

Hasta que se instale, **toda PR nueva debe validar manualmente** con `npm run dev` el flujo afectado.

---

## 11. Deployment

- **Target:** Vercel (push-to-deploy desde `main`).
- **Build:** `npm run build` → `next build`.
- **Migrations DB:** `node migrate.mjs` (script standalone, no en CI todavía).
- **Lint:** `npm run lint` (ESLint flat config `eslint.config.mjs`).
- **Env vars:** dashboard de Vercel (no committed).
- **Pre-commit hooks:** sin Husky aún (TODO Fase 4: Husky + lint-staged).

---

## 12. Tracking en Producción

Implementado en `src/app/layout.tsx`:
- **GTM:** `GTM-55RLL2LW`
- **Meta Pixel:** `718504998021592`

Ambos cargan con `<Script strategy="afterInteractive">` + fallback `<noscript>`.

---

## 13. Code Review Checklist (antes de mergear)

- [ ] Types correctos (no `any`)
- [ ] Componentes con nombre PascalCase, archivos con extensión correcta
- [ ] Clases Tailwind en orden razonable (ver §5)
- [ ] `NextResponse.json` en API routes (no `Response.json`)
- [ ] `try/catch` en handlers async + `console.error` en catch
- [ ] No `console.log` huérfanos (solo errores)
- [ ] Commit en formato `tipo: descripción` (sin scope)
- [ ] `npm run build` pasa sin errores
- [ ] Flujo manualmente validado con `npm run dev`

---

**Última actualización:** 2026-05-19 (post code review página Home, Hero, Pricing, layout, leads API)
**Próxima revisión:** cuando se introduzca testing, validación Zod, o cambien las convenciones de carpetas.
