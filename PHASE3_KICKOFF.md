# 🔧 PHASE 3 KICKOFF - OPERACIONES Y SEGURIDAD
## Para Claude Code: Documentación de Producción

**Dueño:** Claude Code  
**Autoridad:** Vic (Fundador) - APROBADO  
**Status:** 🔴 VIVO - EJECUTA ESTO AHORA

---

## 🎯 OBJETIVO DE LA FASE

Documentar todo lo necesario para **operar TechNova en producción de forma segura y confiable**. Al final de Fase 3, el equipo de operaciones (o Vic + un segundo dev) podrá:

- ✅ Desplegar cambios sin romper nada
- ✅ Configurar secrets y env vars correctamente
- ✅ Saber cómo responder ante errores en producción
- ✅ Entender qué está asegurado contra ataques comunes
- ✅ Ejecutar tests antes de mergear código

---

## 📋 TAREAS (En Orden)

### TAREA 1: DEPLOYMENT_GUIDE.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Un documento operativo que responda: "¿Cómo se shipea código a producción sin drama?"

**Contenido mínimo:**

1. **Arquitectura de Deploy (visual)**
   - Dev → git push → GitHub → Vercel webhook → Build → Deploy
   - Diferencia entre preview deployments (en PRs) y production (main)
   - Rollback rápido (revert commit en main, repush)

2. **Environment Variables**
   - Cuáles van en `.env.local` (dev only, gitignored)
   - Cuáles van en Vercel Settings → Environment Variables
   - Cuáles son `encrypted` vs `sensitive` vs `plain`
   - Cómo rotarlas sin downtime (actualizar Vercel → wait propagation → validar)
   - Checklist: si agregaste una nueva var, actualizar `.env.example`

3. **Secrets Management**
   - **STRIPE_SECRET_KEY** — nunca en git (es de test/prod, debe estar solo en Vercel)
   - **RESEND_API_KEY** — nunca en git
   - **STRIPE_WEBHOOK_SECRET** — nunca en git
   - **DATABASE_URL** — nunca en git
   - Si necesitas trabajar con secrets en dev: usar `.env.local` (ignorado por git)
   - Rotation procedure: cambiar en Vercel → validar con curl que funciona → después rotar en Stripe/Resend dashboards

4. **Preview Deployments**
   - Cada PR genera una preview URL automática (Vercel)
   - Cómo verificar que la preview funciona antes de mergear
   - Diferencias env vars entre preview y production (production tiene keys reales, preview tiene test keys)

5. **Verificación Post-Deploy**
   - Checklist después de un deploy:
     ```
     1. Vercel → Status page → deployment state = "Ready"
     2. curl -I https://tech-nova.mx/ → 200 OK
     3. POST /api/checkout con body vacío → 400 (zod validation, no 500)
     4. GET /api/checkout/webhook → 405 (existe pero solo POST, correcto)
     5. Stripe Dashboard → Webhooks → última entrega fue 200 (no 400/500)
     ```

6. **Rollback Procedure**
   - Si algo rompe en producción:
     ```bash
     git revert <commit-hash>  # Crea commit de revert
     git push origin main      # Vercel redeploy automático
     Esperar ~2 min build → validar checklist arriba
     ```
   - Si reverting no es suficiente: mergear un fix commit nuevo

7. **Monitoring & Alerts**
   - Vercel dashboard: revisar Activity log si deploy falló
   - Stripe dashboard: revisar webhook delivery logs si hay fallos
   - Resend: revisar email delivery si un email no llegó
   - Próxima sesión (Fase 4): integrar Sentry para errores runtime

8. **Troubleshooting Deploy**
   - Build falló en Vercel:
     - Ver logs en Vercel dashboard
     - Verificar que `npm run build` pasa localmente
     - Revisar TypeScript errors con `npx tsc --noEmit`
   - Deploy succeeded pero app no responde:
     - Check CPU/memory en Vercel (rara vez)
     - Revisar `.env` vars están set en Vercel (comúnmente)
     - Health check: `curl https://tech-nova.mx/api/leads` con body vacío

