const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface ReminderData {
  leadName: string;
  empresa: string;
  montoRestante: number; // MXN
  kickoffDate: string;   // YYYY-MM-DD
  proposalId: string;
  daysUntilKickoff: number;
  urgent: boolean;
}

export function secondPaymentReminderEmail(data: ReminderData) {
  const { leadName, empresa, montoRestante, kickoffDate, proposalId, daysUntilKickoff, urgent } = data;
  const payUrl = `${BASE_URL}/checkout/${proposalId}/pay-remaining`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const subject = urgent
    ? `⚠️ URGENTE: Pago del proyecto vence HOY — ${empresa}`
    : `⏰ Recuerda: Pago del proyecto vence en ${daysUntilKickoff} días — ${empresa}`;

  const headerBg = urgent ? '#ef4444' : '#f59e0b';
  const headerText = urgent
    ? '⚠️ Pago vence hoy'
    : `⏰ ${daysUntilKickoff} días para el inicio`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:${headerBg};padding:22px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">${headerText}</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${empresa}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <div style="padding:24px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 12px;font-size:14px;color:#475569;">
            Hola ${leadName.split(' ')[0]}, ${urgent
              ? `tu proyecto inicia <strong>hoy</strong> y necesitamos el pago del 50% restante para comenzar.`
              : `tu proyecto inicia el <strong>${fmtDate(kickoffDate)}</strong> en ${daysUntilKickoff} días. Completa el pago para asegurar tu fecha de inicio.`}
          </p>

          <div style="background:${urgent ? '#fef2f2' : '#fefce8'};border:1px solid ${urgent ? '#fecaca' : '#fef08a'};border-radius:8px;padding:14px 16px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#64748b;">Monto a pagar</p>
            <p style="margin:4px 0;font-size:26px;font-weight:800;color:${urgent ? '#b91c1c' : '#b45309'};">$${montoRestante.toLocaleString('es-MX')} MXN</p>
            <p style="margin:0;font-size:12px;color:#64748b;">50% restante · ${empresa}</p>
          </div>
        </div>

        <div style="padding:20px 32px;text-align:center;">
          <a href="${payUrl}"
             style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;">
            ${urgent ? '💳 Pagar ahora (HOY)' : '💳 Realizar pago ahora'}
          </a>
        </div>

        <div style="padding:12px 32px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            ¿Dudas? <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/527221669672" style="color:#7c3aed;">WhatsApp</a>
          </p>
          <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Sofía · TechNova</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
