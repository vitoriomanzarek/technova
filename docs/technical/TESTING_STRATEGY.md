# 🧪 Testing Strategy — TechNova

> **Audiencia:** quien añada tests o decida qué/cómo testear.
> **Estado actual:** **sin testing instalado todavía**. Este doc define el plan y los primeros pasos cuando arranque Fase 4.
> **Última verificación:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Stack de testing (decisión)](#1-stack-de-testing-decisión)
2. [Unit tests con Vitest](#2-unit-tests-con-vitest)
3. [E2E tests con Playwright](#3-e2e-tests-con-playwright)
4. [Smoke tests manuales](#4-smoke-tests-manuales)
5. [CI/CD testing](#5-cicd-testing)
6. [Test coverage goals](#6-test-coverage-goals)
7. [Testing queries a la DB](#7-testing-queries-a-la-db)
8. [Testing Stripe localmente](#8-testing-stripe-localmente)
9. [Checklist pre-deploy](#9-checklist-pre-deploy)
10. [Organización de archivos de test](#10-organización-de-archivos-de-test)

---

## 1. Stack de testing (decisión)

| Tipo | Herramienta | Razón |
|------|-------------|-------|
| **Unit / Integration** | **Vitest** | API casi idéntica a Jest pero ~10x más rápido (usa Vite/esbuild). Soporte nativo TypeScript sin Babel. |
| **E2E (end-to-end)** | **Playwright** | Browser real (Chromium/Firefox/WebKit), recording, screenshots de fallos, debug interactivo. Estándar de facto al 2026. |
| **Smoke en producción** | **curl + scripts bash** | Validación rápida post-deploy. No requiere setup adicional. |
| **Webhook Stripe** | **Stripe CLI** | Para disparar eventos firmados sin abrir el dashboard. |

### Alternativas descartadas y por qué

- **Jest**: lento en projects con TypeScript (Babel), config compleja en Next.js 16. Vitest es drop-in mejor.
- **Cypress**: histórico de E2E, pero Playwright ya lo superó en velocidad, soporte multi-browser y debugging.
- **Vitest browser mode** (vs Playwright): aún experimental, mejor mantener separación clara unit vs E2E.
- **React Testing Library para componentes**: posible pero **no incluido en el plan MVP** — los componentes son mayormente presentacionales y volátiles. Testear estilos/JSX da poco ROI vs. testear lógica de negocio.

---

## 2. Unit tests con Vitest

### Setup (cuando arranque Fase 4)

```bash
npm install -D vitest @vitest/ui
```

Crea `vitest.config.ts` en la raíz:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    include: ['src/__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Añade scripts a `package.json`:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui"
}
```

### Qué testear

| Categoría | Ejemplos | Prioridad |
|-----------|----------|-----------|
| **Schemas Zod** | `leadSchema`, `checkoutSchema` aceptan/rechazan los casos esperados | 🔴 alta |
| **Funciones puras** | helpers de pricing, conversión MXN→cents, formatters | 🔴 alta |
| **Email templates** | `welcomeAuditEmail()` retorna `{subject, html}` con strings esperados | 🟡 media |
| **Drizzle queries** custom (no las trivializadas por el ORM) | filtros complejos, agregaciones | 🟡 media |
| **API route handlers** (con mocks de Stripe/Resend/DB) | flujo de validación → DB → email | 🟡 media |

### Qué NO testear (al menos no en MVP)

- **Componentes React presentacionales** — caro de mantener, fragil ante refactor de styling.
- **El SDK Stripe** o **Resend** — ya tienen sus propias suites.
- **Configuración de Next.js / Tailwind** — más fácil verificar con build.

### Ejemplo: testear `leadSchema`

```ts
// src/__tests__/api/leads-schema.test.ts
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Re-exportamos el schema desde route.ts para que sea testeable
// (o lo extraemos a un módulo aparte si crece — recomendado).
const leadSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1).max(255).optional(),
  phone: z.string().min(1).max(20).optional(),
  project_type: z.string().min(1).max(255).optional(),
});

describe('leadSchema', () => {
  it('acepta input mínimo válido (solo email)', () => {
    const result = leadSchema.safeParse({ email: 'vic@example.com' });
    expect(result.success).toBe(true);
  });

  it('acepta input completo', () => {
    const result = leadSchema.safeParse({
      email: 'vic@example.com',
      name: 'Vic',
      phone: '+52 55 1234 5678',
      project_type: 'Landing Page',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza email malformado', () => {
    const result = leadSchema.safeParse({ email: 'no-arroba' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email']);
    }
  });

  it('rechaza name vacío', () => {
    const result = leadSchema.safeParse({ email: 'vic@example.com', name: '' });
    expect(result.success).toBe(false);
  });

  it('rechaza phone > 20 chars', () => {
    const result = leadSchema.safeParse({
      email: 'vic@example.com',
      phone: '+52 55 1234 5678 9012',
    });
    expect(result.success).toBe(false);
  });
});
```

### Ejemplo: testear handler completo con mocks

```ts
// src/__tests__/api/leads-handler.test.ts
import { describe, it, expect, vi } from 'vitest';

// Mocks ANTES del import del handler
vi.mock('@/db', () => ({
  db: { insert: () => ({ values: vi.fn().mockResolvedValue(undefined) }) },
}));
vi.mock('resend', () => ({
  Resend: class { emails = { send: vi.fn().mockResolvedValue({ id: 'mock' }) }; },
}));

import { POST } from '@/app/api/leads/route';

describe('POST /api/leads', () => {
  it('devuelve 400 con body vacío', async () => {
    const req = new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.issues).toBeTruthy();
  });

  it('devuelve 200 con email válido', async () => {
    const req = new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vic@example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
```

---

## 3. E2E tests con Playwright

### Setup (cuando arranque Fase 4)

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

Crea `playwright.config.ts` en la raíz:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
  },
});
```

Scripts:

```json
"scripts": {
  "e2e": "playwright test",
  "e2e:ui": "playwright test --ui",
  "e2e:debug": "playwright test --debug"
}
```

### Qué testear (flujos críticos primero)

| Flujo | Por qué crítico |
|-------|-----------------|
| **Home carga** y muestra Hero con CTA principal | Si esto rompe, todo está roto |
| **Lead Magnet capture**: completar form → submit → mensaje de éxito | Es el funnel principal de adquisición |
| **Pricing page** renderiza 3 planes con CTAs | Es donde converte |
| **Wizard cotizador**: navegar StepWelcome → StepSuccess | Funnel secundario clave |
| **`/checkout/success` y `/checkout/cancel`** cargan sin error | Páginas de destino post-Stripe |
| **404 page** funciona | UX básico |

### Ejemplo: lead capture E2E

```ts
// e2e/lead-capture.spec.ts
import { test, expect } from '@playwright/test';

test('captura lead desde el home', async ({ page }) => {
  await page.goto('/');

  // Scroll a la sección de lead magnet
  const leadSection = page.getByRole('region', { name: /auditoría/i });
  await leadSection.scrollIntoViewIfNeeded();

  // Llenar form
  await page.getByLabel(/email/i).fill('e2e-test@example.com');
  await page.getByRole('button', { name: /enviar|solicitar/i }).click();

  // Verificar feedback de éxito (ajustar al copy real)
  await expect(page.getByText(/recibimos|gracias/i)).toBeVisible({ timeout: 5000 });
});

test('lead capture rechaza email inválido', async ({ page }) => {
  await page.goto('/');
  const leadSection = page.getByRole('region', { name: /auditoría/i });
  await leadSection.scrollIntoViewIfNeeded();

  await page.getByLabel(/email/i).fill('no-arroba');
  await page.getByRole('button', { name: /enviar|solicitar/i }).click();

  await expect(page.getByText(/email|inválido/i)).toBeVisible();
});
```

### Stripe en E2E

Para probar el flujo completo de checkout sin pagar de verdad:

```ts
test('redirige a Stripe Checkout con monto correcto', async ({ page }) => {
  await page.goto('/start-project');
  // ... pasos del wizard ...
  await page.getByRole('button', { name: /pagar/i }).click();

  // Stripe Checkout es un dominio externo — verificamos el redirect:
  await page.waitForURL(/checkout\.stripe\.com/);
  await expect(page).toHaveURL(/checkout\.stripe\.com/);
  // No completamos el pago en E2E — eso requiere tarjeta de test
  // y deja fixtures en Stripe. Usamos el smoke test del §4 para eso.
});
```

---

## 4. Smoke tests manuales

Hoy son nuestra única forma de verificación post-deploy. Los seguiremos usando incluso con Vitest+Playwright (cubren cosas que tests automáticos no — DNS, certificados, env vars de Vercel).

### Antes de mergear (local)

```bash
npm run build      # ¿compila sin errores TypeScript?
npx tsc --noEmit   # check tipos explícito
npm run lint       # ESLint

# Smoke contra el dev server
npm run dev &
sleep 5

curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
# Esperado: 200

curl -s -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" -d '{}' | head -c 100
# Esperado: {"success":false,"error":"Invalid input",...
```

### Después de deploy a prod

Ver el checklist completo en [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) §5. Resumen:

```bash
curl -I https://tech-nova.mx/                                                      # 200
curl -s -X POST https://tech-nova.mx/api/leads -H "Content-Type: application/json" -d '{}'    # 400 + issues
curl -s -X POST https://tech-nova.mx/api/checkout -H "Content-Type: application/json" -d '{}' # 400 + issues
curl -s -o /dev/null -w "%{http_code}\n" https://tech-nova.mx/api/checkout/webhook            # 405
curl -s -o /dev/null -w "%{http_code}\n" https://tech-nova.mx/checkout/success                # 200
curl -s -o /dev/null -w "%{http_code}\n" https://tech-nova.mx/checkout/cancel                 # 200
```

### Pago real test (tarjeta de prueba Stripe)

```bash
# Crea sesión
curl -s -X POST https://tech-nova.mx/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"victorsm2893@gmail.com","amount_mxn":18000,"description":"Plan GROWTH - smoke test","plan":"GROWTH"}'
# Devuelve { url, sessionId }

# Abre el `url` en navegador. Paga con:
#   Card:   4242 4242 4242 4242
#   Exp:    cualquier fecha futura (ej. 12/30)
#   CVC:    cualquiera de 3 dígitos (ej. 123)
#   ZIP:    cualquiera (ej. 12345)

# Validar:
# 1. Redirige a /checkout/success?session_id=...
# 2. Stripe dashboard → última sesión: Status "Complete"
# 3. Stripe dashboard → Webhooks → última entrega: 200
# 4. Neon: SELECT * FROM orders ORDER BY id DESC LIMIT 1;
#    → debe mostrar status='paid', paid_at lleno, payment_intent_id lleno
```

---

## 5. CI/CD testing

### Estado

Hoy: **sin CI configurado**. Cada dev/agente corre tests localmente antes de mergear. Vercel solo corre `npm run build` (que falla si hay type errors, pero no corre Vitest ni Playwright).

### Plan (Fase 4): GitHub Actions

Crea `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Unit tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          # Vars dummy para que el build pase (no se ejecuta runtime)
          DATABASE_URL: postgres://dummy
          RESEND_API_KEY: dummy
          STRIPE_SECRET_KEY: sk_test_dummy
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_dummy
          STRIPE_WEBHOOK_SECRET: whsec_dummy
          NEXT_PUBLIC_BASE_URL: http://localhost:3000

  e2e:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: E2E tests
        run: npm run e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.PREVIEW_URL }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Branch protection (GitHub Settings → Branches → main)

Cuando CI esté en pie, activar:
- ✅ Require pull request reviews before merging.
- ✅ Require status checks: `test`, `e2e`.
- ✅ Require branches to be up to date.
- ✅ Do not allow bypassing.

---

## 6. Test coverage goals

| Categoría | Target | Cómo medirlo |
|-----------|--------|--------------|
| **Schemas Zod** | 100% | Cada `safeParse(...)` con cada `success: false` debe tener test que lo provoque. |
| **API route handlers** | 80% lines | `vitest --coverage` → revisar `src/app/api/**`. |
| **Funciones puras** (`src/lib/*`) | 90% | idem |
| **Componentes React** | 0% obligatorio | Solo si tienen lógica no trivial (state machines, hooks complejos). |
| **E2E** | flujos críticos | Lead capture, wizard, pricing, success/cancel. No es "% coverage", es "qué flujos están cubiertos". |

Coverage no es métrica de calidad por sí sola — 100% con tests triviales no vale más que 60% con tests bien pensados. Apuntamos a **cobertura de los caminos críticos**.

### Activar coverage en Vitest

```bash
npm install -D @vitest/coverage-v8
```

```json
// vitest.config.ts → test
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    include: ['src/app/api/**', 'src/lib/**'],
    exclude: ['src/**/*.test.ts'],
    thresholds: {
      lines: 70,
      statements: 70,
      functions: 70,
      branches: 60,
    },
  },
}
```

```bash
npm test -- --coverage
```

CI falla si los thresholds bajan.

---

## 7. Testing queries a la DB

### Problema

Drizzle es type-safe pero **no** valida que las queries hagan lo esperado en runtime. Testear queries reales requiere una DB.

### Estrategia recomendada

1. **DB branch en Neon** para tests. Neon permite crear branches efímeros desde la prod (mismo schema, sin datos sensibles). Ideal para CI.
2. **Fixtures via seed** antes de cada suite de test.
3. **Cleanup** después (`DELETE FROM orders WHERE ...`).

### Ejemplo

```ts
// src/__tests__/db/orders.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { orders } from '@/db/schema';

describe('orders queries', () => {
  beforeEach(async () => {
    // Limpia state previo
    await db.delete(orders).where(eq(orders.customer_email, 'test@example.com'));
  });

  afterEach(async () => {
    await db.delete(orders).where(eq(orders.customer_email, 'test@example.com'));
  });

  it('inserta orden y la encuentra por session_id', async () => {
    await db.insert(orders).values({
      stripe_session_id: 'cs_test_unit_123',
      customer_email: 'test@example.com',
      amount_cents: 1800000,
      currency: 'mxn',
      status: 'pending',
    });

    const [found] = await db.select().from(orders)
      .where(eq(orders.stripe_session_id, 'cs_test_unit_123'));

    expect(found).toBeTruthy();
    expect(found.status).toBe('pending');
    expect(found.amount_cents).toBe(1800000);
  });
});
```

> ⚠️ **NO** correr estos tests contra production DB. El `DATABASE_URL` debe apuntar a una branch de test. En CI, configurar `secrets.DATABASE_URL_TEST` y mapearlo en el workflow.

---

## 8. Testing Stripe localmente

Documentado en [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) y [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) §8, resumen aquí:

### Stripe CLI

```bash
# Una vez
npm install -g stripe
stripe login   # abre browser para autorizar

# En cada sesión de testing:
stripe listen --forward-to localhost:3000/api/checkout/webhook
# → te da un whsec_... — úsalo en .env local
```

### Triggers útiles

```bash
stripe trigger checkout.session.completed         # → marca orden como paid
stripe trigger checkout.session.expired           # → expired
stripe trigger payment_intent.payment_failed      # → log warning
stripe trigger charge.refunded                    # → marca refunded
stripe trigger charge.dispute.created             # → marca disputed
```

Cada trigger crea fixtures realistas que Stripe firma con tu webhook secret. Tu handler responde 200 si todo OK.

### Tarjetas de prueba (en Checkout hosted)

| Tarjeta | Resultado |
|---------|-----------|
| `4242 4242 4242 4242` | Aprobada |
| `4000 0025 0000 3155` | Requiere 3D Secure |
| `4000 0000 0000 9995` | Rechazada por fondos insuficientes |
| `4000 0000 0000 0002` | Rechazada genérico |
| `4000 0084 0000 1629` | Disputed (chargeback inmediato) |

Lista completa: https://stripe.com/docs/testing#cards

---

## 9. Checklist pre-deploy

Antes de pedir un merge a `main`, todo esto debe pasar:

```
- [ ] npm run build                                                 → 0 errores
- [ ] npx tsc --noEmit                                              → 0 errores
- [ ] npm run lint                                                  → 0 errores
- [ ] npm test (cuando Vitest esté instalado)                       → todos pasan
- [ ] npm run e2e (cuando Playwright esté instalado)                → flujos críticos pasan
- [ ] curl smoke tests en localhost (al menos /, /api/leads, /api/checkout)
- [ ] Manual: cambio probado en el flujo afectado (open browser, click around)
- [ ] BITACORA actualizado con qué cambia y por qué
- [ ] Si hay deuda nueva: registrada como TODO en doc apropiado
```

Cuando esto sea CI/CD automático, el checklist deja de ser manual — los status checks de GitHub bloquean el merge si algo falla.

---

## 10. Organización de archivos de test

```
src/
├── __tests__/                       ← Vitest los descubre con vitest.config.ts
│   ├── api/
│   │   ├── leads-schema.test.ts
│   │   ├── leads-handler.test.ts
│   │   ├── checkout-schema.test.ts
│   │   └── webhook-handler.test.ts
│   ├── lib/
│   │   ├── stripe-client.test.ts
│   │   └── emails/welcomeAudit.test.ts
│   └── db/
│       └── orders.test.ts
├── app/
└── ...

e2e/                                  ← Playwright los descubre con playwright.config.ts
├── lead-capture.spec.ts
├── pricing.spec.ts
├── wizard.spec.ts
└── checkout.spec.ts
```

### Convenciones de naming

- Unit: `<lo-que-prueba>.test.ts` en `src/__tests__/<categoría>/`.
- E2E: `<flujo>.spec.ts` en `e2e/`.
- Mocks compartidos: `src/__tests__/__mocks__/<servicio>.ts`.

### Convenciones de estilo

```ts
describe('módulo / función', () => {
  describe('cuándo / con qué', () => {
    it('hace X', () => {
      // arrange
      // act
      // assert
    });
  });
});
```

Mantén tests **autocontenidos**: cada `it` debe poder correr aislado, sin depender de otros.

---

## TODOs para Fase 4 (orden sugerido)

1. **Instalar Vitest** (`npm install -D vitest @vitest/ui`) + `vitest.config.ts` + scripts.
2. **Tests de Zod schemas** (1-2 horas — alto ROI).
3. **Instalar Playwright** + config.
4. **E2E del flujo lead capture** (1 hora — más visible/útil).
5. **GitHub Actions** con lint+typecheck+unit+build (sin E2E todavía).
6. **Branch protection** en main que requiera los checks anteriores.
7. **E2E en CI** contra Vercel preview URL.
8. **Coverage thresholds** que CI valide.
9. **DB test branch** en Neon para tests de queries.
10. **Tests de webhook handler** con eventos mockeados de Stripe.

---

## Para seguir leyendo

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) §5 — smoke checklist post-deploy.
- [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) §8 — testing error paths localmente.
- [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §1 — qué validan los Zod schemas (test reference).
- Vitest docs: https://vitest.dev
- Playwright docs: https://playwright.dev
- Stripe testing: https://stripe.com/docs/testing

---

**Última actualización:** 2026-05-20
**Próxima revisión:** al instalar Vitest+Playwright en Fase 4, o si cambia el stack de testing.
