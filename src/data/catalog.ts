/**
 * TECHNOVA — CATÁLOGO DE SERVICIOS v1.1
 * ======================================
 * Estructura modular en 4 capas:
 *   Componente → Módulo → Producto → Proyecto
 *
 * Cada capa referencia a la anterior por ID.
 * Los costos están en MXN (pesos mexicanos). Las horas son estimaciones base.
 * El PM (gestión de proyecto) se calcula como 20% del costo técnico total.
 *
 * Posicionamiento: Agencia boutique tier medio México.
 * Rango de tarifa efectiva: $350–$700 MXN/hora según categoría.
 * Referencia de mercado (2026):
 *   - Freelancer: $2,000–$15,000 MXN/proyecto
 *   - TechNova (mid boutique): $15,000–$85,000 MXN/proyecto
 *   - Agencia grande: $50,000–$150,000+ MXN/proyecto
 *
 * Categorías de componentes:
 *   VI  — Identidad Visual
 *   UX  — UX / UI Design
 *   DV  — Desarrollo Web (estructura y secciones)
 *   EC  — E-commerce
 *   SY  — Sistemas y Backend
 *   AN  — Analíticos
 *   SE  — SEO / Metadata
 *   MK  — Marketing
 *   IT  — Infraestructura
 *   PM  — Gestión de Proyecto
 */

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

export type ComponentCategory =
  | 'VI' | 'UX' | 'DV' | 'EC' | 'SY'
  | 'AN' | 'SE' | 'MK' | 'IT' | 'PM';

export type ResourceFrequency = 'one-time' | 'monthly' | 'annual' | 'per-transaction';

export interface CatalogComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  hours: number;
  cost: number; // USD
  dependencies?: string[]; // IDs de otros componentes requeridos
  process?: string; // Resumen del proceso de implementación
  tags?: string[];
}

