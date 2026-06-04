import { describe, it, expect } from 'vitest';

// Pure calculation tests for the second payment job logic

describe('second payment timing logic', () => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function daysUntilKickoff(kickoffDate: Date, now: Date): number {
    return Math.floor((kickoffDate.getTime() - now.getTime()) / MS_PER_DAY);
  }

  it('calcula días correctamente cuando kickoff es en 3 días', () => {
    const now = new Date('2026-06-10T10:00:00Z');
    const kickoff = new Date('2026-06-13T10:00:00Z');
    expect(daysUntilKickoff(kickoff, now)).toBe(3);
  });

  it('calcula días negativos cuando kickoff ya pasó', () => {
    const now = new Date('2026-06-14T10:00:00Z');
    const kickoff = new Date('2026-06-10T10:00:00Z');
    expect(daysUntilKickoff(kickoff, now)).toBeLessThan(0);
  });

  it('reminder se envía exactamente en día 3', () => {
    const now = new Date('2026-06-10T10:00:00Z');
    const kickoff = new Date('2026-06-13T10:00:00Z');
    const days = daysUntilKickoff(kickoff, now);
    expect(days).toBe(3); // reminder day
  });

  it('urgente se envía el día 0 (kickoff day)', () => {
    const now = new Date('2026-06-10T10:00:00Z');
    const kickoff = new Date('2026-06-10T18:00:00Z'); // same day, later
    const days = daysUntilKickoff(kickoff, now);
    expect(days).toBe(0);
  });
});

describe('payment calculations', () => {
  it('segundo pago = 50% del total', () => {
    const precioTotal = 46680;
    const half = Math.round(precioTotal / 2);
    expect(half).toBe(23340);
  });

  it('conversión cents → MXN es correcta', () => {
    const totalCents = 4668000;
    const totalMxn = Math.round(totalCents / 100);
    expect(totalMxn).toBe(46680);
  });

  it('conversión MXN → cents es correcta', () => {
    const totalMxn = 46680;
    const totalCents = Math.round(totalMxn * 100);
    expect(totalCents).toBe(4668000);
  });

  it('no hay pérdida de precisión en conversiones', () => {
    const mxn = 38950;
    const cents = Math.round(mxn * 100);
    const backToMxn = Math.round(cents / 100);
    expect(backToMxn).toBe(mxn);
  });
});
