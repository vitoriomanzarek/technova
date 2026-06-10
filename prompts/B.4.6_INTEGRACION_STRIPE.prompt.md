# 🚀 B.4.6 KICKOFF: Integración Stripe + Contrato Local + Pago 50%+50%

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (Money in!)  
**Estimated Time:** 10-12 horas  
**Timeline:** Semana 3-4 de Fase B.4  
**Depends on:** ✅ B.4.1-5 COMPLETADOS

---

## 📋 OBJETIVO

Procesar pagos Stripe cuando cliente confirma su carrito, crear **contrato local** (PDF que firma), y gestionar el flujo de **pago 50% ahora + 50% cuando proyecto inicia**.

**Por qué es crítico:** Este es donde TechNova recibe dinero real. Debe ser:
- Seguro (PCI compliance via Stripe)
- Confiable (retry logic, webhook handling)
- Legal (contrato digital firmado)
- Claro para cliente (qué pasa después de pagar)

---

## 🎯 ENTREGABLES

### 1. Stripe Payment Intent → Checkout Session
**Archivo:** `src/app/api/checkout/[uuid]/pay/route.ts` (actualizar)

**Ya existe desde B.4.5, pero necesita ampliación:**

**POST `/api/checkout/{uuid}/pay`**

**Request:**
```json
{
  "email": "juan@acme.mx",
  "modules": ["MOD-01", "MOD-02"],
  "total": 14400,
  "payment_percentage": 50
}
```

**Response:**
```json
{
  "sessionUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_xxxxx",
  "clientSecret": "pi_xxxxx#secret_yyyy",
  "amount": 1440000,
  "currency": "mxn"
}
```

**Qué hace:**
1. Valida que `payment_percentage` sea 50 o 100
2. Calcula monto: `total * (payment_percentage / 100)`
3. Crea Stripe Payment Intent con metadata:
   ```
   {
     "proposal_id": "{uuid}",
     "payment_percentage": 50,
     "modules": "MOD-01,MOD-02",
     "empresa": "Acme Corp"
   }
   ```
4. Retorna `sessionUrl` para Stripe checkout embed
5. Guarda `payment_intent_id` en tabla `orders` (nueva fila, status `pending`)

---

### 2. Contrato Digital (PDF Local)
**Archivo:** `src/lib/contracts/generate-contract-pdf.ts` (NEW)

**Función:**
```typescript
async function generateContractPDF(proposal: Proposal) {
  // Datos del contrato:
  // - Empresa cliente
  // - Módulos seleccionados
  // - Total (MXN)
  // - Timeline (días)
  // - Términos: 50% ahora, 50% al iniciar
  // - Fecha de inicio estimada
  // - Firma electrónica (campo checkbox)
  
  // Puppeteer: setContent() + renderToString()
  // Output: Buffer (PDF bytes)
}
```

**Contenido del Contrato:**

```
┌─────────────────────────────────────────────┐
│         CONTRATO DE SERVICIOS DIGITALES     │
│              Tech Nova México                │
└─────────────────────────────────────────────┘

PARTES:
Proveedor: Tech Nova México, S.A. de C.V.
Cliente: {empresa} ({nombre}, {email})

SERVICIOS:
{módulos con descripción}

PRESUPUESTO:
Subtotal: ${subtotal} MXN
PM Fee (20%): ${pm_fee} MXN
────────────
Total: ${total} MXN

TÉRMINOS DE PAGO:
1. Primer pago (50%): ${total/2} MXN — Hoy (al firmar)
2. Segundo pago (50%): ${total/2} MXN — Al iniciar proyecto ({fecha_inicio})

TIMELINE:
Duración estimada: {horas} horas = {días} días hábiles
Inicio: {fecha_inicio}
Fin estimado: {fecha_fin}

CONDICIONES:
✓ Trabajo bajo contrato de servicios
✓ NDA incluida (confidencialidad)
✓ IP (Intellectual Property) pasa a cliente
✓ Cancelación: 50% penalidad si antes de iniciar
✓ Garantía: 30 días de soporte post-entrega

FIRMAS:
Representante Tech Nova: ________________________

Cliente ({empresa}): ____________________________
Fecha: {hoy}

☐ Acepto los términos y condiciones
```

