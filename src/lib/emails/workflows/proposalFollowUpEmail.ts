export function proposalFollowUpEmail(data: { leadName: string; empresa: string; proposalId: string }) {
  const { leadName, empresa, proposalId } = data;
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';
  const subject = `¿Tienes preguntas sobre tu propuesta? | ${empresa}`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#0ea5e9;padding:22px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:19px;">¿Pudimos ayudarte? 💬</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${empresa}</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="font-size:14px;">Hola ${leadName.split(' ')[0]},</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          Notamos que no has revisado tu propuesta todavía. Entendemos que las decisiones importantes toman tiempo.
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          Vic está disponible para una llamada de <strong>15 minutos</strong> para resolver cualquier duda sobre la propuesta, el precio o el proceso.
        </p>
        <div style="display:flex;gap:10px;margin:20px 0;flex-wrap:wrap;">
          <a href="${BASE_URL}/propuesta/${proposalId}" style="flex:1;min-width:140px;text-align:center;padding:12px;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            Ver propuesta
          </a>
          <a href="https://wa.me/527221669672" style="flex:1;min-width:140px;text-align:center;padding:12px;background:#22c55e;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            💬 WhatsApp
          </a>
        </div>
        <p style="font-size:12px;color:#94a3b8;margin-top:16px;">Sofía · TechNova · <a href="mailto:hola@tech-nova.mx" style="color:#94a3b8;">hola@tech-nova.mx</a></p>
      </div>
    </div>`;
  return { subject, html };
}
