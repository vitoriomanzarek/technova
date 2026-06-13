# 🔒 SEC-4 + SEC-5: Anti-enumeración + Tests del Flujo de Pago

**For:** Claude Code Agent
**Status:** 🔴 READY TO EXECUTE
**Priority:** 🟠 ALTA (sprint SEC — auditoría 2026-06-12, decisión D-029)
**Estimated Time:** 6-10 horas
**Depends on:** SEC-1 y SEC-2 — YA IMPLEMENTADOS, están en el working tree SIN COMMITEAR (ver Setup paso 0)

---

## 📋 OBJETIVO

Cerrar los dos hallazgos restantes de alto impacto de la auditoría de seguridad 2026-06-12:

1. **SEC-4 — Anti-enumeración:** los endpoints públicos por-UUID (`/api/checkout/[uuid]/*`, `/api/proposals/[uuid]/pdf`) no tienen rate limit y sus respuestas de error revelan qué recursos existen. Un atacante puede enumerar UUIDs y raspar propuestas/contratos con precios de clientes.
2. **SEC-5 — Tests del path que cobra dinero:** cobertura actual ~6%, cero tests de endpoints. Stripe está en LIVE: el flujo lead→pago necesita tests de integración que impidan regresiones.

**Contexto del proyecto:** TechNova (Next.js 16 App Router + Drizzle + Neon + Stripe LIVE + Resend + Upstash). El middleware vive en `src/proxy.ts` (convención Next 16, no `middleware.ts`). Repo en `C:\Users\vitor\.gemini\antigravity\playground\technova`.

---

## 🎯 ENTREGABLES

### 0. Housekeeping git (HACER PRIMERO, antes de cualquier cambio)

Hay un `index.lock` huérfano (proceso git que murió) y cambios SEC-1/SEC-2 + docs sin commitear de la sesión de Cowork de hoy.

1. Verificar que no hay ningún proceso git corriendo, luego borrar `.git/index.lock` si existe.
2. Baseline verde ANTES de tocar nada: `npx tsc --noEmit` y `npx vitest run` deben pasar con el working tree actual (incluye SEC-1/SEC-2 ya implementados). Si vitest falla por algo preexistente, documentarlo en el reporte y continuar.
3. Commit de TODO lo pendiente con este mensaje exacto, y push a `origin/main`:

```
security(SEC-1,SEC-2) + docs: auth endpoints internos, crons fail-closed, sistema de trabajo D-030

- /api/audits/create y /api/proposals/generate tras gate admin (proxy.ts)
- src/lib/cron-auth.ts: fail-closed + constant-time, sin token por query
- 4 cron routes migradas al helper
- CLAUDE.md: Sistema Operativo de Trabajo (D-030) + sprint SEC en BACKLOG
- DECISION_LOG: D-029, D-030; BITACORA: sesiones 2026-06-12
```

### 1. SEC-4a — Rate limiting en endpoints por-UUID (`src/proxy.ts`)

- Nuevo limiter Upstash `rl:uuid` — sliding window **20 req/min por IP** (generoso para uso legítimo, mata scripts de enumeración).
- Aplicarlo a: `GET/POST /api/checkout/[uuid]`, `/api/checkout/[uuid]/pay`, `/api/checkout/[uuid]/contract`, `/api/checkout/[uuid]/request-changes`, `GET /api/proposals/[uuid]/pdf`.
- Extender el `matcher` del proxy con `'/api/checkout/:path*'` y `'/api/proposals/:path*'` y rutear por path DENTRO de `proxy()`.

⚠️ **Cuidados obligatorios:**
- `/api/checkout` exacto (POST crear sesión) ya tiene su limiter de 3/min — NO cambiar su comportamiento.
- `/api/checkout/webhook` NO debe llevar rate limit (Stripe reintenta desde sus IPs; un 429 perdería eventos de pago). Excluirlo explícitamente y dejar comentario explicando por qué.
- `/api/proposals/generate` ya pasa por el gate admin (SEC-1) — el gate corre ANTES que el limiter; no duplicar.
- Mantener el patrón existente del archivo: fail-open si Upstash no está configurado, headers `X-RateLimit-*`, comparaciones y estilo actual.

### 2. SEC-4b — Respuestas 404 uniformes en endpoints públicos por-UUID

