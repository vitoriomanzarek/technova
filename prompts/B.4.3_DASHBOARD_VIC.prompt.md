# 🚀 B.4.3 KICKOFF: Dashboard Admin para Vic (Revisión de Propuestas)

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (Vic necesita esto para operar Stage 4-5)  
**Estimated Time:** 12-14 horas  
**Timeline:** Semana 2 de Fase B.4  
**Depends on:** ✅ B.4.1 + ✅ B.4.2 COMPLETADOS

---

## 📋 OBJETIVO

Implementar **dashboard admin** (`/admin/proposals-review`) donde Vic puede:

1. **Ver** propuestas generadas por IA (lead info + audit report + propuesta JSON)
2. **Revisar** datos críticos (módulos, precio, timeline)
3. **Modificar** propuesta (quitar/agregar módulos, ajustar precio, dejar notas)
4. **Aprobar/Rechazar** propuesta con 1 click
5. **Notar cambios** realizados (para auditoría)

**Por qué es crítico:** Sin este dashboard, Vic no puede actuar. Es el gate humano entre IA y cliente.

---

## 🎯 ENTREGABLES

### 1. Página React: `/admin/proposals-review`
**Archivo:** `src/app/admin/proposals-review/page.tsx`

**Features:**

```
┌─────────────────────────────────────────────────────┐
│ PROPOSALS REVIEW DASHBOARD                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Filtros:                                            │
│ [Status ▼] [Empresa ▼] [Presupuesto ▼] [Search]   │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Status Filter Options:                              │
│ - pending_vic_review (NEW) — Propuestas esperando  │
│ - rejected — Rechazadas por Vic                     │
│ - modified — Vic las modificó                       │
│ - approved — Listas para enviar a cliente           │
│                                                     │
├─────────────────────────────────────────────────────┤
│ TABLE: Propuestas                                   │
│                                                     │
│ Empresa     │ Lead    │ Score │ Precio  │ Timeline │
│─────────────┼─────────┼───────┼─────────┼──────────│
│ Acme Corp   │ Juan    │ 42/100│ $38.9K  │ 21 días  │
│ TechStart   │ María   │ 68/100│ $25.5K  │ 14 días  │
│ ...         │ ...     │ ...   │ ...     │ ...      │
│                                                     │
│ [Click row para ver detalles]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Panel de detalles (modal o sidebar):**

```
PROPUESTA REVIEW PANEL
═══════════════════════════════════════════════════════

LEAD INFO
├─ Empresa: Acme Corp
├─ Contact: Juan García (juan@acme.mx)
├─ Sitio: https://acme-corp.mx
├─ Presupuesto estimado: $40,000 MXN
├─ Timeline: 8 semanas
└─ Prioridades: diseño, velocidad, mobile

AUDIT REPORT
├─ Score: 42/100
├─ Áreas críticas:
│  └─ Performance, Mobile, UX
└─ [Ver audit completo]

PROPUESTA IA GENERADA
├─ Precio subtotal: $38,900 MXN
├─ PM Fee (20%): $7,780 MXN
├─ Precio total: $46,680 MXN
├─ Timeline: 21 días
├─ Módulos seleccionados:
│  ├─ Identidad Completa ($8,500)
│  ├─ Landing Optimizada ($9,200)
│  └─ SEO Técnico ($6,300)
└─ Justificación: [texto]

ACCIONES VIC:
┌─────────────────────────────────────────┐
│ ☑️ MODIFICAR                             │
│    ├─ Quitar módulo: [Identidad ✓]      │
│    ├─ Agregar módulo: [E-commerce ▼]    │
│    ├─ Precio recalculado: $XX,XXX MXN  │
│    └─ Notas internas: [textarea]        │
│                                         │
│ 🟢 APROBAR TAL CUAL                     │
│    └─ [BUTTON] Aprobar                  │
│                                         │
│ 🔴 RECHAZAR                             │
│    ├─ Razón: [dropdown]                 │
│    ├─ Nota: [textarea]                  │
│    └─ [BUTTON] Rechazar                 │
└─────────────────────────────────────────┘

