# 🚀 B.4.8 KICKOFF: CRM + Email Workflows Automáticos (FINAL)

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🟡 MEDIA (Automatización operacional)  
**Estimated Time:** 10-12 horas  
**Timeline:** Semana 4 de Fase B.4  
**Depends on:** ✅ B.4.1-7 COMPLETADOS

---

## 📋 OBJETIVO

Automatizar toda la **cadena de emails** según estado del lead y crear **dashboard CRM simplificado** para Vic, mostrando:
- Lead funnel visual (cuántos en cada etapa)
- Lead lifecycle timeline
- Email delivery tracking
- Lead filtering + búsqueda

**Por qué es crítico:** Sin automación de emails, Vic pierde leads. Este es el "nurturing" que convierte visitas en clientes.

---

## 🎯 ENTREGABLES

### 1. Lead Lifecycle States (Tabla Actualizada)
**Archivo:** `src/db/schema.ts` (actualizar tabla `leads`)

```typescript
export const leads = pgTable('leads', {
  // ... campos existentes ...
  
  // NUEVO: Lead lifecycle tracking
  status: varchar('status', { length: 50 }).notNull().default('new'),
  // Estados: new → captured → audit_completed → proposal_generated 
  //         → proposal_approved → proposal_sent → client_reviewing 
  //         → in_checkout → paid → project_active → completed
  
  // Timestamps por etapa (para analytics)
  captured_at: timestamp('captured_at'),       // lead form completado
  audit_started_at: timestamp('audit_started_at'),
  audit_completed_at: timestamp('audit_completed_at'),
  proposal_generated_at: timestamp('proposal_generated_at'),
  proposal_approved_at: timestamp('proposal_approved_at'),
  proposal_sent_at: timestamp('proposal_sent_at'),
  proposal_opened_at: timestamp('proposal_opened_at'),
  in_checkout_at: timestamp('in_checkout_at'),
  paid_at: timestamp('paid_at'),
  
  // Para workflow automation
  last_email_sent_at: timestamp('last_email_sent_at'),
  last_email_type: varchar('last_email_type', { length: 50 }),
  email_sequence_stage: integer('email_sequence_stage').default(0),
  // stage 0 = welcome, 1 = follow-up, 2 = audit-ready, 3 = proposal-sent, etc.
});
```

---

### 2. Email Automation Engine
**Archivo:** `src/lib/workflows/email-automation.ts` (NEW)

**Flujo principal:**

```typescript
// Este job corre cada 4 horas vía cron
export async function runEmailAutomationWorkflow() {
  // 1. Obtener todos los leads con status en cada etapa
  
  // STAGE 1: Leads capturados hace 1 día
  const newLeads = await getLeadsByStatus('captured');
  for (const lead of newLeads) {
    if (lead.captured_at < 1.day) {
      await sendEmail(lead, 'welcomeEmail');
      await updateLeadStatus(lead, 'welcome_sent');
    }
  }
  
  // STAGE 2: Auditoría completada, esperando propuesta (2+ días sin propuesta)
  const auditedLeads = await getLeadsByStatus('audit_completed');
  for (const lead of auditedLeads) {
    if (lead.audit_completed_at < 2.days) {
      await sendEmail(lead, 'auditReadyEmail');
      await updateLeadStatus(lead, 'audit_ready_notified');
    }
  }
  
  // STAGE 3: Propuesta enviada, cliente viendo (10+ días sin respuesta)
  const proposalSentLeads = await getLeadsByStatus('proposal_sent');
  for (const lead of proposalSentLeads) {
    if (lead.proposal_sent_at < 10.days && !lead.proposal_opened_at) {
      await sendEmail(lead, 'proposalFollowUpEmail');
    }
  }
  
  // STAGE 4: Cliente viendo propuesta, no en checkout (7+ días)
  const clientReviewingLeads = await getLeadsByStatus('client_reviewing');
  for (const lead of clientReviewingLeads) {
    if (lead.proposal_opened_at < 7.days && !lead.in_checkout_at) {
      await sendEmail(lead, 'urgentCheckoutEmail');
    }
  }
  
  // STAGE 5: En checkout (5+ días sin pagar)
  const checkoutLeads = await getLeadsByStatus('in_checkout');
  for (const lead of checkoutLeads) {
    if (lead.in_checkout_at < 5.days && !lead.paid_at) {
      await sendEmail(lead, 'checkoutReminderEmail');
    }
  }
  
  // STAGE 6: Pagado pero no iniciado proyecto (kickoff overdue)
  const paidLeads = await getLeadsByStatus('paid');
  for (const lead of paidLeads) {
    const project = await getProjectByOrder(lead.order_id);
    if (project.kickoff_date < today) {
      await sendEmail(lead, 'kickoffConfirmationEmail');
    }
  }
}
```

---

