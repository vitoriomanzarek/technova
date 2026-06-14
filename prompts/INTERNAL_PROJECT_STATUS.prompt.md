# PROMPT: INTERNAL — Página /internal/project-status

---

## 1. OBJETIVO

Crear la página `/internal/project-status` en la app Next.js de TechNova. Es un dashboard visual para Vic que muestra en tiempo real el estado completo del proyecto: qué está hecho, qué está en progreso, qué falta, métricas de avance, y los próximos pasos priorizados.

La página lee directamente los archivos de documentación del proyecto (`BACKLOG_MASTER.md`, `BITACORA.md`, `DECISION_LOG.md`) y los presenta de forma visual. Mismo patrón que `/internal/architecture` que ya existe.

---

## 2. ENTREGABLES

### Archivos nuevos
- `src/app/internal/project-status/page.tsx` — página principal
- `src/lib/backlog-parser.ts` — parser de BACKLOG_MASTER.md (extrae fases, items, statuses)
- `src/components/internal/ProjectStatusDashboard.tsx` — componente principal
- `src/components/internal/PhaseProgressCard.tsx` — tarjeta de progreso por fase
- `src/components/internal/BacklogItemList.tsx` — lista de items con status visual
- `src/components/internal/SprintStatusPanel.tsx` — panel del sprint actual (SEC)
- `src/components/internal/NextStepsBanner.tsx` — banner "próximos 3 pasos"

### Archivos modificados
- `src/app/internal/layout.tsx` (si existe) o `src/app/internal/architecture/page.tsx` — añadir link de navegación a `/internal/project-status`

### Reporte
- `reports/INTERNAL_PROJECT_STATUS_REPORT.md`

---

## 3. TECH STACK

- Next.js 14+ (App Router, `force-dynamic`)
- TypeScript estricto
- Tailwind CSS (mismo sistema de diseño que `/internal/architecture`)
- `fs` (Node.js) para leer archivos `.md` en build time / request time
- `gray-matter` o parsing manual con regex para extraer datos del BACKLOG_MASTER
- Sin dependencias nuevas si es posible — parsear con regex/split como hace `decision-parser.ts`

---

## 4. SETUP

```bash
# Ver cómo funciona la página existente para copiar el patrón
cat src/app/internal/architecture/page.tsx
cat src/lib/decision-parser.ts

# Ver el layout de internal (si existe)
ls src/app/internal/
cat src/app/internal/layout.tsx 2>/dev/null || echo "no layout"
```

La autenticación ya está resuelta (SEC-1): el middleware en `src/proxy.ts` protege todo `/internal/*` con `ADMIN_DASHBOARD_TOKEN`. No hay que añadir auth.

Archivos fuente a parsear (en raíz del proyecto):
- `BACKLOG_MASTER.md` — fuente principal de datos
- `BITACORA.md` — última entrada = última sesión de trabajo
- `DECISION_LOG.md` — decisiones activas

---

## 5. CHECKLIST QA — LO QUE DEBE MOSTRAR LA PÁGINA

### Panel 1: Resumen Ejecutivo (hero)
- [ ] Fecha de última actualización (del BACKLOG_MASTER o hoy)
- [ ] Porcentaje global de completado (items ✅ / total items)
- [ ] Estado actual del sprint (texto del sprint activo)
- [ ] Días desde inicio del proyecto (D-XXX contando desde fecha de inicio)

### Panel 2: Progreso por Fase
- [ ] **Fase A** — barra de progreso, items completados / total, fecha de cierre
- [ ] **Pendientes Operativos (OP)** — items pendientes destacados en rojo
- [ ] **Sprint SEC** — items completados/total, estado visual (🔴/🟡/✅)
- [ ] **Fase B** — progreso 0% con timeline Jul-Sep 2026, sub-items por área
- Cada fase tiene: título, status badge (DONE / IN PROGRESS / NOT STARTED), barra de progreso visual, lista colapsable de items

### Panel 3: Sprint Actual — SEC
- [ ] Tabla de todos los items SEC-1 a SEC-6 con status (✅/🔄/🔴)
- [ ] Items completados en verde, en progreso en amarillo, pendientes en rojo
- [ ] Nota de bloqueo si algún SEC está bloqueado

### Panel 4: Fase B — Lo que viene
- [ ] Cards por área (B.1 Imagery, B.2 Marketing, B.3 NOVA AI, B.4 Commercial Flow, B.5 Dashboard)
- [ ] Estado de cada área (NOT STARTED con fecha estimada)
- [ ] Success metrics de Fase B: 500+ visitors/mes, 30+ leads/mes, >20% conversion