CAMBIOS REALIZADOS (si Vic modificó):
├─ Quité: Identidad Completa
├─ Agregué: E-commerce Core
└─ Razón: Cliente mencionó que ya tiene logo
```

---

### 2. API Endpoints

#### GET `/api/admin/proposals`
**Parámetros:**
```json
{
  "status": "pending_vic_review" | "rejected" | "modified" | "approved",
  "search": "empresa nombre",
  "sort": "created_at" | "precio_total" | "timeline_dias"
}
```

**Response:**
```json
{
  "proposals": [
    {
      "id": "uuid",
      "lead": { "id": 123, "nombre": "Juan", "empresa": "Acme" },
      "audit": { "score": 42, "priority_areas": [...] },
      "propuesta": { "precio_total": 38900, "timeline_dias": 21 },
      "status": "pending_vic_review",
      "created_at": "2026-06-02T10:30:00Z"
    }
  ],
  "total": 5,
  "pending_count": 2
}
```

#### GET `/api/admin/proposals/:id`
**Response:** Propuesta completa (lead + audit + propuesta JSON + Vic's notes)

#### PATCH `/api/admin/proposals/:id/approve`
**Body:**
```json
{
  "notas_internas": "Aprobado tal cual",
  "aprobado_por": "vic@technova.mx"
}
```

**Result:** Status → "approved", fecha → aprobado_at, envía email a Vic confirmando

#### PATCH `/api/admin/proposals/:id/modify`
**Body:**
```json
{
  "modulos_seleccionados": [...], // array actualizado
  "precio_total": 45000,
  "timeline_dias": 28,
  "notas_internas_vic": "Agregué E-commerce como cliente pidió"
}
```

**Result:**
- Recalcula totales ✓
- Actualiza DB
- Status → "modified"
- Email a Vic: "Propuesta modificada, lista para enviar"

#### PATCH `/api/admin/proposals/:id/reject`
**Body:**
```json
{
  "razon": "presupuesto_bajo" | "scope_poco_claro" | "no_viable",
  "notas_internas_vic": "Cliente necesita más presupuesto para esto"
}
```

**Result:**
- Status → "rejected"
- Lead notificado: "Estamos revisando tu proyecto..."
- Propuesta archivada

---

### 3. Componentes React

**Archivo:** `src/components/admin/ProposalsList.tsx`

```typescript
interface ProposalListProps {
  proposals: Proposal[];
  onSelectProposal: (id: string) => void;
  onFilter: (status: string) => void;
  loading?: boolean;
}

// Tabla con:
// - Lead info (empresa, nombre, email)
// - Audit score (color: rojo <50, amarillo 50-70, verde >70)
// - Propuesta (precio, timeline)
// - Status badge (pending, approved, rejected, modified)
// - Click → abre ProposalDetailPanel
```

**Archivo:** `src/components/admin/ProposalDetailPanel.tsx`

```typescript
interface ProposalDetailPanelProps {
  proposalId: string;
  onApprove: (notas: string) => void;
  onModify: (modulos: ModuleUpdate[], notas: string) => void;
  onReject: (razon: string, notas: string) => void;
  isLoading?: boolean;
}

// Panel con:
// - Lead info (read-only)
// - Audit report (read-only, collapible)
// - Propuesta JSON (editable si Vic modifica)
// - Action buttons (Aprobar, Modificar, Rechazar)
// - Notas internas (textarea)
// - Cambios realizados (si aplica)
```

**Archivo:** `src/components/admin/ModuleSelector.tsx`

```typescript
interface ModuleSelectorProps {
  catalog: Module[];
  selectedModulos: string[];
  onSelect: (modulos: string[]) => void;
  maxPresupuesto?: number;
  onPriceChange: (newPrice: number) => void;
}

