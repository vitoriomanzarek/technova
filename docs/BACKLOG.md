# Backlog del Proyecto - TechNova

Aquí se registran todas las tareas, ideas, bugs y mejoras futuras. Deben priorizarse antes de pasar a la Bitácora de trabajo.

## 🔴 Alta Prioridad (To-Do Inmediato)
- [ ] 👤 **[Usuario] Cuentas Financieras:** Crear cuentas en Neon (Base de datos) y Stripe (Pagos), y obtener las claves API para el entorno local (`.env`).
- [ ] 🧠 **[Arquitecto] Análisis de Precios:** Realizar un research del mercado y debatir la estrategia de precios de los paquetes antes de subirlos a la base de datos de producción.
- [ ] 🤖 **[Desarrollador] Migración a Next.js:** Migrar de Vite a Next.js (App Router). Preparar la estructura base de Neon (Drizzle ORM) e integración de Stripe (API Routes) usando datos de prueba temporales.
- [x] 🤖 **[Desarrollador] Copywriting del Hero:** Reescribir el título y subtítulo del `Home.tsx` para enfocarse en resultados de negocio y no en "soluciones integrales".
- [x] 🤖 **[Desarrollador] Ajuste de CTAs:** Cambiar "Solicita una consulta gratuita" por "Cotiza tu proyecto en 2 minutos" o similar, apuntando al Wizard.

## 🟡 Media Prioridad (Next Sprints)
- [ ] 🤖 **[Desarrollador] Migración de Datos (Seeding):** Mover toda la información hardcodeada de los paquetes a la base de datos final (una vez definidos los precios reales).
- [ ] 🤖 **[Desarrollador] Integración de Formularios a la DB:** Asegurar que el formulario de `Contacto` y el `Lead Magnet` guarden los prospectos directamente en la tabla `leads`.
- [ ] 👤 **[Usuario] Tracking Ads:** Solicitar al cliente e instalar los IDs de Google Tag Manager y Meta Pixel.
- [ ] 🤖 **[Desarrollador] Blog Setup:** Crear la estructura del blog (Fase A de la estrategia) aprovechando el Server-Side Rendering de Next.js para SEO.

## 🟢 Baja Prioridad (Nice to Have)
- [ ] 🤖 **[Desarrollador] Landing Pages Específicas:** Construir sobre el `AdLandingLayout` páginas sin menú enfocadas 100% en conversión para las campañas de Ads.
- [ ] 🤖 **[Desarrollador] Animaciones extra:** Mejorar las micro-interacciones en los botones y tarjetas de servicio.
