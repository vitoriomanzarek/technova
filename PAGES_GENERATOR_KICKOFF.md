# 📊 PAGES GENERATOR KICKOFF - Project Status & Architecture Dashboard
## Para Claude Code: Dashboards de Visibilidad Interna

**Dueño:** Claude Code  
**Autoridad:** Vic (Fundador) - APROBADO  
**Status:** 🔴 LISTO PARA EJECUTAR

---

## 🎯 OBJETIVO

Crear 2 páginas administrativas que **viven de BITACORA.md + DECISION_LOG.md**:
1. **Project Status Dashboard** - Progreso de fases, timeline, blockers (para Vic + equipo)
2. **Architecture Dashboard** - Stack técnico, flujos, integraciones (para developers)

Ambas se **actualizan automáticamente** cuando BITACORA.md cambia (on-demand, no requiere build).

---

## 📋 TAREAS (En Orden)

### TAREA 1: Project Status Dashboard (`/admin/project-status`)
**Status:** 🔴 NO INICIADO

**Entregar:**

Página privada que muestra progreso real del proyecto en tiempo de lectura.

**Requisitos técnicos:**

1. **Ruta y autenticación**
   - Path: `src/app/admin/project-status/page.tsx`
   - Auth: Protegida por middleware simple (header `x-admin-token` matching env var)
   - No es ruta pública

2. **Parser de BITACORA.md**
   - Crear archivo `src/lib/bitacora-parser.ts`
   - Función: lee BITACORA.md desde disk (`fs`)
   - Extrae:
     - Cada `## [2026-MM-DD] <TITULO>` → evento
     - Status line (✅/🔴/⏳) → estado
     - Descripción
     - Tasks si hay (markdown lists)
   - Output: array de eventos tipados
   
   ```ts
   type BitacoraEvent = {
     date: string; // "2026-05-20"
     title: string; // "FASE 3 COMPLETADA"
     status: 'completed' | 'in-progress' | 'blocked' | 'pending';
     description: string;
     tasks?: { name: string; completed: boolean }[];
   };
   ```

3. **Parser de DECISION_LOG.md**
   - Crear archivo `src/lib/decision-parser.ts`
   - Extrae decisiones activas (no archived)
   - Output: array decisiones tipadas

4. **Componentes React**
   
   **ProgressCard.tsx** - Resumen de cada fase
   ```tsx
   {
     phase: "Fase 1",
     name: "Memory & Fundamentos",
     completedTasks: 8,
     totalTasks: 8,
     status: "completed",
     startDate: "2026-05-20",
     completedDate: "2026-05-20",
     tasks: [...]
   }
   // Renderiza: Fase 1 | ████████░░ 100% ✅ | Completada 2026-05-20
   ```

   **TimelineView.tsx** - Timeline visual
   - Eje vertical con eventos
   - Cada evento muestra fecha, título, status
   - Color: green (✅), red (🔴), yellow (⏳)
   - Hover para ver detalles

   **BlockersAlert.tsx** - Blockers activos
   - Lee BITACORA.md, busca [BLOQUEADOR]
   - Muestra lista roja/amarilla
   - Linkea a sección BITACORA específica

   **VelocityStats.tsx** - Métricas
   - Tasks completadas / semana
   - Promedio de duración de tarea
   - Proyección de fecha de terminación

5. **Layout de la página**
   ```
   ┌─────────────────────────────────────────┐
   │ TechNova Project Status Dashboard       │
   ├─────────────────────────────────────────┤
   │ 📊 Progreso General                     │
   │ ████████░░ 75% Completado               │
   │                                         │
   │ Fase 1 ████████░░ 100% ✅              │
   │ Fase 2 ████████░░ 100% ✅              │
   │ Fase 3 ████████░░ 100% ✅              │
   │ Fase 4 ██░░░░░░░░  20% 🔴              │
   │                                         │
   │ ⚠️ BLOCKERS (0 activos)                 │
   │                                         │
   │ 📈 Velocity: 8 tasks/semana             │
   │ ETA Fase 4: 2026-05-27                  │
   │                                         │
   │ 📅 Timeline (últimas 10 acciones)       │
   │   2026-05-20 ✅ FASE 3 COMPLETADA       │
   │   2026-05-19 ✅ BITACORA updated        │
   │   ...                                   │
   └─────────────────────────────────────────┘
   ```

