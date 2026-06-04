export function urgentCheckoutEmail(data: { leadName: string; empresa: string; proposalId: string; precioTotal: number }) {
  const { leadName, empresa, proposalId, precioTotal } = data;
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';
  const subject = `⏰ Tu propuesta vence pronto — ${empresa}`;
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#f59e0b,#ef4444);padding:22px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:19px;">⏰ ¿Algo te frenó?</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-size:13px;">${empresa} · $${precioTotal.toLocaleString('es-MX')} MXN</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="font-size:14px;">Hola ${leadName.split(' ')[0]},</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          Vimos que revisaste tu propuesta pero aún no confirmaste. Si hay algo que no se ajuste, como el presupuesto, el timeline o los módulos, <strong>podemos ajustarlo</strong>.
        </p>
        <div style="background:#fef3c7;border-radius:8px;padding:14px;margin:16px 0;font-size:13px;color:#92400e;">
          <strong>💡 Vic puede llamarte hoy</strong> para revisar la propuesta juntos y ajustar lo que necesites.
        </div>
        <div style="display:flex;gap:10px;margin:20px 0;flex-wrap:wrap;">
          <a href="${BASE_URL}/checkout/${proposalId}" style="flex:1;min-width:140px;text-align:center;padding:12px;background:#7c3aed;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            Confirmar ahora
          </a>
          <a href="https://calendly.com/technova/kickoff" style="flex:1;min-width:140px;text-align:center;padding:12px;background:#0ea5e9;color:#fff;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">
            📅 Hablar con Vic
          </a>
        </div>
        <p style="font-size:12px;color:#94a3b8;">Sofía · TechNova · <a href="mailto:hola@tech-nova.mx" style="color:#94a3b8;">hola@tech-nova.mx</a></p>
      </div>
    </div>`;
  return { subject, html };
}
