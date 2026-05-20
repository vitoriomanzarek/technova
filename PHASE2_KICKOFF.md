# 🏗️ PHASE 2 KICKOFF - DÍAS 2-3
## Para Claude Code: Arquitectura Técnica Completa

**Dueño:** Claude Code  
**Autoridad:** Vic (Fundador) - APROBADO  
**Status:** 🔴 VIVO - EJECUTA ESTO AHORA

---

## 🎯 OBJETIVO DE LA FASE

Documentar la **arquitectura técnica completa** del proyecto. Al final de Día 3, nuevo developer debe poder:
- ✅ Entender cómo está estructurado el código
- ✅ Dónde está cada cosa
- ✅ Cómo agregar features
- ✅ Cómo desplegar a producción
- ✅ Cómo se comunica con la base de datos

---

## 📋 TAREAS (En Orden)

### TAREA 1: TECHNICAL_ARCHITECTURE.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Un documento **maestro técnico** que documente los patrones reales del código.

**Contenido mínimo:**

1. **Estructura de Carpetas (visual + explicada)**
   - Por qué feature-based (vs layer-based)
   - Dónde va cada tipo de archivo
   - Rutas de importación (@/ alias)

2. **Componentes React (patrones reales)**
   - Cuándo usar "use client" vs Server Components
   - Estructura de un componente típico
   - Props typing con TypeScript
   - Framer-motion patterns (lo que ves en Hero.tsx)

3. **API Routes (patrón)**
   - Estructura de un route.ts
   - Error handling
   - Integración con DB
   - Integración con Resend (email)
   - Qué falta: validación con Zod

4. **Database & Drizzle**
   - Cómo está el schema (leads, services, projects)
   - Patrón de queries (insert, select, update)
   - Dónde están las migrations
   - Cómo conectar desde Next.js

5. **Styling con Tailwind v4**
   - Orden de clases (layout → spacing → colors → interaction)
   - Uso de gradientes, glassmorphism
   - Animaciones con framer-motion vs Tailwind
   - Custom colors del theme (bg-dark, text-highlight)

6. **TypeScript & Type Safety**
   - Strict mode activado
   - Pattern de generics en hooks
   - Type imports vs regular imports
   - Avoid `any`

7. **Integrations Actuales**
   - Resend (email)
   - Stripe (boilerplate, sin SDK)
   - GTM + Meta Pixel (analytics)
   - Neon DB (serverless postgres)

8. **Conventions & Code Patterns**
   - Import order
   - Naming (PascalCase componentes, camelCase funciones)
   - Comments pattern (cuando comentar y cuándo no)
   - Git commits (conventional format)

**Referencia:** 
- Lee `/memory/technova_development_standards.md` (ya creado en Fase 1)
- Usa code review findings del [2026-05-20] en BITACORA.md
- Revisa AGENTS.md para contexto de Next.js 16 breaking changes

**Output:** Archivo `/docs/technical/TECHNICAL_ARCHITECTURE.md` (~2,000 palabras, 10-12 min lectura)

---

### TAREA 2: DATABASE_SCHEMA.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Documentación visual de la base de datos.

**Contenido:**

1. **Schema Visual (ER diagram en texto ASCII o mermaid)**
   ```
   leads
   ├── id (pk)
   ├── name
   ├── email
   ├── project_type
   ├── created_at

   services
   ├── id (pk)
   ├── name
   ├── description
   ├── price_mxn
   └── features (array)
   
   [potenciales tablas futuras]
   projects, invoices, etc.
   ```

2. **Tabla de Campos (cada tabla)**
   - Column name
   - Type (string, integer, timestamp, etc.)
   - Nullable / Required
   - Default value
   - Índices (si aplica)

3. **Relationships**
   - Foreign keys
   - Cardinality (1:1, 1:N, M:N)

4. **Constraints & Validations**
   - UNIQUE (emails en leads)
   - CHECK constraints
   - Default values

5. **Migrations & Versioning**
   - Dónde están (`src/db/migrations/`)
   - Cómo correr (`drizzle-kit push`)
   - Cómo crear nuevas

