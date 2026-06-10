# 🚀 B.4.1 KICKOFF: Auditoría Automática (Puppeteer + Claude Haiku)

**For:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (Foundation para B.4.2-8)  
**Estimated Time:** 8-10 horas  
**Timeline:** Semana 1 de Fase B.4  

---

## 📋 OBJETIVO

Implementar sistema de **auditoría automática de sitios web** que:
1. Recibe URL de cliente
2. Puppeteer visita el sitio (simula usuario real)
3. Extrae datos de rendimiento, SEO, UX, seguridad
4. Claude Haiku genera reporte estructurado (17-puntos, score 0-100)
5. Guarda resultado en BD (tabla `audits`)
6. Notifica a Vic que auditoría está lista

**Por qué es crítico:** Este stage alimenta Stage 4 (Propuesta IA automática). Sin auditoría, no hay propuestas inteligentes.

---

## 🎯 ENTREGABLES

### 1. Backend Job para Puppeteer
**Archivo:** `src/lib/jobs/audit-website.ts`

**Función:** `auditWebsite(leadId: string, websiteUrl: string)`

**Proceso:**
```typescript
1. Validar URL (es válida + no es localhost)
2. Puppeteer setup:
   - Crear browser instance
   - Navegar a URL
   - Esperar 3 segundos (load page)
   - Extraer datos usando Puppeteer
3. Datos a extraer:
   - Lighthouse scores (performance, accessibility, best-practices, seo)
   - Meta tags (title, description, viewport, charset)
   - Headings structure (h1, h2, h3)
   - Forms count
   - Images count (sin alt)
   - Mobile responsive (viewport meta tag present)
   - HTTPS check
   - Core Web Vitals (si están disponibles)
   - Estructura HTML (doctype, lang attr)
   - Analytics (GA4, Meta Pixel detectados)
4. Generar prompt para Claude Haiku (VER SECCIÓN "Claude Haiku Prompt")
5. Llamar a Claude Haiku con datos extraídos
6. Parsear respuesta JSON
7. Guardar en BD (tabla `audits`)
8. Return: audit report completo
```

**Manejo de errores:**
- Si Puppeteer falla: log error, retry 1x, si falla otra vez → audit status "error"
- Si Claude falla: log error, retry con Claude Haiku (modelo más pequeño)
- Si BD falla: tirar excepción (el job puede reintentarse)

---

### 2. Claude Haiku Prompt
**Archivo:** `src/lib/prompts/audit-website.prompt.ts`

**Estructura:**
```typescript
export const auditWebsitePrompt = (extractedData: any) => `
Eres un experto en auditoría de sitios web para MIPyMEs mexicanas.

DATOS EXTRAÍDOS DEL SITIO:
${JSON.stringify(extractedData, null, 2)}

INSTRUCCIONES:
1. Analiza los datos extraídos
2. Genera un reporte JSON con estructura EXACTA:
{
  "score": number (0-100, ponderado por importancia),
  "findings": [
    {
      "item": "Nombre del elemento",
      "status": "verde" | "amarillo" | "rojo",
      "score": number (0-10),
      "recomendacion": "Qué hacer para mejorar"
    },
    // ... 16 items más (17 total)
  ],
  "summary": "Párrafo de 2-3 líneas explicando el estado general",
  "priority_areas": [
    "Área 1 más crítica",
    "Área 2",
    "Área 3"
  ]
}

ITEMS A EVALUAR (17 puntos):
1. Lighthouse Performance Score (30-100)
2. Lighthouse Accessibility (0-100)
3. Lighthouse Best Practices (0-100)
4. Lighthouse SEO Score (0-100)
5. Mobile Responsive
6. HTTPS/SSL
7. Meta Tags (Title, Description)
8. H1 Tag Present (SEO)
9. Heading Structure (H1-H6 hierarchy)
10. Alt Text en Imágenes
11. Core Web Vitals (si disponible)
12. Google Analytics 4 Integrado
13. Meta Pixel Integrado
14. Form Count (call-to-action)
15. Page Load Time (<3s ideal)
16. Cookie/Privacy Policy Link
17. Viewport Meta Tag (mobile)

PONDERACIÓN PARA SCORE FINAL:
- Performance: 25%
- SEO: 20%
- Accessibility: 15%
- Mobile: 15%
- Security: 10%
- Analytics: 10%
- UX Signals: 5%

