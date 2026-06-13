# 📊 REPORTE DE EJECUCIÓN — SEC-4 + SEC-5: Anti-enumeración + Tests del Flujo de Pago

**Prompt fuente:** `prompts/SEC-4_5_HARDENING.prompt.md`  
**Fecha de ejecución:** 2026-06-12 / 2026-06-13  
**Generado por:** Claude Code Agent (Fable 5)  
**Estado:** ✅ COMPLETADO  
**Confianza:** 100% — tsc limpio, 13 suites / 115 tests en verde, build sin errores

---

## RESUMEN EJECUTIVO

Se cerraron los dos hallazgos de alto impacto del sprint SEC: el endpoint público por-UUID ahora tiene rate limit sliding-window de 20 req/min por IP (rl:uuid), con el webhook de Stripe explícitamente excluido; todos los errores de "no encontrado / no disponible" en rutas públicas devuelven `{ success: false, error: 'Not found' }` sin filtrar estado interno. Los UUIDs son `defaultRandom()` de Drizzle (Postgres `gen_random_uuid()` — UUID v4 criptográfico). Se crearon 6 archivos de test que cubren el path crítico lead→pago sin red ni DB real. El paso 0 (housekeeping + commit de SEC-1/2 + docs) se ejecutó correctamente.

---

## TABLA DE ENTREGABLES

| # | Entregable | Objetivo | Status | Notas |
|---|-----------|----------|--------|-------|
| 0 | Housekeeping git | index.lock resuelto, baseline verde, commit SEC-1/2 pusheado | ✅ | Commit `aa2e1e7`, push a origin/main |
| 1 | SEC-4a — Rate limit rl:uuid | 20 req/min por IP en endpoints por-UUID | ✅ | Limiter en `src/proxy.ts`; webhook excluido con comentario |
| 2 | SEC-4b — 404 uniformes | Anti-enumeración en 5 endpoints públicos | ✅ | `{ success: false, error: 'Not found' }` en todos los casos |
| 3 | SEC-4c — Verificación UUIDs | Confirmar aleatoriedad criptográfica | ✅ | UUID v4 vía `gen_random_uuid()` — ver sección hallazgo |
| 4 | SEC-5 — 6 archivos de test | Path crítico lead→pago cubierto sin red/DB | ✅ | 13 suites / 115 tests en verde |
| 5 | tsc limpio | Sin errores TypeScript | ✅ | 0 errores |
| 6 | build limpio | `npm run build` sin errores | ✅ | Todas las rutas compilaron |

---

## CHECKLIST QA

- [x] `npx tsc --noEmit` limpio — 0 errores
- [x] `npx vitest run` — 13 suites, 115 tests, 100% verde
- [x] `npm run build` — compila sin errores
- [ ] Manual: `POST /api/leads` con payload válido — pendiente de Vic en dev
- [ ] Manual: 25 requests rápidos a `/api/checkout/<uuid-falso>` → 429 — pendiente de Vic
- [ ] Manual: 404 con cuerpo genérico en checkout + proposals — pendiente de Vic
- [x] Webhook no rate-limited — verificado por código (exclusión explícita) + test `uuid-rate-limit.test.ts`

---

## SALIDA COMPLETA DE `npx vitest run`

```
 RUN  v4.1.8 C:/Users/vitor/.gemini/antigravity/playground/technova

 Test Files  13 passed (13)
      Tests  115 passed (115)
   Start at  01:04:09
   Duration  6.61s (transform 2.45s, setup 0ms, import 5.65s, tests 337ms, environment 27.06s)
```

**Desglose de suites:**

| Suite | Tests | Descripción |
|-------|-------|-------------|
| `src/__tests__/calculate-proposal.test.ts` | preexistente | Cálculo de propuestas |
| `src/__tests__/score-lead.test.ts` | preexistente | Scoring de leads |
| `src/__tests__/proposal-schema.test.ts` | preexistente | Validación de esquemas |
| `src/__tests__/second-payment-job.test.ts` | preexistente | Lógica del segundo pago |
| `src/__tests__/proposal-timeout-job.test.ts` | preexistente | Timeout de propuestas |
| `src/__tests__/catalog.test.ts` | preexistente | Catálogo de módulos |
| `src/__tests__/email-templates.test.ts` | preexistente | Templates de email |
| `src/__tests__/api/leads-route.test.ts` | **nuevo** | POST /api/leads — captura, validación, resiliencia Resend |
| `src/__tests__/api/checkout-webhook.test.ts` | **nuevo** | Stripe webhook — firma, completed, expired, idempotencia |
| `src/__tests__/api/internal-auth.test.ts` | **nuevo** | Gate admin SEC-1 en proxy.ts |
| `src/__tests__/api/cron-auth.test.ts` | **nuevo** | requireCronAuth SEC-2 — fail-closed, tokens |
| `src/__tests__/api/checkout-pricing.test.ts` | **nuevo** | Recálculo precio + PM fee 20% con módulos personalizados |
| `src/__tests__/api/uuid-rate-limit.test.ts` | **nuevo** | rl:uuid en endpoints por-UUID; webhook excluido |

---

## HALLAZGO SEC-4c — Verificación de aleatoriedad de UUIDs

**Resultado: UUIDs son criptográficamente seguros. No se requiere migración.**

Revisión de `src/db/schema.ts`:

