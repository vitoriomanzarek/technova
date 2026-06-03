# 🔄 COMMERCIAL FLOW — Lead to Payment (TechNova v1.0)

**Status:** 📋 DRAFT (para refinar con Vic)  
**Last Updated:** 2026-06-02  
**Owner:** Vic + Claude  

---

## 📐 DIAGRAMA FLUJO GENERAL

```
┌─────────────────────────────────────────────────────────────────────┐
│ LEAD ENTRA (Homepage, Google Ads, Lead Magnet)                      │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 1: LEAD CAPTURE                                               │
│ Dónde: /start-project (Wizard NOVA AI o form manual)               │
│ Qué pasa: Usuario contesta preguntas → datos van a DB              │
│ Status lead: "nueva" → "capturada"                                 │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 2: AUDITORÍA AUTOMÁTICA (IA)                                  │
│ Dónde: Backend async job + NOVA AI                                 │
│ Qué: IA visita sitio web del cliente → checklist 17 puntos        │
│ Output: Audit report con score 0-100                               │
│ Status lead: "en_auditoria" → "auditoria_completa"                 │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 3: GENERACIÓN DE PROPUESTA (IA)                               │
│ Dónde: Claude Haiku + catalog.ts                                   │
│ Qué: IA genera propuesta automática basada en:                     │
│   - Resultado auditoría                                            │
│   - Respuestas del usuario (presupuesto, timeline, prioridades)    │
│   - catalog.ts (componentes + precios en MXN)                      │
│ Output: Propuesta JSON con módulos seleccionados + precio total    │
│ Status lead: "propuesta_generada"                                  │
│ Estado propuesta: "pendiente_revision_vic"                         │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 4: REVISIÓN & APROBACIÓN (VIC)                                │
│ Dónde: Dashboard admin interno (panel Vic)                         │
│ Qué: Vic ve propuesta generada, puede:                            │
│   a) Aprobar tal cual                                              │
│   b) Modificar módulos/precio                                      │
│   c) Rechazar (crear note por qué)                                │
│ Output: Propuesta finalizada + JSON actualizado                    │
│ Status propuesta: "aprobada" o "rechazada"                         │
└────────────────┬────────────────────────────────────────────────────┘
                 │
           ┌─────┴──────┐
           │             │
      APROBADA       RECHAZADA
           │             │
           ▼             ▼
      ┌─────────┐   ┌────────────┐
      │ STAGE 5 │   │ Auto-email │
      └─────────┘   │ "Revisando"│
                    └────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 5: PROPUESTA A CLIENTE                                        │
│ Dónde: Email + landing privado (/propuesta/{uuid})                 │
│ Qué se envía:                                                       │
│   - PDF propuesta (generado con datos de propuesta JSON)           │
│   - Link a checkout con propuesta preseleccionada                  │
│   - Resumen en email personalizado                                 │
│ Status lead: "propuesta_enviada_cliente"                           │
│ Status propuesta: "en_revision_cliente"                            │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 6: CLIENTE REVISA & CUSTOMIZA (ECOMMERCE DINÁMICO)           │
│ Dónde: /checkout/{propuesta_uuid}                                  │
│ Qué: Cliente ve:                                                    │
│   - Módulos propuestos (preseleccionados)                          │
│   - Puede QUITAR módulos (menos precio)                            │
│   - Puede AGREGAR módulos a la carte (más precio)                  │
│   - Precio se recalcula en vivo                                    │
│   - Timeline estimado se actualiza                                 │
│ Output: Carrito final con módulos elegidos + precio final          │
│ Status propuesta: "cliente_customizando" o "cliente_confirmada"    │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 7: PAGO (STRIPE)                                              │
│ Dónde: Stripe checkout (embed o modal)                             │
│ Qué: Cliente paga con:                                              │
│   - Tarjeta crédito/débito                                         │
│   - Puede ser pago 100% o 50% + 50% al iniciar (configurable)     │
│ Output: Transacción Stripe confirmada                              │
│ Status lead: "cliente_pagado"                                      │
│ Status propuesta: "paid"                                           │
│ Status proyecto: "iniciado" (en DB proyectos)                      │
└────────────────┬────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STAGE 8: ONBOARDING                                                 │
│ Dónde: /cliente/dashboard                                          │
│ Qué: Cliente recibe:                                                │
│   - Acceso a dashboard privado                                     │
│   - Contrato digital (DocuSign o simple PDF)                       │
│   - Kickoff call scheduling                                        │
│   - Roadmap de 4 semanas                                           │
│ Status proyecto: "onboarding_iniciado"                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 ESTADOS DE LEAD & PROPUESTA

### Estados de LEAD (tabla leads)
```
Estado              Descripción                          Quién lo cambia
─────────────────────────────────────────────────────────────────────
nueva               Lead acaba de llegar                 Form submission
capturada           Datos completados en form            User completes form
en_auditoria        Auditoría IA corriendo               Background job
auditoria_completa  Audit report listo                   IA job completes
propuesta_generada  Propuesta IA creada, en revisión Vic AI generation
propuesta_rechazada Vic rechazó, lead perdido           Vic clicks reject
propuesta_enviada   Enviada a cliente                   Vic approves
cliente_viendo      Cliente abrió email/propuesta       Email open (track)
cliente_en_checkout Cliente customizando paquete        Checkout start (track)
cliente_pagado      Pago Stripe confirmado              Stripe webhook
perdido             Cliente no completó en X días       Cron job (30d timeout)
```

### Estados de PROPUESTA (tabla proposals)
```
Estado                  Descripción
─────────────────────────────────────────────────────
pendiente_revision_vic  IA generó, esperando Vic
aprobada                Vic aprobó tal cual
modificada              Vic modificó módulos/precio
rechazada               Vic rechazó con nota
enviada_cliente         Email enviado, esperando cliente
cliente_viendo          Cliente abrió propuesta
cliente_customizando    Cliente en checkout modificando
cliente_confirmada      Cliente aprobó carrito final
pagada                  Pago Stripe completado
cancelada               Cliente canceló antes de pagar
```

---

## 🔌 INTEGRACIONES TÉCNICAS

### 1. LEAD CAPTURE (Stage 1)
**Endpoint:** `POST /api/leads/create`

**Input:**
```json
{
  "nombre": "Juan García",
  "email": "juan@empresa.mx",
  "empresa": "Acme Corp",
  "sitio_web": "https://acme-corp.mx",
  "presupuesto_estimado": "40000",
  "timeline": "8 semanas",
  "problemas_actuales": "Sin conversiones, sin mobile, lento",
  "prioridades": ["diseño", "velocidad", "mobile"],
  "source": "google-ads" | "homepage" | "blog"
}
```

**Output:**
```json
{
  "lead_id": "uuid",
  "status": "capturada",
  "audit_job_id": "job-uuid",
  "next_step": "Auditoría en progreso, recibirás email en 24h"
}
```

**BD:** tabla `leads` + trigger que inicia audit job async

---

### 2. AUDITORÍA AUTOMÁTICA (Stage 2)
**Stack:** Claude Haiku + Puppeteer (headless browser)

**Proceso:**
1. Backend job recibe `lead_id` + `sitio_web`
2. Puppeteer visita sitio (simula usuario real)
3. Extrae datos: rendimiento, meta tags, estructura, formatos, etc.
4. Claude Haiku procesa output Puppeteer
5. Genera reporte JSON con checklist 17 puntos + score

**Reporte output:**
```json
{
  "audit_id": "uuid",
  "lead_id": "uuid",
  "site_url": "https://acme-corp.mx",
  "score": 42,
  "timestamp": "2026-06-02T14:30:00Z",
  "findings": [
    {
      "item": "Lighthouse Performance",
      "status": "rojo", // verde/amarillo/rojo
      "score": 28,
      "recomendacion": "Optimizar imágenes y CSS crítico"
    },
    // ... 16 items más
  ],
  "summary": "El sitio tiene graves problemas de velocidad y mobile. Necesita redesign + optimization."
}
```

**BD:** tabla `audits` + update lead status → "auditoria_completa"

---

### 3. PROPUESTA AUTOMÁTICA (Stage 3)
**Stack:** Claude Haiku + catalog.ts + propuesta template

**Entrada:**
```
- audit_report (JSON)
- lead preferences (presupuesto, timeline, prioridades)
- catalog.ts (56 componentes con precios MXN)
```

**Prompt para Claude Haiku:**
```
Eres un asesor de proyectos web experto.