**Referencia:**
- Lee [`ONBOARDING_DEVELOPER.md` §8](./docs/technical/ONBOARDING_DEVELOPER.md) que ya cubre Vercel basics
- Abre https://vercel.com/docs/deployments/overview
- Revisa actual deploy en https://vercel.com/technova/technova

**Output:** `/docs/technical/DEPLOYMENT_GUIDE.md` (~2,000 palabras, 10 min lectura)

---

### TAREA 2: SECURITY_CHECKLIST.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Documento que asegure: "¿Qué ataques comunes nos protegen?"

**Contenido:**

1. **Input Validation (Zod)**
   - ✅ `/api/leads` valida con `leadSchema` (email requerido, format, length)
   - ✅ `/api/checkout` valida con `checkoutSchema` (email, amount > 0)
   - 🔜 TODO: revisar todos los endpoints que aceptan POST/PUT y asegurar Zod
   - Qué pasa si validation falla: 400 + `issues` array (no ejecuta lógica)

2. **CORS (Cross-Origin Resource Sharing)**
   - ✅ Next.js por default rechaza requests desde otros orígenes
   - ✅ `/api/` endpoints solo aceptan mismo origen (tech-nova.mx)
   - 🔜 Si en futuro necesitamos CORS abierto (ej. mobile app): documentar qué dominios confiar

3. **CSRF (Cross-Site Request Forgery)**
   - ✅ Webhook de Stripe verifica HMAC (firma en `stripe-signature` header)
   - ✅ Sin HMAC válido: 401 Unauthorized
   - 🔜 Si implementamos formularios: asegurar tokens CSRF (Next.js tiene soporte)

4. **Rate Limiting**
   - ❌ **NO IMPLEMENTADO** — endpoints `/api/leads` y `/api/checkout` aceptan infinitos requests
   - 🔜 CRÍTICO PARA PRODUCCIÓN: si recibimos spam/DDoS podemos acabarse Resend/Stripe quota
   - Solución simple: usar Vercel Edge Middleware para rate limit por IP
   - Plan: implementar en Fase 4

5. **Password & Authentication**
   - ❌ **NO TENEMOS AUTH** — sitio público, no requiere login
   - 🔜 Cuando agregamos `/orders/[id]` para clientes revisar estado: requiere Auth0 (Fase Auth0 planeada)
   - Guardrail: nunca guardar passwords en plain text (siempre hash)

6. **HTTPS & TLS**
   - ✅ https://tech-nova.mx (certificado automático via Let's Encrypt + Vercel)
   - ✅ Redirects HTTP → HTTPS automático
   - ✅ HSTS header (Vercel lo añade por default)

7. **Database Security**
   - ✅ `DATABASE_URL` (Neon) nunca en git
   - ✅ Drizzle no interpola queries (type-safe, inmune a SQL injection)
   - 🔜 Validar que `@neondatabase/serverless` driver está actualizado
   - Neon: backups automáticos, punto de recuperación últimas 7 días

8. **Secrets & Environment Variables**
   - ✅ Keys de Stripe, Resend, Neon nunca en `.js` code
   - ✅ Leídas desde `process.env` en runtime
   - ⚠️ **CUIDADO:** `NEXT_PUBLIC_*` aparecen en JS bundles (OK para keys públicas, BAD para secrets)
   - Verificar: `STRIPE_SECRET_KEY` ≠ public (✅), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = public (✅)

9. **Logging & Audit Trail**
   - ✅ `/api/checkout/webhook` logguea eventos importantes (`payment_intent.succeeded`, etc.)
   - 🔜 TODO: agregar timestamps + request ID a todos los logs (para debugging)
   - 🔜 TODO: Sentry o similar para centralizar errores runtime (Fase 4)

