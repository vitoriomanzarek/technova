# 🚨 AGENT DOCUMENTATION PROTOCOL

**OBLIGATORIO para TODO agente trabajando en TechNova**

---

## Regla de Oro

> **"Si no está documentado en los archivos del proyecto, no cuenta como completado."**

Documentación es:
- ✅ Prueba de trabajo realizado
- ✅ Contexto para futuras sesiones
- ✅ Base para decisiones
- ✅ Fuente de verdad del proyecto

---

## ✅ CHECKLIST DE CIERRE (ANTES de reportar a Vic)

Después de completar cualquier tarea técnica, **obligatorio** hacer esto:

### PASO 1: BITACORA.md — Registro de sesión

```markdown
## 🔵 SESSION YYYY-MM-DD: Título del trabajo

**Status:** ✅ COMPLETED / 🔄 EN PROGRESO / 🔴 BLOQUEADO

### 📋 Work Completed
- [x] Item 1 completado
- [x] Item 2 completado
- [ ] Item 3 pendiente (por qué)

**Documented in:** BITACORA.md (this entry)
```

**Archivo:** `C:\Users\vitor\.gemini\antigravity\playground\technova\BITACORA.md`

**Qué incluir:**
- Sesión: fecha, título, duración
- Status: ✅/🔄/🔴
- Items completados: checklist
- Blockers: si los hay
- Dependencies: archivos/decisiones relacionadas
- Actualizar "Last Updated" al final

**Ejemplo real:**
```markdown
## 🟢 SESSION 2026-05-24: Google Ads + Analytics Setup

**Status:** ✅ COMPLETED

### 📋 Work Completed

#### ✅ Google Ads Setup
- [x] Account created
- [x] 4 campaigns configured
- [x] Conversion tracking linked
- [x] Ready to launch

**Status:** Ready to accept traffic
```

---

### PASO 2: DECISION_LOG.md — Si hay decisiones nuevas

**Archivo:** `C:\Users\vitor\.gemini\antigravity\playground\technova\DECISION_LOG.md`

**Solo si:** Tomaste decisión técnica/arquitectónica o cambió algo importante

**Formato obligatorio:**

```markdown
## D-XXX: [Título Decisión]

**Date:** YYYY-MM-DD  
**Owner:** [Tu nombre/agente]  
**Status:** APPROVED / PENDING

### Decisión
Qué decidiste (1-2 líneas)

### Contexto
Por qué necesitabas decidir

### Alternativas Consideradas
- Opción A: [ventajas/desventajas]
- Opción B: [ventajas/desventajas]
- Opción C: [ventajas/desventajas]

### Por Qué Ganó [Opción X]
Racional específico

### Trade-offs
Qué se sacrificó / qué riesgos hay

### Reversible
¿Fácil de revertir? Sí/No y por qué

### KPI de Éxito
Cómo medimos si fue buena decisión

### Referencias
- [Archivo relacionado](./path)
- [Conversación](./path)
```

**Ejemplo:**
```markdown
## D-021: Email Provider Selection (Resend vs Mailchimp)

**Date:** 2026-05-24  
**Owner:** Agente Setup  
**Status:** PENDING (Vic approval after email test)

### Decisión
Usar Resend para MVP (free tier until 20k/month)

### Por Qué Ganó Resend
- Modern API, easy Next.js integration
- Free tier sufficient for MVP
- Better long-term scalability to Loops
- Lower cost ($0 vs $20/month Mailchimp)

### Trade-offs
- Less visual UI (more code-first)
- Fewer out-of-box templates vs Mailchimp
- But: better for automation

### KPI de Éxito
- Lead emails delivered 100%
- No bounces/spam issues
- Cost <$0 in MVP phase
```

---

### PASO 3: memory/ — Si hay cambios persistentes