Basado en esta auditoría y preferencias del cliente, 
selecciona los módulos (de catalog.ts) que mejor se alinean.

Restricciones:
- Respeta el presupuesto máximo del cliente
- Prioriza los items más críticos primero
- Calcula tiempo estimado basado en catálogo
- Proporciona justificación clara para cada módulo

Output: JSON con estructura proposal
```

**Propuesta generada:**
```json
{
  "proposal_id": "uuid",
  "lead_id": "uuid",
  "created_at": "2026-06-02T15:00:00Z",
  "status": "pendiente_revision_vic",
  
  "resumen": "Propuesta inicial para Acme Corp",
  "razonamiento": "Basado en audit score 42 y presupuesto $40K, se recomienda...",
  
  "modulos_seleccionados": [
    {
      "modulo_id": "MOD-DESIGN-01",
      "nombre": "Identidad Completa",
      "componentes": ["VI-01", "VI-02", "VI-03", "VI-05"],
      "precio_total": 8500,
      "horas": 28,
      "justificacion": "El cliente necesita redesign completo. Identidad débil contribuye a conversión baja."
    },
    {
      "modulo_id": "MOD-DEV-PERFORMANCE",
      "nombre": "Landing Page Optimizada",
      "componentes": ["DV-01", "DV-03", "SE-05"],
      "precio_total": 9200,
      "horas": 25,
      "justificacion": "Lighthouse score muy bajo. Necesita optimización crítica."
    }
    // ... más módulos
  ],
  
  "precio_total": 38900,
  "horas_totales": 92,
  "timeline_estimado_dias": 21,
  "fecha_entrega_estimada": "2026-06-23",
  
  "presupuesto_cliente": 40000,
  "diferencia": 1100,
  "observacion": "Propuesta está dentro del presupuesto"
}
```

**BD:** tabla `proposals` + update lead status → "propuesta_generada"

---

### 4. REVISIÓN VIC (Stage 4)
**UI:** Dashboard admin interno (NUEVA PÁGINA)

**Qué ve Vic:**
- Tarjeta con datos del lead (nombre, empresa, problemas)
- Audit report visual
- Propuesta IA generada (módulos + precios)
- Botones: "Aprobar", "Modificar", "Rechazar"

**Si Vic modifica:**
- Puede quitar módulos
- Puede agregar módulos (a la carte)
- Precio se recalcula automáticamente
- Puede agregar nota interna "Por qué cambié esto"

**Si Vic aprueba:**
- Status propuesta → "aprobada"
- Trigger: enviar propuesta a cliente (Stage 5)

**Si Vic rechaza:**
- Status propuesta → "rechazada"
- Trigger: enviar email a cliente "Estamos revisando, te contactaremos en 24h"
- Lead va a follow-up manual de Vic

---

### 5. PROPUESTA A CLIENTE (Stage 5)
**Stack:** React PDF generator + Resend email

**Email enviado:**
```
Asunto: Tu propuesta TechNova está lista — Acme Corp

