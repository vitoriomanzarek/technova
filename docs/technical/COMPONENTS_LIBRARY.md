# 🧩 Components Library — TechNova

> **Audiencia:** quien construya UI nueva o reutilice componentes existentes.
> **Fuente de verdad:** `src/components/`. Si añades/cambias un componente reutilizable, actualiza este doc.
> **Última verificación:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Estructura del library](#1-estructura-del-library)
2. [Componentes reutilizables](#2-componentes-reutilizables)
3. [Componentes de sección (singletons)](#3-componentes-de-sección-singletons)
4. [Patrón CSS + Tailwind](#4-patrón-css--tailwind)
5. [Guía para agregar componentes nuevos](#5-guía-para-agregar-componentes-nuevos)
6. [Accesibilidad (A11y)](#6-accesibilidad-a11y)
7. [Showcase / Storybook (futuro)](#7-showcase--storybook-futuro)

---

## 1. Estructura del library

```
src/components/
├── <root>/               ← componentes globales reutilizables
│   ├── NovaAvatar.tsx        avatar animado de "NOVA AI"
│   ├── StarBackground.tsx    fondo de estrellas animado
│   ├── TechNovaIcon.tsx      logo/ícono de marca
│   ├── WizardCard.tsx        contenedor glassmorphism del wizard
│   └── WizardProgress.tsx    barra de progreso del wizard
├── home/                 ← secciones de la landing (singletons)
│   ├── Hero.tsx              hero con framer-motion
│   ├── LeadMagnetSection.tsx form "Auditoría Web Express"
│   ├── NovaAISection.tsx     bloque de NOVA AI
│   ├── ParticleBackground.tsx fondo de partículas
│   ├── Sections.tsx          bloques varios (testimonios, equipo…)
│   └── ServicesSection.tsx   grid de servicios
├── layout/               ← chrome global
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ServiceLayout.tsx     layout compartido de páginas de servicio
├── navigator/            ← TechNova Navigator (IMR / cotizador)
│   └── NavigatorLayout.tsx
├── funnel/               ← captura post-lead
│   └── Wizard.tsx            wizard cotizador (orquestador)
├── wizard/               ← pasos individuales del wizard
│   ├── StepWelcome.tsx, StepMissionType.tsx, StepVisualIdentity.tsx,
│   ├── StepSystems.tsx, StepInfrastructure.tsx, StepLaunch.tsx,
│   ├── StepContact.tsx, StepSuccess.tsx
└── shared/               ← piezas reutilizables pequeñas
    ├── AccordionItem.tsx     item de FAQ colapsable
    └── DeviceMockup.tsx      mockup laptop+phone para servicios
```

### Convención de nombres

- Archivos y componentes en **PascalCase** (`NovaAvatar.tsx` → `NovaAvatar`).
- Un componente por archivo, `export default` al final.
- Reutilizables van en `<root>` o `shared/`; específicos de una feature van en su carpeta (`home/`, `wizard/`, etc.).
- **Regla de decisión:** si un componente se usa en 2+ lugares → `shared/` o `<root>`. Si es de una sola feature → carpeta de esa feature.

---

## 2. Componentes reutilizables

Estos aceptan props y están diseñados para reusarse. Documentados con su interface real.

### `NovaAvatar`

Avatar animado del asistente "NOVA AI" (glow + float opcional).

```ts
interface NovaAvatarProps {
  size?: 'sm' | 'md' | 'lg';   // default 'md' → w-20 h-20
  isThinking?: boolean;        // default false → activa pulse-glow + dot orbitante
}
```

```tsx
import NovaAvatar from '@/components/NovaAvatar';

<NovaAvatar size="lg" isThinking />
<NovaAvatar />  {/* md, estático */}
```

- **Estado:** stateless (controlado por props).
- **Assets:** carga `/Nova AI.png` desde `public/`.
- **A11y:** ✅ `<img alt="NOVA AI">`.

### `WizardCard`

Contenedor glassmorphism para envolver contenido del wizard.

```ts
interface WizardCardProps {
  children: ReactNode;
  className?: string;   // default '' — se concatena al final
}
```

```tsx
import WizardCard from '@/components/WizardCard';

<WizardCard className="max-w-2xl">
  <StepWelcome />
</WizardCard>
```

- **Estado:** stateless, puro wrapper.
- **Estilo:** `glass-card border-gradient` + gradient inline + `animate-slide-up`.

### `WizardProgress`

Barra de progreso con step dots para flujos multi-paso.

```ts
interface WizardProgressProps {
  currentStep: number;   // 1-indexed
  totalSteps: number;
}
```

```tsx
import WizardProgress from '@/components/WizardProgress';

<WizardProgress currentStep={3} totalSteps={8} />
```

- **Estado:** stateless. Calcula `progress = currentStep / totalSteps * 100`.
- **Visual:** barra con shine + end-cap glow + dots por paso.

### `AccordionItem`

Item de FAQ colapsable con animación de altura.

```ts
interface AccordionItemProps {
  question: string;
  answer: string;
  color?: string;   // default "blue" — ⚠️ ver gotcha en §4
}
```

```tsx
import AccordionItem from '@/components/shared/AccordionItem';

<AccordionItem
  question="¿Cuánto tarda un proyecto?"
  answer="Una landing toma ~1 semana; proyectos complejos 4-8 semanas."
  color="cyan"
/>
```

- **Estado:** controlado internamente (`useState` para `isOpen`). Uncontrolled desde afuera.
- **A11y:** ⚠️ usa `<button>` (✅ semántico) pero **falta `aria-expanded`** y `aria-controls`. Ver §6.

### `DeviceMockup`

Mockup animado de laptop + teléfono para páginas de servicio.

```ts
// props inline (no interface nombrada)
{ color?: string }   // default "blue". Acepta: blue, emerald, violet, indigo,
                     // orange, fuchsia, cyan, rose, purple
```

```tsx
import DeviceMockup from '@/components/shared/DeviceMockup';

<DeviceMockup color="violet" />
```

- **Estado:** stateless.
- **Nota:** mapea `color` a clases Tailwind vía objeto `getColorClass()` — pero también usa template strings dinámicos (`bg-${theme.base}-500`). Ver gotcha en §4.

### Otros reutilizables (sin props o triviales)

- **`StarBackground`** / **`ParticleBackground`** — fondos decorativos animados, sin props. Usar como primer hijo de una `<section className="relative">`.
- **`TechNovaIcon`** — logo SVG de marca.

---

## 3. Componentes de sección (singletons)

No aceptan props — son bloques completos de una página específica. No están pensados para reusar, pero documentarlos ayuda a saber dónde tocar.

| Componente | Página | Qué hace | Estado |
|------------|--------|----------|--------|
| `Hero` | `/` | Hero con copy "Multiplica tus Ventas…" + 2 CTAs | stateless, framer-motion |
| `LeadMagnetSection` | `/` | Form de captura → `POST /api/leads` | **stateful** (`email`, `status`) |
| `NovaAISection` | `/` | Bloque promocional de NOVA AI | stateless |
| `ServicesSection` | `/` | Grid de servicios | stateless |
| `Sections` | `/` | Testimonios, equipo, proceso, etc. | stateless |
| `Navbar` / `Footer` | global | Chrome del sitio | Navbar stateful (menú móvil) |
| `ServiceLayout` | `/services/*` | Layout compartido de páginas de servicio | stateless wrapper |
| `NavigatorLayout` | `/start-project` | Layout del cotizador | stateless wrapper |
| `Wizard` | `/start-project` | Orquestador de los 8 `Step*` | **stateful** (paso actual, respuestas) |

### `LeadMagnetSection` — referencia de patrón de form

Es el ejemplo canónico de form con estado en el repo. Patrón a replicar:

```tsx
const [email, setEmail] = useState('');
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus('loading');
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, project_type: 'Auditoría Express' }),
    });
    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) setEmail('');
  } catch {
    setStatus('error');
  }
};
```

Estados de UI: el botón cambia label (`Enviando…` / `¡Solicitada!`) y se deshabilita en `loading`/`success`. Mensajes de éxito/error condicionales. **Buen patrón — replicar en forms nuevos.**

---

## 4. Patrón CSS + Tailwind

### Estructura típica de un componente visual

```tsx
"use client";                          // si es interactivo
import { motion } from 'framer-motion'; // si anima

const MiComponente = ({ prop }: Props) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
      {/* contenido */}
      <div className="container mx-auto px-4 relative z-10">
        {/* ... */}
      </div>
    </section>
  );
};
```

### Theme (definido en `globals.css`)

Colores semánticos disponibles como utilities: `bg-dark`, `bg-darker`, `text-primary`, `text-highlight`, `text-accent`, `bg-muted`, `text-muted-foreground`, `border-border`. Utilities custom: `.glass-card`, `.glow-cyan`, `.glow-purple`, `.text-gradient`, `.border-gradient`, `.animate-float`, `.animate-slide-up`, `.animate-pulse-glow`, `.animate-progress-glow`.

### Responsive

Mobile-first siempre: `text-3xl md:text-4xl`, `flex-col sm:flex-row`, `w-[80%] md:w-[70%]`.

### Dark mode

El sitio es **dark-only** por diseño (theme espacial). No hay toggle light/dark. No usar `dark:` prefix — no aplica.

### ⚠️ GOTCHA CRÍTICO: clases Tailwind dinámicas

`AccordionItem` y `DeviceMockup` construyen clases con interpolación de strings:

```tsx
// ❌ ANTI-PATRÓN presente en el código actual
className={`bg-${color}-500/30`}        // AccordionItem
className={`bg-${theme.base}-900/20`}   // DeviceMockup
```

**Por qué es problema:** el JIT de Tailwind v4 escanea el código en build-time buscando clases literales. Una clase construida con template string (`bg-${color}-500`) **no se detecta** → la clase puede no generarse → el color no aplica en producción aunque funcione en dev.

**Hoy funciona** porque los colores usados (`blue`, `cyan`, etc.) probablemente aparecen literales en otros lados del código, así que Tailwind los incluye. Pero es frágil.

**Cómo hacerlo bien** (al refactorizar o crear componentes nuevos):

```tsx
// ✅ Mapa de clases completas (Tailwind las ve literales)
const colorClasses = {
  blue:    'bg-blue-500/30 border-blue-500/20 text-blue-100',
  cyan:    'bg-cyan-500/30 border-cyan-500/20 text-cyan-100',
  emerald: 'bg-emerald-500/30 border-emerald-500/20 text-emerald-100',
} as const;

<div className={colorClasses[color]} />
```

O usar `safelist` en la config de Tailwind si las clases dinámicas son inevitables.

**Deuda registrada:** refactorizar `AccordionItem` y `DeviceMockup` a mapas de clases completas. Bajo riesgo, alto valor de robustez. (Candidato para próximo cleanup.)

---

## 5. Guía para agregar componentes nuevos

### Checklist antes de crear

1. **¿Ya existe algo parecido?** Revisa `shared/` y `<root>`. No dupliques.
2. **¿Se usará en 2+ lugares?** Sí → reutilizable (`shared/` o `<root>`). No → carpeta de la feature.
3. **¿Necesita estado o interactividad?** Sí → `"use client"`. No → déjalo Server Component (más rápido).

### Estructura del archivo

```tsx
"use client";                          // 1. solo si interactivo
import { useState } from 'react';       // 2. React/Next
import { motion } from 'framer-motion'; // 3. third-party
import { algo } from '@/lib/algo';      // 4. alias internos

// 5. Props tipadas con interface nombrada (preferido) o inline
interface MiComponenteProps {
  titulo: string;
  variante?: 'a' | 'b';   // opcionales con default
}

// 6. Arrow function + destructuring con defaults
const MiComponente = ({ titulo, variante = 'a' }: MiComponenteProps) => {
  return ( /* JSX */ );
};

// 7. export default al final
export default MiComponente;
```

### Documentación mínima al crear un reutilizable

- Añadir entrada en §2 de este doc: nombre, interface, ejemplo de uso, estado, nota de a11y.

### Test recomendado (cuando Vitest esté instalado — ver TESTING_STRATEGY.md)

- Componentes con **lógica** (state machines, cálculos): test unitario.
- Componentes **puramente presentacionales**: no testear (bajo ROI).

---

## 6. Accesibilidad (A11y)

### Estado actual + gaps reales detectados

| Aspecto | Estado | Nota |
|---------|--------|------|
| Semantic HTML | ⚠️ parcial | `AccordionItem` usa `<button>` ✅; algunos CTAs son `<Link>` estilados ✅; revisar que no haya `<div onClick>` |
| `alt` en imágenes | ✅ | `NovaAvatar` tiene alt; verificar el resto |
| Labels en forms | ❌ **gap** | `LeadMagnetSection` el input email solo tiene `placeholder`, **falta `<label>`** (o `aria-label`). Lectores de pantalla no anuncian el campo |
| `aria-expanded` en accordions | ❌ **gap** | `AccordionItem` no expone estado open/closed a tecnología asistiva |
| Keyboard navigation | ⚠️ | `<button>` y `<Link>` son focuseables por default ✅; verificar que el wizard sea navegable con Tab/Enter |
| Focus states | ⚠️ | `LeadMagnetSection` input tiene `focus:ring` ✅; estandarizar en todos los interactivos |
| Color contrast | ✅ mayormente | theme dark con texto claro pasa AA; verificar `text-gray-500` sobre `bg-dark` (puede quedar bajo) |

### Fixes prioritarios (bajo esfuerzo, registrados como deuda)

1. **`LeadMagnetSection`**: añadir `<label htmlFor="lead-email" className="sr-only">Correo electrónico</label>` + `id="lead-email"` en el input.
2. **`AccordionItem`**: añadir `aria-expanded={isOpen}` y `aria-controls` al `<button>`.
3. Auditar con Lighthouse (Chrome DevTools → Lighthouse → Accessibility) tras el próximo deploy.

### Reglas para componentes nuevos

- Todo input necesita `<label>` (visible o `sr-only`).
- Toda imagen necesita `alt` (vacío `alt=""` si es decorativa).
- Interactivos = `<button>` o `<a>`, nunca `<div onClick>`.
- Estados toggle exponen `aria-expanded` / `aria-pressed`.
- Verificar focus visible (no quitar outline sin reemplazo).

---

## 7. Showcase / Storybook (futuro)

### Estado: no implementado

Hoy los componentes se ven solo en contexto (la página real). No hay catálogo visual aislado.

### Opciones cuando crezca el equipo

| Opción | Pro | Con |
|--------|-----|-----|
| **Storybook** | Estándar, addons de a11y/viewport, docs auto | Setup pesado, otra build a mantener |
| **Página `/components` interna** | Cero deps nuevas, dentro del mismo Next | Manual, sin addons |
| **Nada (status quo)** | Cero overhead | Sin referencia visual aislada |

**Recomendación:** mientras el equipo sea Vic + Claude + 1 dev, una página `/components` simple (protegida o en preview-only) es suficiente. Storybook cuando haya un equipo de UI dedicado.

---

## Para seguir leyendo

- [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md) §3 — patrón general de componentes React.
- [`../../memory/technova_development_standards.md`](../../memory/technova_development_standards.md) — convenciones (versión corta para Claude).
- [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) — cuándo testear un componente.

---

**Última actualización:** 2026-05-20
**Próxima revisión:** al refactorizar las clases dinámicas de Tailwind, o al añadir Storybook.