**Archivos en:** `C:\Users\vitor\.gemini\antigravity\playground\technova\memory\`

**Actualizar si:**

| Cambio | Archivo | Qué hacer |
|--------|---------|-----------|
| Cambió el stack (deps, versiones) | `technova_technical_stack.md` | Actualizar versions, add new tool |
| Descubriste nueva convención/patrón | `technova_development_standards.md` | Add to standards |
| Cambio de negocio/contexto | `technova_business_context.md` | Update business facts |
| Cambió algo sobre preferencias de Vic | `technova_user_preferences.md` | Update rules |

**Ejemplo:**
```markdown
# En technova_technical_stack.md

Cambio: Decidimos usar Resend en lugar de Mailchimp

- Actualizar: "Email Service: Resend (free tier until 20k/month), plan to migrate to Loops at scale"
- Agregar decision link: "Decision: D-021"
```

---

### PASO 4: Archivos de trabajo

**Si creaste nuevo documento:**
- [ ] Linkearlo en `MEMORY.md` (o create entry if file is strategic)
- [ ] Linkearlo en `ARCHITECTURE.md` si es arquitectónico
- [ ] Crear entrada en índice correspondiente

**Si modificaste documento existente:**
- [ ] Actualizar "Última actualización: YYYY-MM-DD" al final del archivo
- [ ] Commit message descriptivo: `docs(xyz): update based on testing`

**Si commits en Git:**
```bash
git commit -m "feat(ads): setup Google Ads + analytics for MVP"
# OR
git commit -m "docs(email): test Resend integration, results in BITACORA"
```

---

## 📝 TEMPLATE DE REPORTE FINAL

Después de completar TODO y documentar, reporta así:

```
✅ **COMPLETADO: [Nombre Tarea]**

**Qué se hizo:**
- Google Ads setup ✅
- Analytics configured ✅
- Conversion tracking live ✅

**Status:** Ready to launch ads

**Documentado en:**
- BITACORA.md (SESSION 2026-05-24)
- DECISION_LOG.md (D-021 si hay decisión)
- Memory updated? (sí/no)

**Siguientes pasos:**
- Email test results (agente X)
- Lead magnet setup (5h)
- Launch decision

**Bloqueadores:** None
```

---

## 🔴 ANTI-PATTERNS (EVITAR)

| ❌ EVITAR | ✅ HACER |
|-----------|----------|
| "Completé X Y Z" sin documentar | Documentar en BITACORA PRIMERO, luego reportar |
| Cambios en código sin BITACORA entry | BITACORA entry SIEMPRE cuando hay output |
| Decisión importante sin DECISION_LOG | Toda decisión → D-XXX con racional |
| Docs nuevos sin linkearse desde índices | Crear entry en MEMORY.md o ARCHITECTURE.md |
| "Hice work" sin archivos que lo prueben | Entregar código + docs juntos |
| Reporte al chat, contexto desaparece | Documentar PRIMERO, reporte SEGUNDO |

---

## ✅ PATRÓN CORRECTO

1. **Haz el trabajo** (código, setup, etc.)
2. **Documenta en BITACORA.md** (qué se hizo, status)
3. **Documenta en DECISION_LOG.md** (si hay decisión)
4. **Actualiza memory/** (si hay cambios persistentes)
5. **Linkealo en índices** (MEMORY.md, ARCHITECTURE.md)
6. **Git commit** (con mensaje descriptivo)
7. **Reporta a Vic** (con evidencia de documentación)

```
TRABAJO → DOCUMENTAR → INDEXAR → GIT → REPORTAR
```

**No es:**
```
TRABAJO → REPORTAR → DESAPARECER
```

---

## 📋 QUICK CHECKLIST

```
[ ] BITACORA.md entry creada con status ✅/🔄/🔴
[ ] Items completados en checklist
[ ] DECISION_LOG.md actualizado si hay decisión (D-XXX)
[ ] memory/ archivos actualizados si necesario
[ ] Nuevos docs linkeados en MEMORY.md o ARCHITECTURE.md
[ ] Última actualización: YYYY-MM-DD en footer de docs
[ ] Git commit con mensaje descriptivo
[ ] Reporte a Vic con links a documentación

✅ = Ready to report
```

---

**Fuente:** `memory/technova_user_preferences.md` (§15 — Agent Documentation Protocol)  
**Última revisión:** 2026-05-24  
**Owner:** Vic (Process)
