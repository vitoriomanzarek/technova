export function projectStartedEmail(data: { leadName: string; empresa: string; kickoffDate: string; dashboardToken?: string }) {
  const { leadName, empresa, kickoffDate, dashboardToken } = data;
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';
  const dashUrl = dashboardToken ? `${BASE_URL}/cliente/dashboard?token=${dashboardToken}` : `${BASE_URL}/cliente/dashboard`;
  const fmtDate = new Date(kickoffDate).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const subject = `🚀 ¡Proyecto de ${empresa} comienza el ${new Date(kickoffDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}!`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#22c55e,#7c3aed);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">🚀 ¡Tu proyecto comienza!</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${empresa} · ${fmtDate}</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="font-size:14px;">¡Hola ${leadName.split(' ')[0]}! 🎉</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          El kickoff de tu proyecto está confirmado para el <strong>${fmtDate}</strong>. Vic se pondrá en contacto contigo para la llamada inicial de 30-45 minutos donde revisarán los detalles.
        </p>
        <div style="background:#f0fdf4;border-radius:8px;padding:14px;margin:16px 0;font-size:13px;color:#15803d;">
          <strong>📋 Qué esperar en el kickoff:</strong><br/>
          Presentación del equipo · Revisión de módulos · Timeline detallado · Definir primer entregable
        </div>
        <div style="text-align:center;margin:20px 0;">
          <a href="${dashUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#7c3aed,#0ea5e9);color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;">
            Ir a tu dashboard →
          </a>
        </div>
        <p style="font-size:12px;color:#94a3b8;">Sofía · TechNova · <a href="mailto:hola@tech-nova.mx" style="color:#94a3b8;">hola@tech-nova.mx</a></p>
      </div>
    </div>`;
  return { subject, html };
}