10. **Stripe Security**
    - ✅ Webhook HMAC firmado (`stripe-signature` header)
    - ✅ API version pinned en código (`'2026-04-22.dahlia'`)
    - ✅ Usa `payment_method_types: ['card']` (restringe a tarjetas)
    - 🔜 Enable 3D Secure (Stripe dashboard) si operamos en EU o para grandes montos

11. **Third-Party Dependencies**
    - Current: `npm list --depth=0` muestra
      - next@16.2.4, react@19.2.4, drizzle-orm@0.45.2, stripe@22.1.1, resend@6.12.2, zod@4.4.3, etc.
    - 🔜 Quarterly: correr `npm audit` y parchear vulnerabilidades

12. **Data Privacy (GDPR-like)**
    - ✅ Capturamos `leads.email`, `orders.customer_email` (necesario para operación)
    - 🔜 TODO: Privacy policy mencione qué datos capturamos
    - 🔜 TODO: DeleteMe endpoint (si pedimos deletear email de `leads`)
    - 🔜 TODO: Borrar orders después de X meses (GDPR-friendly)

**Referencia:**
- `TECHNICAL_ARCHITECTURE.md` §7 (TypeScript strict)
- `API_DOCUMENTATION.md` (qué hace cada endpoint)
- Stripe docs: https://stripe.com/docs/security
- Neon docs: https://neon.tech/docs/security

**Output:** `/docs/technical/SECURITY_CHECKLIST.md` (~2,000 palabras, 10 min lectura)

---

### TAREA 3: ERROR_HANDLING_GUIDE.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Documento que enseñe: "¿Qué pasa cuando todo se quiebra?"

**Contenido:**

1. **Error Boundaries (React)**
   - ✅ Componentes Client side pueden fallar
   - 🔜 TODO: wrappear root layout con error boundary
   - Qué mostrar: página amable ("Algo salió mal, recargá la página") vs. detalle técnico (solo en dev)

2. **API Error Responses**
   - ✅ `/api/leads` devuelve `{ success: false, issues }` si falla Zod
   - ✅ `/api/checkout` devuelve `{ error: string }` si falla creación de session
   - ✅ `/api/checkout/webhook` devuelve 401 si HMAC inválido
   - Estandarizar: todos responden con JSON + HTTP status code (200, 400, 401, 500)

3. **Database Errors**
   - Si Neon está down:
     - Drizzle timeout (configurable en `src/db/index.ts`)
     - Endpoint devuelve 500
     - Qué logguear: `Error connecting to database: ${err.message}`
   - Si tabla no existe:
     - TypeScript error en build (Drizzle schema mismatch)
     - Correr `npx drizzle-kit push` para sincronizar

4. **Stripe Errors**
   - `checkout.session.created` falló (credit card decline, etc.):
     - Stripe devuelve error con tipo (`card_error`, `rate_limit_error`, `api_error`)
     - Endpoint `/api/checkout` debe capturar y devolver mensaje amable al cliente
   - Webhook falló:
     - Si `/api/checkout/webhook` devuelve 500, Stripe reintenta cada 5 min (24 horas)
     - Ver retry log en Stripe dashboard

5. **Resend Errors**
   - Si email no se envió:
     - `resend.emails.send()` devuelve `{ error: string }`
     - Logguear el error pero no bloquear lead capture (ej. email podría estar malformado)
     - Dominio `tech-nova.mx` debe estar verified en Resend

6. **Logging Best Practices**
   - Qué logguear siempre:
     - Entry point de endpoint (POST /api/leads recibido)
     - Validación fallida (Zod issues)
     - Errores externos (Stripe, Resend, Neon)
     - Success conditions importantes (lead captured, payment created)
   - NO logguear:
     - API keys o secrets
     - Datos sensibles (full email en logs públicos)

7. **Sentry Integration (TODO para Fase 4)**
   - Centralizar todos los errores runtime en una plataforma
   - Configurar alertas (ej. 5+ errores en 5 min = Slack notification)
   - Sourcemaps para stack traces legibles

