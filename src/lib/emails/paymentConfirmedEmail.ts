const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface PaymentConfirmedData {
  leadName: string;
  empresa: string;
  montoPagado: number;  // MXN
  precioTotal: number;  // MXN
  timelineDias: number;
  fechaEntrega: string;
  proposalId: string;
}

export function paymentConfirmedEmail(data: PaymentConfirmedData) {
  const { leadName, empresa, montoPagado, precioTotal, timelineDias, fechaEntrega, proposalId } = data;
  const montoRestante = precioTotal - montoPagado;
  const subject = `✅ Pago confirmado — ${empresa} | Proyecto iniciando`;
  const fechaFmt = new Date(fechaEntrega).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#22c55e,#0ea5e9);padding:28px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">¡Pago recibido! 🎉</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Tu proyecto con TechNova está comenzando, ${leadName.split(' ')[0]}.</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <div style="padding:24px 32px;background:#f0fdf4;border-bottom:1px solid #dcfce7;text-align:center;">
          <p style="margin:0;font-size:13px;color:#16a34a;">Pago recibido</p>
          <p style="margin:4px 0;font-size:28px;font-weight:800;color:#15803d;">$${montoPagado.toLocaleString('es-MX')} MXN</p>
          <p style="margin:0;font-size:12px;color:#16a34a;">50% inicial · ${empresa}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;width:45%;">Empresa</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${empresa}</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Timeline</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${timelineDias} días</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Entrega estimada</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${fechaFmt}</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;">Pago restante</td>
            <td style="padding:10px 20px;color:#f59e0b;font-weight:700;">$${montoRestante.toLocaleString('es-MX')} MXN (al iniciar)</td>
          </tr>
        </table>

        <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1e293b;">📋 Próximos pasos:</p>
          <ol style="margin:0;padding:0 0 0 18px;font-size:13px;color:#475569;line-height:1.8;">
            <li>Vic te contactará en <strong>24 horas</strong> para la llamada de kickoff</li>
            <li>Agendan inicio de proyecto</li>
            <li>Recibes actualizaciones en cada etapa</li>
            <li>Al iniciar, pagas el 50% restante ($${montoRestante.toLocaleString('es-MX')} MXN)</li>
          </ol>
        </div>

        <div style="padding:16px 32px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:13px;color:#475569;">
            ¿Preguntas?
            <a href="mailto:hola@tech-nova.mx" style="color:#7c3aed;">hola@tech-nova.mx</a>
            &nbsp;·&nbsp;
            <a href="https://wa.me/527221669672" style="color:#7c3aed;">WhatsApp</a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">Sofía · TechNova · ID: ${proposalId}</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