Hola Juan,

Hemos revisado tu auditoría web y creamos una propuesta personalizada
para los próximos 21 días.

📊 Resumen:
- Precio: $38,900 MXN
- Timeline: 21 días
- Módulos: Identidad + Landing optimizada + SEO

Ver propuesta completa: [LINK a /propuesta/{uuid}]

Siguiente paso: Aprueba tu propuesta y comienza hoy.

Preguntas? Contáctanos en hello@tech-nova.mx
```

**Landing /propuesta/{uuid}:**
- Propuesta PDF inline (o descargable)
- Botón: "Ir a checkout" → redirige a /checkout/{proposal_uuid}
- Opción: "Quiero hablar primero" → booking call con Vic

**BD:** update proposal status → "enviada_cliente" + timestamp

---

### 6. ECOMMERCE DINÁMICO (Stage 6)
**Ubicación:** `/checkout/{proposal_uuid}`

**Stack:** React + catalog.ts + Stripe

**Qué ve cliente:**
- Módulos propuestos (checkbox, preseleccionados)
- Puede QUITAR módulos (unchecked)
- Puede VER módulos a la carte disponibles (collapsed accordion)
- Al seleccionar/deseleccionar: precio recalcula en vivo
- Timeline estimado se actualiza automáticamente

**Carrito:**
```json
{
  "proposal_uuid": "uuid",
  "modulos_seleccionados": [
    "MOD-DESIGN-01",
    "MOD-DEV-PERFORMANCE"
  ],
  "modulos_a_la_carte": [],
  
  "precio_subtotal": 38900,
  "descuento": 0,
  "precio_final": 38900,
  
  "horas_totales": 92,
  "dias_estimados": 21,
  "fecha_inicio": "2026-06-03",
  "fecha_entrega": "2026-06-24"
}
```

**Botón:** "Proceder al pago" → redirige a Stripe

---

### 7. PAGO (Stage 7)
**Stack:** Stripe Checkout (embed)

**Opciones de pago (configurable):**
- Opción A: Pago 100% al contratación
- Opción B: 50% ahora + 50% al iniciar (Vic configura)

**Webhooks Stripe:**
```
payment_intent.succeeded
→ webhook endpoint /api/webhooks/stripe
→ update proposal status → "pagada"
→ create proyecto en DB
→ update lead status → "cliente_pagado"
→ trigger email "Bienvenido al equipo"
```

**Datos guardados:**
```json
{
  "payment_id": "stripe_payment_intent_id",
  "lead_id": "uuid",
  "proposal_id": "uuid",
  "amount": 38900,
  "currency": "MXN",
  "status": "succeeded",
  "customer_email": "juan@empresa.mx",
  "timestamp": "2026-06-02T16:00:00Z"
}
```

---

### 8. ONBOARDING (Stage 8)
**Landing:** `/cliente/dashboard?proyecto_id={uuid}`

**Qué recibe cliente:**
1. Email de bienvenida con link a dashboard
2. Acceso a `/cliente/dashboard` con:
   - Resumen del proyecto
   - Roadmap 4 semanas (visual timeline)
   - Documentos: Contrato, brief, referencias
   - Botón: "Agendar kickoff call"
   - Botón: "Acceder a repo/Figma/assets" (si aplica)

3. Email de kickoff call: "Tu sesión es el [fecha]"

---

## 🗄️ ESQUEMA BD NECESARIO

### Tabla: leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  nombre VARCHAR,
  empresa VARCHAR,
  sitio_web VARCHAR,
  presupuesto_estimado DECIMAL,
  timeline VARCHAR,
  problemas TEXT,
  prioridades JSON,
  source VARCHAR,
  status VARCHAR, -- nueva, capturada, en_auditoria, etc.
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Tabla: audits
```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  site_url VARCHAR,
  score INT, -- 0-100
  findings JSON, -- array de items con status
  summary TEXT,
  created_at TIMESTAMP
);
```

### Tabla: proposals
```sql
CREATE TABLE proposals (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  audit_id UUID REFERENCES audits(id),
  status VARCHAR, -- pendiente_revision_vic, aprobada, etc.
  modulos_seleccionados JSON, -- array de module IDs
  precio_total DECIMAL,
  horas_totales INT,
  timeline_dias INT,
  fecha_entrega_estimada DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  aprobado_por UUID, -- Vic's user_id
  aprobado_at TIMESTAMP,
  notas_internas TEXT -- Vic's notes on modifications
);
```

### Tabla: proyectos (projects)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  proposal_id UUID REFERENCES proposals(id),
  payment_id VARCHAR, -- Stripe payment_intent_id
  status VARCHAR, -- onboarding, en_ejecucion, completado
  inicio_estimado DATE,
  fin_estimado DATE,
  cliente_email VARCHAR,
  cliente_nombre VARCHAR,
  created_at TIMESTAMP
);
```