RESPONDE SOLO CON JSON VÁLIDO. NO AGREGUES EXPLICACIONES.
`
```

---

### 3. Tabla BD: `audits`
**Archivo:** `src/db/schema.ts` (agregar tabla)

```typescript
export const audits = pgTable('audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  lead_id: uuid('lead_id').notNull().references(() => leads.id),
  site_url: text('site_url').notNull(),
  score: integer('score').notNull(), // 0-100
  findings: json('findings').notNull(), // Array de 17 items
  summary: text('summary').notNull(),
  priority_areas: json('priority_areas').notNull(), // Array de 3 áreas
  extracted_data: json('extracted_data'), // Raw Puppeteer output (para debugging)
  status: varchar('status', { length: 32 }).notNull().default('completed'), // completed, error
  error_message: text('error_message'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
```

---

### 4. API Endpoint: POST `/api/audits/create`
**Archivo:** `src/app/api/audits/create/route.ts`

**Recibe:**
```json
{
  "lead_id": "uuid",
  "website_url": "https://example.mx"
}
```

**Qué hace:**
1. Valida input con Zod
2. Valida que lead existe en BD
3. **Inicia background job** (NO espera respuesta)
4. Retorna inmediatamente:
```json
{
  "success": true,
  "audit_job_id": "job-uuid",
  "message": "Auditoría iniciada. Te notificaremos cuando esté lista.",
  "estimated_time": "5-10 minutos"
}
```

---

### 5. Background Job Trigger
**Ubicación:** `src/app/api/leads/route.ts` (endpoint existente)

**Cambio:** Cuando se crea un lead (POST `/api/leads`), si `project_type` incluye 'despegue', 'orbita', 'mision' Y tiene `website_url`:
```typescript
// Trigger background job
if (websiteUrl) {
  // Fire and forget
  auditWebsite(lead.id, websiteUrl).catch(err => 
    console.error(`[audit] async job failed for lead ${lead.id}:`, err)
  );
}
```

---

### 6. Email Notificación a Vic
**Archivo:** `src/lib/emails/auditCompleteNotification.ts`

**Cuándo:** Cuando auditoría se completa exitosamente

**Contenido:**
```
Subject: ✅ Auditoría completada: {empresa}
Body:
- Lead: {nombre}, {empresa}
- Sitio: {website_url}
- Score: {score}/100
- Áreas críticas: {priority_areas}
- Botón: "Ver propuesta" → Link a Stage 4 (Propuesta IA)
```

---

## 🛠️ TECH STACK

| Componente | Tech | Versión |
|-----------|------|---------|
| Headless Browser | Puppeteer | ^22.0.0 |
| IA | Claude Haiku | claude-3-5-haiku-20241022 |
| DB | Neon Postgres | (existing) |
| ORM | Drizzle | (existing) |
| Validation | Zod | (existing) |
| Email | Resend | (existing) |

---

## 📋 INSTALACIÓN & SETUP

### 1. Agregar dependencias
```bash
npm install puppeteer @anthropic-ai/sdk
```

### 2. Environment variables
```bash
# .env.local
ANTHROPIC_API_KEY=sk_... (Vic ya tiene)
DATABASE_URL=... (existing)
RESEND_API_KEY=... (existing)
```

### 3. DB Migration
```bash
# Agregar tabla `audits` a schema.ts
# Luego: npm run db:push
```

---

## ✅ CHECKLIST QA

### Unit Tests
- [ ] `auditWebsite()` con URL válida → retorna audit JSON
- [ ] `auditWebsite()` con URL inválida → throws error
- [ ] Claude prompt genera JSON válido siempre
- [ ] Score calculation es correcto (17 items → 0-100)

### Integration Tests
- [ ] POST `/api/audits/create` con lead_id válido → job inicia
- [ ] POST `/api/audits/create` con lead_id inválido → 404
- [ ] Audit completo guarda en DB correctamente
- [ ] Email se envía a Vic cuando audit completa

### Manual Testing (sin automatizar)
- [ ] Ejecutar auditoría en sitio real (ej: tech-nova.mx)
- [ ] Verificar scores son razonables (0-100)
- [ ] Verificar findings JSON tiene exactamente 17 items
- [ ] Verificar email se recibe (check NOTIFY_EMAIL inbox)
- [ ] Verificar BD tiene audit record

