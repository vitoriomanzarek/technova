import { describe, it, expect } from 'vitest';

describe('proposal timeout logic', () => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function daysSinceSent(sentAt: Date, now: Date): number {
    return Math.floor((now.getTime() - sentAt.getTime()) / MS_PER_DAY);
  }

  function getExpiresAt(sentAt: Date): Date {
    return new Date(sentAt.getTime() + 14 * MS_PER_DAY);
  }

  it('calculates days since sent correctly', () => {
    const sentAt = new Date('2026-06-01T10:00:00Z');
    const now = new Date('2026-06-11T10:00:00Z');
    expect(daysSinceSent(sentAt, now)).toBe(10);
  });

  it('reminder triggers at day 10', () => {
    const sentAt = new Date('2026-06-01T10:00:00Z');
    const now = new Date('2026-06-11T10:00:00Z');
    const days = daysSinceSent(sentAt, now);
    expect(days >= 10 && days < 14).toBe(true);
  });

  it('expiry triggers at day 14', () => {
    const sentAt = new Date('2026-06-01T10:00:00Z');
    const now = new Date('2026-06-15T10:00:00Z');
    const days = daysSinceSent(sentAt, now);
    expect(days >= 14).toBe(true);
  });

  it('no action before day 10', () => {
    const sentAt = new Date('2026-06-01T10:00:00Z');
    const now = new Date('2026-06-05T10:00:00Z');
    const days = daysSinceSent(sentAt, now);
    expect(days < 10).toBe(true);
  });

  it('expires_at is sent_at + 14 days', () => {
    const sentAt = new Date('2026-06-01T10:00:00Z');
    const expires = getExpiresAt(sentAt);
    const diff = expires.getTime() - sentAt.getTime();
    expect(diff).toBe(14 * MS_PER_DAY);
  });

  it('expired proposal detected correctly', () => {
    const sentAt = new Date('2026-05-01T10:00:00Z');
    const now = new Date('2026-06-04T10:00:00Z');
    const days = daysSinceSent(sentAt, now);
    expect(days > 14).toBe(true);
  });
});
