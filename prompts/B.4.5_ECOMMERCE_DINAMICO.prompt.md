# 🚀 B.4.5 KICKOFF: Ecommerce Dinámico y Checkout Personalizado

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (Último gate antes de pago)  
**Estimated Time:** 10-12 horas  
**Timeline:** Semana 2-3 de Fase B.4  
**Depends on:** ✅ B.4.1 + ✅ B.4.2 + ✅ B.4.3 + ✅ B.4.4 COMPLETADOS

---

## 📋 OBJETIVO

Implementar **checkout dinámico** (`/checkout/{proposal_uuid}`) donde cliente puede:

1. **Ver módulos propuestos** (preseleccionados, checkboxes)
2. **Quitar módulos** (reduce precio)
3. **Agregar módulos a la carte** (aumenta precio)
4. **Precio recalcula en vivo** (suma de módulos + 20% PM fee)
5. **Timeline actualiza automáticamente**
6. **Botón: "Pagar 50%"** → Stripe checkout
7. **Opción: "Solicitar cambios"** → email a Vic con cambios propuestos

**Por qué es crítico:** Si cliente no puede personalizar, se va. Este es el último paso antes del dinero real.

---

## 🎯 ENTREGABLES

### 1. Página React: `/checkout/{proposal_uuid}`
**Archivo:** `src/app/checkout/[uuid]/page.tsx`

**Features:**

```
┌──────────────────────────────────────────────────┐
│ FINALIZA TU PRESUPUESTO                          │
│ Tech Nova                                        │
├──────────────────────────────────────────────────┤
│                                                  │
│ CONTACTO: Juan García (juan@acme.mx)            │
│ EMPRESA: Acme Corp                              │
│ PRESUPUESTO ORIGINAL: $28,800 MXN               │
│                                                  │
├──────────────────────────────────────────────────┤
│ MÓDULOS SELECCIONADOS (Puedes modificar)        │
│                                                  │
│ ☑ Identidad Completa                            │
│   Logo, paleta, tipografía, UI Kit              │
│   $8,500 | 28h | Crítico                        │
│   [i] Si lo quitas: -$8,500                     │
│                                                  │
│ ☑ Landing Page Optimizada                       │
│   Responsive, SEO, performance                  │
│   $9,200 | 25h | Crítico                        │
│   [i] Si lo quitas: -$9,200                     │
│                                                  │
│ ☑ SEO Técnico                                   │
│   Meta tags, sitemap, core web vitals           │
│   $6,300 | 20h | Recomendado                   │
│   [i] Si lo quitas: -$6,300                     │
│                                                  │
├──────────────────────────────────────────────────┤
│ AGREGAR MÓDULOS (A la carte)                    │
│                                                  │
│ [+ Agregar módulo ▼]                            │
│   └─ E-commerce Core: +$15,000                  │
│   └─ CRM: +$12,000                              │
│   └─ Chatbot IA: +$8,000                        │
│   └─ ... (más opciones)                         │
│                                                  │
├──────────────────────────────────────────────────┤
│ DESGLOSE ACTUALIZADO (En tiempo real)            │
│                                                  │
│ Identidad:           $8,500                     │
│ Landing:             $9,200                     │
│ SEO:                 $6,300                     │
│ ─────────────────────────────                   │
│ Subtotal técnico:   $24,000                     │
│ PM Fee (20%):        $4,800                     │
│ ─────────────────────────────                   │
│ TOTAL:              $28,800 MXN                 │
│                                                  │
│ PAGO:  50% ahora ($14,400)                      │
│        50% al iniciar ($14,400)                 │
│                                                  │
│ Timeline: 18 días | Inicio: 3 junio             │
│                                                  │
├──────────────────────────────────────────────────┤
│ ACCIONES                                        │
│                                                  │
│ [BOTÓN VERDE: "Pagar 50% y comenzar"]           │
│  → Stripe checkout (payment_intent)             │
│                                                  │
│ [BOTÓN AZUL: "Solicitar cambios"]               │
│  → Email a Vic con cambios propuestos           │
│                                                  │
│ [BOTÓN GRIS: "Guardar presupuesto"]             │
│  → Guardar en localStorage para después         │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Componentes React:**

```typescript
// src/components/checkout/ModuleList.tsx
- Módulos propuestos con checkboxes
- Cada módulo muestra: nombre, descripción, precio, horas
- Info tooltip: "Si lo quitas, ahorras $X"
- Click uncheck → precio recalcula

