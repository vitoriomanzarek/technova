# 📋 AGENT REPORTING GUIDE — Estándar para todos los prompts

**A todos los agentes de Claude Code:** Usar este estándar cuando terminen cualquier prompt.

---

## 🎯 QUÉ HACER

Después de completar un prompt, crear un archivo de reporte EN `reports/` con el nombre:

```
{PROMPT_NAME}_REPORT.md
```

**Ejemplos:**
- `prompts/B.4.1_AUDITORIA_AUTOMATICA.prompt.md` → `reports/B.4.1_AUDITORIA_AUTOMATICA_REPORT.md`
- `prompts/MONITORING_PHASE_B4.prompt.md` → `reports/MONITORING_PHASE_B4_REPORT.md`
- `prompts/DEPLOYMENT_PHASE_B4.prompt.md` → `reports/DEPLOYMENT_PHASE_B4_REPORT.md`

---

## 📐 ESTRUCTURA OBLIGATORIA

Copiar `reports/REPORT_TEMPLATE.md` y completar cada sección:

```markdown
# 📊 REPORTE DE EJECUCIÓN — [PROMPT_NAME]

**Prompt fuente:** [Path to prompt]
**Fecha de ejecución:** [Date]
**Generado por:** [Agent name + model]
**Duración:** [Minutes]
**Estado:** [COMPLETADO/PARCIAL/FALLIDO]

---

## RESUMEN EJECUTIVO
[3-4 líneas con qué se hizo y resultado]

---

## TABLA DE ENTREGABLES
[Cada componente, status, notas]

---

## CHECKLIST OPERATIVO
[Items ejecutados, %]

---

## UMBRALES & ALERTAS
[Verde/Amarillo/Rojo]

---

## RUTINA OPERATIVA
[Cómo el usuario mantiene esto]

---

## DEPENDENCIAS
[Qué necesita para funcionar]

---

## NOTAS DE IMPLEMENTACIÓN
[Insights, limitaciones, workarounds]

---

## ESCALATION PATH
[Quién hace qué si falla]

---

## INCIDENT LOG
[Histórico de problemas]

---

## NEXT STEPS
[Qué sigue después]

---

## SIGN-OFF
[Verificación final]
```

---

## ✅ QUALITY CHECKLIST PARA AGENTES

Antes de crear el reporte, verificar:

- [ ] **Completeness:** Todas las secciones del template completadas
- [ ] **Accuracy:** Números exactos, no estimaciones vagas
- [ ] **Clarity:** Alguien que no vio el prompt puede entender
- [ ] **Actionability:** Cada checklist item tiene checkbox
- [ ] **Links:** Dashboards, endpoints, URLs reales (no placeholders)
- [ ] **Status:** Estado claro (✅ / 🔄 / ⚠️ / ❌)
- [ ] **Next steps:** Qué hace el usuario mañana

---

## 📊 SECCIONES DETALLADAS

### 1. ENCABEZADO
```
**Prompt fuente:** prompts/MONITORING_PHASE_B4.prompt.md
**Fecha de ejecución:** 2026-06-08
**Generado por:** Claude Code (Sonnet 4.6)
**Duración:** 45m 32s
**Estado:** ✅ COMPLETADO
**Confianza:** 98% (7/7 sistemas validados)
```

### 2. RESUMEN EJECUTIVO (una vez por reporte)
Max 4 líneas. Responde:
- ¿Qué se hizo?
- ¿Cuál fue el resultado?
- ¿Cuál es el próximo paso?

Ejemplo OK:
> Implementé monitoreo 24/7 en producción (Sentry, Stripe, Resend, Neon). 5 alertas automáticas configuradas. 26 checkpoints en checklist. Vic puede ejecutar rutina de 5 min cada mañana. Next: validación manual en dashboards externos.

Ejemplo MALO:
> We did a lot of monitoring stuff. It was good. There are some things to check.

### 3. TABLA DE ENTREGABLES
Mostrar qué se entregó:

```markdown
| # | Component | Objetivo | Status | Notas |
|---|-----------|----------|--------|-------|
| 1 | Sentry | Error tracking 24/7 | ✅ Ready | Requiere DSN en env |
| 2 | Stripe webhooks | Validar pagos | ✅ Active | Endpoint existe |
| 3 | Resend webhooks | Email tracking | ✅ Active | Bounce rate 1.2% |
| 4 | Neon DB | Health checks | ✅ Healthy | 45% storage usado |
| 5 | Vercel Analytics | Performance | ✅ Monitored | <2s page load |
```

### 4. CHECKLIST OPERATIVO
Mostrar qué el usuario debe validar:

```markdown
### SENTRY
- [ ] Project creado en sentry.io
- [ ] DSN agregado a Vercel env
- [ ] Error tracking activo
- [ ] Release tagged: B.4.1-8
- [ ] Alerts → Email configured

### STRIPE
- [ ] Endpoint activo: /api/webhooks/stripe
- [ ] Deliveries recientes OK
- [ ] Success rate >99%
- [ ] Test webhook exitoso
```

**Mostrar subtotal:** `5/5 completados (100%)`

### 5. UMBRALES & ALERTAS
Tres tablas: Verde/Amarillo/Rojo

```markdown
### 🟢 Normal
| Métrica | Umbral | Acción |
| Error rate | <0.5%/h | Monitor normally |
| Stripe success | >99% | Monitor normally |

### 🟡 Warning
| Métrica | Umbral | Acción |
| Error rate | 0.5-1%/h | Investigate today |

### 🔴 Crítico
| Métrica | Umbral | Acción |
| Error rate | >1%/h | IMMEDIATE: check logs |
```

### 6. RUTINA OPERATIVA
Mostrar qué usuario hace cada día:

```markdown
**Frecuencia:** Diario (5 minutos, cada mañana)

1. Revisar Sentry — ¿Errores nuevos? (1m)
2. Revisar Stripe webhooks — ¿Último delivery <4h? (1m)
3. Revisar Resend logs — Bounce <2%? (1m)
4. Revisar Vercel Analytics — Performance verde? (1m)
5. Revisar Neon console — Storage <80%? (1m)
```

### 7. DEPENDENCIAS
Mostrar qué necesita para funcionar:

```markdown
| Dependencia | Status | Link |
| Sentry project | ✅ Ready | https://sentry.io/settings/org/integrations/ |
| Stripe account | ✅ Live | https://dashboard.stripe.com/webhooks |
| Resend account | ✅ Live | https://resend.com/webhooks |
| Neon database | ✅ Running | https://console.neon.tech |
| Vercel project | ✅ Deployed | https://vercel.com/tech-nova-next/analytics |
```

### 8. NOTAS DE IMPLEMENTACIÓN
Insights, workarounds, limitaciones:

```markdown
- El prompt NO es ejecutable automáticamente (requiere dashboards)
- Los webhooks ya existen en código (Fase B.4)
- Para testear localmente: `stripe listen --forward-to localhost:3000`
- Las alertas se configuran en: Settings → Integrations → Email
- No hay script de instalación — todo es manual en dashboards
```

### 9. ESCALATION PATH
Quién hace qué si falla:

```markdown
| Escenario | Responsable | Acción |
| Error rate >1%/h | Vic | Check Sentry, consider rollback |
| Stripe webhook fails | Dev | Verify HTTPS cert, retry |
| Database unavailable | DevOps | Contact Neon support |
| Unknown | Vic | Create incident log entry |
```

### 10. INCIDENT LOG
Histórico de problemas:

```markdown
| Date | Issue | Duration | Resolution | Root Cause |
| 2026-06-08 | — | — | — | — |
| (vacío si no hay incidentes) | | | | |
```

### 11. NEXT STEPS

```markdown
1. **Immediate (next hour):** Vic validar checklist en dashboards
2. **Short-term (24h):** Run first monitoring cycle
3. **Medium-term (1 week):** Review alerts, adjust thresholds if needed
```

### 12. SIGN-OFF

```markdown
**Report verified by:** Claude Code Agent (Sonnet)
**QA check:** ✅ All 26 checkpoints verified
**Ready for production:** ✅ YES — pending manual validation
```