6. **Seeding (Fixture Data)**
   - Dónde está el seed script
   - Cómo correr para desarrollo local
   - Data de test para validar features

7. **Performance Consideraciones**
   - Índices actuales
   - N+1 queries a evitar
   - Query examples (what queries are slow)

**Referencia:**
- `src/db/schema.ts` - fuente de verdad
- `src/db/seed.ts` - datos de test
- `technova_technical_stack.md` - por qué Neon + Drizzle

**Output:** `/docs/technical/DATABASE_SCHEMA.md` (~1,500 palabras, 8 min)

---

### TAREA 3: API_DOCUMENTATION.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Documentación de **cada endpoint** en el proyecto.

**Para cada endpoint:**

```markdown
### POST /api/leads

**Purpose:** Capture lead from lead magnet form

**Request:**
- Content-Type: application/json
- Body: { name, email, project_type }

**Response (200):**
{ success: true, message: "Lead captured..." }

**Response (500):**
{ success: false, error: "Failed to capture lead" }

**Side Effects:**
- Inserts into leads table
- Sends welcome email via Resend

**Error Cases:**
- Invalid JSON → 400
- DB error → 500

**Auth:** None (MVP)

**Rate limit:** None yet (TODO: Phase 3)

**Related code:**
- src/app/api/leads/route.ts
```

**Endpoints a documentar:**
1. `POST /api/leads` (lead capture + email)
2. `POST /api/checkout` (Stripe payment - boilerplate, pendiente keys)
3. Cualquier otro que haya en `/api/`

**Output:** `/docs/technical/API_DOCUMENTATION.md` (~800 palabras, 5 min)

---

### TAREA 4: ONBOARDING_DEVELOPER.md
**Status:** 🔴 NO INICIADO

**Entregar:**

Guía step-by-step para que **nuevo developer productivo en 30 minutos**.

**Contenido:**

1. **Prerequisites**
   - Node.js 18+, npm, git
   - IDE (VS Code recomendado)
   - Postgres client (opcional para debugging)

2. **Local Setup (5 min)**
   ```bash
   git clone <repo>
   npm install
   cp .env.example .env.local
   # Set values from Vic
   npm run dev
   ```

3. **Environment Variables (qué es cada uno)**
   - DATABASE_URL
   - RESEND_API_KEY
   - STRIPE_SECRET_KEY (cuando esté)
   - NEXT_PUBLIC_STRIPE_KEY

4. **Project Structure Tour (5 min)**
   - "Aquí viven los componentes"
   - "Aquí viven las pages"
   - "Aquí está el database code"
   - "Aquí está la API"

5. **First Task: Add a Button (10 min)**
   - Clone componente existente
   - Cambiar texto
   - Verificar en navegador
   - Commit con convención git

6. **Common Tasks**
   - "Cómo agregar una nueva página"
   - "Cómo modificar un componente"
   - "Cómo crear un nuevo endpoint API"
   - "Cómo cambiar el theme colors"
   - "Cómo hacer query a la base de datos"

7. **Testing Locally**
   - Cómo correr el proyecto
   - Cómo ver cambios en tiempo real
   - Dónde ver error logs
   - Cómo limpiar cache

8. **Deployment (opcional, reference only)**
   - Main branch auto-deploys a Vercel
   - Cómo verificar que pasó el deploy
   - Cómo rollback si algo rompe

9. **Getting Help**
   - Lee TECHNICAL_ARCHITECTURE.md
   - Lee DECISION_LOG.md (para entender por qué)
   - Lee memory files
   - Pregunta en chat o issues

10. **Code Review Checklist (antes de mergear)**
    - Types correctos (no `any`)
    - Tailwind classes en orden
    - No console.logs
    - Commits siguen convención
    - Tests (si aplica)

**Output:** `/docs/technical/ONBOARDING_DEVELOPER.md` (~2,000 palabras, 10 min lectura)

---

## 📊 ORDEN DE EJECUCIÓN

Ejecuta las tareas en orden: TAREA 1 → TAREA 2 → TAREA 3 → TAREA 4.

