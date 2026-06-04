# 🎯 ANÁLISIS Y PROPUESTA: FLUJO DE VENTA (Commercial Flow)

**Fecha:** 2026-06-02  
**Status:** 📋 ANÁLISIS EJECUTIVO (para validar con Vic)  
**Propósito:** Validar que el flujo tenga sentido comercial y técnico antes de implementar

---

## 📊 PANORAMA DEL FLUJO (8 STAGES)

### ESTADO ACTUAL: ✅ BIEN DEFINIDO

```
Lead entra
    ↓
[1] Lead Capture → Usuario completa form → datos a DB
    ↓
[2] Auditoría IA → Puppeteer + Claude Haiku → score 0-100
    ↓
[3] Propuesta IA → Claude Haiku + catalog.ts → JSON propuesta
    ↓
[4] Vic Revisa → Panel admin Vic → aprueba/modifica/rechaza
    ↓
[5] Cliente Recibe → Email + landing /propuesta/{uuid}
    ↓
[6] Ecommerce Dinámico → Cliente quita/agrega módulos → precio vivo
    ↓
[7] Pago Stripe → 100% o 50%+50% → webhook confirma
    ↓
[8] Onboarding → Dashboard cliente + kickoff call
```

---

## 🎯 VALIDACIÓN: LO QUE ESTÁ BIEN

| Elemento | Status | Razón |
|----------|--------|-------|
| **Arquitectura 8-stage** | ✅ Lógica | Flujo lineal + punto de control (Vic en Stage 4) |
| **Auditoría automática** | ✅ Viable | Puppeteer + Claude Haiku es estándar industria |
| **Propuesta automática** | ✅ Viable | Claude Haiku + catalog.ts puede generar JSON |
| **Ecommerce dinámico** | ✅ Realista | React + catalog.ts permite recalcular en vivo |
| **Estados de lead/propuesta** | ✅ Completo | Matriz 10+8 estados cubre todos los caminos |
| **Integraciones técnicas** | ✅ Especificado | Endpoints, webhooks, BD schemas claros |

---

## ⚠️ PUNTOS CRÍTICOS DE DECISIÓN

### 1️⃣ AUDITORÍA: ¿Cómo maneja sitios protegidos con login?

**Problema:** Puppeteer solo ve lo que está público. Si un sitio requiere login...

**Opciones:**

| Opción | Pro | Con | Impacto |
|--------|-----|-----|---------|
| **A: Solo audita homepage pública** | Rápido, simple | No ve contenido privado | ⚠️ MEDIA — clientes con intranet quedarían sin auditoría completa |
| **B: Pedir credenciales al cliente** | Auditoría completa | UX pésima, seguridad (credenciales en form) | 🔴 ALTA — complicado de implementar seguro |
| **C: Solo audita homepage, con disclaimer** | Simple, honesto | Cliente sabe que es limitado | ✅ RECOMENDADO |

**Recomendación:** Opción C — auditoría homepage pública, con nota clara "Esta auditoría cubre la página pública. Áreas privadas requieren revisión manual."

---

### 2️⃣ PROPUESTA IA: ¿Siempre genera automática o Vic puede bloquearla?

**Escenario:** Lead entra con presupuesto $2,000 (muy bajo para cualquier proyecto real)

**Opciones:**

| Opción | Flujo | Pros | Contras |
|--------|-------|------|---------|
| **A: Siempre genera** (actual) | Audit → Propuesta IA (aunque sea mala) → Vic revisa | Agresivo, lead siempre ve opciones | Vic pierde control temprano |
| **B: Vic decide si genera** | Audit → Vic dice "sí/no" → Si sí, propuesta IA | Vic controla antes de IA | Lead espera 2 pasos, más lento |
| **C: Propuesta IA con flag de confianza** | Audit → Propuesta IA (pero marca si es "low confidence") → Vic ve warning | Balance | Requiere lógica de confianza en IA |

**Recomendación:** Opción A (actual es buena) — pero Vic puede rechazar y pasar a conversación manual si propuesta no tiene sentido.

---

### 3️⃣ ECOMMERCE DINÁMICO: ¿Cliente AGREGA módulos o SOLO quita?

**Escenario:** Vic propone ["Landing Page", "SEO"] por $25K. Cliente entra a checkout...

**Opciones:**

