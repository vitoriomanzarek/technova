@AGENTS.md

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
- Def