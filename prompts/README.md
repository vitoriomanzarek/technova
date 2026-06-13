# 📋 Prompts para Claude Code (Windows/Mac/Linux)

Este directorio contiene los prompts de ejecución para cada task de **Fase B.4 (COMMERCIAL FLOW)**.

Cada prompt es **COMPLETO Y AUTÓNOMO** — el agente no necesita contexto adicional.

---

## 📂 Archivos

| Archivo | Task | Status | Descripción |
|---------|------|--------|-------------|
| `B.4.1_AUDITORIA_AUTOMATICA.prompt.md` | B.4.1 | ✅ EJECUTADO | Auditoría automática (Puppeteer + Claude Haiku) |
| `B.4.2_PROPUESTA_AUTOMATICA.prompt.md` | B.4.2 | ✅ EJECUTADO | Propuestas IA automáticas (catalog.ts + Claude Haiku) |
| `B.4.3_DASHBOARD_VIC.prompt.md` | B.4.3 | ✅ EJECUTADO | Panel de revisión para Vic |
| `B.4.4_ENVIO_PROPUESTA.prompt.md` | B.4.4 | ✅ EJECUTADO | Email + landing /propuesta/{uuid} |
| `B.4.5_ECOMMERCE_DINAMICO.prompt.md` | B.4.5 | ✅ EJECUTADO | Checkout dinámico (cliente refina) |
| `B.4.6_INTEGRACION_STRIPE.prompt.md` | B.4.6 | ✅ EJECUTADO | Contrato + pago 50%+50% |
| `B.4.7_ONBOARDING.prompt.md` | B.4.7 | ✅ EJECUTADO | Dashboard cliente post-pago |
| `B.4.8_CRM_WORKFLOWS.prompt.md` | B.4.8 | ✅ EJECUTADO | CRM + email workflows (FINAL) |
| `SEC-4_5_HARDENING.prompt.md` | SEC-4/5 | 🔴 PRÓXIMO | Anti-enumeración + tests flujo de pago (auditoría D-029) |

---

## 🚀 CÓMO USAR

### **WINDOWS (Powershell):**

```powershell
# Copiar prompt al clipboard
Get-Content prompts/B.4.3_DASHBOARD_VIC.prompt.md | Set-Clipboard
Write-Host "✅ Prompt copiado al clipboard"
```

Luego:
1. Abre Claude Code
2. Pega (Ctrl+V)
3. Presiona Enter

---

### **WINDOWS (cmd.exe):**

```cmd
type prompts/B.4.3_DASHBOARD_VIC.prompt.md | clip
echo ✅ Prompt copiado
```

Luego:
1. Abre Claude Code
2. Pega (Ctrl+V)
3. Presiona Enter

---

### **macOS:**

```bash
cat prompts/B.4.3_DASHBOARD_VIC.prompt.md | pbcopy && echo "✅ Prompt copiado"
```

Luego:
1. Abre Claude Code
2. Pega (Cmd+V)
3. Presiona Enter

---

### **Linux (xclip):**

```bash
cat prompts/B.4.3_DASHBOARD_VIC.prompt.md | xclip -selection clipboard && echo "✅ Prompt copiado"
```

Luego:
1. Abre Claude Code
2. Pega (Ctrl+V)
3. Presiona Enter

---

## 📋 ESTRUCTURA DE CADA PROMPT

Cada prompt sigue este formato:

1. **OBJETIVO** — Qué se debe hacer
2. **ENTREGABLES** — Qué crear/modificar
3. **TECH STACK** — Librerías, versiones
4. **SETUP** — Instalación, env vars, DB
5. **CHECKLIST QA** — Tests + validaciones
6. **REFERENCIAS** — Docs + código existente
7. **DEFINITION OF DONE** — Checklist final
8. **CÓMO REPORTAR** — Formato de respuesta esperado
9. **TIPS & GOTCHAS** — Pitfalls + soluciones

---

## ✅ FLUJO DE EJECUCIÓN

```
B.4.1 AUDITORIA        → ✅ COMPLETADO (9m 32s)
       ↓
B.4.2 PROPUESTA        → ✅ COMPLETADO (11m 45s)
       ↓
B.4.3 DASHBOARD        → ✅ COMPLETADO (10m 18s)
       ↓
B.4.4 EMAIL + LANDING  → ✅ COMPLETADO (9m 17s)
       ↓
B.4.5 ECOMMERCE        → ✅ COMPLETADO (7m 12s)
       ↓
B.4.6 STRIPE + CONTRATO → ✅ COMPLETADO (~8-10m)
       ↓
B.4.7 ONBOARDING       → ✅ COMPLETADO (~8-9m)
       ↓
B.4.8 CRM + WORKFLOWS  → 🔴 SIGUIENTE (FINAL)
```

Cada task **DEPENDE** del anterior (BD tables, funciones, etc.).

---

## 📌 DOCUMENTACIÓN RELACIONADA

- `COMMERCIAL_FLOW_v2_FINAL.md` — Especificación completa del flujo (todos los stages)
- `BACKLOG_MASTER.md` — Roadmap completo Fase B
- `docs/technical/` — Documentación técnica de referencia

---

## 🎯 PRÓXIMO PROMPT (FINAL B.4)

Cuando B.4.7 esté completo, usa:

```powershell
# Windows
Get-Content prompts/B.4.8_CRM_WORKFLOWS.prompt.md | Set-Clipboard
```

```bash
# Mac
cat prompts/B.4.8_CRM_WORKFLOWS.prompt.md | pbcopy
```

---

**Created:** 2026-06-02  
**Updated:** 2026-06-03 (B.4.7 COMPLETADO, B.4.8 FINAL ready)  
**Mantenido por:** Vic + Claude Code Team
