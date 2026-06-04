interface AuditNotificationData {
  leadName: string;
  empresa: string;
  websiteUrl: string;
  score: number;
  priorityAreas: string[];
}

function scoreColor(score: number): string {
  if (score >= 70) return '#22c55e'; // green
  if (score >= 45) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

function scoreLabel(score: number): string {
  if (score >= 70) return '✅ Bueno';
  if (score >= 45) return '⚠️ Regular';
  return '🔴 Crítico';
}

export function auditCompleteNotification(data: AuditNotificationData) {
  const { leadName, empresa, websiteUrl, score, priorityAreas } = data;
  const color = scoreColor(score);
  const label = scoreLabel(score);
  const subject = `✅ Auditoría completada: ${empresa} — Score ${score}/100`;

  const areasHtml = priorityAreas
    .map((area, i) => `
      <tr>
        <td style="padding:6px 12px;color:#64748b;font-size:14px;">${i + 1}.</td>
        <td style="padding:6px 12px;color:#1e293b;font-size:14px;">${area}</td>
      </tr>`)
    .join('');

  // Stage 4 link placeholder — will be wired to real URL in B.4.2
  const proposalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx'}/internal/propuestas?lead_source=${encodeURIComponent(websiteUrl)}`;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">✅ Auditoría Completa</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">${empresa}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <!-- Score card -->
        <div style="padding:24px 32px;text-align:center;border-bottom:1px solid #f1f5f9;">
          <div style="display:inline-block;width:100px;height:100px;border-radius:50%;background:${color}1a;border:4px solid ${color};line-height:92px;text-align:center;">
            <span style="font-size:28px;font-weight:bold;color:${color};">${score}</span>
          </div>
          <p style="margin:8px 0 0;font-size:16px;color:${color};font-weight:600;">${label}</p>
        </div>

        <!-- Details -->
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 12px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Lead</td>
            <td style="padding:8px 12px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${leadName}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;font-weight:bold;color:#64748b;border-bottom:1px solid #f1f5f9;">Sitio</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;">
              <a href="${websiteUrl}" style="color:#0ea5e9;">${websiteUrl}</a>
            </td>
          </tr>
        </table>

        <!-- Priority areas -->
        <div style="padding:16px 20px 8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:14px;">🎯 Áreas Críticas</p>
          <table style="width:100%;border-collapse:collapse;">
            ${areasHtml}
          </table>
        </div>

        <!-- CTA -->
        <div style="padding:20px 24px;">
          <a href="${proposalUrl}"
             style="display:inline-block;padding:14px 28px;background:#7c3aed;color:#fff;font-weight:bold;font-size:15px;text-decoration:none;border-radius:8px;">
            📄 Ver Propuesta IA →
          </a>
        </div>

        <div style="padding:12px 24px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            TechNova · Auditoría automática B.4.1 · tech-nova.mx
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
