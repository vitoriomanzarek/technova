interface ContractModule {
  nombre: string;
  precio_total: number; // MXN
  horas: number;
  componentes: string[];
}

interface ContractData {
  empresa: string;
  leadName: string;
  leadEmail: string;
  modulos: ContractModule[];
  precioSubtotal: number; // MXN
  pmFee: number;          // MXN
  precioTotal: number;    // MXN
  timelineDias: number;
  fechaInicio: string;   // YYYY-MM-DD
  fechaFin: string;      // YYYY-MM-DD
  proposalId: string;
  generatedAt: string;   // YYYY-MM-DD
}

function buildContractHtml(data: ContractData): string {
  const fmt = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  const half = Math.round(data.precioTotal / 2);

  const modulosRows = data.modulos.map((m, i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;">${i + 1}. ${m.nombre}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right;">$${m.precio_total.toLocaleString('es-MX')} MXN</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;text-align:right;">${m.horas}h</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; font-size: 14px; line-height: 1.6; }
  .page { max-width: 700px; margin: 0 auto; padding: 48px; }
  .header { text-align: center; border-bottom: 3px solid #7c3aed; padding-bottom: 24px; margin-bottom: 28px; }
  .logo { font-size: 22px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px; }
  h1 { font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px; }
  h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7c3aed; margin: 24px 0 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  .parties-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
  .party-box { background: #f8fafc; border-radius: 8px; padding: 14px; border-left: 3px solid #7c3aed; }
  .party-label { font-size: 11px; text-transform: uppercase; color: #7c3aed; font-weight: 700; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; }
  .price-row td { padding: 6px 0; }
  .price-total td { padding-top: 10px; border-top: 2px solid #7c3aed; font-weight: 700; font-size: 15px; }
  .terms-list { list-style: none; padding: 0; }
  .terms-list li { padding: 4px 0; font-size: 13px; color: #475569; }
  .terms-list li::before { content: "✓ "; color: #7c3aed; font-weight: 700; }
  .signature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 16px; }
  .sig-box { border-top: 1px solid #1e293b; padding-top: 8px; font-size: 12px; color: #64748b; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  .highlight { background: #f0f4ff; border-radius: 6px; padding: 12px 16px; margin: 8px 0; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="logo">Tech Nova</div>
    <h1>Contrato de Servicios Digitales</h1>
    <p style="font-size:12px;color:#64748b;margin-top:4px;">Folio: ${data.proposalId.slice(0, 8).toUpperCase()} · Emitido: ${fmt(data.generatedAt)}</p>
  </div>

  <h2>1. Partes del Contrato</h2>
  <div class="parties-grid">
    <div class="party-box">
      <div class="party-label">Proveedor</div>
      <p style="font-weight:600;">Tech Nova México</p>
      <p style="font-size:12px;color:#64748b;">hola@tech-nova.mx</p>
      <p style="font-size:12px;color:#64748b;">+52 722 166 9672</p>
    </div>
    <div class="party-box">
      <div class="party-label">Cliente</div>
      <p style="font-weight:600;">${data.empresa}</p>
      <p style="font-size:12px;color:#64748b;">${data.leadName}</p>
      <p style="font-size:12px;color:#64748b;">${data.leadEmail}</p>
    </div>
  </div>

  <h2>2. Servicios Contratados</h2>
  <table>
    <thead>
      <tr style="background:#f8fafc;">
        <th style="padding:8px 12px;text-align:left;font-size:12px;color:#64748b;font-weight:600;">Módulo</th>
        <th style="padding:8px 12px;text-align:right;font-size:12px;color:#64748b;font-weight:600;">Precio</th>
        <th style="padding:8px 12px;text-align:right;font-size:12px;color:#64748b;font-weight:600;">Horas</th>
      </tr>
    </thead>
    <tbody>${modulosRows}</tbody>
  </table>

  <h2>3. Presupuesto Total</h2>
  <table class="price-table" style="max-width:300px;">
    <tr class="price-row"><td style="color:#64748b;">Subtotal técnico</td><td style="text-align:right;">$${data.precioSubtotal.toLocaleString('es-MX')} MXN</td></tr>
    <tr class="price-row"><td style="color:#64748b;">Gestión de proyecto (20%)</td><td style="text-align:right;">$${data.pmFee.toLocaleString('es-MX')} MXN</td></tr>
    <tr class="price-total"><td>TOTAL</td><td style="text-align:right;color:#7c3aed;">$${data.precioTotal.toLocaleString('es-MX')} MXN</td></tr>
  </table>

  <h2>4. Términos de Pago</h2>
  <div class="highlight">
    <p><strong>Primer pago (50%):</strong> $${half.toLocaleString('es-MX')} MXN — Al firmar este contrato</p>
    <p><strong>Segundo pago (50%):</strong> $${half.toLocaleString('es-MX')} MXN — Al iniciar el proyecto (${fmt(data.fechaInicio)})</p>
  </div>

  <h2>5. Timeline del Proyecto</h2>
  <table style="max-width:280px;">
    <tr class="price-row"><td style="color:#64748b;padding-right:24px;">Duración estimada</td><td>${data.timelineDias} días hábiles</td></tr>
    <tr class="price-row"><td style="color:#64748b;">Fecha de inicio</td><td>${fmt(data.fechaInicio)}</td></tr>
    <tr class="price-row"><td style="color:#64748b;">Entrega estimada</td><td>${fmt(data.fechaFin)}</td></tr>
  </table>

  <h2>6. Condiciones Generales</h2>
  <ul class="terms-list">
    <li>Trabajo bajo contrato de servicios (no relación laboral)</li>
    <li>Confidencialidad (NDA) incluida desde la firma</li>
    <li>La propiedad intelectual (IP) pasa al cliente al recibir pago completo</li>
    <li>Cancelación antes de iniciar: penalidad del 50% del primer pago</li>
    <li>Garantía: 30 días de soporte post-entrega sin costo adicional</li>
    <li>Modificaciones de alcance (scope changes) sujetas a cotización adicional</li>
    <li>Los precios son en Pesos Mexicanos (MXN) e incluyen IVA</li>
  </ul>

  <h2>7. Firmas</h2>
  <div class="signature-grid">
    <div class="sig-box">
      <p style="font-weight:600;margin-bottom:24px;">Tech Nova México</p>
      <p>Representante autorizado</p>
      <p>Fecha: ${fmt(data.generatedAt)}</p>
    </div>
    <div class="sig-box">
      <p style="font-weight:600;margin-bottom:24px;">${data.empresa}</p>
      <p>${data.leadName}</p>
      <p>${data.leadEmail}</p>
    </div>
  </div>

  <div style="margin-top:20px;padding:12px 16px;background:#f0f4ff;border-radius:8px;font-size:12px;">
    <strong>☑ Al completar el pago en línea, el cliente acepta los términos de este contrato.</strong><br>
    El pago electrónico a través de Stripe constituye firma digital válida de este acuerdo.
  </div>

  <div class="footer">
    <p>Tech Nova · hola@tech-nova.mx · tech-nova.mx · +52 722 166 9672</p>
    <p>Folio: ${data.proposalId} · Generado: ${data.generatedAt}</p>
  </div>

</div>
</body>
</html>`;
}

export async function generateContractPdf(data: ContractData): Promise<Buffer> {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(buildContractHtml(data), { waitUntil: 'load' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
