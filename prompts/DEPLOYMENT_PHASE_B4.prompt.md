# 🚀 DEPLOYMENT PROMPT — FASE B.4 A PRODUCCIÓN

**For:** Claude Code Agent (Deployment)  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA  
**Estimated Time:** 15-20 minutos  
**Timeline:** AHORA

---

## 📋 OBJETIVO

Desplegar FASE B.4 (COMMERCIAL FLOW completo) a producción:
- ✅ Unit tests: 72/72 PASADOS
- ✅ Código: Build-ready
- ✅ Variables de entorno: Configuradas
- 🎯 ACCIÓN: Merge → Build → Deploy

---

## 🎯 TAREAS

### 1. Git: Merge a Main

```bash
# 1. Ver estado actual
git status
git branch

# 2. Checkout main
git checkout main

# 3. Pull latest
git pull origin main

# 4. Merge branch con B.4 (feature branch)
# Si los cambios ya están en main: SKIP esto
# Si están en rama: git merge feature/B.4-complete

# 5. Push a origin
git push origin main
```

**Esperado:**
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

### 2. Verificar Commit History

```bash
# Ver últimos commits
git log --oneline -10

# Esperado:
# abc1234 feat: Phase B.4 complete, all 72 tests pass ✅
# def5678 feat(b4.8): CRM + email workflows
# ghi9012 feat(b4.7): client dashboard + onboarding
# [... más B.4 commits ...]
```

### 3. Verificar Vercel Status

**Ir a:** https://vercel.com/dashboard

**Buscar:** tech-nova-next project

**Verificar:**
- [ ] Último deployment: SUCCESS ✅
- [ ] Build time: <5 min
- [ ] Logs: Sin errores (warnings OK)
- [ ] Environment variables: Todas configuradas

```
Deployment History:
✅ Production: tech-nova.mx (LIVE)
  - Deployed 6m ago by GitHub push
  - Build: Success (3m 42s)
  - Status: Ready
```

### 4. Vercel Build Log Check

Si la build falló o está en progreso:

```bash
# Vercel auto-detecta el push a main
# BUILD AUTOMÁTICO inicia en 10-15 seg
# Monitorear: https://vercel.com/tech-nova-next/deployments

# Buscar errores:
# ❌ Build errors → reportar
# ⚠️ Warnings → OK (si no son críticos)
# ✅ Build success → proceder
```

### 5. Post-Deployment Smoke Tests

Una vez que Vercel dice "READY":

```bash
# Test 1: Homepage carga
curl https://tech-nova.mx/ | grep "BIENVENIDO"
# Esperado: página HTML con contenido

# Test 2: Admin dashboard
curl -H "Authorization: Bearer $ADMIN_DASHBOARD_TOKEN" \
  https://tech-nova.mx/admin/proposals-review
# Esperado: 200 OK

# Test 3: CRM dashboard
curl -H "Authorization: Bearer $ADMIN_DASHBOARD_TOKEN" \
  https://tech-nova.mx/admin/crm
# Esperado: 200 OK, JSON con funnel data

# Test 4: API health
curl https://tech-nova.mx/api/health
# Esperado: { "status": "ok" }
```

### 6. Env Vars Final Check

**Vercel → tech-nova-next → Settings → Environment Variables**

Verificar que TODAS existan (sin revelar valores):

```
✅ DATABASE_URL (Neon)
✅ STRIPE_SECRET_KEY (sk_live_...)
✅ STRIPE_WEBHOOK_SECRET (whsec_...)
✅ RESEND_API_KEY (re_...)
✅ RESEND_WEBHOOK_SECRET (...)
✅ ADMIN_DASHBOARD_TOKEN (...)
✅ CRON_SECRET (...)
✅ JWT_SECRET (...)
✅ CALENDLY_URL (https://calendly.com/...)
```

Si falta alguna:
```
⚠️ MISSING: CRON_SECRET
Action: Add to Vercel → redeploy
```

### 7. Database Migrations Check

```bash
# Verificar que todas las tablas existen en producción:
# - leads (con status, scores, timestamps)
# - audits (con findings, score)
# - proposals (con modules_json, total_cost)
# - orders (con status, payment_percentage)
# - projects (con status, kickoff_date)
# - contracts (con signed_at)
# - proposal_tracking (con sent_at, opened_at)
# - email_events (con sent_at, opened_at)
# - client_tokens (con token, expires_at)

# Si falta tabla: 
# npx drizzle-kit push:pg
```

