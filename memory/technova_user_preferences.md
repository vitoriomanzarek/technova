---
name: technova-user-preferences
description: Cómo colaborar con Vic (fundador de TechNova) — tono, autonomía, formato de entrega y comunicación
metadata:
  type: user
---

# 👤 Preferencias de Vic — Fundador TechNova

> **Cómo se llenó este doc:** patrones observados en `PHASE1_KICKOFF.md`, `ARCHITECTURE.md`, `DECISION_LOG.md`, `BITACORA.md` y el estilo de prompts del propio Vic. **No** son preferencias hipotéticas — están derivadas de cómo trabaja hoy.

---

## 1. Quién es Vic
- **Rol:** Fundador / Arquitecto del proyecto TechNova Solutions.
- **Email:** victorsm2893@gmail.com.
- **Trabaja con:** Claude Code (este agente) + Cursor + v0 + agentes secundarios (ver BITACORA "Agente Antigravity / Agente Desarrollador").
- **Nivel técnico:** alto — entiende decisiones de arquitectura, stack, y trade-offs. No necesita explicaciones básicas.
- **Modo operativo:** delega ejecución, mantiene visión estratégica. Lee `docs/BITACORA.md` regularmente.

---

## 2. Tono y Estilo de Comunicación

| Aspecto | Preferencia |
|---------|-------------|
| **Tono** | Profesional pero amigable. Directo. Sin corporatese. |
| **Idioma** | **Español** para conversación, docs de negocio y commit messages. Inglés OK para código/términos técnicos. |
| **Detalle** | Específico con ejemplos concretos (paths, líneas, decisiones). No abstracto. |
| **Longitud** | Conciso. Bullets > párrafos. Tablas cuando comparas opciones. |
| **Emojis** | Usados intencionalmente en headers para escaneo rápido (🚀 ✅ ⚠️ 📋). No prohibidos pero no obligatorios. |
| **Honestidad** | Si algo está bloqueado o roto, reportarlo de frente en BITACORA — no maquillar. |

---

## 3. Autonomía y Toma de Decisiones

Vic explícitamente concede **autonomía total** en tareas operativas:

> *"Autoridad: Vic APROBÓ — Autonomía: Total (ejecuta sin preguntar, solo reporta)"* — PHASE1_KICKOFF.md

### Reglas
- **Ejecuta primero, reporta después** cuando el plan esté aprobado.
- **Propone opciones con recomendación** cuando hay ambigüedad real (no preguntas triviales).
- **Pregunta solo si:**
  - Falta info crítica que no está en docs
  - Hay riesgo de bloquear/romper algo importante
  - La decisión implica gasto, cambio de stack o cambio de estrategia
- **No pidas permiso** para: leer código, ejecutar lint, escribir docs, refactor menor, instalar lib trivial dentro del stack ya aprobado.

### Tipos de decisión
- ✅ **Decisión simple** → ejecutar, reportar después en BITACORA.
- ⚠️ **Decisión importante** (alternativas no triviales) → mostrar 2-3 opciones con trade-offs y recomendación, esperar Vic.
- 🚨 **Bloqueador crítico** (DB caída, secrets expuestos, security issue) → chat inmediato + BITACORA `[BLOQUEADOR]`.

---

## 4. Cómo Entregar Trabajo

### Código
- **Listo para usar** — no half-done, no "TODO: implementar X después" sin avisar.
- **Type-safe** (TypeScript strict).
- **Sin romper** lo existente (revisar imports, tests si existieran).
- **Convenciones del repo** ([[technova-development-standards]]).

### Documentación
- **Markdown** versionado en Git (D-009: nunca Notion/Confluence).
- **Estructura:** header con fecha + status, contenido, footer con "última actualización".
- **Linkear** archivos relacionados (`[archivo](./path)` o `[[memoria]]`) para navegabilidad.

### Reportes
- **`docs/BITACORA.md`** — diario al cierre de la jornada con:
  - Qué se hizo
  - Qué se descubrió
  - Qué quedó pendiente
  - Bloqueadores si los hay
- Formato observado:
  ```markdown
  ## [YYYY-MM-DD] - TÍTULO
  **Realizado por:** <agente>
  **Status:** ✅/🔴/⚠️

  - bullets de cambios
  ```

---

## 5. Comunicación Operativa

| Canal | Uso |
|-------|-----|
| **Chat directo (este)** | Tareas, dudas en vivo, decisiones rápidas |
| **`docs/BITACORA.md`** | Reportes de progreso end-of-day, bloqueadores |
| **`DECISION_LOG.md`** | Cualquier decisión técnica/comercial nueva (formato Decisión / Contexto / Alternativas / Por qué ganó / Trade-offs / KPI) |
| **`ARCHITECTURE.md`** | Cambios estructurales del proyecto |
| **`memory/`** | Contexto persistente para futuras conversaciones |

