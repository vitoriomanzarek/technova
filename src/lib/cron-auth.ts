import { NextResponse } from 'next/server';

/**
 * Auth compartida para rutas /api/cron/* (SEC-2, auditoría 2026-06-12).
 *
 * Política FAIL-CLOSED:
 *   - Sin CRON_SECRET ni ADMIN_DASHBOARD_TOKEN configurados → 503 (antes: pasaba cualquiera).
 *   - Token inválido o ausente → 401.
 *
 * Tokens aceptados (solo headers — el query param `?token=` se eliminó porque
 * los URLs quedan en logs de Vercel):
 *   1. `Authorization: Bearer <CRON_SECRET>` — Vercel Cron lo envía automático
 *      cuando la env var CRON_SECRET existe en el proyecto.
 *   2. `x-admin-token: <ADMIN_DASHBOARD_TOKEN>` — para triggers manuales (curl).
 *
 * Comparación constant-time (mismo patrón que src/proxy.ts).
 */

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Devuelve `null` si la request está autorizada; si no, la NextResponse de error
 * que la ruta debe retornar tal cual.
 *
 * Uso:
 *   const unauthorized = requireCronAuth(request);
 *   if (unauthorized) return unauthorized;
 */
export function requireCronAuth(request: Request): NextResponse | null {
  const cronSecret = process.env.CRON_SECRET;
  const adminToken = process.env.ADMIN_DASHBOARD_TOKEN;

  if (!cronSecret && !adminToken) {
    console.error('[cron-auth] Ni CRON_SECRET ni ADMIN_DASHBOARD_TOKEN configurados — cron bloqueado (fail-closed).');
    return NextResponse.json(
      { success: false, error: 'Cron deshabilitado: falta CRON_SECRET.' },
      { status: 503 },
    );
  }

  const bearer = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const adminHeader = request.headers.get('x-admin-token') ?? '';

  const okBearer = !!cronSecret && constantTimeEqual(bearer, cronSecret);
  const okAdmin = !!adminToken && constantTimeEqual(adminHeader, adminToken);

  if (!okBearer && !okAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