6. **Estilos**
   - Tailwind v4
   - Dark theme (fondo oscuro)
   - Gradientes para progreso
   - Animaciones suaves
   - Responsive (mobile friendly)

7. **Update mechanism**
   - Página carga parsers on-render (no cachea)
   - Cada refresh lee BITACORA.md fresco
   - Si necesitas, agregar botón "Refresh now"

**Referencia:**
- `docs/BITACORA.md` (fuente de datos)
- `DECISION_LOG.md` (decisiones)
- TECHNICAL_ARCHITECTURE.md (contexto)

**Output:** 
- `src/app/admin/project-status/page.tsx` (página)
- `src/lib/bitacora-parser.ts` (parser BITACORA)
- `src/lib/decision-parser.ts` (parser DECISION_LOG)
- `src/components/admin/ProgressCard.tsx`
- `src/components/admin/TimelineView.tsx`
- `src/components/admin/BlockersAlert.tsx`
- `src/components/admin/VelocityStats.tsx`

---

### TAREA 2: Architecture Dashboard (`/internal/architecture`)
**Status:** 🔴 NO INICIADO

**Entregar:**

Página de arquitectura interna: stack, flujos, integraciones (para developers nuevo).

**Requisitos técnicos:**

1. **Ruta y acceso**
   - Path: `src/app/internal/architecture/page.tsx`
   - Privada (mismo middleware que `/admin/*`)
   - Destinada a developers + equipo técnico

2. **Secciones de contenido**

   **Sección 1: Tech Stack**
   - Grid con cards de cada tecnología:
     ```
     Next.js 16.2.4 | React 19.2.4 | Tailwind CSS v4
     Drizzle ORM 0.45.2 | Neon Postgres | TypeScript 5
     Stripe API | Resend | Upstash Redis
     Vercel | GitHub | Framer Motion
     ```
   - Cada card muestra: logo, nombre, versión, descripción breve
   - Link a doc decision (por qué se eligió)
   - Alternativas descartadas si hay

   **Sección 2: System Architecture (diagrama Mermaid o SVG)**
   ```
   Frontend (Next.js + React)
         ↓
   API Routes (src/app/api/*)
         ↓
   [Validación Zod] → [Stripe/Resend SDK] → [Neon DB]
         ↓
   Database (Postgres 3 tablas)
   - services
   - leads
   - orders
   ```
   Renderizar como Mermaid o SVG ASCII art mejorado

   **Sección 3: Data Flow (Leads)**
   ```
   User fills form
         ↓
   POST /api/leads (validation con Zod)
         ↓
   Insert leads table (Neon)
         ↓
   Async email via Resend
         ↓
   Response: {success: true, emailSent: bool}
   ```

   **Sección 4: Data Flow (Checkout)**
   ```
   User clicks "Buy Plan"
         ↓
   POST /api/checkout (validation)
         ↓
   Create Stripe Session
         ↓
   Redirect to checkout.stripe.com
         ↓
   Webhook /api/checkout/webhook (signature verified)
         ↓
   Insert order table + update lead
   ```

   **Sección 5: Integration Map**
   - Visual de servicios externos:
     - Vercel (hosting, edge middleware, logs)
     - Neon (database, backups)
     - Stripe (payments, webhooks)
     - Resend (email, templates)
     - Upstash (rate limiting, Redis)
     - GitHub (version control, CI/CD)
     - Slack/Discord (optional, future alerts)
   - Cada uno con arrow mostrando dirección de comunicación

   **Sección 6: Folder Structure**
   ```
   src/
   ├── app/          (App Router)
   │   ├── page.tsx  (home)
   │   ├── api/      (API routes)
   │   │   ├── leads/route.ts
   │   │   ├── checkout/route.ts
   │   │   └── checkout/webhook/route.ts
   │   ├── admin/    (private)
   │   │   └── project-status/
   │   └── internal/ (private)
   │       └── architecture/
   ├── components/   (React components)
   │   ├── home/
   │   ├── admin/
   │   └── ...
   ├── db/           (Database)
   │   ├── schema.ts
   │   └── seed.ts
   ├── lib/          (Utilities)
   │   ├── bitacora-parser.ts
   │   └── ...
   └── styles/       (Tailwind)
   ```
   Renderizar como árbol interactivo con expandibles

   **Sección 7: Key Decisions**
   - Links a DECISION_LOG.md para decisiones críticas:
     - D-001: Why Next.js 16
     - D-004: Neon + Drizzle
     - D-007: Stripe boilerplate
     - D-010: Rate limiting Upstash
   - Cada uno con link clickeable a DECISION_LOG

   **Sección 8: Environment Variables**
   ```
   Production:
   - DATABASE_URL (Neon)
   - RESEND_API_KEY
   - STRIPE_SECRET_KEY
   - UPSTASH_REDIS_REST_URL / TOKEN
   
   Vercel-specific:
   - NEXT_PUBLIC_STRIPE_KEY
   ```

