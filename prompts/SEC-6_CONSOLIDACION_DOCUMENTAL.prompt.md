# PROMPT: SEC-6 — Consolidación Documental

---

## 1. OBJETIVO

Limpiar y consolidar la documentación del proyecto. No hay código nuevo — solo organización: fusionar archivos duplicados, actualizar referencias obsoletas, y archivar docs históricos que ensucian la raíz.

---

## 2. ENTREGABLES

1. **Un solo COMMERCIAL_FLOW.md** — fusión de `COMMERCIAL_FLOW.md` y `COMMERCIAL_FLOW_v2_FINAL.md` (el v2 gana, el original va a `docs/archive/`)
2. **docs/technical/ actualizado** — eliminar todos los "TODO" de rate limiting (ya implementado en `src/proxy.ts`)
3. **Raíz limpia** — archivos históricos sueltos movidos a `docs/archive/`
4. **CLAUDE.md actualizado** — referencias a archivos que ya no existen o que cambiaron de nombre
5. **Reporte** en `reports/SEC-6_CONSOLIDACION_REPORT.md`

---

## 3. TECH STACK

Solo filesystem — no se instala nada ni se modifica código.

---

## 4. SETUP

Trabajar en la raíz: `C:\Users\vitor\.gemini\antigravity\playground\technova`

Antes de empezar, listar la raíz para identificar archivos históricos sueltos:
```bash
ls -la --ignore=node_modules --ignore=.next --ignore=.git
```

---

## 5. CHECKLIST QA

### 5.1 COMMERCIAL_FLOW
- [ ] Leer ambos archivos: `COMMERCIAL_FLOW.md` y `COMMERCIAL_FLOW_v2_FINAL.md`
- [ ] Identificar qué tiene el v2 que no tiene el original (el v2 es el canónico)
- [ ] Crear `docs/archive/` si no existe
- [ ] Mover el archivo original a `docs/archive/COMMERCIAL_FLOW_legacy.md`
- [ ] Renombrar `COMMERCIAL_FLOW_v2_FINAL.md` → `COMMERCIAL_FLOW.md` (o copiar contenido si hay referencias)
- [ ] Verificar que CLAUDE.md y otros docs apunten al archivo correcto

### 5.2 docs/technical/ — Eliminar TODOs de rate limiting
- [ ] Buscar en `docs/technical/` todos los "rate limit" o "TODO" relacionados con proxy/rate limiting
- [ ] Actualizar para reflejar la implementación real: `src/proxy.ts` tiene `rl:uuid` (20 req/min), `rl:lead` (existente), webhook excluido
- [ ] Archivos probables: `TECHNICAL_ARCHITECTURE.md`, `SECURITY_CHECKLIST.md`, `API_DOCUMENTATION.md`

### 5.3 Raíz — Archivar históricos
Mover a `docs/archive/` los siguientes tipos de archivos si existen en raíz:
- `PHASE*_KICKOFF*.md` (excepto los activos de Fase B que están en CLAUDE.md como referencias)
- `TODAY_SUMMARY*.md`
- `SESSION_*.md` o similares
- Cualquier `*_OLD.md`, `*_backup.md`, `*_v1.md`
- **NO mover:** BACKLOG_MASTER, BITACORA, DECISION_LOG, COMMERCIAL_FLOW (el consolidado), CLAUDE.md, AGENTS.md, los KICKOFF docs de Fase B activos (NOVA_AI_REPLANNING, MARKETING_FUNNEL_AGENT_KICKOFF, IMAGERY_AGENT_KICKOFF, AUTONOMOUS_BACKLOG_MANAGEMENT_PLAN)

### 5.4 CLAUDE.md — Verificar referencias
- [ ] Revisar que todas las referencias a archivos en CLAUDE.md apunten a archivos que existen
- [ ] Actualizar cualquier referencia a `COMMERCIAL_FLOW_v2_FINAL.md` → `COMMERCIAL_FLOW.md`
- [ ] Si hay referencias a archivos que se archivaron, actualizar o eliminar

---

## 6. REFERENCIAS

- `CLAUDE.md` — lista los archivos críticos que hay que mantener (sección "Archivos CRÍTICOS")
- `src/proxy.ts` — implementación real del rate limiting (para actualizar docs técnicos)
- `docs/technical/SECURITY_CHECKLIST.md`, `TECHNICAL_ARCHITECTURE.md`, `API_DOCUMENTATION.md` — los más probables con TODOs de rate limit

---

## 7. DEFINITION OF DONE

- [ ] `COMMERCIAL_FLOW.md` único en raíz (el v2, canónico)
- [ ] `docs/archive/` existe y contiene los archivos históricos
- [ ] `grep -r "rate limit.*TODO\|TODO.*rate limit" docs/technical/` → 0 resultados
- [ ] `ls` en raíz no muestra archivos `PHASE*`, `TODAY_SUMMARY*` ni similares históricos
- [ ] CLAUDE.md sin referencias a archivos inexistentes
- [ ] `git diff --stat` muestra solo renombrados/movidos, sin cambios en código
- [ ] Reporte generado en `reports/SEC-6_CONSOLIDACION_REPORT.md`

---

## 8. CÓMO REPORTAR

Crear `reports/SEC-6_CONSOLIDACION_REPORT.md`:

```markdown
# Reporte: SEC-6 — Consolidación Documental

**Fecha:** <fecha>
**Estado:** ✅ COMPLETADO

## Archivos consolidados
- <lista de lo que se fusionó>

## Archivos archivados
- <lista de lo que se movió a docs/archive/>

## TODOs eliminados
- <archivo> línea <N>: "<texto anterior>" → "<texto nuevo>"

## CLAUDE.md — cambios
- <lista de referencias actualizadas>

## git diff --stat
<output>
```

---

## 9. TIPS & GOTCHAS

- **No borrar, archivar:** mover a `docs/archive/`, no eliminar — por si hace falta auditar historial
- **Los KICKOFF docs de Fase B SON activos:** `NOVA_AI_REPLANNING.md`, `MARKETING_FUNNEL_AGENT_KICKOFF.md`, `IMAGERY_AGENT_KICKOFF.md`, `AUTONOMOUS_BACKLOG_MANAGEMENT_PLAN.md` — NO archivar, son el plan de trabajo de Fase B
- **COMMERCIAL_FLOW v2 gana:** contiene el flujo completo de 8 stages con integración NOVA AI + Stripe. El original es una versión anterior
- **Commit al final:** `docs(SEC-6): consolidación documental — archivado históricos, rate limit docs actualizados`