8. **Testing Errors Localmente**
   - `/api/leads` con email inválido:
     ```bash
     curl -X POST http://localhost:3000/api/leads \
       -H "Content-Type: application/json" \
       -d '{"name":"Vic","email":"not-an-email"}'
     # Esperado: 400 con issues
     ```
   - `/api/checkout` con amount negativo:
     ```bash
     curl -X POST http://localhost:3000/api/checkout \
       -H "Content-Type: application/json" \
       -d '{"email":"vic@example.com","amount_mxn":-100,"description":"test"}'
     # Esperado: 400 con issues
     ```

9. **Debugging en Producción**
   - Vercel logs: `vercel logs <project-name> --since 1h`
   - Stripe dashboard: Webhooks → Event ID → payload + response
   - Neon console: SQL queries, slow query logs
   - Browser devtools: Network tab para ver respuestas de API

10. **Recovery Checklist**
    - Si `/api/checkout/webhook` está roto (devuelve 500):
      ```
      1. Vercel logs → identifica línea del error
      2. Fix en rama local
      3. Deploy preview → test con Stripe CLI
      4. Mergear a main
      5. Stripe manualmente reintentará los webhooks pendientes
      ```
    - Si `/api/leads` rechaza emails válidos:
      ```
      1. Revisar Zod schema en leadSchema
      2. Actualizar si es necesario (ej. aceptar más caracteres)
      3. Deploy + test localmente
      4. Antiguos leads = no afectados (solo nuevos)
      ```

**Referencia:**
- `API_DOCUMENTATION.md` (qué devuelven los endpoints)
- `src/app/api/leads/route.ts` (error handling actual)
- `src/app/api/checkout/route.ts` (error handling Stripe)

**Output:** `/docs/technical/ERROR_HANDLING_GUIDE.md` (~1,800 palabras, 9 min lectura)

---

### TAREA 4: TESTING_STRATEGY.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Documento que defina: "¿Cómo verificamos que el código funciona?"

**Contenido:**

1. **Testing Stack (Decision)**
   - **Unit tests:** Vitest (similar a Jest, más rápido)
   - **E2E tests:** Playwright (browser automation, testing flows reales)
   - **Manual smoke tests:** curl + Vercel logs (para cada deploy)

2. **Unit Tests (Vitest)**
   - Qué testear:
     - Zod schemas (`leadSchema` rechaza emails inválidos)
     - Funciones puras (ej. precio con descuento)
     - Drizzle queries (si usamos custom queries sin ORM)
   - Qué NO testear:
     - Componentes React (caro, cambios cosméticos rompen tests)
     - Stripe SDK directamente (ya tested por Stripe)
     - Resend SDK directamente (ya tested por Resend)
   - Setup:
     ```bash
     npm install -D vitest @vitest/ui
     npx vitest run  # ejecuta tests
     npx vitest      # modo watch
     ```
   - Ejemplo test (Zod):
     ```typescript
     import { describe, it, expect } from 'vitest';
     import { leadSchema } from '@/db/schema';

     describe('leadSchema', () => {
       it('accepts valid email', () => {
         const result = leadSchema.safeParse({
           email: 'vic@example.com',
           name: 'Vic',
         });
         expect(result.success).toBe(true);
       });

       it('rejects invalid email', () => {
         const result = leadSchema.safeParse({
           email: 'not-an-email',
           name: 'Vic',
         });
         expect(result.success).toBe(false);
       });
     });
     ```

3. **E2E Tests (Playwright)**
   - Qué testear:
     - User flow: Home → Lead Magnet → envío form → success message
     - Checkout flow: wizard cotizador → redirige a Stripe → paga → success page
     - Error cases: form con email invalid → muestra error
   - Setup:
     ```bash
     npm install -D @playwright/test
     npx playwright install
     npx playwright test
     ```
   - Ejemplo test:
     ```typescript
     import { test, expect } from '@playwright/test';

     test('capture lead from home page', async ({ page }) => {
       await page.goto('http://localhost:3000');
       await page.fill('input[type="email"]', 'vic@example.com');
       await page.fill('input[name="name"]', 'Vic');
       await page.click('button:has-text("Enviar")');
       await expect(page).toHaveURL(/.*success/);
     });
     ```

