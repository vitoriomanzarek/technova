const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface ContractEmailData {
  leadName: string;
  empresa: string;
  precioTotal: number; // MXN
  timelineDias: number;
  fechaInicio: string;
  proposalId: string;
}

export function contractForSignature(data: ContractEmailData) {
  const { leadName, empresa, precioTotal, timelineDias, fechaInicio, proposalId } = data;
  const half = Math.round(precioTotal / 2);
  const contractUrl = `${BASE_URL}/api/checkout/${proposalId}/contract`;
  const checkoutUrl = `${BASE_URL}/checkout/${proposalId}`;
  const subject = `📋 Contrato para revisar — ${empresa} | Tech Nova`;
  const fechaFmt = new Date(fechaInicio).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#7c3aed,#0ea5e9);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">📋 Tu contrato está listo</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${empresa}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <div style="padding:24px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 12px;font-size:14px;color:#475569;">
            Hola ${leadName.split(' ')[0]}, hemos preparado el contrato de servicios para tu proyecto de <strong>$${precioTotal.toLocaleString('es-MX')} MXN</strong>.
          </p>
          <div style="background:#f8fafc;border-radius:8px;padding:14px 16px;font-size:13px;">
            <p style="margin:0 0 6px;"><strong>✓ 50% ahora:</strong> $${half.toLocaleString('es-MX')} MXN (al completar checkout)</p>
            <p style="margin:0 0 6px;"><strong>✓ 50% al iniciar:</strong> $${half.toLocaleString('es-MX')} MXN (${fechaFmt})</p>
            <p style="margin:0;"><strong>✓ Timeline:</strong> ${timelineDias} días desde el inicio</p>
          </div>
        </div>

        <div style="padding:20px 32px;display:flex;flex-direction:column;gap:10px;">
          <a href="${contractUrl}"
             style="display:block;text-align:center;padding:12px 28px;background:#1e293b;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            📄 Descargar Contrato PDF
          </a>
          <a href="${checkoutUrl}"
             style="display:block;text-align:center;padding:12px 28px;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            💳 Ir a checkout y pagar 50%
          </a>
        </div>

        <div style="padding:12px 32px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            ¿Preguntas sobre el contrato?
            <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/527221669672" style="color:#7c3aed;">WhatsApp</a>
          </p>
          <p style="margin:6px 0 0;font-size:11px;color:#94a3b8;">Sofía · TechNova · tech-nova.mx</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
