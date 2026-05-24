# TAREA: Lead Magnet "Auditoría Web Express" — MVP Phase

**Owner:** [Agente asignado]  
**Status:** 🔵 IN PROGRESS  
**Estimated hours:** 5-8  
**Timeline:** Hoy (2026-05-23) → Mañana (2026-05-24)  
**Blocker?** Email system must be tested first (Resend integration live)

---

## 📋 OBJETIVO

Crear un lead magnet descargable (PDF) llamado **"Auditoría Web Express"** que capture emails de MIPyMEs/startups mexicanas visitando tech-nova.mx. Este es el último blocker antes del MVP launch con Google Ads.

---

## 🎯 ESPECIFICACIÓN DE ENTREGA

### 1️⃣ PDF: "Auditoría Web Express"

**Contenido (5-7 páginas):**
- Portada con branding TechNova + fecha
- Intro: "¿Tu web está lista para escalar?" (problem statement)
- Checklist interactivo (15-20 items):
  - Rendimiento (Lighthouse, Core Web Vitals)
  - SEO técnico (meta tags, sitemap, robots.txt)
  - UX/UI (mobile responsive, a11y, CTA clarity)
  - Seguridad (HTTPS, headers, CORS)
  - Conversión (forms, analytics, tracking)
  - Email (deliverability signals)
- Scoring tabla: 0-25 items = "Necesitas urgente" / 50+ = "Excelente"
- CTA final: "Obtén una auditoría personalizada" (link a demo call con NOVA AI)
- Footer: TechNova branding, social links, copyright

**Formato técnico:**
- Generador: Node.js + `pdfkit` O `html2pdf` (elige según simpleza)
- Tamaño: <5MB
- Responsive: Se ve bien en desktop y mobile (cuando lo abren en email)
- Branding: Colores TechNova (azul/blanco), tipografía consistente

**Archivo destino:**
```
C:\Users\vitor\.gemini\antigravity\playground\technova\public\assets\
  └─ auditoria-web-express.pdf
```

### 2️⃣ Componente React: Lead Magnet Landing

**Ubicación:** `app/components/LeadMagnetCTA.jsx`

**Comportamiento:**
- Título: "Obtén tu Auditoría Web Express 📊"
- Subtitle: "Descubre qué le falta a tu web para escalar (5 minutos)"
- Formulario inline:
  - Campo: Email (required, validación Zod)
  - Campo: Nombre empresa (optional)
  - Botón: "Descargar Auditoría" (loading state con spinner)
- Post-submit:
  - Toast verde: "✅ Auditoría descargada. Revisa tu email."
  - PDF se descarga automáticamente
  - Email se envía con Resend (template: "auditoria-welcome")
  - Log: Firebase/console para conversion tracking

**Estilo:**
- Tailwind v4, responsive (mobile-first)
- CTA button: brand color + hover effect
- Illustration or icon (puedes usar Lucide)

**Props:** None (self-contained)

### 3️⃣ Template Email (Resend)

**Email ID:** `auditoria-welcome`

**Contenido (HTML + React template):**
```
Subject: 🎁 Tu Auditoría Web Express está lista
Sender: TechNova <hello@tech-nova.mx>

Body:
- Saludo personalizado ({{ nombre }})
- Resumen: "Adjunto encontrarás tu checklist de auditoría"
- CTA: "Ver resultados de tu auditoría" (link a dashboard o PDF)
- Bonus: "¿Necesitas ayuda?" + link a NOVA AI chat
- Footer: sociales, unsubscribe
```

**Archivo:** `emails/auditoria-welcome.jsx` (React template Resend)

### 4️⃣ Integración Resend

**Endpoint:** POST `/api/leads/download-auditoria`

**Body:**
```json
{
  "email": "founder@startup.mx",
  "company_name": "Acme Corp",
  "source": "homepage" | "google-ads" | "blog"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auditoría enviada a founder@startup.mx",
  "pdf_url": "/assets/auditoria-web-express.pdf"
}
```

**Lógica:**
1. Valida email (Zod)
2. Inserta en tabla `leads` (supabase) con:
   - email
   - company_name
   - source
   - magnet_type: "auditoria-web-express"
   - downloaded_at: now()
   - status: "lead" (calificación pendiente)
3. Envía email con Resend (await resend.emails.send())
4. Retorna 200 + PDF URL

### 5️⃣ Integración Homepage

**Ubicación:** `app/page.jsx` (hero section, antes del footer)

**Placement:**
- Sección "Prepárate para escalar"
- Componente `<LeadMagnetCTA />`
- Contexto visual: "Esta herramienta es gratuita y toma 5 minutos"

**GA4 Event:**
- Event: `lead_magnet_downloaded`
- Params: `magnet_type: "auditoria-web-express"`, `source: "homepage"`

---

## ✅ CHECKLIST DE QA