4. **Manual Testing (Smoke Tests)**
   - Antes de mergear código:
     ```bash
     npm run build      # ¿compila?
     npm run dev        # ¿inicia?
     curl -X POST http://localhost:3000/api/leads \
       -H "Content-Type: application/json" \
       -d '{"email":"test@example.com","name":"Test"}'
     # Esperado: 200 + {"success": true, …}
     ```
   - Después de deploy a prod:
     ```bash
     curl -I https://tech-nova.mx/   # ¿es 200?
     curl -X POST https://tech-nova.mx/api/checkout \
       -H "Content-Type: application/json" \
       -d '{"email":"vic@example.com","amount_mxn":18000,"description":"test"}'
     # Esperado: 200 + {"url": "https://checkout.stripe.com/pay/…"}
     ```

5. **CI/CD Testing (TODO)**
   - GitHub Actions workflow:
     ```yaml
     name: Test
     on: [push, pull_request]
     jobs:
       test:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v3
           - uses: actions/setup-node@v3
           - run: npm install
           - run: npm run build
           - run: npx vitest run
           - run: npx playwright test
     ```
   - Después de merge a main: GitHub Actions corre tests, Vercel deploys si pass

6. **Test Coverage Goals**
   - Objetivo: 70%+ de cobertura en funciones críticas
   - Críticas: Zod schemas, webhook handlers, API routes
   - No críticas: componentes React, estilos Tailwind

7. **Testing Database Queries**
   - ✅ En dev: Drizzle logguea queries automáticamente (ver console)
   - 🔜 En test: usar test database separada (Neon puede crear branch de preview)
   - Query optimization: revisar Neon slow query logs antes de releases

8. **Testing Stripe Locally**
   - Stripe CLI:
     ```bash
     stripe listen --forward-to localhost:3000/api/checkout/webhook
     # genera whsec_… para .env.local
     ```
   - Trigger test events:
     ```bash
     stripe trigger payment_intent.succeeded  # simula pago exitoso
     stripe trigger checkout.session.completed  # simula checkout completado
     ```
   - Verificar webhook handler logguea correctamente

9. **Testing Before Deploy Checklist**
   ```
   - [ ] npm run build → exitoso (0 TypeScript errors)
   - [ ] npm run dev → app inicia en http://localhost:3000
   - [ ] npx vitest run → todos los tests pasan
   - [ ] npm run lint → 0 ESLint errors (si hay)
   - [ ] Curl smoke tests en localhost
   - [ ] Revisar BITACORA por hallazgos propios
   ```

10. **Test Organization**
    ```
    src/
    ├── __tests__/           ← tests viven aquí
    │   ├── api/
    │   │   ├── leads.test.ts
    │   │   └── checkout.test.ts
    │   └── lib/
    │       └── schema.test.ts
    ├── app/api/leads/route.ts
    └── lib/schema.ts
    ```

**Referencia:**
- Vitest docs: https://vitest.dev
- Playwright docs: https://playwright.dev
- Stripe testing: https://stripe.com/docs/testing

**Output:** `/docs/technical/TESTING_STRATEGY.md` (~2,000 palabras, 10 min lectura)

---

## 📊 ORDEN DE EJECUCIÓN

Ejecuta las tareas en orden: TAREA 1 → TAREA 2 → TAREA 3 → TAREA 4.

**Entregables esperados:**
- ✅ DEPLOYMENT_GUIDE.md
- ✅ SECURITY_CHECKLIST.md
- ✅ ERROR_HANDLING_GUIDE.md
- ✅ TESTING_STRATEGY.md

---

## ✅ CHECKLIST DE ENTREGA

### Antes de terminar Fase 3:

