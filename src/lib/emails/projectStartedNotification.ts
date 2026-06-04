const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface ProjectModule {
  nombre: string;
  horas: number;
}

interface ProjectStartedData {
  // To client
  leadName: string;
  empresa: string;
  leadEmail: string;
  montoPagado: number;    // MXN
  precioTotal: number;    // MXN
  timelineDias: number;
  fechaInicio: string;    // YYYY-MM-DD
  fechaFin: string;       // YYYY-MM-DD
  modulos: ProjectModule[];
  proposalId: string;
  projectId: string;
}

export function projectStartedToClient(data: ProjectStartedData) {
  const { leadName, empresa, montoPagado, precioTotal, timelineDias, fechaInicio, fechaFin, modulos, proposalId } = data;
  const montoRestante = precioTotal - montoPagado;
  const subject = `🚀 ¡Tu proyecto inicia el ${new Date(fechaInicio).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}! | Tech Nova`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const contractUrl = `${BASE_URL}/api/checkout/${proposalId}/contract`;

  const modulosHtml = modulos.map(m =>
    `<li style="margin:4px 0;font-size:13px;color:#475569;">• ${m.nombre} (${m.horas}h)</li>`
  ).join('');

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#22c55e,#7c3aed);padding:28px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">¡Tu proyecto comienza! 🚀</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
          ${leadName.split(' ')[0]}, recibimos tu pago. ¡Estamos emocionados!
        </p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <div style="padding:20px 32px;background:#f0fdf4;border-bottom:1px solid #dcfce7;text-align:center;">
          <p style="margin:0;font-size:13px;color:#16a34a;">✅ Pago recibido</p>
          <p style="margin:4px 0;font-size:26px;font-weight:800;color:#15803d;">$${montoPagado.toLocaleString('es-MX')} MXN</p>
          <p style="margin:0;font-size:12px;color:#16a34a;">50% inicial · ${empresa}</p>
        </div>

        <div style="padding:20px 32px;border-bottom:1px solid #f1f5f9;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:5px 0;color:#64748b;">Empresa</td><td style="padding:5px 0;text-align:right;font-weight:600;">${empresa}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;">Kickoff</td><td style="padding:5px 0;text-align:right;font-weight:600;color:#7c3aed;">${fmtDate(fechaInicio)}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;">Entrega estimada</td><td style="padding:5px 0;text-align:right;">${fmtDate(fechaFin)}</td></tr>
            <tr><td style="padding:5px 0;color:#64748b;">Timeline</td><td style="padding:5px 0;text-align:right;">${timelineDias} días</td></tr>
            <tr><td style="padding:5px 0;color:#f59e0b;font-weight:600;">Pago restante</td><td style="padding:5px 0;text-align:right;color:#f59e0b;font-weight:600;">$${montoRestante.toLocaleString('es-MX')} MXN (al iniciar)</td></tr>
          </table>
        </div>

        <div style="padding:16px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;">Módulos del proyecto:</p>
          <ul style="margin:0;padding:0;">${modulosHtml}</ul>
        </div>

        <div style="padding:16px 32px;background:#fafafa;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:700;">📋 Próximos pasos:</p>
          <ol style="margin:0;padding:0 0 0 18px;font-size:13px;color:#475569;line-height:1.8;">
            <li>Vic te contactará en <strong>24 horas</strong> para confirmar la kickoff call</li>
            <li>Kickoff call el <strong>${fmtDate(fechaInicio)}</strong> (30-45 min)</li>
            <li>Inicio del proyecto y actualizaciones semanales</li>
            <li>El pago del 50% restante ($${montoRestante.toLocaleString('es-MX')}) se solicita al iniciar</li>
          </ol>
        </div>

        <div style="padding:16px 32px;">
          <a href="${contractUrl}"
             style="display:inline-block;padding:10px 20px;background:#1e293b;color:#fff;font-weight:700;font-size:13px;text-decoration:none;border-radius:8px;">
            📄 Descargar contrato firmado
          </a>
        </div>

        <div style="padding:12px 32px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            ¿Preguntas? <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/527221669672" style="color:#7c3aed;">WhatsApp</a>
          </p>
          <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">Sofía · TechNova · tech-nova.mx</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}

export function projectStartedToVic(data: ProjectStartedData) {
  const { empresa, leadName, leadEmail, montoPagado, precioTotal, timelineDias, fechaInicio, fechaFin, modulos, projectId } = data;
  const subject = `💰 NUEVO CLIENTE — ${empresa} | $${montoPagado.toLocaleString('es-MX')} MXN recibido`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const modulosHtml = modulos.map(m =>
    `<li style="margin:3px 0;font-size:13px;">• ${m.nombre} (${m.horas}h)</li>`
  ).join('');

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#15803d;padding:20px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:18px;">💰 Nuevo cliente pagado</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${empresa} — $${montoPagado.toLocaleString('es-MX')} MXN recibido</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
          <tr><td style="padding:5px 0;color:#64748b;width:40%;">Empresa</td><td style="font-weight:600;">${empresa}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Contacto</td><td>${leadName} · <a href="mailto:${leadEmail}" style="color:#7c3aed;">${leadEmail}</a></td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Pagó</td><td style="font-weight:700;color:#15803d;">$${montoPagado.toLocaleString('es-MX')} MXN (50%)</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Total proyecto</td><td>$${precioTotal.toLocaleString('es-MX')} MXN</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Kickoff</td><td style="font-weight:600;color:#7c3aed;">${fmtDate(fechaInicio)}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Entrega</td><td>${fmtDate(fechaFin)} (${timelineDias}d)</td></tr>
        </table>

        <p style="margin:0 0 6px;font-size:13px;font-weight:600;">Módulos:</p>
        <ul style="margin:0 0 16px;padding:0;">${modulosHtml}</ul>

        <div style="background:#f0fdf4;border-radius:8px;padding:12px 16px;font-size:13px;">
          <p style="margin:0 0 6px;font-weight:700;color:#15803d;">📋 Tus próximos pasos:</p>
          <ol style="margin:0;padding:0 0 0 18px;color:#15803d;line-height:1.8;">
            <li>Agenda kickoff call con cliente (hoy o mañana)</li>
            <li>Kickoff call: ${fmtDate(fechaInicio)}</li>
            <li>ID del proyecto: <code>${projectId}</code></li>
          </ol>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
