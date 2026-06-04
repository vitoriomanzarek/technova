interface ProposalModule {
  nombre: string;
  precio_total: number; // MXN
  horas: number;
  justificacion: string;
  componentes: string[];
}

interface PdfProposalData {
  empresa: string;
  leadName: string;
  leadEmail: string;
  auditScore: number;
  priorityAreas: string[];
  auditSummary: string;
  modulos: ProposalModule[];
  precioSubtotal: number;
  pmFee: number;
  precioTotal: number;
  timelineDias: number;
  fechaEntrega: string;
  fechaPropuesta: string;
  expiresAt: string;
}

function buildPdfHtml(data: PdfProposalData): string {
  const scoreColor = data.auditScore >= 70 ? '#22c55e' : data.auditScore >= 45 ? '#f59e0b' : '#ef4444';
  const dateFormat = (d: string) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  const modulosHtml = data.modulos.map((m, i) => `
    <div style="margin-bottom:20px;padding:16px;border:1px solid #e2e8f0;border-radius:8px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div>
          <span style="font-size:12px;color:#7c3aed;font-weight:600;">${i + 1}.</span>
          <strong style="font-size:15px;color:#1e293b;margin-left:4px;">${m.nombre}</strong>
        </div>
        <div style="text-align:right;">
          <div style="font-size:16px;font-weight:700;color:#7c3aed;">$${m.precio_total.toLocaleString('es-MX')} MXN</div>
          <div style="font-size:12px;color:#64748b;">${m.horas} horas</div>
        </div>
      </div>
      <p style="margin:0 0 6px;font-size:13px;color:#475569;line-height:1.5;">${m.justificacion}</p>
      <p style="margin:0;font-size:11px;color:#94a3b8;">Componentes: ${m.componentes.join(', ')}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; background: #fff; }
  .page { max-width: 720px; margin: 0 auto; padding: 48px; }
  h1 { font-size: 28px; font-weight: 800; color: #7c3aed; margin-bottom: 4px; }
  h2 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 24px 0 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  .header-meta { font-size: 12px; color: #64748b; margin-bottom: 32px; }
  .kv-grid { display: grid; grid-template-columns: 140px 1fr; gap: 6px 16px; font-size: 13px; margin-bottom: 16px; }
  .kv-label { color: #64748b; font-weight: 600; }
  .kv-value { color: #1e293b; }
  .score-badge { display:inline-block; padding: 6px 14px; border-radius: 99px; font-size: 18px; font-weight: 800; background: ${scoreColor}1a; color: ${scoreColor}; border: 2px solid ${scoreColor}; }
  .summary-box { background: #f8fafc; border-radius: 8px; padding: 14px; margin: 12px 0; font-size: 13px; color: #475569; line-height: 1.6; }
  .price-table { width: 100%; border-collapse: collapse; }
  .price-table td { padding: 8px 0; font-size: 14px; }
  .price-table .label { color: #64748b; }
  .price-table .value { text-align: right; color: #1e293b; }
  .price-total { border-top: 2px solid #7c3aed; }
  .price-total td { padding-top: 12px; font-size: 18px; font-weight: 800; }
  .price-total .label { color: #1e293b; }
  .price-total .value { color: #7c3aed; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div class="page">

  <div style="margin-bottom:8px;">
    <span style="font-size:11px;color:#94a3b8;letter-spacing:0.1em;text-transform:uppercase;">TechNova · Propuesta Técnica</span>
  </div>
  <h1>Propuesta para ${data.empresa}</h1>
  <div class="header-meta">
    ${dateFormat(data.fechaPropuesta)} &nbsp;·&nbsp; Válida hasta el ${dateFormat(data.expiresAt)}
  </div>

  <h2>Datos del Cliente</h2>
  <div class="kv-grid">
    <span class="kv-label">Empresa</span><span class="kv-value">${data.empresa}</span>
    <span class="kv-label">Contacto</span><span class="kv-value">${data.leadName}</span>
    <span class="kv-label">Email</span><span class="kv-value">${data.leadEmail}</span>
  </div>

  <h2>Análisis del Sitio Actual</h2>
  <div style="margin-bottom:12px;">
    <span class="score-badge">${data.auditScore}/100</span>
  </div>
  <div class="summary-box">${data.auditSummary}</div>
  <p style="font-size:13px;color:#64748b;margin-top:10px;font-weight:600;">Áreas críticas identificadas:</p>
  <ul style="margin:6px 0 0 16px;font-size:13px;color:#475569;">
    ${data.priorityAreas.map(a => `<li style="margin:3px 0;">${a}</li>`).join('')}
  </ul>

  <h2>Solución Propuesta</h2>
  ${modulosHtml}

  <h2>Desglose de Inversión</h2>
  <table class="price-table">
    <tr><td class="label">Subtotal técnico</td><td class="value">$${data.precioSubtotal.toLocaleString('es-MX')} MXN</td></tr>
    <tr><td class="label">Gestión del proyecto (20%)</td><td class="value">$${data.pmFee.toLocaleString('es-MX')} MXN</td></tr>
    <tr class="price-total"><td class="label">TOTAL</td><td class="value">$${data.precioTotal.toLocaleString('es-MX')} MXN</td></tr>
  </table>
  <p style="margin-top:10px;font-size:12px;color:#94a3b8;">
    Pago: 50% al aprobar ($${Math.round(data.precioTotal / 2).toLocaleString('es-MX')}) · 50% al iniciar ($${Math.round(data.precioTotal / 2).toLocaleString('es-MX')})
  </p>

  <h2>Timeline</h2>
  <div class="kv-grid">
    <span class="kv-label">Duración</span><span class="kv-value">${data.timelineDias} días</span>
    <span class="kv-label">Entrega estimada</span><span class="kv-value">${dateFormat(data.fechaEntrega)}</span>
  </div>

  <h2>Próximos Pasos</h2>
  <ol style="font-size:13px;color:#475569;line-height:1.8;padding-left:18px;">
    <li>Revisa esta propuesta y confirma si tienes preguntas</li>
    <li>Aprueba y realiza pago del 50% inicial</li>
    <li>Agendamos kickoff call de 30 minutos</li>
    <li>Iniciamos el proyecto</li>
  </ol>

  <div class="footer">
    <p>TechNova · hola@tech-nova.mx · +52 722 166 9672 · tech-nova.mx</p>
    <p style="margin-top:4px;">Esta propuesta es válida por 14 días a partir de su emisión.</p>
  </div>

</div>
</body>
</html>`;
}

export async function generateProposalPdf(data: PdfProposalData): Promise<Buffer> {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(buildPdfHtml(data), { waitUntil: 'load' });
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

export { buildPdfHtml };
