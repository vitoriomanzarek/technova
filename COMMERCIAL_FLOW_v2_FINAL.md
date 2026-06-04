# 🔄 COMMERCIAL FLOW v2 — FINAL ARCHITECTURE

**Status:** ✅ FINAL (validado con Vic)  
**Last Updated:** 2026-06-02  
**Owner:** Vic + Claude  
**Base:** COMMERCIAL_FLOW.md + COMMERCIAL_FLOW_ANALYSIS.md + research "1 Million Dollar Landing Page"

---

## 📐 PANORAMA: TRES ENTRY POINTS, UN FLUJO

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TECHNOVA COMMERCIAL FLOW v2                         │
│                  Awareness → Consideration → Conversion → Loyalty        │
└─────────────────────────────────────────────────────────────────────────┘

ENTRY POINT 1                ENTRY POINT 2                ENTRY POINT 3
════════════════            ════════════════              ════════════════

Lead Magnet                 /contacto                     /cotizador
(Homepage)                  (Página contacto)             (Wizard renombrado)

"Auditoría Gratis"          "Cuéntame tu proyecto"        "Cotiza al instante"

Lead: COLD                  Lead: WARM                    Lead: HOT
Intent: Curiosidad          Intent: Preguntas             Intent: Propuesta

│                           │                             │
├─ Email captura            ├─ Email                      ├─ Wizard
├─ PDF descarga             ├─ Nombre                     ├─ Segmento
│  automático               ├─ Mensaje abierto            ├─ Questionnaire
├─ Lead guardado            │                             ├─ Auto-calculation
│  BD (status: cold)         ├─ Lead guardado             ├─ Lead guardado
│                            │  BD (status: warm)         │  BD (status: hot)
├─ Email secuencia         │                             │
│  5 emails, 14 días       ├─ Auto-respuesta             ├─ Instant feedback
│                          │  "Vic te contacta 24h"      ├─ Preview propuesta
└─ NURTURING               │                             │
   (abierto)               └─ Vic ENTREVISTA             └─ Next: Refinación
                              (vía email/WhatsApp)
                           
                           ├─ Vic rellena cuestionario
                           │  UNIVERSAL
                           │
                           ├─ Vic prepara propuesta
                           │  (misma lógica catalog.ts)
                           │
                           └─ Propuesta enviada
                              (igual flujo que HOT)
