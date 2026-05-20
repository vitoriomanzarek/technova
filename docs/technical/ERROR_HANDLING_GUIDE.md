# 🧯 Error Handling Guide — TechNova

> **Audiencia:** quien necesite diagnosticar un error en runtime, decidir cómo manejar uno nuevo, o establecer reglas de logging.
> **Última verificación:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Error Boundaries (React)](#1-error-boundaries-react)
2. [API Error Responses](#2-api-error-responses)
3. [Database Errors (Neon + Drizzle)](#3-database-errors-neon--drizzle)
4. [Stripe Errors](#4-stripe-errors)
5. [Resend Errors (email)](#5-resend-errors-email)
6. [Logging Best Practices](#6-logging-best-practices)
7. [Sentry Integration (Fase 4)](#7-sentry-integration-fase-4)
8. [Testing Errors Localmente](#8-testing-errors-localmente)
9. [Debugging en Producción](#9-debugging-en-producción)
10. [Recovery Checklist](#10-recovery-checklist)

---

## 1. Error Boundaries (React)

### Estado actual

- ❌ **No hay error boundaries** definidas. Si un Client Component lanza durante render, Next.js muestra la página de error default de React (pantalla blanca o stack trace en dev).

### Patrón recomendado (TODO Fase 4)

App Router soporta archivos especiales `error.tsx` por segmento. Plan:

```tsx
// src/app/error.tsx — error boundary global
'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[client error]', error);
    // TODO Fase 4: Sentry.captureException(error);
  }, [error]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 text-center">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Algo salió mal</h1>
        <p className="text-gray-300 mb-6">
          Tuvimos un problema cargando esta página. Intenta de nuevo o vuelve al inicio.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold"
        >
          Reintentar
        </button>
      </div>
    </section>
  );
}
```

### Reglas para el contenido del error

- **En producción:** mensaje amable, sin stack trace. Solo `error.digest` (Next.js lo genera y aparece en logs server-side para correlacionar).
- **En dev:** Next.js muestra el stack automáticamente en overlay — no hace falta hacer nada extra.
- **Nunca** mostrar `error.message` directo al usuario si puede contener PII o detalles internos.

### Granularidad

- `src/app/error.tsx` — captura todo.
- `src/app/<segment>/error.tsx` — captura errores solo en ese segmento (útil para que el resto del sitio siga vivo).
- `src/app/global-error.tsx` — captura errores en el root layout mismo (fallback de último recurso).

---

## 2. API Error Responses

### Contrato de respuesta

Todas las API routes devuelven **JSON** con un shape consistente:

```ts
type ApiResponse =
  | { success: true; data?: unknown; message?: string; /* otros campos OK */ }
  | { success: false; error: string; issues?: ZodIssue[] };
```

Excepción: `POST /api/checkout/webhook` devuelve `{ received: true }` porque eso es lo que Stripe espera.

### Status codes en uso

| Código | Cuándo |
|--------|--------|
| 200 | Operación exitosa. |
| 400 | Validación Zod falló (incluye `issues` array). Ó body inválido. |
| 401 | Firma HMAC inválida (solo webhook). |
| 405 | Método HTTP no soportado (Next.js lo devuelve automáticamente cuando el handler no exporta esa función). |
| 500 | Error inesperado server-side. Mensaje genérico, detalle en `console.error`. |

### Patrón estándar en cada handler

```ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }
    // ... lógica ...
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en POST /api/<recurso>:', error);
    return NextResponse.json(
      { success: false, error: 'Operation failed' },
      { status: 500 }
    );
  }
}
```

### Reglas

- **Nunca** retornar `error.message` directo al cliente. Usa un mensaje genérico (`'Failed to capture lead'`, `'Checkout failed'`).
- **Siempre** `console.error` con prefijo claro (ej. `'[stripe] webhook'`, `'Error capturing lead'`).
- **NextResponse.json** siempre, no `Response.json()` plano (deja a Next.js manejar headers correctos).

---

## 3. Database Errors (Neon + Drizzle)

### Si Neon está caído

**Síntoma:** `fetch failed` o `connection timeout` en el log de Vercel.

**Comportamiento esperado:**
- El endpoint cae en el `catch` y devuelve 500.
- `console.error` muestra el error de Drizzle/Neon.

**Qué hacer:**
1. Revisar https://status.neon.tech.
2. Si Neon está OK pero falla solo nuestra DB: revisar Neon console → tu proyecto → si la branch está suspendida (free tier suspende tras inactividad), reactivar.
3. Si es lentitud transitoria: el driver HTTP no tiene retry built-in. Considerar añadir retry exponencial wrapper para queries críticas.

### Si una tabla no existe

**Síntoma:** error tipo `relation "orders" does not exist`.

**Causa más común:** editaste `src/db/schema.ts` localmente pero no corriste `npx drizzle-kit push` en la DB target (dev o prod).

**Fix:**
```bash
# Asegúrate de tener la DATABASE_URL correcta en .env
npx drizzle-kit push
```

Después validar con un INSERT/SELECT de prueba.

### Si una columna falta

Si añadiste una columna en el código pero la DB no la tiene, Drizzle puede silenciosamente mandar `undefined` al INSERT → puede fallar el constraint NOT NULL.

**Workflow correcto** al añadir columna (documentado en [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) §7):
1. Editar schema.
2. `drizzle-kit push` en dev.
3. Validar.
4. Actualizar `DATABASE_SCHEMA.md`.
5. Mergear.
6. `drizzle-kit push` en prod (Vic).

### Si hay un constraint violation

Ejemplo: insert con `email` que ya existe en una tabla con UNIQUE.

**Drizzle lanza** un error con `code: '23505'` (PostgreSQL unique violation).

**Patrón sugerido:**
```ts
try {
  await db.insert(orders).values({ stripe_session_id: ..., ... });
} catch (error) {
  if (error instanceof Error && error.message.includes('duplicate key')) {
    // Es idempotente — Stripe reentregó el evento, ya teníamos la orden.
    return NextResponse.json({ received: true });
  }
  throw error;
}
```

---

## 4. Stripe Errors

### Errores al crear Checkout Session

`stripe.checkout.sessions.create()` puede lanzar varios tipos:

| `error.type` | Ejemplo | Acción sugerida |
|--------------|---------|-----------------|
| `StripeCardError` | Tarjeta declinada (no aplica en Checkout hosted, pero sí en flujos client-side) | Mensaje al usuario: "Tu tarjeta fue rechazada". |
| `StripeRateLimitError` | Demasiados requests por segundo | Retry con backoff. |
| `StripeInvalidRequestError` | Parámetro mal formado (ej. `amount_cents` negativo) | Bug nuestro — fix en código. |
| `StripeAPIError` | Stripe down o glitch transitorio | Retry una vez; si persiste, devolver 500 al cliente. |
| `StripeConnectionError` | Network issue | Retry una vez. |
| `StripeAuthenticationError` | `STRIPE_SECRET_KEY` inválido | Crítico — rotar key, redeploy. |

### Patrón actual (`/api/checkout/route.ts`)

Hoy capturamos `catch (error)` genéricamente y devolvemos 500. **Mejora sugerida** (TODO):

```ts
import Stripe from 'stripe';

try {
  const session = await stripe.checkout.sessions.create({...});
} catch (error) {
  if (error instanceof Stripe.errors.StripeError) {
    console.error(`[stripe] ${error.type}: ${error.message}`);
    if (error.type === 'StripeAuthenticationError') {
      // alerta crítica al equipo
    }
  } else {
    console.error('Unexpected error:', error);
  }
  return NextResponse.json({ success: false, error: 'Checkout failed' }, { status: 500 });
}
```

### Errores en el webhook

Si `/api/checkout/webhook` devuelve **cualquier status no-2xx**, Stripe reintenta:

| Intento | Espera tras anterior |
|---------|---------------------|
| 2º | 5 min |
| 3º | 15 min |
| 4º | 30 min |
| 5º | 1 h |
| 6º+ | progresivo hasta 24h, después 3 días total |

**Tras 3 días sin 2xx**, Stripe marca el evento como `failed` y deja de reintentar. Pero el evento sigue disponible vía API para procesarlo manualmente.

**Cómo ver el log de retries:**
- Stripe dashboard → Webhooks → tu endpoint → "Recent deliveries" → click un evento → "Logs".

**Cuándo es OK devolver 5xx**: si la DB está caída, mejor devolver 500 que 2xx, así Stripe reintenta y eventualmente el insert ocurre cuando la DB vuelva.

**Cuándo NO es OK**: si el evento es válido pero hay un bug en nuestro código que siempre lanza — Stripe va a reintentar para siempre dentro de 3 días. Mejor: capturar el bug, devolver 2xx (Stripe deja de molestar), y procesar manualmente cuando el bug se arregle.

---

## 5. Resend Errors (email)

### Tipos comunes

- **Dominio no verificado:** `Domain not found or not verified`. Fix: completar el flujo de verificación en https://resend.com/domains.
- **API key inválida:** `Invalid API key`. Fix: rotar y actualizar en Vercel.
- **Rate limit:** `Too many requests`. Free tier permite 100/día / 3K/mes. Si pasamos, upgrade plan.
- **Email malformado:** `Invalid 'to' field`. Capturado por Zod antes (`email()` validator).

### Política actual

`/api/leads` envía email después del INSERT en `leads`. Si el envío falla:

```ts
try {
  await resend.emails.send({ ... });
} catch (emailError) {
  console.error('Resend failed:', emailError);
  // ⚠️ Hoy el catch externo del try big envuelve esto y devolvemos 500.
}
```

**Mejora sugerida:** desacoplar el envío de email del response. El lead sí se capturó (DB ya tiene el INSERT). Devolver 200 al cliente y solo loggear el fallo de email para retry manual:

```ts
// Versión mejor (TODO):
await db.insert(leads).values({...});

try {
  await resend.emails.send({...});
} catch (emailError) {
  console.error('[resend] Email failed (lead still captured):', emailError);
  // TODO Fase 4: encolar para reintento
}

return NextResponse.json({ success: true });
```

Razón: perder el email es molesto pero recuperable (puedes reenviar). Perder el lead porque el email falló es **pérdida de revenue**.

---

## 6. Logging Best Practices

### Qué SIEMPRE loguear

- **Entry de endpoint** crítico: `console.log('[/api/checkout] body=', { email, amount_mxn })` (sin valores sensibles).
- **Validación fallida** con `issues` array (sirve para detectar abusos o frontend roto).
- **Errores externos** (Stripe, Resend, Neon): mensaje + código + algún ID correlacionable.
- **Success conditions importantes** que afectan estado: `'[stripe] Order marked paid: session=cs_test_xxx pi=pi_xxx'`.

### Qué NUNCA loguear

- **API keys, tokens, secrets** completos. Si necesitas verificar que está cargado, loguea solo los primeros 4 chars + longitud: `key.slice(0,4) + '…(' + key.length + ' chars)'`.
- **Passwords / hashes**.
- **PII completa**: email full → mejor `email.split('@')[1]` (solo el dominio) o un hash.
- **Tarjetas de crédito** o números de CVV — no llegan a nuestro server (Stripe Checkout maneja), pero si por error aparecen, dropear el log entero.

### Estructura recomendada (TODO)

Hoy usamos `console.log` plano. Idealmente:

```ts
console.log(JSON.stringify({
  level: 'info',
  ts: new Date().toISOString(),
  service: 'api/leads',
  event: 'lead_captured',
  email_domain: email.split('@')[1],
  request_id: requestId,
}));
```

Vercel ya parsea JSON en logs y permite filtrar. Implementarlo cuando crezca el volumen.

---

## 7. Sentry Integration (Fase 4)

### Por qué

Hoy `console.error` va a Vercel logs, donde:
- No hay alertas activas (nadie sabe si algo falló).
- Buscar errores requiere abrir el dashboard manualmente.
- No hay agrupación por tipo (10 errores idénticos = 10 entries).

Sentry resuelve:
- ✅ Centraliza exceptions con stack traces legibles (sourcemaps).
- ✅ Agrupa por fingerprint (10 idénticos = 1 issue con counter).
- ✅ Alertas a Slack/email cuando un error nuevo aparece o un viejo escala.
- ✅ Breadcrumbs (qué pasó antes del error).
- ✅ Performance monitoring (latencia de endpoints).

### Setup (cuando lleguemos a Fase 4)

```bash
npx @sentry/wizard@latest -i nextjs
```

El wizard:
- Crea cuenta Sentry (free tier 5K events/mes).
- Genera `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`.
- Modifica `next.config.ts` para uploadar sourcemaps en build.
- Añade `SENTRY_AUTH_TOKEN` a Vercel.

### Alertas mínimas a configurar

1. Cualquier exception nueva (frequency-based).
2. >5 errores 5xx en 5 min en `/api/checkout` o `/api/leads`.
3. `charge.dispute.created` desde el webhook handler (custom event).
4. Performance regression: p95 latency > 2s en cualquier endpoint.

---

## 8. Testing Errors Localmente

### Probar Zod validation

```bash
# Email inválido — esperamos 400 + issues
curl -s -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Vic","email":"no-arroba"}' | python -m json.tool
# Esperado:
# {
#   "success": false,
#   "error": "Invalid input",
#   "issues": [{ "code": "invalid_string", "validation": "email", ... }]
# }

# Amount negativo en checkout — 400
curl -s -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"vic@example.com","amount_mxn":-100,"description":"test"}'

# Body vacío — 400 con multiple issues
curl -s -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d '{}'
```

### Probar el webhook sin firma (esperamos 400)

```bash
curl -s -X POST http://localhost:3000/api/checkout/webhook \
  -H "Content-Type: application/json" -d '{"type":"checkout.session.completed"}'
# Esperado: { "error": "Missing stripe-signature header" }
```

### Probar el webhook con firma real (Stripe CLI)

```bash
# Terminal 1: túnel
stripe listen --forward-to localhost:3000/api/checkout/webhook
# Te da un whsec_... — pónlo en STRIPE_WEBHOOK_SECRET de tu .env local
# y reinicia npm run dev para que lo tome.

# Terminal 2: dispara evento
stripe trigger checkout.session.completed
# Esperado: terminal 1 muestra "200 OK"; logs de npm run dev muestran
# "[stripe] Order marked paid: session=..."
```

### Probar Stripe error path

```bash
# Con key inválido en .env temporalmente:
STRIPE_SECRET_KEY=sk_test_invalid npm run dev
# En otra terminal:
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"email":"vic@example.com","amount_mxn":100,"description":"test"}'
# Esperado: 500 + { error: "Checkout failed" }; logs muestran StripeAuthenticationError.
```

---

## 9. Debugging en Producción

### Logs en Vercel

**Dashboard:**
1. https://vercel.com/vitoriomanzareks-projects/technova-next
2. Tab "Deployments" → click el deployment activo
3. Tab "Functions" → ves las invocaciones de cada API route
4. Click una invocación → ves el log completo (entrada, console.log/error, response)

**CLI (más rápido para tail):**
```bash
npx vercel logs --follow
# o filtrar por path
npx vercel logs --follow https://tech-nova.mx/api/leads
```

### Logs en Stripe

1. https://dashboard.stripe.com/test/webhooks
2. Tu endpoint → "Recent deliveries"
3. Click un evento → ves el payload enviado y la respuesta exacta que dimos.
4. Si la respuesta fue 4xx/5xx: el cuerpo del response aparece → ahí está el mensaje de error que enviamos.

### Logs en Neon

1. https://console.neon.tech → tu proyecto
2. "Monitoring" → query stats, slow queries, conexiones.
3. Si una query es lenta: aparece con su SQL y latencia.

### DevTools en el browser

Para errores que se manifiestan en el frontend:
- F12 → tab "Console" para errores JS / network.
- Tab "Network" → click un request → ves headers, payload, response, timing.

### Vercel runtime errors

Si la app cae en runtime (500 generalizado, no un endpoint específico):
- Vercel dashboard → Deployment → "Runtime Logs".
- Buscar `[ERROR]` o `Unhandled rejection`.
- Si el deploy es viejo, el log puede haber rotado — re-deploy puede ayudar a reproducir.

---

## 10. Recovery Checklist

### Si `/api/checkout/webhook` está roto (devuelve 5xx en bucle)

1. **Identifica el error** en Vercel logs → busca el último 500 del webhook.
2. **Branch local con el fix.**
3. **Test con Stripe CLI** (`stripe listen` + `stripe trigger`).
4. **Deploy preview** → confirma 200 en la preview URL.
5. **Mergea a main** → producción.
6. **En Stripe dashboard**, manualmente "Resend" los eventos que fallaron (o esperar el retry automático).

### Si `/api/leads` rechaza emails que antes aceptaba

1. **Revisar `leadSchema`** en `src/app/api/leads/route.ts` — alguien cambió la validación.
2. **Probar localmente** con un email problema.
3. **Ajustar el regex/length** si es válido y rechazamos por error.
4. **Deploy + verificar.** Los leads pasados no se afectan; solo los nuevos.

### Si el sitio entero está caído (Vercel deployment "Error")

1. **Vercel dashboard → último deploy → Build Logs.** El error aparece ahí.
2. **Si es type error:** correr `npx tsc --noEmit` local para reproducir, fix, push.
3. **Si es env var faltante:** confirmar en Vercel → Settings → Environment Variables.
4. **Si no logras fix rápido:** rollback vía Vercel "Promote previous deployment to production" (ver [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) §6).

### Si Neon está caído

1. Confirma en https://status.neon.tech.
2. Mientras dura: `/api/leads` y `/api/checkout` devolverán 500 (no hay fallback graceful hoy).
3. **Mitigación temporal**: en `next.config.ts` puedes poner un banner en el home ("Servicio temporalmente no disponible") via env var feature flag.

### Si Stripe está caído

1. Confirma en https://status.stripe.com.
2. `/api/checkout` falla — los clientes no pueden pagar.
3. Resend de webhooks fallidos cuando Stripe vuelva (automático).
4. **Mitigación temporal**: deshabilitar botones de pago en frontend con feature flag.

### Si Resend está caído

1. Confirma en https://status.resend.com.
2. `/api/leads` puede fallar al enviar email pero el lead se guarda (si aplicamos la mejora del §5).
3. Si no aplicamos esa mejora: `/api/leads` cae en el catch global y devuelve 500. **Riesgo de perder leads durante el outage.**

### Post-mortem template

Cada vez que un error grave llega a producción, documenta en BITACORA:

```markdown
## [YYYY-MM-DD] Post-mortem: <título corto>
**Severidad:** S0/S1/S2/S3
**Duración:** N min
**Impacto:** N usuarios / N requests fallidos / $ perdidos

### Cronología
- HH:MM detectado por X
- HH:MM diagnosis: Y
- HH:MM fix deployado
- HH:MM verificado OK

### Causa raíz
...

### Por qué no lo detectamos antes
...

### Acciones para evitar recurrencia
- [ ] ...
```

---

## TODOs para Fase 4

- [ ] Implementar `src/app/error.tsx` con UI amable.
- [ ] Refactor `/api/leads` para desacoplar lead capture del envío de email.
- [ ] Manejar errores tipados de Stripe (`StripeError` subclasses) en `/api/checkout`.
- [ ] Idempotency en webhook handler con `processed_events(event_id PK)`.
- [ ] Integrar Sentry con alertas.
- [ ] Estructurar logs como JSON con `request_id`, level, timestamp.
- [ ] Health-check endpoint `/api/health` que verifique Neon, Stripe, Resend.

---

## Para seguir leyendo

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — rollback procedures y troubleshooting de build.
- [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §9 — logging sin leakear PII.
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) — contracto de cada endpoint.
- [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) — cómo cubrir error paths con tests.

---

**Última actualización:** 2026-05-20
**Próxima revisión:** tras primer incidente real, o al integrar Sentry.
