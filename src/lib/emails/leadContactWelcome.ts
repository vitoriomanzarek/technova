/**
 * Email de bienvenida para leads del formulario /contacto.
 * Más corto y directo que el de auditoría — acusan recibo y avisan que
 * TechNova responderá pronto.
 * Firmado por Sofía Torres, Navegante Digital de TechNova.
 */

interface ContactWelcomeParams {
  name?: string;
  message?: string;
}

export function welcomeContactEmail({ name, message }: ContactWelcomeParams = {}) {
  const firstName = name && name !== 'Anónimo' ? name.split(' ')[0] : null;
  const greeting  = firstName ? `Hola ${firstName}` : 'Hola';

  const subject = firstName
    ? `${firstName}, recibimos tu mensaje ✉️`
    : `Recibimos tu mensaje — TechNova ✉️`;

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',Arial,sans-serif;">

    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0ea5e9 0%,#7c3aed 100%);border-radius:16px 16px 0 0;padding:28px;text-align:center;">
        <div style="font-size:42px;margin-bottom:8px;">📡</div>
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
          Mensaje Recibido
        </h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
          TechNova · Control de Misión Digital
        </p>
      </div>

      <!-- Body -->
      <div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 16px 16px;padding:32px;">

        <p style="color:#e2e8f0;font-size:16px;margin:0 0 16px;">
          ${greeting},
        </p>
        <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 20px;">
          Soy <strong style="color:#fff;">Sofía</strong>, Navegante Digital de TechNova.
          Tu mensaje llegó a nuestro centro de control y ya está en manos del equipo. 🚀
        </p>

        ${message ? `
        <!-- Echo del mensaje -->
        <div style="background:rgba(255,255,255,0.04);border-left:3px solid #0ea5e9;border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 24px;">
          <p style="color:#64748b;font-size:12px;font-weight:600;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.5px;">Tu mensaje</p>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0;font-style:italic;">
            "${message.length > 200 ? message.slice(0, 200) + '…' : message}"
          </p>
        </div>
        ` : ''}

        <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 28px;">
          Te contactaremos en las próximas <strong style="color:#e2e8f0;">24 horas hábiles</strong>.
          Si tienes algo más que agregar, solo responde este correo y lo veré directamente.
        </p>

        <!-- Acciones rápidas -->
        <div style="background:rgba(14,165,233,0.07);border:1px solid rgba(14,165,233,0.2);border-radius:12px;padding:20px;margin:0 0 28px;">
          <p style="color:#7dd3fc;font-size:13px;font-weight:600;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.5px;">
            Mientras tanto, te puede interesar
          </p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;">
                <a href="https://tech-nova.mx/servicios"
                   style="color:#0ea5e9;font-size:14px;text-decoration:none;">
                  🛰️ Ver todos nuestros servicios →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 0;">
                <a href="https://tech-nova.mx/pricing"
                   style="color:#0ea5e9;font-size:14px;text-decoration:none;">
                  💰 Conocer precios y planes →
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 0;">
                <a href="https://tech-nova.mx/assets/auditoria-web-express.pdf"
                   style="color:#0ea5e9;font-size:14px;text-decoration:none;">
                  📋 Descargar auditoría web gratis (PDF) →
                </a>
              </td>
            </tr>
          </table>
        </div>

        <!-- WhatsApp CTA -->
        <div style="text-align:center;margin:0 0 28px;">
          <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;">
            ¿Prefieres una respuesta más rápida?
          </p>
          <a href="https://wa.me/527221669672?text=Hola%20TechNova%2C%20envié%20un%20mensaje%20por%20el%20sitio%20y%20quisiera%20hablar"
             style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
            💬 Escríbenos por WhatsApp
          </a>
        </div>

        <!-- Signature -->
        <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;display:flex;align-items:center;gap:16px;">
          <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">
            👩‍🚀
          </div>
          <div>
            <p style="color:#e2e8f0;font-size:15px;font-weight:600;margin:0;">Sofía Torres</p>
            <p style="color:#64748b;font-size:13px;margin:0;">Navegante Digital · TechNova</p>
            <p style="color:#64748b;font-size:13px;margin:0;">
              <a href="mailto:sofia@tech-nova.mx" style="color:#0ea5e9;text-decoration:none;">sofia@tech-nova.mx</a>
            </p>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div style="text-align:center;padding:20px;color:#334155;font-size:12px;">
        <p style="margin:0;">TechNova · Navegando el cosmos digital desde México 🌌</p>
        <p style="margin:4px 0 0;">
          <a href="https://tech-nova.mx" style="color:#475569;text-decoration:none;">tech-nova.mx</a>
          &nbsp;·&nbsp;
          <a href="https://wa.me/527221669672" style="color:#475569;text-decoration:none;">+52 722 166 9672</a>
        </p>
      </div>

    </div>
  </body>
  </html>
  `;

  return { subject, html };
}
