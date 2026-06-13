import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// SEC-5 — Tests del gate admin de src/proxy.ts (SEC-1).
// Upstash mockeado: aquí solo interesa la rama de auth, no el rate limit.

vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: vi.fn(() => ({})) },
}));

vi.mock('@upstash/ratelimit', () => {
  const Ratelimit = Object.assign(
    vi.fn(function (this: { limit: unknown }) {
      this.limit = vi.fn(() =>
        Promise.resolve({ success: true, limit: 20, remaining: 19, reset: 0 })
      );
    }),
    { slidingWindow: vi.fn(() => 'sliding-window') }
  );
  return { Ratelimit };
});

import { proxy } from '@/proxy';

const ADMIN_TOKEN = 'test-admin-token-123';

function req(path: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(`http://localhost${path}`, { headers });
}

beforeEach(() => {
  vi.stubEnv('ADMIN_DASHBOARD_TOKEN', ADMIN_TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('gate admin — endpoints internos SEC-1', () => {
  it('/api/audits/create sin x-admin-token → 401', async () => {
    const res = await proxy(req('/api/audits/create'));
    expect(res.status).toBe(401);
  });

  it('/api/proposals/generate sin x-admin-token → 401', async () => {
    const res = await proxy(req('/api/proposals/generate'));
    expect(res.status).toBe(401);
  });

  it('/api/audits/create con token correcto → pasa', async () => {
    const res = await proxy(req('/api/audits/create', { 'x-admin-token': ADMIN_TOKEN }));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('/api/proposals/generate con token correcto → pasa', async () => {
    const res = await proxy(req('/api/proposals/generate', { 'x-admin-token': ADMIN_TOKEN }));
    expect(res.status).toBe(200);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('/api/audits/create con token incorrecto → 401', async () => {
    const res = await proxy(req('/api/audits/create', { 'x-admin-token': 'wrong-token-xx-123' }));
    expect(res.status).toBe(401);
  });
});

describe('gate admin — /api/admin/*', () => {
  it('sin token → 401', async () => {
    const res = await proxy(req('/api/admin/proposals'));
    expect(res.status).toBe(401);
  });

  it('con token correcto → pasa', async () => {
    const res = await proxy(req('/api/admin/proposals', { 'x-admin-token': ADMIN_TOKEN }));
    expect(res.status).toBe(200);
  });
});

describe('gate admin — fail-closed sin env var', () => {
  it('sin ADMIN_DASHBOARD_TOKEN configurado → 503 (bloquea, no deja pasar)', async () => {
    vi.stubEnv('ADMIN_DASHBOARD_TOKEN', '');
    const res = await proxy(req('/api/audits/create', { 'x-admin-token': 'whatever' }));
    expect(res.status).toBe(503);
  });
});
