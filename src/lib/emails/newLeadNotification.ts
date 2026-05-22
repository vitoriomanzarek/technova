/**
 * Notificación interna al equipo TechNova cuando entra un nuevo lead.
 * Se dispara desde POST /api/leads independientemente del tipo de proyecto.
 */

interface LeadData {
  name?: string;
  email: string;
  phone?: string;
  project_type?: string;
  message?: string;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'auditoria-web':       '🔍 Auditoría Web Express',
  'contacto':            '✉️ Formulario de Contacto',
  'despegue-cohete':     '🚀 Despegue — Cohete ($5,500)',
  'despegue-lanzadera':  '⚡ Despegue — Lanzadera ($12,000)',
  'despegue-mision-starter': '🌟 Despegue — Misión Starter ($20,000)',
  'mision-enterprise':   '🏢 Misión Enterprise (+$80,000)',
  'landing':             '🌐 Órbita — Landing Page',
  'ecommerce':           '🛒 Órbita — E-commerce',
  'lms':                 '🎓 Órbita — LMS / Cursos',
  'webapp':              '⚙️ Órbita — Web App',
};

export function newLeadNotificationEmail(lead: LeadData) {
  const typeLabel = PROJECT_TYPE_LABELS[lead.project_type ?? ''] ?? lead.project_type ?? 'Sin especificar';
  const subject = `🚨 Nuevo lead: ${lead.name ?? lead.email} — ${typeLabel}`;

  const rows = [
    ['Nombre',   lead.name    ?? '—'],
    ['Email',    lead.email],
    ['Teléfono', lead.phone   ?? '—'],
    ['Tipo',     typeLabel],
    ['Mensaje',  lead.message ?? '—'],
    ['Hora',     new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })],
  ];

  const tableRows = rows
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:bold;color:#64748b;white-space:nowrap;border-bottom:1px solid #f1f5f9;">${label}</td>
        <td style="padding:8px 12px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${value}</td>
      </tr>`)
    .join('');

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">🚨 Nuevo Lead — TechNova</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${typeLabel}</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;">
          ${tableRows}
        </table>
        <div style="padding:16px 24px;background:#f8fafc;">
          <p style="margin:0;font-size:13px;color:#64748b;">
            Responde directamente a este correo o contáctalo por WhatsApp para cerrar rápido. ⚡
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