**Tecnología:**
- `puppeteer` + `pug` templates (o inline HTML)
- Incluir logo + branding TechNova
- QR code con link a propuesta (para verificación)
- Timestamp de generación

**Output:**
```typescript
// Retorna Buffer (PDF bytes)
const pdfBuffer = await generateContractPDF(proposal);
// Archivo generado se envía a cliente por email + descarga
```

---

### 3. API: Crear Contrato + Enviar Email
**Archivo:** `src/app/api/checkout/[uuid]/contract/route.ts` (NEW)

**GET `/api/checkout/{uuid}/contract`**

**Response:** `Content-Type: application/pdf`
- Descarga PDF del contrato directamente

**También:**
- Crea registro en tabla `contracts`:
  ```
  {
    id: UUID,
    proposal_id: FK,
    generated_at: timestamp,
    signed_by: email (nullable),
    signed_at: timestamp (nullable),
    pdf_url: string (storage path)
  }
  ```

---

### 4. Email: Envío de Contrato
**Archivo:** `src/lib/emails/contractForSignature.ts` (NEW)

**Cuándo:** Cliente hace click en `/checkout/{uuid}` → "Revisar contrato"

**Contenido:**
```
Subject: Contrato para revisar — {empresa} | Tech Nova

Hola {nombre},

Te adjuntamos el contrato de servicios para tu proyecto de ${total} MXN.

Por favor:
1. Descarga el PDF
2. Revisa los términos
3. Si estás de acuerdo, completa el pago en: [BOTÓN PAGAR 50%]

TÉRMINOS PRINCIPALES:
✓ 50% ahora (${total/2} MXN)
✓ 50% al iniciar proyecto (${total/2} MXN)
✓ Inicio estimado: {fecha_inicio}
✓ Duración: {días} días hábiles

[BOTÓN: Descargar Contrato PDF]
[BOTÓN: Ir a checkout]

Preguntas? Contacta a: hola@tech-nova.mx o +52 722 166 9672

¡Estamos emocionados de trabajar contigo!
Sofia 🚀
```

---

### 5. Webhook Stripe: Payment Confirmado
**Archivo:** `src/app/api/webhooks/stripe/route.ts` (actualizar)

**Evento:** `checkout.session.completed`

**Qué hace:**
1. Valida webhook signature (Stripe secret)
2. Extrae `session.metadata`:
   - `proposal_id`
   - `payment_percentage`
   - `modules`
   - `empresa`
3. Busca propuesta por UUID
4. Si `payment_percentage == 50`:
   - Crea registro en `orders`:
     ```
     {
       id: UUID,
       proposal_id: FK,
       email: cliente,
       total_amount: subtotal (cents),
       payment_percentage: 50,
       paid_amount: 50% (cents),
       stripe_session_id: session.id,
       status: "paid_first_half",
       paid_at: now(),
       remaining_due: 50%
     }
     ```
   - Crea proyecto EN BORRADORES:
     ```
     {
       id: UUID,
       proposal_id: FK,
       empresa,
       status: "awaiting_kickoff",
       modules: JSON,
       payment_status: "half_paid",
       kickoff_date: {fecha_inicio},
       estimated_completion: {fecha_fin}
     }
     ```
   - Envía email a cliente: "¡Pago recibido! Tu proyecto inicia el {fecha}"
   - Envía email a Vic: "Nuevo cliente pagado: {empresa}, inicia {fecha}"

5. Si `payment_percentage == 100`:
   - Crea `orders` con `status: "paid_full"`
   - El proyecto avanza a `"in_progress"`

