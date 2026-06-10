# 🚀 B.4.4 KICKOFF: Envío de Propuesta al Cliente (Email + Landing)

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (Cliente es primer contacto real)  
**Estimated Time:** 8-10 horas  
**Timeline:** Semana 2 de Fase B.4  
**Depends on:** ✅ B.4.1 + ✅ B.4.2 + ✅ B.4.3 COMPLETADOS

---

## 📋 OBJETIVO

Implementar **envío automático de propuestas** a clientes que:

1. **Email** llega a cliente con resumen + CTA "Ver propuesta"
2. **Landing privado** `/propuesta/{uuid}` muestra:
   - PDF propuesta (generado dinámicamente)
   - Resumen visual (módulos, precio, timeline)
   - Botón "Ir a cotizador personalizado" → `/checkout/{uuid}`
   - Botón "Reservar llamada" (Calendly embed)
   - Contacto directo (email, WhatsApp)
3. **Timeout 14 días** — propuesta expira si cliente no actúa
   - Día 10: Email reminder "3 días para confirmar"
   - Día 14: "Propuesta vencida, renovar?"

**Por qué es crítico:** Este es el primer contacto real con cliente. Si no impacta, la conversión muere aquí.

---

## 🎯 ENTREGABLES

### 1. Email: Propuesta Enviada
**Archivo:** `src/lib/emails/proposalSentToClient.ts`

**Cuándo:** Cuando Vic aprueba/modifica propuesta en B.4.3

**Contenido:**
```
Subject: 📋 Tu propuesta personalizada — {empresa} | ${precio_total} MXN

Hola {nombre},

Analizamos tu sitio web y preparamos una propuesta personalizada diseñada específicamente para los retos que encontramos:

🔍 RESUMEN DE LA AUDITORÍA
Score general: {score}/100
Áreas críticas identificadas:
• {area_critica_1}
• {area_critica_2}
• {area_critica_3}

✨ NUESTRA PROPUESTA PARA TI
Hemos seleccionado los módulos más impactantes para resolver estos retos:

{modulos_resumen}
- {modulo_1}: ${precio_1} ({horas_1}h)
- {modulo_2}: ${precio_2} ({horas_2}h)
- {modulo_3}: ${precio_3} ({horas_3}h)

💰 INVERSIÓN TOTAL
Subtotal técnico: ${precio_subtotal}
Gestión del proyecto (20%): ${pm_fee}
───────────────────────────
TOTAL: ${precio_total} MXN

⏱️ TIMELINE
Estimado: {timeline_dias} días desde que aprobamos

📅 LO QUE SIGUE
1. Revisa tu propuesta detallada (link abajo)
2. Si necesitas cambios, cuéntanos
3. Aprueba y paga 50% para arrancar
4. El otro 50% al iniciar proyecto

🔗 VER TU PROPUESTA
[BOTÓN GRANDE: "Ver propuesta detallada"]

📞 ¿DUDAS?
- Email: hola@tech-nova.mx
- WhatsApp: +52 722 166 9672
- Chat directo: [enlace a /propuesta/{uuid}]

Estamos emocionados de trabajar contigo.

Sofia 🚀
```

---

### 2. Landing Privada: `/propuesta/{uuid}`
**Archivo:** `src/app/propuesta/[uuid]/page.tsx`

**Features:**