export interface CatalogModule {
  id: string;
  name: string;
  description: string;
  components: string[]; // IDs de componentes
  discountPct?: number; // % de descuento por bundle (ej: 0.10 = 10%)
  tags?: string[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  modules: string[]; // IDs de módulos
  optionalModules?: string[]; // Módulos opcionales (add-ons)
  baseDeliveryDays: number;
  tags?: string[];
}

export interface CatalogResource {
  id: string;
  name: string;
  description: string;
  provider: string;
  cost: number; // USD
  frequency: ResourceFrequency;
  transactionPct?: number; // Para recursos tipo "por transacción"
  url?: string;
}

// ─────────────────────────────────────────────
// CAPA 1 — COMPONENTES (átomos)
// ─────────────────────────────────────────────

export const COMPONENTS: CatalogComponent[] = [

  // ── IDENTIDAD VISUAL ──────────────────────────
  {
    id: 'VI-01',
    name: 'Diseño de logotipo',
    category: 'VI',
    description: 'Creación de logotipo original con hasta 3 propuestas y 2 rondas de revisión.',
    hours: 10,
    cost: 3500,
    process: 'Brief → Investigación → 3 propuestas → Feedback → Refinamiento → Entrega en SVG/PNG/PDF',
    tags: ['logo', 'marca', 'identidad'],
  },
  {
    id: 'VI-02',
    name: 'Paleta de colores',
    category: 'VI',
    description: 'Definición de colores primarios, secundarios, neutros y estados (hover, error, éxito).',
    hours: 2,
    cost: 800,
    process: 'Análisis de competencia → selección de colores → tokens CSS/Tailwind → entrega en HEX/RGB/HSL',
    tags: ['colores', 'tokens', 'diseño'],
  },
  {
    id: 'VI-03',
    name: 'Sistema tipográfico',
    category: 'VI',
    description: 'Selección y configuración de fuentes para headings, body y código. Escala tipográfica completa.',
    hours: 2,
    cost: 800,
    process: 'Selección de Google Fonts o tipografías licenciadas → escala de tamaños → implementación en CSS/Tailwind',
    tags: ['tipografía', 'fuentes', 'diseño'],
  },
  {
    id: 'VI-04',
    name: 'Iconografía personalizada',
    category: 'VI',
    description: 'Set de hasta 20 íconos SVG personalizados coherentes con la identidad de marca.',
    hours: 8,
    cost: 2200,
    process: 'Brief de estilo → diseño en Figma → exportación SVG → integración como componentes React',
    tags: ['íconos', 'SVG', 'diseño'],
  },
  {
    id: 'VI-05',
    name: 'UI Kit (componentes de diseño)',
    category: 'VI',
    description: 'Biblioteca de componentes visuales: botones, inputs, cards, badges, modals, tooltips, etc.',
    hours: 12,
    cost: 3200,
    dependencies: ['VI-02', 'VI-03'],
    process: 'Diseño en Figma → tokens de diseño → componentes React/Tailwind → documentación',
    tags: ['UI', 'componentes', 'design system'],
  },
  {
    id: 'VI-06',
    name: 'Manual de marca (Brand Guidelines)',
    category: 'VI',
    description: 'Documento PDF con reglas de uso de logo, colores, tipografía, fotografía y tono de voz.',
    hours: 6,
    cost: 1800,
    dependencies: ['VI-01', 'VI-02', 'VI-03'],
    process: 'Compilación de elementos → redacción de reglas → diseño del documento → entrega en PDF',
    tags: ['branding', 'manual', 'guía'],
  },
  {
    id: 'VI-07',
    name: 'Favicon e iconos de app',
    category: 'VI',
    description: 'Favicon .ico + íconos para iOS/Android/PWA en todos los tamaños requeridos.',
    hours: 1,
    cost: 400,
    dependencies: ['VI-01'],
    process: 'Adaptación del logo → generación de tamaños → implementación en Next.js metadata',
    tags: ['favicon', 'PWA', 'íconos'],
  },
  {
    id: 'VI-08',
    name: 'Plantillas de redes sociales',
    category: 'VI',
    description: 'Pack de 5 plantillas editables (Canva/Figma) para Instagram, Facebook y LinkedIn.',
    hours: 5,
    cost: 1500,
    dependencies: ['VI-01', 'VI-02'],
    process: 'Diseño de templates → exportación en Canva/Figma → entrega con instrucciones de uso',
    tags: ['redes sociales', 'templates', 'marketing'],
  },

  // ── UX / UI DESIGN ────────────────────────────
  {
    id: 'UX-01',
    name: 'Wireframes (bocetos de baja fidelidad)',
    category: 'UX',
    description: 'Esquemas de cada pantalla/sección mostrando estructura y flujo sin diseño visual.',
    hours: 4,
    cost: 1200,
    process: 'Reunión de requerimientos → wireframes en Figma → revisión → aprobación antes de diseño',
    tags: ['wireframes', 'UX', 'planeación'],
  },
  {
    id: 'UX-02',
    name: 'Mockups de alta fidelidad',
    category: 'UX',
    description: 'Diseño visual completo de cada pantalla, listo para desarrollo.',
    hours: 10,
    cost: 3000,
    dependencies: ['UX-01', 'VI-02', 'VI-03'],
    process: 'Wireframes aprobados → diseño en Figma → revisión → exportación de assets',
    tags: ['mockups', 'diseño', 'Figma'],
  },
  {
    id: 'UX-03',
    name: 'Prototipo interactivo',
    category: 'UX',
    description: 'Prototipo clickeable en Figma que simula la experiencia real del usuario.',
    hours: 4,
    cost: 1200,
    dependencies: ['UX-02'],
    process: 'Conexión de pantallas en Figma → interacciones y transiciones → link compartible para review',
    tags: ['prototipo', 'interactivo', 'UX'],
  },
  {
    id: 'UX-04',
    name: 'Adaptación responsive (mobile)',
    category: 'UX',
    description: 'Diseño adaptado para móvil y tablet de todas las pantallas del proyecto.',
    hours: 5,
    cost: 1500,
    dependencies: ['UX-02'],
    process: 'Adaptación de cada pantalla a breakpoints móvil/tablet → revisión en dispositivos reales',
    tags: ['responsive', 'mobile', 'UX'],
  },

  // ── DESARROLLO WEB — SECCIONES ────────────────
  {
    id: 'DV-01',
    name: 'Navbar / Header',
    category: 'DV',
    description: 'Barra de navegación responsive con logo, links, CTA y menú hamburguesa en móvil.',
    hours: 4,
    cost: 1200,
    process: 'Componente React → links de Next.js → estado móvil → scroll behavior → animaciones',
    tags: ['navbar', 'header', 'navegación'],
  },
  {
    id: 'DV-02',
    name: 'Footer',
    category: 'DV',
    description: 'Pie de página con links, redes sociales, información de contacto y copyright.',
    hours: 3,
    cost: 800,
    process: 'Componente React → links → íconos de redes → responsive → datos dinámicos opcionales',
    tags: ['footer', 'pie de página'],
  },
  {
    id: 'DV-03',
    name: 'Hero / Banner principal',
    category: 'DV',
    description: 'Sección principal con headline, subtítulo, CTA y elemento visual (imagen/video/animación).',
    hours: 5,
    cost: 1500,
    process: 'Diseño → animaciones con Framer Motion → CTA → fondo (gradiente/imagen/video) → responsive',
    tags: ['hero', 'banner', 'landing'],
  },
  {
    id: 'DV-04',
    name: 'Sección de servicios / features',
    category: 'DV',
    description: 'Grid de cards presentando servicios o características con ícono, título y descripción.',
    hours: 4,
    cost: 1200,
    process: 'Array de datos → cards responsive → íconos → animaciones on-scroll → hover effects',
    tags: ['servicios', 'features', 'cards'],
  },
  {
    id: 'DV-05',
    name: 'Sección de testimonios',
    category: 'DV',
    description: 'Carrusel o grid de reseñas de clientes con foto, nombre, cargo y texto.',
    hours: 4,
    cost: 1200,
    process: 'Componente de testimonial → carrusel automático o manual → avatar → estrellas → responsive',
    tags: ['testimonios', 'reseñas', 'social proof'],
  },
  {
    id: 'DV-06',
    name: 'Sección de precios',
    category: 'DV',
    description: 'Cards de planes con features, precios y CTA. Soporte para toggle mensual/anual.',
    hours: 5,
    cost: 1500,
    process: 'Cards de planes → toggle → destacar plan popular → CTA → animaciones → responsive',
    tags: ['precios', 'planes', 'pricing'],
  },
  {
    id: 'DV-07',
    name: 'Sección FAQ',
    category: 'DV',
    description: 'Preguntas frecuentes en formato acordeón animado.',
    hours: 3,
    cost: 800,
    process: 'Array de Q&A → acordeón con AnimatePresence → accesibilidad → responsive',
    tags: ['FAQ', 'acordeón', 'contenido'],
  },
  {
    id: 'DV-08',
    name: 'Formulario de contacto',
    category: 'DV',
    description: 'Formulario con validación, estados de carga/éxito/error y guardado en base de datos.',
    hours: 5,
    cost: 1500,
    dependencies: ['SY-04'],
    process: 'Campos → validación → POST a API route → insert en DB → estados de UI → notificación opcional',
    tags: ['formulario', 'contacto', 'leads'],
  },
  {
    id: 'DV-09',
    name: 'Mapa de ubicación',
    category: 'DV',
    description: 'Google Maps embebido con marcador personalizado y datos de contacto.',
    hours: 2,
    cost: 600,
    process: 'Google Maps API → componente → marcador → estilos dark/light → responsive',
    tags: ['mapa', 'ubicación', 'Google Maps'],
  },
  {
    id: 'DV-10',
    name: 'Blog (listado + detalle)',
    category: 'DV',
    description: 'Sección de blog con listado de artículos, página de detalle, categorías y búsqueda.',
    hours: 10,
    cost: 3000,
    dependencies: ['SY-02'],
    process: 'CMS o MDX → páginas dinámicas → SSG → categorías → búsqueda → SEO por artículo → paginación',
    tags: ['blog', 'contenido', 'SEO'],
  },
  {
    id: 'DV-11',
    name: 'Página "Nosotros"',
    category: 'DV',
    description: 'Página de equipo con historia, misión/visión, valores y perfiles del equipo.',
    hours: 5,
    cost: 1500,
    process: 'Secciones estáticas → grid de equipo → timeline de historia → responsive → animaciones',
    tags: ['nosotros', 'equipo', 'empresa'],
  },
  {
    id: 'DV-12',
    name: 'Galería / Portafolio',
    category: 'DV',
    description: 'Galería de proyectos o productos con filtros por categoría y lightbox.',
    hours: 6,
    cost: 1800,
    process: 'Grid de items → filtros → lightbox → lazy loading de imágenes → responsive',
    tags: ['galería', 'portafolio', 'imágenes'],
  },
  {
    id: 'DV-13',
    name: 'Animaciones y microinteracciones',
    category: 'DV',
    description: 'Capa de animaciones con Framer Motion: entradas, hovers, transiciones de página.',
    hours: 6,
    cost: 1800,
    process: 'Framer Motion → variants → scroll triggers → page transitions → reducción de movimiento (a11y)',
    tags: ['animaciones', 'Framer Motion', 'UX'],
  },
  {
    id: 'DV-14',
    name: 'Página 404 personalizada',
    category: 'DV',
    description: 'Página de error 404 con diseño coherente y llamada a la acción para no perder al usuario.',
    hours: 2,
    cost: 600,
    process: 'not-found.tsx en Next.js App Router → diseño → CTA de regreso → animación opcional',
    tags: ['404', 'error', 'UX'],
  },
  {
    id: 'DV-15',
    name: 'Wizard / Calculadora interactiva',
    category: 'DV',
    description: 'Flujo paso a paso tipo wizard para cotización, onboarding o configuración de producto.',
    hours: 14,
    cost: 4200,
    dependencies: ['SY-04', 'DV-08'],
    process: 'Estado multi-paso → lógica de cálculo → progress indicator → validación por paso → submit a DB',
    tags: ['wizard', 'calculadora', 'cotización'],
  },

  // ── E-COMMERCE ────────────────────────────────
  {
    id: 'EC-01',
    name: 'Catálogo de productos',
    category: 'EC',
    description: 'Listado de productos con filtros, búsqueda, paginación y ordenamiento.',
    hours: 8,
    cost: 2500,
    dependencies: ['SY-04'],
    process: 'Fetch de productos desde DB → grid responsive → filtros por categoría → búsqueda → paginación',
    tags: ['catálogo', 'productos', 'tienda'],
  },
  {
    id: 'EC-02',
    name: 'Ficha de producto',
    category: 'EC',
    description: 'Página de detalle con galería de imágenes, descripción, variantes, precio y CTA.',
    hours: 6,
    cost: 1800,
    dependencies: ['EC-01'],
    process: 'Ruta dinámica → galería → variantes → selector de cantidad → add to cart → reviews',
    tags: ['producto', 'detalle', 'tienda'],
  },
  {
    id: 'EC-03',
    name: 'Carrito de compras',
    category: 'EC',
    description: 'Sidebar o página de carrito con lista de items, cantidades y total.',
    hours: 8,
    cost: 2500,
    process: 'Context/Zustand → persistencia en localStorage → líneas de carrito → cálculo de total',
    tags: ['carrito', 'cart', 'e-commerce'],
  },
  {
    id: 'EC-04',
    name: 'Checkout y flujo de pago',
    category: 'EC',
    description: 'Proceso de pago multi-paso: dirección, envío, pago y confirmación.',
    hours: 12,
    cost: 4000,
    dependencies: ['EC-03', 'EC-05', 'SY-01'],
    process: 'Pasos: datos → envío → pago → confirmación → email de confirmación → orden en DB',
    tags: ['checkout', 'pago', 'e-commerce'],
  },
  {
    id: 'EC-05',
    name: 'Integración Stripe',
    category: 'EC',
    description: 'Pasarela de pago con Stripe: tarjetas, webhooks y gestión de órdenes.',
    hours: 6,
    cost: 1800,
    process: 'Stripe Elements → Payment Intent API → webhooks para confirmar pago → manejo de errores',
    tags: ['Stripe', 'pagos', 'e-commerce'],
  },
  {
    id: 'EC-06',
    name: 'Gestión de usuarios (registro/login)',
    category: 'EC',
    description: 'Sistema de autenticación con registro, login, perfil y recuperación de contraseña.',
    hours: 10,
    cost: 3000,
    dependencies: ['SY-01', 'SY-04'],
    process: 'NextAuth o Clerk → registro → login → JWT/sessions → perfil → recuperación por email',
    tags: ['usuarios', 'autenticación', 'login'],
  },
  {
    id: 'EC-07',
    name: 'Panel admin de productos',
    category: 'EC',
    description: 'CRUD de productos: crear, editar, eliminar, subir imágenes y gestionar stock.',
    hours: 14,
    cost: 4500,
    dependencies: ['SY-01', 'SY-04', 'SY-05'],
    process: 'Rutas protegidas → tabla de productos → formulario CRUD → upload de imágenes → validación',
    tags: ['admin', 'productos', 'CRUD'],
  },
  {
    id: 'EC-08',
    name: 'Gestión de órdenes',
    category: 'EC',
    description: 'Panel para ver y actualizar el estado de las órdenes de clientes.',
    hours: 8,
    cost: 2500,
    dependencies: ['EC-07'],
    process: 'Tabla de órdenes → filtros → detalle → cambio de estado → notificación al cliente',
    tags: ['órdenes', 'pedidos', 'admin'],
  },
  {
    id: 'EC-09',
    name: 'Sistema de cupones y descuentos',
    category: 'EC',
    description: 'Cupones de descuento por porcentaje o monto fijo con fecha de expiración.',
    hours: 5,
    cost: 1500,
    dependencies: ['EC-03', 'EC-07'],
    process: 'Tabla de cupones → validación en checkout → descuento aplicado → límites de uso',
    tags: ['cupones', 'descuentos', 'promociones'],
  },

  // ── SISTEMAS Y BACKEND ────────────────────────
  {
    id: 'SY-01',
    name: 'Sistema de autenticación',
    category: 'SY',
    description: 'Autenticación segura con JWT, sesiones y protección de rutas.',
    hours: 8,
    cost: 2500,
    dependencies: ['SY-04'],
    process: 'NextAuth.js o Clerk → providers → callbacks → middleware de protección → refresh tokens',
    tags: ['auth', 'seguridad', 'sesiones'],
  },
  {
    id: 'SY-02',
    name: 'CMS (gestor de contenido)',
    category: 'SY',
    description: 'Sistema para que el cliente edite textos, imágenes y páginas sin tocar código.',
    hours: 10,
    cost: 3000,
    process: 'Sanity / Contentful / Payload → schema → panel de edición → preview → deploy on save',
    tags: ['CMS', 'contenido', 'edición'],
  },
  {
    id: 'SY-03',
    name: 'API REST personalizada',
    category: 'SY',
    description: 'Endpoints de API para integraciones con terceros o apps móviles.',
    hours: 10,
    cost: 3000,
    dependencies: ['SY-04'],
    process: 'Next.js API Routes → validación Zod → autenticación → documentación → rate limiting',
    tags: ['API', 'backend', 'integración'],
  },
  {
    id: 'SY-04',
    name: 'Base de datos (Neon PostgreSQL)',
    category: 'SY',
    description: 'Configuración de DB serverless con Drizzle ORM, schema y migraciones.',
    hours: 4,
    cost: 1200,
    process: 'Neon DB → Drizzle ORM → schema.ts → migraciones → seed data → índices',
    tags: ['base de datos', 'PostgreSQL', 'Neon', 'Drizzle'],
  },
  {
    id: 'SY-05',
    name: 'Panel de administración',
    category: 'SY',
    description: 'Dashboard administrativo con métricas, gestión de usuarios y configuración del sitio.',
    hours: 16,
    cost: 5000,
    dependencies: ['SY-01', 'SY-04'],
    process: 'Rutas /admin → dashboard con métricas → tablas CRUD → gráficas con Recharts → responsive',
    tags: ['admin', 'dashboard', 'gestión'],
  },
  {
    id: 'SY-06',
    name: 'Sistema de emails transaccionales',
    category: 'SY',
    description: 'Envío de emails automáticos: bienvenida, confirmación, recuperación, notificaciones.',
    hours: 5,
    cost: 1500,
    process: 'Resend o SendGrid → React Email templates → triggers por eventos → logs de envío',
    tags: ['email', 'notificaciones', 'transaccional'],
  },
  {
    id: 'SY-07',
    name: 'Chatbot / Asistente IA',
    category: 'SY',
    description: 'Chat integrado con IA (OpenAI) para atención al cliente o asistencia de ventas.',
    hours: 10,
    cost: 3000,
    process: 'OpenAI API → contexto del negocio → widget flotante → historial de conversación → fallback humano',
    tags: ['chatbot', 'IA', 'OpenAI', 'atención'],
  },
  {
    id: 'SY-08',
    name: 'Multilenguaje (i18n)',
    category: 'SY',
    description: 'Soporte para múltiples idiomas (ES/EN al menos) con detección automática.',
    hours: 8,
    cost: 2500,
    process: 'next-intl → archivos de traducción → rutas localizadas → selector de idioma → SEO por idioma',
    tags: ['i18n', 'multilenguaje', 'internacionalización'],
  },
  {
    id: 'SY-09',
    name: 'Búsqueda interna',
    category: 'SY',
    description: 'Motor de búsqueda para contenido del sitio (productos, artículos, páginas).',
    hours: 6,
    cost: 1800,
    process: 'Algolia o búsqueda en DB → índice → componente de búsqueda → resultados en tiempo real',
    tags: ['búsqueda', 'search', 'Algolia'],
  },
  {
    id: 'SY-10',
    name: 'Sistema de reservas / citas',
    category: 'SY',
    description: 'Calendario de disponibilidad y booking con confirmación por email.',
    hours: 12,
    cost: 4000,
    dependencies: ['SY-04', 'SY-06'],
    process: 'Cal.com API o custom → calendario → slots disponibles → reserva → confirmación → recordatorio',
    tags: ['reservas', 'citas', 'calendario'],
  },

  // ── ANALÍTICOS ────────────────────────────────
  {
    id: 'AN-01',
    name: 'Google Analytics 4 (GA4)',
    category: 'AN',
    description: 'Instalación y configuración de GA4 con eventos personalizados.',
    hours: 2,
    cost: 600,
    process: 'Script en layout → configuración de propiedad → eventos personalizados → verificación',
    tags: ['analytics', 'GA4', 'métricas'],
  },
  {
    id: 'AN-02',
    name: 'Google Tag Manager (GTM)',
    category: 'AN',
    description: 'Instalación de GTM como contenedor central para todos los tags y pixels.',
    hours: 2,
    cost: 600,
    process: 'Contenedor GTM → script en head/body → verificación → configuración de triggers base',
    tags: ['GTM', 'tag manager', 'tracking'],
  },
  {
    id: 'AN-03',
    name: 'Meta Pixel',
    category: 'AN',
    description: 'Pixel de Facebook/Instagram para tracking de conversiones y audiencias.',
    hours: 2,
    cost: 600,
    process: 'Pixel ID → script en layout → eventos estándar (PageView, Lead, Purchase) → verificación',
    tags: ['Meta', 'Pixel', 'Facebook', 'Instagram'],
  },
  {
    id: 'AN-04',
    name: 'Heatmaps (Hotjar / Microsoft Clarity)',
    category: 'AN',
    description: 'Grabación de sesiones y mapas de calor para analizar comportamiento del usuario.',
    hours: 1,
    cost: 400,
    process: 'Script de Hotjar o Clarity → verificación → configuración de grabaciones → filtros de privacidad',
    tags: ['heatmaps', 'UX', 'Hotjar', 'Clarity'],
  },

  // ── SEO / METADATA ────────────────────────────
  {
    id: 'SE-01',
    name: 'Metadata básica (OG, Twitter Cards)',
    category: 'SE',
    description: 'Título, descripción, Open Graph y Twitter Cards para cada página.',
    hours: 2,
    cost: 600,
    process: 'generateMetadata() en cada page → OG tags → verificación con og:debugger',
    tags: ['SEO', 'metadata', 'Open Graph'],
  },
  {
    id: 'SE-02',
    name: 'Sitemap.xml dinámico',
    category: 'SE',
    description: 'Sitemap automático con todas las rutas del sitio para indexación en Google.',
    hours: 2,
    cost: 600,
    process: 'sitemap.ts en Next.js → rutas estáticas + dinámicas → submit en Google Search Console',
    tags: ['sitemap', 'SEO', 'indexación'],
  },
  {
    id: 'SE-03',
    name: 'Robots.txt',
    category: 'SE',
    description: 'Archivo robots.txt para controlar qué páginas indexan los buscadores.',
    hours: 1,
    cost: 300,
    process: 'robots.ts en Next.js → reglas por user-agent → referencia al sitemap',
    tags: ['robots', 'SEO', 'crawlers'],
  },
  {
    id: 'SE-04',
    name: 'Schema markup (datos estructurados)',
    category: 'SE',
    description: 'JSON-LD para organización, productos, artículos y FAQs. Mejora los rich snippets en Google.',
    hours: 3,
    cost: 1000,
    process: 'JSON-LD por tipo de página → validación con Rich Results Test → implementación en head',
    tags: ['schema', 'SEO', 'rich snippets', 'JSON-LD'],
  },
  {
    id: 'SE-05',
    name: 'Optimización de velocidad (Core Web Vitals)',
    category: 'SE',
    description: 'Optimización de LCP, CLS y FID: imágenes, fuentes, código y caché.',
    hours: 6,
    cost: 1800,
    process: 'Lighthouse audit → next/image → font display swap → code splitting → caché headers → verificación',
    tags: ['performance', 'Core Web Vitals', 'velocidad'],
  },
  {
    id: 'SE-06',
    name: 'Google Search Console',
    category: 'SE',
    description: 'Alta y verificación del dominio en Search Console + submit de sitemap.',
    hours: 1,
    cost: 300,
    process: 'Verificación por meta tag o DNS → submit sitemap → monitoreo de indexación',
    tags: ['Search Console', 'Google', 'indexación'],
  },

  // ── MARKETING ─────────────────────────────────
  {
    id: 'MK-01',
    name: 'Campaña Google Ads (Search)',
    category: 'MK',
    description: 'Configuración completa de campaña de búsqueda: palabras clave, anuncios y conversiones.',
    hours: 5,
    cost: 2000,
    process: 'Cuenta → campaña → grupos de anuncios → keywords → anuncios → extensiones → conversiones',
    tags: ['Google Ads', 'SEM', 'búsqueda pagada'],
  },
  {
    id: 'MK-02',
    name: 'Campaña Meta Ads (Facebook/Instagram)',
    category: 'MK',
    description: 'Configuración de campaña en Meta: audiencias, creativos y objetivos.',
    hours: 5,
    cost: 2000,
    process: 'Business Manager → campaña → conjuntos de anuncios → audiencias → creativos → pixel',
    tags: ['Meta Ads', 'Facebook', 'Instagram', 'social ads'],
  },
  {
    id: 'MK-03',
    name: 'Email marketing (secuencia de bienvenida)',
    category: 'MK',
    description: 'Secuencia de 3-5 emails automatizados para nuevos leads o suscriptores.',
    hours: 6,
    cost: 2000,
    dependencies: ['SY-06'],
    process: 'Plataforma (Mailchimp/Resend) → templates → secuencia → triggers → pruebas A/B',
    tags: ['email marketing', 'automatización', 'nurturing'],
  },
  {
    id: 'MK-04',
    name: 'Landing page de campaña',
    category: 'MK',
    description: 'Página dedicada para una campaña específica, optimizada para conversión.',
    hours: 8,
    cost: 2500,
    dependencies: ['DV-03', 'DV-08'],
    process: 'Propuesta de valor → hero → beneficios → testimonios → formulario → A/B testing',
    tags: ['landing', 'campaña', 'conversión'],
  },

  // ── INFRAESTRUCTURA ───────────────────────────
  {
    id: 'IT-01',
    name: 'Configuración de dominio',
    category: 'IT',
    description: 'Compra (si aplica) y configuración de dominio: DNS, registros A, CNAME, MX.',
    hours: 1,
    cost: 400,
    process: 'Compra en GoDaddy/Namecheap → transfer a Cloudflare → DNS records → SSL → verificación',
    tags: ['dominio', 'DNS', 'infraestructura'],
  },
  {
    id: 'IT-02',
    name: 'Deploy en Vercel',
    category: 'IT',
    description: 'Configuración de proyecto en Vercel con variables de entorno y dominio personalizado.',
    hours: 1,
    cost: 400,
    process: 'Repo en GitHub → proyecto en Vercel → env vars → dominio custom → preview deployments',
    tags: ['Vercel', 'deploy', 'hosting'],
  },
  {
    id: 'IT-03',
    name: 'Cloudflare CDN + SSL',
    category: 'IT',
    description: 'Configuración de Cloudflare como proxy: CDN, SSL gratuito y protección básica.',
    hours: 1,
    cost: 400,
    process: 'Nameservers → zona en Cloudflare → registros DNS → modo proxy → SSL Full Strict',
    tags: ['Cloudflare', 'CDN', 'SSL', 'seguridad'],
  },
  {
    id: 'IT-04',
    name: 'Base de datos Neon (setup)',
    category: 'IT',
    description: 'Creación y configuración de base de datos serverless en Neon con connection strings.',
    hours: 1,
    cost: 400,
    process: 'Proyecto en Neon → pooled + unpooled URLs → env vars en Vercel → test de conexión',
    tags: ['Neon', 'PostgreSQL', 'infraestructura'],
  },
  {
    id: 'IT-05',
    name: 'Email corporativo (Google Workspace)',
    category: 'IT',
    description: 'Configuración de email con dominio propio: registros MX, SPF, DKIM, DMARC.',
    hours: 2,
    cost: 600,
    process: 'Google Workspace o Zoho → registros DNS → verificación → cuentas → firma de correo',
    tags: ['email', 'corporativo', 'Google Workspace'],
  },

  // ── GESTIÓN DE PROYECTO ───────────────────────
  {
    id: 'PM-01',
    name: 'Project management',
    category: 'PM',
    description: 'Coordinación del proyecto: kickoff, seguimiento, comunicación y entrega. Se calcula como 20% del costo técnico.',
    hours: 0, // Se calcula dinámicamente
    cost: 0,  // Se calcula dinámicamente
    process: 'Kickoff → board de tareas (Linear/Notion) → reuniones semanales → control de cambios → entrega',
    tags: ['PM', 'gestión', 'coordinación'],
  },
  {
    id: 'PM-02',
    name: 'Documentación técnica',
    category: 'PM',
    description: 'Documento de arquitectura, variables de entorno, comandos y guía de mantenimiento.',
    hours: 3,
    cost: 1000,
    process: 'README.md → arquitectura → env vars → comandos → guía de deploy → troubleshooting',
    tags: ['documentación', 'entrega', 'mantenimiento'],
  },
  {
    id: 'PM-03',
    name: 'Capacitación al cliente',
    category: 'PM',
    description: 'Sesión de 1 hora para enseñar al cliente a usar el CMS, panel admin o herramientas.',
    hours: 2,
    cost: 700,
    process: 'Grabación en Loom o sesión en vivo → walkthrough → preguntas → accesos entregados',
    tags: ['capacitación', 'entrega', 'cliente'],
  },
  {
    id: 'PM-04',
    name: 'Soporte post-lanzamiento (30 días)',
    category: 'PM',
    description: '30 días de soporte por bugs y ajustes menores después del lanzamiento.',
    hours: 5,
    cost: 1800,
    process: 'Canal de comunicación → SLA 24h → fixes → ajustes ≤ 2h → reporte de cierre',
    tags: ['soporte', 'mantenimiento', 'post-lanzamiento'],
  },
];

// ─────────────────────────────────────────────
// CAPA 2 — MÓDULOS (moléculas)
// ─────────────────────────────────────────────

export const MODULES: CatalogModule[] = [
  {
    id: 'MOD-01',
    name: 'Identidad Visual Básica',
    description: 'Logo + paleta + tipografía. Todo lo mínimo para tener una identidad.',
    components: ['VI-01', 'VI-02', 'VI-03', 'VI-07'],
    discountPct: 0.10,
    tags: ['identidad', 'branding', 'básico'],
  },
  {
    id: 'MOD-02',
    name: 'Identidad Visual Completa',
    description: 'Sistema de marca completo con manual, iconografía y templates sociales.',
    components: ['VI-01', 'VI-02', 'VI-03', 'VI-04', 'VI-05', 'VI-06', 'VI-07', 'VI-08'],
    discountPct: 0.15,
    tags: ['identidad', 'branding', 'completo'],
  },
  {
    id: 'MOD-03',
    name: 'Estructura base de sitio',
    description: 'Navbar + Footer + Hero + 404. Lo mínimo para cualquier sitio.',
    components: ['DV-01', 'DV-02', 'DV-03', 'DV-14'],
    discountPct: 0.10,
    tags: ['estructura', 'base', 'desarrollo'],
  },
  {
    id: 'MOD-04',
    name: 'Landing page completa',
    description: 'Todas las secciones típicas de una landing de alto impacto.',
    components: ['DV-01', 'DV-02', 'DV-03', 'DV-04', 'DV-05', 'DV-06', 'DV-07', 'DV-08', 'DV-13'],
    discountPct: 0.12,
    tags: ['landing', 'conversión', 'completo'],
  },
  {
    id: 'MOD-05',
    name: 'Tracking completo',
    description: 'GTM + GA4 + Meta Pixel + Heatmaps. Visibilidad total del usuario.',
    components: ['AN-01', 'AN-02', 'AN-03', 'AN-04'],
    discountPct: 0.10,
    tags: ['analytics', 'tracking', 'métricas'],
  },
  {
    id: 'MOD-06',
    name: 'SEO técnico base',
    description: 'Metadata + Sitemap + Robots + Search Console. Fundamentos para indexarse.',
    components: ['SE-01', 'SE-02', 'SE-03', 'SE-06'],
    discountPct: 0.10,
    tags: ['SEO', 'indexación', 'técnico'],
  },
  {
    id: 'MOD-07',
    name: 'SEO completo',
    description: 'Todo el SEO técnico más schema markup, Core Web Vitals y blog.',
    components: ['SE-01', 'SE-02', 'SE-03', 'SE-04', 'SE-05', 'SE-06', 'DV-10'],
    discountPct: 0.15,
    tags: ['SEO', 'completo', 'posicionamiento'],
  },
  {
    id: 'MOD-08',
    name: 'Infraestructura base',
    description: 'Dominio + Vercel + Cloudflare + Neon DB. Stack completo listo para producción.',
    components: ['IT-01', 'IT-02', 'IT-03', 'IT-04'],
    discountPct: 0.10,
    tags: ['infraestructura', 'hosting', 'deploy'],
  },
  {
    id: 'MOD-09',
    name: 'E-commerce core',
    description: 'Catálogo + ficha + carrito + checkout + Stripe. Tienda funcional completa.',
    components: ['EC-01', 'EC-02', 'EC-03', 'EC-04', 'EC-05'],
    discountPct: 0.12,
    tags: ['e-commerce', 'tienda', 'pagos'],
  },
  {
    id: 'MOD-10',
    name: 'E-commerce con gestión',
    description: 'E-commerce core + usuarios + panel admin + órdenes.',
    components: ['EC-01', 'EC-02', 'EC-03', 'EC-04', 'EC-05', 'EC-06', 'EC-07', 'EC-08'],
    discountPct: 0.15,
    tags: ['e-commerce', 'admin', 'completo'],
  },
  {
    id: 'MOD-11',
    name: 'Entrega y soporte',
    description: 'Documentación + capacitación + 30 días de soporte post-lanzamiento.',
    components: ['PM-02', 'PM-03', 'PM-04'],
    discountPct: 0.0,
    tags: ['entrega', 'soporte', 'PM'],
  },
  {
    id: 'MOD-12',
    name: 'Marketing digital inicial',
    description: 'Google Ads + Meta Ads configurados y listos para correr.',
    components: ['MK-01', 'MK-02'],
    discountPct: 0.10,
    tags: ['marketing', 'ads', 'SEM'],
  },
];

// ─────────────────────────────────────────────
// CAPA 3 — PRODUCTOS (entregables al cliente)
// ─────────────────────────────────────────────

export const PRODUCTS: CatalogProduct[] = [
  {
    id: 'PRD-01',
    name: 'Landing Page',
    description: 'Página de aterrizaje de alto impacto. Ideal para validar una idea o capturar leads de una campaña.',
    modules: ['MOD-01', 'MOD-03', 'MOD-04', 'MOD-05', 'MOD-06', 'MOD-08', 'MOD-11'],
    optionalModules: ['MOD-02', 'MOD-07', 'MOD-12'],
    baseDeliveryDays: 7,
    tags: ['landing', 'MVP', 'leads'],
  },
  {
    id: 'PRD-02',
    name: 'Sitio Corporativo',
    description: 'Sitio multi-página con home, servicios, nosotros, blog y contacto.',
    modules: ['MOD-02', 'MOD-04', 'MOD-05', 'MOD-07', 'MOD-08', 'MOD-11'],
    optionalModules: ['MOD-12', 'SY-07', 'SY-08'],
    baseDeliveryDays: 21,
    tags: ['corporativo', 'empresa', 'multi-página'],
  },
  {
    id: 'PRD-03',
    name: 'E-commerce',
    description: 'Tienda online completa con catálogo, carrito, pagos y panel de administración.',
    modules: ['MOD-02', 'MOD-03', 'MOD-05', 'MOD-06', 'MOD-08', 'MOD-09', 'MOD-10', 'MOD-11'],
    optionalModules: ['MOD-07', 'MOD-12', 'EC-09', 'SY-07'],
    baseDeliveryDays: 42,
    tags: ['e-commerce', 'tienda', 'pagos'],
  },
  {
    id: 'PRD-04',
    name: 'Identidad Visual',
    description: 'Proyecto exclusivo de branding: logo, sistema de marca y manual.',
    modules: ['MOD-02'],
    optionalModules: ['MOD-01'],
    baseDeliveryDays: 10,
    tags: ['branding', 'logo', 'identidad'],
  },
  {
    id: 'PRD-05',
    name: 'Web App / SaaS',
    description: 'Aplicación web con autenticación, base de datos, panel de usuario y API.',
    modules: ['MOD-02', 'MOD-03', 'MOD-05', 'MOD-06', 'MOD-08', 'MOD-11'],
    optionalModules: ['SY-07', 'SY-08', 'SY-09', 'SY-10', 'MOD-12'],
    baseDeliveryDays: 56,
    tags: ['web app', 'SaaS', 'sistema'],
  },
];

// ─────────────────────────────────────────────
// CAPA 4 — RECURSOS (costos operativos)
// ─────────────────────────────────────────────

export const RESOURCES: CatalogResource[] = [
  {
    id: 'REC-01',
    name: 'Dominio .mx',
    description: 'Registro o renovación anual de dominio .mx en GoDaddy.',
    provider: 'GoDaddy',
    cost: 600,        // MXN/año (~$599 en GoDaddy MX)
    frequency: 'annual',
    url: 'https://godaddy.com',
  },
  {
    id: 'REC-02',
    name: 'Dominio .com',
    description: 'Registro o renovación anual de dominio .com.',
    provider: 'GoDaddy / Namecheap',
    cost: 280,        // MXN/año (~$17 USD × 16.5)
    frequency: 'annual',
    url: 'https://godaddy.com',
  },
  {
    id: 'REC-03',
    name: 'Vercel (Hobby)',
    description: 'Plan gratuito de Vercel para sitios de bajo tráfico.',
    provider: 'Vercel',
    cost: 0,
    frequency: 'monthly',
    url: 'https://vercel.com',
  },
  {
    id: 'REC-04',
    name: 'Vercel (Pro)',
    description: 'Plan Pro de Vercel con más ancho de banda, funciones y soporte.',
    provider: 'Vercel',
    cost: 330,        // MXN/mes (~$20 USD × 16.5)
    frequency: 'monthly',
    url: 'https://vercel.com',
  },
  {
    id: 'REC-05',
    name: 'Neon DB (Free)',
    description: 'Base de datos PostgreSQL serverless en plan gratuito.',
    provider: 'Neon',
    cost: 0,
    frequency: 'monthly',
    url: 'https://neon.tech',
  },
  {
    id: 'REC-06',
    name: 'Neon DB (Launch)',
    description: 'Plan Launch de Neon con más almacenamiento y compute.',
    provider: 'Neon',
    cost: 315,        // MXN/mes (~$19 USD × 16.5)
    frequency: 'monthly',
    url: 'https://neon.tech',
  },
  {
    id: 'REC-07',
    name: 'Cloudflare (Free)',
    description: 'CDN, SSL y protección básica DDoS gratuitos.',
    provider: 'Cloudflare',
    cost: 0,
    frequency: 'monthly',
    url: 'https://cloudflare.com',
  },
  {
    id: 'REC-08',
    name: 'Email corporativo (Google Workspace)',
    description: 'Gmail con dominio propio. Precio por usuario/mes.',
    provider: 'Google',
    cost: 100,        // MXN/usuario/mes (~$6 USD × 16.5)
    frequency: 'monthly',
    url: 'https://workspace.google.com',
  },
  {
    id: 'REC-09',
    name: 'Stripe (comisión por transacción)',
    description: 'Comisión de Stripe por cada pago procesado en MXN.',
    provider: 'Stripe',
    cost: 5,          // MXN fijo por transacción
    frequency: 'per-transaction',
    transactionPct: 3.6, // % para tarjetas MX (incluye conversión)
    url: 'https://stripe.com',
  },
  {
    id: 'REC-10',
    name: 'OpenAI API (chatbot)',
    description: 'Costo estimado mensual de la API de OpenAI para uso moderado.',
    provider: 'OpenAI',
    cost: 330,        // MXN/mes (~$20 USD × 16.5)
    frequency: 'monthly',
    url: 'https://platform.openai.com',
  },
  {
    id: 'REC-11',
    name: 'Email corporativo (Zoho Mail)',
    description: 'Alternativa económica a Google Workspace. Funcional para PyMES.',
    provider: 'Zoho',
    cost: 20,         // MXN/usuario/mes (~$1 USD × 16.5)
    frequency: 'monthly',
    url: 'https://zoho.com/mail',
  },
  {
    id: 'REC-12',
    name: 'Resend (emails transaccionales)',
    description: 'Hasta 3,000 emails/mes gratis. Ideal para confirmaciones y notificaciones.',
    provider: 'Resend',
    cost: 0,
    frequency: 'monthly',
    url: 'https://resend.com',
  },
  {
    id: 'REC-13',
    name: 'Google Ads (presupuesto mínimo sugerido)',
    description: 'Presupuesto mínimo recomendado para ver resultados en México. No incluye fee de gestión.',
    provider: 'Google',
    cost: 2500,       // MXN/mes mínimo sugerido
    frequency: 'monthly',
    url: 'https://ads.google.com',
  },
  {
    id: 'REC-14',
    name: 'Meta Ads (presupuesto mínimo sugerido)',
    description: 'Presupuesto mínimo recomendado para Facebook/Instagram en México. No incluye fee de gestión.',
    provider: 'Meta',
    cost: 1600,       // MXN/mes mínimo sugerido
    frequency: 'monthly',
    url: 'https://business.facebook.com',
  },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Calcula el costo total de un módulo sumando sus componentes y aplicando descuento */
export function calcModuleCost(moduleId: string): { cost: number; hours: number } {
  const mod = MODULES.find(m => m.id === moduleId);
  if (!mod) return { cost: 0, hours: 0 };

  const totals = mod.components.reduce(
    (acc, compId) => {
      const comp = COMPONENTS.find(c => c.id === compId);
      if (comp) {
        acc.cost += comp.cost;
        acc.hours += comp.hours;
      }
      return acc;
    },
    { cost: 0, hours: 0 }
  );

  const discount = mod.discountPct ?? 0;
  return {
    cost: totals.cost * (1 - discount),
    hours: totals.hours,
  };
}

/** Calcula el costo total de un producto sumando sus módulos + PM (20%) */
export function calcProductCost(productId: string): {
  subtotal: number;
  pm: number;
  total: number;
  hours: number;
} {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return { subtotal: 0, pm: 0, total: 0, hours: 0 };

  const totals = product.modules.reduce(
    (acc, modId) => {
      const { cost, hours } = calcModuleCost(modId);
      acc.cost += cost;
      acc.hours += hours;
      return acc;
    },
    { cost: 0, hours: 0 }
  );

  const pm = totals.cost * 0.20;
  return {
    subtotal: totals.cost,
    pm,
    total: totals.cost + pm,
    hours: totals.hours,
  };
}