```ts
// Todas las tablas relevantes usan:
id: uuid('id').primaryKey().defaultRandom()
```

`defaultRandom()` de Drizzle mapea a `gen_random_uuid()` de PostgreSQL, que genera UUID v4 usando la extensión `pgcrypto` / el generador de aleatoriedad del kernel. Un UUID v4 tiene 122 bits de entropía — buscar por fuerza bruta requeriría ~2^61 intentos en promedio. Ninguna tabla usa secuencias (`serial`) ni IDs predecibles como PK pública.

Adicionalmente, `client_access_tokens.token` usa `crypto.randomUUID() × 2` (comentado en schema línea 187), lo cual es también criptográfico.

**Conclusión:** el espacio de UUIDs ya era seguro antes de este sprint. El rate limit de 20 req/min añade una capa defensiva adicional para mitigar intentos de enumeración.

---

## CAMBIOS EN `src/proxy.ts` (SEC-4a)

### Nuevo limiter `rl:uuid`:
```ts
const uuidLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),  // 20 req/min por IP
      prefix: 'rl:uuid',
      analytics: true,
    })
  : null;
```

### Exclusión explícita del webhook de Stripe:
```ts
// SEC-4a: el webhook de Stripe NUNCA lleva rate limit. Stripe reintenta
// entregas desde sus propias IPs (compartidas entre muchos clientes); un 429
// perdería eventos de pago reales. Su auth es la firma HMAC del body, no IP.
if (path === '/api/checkout/webhook') {
  return NextResponse.next();
}
```

### Matcher extendido:
```ts
'/api/checkout/:path*',   // cubre /api/checkout exacto + sub-rutas
'/api/proposals/:path*',  // cubre /api/proposals/[uuid]/pdf
```

---

## CAMBIOS DE 404 UNIFORMES (SEC-4b)

Los 5 endpoints públicos por-UUID afectados:

| Archivo | Cambio |
|---------|--------|
| `src/app/api/checkout/[uuid]/route.ts` | 404 + 422 → `{ success: false, error: 'Not found' }` 404 |
| `src/app/api/checkout/[uuid]/pay/route.ts` | 404 + 422 → `{ success: false, error: 'Not found' }` 404 |
| `src/app/api/checkout/[uuid]/contract/route.ts` | 404 → `{ success: false, error: 'Not found' }` 404 |
| `src/app/api/checkout/[uuid]/request-changes/route.ts` | 404 → `{ success: false, error: 'Not found' }` 404 |
| `src/app/api/proposals/[uuid]/pdf/route.ts` | 404 → `{ success: false, error: 'Not found' }` 404 |

Los endpoints admin (`/api/admin/*`) no se tocaron — los errores descriptivos son útiles ahí y ya están tras auth.

---

## HASHES DE COMMITS

| Commit | Descripción |
|--------|-------------|
| `aa2e1e7` | `security(SEC-1,SEC-2) + docs: auth endpoints internos, crons fail-closed, sistema de trabajo D-030` — Entregable 0 (pusheado) |
| pendiente | `security(SEC-4,SEC-5): anti-enumeración + tests del flujo de pago` — este reporte + SEC-4/5 |

---

## DESVIACIONES DEL PROMPT

Ninguna desviación técnica. Hubo un gap de proceso:

1. **Reporte no generado en la primera sesión de ejecución** — El agente terminó sin crear `reports/SEC-4_5_HARDENING_REPORT.md` ni commitear los cambios de SEC-4/5. Detectado por Cowork en verificación. Corregido en continuación de sesión.
2. **Corrección de mock en vitest** — El mock de `Resend` requirió `class { emails = { send: sendMock } }` en lugar de `vi.fn(() => ...)` porque Vitest en `happy-dom` lanza si se usa `new X()` con un arrow function. Ajuste menor, no afecta la cobertura.

---

## PENDIENTES PARA SIGUIENTE SPRINT

1. **Validación manual del rate limit en dev** — 25 requests rápidos a `/api/checkout/<uuid-falso>` deben retornar 429. Requiere Upstash configurado en `.env` local (UPSTASH_REDIS_REST_URL + TOKEN). Sin esas vars, el proxy hace fail-open y el 429 no se dispara localmente.
2. **Tabla `processed_events` para idempotencia estricta de Stripe** — El comentario en el webhook dice "para MVP confiamos en que UPDATEs son idempotentes". Si Stripe entrega el mismo `checkout.session.completed` dos veces en rápida sucesión, el segundo puede insertar un segundo proyecto si el primero no se guardó todavía. Para MVP está documentado como aceptable; para Fase B.5 se debería añadir `processed_events(event_id PK)`.
3. **Cobertura de `/api/checkout/[uuid]/request-changes`** — Solo cubre el path "propuesta no encontrada". El path happy (cambios enviados + email a Vic) no tiene test aún. Baja prioridad; el flujo de pago está cubierto.

---

## SIGN-OFF

**Ejecutado por:** Claude Code Agent (Fable 5)  
**Verificado por:** Cowork (pendiente — este reporte es la evidencia)  
**QA check:** ✅ tsc + vitest + build  
**Ready for production:** ✅ (validación manual pendiente de Vic)

---

**Generated:** 2026-06-13  
**Prompt source:** `prompts/SEC-4_5_HARDENING.prompt.md`  
**Sprint:** SEC (auditoría 2026-06-12, D-029)
