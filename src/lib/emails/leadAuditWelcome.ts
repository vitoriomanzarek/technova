/**
 * Email de bienvenida a bordo — Auditoría Web Express.
 * Firmado por Sofía Torres, Navegante Digital de TechNova.
 * Se dispara desde POST /api/leads cuando project_type === 'auditoria-web'.
 */

interface AuditWelcomeParams {
  name?: string;
  websiteUrl?: string;
}

export function welcomeAuditEmail({ name, websiteUrl }: AuditWelcomeParams = {}) {
  const firstName = name && name !== 'Anónimo' ? name.split(' ')[0] : null;
  const greeting  = firstName ? `Hola ${firstName}` : 'Hola';
  const hasUrl    = !!websiteUrl;

  const subject = hasUrl
    ? `🛸 Tu diagnóstico orbital está en curso, ${firstName ?? 'Explorador'}`
    : `🚀 Bienvenido a bordo — siguiente paso para tu auditoría`;

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#0a0a14;font-family:'Segoe UI',Arial,sans-serif;">

    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0ea5e9 0%,#7c3aed 100%);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
        <div style="font-size:48px;margin-bottom:8px;">🛸</div>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
          Misión Diagnóstico Iniciada
        </h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
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
          Acabo de recibir tu solicitud y ya estamos preparando los sistemas de escaneo para revisar tu presencia digital. 🔭
        </p>

        ${hasUrl ? `
        <!-- Has URL -->
        <div style="background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.3);border-radius:12px;padding:20px;margin:0 0 24px;">
          <p style="color:#7dd3fc;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">
            🎯 Objetivo de la misión
          </p>
          <p style="color:#fff;font-size:16px;font-weight:600;margin:0;word-break:break-all;">
            ${websiteUrl}
          </p>
        </div>
        <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 24px;">
          Nuestro equipo va a realizar un <strong style="color:#e2e8f0;">diagnóstico orbital completo</strong> de tu sitio:
          analizaremos velocidad de carga, posicionamiento SEO, experiencia de usuario y oportunidades de conversión.
          En las próximas <strong style="color:#e2e8f0;">24-48 horas</strong> recibirás tu reporte personalizado con
          un plan de acción claro y una cotización transparente.
        </p>
        ` : `
        <!-- No URL -->
        <div style="background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;padding:20px;margin:0 0 24px;">
          <p style="color:#c4b5fd;font-size:14px;margin:0 0 8px;font-weight:600;">
            📡 Siguiente paso — necesitamos la URL de tu sitio
          </p>
          <p style="color:#a5b4fc;font-size:14px;margin:0;">
            Para lanzar el diagnóstico orbital, <strong style="color:#e2e8f0;">responde este correo con el link de tu página web</strong>.
            Si todavía no tienes sitio, cuéntanos en qué etapa está tu proyecto — también podemos ayudarte ahí.
          </p>
        </div>
        <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 24px;">
          En cuanto reciba la URL, activo nuestro escáner y en <strong style="color:#e2e8f0;">24-48 horas</strong>
          tendrás en tu bandeja un análisis completo con un plan de acción concreto para que tu negocio despegue.
        </p>
        `}

        <!-- What they'll get -->
        <div style="margin:0 0 28px;">
          <p style="color:#94a3b8;font-size:13px;font-weight:600;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">
            Lo que encontrarás en tu diagnóstico
          </p>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              ['⚡', 'Velocidad de carga', 'Core Web Vitals y tiempo de respuesta'],
              ['🔍', 'Análisis SEO', 'Visibilidad en Google y oportunidades de posicionamiento'],
              ['📱', 'Experiencia de usuario', 'Cómo navegan tus visitantes y dónde se pierden'],
              ['💡', 'Plan de acción', '3-5 mejoras prioritarias con estimado de inversión'],
            ].map(([icon, title, desc]) => `
            <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;">
              <span style="font-size:18px;flex-shrink:0;">${icon}</span>
              <div>
                <p style="color:#e2e8f0;font-size:14px;font-weight:600;margin:0 0 2px;">${title}</p>
                <p style="color:#64748b;font-size:13px;margin:0;">${desc}</p>
              </div>
            </div>`).join('')}
          </div>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin:0 0 28px;">
          <a href="https://tech-nova.mx/start-project"
             style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#7c3aed);color:#fff;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
            🚀 Ver todos nuestros servicios
          </a>
        </div>

        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 24px;border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;">
          Si tienes alguna pregunta antes de recibir tu diagnóstico, solo responde este correo.
          Estoy aquí para guiarte en cada paso de esta misión. 🌟
        </p>

        <!-- Signature -->
        <div style="display:flex;align-items:center;gap:16px;">
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
        <p style="margin:0;">TechNova · Navigando el cosmos digital desde México 🌌</p>
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
