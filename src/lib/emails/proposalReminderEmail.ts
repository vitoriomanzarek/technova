const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface ReminderData {
  leadName: string;
  empresa: string;
  precioTotal: number; // MXN
  proposalId: string;
  expiresAt: string; // YYYY-MM-DD
}

export function proposalReminderEmail(data: ReminderData) {
  const { leadName, empresa, precioTotal, proposalId, expiresAt } = data;
  const proposalUrl = `${BASE_URL}/propuesta/${proposalId}`;
  const subject = `⏰ Tu propuesta vence en 3 días — ${empresa}`;
  const expiresFormatted = new Date(expiresAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#f59e0b;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">⏰ Recordatorio de propuesta</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${empresa}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">
          Hola ${leadName.split(' ')[0]},
        </p>
        <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
          Tu propuesta de <strong>$${precioTotal.toLocaleString('es-MX')} MXN</strong> para ${empresa} vence el <strong>${expiresFormatted}</strong> — en 3 días.
        </p>
        <p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">
          Si tienes preguntas o quieres ajustar el alcance, escríbenos sin compromiso a
          <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>.
        </p>

        <div style="text-align:center;margin-bottom:20px;">
          <a href="${proposalUrl}"
             style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;">
            Ver propuesta nuevamente →
          </a>
        </div>

        <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
          Sofía · TechNova · <a href="https://tech-nova.mx" style="color:#94a3b8;">tech-nova.mx</a>
        </p>
      </div>
    </div>
  `;

  return { subject, html };
}
