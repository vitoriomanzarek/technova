# 🚀 B.4.2 KICKOFF: Propuestas IA Automáticas (Claude Haiku + catalog.ts)

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (alimenta B.4.3 dashboard Vic)  
**Estimated Time:** 10-12 horas  
**Timeline:** Semana 1-2 de Fase B.4  
**Depends on:** ✅ B.4.1 COMPLETADO (tablas audits + leads)

---

## 📋 OBJETIVO

Implementar sistema que genera **propuestas IA automáticas** que:

1. Lee: audit report (17 puntos) + lead preferences (presupuesto, timeline, prioridades)
2. Accede: catalog.ts (56 componentes, precios en MXN, horas estimadas)
3. Genera: Propuesta JSON estructurada (módulos seleccionados, precio total, timeline)
4. Guarda: En tabla `proposals` con status "pending_vic_review"
5. Notifica: Email a Vic "Propuesta generada, requiere tu revisión"

**Por qué es crítico:** Propuestas son el corazón del flujo. Sin ellas, no hay conversión.

---

## 🎯 ENTREGABLES

### 1. Función de generación de propuestas
**Archivo:** `src/lib/jobs/generate-proposal.ts`

**Función:** `generateProposal(leadId: number, auditId: string): Promise<ProposalJSON>`

**Proceso:**

```typescript
1. Validaciones:
   - Lead existe + tiene datos completos
   - Audit existe + tiene findings
   - Presupuesto estimado es válido (>0, <1M MXN)

2. Preparar entrada para Claude Haiku:
   - Audit report (17 puntos + score)
   - Lead data: nombre, empresa, presupuesto_estimado, timeline, prioridades
   - Website status (tiene sitio, qué estado)
   - catalog.ts completo (todos 56 componentes)

3. Llamar Claude Haiku con prompt estructurado (VER SECCIÓN "Prompt Claude Haiku")

4. Parsear respuesta JSON:
   - Validar estructura (usar Zod schema)
   - Validar módulos existen en catalog.ts
   - Validar precio ≤ presupuesto_estimado
   - Si falla validación: retry o fallback a propuesta manual

5. Calcular PM fee (20% del total técnico)

6. Guardar en BD (tabla proposals):
   - modulos_seleccionados JSON
   - precio_total
   - horas_totales
   - timeline_dias
   - fecha_entrega_estimada (hoy + timeline)
   - status = "pending_vic_review"

7. Retornar: Propuesta JSON completa
```

---

### 2. Claude Haiku Prompt
**Archivo:** `src/lib/prompts/generate-proposal.prompt.ts`

**Estructura:**

```typescript
export const generateProposalPrompt = (data: {
  audit: AuditReport,
  lead: LeadData,
  catalog: ComponentsCatalog
}): string => `
Eres un asesor experto en proyectos web para MIPyMEs mexicanas.

CONTEXTO:
- Empresa: ${data.lead.empresa}
- Presupuesto máximo: $${data.lead.presupuesto_estimado} MXN
- Timeline deseado: ${data.lead.timeline}
- Prioridades: ${data.lead.prioridades.join(', ')}

ESTADO DEL SITIO:
${data.lead.website_status}

AUDITORÍA REALIZADA:
Score general: ${data.audit.score}/100

Áreas críticas:
${data.audit.priority_areas.map(a => `- ${a}`).join('\n')}

