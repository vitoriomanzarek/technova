# 🚀 Deployment Guide — TechNova

> **Audiencia:** quien tenga que shipear, debuggear un deploy roto, o configurar nuevas env vars.
> **Objetivo:** que el proceso de ir de `git push` a `https://tech-nova.mx` sea predecible y reversible.
> **Última verificación:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Arquitectura de Deploy](#arquitectura-de-deploy)
2. [Environment Variables](#environment-variables)
3. [Secrets Management](#secrets-management)
4. [Preview Deployments](#preview-deployments)
5. [Verificación post-deploy](#verificación-post-deploy)
6. [Rollback Procedure](#rollback-procedure)
7. [Monitoring & Alerts](#monitoring--alerts)
8. [Troubleshooting de deploys reales](#troubleshooting-de-deploys-reales)
9. [Anexo: Vercel CLI / API](#anexo-vercel-cli--api)

---

## Arquitectura de Deploy

```
                  ┌─────────────┐
                  │  Dev local  │
                  │ (Cursor /   │
                  │  Claude)    │
                  └──────┬──────┘
                         │ git push origin <branch>
                         ▼
                  ┌─────────────┐
                  │   GitHub    │
                  │ vitoriomanz │
                  │ arek/technova│
                  └──────┬──────┘
                         │ webhook
                         ▼
                  ┌─────────────────────┐
                  │      Vercel         │
                  │  prj_TIPXMWs78…     │
                  │  team_AiOzzfX4Ji…   │
                  └──────┬──────────────┘
                         │
            ┌────────────┴─────────────┐
            ▼                          ▼
   ┌─────────────────┐       ┌──────────────────────┐
   │  Production     │       │  Preview deployment  │
   │  (push a main)  │       │   (push a otra branch)│
   │  tech-nova.mx   │       │  technova-next-      │
   │                 │       │   <hash>.vercel.app   │
   └─────────────────┘       └──────────────────────┘
```

### Provider y proyecto

- **Hosting:** Vercel.
- **Project ID:** `prj_TIPXMWs783BkRFQRMZQCxRGvnVuJ`
- **Team ID:** `team_AiOzzfX4JiMUdVofOQvrlARW`
- **Dominios verificados:**
  - `tech-nova.mx` (raíz, production)
  - `www.tech-nova.mx` (alias)
  - `technova-next.vercel.app` (default, sirve como fallback)
- **GitHub repo:** https://github.com/vitoriomanzarek/technova
- **Production branch:** `main`. Cualquier push a `main` triggea production deploy automático.
- **Preview branches:** cualquier branch que no sea `main` recibe preview deployment al hacer push.

### Stack del build

1. Vercel clona el repo en el commit pushado.
2. Detecta `next.config.ts` → "Next.js 16.2.4".
3. Corre `npm install` (rápido — usa lockfile cacheado entre builds).
4. Corre `npm run build` → `next build` (Turbopack default en 16).
5. Si build success: promueve el deployment a "Production" en el alias `tech-nova.mx`.
6. Si build error: notifica en dashboard, mantiene el deployment anterior vivo.

**Tiempo típico de deploy:** 1-3 min para builds incrementales (cache caliente), 3-6 min para builds fríos.

---

## Environment Variables

### Tres scopes en Vercel

| Scope | Cuándo aplica | Dónde se ve |
|-------|---------------|-------------|
| **Production** | deploy desde `main` | `tech-nova.mx` |
| **Preview** | deploy desde cualquier otra branch | `*.vercel.app` URLs efímeras |
| **Development** | cuando alguien corre `vercel dev` (CLI) | Solo si usas Vercel CLI localmente |

> **⚠️ Sutileza importante:** `npm run dev` **NO** lee env vars de Vercel. Lee `.env` local. Si tu var está en Vercel pero no en `.env`, `npm run dev` no la tendrá.

### Tres tipos de var en Vercel

| Tipo | Visible para… | Cuándo usar |
|------|---------------|-------------|
| **Plain** | cualquiera con acceso al proyecto | Solo para valores no sensibles (URLs públicas, flags) |
| **Encrypted** | el dueño del proyecto, encriptada en disco | Por default para vars normales |
| **Sensitive** | nadie puede ver el valor después de guardarlo (ni admin), solo rotarlo | Para secrets reales (API keys, DB passwords) |

> ⚠️ **Restricción:** Vercel **no permite** `Sensitive` en el scope `Development`. Si quieres una var como sensitive en prod/preview pero accesible localmente vía `vercel dev`, créala dos veces: `sensitive` para production+preview, `encrypted` para development.

### Inventario actual (production)

| Var | Tipo | Uso |
|-----|------|-----|
| `DATABASE_URL` | sensitive | Neon Postgres connection (pooled) |
| `DATABASE_URL_UNPOOLED` | sensitive | Neon direct connection (para migrations) |
| `RESEND_API_KEY` | sensitive | Email API |
| `RESEND_FROM_EMAIL` | sensitive | Remitente: `TechNova <noreply@tech-nova.mx>` |
| `STRIPE_SECRET_KEY` | sensitive | Server-side Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | sensitive | Cliente Stripe (público OK porque es publishable) |
| `STRIPE_WEBHOOK_SECRET` | sensitive | Verificar firma HMAC de webhooks |
| `NEXT_PUBLIC_BASE_URL` | sensitive | URL absoluta para `success_url` / `cancel_url` de Stripe |
| `POSTGRES_*`, `PGHOST*`, `NEON_*` | sensitive | Auto-creadas por la integración Vercel↔Neon (no tocar) |

### Workflow al añadir una nueva env var

1. **`.env.example`** — añade la nueva línea con un placeholder neutro (ver §Secrets).
2. **`.env` local** — pon el valor real para tu dev.
3. **Vercel dashboard** o vía API/CLI — añade en `production`, `preview` y `development` (este último solo si la app la necesita en dev local con `vercel dev`).
4. **Redeploy** — Vercel no aplica env vars retroactivamente. Para que un deploy existente las tome, hay que disparar uno nuevo:
   - Push trivial a `main`, o
   - Dashboard → último deployment → menú → "Redeploy".

### `NEXT_PUBLIC_*` — cuidado

Cualquier var que empiece con `NEXT_PUBLIC_` se **incrusta en el bundle JS** que se envía al browser. Está OK para keys públicas (publishable de Stripe, GTM ID, etc.), pero **nunca** para secrets.

```
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  (publishable = pública por diseño)
✅ NEXT_PUBLIC_BASE_URL                 (URL pública)
❌ NEXT_PUBLIC_STRIPE_SECRET_KEY        (filtraría el secret a todo el internet)
❌ NEXT_PUBLIC_DATABASE_URL             (idem)
```

Regla mnemotécnica: si lo puedes inspeccionar abriendo "View Source" en Chrome, NO debe ser secret.

---

## Secrets Management

### Reglas

1. **Cero secrets en git.** El `.gitignore` ya bloquea `.env*` (salvo `.env.example`). No los pegues en docs ni en commits.
2. **Cero secrets en chat público.** Eso incluye Slack, screenshots, transcripts de Claude/Cursor.
3. **Cero secrets en código.** Siempre `process.env.X`, nunca el valor literal.
4. **`.env` local cubre dev.** Pídele a Vic las credenciales una sola vez al onboardearte (ver [`ONBOARDING_DEVELOPER.md`](./ONBOARDING_DEVELOPER.md) §3).
5. **Si filtras un secret por error:** rotación inmediata. No esperes a "después".

### Rotación sin downtime

El procedimiento estándar para rotar una key sin caída del servicio:

1. **Genera la NUEVA key** en el dashboard del provider (Stripe, Resend, Neon, etc.). El provider devuelve la nueva inmediatamente; la vieja sigue activa.
2. **Actualiza en Vercel** la env var con el nuevo valor (production + preview + development).
3. **Trigger redeploy** (Vercel no aplica retroactivo).
4. **Valida que el nuevo deploy funciona** con el checklist post-deploy (§5).
5. **Recién entonces** revoca/rota la vieja en el dashboard del provider.

> **Nota Stripe:** `Roll secret key` en Stripe revoca la vieja **inmediatamente**. Para evitar caída, primero crea la nueva (en Stripe puedes tener varias activas), actualízala en Vercel, redeploy, valida, y entonces revoca la vieja.

### Qué hacer si Claude (o cualquiera) ve un secret

- Documentar en BITACORA con timestamp.
- Rotar en el provider.
- Si está en historia de Git → considera `git filter-repo` para reescribir, o aceptar el riesgo y rotar (más simple en la mayoría de casos).

---

## Preview Deployments

Cada push a una branch no-`main` genera una preview deployment automática:

- URL: `technova-next-<hash>-vitoriomanzareks-projects.vercel.app`
- Misma config de build que production.
- **Env vars del scope `Preview`** (puede ser distintas a production — útil para tener keys de Stripe TEST en preview y LIVE en production, por ejemplo).
- Visible solo con autenticación de Vercel (a menos que cambies "Deployment Protection" en project settings).

### Cómo verificar una preview antes de mergear

1. PR en GitHub → comentario automático de Vercel con la preview URL.
2. Abre la URL → valida visualmente el cambio.
3. Si tocaste API o env vars: corre los smoke tests del §5 contra la preview URL en vez de tech-nova.mx.
4. Aprueba PR → merge a `main` → Vercel detecta y deploya a production.

### Cuándo preview ≠ production

- Preview suele tener env vars de **TEST** (Stripe test mode, Resend dominio testing).
- Production tiene env vars **LIVE** (cuando aplique).
- Hoy ambos usan TEST porque Stripe aún no está en LIVE — cuando se active LIVE, separar.

---

## Verificación post-deploy

Cada vez que merges algo a `main` y Vercel termina el deploy, corre este checklist (toma ~30 seg):

```bash
# 1. Health check del sitio
curl -I https://tech-nova.mx/
# Esperado: HTTP/2 200

# 2. Lead capture: valida zod (sin body = 400, no 500)
curl -s -X POST https://tech-nova.mx/api/leads \
  -H "Content-Type: application/json" -d '{}' | head -c 200
# Esperado: {"success":false,"error":"Invalid input","issues":[...]}

# 3. Checkout: valida zod
curl -s -X POST https://tech-nova.mx/api/checkout \
  -H "Content-Type: application/json" -d '{}' | head -c 200
# Esperado: {"success":false,"error":"Invalid input","issues":[...]}

# 4. Webhook: GET debe ser 405 (existe, solo POST)
curl -s -o /dev/null -w "%{http_code}\n" \
  https://tech-nova.mx/api/checkout/webhook
# Esperado: 405

# 5. Páginas de redirect post-pago
curl -s -o /dev/null -w "%{http_code}\n" https://tech-nova.mx/checkout/success
curl -s -o /dev/null -w "%{http_code}\n" https://tech-nova.mx/checkout/cancel
# Esperado: 200 y 200
```

Verificaciones extras desde el dashboard:

- **Vercel Status:** dashboard → último deployment debe estar en "Ready" (verde). Si está en "Building" o "Queued", espera; si está en "Error", ver §8.
- **Stripe Webhooks:** dashboard.stripe.com → Webhooks → tu endpoint → "Recent deliveries" — el último evento entregado debe ser 2xx (200 o 201).
- **Resend Logs** (cuando dispares un email de prueba): dashboard.resend.com → Logs → último envío debe ser "delivered".

---

## Rollback Procedure

### Opción A: revert vía Git (recomendada)

Cuando un deploy rompe producción y ya está en `main`:

```bash
# 1. Identifica el commit que rompió
git log --oneline -10

# 2. Revert (crea un commit que deshace los cambios)
git revert <sha>

# 3. Push
git push origin main

# 4. Vercel detecta, deploya el revert (~2 min)

# 5. Valida con el checklist §5
```

Beneficio: queda en historia que pasó. El siguiente intento puede partir del estado actual sin perder contexto.

### Opción B: rollback vía Vercel dashboard

Más rápido si necesitas estabilizar **YA** (sin esperar el ciclo de revert + build):

1. Vercel dashboard → tu proyecto → **Deployments** tab.
2. Encuentra el último deployment marcado "Production" que estaba sano.
3. Click el menú (⋯) → **Promote to Production**.
4. Vercel apunta el alias `tech-nova.mx` a ese deployment sin rebuild (es instantáneo).
5. Después, en frío: investiga el bug, fix, deploy normal.

> ⚠️ Importante: la opción B **NO** reescribe `main`. El código en git sigue roto hasta que mergees un fix o un revert.

### Si el rollback no es suficiente

Si revertir el commit no arregla (porque el bug está en migration de DB, integración externa, etc.):

1. Crea branch nueva con el fix mínimo (`fix/<descripción>`).
2. Validar en preview deployment.
3. Mergea a main → deploy.

---

## Monitoring & Alerts

### Hoy (MVP)

- **Vercel Activity Log:** dashboard → Activity → revisar después de cada deploy.
- **Stripe Webhooks Log:** dashboard.stripe.com → Webhooks → tu endpoint → "Recent deliveries". Si un evento devuelve 4xx/5xx, Stripe reintenta cada 5 min hasta 3 días.
- **Resend Email Log:** dashboard.resend.com → Logs. Filtra por status.
- **Neon Console:** console.neon.tech → tu proyecto → Monitoring → query stats, conexiones activas.

### Pendiente Fase 4 (alertas activas)

- **Sentry** para centralizar errores runtime (5xx, exceptions no manejadas).
- **Slack webhook** para alertas críticas (chargebacks, fallos de pago, dominios sin renovar).
- **Vercel Analytics** (built-in, requiere activarlo) para Web Vitals.

---

## Troubleshooting de deploys reales

Esta sección documenta los problemas reales que ocurrieron en deploys anteriores, con su fix exacto.

### "Build falló: Cannot find module 'stripe'"

**Causa real (2026-05-20):** se hizo `npm install stripe` en un worktree distinto al que se commitea, y `package-lock.json` no se sincronizó.
**Fix:** correr `npm install <paquete>` en el root del repo o en el worktree desde el que se commitea. Verifica que `package-lock.json` queda staged junto a `package.json`.

### "Type error: Type '\"2026-X.dahlia\"' is not assignable to type '\"2026-Y.dahlia\"'"

**Causa real (2026-05-20):** el SDK Stripe pinea sus tipos a una `apiVersion` específica; si pasas otra string literal, TS la rechaza aunque Stripe en runtime sea backward-compatible.
**Fix:** alinear el string en `src/lib/stripe.ts` al que reclama el SDK. Verificar con `npx tsc --noEmit` antes de pushar.

### "Cannot find name 'children'" en componentes layout

**Causa real (2026-05-20):** quedaron 2 componentes legacy del Pages Router (`Layout.tsx`, `AdLandingLayout.tsx`) que usaban `{children}` sin tipar el prop. Pasaban silenciosamente porque ningún archivo los importaba en local, pero el TypeChecker de Next 16 los recorre completos.
**Fix:** si el componente legacy no lo importa nadie (`grep -r "from.*Layout"`), bórralo. Si está en uso, tipa el prop: `({ children }: { children: React.ReactNode })`.

### "push declined due to repository rule violations" (GitHub Secret Scanning)

**Causa real (2026-05-20):** `.env.example` tenía placeholders tipo `sk_test_xxxxxxxxxxxxxxxxxxxxxxxx`. GitHub Secret Scanning los detecta como Stripe keys aunque sean placeholders.
**Fix:**
- **Inmediato:** abrir el URL que da GitHub (`security/secret-scanning/unblock-secret/...`), marcar "False positive", aprobar.
- **Definitivo:** cambiar placeholders a strings que NO matcheen patrones de secrets, ej. `PEGA_TU_KEY_AQUI`. Ver [`.env.example`](../../.env.example) para el formato canónico.

### "Build succeeded but tech-nova.mx returns 500"

Causas comunes y orden de chequeo:

1. **Env var faltante en Vercel.** Sucede cuando añades una var nueva en `.env` local pero olvidas subirla a Vercel. Ver Vercel → Project → Settings → Environment Variables → confirma que está en `production`.
2. **Migration pendiente.** Si añadiste una columna en `src/db/schema.ts` pero no corriste `npx drizzle-kit push`, los inserts fallan en runtime.
3. **Servicio externo caído.** Verifica https://status.neon.tech, https://status.stripe.com, https://status.resend.com.

### "El webhook de Stripe devuelve 400 todo el tiempo"

1. Verifica `STRIPE_WEBHOOK_SECRET` en Vercel = el `whsec_...` del destination en Stripe dashboard.
2. Si lo cambiaste recientemente, redeploy para que tome el nuevo valor.
3. El handler usa `request.text()` para el raw body — confirma que sigue así en `src/app/api/checkout/webhook/route.ts`. Si alguien lo cambió a `request.json()`, la firma falla.

---

## Anexo: Vercel CLI / API

### Cuándo necesitas el CLI

Casos donde la UI dashboard es lenta o no escala:

- Añadir 5+ env vars de una vez.
- Inspeccionar deployment logs sin abrir el browser.
- Trigger un redeploy programático.

### Setup

```bash
# Una vez
npm install -g vercel
vercel login

# O sin instalar global:
npx vercel <comando>
```

### Comandos útiles

```bash
# Listar proyectos del team
npx vercel projects ls

# Listar env vars
npx vercel env ls

# Añadir env var (interactivo)
npx vercel env add MI_VAR production

# Trigger redeploy del último production
npx vercel --prod

# Ver logs de un deployment
npx vercel logs <deployment-url>

# Promote un deployment a production (rollback rápido)
npx vercel promote <deployment-url>
```

### Vía API REST (cuando ni CLI ayuda)

Endpoint base: `https://api.vercel.com/`. Auth con header `Authorization: Bearer <VERCEL_TOKEN>`.

Útil para scripts y para agentes IA (como Claude Code) que necesitan operar sobre Vercel sin abrir browser. Documentación: https://vercel.com/docs/rest-api.

> **Cuidado:** el `VERCEL_TOKEN` da acceso completo a tu cuenta. Mejor crearlo con scope al proyecto cuando sea posible, y rotarlo periódicamente.

---

## TODOs para Fase 4

- [ ] **CI/CD pipeline** en GitHub Actions: lint + typecheck + tests + build verification antes de mergear.
- [ ] **Preview deployment health checks** automáticos (correr el smoke checklist contra cada preview URL).
- [ ] **Sentry integration** para errores runtime + alertas Slack.
- [ ] **Vercel Analytics** (Web Vitals) activado.
- [ ] **Deployment notifications** a Slack/email cuando production se deploya o falla.
- [ ] **Staging environment** dedicado (Vercel branch deploys cubre parte, pero un alias `staging.tech-nova.mx` permitiría tests más serios).

---

## Para seguir leyendo

- [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) — qué está protegido vs. pendiente.
- [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) — qué hacer cuando algo se rompe en runtime.
- [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) — cómo validar antes de mergear.
- [`ONBOARDING_DEVELOPER.md`](./ONBOARDING_DEVELOPER.md) §8 — versión corta del flujo de deploy.

---

**Última actualización:** 2026-05-20
**Próxima revisión:** cuando se cambie hosting provider, se añada staging environment, o se integre CI/CD.
