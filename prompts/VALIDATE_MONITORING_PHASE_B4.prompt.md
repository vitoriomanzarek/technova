# ✅ VALIDATION PROMPT — MONITORING FASE B.4 PRUEBAS REALES

**For:** Claude Code Agent (QA/Validation)  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (No podemos confiar en un sistema sin probar)  
**Estimated Time:** 45-60 minutos  
**Timeline:** Ahora mismo

---

## 📋 OBJETIVO

**NO hacer listas de verificación.** 

**SÍ:** Entrar a los dashboards REALES y validar que cada sistema funciona en PRODUCCIÓN.

Con dinero real en juego (Stripe), no podemos asumir que funciona — necesitamos PRUEBA.

---

## 🎯 VALIDACIONES REQUERIDAS

### 1. SENTRY — Error Tracking Funciona

**Verificar que Sentry recibe errores:**

```bash
# 1. Ir a: https://sentry.io/organizations/[ORG]/issues/

# 2. Buscar eventos recientes
# Esperado: Eventos de tech-nova en últimas 24h

# 3. Si NO hay eventos:
#    → Ir a /admin/settings → Sentry DSN
#    → Verificar que está en .env.production
#    → Si falta: Agregarlo + redeploy

# 4. PROBAR: Trigger error manual
#    → Abre: https://tech-nova.mx/admin/test-error?token=[TOKEN]
#    → Espera 30s
#    → Refrescar Sentry
#    → ¿Nuevo error aparece? ✅ WORKING

# RESULTADO:
# ✅ Errores siendo capturados en tiempo real
# O
# ❌ No hay captura — PROBLEMA
```

**Checklist:**
- [ ] Sentry proyecto visible
- [ ] Al menos 1 error en últimas 24h
- [ ] Manual error test triggers correctamente
- [ ] Release tag visible: `B.4.1-8` o actual

---

### 2. STRIPE WEBHOOKS — Recibiendo Pagos

**Verificar que Stripe manda eventos:**

```bash
# 1. Ir a: https://dashboard.stripe.com/webhooks/we_[ID]

# 2. Ver "Recent deliveries"
# Esperado: Eventos en últimas 48h
# - payment_intent.succeeded
# - checkout.session.completed
# - charge.succeeded

# 3. Si NO hay eventos recientes:
#    → Webhook nunca fue usado (sin pagos)
#    → O endpoint está roto
#    → Hacer prueba (ver abajo)

# 4. PROBAR: Simular webhook local
#    → En terminal:
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe

#    → En otra terminal:
stripe trigger checkout.session.completed

#    → Revisar logs del dev server
#    → ¿Se procesó el evento? ✅ WORKING

# 5. Verificar en producción:
#    → Go back to Stripe dashboard
#    → ¿Último delivery = hoy? ✅ OK

# RESULTADO:
# ✅ Webhooks entregándose y procesándose
# O
# ❌ No hay entregas — PROBLEMA
```

**Checklist:**
- [ ] Stripe webhooks endpoint activo
- [ ] Deliveries recientes en dashboard
- [ ] Success rate >98%
- [ ] Manual test webhook procesa correctamente
- [ ] No hay errores en response (status 200)

---

### 3. RESEND WEBHOOKS — Email Tracking

**Verificar que Resend manda eventos:**

```bash
# 1. Ir a: https://resend.com/webhooks

# 2. Ver "Event Log"
# Esperado: Eventos en últimas 24h
# - email.sent (5-10 eventos)
# - email.opened (si alguien abrió)
# - email.clicked (si alguien clickeó)
# - email.bounced (si hubo bounces)

# 3. Si NO hay eventos:
#    → No se han enviado emails (normal si es día 1)
#    → O webhook no está recibiendo

# 4. PROBAR: Enviar email manual
#    → En código:
const result = await resend.emails.send({
  from: "sofia@tech-nova.mx",
  to: "test@yourmail.com",
  subject: "Test email",
  html: "<p>Test</p>",
});

#    → Espera 5s
#    → Revisar Resend log
#    → ¿Evento "email.sent" aparece? ✅ WORKING

# 5. Abrir email en test inbox
#    → ¿Evento "email.opened" aparece? ✅ TRACKING OK

# RESULTADO:
# ✅ Emails siendo enviados y tracked
# O
# ❌ No hay eventos — PROBLEMA
```

