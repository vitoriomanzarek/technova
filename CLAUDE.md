@AGENTS.md

---

## 🏛️ Sistema Operativo de Trabajo — Roles y Ciclo (OBLIGATORIO)

> Establecido por Vic el 2026-06-12 (D-030). Define CÓMO se trabaja en TechNova.
> Cualquier agente que entre a este proyecto debe operar bajo este sistema.

### Roles

| Rol | Quién | Responsabilidad |
|-----|-------|-----------------|
| **CEO** | Vic | Decide, aprueba planes y prompts, ejecuta acciones manuales (dashboards, pagos, env vars) |
| **ARQUITECTO / ADMIN** | Claude en **Cowork** | Planea con Vic, escribe los prompts de ejecución, **verifica los reportes**, mantiene los docs críticos (BACKLOG, BITACORA, DECISION_LOG) |
| **EJECUTOR** | **Claude Code** | Ejecuta los prompts (código), genera el reporte de ejecución |

**Regla de oro:** en Cowork se PLANEA, Claude Code EJECUTA. Cowork no implementa features; Claude Code no toma decisiones de arquitectura ni reprioriza el backlog.

### Ciclo de trabajo (5 pasos)

```
1. PLANEAR   (Cowork + Vic)     → decisiones a DECISION_LOG, items a BACKLOG_MASTER
2. PROMPT    (Cowork escribe)   → prompts/<TASK_ID>_<NOMBRE>.prompt.md
3. EJECUTAR  (Vic → Claude Code) → Vic pasa el prompt a Claude Code, que implementa
4. REPORTAR  (Claude Code)      → reports/<NOMBRE>_REPORT.md (usar reports/REPORT_TEMPLATE.md)
5. VERIFICAR (Cowork)           → lee el reporte, valida vs Definition of Done
                                   (inspeccionando código si hace falta) y solo entonces
                                   marca ✅ en BACKLOG_MASTER + entrada en BITACORA.
                                   Si hay gaps → prompt de corrección (vuelve al paso 2).
```

### Reglas del sistema

- **Nada se marca ✅ DONE en BACKLOG_MASTER sin reporte verificado por Cowork.** El reporte de Claude Code es la evidencia; la verificación de Cowork es el cierre.
- Cada prompt debe ser **completo y autónomo** (Claude Code no tiene el contexto de la sesión de planeación). Estructura de 9 secciones definida en `prompts/README.md`: Objetivo, Entregables, Tech Stack, Setup, Checklist QA, Referencias, Definition of Done, Cómo Reportar, Tips & Gotchas.
- Todo prompt DEBE incluir la instrucción de generar su reporte en `reports/` antes de terminar.
- Carpetas oficiales: **`prompts/`** y **`reports/`** (en inglés — convención ya existente, no crear "reportes/").
- **Excepción — cambios menores:** Cowork puede ejecutar directamente ediciones de documentación, config trivial o hotfixes puntuales, registrándolos en BITACORA. Ante la duda, se escribe prompt.
- **Los prompts se entregan listos para copiar y pegar en Claude Code.** Toda acción local automatizable (git — incluyendo limpiar locks huérfanos —, instalar dependencias, correr tests, builds) va DENTRO del prompt para que la haga Claude Code. A Vic solo le quedan acciones que requieren sus credenciales o dashboards externos (Vercel, Stripe, Resend, GA4, pagos).

---

## 📋 Reglas de Documentación — Obligatorias

Estas reglas se aplican en TODAS las sesiones de trabajo, sin excepción.

### Cuándo actualizar los docs

Actualizar los siguientes archivos **siempre que**:
- Se implemente una feature, fix o cambio técnico significativo
- Se tome una decisión de arquitectura o tecnología
- Se resuelva un bug importante
- Se cierre una sesión de trabajo (aunque sea parcial)
- Se haga un deploy a producción

### Archivos CRÍTICOS a Mantener (Siempre)

**1. `BITACORA.md`** — Registro cronológico de sesiones (negocio + técnica)
- Añadir entrada al final con: fecha, qué se hizo, decisiones tomadas, commits relevantes
- Usar el formato de sesiones existentes como referencia
- Incluir el estado final (✅ completo, 🔄 en progreso, ⚠️ bloqueado)

**2. `BACKLOG_MASTER.md`** — Estado real del proyecto (roadmap oficial)
- Marcar ✅ los items completados
- Actualizar los status (NO INICIADO → IN PROGRESS → DONE)
- Añadir items nuevos que surjan durante el trabajo
- Corregir cualquier descripción que ya no refleje la realidad
- **NOTA:** Debe estar siempre en sync con tareas reales (ver KICKOFF docs para Fase B)

**3. `DECISION_LOG.md`** — Decisiones técnicas y comerciales
- Registrar toda decisión nueva con su contexto y alternativas descartadas
- Actualizar el estado de decisiones que cambien
- Usar el formato D-XXX existente
- Cobertura: arquitectura, tech stack, precios, go-to-market, etc.

> **Nota:** La página `/internal/architecture` se alimenta automáticamente de `DECISION_LOG.md` — no es un archivo a editar directamente.

