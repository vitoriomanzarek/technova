# 📊 MONITORING PROMPT — FASE B.4 PRODUCCIÓN

**For:** Claude Code Agent (Monitoring & Alerting)  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (24/7 vigilancia)  
**Estimated Time:** 30-45 minutos  
**Timeline:** Ahora mismo

---

## 📋 OBJETIVO

Configurar **monitoreo completo** de FASE B.4 en producción para detectar problemas antes de que afecten clientes.

**Por qué:** Con dinero real en juego (pagos Stripe), necesitas visibilidad 24/7.

---

## 🎯 TAREAS

### 1. Sentry Setup — Error Tracking

**Ya debería estar, pero verifica:**

```bash
# Check Sentry in Vercel
# Vercel → tech-nova-next → Settings → Integrations → Sentry

# Expected:
✅ Sentry project conectado
✅ Error reporting activo
✅ Release tracking activo
```

**Si no está:**
```
Action:
1. Ir a sentry.io
2. Create project: tech-nova-production
3. Copy DSN
4. Agregar a Vercel env: SENTRY_DSN=https://...
5. Redeploy
```

**Config validation:**
```bash
# Visita Sentry dashboard
# Debería mostrar:
- Release: B.4.1-8 (git commit hash)
- Environment: production
- Error count: 0 (si todo OK)
- Performance: Transactions logged
```

---

### 2. Stripe Webhooks Validation

**Verificar que Stripe puede comunicarse:**

```bash
# 1. Go to Stripe Dashboard
# https://dashboard.stripe.com → Developers → Webhooks

# 2. Look for endpoint:
# https://tech-nova.mx/api/webhooks/stripe
# Status: ✅ Enabled

# 3. Check recent deliveries
# Expected events in last hour:
- payment_intent.succeeded
- checkout.session.completed
- charge.dispute.created (occasional)

# 4. If webhook failed:
# Click event → Retry
# Check response: Should be 200 OK
```

**Test webhook locally (for future testing):**
```bash
# Start server
npm run dev

# In new terminal
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test
stripe trigger checkout.session.completed

# Expected in logs:
# ✅ Webhook received
# ✅ Order created
# ✅ Email sent
```

**Production checklist:**
- [ ] Endpoint URL: https://tech-nova.mx/api/webhooks/stripe
- [ ] Status: ✅ Enabled
- [ ] Last delivery: <1h ago
- [ ] Success rate: >99%
- [ ] Signature validation: Active

---

### 3. Resend Webhooks Validation

**Check email delivery tracking:**

```bash
# 1. Go to Resend Dashboard
# https://resend.com → Webhooks

# 2. Expected webhook endpoint:
# https://tech-nova.mx/api/webhooks/resend
# Status: ✅ Enabled

# 3. Recent events (last 24h):
# - email.sent
# - email.opened
# - email.clicked
# - email.bounced (if any)

# 4. Verify logs show:
# email.sent: ~5-10 per day (B.4 workflows)
# email.opened: 30-40% of sent
# email.bounced: <1%
```

**Failure modes to watch:**
```
🔴 If email.bounced > 5%:
   → Check recipient list validity
   → Verify domain SPF/DKIM

🔴 If email.opened = 0%:
   → Check pixel tracking enabled
   → Verify no ISP blocks

🔴 If webhook delivery failing:
   → Check https cert (Let's Encrypt renewal)
   → Verify IP not on blocklist
```

---

### 4. Database Health Check

**Verify Neon database status:**

```bash
# 1. Go to Neon Console
# https://console.neon.tech → tech-nova project

# 2. Check:
✅ Database running
✅ Storage: <80% used
✅ Connections: <20 of 100 pool
✅ Backups: Last backup <24h

# 3. Run quick health query:
SELECT COUNT(*) as total_leads FROM leads;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_projects FROM projects;

# Expected:
- total_leads: >0 (should grow)
- total_orders: >0 (if customers used it)
- total_projects: >0 (if customers paid)
```

**Backup verification:**
```bash
# Neon auto-backups every 24h
# Verify in Neon console: Backups tab
# Expected: Latest backup <24h old
```

---

### 5. Performance Metrics — Vercel

**Check deployment performance:**

```
Vercel → tech-nova-next → Analytics

Expected baselines (after B.4):
- Page load: <2s
- API response: <200ms
- CRM dashboard: <2s
- Checkout flow: <1s
- PDF generation: <10s
```

**Monitor these metrics daily:**
```
🟢 Good:  <1s
🟡 Warning: 1-2s
🔴 Critical: >2s
```

---

### 6. Alert Configuration

**Set up automated alerts (email to Vic):**

#### Alert 1: Sentry Errors
```
When: New error in production
Then: Email alert with:
  - Error type
  - Stack trace
  - Affected users
  - Retry link
```

#### Alert 2: Stripe Webhook Failures
```
When: 3+ webhook delivery failures in 1h
Then: Email + Slack (if connected)
  - Error details
  - Last successful delivery
  - Action: Manual retry button
```

#### Alert 3: Resend Email Failures
```
When: Email bounce rate >5% in 24h
Then: Email alert
  - Bounce count
  - Failed recipients
  - Common bounce reason
```

#### Alert 4: Database Health
```
When: Storage >85% OR Connections >80
Then: Email alert
  - Current usage
  - Action: Plan upgrade
```

#### Alert 5: Performance Degradation
```
When: Page load >5s OR API >1s
Then: Email alert
  - Metric affected
  - Current vs baseline
  - Likely causes
```