**Checklist:**
- [ ] Resend webhook endpoint activo
- [ ] Event log mostrando eventos
- [ ] Bounce rate <2%
- [ ] Delivery rate >98%
- [ ] Manual email test tiene "opened" event

---

### 4. NEON DATABASE — Queries Fast

**Verificar que database responde rápido:**

```bash
# 1. Ir a: https://console.neon.tech/projects

# 2. Seleccionar tech-nova project

# 3. Ver "Monitoring" tab
# Esperado:
# - Queries: <100ms average
# - Connections: <20 of 100
# - Storage: <50% used
# - Backups: Latest <24h old

# 4. PROBAR: Query rápida
#    → En app, hacer una query:
SELECT COUNT(*) FROM leads;

#    → Mirar browser DevTools → Network
#    → ¿API response <200ms? ✅ OK
#    → Si >500ms: PROBLEM

# 5. Revisar Neon console:
#    → "Metrics" mostrando queries recientes
#    → ¿Todas <200ms? ✅ OK

# RESULTADO:
# ✅ Database healthy, queries fast
# O
# ❌ Queries slow, may need optimization
```

**Checklist:**
- [ ] Connection pool <20/100
- [ ] Storage <80% of quota
- [ ] Query latency <200ms average
- [ ] Latest backup <24h old
- [ ] No connection errors

---

### 5. VERCEL ANALYTICS — Performance Metrics

**Verificar que Vercel está midiendo performance:**

```bash
# 1. Ir a: https://vercel.com/tech-nova-next/analytics

# 2. Ver Real User Monitoring (últimas 24h)
# Esperado:
# - Page load: <2s average
# - API: <200ms average
# - CRM dashboard: <2s
# - Checkout: <1s

# 3. Si NO hay datos:
#    → Faltan usuarios (normal si es nuevo)
#    → O analytics no está configured
#    → Revisar: Vercel → Settings → Analytics

# 4. PROBAR: Visitar páginas y medir
#    → En browser, open:
https://tech-nova.mx/ (medir load time)
https://tech-nova.mx/admin/crm (medir load time)
https://tech-nova.mx/checkout/test (si existe)

#    → F12 → Network → Wait for page load
#    → Anotar tiempos:
#    - Time to First Byte (TTFB): <500ms ✅
#    - Largest Contentful Paint (LCP): <2.5s ✅
#    - Cumulative Layout Shift (CLS): <0.1 ✅

# 5. Revisar Vercel dashboard:
#    → ¿Métricas actualizadas? ✅ OK

# RESULTADO:
# ✅ Performance good, being tracked
# O
# ❌ Performance degraded or not tracked
```

**Checklist:**
- [ ] Vercel analytics enabled
- [ ] Page load data showing (últimas 24h)
- [ ] Homepage: <2s average
- [ ] API endpoints: <200ms average
- [ ] CRM dashboard: <2s average

---

### 6. ALERTS — Realmente Envían Email

**Verificar que Vic recibe alertas:**

```bash
# 1. SENTRY ALERTS
#    → Ir a: https://sentry.io/settings/[ORG]/integrations/
#    → Buscar: Email Integration
#    → Click: Create Rule
#    → Condition: On Error
#    → Action: Notify victor@tech-nova.mx
#    → SAVE

# 2. PRUEBA: Trigger error
#    → Abre: https://tech-nova.mx/[ruta-que-da-error]
#    → Espera 2 minutos
#    → ¿Vic recibe email de Sentry? 
#    → ✅ ALERTS WORKING o ❌ NO EMAIL

# 3. STRIPE ALERTS (webhook failures)
#    → Crear script que guarde webhook failures:
if (webhookFailed) {
  await logAlert('stripe_webhook_failed', {...});
  await sendEmail('victor@tech-nova.mx', 'Stripe webhook error');
}

# 4. RESEND ALERTS (bounce rate >5%)
#    → Crear cron job que chequea bounce rate:
const bounceRate = await checkResendBounceRate();
if (bounceRate > 0.05) {
  await sendAlert('victor@tech-nova.mx', `Bounce: ${bounceRate}`);
}

# 5. DB ALERTS (storage >85%)
#    → Crear trigger en Neon o check via API:
const storage = await getNeonStorage();
if (storage > 0.85) {
  await sendAlert('victor@tech-nova.mx', 'DB Storage critical');
}

# RESULTADO:
# ✅ Alerts configuradas y funcionando
# O
# ❌ Alerts not sending — NEED TO FIX
```

