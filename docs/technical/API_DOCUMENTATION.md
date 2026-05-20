# 🔌 API Documentation — TechNova

> **Fuente de verdad:** los archivos `src/app/api/**/route.ts`. Si el código cambia, actualiza este doc.
> **Base URL:** `https://tech-nova.mx` (prod), `http://localhost:3000` (dev).
> **Última verificación:** 2026-05-20.

---

## 📋 Endpoints

1. [`POST /api/leads`](#post-apileads) — captura de lead magnet + email automático
2. [`POST /api/checkout`](#post-apicheckout) — crea Stripe Checkout Session
3. [`POST /api/checkout/webhook`](#post-apicheckoutwebhook) — handler de eventos Stripe firmados

---

## `POST /api/leads`

**Propósito:** capturar leads de la "Auditoría Web Express" (formulario en el home y AdLanding) y dispararles el email de bienvenida.

**Auth:** ninguna (público).
**Rate limit:** ninguno (TODO Fase 3 — usar Vercel Edge Middleware o Upstash).
**Idempotency:** ninguna — el mismo email puede crear múltiples filas en `leads` (decisión consciente, ver [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) §3).

### Request

```http
POST /api/leads HTTP/1.1
Content-Type: application/json

{
  "email": "cliente@ejemplo.com",     // requerido, validado con .email()
  "name":  "Juan Pérez",              // opcional, max 255
  "phone": "+52 55 1234 5678",        // opcional, max 20
  "project_type": "Auditoría Express" // opcional, max 255
}
```

### Responses

#### `200 OK` — lead guardado y email enviado

```json
{ "success": true, "message": "Lead captured and email sent successfully" }
```

#### `400 Bad Request` — input inválido (Zod)

```json
{
  "success": false,
  "error": "Invalid input",
  "issues": [
    {
      "code": "invalid_type",
      "expected": "string",
      "path": ["email"],
      "message": "Invalid input: expected string, received undefined"
    }
  ]
}
```

#### `500 Internal Server Error`

```json
{ "success": false, "error": "Failed to capture lead" }
```

Causas típicas: Neon down, Resend API key inválida, dominio Resend no verificado.

### Side effects

1. **`INSERT INTO leads`** con los campos validados. Si `name` o `project_type` no llegaron, se usan defaults (`"Usuario Auditoría"` / `"Auditoría Express"`).
2. **Envío de email** vía Resend usando el template [`welcomeAuditEmail()`](../../src/lib/emails/leadAuditWelcome.ts). Remitente: `process.env.RESEND_FROM_EMAIL` (fallback al dominio de testing si no está configurado).

### Código

[`src/app/api/leads/route.ts`](../../src/app/api/leads/route.ts)

### TODO / mejoras

- Rate limiting por IP (Fase 3).
- Notificación al equipo (Slack/email interno) cuando entra un lead nuevo.
- Dedup opcional por email (hoy se permiten duplicados).

---

## `POST /api/checkout`

**Propósito:** crear una Stripe Checkout Session para que un cliente pague un monto arbitrario en MXN. Persiste la orden como `pending` en Neon. El frontend redirige al `url` devuelto.

**Auth:** ninguna en MVP (cualquiera puede llamar — el riesgo es bajo porque Stripe valida el monto contra los productos creados en su lado, pero deberíamos añadir auth cuando lancemos el área de cliente).
**Rate limit:** ninguno todavía.

### Request

```http
POST /api/checkout HTTP/1.1
Content-Type: application/json

{
  "email": "cliente@ejemplo.com",       // requerido, validado con .email()
  "amount_mxn": 18000,                  // requerido, entero positivo MXN (no centavos)
  "description": "Plan GROWTH",         // requerido, 1-500 chars
  "plan": "GROWTH"                      // opcional, enum: START | GROWTH | SCALE | custom
}
```

> **Nota sobre la moneda:** el cliente manda **MXN enteros** (más legible). El handler los convierte a `cents` (×100) antes de enviar a Stripe — Stripe siempre opera en la unidad mínima de la moneda.

### Responses

#### `200 OK`

```json
{
  "success": true,
  "url": "https://checkout.stripe.com/c/pay/cs_test_a1b2c3...",
  "sessionId": "cs_test_a1b2c3..."
}
```

El cliente debe **redirigir al usuario a `url`** (o usar `Stripe.redirectToCheckout({ sessionId })` con el SDK del browser).

#### `400 Bad Request` — Zod

```json
{
  "success": false,
  "error": "Invalid input",
  "issues": [ /* ZodIssue[] */ ]
}
```

#### `500 Internal Server Error`

```json
{ "success": false, "error": "Checkout failed" }
```

Causas típicas: Stripe API key inválida, Neon down, problema de red.

### Side effects

1. **`stripe.checkout.sessions.create`** con `mode: 'payment'`, `currency: 'mxn'`, `line_items` dinámicos (no Products pre-creados en Stripe).
2. **`INSERT INTO orders`** con `status='pending'`, monto en centavos, descripción y `stripe_session_id`.

### Comportamiento del usuario

1. Frontend llama `POST /api/checkout` → recibe `url`.
2. Frontend redirige a `url` → Stripe Checkout hosted.
3. Cliente paga (o cancela).
4. Stripe redirige a `/checkout/success?session_id=...` o `/checkout/cancel`.
5. Paralelamente, Stripe envía un webhook a `/api/checkout/webhook` → marca la orden como `paid`.

### Código

[`src/app/api/checkout/route.ts`](../../src/app/api/checkout/route.ts)

### TODO / mejoras

- Auth (no permitir que cualquiera dispare checkouts).
- Verificar que `amount_mxn` matchea la cotización del wizard (anti-tampering).
- Idempotency-Key del lado del cliente.

---

## `POST /api/checkout/webhook`

**Propósito:** recibir y procesar eventos firmados de Stripe. Actualiza el estado de las órdenes en Neon según el evento. Suscritos a 11 tipos de eventos (ver [§Eventos manejados](#eventos-manejados)).

**Auth:** firma HMAC verificada con `STRIPE_WEBHOOK_SECRET`. Stripe firma cada request con su secret de webhook; cualquier request sin firma válida → 400.
**Rate limit:** Stripe limita su propio rate de envío.
**Idempotency:** confiamos en que UPDATEs basados en `stripe_session_id` son idempotentes (no se duplican filas). Para hardening futuro: tabla `processed_events(event_id PRIMARY KEY)`.

### Request

Lo envía Stripe automáticamente:

```http
POST /api/checkout/webhook HTTP/1.1
Content-Type: application/json
Stripe-Signature: t=1779291234,v1=abc123def456...

{
  "id": "evt_1Abc...",
  "type": "checkout.session.completed",
  "data": { "object": { /* Stripe.Checkout.Session */ } },
  ...
}
```

**⚠️ Crítico:** el handler usa `request.text()` (raw body) para verificar la firma. NO usar `request.json()` aquí — alteraría el payload y la firma fallaría.

### Responses

#### `200 OK` — evento procesado

```json
{ "received": true }
```

Stripe necesita 2xx para considerar el evento entregado. Si no llega 2xx, reintentará con backoff exponencial hasta 3 días.

#### `400 Bad Request` — sin header `Stripe-Signature`

```json
{ "error": "Missing stripe-signature header" }
```

#### `400 Bad Request` — firma inválida

```json
{ "error": "Invalid signature" }
```

#### `500 Internal Server Error` — error procesando

```json
{ "error": "Webhook handler failed" }
```

### Eventos manejados

| Evento | Acción |
|--------|--------|
| `checkout.session.completed` | `UPDATE orders SET status='paid', paid_at=NOW(), stripe_payment_intent_id=... WHERE stripe_session_id=...` |
| `checkout.session.expired` | `UPDATE orders SET status='expired' WHERE stripe_session_id=...` |
| `payment_intent.succeeded` | Log only (redundante con checkout.session.completed). |
| `payment_intent.payment_failed` | Log warning (TODO: notificar cliente). |
| `charge.refunded` | `UPDATE orders SET status='refunded' WHERE stripe_payment_intent_id=...` |
| `charge.dispute.created` | Recupera el charge → obtiene PI → `UPDATE orders SET status='disputed'`. TODO: alertar al equipo. |
| `customer.subscription.created` | Log only (sin handler — sin producto subscription todavía). |
| `customer.subscription.updated` | Log only. |
| `customer.subscription.deleted` | Log only. |
| `invoice.paid` | Log only. |
| `invoice.payment_failed` | Log only. |

Los 5 eventos de subscription están **suscritos proactivamente** en el dashboard de Stripe para no tener que volver cuando lancemos el plan SCALE con cobro mensual recurrente.

### Cómo probar el webhook localmente

Stripe CLI redirige eventos de prod o test a tu localhost:

```bash
# Instala una vez
npm install -g stripe

# En una terminal:
stripe listen --forward-to localhost:3000/api/checkout/webhook
# → te da un whsec_... distinto del de producción. Úsalo en STRIPE_WEBHOOK_SECRET local.

# En otra terminal: dispara un evento de prueba
stripe trigger checkout.session.completed
```

### Código

[`src/app/api/checkout/webhook/route.ts`](../../src/app/api/checkout/webhook/route.ts)

### TODO / mejoras

- **Idempotency robusta** vía tabla `processed_events(event_id PK)`. Si Stripe reentrega un mismo `evt_…`, el INSERT en esa tabla falla y skipeamos la lógica.
- **Implementar handlers de subscription** cuando lancemos plan SCALE recurring.
- **Alertas a equipo** (Slack webhook) para `charge.dispute.created` y `payment_intent.payment_failed` repetidos.
- **Email de confirmación post-pago** desde el handler `checkout.session.completed` (vía Resend).

---

## Páginas de redirect (no son endpoints API pero relacionadas)

### `GET /checkout/success`

Render server-side. Lee `session_id` de `searchParams` (que es `Promise<{...}>` en Next 16, hay que `await`). Muestra mensaje de confirmación. **No** hace re-verificación contra Stripe — confía en el webhook para el estado real en DB.

Código: [`src/app/checkout/success/page.tsx`](../../src/app/checkout/success/page.tsx).

### `GET /checkout/cancel`

Render server-side. Mensaje "no se cobró nada" + CTAs a `/pricing` y `/contacto`.

Código: [`src/app/checkout/cancel/page.tsx`](../../src/app/checkout/cancel/page.tsx).

---

## Convenciones generales

- **Shape de respuesta:** `{ success: boolean, message?: string, error?: string, issues?: ZodIssue[] }`. Stripe webhook es la única excepción (devuelve `{ received: true }` que es el contrato esperado por Stripe).
- **Status codes:** 200/201 OK · 400 client error · 401 unauth · 404 not found · 500 server.
- **Errores nunca leakean stack traces** — solo mensaje genérico al cliente, detalle a `console.error`.
- **Tipos del request:** los handlers reciben `Request` (Web standard), NO `NextApiRequest` (eso era Pages Router).
- **`NextResponse.json()`** siempre, no `Response.json()` plano.

---

## Para seguir leyendo

- [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md) §4 — patrón general de API routes.
- [`DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) — tablas que tocan estos endpoints.
- [`ONBOARDING_DEVELOPER.md`](./ONBOARDING_DEVELOPER.md) — cómo probar cada endpoint con curl.
- [`../../DECISION_LOG.md`](../../DECISION_LOG.md) — D-006 (lead magnet), D-007 (Stripe), D-012 (Resend).

---

**Última actualización:** 2026-05-20
**Próxima revisión:** cuando se añada/modifique un endpoint o cambien los eventos suscritos en Stripe.