---

## 📧 EMAIL SEQUENCES POR STAGE

### Correos automáticos necesarios:
1. **Lead capture:** "Hemos recibido tu solicitud"
2. **Auditoría iniciada:** "Estamos auditando tu sitio"
3. **Propuesta lista:** "Tu propuesta personalizada está lista"
4. **Pago confirmado:** "¡Bienvenido al equipo TechNova!"
5. **Onboarding kickoff:** "Tu primera sesión es el..."
6. **Propuesta rechazada:** "Estamos revisando, nos contactaremos"
7. **Carrito abandonado:** "Tu carrito expira en 24h"

---

## 🎯 CASOS ESPECIALES

### Caso 1: Cliente modifica propuesta antes de pagar
- Cliente en `/checkout/{uuid}` quita módulos
- Precio cambia de $38,900 → $25,000
- ¿Se guarda el carrito modificado o se desecha la propuesta original?
  - **Opción A:** Nuevo carrito se convierte en "contrapropuesta del cliente"
  - **Opción B:** Se permite, Vic ve el cambio en el dashboard post-pago

### Caso 2: Cliente paga pero no llena info crítica en onboarding
- Pago Stripe confirmado pero cliente no accede a dashboard en 48h
- Trigger: Email reminder "Tu proyecto está esperando"
- Si no responde en 7 días: Vic es notificado (lead en riesgo)