| Opción | Cliente ve | Implicación |
|--------|-----------|-------------|
| **A: Solo puede quitar** (reduce precio) | Landing + SEO. Puede unchecked SEO ($25K → $15K) | Simple, Vic controla scope |
| **B: Puede quitar Y agregar** (módulos a la carte) | Landing + SEO. Puede agregar E-commerce, CRM, etc. | Flexible, but scope creep |
| **C: Agrega pero con "precio premium"** | Landing + SEO. Agregar = +20% sobreprecio | Control, pero complicado explicar |

**Recomendación:** Opción B — cliente puede agregar (ecommerce es fuente de ingresos), pero Vic puede rechazar combos locas en Stage 4.

---

### 4️⃣ PAGO: ¿100% ahora o 50% + 50%?

**Opciones:**

| Opción | Cliente paga | Vic gana | Riesgo |
|--------|--------------|----------|--------|
| **A: 100% ahora** | Todo upfront | Flujo caja completo | Cliente se arrepiente post-pago |
| **B: 50% ahora + 50% inicio** | Mitad ahora, mitad cuando kickoff | Menos riesgo cliente, genera engagement | Flujo caja retrasado 1-2 semanas |
| **C: Variable por Vic** | Vic elige en panel admin | Máximo control | Complejo técnicamente |

**Recomendación:** Opción B (50/50) — mejor para conversión y relación con cliente. Implementar como **default configurable por Vic en cada propuesta**.

---

### 5️⃣ PROPUESTA PDF: ¿Generado dinámicamente o template estático?

**Escenario:** Propuesta JSON = {módulos: [...], precio: 38900, timeline: 21}

**Opciones:**

| Opción | Generación | Ventaja | Desventaja |
|--------|-----------|---------|------------|
| **A: Dinámico (React PDF)** | Cada propuesta → PDF único | Profesional, reflejamodificaciones Vic | Complejidad, posibles bugs |
| **B: Template + llenar campos** | Plantilla fija con datos | Simple, consistente | Menos personalización |
| **C: Screenshot de componente React** | Renderizar propuesta web → screenshot → PDF | Rápido, profesional | Fragilidad visual |

**Recomendación:** Opción A o C — dinámico es mejor. Si Vic modifica propuesta, PDF debe reflejar eso.

---

### 6️⃣ DASHBOARD CLIENTE: ¿Acceso inmediato post-pago o Vic activa manualmente?

**Opciones:**

| Opción | Acceso | User Experience | Operación |
|--------|--------|-----------------|-----------|
| **A: Automático post-pago** | Cliente ve `/cliente/dashboard` 5 min después de pagar | Excelente, wow moment | Requiere auto-provisioning |
| **B: Vic activa (24h)** | Email "Tu proyecto inicia mañana" | Bueno, pero espera | Vic debe acordarse |
| **C: Kickoff call → activa** | Solo después de primera llamada | Asegurada ceremonia, control | Cliente queda esperando |

**Recomendación:** Opción A — automatizar post-pago. Costo bajo, impacto alto en satisfacción.

---

### 7️⃣ TIMEOUT: ¿Cuánto tiempo vale una propuesta enviada?

**Contexto:** Vic envía propuesta cliente. Cliente no responde en...

**Opciones:**

| Días | Acción | Implicación |
|------|--------|------------|
| **7 días** | Auto-expiración → "Propuesta expirada, contacta a Vic" | Urgencia, corre conversión |
| **14 días** | Mismo | Menos presión |
| **30 días** | Mismo | Cliente puede pensar largo |
| **∞ (Sin expiración)** | Siempre válida | Flexible, pero olvidos |

**Recomendación:** 14 días — balance entre urgencia y tiempo real. Implementar email reminder a los 10 días "Tu propuesta vence en 4 días".

---

### 8️⃣ FOLLOW-UP: ¿Qué pasa si propuesta expira sin respuesta?

**Flujos posibles:**

| Escenario | Hoy | Propuesto |
|-----------|-----|-----------|
| Propuesta expira | Lead status = "perdido" | Email recordatorio (día 10) + sigue siendo válida hasta día 14 + conversión fallida → enviar nueva propuesta (Vic decide) |
| Vic rechaza propuesta | Email "Estamos revisando..." | Email "Gracias por tu interés, conectemos para ajustar" + Vic puede iniciar conversa |
| Cliente paga 50% pero desaparece | Proyecto "on hold" | Email automático día 3: "¿Necesitas ayuda?" + Vic notificado |

