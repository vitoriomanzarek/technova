# 🔄 CI/CD Pipeline — TechNova

> **Audiencia:** quien configure automatización o necesite entender el flujo de git push → producción.
> **Estado actual:** deploy automático Vercel ✅; **CI (GitHub Actions) y pre-commit hooks aún NO configurados** — este doc define cómo montarlos.
> **Última verificación:** 2026-05-20.

---

## 📋 Tabla de Contenidos

1. [Estado actual vs objetivo](#1-estado-actual-vs-objetivo)
2. [Arquitectura CI/CD](#2-arquitectura-cicd)
3. [Pre-commit hooks (local)](#3-pre-commit-hooks-local)
4. [GitHub Actions workflows](#4-github-actions-workflows)
5. [Deployment pipeline (Vercel)](#5-deployment-pipeline-vercel)
6. [Secrets en CI/CD](#6-secrets-en-cicd)
7. [Testing en CI](#7-testing-en-ci)
8. [Development workflow día a día](#8-development-workflow-día-a-día)

---

## 1. Estado actual vs objetivo

| Capa | Hoy | Objetivo Fase 4 |
|------|-----|-----------------|
| Deploy a producción | ✅ Vercel auto-deploy en push a `main` | (sin cambio) |
| Preview deployments | ✅ Vercel auto en cada branch | (sin cambio) |
| Type check antes de deploy | ✅ `next build` falla si hay type errors | + check explícito en CI |
| Lint en CI | ❌ | ✅ ESLint en cada PR |
| Tests en CI | ❌ (no hay tests aún) | ✅ Vitest + Playwright |
| Pre-commit hooks | ❌ | ✅ Husky + lint-staged |
| Branch protection | ❌ cualquiera puede push a `main` | ✅ requiere PR + checks verdes |

> **Realidad importante:** hoy el único "gate" antes de producción es que `next build` compile. Eso atrapa type errors (como pasó con el Stripe apiVersion el 2026-05-20) pero NO atrapa lint issues, tests fallidos, ni lógica rota. Por eso este doc.

---

## 2. Arquitectura CI/CD

### Objetivo (cuando GitHub Actions esté configurado)

```
git push / PR
   │
   ▼
GitHub Actions
   ├─ Lint        (eslint)
   ├─ Type check  (tsc --noEmit)
   ├─ Unit tests  (vitest run)
   ├─ Build       (next build)
   └─ E2E         (playwright, contra preview URL)
   │
   ▼ (si todo verde Y es push a main)
Vercel webhook → build → deploy a tech-nova.mx
```

### Dos caminos

- **Pull Request** → corre el job de validación (lint + type + test + build). NO deploya a prod, pero Vercel genera preview.
- **Push a `main`** → corre validación + Vercel deploya a producción.

---

## 3. Pre-commit hooks (local)

Atrapan errores **antes** de que lleguen a GitHub. Más rápido que esperar el CI.

### Setup (cuando se implemente)

```bash
npm install -D husky lint-staged
npx husky init
```

Crea `.husky/pre-commit`:

```sh
npx lint-staged
```

Añade a `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "bash -c 'tsc --noEmit'"
  ],
  "*.{json,md,css}": []
}
```

### Qué corre antes de cada `git commit`

1. **ESLint con auto-fix** sobre los archivos staged.
2. **Type check** (`tsc --noEmit`) — atrapa errores de tipo antes del commit.

### Bypass de emergencia

```bash
git commit --no-verify -m "..."   # salta los hooks
```

> ⚠️ Solo usar `--no-verify` en emergencias reales (hotfix urgente). El CI igual va a correr los checks en GitHub, así que un commit que salta el hook local puede ser rechazado por branch protection.

### Prettier — decisión pendiente

No usamos Prettier hoy. El código tiene indent inconsistente (2 vs 4 espacios entre archivos). **Decisión a tomar:** adoptar Prettier (normaliza todo, pero genera un diff masivo la primera vez) o seguir con ESLint solo. Recomendación: adoptarlo en un PR aislado de "format only" cuando el equipo crezca.

---

## 4. GitHub Actions workflows

Path: `.github/workflows/`. Recomiendo 2 workflows (el de monitoring es opcional).

### Workflow 1: PR Validation — `.github/workflows/pr.yml`

```yaml
name: PR Validation

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Unit tests
        run: npm test --if-present

      - name: Build
        run: npm run build
        env:
          # Dummies — el build no ejecuta runtime, solo necesita que existan.
          DATABASE_URL: postgres://dummy:dummy@dummy/dummy
          RESEND_API_KEY: re_dummy
          STRIPE_SECRET_KEY: sk_test_dummy
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_dummy
          STRIPE_WEBHOOK_SECRET: whsec_dummy
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
          UPSTASH_REDIS_REST_URL: https://dummy.upstash.io
          UPSTASH_REDIS_REST_TOKEN: dummy
```

> **Nota sobre las env dummy:** `next build` instancia módulos que leen `process.env` (ej. `new Stripe(process.env.STRIPE_SECRET_KEY ?? '')`). Con `?? ''` no crashea, pero damos dummies por si algún módulo es estricto. NO son secrets reales.

### Workflow 2: E2E (opcional, más pesado) — `.github/workflows/e2e.yml`

```yaml
name: E2E

on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    needs: []  # corre en paralelo con validate
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: E2E tests
        run: npm run e2e --if-present
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.PREVIEW_URL }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

### Branch protection (GitHub → Settings → Branches → add rule para `main`)

Cuando los workflows estén verdes:

- ✅ Require a pull request before merging.
- ✅ Require status checks to pass: `validate` (y `e2e` si lo activas).
- ✅ Require branches to be up to date before merging.
- ✅ Do not allow bypassing the above settings (incluso admins).

Esto cierra el agujero actual de "cualquiera puede pushar código roto a `main`".

---

## 5. Deployment pipeline (Vercel)

### Integración

- Vercel está conectado al repo GitHub `vitoriomanzarek/technova` (integración tipo `github`).
- Production branch: `main`. Push a `main` → deploy automático a `tech-nova.mx`.
- Otras branches → preview deployment con URL efímera.

Detalle completo en [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md). Resumen del flujo:

```
push a main → Vercel webhook → npm install → next build → deploy → alias tech-nova.mx
```

### Verificar que un deploy llegó a producción

```bash
# Vía API (con VERCEL_TOKEN en .env)
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=prj_TIPXMWs783BkRFQRMZQCxRGvnVuJ&teamId=team_AiOzzfX4JiMUdVofOQvrlARW&target=production&limit=1" \
  | python -m json.tool | grep -E '(readyState|url)'

# O smoke test directo
curl -I https://tech-nova.mx/   # esperado 200
```

### Monitorear post-deploy

Correr el checklist de [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) §5 (5 curl checks). Si algo falla → rollback (§6 de ese doc).

### Relación CI ↔ Vercel

**Importante:** GitHub Actions y Vercel son independientes hoy. Vercel deploya aunque el CI falle (porque Vercel reacciona al push, no al status del CI). Para que el CI **bloquee** el deploy:
- Activar branch protection (§4) → impide merge a `main` si CI falla → como Vercel deploya desde `main`, nunca recibe código roto.
- El push directo a `main` se bloquea con branch protection, forzando PRs.

---

## 6. Secrets en CI/CD

### Dónde viven

- **Runtime de la app** (producción): Vercel Environment Variables. Ver [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) §2.
- **GitHub Actions**: GitHub repo → Settings → Secrets and variables → Actions.

### Secrets que necesitará GitHub Actions

| Secret | Para qué | Cuándo |
|--------|----------|--------|
| `PREVIEW_URL` | E2E contra la preview de Vercel | si activas workflow E2E |
| `VERCEL_TOKEN` | (opcional) deploy manual desde CI o smoke tests | si CI necesita hablar con Vercel |
| `DATABASE_URL_TEST` | tests de integración contra branch de test de Neon | cuando haya tests de DB |

> **Build env vars** (DATABASE_URL, STRIPE_*, etc.) NO necesitan ser secrets reales en el workflow de build — usamos dummies (ver §4). Solo los tests de integración necesitan credenciales reales, y esos deben apuntar a recursos de TEST, nunca producción.

### Cómo añadir un secret a GitHub Actions

1. GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
2. Referenciar en el workflow con `${{ secrets.NOMBRE }}`.

### Rotation

Misma política que en [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §8: rotar trimestralmente o tras exposición. Actualizar en ambos lados (Vercel + GitHub Secrets).

---

## 7. Testing en CI

Detalle completo en [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md). Resumen de cómo encaja en CI:

| Test | Cuándo corre | Timeout sugerido |
|------|--------------|------------------|
| **Lint** | cada PR | <1 min |
| **Type check** | cada PR | <1 min |
| **Unit (Vitest)** | cada PR | <2 min |
| **Build** | cada PR | <5 min |
| **E2E (Playwright)** | cada PR (workflow separado) | <10 min |

### Coverage reports

Cuando Vitest tenga coverage configurado (`@vitest/coverage-v8`):

```yaml
- name: Test with coverage
  run: npm test -- --coverage
- uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
```

Y si quieres badges/tracking: integrar Codecov o Coveralls (free para repos pequeños).

### E2E timeout

Playwright en CI puede ser lento (instala browsers). Tips:
- Cache de `~/.cache/ms-playwright`.
- `retries: 2` en CI (ya está en el `playwright.config.ts` propuesto).
- Solo Chromium en CI (no los 3 browsers) para velocidad.

---

## 8. Development workflow día a día

### Arrancar

```bash
npm run dev          # Next 16 con Turbopack, hot-reload
```

Abre http://localhost:3000.

### Ver errores

- **Frontend:** consola del browser (F12).
- **API routes / Server Components:** terminal de `npm run dev`.
- **Type errors:** `npx tsc --noEmit`.
- **Lint:** `npm run lint`.

### Debug

- Next.js muestra errores en un overlay en dev.
- Para logs verbosos de Next: `DEBUG=* npm run dev` (mucho ruido, usar selectivamente).
- Para inspeccionar requests: Network tab del browser o `console.log` en el route handler (aparece en la terminal).

### Limpiar cache cuando algo se atora

```bash
rm -rf .next node_modules/.cache
npm run dev
```

(En PowerShell: `Remove-Item -Recurse -Force .next, node_modules\.cache`)

### Flujo de un cambio típico

```
1. git checkout main && git pull
2. git checkout -b feat/mi-cambio
3. ... editar ...
4. npm run dev → validar en browser
5. npx tsc --noEmit && npm run lint → 0 errores
6. git add ... && git commit -m "feat: ..."
7. git push -u origin feat/mi-cambio
8. Abrir PR → CI corre → Vercel genera preview
9. Validar preview → merge a main
10. Vercel deploya a producción → smoke test
```

### Orden de implementación recomendado para montar todo esto (Fase 4)

1. Instalar Vitest + escribir tests de Zod (ver TESTING_STRATEGY §2).
2. Crear `.github/workflows/pr.yml` (lint + type + build, sin tests al inicio).
3. Activar branch protection requiriendo ese workflow.
4. Añadir `npm test` al workflow una vez haya tests.
5. Instalar Husky + lint-staged para feedback local.
6. Añadir Playwright + workflow E2E.
7. Coverage + badges (opcional).

---

## Para seguir leyendo

- [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) — el deploy a Vercel en detalle.
- [`TESTING_STRATEGY.md`](./TESTING_STRATEGY.md) — qué tests correr y cómo.
- [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) §8 + §11 — secrets y dependencias.
- [`MONITORING_&_OBSERVABILITY.md`](./MONITORING_&_OBSERVABILITY.md) — qué hacer post-deploy.

---

**Última actualización:** 2026-05-20
**Próxima revisión:** al crear el primer workflow real en `.github/workflows/`.
