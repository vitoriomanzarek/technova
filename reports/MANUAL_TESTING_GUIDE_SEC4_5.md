# 🧪 Guía de Testing Manual — SEC-4 + SEC-5

**Sprint:** SEC (Hardening anti-enumeración + tests del flujo de pago)  
**Fecha:** 2026-06-13  
**Prerequisito:** App corriendo en `http://localhost:3000` (`npm run dev`)

---

## Prerequisitos de entorno

Antes de empezar, verifica que tienes estas vars en `.env.local`:

```bash
UPSTASH_REDIS_REST_URL=<tu URL de Upstash>
UPSTASH_REDIS_REST_TOKEN=<tu token de Upstash>
```

> ⚠️ **Sin Upstash configurado**, el rate limit hace **fail-open** — los tests de 429 NO funcionarán. Si no tienes Redis local, salta al Test 3 y 4 que no dependen de Redis.

---

## Test 1 — `POST /api/leads`: Captura válida de lead

**Qué valida:** el endpoint acepta un lead bien formado y responde con éxito.

```bash
curl -s -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lead",
    "email": "test@example.com",
    "company": "ACME Corp",
    "message": "Quiero saber más sobre sus servicios"
  }' | jq .
```

**Resultado esperado:**
```json
{ "success": true }
```

**También verifica:**
- Llega email de confirmación a `test@example.com` (si Resend está configurado)
- Llega notificación a tu email (Vic) con los datos del lead

---

## Test 2 — Rate limit: 25 requests → 429

**Qué valida:** después de 20 requests en 1 minuto desde la misma IP, el endpoint devuelve 429.

> Requiere Upstash configurado en `.env.local`

Ejecuta este script en terminal:

```bash
for i in $(seq 1 25); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/api/checkout/00000000-0000-0000-0000-000000000000)
  echo "Request $i → HTTP $STATUS"
done
```

**Resultado esperado:**
```
Request 1  → HTTP 404
Request 2  → HTTP 404
...
Request 20 → HTTP 404
Request 21 → HTTP 429
Request 22 → HTTP 429
...
Request 25 → HTTP 429
```

> El número exacto en que empieza el 429 puede variar ±1 por la ventana deslizante.

**Para resetear el contador** (si quieres repetir el test):
Espera 1 minuto, o limpia la key `rl:uuid:*` en tu dashboard de Upstash.

---

## Test 3 — 404 genérico en checkout (anti-enumeración)

**Qué valida:** UUIDs inexistentes devuelven un 404 con cuerpo genérico, sin filtrar estado interno.

```bash
curl -s -w "\nHTTP %{http_code}\n" \
  http://localhost:3000/api/checkout/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
```

**Resultado esperado:**
```json
{ "success": false, "error": "Not found" }
HTTP 404
```

**Lo que NO debe aparecer:**
- `"proposal not found"` → filtra estado interno
- `"checkout expired"` → filtra estado
- Stack traces o mensajes de Prisma/Drizzle

Repite para los sub-endpoints:

```bash
# /contract (GET)
curl -s http://localhost:3000/api/checkout/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/contract

# /pay (POST-only — usar POST)
curl -s -X POST http://localhost:3000/api/checkout/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/pay \
  -H "Content-Type: application/json" \
  -d '{"paymentMethodId":"pm_test_123"}'

# /request-changes (POST-only — usar POST)
curl -s -X POST http://localhost:3000/api/checkout/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/request-changes \
  -H "Content-Type: application/json" \
  -d '{"message":"cambio de prueba"}'
```

Todos deben responder `{ "success": false, "error": "Not found" }` con HTTP 404.

> **Nota:** `/pay` y `/request-changes` son POST-only. Un GET a esos endpoints devuelve `405 Method Not Allowed` con cuerpo vacío — eso es correcto y seguro (no filtra estado interno), pero para probar el 404 anti-enumeración hay que usar POST.

---

## Test 4 — 404 genérico en proposals PDF

**Qué valida:** el PDF de una propuesta inexistente también devuelve 404 genérico.

```bash
curl -s -w "\nHTTP %{http_code}\n" \
  http://localhost:3000/api/proposals/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/pdf
```

**Resultado esperado:**
```
HTTP 404
{ "success": false, "error": "Not found" }
```

---

## Test 5 — Webhook de Stripe NO tiene rate limit

**Qué valida:** el webhook de Stripe está explícitamente excluido del rate limiter (nunca debe recibir 429 por volumen).

```bash
# Simula 25 requests al webhook (sin firma válida — esperamos 400, nunca 429)
for i in $(seq 1 25); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    http://localhost:3000/api/checkout/webhook \
    -H "Content-Type: application/json" \
    -d '{"type":"test"}')
  echo "Request $i → HTTP $STATUS"
done
```

**Resultado esperado:**
- Todos los requests deben devolver `400` (firma inválida) — **nunca `429`**
- Si ves un `429`, hay un bug en la exclusión del webhook

---

## Resumen de criterios de éxito

| Test | Criterio | Pass |
|------|----------|------|
| 1 — POST /api/leads | `{ "success": true }` con HTTP 200 | ☐ |
| 2 — Rate limit 429 | Requests 21+ devuelven 429 | ☐ |
| 3 — 404 genérico checkout | `{ "success": false, "error": "Not found" }` en 4 endpoints | ☐ |
| 4 — 404 genérico proposals | `{ "success": false, "error": "Not found" }` en PDF endpoint | ☐ |
| 5 — Webhook sin rate limit | Nunca 429 en webhook (siempre 400 por firma) | ☐ |

---

## Si algo falla

| Síntoma | Causa probable | Acción |
|---------|---------------|--------|
| Test 2 nunca llega a 429 | Sin Upstash en `.env.local` | Configura Redis o salta este test |
| Test 1 devuelve 500 | Sin Resend configurado | Revisa `RESEND_API_KEY` en `.env.local` |
| Test 3/4 devuelve mensaje descriptivo | Bug en 404 uniforme | Reportar a Claude Code con endpoint específico |
| Test 5 devuelve 429 | Bug en exclusión del webhook | Urgente — revisa `src/proxy.ts` línea de exclusión |

---

**Una vez que todos los checks estén en ✅**, el sprint SEC queda cerrado y Cowork puede marcar `✅ DONE` en BACKLOG_MASTER.
