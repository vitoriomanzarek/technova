# 🐛 PHASE A BUG LIST & QA FINDINGS
## Issues a Fixear Antes de Fase B

**Encontrado por:** Vic (revisión de sitio actual)  
**Fecha:** 2026-05-20  
**Status:** 🔴 CRITICAL (Bloquea Fase B)  
**Prioridad:** 🔴 ALTA

---

## 🎨 UI/UX ISSUES

### BUG 1: Banner Principal - Texto de Colores No Visible
**Severity:** 🔴 CRITICAL  
**Component:** src/components/home/Hero.tsx  
**Issue:** El texto con `text-gradient` en el hero banner no se ve claramente contra el fondo

```
Current:
<span className="text-gradient">Futuro</span>

Problem:
- Gradient text no contrasta bien con fondo animado
- Difícil de leer en algunos ángulos
- Afecta credibilidad del sitio
```

**Solution Options:**
1. Aumentar contraste del gradient (más saturado)
2. Agregar text-shadow para legibilidad
3. Cambiar a color sólido más legible

**Recomendación:** Aumentar contraste del gradient + agregar subtle text-shadow

---

### BUG 2: Navbar Dropdown (Servicios) - Transparencia y Texto Invisible
**Severity:** 🔴 CRITICAL  
**Component:** src/components/layout/Header.tsx (dropdown menu)  
**Issue:** El dropdown de "Servicios" es demasiado transparente, el texto se pierde contra el fondo

```
Current:
<div className="bg-white/5 backdrop-blur">
  Servicios...
</div>

Problem:
- Fondo demasiado transparente
- Texto gris sobre fondo oscuro transparente = invisible
- No se puede leer las opciones
```

**Solution:**
```tsx
// Option 1: Aumentar opacidad
<div className="bg-white/20 backdrop-blur-lg border border-white/20">
  // Opciones de servicios
</div>

// Option 2: Agregar fondo sólido oscuro
<div className="bg-darker/95 border border-white/10">
  // Opciones de servicios
</div>
```

**Recomendación:** bg-darker/95 + border para claridad

---

### BUG 3: Banner de Casos de Éxito - Confusión de Contenido
**Severity:** 🟡 MEDIA  
**Component:** src/app/page.tsx (ProjectsSection)  
**Issue:** Sección "Nuestros Clientes, Nuestros Casos de Éxito" muestra servicios ofrecidos en lugar de casos reales

```
Current:
Title: "Nuestros Clientes, Nuestros Casos de Éxito"
Shows: Landing Page case, eCommerce case, SEO case
(Mockups genéricos de servicios)

Problem:
- Título promete "casos de éxito" pero muestra servicios
- Mockups no son reales, son ejemplos
- Confunde visitantes sobre si tenemos clientes reales
- Reduce credibilidad
```

**Solution:**
- Cambiar a "Casos de Éxito Reales" (cuando estén listos en Fase B)
- Agregar B.1.1 Task (Portfolio Cases) especificación
- Hasta entonces, renombrar a "Servicios que Ofrecemos" o remover sección

**Acción inmediata (Fase A):** Renombrar sección o cambiar descripción  
**Solución final (Fase B):** Reemplazar con casos de éxito reales (IMAGERY_AGENT_KICKOFF.md B.1.1)

---

### BUG 4: Botones Blancos - Texto Invisible
**Severity:** 🔴 CRITICAL  
**Component:** Multiple buttons (CTAs)  
**Issue:** Hay botones con background blanco pero texto también blanco/muy claro = invisible

```
Problem:
- "Cotiza tu proyecto en 2 minutos" button (presupuesto page)
- Possibly other buttons with white/light backgrounds
- Text is white or very light gray
- Results: Invisible CTA
```

**Search for:**
```bash
grep -r "bg-white" src/ | grep -i button
# También buscar: bg-blue-400, bg-cyan-400, etc. sin text color explícito
```

**Solution:**
```tsx
// ❌ Wrong
<button className="bg-white">Texto</button>

// ✅ Correct
<button className="bg-white text-darker">Texto</button>
```

**Action:** Audit all buttons for sufficient contrast

---

### BUG 5: Dropdown de Presupuesto Estimado - Letras Invisibles
**Severity:** 🔴 CRITICAL  
**Component:** src/app/start-project/page.tsx (budget selector dropdown)  
**Issue:** El dropdown "Selecciona un rango" no muestra el texto de las opciones

```
Current State:
┌─────────────────────────────┐
│ Selecciona un rango      ▼  │  ← Se ve
├─────────────────────────────┤
│ Selecciona un rango         │  ← No se ve
│ +$300,000 MXN              │  ← Se ve (highlight azul)
│ [empty options...]           │  ← No se ven
└─────────────────────────────┘

Problem:
- Text color del dropdown muy claro
- No hay suficiente contraste
- Las opciones no seleccionadas son invisibles
```

**Probable cause:**
```tsx
// En el select:
<option className="text-gray-400">Opción</option>

// Fondo del dropdown es oscuro, texto muy claro = invisible
```

**Solution:**
```tsx
<option className="text-white bg-darker">+$300,000 MXN</option>
// O simplemente remover el color (usar defaults mejorados)
```

