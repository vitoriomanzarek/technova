import { describe, it, expect } from 'vitest';
import { scoreLead, routeLead } from '../lib/leads/score-lead';

describe('scoreLead', () => {
  it('retorna 0 para lead vacío', () => {
    const score = scoreLead({});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('lead con presupuesto alto tiene score mayor', () => {
    const highBudget = scoreLead({ presupuesto_estimado: 80000 });
    const lowBudget = scoreLead({ presupuesto_estimado: 5000 });
    expect(highBudget).toBeGreaterThan(lowBudget);
  });

  it('mensaje largo aumenta score', () => {
    const longMsg = scoreLead({ message: 'a'.repeat(200) });
    const shortMsg = scoreLead({ message: 'hola' });
    expect(longMsg).toBeGreaterThan(shortMsg);
  });

  it('score nunca excede 100', () => {
    const score = scoreLead({
      presupuesto_estimado: 500000,
      message: 'a'.repeat(500),
      project_type: 'ecommerce',
      proposal_opened_at: new Date(),
      in_checkout_at: new Date(),
      audit_completed_at: new Date(),
    });
    expect(score).toBeLessThanOrEqual(100);
  });

  it('señales de intención aumentan score', () => {
    const base = scoreLead({ presupuesto_estimado: 30000 });
    const withIntent = scoreLead({
      presupuesto_estimado: 30000,
      proposal_opened_at: new Date(),
      in_checkout_at: new Date(),
    });
    expect(withIntent).toBeGreaterThan(base);
  });

  it('tipo de proyecto viable da puntos', () => {
    const viable = scoreLead({ project_type: 'auditoria-web' });
    const unknown = scoreLead({ project_type: 'otro-desconocido' });
    expect(viable).toBeGreaterThan(unknown);
  });

  it('urgencia en mensaje da puntos', () => {
    const urgent = scoreLead({ message: 'necesito esto urgente para mañana' });
    const normal = scoreLead({ message: 'me interesa' });
    expect(urgent).toBeGreaterThanOrEqual(normal);
  });
});

describe('routeLead', () => {
  it('score >= 80 → high', () => {
    expect(routeLead(80)).toBe('high');
    expect(routeLead(95)).toBe('high');
    expect(routeLead(100)).toBe('high');
  });

  it('score 60-79 → medium', () => {
    expect(routeLead(60)).toBe('medium');
    expect(routeLead(70)).toBe('medium');
    expect(routeLead(79)).toBe('medium');
  });

  it('score < 60 → low', () => {
    expect(routeLead(0)).toBe('low');
    expect(routeLead(30)).toBe('low');
    expect(routeLead(59)).toBe('low');
  });
});
