# TechNova — Plan de Ejecución

> Plan vivo. Cada ítem tiene estado, responsable y dependencias claras.

---

## Sprint Actual — Mayo 2026

### ✅ Completado

| Tarea | Descripción |
|---|---|
| Merge worktree | Branch `claude/sad-elgamal-ada3ba` integrado a main |
| Formularios funcionales | `/api/leads` captura y guarda en Neon DB |
| Notificaciones al owner | Email a `thisistechnova2026@gmail.com` en cada lead |
| Navbar dropdown | Fondo opaco, sin transparencia |
| Botón /contacto | Corregido de blanco a gradiente cyan→blue |
| Favicon | ICO de marca (16/32/48px) activo |
| Sentry condicional | Build no falla si no hay `SENTRY_AUTH_TOKEN` |
| Emails corregidos | `RESEND_API_KEY` correcto en proyecto Vercel correcto (`technova-next`) |
| Proyecto Vercel | `.vercel/project.json` apunta a `technova-next` (el que sirve `tech-nova.mx`) |
| Sofía persona | Emails reescritos con voz cálida y branding espacial |
| Campo URL en auditoría | Form captura `website_url`, se guarda en DB y aparece en notificación al owner |
| BRAND_IDENTITY.md | Documento de identidad completo para todos los agentes |

---

## Sprint 2 — Próximas 2 semanas

### 🔴 Alta prioridad

#### 1. Flujo de auditoría manual (Fase 1)
**Qué:** Cuando llega un lead de `auditoria-web` con URL, el dueño (Victor) recibe:
- Email de notificación con botón "🔭 Abrir sitio a auditar"
- La URL ya está en el email → Victor abre el sitio, hace el análisis manual
- Responde directamente al lead desde `sofia@tech-nova.mx` con el diagnóstico

**Por hacer:**
- [ ] Crear plantilla de diagnóstico (Google Doc o Notion) para que Victor tenga estructura de respuesta
- [ ] Agregar filtro en Gmail: emails de `thisistechnova2026@gmail.com` con `auditoria-web` → etiqueta "Auditoría Pendiente"
- [ ] Objetivo: responder en <24h

#### 2. Actualizar Privacy Policy — fecha
**Qué:** Dice "Diciembre 2024". Cambiar a fecha actual.
**Archivo:** `src/app/privacidad/page.tsx`
**Esfuerzo:** 5 min

#### 3. Google Search Console
**Qué:** Registrar `tech-nova.mx` en GSC para indexación y datos de búsqueda.
**Pasos:**
1. Ir a search.google.com/search-console
2. Agregar propiedad con tipo "Dominio"
3. Verificar vía DNS TXT en el panel de dominio
4. Enviar sitemap: `https://tech-nova.mx/sitemap.xml`

#### 4. Sofía en todos los formularios
**Qué:** El email de confirmación de Sofía debería dispararse también en el formulario `/contacto`
(actualmente solo va a `auditoria-web`). Considerar un email de bienvenida genérico de Sofía para todos los leads.

---

### 🟡 Media prioridad

#### 5. Semi-automatización del diagnóstico (Fase 2)
**Qué:** Cuando llega un lead de `auditoria-web`, un webhook dispara:
1. Google PageSpeed Insights API (performance score, CWV)
2. Meta tags check (título, descripción, OG)
3. Mobile-friendly check
4. Genera un borrador de reporte automático
5. Victor lo revisa y personaliza → Sofía lo envía

**Tech stack sugerido:**
- Next.js API Route `/api/audit-run` que llama a PageSpeed API
- Neon DB para guardar resultados del escaneo
- Email con resultados formateados

**Esfuerzo estimado:** 2-3 días de desarrollo

#### 6. GA4 Timezone
**Qué:** Cambiar a "Ciudad de México" en Google Analytics.
**Dónde:** analytics.google.com → Admin → Configuración de propiedad

#### 7. Stripe modo producción
**Cuándo:** Cuando esté completo el proceso KYC de Stripe
**Qué cambiar:** `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` → versiones live
**Nota:** Rotar a secret manager antes del switch

---

### 🟢 Baja prioridad (backlog)

#### 8. Blog / Content Hub
Ver `BLOG_AUTOMATION_STRATEGY.md` para el plan completo.
- CMS: Notion o Contentful como fuente de verdad
- Publicación semi-automatizada
- Contenido con voz de Sofía y temática espacial

#### 9. CRM básico para leads
Ver `LEAD_MANAGEMENT_PLATFORM.md`.
- Panel interno para ver todos los leads
- Etiquetas: Frío / Templado / Caliente / Cerrado
- Historial de contactos

#### 10. Automatización Fase 3 — Diagnóstico AI
- Integrar OpenAI/Claude para análisis semántico del sitio
- Recomendaciones de copy, estructura y CTA
- Genera el reporte completo sin intervención humana
- Victor solo aprueba antes de enviar

---

## Variables de Entorno — Estado Actual

| Variable | Proyecto | Estado |
|---|---|---|
| `RESEND_API_KEY` | technova-next (prod) | ✅ Correcto (`re_BDdRd14F...`) |
| `RESEND_FROM_EMAIL` | technova-next (prod) | ✅ `Sofía de TechNova <sofia@tech-nova.mx>` |
| `NOTIFY_EMAIL` | technova-next (prod) | ✅ `thisistechnova2026@gmail.com` |
| `DATABASE_URL` | technova-next (prod) | ✅ `ep-gentle-meadow-aph6dcnk` (producción) |
| `STRIPE_SECRET_KEY` | technova-next (prod) | ⚠️ Test mode — migrar a prod cuando KYC listo |
| `UPSTASH_REDIS_*` | technova-next (prod) | ✅ Funcional |
| `NEXT_PUBLIC_BASE_URL` | technova-next (prod) | ⚠️ Verificar que sea `https://tech-nova.mx` |
| `ADMIN_DASHBOARD_TOKEN` | technova-next (prod) | ✅ Configurado (2026-06-02) — dashboards internos activos en `/admin/project-status` e `/internal/architecture`. |

---

## Decisiones Técnicas Registradas

| Decisión | Razón |
|---|---|
| No bot automático en Fase 1 | El diagnóstico manual da más calidad, crea conversación, convierte más |
| Sofía como persona (no IA) | Más humanidad, más confianza, diferenciación real |
| Neon serverless (producción: ep-gentle-meadow) | Proyecto real; ep-little-math es el de desarrollo |
| `.vercel/project.json` → technova-next | El dominio tech-nova.mx vive en ese proyecto, no en "technova" |
| Promise.allSettled para emails | El lead se guarda siempre aunque el email falle |

---

*Documento mantenido por el equipo de desarrollo y los agentes de Claude Code.*
*Última actualización: Mayo 2026*
