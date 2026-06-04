import { describe, it, expect } from 'vitest';
import { MODULES, COMPONENTS, PRODUCTS, calcModuleCost, calcProductCost } from '../data/catalog';

describe('catalog structure', () => {
  it('tiene exactamente 12 módulos', () => {
    expect(MODULES).toHaveLength(12);
  });

  it('todos los módulos tienen IDs únicos', () => {
    const ids = MODULES.map(m => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('IDs de módulos siguen el patrón MOD-XX', () => {
    MODULES.forEach(m => {
      expect(m.id).toMatch(/^MOD-\d{2}$/);
    });
  });

  it('todos los componentes referenciados en módulos existen', () => {
    const componentIds = new Set(COMPONENTS.map(c => c.id));
    MODULES.forEach(mod => {
      mod.components.forEach(compId => {
        expect(componentIds.has(compId), `${compId} referenced in ${mod.id} not found`).toBe(true);
      });
    });
  });

  it('COMPONENTS técnicos tienen costo >= 0', () => {
    // PM components can have cost=0 (PM fee is calculated as 20% of technical subtotal)
    COMPONENTS.forEach(c => {
      expect(c.cost, `${c.id} has negative cost`).toBeGreaterThanOrEqual(0);
    });
  });

  it('COMPONENTS no-PM tienen costo > 0', () => {
    const technical = COMPONENTS.filter(c => c.category !== 'PM');
    technical.forEach(c => {
      expect(c.cost, `${c.id} has zero cost`).toBeGreaterThan(0);
    });
  });

  it('COMPONENTS no-PM tienen horas > 0', () => {
    const technical = COMPONENTS.filter(c => c.category !== 'PM');
    technical.forEach(c => {
      expect(c.hours, `${c.id} has zero hours`).toBeGreaterThan(0);
    });
  });
});

describe('calcModuleCost', () => {
  it('retorna costo positivo para módulo válido', () => {
    const { cost } = calcModuleCost('MOD-01');
    expect(cost).toBeGreaterThan(0);
  });

  it('retorna horas positivas para módulo válido', () => {
    const { hours } = calcModuleCost('MOD-01');
    expect(hours).toBeGreaterThan(0);
  });

  it('aplica descuento del módulo', () => {
    const mod = MODULES.find(m => m.id === 'MOD-01')!;
    const rawCost = mod.components.reduce((sum, id) => {
      const comp = COMPONENTS.find(c => c.id === id);
      return sum + (comp?.cost ?? 0);
    }, 0);
    const { cost } = calcModuleCost('MOD-01');
    expect(cost).toBeLessThan(rawCost); // discount applied
    expect(cost).toBeCloseTo(rawCost * (1 - (mod.discountPct ?? 0)), 1);
  });

  it('retorna ceros para módulo inexistente', () => {
    const { cost, hours } = calcModuleCost('MOD-999');
    expect(cost).toBe(0);
    expect(hours).toBe(0);
  });

  it('todos los módulos tienen costo calculable', () => {
    MODULES.forEach(mod => {
      const { cost } = calcModuleCost(mod.id);
      expect(cost, `${mod.id} cost should be positive`).toBeGreaterThan(0);
    });
  });
});

describe('calcProductCost', () => {
  it('PM fee es 20% del subtotal', () => {
    const { subtotal, pm } = calcProductCost('PRD-01');
    expect(pm).toBeCloseTo(subtotal * 0.20, 1);
  });

  it('total = subtotal + PM fee', () => {
    const { subtotal, pm, total } = calcProductCost('PRD-01');
    expect(total).toBeCloseTo(subtotal + pm, 1);
  });

  it('retorna ceros para producto inexistente', () => {
    const { subtotal, pm, total } = calcProductCost('PRD-999');
    expect(subtotal).toBe(0);
    expect(pm).toBe(0);
    expect(total).toBe(0);
  });
});
