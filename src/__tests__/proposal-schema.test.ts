import { describe, it, expect } from 'vitest';
import { proposalSchema, proposalModuleSchema } from '../lib/schemas/proposal';

const validModule = {
  modulo_id: 'MOD-01',
  nombre: 'Identidad Visual Básica',
  componentes: ['VI-01', 'VI-02'],
  precio_total: 8500,
  horas: 28,
  justificacion: 'El audit mostró identidad visual débil, necesita logo y paleta.',
};

const validProposal = {
  modulos_seleccionados: [validModule, { ...validModule, modulo_id: 'MOD-06' }, { ...validModule, modulo_id: 'MOD-07' }],
  precio_subtotal_tecnico: 25000,
  pm_fee_20_pct: 5000,
  precio_total: 30000,
  horas_totales: 84,
  timeline_dias: 14,
  justificacion_general: 'Propuesta enfocada en resolver los problemas críticos del audit.',
  observaciones: 'SEO avanzado como fase 2.',
};

describe('proposalModuleSchema', () => {
  it('valida módulo correcto', () => {
    const result = proposalModuleSchema.safeParse(validModule);
    expect(result.success).toBe(true);
  });

  it('rechaza modulo_id no en catálogo', () => {
    const result = proposalModuleSchema.safeParse({ ...validModule, modulo_id: 'MOD-FAKE-99' });
    expect(result.success).toBe(false);
  });

  it('rechaza justificación vacía', () => {
    const result = proposalModuleSchema.safeParse({ ...validModule, justificacion: 'corto' });
    expect(result.success).toBe(false);
  });

  it('rechaza precio negativo', () => {
    const result = proposalModuleSchema.safeParse({ ...validModule, precio_total: -100 });
    expect(result.success).toBe(false);
  });

  it('rechaza horas cero', () => {
    const result = proposalModuleSchema.safeParse({ ...validModule, horas: 0 });
    expect(result.success).toBe(false);
  });
});

describe('proposalSchema', () => {
  it('valida propuesta completa válida', () => {
    const result = proposalSchema.safeParse(validProposal);
    expect(result.success).toBe(true);
  });

  it('rechaza menos de 3 módulos', () => {
    const result = proposalSchema.safeParse({
      ...validProposal,
      modulos_seleccionados: [validModule, { ...validModule, modulo_id: 'MOD-06' }],
    });
    expect(result.success).toBe(false);
  });

  it('rechaza más de 5 módulos', () => {
    const six = Array.from({ length: 6 }, (_, i) => ({
      ...validModule,
      modulo_id: `MOD-0${i + 1}` as 'MOD-01',
    }));
    const result = proposalSchema.safeParse({ ...validProposal, modulos_seleccionados: six });
    expect(result.success).toBe(false);
  });

  it('rechaza timeline > 120 días', () => {
    const result = proposalSchema.safeParse({ ...validProposal, timeline_dias: 150 });
    expect(result.success).toBe(false);
  });

  it('rechaza justificacion_general muy corta', () => {
    const result = proposalSchema.safeParse({ ...validProposal, justificacion_general: 'corto' });
    expect(result.success).toBe(false);
  });

  it('acepta observaciones opcionales', () => {
    const { observaciones: _, ...withoutObs } = validProposal;
    const result = proposalSchema.safeParse(withoutObs);
    expect(result.success).toBe(true);
  });

  it('rechaza precios negativos', () => {
    const result = proposalSchema.safeParse({ ...validProposal, precio_total: -1 });
    expect(result.success).toBe(false);
  });
});