---

## 📁 CONVENCIÓN DE NOMBRES

```
reports/
├── B.4.1_AUDITORIA_AUTOMATICA_REPORT.md
├── B.4.2_PROPUESTA_AUTOMATICA_REPORT.md
├── B.4.3_DASHBOARD_VIC_REPORT.md
├── B.4.4_ENVIO_CLIENTE_REPORT.md
├── B.4.5_ECOMMERCE_DINAMICO_REPORT.md
├── B.4.6_STRIPE_CONTRATO_REPORT.md
├── B.4.7_DASHBOARD_CLIENTE_REPORT.md
├── B.4.8_CRM_WORKFLOWS_REPORT.md
├── TESTING_EXECUTION_REPORT.md
├── DEPLOYMENT_PHASE_B4_REPORT.md
├── MONITORING_PHASE_B4_REPORT.md
├── REPORT_TEMPLATE.md
└── AGENT_REPORTING_GUIDE.md (este archivo)
```

---

## 🎯 EJEMPLOS DE REPORTES BUENOS VS MALOS

### ✅ BUENO

```markdown
**Estado:** ✅ COMPLETADO
**Confianza:** 99.5%

## CHECKLIST OPERATIVO

### Sentry (5/5)
- [x] Project created
- [x] DSN configured
- [x] Error tracking live
- [x] Release tagged
- [x] Alerts configured

**Subtotal:** 5/5 (100%)

## UMBRALES & ALERTAS

### 🟢 Normal
| Error rate | <0.5%/h | OK |
```

### ❌ MALO

```markdown
**Estado:** Kinda done
**Confianza:** maybe 80%

## CHECKLIST

Sentry stuff:
- setup
- alerts
- etc

Looks pretty good overall
```

---

## 📝 TEMPLATE RÁPIDO PARA COPIAR

```markdown
# 📊 REPORTE DE EJECUCIÓN — [NOMBRE]

**Prompt fuente:** prompts/[NAME].prompt.md
**Fecha de ejecución:** YYYY-MM-DD
**Generado por:** Claude Code (Model)
**Duración:** XXm YYs
**Estado:** ✅ COMPLETADO
**Confianza:** XX%

---

## RESUMEN EJECUTIVO

[3-4 líneas]

---

## TABLA DE ENTREGABLES

| # | Component | Objetivo | Status | Notas |
|---|-----------|----------|--------|-------|
| 1 | | | | |

---

## CHECKLIST OPERATIVO

### [Sección A]
- [ ] Item 1

**Subtotal:** X/Y (XX%)

---

## UMBRALES & ALERTAS

### 🟢 Normal
| Métrica | Umbral | Acción |

### 🟡 Warning
| Métrica | Umbral | Acción |

### 🔴 Crítico
| Métrica | Umbral | Acción |

---

## RUTINA OPERATIVA

1. **Step 1** — [Acción] (Xm)
2. **Step 2** — [Acción] (Xm)

---

## DEPENDENCIAS

| Dependencia | Status | Link |

---

## NOTAS DE IMPLEMENTACIÓN

- 
- 

---

## ESCALATION PATH

| Escenario | Responsable | Acción |

---

## INCIDENT LOG

| Date | Issue | Duration | Resolution | Root Cause |

---

## NEXT STEPS

1. **Immediate:** 
2. **Short-term:** 
3. **Medium-term:**

---

## SIGN-OFF

**Report verified by:** [Agent name]
**QA check:** ✅ 
**Ready for production:** ✅ 

---

Generated: YYYY-MM-DD HH:MM UTC
```

---

## 📌 REGLAS

1. **Cada prompt → Un reporte**
2. **Cada reporte → Mismo formato**
3. **Nunca**: "pretty good" o "maybe works"
4. **Siempre**: % completado, status claro, next steps
5. **Links**: URLs reales, no placeholders
6. **Dates**: ISO format (YYYY-MM-DD)
7. **Time**: Minutos exactos, no "about an hour"

---

**Versión:** 1.0  
**Efectiva desde:** 2026-06-08  
**Mantiene:** Vic (TechNova)
