# 🚀 B.4.7 KICKOFF: Dashboard Cliente + Onboarding

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🟡 MEDIA (Experiencia cliente post-pago)  
**Estimated Time:** 8-10 horas  
**Timeline:** Semana 4 de Fase B.4  
**Depends on:** ✅ B.4.1-6 COMPLETADOS

---

## 📋 OBJETIVO

Crear **dashboard privado** para clientes después de pagar, mostrando:
- Estado del proyecto
- Roadmap (timeline visual)
- Acceso a recursos (repo, Figma, assets)
- Booking kickoff call
- Contrato + documentación
- Segundo pago (50%) trigger cuando proyecto inicia

---

## 🎯 ENTREGABLES

### 1. Dashboard Cliente: `/cliente/dashboard`
**Archivo:** `src/app/cliente/dashboard/page.tsx` (NEW)

**Estructura (2 secciones):**

```
┌──────────────────────────────────────────────┐
│ 👋 BIENVENIDO A TU PROYECTO                  │
│ Tech Nova                                    │
├──────────────────────────────────────────────┤
│                                              │
│ SECCIÓN 1: Estado del Proyecto               │
│ ├─ Empresa: Acme Corp                        │
│ ├─ Módulos: 3 seleccionados                  │
│ ├─ Timeline: 18 días (Inicia 10 Jun)         │
│ ├─ Estado: "awaiting_kickoff"                │
│ └─ Progreso: 0% (awaiting start)             │
│                                              │
│ SECCIÓN 2: Timeline Visual                   │
│ ├─ [Kickoff Call] -- 30 min                  │
│ ├─ [Setup] -- 2 días                         │
│ ├─ [Development] -- 10 días                  │
│ ├─ [QA] -- 3 días                            │
│ ├─ [Deployment] -- 2 días                    │
│ └─ [Delivery] -- Final                       │
│                                              │
│ SECCIÓN 3: Recursos                          │
│ ├─ Repository (GitHub/Gitee)                 │
│ ├─ Figma (Design)                            │
│ ├─ Assets (Dropbox)                          │
│ ├─ Documentación                             │
│ └─ Contrato (PDF)                            │
│                                              │
│ SECCIÓN 4: Próximos Pasos                    │
│ ├─ 📅 Reservar Kickoff Call → [Calendly]     │
│ ├─ 💳 Pago restante (50%) debido {fecha}     │
│ ├─ 📧 Email notificación 3 días antes pago   │
│ └─ 🚀 Proyecto inicia el {fecha}             │
│                                              │
└──────────────────────────────────────────────┘
```

**Componentes:**

1. **ProjectStatus** — Resumen visual
   - Empresa, módulos, timeline
   - Badge estado: "awaiting_kickoff" / "in_progress" / "delivered"
   - Porcentaje progreso (0%, 50%, 100%)

2. **TimelineVisual** — Roadmap 4 semanas
   - Fases: Kickoff → Setup → Dev → QA → Deploy → Delivery
   - Fechas calculadas desde `projects.kickoff_date`
   - Hitos: qué se entrega en cada fase

3. **ResourcesList** — Links a herramientas
   - Repo (GitHub/GitLab)
   - Figma design file
   - Asset storage (Dropbox/Google Drive)
   - Documentación (Notion/Confluence)
   - Contrato descargable

4. **BookingSection** — Calendly embed
   - "Reservar Kickoff Call"
   - Calendly profesional integrado
   - Horarios disponibles desde Vic

5. **PaymentSection** — Segundo pago
   - "Próximo pago: ${monto} MXN"
   - Fecha: `projects.second_payment_due`
   - Botón "Pagar ahora" si fecha llegó
   - Link a `/checkout/{uuid}/pay?percentage=100`

---

### 2. Auth: Acceso Privado al Dashboard
**Archivo:** `src/middleware.ts` (actualizar)

**Protección:**
- Route `/cliente/dashboard` protected
- Auth via JWT token (enviado en email post-pago)
- Token genera al crear `Order`
- Token válido por 90 días
- Query param: `/cliente/dashboard?token={jwt}`

**JWT Payload:**
```json
{
  "sub": "order_id",
  "project_id": "uuid",
  "empresa": "Acme Corp",
  "email": "juan@acme.mx",
  "iat": 1686000000,
  "exp": 1693776000
}
```