// src/components/checkout/ModuleSelector.tsx
- Dropdown "Agregar módulo"
- Filtra módulos NO seleccionados
- Muestra precio incremental
- Valida: no exceder presupuesto máximo
- Aviso rojo si excede

// src/components/checkout/PriceBreakdown.tsx
- Subtotal técnico (suma de módulos)
- PM Fee 20% (cálculo automático)
- Total + opciones de pago (50/50 o 100%)
- Timeline estimado (horas → días)

// src/components/checkout/CheckoutActions.tsx
- Botón "Pagar 50%"
- Botón "Solicitar cambios"
- Botón "Guardar presupuesto"
```

---

### 2. Lógica de Recálculo (TypeScript)
**Archivo:** `src/lib/checkout/calculate-proposal.ts`

```typescript
interface CheckoutCart {
  proposal_id: string;
  modulos_seleccionados: string[]; // Module IDs
  modulos_removidos: string[];
  modulos_agregados: string[];
}

export function calculateProposal(cart: CheckoutCart, catalog: Module[]) {
  // 1. Obtener módulos actuales del catálogo
  const modules = cart.modulos_seleccionados
    .map(id => catalog.find(m => m.id === id))
    .filter(Boolean);

  // 2. Calcular subtotal
  const subtotal = modules.reduce((sum, m) => sum + m.precio, 0);

  // 3. Calcular horas totales
  const horas = modules.reduce((sum, m) => sum + m.horas, 0);

  // 4. Calcular PM Fee (20%)
  const pmFee = subtotal * 0.2;

  // 5. Calcular total
  const total = subtotal + pmFee;

  // 6. Calcular timeline (horas / 7 ≈ días laborales)
  const diasEstimados = Math.ceil(horas / 7);

  // 7. Validar contra presupuesto máximo (si existe)
  const exceedsBudget = total > presupuestoMaximo;

  return {
    subtotal,
    pmFee,
    total,
    horas,
    diasEstimados,
    modulos: modules,
    exceedsBudget,
    aviso: exceedsBudget ? `Excede presupuesto en $${total - presupuestoMaximo}` : null
  };
}
```

---

### 3. API: Crear/Actualizar Carrito
**Archivo:** `src/app/api/checkout/[uuid]/route.ts`

**GET `/api/checkout/{uuid}`**
- Obtiene propuesta actual
- Retorna estructura para checkout (módulos, precios)

**POST `/api/checkout/{uuid}`**
**Body:**
```json
{
  "modulos_seleccionados": ["MOD-01", "MOD-02"],
  "modulos_removidos": ["MOD-03"],
  "modulos_agregados": []
}
```

**Response:**
```json
{
  "success": true,
  "carrito": {
    "subtotal": 24000,
    "pm_fee": 4800,
    "total": 28800,
    "horas": 73,
    "dias_estimados": 11,
    "cambios": {
      "removidos": [...],
      "agregados": [...]
    }
  }
}
```

---

### 4. API: Solicitar Cambios
**Archivo:** `src/app/api/checkout/{uuid}/request-changes/route.ts`

**POST**
**Body:**
```json
{
  "cambios_solicitados": {
    "removidos": ["MOD-03"],
    "agregados": ["MOD-05"],
    "notas": "El cliente pidió quitar SEO y agregar ecommerce"
  }
}
```

**Qué hace:**
1. Envía email a Vic con cambios solicitados
2. Incluye propuesta actualizada (cálculos)
3. Crea nota en propuesta: "Cliente solicitó cambios el [fecha]"
4. Status propuesta → "client_requesting_changes"
5. Email a cliente: "Vic revisará tus cambios en 24h"

---

### 5. API: Procesar Pago (Stripe)
**Archivo:** `src/app/api/checkout/{uuid}/pay/route.ts`

**POST**
**Body:**
```json
{
  "email": "juan@acme.mx",
  "total": 14400,
  "payment_percentage": 50
}
```

**Qué hace:**
1. Valida que propuesta status es "approved" o "modified" (no "client_requesting_changes")
2. Crea Stripe Payment Intent
3. Retorna `client_secret` para checkout
4. Actualiza status propuesta → "awaiting_payment"
5. Guarda referencia de payment_intent en BD

**Response:**
```json
{
  "success": true,
  "clientSecret": "pi_xxxx#secret_yyyy",
  "amount": 1440000,
  "currency": "mxn",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

---

### 6. Stripe Webhook: Pago Confirmado
**Archivo:** `src/app/api/webhooks/stripe/route.ts` (actualizar)

**Evento:** `payment_intent.succeeded`

**Qué hace:**
1. Busca propuesta por payment_intent_id
2. Crea registro en tabla `orders`
3. Crea registro en tabla `projects` (status: "onboarding_pending")
4. Actualiza propuesta status → "paid"
5. Envía email a cliente: "¡Bienvenido! Acceso a tu dashboard"
6. Notifica a Vic: "Nuevo cliente pagado, inicia [fecha]"

---

### 7. Tabla BD: `orders` (actualizar)
**Archivo:** `src/db/schema.ts`

```typescript
// Actualizar tabla orders existente:
export const orders = pgTable('orders', {
  // ... campos existentes ...
  
  // Nuevos campos:
  proposal_id: uuid('proposal_id').references(() => proposals.id),
  payment_percentage: integer('payment_percentage'), // 50 o 100
  paid_at: timestamp('paid_at'),
  
  // Cuando se pague el segundo 50%:
  second_payment_id: varchar('second_payment_id', { length: 255 }),
  second_paid_at: timestamp('second_paid_at'),
});
```

---

### 8. Email: Cambios Solicitados (a Vic)
**Archivo:** `src/lib/emails/clientRequestedChangesNotification.ts`

**Cuándo:** Cliente hace click "Solicitar cambios"

**Contenido:**
```
Subject: 🔧 Cliente solicitó cambios — {empresa} | {propuesta_id}

Hola Vic,

{empresa} revisó la propuesta y solicita cambios antes de pagar.

CAMBIOS SOLICITADOS:
Removidos:
- {modulo_removido_1}
- {modulo_removido_2}

Agregados:
- {modulo_agregado_1}

PRESUPUESTO ACTUALIZADO:
Anterior: ${precio_anterior} MXN
Nuevo: ${precio_nuevo} MXN
Diferencia: ${diferencia} MXN

NOTAS DEL CLIENTE:
{notas_cliente}

ACCIÓN:
Revisa los cambios y actualiza la propuesta en tu dashboard.
El cliente estará esperando confirmación.

Link: /admin/proposals-review/{proposal_id}
```

---

### 9. Email: Pago Confirmado (a Cliente)
**Archivo:** `src/lib/emails/paymentConfirmedEmail.ts`

**Cuándo:** Stripe webhook confirma pago

**Contenido:**
```
Subject: ✅ Pago confirmado — {empresa} | Proyecto iniciando

Hola {nombre},

¡Gracias por tu confianza! Recibimos tu pago de ${monto_pagado} MXN.

RESUMEN DEL PROYECTO
Empresa: {empresa}
Timeline: {timeline_dias} días
Inicio: {fecha_inicio}
Entrega estimada: {fecha_entrega}

PRÓXIMOS PASOS:
1. Acceso inmediato a tu dashboard privado
2. Vic te contactará en 24h para kickoff call
3. Comenzamos el proyecto el {fecha_inicio}

[BOTÓN: "Acceder a tu dashboard"]

PAGO RESTANTE:
Deberás pagar el 50% restante ($X) cuando iniciemos el proyecto.

CONTACTO
Preguntas: hola@tech-nova.mx
WhatsApp: +52 722 166 9672

¡Estamos emocionados!
Sofia 🚀
```

---

### 10. Estado Local (localStorage o Zustand)
**Archivo:** `src/lib/checkout/useCheckoutStore.ts`

```typescript
interface CheckoutStore {
  proposal_uuid: string;
  carrito: {
    modulos_seleccionados: string[];
    modulos_removidos: string[];
    modulos_agregados: string[];
  };
  totales: {
    subtotal: number;
    pmFee: number;
    total: number;
  };
  
  // Métodos:
  selectModule(id: string): void;
  deselectModule(id: string): void;
  addModule(id: string): void;
  removeModule(id: string): void;
  recalculate(): void;
  saveLocally(): void;
  loadLocally(): void;
}
```

---

## 🛠️ TECH STACK

| Componente | Tech | Notas |
|-----------|------|-------|
| Frontend | React 19 + Next.js | (existing) |
| State | Zustand o context | Para carrito en vivo |
| Cálculos | TypeScript | calculateProposal() |
| Pagos | Stripe | (existing) |
| DB | Neon Postgres | (existing) |
| Emails | Resend | (existing) |

---

## 📋 INSTALACIÓN & SETUP

### 1. Actualizar tabla BD
```bash
# schema.ts: agregar campos a orders
npm run db:push
```

### 2. Crear componentes
```bash
src/components/checkout/ModuleList.tsx
src/components/checkout/ModuleSelector.tsx
src/components/checkout/PriceBreakdown.tsx
src/components/checkout/CheckoutActions.tsx
src/app/checkout/[uuid]/page.tsx
```

### 3. Crear API endpoints
```bash
src/app/api/checkout/[uuid]/route.ts
src/app/api/checkout/[uuid]/request-changes/route.ts
src/app/api/checkout/[uuid]/pay/route.ts
```

### 4. Actualizar webhook
```bash
src/app/api/webhooks/stripe/route.ts
# Agregar manejo de payment_intent.succeeded
```

---

## ✅ CHECKLIST QA

### Unit Tests (5)
- [ ] `calculateProposal()` recalcula correctamente al quitar módulo
- [ ] `calculateProposal()` recalcula correctamente al agregar módulo
- [ ] PM Fee siempre es exactamente 20% del subtotal
- [ ] Timeline (horas/7) redondea correctamente
- [ ] Validación: no permite exceder presupuesto máximo

### Integration Tests (5)
- [ ] GET `/api/checkout/{uuid}` carga propuesta
- [ ] POST `/api/checkout/{uuid}` actualiza carrito
- [ ] Quitar módulo → precio recalcula en frontend
- [ ] Agregar módulo → precio recalcula en frontend
- [ ] POST `/request-changes` → email enviado a Vic

### Manual Testing (5)
- [ ] Abrir `/checkout/{uuid}` → ve módulos preseleccionados
- [ ] Uncheck módulo → precio baja en vivo
- [ ] Agregar módulo → precio sube en vivo
- [ ] Click "Pagar 50%" → redirige a Stripe checkout
- [ ] Pagar en Stripe → webhook confirma, emails llegan

### Edge Cases (5)
- [ ] Presupuesto muy bajo ($5K) → aviso rojo si intenta agregar
- [ ] Quitar TODOS los módulos → error "Necesitas al menos 1 módulo"
- [ ] Agregar módulo muy caro → aviso "Excede presupuesto en $X"
- [ ] Cerrar pestaña y volver → carrito se recupera desde localStorage
- [ ] Cliente intenta pagar dos veces → segunda transacción rechazada

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 7 — contexto
- `BACKLOG_MASTER.md` § B.4.5
- `docs/technical/DATABASE_SCHEMA.md` — tabla orders

**Código existente:**
- `B.4.4` — patrones de email, Stripe webhook
- `src/lib/checkout/calculate-proposal.ts` — ya existe?
- `src/lib/catalog.ts` — 56 módulos (source of truth)

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] Página `/checkout/{uuid}` con módulos checkboxes
- [x] ModuleSelector para agregar a la carte
- [x] Recálculo de precio en vivo
- [x] 3 API endpoints (GET carrito, POST cambios, POST pago)
- [x] Stripe Payment Intent integration
- [x] Webhook: pago confirmado → crear order + project
- [x] Emails: cambios solicitados, pago confirmado
- [x] localStorage/Zustand para carrito