```
┌──────────────────────────────────────────────────┐
│ TU PROPUESTA PERSONALIZADA                       │
│ Tech Nova                                        │
├──────────────────────────────────────────────────┤
│                                                  │
│ EMPRESA: Acme Corp                              │
│ CONTACTO: Juan García                           │
│ FECHA PROPUESTA: 2 de junio, 2026               │
│ VÁLIDA HASTA: 16 de junio, 2026 (14 días)      │
│                                                  │
├──────────────────────────────────────────────────┤
│ RESUMEN DE AUDITORÍA                            │
│ Score: 42/100 (Rojo: Necesita mejoras urgentes)│
│ [Ver audit completo ▼]                          │
│                                                  │
├──────────────────────────────────────────────────┤
│ PROPUESTA SELECCIONADA                          │
│                                                  │
│ ✓ Identidad Completa                            │
│   Logo, paleta, tipografía, UI Kit              │
│   $8,500 MXN | 28 horas                         │
│                                                  │
│ ✓ Landing Page Optimizada                       │
│   Responsive, SEO, performance                  │
│   $9,200 MXN | 25 horas                         │
│                                                  │
│ ✓ SEO Técnico                                   │
│   Meta tags, sitemap, core web vitals           │
│   $6,300 MXN | 20 horas                         │
│                                                  │
├──────────────────────────────────────────────────┤
│ DESGLOSE DE INVERSIÓN                           │
│                                                  │
│ Subtotal técnico:      $24,000 MXN              │
│ Gestión (20%):          $4,800 MXN              │
│ ─────────────────────────────────               │
│ TOTAL:                 $28,800 MXN              │
│                                                  │
│ PAGO:  50% ahora ($14,400)                      │
│        50% al iniciar ($14,400)                 │
│                                                  │
├──────────────────────────────────────────────────┤
│ TIMELINE                                         │
│                                                  │
│ Timeline: 18 días                               │
│ Inicio: 3 de junio                              │
│ Entrega: 21 de junio                            │
│                                                  │
├──────────────────────────────────────────────────┤
│ ACCIONES                                        │
│                                                  │
│ [BOTÓN VERDE: "Aprobar y pagar 50%"]            │
│                                                  │
│ [BOTÓN AZUL: "Hacer cambios"]                   │
│  └─ Abrir /checkout/{uuid} con selector módulos│
│                                                  │
│ [BOTÓN GRIS: "Reservar llamada"]                │
│  └─ Calendly embed (Vic)                        │
│                                                  │
├──────────────────────────────────────────────────┤
│ CONTACTO                                        │
│                                                  │
│ ¿Preguntas?                                     │
│ Email: hola@tech-nova.mx                        │
│ WhatsApp: +52 722 166 9672                      │
│ Chat directo: [abre chat en la página]         │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Componentes React:**

```typescript
// src/components/propuesta/ProposalSummary.tsx
- Información del lead (empresa, contacto)
- Audit report colapsible
- Módulos seleccionados con detalles
- Desglose de inversión (subtotal + PM fee + total)
- Timeline visual

// src/components/propuesta/ProposalActions.tsx
- Botón "Aprobar y pagar" → /checkout/{uuid}
- Botón "Hacer cambios" → abre selector módulos
- Botón "Reservar llamada" → Calendly

