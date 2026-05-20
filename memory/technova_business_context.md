---
name: technova-business-context
description: Identidad, propuesta de valor, paquetes en MXN, equipo, KPIs y timeline de mercado de TechNova Solutions
metadata:
  type: project
---

# 🏢 TechNova — Contexto del Negocio

> **Fuentes vivas (autoritativas):** `Technova.md`, `strategy.md`, `docs/PRICING_PROPOSAL_MX.md`, `DECISION_LOG.md` (D-004 / D-005 / D-006).
> Si este doc entra en conflicto con esas fuentes, **gana la fuente viva** — actualizar este archivo.

---

## 1. Qué es TechNova
**Agencia digital integral** que combina tecnología (IA, Next.js, automatización) con consultoría estratégica para PyMEs.

- **Eslogan:** *"Conecta con el futuro del espacio digital"*
- **Promesa de marketing actual (Hero):** *"Multiplica tus ventas sin contratar más personal"* — automatización + IA + embudos de alta conversión.

### Misión (oficial, Technova.md)
Ofrecer soluciones digitales integrales que cubran las áreas clave del éxito en línea: desarrollo web, marketing y datos.

### Visión (oficial, Technova.md)
Ser una agencia confiable y líder en soluciones digitales integrales para PyMEs y emprendedores, con resultados sostenibles (no métricas vanidosas).

### Valores
Excelencia · Crecimiento · Innovación · Compromiso · Confianza.

---

## 2. Nicho de Mercado
**PyMEs y emprendedores en México** en transformación digital o expansión online.

- **Sub-segmentos:** educación, retail especializado, servicios profesionales.
- **Personas target:** Dueños de negocio, Gerentes TI, Emprendedores con presupuesto $5K–$50K MXN por proyecto.
- **Geografía:** México primero. Internacionalización después (Stripe ya soporta multi-moneda — ver [[technova-technical-stack]] §2 / D-007).

---

## 3. Modelos de Negocio (Paquetes Modulares — D-005)
Esquema basado en el **Inventario Maestro de Recursos (IMR)** del wizard "TechNova Navigator". Precios en **MXN** (D-004).

| Paquete | Precio | Cliente Ideal | Entregable Core | Horas internas con IA |
|---------|--------|---------------|-----------------|----------------------|
| **START** | **$4.5K – $6.5K MXN** (~$250–350 USD) | Validación / Ads / freelancers | Landing alta conversión + WhatsApp + lead form | ~3h |
| **GROWTH** ⭐ | **$14.5K – $22.5K MXN** (~$800–1,250 USD) | Negocios establecidos que escalan | Sitio multi-página o eCommerce Next.js + CMS + email automation | ~15h |
| **SCALE** | **Desde $35K MXN** + fee mensual (~$2K MXN/mes setup IA) | Operaciones complejas, agentes IA, RAG | Software a medida + integración IA + CRM | Variable |

**Racional financiero:** vendiendo Growth a $18K MXN en ~15h = **$1,200 MXN/hora libre**. Margen 80%+ gracias a aceleración con IA (Cursor / Claude / v0).

**Pricing en UI:** la página `/pricing` muestra "Personalizado / Desde" — los precios MXN **no están hardcoded** para no encajonar (cotización vía wizard `/start-project`).

---

## 4. Flujo Comercial (Lead → Sale → Service)
1. **Atracción:** SEO + Ads + contenido ("Errores comunes en webs de PyMEs").
2. **Conversión:** dos CTAs en sitio
   - Principal: *"Cotiza tu proyecto en 2 minutos"* → `/start-project` (wizard).
   - Lead magnet: *"Auditoría Web Express Gratis"* (D-006) → `/api/leads` + Resend.
3. **Venta:** Discovery call → propuesta visual (Loom/Slide) → contrato digital.
4. **Servicio:** onboarding automático → sprint 4 semanas (estrategia → diseño → dev → launch) → soporte mensual.

---

## 5. KPIs del Negocio

| Categoría | KPI | Target |
|-----------|-----|--------|
| **Adquisición** | CAC | < $1,000 MXN |
| **Retención** | LTV | > 5× CAC (>$30K objetivo) |
| **Retención** | Repeat rate | > 40 % |
| **Funnel** | Conversion pricing page | > 5 % |
| **Funnel** | Wizard conversion | > 20 % |
| **Lead magnet** | Conversion form | > 15 % |
| **Lead magnet** | Lead quality calificada | > 30 % |
| **Producto** | Churn anual | < 15 % |
| **Producto** | NPS | > 50 |
| **Operación** | Margen por proyecto | > 60 % |
| **Operación** | Payout Stripe | < 48 h |
| **Operación** | Chargeback rate | < 0.1 % |

> Valores actuales (current) = TBD hasta primer trimestre con clientes pagados.

---

## 6. Estructura del Equipo (Costos por hora — USD interno, Technova.md)

**4 áreas:** Atención & Soporte · SEO & Datos · Diseño & Desarrollo · Marketing.

| Rol | USD/h | Rol | USD/h |
|-----|-------|-----|-------|
| Project Manager | $55 | Especialista SEO | $40 |
| Estratega Marketing | $50 | Community Manager | $35 |
| Web Developer | $50 | Soporte Técnico | $35 |
| UX/UI Designer | $45 | Atención Clientes | $30 |
| Analista de Datos | $45 | Copywriter | $30 |
| Ventas | $45 | | |

**PM:** ~20 % del total del proyecto (regla PM-01 del IMR).

**Equipo real hoy (operativo):**
- **Vic** — Founder, estrategia y ventas.
- **Claude Code** — Desarrollo técnico, arquitectura y documentación.
- **Contractors / agentes** — Copywriting y diseño bajo demanda.
- Hire #1 (Web Dev) previsto Q4 2026 (ver Timeline §8).

---

## 7. Decisiones Comerciales Clave (ver `DECISION_LOG.md`)
- **D-004** — Precios en MXN (no USD). Psicológicamente más accesible al PyME MX.
- **D-005** — Paquetes modulares basados en IMR (no time-and-materials ni paquete fijo cerrado).
- **D-006** — Lead magnet = "Auditoría Web Express Gratuita" personalizada (no checklist genérico).

---

## 8. Timeline de Mercado

| Hito | Fecha | Status |
|------|-------|--------|
| MVP validado (landing + wizard + lead magnet operativos) | Mayo 2026 | ✅ HOY |
| Primer cliente pagado | Junio 2026 | 🔜 |
| 3-5 clientes activos | Jul-Sep 2026 | 🔜 |
| 8-10 clientes + primer hire (Web Dev) | Q4 2026 | 🔜 |

---

## 9. Identidad Visual (para copy y UI consistentes)
- **Paleta:** Azul profundo `#1A1F71` · Morado nebulosa `#6A0DAD` · Negro espacial `#121212` · Cian brillante `#00D4FF`.
- **Tipografía:** Montserrat / Poppins / Roboto (heading "tecnológica").
- **Tono:** Profesional, amigable, motivador. Directo. No vendedor agresivo.

---

## 10. Diferenciadores
- **Vs agencias grandes:** velocidad, precios accesibles, foco PyME.
- **Vs freelancers:** procesos documentados, soporte post-launch, escalabilidad.
- **Vs WordPress shops:** stack moderno (Next.js + IA) = mejor performance y costos 1/3.
- **Diferenciador único:** arquitectura clara documentada + capacitación al cliente (no se vuelve carga de soporte).

---

**Última actualización:** 2026-05-19
**Próxima revisión:** cuando cambien paquetes, precios MXN o nicho.