### 3. Email Templates (6 nuevos)
**Archivo:** `src/lib/emails/workflows/` (NEW folder)

#### 3.1 Welcome Email
**Archivo:** `welcomeEmail.ts`
- **Cuándo:** 1 día después de lead capturado
- **Qué:** "¡Gracias por tu interés! Aquí está tu checklist de auditoría. Vic revisará tu sitio en 24-48h"
- **CTA:** Link a PDF checklist, link a dashboard tracking

#### 3.2 Audit Ready Email
**Archivo:** `auditReadyEmail.ts`
- **Cuándo:** Auditoría completada, 2+ días esperando propuesta
- **Qué:** "¡Listo! Hicimos una auditoría completa. Una propuesta está en camino"
- **CTA:** Link a propuesta (si ya está enviada)

#### 3.3 Proposal Follow-Up Email
**Archivo:** `proposalFollowUpEmail.ts`
- **Cuándo:** 10+ días sin abrir propuesta
- **Qué:** "¿Alguna pregunta sobre tu propuesta? Vic está disponible"
- **CTA:** Link a propuesta, WhatsApp, meeting

#### 3.4 Urgent Checkout Email
**Archivo:** `urgentCheckoutEmail.ts`
- **Cuándo:** Cliente viendo propuesta 7+ días, no en checkout
- **Qué:** "Notas que te interesa pero no confirmaste. ¿Dudas? Vic puede llamarte hoy"
- **CTA:** Botón "Confirmar ahora", Calendly call, WhatsApp

#### 3.5 Checkout Reminder Email
**Archivo:** `checkoutReminderEmail.ts`
- **Cuándo:** En checkout 5+ días sin pagar
- **Qué:** "¿Algo te frenó? Podemos ajustar. Tu carrito expira en X horas"
- **CTA:** Botón "Completar pago", contacto urgente

#### 3.6 Project Started Email
**Archivo:** `projectStartedEmail.ts`
- **Cuándo:** Kickoff date confirmado
- **Qué:** "¡Comenzamos! Vic te contactará para la llamada de inicio"
- **CTA:** Link a dashboard, Calendly, contrato

---

### 4. Cron Job: Email Automation
**Archivo:** `src/app/api/cron/email-automation/route.ts` (NEW)

**GET `/api/cron/email-automation`**

**Qué hace:**
1. Valida `CRON_SECRET`
2. Llama `runEmailAutomationWorkflow()`
3. Registra en BD: cuántos emails enviados, errores
4. Retorna 200 OK

**Schedule:** Cada 4 horas (06:00, 10:00, 14:00, 18:00, 22:00 UTC)

---

### 5. CRM Dashboard: `/admin/crm`
**Archivo:** `src/app/admin/crm/page.tsx` (NEW)

**Estructura (3 secciones):**

#### 5.1 Lead Funnel
```
Total Leads: 47
├─ 🆕 New: 5 (10%)
├─ 📊 Captured: 8 (17%)
├─ 🔍 Audit Complete: 12 (25%)
├─ 📄 Proposal Generated: 10 (21%)
├─ 💬 Client Reviewing: 8 (17%)
├─ 🛒 In Checkout: 2 (4%)
├─ ✅ Paid: 2 (4%)
└─ 🚀 Active Project: 0 (0%)
```

#### 5.2 Lead Activity Timeline
```
Últimas acciones (últimas 24h):
├─ ✅ juan@acme.mx — Pagó 50% (3h ago)
├─ 📧 maria@startup.mx — Recibió propuesta (6h ago)
├─ 🔍 carlos@design.mx — Auditoría completada (12h ago)
├─ 👤 Ana García — Nueva en el sistema (18h ago)
└─ 📞 Roberto Pérez — Email de followup enviado (22h ago)
```

#### 5.3 Leads por Estado (Tabla interactiva)
| Email | Empresa | Status | Days in Stage | Last Email | Próxima Acción |
|-------|---------|--------|---------------|------------|---|
| juan@acme.mx | Acme Corp | Paid | 2d | proposal_sent | Preparar kickoff |
| maria@startup.mx | Startup X | Proposal Sent | 10d | audit_ready | Send follow-up |
| carlos@design.mx | Design Co | Audit Complete | 8d | capture_welcome | Send audit ready |

---

### 6. Lead Detail Panel
**Archivo:** `src/components/admin/LeadDetailPanel.tsx` (NEW)

**Qué muestra:**
- Lead info (nombre, email, empresa, teléfono)
- Auditoría score (si completada)
- Propuesta (módulos, precio, estado)
- Email history (todos los que recibió)
- Timestamps de cada etapa
- Botones de acción manual:
  - "Enviar email manualmente" (elegir tipo)
  - "Cambiar status"
  - "Marcar como completado"
  - "Exportar a CSV"

---

