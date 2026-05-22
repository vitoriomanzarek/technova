# 📸 IMAGERY AGENT KICKOFF
## Para Claude Code: Visual Enhancement del Sitio

**Dueño:** Claude Code  
**Autoridad:** Vic (Fundador) - APROBADO  
**Status:** 🔴 FASE B (Ejecutar después de Fase A completa)  
**Prioridad:** 🔴 ALTA (Impacta credibilidad de sitio)

---

## 🎯 OBJETIVO

Agregar imágenes estratégicas al sitio TechNova para:
- ✅ Aumentar credibilidad (mostrar proyectos reales)
- ✅ Mejorar engagement (break de texto monótono)
- ✅ Humanizar la agencia (fotos de equipo)
- ✅ Visualizar servicios (screenshots, mockups)

**Resultado final:** Sitio pasa de "agencia bonita pero sin proof" a "agencia que DEMUESTRA su trabajo"

---

## 📋 TAREAS (En Orden de Importancia)

### TAREA 1: Portfolio / Casos de Éxito (`/casos-de-exito`)
**Status:** 🔴 NO INICIADO  
**Prioridad:** 🔴 CRÍTICA

**Entregar:**

Nueva página pública que muestra 3-5 proyectos reales con imágenes.

**Requisitos:**

1. **Ruta y estructura**
   - Path: `src/app/casos-de-exito/page.tsx`
   - Componente: `CaseStudiesPage`
   - Estructura: Hero + Grid de casos + CTA final

2. **Data de casos**
   - Crear: `src/data/case-studies.ts`
   - Cada caso con:
     ```ts
     {
       id: "caso-001",
       title: "Tienda Online Artesanía",
       sector: "Retail",
       description: "Transformamos una tienda física a eCommerce generando 3x en ventas",
       challenge: "No tenían presencia online, perdían clientes",
       solution: "Sitio eCommerce + Stripe + Email marketing",
       results: {
         metric1: "3x aumento en ventas",
         metric2: "+500 clientes nuevos en 3 meses",
         metric3: "AOV aumentó 45%"
       },
       image: "/images/cases/artesania-screenshot.png",  // NECESARIO
       beforeAfter: {
         before: "/images/cases/artesania-before.png",
         after: "/images/cases/artesania-after.png"
       },
       technologies: ["Next.js", "Stripe", "Resend"],
       clientTestimonial: "Vic cambió nuestro negocio completamente",
       link: "#"  // Si tiene página dedicada
     }
     ```

3. **Componentes React**
   
   **CaseStudyCard.tsx** - Tarjeta de caso
   ```tsx
   Props:
   - image: string (screenshot/mockup)
   - title: string
   - sector: string
   - results: string[] (3 métricas principales)
   - onClick: () => void (modal o página dedicada)
   
   Renderiza:
   - Imagen arriba
   - Título + sector
   - 3 resultado metrics destacadas
   - "Ver caso completo" CTA
   ```

   **CaseStudyDetail.tsx** - Modal o página dedicada (modal preferred)
   ```tsx
   Muestra:
   - Imagen principal (before/after slider si aplica)
   - Headline: "Caso: [Nombre Cliente]"
   - Reto: "¿Cuál era el problema?"
   - Solución: "¿Cómo lo solucionamos?"
   - Resultados: Tabla con métricas
   - Testimonial: Cita de cliente (opcional, con avatar)
   - CTA: "¿Tu negocio necesita esto?"
   ```

4. **Imágenes necesarias (por cada caso)**
   - Image principal (screenshot de proyecto o mockup): `1200x800px`
   - Before/After (si aplica): `600x400px` cada uno
   - Logo del cliente (si es B2B): `200x200px`
   - Avatar cliente (para testimonial): `80x80px`

5. **Número de casos**
   - Mínimo: 3 casos reales
   - Ideal: 5 casos (cobertura de sectores)
   - Máximo: 10 (para no abrumar)
   - Sectores sugeridos: Retail, Educación, Servicios, Saas, Marketing

6. **Estilos**
   - Tailwind v4
   - Dark theme (coherente con sitio)
   - Grid responsivo: 1 col mobile, 2 col tablet, 3 col desktop
   - Hover effects: lift + glow
   - Animaciones suaves (Framer Motion si hay)

7. **SEO**
   - Metadata: `title`, `description` dinámico por caso
   - Schema markup: `LocalBusiness` + `ImageObject`
   - Image alt text descriptivo
   - Canonical URL