---

## 📋 DEPLOYMENT CHECKLIST

```
GIT & CODE:
- [ ] Cambios en main
- [ ] Commits visibles: git log -10
- [ ] No hay conflictos

VERCEL BUILD:
- [ ] Build iniciada automáticamente
- [ ] Build exitosa (<5 min)
- [ ] Logs sin errores
- [ ] Deployment: READY

ENV VARS:
- [ ] Todas 9 variables presentes
- [ ] No hay valores hardcoded
- [ ] CRON_SECRET configurado (random)
- [ ] JWT_SECRET configurado (random)

POST-DEPLOY TESTS:
- [ ] tech-nova.mx carga
- [ ] /admin/proposals-review: 200 OK
- [ ] /admin/crm: 200 OK
- [ ] API health: { "status": "ok" }

PRODUCTION LIVE:
- [ ] Monitorear Sentry (errors)
- [ ] Monitorear logs (warnings)
- [ ] Verificar Stripe webhooks entrando
- [ ] Verificar Resend webhooks entrando
```

---

## 📤 CÓMO REPORTAR

Cuando termines, reporta así:

```
✅ DEPLOYMENT COMPLETO: FASE B.4 EN PRODUCCIÓN

**Deployment Timestamp:** 2026-06-04 14:32 UTC
**Deployer:** Claude Code Agent
**Git Commit:** abc1234 (feat: Phase B.4 complete)

**Build Status:**
✅ Build exitosa (3m 42s)
✅ No hay errores
⚠️ 2 warnings (ignorables)

**Env Vars:**
✅ 9/9 variables configuradas
✅ CRON_SECRET: Agregado
✅ JWT_SECRET: Agregado

**Smoke Tests:**
✅ Homepage carga (200)
✅ Admin dashboard: 200
✅ CRM dashboard: 200
✅ API health: { "status": "ok" }

**Vercel Status:**
✅ Production: tech-nova.mx LIVE
✅ Deployment ready
✅ No downtime

**Monitoring Setup:**
✅ Sentry active
✅ Error logs: Clear
✅ Stripe webhooks: Connected
✅ Resend webhooks: Connected

**Next Steps:**
1. Vic verifica en producción
2. Monitore Sentry por 24h
3. Si todo OK: Comunicar a clientes
4. Marcar: FASE B.4 SHIPPED 🚀

**Confirmation Link:**
https://tech-nova.mx/admin/crm → Funciona? Deployment exitoso!
```

---

## ⚠️ SI ALGO FALLA

### Build failed en Vercel
```
Action:
1. Ver logs en Vercel dashboard
2. Identificar error
3. Si es env var: Agregar en Vercel
4. Si es código: Revisar git status
5. Fix → Push → Vercel re-build automático
```

### Post-deploy test falló
```
Action:
1. Check Sentry para error details
2. Revisar logs en Vercel "Runtime Logs"
3. Si es database: Verificar conexión
4. Si es API: Verificar env vars
5. Escalate a Vic si es serio
```

### Env var missing
```
Action:
1. Identificar cuál falta (ej: CRON_SECRET)
2. Ir a Vercel → Settings → Environment Variables
3. Agregar con valor correcto
4. Redeploy (botón en Vercel)
```

---

## 🎯 SUCESO = TODOS ESTOS ✅

```
Git push → main updated
    ↓
Vercel detects → Build starts
    ↓
Build completes (3-5 min) → Success
    ↓
Smoke tests pass → API responds
    ↓
tech-nova.mx alive con B.4.1-8
    ↓
📊 FASE B.4 SHIPPED 🚀
```

---

## 📊 TIMELINE

```
Ahora: Ejecutar prompt
  ↓
+2 min: Git merge
  ↓
+3 min: Vercel detecta + build comienza
  ↓
+5 min: Build completa
  ↓
+3 min: Smoke tests
  ↓
+2 min: Reportar
  ↓
TOTAL: ~15 minutos → PRODUCCIÓN LIVE
```

---

**Status:** 🚀 READY FOR PRODUCTION  
**Confidence:** 99.9% (72 tests passed)  
**Rollback Plan:** Simple git revert si hay emergency  
**Monitoring:** Sentry + Vercel logs (24/7)

**GO GO GO! 🚀**