**Entregables esperados:**
- ✅ TECHNICAL_ARCHITECTURE.md
- ✅ DATABASE_SCHEMA.md  
- ✅ API_DOCUMENTATION.md
- ✅ ONBOARDING_DEVELOPER.md

---

## ✅ CHECKLIST DE ENTREGA

### Antes de terminar Día 3:

- [ ] `/docs/technical/TECHNICAL_ARCHITECTURE.md` creado y completo
- [ ] `/docs/technical/DATABASE_SCHEMA.md` creado con ER diagram
- [ ] `/docs/technical/API_DOCUMENTATION.md` creado con todos los endpoints
- [ ] `/docs/technical/ONBOARDING_DEVELOPER.md` creado con setup + first task
- [ ] Todos los archivos están en `/docs/technical/` (nueva carpeta)
- [ ] Links en ARCHITECTURE.md actualizados (referencias cruzadas)
- [ ] BITACORA.md actualizado con [2026-05-22] entry
- [ ] Nada roto en el proyecto ✅

### Calidad Gate:

- ✅ Todos los archivos son legibles (Markdown bien formateado)
- ✅ Ejemplos de código están actualizados (si hay)
- ✅ Links funcionan (referencias internas)
- ✅ Sin typos o información incompleta
- ✅ Screenshots o ASCII diagrams claros (si hay)

---

## 📞 CONTACTO CON VIC

**Si necesitas:**

1. **Clarificación:** Escribe en BITACORA.md sección [PREGUNTAS FASE 2]
2. **Decisión importante:** Escribe [DECISIÓN REQUERIDA] en BITACORA.md
3. **Bloqueador:** Escribe [BLOQUEADOR] en BITACORA.md (respuesta urgente)

**Vic revisa BITACORA.md diariamente a las 5:30pm.**

---

## 🔗 REFERENCIAS IMPORTANTES

Para entender contexto, revisa (en orden):

1. **MEMORY.md** (carga esto primero)
2. **technova_development_standards.md** (code patterns)
3. **PHASE1_KICKOFF.md** (qué pasó en Fase 1)
4. **BITACORA.md** [2026-05-20] (hallazgos del code review)
5. **AGENTS.md** (por qué Next.js 16 es diferente)

---

## ⚠️ NOTAS IMPORTANTES

### Tech Debt Identificado (NO ARREGLES AHORA)
Estos issues existen pero se arreglan en Fase 3:
- [ ] Email templates hardcoded en route.ts → extract a templates
- [ ] No validación con Zod en POST endpoints
- [ ] No TypeScript strict en route.ts
- [ ] Stripe SDK no instalado (boilerplate only)
- [ ] `/pages/services/` es legacy (Pages Router viejo)
- [ ] `web-app/` folder es legacy pre-migración

### Para Fase 3 (No hacer ahora)
- Zod validation
- Error handling más granular
- Testing framework setup
- CI/CD pipeline
- Security review

---

## 🎯 ÉXITO SIGNIFICA

✅ TECHNICAL_ARCHITECTURE.md explica cómo el código está estructurado  
✅ DATABASE_SCHEMA.md muestra visual clara de tablas + relaciones  
✅ API_DOCUMENTATION.md docifica cada endpoint  
✅ ONBOARDING_DEVELOPER.md = nuevo dev puede hacer primera PR en 30 min  
✅ Nuevo developer NO necesita pregunta "¿dónde está X?"  
✅ Vic entiende la arquitectura sin preguntar  
✅ Listo para Fase 3 (Operaciones + Polish)

---

## 🚀 VAS, CLAUDE CODE?

**Status:** Esperando tu ejecución  
**Autonomía:** Total (documenta sin preguntar, solo escala bloqueadores)  
**Presión:** Media-Alta (esto define onboarding de nuevo dev)  
**Éxito:** Si nuevo dev puede ser productivo en 30 min

**¡Dale!**

---

**Preparado por:** Claude (Arquitecto)  
**Para:** Claude Code (Ejecutor)  
**Validado por:** Vic (Fundador)  
**Status:** ✅ LISTO PARA EJECUTAR

**Próximo reporte:** Actualiza BITACORA.md al completar la fase