**Output:**
- `src/app/casos-de-exito/page.tsx` (página)
- `src/app/casos-de-exito/[slug]/page.tsx` (opcional, caso individual)
- `src/data/case-studies.ts` (data)
- `src/components/cases/CaseStudyCard.tsx`
- `src/components/cases/CaseStudyDetail.tsx`
- `public/images/cases/` (carpeta con todas las imágenes)

---

### TAREA 2: Services Section Visual Enhancement
**Status:** 🔴 NO INICIADO  
**Prioridad:** 🔴 ALTA

**Entregar:**

Mejorar sección de servicios con screenshots/mockups de cada servicio.

**Requisitos:**

1. **Servicios a visualizar** (del código actual)
   - Landing Page
   - Sitio Corporativo
   - E-commerce
   - Web App / SaaS
   - CRM Personalizado
   - Chatbot IA
   - LMS
   - Data Analysis
   - Marketing Automation
   - Support Center

2. **Para cada servicio, agregar:**
   - Imagen/screenshot representativa: `600x400px`
   - Pequeña descripción (ya existe en código)
   - Lista de features (ya existe)
   - CTA: "Ver demo" o "Cotizar"

3. **Opciones para imágenes:**
   - **Opción A (Mejor):** Mockups realistas de proyectos reales
   - **Opción B:** Screenshots de interfaces de administración
   - **Opción C:** Ilustraciones abstractas (si no hay proyectos reales)

4. **Componentes**
   
   **ServiceCard.tsx** - Tarjeta con imagen
   ```tsx
   Props:
   - title: string
   - description: string
   - image: string
   - features: string[]
   - icon: React.ReactNode
   - color: string (gradient)
   
   Renderiza:
   - Imagen arriba (thumbnail)
   - Icono + título
   - Descripción breve
   - 3-4 features principales
   - CTA button
   ```

5. **Galerías por categoría**
   - UX/Diseño: Wireframes, mockups
   - Desarrollo: Screenshots de sitios vivos
   - Sistemas: Panel admin, interfaces
   - Marketing: Dashboards, email templates

**Output:**
- `src/components/home/ServiceCard.tsx` (mejorado)
- `public/images/services/` (carpeta con screenshots)
- 10+ imágenes de servicios (1 por servicio mínimo)

---

### TAREA 3: Team Section Photos
**Status:** 🔴 NO INICIADO  
**Prioridad:** 🟡 MEDIA

**Entregar:**

Fotos de equipo para humanizar la agencia.

**Requisitos:**

1. **Fotos necesarias**
   - Foto de Vic (fundador): `400x400px`, profesional casual
   - Fotos de cada miembro del equipo: `300x300px` cada uno
   - Foto grupal (opcional): `1200x800px`

2. **Estilo de fotos**
   - Professional pero casual (no LinkedIn corporate)
   - Lighting consistente
   - Background blanco/gris o blur
   - Sonrisa, mirada a cámara
   - Ropa business casual

3. **Data de team**
   - Crear: `src/data/team.ts`
   - Cada miembro con: name, role, photo, bio corta (1 línea), socials (LinkedIn, GitHub)
   
   ```ts
   {
     id: "vic",
     name: "Víctor M.",
     role: "Fundador & CEO",
     bio: "Full-stack developer + estratega digital con 10+ años en el mercado",
     photo: "/images/team/vic.jpg",
     linkedin: "https://linkedin.com/in/vic",
     github: "https://github.com/vic"
   }
   ```

4. **Componentes**
   
   **TeamMember.tsx**
   ```tsx
   Props:
   - name, role, bio, photo, linkedin, github
   
   Renderiza:
   - Foto (con hover zoom + glow)
   - Nombre + rol
   - Bio
   - Social links (icons)
   ```

5. **Galería**
   - Grid: 1 col mobile, 2-3 col desktop
   - Foto como círculo o cuadrado con bordes suaves
   - Hover: zoom foto + reveal bio

**Output:**
- `src/data/team.ts` (data)
- `src/components/home/TeamMember.tsx`
- `public/images/team/` (fotos)
- 5-8 fotos de equipo

---

### TAREA 4: Hero Section Background Visual
**Status:** 🔴 NO INICIADO  
**Prioridad:** 🟡 MEDIA

**Entregar:**

Mejorar visual del Hero con fondo visual impactante.

**Requisitos:**

1. **Opciones para hero background**
   - **Opción A:** Ilustración vectorial moderna (agencia trabajando, código, creatividad)
   - **Opción B:** Foto de workspace moderno (laptops, café, ambiente creativo)
   - **Opción C:** 3D render abstracto (futurista, tech)
   - **Opción D:** Gradiente + particles (lo que ya existe mejorado)