3. **Componentes React**
   
   **TechStackGrid.tsx**
   - Renderiza grid de tecnologías
   - Card por tech con logo, versión, descripción

   **ArchitectureDiagram.tsx**
   - Mermaid diagram embebida (o SVG custom)
   - Muestra flujo frontend → API → DB

   **DataFlowVisualization.tsx**
   - 2 flujos: Leads + Checkout
   - Step-by-step con arrows

   **IntegrationMap.tsx**
   - Nodos de servicios externos
   - Conexiones (bidireccionales o unidireccionales)
   - Tailwind + Framer Motion para interactividad

   **FolderTree.tsx**
   - Árbol de carpetas expandible
   - Muestra estructura actual
   - Expandible/colapsable por sección

4. **Layout**
   ```
   ┌──────────────────────────────────────────────────┐
   │ TechNova Architecture Dashboard                  │
   ├──────────────────────────────────────────────────┤
   │ 🛠️ Tech Stack                                     │
   │ [Next.js] [React] [Tailwind] [Drizzle] [Neon]   │
   │                                                  │
   │ 🏗️ System Architecture                           │
   │ [Diagram Mermaid aquí]                          │
   │                                                  │
   │ 📊 Data Flow - Leads                             │
   │ Form → API → DB → Email                         │
   │                                                  │
   │ 💳 Data Flow - Checkout                          │
   │ Button → API → Stripe → Webhook → DB            │
   │                                                  │
   │ 🔗 Integrations                                  │
   │ [Integration map visual]                        │
   │                                                  │
   │ 📁 Folder Structure                              │
   │ [Tree view expandible]                          │
   │                                                  │
   │ 🎯 Key Decisions                                 │
   │ • Why Next.js → link to D-001                    │
   │ • Why Neon → link to D-004                       │
   │ ...                                              │
   └──────────────────────────────────────────────────┘
   ```

5. **Estilos**
   - Tailwind v4
   - Dark theme con accents de color (cyan, purple)
   - Diagrams legibles (good contrast)
   - Animations suaves (Framer Motion)
   - Responsive pero optimizado para desktop (developer device)

6. **Mermaid diagrams** (si usas)
   - Instalar si no está: `npm install mermaid`
   - Renderizar en componente React
   - Ejemplos:
     ```mermaid
     graph TD
       A[Frontend] --> B[API Routes]
       B --> C[Validation Zod]
       C --> D[Neon Database]
       B --> E[Stripe SDK]
       B --> F[Resend Email]
     ```

**Output:**
- `src/app/internal/architecture/page.tsx` (página)
- `src/components/internal/TechStackGrid.tsx`
- `src/components/internal/ArchitectureDiagram.tsx`
- `src/components/internal/DataFlowVisualization.tsx`
- `src/components/internal/IntegrationMap.tsx`
- `src/components/internal/FolderTree.tsx`
- Mermaid diagrams inline o como archivos

---

### TAREA 3: Update Automation Script
**Status:** 🔴 NO INICIADO

**Entregar:**

Script que regenera las 2 páginas cuando BITACORA.md cambia.

**Requisitos:**

1. **Script: `npm run generate:status`**
   - Ubicación: `scripts/generate-status.js` (o `.ts` compilado)
   - Lo que hace:
     - Lee BITACORA.md
     - Calcula métricas (% completado, velocity)
     - Valida que parsers no erroren
     - Logs: ✅ Project status updated (timestamp)
   - NO toca archivos del repo (solo lectura)
   - Rápido (< 500ms)

