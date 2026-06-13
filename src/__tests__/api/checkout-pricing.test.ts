import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calcModuleCost } from '../../data/catalog';

// SEC-5 — Recálculo de precio en POST /api/checkout/[uuid]/pay cuando el
// cliente personaliza módulos (add/remove). Verifica el 20% de PM fee y la
// consistencia con catalog.ts. Sin red ni DB real.

const { dbState, sessionsCreateMock } = vi.hoisted(() => {
  const dbState = {
    selectResults: [] as unknown[][],
    updateCalls: [] as Array<{ values: Record<string, unknown> }>,
    insertCalls: [] as Array<{ values: Record<string, unknown> }>,
  };
  const sessionsCreateMock = vi.fn(() =>
    Promise.resolve({ id: 'cs_test_pricing', url: 'https://checkout.stripe.com/test' })
  );
  return { dbState, sessionsCreateMock };
});

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
          return Promise.resolve();
        },
      })),
    },
  };
});

vi.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: sessionsCreateMock } } },
}));

import { POST } from '@/app/api/checkout/[uuid]/pay/route';

// Módulos construidos desde el catálogo real — los precios que el cliente
// vería en la UI de checkout salen de calcModuleCost.
function catalogModule(moduloId: string) {
  const { cost, hours } = calcModuleCost(moduloId);
  return {
    modulo_id: moduloId,
    nombre: `Módulo ${moduloId}`,
    precio_total: Math.round(cost),
    horas: hours,
    justificacion: 'test',
    componentes: [],
  };
}

const PROPOSAL_ROW = {
  proposal: { id: 'prop-uuid-1', status: 'client_reviewing', precio_total: 4668000 },
  lead: { name: 'Cliente', email: 'cliente@empresa.mx', empresa: 'Empresa SA' },
};

function payRequest(body: Record<string, unknown>): Request {
  return new Request('http://localhost/api/checkout/prop-uuid-1/pay', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const params = Promise.resolve({ uuid: 'prop-uuid-1' });

beforeEach(() => {
  dbState.selectResults.length = 0;
  dbState.updateCalls.length = 0;
  dbState.insertCalls.length = 0;
  sessionsCreateMock.mockClear();
  dbState.selectResults.push([PROPOSAL_ROW]);
});

describe('recálculo de precio con módulos personalizados', () => {
  it('subtotal + 20% PM fee, persistidos en cents', async () => {
    const modules = [catalogModule('MOD-01'), catalogModule('MOD-02')];
    const subtotalMxn = modules.reduce((s, m) => s + m.precio_total, 0);
    const pmFeeMxn = Math.round(subtotalMxn * 0.20);
    const totalMxn = subtotalMxn + pmFeeMxn;

    const res = await POST(payRequest({
      email: 'cliente@empresa.mx',
      total_mxn: totalMxn,
      payment_percentage: 50,
      modulos_seleccionados: modules,
    }), { params });

    expect(res.status).toBe(200);
    expect(dbState.updateCalls).toHaveLength(1);
    const updated = dbState.updateCalls[0].values;
    expect(updated.precio_subtotal_tecnico).toBe(Math.round(subtotalMxn * 100));
    expect(updated.pm_fee_20_pct).toBe(Math.round(pmFeeMxn * 100));
    expect(updated.precio_total).toBe(Math.round(totalMxn * 100));
    expect(updated.horas_totales).toBe(modules.reduce((s, m) => s + m.horas, 0));
  });

  it('remover un módulo reduce el total y el PM fee sigue siendo 20%', async () => {
    const modules = [catalogModule('MOD-01')]; // MOD-02 removido por el cliente
    const subtotalMxn = modules[0].precio_total;
    const pmFeeMxn = Math.round(subtotalMxn * 0.20);

    await POST(payRequest({
      email: 'cliente@empresa.mx',
      total_mxn: subtotalMxn + pmFeeMxn,
      payment_percentage: 50,
      modulos_seleccionados: modules,
    }), { params });

    const updated = dbState.updateCalls[0].values;
    expect(updated.pm_fee_20_pct).toBe(Math.round(pmFeeMxn * 100));
    expect(updated.precio_total).toBe(Math.round((subtotalMxn + pmFeeMxn) * 100));
    // Consistencia con catalog.ts: el subtotal es exactamente el costo del módulo.
    expect(updated.precio_subtotal_tecnico).toBe(Math.round(Math.round(calcModuleCost('MOD-01').cost) * 100));
  });

  it('agregar un módulo incrementa el total exactamente en su costo + 20%', async () => {
    const base = [catalogModule('MOD-01')];
    const extended = [catalogModule('MOD-01'), catalogModule('MOD-03')];

    const totals = (mods: ReturnType<typeof catalogModule>[]) => {
      const subtotal = mods.reduce((s, m) => s + m.precio_total, 0);
      return subtotal + Math.round(subtotal * 0.20);
    };

    await POST(payRequest({
      email: 'cliente@empresa.mx',
      total_mxn: totals(extended),
      payment_percentage: 50,
      modulos_seleccionados: extended,
    }), { params });

    const updated = dbState.updateCalls[0].values;
    const deltaCents = (updated.precio_total as number) - totals(base) * 100;
    const mod3Cost = Math.round(calcModuleCost('MOD-03').cost);
    // Delta ≈ costo del módulo + su parte proporcional de PM fee (±1 MXN por redondeo).
    expect(Math.abs(deltaCents - Math.round(mod3Cost * 1.2) * 100)).toBeLessThanOrEqual(100);
  });

  it('el monto cobrado en Stripe es el 50% del total cuando payment_percentage=50', async () => {
    const totalMxn = 46680;

    await POST(payRequest({
      email: 'cliente@empresa.mx',
      total_mxn: totalMxn,
      payment_percentage: 50,
    }), { params });

    const sessionArgs = (sessionsCreateMock.mock.calls[0] as unknown[])[0] as {
      line_items: Array<{ price_data: { unit_amount: number } }>;
    };
    expect(sessionArgs.line_items[0].price_data.unit_amount).toBe(Math.round(totalMxn / 2) * 100);

    // La orden pending se persiste con el mismo monto.
    expect(dbState.insertCalls).toHaveLength(1);
    expect(dbState.insertCalls[0].values.amount_cents).toBe(Math.round(totalMxn / 2) * 100);
    expect(dbState.insertCalls[0].values.payment_percentage).toBe(50);
  });

  it('sin módulos personalizados NO recalcula la propuesta', async () => {
    await POST(payRequest({
      email: 'cliente@empresa.mx',
      total_mxn: 46680,
      payment_percentage: 100,
    }), { params });

    expect(dbState.updateCalls).toHaveLength(0);
    expect(sessionsCreateMock).toHaveBeenCalledTimes(1);
  });
});