---

### 3. API: Obtener Datos de Proyecto
**Archivo:** `src/app/api/cliente/project/route.ts` (NEW)

**GET `/api/cliente/project`**

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "empresa": "Acme Corp",
    "modules": [...],
    "status": "awaiting_kickoff",
    "kickoff_date": "2026-06-10T10:00:00Z",
    "estimated_completion": "2026-06-28T17:00:00Z",
    "payment_status": "half_paid",
    "second_payment_due": "2026-06-10T23:59:59Z"
  },
  "timeline": [
    { "phase": "Kickoff", "duration_days": 0, "start_date": "...", "description": "Reunión inicial 30min" },
    { "phase": "Setup", "duration_days": 2, "start_date": "...", "description": "Preparar repos, docs, accesos" },
    { "phase": "Development", "duration_days": 10, "start_date": "...", "description": "Implementar módulos" },
    ...
  ],
  "resources": {
    "repository_url": "https://github.com/tech-nova/acme-corp",
    "figma_url": "https://figma.com/...",
    "assets_url": "https://dropbox.com/...",
    "documentation_url": "https://notion.so/...",
    "contract_url": "/api/client/contract/{order_id}"
  },
  "calendly_url": "https://calendly.com/vic-technova/kickoff"
}
```

---

### 4. Email: Token de Acceso Dashboard
**Archivo:** `src/lib/emails/dashboardAccessEmail.ts` (NEW)

**Cuándo:** Cliente paga 50%

**Contenido:**
```
Subject: Tu dashboard de proyecto está listo | Tech Nova

Hola {nombre},

¡Bienvenido! Tu proyecto ya tiene un dashboard privado donde podrás seguir el progreso paso a paso.

ACCEDER A TU DASHBOARD:
[BOTÓN: Acceder al Dashboard]

O copia este link:
https://tech-nova.mx/cliente/dashboard?token={jwt}

PRÓXIMOS PASOS:
1. Entra a tu dashboard
2. Revisa tu cronograma de 4 semanas
3. Accede a los archivos: repo, Figma, assets, docs
4. Reserva tu Kickoff Call con Vic (30 min)
5. Paga el 50% restante antes del {fecha_inicio}

INFORMACIÓN DEL PROYECTO:
- Timeline: {kickoff_date} a {estimated_completion}
- Módulos: {lista}
- Total: ${total} MXN (pagaste 50%, falta 50%)

CONTACTO:
Preguntas: hola@tech-nova.mx
WhatsApp: +52 722 166 9672

