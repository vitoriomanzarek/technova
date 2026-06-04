interface ProposalNotificationData {
  leadName: string;
  empresa: string;
  presupuestoEstimado: number | null; // MXN
  precioTotal: number;                // MXN (from cents / 100)
  modulosCount: number;
  timelineDias: number;
  proposalId: string;
}

function budgetColor(precioTotal: number, presupuesto: number | null): string {
  if (!presupuesto) return '#64748b'; // neutral when no budget specified
  const ratio = precioTotal / presupuesto;
  if (ratio <= 0.9) return '#22c55e';  // green — under budget
  if (ratio <= 1.1) return '#f59e0b';  // amber — close to budget
  return '#ef4444';                    // red — over budget
}

function budgetLabel(precioTotal: number, presupuesto: number | null): string {
  if (!presupuesto) return '⚪ Sin presupuesto de referencia';
  const ratio = precioTotal / presupuesto;
  if (ratio <= 0.9) return '🟢 Dentro del presupuesto';
  if (ratio <= 1.1) return '🟡 Cerca del límite';
  return '🔴 Supera presupuesto — revisar alcance';
}

export function proposalGeneratedNotification(data: ProposalNotificationData) {
  const { leadName, empresa, presupuestoEstimado, precioTotal, modulosCount, timelineDias, proposalId } = data;
  const color = budgetColor(precioTotal, presupuestoEstimado);
  const label = budgetLabel(precioTotal, presupuestoEstimado);
  const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx'}/internal/proposals/${proposalId}`;
  const subject = `📋 Propuesta generada: ${empresa} — $${precioTotal.toLocaleString('es-MX')} MXN`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#7c3aed,#0ea5e9);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">📋 Propuesta IA Generada</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${empresa} — requiere tu revisión</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <!-- Budget indicator -->
        <div style="padding:20px 32px;text-align:center;border-bottom:1px solid #f1f5f9;">
          <div style="display:inline-block;padding:10px 24px;border-radius:8px;background:${color}1a;border:2px solid ${color};">
            <span style="font-size:22px;font-weight:bold;color:${color};">
              $${precioTotal.toLocaleString('es-MX')} MXN
            </span>
          </div>
          <p style="margin:8px 0 0;font-size:14px;color:${color};font-weight:600;">${label}</p>
        </div>

        <!-- Details table -->
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;width:40%;">Lead</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${leadName}</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Empresa</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${empresa}</td>
          </tr>
          ${presupuestoEstimado ? `
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Presupuesto cliente</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">$${presupuestoEstimado.toLocaleString('es-MX')} MXN</td>
          </tr>` : ''}
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Módulos</td>
            <td style="padding:10px 20px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${modulosCount} módulos seleccionados</td>
          </tr>
          <tr>
            <td style="padding:10px 20px;font-weight:bold;color:#64748b;">Timeline</td>
            <td style="padding:10px 20px;color:#1e293b;">${timelineDias} días</td>
          </tr>
        </table>

        <!-- CTA -->
        <div style="padding:24px 32px;">
          <a href="${reviewUrl}"
             style="display:inline-block;padding:14px 28px;background:#7c3aed;color:#fff;font-weight:bold;font-size:15px;text-decoration:none;border-radius:8px;">
            ✅ Revisar y aprobar propuesta →
          </a>
        </div>

        <div style="padding:12px 24px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            TechNova · Propuesta automática B.4.2 · ID: ${proposalId}
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
