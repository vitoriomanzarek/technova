# 🧪 Reporte de Ejecución — Testing Manual SEC-4 + SEC-5

**Sprint:** SEC (Hardening anti-enumeración + tests del flujo de pago)
**Ejecutado por:** Claude Code (Ejecutor)
**Fecha:** 2026-06-13
**Guía base:** `reports/MANUAL_TESTING_GUIDE_SEC4_5.md`
**Entorno:** Windows 11 / PowerShell · Next.js 16 dev server en `http://localhost:3000`

---

## ✅ Estado final: TODOS LOS TESTS PASAN (5/5)

| Test | Criterio | Resultado |
|------|----------|-----------|
| 1 — POST /api/leads | `success: true` + HTTP 200 | ✅ PASS |
| 2 — Rate limit 429 | Requests 21+ → 429 (límite 20/min en endpoints por-UUID) | ✅ PASS |
| 3 — 404 genérico checkout | `{ "success": false, "error": "Not found" }` en los 4 endpoints | ✅ PASS |
| 4 — 404 genérico proposals PDF | `{ "success": false, "error": "Not found" }` + HTTP 404 | ✅ PASS |
| 5 — Webhook sin rate limit | Nunca 429 (siempre 400 por firma inválida) | ✅ PASS |

**Conclusión:** El hardening anti-enumeración (SEC-4) y la exclusión del webhook (SEC-4a) funcionan correctamente. Upstash Redis está configurado en `.env` y el rate limiter responde con los límites esperados. **El sprint SEC puede marcarse `✅ DONE` en BACKLOG_MASTER.**

---

## ⚠️ Nota sobre la guía (no es un bug del código)

La guía original prueba **los 4 sub-endpoints de checkout con GET**. Pero dos de ellos son **POST-only**:

| Endpoint | Métodos exportados | GET responde |
|----------|--------------------|--------------|
| `GET /api/checkout/[uuid]` | `GET` | 404 genérico ✅ |
| `/api/checkout/[uuid]/pay` | **`POST`** | **405** (Method Not Allowed) |
| `GET /api/checkout/[uuid]/contract` | `GET` | 404 genérico ✅ |
| `/api/checkout/[uuid]/request-changes` | **`POST`** | **405** (Method Not Allowed) |

Un `GET` a `/pay` y `/request-changes` devuelve **405 con cuerpo vacío** (comportamiento estándar de Next.js para método no soportado). Esto **no filtra estado interno** → no rompe el objetivo anti-enumeración, pero **no coincide** con el "404 genérico" literal que la guía esperaba.

Para probar correctamente la respuesta anti-enumeración de esos endpoints hay que usar **POST**. Al hacerlo, ambos devuelven el 404 genérico esperado (ver Test 3 abajo).

> **Sugerencia para Cowork:** actualizar la guía para usar `POST` en `/pay` y `/request-changes`, o documentar que esos endpoints son POST-only y que un GET da 405 (que es seguro).

---

## Detalle por test

### Test 1 — POST /api/leads ✅
```
POST /api/leads  {"name","email","company","message"}
→ HTTP 200
→ {"success":true,"message":"Lead registrado correctamente","notified":true}
```
Respuesta es un superset de `{success:true}`; incluye `notified:true` (Resend configurado en `.env`).

### Test 2 — Rate limit 429 ✅
```
25× GET /api/checkout/00000000-0000-0000-0000-000000000000
Request 1–20  → HTTP 404
Request 21–25 → HTTP 429
```
El límite es **20/min por IP** (limiter `rl:uuid`, slidingWindow(20,'1m') — ver `src/proxy.ts:47-57`). El 429 arranca exactamente en el request 21. Upstash operativo (no fail-open).

### Test 3 — 404 genérico en checkout ✅
| Request | HTTP | Body |
|---------|------|------|
| `GET /api/checkout/<uuid>` | 404 | `{"success":false,"error":"Not found"}` |
| `POST /api/checkout/<uuid>/pay` (schema válido) | 404 | `{"success":false,"error":"Not found"}` |
| `GET /api/checkout/<uuid>/contract` | 404 | `{"success":false,"error":"Not found"}` |
| `POST /api/checkout/<uuid>/request-changes` (schema válido) | 404 | `{"success":false,"error":"Not found"}` |

- No aparece `"proposal not found"`, `"checkout expired"` ni stack traces. El detalle queda solo en `console.error` del servidor (ver `pay/route.ts:52`, `request-changes/route.ts:53`).
- Nota: `POST /pay` con body `{}` devuelve **400 `Invalid input`** (validación Zod), no 404. Es correcto y **no es leak**: la validación de esquema ocurre antes del lookup y la respuesta es idéntica para cualquier UUID (existente o no).

### Test 4 — 404 genérico en proposals PDF ✅
```
GET /api/proposals/<uuid>/pdf
→ HTTP 404
→ {"success":false,"error":"Not found"}
```

### Test 5 — Webhook sin rate limit ✅
```
25× POST /api/checkout/webhook  {"type":"test"}
Request 1–25 → HTTP 400 (firma inválida)  ·  nunca 429
```
Confirma la exclusión explícita en `src/proxy.ts:188-190` (el webhook se devuelve con `NextResponse.next()` antes de aplicar cualquier limiter).

---

## Notas de ejecución / entorno

- **`.env` vs `.env.local`:** la guía pide vars en `.env.local`, pero este proyecto las tiene en **`.env`** (que Next.js carga por defecto). `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` y `RESEND_API_KEY` están presentes en `.env` → los tests de 429 y de email sí funcionan.
- **PowerShell, no bash:** los comandos de la guía (`curl`/`jq`, `for i in $(seq …)`) se adaptaron a `curl.exe` vía la herramienta Bash. Sin `jq` se usó `-w "HTTP %{http_code}"`.
- **Servidor dev:** durante el primer pase el servidor preexistente se cayó a mitad de los tests POST (devolvió cuerpos vacíos). Se reinició con `npm run dev` y los POST se re-verificaron limpios — los cuerpos vacíos fueron artefacto del servidor cayéndose, **no** del código. (En el shell Bash de Windows `npm` no está en PATH → usar PowerShell/`npm.cmd` para levantar el server.)
- **Reset del rate limit:** el contador `rl:uuid` es por-IP (no por-UUID), así que tras el Test 2 hubo que esperar el reseteo de la ventana (~60s) antes de los Tests 3 y 4.

---

## Definition of Done

- [x] Test 1 — POST /api/leads → 200 `success:true`
- [x] Test 2 — Rate limit → 429 en request 21+
- [x] Test 3 — 404 genérico en los 4 endpoints de checkout (POST en pay/request-changes)
- [x] Test 4 — 404 genérico en proposals PDF
- [x] Test 5 — Webhook nunca 429 (siempre 400)
- [x] Reporte generado en `reports/`

**Resultado: sprint SEC listo para cierre. ✅**