✅ **Testing**
- [x] 5 unit tests
- [x] 5 integration tests
- [x] 5 escenarios manual
- [x] 5 edge cases

✅ **Documentation**
- [x] Cálculos documentados
- [x] APIs documentadas
- [x] Emails documentadas

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.5 COMPLETADO: Ecommerce Dinámico y Checkout

**Qué se hizo:**
- /checkout/{uuid} con módulos dinámicos (quitar/agregar)
- Precio recalcula en vivo (subtotal + 20% PM fee)
- Timeline actualiza automáticamente
- "Solicitar cambios" → email a Vic con nuevos cálculos
- Stripe Payment Intent → webhook confirma pago
- Emails: cambios solicitados, pago confirmado
- 20/20 tests pasados

**Archivos creados:**
- src/app/checkout/[uuid]/page.tsx (NEW)
- src/components/checkout/ModuleList.tsx (NEW)
- src/components/checkout/ModuleSelector.tsx (NEW)
- src/components/checkout/PriceBreakdown.tsx (NEW)
- src/components/checkout/CheckoutActions.tsx (NEW)
- src/lib/checkout/calculate-proposal.ts (NEW)
- src/lib/checkout/useCheckoutStore.ts (NEW)
- src/app/api/checkout/[uuid]/route.ts (NEW)
- src/app/api/checkout/[uuid]/request-changes/route.ts (NEW)
- src/app/api/checkout/[uuid]/pay/route.ts (NEW)
- src/lib/emails/clientRequestedChangesNotification.ts (NEW)
- src/lib/emails/paymentConfirmedEmail.ts (NEW)
- src/app/api/webhooks/stripe/route.ts (UPDATED)
- src/db/schema.ts (UPDATED — campos orders)

**Próximo paso:** B.4.6 (Contrato local + pago segundo 50%)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **PM Fee siempre 20%:** No editable por cliente. Es overhead de gestión.

2. **Timeline cálculo:** Horas / 7 (asumiendo 7h de trabajo por día). Redondear hacia arriba.

3. **Presupuesto máximo:** Si se especificó, mostrar aviso rojo cuando se exceda.

4. **localStorage:** Guardar carrito cuando cliente hace cambios. Al volver, cargar desde localStorage si existe.

5. **Módulos mínimos:** Cliente debe tener AL MENOS 1 módulo. No permitir "carrito vacío".

6. **Payment Intent:** Crear nuevo para cada intento de pago (NO reutilizar si expira).

7. **Webhook timeout:** Stripe intenta webhook por 3 días. Si falla, email de fallback a Vic.

8. **Segunda mitad (50%):** Se paga cuando kickoff call confirma inicio. Dejar para B.4.6.

---

**Created:** 2026-06-02  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1-4 COMPLETADOS  
**Next:** After completion → B.4.6 KICKOFF (Contrato + segundo pago)