- [ ] `/docs/technical/DEPLOYMENT_GUIDE.md` creado y completo
- [ ] `/docs/technical/SECURITY_CHECKLIST.md` creado con checklist práctico
- [ ] `/docs/technical/ERROR_HANDLING_GUIDE.md` creado con ejemplos
- [ ] `/docs/technical/TESTING_STRATEGY.md` creado con setup code
- [ ] Todos los archivos están en `/docs/technical/` (no en otros lados)
- [ ] Links en ARCHITECTURE.md actualizados (referencias cruzadas)
- [ ] BITACORA.md actualizado con [FECHA] entry
- [ ] Nada roto en el proyecto ✅

### Calidad Gate:

- ✅ Todos los archivos son legibles (Markdown bien formateado)
- ✅ Ejemplos de curl/código están actualizados
- ✅ Links funcionan (referencias internas)
- ✅ Sin typos o información incompleta
- ✅ Cada tarea tiene "TODO" explícitos para Fase 4

---

## 📞 CONTACTO CON VIC

**Si necesitas:**

1. **Clarificación:** Escribe en BITACORA.md sección [PREGUNTAS FASE 3]
2. **Decisión importante:** Escribe [DECISIÓN REQUERIDA] en BITACORA.md
3. **Bloqueador:** Escribe [BLOQUEADOR] en BITACORA.md (respuesta urgente)

**Vic revisa BITACORA.md regularmente.**

---

## 🔗 REFERENCIAS IMPORTANTES

Para entender contexto, revisa (en orden):

1. **MEMORY.md** (carga esto primero)
2. **PHASE2_KICKOFF.md** (qué pasó antes)
3. **docs/technical/TECHNICAL_ARCHITECTURE.md** (cómo está construido)
4. **docs/technical/API_DOCUMENTATION.md** (qué expone cada endpoint)
5. **BITACORA.md** (qué pasó cuándo, bloqueadores)

---

## ⚠️ NOTAS IMPORTANTES

### Tech Debt Identificado (Relacionado a Fase 3, NO ARREGLES AHORA)

Estos issues son parte de lo que Fase 3 documenta, no arreglados en código:

- [ ] Rate limiting no implementado (`/api/leads` y `/api/checkout` sin límite)
- [ ] Error boundaries no implementadas en React
- [ ] Sentry no integrado (centralizar errores)
- [ ] CI/CD testing pipeline no configurada
- [ ] HTTPS headers completos no documentados (Vercel agrega algunos automáticos)

### Decisiones por Venir (Fase 4)

- Rate limiting en Edge Middleware (Vercel)
- Sentry + alertas a Slack
- Testing suite mínima (Vitest + Playwright)
- COMPONENTS_LIBRARY.md (patrones reutilizables)
- CI/CD pipeline completa (GitHub Actions)

---

## 🎯 ÉXITO SIGNIFICA

✅ DEPLOYMENT_GUIDE.md explica cómo shipear sin drama  
✅ SECURITY_CHECKLIST.md da confianza sobre lo que está protegido  
✅ ERROR_HANDLING_GUIDE.md enseña qué hacer cuando rompe  
✅ TESTING_STRATEGY.md define cómo verificar código antes de merge  
✅ Vic puede desplegar cambios con seguridad  
✅ Nuevo dev sabe qué pasó si algo rompe en prod  
✅ Listo para Fase 4 (Polish + CI/CD)

---

## 🚀 VAS, CLAUDE CODE?

**Status:** Esperando tu ejecución  
**Autonomía:** Total (documenta sin preguntar, solo escala bloqueadores)  
**Presión:** Media (esto asegura producción funcione sin paniqueos)  
**Éxito:** Si Vic despliega cambios con confianza

**¡Dale!**

---

**Preparado por:** Claude (Arquitecto)  
**Para:** Claude Code (Ejecutor)  
**Validado por:** Vic (Fundador)  
**Status:** ✅ LISTO PARA EJECUTAR

**Próximo evento:** Cuando termine Fase 3 → review + Fase 4 (Polish)  
**Próximo reporte:** BITACORA.md cuando complete Fase 3