6. **Retry logic:**
   - Si webhook falla, Stripe reintenta por 3 días
   - Timeout: 30s (cumple requisito Stripe)
   - Logging: Sentry + DB audit trail

---

### 6. Tabla BD: `orders` (actualizar)
**Archivo:** `src/db/schema.ts`

```typescript
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  proposal_id: uuid('proposal_id')
    .references(() => proposals.id)
    .notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  total_amount: integer('total_amount').notNull(), // cents (MXN)
  payment_percentage: integer('payment_percentage').notNull(), // 50 or 100
  paid_amount: integer('paid_amount').notNull(), // cents (MXN)
  remaining_due: integer('remaining_due'), // cents (MXN), NULL si paid_full
  
  stripe_session_id: varchar('stripe_session_id', { length: 255 }),
  stripe_payment_intent_id: varchar('stripe_payment_intent_id', { length: 255 }),
  
  status: varchar('status', { length: 50 }).notNull(), // pending | paid_first_half | paid_full | failed | refunded
  paid_at: timestamp('paid_at'),
  refunded_at: timestamp('refunded_at'),
  
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

---

### 7. Tabla BD: `projects` (actualizar)
**Archivo:** `src/db/schema.ts`

```typescript
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  proposal_id: uuid('proposal_id')
    .references(() => proposals.id)
    .notNull(),
  order_id: uuid('order_id')
    .references(() => orders.id),
  
  empresa: varchar('empresa', { length: 255 }).notNull(),
  email_cliente: varchar('email_cliente', { length: 255 }).notNull(),
  
  modules_json: json('modules_json').notNull(), // { id, name, cost, hours }[]
  total_amount: integer('total_amount').notNull(), // cents (MXN)
  
  status: varchar('status', { length: 50 }).notNull(), 
  // awaiting_kickoff | in_progress | delivered | completed | on_hold | cancelled
  
  kickoff_date: timestamp('kickoff_date'),
  estimated_completion: timestamp('estimated_completion'),
  actual_completion: timestamp('actual_completion'),
  
  payment_status: varchar('payment_status', { length: 50 }).notNull(), 
  // half_paid | fully_paid
  second_payment_due: timestamp('second_payment_due'),
  
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

---

### 8. Tabla BD: `contracts`
**Archivo:** `src/db/schema.ts`

```typescript
export const contracts = pgTable('contracts', {
  id: uuid('id').defaultRandom().primaryKey(),
  proposal_id: uuid('proposal_id')
    .references(() => proposals.id)
    .notNull(),
  
  generated_at: timestamp('generated_at').defaultNow().notNull(),
  signed_by: varchar('signed_by', { length: 255 }), // email del cliente
  signed_at: timestamp('signed_at'),
  
  pdf_url: varchar('pdf_url', { length: 500 }), // storage path (if persisted)
  
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

---

### 9. Email: Bienvenida Post-Pago
**Archivo:** `src/lib/emails/projectStartedNotification.ts` (NEW)

**Cuándo:** Webhook confirma pago 50%

**A Cliente:**
```
Subject: ¡Tu proyecto inicia el {fecha}! 🚀 | Tech Nova

Hola {nombre},

¡Gracias por tu confianza! Recibimos tu pago de ${total/2} MXN.

PRÓXIMOS PASOS:
1. Preparamos tu proyecto (2-3 días antes del inicio)
2. Te enviamos acceso a tu dashboard privado
3. Vic te contactará para la KICKOFF CALL el {fecha}
4. ¡Comenzamos a trabajar!

DETALLES DEL PROYECTO:
Empresa: {empresa}
Módulos: {lista}
Timeline: {días} días desde el {kickoff_date}
Total: ${total} MXN (pagaste 50%, 50% restante al iniciar)

ACCESO A TU DASHBOARD:
[Botón: Acceder al Dashboard]

PAGO PENDIENTE:
Deberás pagar ${total/2} MXN en la semana de inicio.
Te enviaremos enlace de pago 3 días antes.