// Dropdown multi-select:
// - Lista todos los módulos del catalog
// - Muestra precio + horas para cada uno
// - Recalcula precio total en vivo
// - Valida que no exceda presupuesto
```

---

### 4. Auth: Protect `/admin/*`
**Archivo:** `src/middleware.ts` (agregar)

```typescript
// Middleware que verifica:
// - Request a /admin/* tiene header Authorization
// - Token == ADMIN_DASHBOARD_TOKEN (env var)
// - Si no, retorna 403

export const adminAuthMiddleware = (request: Request) => {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (token !== process.env.ADMIN_DASHBOARD_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
};
```

**Env var:**
```bash
ADMIN_DASHBOARD_TOKEN=vic_super_secret_key_2026
```

---

### 5. Actualizar tabla `proposals` (schema.ts)
**Cambios:**

```typescript
export const proposals = pgTable('proposals', {
  // ... campos existentes ...
  
  // Nuevos campos para Vic's modifications:
  empresa_propuesta_actualizada: varchar('empresa_propuesta_actualizada', { length: 255 }), // Vic puede editar empresa si fue mal detectada
  notas_internas_vic: text('notas_internas_vic'), // Notas que solo Vic ve
});
```

---

### 6. Email: Propuesta Aprobada
**Archivo:** `src/lib/emails/proposalApprovedNotification.ts`

**Cuándo:** Cuando Vic aprueba propuesta

**Contenido:**
```
Subject: ✅ Tu propuesta está lista — {empresa}
Body:
- Empresa: {empresa}
- Propuesta aprobada por Vic ✓
- Precio: ${precio_total} MXN
- Timeline: {timeline_dias} días
- Botón: "Ver propuesta detallada" → /propuesta/{uuid}
```

---

## 🛠️ TECH STACK

| Componente | Tech | Notas |
|-----------|------|-------|
| Frontend | React 19 + Next.js | Componentes existentes como referencia |
| Auth | Token simple | ADMIN_DASHBOARD_TOKEN env var |
| Forms | React Hook Form | Para módulos editable |
| UI | Tailwind v4 | Consistente con tema TechNova |
| DB | Neon Postgres | (existing) |

---

## 📋 INSTALACIÓN & SETUP

### 1. Crear env var (Vercel)
```bash
ADMIN_DASHBOARD_TOKEN=vic_super_secret_key_2026
```

### 2. Crear página + componentes
```bash
src/app/admin/proposals-review/page.tsx
src/components/admin/ProposalsList.tsx
src/components/admin/ProposalDetailPanel.tsx
src/components/admin/ModuleSelector.tsx
```

### 3. Crear endpoints
```bash
src/app/api/admin/proposals/route.ts
src/app/api/admin/proposals/[id]/route.ts
src/app/api/admin/proposals/[id]/approve/route.ts
src/app/api/admin/proposals/[id]/modify/route.ts
src/app/api/admin/proposals/[id]/reject/route.ts
```

### 4. Middleware
```bash
src/middleware.ts (actualizar)
```

---

## ✅ CHECKLIST QA

### Unit Tests (5)
- [ ] `GET /api/admin/proposals` filtra correctamente (status, search)
- [ ] `PATCH /api/admin/proposals/:id/approve` actualiza DB
- [ ] `PATCH /api/admin/proposals/:id/modify` recalcula precio
- [ ] `PATCH /api/admin/proposals/:id/reject` marca como rechazada
- [ ] Middleware: request sin token → 403, con token válido → permitido

### Integration Tests (5)
- [ ] Página `/admin/proposals-review` carga lista de propuestas
- [ ] Click en propuesta → abre panel de detalles
- [ ] Modificar módulo → precio recalcula en vivo
- [ ] Click "Aprobar" → propuesta status = "approved", email enviado
- [ ] Click "Rechazar" → propuesta status = "rejected", lead notificado

### Manual Testing (5)
- [ ] Inicia sesión como Vic con token correcto
- [ ] Ve lista de propuestas pendientes
- [ ] Abre una propuesta → ve audit + módulos
- [ ] Modifica módulos → precio actualiza
- [ ] Aprueba propuesta → email llega

### Edge Cases (5)
- [ ] Intenta acceder sin token → 403
- [ ] Intenta modificar propuesta rechazada → error
- [ ] Modifica módulos pero precio excede presupuesto → validación
- [ ] Panel con muchas propuestas (100+) → performance OK
- [ ] Dos Vics abriendo misma propuesta → último write gana (optimistic lock NO necesario MVP)

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 5 — contexto (Vic revisa)
- `BACKLOG_MASTER.md` § B.4.3
- `docs/technical/API_DOCUMENTATION.md` — patrones endpoint
- `docs/technical/COMPONENTS_LIBRARY.md` — componentes existentes

**Código existente:**
- `src/app/admin/project-status/page.tsx` — página admin existente (referencia UI)
- `src/components/wizard/*.tsx` — componentes interactivos (referencia)
- `src/app/api/leads/route.ts` — patrón API endpoint

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] Página `/admin/proposals-review` con tabla + filtros
- [x] Modal/panel de detalles (lead + audit + propuesta)
- [x] Selector de módulos editable (multi-select)
- [x] Botones: Aprobar, Modificar, Rechazar
- [x] 5 API endpoints (/proposals, /[id], /approve, /modify, /reject)
- [x] Middleware auth (ADMIN_DASHBOARD_TOKEN)
- [x] Email cuando propuesta aprobada
- [x] Tabla `proposals` actualizada

✅ **Testing**
- [x] 5 unit tests
- [x] 5 integration tests
- [x] 5 escenarios manual
- [x] 5 edge cases

✅ **Documentation**
- [x] Código comentado
- [x] Componentes documentados
- [x] Env vars documentadas

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.3 COMPLETADO: Dashboard Admin para Vic

**Qué se hizo:**
- Página /admin/proposals-review con lista + filtros
- Panel de detalles (lead + audit + propuesta editable)
- Módulo selector interactivo con recálculo de precio
- 5 endpoints API (list, detail, approve, modify, reject)
- Auth middleware (ADMIN_DASHBOARD_TOKEN)
- Email cuando propuesta aprobada
- 20/20 tests pasados

**Archivos modificados/creados:**
- src/app/admin/proposals-review/page.tsx (NEW)
- src/components/admin/ProposalsList.tsx (NEW)
- src/components/admin/ProposalDetailPanel.tsx (NEW)
- src/components/admin/ModuleSelector.tsx (NEW)
- src/app/api/admin/proposals/route.ts (NEW)
- src/app/api/admin/proposals/[id]/route.ts (NEW)
- src/app/api/admin/proposals/[id]/approve/route.ts (NEW)
- src/app/api/admin/proposals/[id]/modify/route.ts (NEW)
- src/app/api/admin/proposals/[id]/reject/route.ts (NEW)
- src/lib/emails/proposalApprovedNotification.ts (NEW)
- src/middleware.ts (UPDATED — auth)
- src/db/schema.ts (UPDATED — campos Vic)

**Próximo paso:** B.4.4 (Envío de propuesta a cliente)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **Auth simple MVP:** ADMIN_DASHBOARD_TOKEN es hardcoded en env. Después podría ser JWT + user table, pero MVP no lo necesita.

2. **Precio recalculado en vivo:** Cuando Vic modifica módulos, el frontend recalcula precio usando el mismo logic que B.4.2 (sum modulos + 20% PM). No hacer query a servidor (sería lento).

3. **Editar empresa:** Si Vic ve que cliente registró empresa incorrectamente, puede editarla en el panel. Se guarda en DB para auditoría.

4. **Status flow:** 
   - Creada como `pending_vic_review`
   - Vic: approve → `approved`
   - Vic: modify → `modified`
   - Vic: reject → `rejected`
   - Una vez `approved` o `modified`, NO puede volver a `pending_vic_review`

5. **Email a Vic:** Cuando propuesta se APRUEBA (no cuando se modifica), email a Vic diciendo "Propuesta aprobada, lista para enviar a cliente".

6. **Cambios realizados:** Si Vic modifica propuesta, mostrar en el panel:
   ```
   CAMBIOS REALIZADOS:
   - Quité: Identidad Completa (por presupuesto)
   - Agregué: E-commerce Core
   - Nota: Cliente necesita tienda en 2 meses
   ```

7. **Performance:** Si hay 100+ propuestas, usar pagination (20 por página) o virtual scrolling.

8. **Sorting:** Default sort por `created_at DESC` (propuestas más nuevas primero).

---

## 📊 EXPECTED UI FLOW

```
Vic abre /admin/proposals-review
     ↓
Ve lista de 5 propuestas pendientes (status badge ROJO)
     ↓
Click en "Acme Corp" → abre panel derecho
     ↓
Ve:
- Audit score 42/100 (ROJO)
- Propuesta con módulos (Identidad, Landing, SEO)
- Precio $38.9K
- Botones: Aprobar | Modificar | Rechazar
     ↓
Elige: "Modificar"
     ↓
Selector módulos:
- ☑ Identidad Completa ($8.5K)
- ☑ Landing Optimizada ($9.2K)
- ☑ SEO Técnico ($6.3K)
- ☐ E-commerce (Vic puede activar)
     ↓
Vic activa E-commerce: Precio salta a $46K
     ↓
Vic escribe nota: "Cliente pidió ecommerce, agregué como fase 1"
     ↓
Click "Guardar cambios"
     ↓
Propuesta actualizada:
- Status: "modified"
- Módulos: ahora con E-commerce
- Notas: guardadas
- Email a Vic: "Propuesta modificada, lista para enviar"
     ↓
Vic ve propuesta en list, status ahora "AMARILLO" (modified)
     ↓
Click "Aprobar" (en el panel)
     ↓
Status: "approved" (VERDE)
     ↓
Propuesta lista para Stage 4 (envío a cliente)
```

---

**Created:** 2026-06-02  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1 + ✅ B.4.2  
**Next:** After completion → B.4.4 KICKOFF (Email + /propuesta/{uuid})