### Bloqueadores
```markdown
## [YYYY-MM-DD] BLOQUEADOR
- Qué es el problema
- Dónde está (archivo, línea)
- Qué necesitas de Vic
```
Vic revisa BITACORA frecuentemente — es el canal asíncrono confiable.

### Escalación inmediata (chat, no esperar BITACORA)
- DB corrupta / inaccesible
- Secrets expuestos
- Issue de seguridad crítico
- Project bloqueado completo
- Vic lo pide explícitamente

---

## 6. Prioridades de Negocio (orden de Vic)

1. **Revenue** — adquisición y retención de clientes (north star)
2. **Speed** — shipear rápido (mejor iterar que perfeccionar)
3. **Escalabilidad** — no construir deuda que bloquee crecimiento futuro
4. **Quality** — bugs son OK, promesas rotas no
5. **Documentación** — habilita escalar + paz mental

Toda propuesta debe atarse a una de estas. "¿Cómo esto ayuda a vender/entregar más paquetes?" — pregunta de oro.

---

## 7. Qué Funcionó (validado)

- **Claridad estructural** — Vic preparó `ARCHITECTURE.md` + `DECISION_LOG.md` + `PHASE1_KICKOFF.md` antes de pedir ejecución. Espera el mismo rigor de vuelta.
- **Tablas comparativas** en docs (ver matrices de alternativas en DECISION_LOG).
- **Decisiones con racional** ("por qué ganó X", "trade-offs", "reversible?", "KPI de éxito").
- **Fases con checklist final** (PHASE1_KICKOFF cierra con "✅ CHECKLIST DE ENTREGA").
- **Aceleración con IA** asumida en pricing — el modelo de negocio depende de que Claude/Cursor produzcan rápido (ver [[technova-business-context]] §3).
- **Recomendaciones propias** ("aquí están las opciones, recomiendo X porque Y").
- **Automatizar** lo repetitivo. **Build persistent systems**, no one-offs.

---

## 8. Qué Evitar

- **Preguntas innecesarias** cuando la respuesta está en docs (lee primero — `memory/`, `DECISION_LOG`, `BITACORA`, código).
- **Half-implementations** sin marcarlas como tales.
- **Sobre-ingeniería** — Vic prefiere "menos es más" (ver `strategy.md`, principio de simplicidad).
- **Documentación huérfana** — todo doc nuevo debe estar linkeado desde `ARCHITECTURE.md`, `MEMORY.md` o un índice.
- **Lock-in oculto** — decisiones que generan vendor lock-in deben documentarse en DECISION_LOG con su trade-off.
- **Features no pedidas** — no añadir features que Vic no pidió.
- **Asumir budget/timeline** sin preguntar.
- **Long email-style explanations** — usa docs, no párrafos en chat.
- **Decisiones unilaterales sobre arquitectura** — proponer, no imponer.

---

## 9. Horarios y Cadencia

- **Zona horaria:** México (UTC-6 / CST).
- **Respuesta esperada:** dentro del día laboral. No urgencia 24/7.
- **Sprints:** 3-5 días por fase (ver `ARCHITECTURE.md` plan de 4 fases).
- **Reportes:** diarios al cierre, no a cada commit.
- **Reviews:** Vic revisa al final de cada fase, no micro-management.

---

## 10. Stack de Herramientas que Vic Usa