### 7. API: Obtener Leads con Filtros
**Archivo:** `src/app/api/admin/leads/route.ts` (actualizar)

**GET `/api/admin/leads?status=proposal_sent&days=10&search=acme`**

**Response:**
```json
{
  "leads": [...],
  "total": 47,
  "by_status": {
    "new": 5,
    "captured": 8,
    "audit_completed": 12,
    "proposal_generated": 10,
    "proposal_sent": 8,
    "in_checkout": 2,
    "paid": 2
  }
}
```

---

### 8. Email Delivery Tracking
**Archivo:** `src/db/schema.ts` (NEW table)

```typescript
export const emailEvents = pgTable('email_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  lead_id: integer('lead_id').references(() => leads.id).notNull(),
  
  email_type: varchar('email_type', { length: 50 }).notNull(),
  // welcome_email, audit_ready_email, proposal_follow_up, etc.
  
  sent_at: timestamp('sent_at').notNull(),
  opened_at: timestamp('opened_at'),  // vía pixel tracking
  clicked_at: timestamp('clicked_at'), // vía link tracking
  bounced_at: timestamp('bounced_at'),
  complained_at: timestamp('complained_at'),
  
  resend_event_id: varchar('resend_event_id', { length: 255 }),
  
  created_at: timestamp('created_at').defaultNow().notNull(),
});
```

---

### 9. Email Tracking: Webhooks Resend
**Archivo:** `src/app/api/webhooks/resend/route.ts` (NEW)

**POST `/api/webhooks/resend`**

**Qué escucha:**
- `email.sent` → actualiza `email_events.sent_at`
- `email.opened` → actualiza `email_events.opened_at`
- `email.clicked` → actualiza `email_events.clicked_at`
- `email.bounced` → marca para retry
- `email.complained` → marca como "unsubscribe"

**Signature validation:** Resend proporciona secret para validar webhook

---

### 10. Lead Scoring + Auto-Qualification
**Archivo:** `src/lib/leads/score-lead.ts` (NEW)

**Scoring formula (actualizado):**
```
Score = (Budget×0.25) + (Clarity×0.25) + (Timeline×0.20) + (Viability×0.20) + (Intent×0.10)

Intent += bonus si cliente:
  + Abrió propuesta: +10 points
  + Entró a checkout: +15 points
  + Es repeat customer: +20 points
  + Vino via referral: +5 points
```

**Routing:**
- Score 80%+ → Auto-proposal + aggressive follow-up
- Score 60-79% → Manual review by Vic + nurture
- Score <60% → Light nurture, focus on other leads

---

## 🛠️ TECH STACK

| Componente | Tech | Notas |
|-----------|------|-------|
| Automation | Node.js cron | Every 4 hours |
| Email | Resend + webhooks | Tracking events |
| CRM UI | React client | Filters + sorting |
| Analytics | Timestamps en DB | Funnel calculations |
| Tracking | Pixel + link | Resend native |

---

## 📋 INSTALACIÓN & SETUP

### 1. Actualizar schema BD
```bash
npm run db:push
```

### 2. Crear email templates
```bash
src/lib/emails/workflows/{
  welcomeEmail.ts,
  auditReadyEmail.ts,
  proposalFollowUpEmail.ts,
  urgentCheckoutEmail.ts,
  checkoutReminderEmail.ts,
  projectStartedEmail.ts
}
```

### 3. Crear CRM components
```bash
src/app/admin/crm/page.tsx
src/components/admin/LeadFunnel.tsx
src/components/admin/LeadActivityTimeline.tsx
src/components/admin/LeadDetailPanel.tsx
```

### 4. Crear jobs + cron
```bash
src/lib/workflows/email-automation.ts
src/app/api/cron/email-automation/route.ts
src/app/api/webhooks/resend/route.ts
```

### 5. Env vars
```
RESEND_WEBHOOK_SECRET=... (from Resend dashboard)
CRON_SECRET=... (existing)
```

### 6. Configure Resend webhooks
- Go to Resend dashboard
- Add webhook: https://tech-nova.mx/api/webhooks/resend
- Subscribe to: email.sent, email.opened, email.clicked, email.bounced

---

## ✅ CHECKLIST QA

### Unit Tests (5)
- [ ] Lead status transitions válidas (no backwards)
- [ ] Email template rendering sin error
- [ ] Lead scoring formula calcula correctamente
- [ ] Timestamps de cada etapa se registran
- [ ] Webhook signature validation rechaza tampering

### Integration Tests (5)
- [ ] Crear lead → 1 día → send welcome email
- [ ] Auditoría → 2 días → send audit ready email
- [ ] Propuesta open → 7 días → send urgent checkout
- [ ] Webhook opened → actualiza `opened_at`
- [ ] CRM dashboard carga funnel data

