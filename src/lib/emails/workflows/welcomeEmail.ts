const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

export function welcomeEmail(data: { leadName: string; empresa: string }) {
  const { leadName, empresa } = data;
  const subject = `¡Hola ${leadName.split(' ')[0]}! Vic revisará tu sitio en 24-48h`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#0ea5e9,#7c3aed);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">¡Bienvenido a TechNova! 🚀</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${empresa}</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="font-size:15px;">Hola ${leadName.split(' ')[0]},</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;margin:12px 0;">
          Recibimos tu solicitud y estamos emocionados de revisar tu proyecto. <strong>Vic analizará tu sitio web en las próximas 24-48 horas</strong> y preparará una propuesta personalizada.
        </p>
        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;font-size:13px;">
          <p style="margin:0 0 8px;font-weight:700;">📋 Mientras tanto, aquí hay algo útil:</p>
          <p style="margin:0;color:#475569;">Descarga nuestra guía gratuita con los 17 puntos que auditamos en cada sitio web:</p>
          <a href="${BASE_URL}/assets/auditoria-web-express.pdf" style="display:inline-block;margin-top:10px;padding:8px 18px;background:#7c3aed;color:#fff;font-weight:700;text-decoration:none;border-radius:6px;font-size:13px;">
            📄 Descargar guía de auditoría
          </a>
        </div>
        <p style="font-size:13px;color:#64748b;margin-top:20px;">
          ¿Dudas? Escríbenos a <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
          o <a href="https://wa.me/527221669672" style="color:#7c3aed;">WhatsApp</a>
        </p>
        <p style="font-size:12px;color:#94a3b8;margin-top:16px;">Sofía · TechNova · tech-nova.mx</p>
      </div>
    </div>`;
  return { subject, html };
}