// src/components/propuesta/ProposalPDF.tsx
- PDF generado dinámicamente (igual que en Vic's dashboard)
- Descargable como "Propuesta_{empresa}.pdf"
```

---

### 3. PDF Dinámico: Propuesta descargable
**Archivo:** `src/lib/pdf/generate-proposal-pdf.ts`

**Stack:** Puppeteer (renderiza componente React → PDF)

**Contenido:**
```
PROPUESTA TÉCNICA
═════════════════════════════════════════════════

EMPRESA: Acme Corp
CONTACTO: Juan García (juan@acme.mx)
FECHA: 2 de junio, 2026

RESUMEN EJECUTIVO
─────────────────
Basado en nuestra auditoría de tu sitio web, hemos identificado 3 áreas críticas
que impactan directamente en tu conversión y experiencia de usuario.

Esta propuesta aborda esas áreas de forma estratégica, priorizando el impacto
en tu negocio.

ANÁLISIS DEL SITIO ACTUAL
──────────────────────────
Score general: 42/100
Áreas críticas:
• Performance (28/100) — Sitio tarda 8 segundos en cargar
• Mobile (35/100) — No es responsive, 60% tráfico de móvil se va
• UX (40/100) — No hay clara call-to-action, confusión en navegación

SOLUCIÓN PROPUESTA
──────────────────
Hemos seleccionado estos módulos para resolver el problema:

1. IDENTIDAD COMPLETA ($8,500)
   Incluye: Logo + Paleta + Tipografía + UI Kit + Manual de marca
   Impacto: Aumenta confianza 40% (estudios de UX)
   Justificación: Tu identidad actual es débil. Una identidad fuerte mejora
   conversión y ayuda en posicionamiento de mercado.

2. LANDING PAGE OPTIMIZADA ($9,200)
   Incluye: Responsive design + Performance optimization + SEO + CTA
   Impacto: Reduce bounce rate 30%, aumenta conversión 25%
   Justificación: Tu homepage actual es lenta. Lighthouse score bajo impacta
   rankings en Google y tasa de rebote.

3. SEO TÉCNICO ($6,300)
   Incluye: Metadata + Sitemap + Schema + Core Web Vitals
   Impacto: Mejora visibilidad en Google 150%+ en 3 meses
   Justificación: SEO técnico es base. Sin esto, no importa cuánto inviertas
   en marketing — Google no te ve.

DESGLOSE FINANCIERO
────────────────────
Módulo 1: $8,500
Módulo 2: $9,200
Módulo 3: $6,300
Subtotal: $24,000

Gestión del proyecto (20%): $4,800
(Incluye: coordinación, reuniones, documentación, soporte)

TOTAL INVERSIÓN: $28,800 MXN

PAGOS
─────
Opción estándar:
• 50% al aprobar ($14,400)
• 50% al iniciar proyecto ($14,400)

TIMELINE
─────────
Duración estimada: 18 días
Inicio: 3 de junio, 2026
Entrega: 21 de junio, 2026

PRÓXIMOS PASOS
──────────────
1. Revisa esta propuesta
2. Si tienes preguntas o cambios, escríbenos
3. Aprueba y realiza pago de 50%
4. Agendar kickoff call (30 min)
5. Iniciamos el proyecto

VALIDEZ
────────
Esta propuesta es válida por 14 días desde la fecha.
Después de esa fecha, los precios pueden cambiar.

CONTACTO
─────────
Tech Nova
Email: hola@tech-nova.mx
WhatsApp: +52 722 166 9672
Web: https://tech-nova.mx

═════════════════════════════════════════════════
```

---

### 4. API: Enviar propuesta a cliente
**Archivo:** `src/app/api/proposals/send/route.ts`

**Endpoint:** `POST /api/proposals/send`

**Body:**
```json
{
  "proposal_id": "uuid"
}
```

**Qué hace:**
1. Valida que propuesta status = "approved" o "modified"
2. Obtiene cliente email + datos propuesta
3. Genera PDF (Puppeteer)
4. Envía email con Resend
5. Actualiza status → "client_reviewing"
6. Guarda fecha envío
7. Crea entry en tabla `proposal_tracking`:
   - sent_at
   - opened_at (trackeo de email)
   - days_remaining (para timeout)

**Response:**
```json
{
  "success": true,
  "email_sent": true,
  "proposal_link": "https://tech-nova.mx/propuesta/uuid",
  "message": "Propuesta enviada a juan@acme.mx"
}
```

---

### 5. Página: Gestión de Timeout
**Archivo:** `src/lib/jobs/proposal-timeout-job.ts`

**Cron job:** Ejecutar diariamente a las 9 AM

**Proceso:**
```
1. Busca propuestas con status = "client_reviewing"
2. Para cada una:
   ├─ Si sent_at + 10 días = HOY:
   │  ├─ Email reminder: "3 días para confirmar"
   │  └─ Actualizar status → "reminder_sent"
   │
   ├─ Si sent_at + 14 días = HOY:
   │  ├─ Email: "Propuesta vencida"
   │  ├─ Status → "expired"
   │  └─ Notificar a Vic: "Propuesta vencida, ¿renovar?"
   │
   └─ Si sent_at + 14 días < HOY y status = "client_reviewing":
      └─ Status → "expired" (cleanup)
```

---

### 6. Tabla BD: Tracking de propuestas
**Archivo:** `src/db/schema.ts` (agregar)

```typescript
export const proposalTracking = pgTable('proposal_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  proposal_id: uuid('proposal_id').notNull().references(() => proposals.id),
  
  sent_at: timestamp('sent_at').notNull(), // Cuándo se envió a cliente
  opened_at: timestamp('opened_at'), // Cuándo cliente abrió email (trackeo)
  clicked_at: timestamp('clicked_at'), // Cuándo hizo click en link
  
  reminder_sent_at: timestamp('reminder_sent_at'), // Día 10 reminder
  expired_at: timestamp('expired_at'), // Día 14 expiración
  
  status: varchar('status', { length: 50 }).notNull(), // sent, opened, expired, renewed
  
  created_at: timestamp('created_at').defaultNow(),
});
```

---

### 7. Email: Reminder Día 10
**Archivo:** `src/lib/emails/proposalReminderEmail.ts`

**Cuándo:** Día 10 después de envío

**Contenido:**
```
Subject: ⏰ Tu propuesta vence en 3 días — {empresa}

