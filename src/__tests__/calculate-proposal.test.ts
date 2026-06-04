import { describe, it, expect } from 'vitest';
import { calculateProposal, getAvailableModules, dbModuleToCart, type CartModule } from '../lib/checkout/calculate-proposal';

const makeModule = (id: string, precio: number, horas: number): CartModule => ({
  modulo_id: id,
  nombre: `Módulo ${id}`,
  componentes: [],
  precio_total: precio,
  horas,
  justificacion: 'Test module',
});

describe('calculateProposal', () => {
  it('calcula subtotal correctamente', () => {
    const modules = [makeModule('MOD-01', 8500, 28), makeModule('MOD-06', 6300, 20)];
    const result = calculateProposal(modules);
    expect(result.subtotal).toBe(14800);
  });

  it('PM fee es exactamente 20% del subtotal', () => {
    const modules = [makeModule('MOD-01', 10000, 20)];
    const result = calculateProposal(modules);
    expect(result.pmFee).toBe(2000);
    expect(result.pmFee).toBe(result.subtotal * 0.20);
  });

  it('total = subtotal + pmFee', () => {
    const modules = [makeModule('MOD-01', 15000, 30), makeModule('MOD-06', 8000, 15)];
    const result = calculateProposal(modules);
    expect(result.total).toBe(result.subtotal + result.pmFee);
  });

  it('días estimados = ceil(horas / 7)', () => {
    const modules = [makeModule('MOD-01', 5000, 21)]; // 21h → 3 days
    const result = calculateProposal(modules);
    expect(result.diasEstimados).toBe(3);
  });

  it('redondea días hacia arriba', () => {
    const modules = [makeModule('MOD-01', 5000, 22)]; // 22h → ceil(22/7) = 4
    const result = calculateProposal(modules);
    expect(result.diasEstimados).toBe(4);
  });

  it('detecta exceso de presupuesto', () => {
    const modules = [makeModule('MOD-01', 50000, 100)]; // 60000 total > 40000 budget
    const result = calculateProposal(modules, 40000);
    expect(result.exceedsBudget).toBe(true);
    expect(result.budgetOverage).toBeGreaterThan(0);
  });

  it('no marca exceso cuando dentro del presupuesto', () => {
    const modules = [makeModule('MOD-01', 10000, 20)]; // 12000 total
    const result = calculateProposal(modules, 15000);
    expect(result.exceedsBudget).toBe(false);
    expect(result.budgetOverage).toBe(0);
  });

  it('sin presupuesto máximo no marca exceso', () => {
    const modules = [makeModule('MOD-01', 999999, 100)];
    const result = calculateProposal(modules, null);
    expect(result.exceedsBudget).toBe(false);
  });

  it('carrito vacío retorna ceros', () => {
    const result = calculateProposal([]);
    expect(result.subtotal).toBe(0);
    expect(result.pmFee).toBe(0);
    expect(result.total).toBe(0);
    expect(result.horas).toBe(0);
  });
});

describe('dbModuleToCart', () => {
  it('convierte objeto DB a CartModule', () => {
    const raw = { modulo_id: 'MOD-01', nombre: 'Test', componentes: ['VI-01'], precio_total: 8500, horas: 28, justificacion: 'Test' };
    const result = dbModuleToCart(raw as Record<string, unknown>);
    expect(result.modulo_id).toBe('MOD-01');
    expect(result.precio_total).toBe(8500);
  });

  it('maneja campos faltantes con defaults', () => {
    const result = dbModuleToCart({ modulo_id: 'MOD-01', nombre: 'Test' } as Record<string, unknown>);
    expect(result.precio_total).toBe(0);
    expect(result.horas).toBe(0);
    expect(result.componentes).toEqual([]);
  });
});

describe('getAvailableModules', () => {
  it('excluye módulos ya seleccionados', () => {
    const available = getAvailableModules(['MOD-01', 'MOD-02']);
    const ids = available.map(m => m.modulo_id);
    expect(ids).not.toContain('MOD-01');
    expect(ids).not.toContain('MOD-02');
  });

  it('retorna módulos con precio positivo', () => {
    const available = getAvailableModules([]);
    expect(available.every(m => m.precio_total > 0)).toBe(true);
  });

  it('retorna 0 módulos cuando todos están seleccionados', () => {
    const allIds = ['MOD-01','MOD-02','MOD-03','MOD-04','MOD-05','MOD-06','MOD-07','MOD-08','MOD-09','MOD-10','MOD-11','MOD-12'];
    const available = getAvailableModules(allIds);
    expect(available).toHaveLength(0);
  });
});