**How to set up:**
```
Sentry:
  - Settings → Integrations → Email
  - Create rule: On Error → Notify

Vercel:
  - Settings → Integrations → (Custom)
  - Or use Vercel API to setup alerts

Stripe/Resend:
  - Already have webhooks
  - Add email notification on failures
```

---

### 7. Status Page — For Customers

**Optional but recommended:**

```bash
# Create simple status page:
# https://tech-nova.mx/status

# Show:
✅ Website: Operational
✅ API: Operational
✅ Payments: Operational
✅ Emails: Operational

# Uptime SLA targets:
- Website: 99.9% (Vercel)
- API: 99.9% (Vercel)
- Database: 99.9% (Neon)
- Email: 99.5% (Resend)
```

---

## 📋 MONITORING CHECKLIST

```
SENTRY:
- [ ] Project created or verified
- [ ] DSN in Vercel env vars
- [ ] Error tracking active
- [ ] Release tagged
- [ ] Alerts configured

STRIPE:
- [ ] Webhook endpoint active
- [ ] Recent deliveries showing
- [ ] Success rate >99%
- [ ] Signature validation enabled
- [ ] Test webhook successful

RESEND:
- [ ] Webhook endpoint active
- [ ] Email events logged
- [ ] Bounce rate <2%
- [ ] Delivery rate >98%
- [ ] Tracking pixel active

DATABASE:
- [ ] Connection: <20 of 100
- [ ] Storage: <80% used
- [ ] Latest backup: <24h old
- [ ] Query performance: <200ms

PERFORMANCE:
- [ ] Page load: <2s
- [ ] API: <200ms
- [ ] CRM: <2s
- [ ] PDF: <10s

ALERTS:
- [ ] Sentry errors: Configured
- [ ] Stripe failures: Configured
- [ ] Email failures: Configured
- [ ] DB health: Configured
- [ ] Performance: Configured
```

---

## 📊 DAILY MONITORING ROUTINE

**Each morning (5 min check):**

```bash
1. Sentry dashboard
   - Any new errors? → Investigate
   - Error count: 0? ✅

2. Stripe webhook history
   - Last delivery: <4h ago? ✅
   - Any failures? → Retry

3. Resend logs
   - Bounce rate <2%? ✅
   - Last email: <1h ago? ✅

4. Vercel Analytics
   - Performance: Green? ✅
   - Traffic: Normal? ✅

5. Neon console
   - Storage: <80%? ✅
   - Connections: <20? ✅
```

**If anything is 🔴:**
1. Click "more info"
2. Understand root cause
3. Escalate or fix
4. Log incident

---

## 📤 CÓMO REPORTAR

```
✅ MONITORING SETUP COMPLETO: FASE B.4 PRODUCCIÓN

**Timestamp:** 2026-06-04 15:30 UTC

**Sentry:**
✅ Error tracking: Active
✅ DSN: Configured
✅ Release: B.4.1-8 tagged
✅ Alerts: Email configured

**Stripe:**
✅ Webhook endpoint: Active
✅ Recent deliveries: OK
✅ Success rate: 99.8%
✅ Last event: 2h ago

**Resend:**
✅ Email webhook: Active
✅ Bounce rate: 1.2% ✅
✅ Delivery rate: 99.5% ✅
✅ Tracking: Active

**Database:**
✅ Connection pool: 8/100
✅ Storage: 45% of quota
✅ Latest backup: 2h ago
✅ Query latency: 120ms

**Performance (Vercel):**
✅ Page load: 1.2s
✅ API response: 95ms
✅ CRM dashboard: 1.8s
✅ Uptime: 100% ✅

**Alerts Configured:**
✅ Sentry errors → Email
✅ Stripe failures → Email + Retry
✅ Email bounces → Alert threshold
✅ DB health → Alert at 85%
✅ Performance → Alert at >2s

**Daily Routine:**
Created checklist for morning monitoring (5 min)

**Status:** 🟢 PRODUCTION MONITORED 24/7

**Next:** Check daily for 7 days, then weekly
```

---

## ⚠️ WHAT TO WATCH FOR

### 🔴 Critical Issues (Immediate Action)

```
Error rate >1% per hour
→ Check Sentry, find pattern, rollback if needed

Stripe webhook failing >3 consecutive
→ Check HTTPS cert, IP blocklist, Vercel status

Email delivery <95% in 24h
→ Check bounce reasons, domain SPF/DKIM

Database unavailable
→ Check Neon status, contact support

API response >1s consistently
→ Check CPU usage, query performance, scale if needed
```

### 🟡 Warning Issues (Monitor)

```
Error rate 0.5-1% per hour
→ Identify pattern, fix in next deploy

Stripe webhook occasional failure
→ Likely transient, retry usually succeeds

Email bounce 2-5%
→ Check recipient validation, may need cleanup

Performance degradation <2s → 3s
→ Scale or optimize queries
```

### 🟢 Normal

```
Error rate <0.5%
Error: Random user input errors (expected)
Stripe: >99% success, <1h between deliveries
Email: >98% delivery, <2% bounce
Performance: <2s all metrics
Database: <50% storage, <20 connections
```

---

## 🔄 MONITORING ROTATION

**Week 1:** Daily checks (every morning)
**Week 2:** Daily checks, then every other day
**Week 3+:** Every other day → Once per week

Once system is stable, can move to:
- Automated alerting only
- Weekly review
- Monthly deep-dive

---

**Status:** 🟢 READY FOR 24/7 MONITORING  
**Confidence:** 99.9% production-ready  
**Next Review:** 24h post-setup  
**Escalation:** Vic gets email alerts immediately

**GO TIME! 🚀**