¡Estamos listos para comenzar!
Sofia 🚀
```

---

### 5. Segundo Pago: Trigger + Cron
**Archivo:** `src/lib/jobs/second-payment-job.ts` (NEW)

**Cuándo:** 3 días antes de `projects.kickoff_date`

**Qué hace:**
1. Busca todos los proyectos con `payment_status = "half_paid"`
2. Si `kickoff_date - 3 días == hoy`:
   - Envía email: "Recuerda: pago 50% vence el {fecha_inicio}"
   - Incluye link a `/checkout/{uuid}/pay?percentage=100`
3. Si `kickoff_date == hoy` y aún no pagó:
   - Marca proyecto como `"payment_overdue"`
   - Envía email urgente a cliente + Vic

**Cron endpoint:** `/api/cron/second-payment-reminder`

---

### 6. Página: Pago Segundo 50%
**Archivo:** `src/app/checkout/[uuid]/pay-remaining/page.tsx` (NEW)

**Qué muestra:**
- Monto restante (50%)
- Botón "Pagar ahora"
- Resumen de proyecto
- Confirmar que es el segundo pago

**POST `/api/checkout/[uuid]/pay?percentage=100`**

**Qué hace:**
1. Crea Payment Intent con `percentage=100`
2. Redirect a Stripe checkout
3. Webhook confirma → `projects.payment_status = "fully_paid"`
4. Email confirmación a cliente
5. Proyecto ahora puede pasar a `"in_progress"` (Vic lo marca manualmente)

---

### 7. Tabla BD: Actualizar `projects`
**Archivo:** `src/db/schema.ts`

```typescript
// Ya creada en B.4.6, solo añadir:
export const projects = pgTable('projects', {
  // ... campos existentes ...
  
  // Nuevos campos para onboarding:
  repository_url: varchar('repository_url', { length: 500 }),
  figma_url: varchar('figma_url', { length: 500 }),
  assets_url: varchar('assets_url', { length: 500 }),
  documentation_url: varchar('documentation_url', { length: 500 }),
  
  kickoff_call_booked_at: timestamp('kickoff_call_booked_at'),
  kickoff_call_date: timestamp('kickoff_call_date'),
  
  // Para tracking:
  client_dashboard_accessed_at: timestamp('client_dashboard_accessed_at'),
  second_payment_due: timestamp('second_payment_due'),
});
```

---

### 8. Tabla BD: JWT Tokens
**Archivo:** `src/db/schema.ts` (NEW)

```typescript
export const clientTokens = pgTable('client_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  order_id: uuid('order_id')
    .references(() => orders.id)
    .notNull(),
  project_id: uuid('project_id')
    .references(() => projects.id)
    .notNull(),
  
  token: varchar('token', { length: 500 }).unique().notNull(),
  issued_at: timestamp('issued_at').defaultNow().notNull(),
  expires_at: timestamp('expires_at').notNull(), // 90 días
  
  last_accessed_at: timestamp('last_accessed_at'),
  revoked_at: timestamp('revoked_at'), // Si Vic revoca acceso
});
```

---

### 9. Componente: Booking Calendly
**Archivo:** `src/components/client/CalendlyBooking.tsx` (NEW)

**Qué hace:**
- Embed de Calendly profesional
- Pre-fill: cliente email, empresa, proyecto
- After booking: webhook actualiza `projects.kickoff_call_booked_at`
- Envía email confirmación a cliente + Vic

---

### 10. Email: Recordatorio 3 días antes
**Archivo:** `src/lib/emails/secondPaymentReminderEmail.ts` (NEW)

**Cuándo:** 3 días antes de `kickoff_date`

**Contenido:**
```
Subject: Recordatorio: Pago restante vence en 3 días | Tech Nova

Hola {nombre},

Tu proyecto inicia en 3 días. Necesitamos que completes el pago del 50% restante.

MONTO A PAGAR:
${monto} MXN (50% del total)

FECHA LÍMITE:
{kickoff_date}

[BOTÓN: Pagar Ahora]

Una vez que confirmes el pago, Vic comenzará el proyecto inmediatamente.

¿Dudas?
Email: hola@tech-nova.mx
WhatsApp: +52 722 166 9672

