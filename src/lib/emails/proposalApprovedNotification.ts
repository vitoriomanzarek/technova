interface ProposalApprovedData {
  empresa: string;
  leadName: string;
  precioTotal: number;   // MXN (not cents)
  timelineDias: number;
  proposalId: string;
  aprobadoPor: string;
  notas?: string | null;
}

export function proposalApprovedNotification(data: ProposalApprovedData) {
  const { empresa, leadName, precioTotal, timelineDias, proposalId, aprobadoPor, notas } = data;
  const subject = `✅ Propuesta aprobada: ${empresa} — lista para enviar`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#22c55e,#0ea5e9);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">✅ Propuesta Aprobada</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${empresa} — lista para enviar al cliente</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;width:40%;">Lead</td>
            <td style="padding:12px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${leadName}</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Empresa</td>
            <td style="padding:12px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${empresa}</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Precio total</td>
            <td style="padding:12px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;font-weight:bold;">$${precioTotal.toLocaleString('es-MX')} MXN</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Timeline</td>
            <td style="padding:12px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${timelineDias} días</td>
          </tr>
          <tr>
            <td style="padding:12px 20px;font-weight:bold;color:#64748b;${notas ? 'border-bottom:1px solid #f1f5f9;' : ''}">Aprobado por</td>
            <td style="padding:12px 20px;color:#1e293b;${notas ? 'border-bottom:1px solid #f1f5f9;' : ''}">${aprobadoPor}</td>
          </tr>
          ${notas ? `
          <tr>
            <td style="padding:12px 20px;font-weight:bold;color:#64748b;">Notas</td>
            <td style="padding:12px 20px;color:#64748b;font-style:italic;">${notas}</td>
          </tr>` : ''}
        </table>

        <div style="padding:20px 24px;background:#f0fdf4;border-top:2px solid #22c55e;">
          <p style="margin:0;font-size:14px;color:#15803d;font-weight:600;">
            🚀 Próximo paso: Envía esta propuesta al cliente (B.4.4)
          </p>
          <p style="margin:4px 0 0;font-size:12px;color:#16a34a;">
            ID: ${proposalId}
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
