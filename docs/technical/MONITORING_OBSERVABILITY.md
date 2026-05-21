# 📡 Monitoring & Observability — TechNova

> **Audiencia:** quien necesite saber si producción está sana, o dónde mirar cuando algo se rompe.
> **Estado actual:** observability básica vía dashboards de cada proveedor; **Sentry y alertas activas aún NO configuradas**.
> **Última verificación:** 2026-05-20.
>
> **Nota de naming:** este archivo se llama `MONITORING_OBSERVABILITY.md` (sin el `&` del kickoff original). Un `&` en filename rompe shells y URLs — decisión de robustez.

---

## 📋 Tabla de Contenidos

1. [Logging strategy](#1-logging-strategy)
2. [Error tracking con Sentry](#2-error-tracking-con-sentry)
3. [Performance monitoring](#3-performance-monitoring)
4. [Rate limiting observability](#4-rate-limiting-observability)
5. [Database health](#5-database-health)
6. [Health de integraciones terceras](#6-health-de-integraciones-terceras)
7. [Alerting strategy](#7-alerting-strategy)
8. [Debugging checklist en producción](#8-debugging-checklist-en-producción)

---

## 1. Logging strategy

### Estado actual

- Logs vía `console.log` / `console.error` / `console.warn` en route handlers y middleware.
- Vercel captura stdout/stderr de las Functions automáticamente.
- **No hay logging estructurado todavía** (son strings planos).

### Niveles (convención a seguir)

| Nivel | Cuándo | Ejemplo en el código |
|-------|--------|----------------------|
| `error` | Algo falló y requiere atención | `console.error('Error capturing lead:', error)` |
| `warn` | Anomalía recuperable | `console.warn('[stripe] PaymentIntent failed: ...')` |
| `info` / `log` | Evento importante de negocio | `console.log('[stripe] Order marked paid: ...')` |
| `debug` | Solo dev, ruido en prod | evitar en prod |

### Qué loguear en producción

- Entry de endpoints críticos (sin PII completa).
- Validación fallida (Zod issues — útil para detectar abuso o frontend roto).
- Errores de servicios externos (Stripe, Resend, Neon, Upstash).
- Transiciones de estado importantes (orden → paid, lead capturado).

### Qué NO loguear

- Secrets / API keys (ni los primeros chars salvo para debug puntual).
- PII completa (email full → loguear solo el dominio o un hash).
- Tarjetas / datos de pago (no llegan a nuestro server de todos modos).

Detalle en [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) §6 y [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §9.

### Acceso a logs

```bash
# Vía CLI (con VERCEL_TOKEN en .env)
npx vercel logs --follow                                  # tail en vivo
npx vercel logs https://tech-nova.mx/api/leads            # filtrar por path

# Vía dashboard
# vercel.com → proyecto → Deployments → <deploy> → Functions / Runtime Logs
```

### Structured logging (mejora pendiente)

Hoy: `console.log('[stripe] Order marked paid: session=cs_xxx')`.
Objetivo: JSON parseable que Vercel pueda filtrar/agrupar.

```ts
console.log(JSON.stringify({
  level: 'info',
  ts: new Date().toISOString(),
  service: 'api/checkout/webhook',
  event: 'order_paid',
  session_id: session.id,
  request_id: requestId,   // generar en middleware
}));
```

**Deuda registrada:** añadir `request_id` (UUID por request) en middleware + migrar logs críticos a JSON. Bajo esfuerzo, alto valor para debugging.

---

## 2. Error tracking con Sentry

### Por qué (el gap más importante de observability)

Hoy un error 5xx en producción solo existe en los logs de Vercel. **Nadie se entera** hasta que un usuario reporta o alguien abre el dashboard. Sentry resuelve esto:

- Agrupa exceptions por fingerprint (10 idénticos = 1 issue + counter).
- Alertas push (Slack/email) cuando aparece un error nuevo o escala.
- Stack traces legibles con sourcemaps.
- Breadcrumbs (qué pasó antes del error).
- Performance tracing (latencia de endpoints).

### Setup (cuando se implemente en Fase 4)

```bash
npx @sentry/wizard@latest -i nextjs
```

El wizard genera:
- `sentry.client.config.ts` — errores del browser.
- `sentry.server.config.ts` — errores de Server Components / API routes.
- `sentry.edge.config.ts` — errores del middleware (Edge runtime).
- Modifica `next.config.ts` para subir sourcemaps en build.
- Pide crear `SENTRY_AUTH_TOKEN` → añadir a Vercel + GitHub Secrets.

### Configuración recomendada

```ts
// sentry.server.config.ts (sketch)
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,        // 10% de transacciones para performance
  environment: process.env.VERCEL_ENV ?? 'development',
  // Ignorar ruido esperado:
  ignoreErrors: [
    'NEXT_NOT_FOUND',           // 404s normales
    'NEXT_REDIRECT',            // redirects normales
  ],
});
```

### Capturar manualmente en handlers críticos

```ts
import * as Sentry from '@sentry/nextjs';

catch (error) {
  Sentry.captureException(error, { tags: { endpoint: 'checkout' } });
  console.error('Checkout failed:', error);
  return NextResponse.json({ success: false, error: 'Checkout failed' }, { status: 500 });
}
```

### Free tier

5,000 errores/mes + 10K performance units. Suficiente para early stage.

---

## 3. Performance monitoring

### Web Vitals (Next.js built-in)

Next.js reporta Core Web Vitals automáticamente. Para capturarlos:

```ts
// src/app/layout.tsx o un componente cliente
export function reportWebVitals(metric) {
  // enviar a analytics o Sentry
}
```

O activar **Vercel Speed Insights** (1 click en el dashboard, `@vercel/speed-insights` package):
- LCP, FID/INP, CLS por página.
- Tendencias en el tiempo.
- Free tier disponible.

### Targets (de TECHNICAL_ARCHITECTURE / DECISION_LOG)

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- TTL < 2s (D-001)

### API response times

Hoy no medimos latencia de endpoints. Para añadir:

```ts
const start = Date.now();
// ... lógica ...
console.log(JSON.stringify({ event: 'api_timing', path: '/api/checkout', ms: Date.now() - start }));
```

O dejar que Sentry performance tracing lo capture (más limpio).

### Database query performance

Neon console → Monitoring → muestra latencia de queries y slow queries. Ver §5.

---

## 4. Rate limiting observability

Rate limiting está activo vía Upstash (ver [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §4 y `src/middleware.ts`).

### Upstash dashboard

https://console.upstash.com → DB `legible-cattle-130961`:

- **Requests/sec, latencia** del Redis.
- **Data Browser:** ver las keys `rl:leads:*` y `rl:checkout:*` (los counters por IP).
- **Analytics** (activado en el código con `analytics: true`): cuántas requests se permitieron vs bloquearon.

### Qué monitorear

- **Tasa de 429s:** si sube de golpe, o es un ataque (bloquear IP en Vercel firewall) o el límite es muy bajo para tráfico legítimo (subirlo).
- **Comandos Redis/día:** free tier = 10K/día. Cada request rate-limited consume ~2-3 comandos. Si nos acercamos al límite, upgrade o ajustar.

### Headers para debugging

Cada response de `/api/leads` y `/api/checkout` incluye:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: <epoch ms>
```
Útil para que el frontend muestre "te quedan N intentos" o para debug con curl.

---

## 5. Database health

### Neon console

https://console.neon.tech → proyecto TechNova → **Monitoring**:

- **Active connections:** con el driver HTTP serverless deberían ser efímeras (no pool persistente).
- **Query latency:** p50/p95/p99.
- **Slow queries:** queries > umbral aparecen listadas con su SQL.
- **Storage / compute usage:** para no exceder free tier.
- **Branch status:** si una branch (incl. la principal) se suspendió por inactividad (free tier suspende tras ~5 min idle), la primera request la reactiva (cold start ~500ms).

### Qué vigilar

- **Cold starts frecuentes:** si afectan UX, considerar plan que mantenga la DB caliente.
- **Slow queries:** sin índices en `orders.status` ni `orders.stripe_payment_intent_id` todavía (ver DATABASE_SCHEMA §3) — vigilar cuando crezca el volumen.
- **Conexiones colgadas:** no debería pasar con HTTP driver, pero verificar si aparecen.

### Backups

Neon hace PITR automático (últimos 7 días en free tier). Para restaurar: Neon console → Restore → elegir timestamp. **Probar el restore al menos una vez** antes de necesitarlo de verdad.

---

## 6. Health de integraciones terceras

### Stripe

- **Dashboard → Payments:** pagos exitosos vs fallidos.
- **Dashboard → Webhooks → tu endpoint → Recent deliveries:** cada entrega con su status. Si hay 4xx/5xx repetidos, el handler está roto (ver ERROR_HANDLING §4).
- **Dashboard → Radar:** intentos de fraude bloqueados.
- **Status page:** https://status.stripe.com

### Resend

- **Dashboard → Logs:** cada email con status (delivered, bounced, complained).
- **Bounce rate:** si sube, revisar calidad de la lista o config del dominio.
- **Dominio:** verificar que `tech-nova.mx` siga "Verified" (los registros DNS no deben cambiar).
- **Status page:** https://status.resend.com

### Upstash

- Ver §4.
- **Status page:** https://status.upstash.com

### Vercel

- **Dashboard → Activity:** historial de deploys.
- **Dashboard → Observability** (si está activado): requests, errores, latencia agregada.
- **Status page:** https://www.vercel-status.com

---

## 7. Alerting strategy

### Estado actual: sin alertas activas

Hoy nadie recibe notificación automática cuando algo falla. Hay que revisar dashboards manualmente. **Este es el gap a cerrar en Fase 4.**

### Cuándo despertar a Vic (severidad)

| Severidad | Ejemplo | Canal | Respuesta |
|-----------|---------|-------|-----------|
| **S0 — crítico** | Sitio caído, checkout roto, DB inaccesible, secret expuesto | Push inmediato (SMS/llamada) | Ahora |
| **S1 — alto** | Pagos fallando, webhook 5xx en bucle, dispute creado | Slack + email | < 1 h |
| **S2 — medio** | Email delivery bajando, latencia alta, error nuevo en Sentry | Slack | Mismo día |
| **S3 — bajo** | Warning aislado, rate limit ocasional | Log / dashboard | Cuando se pueda |

### Canales (a configurar)

- **Slack webhook:** crear un canal `#technova-alerts`, Sentry y un cron de health-check postean ahí.
- **Email:** Sentry puede mandar a victorsm2893@gmail.com.
- **SMS** (solo S0): vía Twilio o el sistema de alertas de un uptime monitor (ej. BetterUptime, UptimeRobot).

### Health check externo (recomendado)

Un servicio externo (UptimeRobot free, BetterUptime) que pingee `https://tech-nova.mx/` cada 5 min y alerte si cae. Independiente de Vercel/Sentry — si todo Vercel cae, igual te enteras.

### Escalation (futuro, cuando haya equipo)

Hoy Vic es el único on-call. Cuando haya 2+ devs: rotación on-call, escalation si no se ataca en X min.

---

## 8. Debugging checklist en producción

### "La API devuelve 500"

1. `npx vercel logs --follow` o dashboard → Functions → busca el `console.error`.
2. Identifica si es: DB caída (§5), servicio externo (§6), o bug nuestro.
3. Si es bug: branch fix → preview → validar → merge. Si es externo: ver status pages.
4. Cuando haya Sentry: el stack trace ya estará agrupado ahí con breadcrumbs.

### "Los leads no llegan"

1. `POST /api/leads` con curl → ¿devuelve 200 con `emailSent`?
2. Si 200 pero sin email: revisar Resend Logs (§6) — ¿bounce? ¿dominio des-verificado?
3. Si 400: el frontend manda body mal formado — revisar `LeadMagnetSection`.
4. Si 429: rate limit — ¿tráfico legítimo o ataque? (§4)
5. Verificar en Neon: `SELECT * FROM leads ORDER BY id DESC LIMIT 5;` — ¿se están insertando?

### "Un pago no se registró"

1. Stripe dashboard → Payments → ¿aparece el pago como succeeded?
2. Stripe dashboard → Webhooks → ¿se entregó `checkout.session.completed` con 200?
3. Si el webhook falló (4xx/5xx): ver ERROR_HANDLING §4 (retry schedule). Reenviar manualmente desde Stripe.
4. Neon: `SELECT * FROM orders WHERE stripe_session_id='cs_xxx';` — ¿status='paid'?

### "Un deploy falló"

1. Vercel dashboard → Deployments → el que está en "Error" → Build Logs.
2. Causa típica: type error (correr `npx tsc --noEmit` local) o env var faltante.
3. Ver DEPLOYMENT_GUIDE §8 (troubleshooting de los errores reales que ya tuvimos).

### "El email no se envía"

1. Resend Logs (§6) — ¿el envío aparece? ¿qué status?
2. Verificar `RESEND_API_KEY` y `RESEND_FROM_EMAIL` en Vercel.
3. Verificar dominio `tech-nova.mx` sigue Verified en Resend.
4. Recordar: desde el fix de email-decouple, un fallo de Resend NO rompe la captura del lead (devuelve `emailSent: false`). Revisar logs por `[resend] Welcome email failed`.

---

## Resumen de gaps de observability (para Fase 4)

| Gap | Prioridad | Esfuerzo |
|-----|-----------|----------|
| Sentry (error tracking + alertas) | 🔴 alta | ~30 min wizard + tuning |
| Health check externo (UptimeRobot) | 🟡 media | ~15 min |
| Slack `#technova-alerts` webhook | 🟡 media | ~20 min |
| Structured logging + request_id | 🟢 baja | ~1 h |
| Vercel Speed Insights | 🟢 baja | 1 click |
| API timing logs | 🟢 baja | ~30 min |

---

## Para seguir leyendo

- [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) — qué hacer cuando un error ocurre.
- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — logs de Vercel, troubleshooting de deploys.
- [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §9 — logging sin leakear PII.
- [`CI_CD_PIPELINE.md`](./CI_CD_PIPELINE.md) — monitoreo post-deploy.

---

**Última actualización:** 2026-05-20
**Próxima revisión:** al integrar Sentry o configurar el primer canal de alertas.