```

---

## 📊 FLUJO DETALLADO: 8 STAGES

### STAGE 1: LEAD CAPTURE (Entry Point específico)

**Para COLD (LeadMagnet):**
- Email solo
- PDF descarga automática
- Status lead: "cold"

**Para WARM (/contacto):**
- Email, Nombre, Mensaje abierto
- Auto-respuesta: "Vic en 24h"
- Status lead: "warm"

**Para HOT (/cotizador):**
- Full questionnaire (wizard)
- Segmento + opciones específicas
- Status lead: "hot"

**BD:** Tabla `leads`
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  phone VARCHAR,
  message TEXT,
  website_url TEXT,
  project_type VARCHAR, -- auditoria-web, contacto, despegue, orbita, mision
  lead_quality VARCHAR, -- cold, warm, hot
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

### STAGE 2: QUALIFICATION (Diferente por temperatura)

**COLD Leads (LeadMagnet):**
- No pasa por aquí aún
- Entra a nurturing email
- SI cliente responde → pasa a WARM

**WARM Leads (/contacto):**
- Vic entrevista por email/WhatsApp
- Vic rellena cuestionario UNIVERSAL (en CRM/Airtable)
- Vic decide: ¿merece auditoría automática o propuesta manual?
- → Pasa a STAGE 3

**HOT Leads (/cotizador):**
- Questionnaire = qualification automática
- Datos completos = automático pasa a STAGE 3

---

### STAGE 3: AUDITORÍA (Si aplica)

**Stack:** Puppeteer + Claude Haiku

**Proceso:**
1. Backend job: recibe website_url
2. Puppeteer: visita sitio, extrae datos
3. Claude Haiku: genera reporte 17 puntos
4. Guardado: tabla `audits`
5. Status lead: "audit_complete"

**Output:**
```json
{
  "audit_id": "uuid",
  "lead_id": "uuid",
  "site_url": "https://...",
  "score": 42,
  "findings": [
    {"item": "Performance", "status": "rojo", "score": 28},
    // ... 16 items más
  ],
  "summary": "El sitio necesita redesign + optimization"
}
```

**Nota:** Solo si cliente tiene sitio web actual. Si no → saltar a STAGE 4 (propuesta sin auditoría).

---

### STAGE 4: PROPUESTA AUTOMÁTICA (IA)

**Stack:** Claude Haiku + catalog.ts

**Entrada:**
- audit_report (si existe)
- lead preferences (presupuesto, timeline, prioridades)
- website status (tiene sitio, qué necesita)

**Proceso:**
1. Claude Haiku procesa datos
2. Selecciona módulos óptimos del catalog.ts
3. Respeta presupuesto máximo
4. Calcula precio total (sum componentes + PM 20%)
5. Genera timeline estimado
6. Genera JSON estructura propuesta

**Output:**
```json
{
  "proposal_id": "uuid",
  "lead_id": "uuid",
  "modulos_seleccionados": [
    {
      "modulo_id": "MOD-DESIGN-01",
      "nombre": "Identidad Completa",
      "componentes": ["VI-01", "VI-02", "VI-03"],
      "precio": 8500,
      "horas": 28
    },
    // ... más módulos
  ],
  "precio_total": 38900,
  "horas": 92,
  "timeline_dias": 21,
  "justificacion": "..."
}
```

**Status lead:** "proposal_generated"
**Status propuesta:** "pending_vic_review"

---

### STAGE 5: REVISIÓN VIC (Dashboard Admin)

**Ubicación:** `/admin/proposals-review`

**Qué ve Vic:**
- Datos del lead
- Audit report (si existe)
- Propuesta IA generada

**Qué puede hacer Vic:**
1. ✅ **Aprobar tal cual** → propuesta final
2. 🔧 **Modificar** → quitar/agregar módulos, ajustar precio
3. ❌ **Rechazar** → lead archivado (puede reactivar)

**Si modifica:**
- Precio recalcula automáticamente
- Timeline actualiza
- Puede dejar nota interna

**Output:**
- Status propuesta: "approved" O "rejected" O "modified"
- Propuesta JSON actualizada (si modificó)

---

### STAGE 6: PROPUESTA A CLIENTE

**Canales:** Email + Landing privado

**Email enviado:**
- Subject: "Tu propuesta TechNova está lista"
- Body: Resumen + CTA "Ver propuesta"
- Link: `/propuesta/{uuid}`

**Landing `/propuesta/{uuid}`:**
- Propuesta PDF (generado dinámicamente de JSON)
- Resumen visual: módulos, precio, timeline
- Botón: "Ir a cotizador personalizado"
- Botón: "Reservar llamada" (Calendly embed)
- Footer: contacto directo (WhatsApp, email)

**Status lead:** "proposal_sent"
**Status propuesta:** "client_reviewing"

**Timeout:** 14 días. Si no responde:
- Día 10: Email reminder "3 días para confirmar"
- Día 14: Propuesta expira, email "Propuesta vence"
- Opción: Cliente puede extender (email a Vic)

---

### STAGE 7: REFINACIÓN (Ecommerce Dinámico)

**Ubicación:** `/propuesta/{uuid}/refine` + `/checkout/{uuid}`

**Cliente ve:**
- Módulos propuestos (checkboxes, preseleccionados)
- Para CADA módulo: descripción, precio, timeline
- Botón: "Solicitar cambios" (si quiere ajustes)
- Botón: "Proceder al pago"

**Si cliente quita módulos:**
- Precio ↓ (recalcula en vivo)
- Timeline ↓ (actualiza)
- Carrito se actualiza

**Si cliente AGREGA módulos a la carte:**
- Módulos disponibles (todos los de catalog.ts)
- Precio ↑ (recalcula)
- Timeline ↑ (actualiza)
- Carrito se actualiza

**Si cliente solicita cambios:**
- Email a Vic: "Cliente solicitó ajustes"
- Vic aprueba/rechaza en panel
- Propuesta nueva se genera
- Cliente recibe "Propuesta actualizada"

**Si cliente confirma carrito:**
- Status propuesta: "client_confirmed"
- → Pasa a STAGE 8

---

### STAGE 8: CONTRATO + PAGO

**Contrato (Local):**
- PDF generado con datos de propuesta
- Términos estándar TechNova
- Cliente: firma (checkbox "Acepto términos")
- Vic: firma digital manual (después)
- Guardado en BD (tabla `contracts`)

**Pago (Stripe):**
- Opción 1: 100% ahora
- Opción 2: 50% ahora + 50% al iniciar proyecto
- **Default:** 50%+50% (configurable por Vic en panel)

**Stripe Checkout:**
- Carrito preseleccionado con propuesta
- Monto = 50% (si 50%+50%)
- Webhook: `payment_intent.succeeded`
- Crea registro tabla `orders`
- Crea registro tabla `projects` (status: "initiated")

**Status lead:** "customer_paid"
**Status propuesta:** "paid"
**Status proyecto:** "onboarding_pending"

---

### STAGE 9: ONBOARDING

**Automático post-pago:**
- Email: "¡Bienvenido! Tu proyecto inicia el..."
- Email: "Acceso a tu dashboard"
- Dashboard: `/cliente/dashboard?proyecto_id={uuid}`

**Cliente ve:**
- Resumen proyecto
- Roadmap 4 semanas (visual timeline)
- Documentos: Contrato, brief, referencias
- Link: Calendly para kickoff call
- Contacto directo: email, WhatsApp, teléfono

**Vic ve (panel interno):**
- Nuevo proyecto en lista
- Status: "onboarding"
- Próxima acción: "Agendar kickoff call"

**Status proyecto:** "onboarding_initiated"

---

## 📧 EMAIL SEQUENCES (AUTOMÁTICO)

### Secuencia LeadMagnet (COLD → WARM)

```
Día 1: Welcome + "Aquí tu auditoría"
Día 3: Education "3 errores comunes"
Día 7: Soft sell "¿Hablamos de tu web?"
Día 10: CTA "Usa nuestro cotizador"
Día 14: Final "Propuesta especial si actúas hoy"
```

### Secuencia Propuesta (WARM → HOT)

```
Día 0: "Tu propuesta está lista"
Día 3: "¿Tienes dudas?"
Día 7: "Propuesta vence hoy"
Día 8: "Reserva una llamada" (Calendly)
Día 14: "Propuesta expirada, ¿la renovamos?"
```

### Secuencia Post-Pago (ONBOARDING)

```
Inmediato: "¡Bienvenido! Acceso a dashboard"
Día 1: "Kickoff call: [fecha/hora]"
Día 3: "¿Alguna pregunta antes de kickoff?"
Día 7: "Iniciamos el proyecto mañana"
Día 28: "Avance: 1ª entrega" (project tracking)
```

---

## 🎯 DECISIONES FINALES (VALIDADAS)

| # | Decisión | Elección |
|---|----------|----------|
| 1 | Auditoría sitios con login | Solo homepage pública + disclaimer |
| 2 | ¿Siempre genera propuesta IA? | Sí, siempre. Vic puede rechazar |
| 3 | Cliente agrega módulos | Sí, puede agregar/quitar |
| 4 | Pago: 100% vs 50%+50% | Default 50%+50% (configurable) |
| 5 | PDF propuesta dinámica | Sí, reflejamodificaciones Vic |
| 6 | Dashboard acceso | Automático post-pago |
| 7 | Timeout propuesta | 14 días + reminder día 10 |
| 8 | Follow-up secuencias | Automáticas + ganchos para manual |
| 9 | Scheduling | Calendly Pro ($12/mes) MVP |
| 10 | Contrato | Local PDF + checkbox firma (MVP) |
| 11 | Precios | Fijos (catalog.ts), modulares |
| 12 | 3 Entry Points | Mantener (COLD, WARM, HOT routing) |

---

## 🗄️ TABLAS BD NECESARIAS

**Nuevas (vs schema.ts actual):**

```sql
-- Tabla propuestas
CREATE TABLE proposals (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  audit_id UUID REFERENCES audits(id),
  status VARCHAR, -- pending_vic_review, approved, rejected, modified, client_reviewing, client_confirmed, paid
  modulos_seleccionados JSON, -- array module IDs
  precio_total DECIMAL,
  horas_totales INT,
  timeline_dias INT,
  fecha_entrega_estimada DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  aprobado_por UUID, -- Vic's user_id
  aprobado_at TIMESTAMP,
  notas_internas TEXT
);

