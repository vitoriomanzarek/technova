interface ProposalModule {
  modulo_id: string;
  nombre: string;
  precio_total: number; // MXN
  horas: number;
  justificacion: string;
}

interface ProposalSentData {
  leadName: string;
  empresa: string;
  leadEmail: string;
  auditScore: number;
  priorityAreas: string[];
  modulos: ProposalModule[];
  precioSubtotal: number; // MXN
  pmFee: number;          // MXN
  precioTotal: number;    // MXN
  timelineDias: number;
  proposalId: string;
  expiresAt: string; // YYYY-MM-DD
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

export function proposalSentToClient(data: ProposalSentData) {
  const {
    leadName, empresa, auditScore, priorityAreas, modulos,
    precioSubtotal, pmFee, precioTotal, timelineDias, proposalId, expiresAt,
  } = data;

  const proposalUrl = `${BASE_URL}/propuesta/${proposalId}`;
  const subject = `📋 Tu propuesta personalizada — ${empresa} | $${precioTotal.toLocaleString('es-MX')} MXN`;

  const modulosHtml = modulos
    .map(m => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;color:#1e293b;font-size:14px;">
          <strong>${m.nombre}</strong>
          <div style="color:#64748b;font-size:12px;margin-top:2px;">${m.justificacion.slice(0, 100)}…</div>
        </td>
        <td style="padding:10px 16px;border-bottom:1px solid #f1f5f9;text-align:right;white-space:nowrap;color:#7c3aed;font-weight:bold;font-size:14px;">
          $${m.precio_total.toLocaleString('es-MX')}
          <div style="color:#94a3b8;font-size:11px;font-weight:normal;">${m.horas}h</div>
        </td>
      </tr>`)
    .join('');

  const areasHtml = priorityAreas
    .map(a => `<li style="margin:4px 0;font-size:14px;color:#1e293b;">• ${a}</li>`)
    .join('');

  const scoreColor = auditScore >= 70 ? '#22c55e' : auditScore >= 45 ? '#f59e0b' : '#ef4444';
  const expiresFormatted = new Date(expiresAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;color:#1e293b;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#0ea5e9);padding:32px;border-radius:12px 12px 0 0;">
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">TechNova · Propuesta personalizada</p>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">Tu propuesta está lista, ${leadName.split(' ')[0]} 🚀</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Analizamos tu sitio y preparamos una solución a la medida.</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <!-- Audit summary -->
        <div style="padding:24px 32px;border-bottom:1px solid #f1f5f9;background:#fafafa;">
          <p style="margin:0 0 12px;font-weight:700;font-size:15px;color:#1e293b;">🔍 Resumen de la auditoría</p>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="width:56px;height:56px;border-radius:50%;background:${scoreColor}1a;border:3px solid ${scoreColor};display:flex;align-items:center;justify-content:center;text-align:center;">
              <span style="font-size:18px;font-weight:bold;color:${scoreColor};">${auditScore}</span>
            </div>
            <span style="font-size:13px;color:#64748b;">Score de tu sitio actual</span>
          </div>
          <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Áreas críticas identificadas:</p>
          <ul style="margin:0;padding:0;list-style:none;">${areasHtml}</ul>
        </div>

        <!-- Modules -->
        <div style="padding:24px 32px 0;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 12px;font-weight:700;font-size:15px;color:#1e293b;">✨ Nuestra propuesta para ${empresa}</p>
          <table style="width:100%;border-collapse:collapse;">${modulosHtml}</table>
        </div>

        <!-- Price breakdown -->
        <div style="padding:20px 32px;background:#fafafa;border-bottom:1px solid #f1f5f9;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#64748b;">Subtotal técnico</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b;text-align:right;">$${precioSubtotal.toLocaleString('es-MX')} MXN</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#64748b;">Gestión del proyecto (20%)</td>
              <td style="padding:6px 0;font-size:14px;color:#1e293b;text-align:right;">$${pmFee.toLocaleString('es-MX')} MXN</td>
            </tr>
            <tr>
              <td style="padding:10px 0 0;font-size:16px;font-weight:800;color:#1e293b;border-top:2px solid #e2e8f0;">TOTAL</td>
              <td style="padding:10px 0 0;font-size:16px;font-weight:800;color:#7c3aed;text-align:right;border-top:2px solid #e2e8f0;">$${precioTotal.toLocaleString('es-MX')} MXN</td>
            </tr>
          </table>
          <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">
            Pago: 50% al aprobar · 50% al iniciar · Timeline: ${timelineDias} días
          </p>
        </div>

        <!-- CTA -->
        <div style="padding:28px 32px;text-align:center;">
          <a href="${proposalUrl}"
             style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#7c3aed,#0ea5e9);color:#fff;font-weight:800;font-size:16px;text-decoration:none;border-radius:10px;">
            Ver mi propuesta completa →
          </a>
          <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">
            Válida hasta el ${expiresFormatted}
          </p>
        </div>

        <!-- Contact -->
        <div style="padding:16px 32px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 4px;font-size:13px;color:#1e293b;font-weight:600;">¿Dudas? Estamos aquí:</p>
          <p style="margin:0;font-size:13px;color:#64748b;">
            📧 <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
            &nbsp;·&nbsp;
            📱 <a href="https://wa.me/527221669672" style="color:#7c3aed;">+52 722 166 9672</a>
          </p>
          <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">
            Sofía · TechNova · tech-nova.mx
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
