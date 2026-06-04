const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface ExpiredData {
  leadName: string;
  empresa: string;
  precioTotal: number; // MXN
}

export function proposalExpiredEmail(data: ExpiredData) {
  const { leadName, empresa, precioTotal } = data;
  const subject = `Tu propuesta de ${empresa} ha vencido — ¿La renovamos?`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#64748b;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">Propuesta vencida</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${empresa}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="margin:0 0 16px;font-size:15px;color:#1e293b;">Hola ${leadName.split(' ')[0]},</p>
        <p style="margin:0 0 16px;font-size:14px;color:#475569;line-height:1.6;">
          Tu propuesta de <strong>$${precioTotal.toLocaleString('es-MX')} MXN</strong> para ${empresa} ya venció (14 días de vigencia).
        </p>
        <p style="margin:0 0 20px;font-size:14px;color:#475569;line-height:1.6;">
          Si sigues interesado en transformar tu sitio web, no hay problema — podemos renovarla. Cuéntanos si algo cambió en tu presupuesto o prioridades y lo ajustamos.
        </p>

        <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#1e293b;">Opciones:</p>
          <p style="margin:0 0 6px;font-size:13px;color:#475569;">• <strong>Renovar la propuesta</strong> — Escríbenos y la actualizamos</p>
          <p style="margin:0;font-size:13px;color:#475569;">• <strong>Ajustar el alcance</strong> — Si tu presupuesto cambió, lo adaptamos</p>
        </div>

        <div style="text-align:center;margin-bottom:20px;">
          <a href="mailto:hola@tech-nova.mx?subject=Renovar%20propuesta%20${encodeURIComponent(empresa)}"
             style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;">
            Solicitar nueva propuesta →
          </a>
        </div>

        <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
          Sofía · TechNova · <a href="${BASE_URL}" style="color:#94a3b8;">tech-nova.mx</a>
          &nbsp;·&nbsp;
          <a href="https://wa.me/527221669672" style="color:#94a3b8;">+52 722 166 9672</a>
        </p>
      </div>
    </div>
  `;

  return { subject, html };
}
