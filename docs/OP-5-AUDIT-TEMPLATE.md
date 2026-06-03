# 🔭 Template de Diagnóstico Web — Uso Interno
**Para:** Vic (Fundador) | **Versión:** 1.0 | **Actualizado:** 2026-06-02

> Abre este archivo cada vez que llegue un lead de auditoría. De principio a fin: ~20-30 min.

---

## ⚡ Flujo Rápido

```
1. Llega email "Nuevo lead: auditoria-web" → 2. Abre este doc → 3. Audita el sitio (15-20 min)
→ 4. Calcula score → 5. Copia el template de email → 6. Personaliza y envía
→ 7. Si no responde en 5 días → follow-up
```

---

## 📋 Checklist de Auditoría (17 puntos)

Evalúa cada punto: **2 pts = bien**, **1 pt = mejorable**, **0 pts = problema grave**. Máximo: 34 pts → normaliza a 100.

### ⚡ RENDIMIENTO (6 pts)

| # | Qué revisar | Cómo | Herramienta |
|---|-------------|------|-------------|
| 1 | **LCP** (Largest Contentful Paint) | ¿Carga el contenido principal en < 2.5s? | [PageSpeed Insights](https://pagespeed.web.dev) |
| 2 | **CLS** (Cumulative Layout Shift) | ¿Los elementos se mueven al cargar? Score < 0.1 | PageSpeed Insights |
| 3 | **Mobile** | ¿Se ve bien en celular? ¿Botones tocables? | Chrome DevTools → Toggle Device |
| 4 | **Tiempo de respuesta servidor** | ¿TTFB < 600ms? | GTmetrix o PageSpeed |
| 5 | **Imágenes optimizadas** | ¿Usan WebP/AVIF? ¿Están comprimidas? | PageSpeed → Opportunities |
| 6 | **JS/CSS bloqueante** | ¿Hay scripts que bloquean el render? | PageSpeed → Diagnostics |

### 🔍 SEO TÉCNICO (4 pts)

| # | Qué revisar | Cómo | Herramienta |
|---|-------------|------|-------------|
| 7 | **Title + Meta description** | ¿Tienen? ¿Son únicos por página? | Ver código fuente (Ctrl+U) o [SEOquake](https://www.seoquake.com) |
| 8 | **Indexación** | `site:dominio.com` en Google — ¿aparece? | Google Search |
| 9 | **Sitemap + robots.txt** | `dominio.com/sitemap.xml` y `/robots.txt` — ¿existen? | Navegador |
| 10 | **SSL/HTTPS** | ¿Tiene candado? ¿Redirige HTTP → HTTPS? | Navegador |

### 📱 UX / UI (4 pts)

| # | Qué revisar | Cómo | Herramienta |
|---|-------------|------|-------------|
| 11 | **CTA claro** | ¿Hay un botón/acción evidente above-the-fold? | Vista manual |
| 12 | **Navegación** | ¿Menú claro? ¿Se encuentra lo importante en 3 clics? | Vista manual |
| 13 | **Formularios** | ¿Funcionan? ¿Tienen validación? ¿Confirmación post-submit? | Probar manualmente |
| 14 | **Accesibilidad básica** | ¿Contraste legible? ¿Alt text en imágenes? | [WAVE](https://wave.webaim.org) |

### 💡 CONVERSIÓN (2 pts)

| # | Qué revisar | Cómo | Herramienta |
|---|-------------|------|-------------|
| 15 | **Analytics instalado** | ¿GA4 o similar activo? | [BuiltWith](https://builtwith.com) o ver código fuente |
| 16 | **Social proof** | ¿Testimoniales, logos de clientes, casos de éxito? | Vista manual |

### 🛡️ SEGURIDAD + PLATAFORMA (2 pts)

| # | Qué revisar | Cómo | Herramienta |
|---|-------------|------|-------------|
| 17 | **Stack / plataforma** | ¿Wix, WordPress, custom? ¿Actualizado? | [BuiltWith](https://builtwith.com) |

---

## 📊 Scoring

**Fórmula:** `(puntos obtenidos / 34) × 100 = SCORE`

| SCORE | Categoría | Qué significa | Tu enfoque |
|-------|-----------|--------------|------------|
| **0 – 30** | 🔴 Riesgo urgente | Problemas críticos que pierden clientes hoy | Ofrecer diagnóstico completo + plan de rescate |
| **31 – 55** | 🟡 Funcional con gaps | Funciona pero deja conversiones en la mesa | Identificar quick wins + roadmap 3-6 meses |
| **56 – 75** | 🟢 Bueno con oportunidades | Base sólida, ready para crecer | Proponer mejoras de conversión y SEO |
| **76 – 100** | ⭐ Excelente | Ya está bien — necesitan mantenimiento/growth | Maintenance plan + estrategia de crecimiento |

---

## ✉️ Template de Email de Respuesta

**Asunto:** `Tu diagnóstico web está listo, [Nombre] — Score: [X]/100`

---

Hola [Nombre],

Soy Víctor de TechNova. Pasé los últimos 20 minutos analizando **[URL del sitio]** y quiero compartirte lo que encontré.

**Tu Score: [X]/100 — [Categoría]**

---

**Lo que está bien ✅**
- [Punto positivo 1]
- [Punto positivo 2]

**Lo que está frenando tu crecimiento ⚠️**

🔴 **Urgente:**
- [Hallazgo crítico 1 — impacto específico]
- [Hallazgo crítico 2]

🟡 **Importante:**
- [Hallazgo 3]
- [Hallazgo 4]

🔵 **Nice to have:**
- [Hallazgo 5]

---

**Mi recomendación concreta:**

[2-3 oraciones personalizadas sobre qué haría primero y por qué, en términos de negocio, no técnicos]

¿Tienes 20 minutos esta semana para platicarlo? Te explico exactamente qué haría y en cuánto tiempo lo resolvemos.

→ [Calendly o WhatsApp link]

Saludos,
**Víctor**
TechNova · +52 722 166 9672
[tech-nova.mx](https://tech-nova.mx)

---

> **Regla de oro:** Nunca mandes el email genérico. Si no puedes personalizarlo, mejor retrasa 1 día que mandar algo que no conecte.

---

## 📁 3 Ejemplos Reales (referencia)

### Ejemplo A — Startup en Wix · Score: 32/100 🔴

**Sitio:** `mifloreria.com.mx` — floristería online, venta por WhatsApp

**Hallazgos:**
- LCP: 6.2s (debería ser <2.5s) — pierden el 53% de visitantes mobile
- Sin sitemap ni meta descriptions — invisible en Google
- Imágenes de 4MB sin comprimir
- Sin analytics — no saben de dónde vienen sus clientes
- CTA único: número de WhatsApp sin botón visible

**Email enviado:**
> "Tu sitio carga en 6 segundos en celular — el 53% de tus visitantes se van antes de ver tus flores. Eso es ventas perdidas hoy, no mañana. El problema raíz son las imágenes sin optimizar y la falta de caché. Lo resolvemos en 1 semana y tu sitio carga en menos de 2s."

**Propuesta:** Paquete Start ($8,500 MXN) — migración a plataforma rápida + SEO básico

---

### Ejemplo B — Agencia pequeña de marketing · Score: 58/100 🟢

**Sitio:** `creativelab.mx` — agencia de redes sociales, 3 años operando

**Hallazgos:**
- Performance sólido (LCP 2.1s) ✅
- SSL activo, mobile responsive ✅
- Sin casos de éxito con métricas reales — testimoniales vagos
- Blog con 2 posts de 2022 — SEO dormido
- Formulario de contacto sin confirmación post-submit
- Sin pixel de Meta ni remarketing activo

**Email enviado:**
> "Tu sitio técnicamente está bien — lo que falta es que trabaje para ti cuando no estás presente. Tu blog parado desde 2022 y sin remarketing activo significa que estás dejando ir al 97% de los visitantes que llegan pero no convierten ese día. Con 3 posts estratégicos y remarketing activo, podrías duplicar tus leads en 60 días."

**Propuesta:** Paquete Growth ($18,500 MXN) — SEO content + setup marketing automation

---

### Ejemplo C — Empresa consolidada · Score: 81/100 ⭐

**Sitio:** `constructoraibarra.mx` — constructora con 15 años, proyectos residenciales

**Hallazgos:**
- Todo técnico excelente — equipo interno lo mantiene bien
- Portafolio de proyectos rico y actualizado ✅
- Oportunidad: sin chat en vivo ni cotizador online — todo por teléfono
- Sin seguimiento post-visita (no saben qué páginas ven sus prospectos)
- Podría escalar con contenido en YouTube + SEO local por colonias

**Email enviado:**
> "Tu sitio está en el top 20% de lo que veo — claramente tienen un equipo que lo cuida. La oportunidad que veo es capturar prospectos que llegan de noche o fines de semana cuando no hay quien conteste el teléfono. Un cotizador básico + chat podría agregar 3-5 leads calificados por semana sin costo de adquisición extra."

**Propuesta:** Paquete Scale ($32,000 MXN) — cotizador online + automatización de seguimiento

---

## ⚠️ Gotchas

- **Score < 30** → No proponer todo de golpe. Elegir el problema #1 que más duele en negocio y enfocarse ahí
- **Score > 80** → No inventar problemas. Ser honesto: "Están bien, la oportunidad es crecer, no arreglar"
- **Sin respuesta después de 5 días** → 1 follow-up corto: *"Hola [Nombre], quedé con ganas de platicar lo del diagnóstico — ¿tuviste oportunidad de revisarlo?"*
- **Cliente en Wix/Squarespace** → No recomendar migración de entrada, puede asustar. Primero optimizar dentro de la plataforma, luego si aplica hablar de migración
- **Sitio sin URL** → Ya Sofia les pide que respondan con la URL. Si no la mandan, esperar antes de pedir diagnóstico
