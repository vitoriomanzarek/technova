import { describe, it, expect, beforeEach } from 'vitest';

// Set env before importing modules
beforeEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://tech-nova.mx';
  process.env.RESEND_FROM_EMAIL = 'TechNova <sofia@tech-nova.mx>';
});

describe('proposalSentToClient email', () => {
  it('genera subject con empresa y precio', async () => {
    const { proposalSentToClient } = await import('../lib/emails/proposalSentToClient');
    const result = proposalSentToClient({
      leadName: 'Juan García',
      empresa: 'Acme Corp',
      leadEmail: 'juan@acme.mx',
      auditScore: 42,
      priorityAreas: ['Performance', 'Mobile', 'UX'],
      modulos: [{ modulo_id: 'MOD-01', nombre: 'Identidad', componentes: [], precio_total: 8500, horas: 28, justificacion: 'Test' }],
      precioSubtotal: 8500,
      pmFee: 1700,
      precioTotal: 10200,
      timelineDias: 14,
      proposalId: 'test-uuid-123',
      expiresAt: '2026-06-20',
    });
    expect(result.subject).toContain('Acme Corp');
    expect(result.subject).toContain('10,200');
    expect(result.html).toBeTruthy();
    expect(result.html.length).toBeGreaterThan(500);
  });

  it('incluye link a la propuesta en el HTML', async () => {
    const { proposalSentToClient } = await import('../lib/emails/proposalSentToClient');
    const result = proposalSentToClient({
      leadName: 'Test',
      empresa: 'TestCo',
      leadEmail: 'test@test.mx',
      auditScore: 50,
      priorityAreas: [],
      modulos: [],
      precioSubtotal: 10000,
      pmFee: 2000,
      precioTotal: 12000,
      timelineDias: 10,
      proposalId: 'abc-123',
      expiresAt: '2026-06-30',
    });
    expect(result.html).toContain('/propuesta/abc-123');
  });
});

describe('proposalReminderEmail', () => {
  it('genera subject con empresa', async () => {
    const { proposalReminderEmail } = await import('../lib/emails/proposalReminderEmail');
    const result = proposalReminderEmail({
      leadName: 'Ana López',
      empresa: 'Startup X',
      precioTotal: 28800,
      proposalId: 'test-id',
      expiresAt: '2026-06-20',
    });
    expect(result.subject).toContain('Startup X');
    expect(result.html).toBeTruthy();
  });
});

describe('proposalExpiredEmail', () => {
  it('genera email de expiración válido', async () => {
    const { proposalExpiredEmail } = await import('../lib/emails/proposalExpiredEmail');
    const result = proposalExpiredEmail({ leadName: 'Carlos', empresa: 'Corp S.A.', precioTotal: 45000 });
    expect(result.subject).toContain('Corp S.A.');
    expect(result.html).toContain('venc');
  });
});

describe('workflow email templates', () => {
  it('welcomeEmail genera subject y html válidos', async () => {
    const { welcomeEmail } = await import('../lib/emails/workflows/welcomeEmail');
    const result = welcomeEmail({ leadName: 'María Torres', empresa: 'Design Co' });
    expect(result.subject).toBeTruthy();
    expect(result.html).toContain('María');
    expect(result.html).toContain('Design Co');
  });

  it('urgentCheckoutEmail incluye precio y CTA', async () => {
    const { urgentCheckoutEmail } = await import('../lib/emails/workflows/urgentCheckoutEmail');
    const result = urgentCheckoutEmail({ leadName: 'Pedro', empresa: 'Empresa SA', proposalId: 'uuid-1', precioTotal: 35000 });
    expect(result.html).toContain('35,000');
    expect(result.html).toContain('uuid-1');
  });

  it('checkoutReminderEmail calcula 50% correctamente', async () => {
    const { checkoutReminderEmail } = await import('../lib/emails/workflows/checkoutReminderEmail');
    const result = checkoutReminderEmail({ leadName: 'Rosa', empresa: 'Café MX', proposalId: 'id-1', precioTotal: 20000 });
    expect(result.html).toContain('10,000'); // 50% of 20000
  });
});
