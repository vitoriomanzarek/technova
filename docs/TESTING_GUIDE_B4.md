# 🧪 Testing Guide — FASE B.4 Commercial Flow

**Versión:** 1.0 | **Fecha:** 2026-06-04

## Setup
```bash
npm install && npm run dev   # http://localhost:3000
```
Stripe test card: `4242 4242 4242 4242` (any date/CVC)

## Unit Tests (automáticos — 72 tests)
```bash
npm test              # 72/72 pass, ~7s
npm run test:coverage
```

## Escenarios Manuales (26 scenarios)

### B.4.1 Auditoría
1. Lead con URL válida → auditoría → `audits.status='completed'` + email a Vic
2. URL inválida → `audits.status='error'`
3. Auditoría dispara propuesta automáticamente

### B.4.2 Propuesta
4. `proposals.precio_total / 100 <= lead.presupuesto_estimado`
5. `pm_fee_20_pct = precio_subtotal_tecnico * 0.20` (exacto)
6. Todos los `modulo_id` existen en catálogo

### B.4.3 Dashboard Vic
7. Sin token → 401 en `/admin/proposals-review`
8. Con token → lista propuestas visible
9. Aprobar → status=approved + email Vic
10. Modificar módulos → precio recalcula + status=modified

### B.4.4 Envío Cliente
11. Enviar → `status=client_reviewing` + email al lead
12. `/propuesta/{uuid}` carga audit score + módulos
13. PDF descargable desde landing page

### B.4.5 Ecommerce
14. Deseleccionar módulo → precio baja (subtotal + 20% PM fee)
15. `localStorage` persiste carrito al cerrar pestaña
16. "Solicitar cambios" → email a Vic con diff

### B.4.6 Stripe + Contrato
17. Pago 4242... → `/checkout/{uuid}/success` + `orders.status=paid` + `projects` creado
18. `/api/checkout/{uuid}/contract` → PDF con términos legales
19. Success page muestra kickoff date + link contrato

### B.4.7 Dashboard Cliente
20. `/cliente/dashboard?token=...` → cookie seteada + dashboard carga
21. Timeline fases visibles con fechas calculadas
22. Sin cookie → 401

### B.4.8 CRM
23. `/admin/crm` → funnel visual + tabla leads
24. `GET /api/cron/email-automation?token=...` → `{ success: true }`
25. `GET /api/cron/second-payment-reminder?token=...` → `{ success: true }`
26. Resend webhook `email.opened` → actualiza `emailEvents.opened_at`

## Performance Targets
| Test | Target |
|------|--------|
| Auditoría (Puppeteer) | < 60s |
| Propuesta IA (Claude Haiku) | < 30s |
| PDF generation | < 10s |
| CRM dashboard | < 2s |
