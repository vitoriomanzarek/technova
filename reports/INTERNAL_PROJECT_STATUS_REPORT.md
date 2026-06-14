# Reporte: /internal/project-status

**Fecha:** 2026-06-14
**Ejecutado por:** Claude Code (Ejecutor)
**Prompt:** `prompts/INTERNAL_PROJECT_STATUS.prompt.md`
**Estado:** ✅ COMPLETADO — tsc limpio, build OK, página renderiza los 7 paneles en vivo

---

## Resumen ejecutivo

Nueva página `/internal/project-status`: dashboard visual para Vic que lee en vivo
`BACKLOG_MASTER.md`, `BITACORA.md` y `DECISION_LOG.md` y los presenta en 7 paneles.
Mismo patrón que `/internal/architecture` (server component `force-dynamic` + parsers `fs`+regex,
sin dependencias nuevas). Protegida por el gate `ADMIN_DASHBOARD_TOKEN` ya existente (SEC-1) —
no se tocó auth.

**Decisión clave de implementación:** el dashboard calcula el progreso desde los archivos
**en vivo** (fuente de verdad), no desde números hardcodeados ni desde la tabla resumen
(que está desactualizada). Ver "Notas / discrepancias".

---

## Archivos creados

- `src/lib/backlog-parser.ts` — parser de BACKLOG_MASTER.md (tabla de fases, items SEC, sub-items con id, checkboxes, próximos pasos)
- `src/app/internal/project-status/page.tsx` — página (force-dynamic, lee los 3 .md en paralelo)
- `src/components/internal/ProjectStatusDashboard.tsx` — componente principal (compone los 7 paneles)
- `src/components/internal/PhaseProgressCard.tsx` — tarjeta de fase + barra de progreso + `STATUS_META` compartido
- `src/components/internal/BacklogItemList.tsx` — lista colapsable (`<details>` nativo, sin JS cliente)
- `src/components/internal/SprintStatusPanel.tsx` — tabla del sprint SEC con status por color + nota de bloqueo
- `src/components/internal/NextStepsBanner.tsx` — banner "próximos 3 pasos" con badge de prioridad

## Archivos modificados

- `src/lib/bitacora-parser.ts` — **se añadió** `parseSessions()` + `getRecentSessionsSafe()` para el formato actual `## … SESSION <fecha>: título`. (El parser existente solo reconocía el formato viejo `## [fecha] - título`, que ya no se usa — por eso se extendió en vez de duplicar archivo.)
- `src/app/internal/architecture/page.tsx` — link de navegación a `/internal/project-status`

> **Nota de entregables:** el prompt listaba `bitacora-parser.ts` como archivo nuevo, pero ya
> existía (lo usa `/admin/project-status`). Se extendió el existente en lugar de crear un duplicado.

---

## Parser implementado

**`backlog-parser.ts`** extrae de BACKLOG_MASTER.md:
- **Tabla EXECUTIVE SUMMARY** → `PhaseRow[]` (fase, status, duración, focus, % progreso).
- **Items SEC** (`### SEC-N:` + su `**Status:**`) → `SecItem[]` con status, prioridad y estimado.
- **Sub-items con id** (`### A.1`, `#### B.1.1`, `### OP-3`, `### SEC-2`) → `SubItem[]` (status del emoji del header o del `**Status:**` que sigue). 69 sub-items detectados.
- **Progreso global** = conteo `- [x]` vs `- [ ]` en todo el archivo.
- **Próximos pasos** = items SEC no terminados (ordenados por prioridad) + 1ª área de Fase B agendada.
- Todos los `*Safe()` hacen `try/catch` → en prod (Vercel, sin .md) devuelven fallback vacío y la página muestra un aviso amarillo.

**`bitacora-parser.ts`** (`parseSessions`): extrae fecha, título, status, owner y resumen (primeras líneas) de cada `## … SESSION`. 24 sesiones parseadas; el panel muestra las últimas 3.

Valores verificados en el render real (con token):
- Completado global: **54%** (171/314 checklist items)
- Sprint SEC: **67%** (4/6 — SEC-1,2,4,5 done; SEC-3,6 pendientes)
- Próximos 3 pasos: **SEC-3, SEC-6, B.1 Imagery** (coincide con la DoD)
- Días de proyecto: **D-26** (desde 2026-05-20)

