export function auditReadyEmail(data: { leadName: string; empresa: string; auditScore: number; proposalId?: string }) {
  const { leadName, empresa, auditScore, proposalId } = data;
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';
  const scoreColor = auditScore >= 70 ? '#22c55e' : auditScore >= 45 ? '#f59e0b' : '#ef4444';
  const subject = `🔍 Auditoría completada — ${empresa} | Score ${auditScore}/100`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#1e293b;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">🔍 Tu auditoría está lista</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">${empresa}</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="font-size:14px;">Hola ${leadName.split(' ')[0]},</p>
        <div style="text-align:center;padding:20px;background:#f8fafc;border-radius:8px;margin:12px 0;">
          <div style="display:inline-block;width:80px;height:80px;border-radius:50%;border:4px solid ${scoreColor};background:${scoreColor}1a;line-height:72px;text-align:center;">
            <span style="font-size:24px;font-weight:800;color:${scoreColor};">${auditScore}</span>
          </div>
          <p style="margin:8px 0 0;font-size:14px;color:${scoreColor};font-weight:600;">Score de tu sitio actual</p>
        </div>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          Analizamos tu sitio en 17 puntos clave. ${auditScore < 50 ? 'Hay oportunidades importantes de mejora que pueden impactar directamente tus conversiones.' : 'Tu sitio tiene una base sólida, hay optimizaciones que pueden potenciarlo aún más.'}
        </p>
        ${proposalId ? `
        <div style="text-align:center;margin:20px 0;">
          <a href="${BASE_URL}/propuesta/${proposalId}" style="display:inline-block;padding:14px 28px;background:#7c3aed;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;">
            Ver propuesta completa →
          </a>
        </div>` : `<p style="font-size:13px;color:#64748b;margin-top:12px;">Vic está preparando tu propuesta personalizada. Te la enviaremos en las próximas horas.</p>`}
        <p style="font-size:12px;color:#94a3b8;margin-top:20px;">Sofía · TechNova · tech-nova.mx</p>
      </div>
    </div>`;
  return { subject, html };
}