2. **Integration en Git workflow (opcional pero recomendado)**
   - Post-commit hook via Husky (si está instalado)
   - O manual: `npm run generate:status` después de editar BITACORA.md
   - Idea: Vic edita BITACORA.md → abre `/admin/project-status` → refreshea → ve cambios

3. **Validaciones**
   - Si BITACORA.md no existe → error
   - Si parser falla → log error + exit 1
   - Si DECISION_LOG.md no existe → warning (no crash)

**Output:**
- `scripts/generate-status.js` (puede ser bash o Node)
- `package.json`: add script `"generate:status": "node scripts/generate-status.js"`
- Documentación en archivo README si aplica

---

## 📊 ORDEN DE EJECUCIÓN

Ejecuta en orden: TAREA 1 → TAREA 2 → TAREA 3.

---

## ✅ CHECKLIST DE ENTREGA

### Tarea 1 (Project Status)
- [ ] `src/app/admin/project-status/page.tsx` creado
- [ ] `src/lib/bitacora-parser.ts` funcionando (parsea eventos)
- [ ] `src/lib/decision-parser.ts` funcionando (parsea decisiones)
- [ ] Componentes React creados (Progress, Timeline, Blockers, Velocity)
- [ ] Middleware auth básico funcionando (header token check)
- [ ] Página renderiza sin errores
- [ ] Datos frescos cada refresh (no cachea parsers)
- [ ] Responsive + accesible

### Tarea 2 (Architecture)
- [ ] `src/app/internal/architecture/page.tsx` creado
- [ ] Componentes React creados (TechStack, Diagram, DataFlow, Integration, FolderTree)
- [ ] Tech stack grid con 12+ tecnologías
- [ ] Diagramas Mermaid/SVG claros y legibles
- [ ] 2 data flows (Leads + Checkout) documentados
- [ ] Integration map renderiza correctamente
- [ ] Folder tree es interactivo (expandible)
- [ ] Links a DECISION_LOG.md funcionan
- [ ] Middleware auth en su lugar

### Tarea 3 (Script)
- [ ] `scripts/generate-status.js` existe
- [ ] Script corre sin errores: `npm run generate:status`
- [ ] Logs output timestamp + ✅
- [ ] Validaciones en lugar (archivos faltantes)
- [ ] package.json tiene script nuevo

### Calidad General
- [ ] No hay console.logs en producción
- [ ] TypeScript strict (sin `any`)
- [ ] Tailwind clases en orden
- [ ] No hay componentes duplicate
- [ ] README actualizado (si hay instrucciones)

---

## 🎯 ÉXITO SIGNIFICA

✅ `/admin/project-status` muestra progreso real, vive de BITACORA.md  
✅ `/internal/architecture` explica sistema de forma visual y amigable  
✅ Ambas páginas se actualizan cuando editas BITACORA.md  
✅ Nuevo developer entra, lee `/internal/architecture`, entiende todo  
✅ Vic entra a `/admin/project-status`, ve estado sin preguntar  
✅ Paginas son bonitas, funcionales, profesionales  

---

## 📞 CONTACTO CON VIC

Si necesitas:
- **Clarificación de diseño:** Escribe en BITACORA.md [PAGES_GENERATOR PREGUNTA]
- **Decisión:** Escribe [PAGES_GENERATOR DECISIÓN]
- **Bloqueador:** Escribe [PAGES_GENERATOR BLOQUEADOR]

---

## 🔗 REFERENCIAS

1. **BITACORA.md** - fuente de datos proyecto
2. **DECISION_LOG.md** - decisiones técnicas
3. **TECHNICAL_ARCHITECTURE.md** - contexto arquitectura
4. **technova_development_standards.md** - convenciones código

---

## 🚀 VAS, CLAUDE CODE?

**Status:** Esperando tu ejecución  
**Autonomía:** Total (diseña, implementa, testea localmente)  
**Presión:** Media (bonus features para Vic)  
**Éxito:** 2 dashboards que explican TechNova visualmente

**¡Dale!**

---

**Preparado por:** Claude (Arquitecto)  
**Para:** Claude Code (Ejecutor)  
**Validado por:** Vic (Fundador)  
**Status:** ✅ LISTO PARA EJECUTAR

**Próximo reporte:** Actualiza BITACORA.md con [PAGES_GENERATOR] entry cuando termines.