- [ ] PDF genera sin errores (tamaño <5MB, se abre en cualquier PDF reader)
- [ ] Formulario valida email (rechaza inválidos, OK pattern)
- [ ] Submit gatilla Resend email (revisa Resend logs)
- [ ] Lead se inserta en Supabase `leads` tabla
- [ ] GA4 event dispara en Google Analytics console
- [ ] Email incluye link de descarga funcional (si no auto-download)
- [ ] Componente responsive (abre bien en mobile)
- [ ] Token Resend válido en `.env.local` (no hardcoded)
- [ ] No hay console.errors en dev tools

---

## 📚 ARCHIVOS TÉCNICOS RELEVANTES

**Consulta estos ANTES de empezar:**
- `docs/technical/API_DOCUMENTATION.md` — endpoint patterns
- `docs/technical/DATABASE_SCHEMA.md` — tabla `leads` schema
- `docs/technical/COMPONENTS_LIBRARY.md` — componentes reutilizables

**Stack:**
- Next.js 16.2.4, React 19.2.4, Tailwind v4
- Resend 6.12 (email), Supabase (DB), Zod 4.4 (validation)
- `pdfkit` para PDF generation (o usa library existente si la hay)

---

## 🚨 AGENT DOCUMENTATION PROTOCOL (OBLIGATORIO)

**ANTES de reportar a Vic, DEBES documentar según esto:**

→ Consulta: [`AGENT_DOCUMENTATION_PROTOCOL.md`](./AGENT_DOCUMENTATION_PROTOCOL.md)

**4-STEP CHECKLIST:**

### 1. BITACORA.md — Nueva entrada SESSION:

```markdown
## 🟢 SESSION 2026-05-24: Lead Magnet "Auditoría Web Express"

**Status:** ✅ COMPLETED / 🔄 EN PROGRESO / 🔴 BLOQUEADO

### 📋 Work Completed
- [x] PDF generador creado (`pdfkit` / `html2pdf`)
- [x] LeadMagnetCTA componente integrado
- [x] Resend email template enviado
- [x] /api/leads/download-auditoria endpoint live
- [x] Homepage integración done
- [x] GA4 event tracking live
- [x] QA checklist pasó ✅

**Blockers:** None
**Time spent:** X horas
**Ready:** Sí, ready para MVP launch
```

### 2. DECISION_LOG.md — SI hay decisión (ej. "¿Usar pdfkit vs html2pdf?"):

```markdown
## D-022: PDF Generation Library Selection (pdfkit vs html2pdf)

**Date:** 2026-05-24
**Owner:** [Tu nombre]
**Status:** APPROVED

### Decisión
Usar [pdfkit / html2pdf] porque [razón: simplicidad, perf, etc]

### Por Qué
[Ventajas técnicas / tiempo de implementación]

### Trade-offs
[Qué limitaciones tiene]

### KPI de Éxito
- PDF genera en <500ms
- Tamaño <5MB
- Se descarga y abre sin errores
```

### 3. memory/ — Actualizar SI hay cambios persistentes:
- ¿Nueva dependency en stack? → `technova_technical_stack.md` (add pdfkit versión)
- ¿Nueva convención API? → `technova_development_standards.md`

### 4. Git Commit:

```bash
git add .
git commit -m "feat(lead-magnet): add Auditoría Web Express PDF + Resend integration

- Created pdfkit-based PDF generator
- Added LeadMagnetCTA React component
- Integrated Resend email delivery
- Added /api/leads/download-auditoria endpoint
- Linked GA4 event tracking
- QA passed, ready for MVP launch

Closes: MVP blocker (email system testing)"
```

---

## 📋 REPORTE FINAL

Cuando hayas completado TODO + documentado:

```
✅ **COMPLETADO: Lead Magnet "Auditoría Web Express"**

**Qué se hizo:**
- PDF generator ✅
- React component ✅
- Resend integration ✅
- API endpoint ✅
- Homepage integration ✅
- GA4 tracking ✅

**Status:** 🟢 Ready para MVP launch

**Documentado en:**
- BITACORA.md (SESSION 2026-05-24)
- DECISION_LOG.md (D-022 si decisión tomada)
- memory/ actualizado? [sí/no]
- Git: commit descriptivo ✅

**Próximos pasos:**
- [Email test results confirmation]
- [A.11 bug fixes confirmation]
- [LAUNCH decision call with Vic]

**Blockers:** None
**Time spent:** X horas
```

---

## 💡 TIPS

1. **PDF content:** Reutiliza componentes React si es posible (renderiza a PDF)
2. **Email:** Copia template pattern de `emails/` que ya existe (Resend setup 2026-05-24)
3. **DB:** Usa `prisma.leads.create()` o Supabase client directo (ve schema)
4. **GA4:** Copia pattern de otros eventos ya definidos en componentes
5. **Testing:** POST a `/api/leads/download-auditoria` con curl/Postman antes de reportar

---

**Creada:** 2026-05-24  
**Owner:** Vic  
**Prioridad:** 🔴 CRÍTICA (MVP blocker)  
**Última actualización:** 2026-05-24