### Panel 5: Próximos 3 pasos (accionables)
- [ ] Lista priorizada de las 3 tareas más urgentes pendientes
- [ ] Badge de prioridad (CRÍTICA / ALTA / MEDIA)
- [ ] Estimado de tiempo

### Panel 6: BITÁCORA — Última sesión
- [ ] Fecha de la última entrada en BITACORA.md
- [ ] Resumen de qué se hizo (primeras líneas de la última sesión)
- [ ] Link a `BITACORA.md` completo (o mostrar las últimas 3 sesiones)

### Panel 7: Decisiones activas (DECISION_LOG)
- [ ] Últimas 5 decisiones tomadas (D-XXX, título, fecha)
- [ ] Badge de estado (ACTIVE / SUPERSEDED)

---

## 6. REFERENCIAS

```
src/app/internal/architecture/page.tsx   # Patrón de página internal existente
src/lib/decision-parser.ts               # Cómo parsear archivos .md con fs + regex
src/components/internal/                 # Componentes existentes (copiar estilos)
BACKLOG_MASTER.md                        # Fuente de datos principal
BITACORA.md                              # Última sesión de trabajo
DECISION_LOG.md                          # Decisiones del proyecto
```

### Convenciones de status en BACKLOG_MASTER.md
El parser debe reconocer estos patrones:
- `✅` o `**Status:** ✅` → DONE (verde)
- `🔄` → IN PROGRESS (amarillo)
- `🔴` → NOT STARTED / BLOQUEADO (rojo)
- `🟡` → PENDIENTE / MEDIA PRIORIDAD (naranja)
- `- [x]` → sub-item completado
- `- [ ]` → sub-item pendiente

---

## 7. DEFINITION OF DONE

- [ ] `http://localhost:3000/internal/project-status` carga sin errores
- [ ] Muestra los 7 paneles descritos en sección 5
- [ ] Los status de las fases coinciden con BACKLOG_MASTER.md (Fase A = 100%, SEC = ~83%, Fase B = 0%)
- [ ] Panel "Próximos 3 pasos" muestra: SEC-3 (rotación claves), SEC-6 (consolidación documental), B.1 (inicio Julio)
- [ ] Link de navegación desde `/internal/architecture` a `/internal/project-status`
- [ ] `npx tsc --noEmit` limpio
- [ ] `npm run build` sin errores
- [ ] Reporte generado en `reports/INTERNAL_PROJECT_STATUS_REPORT.md`

---

## 8. CÓMO REPORTAR

Crear `reports/INTERNAL_PROJECT_STATUS_REPORT.md`:

```markdown
# Reporte: /internal/project-status

**Fecha:** <fecha>
**Estado:** ✅ COMPLETADO

## Archivos creados
- <lista>

## Archivos modificados
- <lista>

## Parser implementado
- Qué datos extrae y cómo

## Screenshots / descripción visual
- <descripción de cada panel>

## tsc + build
- tsc: ✅ 0 errores
- build: ✅ sin errores

## Notas
- <edge cases, limitaciones, suposiciones>
```

---

## 9. TIPS & GOTCHAS

- **Copiar el patrón de `decision-parser.ts`:** usa `fs.readFileSync` + regex. No instalar `gray-matter` si el parser de decisiones ya hace algo similar sin dependencias extra.
- **`force-dynamic`:** la página debe ser dinámica (`export const dynamic = 'force-dynamic'`) para leer archivos actualizados en cada request, no solo en build.
- **Rutas de archivos:** en producción (Vercel), los archivos `.md` no están disponibles. Esta página es solo para desarrollo local / uso interno de Vic. Usa `process.env.NODE_ENV !== 'production'` para mostrar un fallback graceful en prod, o bien leer desde una variable de entorno con los datos hardcodeados. La solución más simple: `try/catch` que retorna datos vacíos en producción.
- **Estilo:** seguir exactamente el mismo dark theme de `/internal/architecture` — fondo `#0a0a0a`, texto blanco, acentos con `text-blue-400` / `text-green-400` / `text-red-400`.
- **No sobrediseñar el parser:** no hace falta parsear 100% del markdown. Basta con extraer: secciones por `###`, status del header, y contar `- [x]` vs `- [ ]` para el progreso.
- **El auth ya funciona:** el middleware bloquea `/internal/*` sin `ADMIN_DASHBOARD_TOKEN`. No tocar auth.
- **Commit al final:** `feat(internal): página /internal/project-status — dashboard visual de estado del proyecto`