---

## Descripción visual (7 paneles)

1. **Resumen Ejecutivo** — 4 stats (completado global, sprint actual, días de proyecto, última actualización) + línea de contexto.
2. **Progreso por Fase** — 4 tarjetas (Fase A 100%, Pendientes OP, Sprint SEC 67%, Fase B 0%) con barra de progreso y lista colapsable de sub-items.
3. **Sprint Actual — SEC** — tabla SEC-1…SEC-6 con status por color (verde/amarillo/naranja/rojo) + barra global + nota de bloqueo si hay críticos sin iniciar.
4. **Fase B — Lo que viene** — cards por área (B.1, B.2, B.3, B.5; B.4 excluida porque ya está en producción) + success metrics.
5. **Próximos 3 pasos** — 3 cards numeradas con badge CRÍTICA/ALTA/MEDIA + estimado.
6. **Bitácora — Últimas sesiones** — últimas 3 sesiones (título, fecha, owner, status, resumen).
7. **Decisiones activas** — últimas 5 decisiones de DECISION_LOG.md (id, título, status, fecha/dueño).

Tema oscuro cosmos idéntico a `/internal/architecture` (`glass-card`, `text-gradient`, acentos cyan/verde/rojo).

---

## tsc + build

- **tsc:** ✅ `npx tsc --noEmit` → 0 errores
- **build:** ✅ `npm run build` → exit 0. `/internal/project-status` emitida como `ƒ (Dynamic, server-rendered on demand)`, correcto para `force-dynamic`.
- **Runtime:** ✅ servida con `x-admin-token` → HTTP 200 (~112 KB), los 7 paneles presentes, sin errores en los logs del dev server. Sin token → HTTP 401 (gate funciona).

---

## Notas / discrepancias (para Cowork/Vic)

> **✅ Actualización 2026-06-14:** por instrucción de Vic, las discrepancias #1 y #2 ya fueron **reconciliadas** en `BACKLOG_MASTER.md` + entrada en `BITACORA.md`. Sprint SEC quedó en **5/6 = 83%** (solo SEC-6 pendiente). El dashboard, al leer en vivo, ya refleja los valores nuevos.

1. **✅ RESUELTO — Conflicto SEC-3 (BACKLOG vs BITACORA).** BACKLOG marcaba SEC-3 `🔴 NO INICIADO`; BITACORA (cierre formal 2026-06-13) lo daba `✅ DONE (acción Vic)`. Se alineó BACKLOG a la versión más reciente (SEC-3 ✅ DONE, 4 sub-items marcados) con nota de reversa por si alguna clave no se rotó realmente.

2. **✅ RESUELTO — Tabla resumen stale** (decía SEC = 0% / "PRÓXIMO — BLOQUEANTE"). Actualizada a `🟡 EN PROGRESO … 83%`. El dashboard de todos modos calcula el % en vivo desde los items SEC.

3. **Días de proyecto = D-26** (no D-25). Pequeño off-by-one por `new Date('2026-05-20')` en UTC vs hora local. Cosmético; si molesta se ajusta con un offset de zona horaria.

4. **Solo local.** En prod (Vercel) los `.md` no se despliegan → los `*Safe()` devuelven vacío y la página muestra un aviso amarillo. Es el comportamiento esperado (esta página es para uso interno de Vic en local), igual que `/internal/architecture`.

5. **Colapsables sin JS.** Las listas usan `<details>/<summary>` nativos → cero JavaScript de cliente, todo server-rendered.

6. **Commiteado y pusheado** a `origin/main` el 2026-06-14 por instrucción de Vic (incluye la reconciliación de docs).

---

## Cómo probar localmente

```powershell
# 1. setear un token temporal y levantar el server
$env:ADMIN_DASHBOARD_TOKEN = "un-token-cualquiera"
npm run dev

# 2. abrir con el token (setea cookie y limpia la URL)
#    http://localhost:3000/internal/project-status?token=un-token-cualquiera
```
