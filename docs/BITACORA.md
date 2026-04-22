# Bitácora de Trabajo - TechNova

Registro histórico de los cambios implementados y despliegues realizados.

## [2026-04-21] - Fase 4 (Migración a Next.js e Infraestructura Backend)
**Realizado por:** Agente Desarrollador

- **Next.js & App Router:**
  - Inicialización del proyecto `technova-next` basado en Next.js App Router y Tailwind CSS.
  - Migración completa de todas las rutas de `react-router-dom` a la estructura de directorios de Next.js (`app/page.tsx`, `app/nosotros/page.tsx`, etc.).
  - Inyección de la directiva `"use client"` en componentes interactivos y sustitución de dependencias de react-router a next/navigation.
  - Integración del `Navbar` y `Footer` en el `RootLayout` y unificación de estilos globales.
- **Base de Datos (Drizzle ORM):**
  - Instalación de `drizzle-orm` y creación del esquema base en `src/db/schema.ts` (tablas `services` y `leads`).
- **API Routes (Stripe & Leads):**
  - Creación del endpoint `app/api/leads/route.ts` estructurado para captar información del Lead Magnet y de Contacto.
  - Creación del endpoint `app/api/checkout/route.ts` con el boilerplate de Stripe listo para recibir las API keys de producción.

## [2026-04-21] - Fase 2 y 3 (Estructura y Conversión)
**Realizado por:** Agente Antigravity

- **Nuevas Páginas:**
  - Creación de `src/pages/Nosotros.tsx` (Misión, Visión, Valores).
  - Creación de `src/pages/Contacto.tsx` (Formulario simple directo).
  - Integración de rutas en `App.tsx` y actualización del `Navbar.tsx`.
- **Optimización de Conversión:**
  - Creación del componente `LeadMagnetSection.tsx` ("Auditoría Web Express") e integración en el Home.
  - Creación de `AdLandingLayout.tsx` (Layout minimalista preparado para tráfico de pago).
- **Documentación:**
  - Creación de la carpeta `docs/` con `BACKLOG.md`, `BITACORA.md` y `COPYWRITING_GUIDELINES.md`.

## [2026-04-21] - Fase 1 (SEO y Fundamentos)
**Realizado por:** Agente Secundario

- **SEO Técnico:**
  - Modificación de `index.html`. Cambio a `lang="es"`.
  - Inserción de `<title>` y `<meta name="description">` optimizados.
  - Inserción de etiquetas Open Graph.
  - Preparación de la estructura para Google Tag Manager y Meta Pixel (comentarios placeholder).
