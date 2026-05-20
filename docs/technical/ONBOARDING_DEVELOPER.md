# 🚀 Onboarding para Developers — TechNova

> **Audiencia:** developer nuevo (o tú mismo en 6 meses) que entra al repo por primera vez.
> **Objetivo:** estar productivo, con un PR aprobado, en menos de 30 minutos.
> **Última verificación:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Prerequisites](#prerequisites)
2. [Setup local en 5 minutos](#setup-local-en-5-minutos)
3. [Variables de entorno](#variables-de-entorno)
4. [Tour rápido del proyecto](#tour-rápido-del-proyecto)
5. [Tu primera tarea (10 min)](#tu-primera-tarea-10-min)
6. [Tareas comunes](#tareas-comunes)
7. [Cómo probar localmente](#cómo-probar-localmente)
8. [Deployment (referencia)](#deployment-referencia)
9. [Pedir ayuda](#pedir-ayuda)
10. [Checklist antes de un PR](#checklist-antes-de-un-pr)

---

## Prerequisites

Antes de clonar:

- **Node.js** 18+ (recomendado 20 LTS). `node --version`
- **npm** 10+ (viene con Node 20). `npm --version`
- **Git** 2.30+. `git --version`
- **IDE**: VS Code recomendado (con extensiones de TypeScript, ESLint, Tailwind CSS IntelliSense).
- **Cuenta GitHub** con acceso al repo `vitoriomanzarek/technova`.
- **Acceso a credenciales** (Vic te las comparte de forma segura, NUNCA por chat público).

Opcional pero útil:

- **Cliente Postgres** (DBeaver, TablePlus, o `psql`) para inspeccionar Neon directo si hace falta debug.
- **Stripe CLI** para probar webhooks localmente (`npm i -g stripe` y `stripe login`).

---

## Setup local en 5 minutos

```bash
# 1. Clonar el repo
git clone https://github.com/vitoriomanzarek/technova.git
cd technova

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales reales (pídeselas a Vic — ver §3)

# 4. (Opcional) Sincronizar el schema con tu Neon de dev
npx drizzle-kit push

# 5. Arrancar el dev server
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Si ves el home con "Multiplica tus Ventas sin Contratar Más Personal", está funcionando.

### Si algo falla

| Síntoma | Causa probable | Fix |
|---------|---------------|-----|
| `Module not found: stripe` | `node_modules` corrupto | `rm -rf node_modules package-lock.json && npm install` |
| `Error: DATABASE_URL is not defined` | falta `.env` | copia `.env.example` y completa |
| Build error CRLF | EOL | el `.gitattributes` ya lo maneja — `git rm --cached -r . && git add .` y rebuild |
| Port 3000 ocupado | dev server previo | `npm run dev -- -p 3001` |

---

## Variables de entorno

Pide a Vic las credenciales reales. Plantilla en [`.env.example`](../../.env.example).

| Variable | Para qué | Dónde obtenerla |
|----------|----------|-----------------|
| `DATABASE_URL` | Conexión pooled a Neon | https://console.neon.tech → proyecto TechNova → Connection Details → **Pooled connection** |
| `DATABASE_URL_UNPOOLED` | Conexión direct (para migrations) | Mismo lugar, "Direct connection" |
| `RESEND_API_KEY` | Envío de emails | https://resend.com/api-keys |
| `RESEND_FROM_EMAIL` | Dirección "From" en los emails | `"TechNova <noreply@tech-nova.mx>"` (requiere dominio verificado) |
| `STRIPE_SECRET_KEY` | Operaciones server-side de Stripe | https://dashboard.stripe.com/test/apikeys → secret key (modo TEST) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Cliente Stripe en frontend | Mismo dashboard → publishable key |
| `STRIPE_WEBHOOK_SECRET` | Verificar firmas de webhooks | https://dashboard.stripe.com/test/webhooks → tu endpoint → "Signing secret" |
| `NEXT_PUBLIC_BASE_URL` | URL absoluta para redirects de Stripe | `http://localhost:3000` en dev, `https://tech-nova.mx` en prod |

### Reglas de oro con secrets

- **NUNCA** comitees `.env` (está en `.gitignore`).
- **NUNCA** pongas un secret directamente en código — siempre `process.env.X`.
- **NUNCA** los pegues en chat público / Slack / commits / screenshots.
- Si filtras uno por accidente: rótalo **inmediatamente** en el dashboard del servicio.

---

## Tour rápido del proyecto

Estos son los archivos que vas a tocar más seguido. Lo demás vive en [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md).

### Páginas (App Router)

```
src/app/
├── layout.tsx              ← Root layout (Navbar, Footer, GTM, Meta Pixel)
├── page.tsx                ← Home (Hero + secciones)
├── pricing/page.tsx        ← Planes START/GROWTH/SCALE
├── nosotros/page.tsx       ← Misión, visión, equipo
├── contacto/page.tsx       ← Formulario de contacto
├── start-project/page.tsx  ← Wizard cotizador
├── services/<slug>/        ← 8 páginas de servicios verticales
├── checkout/success/       ← Redirect post-pago
└── checkout/cancel/        ← Redirect cancelación
```

### Componentes

```
src/components/
├── home/Hero.tsx              ← El gigante con CTA principal
├── home/LeadMagnetSection.tsx ← Formulario "Auditoría Web Express"
├── home/Sections.tsx          ← Bloques de la home (testimonios, equipo, etc.)
├── layout/Navbar.tsx          ← Navegación top
├── layout/Footer.tsx          ← Footer
├── wizard/Step*.tsx           ← Cada paso del cotizador
└── shared/*.tsx               ← Reutilizables (AccordionItem, DeviceMockup)
```

### Backend / lógica

```
src/app/api/
├── leads/route.ts             ← POST /api/leads (captura + email)
└── checkout/
    ├── route.ts               ← POST /api/checkout (crea Stripe Session)
    └── webhook/route.ts       ← POST /api/checkout/webhook (eventos firmados)

src/db/
├── schema.ts                  ← Tablas: services, leads, orders
└── index.ts                   ← Cliente Drizzle inicializado sobre Neon

src/lib/
├── stripe.ts                  ← Cliente Stripe (singleton)
└── emails/leadAuditWelcome.ts ← Template HTML del primer email
```

### Configuración

```
package.json           ← Dependencies y scripts
tsconfig.json          ← TS strict, path alias @/*
drizzle.config.ts      ← Apunta a schema y DB
next.config.ts         ← Config Next (hoy vacío)
.env.example           ← Plantilla de variables
.gitattributes         ← EOL normalization (LF en repo)
```

---

## Tu primera tarea (10 min)

**Objetivo:** cambiar el copy del Hero, ver el cambio en local, commit, push, abrir PR.

### Paso 1 — Crear branch

```bash
git checkout main
git pull origin main
git checkout -b docs/onboarding-test-<tu-nombre>
```

### Paso 2 — Editar [`src/components/home/Hero.tsx`](../../src/components/home/Hero.tsx)

Encuentra la línea ~17:
```tsx
Multiplica tus Ventas sin <br />
```
Cámbiala por:
```tsx
Bienvenido al onboarding · prueba <br />
```

(No te preocupes — vamos a revertirlo antes del PR final, solo es para validar tu setup.)

### Paso 3 — Verificar en el navegador

Si `npm run dev` ya corre, el cambio debe verse en hot-reload. Si no:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Confirma que el Hero dice tu texto nuevo.

### Paso 4 — Revertir el cambio (es solo de prueba)

```bash
git checkout src/components/home/Hero.tsx
```

### Paso 5 — Commit limpio (con un cambio real menor)

Como práctica real, mejor haz un cambio que sí valga: por ejemplo, corrige un typo que encuentres en algún doc o añade tu nombre a `docs/BITACORA.md` con la fecha de tu onboarding.

```bash
git add docs/BITACORA.md
git commit -m "$(cat <<'EOF'
docs(bitacora): log <tu-nombre> onboarding completion

Validated local setup, hot-reload, and the commit workflow end-to-end.

Co-Authored-By: <tu-nombre> <tu-email>
EOF
)"
```

### Paso 6 — Push + PR

```bash
git push origin docs/onboarding-test-<tu-nombre>
```

GitHub te dará un link para abrir el PR. Ábrelo con título descriptivo y descripción breve. Vic revisa y mergea.

🎉 **Listo.** Si llegaste aquí en menos de 30 min total, vas perfecto. Si no, pide ayuda (§9).

---

## Tareas comunes

### Añadir una nueva página

1. Crea `src/app/<ruta>/page.tsx` (la carpeta define la URL — `src/app/blog/page.tsx` → `/blog`).
2. Para sub-rutas: `src/app/blog/[slug]/page.tsx` → `/blog/<slug>`.
3. Si necesita interactividad: añade `"use client"` en la primera línea.
4. Si necesita datos del servidor: déjala async, llama a `db.query.X` o `fetch()` directamente.

Ejemplo mínimo:
```tsx
export default function BlogPage() {
  return (
    <section className="container mx-auto px-4 py-32">
      <h1 className="text-4xl font-bold text-gradient">Blog</h1>
    </section>
  );
}
```

### Modificar un componente

1. Ubica el componente en `src/components/<feature>/<Name>.tsx`.
2. Edita.
3. **Respeta el indent existente del archivo** (algunos usan 4 espacios, otros 2 — no mezcles).
4. Si añades props, tipa con interface o inline:
   ```tsx
   const MyComponent = ({ title, isActive }: { title: string; isActive?: boolean }) => { ... };
   ```

### Crear un nuevo endpoint API

1. Crea `src/app/api/<recurso>/route.ts`.
2. Exporta una función nombrada por método HTTP (`POST`, `GET`, etc.).
3. Sigue el patrón de [`/api/leads`](../../src/app/api/leads/route.ts):
   - Define un schema Zod.
   - `safeParse` el body.
   - 400 con `issues` si falla.
   - try/catch envolvente, 500 con error genérico.
4. Documenta el endpoint en [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).

### Cambiar colores del theme

1. Edita [`src/app/globals.css`](../../src/app/globals.css), sección `@layer base` → `:root`.
2. Los colores usan HSL en triplets sin `hsl()`: `--primary: 189 100% 50%;`.
3. Cambia el valor → todos los componentes que usan `bg-primary`, `text-primary`, etc. se actualizan.

### Hacer una query a la base de datos

```ts
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { leads } from '@/db/schema';

// SELECT
const allLeads = await db.select().from(leads).limit(10);

// SELECT con WHERE
const lead = await db.select().from(leads).where(eq(leads.email, 'foo@bar.com'));

// INSERT
await db.insert(leads).values({ email: 'foo@bar.com', name: 'Foo' });

// UPDATE
await db.update(leads).set({ name: 'Bar' }).where(eq(leads.id, 1));

// DELETE
await db.delete(leads).where(eq(leads.id, 1));
```

### Añadir una columna a una tabla

1. Edita [`src/db/schema.ts`](../../src/db/schema.ts).
2. `npx drizzle-kit push` (sync con tu Neon de dev).
3. Actualiza [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) con la nueva columna.
4. En producción, Vic corre `npx drizzle-kit push` tras mergear.

---

## Cómo probar localmente

### Arrancar el dev server

```bash
npm run dev
```

Modo `--turbo` por default en Next 16. Cambios en `.tsx`/`.ts`/`.css` se aplican con hot-reload.

### Ver logs

- **Frontend:** consola del navegador (F12).
- **Backend (API routes):** la terminal donde corre `npm run dev`.
- **Errores TypeScript:** `npx tsc --noEmit`.
- **Lint:** `npm run lint`.

### Probar un endpoint con curl

```bash
# Lead capture
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Checkout (crea una sesión de Stripe en MXN)
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","amount_mxn":100,"description":"Test"}'
# → devuelve { url, sessionId }, abre la url en browser y paga con 4242 4242 4242 4242
```

### Probar webhooks de Stripe localmente

```bash
# Terminal 1: arranca el túnel
stripe listen --forward-to localhost:3000/api/checkout/webhook
# Esto imprime un whsec_... — úsalo en tu .env local (sobreescribe el de prod).

# Terminal 2: dispara un evento de prueba
stripe trigger checkout.session.completed
```

### Limpiar caché si algo se atora

```bash
rm -rf .next node_modules/.cache
npm run dev
```

---

## Deployment (referencia)

**No necesitas hacer nada manual para deployar.** El flujo es:

1. PR mergeado a `main` →
2. Vercel detecta el push →
3. Build automático (`next build` con Turbopack) →
4. Deploy a `tech-nova.mx`.

### Si quieres verificar el deploy

- Dashboard Vercel: https://vercel.com/vitoriomanzareks-projects/technova-next
- Logs en vivo: dashboard → tu deployment → "Build Logs" / "Function Logs".

### Variables de entorno en producción

Se configuran en Vercel UI (Settings → Environment Variables), **NO** en el repo. Si añades una nueva env var:
1. Súbela a Vercel manualmente.
2. Súbela también a `.env.example` (sin el valor real).
3. Si afecta build, redeploy manual desde el dashboard.

### Rollback rápido

Si un deploy rompe producción:
- Dashboard Vercel → Deployments → encuentra el último que funcionaba → "Promote to Production".

---

## Pedir ayuda

Orden de búsqueda recomendado:

1. **[`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md)** — patrones generales del proyecto.
2. **[`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md)** — tablas y queries.
3. **[`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)** — endpoints.
4. **[`../../DECISION_LOG.md`](../../DECISION_LOG.md)** — por qué elegimos cada herramienta. Te ahorra discusiones tipo "¿por qué no usamos Prisma?".
5. **[`../../docs/BITACORA.md`](../../docs/BITACORA.md)** — historial de cambios recientes.
6. **[`../../memory/`](../../memory/)** — contexto que usan los agentes IA.
7. **[`../../AGENTS.md`](../../AGENTS.md)** — recordatorio crítico de breaking changes de Next 16.
8. **`node_modules/next/dist/docs/01-app/`** — docs oficiales de Next.js, viene con el SDK.
9. **Vic** — chat o BITACORA si todo lo anterior no resuelve.

Si encuentras algo confuso o mal documentado: **edítalo en el mismo PR**. La doc es código.

---

## Checklist antes de un PR

Antes de pedir review, verifica:

- [ ] `npm run lint` pasa sin errores.
- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run build` corre limpio localmente.
- [ ] Probaste el flujo afectado con `npm run dev`.
- [ ] No hay `console.log` huérfanos (solo `console.error` con razón).
- [ ] No hay `any` en TypeScript (excepto si está justificado en comentario).
- [ ] Si añadiste/cambiaste una API: actualizaste [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md).
- [ ] Si añadiste/cambiaste el schema: actualizaste [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) y corriste `drizzle-kit push`.
- [ ] Si tomaste una decisión técnica no trivial: añadiste un registro en [`DECISION_LOG.md`](../../DECISION_LOG.md).
- [ ] Commit messages en formato `tipo: descripción` (sin scope), imperativo, < 70 chars.
- [ ] No subiste `.env` ni ningún secret.
- [ ] PR description explica **qué cambia y por qué** (no solo "qué").

---

## Bienvenido al equipo

TechNova es un equipo pequeño moviéndose rápido. La documentación que estás leyendo es nuestra forma de mantener velocidad sin perder calidad. Si ves algo que pueda ser más claro, edítalo y sube el PR. Si ves algo que está roto y no está documentado, créa un issue o avísale a Vic.

🚀 *"Conecta con el futuro del espacio digital."*

---

**Última actualización:** 2026-05-20
**Próxima revisión:** cuando entre un dev nuevo y descubra qué falta en esta guía.
