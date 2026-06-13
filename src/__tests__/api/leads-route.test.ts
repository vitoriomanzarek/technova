import { describe, it, expect, vi, beforeEach } from 'vitest';

// SEC-5 — Tests de integración de POST /api/leads (entrada del funnel).
// Sin red ni DB real: @/db, resend y el job de auditoría van mockeados.

const { sendMock, dbState } = vi.hoisted(() => {
  const sendMock = vi.fn();
  const dbState = {
    insertCalls: [] as Array<{ values: Record<string, unknown> }>,
    returningResult: [{ id: 'lead-uuid-1' }] as Array<{ id: string }>,
  };
  return { sendMock, dbState };
});

vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: (values: Record<string, unknown>) => {
        dbState.insertCalls.push({ values });
        return { returning: () => Promise.resolve(dbState.returningResult) };
      },
    })),
  },
}));

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock('@/lib/jobs/audit-website', () => ({
  auditWebsite: vi.fn(() => Promise.resolve()),
}));

// after() de next/server requiere request scope de Next — fuera de él lanza.
// Lo neutralizamos manteniendo el resto del módulo real (NextResponse, etc.).
const { afterMock } = vi.hoisted(() => ({ afterMock: vi.fn() }));
vi.mock('next/server', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/server')>();
  return { ...actual, after: afterMock };
});

import { POST } from '@/app/api/leads/route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/leads', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  dbState.insertCalls.length = 0;
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: 'email-id' }, error: null });
  afterMock.mockClear();
});

describe('POST /api/leads — payload válido', () => {
  it('responde 200 con success y persiste el lead', async () => {
    const res = await POST(makeRequest({
      email: 'cliente@empresa.mx',
      name: 'Cliente Test',
      project_type: 'contacto',
      message: 'Quiero una web',
    }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(dbState.insertCalls).toHaveLength(1);
    expect(dbState.insertCalls[0].values.email).toBe('cliente@empresa.mx');
    expect(dbState.insertCalls[0].values.name).toBe('Cliente Test');
  });

  it('dispara la auditoría en background (after) si trae website_url', async () => {
    const res = await POST(makeRequest({
      email: 'cliente@empresa.mx',
      project_type: 'auditoria-web',
      website_url: 'https://empresa.mx',
    }));

    expect(res.status).toBe(200);
    expect(afterMock).toHaveBeenCalledTimes(1);
  });

  it('envía la notificación interna al equipo (replyTo = email del lead)', async () => {
    await POST(makeRequest({ email: 'lead@test.mx', project_type: 'contacto' }));

    const notifyCall = sendMock.mock.calls.find(([args]) => args.replyTo === 'lead@test.mx');
    expect(notifyCall).toBeDefined();
  });

  it('envía email de bienvenida al lead cuando project_type es contacto', async () => {
    await POST(makeRequest({ email: 'lead@test.mx', project_type: 'contacto' }));

    const welcomeCall = sendMock.mock.calls.find(([args]) => args.to === 'lead@test.mx');
    expect(welcomeCall).toBeDefined();
  });
});

describe('POST /api/leads — payload inválido', () => {
  it('email inválido → 400 con issues de Zod y NO inserta', async () => {
    const res = await POST(makeRequest({ email: 'no-es-un-email' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe('Invalid input');
    expect(json.issues).toBeDefined();
    expect(dbState.insertCalls).toHaveLength(0);
  });

  it('body que no es JSON → 500 controlado sin insertar', async () => {
    const res = await POST(new Request('http://localhost/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'esto no es json{{{',
    }));

    expect(res.status).toBe(500);
    expect(dbState.insertCalls).toHaveLength(0);
  });
});

describe('POST /api/leads — resiliencia ante fallo de Resend', () => {
  it('si Resend revienta, el lead se captura igual (200 success)', async () => {
    sendMock.mockRejectedValue(new Error('resend down'));

    const res = await POST(makeRequest({ email: 'lead@test.mx', project_type: 'contacto' }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.notified).toBe(false);
    expect(dbState.insertCalls).toHaveLength(1);
  });
});
