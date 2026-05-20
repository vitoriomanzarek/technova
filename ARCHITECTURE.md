# 🏗️ ARQUITECTURA DEL PROYECTO TECHNOVA
## Propuesta de Arquitectura y Cimientos del Proyecto

**Fecha:** 2026-05-19  
**Rol:** Analista / Arquitecto del Proyecto  
**Estado:** Propuesta Ejecutiva  
**Audiencia:** Vic (Fundador) + Claude Code (Ejecutor)

---

## 📋 TABLA DE CONTENIDOS
1. [Auditoría de Documentación Actual](#auditoría)
2. [Gaps Identificados](#gaps)
3. [Propuesta de Arquitectura](#arquitectura)
4. [Sistema de Memoria Persistente](#memoria)
5. [Plan de Ejecución](#ejecución)

---

## <a name="auditoría"></a>📊 AUDITORÍA DE DOCUMENTACIÓN ACTUAL

### ✅ DOCUMENTACIÓN EXISTENTE (Bien)

**Docs Raíz (Nivel Estratégico)**
- ✅ `Technova.md` - Descripción completa del negocio, servicios, equipo, roles, precios
- ✅ `strategy.md` - Estrategia simplificada (2-3 pílares, flujo lead-to-sale)
- ✅ `README.md` - Setup técnico del proyecto Next.js
- ✅ `AGENTS.md` - Referencia a Next.js breaking changes (técnico)

**Docs de Operaciones**
- ✅ `BACKLOG.md` - Tareas priorizadas (Alta/Media/Baja)
- ✅ `BITACORA.md` - Registro histórico de cambios implementados
- ✅ `COPYWRITING_GUIDELINES.md` - Guías de tono y mensaje
- ✅ `INVENTORY_COSTS.md` - Desglose de costos por componente del IMR
- ✅ `PRICING_STRATEGY.md` - Estrategia de precios (general)
- ✅ `PRICING_PROPOSAL_MX.md` - Propuesta de precios adaptada a mercado MX
- ✅ `MARKETING_STRATEGY.md` - Embudo de marketing (TOFU/MOFU/BOFU)
- ✅ `EMAIL_NURTURING_SEQUENCE.md` - Secuencia de correos automáticos
- ✅ `VIDEO_SCRIPTS_TOFU.md` - Scripts para contenido de video

**Código & Estructura**
- ✅ Proyecto Next.js 16.2.4 configurado
- ✅ Tailwind CSS v4 integrado
- ✅ Drizzle ORM con Neon DB
- ✅ API Routes para `/leads` y `/checkout`
- ✅ Componentes React bien organizados (`home/`, `wizard/`, `funnel/`)
- ✅ Páginas multi-idioma parcialmente (ESP/ENG)
- ✅ GTM y Meta Pixel implementados

---

## <a name="gaps"></a>⚠️ GAPS CRÍTICOS IDENTIFICADOS

### Tier 1: CRÍTICO (Bloquea escalabilidad)

| Gap | Impacto | Por qué importa |
|-----|---------|-----------------|
| **No existe TECHNICAL_ARCHITECTURE.md** | Alto | Desarrolladores no saben patrón de proyecto, convenciones, estructura de carpetas, estándares de código |
| **No existe DATABASE_SCHEMA.md** | Alto | No hay documentación de tablas, relaciones, tipos de datos; fuerza a leer código |
| **No existe API_DOCUMENTATION.md** | Alto | Endpoints no documentados; difícil integrar con terceros o mantener |
| **No existe DEPLOYMENT_GUIDE.md** | Alto | ¿Cómo se despliega a producción? ¿Dónde está Vercel? ¿Secrets?  |
| **No existe ONBOARDING_DEVELOPER.md** | Alto | Nuevo dev no sabe por dónde empezar; pierde días en setup |
| **No existe DECISION_LOG.md** | Medio-Alto | ¿Por qué elegimos Next.js? ¿Por qué Drizzle? ¿Qué alternativas se descartaron? |

### Tier 2: IMPORTANTE (Ralentiza pero no bloquea)

| Gap | Impacto | Solución |
|-----|---------|----------|
| **No existe TESTING_STRATEGY.md** | Medio | Falta guía de qué testear, coverage esperado, herramientas |
| **No existe SECURITY_CHECKLIST.md** | Medio | Variables sensibles, CORS, CSRF, validación de inputs |
| **No existe CI_CD_PIPELINE.md** | Medio | ¿Cómo se ejecutan tests automáticos? ¿Pre-commits? |
| **No existe COMPONENTS_LIBRARY.md** | Bajo | Catálogo de componentes reutilizables para acelerar desarrollo |
| **No existe ERROR_HANDLING_GUIDE.md** | Bajo | Patrón estándar para manejar errores en API y componentes |

### Tier 3: NICE-TO-HAVE (Mejora experiencia)

| Gap | Descripción |
|-----|-------------|
| **No existe GLOSSARY.md** | Definiciones de términos del negocio (IMR, TOFU, Wizard, etc.) |
| **No existe MONITORING_ALERTS.md** | Qué monitorear en producción, thresholds, alertas |
| **No existe PERFORMANCE_BENCHMARKS.md** | Métricas de Core Web Vitals, targets esperados |
| **No existe CLIENT_COMMUNICATION_TEMPLATE.md** | Email templates, actualización de estado, reportes |

---

## <a name="arquitectura"></a>🏛️ PROPUESTA DE ARQUITECTURA DE DOCUMENTACIÓN

### A. Estructura de Carpetas Recomendada

```
/technova (raíz)
├── ARCHITECTURE.md                    ← TÚ ESTÁS AQUÍ (Este documento)
├── DECISION_LOG.md                    ← Decisiones técnicas y comerciales
├── MEMORY.md                          ← Índice de memorias persistentes (ver Tier de Memoria)
│
├── /docs                              ← Documentación de operaciones/negocio
│   ├── BACKLOG.md                    ✅ Ya existe
│   ├── BITACORA.md                   ✅ Ya existe
│   ├── MARKETING_STRATEGY.md          ✅ Ya existe
│   ├── PRICING_PROPOSAL_MX.md         ✅ Ya existe
│   ├── INVENTORY_COSTS.md             ✅ Ya existe
│   ├── EMAIL_NURTURING_SEQUENCE.md    ✅ Ya existe
│   ├── COPYWRITING_GUIDELINES.md      ✅ Ya existe
│   ├── VIDEO_SCRIPTS_TOFU.md          ✅ Ya existe
│   │
│   ├── CLIENT_COMMUNICATION.md        ← NUEVO
│   ├── GLOSSARY.md                    ← NUEVO
│   └── CONTENT_CALENDAR.md            ← NUEVO (planificación de contenido)
│
├── /docs/technical                    ← NUEVA CARPETA: Documentación técnica
│   ├── TECHNICAL_ARCHITECTURE.md      ← NUEVO (patrón, stack, convenciones)
│   ├── DATABASE_SCHEMA.md             ← NUEVO (tablas, relaciones, tipos)
│   ├── API_DOCUMENTATION.md           ← NUEVO (endpoints, ejemplos, errores)
│   ├── DEPLOYMENT_GUIDE.md            ← NUEVO (Vercel, env vars, secrets)
│   ├── ONBOARDING_DEVELOPER.md        ← NUEVO (primeros pasos para devs)
│   ├── TESTING_STRATEGY.md            ← NUEVO (qué/cómo testear)
│   ├── SECURITY_CHECKLIST.md          ← NUEVO (validación, CORS, etc.)
│   ├── ERROR_HANDLING_GUIDE.md        ← NUEVO (patrones de error)
│   ├── CI_CD_PIPELINE.md              ← NUEVO (tests automáticos, pre-commit)
│   ├── COMPONENTS_LIBRARY.md          ← NUEVO (catálogo de componentes)
│   └── MONITORING_ALERTS.md           ← NUEVO (qué monitorear en prod)
│
└── /src                               ← Código fuente (sin cambios)
    ├── /app
    ├── /components
    ├── /data
    └── ...
```

### B. Matriz de Documentos (Prioridad + Dueño)

| Documento | Tier | Prioridad | Estimado | Dueño |
|-----------|------|-----------|----------|-------|
| **DECISION_LOG.md** | Crítico | 1️⃣ | 2h | Vic (Analista) |
| **TECHNICAL_ARCHITECTURE.md** | Crítico | 2️⃣ | 3h | Claude Code |
| **DATABASE_SCHEMA.md** | Crítico | 3️⃣ | 2h | Claude Code |
| **API_DOCUMENTATION.md** | Crítico | 4️⃣ | 3h | Claude Code |
| **DEPLOYMENT_GUIDE.md** | Crítico | 5️⃣ | 2h | Vic + Claude Code |
| **ONBOARDING_DEVELOPER.md** | Crítico | 6️⃣ | 2h | Claude Code |
| **TESTING_STRATEGY.md** | Importante | 7️⃣ | 1h | Claude Code |
| **SECURITY_CHECKLIST.md** | Importante | 8️⃣ | 1.5h | Claude Code |
| **CI_CD_PIPELINE.md** | Importante | 9️⃣ | 1.5h | Claude Code |
| **COMPONENTS_LIBRARY.md** | Importante | 🔟 | 2h | Claude Code |
| **ERROR_HANDLING_GUIDE.md** | Importante | 1️⃣1️⃣ | 1h | Claude Code |
| **GLOSSARY.md** | Nice-to-Have | 1️⃣2️⃣ | 1h | Vic |
| **CLIENT_COMMUNICATION.md** | Nice-to-Have | 1️⃣3️⃣ | 1h | Vic |
| **CONTENT_CALENDAR.md** | Nice-to-Have | 1️⃣4️⃣ | 1h | Vic |

**Total Estimado:** ~27 horas de trabajo  
**Cadencia:** 2-3 documentos por día (sprints de 3 días)

---

## <a name="memoria"></a>💾 SISTEMA DE MEMORIA PERSISTENTE

### Objetivo
Que cualquier conversación nueva con Claude Code sepa **automáticamente**:
- Qué es TechNova y su estrategia
- Decisiones técnicas tomadas y por qué
- Cimientos del proyecto (arquitectura, convenciones)
- Contexto histórico (qué se hizo, cuándo, por qué)

Sin necesidad de repetir contexto.

### Implementación: 3 Tiers de Memoria

#### Tier 1: MEMORIA COMPARTIDA (En /MEMORY directorio)
**Ubicación:** `C:\Users\vitor\AppData\Roaming\Claude\local-agent-mode-sessions\...\spaces\...\memory\`

**Archivos a crear:**

1. **memory/technova_business_context.md**
   - Qué es TechNova (misión, visión, nicho)
   - Modelos de negocio (START/GROWTH/SCALE)
   - KPIs del negocio (CAC, LTV, retención)
   - Decisiones comerciales importantes

2. **memory/technova_technical_stack.md**
   - Stack elegido (Next.js 16, React 19, Tailwind 4, Drizzle, Neon, Stripe, Resend)
   - Por qué cada herramienta
   - Alternativas descartadas y por qué
   - Constraints técnicos (presupuesto, hosting, escalabilidad)

3. **memory/technova_development_standards.md**
   - Convenciones de código (naming, estructura, imports)
   - Patrón de componentes (Client vs Server, hooks)
   - Estructura de carpetas y convenciones
   - Testing standards (qué se testea, cobertura esperada)

4. **memory/technova_user_preferences.md**
   - Preferencias de Vic (tono, nivel de detalle, estilo de trabajo)
   - Cómo entregar soluciones (ejecuta vs propone)
   - Horarios/cadencia de trabajo
   - Feedback recibido (qué funcionó, qué no)

#### Tier 2: DOCUMENTACIÓN VIVA (En /docs/technical)
**Estos archivos son la "single source of truth" que evita duplicación:**
- `TECHNICAL_ARCHITECTURE.md` → Referencia arquitectural
- `DATABASE_SCHEMA.md` → Esquema actual (actualizado con cada cambio)
- `API_DOCUMENTATION.md` → APIs implementadas
- `DECISION_LOG.md` → Decisiones técnicas

#### Tier 3: GIT HISTORY (En .git)
**Para cambios code:**
- Commits atómicos con mensajes claros
- Tags para versiones importantes
- Branch naming: `feature/`, `fix/`, `docs/`

### Cómo Funciona el Flujo

```
Nueva Conversación
    ↓
Claude Code lee MEMORY.md (índice)
    ↓
Claude Code carga archivos de memoria relevantes
    ↓
Claude Code tiene contexto de TODA la historia
    ↓
Claude Code sabe qué hacer sin repetir setup
    ↓
Vic solo describe la TAREA (no contexto)
    ↓
Claude Code ejecuta con 0 ramp-up time
```

---

## <a name="ejecución"></a>📅 PLAN DE EJECUCIÓN (4 Fases)

### FASE 1: FUNDAMENTOS (Semana 1 - Días 1-2)
**Objetivo:** Documentar lo existente, crear decisiones

| Tarea | Duración | Entregable | Dueño |
|-------|----------|-----------|-------|
| 1.1 - Crear DECISION_LOG.md | 2h | Documento con decisiones técnicas/comerciales | Vic |
| 1.2 - Crear MEMORY.md (índice) | 1h | Índice de memoria persistente | Vic |
| 1.3 - Crear memoria tier 1 | 2h | 4 archivos en memory/ | Vic |
| 1.4 - Code Review actual | 2h | Notas de convenciones observadas | Claude Code |

**Resultado:** Sistema de memoria listo. Bases documentadas.

---

### FASE 2: ARQUITECTURA TÉCNICA (Semana 1 - Días 3-4)
**Objetivo:** Documentar stack técnico y patrones

| Tarea | Duración | Entregable | Dueño |
|-------|----------|-----------|-------|
| 2.1 - TECHNICAL_ARCHITECTURE.md | 3h | Patrón, stack, convenciones, folder structure | Claude Code |
| 2.2 - DATABASE_SCHEMA.md | 2h | Tablas actuales, relaciones, tipos de datos | Claude Code |
| 2.3 - API_DOCUMENTATION.md | 3h | Endpoints GET/POST, params, responses, errores | Claude Code |
| 2.4 - ONBOARDING_DEVELOPER.md | 2h | Primeros pasos para nuevo dev (setup, git, env) | Claude Code |

**Resultado:** Un dev nuevo puede empezar productivo en 30 min.

---

### FASE 3: OPERACIONES Y SEGURIDAD (Semana 1 - Día 5)
**Objetivo:** Documentar cómo opera el proyecto en producción

| Tarea | Duración | Entregable | Dueño |
|-------|----------|-----------|-------|
| 3.1 - DEPLOYMENT_GUIDE.md | 2h | Cómo publicar a Vercel, env vars, secrets | Vic + Claude Code |
| 3.2 - SECURITY_CHECKLIST.md | 1.5h | Validación, CORS, CSRF, rate limiting | Claude Code |
| 3.3 - ERROR_HANDLING_GUIDE.md | 1h | Patrón de errores en API y componentes | Claude Code |
| 3.4 - TESTING_STRATEGY.md | 1.5h | Qué testear, herramientas, coverage target | Claude Code |

**Resultado:** Equipo sabe cómo manejar seguridad, errores, deploys.

---

### FASE 4: COMPLETITUD Y OPTIMIZACIÓN (Semana 2)
**Objetivo:** Nice-to-haves y mejora continua

| Tarea | Duración | Entregable | Dueño |
|-------|----------|-----------|-------|
| 4.1 - GLOSSARY.md | 1h | Definiciones de términos del negocio | Vic |
| 4.2 - COMPONENTS_LIBRARY.md | 2h | Catálogo de componentes reutilizables | Claude Code |
| 4.3 - CI_CD_PIPELINE.md | 1.5h | Tests automáticos, pre-commits, GitHub Actions | Claude Code |
| 4.4 - CLIENT_COMMUNICATION.md | 1h | Email templates, actualización de estado | Vic |
| 4.5 - CONTENT_CALENDAR.md | 1h | Planificación de contenido (blog, video) | Vic |
| 4.6 - Review y Ajustes | 1h | Leer todo, detectar gaps, ajustar | Vic + Claude Code |

**Resultado:** Documentación 100% completa. Proyecto listo para escalar.

---

## 🎯 ROI Y BENEFICIOS

### Para Vic (Fundador)
✅ **Visión 360°** - Sabe estado exacto del proyecto en cualquier momento  
✅ **Escalabilidad** - Puede contratar devs nuevos sin explicar 10 veces lo mismo  
✅ **Rápidez de decisión** - Documentación ayuda a comunicar con inversionistas/clientes  
✅ **Menos deuda técnica** - Decisiones documentadas evitan arrepentimientos futuros  

### Para Claude Code
✅ **Contexto permanente** - No reinicia cada conversación  
✅ **Mejor calidad** - Entiende constraints, decisiones pasadas, cultura del proyecto  
✅ **Eficiencia** - Reduce ramp-up de 2 horas a 5 minutos  
✅ **Autonomía** - Puede ejecutar sin preguntar cada paso  

### Para el Negocio
✅ **Credibilidad** - Documentación impresiona a clientes/inversores  
✅ **Calidad consistente** - Estándares claros = menos bugs  
✅ **Velocidad de delivery** - Devs bien onboarded = entrega más rápida  
✅ **Conocimiento compartido** - No depende de una persona  

---

## 📝 SIGUIENTES PASOS (HOY)

**Vic hace:**
1. Aprueba este documento (ARCHITECTURE.md)
2. Aprueba estructura de carpetas `/docs/technical`
3. Me autoriza a crear memoria persistente
4. Confirma si el plan de 2 semanas funciona para él

**Claude Code hace:**
1. Comienza FASE 1 mañana
2. Mantiene contact frecuente con Vic vía BITACORA.md
3. Publica avances diariamente
4. Pide clarificación si algo no está claro

---

## 📞 MATRIZ DE COMUNICACIÓN

| Qué | Dónde | Cadencia |
|-----|-------|----------|
| **Decisiones arquitectura** | ARCHITECTURE.md (este doc) | Actualizar si hay cambios |
| **Avances trabajo** | BITACORA.md | Diario (end of day) |
| **Decisiones técnicas** | DECISION_LOG.md | Cuando se tome decisión |
| **Memoria persistente** | /memory | Actualizar cada sesión |
| **Documentación viva** | /docs/technical | Junto con código |

---

**Documento creado por:** Vic (Arquitecto Analítico)  
**Última actualización:** 2026-05-19  
**Status:** ⏳ Pendiente aprobación de Vic
