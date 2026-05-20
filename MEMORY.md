# 📚 MEMORY INDEX - TechNova

Índice de memoria persistente. Se carga automáticamente en cada conversación con Claude para mantener contexto sin re-explicarlo.

---

## Tier 1: Contexto del Negocio
- [`memory/technova_business_context.md`](./memory/technova_business_context.md) — Misión/visión, nicho PyMEs MX, paquetes **START / GROWTH / SCALE** en MXN, KPIs (CAC < $1K · LTV > 5× CAC · NPS > 50), equipo y rates por hora, decisiones comerciales D-004 / D-005 / D-006, timeline de mercado 2026.

## Tier 2: Stack Técnico
- [`memory/technova_technical_stack.md`](./memory/technova_technical_stack.md) — Stack con versiones exactas de `package.json`: **Next.js 16.2.4 · React 19.2.4 · Tailwind v4 · Drizzle 0.45 · Neon · Resend**. Stripe pendiente. Decisiones D-001 / D-002 / D-003 / D-007 / D-008. Estructura de carpetas, env vars, performance targets.

## Tier 3: Estándares de Desarrollo
- [`memory/technova_development_standards.md`](./memory/technova_development_standards.md) — Convenciones derivadas de **code review real**: naming (PascalCase / camelCase / snake_case en DB), patrón Server vs Client, orden de imports, API routes con `NextResponse.json`, Tailwind v4 patterns, Git workflow (sin `develop`), checklist de PR.

## Tier 4: Preferencias del Founder
- [`memory/technova_user_preferences.md`](./memory/technova_user_preferences.md) — Vic: español, directo, autonomía total en ejecución, reportes en `docs/BITACORA.md`, escalación por tipo de decisión, prioridades (Revenue > Speed > Scale > Quality > Docs), qué funcionó / qué evitar.

---

## 🎯 Cómo Funciona

1. Nueva conversación → Claude carga este `MEMORY.md`.
2. Claude carga los 4 archivos de `memory/`.
3. Claude tiene contexto completo, sin explicaciones repetidas.
4. Trabajo productivo inmediato.

---

## 🔍 Referencias Cruzadas (no se cargan automáticamente, consultar bajo demanda)

| Documento | Ubicación | Para qué |
|-----------|-----------|----------|
| **ARCHITECTURE.md** | `/` | Auditoría completa, gaps, plan de ejecución 4 fases |
| **DECISION_LOG.md** | `/` | 10+ decisiones con contexto, alternativas, trade-offs, KPIs |
| **PHASE1_KICKOFF.md** | `/` | Plan operativo del día (kickoff Fase 1) |
| **PROPOSAL.md** | `/` | Propuesta original aprobada por Vic |
| **EXECUTIVE_SUMMARY.md** | `/` | Resumen ejecutivo (5 min) |
| **Technova.md** | `/` | Plan de negocio extenso (fuente autoritativa) |
| **strategy.md** | `/` | Estrategia simplificada (3 pilares, lead-to-sale) |
| **docs/BITACORA.md** | `/docs/` | Registro histórico — leer para "qué pasó cuándo" |
| **docs/PRICING_PROPOSAL_MX.md** | `/docs/` | Precios MXN canónicos (fuente para Tier 1) |

---

## 🔄 Mantenimiento

### Cuándo actualizar
- **Decisión técnica/comercial nueva** → añadir a `DECISION_LOG.md` (luego reflejar en memory si afecta stack o negocio).
- **Cambio de preferencias de Vic** → `technova_user_preferences.md`.
- **Cambio de stack** (deps, versión major, nueva tool) → `technova_technical_stack.md`.
- **Nueva convención observada en código** → `technova_development_standards.md`.
- **Cambio de paquetes / precios / nicho** → `technova_business_context.md`.

### Quién actualiza
- **Claude Code:** día a día (post-task, post-code-review).
- **Vic:** cambios de dirección estratégica del negocio.

### Git
- Archivos en `/memory/` se versionan en Git.
- Commit pattern sugerido: `docs(memory): update <filename>`.

---

**Última actualización:** 2026-05-19
**Status:** ✅ Operacional (Fase 1 Día 1 entregada)