Hola {nombre},

Notamos que aún no has confirmado tu propuesta. Te recordamos que tiene validez
por 14 días desde que la enviamos.

ACCIÓN REQUERIDA: Aprueba tu propuesta antes del {fecha_expiracion}

[BOTÓN: "Ver propuesta nuevamente"]

Si en los últimos días cambiaron tus prioridades o presupuesto, no te preocupes.
Podemos ajustar la propuesta. Escríbenos a hola@tech-nova.mx

Saludos,
Sofia 🚀
```

---

### 8. Email: Propuesta Expirada
**Archivo:** `src/lib/emails/proposalExpiredEmail.ts`

**Cuándo:** Día 14 después de envío

**Contenido:**
```
Subject: Tu propuesta ha vencido — ¿Quieres renovarla?

Hola {nombre},

Tu propuesta de $28,800 MXN expiró hoy (validez de 14 días).

Si aún estás interesado en transformar tu web, tenemos dos opciones:

OPCIÓN 1: Renovar la propuesta
Los precios pueden haber cambiado. Escríbenos para nueva cotización.

OPCIÓN 2: Ajustar el scope
Si tu presupuesto o timeline cambió, podemos adaptar la propuesta.

[BOTÓN: "Solicitar nueva propuesta"]

No perdemos el interés. Sabemos que las decisiones toman tiempo.
¿Alguna duda? Comunícate con nosotros sin compromiso.

