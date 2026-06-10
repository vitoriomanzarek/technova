# 🧪 TESTING EXECUTION PROMPT — FASE B.4 QA COMPLETE

**For:** Claude Code Agent (QA Runner)  
**Status:** 🔴 READY TO EXECUTE  
**Priority:** 🔴 CRÍTICA (Antes de cualquier deploy)  
**Estimated Time:** 3-4 horas  
**Timeline:** Después de B.4.8 completado  
**Depends on:** ✅ B.4.1-8 COMPLETADOS (100%)

---

## 📋 OBJETIVO

Ejecutar **suite completa de testing** (90 tests) para validar que toda la FASE B.4 (COMMERCIAL FLOW) funciona correctamente. Incluye:

- ✅ 40 Unit Tests (funciones aisladas)
- ✅ 20 Integration Tests (APIs + BD + workflows)
- ✅ 26 Manual Scenarios (pasos reales)
- ✅ 4 Performance Tests (carga)

**Por qué es crítico:** Sin esto, Vic no puede estar seguro de que el sistema funciona en producción. Un fallo en pagos o emails = pérdida de ingresos.

---

## 🎯 ENTREGABLES

### 1. Unit Tests Execution
**Archivo:** `npm test -- --coverage`

**Qué hacer:**

```bash
# 1. Instalar dependencias (si no están)
npm install

# 2. Ejecutar todos los tests
npm test -- --coverage

# 3. Revisar output:
# - Num tests passed: X/90
# - Coverage: >80%
# - Failed tests (si alguno): listar
```

**Esperado:**
```
PASS: src/lib/audit-website.test.ts (5 tests)
PASS: src/lib/generate-proposal.test.ts (5 tests)
PASS: src/components/admin/ProposalSelector.test.ts (5 tests)
...
==============================
TEST SUITES: 20 passed
TESTS: 90 passed
COVERAGE: 82%
```

**Si hay fallos:**
- [ ] Revisar error message
- [ ] Identificar qué está roto (ej: B.4.3 dashboard filtering)
- [ ] Crear issue en git
- [ ] Reportar a Vic

### 2. Manual Scenario Testing (36 Scenarios)

**Archivo de referencia:** `docs/TESTING_GUIDE_B4.md`

**Estructura:** 36 scenarios, 5 por cada feature (B.4.1-8)

#### Scenario List:
```
B.4.1 (Auditoría):
  ✓ Scenario 1: Lead magnet → auditoría automática
  ✓ Scenario 2: Auditoría con sitio lento
  ✓ Scenario 3: Sitio roto (404)
  ✓ Scenario 4: Score determinista
  ✓ Scenario 5: Audit report profesional

B.4.2 (Propuesta):
  ✓ Scenario 6: Propuesta auto-generada
  ✓ Scenario 7: Respeta presupuesto
  ✓ Scenario 8: PM Fee 20% correcto
  ✓ Scenario 9: ... (etc)

[Y así con B.4.3-8, total 36 scenarios]
```

**Cómo ejecutar cada scenario:**

1. Leer scenario en `docs/TESTING_GUIDE_B4.md`
2. Seguir pasos exactos
3. Verificar ✅ al lado de cada checkpoint
4. Si falla un paso → STOP, reportar
5. Si pasa todo → marcar ✅ y continuar

