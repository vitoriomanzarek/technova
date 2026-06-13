import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// SEC-5 — Tests del rate limit anti-enumeración (SEC-4a) en src/proxy.ts.
// Upstash mockeado; el limiter expone su prefix para distinguir rl:uuid de
// rl:checkout y verificar que cada path usa el limiter correcto.

const { limitMock } = vi.hoisted(() => ({
  limitMock: vi.fn(),
}));

vi.mock('@upstash/redis', () => ({
  Redis: { fromEnv: vi.fn(() => ({})) },
}));

vi.mock('@upstash/ratelimit', () => {
  const Ratelimit = Object.assign(
    vi.fn(function (this: { limit: (ip: string) => unknown }, opts: { prefix: string }) {
      this.limit = (ip: string) => limitMock(opts.prefix, ip);
    }),
    { slidingWindow: vi.fn(() => 'sliding-window') }
  );
  return { Ratelimit };
});

// hasUpstashConfig se evalúa al cargar el módulo → las env vars deben existir
// ANTES del import de @/proxy (por eso import dinámico tras stubEnv).
vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io');
vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
const { proxy } = await import('@/proxy');

const FAKE_UUID = '00000000-0000-4000-8000-000000000000';

function allowed(remaining = 19) {
  return Promise.resolve({ success: true, limit: 20, remaining, reset: Date.now() + 60_000 });
}

function blocked() {
  return Promise.resolve({ success: false, limit: 20, remaining: 0, reset: Date.now() + 30_000 });
}

beforeEach(() => {
  limitMock.mockReset();
});

describe('rl:uuid — endpoints por-UUID', () => {
  it('bajo el límite → pasa con headers X-RateLimit-*', async () => {
    limitMock.mockReturnValue(allowed());

    const res = await proxy(new NextRequest(`http://localhost/api/checkout/${FAKE_UUID}`, {
      headers: { 'x-forwarded-for': '1.2.3.4' },
    }));

    expect(res.status).toBe(200);
    expect(res.headers.get('X-RateLimit-Limit')).toBe('20');
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('19');
    expect(res.headers.get('X-RateLimit-Reset')).toBeTruthy();
    expect(limitMock).toHaveBeenCalledWith('rl:uuid', '1.2.3.4');
  });

  it('sobre el límite → 429 con Retry-After', async () => {
    limitMock.mockReturnValue(blocked());

    const res = await proxy(new NextRequest(`http://localhost/api/checkout/${FAKE_UUID}/pay`, {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
    }));
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeTruthy();
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(json.error).toBe('Too many requests');
    expect(json.retry_after_seconds).toBeGreaterThan(0);
  });

  it.each([
    `/api/checkout/${FAKE_UUID}/contract`,
    `/api/checkout/${FAKE_UUID}/request-changes`,
    `/api/proposals/${FAKE_UUID}/pdf`,
  ])('%s usa el limiter rl:uuid', async (path) => {
    limitMock.mockReturnValue(allowed());

    await proxy(new NextRequest(`http://localhost${path}`, {
      headers: { 'x-forwarded-for': '5.6.7.8' },
    }));

    expect(limitMock).toHaveBeenCalledWith('rl:uuid', '5.6.7.8');
  });
});

describe('exclusión del webhook de Stripe', () => {
  it('/api/checkout/webhook NUNCA pasa por rate limit', async () => {
    limitMock.mockReturnValue(blocked()); // incluso "bloqueado", el webhook pasa

    const res = await proxy(new NextRequest('http://localhost/api/checkout/webhook', {
      method: 'POST',
      headers: { 'x-forwarded-for': '34.0.0.1' }, // IP de Stripe cualquiera
    }));

    expect(res.status).toBe(200);
    expect(limitMock).not.toHaveBeenCalled();
  });
});

describe('limiters preexistentes — sin regresión', () => {
  it('/api/checkout exacto sigue usando rl:checkout (3/min), no rl:uuid', async () => {
    limitMock.mockReturnValue(allowed());

    await proxy(new NextRequest('http://localhost/api/checkout', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
    }));

    expect(limitMock).toHaveBeenCalledWith('rl:checkout', '1.2.3.4');
  });

  it('/api/leads sigue usando rl:leads', async () => {
    limitMock.mockReturnValue(allowed());

    await proxy(new NextRequest('http://localhost/api/leads', {
      method: 'POST',
      headers: { 'x-forwarded-for': '1.2.3.4' },
    }));

    expect(limitMock).toHaveBeenCalledWith('rl:leads', '1.2.3.4');
  });
});