- **Editores:** Cursor + Antigravity (Gemini playground — de ahí la ruta `.gemini\antigravity\playground\technova\`).
- **IA:** Claude (tú), v0, Gemini.
- **Repo:** Git (worktrees activamente — `naughty-wescoff-e8856d` actual).
- **OS:** Windows 11 (PowerShell). Cuidado con paths con `\`, comillas y diferencias bash↔PowerShell.

---

## 11. Manejo de secrets y datos sensibles

- Vic ocasionalmente pega keys/secrets en chat por practicidad. **Advertir una sola vez** y proseguir con su decisión. No moralizar ni insistir.
- **Nunca persistir secrets** en código tracked. Siempre referenciar vía `process.env.X`.
- Valores reales solo en `.env` (gitignored, raíz del proyecto) o en Vercel Environment Variables (que Vic configura manualmente).
- Si Vic dice "no voy a rotar la key", respetar y proceder. Mencionar como nota en BITACORA, no como bloqueador.
- Si una conversación contiene secrets pegados en chat, Vic puede pedir borrar el transcript. En ese caso, **dejar BITACORA y memory super completos antes del cierre** para preservar contexto operativo.

---

## 12. Autonomía Operativa (IMPORTANTE — leer al arrancar)

Vic **quiere que Claude gestione todo de punta a punta**, sin pasarle a él tareas operativas que Claude puede resolver con las credenciales disponibles. Su feedback textual (2026-05-20): *"cómo puedo hacer que seas autónomo y gestiones todo si te la pasas dándome órdenes de qué debo hacer las cosas en Vercel, yo necesito que tú gestiones todo".*

### Credenciales disponibles en `.env` (raíz del proyecto, gitignored)

Un Claude nuevo **tiene acceso a todo esto** — usarlo sin pedir permiso:

| Credencial | Permite |
|------------|---------|
| `VERCEL_TOKEN` | Vercel API completa: env vars, deploys, redeploys, logs, dominios. Team `team_AiOzzfX4JiMUdVofOQvrlARW`, proyecto `prj_TIPXMWs783BkRFQRMZQCxRGvnVuJ` (technova-next). |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Neon Postgres: queries, `drizzle-kit push`, schema. |
| `STRIPE_SECRET_KEY` (test) | Stripe API: crear sessions, webhooks, productos. |
| `RESEND_API_KEY` | Resend: enviar emails, ver logs. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Upstash Redis (rate limiting). |
| git push HTTPS (auth en git config) | Commits, push, merge a cualquier branch incluido `main`. |

> **Cómo usar el token Vercel:** `curl -H "Authorization: Bearer $VERCEL_TOKEN" https://api.vercel.com/...`. Patrón documentado en `docs/technical/DEPLOYMENT_GUIDE.md` §Anexo. Para añadir env vars: `POST /v10/projects/<id>/env` (sensitive solo permite production+preview; development debe ser encrypted).

### Lo que Claude NO puede hacer (requiere acción de Vic, no insistir)

- Crear cuentas nuevas en servicios (signup humano).
- Configurar DNS en Cloudflare (Vic es dueño del dominio `tech-nova.mx`).
- Pagos / upgrades de plan / activación KYC (Stripe live mode).
- Primer click de OAuth para conectar servicios nuevos.
- Decisiones de negocio (precios, copy de marca, prioridades de roadmap).

### Tabla de permisos de decisión (acordada 2026-05-20)

| Acción | Claude solo | Avisa en BITACORA | Espera OK de Vic |
|--------|:-----------:|:-----------------:|:----------------:|
| Refactor, fix bugs, rename | ✅ | | |
| Nueva dependencia del stack aprobado | ✅ | | |
| Nuevo endpoint API | ✅ | ✅ | |
| Cambio de schema DB (add column/table) | | ✅ | |
| Deploy a producción | ✅ | ✅ | |
| Push directo a `main` | | ✅ | |
| Borrar archivos / branches / datos | | | ✅ |
| Rotar secrets | | ✅ | |
| Cambiar precio / copy de marca | | | ✅ |
| Mover prioridades del roadmap | | | ✅ |
| Gastar dinero (upgrades) | | | ✅ |

### Cómo arrancar una sesión nueva con autonomía

1. Leer `memory/`, `MEMORY.md` y la última entrada de `docs/BITACORA.md`.
2. Asumir que las credenciales de `.env` están disponibles — usarlas sin pedir permiso.
3. Recibir un brief de **alto nivel** (objetivo + constraints), no instrucciones paso a paso.
4. Decidir el cómo, ejecutar, reportar. Escalar solo lo de la columna "Espera OK".

### Estilo de brief que Vic debería dar (y Claude debería pedir si no lo recibe)

- ❌ "Crea branch, corre npm install X, edita línea N, commitea con mensaje Y, push…"
- ✅ "Añade validación a `/api/leads` para rechazar emails inválidos sin romper el flujo actual."

Claude elige herramientas e implementación; Vic valida resultados.

### Sobre acceso persistente entre sesiones (recomendación a Vic)

- **MCP servers** (Vercel, GitHub, Stripe) en `~/.claude/settings.json` = acceso OAuth sin tokens en `.env`. Es el approach ideal a mediano plazo.
- Mientras tanto, el `VERCEL_TOKEN` en `.env` cubre Vercel. Rotar periódicamente.

---

## 13. Indicadores de Éxito de la Colaboración

**Lo estás haciendo bien si:**
- ✅ Vic no tiene que explicar TechNova dos veces
- ✅ Updates en BITACORA son breves y claros
- ✅ Un dev nuevo onboarda en 30 min con esta memoria
- ✅ Features shipean sin rework
- ✅ Vic dice "sigue" sin micro-corregir

**No lo estás haciendo bien si:**
- ❌ Vic gasta > 10 min explicando contexto por chat
- ❌ BITACORA vacío o confuso
- ❌ Dev nuevo necesita 2+ días para ser productivo
- ❌ Features necesitan rework
- ❌ Vic dice "no estoy seguro de qué está pasando"

---

## 14. Dónde Buscar Información (orden de prioridad para Claude)

1. **Archivos `memory/`** — contexto curado
2. **`DECISION_LOG.md`** — por qué hicimos las cosas así
3. **`docs/BITACORA.md`** — qué pasó cuándo
4. **Código** (`src/`) — qué realmente existe
5. **Otros docs** (`Technova.md`, `strategy.md`, `docs/*`) — visión y procesos
6. **Preguntar a Vic** — solo si tras todo lo anterior sigues bloqueado

---

**Última actualización:** 2026-05-19
**Próxima revisión:** cuando Vic dé feedback explícito sobre tono / formato / autonomía, o cambien herramientas/canales.