### Caso 3: Vic rechaza propuesta, cliente insiste
- Cliente intenta acceder a /checkout/{uuid} pero status="rechazada"
- Redirect a: "Estamos trabajando en tu proyecto, Vic te contactará pronto"
- Vic recibe notificación: "Cliente quiere continuar, qué hacemos?"

### Caso 4: Lead no llena completamente el formulario de captura
- Cliente entra a /start-project pero se va
- Lead incompleto en BD con status="nueva"
- Cron job: Si no se completa en 3 días, email: "¿Necesitas ayuda?"

---

## ⚠️ DECISIONES PENDIENTES

1. **Propuesta IA: ¿Siempre se genera automática o Vic decide?**
   - Actual: Siempre se genera, Vic revisa/modifica
   - Alternativa: Vic podría rechazar auditoría antes de que IA genere propuesta

2. **Ecommerce dinámico: ¿Cliente puede agregar módulos además de remover?**
   - Actual: Sí, a la carte
   - Alternativa: Solo puede quitar, no agregar (Vic decide qué ofrecer)

3. **Pago: ¿50% + 50% o 100% al firmar?**
   - Configurable por Vic en dashboard
   - ¿Cuál es el default?

4. **Dashboard cliente: ¿Acceso automático después del pago o Vic debe activar?**
   - Actual: Automático (mejor UX)
   - Alternativa: Vic aprueba manualmente

5. **Auditoría: ¿Cómo maneja sitios protegidos con login?**
   - ¿Puppeteer intenta login? ¿Pregunta credenciales?
   - ¿O solo audita homepage pública?

6. **Timeout: ¿Cuánto tiempo la propuesta sigue válida?**
   - 7 días? 14 días? ¿Infinite?
   - ¿Se notifica al cliente antes de expirar?

---

## 🚀 NEXT STEPS

1. ✅ Definir decisiones pendientes ☝️
2. ✅ Refinar roles: ¿Cuánta intervención Vic en cada stage?
3. ✅ Especificar dashboard interno para Vic (página nueva)
4. ✅ Validar integraciones (Stripe webhook, Puppeteer setup, Claude Haiku quota)
5. ✅ Crear prompts para Claude Haiku (auditoría + propuesta)
6. ✅ Crear email templates para cada stage
7. ✅ Crear endpoints API faltantes

---

**Created:** 2026-06-02  
**Status:** 📋 DRAFT (refinement needed)  
**For:** Vic + Development Team
