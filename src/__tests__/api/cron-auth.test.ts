import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { requireCronAuth } from '@/lib/cron-auth';

// SEC-5 — Tests del helper de auth de crons (SEC-2, fail-closed).

const CRON_SECRET = 'test-cron-secret-abc';
const ADMIN_TOKEN = 'test-admin-token-xyz';

function req(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/cron/daily', { headers });
}

beforeEach(() => {
  vi.stubEnv('CRON_SECRET', CRON_SECRET);
  vi.stubEnv('ADMIN_DASHBOARD_TOKEN', ADMIN_TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('requireCronAuth — fail-closed', () => {
  it('sin CRON_SECRET ni ADMIN_DASHBOARD_TOKEN → 503', () => {
    vi.stubEnv('CRON_SECRET', '');
    vi.stubEnv('ADMIN_DASHBOARD_TOKEN', '');

    const res = requireCronAuth(req({ authorization: 'Bearer whatever' }));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(503);
  });
});

describe('requireCronAuth — rechazos', () => {
  it('sin headers → 401', () => {
    const res = requireCronAuth(req());
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it('Bearer incorrecto → 401', () => {
    const res = requireCronAuth(req({ authorization: 'Bearer not-the-secret-xx' }));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it('x-admin-token incorrecto → 401', () => {
    const res = requireCronAuth(req({ 'x-admin-token': 'not-the-token-xx' }));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });

  it('token correcto en query param ya NO autoriza (se eliminó por SEC-2)', () => {
    const request = new Request(`http://localhost/api/cron/daily?token=${CRON_SECRET}`);
    const res = requireCronAuth(request);
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
  });
});

describe('requireCronAuth — autorizados', () => {
  it('Bearer CRON_SECRET correcto → null (autorizado)', () => {
    const res = requireCronAuth(req({ authorization: `Bearer ${CRON_SECRET}` }));
    expect(res).toBeNull();
  });

  it('x-admin-token correcto → null (autorizado)', () => {
    const res = requireCronAuth(req({ 'x-admin-token': ADMIN_TOKEN }));
    expect(res).toBeNull();
  });

  it('Bearer correcto autoriza aunque ADMIN_DASHBOARD_TOKEN no exista', () => {
    vi.stubEnv('ADMIN_DASHBOARD_TOKEN', '');
    const res = requireCronAuth(req({ authorization: `Bearer ${CRON_SECRET}` }));
    expect(res).toBeNull();
  });
});
