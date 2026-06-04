const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';

interface ChangeModule {
  nombre: string;
  precio_total: number; // MXN
}

interface ChangesRequestData {
  empresa: string;
  proposalId: string;
  removidos: ChangeModule[];
  agregados: ChangeModule[];
  notas: string;
  precioAnterior: number; // MXN
  precioNuevo: number;    // MXN
}

export function clientRequestedChangesNotification(data: ChangesRequestData) {
  const { empresa, proposalId, removidos, agregados, notas, precioAnterior, precioNuevo } = data;
  const diff = precioNuevo - precioAnterior;
  const diffLabel = diff > 0 ? `+$${diff.toLocaleString('es-MX')}` : `-$${Math.abs(diff).toLocaleString('es-MX')}`;
  const reviewUrl = `${BASE_URL}/admin/proposals-review`;
  const subject = `🔧 Cliente solicitó cambios — ${empresa}`;

  const removidosHtml = removidos.length
    ? removidos.map(m => `<li style="margin:4px 0;color:#ef4444;">❌ ${m.nombre} (-$${m.precio_total.toLocaleString('es-MX')})</li>`).join('')
    : '<li style="color:#94a3b8;">Ninguno</li>';

  const agregadosHtml = agregados.length
    ? agregados.map(m => `<li style="margin:4px 0;color:#22c55e;">✅ ${m.nombre} (+$${m.precio_total.toLocaleString('es-MX')})</li>`).join('')
    : '<li style="color:#94a3b8;">Ninguno</li>';

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#f59e0b;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">🔧 Cliente solicitó cambios</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">${empresa}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <div style="padding:20px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 10px;font-weight:700;font-size:14px;">Módulos eliminados:</p>
          <ul style="margin:0;padding:0 0 0 16px;">${removidosHtml}</ul>
        </div>

        <div style="padding:20px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 10px;font-weight:700;font-size:14px;">Módulos agregados:</p>
          <ul style="margin:0;padding:0 0 0 16px;">${agregadosHtml}</ul>
        </div>

        <div style="padding:16px 32px;background:#fafafa;border-bottom:1px solid #f1f5f9;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr>
              <td style="padding:4px 0;color:#64748b;">Precio anterior</td>
              <td style="padding:4px 0;text-align:right;color:#1e293b;">$${precioAnterior.toLocaleString('es-MX')} MXN</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;">Precio nuevo</td>
              <td style="padding:4px 0;text-align:right;font-weight:700;color:#7c3aed;">$${precioNuevo.toLocaleString('es-MX')} MXN</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;">Diferencia</td>
              <td style="padding:4px 0;text-align:right;font-weight:700;color:${diff > 0 ? '#22c55e' : '#ef4444'};">${diffLabel} MXN</td>
            </tr>
          </table>
        </div>

        ${notas ? `
        <div style="padding:16px 32px;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 6px;font-weight:700;font-size:14px;">Notas del cliente:</p>
          <p style="margin:0;font-size:13px;color:#475569;font-style:italic;">"${notas}"</p>
        </div>` : ''}

        <div style="padding:20px 32px;">
          <a href="${reviewUrl}"
             style="display:inline-block;padding:12px 28px;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            Revisar propuesta →
          </a>
          <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">ID: ${proposalId}</p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
