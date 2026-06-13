import { describe, it, expect, vi, beforeEach } from 'vitest';

// SEC-5 — Tests del webhook de Stripe (el endpoint que marca dinero cobrado).
// Sin red ni DB real: stripe, @/db, resend y client-auth mockeados.

const { constructEventMock, sendMock, dbState } = vi.hoisted(() => {
  const constructEventMock = vi.fn();
  const sendMock = vi.fn(() => Promise.resolve({ data: { id: 'email-id' }, error: null }));
  const dbState = {
    // Cola de resultados: cada cadena select().from()...limit() consume uno.
    selectResults: [] as unknown[][],
    updateCalls: [] as Array<{ values: Record<string, unknown> }>,
    insertCalls: [] as Array<{ values: Record<string, unknown> }>,
  };
  return { constructEventMock, sendMock, dbState };
});

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: { constructEvent: constructEventMock },
    charges: { retrieve: vi.fn() },
  },
}));

vi.mock('@/db', () => {
  function selectChain() {
    const chain = {
      from: () => chain,
      leftJoin: () => chain,
      where: () => chain,
      limit: () => Promise.resolve(dbState.selectResults.shift() ?? []),
    };
    return chain;
  }
  return {
    db: {
      select: vi.fn(() => selectChain()),
      update: vi.fn(() => ({
        set: (values: Record<string, unknown>) => ({
          where: () => {
            dbState.updateCalls.push({ values });
            return Promise.resolve();
          },
        }),
      })),
      insert: vi.fn(() => ({
        values: (values: Record<string, unknown>) => {
          dbState.insertCalls.push({ values });
          const promise = Promise.resolve();
          return Object.assign(promise, {
            returning: () => Promise.resolve([{ id: 'new-project-id' }]),
          });
        },
      })),
    },
  };
});

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock('@/lib/client-auth', () => ({
  createClientToken: vi.fn(() => Promise.resolve('client-access-token')),
}));

import { POST } from '@/app/api/checkout/webhook/route';

function makeWebhookRequest(payload: unknown, signature = 't=123,v1=fakesig'): Request {
  return new Request('http://localhost/api/checkout/webhook', {
    method: 'POST',
    headers: signature ? { 'stripe-signature': signature } : {},
    body: JSON.stringify(payload),
  });
}

const PROPOSAL_ROW = {
  proposal: {
    id: 'prop-uuid-1',
    status: 'client_reviewing',
    precio_total: 4668000, // cents
    timeline_dias: 30,
    fecha_entrega_estimada: '2026-08-01',
    modulos_seleccionados: [{ nombre: 'Web corporativa', horas: 40 }],
  },
  lead: { name: 'Cliente', email: 'cliente@empresa.mx', empresa: 'Empresa SA' },
};

function completedEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_123',
        payment_intent: 'pi_test_123',
        amount_total: 2334000,
        metadata: { proposal_id: 'prop-uuid-1', payment_percentage: '50' },
        ...overrides,
      },
    },
  };
}

beforeEach(() => {
  dbState.selectResults.length = 0;
  dbState.updateCalls.length = 0;
  dbState.insertCalls.length = 0;
  constructEventMock.mockReset();
  sendMock.mockClear();
});

describe('webhook — verificación de firma', () => {
  it('sin header stripe-signature → 400 y NO toca DB', async () => {
    const res = await POST(makeWebhookRequest({ type: 'x' }, ''));

    expect(res.status).toBe(400);
    expect(constructEventMock).not.toHaveBeenCalled();
    expect(dbState.updateCalls).toHaveLength(0);
    expect(dbState.insertCalls).toHaveLength(0);
  });

  it('firma inválida (constructEvent lanza) → 400 y NO toca DB', async () => {
    constructEventMock.mockImplementation(() => {
      throw new Error('No signatures found matching the expected signature');
    });

    const res = await POST(makeWebhookRequest({ type: 'checkout.session.completed' }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid signature');
    expect(dbState.updateCalls).toHaveLength(0);
    expect(dbState.insertCalls).toHaveLength(0);
  });
});

describe('webhook — checkout.session.completed', () => {
  it('evento válido → orden marcada paid y propuesta client_confirmed', async () => {
    constructEventMock.mockReturnValue(completedEvent());
    dbState.selectResults.push(
      [PROPOSAL_ROW],          // proposals + lead
      [],                      // no hay proyecto existente → lo crea
      [{ id: 'order-uuid-1' }] // orden para el token de dashboard
    );

    const res = await POST(makeWebhookRequest({}));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.received).toBe(true);

    const orderUpdate = dbState.updateCalls.find(c => c.values.status === 'paid');
    expect(orderUpdate).toBeDefined();
    expect(orderUpdate!.values.stripe_payment_intent_id).toBe('pi_test_123');

    const proposalUpdate = dbState.updateCalls.find(c => c.values.status === 'client_confirmed');
    expect(proposalUpdate).toBeDefined();

    // Se crea el proyecto (insert con proposal_id + payment_status)
    const projectInsert = dbState.insertCalls.find(c => c.values.payment_status);
    expect(projectInsert).toBeDefined();
    expect(projectInsert!.values.payment_status).toBe('half_paid');
    expect(projectInsert!.values.proposal_id).toBe('prop-uuid-1');
  });

  it('pago 100% → proyecto fully_paid', async () => {
    constructEventMock.mockReturnValue(
      completedEvent({ metadata: { proposal_id: 'prop-uuid-1', payment_percentage: '100' } })
    );
    dbState.selectResults.push([PROPOSAL_ROW], [], [{ id: 'order-uuid-1' }]);

    await POST(makeWebhookRequest({}));

    const projectInsert = dbState.insertCalls.find(c => c.values.payment_status);
    expect(projectInsert!.values.payment_status).toBe('fully_paid');
  });

  it('evento duplicado (proyecto ya existe) → idempotente, NO crea segundo proyecto', async () => {
    constructEventMock.mockReturnValue(completedEvent());
    dbState.selectResults.push(
      [PROPOSAL_ROW],
      [{ id: 'existing-project-id' }], // proyecto YA creado por la primera entrega
      [{ id: 'order-uuid-1' }]
    );

    const res = await POST(makeWebhookRequest({}));

    expect(res.status).toBe(200);
    // Ni proyecto ni contrato nuevos — esos inserts solo ocurren al crear el proyecto.
    expect(dbState.insertCalls).toHaveLength(0);
  });

  it('sin proposal_id en metadata → solo marca la orden paid', async () => {
    constructEventMock.mockReturnValue(completedEvent({ metadata: {} }));

    const res = await POST(makeWebhookRequest({}));

    expect(res.status).toBe(200);
    expect(dbState.updateCalls).toHaveLength(1);
    expect(dbState.updateCalls[0].values.status).toBe('paid');
    expect(dbState.insertCalls).toHaveLength(0);
  });
});

describe('webhook — checkout.session.expired', () => {
  it('marca la orden expired', async () => {
    constructEventMock.mockReturnValue({
      type: 'checkout.session.expired',
      data: { object: { id: 'cs_test_expired' } },
    });

    const res = await POST(makeWebhookRequest({}));

    expect(res.status).toBe(200);
    expect(dbState.updateCalls).toHaveLength(1);
    expect(dbState.updateCalls[0].values.status).toBe('expired');
  });
});