**Herramientas necesarias:**
- Browser (Chrome/Firefox)
- Dev server: `npm run dev` (http://localhost:3000)
- Email testing: Resend test mode (automático)
- Stripe test cards:
  - 4242 4242 4242 4242 = Success
  - 5555 5555 5555 4444 = Decline
  - 4000 0000 0000 0002 = Requires auth

### 3. Integration Test Report

**Qué reportar para cada suite:**

```markdown
## B.4.1: Auditoría IA

**Unit Tests:** 5/5 ✅
- ✅ Puppeteer abre URL válida
- ✅ Claude Haiku genera score válido
- ✅ Campos de auditoría completos
- ✅ URL inválida lanza error
- ✅ Timeout manejo

**Integration Tests:** 5/5 ✅
- ✅ Lead con website_url dispara auditoría
- ✅ Email notificación a Vic
- ✅ API /api/audits/create funciona
- ✅ Auditoría se persiste en BD
- ✅ Múltiples auditorías del mismo lead

**Manual Scenarios:** 5/5 ✅
- ✅ Scenario 1: Lead magnet → auditoría
- ✅ Scenario 2: Sitio lento
- ✅ Scenario 3: Sitio roto (404)
- ✅ Scenario 4: Score determinista
- ✅ Scenario 5: Audit report profesional

**Edge Cases:** 5/5 ✅
- ✅ URL con caracteres especiales
- ✅ URL que redirige (301/302)
- ✅ HTTPS vs HTTP
- ✅ Sitio con protección WAF
- ✅ Lead sin website_url

**Summary:**
- Total tests: 20/20 ✅
- Time: ~15 min
- Blockers: None
- Ready for production: YES
```

**Repetir para B.4.2, B.4.3, ... B.4.8**

### 4. Performance Test Report

```bash
# Ejecutar load tests
npm test -- performance

# Esperado:
# - 10 auditorías simultáneas: <30s ✅
# - 20 propuestas generadas: <20s ✅
# - 100 emails en batch: <10s ✅
# - CRM con 500 leads: <2s ✅
```

### 5. Final Checklist

Antes de declarar "TESTING COMPLETE":

```
PRE-TESTING:
- [ ] Node.js v18+ instalado
- [ ] npm install ejecutado
- [ ] .env.test configurado (test DB)
- [ ] Stripe test keys en env

UNIT TESTS:
- [ ] npm test pasado
- [ ] Coverage >80%
- [ ] 0 warnings/errors

INTEGRATION TESTS:
- [ ] GET /api/cron/proposal-timeout funciona
- [ ] POST /api/checkout/{uuid}/pay retorna Stripe session
- [ ] Webhook /api/webhooks/stripe procesa eventos
- [ ] Emails enviados por Resend (test mode)

MANUAL SCENARIOS:
- [ ] Todos 36 scenarios completados
- [ ] Documentadas capturas de pantalla (si posible)
- [ ] Tiempos registrados (auditoría, propuesta, email)

PERFORMANCE:
- [ ] 10 audits: <30s
- [ ] 100 emails: <10s
- [ ] CRM load: <2s

PRODUCTION READINESS:
- [ ] Cero fallos críticos (P0)
- [ ] Máximo 2 fallos menores (P2)
- [ ] Todos los warnings resueltos
- [ ] Code coverage >80%
- [ ] Performance targets met
```

---

## 📋 INSTALACIÓN & SETUP

### 1. Preparar entorno
```bash
cd ~/tech-nova/
npm install
```

### 2. Config test database
```bash
# .env.test (crear si no existe)
DATABASE_URL="postgresql://user:pass@localhost:5432/technova_test"
STRIPE_SECRET_KEY="sk_test_..."
RESEND_API_KEY="re_test_..."
CRON_SECRET="test-secret-123"
```

### 3. Crear BD de test
```bash
npm run db:reset:test
```

### 4. Iniciar servidor dev (para manual scenarios)
```bash
npm run dev
# Abre en http://localhost:3000
```

---

## 🧪 DETALLE: UNIT TESTS

Ejecutar con:
```bash
npm test -- --coverage --verbose
```

**Output esperado:**

```
 PASS  src/lib/audit-website.test.ts
  auditWebsite
    ✓ should launch browser and navigate to valid URL (145ms)
    ✓ should return audit score between 0-100 (2345ms)
    ✓ should include all 17 audit points (2189ms)
    ✓ should throw error on invalid URL (234ms)
    ✓ should timeout after 30 seconds (31234ms)

 PASS  src/lib/generate-proposal.test.ts
  generateProposal
    ✓ should select valid modules from catalog (1234ms)
    ✓ should not exceed client budget (876ms)
    ✓ should validate modules against catalog (123ms)
    ✓ should calculate PM fee as exactly 20% (45ms)
    ✓ should calculate timeline correctly (67ms)

 [... 10 more test files ...]

Test Suites:  20 passed, 20 total
Tests:        90 passed, 90 total
Coverage:     82.5%
Time:         ~15 minutes
```

Si hay fallos:
```
 FAIL  src/components/admin/ProposalSelector.test.ts
  ModuleSelector
    ✗ should recalculate price when module is added (567ms)
      
      Expected: 30000
      Received: 29500
      
      at Object.<anonymous> (src/components/admin/ProposalSelector.test.ts:45:12)
```

**Acciones si hay fallos:**
1. Leer error mensaje
2. Abrir archivo de test
3. Ver qué se espera vs qué se recibió
4. Check si el código implementado es correcto
5. Si no: fijar código + re-run test
6. Si sí: fijar test expectations

---

## 🧪 DETALLE: MANUAL SCENARIOS

**Template para cada scenario:**

```markdown
### Scenario X: [Nombre]

**Preconditions:**
- Dev server running (npm run dev)
- Database seeded with test data
- Stripe in test mode

**Steps:**
1. Go to [URL]
2. Perform action [X]
3. Verify [Y appears]
4. [Next step]

**Expected Result:**
- ✅ [Checkpoint 1 passes]
- ✅ [Checkpoint 2 passes]
- ✅ [Checkpoint 3 passes]

**Actual Result:**
- ✅ [What you saw]

**Status:** ✅ PASS / ❌ FAIL
**Duration:** 5 min
**Notes:** [If any issues encountered]
```

**Ejecutar scenarios:**
1. B.4.1: Scenarios 1-5 (~25 min)
2. B.4.2: Scenarios 6-10 (~25 min)
3. B.4.3: Scenarios 11-15 (~20 min)
4. B.4.4: Scenarios 16-20 (~25 min)
5. B.4.5: Scenarios 21-25 (~20 min)
6. B.4.6: Scenarios 26-30 (~30 min) ← Más lento por Stripe
7. B.4.7: Scenarios 31-33 (~20 min)
8. B.4.8: Scenarios 34-36 (~15 min)

**Total tiempo manual:** ~180 min (~3 horas)

---

## 📊 REPORTING TEMPLATE

Al terminar, crear un report como este:

```markdown
# TESTING REPORT — FASE B.4 COMMERCIAL FLOW

**Date:** 2026-06-03  
**Tester:** [Nombre]  
**Environment:** Development  
**Duration:** 3h 45m  

## Executive Summary

✅ **TESTING PASSED** — Sistema listo para producción

- Unit Tests: 90/90 ✅
- Coverage: 83% ✅
- Manual Scenarios: 36/36 ✅
- Performance: All targets met ✅
- Blockers: None ✅

## Detailed Results

### Unit Tests
- 40 unit tests: **40/40 PASS**
- 20 integration tests: **20/20 PASS**
- Code coverage: **83%**
- Execution time: **14m 32s**

### Manual Scenarios
- B.4.1 Auditoría: **5/5 PASS**
- B.4.2 Propuesta: **5/5 PASS**
- B.4.3 Dashboard Vic: **5/5 PASS**
- B.4.4 Envío Cliente: **5/5 PASS**
- B.4.5 Ecommerce: **5/5 PASS**
- B.4.6 Stripe: **5/5 PASS**
- B.4.7 Dashboard Cliente: **3/3 PASS**
- B.4.8 CRM: **3/3 PASS**

### Performance Tests
- 10 audits simultáneas: **8.2s** (<30s) ✅
- 100 emails batch: **7.5s** (<10s) ✅
- CRM 500 leads: **1.8s** (<2s) ✅

### Issues Found
**Critical (P0):** 0
**Major (P1):** 0
**Minor (P2):** 0
**Cosmetic (P3):** 0

### Recommendations
- [If any] Feature X needs improvement: ...
- [If any] Performance: ...
- [If any] UX: ...

## Sign-off

- QA Lead: [Name] ✅
- Product Owner (Vic): [TBD]
- Ready for Production: **YES**

Next Steps:
1. Get Vic approval
2. Deploy to staging
3. Final smoke tests
4. Deploy to production
```

---

## 🎯 DEFINITION OF DONE

✅ **Testing Complete When:**

- [ ] Unit tests: 90/90 passing
- [ ] Coverage: >80%
- [ ] Manual scenarios: 36/36 passing
- [ ] Performance targets: All met
- [ ] Report generated: Complete + signed off
- [ ] Blockers resolved: None remaining
- [ ] Git: All tests committed to branch `test/phase-b4-complete`

---

## 📤 CÓMO REPORTAR

Cuando termines:

```
✅ TESTING COMPLETO: FASE B.4 COMMERCIAL FLOW (100% LISTO PARA PRODUCCIÓN)

**Resumen Ejecutivo:**
- 90/90 tests pasados ✅
- Coverage: 83%
- 36/36 manual scenarios ✅
- Performance: Todos los targets cumplidos ✅
- Blockers: NINGUNO

**Resultados:**
- Unit tests: 40/40 ✅
- Integration tests: 20/20 ✅
- Manual scenarios: 36/36 ✅
- Performance: 4/4 ✅

**Tiempo Total:**
- Unit/Integration: 14m 32s
- Manual Scenarios: 3h 15m
- Performance: 8m 30s
- **TOTAL: 3h 38m**

**Reporte Completo:**
[Copiar TESTING_REPORT.md adjunto]

**Próximos Pasos:**
1. Vic revisa y aprueba
2. Deploy a staging
3. Smoke tests finales
4. Deploy a producción

**Status:** 🟢 LISTO PARA PRODUCCIÓN
```

---

## 💡 TIPS & GOTCHAS

1. **Stripe Test Cards:**
   - 4242 4242 4242 4242 = Success (cualquier fecha/CVC)
   - 5555 5555 5555 4444 = Card Declined
   - Expiración: Cualquiera futura (ej 12/25)
   - CVC: Cualquiera (ej 123)

2. **Resend Test Mode:**
   - No envía emails reales
   - Logs aparecen en terminal
   - Webhooks se simulan

3. **Performance Targets:**
   - Auditoría: <30s (Puppeteer es lento)
   - Email batch: <10s (async es rápido)
   - CRM load: <2s (React es rápido)

4. **Si un test falla:**
   - NO continuar sin arreglarlo
   - Investigar root cause
   - Fijar código o test
   - Re-run para confirmar

5. **Documentación:**
   - Referencia: `docs/TESTING_GUIDE_B4.md`
   - Cada scenario tiene pasos exactos
   - Capturas de pantalla son útiles

6. **Git Setup:**
   - Crear rama: `git checkout -b test/phase-b4-complete`
   - Commit report: `git commit -am "test: phase B.4 complete, all 90 tests pass"`
   - Push: `git push origin test/phase-b4-complete`

---

**Created:** 2026-06-03  
**Owner:** QA Team / Claude Code Agent  
**Status:** 🔴 READY TO EXECUTE  
**Expected Duration:** 3-4 horas  
**Next:** After completion → Deploy staging → Production

**🎉 FASE B.4 = 100% BUILT, NOW VALIDATE!**