Findings detallados:
${data.audit.findings.map(f => \`- ${f.item} (${f.status}): ${f.recomendacion}\`).join('\n')}

CATÁLOGO DISPONIBLE:
${JSON.stringify(data.catalog, null, 2)}

INSTRUCCIONES:
1. Analiza el audit y las prioridades del cliente
2. Selecciona módulos que:
   - Resuelvan las áreas críticas identificadas
   - Respeten el presupuesto máximo
   - Se alineen con el timeline deseado
   - Sean realistas para MIPyMEs (no oversell)

3. Ordena módulos por IMPACTO, no por precio
   - Primero: lo que genera más conversión/ingresos
   - Segundo: lo que mejora la experiencia
   - Tercero: lo que es "nice to have"

4. Proporciona justificación clara para CADA módulo

5. Responde EXACTAMENTE con este JSON (sin comentarios):
{
  "modulos_seleccionados": [
    {
      "modulo_id": "MOD-DESIGN-01",
      "nombre": "Identidad Completa",
      "componentes": ["VI-01", "VI-02", "VI-03"],
      "precio_total": 8500,
      "horas": 28,
      "justificacion": "El audit mostró que la identidad visual es débil. Una identidad profesional impacta conversión 30%."
    },
    // ... más módulos (máximo 5-6 para MVP)
  ],
  "precio_subtotal_tecnico": 38900,
  "pm_fee_20_pct": 7780,
  "precio_total": 46680,
  "horas_totales": 92,
  "timeline_dias": 21,
  "justificacion_general": "Esta propuesta es el balance óptimo entre impacto y presupuesto. Resuelve 3 áreas críticas del audit manteniendo el timeline realista.",
  "observaciones": "Si el cliente quiere agregar E-commerce, ese sería un proyecto separado de $15K-20K más."
}

RESTRICCIONES:
- Precio total NUNCA debe exceder presupuesto máximo
- Timeline NUNCA debe exceder timeline deseado (si es necesario, reduce scope)
- Número de módulos: 3-6 (no más, no menos)
- Cada módulo debe tener justificación basada en audit

RESPONDE SOLO CON JSON. NO AGREGUES EXPLICACIONES ANTES NI DESPUÉS.
`
```

---

### 3. Tabla BD: `proposals` (AGREGAR a schema.ts)
**Archivo:** `src/db/schema.ts`

```typescript
export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  lead_id: integer('lead_id').notNull().references(() => leads.id),
  audit_id: uuid('audit_id').notNull().references(() => audits.id),
  status: varchar('status', { length: 50 }).notNull().default('pending_vic_review'),
  // pending_vic_review | approved | modified | rejected | client_reviewing | client_confirmed | paid
  
  modulos_seleccionados: json('modulos_seleccionados').notNull(), // Array de módulos
  
  precio_subtotal_tecnico: integer('precio_subtotal_tecnico').notNull(), // cents (MXN)
  pm_fee_20_pct: integer('pm_fee_20_pct').notNull(), // 20% overhead
  precio_total: integer('precio_total').notNull(), // Total en cents
  
  horas_totales: integer('horas_totales').notNull(),
  timeline_dias: integer('timeline_dias').notNull(),
  fecha_entrega_estimada: date('fecha_entrega_estimada').notNull(),
  
  justificacion_general: text('justificacion_general').notNull(),
  observaciones: text('observaciones'),
  
  // Vic's changes (si modifica)
  aprobado_por: varchar('aprobado_por', { length: 255 }), // Vic's email/ID
  aprobado_at: timestamp('aprobado_at'),
  notas_internas_vic: text('notas_internas_vic'), // Vic's notes on modifications
  
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
```

---

### 4. API Endpoint: POST `/api/proposals/generate`
**Archivo:** `src/app/api/proposals/generate/route.ts`

**Recibe:**
```json
{
  "lead_id": 123,
  "audit_id": "uuid"
}
```

**Qué hace:**
1. Valida inputs (lead + audit existen)
2. Inicia background job (fire-and-forget)
3. Retorna inmediatamente:
```json
{
  "success": true,
  "proposal_id": "uuid",
  "message": "Propuesta en generación. Te notificaremos cuando esté lista.",
  "estimated_time": "2-3 minutos"
}
```

---

### 5. Background Job Trigger
**Ubicación:** `src/lib/jobs/audit-website.ts` (modificar al final)

**Cambio:** Cuando auditoría se completa exitosamente:
```typescript
// Al final de auditWebsite():
if (auditCompleted) {
  // Fire and forget
  generateProposal(leadId, audit.id).catch(err => 
    console.error(`[proposal] async job failed for lead ${leadId}:`, err)
  );
}
```

---

### 6. Email Notificación a Vic
**Archivo:** `src/lib/emails/proposalGeneratedNotification.ts`

**Cuándo:** Cuando propuesta se genera exitosamente

**Contenido:**
```
Subject: 📋 Propuesta generada: {empresa} ${precio_total} MXN
Body:
- Lead: {nombre}, {empresa}
- Presupuesto solicitado: ${lead.presupuesto_estimado}
- Propuesta: ${precio_total} ({modulos_count} módulos)
- Timeline: {timeline_dias} días
- Botón: "Revisar propuesta" → Link a /admin/proposals-review

Color de prioridad (based on match vs budget):
- 🟢 Verde si precio ≤ presupuesto -10%
- 🟡 Amarillo si precio ≈ presupuesto ±10%
- 🔴 Rojo si precio > presupuesto (para revisión manual)
```

---

### 7. Validación de Propuesta (Zod Schema)
**Archivo:** `src/lib/schemas/proposal.ts`

```typescript
import { z } from 'zod';

export const proposalModuleSchema = z.object({
  modulo_id: z.string(),
  nombre: z.string(),
  componentes: z.array(z.string()),
  precio_total: z.number().positive(),
  horas: z.number().positive(),
  justificacion: z.string().min(10).max(500),
});

export const proposalSchema = z.object({
  modulos_seleccionados: z.array(proposalModuleSchema).min(3).max(6),
  precio_subtotal_tecnico: z.number().positive(),
  pm_fee_20_pct: z.number().positive(),
  precio_total: z.number().positive(),
  horas_totales: z.number().positive(),
  timeline_dias: z.number().positive().max(120), // Max 4 meses
  justificacion_general: z.string().min(20).max(1000),
  observaciones: z.string().optional(),
});

export type Proposal = z.infer<typeof proposalSchema>;
```

---

## 🛠️ TECH STACK

| Componente | Tech | Versión |
|-----------|------|---------|
| IA | Claude Haiku | claude-3-5-haiku-20241022 |
| Catálogo | catalog.ts (existente) | - |
| DB | Neon Postgres | (existing) |
| ORM | Drizzle | (existing) |
| Validation | Zod | (existing) |
| Email | Resend | (existing) |

---

## 📋 INSTALACIÓN & SETUP

### 1. Agregar tabla a schema.ts
```typescript
// Ya existe audit → agregar proposals
```

### 2. DB Migration
```bash
npm run db:push
```

### 3. Validación
```bash
npm run typecheck
```

---

## ✅ CHECKLIST QA

### Unit Tests (4)
- [ ] `generateProposal()` con datos válidos → retorna JSON válido
- [ ] JSON respeta Zod schema (modulos, precios, timeline)
- [ ] Precio total = subtotal + 20% PM fee
- [ ] Timeline no excede presupuesto (validación)

### Integration Tests (4)
- [ ] POST `/api/proposals/generate` con lead_id válido → job inicia
- [ ] Propuesta se guarda en BD correctamente
- [ ] Email se envía a Vic cuando propuesta completa
- [ ] Estado propuesta = "pending_vic_review" por default

### Manual Testing (4)
- [ ] Ejecutar con lead real que completó auditoría
- [ ] Verificar módulos seleccionados hacen sentido (ej: si audit score bajo → propuesta con UI/UX)
- [ ] Verificar precio ≤ presupuesto_estimado
- [ ] Verificar email llega a Vic con detalles correctos

### Edge Cases (4)
- [ ] Lead con presupuesto muy bajo ($5K) → propuesta realista o decline message
- [ ] Lead con audit score muy bajo (10/100) → propuesta completa
- [ ] Lead con timeline urgente (3 días) → propuesta reduce scope
- [ ] Claude Haiku retorna JSON inválido → fallback gracefully

---

## 📚 REFERENCIAS

**Documentación:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 4 — contexto completo
- `BACKLOG_MASTER.md` § B.4.2 — roadmap
- `docs/INVENTORY_COSTS.md` — costos de componentes
- `src/lib/catalog.ts` — catálogo 56 componentes (source of truth)

**Código existente:**
- `B.4.1_AUDITORIA_AUTOMATICA_KICKOFF.md` — patrones de job, email, BD
- `src/lib/jobs/audit-website.ts` — cómo estructurar async job
- `src/lib/emails/*.ts` — templates de email

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] generateProposal() function implementada
- [x] Claude Haiku prompt con ponderación inteligente
- [x] Tabla `proposals` en BD
- [x] API endpoint `/api/proposals/generate`
- [x] Background job trigger (al fin de auditoría)
- [x] Email template para notificación
- [x] Zod schema para validación

✅ **Testing**
- [x] 4 unit tests
- [x] 4 integration tests
- [x] 4 escenarios manual
- [x] 4 edge cases

✅ **Documentation**
- [x] Código comentado
- [x] Error handling documentado
- [x] catalog.ts usage documentado

✅ **Git**
- [x] Commit descriptivo
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ B.4.2 COMPLETADO: Propuestas IA Automáticas

**Qué se hizo:**
- generateProposal() implementada con Claude Haiku
- Propuestas respetan presupuesto + timeline
- Tabla `proposals` en BD + API endpoint
- 16/16 tests pasados

**Archivos modificados/creados:**
- src/lib/jobs/generate-proposal.ts (NEW)
- src/lib/prompts/generate-proposal.prompt.ts (NEW)
- src/lib/schemas/proposal.ts (NEW)
- src/lib/emails/proposalGeneratedNotification.ts (NEW)
- src/db/schema.ts (UPDATED — tabla proposals)
- src/app/api/proposals/generate/route.ts (NEW)
- src/lib/jobs/audit-website.ts (UPDATED — trigger)

**Próximo paso:** B.4.3 (Dashboard admin para Vic)

**Commit:** [hash]
```

---

## 💡 TIPS & GOTCHAS

1. **catalog.ts source of truth:** Todos los `modulo_id` y `componentes` deben existir en catalog.ts. Si Claude inventa módulos, Zod validation fallará y lo cachará.

2. **Presupuesto validation:** Si cliente tiene $30K pero audit score 90 (necesita mucho), la propuesta DEBE ser $30K máximo. Si no entra, incluir en `observaciones`: "Para solución completa, recomendamos $45K".

3. **PM Fee 20%:** Es SIEMPRE 20% del subtotal técnico, no configurable en esta etapa.

4. **Timeline realista:** Horas/7 ≈ días de trabajo. Si son 92 horas → 14 días (6 días labor). Si cliente pide 5 días, reduce módulos.

5. **JSON parsing:** Como B.4.1, Claude ALGUNAS VECES agrega markdown. Usar try/catch + regex para limpiar.

6. **Precio en cents:** BD guarda MXN en cents (sin decimales). $38,900 = 3,890,000 cents. Conversión:
   ```typescript
   const totalCents = Math.round(total * 100);
   ```

7. **Módulos orden:** Guardar en JSON el orden que Claude propuso (orden de impacto). Cuando cliente vea en /checkout, verá ese orden.

---

## 📊 EXPECTED OUTPUT

Ejemplo de propuesta exitosa:

```json
{
  "modulos_seleccionados": [
    {
      "modulo_id": "MOD-DESIGN-01",
      "nombre": "Identidad Completa",
      "componentes": ["VI-01", "VI-02", "VI-03"],
      "precio_total": 8500,
      "horas": 28,
      "justificacion": "Audit mostró identidad débil. Logo + paleta + tipografía mejora credibilidad 40%."
    },
    {
      "modulo_id": "MOD-DEV-LANDING",
      "nombre": "Landing Page Optimizada",
      "componentes": ["DV-01", "DV-03", "SE-05"],
      "precio_total": 9200,
      "horas": 25,
      "justificacion": "Lighthouse score muy bajo (28). Necesita optimización performance + responsive urgente."
    }
  ],
  "precio_subtotal_tecnico": 17700,
  "pm_fee_20_pct": 3540,
  "precio_total": 21240,
  "horas_totales": 53,
  "timeline_dias": 10,
  "justificacion_general": "Propuesta enfocada en resolver los 2 problemas más críticos del audit: identidad visual débil y performance. Implementable en 10 días respetando tu presupuesto.",
  "observaciones": "E-commerce y estrategia SEO avanzada quedarían como fase 2."
}
```

---

**Created:** 2026-06-02  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Depends on:** ✅ B.4.1 COMPLETADO  
**Next:** After completion → B.4.3 KICKOFF (Dashboard Vic)
