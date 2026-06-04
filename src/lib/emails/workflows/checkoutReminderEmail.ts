export function checkoutReminderEmail(data: { leadName: string; empresa: string; proposalId: string; precioTotal: number }) {
  const { leadName, empresa, proposalId, precioTotal } = data;
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tech-nova.mx';
  const subject = `💳 Tu carrito está esperando — ${empresa}`;
  const half = Math.round(precioTotal / 2);
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:#7c3aed;padding:22px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:19px;">💳 Tu inversión te está esperando</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">${empresa}</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;padding:28px 32px;">
        <p style="font-size:14px;">Hola ${leadName.split(' ')[0]},</p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          Tu carrito con la propuesta de <strong>$${precioTotal.toLocaleString('es-MX')} MXN</strong> sigue activo. Solo necesitas pagar <strong>$${half.toLocaleString('es-MX')} MXN hoy</strong> (50%) para que iniciemos.
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.7;">
          ¿Algo te frenó? Cuéntanos. Podemos ajustar el alcance, el precio o el timeline.
        </p>
        <div style="text-align:center;margin:20px 0;">
          <a href="${BASE_URL}/checkout/${proposalId}" style="display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;">
            💳 Completar pago ahora
          </a>
          <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">Pago seguro · Stripe · Tarjeta crédito/débito</p>
        </div>
        <p style="font-size:12px;color:#94a3b8;">
          Sofía · TechNova · <a href="mailto:hola@tech-nova.mx" style="color:#94a3b8;">hola@tech-nova.mx</a>
          &nbsp;·&nbsp;<a href="https://wa.me/527221669672" style="color:#94a3b8;">WhatsApp</a>
        </p>
      </div>
    </div>`;
  return { subject, html };
}
