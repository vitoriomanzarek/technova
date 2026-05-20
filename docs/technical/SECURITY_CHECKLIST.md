# 🔐 Security Checklist — TechNova

> **Audiencia:** quien necesite saber qué está protegido, qué no, y cómo cerrar gaps.
> **Última verificación:** 2026-05-20.
> **Convención de status:**
> - ✅ = cubierto (en código o config)
> - ⚠️ = parcial / a mejorar
> - 🔜 = pendiente (planeado pero no implementado)
> - ❌ = ausente / riesgo activo

---

## 📋 Tabla de Contenidos

1. [Input Validation (Zod)](#1-input-validation-zod)
2. [CORS](#2-cors)
3. [CSRF](#3-csrf)
4. [Rate Limiting](#4-rate-limiting)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [HTTPS & TLS](#6-https--tls)
7. [Database Security](#7-database-security)
8. [Secrets & Environment Variables](#8-secrets--environment-variables)
9. [Logging & Audit Trail](#9-logging--audit-trail)
10. [Stripe Security](#10-stripe-security)
11. [Third-Party Dependencies](#11-third-party-dependencies)
12. [Data Privacy (GDPR/LFPDPPP)](#12-data-privacy-gdprlfpdppp)

---

## 1. Input Validation (Zod)

- ✅ **`POST /api/leads`** valida body con `leadSchema` ([`src/app/api/leads/route.ts`](../../src/app/api/leads/route.ts)):
  ```ts
  z.object({
    email: z.string().email('Email inválido'),
    name: z.string().min(1).max(255).optional(),
    phone: z.string().min(1).max(20).optional(),
    project_type: z.string().min(1).max(255).optional(),
  })
  ```
- ✅ **`POST /api/checkout`** valida con `checkoutSchema`:
  ```ts
  z.object({
    email: z.string().email(),
    amount_mxn: z.number().int().positive().max(1_000_000), // cap defensivo
    description: z.string().min(1).max(500),
    plan: z.enum(['START', 'GROWTH', 'SCALE', 'custom']).optional(),
  })
  ```
- ✅ **Comportamiento ante validación fallida:** 400 + `issues` (no se ejecuta lógica downstream, no se toca DB).
- ⚠️ **Mejoras pendientes:**
  - Validar formato MX de `phone` (regex `+52 …` o E.164).
  - Whitelist de dominios de email empresariales si queremos filtrar spam.
- 🔜 **Regla de oro:** **todo endpoint que acepta body** (POST/PUT/PATCH) debe validar con Zod antes de tocar DB o servicios externos. Cuando añadas uno nuevo, esta regla NO es opcional.

---

## 2. CORS

- ✅ **Default Next.js**: las API routes en `src/app/api/**/route.ts` solo aceptan requests del mismo origen (Next.js no añade headers `Access-Control-Allow-Origin: *` por default).
- ✅ **Stripe webhook** es server-to-server (no requiere CORS — Stripe envía POST con su header de firma).
- 🔜 **Si en el futuro necesitamos CORS abierto** (app móvil, integración B2B, widgets embebibles):
  - Documentar la lista de orígenes permitidos en este checklist.
  - Implementar via middleware (`src/middleware.ts`) con header `Access-Control-Allow-Origin: <origen>`.
  - Nunca usar `*` con credentials.

---

## 3. CSRF

CSRF es relevante cuando un endpoint **muta estado** y la autenticación es por **cookie** (porque otros sitios pueden disparar la request con la cookie del usuario).

- ✅ **`POST /api/checkout/webhook`** verifica firma HMAC vía `stripe.webhooks.constructEvent(body, signature, secret)`. Sin firma válida → 400. Esto neutraliza CSRF para este endpoint.
- ✅ **`POST /api/leads`** y **`POST /api/checkout`** son endpoints públicos sin auth por cookie — un atacante CSRF no gana nada porque cualquiera puede llamarlos directamente. **Pero** sí pueden ser abusados (ver §4 Rate Limiting).
- 🔜 **Cuando añadamos formularios con auth** (área de cliente):
  - Usar el patrón estándar de Next.js: token CSRF en cookie + header `X-CSRF-Token` que el frontend debe enviar.
  - Verificar en cada handler que muta estado.

---

## 4. Rate Limiting

- ❌ **NO implementado** en ningún endpoint actual.
- **Impacto del gap:**
  - `/api/leads`: atacante puede crear miles de leads (basura en DB, consumir quota de Resend).
  - `/api/checkout`: atacante puede crear miles de Stripe Sessions (no cuesta dinero pero infla métricas y enmascara fraude real).
- 🔜 **Plan Fase 4 (CRÍTICO antes de tráfico significativo):**
  - **Vercel Edge Middleware** con KV store: rate limit por IP (ej. 5 req/min en `/api/leads`, 3 req/min en `/api/checkout`).
  - Alternativa: **Upstash Rate Limit** (Redis serverless, integración nativa con Vercel).
  - Stub:
    ```ts
    // src/middleware.ts (NO IMPLEMENTADO)
    import { NextResponse } from 'next/server';
    import { Ratelimit } from '@upstash/ratelimit';
    import { Redis } from '@upstash/redis';

    const ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, '1 m'),
    });

    export async function middleware(request: Request) {
      const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
      return NextResponse.next();
    }

    export const config = {
      matcher: ['/api/leads', '/api/checkout'],
    };
    ```
- **Hasta entonces, mitigación manual:** monitorear logs de Vercel y Stripe; si vemos abuso, bloquear IPs via Vercel firewall.

---

## 5. Authentication & Authorization

- ❌ **NO hay auth en el MVP.** Todas las páginas y endpoints son públicos.
- **Decisión documentada:** D-008 en [`DECISION_LOG.md`](../../DECISION_LOG.md) — MVP sin auth, Auth0 en Fase 2 cuando lancemos área de cliente.
- 🔜 **Plan cuando se añada `/cliente/orders/[id]`** (cliente ve su orden):
  - **Auth0** (Universal Login) → JWT en cookie HttpOnly + Secure.
  - Middleware que valide token en rutas protegidas (`/cliente/**`).
  - Roles: `customer`, `admin`.
  - MFA opcional (recomendado para admin).
- 🔜 **Para admin** (Vic):
  - Considerar SSO con Google Workspace si vamos para allá.
  - Nunca passwords planos en DB — si pasa, hash con `bcrypt` o `argon2id` (Auth0 lo maneja, no reimplementar).

---

## 6. HTTPS & TLS

- ✅ **`https://tech-nova.mx`** sirve sobre TLS — certificado emitido y rotado automáticamente por Vercel (Let's Encrypt).
- ✅ **HTTP → HTTPS** redirect automático (Vercel default).
- ✅ **HSTS header** añadido por Vercel: `Strict-Transport-Security: max-age=63072000`.
- ⚠️ **Headers de seguridad adicionales** (deberíamos añadir explícitamente en `next.config.ts` o `src/middleware.ts`):
  ```ts
  // Sugerido (NO implementado todavía):
  const securityHeaders = [
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy', value: "default-src 'self'; ..." }, // requiere análisis
  ];
  ```
- 🔜 **CSP (Content Security Policy)** — requiere análisis porque cargamos scripts externos (GTM, Meta Pixel, Stripe.js). Tarea para Fase 4.

---

## 7. Database Security

- ✅ **`DATABASE_URL`** vive solo en `.env` local y Vercel Environment Variables (sensitive). Nunca en git.
- ✅ **Drizzle ORM previene SQL injection** por diseño — todas las queries usan parámetros tipados, no interpolación de strings. Ejemplo seguro:
  ```ts
  await db.update(orders).set({ status: 'paid' }).where(eq(orders.id, userId));
  // NUNCA: await db.execute(`UPDATE orders SET status='paid' WHERE id=${userId}`);
  ```
- ✅ **`@neondatabase/serverless`** versión actual: `^1.1.0`. Sin CVE conocidos al 2026-05-20. Validar trimestralmente.
- ✅ **TLS en conexión:** `sslmode=require` está en el `DATABASE_URL` (Neon lo provee así por default).
- ✅ **Backups:** Neon hace PITR (Point-in-Time Recovery) automático últimos 7 días en plan free.
- ⚠️ **Permisos del rol de DB:** hoy usamos el rol `neondb_owner` que tiene full access. Para hardening:
  - Crear rol `app` con permisos mínimos (SELECT/INSERT/UPDATE en `services`, `leads`, `orders`; sin DROP, sin DDL).
  - Usar `app` en producción.
  - Mantener `neondb_owner` solo para migrations.
- 🔜 **Pendiente:** auditoría periódica de columnas con PII para decidir cuáles encriptar a nivel app (ej. `phone`).

---

## 8. Secrets & Environment Variables

- ✅ **Cero secrets en código.** Todos los accesos vía `process.env.X`. Verificable con `grep -rE "sk_test_|sk_live_|whsec_|re_[A-Za-z]" src/` → debe devolver 0 matches.
- ✅ **`.env*` en `.gitignore`** (excepto `.env.example` que está whitelisted).
- ✅ **`.gitattributes`** normaliza EOLs para evitar que linters re-toquen archivos sensibles entre OSes.
- ✅ **GitHub Secret Scanning** activo en el repo (bloqueó un push real el 2026-05-20 con placeholders sospechosos).
- ✅ **Distinción público vs secret en Next.js:**
  - `STRIPE_SECRET_KEY` — server-only, no aparece en bundle JS.
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — público por diseño, OK en bundle.
- ⚠️ **Riesgo activo:** el `.env` local contiene secrets reales (DATABASE_URL, RESEND_API_KEY, STRIPE_*). Si tu máquina se compromete, los secrets también. Mitigación:
  - Mantener `.env` solo con TEST keys cuando sea posible.
  - Encriptar el disco del laptop (FileVault / BitLocker).
  - Rotar periódicamente.
- ✅ **Verificación rápida:** lista de vars que están como `sensitive` en Vercel → ver §2 de [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md).

---

## 9. Logging & Audit Trail

- ✅ **`/api/checkout/webhook`** loggea cada evento procesado (`console.log('[stripe] Order marked paid: …')`) y warnings para fallos/disputes.
- ✅ **`/api/leads` y `/api/checkout`** loggean errores con `console.error('Error capturing lead:', error)`.
- ⚠️ **Falta estructura:** logs hoy son `console.log` plano. Recomendable:
  - Añadir un `requestId` por request (UUID en middleware) para trazar.
  - Timestamps ISO 8601 explícitos.
  - Niveles (debug/info/warn/error) consistentes.
- ⚠️ **PII en logs:** confirmamos que NO logueamos full email ni datos sensibles en mensajes de log. Si llega a ser necesario para debug, hashear primero.
- 🔜 **Sentry (Fase 4):** centralizar exceptions, performance, breadcrumbs. Setup:
  ```bash
  npx @sentry/wizard@latest -i nextjs
  ```
- 🔜 **Audit trail formal** para acciones administrativas (cuando exista admin panel): tabla `audit_logs(user_id, action, target, payload, ip, ts)`.

---

## 10. Stripe Security

- ✅ **Webhook HMAC verificado** en cada request a `/api/checkout/webhook`. Sin firma válida → 400 antes de tocar lógica.
- ✅ **API version pinneada** en código (`'2026-04-22.dahlia'` en [`src/lib/stripe.ts`](../../src/lib/stripe.ts)) — evita sorpresas si Stripe cambia el shape de payloads en el futuro.
- ✅ **`payment_method_types: ['card']`** restringe explícitamente el método (sin OXXO/SPEI activos, sin cripto, sin transferencias). Reduce surface de fraude.
- ✅ **Currency hardcoded a `'mxn'`** — no podemos hacer chargebacks accidentales en USD.
- ✅ **Amount cap defensivo:** `amount_mxn` no puede exceder $1,000,000 MXN (ver Zod schema).
- ⚠️ **Pendiente: re-verificación del monto en el webhook.** Hoy confiamos en que el cliente no manipula el `amount_mxn` que envía. Mitigación: cuando el wizard cotice, guardar la cotización en DB y validar en el webhook que el `amount_total` coincide.
- 🔜 **3D Secure (SCA):** Stripe lo activa automáticamente para tarjetas EU. Para clientes MX no es obligatorio, pero recomendable para transacciones >$5000 MXN. Configurable en Stripe dashboard → Settings → Payments.
- 🔜 **Radar (anti-fraude):** Stripe Radar viene activo por default. Revisar reglas custom cuando volumen lo amerite.

---

## 11. Third-Party Dependencies

### Estado actual

Snapshot al 2026-05-20 ([`package.json`](../../package.json)):

| Categoría | Paquete | Versión | Riesgo |
|-----------|---------|---------|--------|
| Runtime | next | 16.2.4 | bajo (mantenido activamente) |
| Runtime | react / react-dom | 19.2.4 | bajo |
| ORM | drizzle-orm | 0.45.2 | bajo |
| DB driver | @neondatabase/serverless | 1.1.0 | bajo |
| Pagos | stripe | 22.1.1 | bajo (firma SDK oficial) |
| Email | resend | 6.12.2 | bajo (joven pero activo) |
| Validación | zod | 4.4.3 | bajo |
| UI | framer-motion | 12.38.0 | bajo |
| UI | lucide-react | 1.8.0 | bajo |
| Estilos | tailwindcss | 4 | bajo |

### Workflow

- 🔜 **Trimestralmente** correr:
  ```bash
  npm audit
  npm outdated
  ```
  Y crear PR con upgrades de seguridad (`npm audit fix`) + upgrades menores manuales.
- 🔜 **Quarterly review** de:
  - CVEs nuevos en stripe / resend / drizzle (sus changelogs).
  - Major versions de Next.js (vienen con breaking changes — consultar `node_modules/next/dist/docs/`).
- 🔜 **Dependabot** en GitHub puede automatizar parte. Configurar en `.github/dependabot.yml` (no creado todavía).
- ✅ **No usamos paquetes deprecated.** Verificable con `npm list --depth=0`.

---

## 12. Data Privacy (GDPR/LFPDPPP)

LFPDPPP = Ley Federal de Protección de Datos Personales en Posesión de los Particulares (México).

### Datos personales que capturamos

| Tabla | Campo | Propósito | Retención sugerida |
|-------|-------|-----------|--------------------|
| `leads` | `name`, `email`, `phone`, `project_type` | Lead nurturing, contacto comercial | Indefinida hasta opt-out |
| `orders` | `customer_email` | Identificar al pagador, recibos | 5 años (req. fiscal MX) |

### Compliance básico — qué tenemos

- ✅ **Aviso de privacidad** existe en [`src/app/privacidad/page.tsx`](../../src/app/privacidad/page.tsx) (revisar contenido vigente).
- ✅ **Cookies tracking** (GTM, Meta Pixel): cargan con `<Script strategy="afterInteractive">` — el usuario navega antes de que carguen, técnicamente cumple con "consentimiento implícito" en MX. Para EU strict requiere cookie banner.
- ✅ **HTTPS** asegura transmisión.

### Pendiente — riesgo de compliance

- 🔜 **Verificar que `privacidad/page.tsx` lista** lo que realmente capturamos hoy (los campos arriba) y los terceros (Stripe, Resend, Vercel, Neon, Google, Meta).
- 🔜 **Endpoint `DELETE /api/leads` y `DELETE /api/orders`** (right to erasure):
  - Validar identidad del solicitante (email + token enviado por correo).
  - Soft-delete con anonimización: `email='deleted-<id>@anon'`, `phone=null`.
- 🔜 **Endpoint `GET /api/me`** (right to access): devolver todos los datos asociados a un email.
- 🔜 **Política de retención automática:** job que borre/anonimice `leads` con `created_at > 2 años` sin conversión.
- 🔜 **DPA (Data Processing Agreement)** firmado con procesadores: Stripe ✓, Resend ✓, Vercel ✓, Neon ✓. Confirmar que están vigentes.
- 🔜 **Cookie banner** si entramos al mercado EU.

### Si recibes un incidente de privacidad

1. **Documenta** en BITACORA con timestamp, alcance estimado, datos afectados.
2. **Notifica a Vic** (chat directo, no esperar BITACORA).
3. **Bloquea** acceso al sistema afectado (rotar credenciales, revocar tokens).
4. **LFPDPPP MX:** notificar a los titulares **sin demora**. No hay plazo legal fijo pero la jurisprudencia favorece <72 h.
5. **Si involucra >1000 personas o datos sensibles:** considerar notificación al INAI.

---

## Checklist accionable (auditoría rápida)

Cada trimestre, alguien debería poder responder ✅/❌ a estas 10 preguntas:

- [ ] ¿`grep -rE "sk_test_|sk_live_|whsec_|re_[A-Za-z0-9]{15,}" src/` devuelve 0 matches?
- [ ] ¿`npm audit` reporta 0 vulnerabilidades high/critical?
- [ ] ¿Las env vars de Vercel siguen siendo `sensitive` (no `plain` ni `encrypted` por accidente)?
- [ ] ¿Las dependencias mayores (next, stripe, drizzle, resend) están en versión soportada?
- [ ] ¿Existe rate limiting en `/api/leads` y `/api/checkout`?
- [ ] ¿Hay error boundaries en React (ver [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) §1)?
- [ ] ¿El aviso de privacidad menciona todos los procesadores actuales?
- [ ] ¿Las keys de Stripe / Resend / Vercel se rotaron en los últimos 6 meses?
- [ ] ¿Existe un `DELETE` endpoint para que un usuario borre sus datos?
- [ ] ¿Sentry o equivalente alerta de errores 5xx en producción?

Si la respuesta a >3 es ❌, agendar trabajo prioritario.

---

## TODOs para Fase 4

- [ ] Rate limiting (middleware + Upstash).
- [ ] Headers de seguridad explícitos (X-Frame-Options, CSP, etc.) en `next.config.ts`.
- [ ] Sentry integration + alertas Slack.
- [ ] Endpoint DELETE para GDPR/LFPDPPP.
- [ ] Rol de DB `app` con permisos mínimos.
- [ ] Dependabot configurado.
- [ ] Re-verificación de monto en webhook (anti-tampering).
- [ ] Auditoría primer trimestre (responder las 10 preguntas).

---

## Para seguir leyendo

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — gestión de secrets en Vercel.
- [`ERROR_HANDLING_GUIDE.md`](./ERROR_HANDLING_GUIDE.md) — qué logguear y cómo no leakear PII.
- [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) — cómo testear endpoints sin exponer prod.
- Stripe Security: https://stripe.com/docs/security
- Neon Security: https://neon.tech/docs/security
- Vercel Security: https://vercel.com/security

---

**Última actualización:** 2026-05-20
**Próxima revisión:** trimestral (próxima: 2026-08-20) o tras incidente.