-- Tabla auditorías
CREATE TABLE audits (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  site_url VARCHAR,
  score INT, -- 0-100
  findings JSON, -- array de items
  summary TEXT,
  created_at TIMESTAMP
);

-- Tabla proyectos
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

-- Tabla contratos
CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  pdf_url TEXT,
  status VARCHAR, -- draft, signed_client, signed_vic, final
  created_at TIMESTAMP,
  signed_at TIMESTAMP
);
```

---

## 🚀 IMPLEMENTATION ROADMAP (B.4 en BACKLOG)

### B.4.1: Auditoría Automática (Puppeteer + Claude Haiku)
- Setup Puppeteer
- Prompt Claude Haiku
- Tabla `audits` en DB
- Background job trigger
- Email notificación a Vic

### B.4.2: Propuesta IA Automática
- Claude Haiku prompt (módulos + precios)
- JSON propuesta generada
- Tabla `proposals` en DB
- Validación: respeta presupuesto
- Email a Vic: "Propuesta lista para revisar"

### B.4.3: Panel Vic (Dashboard Admin)
- Página `/admin/proposals-review`
- Muestra: lead + audit + propuesta
- Botones: Aprobar / Modificar / Rechazar
- Si modifica: precio recalcula, nota interna
- Tabla de histórico

### B.4.4: Envío Propuesta a Cliente
- Email con propuesta
- Landing `/propuesta/{uuid}`
- PDF generado dinámicamente (React PDF)
- Botones: Ver cotizador, Reservar call
- Timeout 14 días + reminders

### B.4.5: Ecommerce Dinámico
- Página `/checkout/{uuid}`
- Cliente quita/agrega módulos
- Precio recalcula en vivo
- Timeline actualiza
- Botón: "Solicitar cambios" (email a Vic)

### B.4.6: Integración Stripe
- Payment Intent desde carrito
- Webhook `/api/webhooks/stripe`
- Crear `projects` record
- Email bienvenida automático
- Crea tabla `contracts` (draft)

### B.4.7: Onboarding Cliente
- Dashboard `/cliente/dashboard`
- Resumen proyecto + roadmap
- Calendly embed para kickoff
- Email secuencias automáticas

### B.4.8: Lead Management & Tracking
- Estados de lead/propuesta claros
- CRM (Airtable MVP → custom después)
- Calendly Pro setup
- Email workflows (sequences automáticas)

---

## 🎯 SUCCESS METRICS (Fase B.4)

**Lead Quality:**
- Hot leads (cotizador): conversión >30%
- Warm leads (contacto): conversión 15-20%
- Cold leads (magnet): conversión 2-5% (pero cheaper, scale)

**Cycle Time:**
- Hot → Pago: 3-5 días
- Warm → Pago: 7-14 días
- Cold → Pago: 30+ días (after nurturing)

**Revenue:**
- MRR target (Oct 2026): $5,000-$10,000
- AVG project value: $18,000-$40,000
- Payout ratio: 50% inicial, 50% inicio

---

**Created:** 2026-06-02  
**Status:** ✅ FINAL (Vic validated)  
**Next:** IMPLEMENTATION (Fase B.4, semana 1-8)