Saludos,
Sofia 🚀
```

---

## 🛠️ TECH STACK

| Componente | Tech | Notas |
|-----------|------|-------|
| Email | Resend | (existing) |
| PDF | Puppeteer + React | Renderiza componente → PDF |
| Cron | Node-cron | Background job diario |
| DB | Neon Postgres | (existing) |
| Frontend | React 19 + Next.js | (existing) |

---

## 📋 INSTALACIÓN & SETUP

### 1. Agregar tabla BD
```bash
# schema.ts: agregar proposalTracking
npm run db:push
```

### 2. Crear archivos
```bash
src/app/propuesta/[uuid]/page.tsx
src/components/propuesta/ProposalSummary.tsx
src/components/propuesta/ProposalActions.tsx
src/lib/pdf/generate-proposal-pdf.ts
src/lib/emails/proposalSentToClient.ts
src/lib/emails/proposalReminderEmail.ts
src/lib/emails/proposalExpiredEmail.ts
src/lib/jobs/proposal-timeout-job.ts
src/app/api/proposals/send/route.ts
```

### 3. Setup cron job
```bash
# pages/api/cron/proposal-timeout.ts
# O usar: node-cron con setTimeout en startup
```

---

## ✅ CHECKLIST QA

### Unit Tests (5)
- [ ] PDF se genera correctamente desde propuesta JSON
- [ ] Email template renderiza sin errores
- [ ] Timeout logic: día 10 = reminder, día 14 = expired
- [ ] `/propuesta/{uuid}` con ID válido carga propuesta
- [ ] `/propuesta/{uuid}` con ID inválido → 404

### Integration Tests (5)
- [ ] POST `/api/proposals/send` → email enviado, status "client_reviewing"
- [ ] Abrir `/propuesta/{uuid}` → ve propuesta completa
- [ ] Click "Aprobar y pagar" → redirige a `/checkout/{uuid}`
- [ ] Click "Hacer cambios" → abre selector módulos
- [ ] Click "Reservar llamada" → abre Calendly

### Manual Testing (5)
- [ ] Enviar propuesta desde Vic's dashboard
- [ ] Revisar email recibido
- [ ] Abrir link en email → carga `/propuesta/{uuid}`
- [ ] Descargar PDF → se ve correcto
- [ ] Esperar día 10 de timeout → email reminder llega

### Edge Cases (5)
- [ ] Propuesta con módulos muy caros (>100K) → se ve bien
- [ ] Propuesta con pocos módulos (1-2) → se ve balanceado
- [ ] Cliente intenta acceder `/propuesta/` con UUID inválido → 404
- [ ] Email con cliente sin WhatsApp → no rompe layout
- [ ] Timezone diferente → fecha de expiración correcta

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 6 — contexto
- `BACKLOG_MASTER.md` § B.4.4

**Código existente:**
- `B.4.1/2/3` — patrones de email, BD, async jobs
- `src/lib/emails/*.ts` — templates existentes
- `src/lib/pdf/` — si existe PDF previo

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] Landing `/propuesta/{uuid}` con propuesta visual
- [x] PDF dinámico (Puppeteer)
- [x] Email "Propuesta enviada"
- [x] API `/api/proposals/send`
- [x] Timeout job (día 10 reminder, día 14 expired)
- [x] Emails reminder + expired
- [x] Tabla `proposal_tracking` en BD

✅ **Testing**
- [x] 5 unit tests
- [x] 5 integration tests
- [x] 5 escenarios manual
- [x] 5 edge cases

✅ **Documentation**
- [x] Emails documentadas
- [x] Landing page documentada
- [x] Timeout logic documentada

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.4 COMPLETADO: Envío de Propuesta al Cliente

**Qué se hizo:**
- Landing /propuesta/{uuid} con propuesta visual + PDF descargable
- Email profesional con resumen + CTA
- Timeout 14 días (reminder día 10, expira día 14)
- Tracking de propuestas (sent, opened, expired)
- 20/20 tests pasados

**Archivos creados:**
- src/app/propuesta/[uuid]/page.tsx (NEW)
- src/components/propuesta/ProposalSummary.tsx (NEW)
- src/components/propuesta/ProposalActions.tsx (NEW)
- src/lib/pdf/generate-proposal-pdf.ts (NEW)
- src/lib/emails/proposalSentToClient.ts (NEW)
- src/lib/emails/proposalReminderEmail.ts (NEW)
- src/lib/emails/proposalExpiredEmail.ts (NEW)
- src/lib/jobs/proposal-timeout-job.ts (NEW)
- src/app/api/proposals/send/route.ts (NEW)
- src/db/schema.ts (UPDATED — tabla proposal_tracking)

**Próximo paso:** B.4.5 (Ecommerce dinámico + checkout)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **PDF generación:** Puppeteer tarda ~5s. Hacer async, no esperar en API response.

2. **Email tracking:** Pixel invisible para tracking de opens es complicado (spammy). Mejor usar tracking via link click.

3. **Timezone:** Cliente en diferentes zonas. Calcular "días restantes" basado en UTC, mostrar en su timezone (si es posible).

4. **Calendly embed:** Necesita que el iframe sea responsive. Usar librería de Calendly para React.

5. **Módulos visibles:** En landing, mostrar SOLO los módulos seleccionados, no el catálogo completo.

6. **PDF descargable:** Nombre archivo: `Propuesta_{empresa}_{fecha}.pdf`

7. **Cron job:** Si usas node-cron, ejecutar al startup y cada 24h. Mejor: usar Vercel crons (`/api/cron/proposal-timeout`)

8. **Status updates:** Cuando cliente abre propuesta, actualizar tracking `opened_at`. Cuando hace click, actualizar `clicked_at`.

---

**Created:** 2026-06-02  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1 + ✅ B.4.2 + ✅ B.4.3  
**Next:** After completion → B.4.5 KICKOFF (Ecommerce dinámico)