### Edge Cases
- [ ] Sitio con timeout (>10 segundos) → maneja gracefully
- [ ] Sitio sin HTTPS → detecta y reporta
- [ ] Sitio con JavaScript pesado → Puppeteer espera load
- [ ] Sitio español/mexico-specific → Claude genera recomendaciones locales

---

## 📚 REFERENCIAS

**Documentación relacionada:**
- `COMMERCIAL_FLOW_v2_FINAL.md` § STAGE 3 — contexto completo de auditoría
- `DATABASE_SCHEMA.md` — estructura DB
- `API_DOCUMENTATION.md` — patrones de endpoints
- `docs/technical/ERROR_HANDLING_GUIDE.md` — cómo manejar errores

**Código existente:**
- `src/app/api/leads/route.ts` — patrón de endpoint
- `src/lib/emails/*.ts` — templates de email
- `src/db/schema.ts` — estructura tablas

---

## 🎯 DEFINITION OF DONE

✅ **Código**
- [x] auditWebsite() function implementada
- [x] Claude Haiku prompt definido
- [x] Tabla `audits` en BD
- [x] API endpoint `/api/audits/create`
- [x] Background job trigger en `/api/leads`
- [x] Email template para notificación

✅ **Testing**
- [x] Unit tests (4 casos)
- [x] Integration tests (4 casos)
- [x] Manual testing (5 escenarios)
- [x] Edge case testing (4 casos)

✅ **Documentation**
- [x] Código comentado (funciones principales)
- [x] Error handling documentado
- [x] Env variables documentadas

✅ **Git**
- [x] Commit con mensaje descriptivo
- [x] PR abierto si necesario
- [x] BITACORA.md actualizado

---

## 📤 CÓMO REPORTAR

Cuando termines, crea un message en chat diciendo:

```
✅ B.4.1 COMPLETADO: Auditoría Automática

**Qué se hizo:**
- auditWebsite() implementada con Puppeteer + Claude Haiku
- Tabla `audits` en BD + API endpoint
- Email notificación a Vic
- 13/13 tests pasados

**Archivos modificados/creados:**
- src/lib/jobs/audit-website.ts (NEW)
- src/lib/prompts/audit-website.prompt.ts (NEW)
- src/lib/emails/auditCompleteNotification.ts (NEW)
- src/db/schema.ts (UPDATED — tabla audits)
- src/app/api/audits/create/route.ts (NEW)
- src/app/api/leads/route.ts (UPDATED — trigger)

**Próximo paso:** B.4.2 (Propuestas IA automáticas)

**Commit:** [hash]
**Documentado en:** BITACORA.md
```

Luego yo actualizo BACKLOG_MASTER y continuamos con B.4.2.

---

## 💡 TIPS & GOTCHAS

1. **Puppeteer + Vercel:** Puppeteer en Vercel requiere Chrome headless. Función debe ser serverless-compatible. Usar: `chrome-aws-lambda` si Vercel lo necesita.

2. **Timeout:** Puppeteer default timeout es 30s. Para sitios lentos, incrementar a 60s. Pero no más, porque agota el serverless timeout.

3. **Claude Haiku latency:** Claude Haiku es más rápido que Opus (500ms vs 2s típico). Acceptable para auditoría async.

4. **JSON parsing:** Claude ALGUNAS VECES agrega markdown. Usar `try/catch` para parsear JSON y limpiar si es necesario:
   ```typescript
   let parsed = JSON.parse(response);
   // O si tiene ```json wrapper:
   const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
   if (jsonMatch) parsed = JSON.parse(jsonMatch[1]);
   ```

5. **Validación URL:** Antes de Puppeteer, validar que:
   - Es HTTPS (o HTTP local para testing)
   - No es localhost (a menos que sea testing)
   - Responde en <1s (antes de iniciar browser)

6. **Score ponderación:** Los 17 items NO pesan igual. Usar la ponderación en el prompt (Performance 25%, etc.) para calcular score final realista.

---

**Created:** 2026-06-02  
**Owner:** Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Next:** After completion → B.4.2 KICKOFF (Propuestas IA automáticas)