¡Casi listo!
Sofia 🚀
```

---

## 🛠️ TECH STACK

| Componente | Tech | Notas |
|-----------|------|-------|
| Auth | JWT + middleware | Token enviado por email |
| Dashboard | React client component | (interactive) |
| Calendly | Embed iframe | (existing) |
| Email | Resend | (existing) |
| Cron | Node.js edge function | `/api/cron/second-payment-reminder` |
| DB | Neon Postgres | (existing) |

---

## 📋 INSTALACIÓN & SETUP

### 1. Actualizar schema BD
```bash
npm run db:push
```

### 2. Crear componentes dashboard
```bash
src/app/cliente/dashboard/page.tsx
src/components/client/ProjectStatus.tsx
src/components/client/TimelineVisual.tsx
src/components/client/ResourcesList.tsx
src/components/client/CalendlyBooking.tsx
src/components/client/PaymentSection.tsx
```

### 3. Crear APIs
```bash
src/app/api/cliente/project/route.ts
src/app/api/cron/second-payment-reminder/route.ts
src/app/checkout/[uuid]/pay-remaining/page.tsx
```

### 4. Crear emails + jobs
```bash
src/lib/emails/dashboardAccessEmail.ts
src/lib/emails/secondPaymentReminderEmail.ts
src/lib/jobs/second-payment-job.ts
```

### 5. Env vars
```
CALENDLY_URL=https://calendly.com/vic-technova/kickoff
JWT_SECRET=... (generar secret aleatorio)
```

---

## ✅ CHECKLIST QA

### Unit Tests (5)
- [ ] JWT token generation valida `sub`, `exp`
- [ ] Middleware rechaza tokens expirados
- [ ] Timeline calculation (kickoff + fases) es correcta
- [ ] Email templates renderen sin error
- [ ] Payment reminder schedule es correcto

### Integration Tests (5)
- [ ] Crear order → genera JWT → cliente accede dashboard
- [ ] GET `/api/cliente/project` retorna datos correctos
- [ ] Calendly booking → webhook actualiza BD
- [ ] Cron reminder dispara 3 días antes de kickoff
- [ ] Pago 100% → proyecto status = "fully_paid"

### Manual Testing (5)
- [ ] Acceder dashboard con token válido
- [ ] Ver timeline visual con fechas correctas
- [ ] Links a repo/Figma funcionan
- [ ] Calendly booking sincroniza
- [ ] Email recordatorio llega 3 días antes

### Edge Cases (5)
- [ ] Token expirado → rechaza acceso
- [ ] Cliente intenta pagar sin token → rechaza
- [ ] Proyecto cancelado → token revoked
- [ ] Kickoff date ya pasó → timeline muestra rojo
- [ ] Segundo pago vencido → avisos urgentes

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 9 — contexto
- `BACKLOG_MASTER.md` § B.4.7
- `docs/technical/API_DOCUMENTATION.md` — auth patterns

**Código existente:**
- `src/middleware.ts` — extender para `/cliente/*`
- `src/lib/emails/projectStartedNotification.ts` — patrón email

**Librerías:**
- `jsonwebtoken` — JWT generation/verification
- `calendly-sdk` (si existe) o embed iframe

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] Dashboard cliente accesible via JWT token
- [x] Componentes: status, timeline, recursos, booking, pago
- [x] APIs: proyecto data, segundo pago
- [x] Emails: acceso dashboard, recordatorio segundo pago
- [x] Cron: segundo pago reminder 3 días antes
- [x] Calendly booking sincroniza con BD

✅ **Testing**
- [x] 5 unit tests
- [x] 5 integration tests
- [x] 5 escenarios manual
- [x] 5 edge cases

✅ **Documentation**
- [x] JWT flow documentado
- [x] Dashboard features documentadas
- [x] Segundo pago workflow documentado

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.7 COMPLETADO: Dashboard Cliente + Onboarding

**Qué se hizo:**
- /cliente/dashboard con timeline visual
- Acceso protegido via JWT token (90 días)
- Componentes: status, timeline, recursos, booking, pago
- 2 emails: acceso dashboard, reminder segundo pago
- Cron job: recordatorio 3 días antes pago
- Segundo pago: trigger endpoint + success flow
- 20/20 tests pasados

**Archivos creados:**
- src/app/cliente/dashboard/page.tsx (NEW)
- src/components/client/ProjectStatus.tsx (NEW)
- src/components/client/TimelineVisual.tsx (NEW)
- src/components/client/ResourcesList.tsx (NEW)
- src/components/client/CalendlyBooking.tsx (NEW)
- src/components/client/PaymentSection.tsx (NEW)
- src/app/api/cliente/project/route.ts (NEW)
- src/app/api/cron/second-payment-reminder/route.ts (NEW)
- src/lib/emails/dashboardAccessEmail.ts (NEW)
- src/lib/emails/secondPaymentReminderEmail.ts (NEW)
- src/lib/jobs/second-payment-job.ts (NEW)
- src/db/schema.ts (UPDATED — projects, clientTokens)
- src/middleware.ts (UPDATED — /cliente/* auth)

**Próximo paso:** B.4.8 (CRM + Email Workflows automáticos)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **JWT secret:** Guardar en env, NUNCA commitear.

2. **Token expiration:** 90 días es conservador. Cliente puede solicitar nuevo si vence.

3. **Timeline fases:** Basadas en horas del proyecto. Ej: 73h ÷ 7h/día = ~10 días.

4. **Calendly:** Pre-fill con cliente email para evitar fricción. Webhook de Calendly → actualizar BD.

5. **Segundo pago:** Es responsabilidad del cliente pagarlo. Si no paga antes de kickoff, Vic puede pausar proyecto (B.4.8 o manual).

6. **Dashboard tracking:** `client_dashboard_accessed_at` registra primera visita. Útil para analytics.

7. **Resource URLs:** Vic las llena manualmente en Stripe dashboard admin o variable de entorno.

8. **Offline:** Dashboard debe funcionar con datos cacheados si API falla (important for user experience).

---

**Created:** 2026-06-03  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1-6 COMPLETADOS  
**Next:** After completion → B.4.8 KICKOFF (CRM + Email Workflows)