**4. `COMMERCIAL_FLOW.md`** — Flujo lead → pago (CRÍTICO para operaciones)
- Define 8 stages: Lead Capture → Auditoría IA → Propuesta IA → Revisión Vic → Cliente → Ecommerce → Pago → Onboarding
- Punto de verdad para integración de: NOVA AI + Stripe + Auditoría automática
- Actualizar si cambia el flujo de ventas o roles de Vic
- **PRIORITARIO:** Debe estar 100% claro antes de implementar Fase B.4

**5. `memory/MEMORY.md`** — Índice de memoria persistente (arquitectura del proyecto)
- Apunta a archivos de memoria que persisten entre sesiones
- Contiene: mapa completo de fases, sistemas documentados, qué falta
- Consultar ANTES de hacer suposiciones sobre qué existe o no

### Archivos de FASE B (mantener mientras Fase B está activa)

Estos documentos describen tareas específicas que un agente va a ejecutar. Están vinculados a BACKLOG_MASTER.md.

**- `NOVA_AI_REPLANNING.md`** — NOVA AI rediseñado como asesor autónomo inteligente
  - Vinculado a: BACKLOG_MASTER.md § B.3 (NOVA AI Redesign)
  - Cubre: chat interface, qualificación automática, generación de propuestas, demo

**- `MARKETING_FUNNEL_AGENT_KICKOFF.md`** — Sistema 4-fases de marketing (Awareness → Consideration → Conversion → Loyalty)
  - Vinculado a: BACKLOG_MASTER.md § B.2 (Marketing Funnel)
  - Cubre: blog, ads (Google/Meta/LinkedIn), email sequences, remarketing, analytics

**- `IMAGERY_AGENT_KICKOFF.md`** — Propuesta de imágenes y visuales para sitio
  - Vinculado a: BACKLOG_MASTER.md § B.1 (Imagery)
  - Cubre: portfolio, servicios, team, testimonios, pricing illustrations

**- `AUTONOMOUS_BACKLOG_MANAGEMENT_PLAN.md`** — Sistema autónomo de gestión de backlog
  - Vinculado a: BACKLOG_MASTER.md § B.5 (Dashboard Admin Interno)
  - Cubre: agent que lee BITACORA + BACKLOG, genera reportes, sugiere reprioritización

### Documentación Técnica (vive en `docs/technical/`)

Estos 11 documentos cubren toda la especificación técnica. Consultar cuando necesites detalles:
- `TECHNICAL_ARCHITECTURE.md` — Stack, componentes, flujos
- `DATABASE_SCHEMA.md` — Schema Postgres con todas las tablas
- `API_DOCUMENTATION.md` — Endpoints, schemas, ejemplos
- `TESTING_STRATEGY.md` — Vitest + Playwright
- `DEPLOYMENT_GUIDE.md` — Vercel, env vars, secrets
- `SECURITY_CHECKLIST.md` — Input validation, CORS, rate limiting, etc.
- `ERROR_HANDLING_GUIDE.md` — Patrones de error por sistema (API, DB, Stripe, Resend)
- `MONITORING_OBSERVABILITY.md` — Sentry, logging, alerting
- `CI_CD_PIPELINE.md` — GitHub Actions, pre-commit hooks
- `COMPONENTS_LIBRARY.md` — Catálogo de componentes React reales
- `ONBOARDING_DEVELOPER.md` — Setup local para developers nuevos

### Ejecución de Prompts — Reporte Automático

**Siempre que se ejecute un archivo de la carpeta `prompts/`:**

1. Leer el archivo directamente desde disco (no depender del clipboard)
2. Crear un reporte en `reports/` con el nombre: `<PROMPT_NAME>_REPORT.md`
3. El reporte debe incluir:
   - **Resumen ejecutivo** — qué hace el prompt y su estado
   - **Tabla de áreas/tareas cubiertas** con acción requerida
   - **Checklist completo** listo para ejecutar
   - **Umbrales / criterios** (si aplica)
   - **Notas de implementación** — advertencias, dependencias, cómo testear
4. Si el prompt ya tiene un reporte anterior en `reports/`, actualizarlo en vez de crear uno nuevo

> **Por qué:** El clipboard se sobreescribe fácilmente. El archivo en `reports/` garantiza que el output del prompt no se pierda y queda como registro auditadle.

---

### Al cerrar sesión

Antes de hacer el commit final de cualquier sesión, verificar:
- [ ] `BITACORA.md` tiene la entrada de esta sesión
- [ ] `BACKLOG_MASTER.md` refleja el estado actual (tareas completadas, en progreso, nuevas)
- [ ] `DECISION_LOG.md` tiene las decisiones tomadas hoy (si aplica)
- [ ] `COMMERCIAL_FLOW.md` está actualizado si cambió el flujo de ventas (si aplica)
- [ ] `memory/MEMORY.md` se actualizó si hay hallazgos arquitectónicos persistentes (si aplica)
- [ ] Los cambios están commiteados y pusheados a `origin/main`

**Nota:** Si es sesión de Fase B, verifica también que KICKOFF docs (NOVA_AI, MARKETING_FUNNEL, IMAGERY) estén sincronizados con el trabajo real.
