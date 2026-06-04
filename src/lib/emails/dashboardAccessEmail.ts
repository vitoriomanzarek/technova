const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface DashboardAccessData {
  leadName: string;
  empresa: string;
  token: string;
  precioTotal: number;    // MXN
  kickoffDate: string;    // YYYY-MM-DD
  estimatedCompletion: string; // YYYY-MM-DD
  modulos: Array<{ nombre: string; horas: number }>;
}

export function dashboardAccessEmail(data: DashboardAccessData) {
  const { leadName, empresa, token, precioTotal, kickoffDate, estimatedCompletion, modulos } = data;
  const dashboardUrl = `${BASE_URL}/cliente/dashboard?token=${token}`;
  const subject = `🚀 Tu dashboard de proyecto está listo | ${empresa}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const half = Math.round(precioTotal / 2);

  const modulosHtml = modulos
    .map(m => `<li style="margin:3px 0;font-size:13px;color:#475569;">• ${m.nombre} (${m.horas}h)</li>`)
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#7c3aed,#0ea5e9);padding:28px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:21px;font-weight:800;">Tu dashboard está listo 🚀</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
          ${leadName.split(' ')[0]}, sigue el progreso de tu proyecto en tiempo real.
        </p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <div style="padding:24px 32px;text-align:center;border-bottom:1px solid #f1f5f9;">
          <a href="${dashboardUrl}"
             style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#7c3aed,#0ea5e9);color:#fff;font-weight:800;font-size:16px;text-decoration:none;border-radius:10px;">
            Acceder a mi dashboard →
          </a>
          <p style="margin:10px 0 0;font-size:11px;color:#94a3b8;">
            Link válido por 90 días · <a href="${dashboardUrl}" style="color:#94a3b8;">${dashboardUrl.slice(0, 50)}…</a>
          </p>
        </div>

        <div style="padding:20px 32px;border-bottom:1px solid #f1f5f9;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:4px 0;color:#64748b;">Empresa</td><td style="padding:4px 0;font-weight:600;">${empresa}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;">Kickoff</td><td style="padding:4px 0;color:#7c3aed;font-weight:600;">${fmtDate(kickoffDate)}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;">Entrega est.</td><td style="padding:4px 0;">${fmtDate(estimatedCompletion)}</td></tr>
            <tr><td style="padding:4px 0;color:#f59e0b;font-weight:600;">Pago restante</td><td style="padding:4px 0;color:#f59e0b;font-weight:600;">$${half.toLocaleString('es-MX')} MXN (al iniciar)</td></tr>
          </table>
        </div>

        <div style="padding:16px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;">Módulos del proyecto:</p>
          <ul style="margin:0;padding:0;">${modulosHtml}</ul>
        </div>

        <div style="padding:16px 32px;background:#f8fafc;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;">📋 En el dashboard puedes:</p>
          <ul style="margin:0;padding:0 0 0 16px;font-size:13px;color:#475569;line-height:1.8;">
            <li>Ver el timeline completo del proyecto</li>
            <li>Acceder al repo, Figma, assets y documentación</li>
            <li>Reservar tu Kickoff Call con Vic</li>
            <li>Pagar el 50% restante cuando llegue la fecha</li>
          </ul>
        </div>

        <div style="padding:12px 32px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            ¿Preguntas? <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/527221669672" style="color:#7c3aed;">+52 722 166 9672</a>
          </p>
          <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Sofía · TechNova · tech-nova.mx</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
