# PROMPT: SEC-GIT — Commit y push del sprint SEC-4/5

---

## 1. OBJETIVO

Limpiar el index.lock huérfano de git, commitear todos los cambios pendientes del sprint SEC-4/5, y hacer push a `origin/main`.

---

## 2. ENTREGABLES

- `.git/index.lock` eliminado
- Un commit en `main` con todos los archivos modificados del sprint SEC-4/5
- Push exitoso a `origin/main`
- Reporte en `reports/SEC_GIT_COMMIT_REPORT.md`

---

## 3. TECH STACK

- Git (ya instalado)
- PowerShell (Windows) — usar `cmd /c` si git no está en PATH del shell

---

## 4. SETUP

No se requiere instalación adic. Trabajar en la raíz del proyecto: `C:\Users\vitor\.gemini\antigravity\playground\technova`

---

## 5. CHECKLIST QA

- [ ] `index.lock` eliminado sin errores
- [ ] `git status` muestra los archivos esperados antes del commit
- [ ] `git commit` exitoso (sin errores)
- [ ] `git push origin main` exitoso (sin errores)
- [ ] `git log --oneline -3` muestra el nuevo commit en el tope

---

## 6. REFERENCIAS

Archivos que deben ir en el commit (resultado de `git diff --name-only HEAD`):

```
BACKLOG_MASTER.md
BITACORA.md
CLAUDE.md
src/app/api/checkout/[uuid]/contract/route.ts
src/app/api/checkout/[uuid]/pay/route.ts
src/app/api/checkout/[uuid]/request-changes/route.ts
src/app/api/checkout/[uuid]/route.ts
src/app/api/proposals/[uuid]/pdf/route.ts
src/proxy.ts
```

Además, cualquier archivo de `reports/` o `src/__tests__/` que esté untracked o modificado.

---

## 7. DEFINITION OF DONE

- [ ] `git push origin main` completado sin errores
- [ ] `git log --oneline -1` muestra el commit con mensaje `security(SEC-4,SEC-5): ...`
- [ ] Reporte generado en `reports/SEC_GIT_COMMIT_REPORT.md`

---

## 8. CÓMO REPORTAR

Crear `reports/SEC_GIT_COMMIT_REPORT.md` con:

```markdown
# Reporte: SEC-GIT — Commit y push

**Fecha:** <fecha>
**Estado:** ✅ COMPLETADO / ❌ FALLIDO

## Resultado
- Commit hash: <hash>
- Archivos incluidos: <lista>
- Push: ✅ exitoso

## Output de git log --oneline -3
<output>

## Notas
<cualquier issue o desviación>
```

---

## 9. TIPS & GOTCHAS

- **index.lock:** si `git add` falla con "index.lock exists", eliminarlo con `Remove-Item .git\index.lock -Force` (PowerShell) o `del .git\index.lock` (cmd).
- **npm no en PATH:** no se necesita npm para este prompt — solo git.
- **git no en PATH de bash:** usar PowerShell directamente o `cmd /c git ...`.
- **Mensaje de commit exacto a usar:**

```
security(SEC-4,SEC-5): anti-enumeración + tests del flujo de pago

- Rate limit rl:uuid 20/min en endpoints por-UUID (proxy.ts)
- Webhook Stripe excluido del rate limit
- 404 uniformes en 5 endpoints públicos (anti-enumeración)
- 6 archivos de test: leads, webhook, auth, crons, pricing, uuid-rate-limit
- 13 suites / 115 tests en verde
- BACKLOG_MASTER: SEC-4 + SEC-5 marcados DONE
- BITACORA: cierre formal del sprint SEC
```