**Recomendación:** Implementar secuencia de email automática (reminder, follow-up, re-engagement) basada en estados.

---

## 🔴 DECISIONES PENDIENTES (RESUMEN)

| # | Decisión | Opciones | Mi recomendación |
|---|----------|----------|------------------|
| 1 | Auditoría sitios con login | A/B/C | **C: Solo homepage pública con disclaimer** |
| 2 | ¿Siempre genera propuesta IA? | A/B/C | **A: Sí, siempre (actual)** |
| 3 | Cliente agrega módulos | A/B/C | **B: Sí, con agregar opcional** |
| 4 | Pago: 100% vs 50%+50% | A/B/C | **B: 50%+50% (default configurable)** |
| 5 | PDF propuesta dinámica | A/B/C | **A o C: Dinámico** |
| 6 | Dashboard acceso | A/B/C | **A: Automático post-pago** |
| 7 | Timeout propuesta | 7/14/30/∞ días | **14 días + reminder día 10** |
| 8 | Follow-up secuencias | Manuales/automáticas | **Automáticas con ganchos para intervención manual** |

---

## 💰 IMPACTO COMERCIAL

### Escenario 1: Lead típico
```
Lead: Startup, presupuesto $35K, urgencia 6 semanas

1. Entra → Lead Capture: nombre, email, sitio web ✅
2. Background: Puppeteer audita homepage (5 min)
3. Claude Haiku genera: "Necesita Landing Page + UI/UX + SEO" = $32K, 21 días
4. Vic ve en panel: propuesta. Aprueba tal cual (2 min)
5. Email a cliente: PDF + "Cotiza aquí"
6. Cliente entra checkout: ve Landing + UI/UX + SEO ($32K)
7. Cliente piensa: agrega E-commerce ($+5K) → total $37K
8. Cliente paga 50% ($18.5K)
9. Confirmation email + dashboard acceso
10. Vic notificado: "Nuevo cliente, inicia en 3 días"

**Timeline:** 24h lead → pago
**Vic time:** ~5 min
```

### Escenario 2: Lead difícil
```
Lead: Empresa con sitio protegido, presupuesto vago, sospechoso

1. Entra → forma incompleta
2. Background: Puppeteer intenta auditar, FALLA (login required)
3. Audit report: "Solo pude auditar homepage. Contacta a Vic para propuesta manual"
4. Vic se da cuenta: lead dudoso
5. Vic rechaza propuesta IA
6. Email a cliente: "Gracias, un momento de Vic para entender mejor..."
7. Vic hace screening call, decide si vale la pena
8. Si vale: Vic propone manualmente (15 min)
9. Si no: archivo "para después"

**Timeline:** 24h → decisión Vic
**Vic time:** ~15 min
**Resultado:** Mejor qualification, menos sorpresas
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Phase 1: MVP (8 stages como están)
- Stages 1-2: Lead Capture + Audit (Puppeteer job)
- Stage 3-4: Propuesta IA + Vic panel
- Stage 5-7: Email + Checkout + Stripe
- Stage 8: Basic dashboard

**Timeline:** 4-5 semanas (Fase B.4)

### Phase 2: Refinamientos (después de MVP validado)
- Email sequences automáticas (reminders, follow-ups)
- Dashboard mejorado con analytics
- Webhooks más robustos
- Testing A/B de copy de emails

**Timeline:** 2 semanas (Fase B.5)

---

## ✅ RECOMENDACIÓN FINAL

**El flujo está bien definido.** Los 8 stages tienen sentido lógico, Vic tiene punto de control (Stage 4), y la automatización (IA) ahorra tiempo sin sacrificar calidad.

**Pasos inmediatos:**

1. ✅ Validar mis 8 decisiones pendientes (arriba)
2. ✅ Confirmar que catalog.ts es la fuente de verdad para propuestas
3. ✅ Definir emails template para cada stage (welcome, audit-complete, proposal-sent, reminder, etc.)
4. ✅ Setup Puppeteer + Claude Haiku quota
5. ✅ Comenzar Implementación (B.4.1-B.4.8 en BACKLOG_MASTER)

**¿Vic está de acuerdo con las 8 decisiones pendientes? Si hay cambios, podemos ajustar antes de empezar a codear.**

---

**Created:** 2026-06-02  
**For:** Vic (Validación comercial antes de implementación)