- En los endpoints por-UUID públicos, TODOS los casos "no existe / no disponible" deben responder igual: `{ success: false, error: 'Not found' }` con status 404 — sin distinguir "lead not found" vs "proposal not found" vs "order not found" ni filtrar estados internos.
- Los detalles van a `console.error` server-side, nunca al response.
- NO tocar los endpoints admin (`/api/admin/*`): ahí los errores descriptivos son útiles y ya están tras auth.

### 3. SEC-4c — Verificación de aleatoriedad de UUIDs

- Revisar cómo se generan los UUIDs públicos (propuestas, checkout, contratos) en el schema Drizzle (`src/db/schema*`) y/o en código (`crypto.randomUUID()`, `gen_random_uuid()`, etc.).
- Si son UUID v4 criptográficos → solo documentar el hallazgo en el reporte.
- Si alguno fuera secuencial/predecible → corregir a `crypto.randomUUID()` y documentar la migración.

### 4. SEC-5 — Tests de integración del path lead→pago

Crear en `src/__tests__/api/` (mantener convención de los 7 tests existentes en `src/__tests__/`). Todos los tests deben correr **sin red y sin DB real** — mockear `@/db`, Stripe, Resend y Upstash con `vi.mock`.

| Archivo | Qué cubre (mínimo) |
|---|---|
| `leads-route.test.ts` | POST `/api/leads`: payload válido → 200 + insert; payload inválido → 400 Zod; email de notificación disparado; fallo de Resend NO rompe la captura del lead |
| `checkout-webhook.test.ts` | Firma Stripe inválida → 400 y NO toca DB; `checkout.session.completed` válido → orden `paid`; evento duplicado → idempotente (no doble proyecto/email); `checkout.session.expired` → orden `expired` |
| `internal-auth.test.ts` | `proxy()` de `src/proxy.ts`: `/api/audits/create` y `/api/proposals/generate` sin `x-admin-token` → 401; con token correcto → pasa; `/api/admin/*` sin token → 401 |
| `cron-auth.test.ts` | `requireCronAuth` de `src/lib/cron-auth.ts`: sin env vars → 503 (fail-closed); Bearer incorrecto → 401; `Bearer CRON_SECRET` correcto → null; `x-admin-token` correcto → null |
| `checkout-pricing.test.ts` | Recálculo de precio con módulos add/remove + 20% PM fee — consistente con `catalog.ts` (extender `catalog.test.ts` si ya cubre parte) |
| `uuid-rate-limit.test.ts` | `proxy()`: requests bajo el límite pasan con headers `X-RateLimit-*`; sobre el límite → 429 con `Retry-After`; `/api/checkout/webhook` NUNCA limitado (mock de Upstash) |

**Meta:** el path crítico cubierto. NO perseguir % global de cobertura.

---

## 🛠 TECH STACK

- Tests: **vitest** (config en `vitest.config.ts`, tests existentes en `src/__tests__/` como referencia de estilo)
- Mocks: `vi.mock('@/db')`, `vi.mock('resend')`, mock de `stripe` (para firma del webhook: generar la firma con `stripe.webhooks.generateTestHeaderString()` o mockear `constructEvent`)
- Rate limit: `@upstash/ratelimit` + `@upstash/redis` (ya instalados, patrón en `src/proxy.ts`)
- NO instalar dependencias nuevas salvo que sea imprescindible (justificar en el reporte)

---

## ⚙️ SETUP

1. Repo: `C:\Users\vitor\.gemini\antigravity\playground\technova` — rama `main`
2. Housekeeping git del Entregable 0 (lock + baseline + commit + push)
3. `.env` local tiene llaves TEST de Stripe (cuenta vieja) — correcto para dev; los tests NO deben necesitar env vars reales (mockear todo)
4. El repo usa **CRLF** — no convertir line endings masivamente

---

## ✅ CHECKLIST QA

- [ ] `npx tsc --noEmit` limpio
- [ ] `npx vitest run` — 100% verde (los 7 suites existentes + los 6 nuevos)
- [ ] `npm run build` (o `npx next build`) compila sin errores
- [ ] Manual: `POST /api/leads` con payload válido sigue funcionando en dev (`npm run dev`)
- [ ] Manual: 25 requests rápidos a `GET /api/checkout/<uuid-falso>` → los últimos responden 429
- [ ] Manual: `GET /api/checkout/<uuid-falso>` y `GET /api/proposals/<uuid-falso>/pdf` → 404 con cuerpo idéntico genérico
- [ ] El webhook NO está rate-limited (revisar matcher + código, no solo asumir)