2. **Especificaciones**
   - Dimensión: `2000x1200px` (full bleed)
   - Color palette: Cyan, purple, dark compatible
   - Estilo: Moderno, profesional, futurista
   - Legibilidad: Texto debe ser legible encima

3. **Implementación**
   - Agregar a: `src/components/home/Hero.tsx`
   - Como background image o SVG/canvas
   - Responsive (adaptar para mobile)
   - Lazy load si es pesado

**Output:**
- `public/images/hero-bg.{jpg|svg}` (imagen)
- Actualizar Hero.tsx para incluir imagen

---

### TAREA 5: Testimonials Visual Enhancement
**Status:** 🔴 NO INICIADO  
**Prioridad:** 🟡 MEDIA

**Entregar:**

Agregar avatares y fotos a testimonios.

**Requisitos:**

1. **Por cada testimonial agregar**
   - Avatar cliente: `80x80px`, círculo
   - Nombre + empresa
   - Logo empresa (si es B2B): `120x60px`
   - Testimonio (ya existe)
   - Rating (stars, 1-5)

2. **Data de testimonios**
   - Actualizar: `src/data/testimonials.ts`
   - Campos: name, company, role, avatar, logo, testimonial, rating

3. **Componentes**
   
   **TestimonialCard.tsx** (mejorado)
   ```tsx
   Renderiza:
   - Quotes icon
   - Testimonial text
   - Author avatar (circular)
   - Author name + company + role
   - Company logo
   - Rating stars
   ```

4. **Avatares**
   - 5-10 clientes con avatares
   - Estilo: Profesional pero humano
   - Si no tienes fotos reales: usar generador AI (Gravatar, Dicebear)

**Output:**
- `src/data/testimonials.ts` (actualizado)
- `src/components/home/TestimonialCard.tsx` (mejorado)
- `public/images/testimonials/` (avatares y logos)

---

### TAREA 6: Pricing Page Visual Enhancement
**Status:** 🔴 NO INICIADO  
**Prioridad:** 🟠 BAJA

**Entregar:**

Agregar ilustraciones o imágenes pequeñas a las tarjetas de pricing.

**Requisitos:**

1. **Para cada plan agregar**
   - Pequeña ilustración o icon set: `300x300px`
   - Subtle background pattern
   - Color coding (cyan, purple, emerald)

2. **Opciones**
   - **Opción A:** Ilustraciones minimalistas (icons + shapes)
   - **Opción B:** Gradiente + animated elements
   - **Opción C:** Micro 3D illustrations

3. **Implementación**
   - Actualizar: `src/app/pricing/page.tsx`
   - Agregar prop `illustration` a cada plan
   - Renderizar como background subtle

**Output:**
- 3 ilustraciones (START, GROWTH, SCALE)
- Actualizar pricing page

---

## 📊 CHECKLIST DE ENTREGA

- [ ] Casos de éxito página completa con 3-5 casos + imágenes
- [ ] Services section con 10+ imágenes de servicios
- [ ] Team section con fotos de equipo (mínimo 5)
- [ ] Hero section background visual mejorado
- [ ] Testimonials con avatares y logos (5-10)
- [ ] Pricing con ilustraciones por plan
- [ ] Todas las imágenes optimizadas (comprimidas, responsive)
- [ ] SEO: Alt text, metadata, schemas agregados
- [ ] Responsive en mobile, tablet, desktop
- [ ] No hay broken images o 404s
- [ ] Performance: Lighthouse score > 80

---

## 🎯 ÉXITO SIGNIFICA

✅ Sitio pasa de "bonito pero sin proof" a "bonito Y demuestra trabajo"  
✅ Visitantes ven proyectos reales → más confianza → más conversiones  
✅ Equipo humanizado → genera confianza personal  
✅ Servicios visualizados → menos confusión, más clarity  
✅ Portfolio es el novo winning tool → clientes dicen "wow, hicieron eso?"

---

## 🔗 REFERENCIAS

- BACKLOG_MASTER.md (fase en que va este trabajo)
- technova_business_context.md (nicho PyMEs Mexico)
- /casos-de-exito (página a crear)

---

## 🚀 PRÓXIMA EJECUCIÓN

Cuando: **Fase B comience** (después de Fase A completa)

Claude Code: Lee este documento, identifica qué imágenes existen vs faltan, crea la estructura, y sourcea las imágenes.

---

**Preparado por:** Claude (Arquitecto)  
**Para:** Claude Code (Ejecutor)  
**Validado por:** Vic (Fundador)  
**Status:** ✅ BACKLOG - FASE B