CONTACTO:
Preguntas: hola@tech-nova.mx
WhatsApp: +52 722 166 9672

¡Estamos emocionados!
Sofia 🚀
```

**A Vic:**
```
Subject: NUEVO CLIENTE — {empresa} | Pago recibido | Inicia {fecha}

Vic,

✅ Pago confirmado: ${total/2} MXN (50%)

DATOS DEL CLIENTE:
- Empresa: {empresa}
- Contacto: {nombre} ({email})
- Módulos: {lista con horas}
- Total proyecto: ${total} MXN
- Kickoff: {fecha}
- Fin estimada: {fecha + días}

PRÓXIMOS PASOS:
1. 2 días antes: Preparar kickoff call (Calendly)
2. Día de inicio: KICKOFF CALL con cliente (30-45 min)
3. Entregar acceso a repo, Figma, docs
4. Comenzar proyecto

DASHBOARD:
[Link: /admin/projects/{project_id}]

Pago restante (50%) se recaudará el {fecha_inicio}.
```

---

### 10. Página de Agradecimiento
**Archivo:** `src/app/checkout/[uuid]/success/page.tsx` (NEW)

**Qué muestra:**
- ✅ Pago confirmado
- 📊 Resumen: empresa, módulos, total, timeline
- 📅 Fecha de inicio estimada
- 💳 Próximo pago (50%) en {fecha_inicio}
- 🔗 Link a dashboard privado (cuando esté disponible)
- 📝 Descarga contrato firmado
- 📞 Números de contacto para preguntas

---

## 🛠️ TECH STACK

| Componente | Tech | Notas |
|-----------|------|-------|
| Pagos | Stripe | (existing) |
| Webhook | Node.js + crypto | Validación signature |
| PDF | Puppeteer | (existing) |
| Email | Resend | (existing) |
| DB | Neon Postgres | (existing) |
| Retry | Bull queues (opcional) | Background jobs con reintentos |

---

## 📋 INSTALACIÓN & SETUP

### 1. Actualizar tabla BD
```bash
npm run db:push
```

### 2. Crear componentes de contract
```bash
src/lib/contracts/generate-contract-pdf.ts
src/app/api/checkout/[uuid]/contract/route.ts
src/app/api/checkout/[uuid]/success/page.tsx
```

### 3. Crear emails
```bash
src/lib/emails/contractForSignature.ts
src/lib/emails/projectStartedNotification.ts
```

### 4. Actualizar webhook
```bash
src/app/api/webhooks/stripe/route.ts
# Agregar handlers para checkout.session.completed
```

### 5. Env vars en Vercel
```
STRIPE_SECRET_KEY=sk_live_... (cuando esté en prod)
STRIPE_WEBHOOK_SECRET=whsec_... (get from Stripe dashboard)
```

---

## ✅ CHECKLIST QA

### Unit Tests (5)
- [ ] `generateContractPDF()` produce PDF válido
- [ ] Webhook signature validation rechaza tampering
- [ ] Payment amount calculations son correctos (cents conversion)
- [ ] Status transitions son válidas (pending → paid_first_half → paid_full)
- [ ] Email templates renderen sin error

### Integration Tests (5)
- [ ] Crear carrito → Pagar 50% → Orden creada
- [ ] Webhook confirma pago → Proyecto creado en BD
- [ ] Proyecto creado → Email a cliente + Vic
- [ ] POST `/api/checkout/{uuid}/contract` descarga PDF
- [ ] Segundo pago (50%) crea orden con `paid_full`

### Manual Testing (5)
- [ ] Checkout completado → redirect a `/success` page
- [ ] Recibe email "¡Pago confirmado!"
- [ ] Puede descargar contrato PDF
- [ ] Dashboard privado accesible (cuando esté listo)
- [ ] Stripe test webhook entrega correctamente

### Edge Cases (5)
- [ ] Webhook duplicado (idempotency) → no crea orden twice
- [ ] Cliente intenta pagar dos veces → rechaza segunda
- [ ] Pago falla en Stripe → status actualiza a failed
- [ ] Webhook timeout > 30s → Stripe reintenta
- [ ] Currency conversion (MXN to cents) — no rounding errors

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 8 — contexto
- `BACKLOG_MASTER.md` § B.4.6
- `docs/technical/API_DOCUMENTATION.md` — webhook patterns

**Código existente:**
- `src/app/api/webhooks/stripe/route.ts` — webhook estructura
- `src/lib/checkout/calculate-proposal.ts` — cálculos de precio
- `src/lib/emails/proposalSentToClient.ts` — patrón de email

**Stripe docs:**
- [Webhook signatures](https://stripe.com/docs/webhooks/signatures)
- [Payment intents](https://stripe.com/docs/payments/payment-intents)
- [Idempotency](https://stripe.com/docs/api/idempotent_requests)

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] Contrato PDF generado dinámicamente
- [x] Payment Intent creado correctamente
- [x] Webhook maneja checkout.session.completed
- [x] Órdenes creadas en BD
- [x] Proyectos creados en estado "awaiting_kickoff"
- [x] Emails: contrato, confirmación, bienvenida
- [x] Página `/checkout/{uuid}/success` con resumen
- [x] Retry logic para webhook + pagos fallidos

✅ **Testing**
- [x] 5 unit tests
- [x] 5 integration tests
- [x] 5 escenarios manual
- [x] 5 edge cases

✅ **Documentation**
- [x] Flujo de pago documentado
- [x] Webhook documentado
- [x] Contrato template documentado
- [x] Transiciones de estado documentadas

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.6 COMPLETADO: Integración Stripe + Contrato + Pago 50%+50%

**Qué se hizo:**
- Contrato PDF dinámico (Puppeteer)
- Payment Intent → Stripe checkout
- Webhook: checkout.session.completed → Order + Project creados
- 3 emails: contrato, confirmación, bienvenida a cliente + Vic
- Página /success con resumen de proyecto
- 20/20 tests pasados

**Archivos creados:**
- src/lib/contracts/generate-contract-pdf.ts (NEW)
- src/app/api/checkout/[uuid]/contract/route.ts (NEW)
- src/app/api/checkout/[uuid]/success/page.tsx (NEW)
- src/lib/emails/contractForSignature.ts (NEW)
- src/lib/emails/projectStartedNotification.ts (NEW)
- src/db/schema.ts (UPDATED — orders, projects, contracts)
- src/app/api/webhooks/stripe/route.ts (UPDATED)
- src/app/api/checkout/[uuid]/pay/route.ts (UPDATED)

**Próximo paso:** B.4.7 (Dashboard Cliente post-pago)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **Webhook signature validation:** OBLIGATORIO. No confíes en metadata sin validar.

2. **Idempotency:** Si webhook se dispara 2 veces, NO crees 2 órdenes. Usa `session_id` como key único.

3. **Currency:** Stripe siempre trabaja en cents. $100 MXN = 10000 cents. Cuidado al convertir.

4. **Retry logic:** Stripe reintenta webhooks por 3 días. Guardar en DB antes de retornar 200.

5. **Contrato local:** PDF se genera en el momento, no persista. Si cliente necesita descargarlo después, reeternal desde memoria.

6. **Segundo pago:** Se procesa cuando proyecto está en `"awaiting_kickoff"` y cliente lo confirma. Implementar en B.4.7.

7. **Email delivery:** Si Resend falla, guarda intento en BD. Agent puede reintentar manualmente.

8. **Test mode:** Stripe proporciona tarjetas de prueba (4242 4242...). Usar en dev, live keys en prod.

---

**Created:** 2026-06-03  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1-5 COMPLETADOS  
**Next:** After completion → B.4.7 KICKOFF (Dashboard Cliente)
