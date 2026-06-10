# 📊 REPORTE DE EJECUCIÓN — TEMPLATE OFICIAL

**Instrucciones para agentes:** Copiar este template y completar cada sección cuando termines un prompt.

---

## ENCABEZADO

```
**Prompt fuente:** `prompts/[NOMBRE].prompt.md`
**Fecha de ejecución:** YYYY-MM-DD
**Generado por:** Claude Code Agent ([Modelo])
**Duración:** XXm YYs
**Estado:** ✅ COMPLETADO / 🔄 EN PROGRESO / ⚠️ PARCIAL / ❌ FALLIDO
**Confianza:** XX% (basada en tests/validación)
```

---

## RESUMEN EJECUTIVO (3-4 líneas)

Qué se hizo, resultado crítico, next step.

Ejemplo:
> Implementé monitoring 24/7 en producción (Fase B.4). 7 sistemas configurados (Sentry, Stripe, Resend, etc.). 26 checkpoints listos. Requiere validación manual por Vic en dashboards externos.

---

## TABLA DE ENTREGABLES

| # | Component | Objetivo | Status | Notas |
|---|-----------|----------|--------|-------|
| 1 | Sentry | Error tracking | ✅ Config ready | Requiere DSN en Vercel |
| 2 | Stripe webhooks | Payment validation | ✅ Ready | Endpoint ya existe |
| ... | ... | ... | ... | ... |

---

## CHECKLIST OPERATIVO

### Sección A: [Nombre]
- [ ] Item 1 — Descripción
- [ ] Item 2 — Descripción
- [ ] Item 3 — Descripción

### Sección B: [Nombre]
- [ ] Item 1
- [ ] Item 2

**Subtotal:** X/Y completados (XX%)

---

## UMBRALES & ALERTAS

### 🟢 Normal
| Métrica | Umbral | Acción |
|---------|--------|--------|
| X | <Y | Monitor normally |
| Z | >W | Monitor normally |

### 🟡 Warning
| Métrica | Umbral | Acción |
|---------|--------|--------|
| X | Y-Z | Investigate |

### 🔴 Crítico
| Métrica | Umbral | Acción |
|---------|--------|--------|
| X | >Y | IMMEDIATE ACTION |

---

## RUTINA OPERATIVA

**Frecuencia:** [Daily/Weekly/etc]
**Tiempo requerido:** XXm per cycle

1. **Step 1** — [Acción] (Xm)
2. **Step 2** — [Acción] (Xm)
3. **Step 3** — [Acción] (Xm)

---

## DEPENDENCIAS & REQUERIMIENTOS

| Dependencia | Status | Link |
|-------------|--------|------|
| Sentry project | ✅ Ready | https://sentry.io/... |
| Stripe test keys | ✅ Ready | https://dashboard.stripe.com |
| Database | ✅ Live | https://console.neon.tech |

---

## NOTAS DE IMPLEMENTACIÓN

- Key insight 1
- Key insight 2
- Known limitation 1
- Workaround for limitation 1

---

## ESCALATION PATH

| Escenario | Responsable | Acción |
|-----------|-------------|--------|
| Error rate >1%/h | Vic | Check Sentry, consider rollback |
| Stripe webhook fails | Engineering | Verify HTTPS cert, retry |
| Database unavailable | DevOps | Contact Neon support |
| Unknown issue | Vic | Incident log + triage |

---

## INCIDENT LOG

| Date | Issue | Duration | Resolution | Root Cause |
|------|-------|----------|------------|-----------|
| 2026-06-04 | — | — | — | — |

---

## NEXT STEPS

1. **Immediate (next hour):** [Action]
2. **Short-term (24h):** [Action]
3. **Medium-term (1 week):** [Action]

---

## SIGN-OFF

**Report verified by:** [Name]  
**QA check:** ✅ / ❌  
**Ready for production:** ✅ / ⚠️ / ❌

---

**Generated:** YYYY-MM-DD HH:MM UTC  
**Template version:** 1.0  
**Metadata:** [Any additional context]