### Manual Testing (5)
- [ ] Ver CRM dashboard con leads en todos los estados
- [ ] Filtrar por status, búsqueda
- [ ] Ver timeline de emails para un lead
- [ ] Enviar email manual desde detail panel
- [ ] Verificar Resend eventos llegan correctamente

### Edge Cases (5)
- [ ] Lead se salta un estado (direct checkout) → no envía emails viejos
- [ ] Webhook duplicado → no re-envía email
- [ ] Lead sin email válido → skip, log error
- [ ] Cron falla → email re-intentado próxima ejecución
- [ ] Unsubscribe → no más emails

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` — contexto completo
- `BACKLOG_MASTER.md` § B.4.8
- `docs/technical/API_DOCUMENTATION.md`

**Código existente:**
- `src/lib/emails/` — patrones de email
- `src/app/api/cron/` — estructura cron
- `src/app/admin/proposals-review/` — patrón dashboard

**Resend docs:**
- [Webhooks](https://resend.com/docs/webhooks)
- [Email events](https://resend.com/docs/emails#events)

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] Lead lifecycle states completamente implementados
- [x] Email automation engine con 6 workflows
- [x] Cron job cada 4 horas
- [x] CRM dashboard con funnel + timeline + detail
- [x] Resend webhooks tracking (sent, opened, clicked, bounced)
- [x] Lead scoring + auto-routing
- [x] Email delivery logging en BD

✅ **Testing**
- [x] 5 unit tests
- [x] 5 integration tests
- [x] 5 escenarios manual
- [x] 5 edge cases

✅ **Documentation**
- [x] Lead lifecycle documentado
- [x] Email automation workflows documentados
- [x] CRM features documentadas
- [x] Webhook events documentados

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado
- [x] FASE B.4 completada

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.8 COMPLETADO: CRM + Email Workflows Automáticos (FASE B.4 FINAL)

**Qué se hizo:**
- Lead lifecycle states completamente rastreados
- Email automation engine: 6 workflows automáticos
- Cron job: cada 4 horas verifica leads + envía emails
- CRM dashboard: funnel visual, activity timeline, detail panel
- Resend webhooks: tracking sent/opened/clicked/bounced
- Lead scoring + routing automático
- 20/20 tests pasados

**Archivos creados:**
- src/lib/workflows/email-automation.ts (NEW)
- src/app/api/cron/email-automation/route.ts (NEW)
- src/lib/emails/workflows/{6 templates} (NEW)
- src/app/admin/crm/page.tsx (NEW)
- src/components/admin/LeadFunnel.tsx (NEW)
- src/components/admin/LeadActivityTimeline.tsx (NEW)
- src/components/admin/LeadDetailPanel.tsx (NEW)
- src/app/api/webhooks/resend/route.ts (NEW)
- src/db/schema.ts (UPDATED — leads, emailEvents)

**Estado FASE B.4:**
✅ B.4.1 Auditoría IA
✅ B.4.2 Propuesta IA
✅ B.4.3 Dashboard Vic
✅ B.4.4 Envío a Cliente
✅ B.4.5 Ecommerce
✅ B.4.6 Stripe + Contrato
✅ B.4.7 Dashboard Cliente
✅ B.4.8 CRM + Workflows

**COMERCIAL FLOW: 100% COMPLETADO** 🎉

**Próximos pasos:**
- B.1 Imagery (Portfolio, imagenes servicios)
- B.2 Marketing Funnel (Blog, ads, email sequences)
- B.3 NOVA AI (Chat advisor autónomo)
- B.5 Dashboard & Autonomía (Backlog manager)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **Email fatigue:** No enviar más de 1 email/semana a un lead. Espaciar en 4h workflow.

2. **Unsubscribe:** Resend webhooks incluyen evento `complained`. Respetar (obligación legal GDPR/CAN-SPAM).

3. **Timing:** Cron cada 4 horas es buen balance. No muy frecuente (spam), no muy lento (leads enfrían).

4. **Status flow:** Algunos leads pueden saltarse etapas (ej: direct checkout sin propuesta). Diseñar lógica robusta.

5. **Lead scoring:** Ajustar pesos según datos reales (analizar qué conversiona). Iterativamente.

6. **Webhook retry:** Si Resend webhook falla, reintenta por 24h. Guardar en BD con idempotency key.

7. **CRM permissions:** Solo Vic ve CRM dashboard. Proteger `/admin/crm` con auth existente.

8. **Analytics:** Lead funnel % debería mejorar mes a mes con mejores prompts/emails. Trackear.

---

**Created:** 2026-06-03  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1-7 COMPLETADOS  
**Next:** FASE B.4 COMPLETE → Phase B.1-3, B.5 (Marketing, Imagery, NOVA AI, Autonomy)

---

**🎉 ESTA ES LA ÚLTIMA TAREA DE FASE B.4 — ¡TODO EL COMMERCIAL FLOW EN UN PROMPT!**