---

## 📚 REFERENCIAS

- `src/proxy.ts` — patrón de limiters, gate admin (SEC-1), constant-time compare
- `src/lib/cron-auth.ts` — helper SEC-2 (referencia de estilo fail-closed)
- `src/__tests__/*.test.ts` — convención de tests existente
- `BACKLOG_MASTER.md` § "SEC: SPRINT DE HARDENING" — contexto completo del sprint
- `DECISION_LOG.md` D-029 — por qué este sprint bloquea Fase B
- `reports/REPORT_TEMPLATE.md` — formato del reporte (OBLIGATORIO)
- `reports/AGENT_REPORTING_GUIDE.md` — guía de reporte

---

## 🏁 DEFINITION OF DONE

- [ ] Entregable 0: index.lock resuelto, baseline verde, commit SEC-1/SEC-2+docs pusheado
- [ ] Limiter `rl:uuid` 20/min activo en todos los endpoints por-UUID listados; webhook excluido con comentario
- [ ] 404 uniformes en endpoints públicos por-UUID (sin information leakage)
- [ ] Aleatoriedad de UUIDs verificada y documentada (o corregida)
- [ ] 6 archivos de test nuevos, todos verdes, sin red ni DB real
- [ ] tsc + vitest + build limpios
- [ ] Commit final separado: `security(SEC-4,SEC-5): anti-enumeración + tests del flujo de pago` + push a `origin/main`
- [ ] Reporte generado en `reports/` (ver siguiente sección)
- [ ] BACKLOG_MASTER.md: SEC-4 y SEC-5 actualizados a "🔄 EJECUTADO — pendiente verificación Cowork" (NO marcar ✅ — eso lo hace Cowork al verificar, regla D-030)

---

## 📊 CÓMO REPORTAR

**OBLIGATORIO antes de terminar:** crear `reports/SEC-4_5_HARDENING_REPORT.md` usando `reports/REPORT_TEMPLATE.md`. Debe incluir:

1. Resumen ejecutivo (3-4 líneas)
2. Tabla de entregables con status real de cada uno
3. Salida completa de `npx vitest run` (pegada)
4. Hallazgo de la verificación de UUIDs (SEC-4c)
5. Hashes y mensajes de los commits realizados (incluido el del Entregable 0)
6. Desviaciones del prompt, si las hubo, con justificación
7. Pendientes que detectes para el sprint SEC (alimenta la verificación de Cowork)

---

## 💡 TIPS & GOTCHAS

- **`src/proxy.ts` es middleware Edge** — solo APIs Edge-compatible (nada de `fs`, `crypto` de Node está parcialmente disponible; el patrón actual ya es compatible, mantenerlo).
- **Orden en `proxy()`:** gate admin PRIMERO, luego rate limit. No reordenar.
- **El matcher de Next no soporta regex complejos** — usar `'/api/checkout/:path*'` y discriminar por path exacto dentro de la función (excluir `/api/checkout/webhook` por comparación de string).
- **Webhook Stripe:** la verificación de firma usa el body RAW — si tocas algo del webhook en tests, no uses `request.json()` antes de `constructEvent`.
- **Tests del proxy:** `proxy()` recibe `NextRequest` — se puede construir con `new NextRequest('http://localhost/api/...', { headers })` en vitest. Mockear `@upstash/ratelimit` ANTES de importar el módulo (usar `vi.hoisted` o factory en `vi.mock`).
- **No tocar lógica de negocio** (precios, emails, estados de orden) — este prompt es solo hardening + tests.
- **CRLF:** el repo está en CRLF; si tu editor/escritura genera LF, git lo normaliza por `.gitattributes` — no hacer commits masivos de line endings.
- Si encuentras un bug real de seguridad adicional durante el trabajo: NO lo arregles silenciosamente — repórtalo en la sección de pendientes del reporte para que Cowork lo planifique.

---

**Creado por:** Claude Cowork (Arquitecto) — 2026-06-12
**Sistema:** D-030 (CLAUDE.md § Sistema Operativo de Trabajo)
**Verificará:** Cowork, contra este Definition of Done, al leer el reporte