**Checklist:**
- [ ] Sentry alert created and tested
- [ ] Email received by victor@tech-nova.mx
- [ ] Stripe failure alerts configured
- [ ] Email bounce alerts configured
- [ ] DB health alerts configured

---

## 📋 MASTER VALIDATION CHECKLIST

```
SENTRY:
- [ ] Project visible in sentry.io
- [ ] Errors being captured (últimas 24h)
- [ ] Manual error test triggers correctly
- [ ] Alert email received by Vic

STRIPE:
- [ ] Webhook endpoint responding (200 OK)
- [ ] Recent deliveries in dashboard
- [ ] Manual webhook test processes correctly
- [ ] No delivery errors in log

RESEND:
- [ ] Email webhook active
- [ ] Events logged (sent, opened, bounced)
- [ ] Manual email sends successfully
- [ ] Open tracking works

NEON:
- [ ] Connections: <20/100 ✅
- [ ] Storage: <80% ✅
- [ ] Query latency: <200ms ✅
- [ ] Backup: latest <24h ✅

VERCEL:
- [ ] Homepage load: <2s ✅
- [ ] API response: <200ms ✅
- [ ] CRM load: <2s ✅
- [ ] Analytics data showing

ALERTS:
- [ ] Sentry → Email working
- [ ] Stripe failures → Alert working
- [ ] DB health → Alert working
- [ ] All alerts go to victor@tech-nova.mx

TOTAL: X/27 checkpoints verified
```

---

## 🔴 SI ALGO FALLA

**Si una validación falla:**

1. **Documentar:** Qué falló, cuándo, error exacto
2. **Investigar:** Revisar logs, configuración, código
3. **Fijar:** Cambiar config, code, redeploy
4. **Re-validate:** Probar de nuevo

**Ejemplos:**

```
❌ SENTRY NO RECIBE ERRORES
→ Verificar: SENTRY_DSN en .env.production
→ Verificar: Vercel deployment includes it
→ Fix: Add DSN, redeploy
→ Retest: Trigger error again

❌ STRIPE WEBHOOKS NO ENTREGANDO
→ Verificar: Endpoint URL es exacta
→ Verificar: HTTPS certificate válido
→ Fix: Update webhook endpoint if needed
→ Retest: Manual trigger

❌ EMAIL ALERTS NO ENVIANDO
→ Verificar: Resend API key válido
→ Fix: Create manual alert email via resend.emails.send()
→ Retest: Send test email, check inbox
```

---

## 📤 CÓMO REPORTAR

```
✅ MONITORING VALIDATED: FASE B.4 PRODUCCIÓN

**Timestamp:** 2026-06-04 16:15 UTC
**Validator:** Claude Code Agent

**SENTRY**
- [x] Error tracking working
- [x] Manual test passed
- [x] Alert email received
Status: ✅ LIVE

**STRIPE WEBHOOKS**
- [x] Endpoint responding
- [x] Recent deliveries OK
- [x] Manual test passed
Status: ✅ LIVE

**RESEND EMAIL**
- [x] Webhooks active
- [x] Events logged
- [x] Manual send worked
Status: ✅ LIVE

**NEON DATABASE**
- [x] Connections <20
- [x] Storage <50%
- [x] Query latency <200ms
Status: ✅ HEALTHY

**VERCEL ANALYTICS**
- [x] Homepage <2s
- [x] API <200ms
- [x] CRM <2s
Status: ✅ TRACKED

**ALERTS**
- [x] Sentry alerts working
- [x] Stripe alerts configured
- [x] DB alerts configured
Status: ✅ ENABLED

---

**VALIDATION RESULT:** 27/27 CHECKPOINTS PASSED ✅

**CONFIDENCE:** 99.9% — Sistema verificado en producción real

**NEXT:** Monitor diario durante semana 1, luego semanal
```

---

**Status:** 🔴 READY FOR REAL VALIDATION  
**Not OK until:** All 27 checkpoints pass  
**If fails:** Document error, fix, retry

**DO NOT assume it works — PROVE it works!** 🚀