**Action:** Test dropdown, ajustar color y contraste

---

## 📧 CONTACT PAGE ISSUES

### BUG 6: Email Correcto - Crear hola@technova.com
**Severity:** 🟡 MEDIA (Configuration)  
**Component:** src/app/contacto/page.tsx  
**Current:** Email muestra "hola@technova.com"  
**Problem:** Email no existe/no está configurado

**Solution Options:**

**Option A: Gmail redirection (Recomendado)**
```
1. Crear cuenta Gmail: hola@technova.com
2. En Gmail settings:
   - Forwarding: hola@technova.com → victorsm2893@gmail.com
   - Permite responder como hola@technova.com
3. En /lib/email/:
   - FROM: hola@technova.com
   - Todos los emails parecen venir de dirección profesional
4. Vic gestiona desde Gmail inbox (automático)

Ventajas:
✅ Profesional
✅ Fácil de gestionar
✅ Sin costo extra
✅ Transparencia (real email, no máquina)
```

**Option B: Email forwarding via Domain**
```
1. Setup MX records en dominio
2. Redirect hola@technova.com → victorsm2893@gmail.com
3. Mismo resultado que Option A

Ventajas/Desventajas:
± Más técnico
± Requiere acceso a DNS
```

**Recomendación:** Option A (Gmail redirection) - más simple, funciona ahora

---

### BUG 7: Teléfono - Actualizar Número
**Severity:** 🟡 MEDIA (Configuration)  
**Component:** src/app/contacto/page.tsx  
**Current:** +1 (234) 567-890 (placeholder)  
**Should be:** 722 166 9672

**Fix:**
```tsx
// En contact page
<p className="text-2xl font-bold">722 166 9672</p>

// O con formato internacional:
+52 722 166 9672
```

**Also update:**
- src/data/contact.ts (si existe)
- Footer contact info
- Anywhere else that lists phone

---

### BUG 8: Botón Blanco en Presupuesto - Letras Invisibles
**Severity:** 🔴 CRITICAL  
**Component:** src/app/start-project/page.tsx (presupuesto section)  
**Issue:** El botón blanco "Enviar Misión" no muestra texto

```
Current:
[Botón blanco sin texto visible] ← "Enviar Misión"

Problem:
- White background, but text is also white/very light
- CTA is invisible
- Form can't be submitted visually
```

**Fix:**
```tsx
// ❌ Current (probably)
<button className="bg-white">Enviar Misión</button>

// ✅ Fixed
<button className="bg-white text-darker font-bold">
  Enviar Misión
</button>
```

---

## 📋 CONSOLIDADO: ISSUES POR PRIORIDAD

### 🔴 CRITICAL (Bloquea Fase B, fix ahora)
1. **Navbar dropdown invisible** (BUG 2) - HIGH IMPACT
2. **Botones blancos sin texto** (BUG 4, BUG 8) - HIGH IMPACT
3. **Dropdown presupuesto invisible** (BUG 5) - HIGH IMPACT
4. **Banner principal texto** (BUG 1) - MEDIUM IMPACT

### 🟡 MEDIA (Should fix, nice-to-have)
5. **Email setup** (BUG 6) - Configuration
6. **Teléfono correcto** (BUG 7) - Configuration
7. **Casos de éxito confusión** (BUG 3) - UX Issue

---

## ✅ CHECKLIST: FIXES ANTES DE FASE B

- [ ] BUG 1: Mejorar contraste texto gradient en Hero
- [ ] BUG 2: Fixear opacidad + contraste navbar dropdown
- [ ] BUG 3: Renombrar sección de "casos" o remover
- [ ] BUG 4: Audit todos los botones (contrast check)
- [ ] BUG 5: Fixear colores en dropdown presupuesto
- [ ] BUG 6: Setup email hola@technova.com (Gmail redirection)
- [ ] BUG 7: Actualizar teléfono a 722 166 9672
- [ ] BUG 8: Fixear botón blanco en presupuesto

---

## 🎯 ESTIMACIÓN DE TIEMPO

| Bug | Estimated | Actual | Status |
|-----|-----------|--------|--------|
| BUG 1 | 1 hour | - | Pending |
| BUG 2 | 1.5 hours | - | Pending |
| BUG 3 | 30 min | - | Pending |
| BUG 4 | 2 hours | - | Pending |
| BUG 5 | 1 hour | - | Pending |
| BUG 6 | 30 min | - | Pending |
| BUG 7 | 15 min | - | Pending |
| BUG 8 | 30 min | - | Pending |
| **TOTAL** | **~7.5 hours** | - | - |

**Owner:** Claude Code  
**Timeline:** ASAP, before Fase B starts  
**Priority:** Fix all CRITICAL bugs, defer MEDIA if time-constrained

---

## 📝 NOTAS

- Esta lista debe ser completada **antes** de pasar a Fase B
- Todos estos bugs pueden ser encontrados por usuarios nuevos
- Afectan credibilidad + conversión
- Los bugs de texto/contraste son especialmente críticos para accessibility

---

**Agregado a Backlog:** 2026-05-20  
**Status:** 🔴 BLOCKER FOR PHASE B
