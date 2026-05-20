# 🚀 PHASE 1 KICKOFF
## Para Claude Code: Tu Plan Ejecutivo

**Dueño:** Claude Code  
**Autoridad:** Vic (Fundador) - APROBADO  
**Status:** 🔴 VIVO - EJECUTA ESTO AHORA

---

## 🎯 OBJETIVO DEL DÍA

Crear la **base de memoria persistente** del proyecto y validar fundamentos. Al final del día, Claude Code debe tener contexto permanente para todas las conversaciones futuras.

---

## 📋 TAREAS HOY (En Orden)

### TAREA 1: Crear /memory (4 archivos)
**Dueño:** Claude Code  
**Status:** 🔴 NO INICIADO

**Entregar:**

1. **`technova_business_context.md`** (En `/memory/`)
   - Qué es TechNova (misión, visión, valores)
   - Nicho: PyMEs México
   - Modelos de negocio: START/GROWTH/SCALE
   - Precios en MXN
   - KPIs del negocio (CAC, LTV, churn, NPS)
   - Estructura del equipo
   - Decisiones comerciales clave

2. **`technova_technical_stack.md`** (En `/memory/`)
   - Stack: Next.js 16, React 19, Tailwind 4, Drizzle, Neon, Stripe, Resend
   - Por qué cada herramienta (referencia DECISION_LOG.md)
   - Alternativas descartadas y por qué
   - Constraints técnicos
   - Hosting: Vercel (TBD)
   - Database: Neon Postgres + Drizzle ORM

3. **`technova_development_standards.md`** (En `/memory/`)
   - Convenciones de código (naming, estructura)
   - Patrón de componentes (Client vs Server)
   - Estructura de carpetas actual
   - Git workflow (branches, commits)
   - Testing standards (qué se testea)
   - Deployment process

4. **`technova_user_preferences.md`** (En `/memory/`)
   - Preferencias de Vic (tono, level of detail, estilo)
   - Cómo entregar soluciones
   - Horarios de trabajo
   - Feedback recibido
   - Formas de comunicación preferidas
   - Qué funcionó/qué no

**Formato:** Markdown, máximo 500 palabras cada uno, bullet points claros

**Referencia:** ARCHITECTURE.md, sección "Sistema de Memoria Persistente"

---

### TAREA 2: Crear MEMORY.md (Índice)
**Dueño:** Claude Code  
**Status:** 🔴 NO INICIADO

**Entregar:**

Archivo `MEMORY.md` (en raíz) que sea **índice** de memoria.

```markdown
# 📚 MEMORY INDEX - TechNova

Este archivo es el índice de memoria persistente. 
Cada conversación nueva carga estos archivos automáticamente.

## Tier 1: Contexto del Negocio
- [technova_business_context.md](/memory/technova_business_context.md)

## Tier 2: Stack Técnico
- [technova_technical_stack.md](/memory/technova_technical_stack.md)

## Tier 3: Estándares de Desarrollo
- [technova_development_standards.md](/memory/technova_development_standards.md)

## Tier 4: Preferencias del Founder
- [technova_user_preferences.md](/memory/technova_user_preferences.md)

---

**Cómo funciona:**
1. Nueva conversación inicia
2. Claude carga este MEMORY.md
3. Claude carga los 4 archivos de /memory/
4. Claude tiene contexto completo
5. Sin necesidad de explicar "qué es TechNova"

**Última actualización:** 2026-05-20
```

---

### TAREA 3: Validar DECISION_LOG.md
**Dueño:** Claude Code  
**Status:** 🔴 NO INICIADO

**Qué hacer:**

1. ✅ Leer DECISION_LOG.md (ya existe, creado hoy)
2. ✅ Verificar que tiene estructura clara:
   - Decisión identificada
   - Fecha
   - Contexto
   - Alternativas consideradas
   - Por qué ganó
   - Trade-offs
   - KPI de éxito

3. ✅ Si falta algo → Completar
4. ✅ Añadir 2-3 decisiones más que identifiques en el código (si no están):
   - ¿Por qué se eligió Neon y no Supabase?
   - ¿Por qué Resend para email?
   - ¿Por qué estructura de carpetas actual?

5. ✅ Asegurar que todas las decisiones tengan links a docs relacionados

---

### TAREA 4: Code Review - Identificar Convenciones
**Dueño:** Claude Code  
**Status:** 🔴 NO INICIADO

**Qué hacer:**

1. ✅ Revisar `/src/app/page.tsx` → Entender estructura
2. ✅ Revisar `/src/components/home/Hero.tsx` → Patrones de componentes
3. ✅ Revisar `/src/app/api/leads/route.ts` → Patrones de API
4. ✅ Revisar `/src/app/layout.tsx` → Global setup

**Identificar y documentar:**
- Naming conventions (componentes, archivos, variables)
- Estructura de imports (cómo se importan cosas)
- Patrón de componentes (use client? Server components?)
- Uso de Tailwind (clsx, layout patterns)
- Error handling patterns
- Type definitions (TypeScript usage)

**Guardar en:** Notas temporales para TECHNICAL_ARCHITECTURE.md (Fase 2)

---

## 📊 ORDEN DE EJECUCIÓN

Ejecuta las tareas en orden: TAREA 1 → TAREA 2 → TAREA 3 → TAREA 4.

---

## ✅ CHECKLIST DE ENTREGA

### Antes de terminar el día:

- [ ] `/memory/technova_business_context.md` creado
- [ ] `/memory/technova_technical_stack.md` creado
- [ ] `/memory/technova_development_standards.md` creado
- [ ] `/memory/technova_user_preferences.md` creado
- [ ] `MEMORY.md` (índice) creado en raíz
- [ ] DECISION_LOG.md validado y completado si falta
- [ ] Code review completado (notas en temp)
- [ ] BITACORA.md actualizado con avances
- [ ] Nada roto en el proyecto ✅

### Calidad Gate:
- ✅ Todos los archivos de memoria son legibles por humanos
- ✅ Markdown bien formateado
- ✅ Sin typos o información incompleta
- ✅ Links funcionan (si hay referencias)

---

## 📞 CONTACTO CON VIC

**Si necesitas clarificación:**

1. Pregunta específica → Escribe en este documento
2. Propón solución → Muestra opciones
3. Si bloqueador → Reporta en BITACORA.md bajo sección [2026-05-20] BLOQUEADOR

**Vic revisa BITACORA.md diariamente.**

---

## 🔗 REFERENCIAS IMPORTANTES

Para entender contexto, revisa:

1. **ARCHITECTURE.md** (sección Memory)
2. **DECISION_LOG.md** (decisiones técnicas)
3. **Technova.md** (descripción del negocio)
4. **strategy.md** (estrategia simplificada)

---

## 🎯 ÉXITO SIGNIFICA

✅ 4 archivos en /memory creados  
✅ MEMORY.md funcional  
✅ DECISION_LOG.md completado  
✅ Notas de code review claras  
✅ BITACORA.md actualizado  
✅ Cero bloqueadores sin reportar  
✅ Listo para Fase 2 (TECHNICAL_ARCHITECTURE.md)

---

## 🚀 VAS, CLAUDE CODE?

**Status:** Esperando tu ejecución  
**Autoridad:** Vic APROBÓ  
**Presión:** Media (esto es foundation, bien importante)  
**Autonomía:** Total (ejecuta sin preguntar, solo reporta)

**¡Dale!**

---

**Preparado por:** Claude (Arquitecto)  
**Para:** Claude Code (Ejecutor)  
**Validado por:** Vic (Fundador)  
**Status:** ✅ LISTO PARA EJECUTAR
