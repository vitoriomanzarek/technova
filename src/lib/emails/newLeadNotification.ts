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
  website_url?: string;
}

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'auditoria-web':           '🔍 Auditoría Web Express',
  'contacto':                '✉️ Formulario de Contacto',
  'despegue-cohete':         '🚀 Despegue — Cohete ($5,500)',
  'despegue-lanzadera':      '⚡ Despegue — Lanzadera ($12,000)',
  'despegue-mision-starter': '🌟 Despegue — Misión Starter ($20,000)',
  'mision-enterprise':       '🏢 Misión Enterprise (+$80,000)',
  'landing':                 '🌐 Órbita — Landing Page',
  'ecommerce':               '🛒 Órbita — E-commerce',
  'lms':                     '🎓 Órbita — LMS / Cursos',
  'webapp':                  '⚙️ Órbita — Web App',
};

// Número de WhatsApp del equipo TechNova para incluir en el botón de contacto rápido.
const TECHNOVA_WA = '527221669672';

function buildWhatsAppUrl(leadPhone: string, leadName: string, projectType: string): string {
  const clean = leadPhone.replace(/\D/g, '');
  const msg = encodeURIComponent(
    `Hola ${leadName}, soy Víctor de TechNova 👋\n\nVi que dejaste tu contacto para ${projectType}. ¿Tienes un momento para platicar?`
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

export function newLeadNotificationEmail(lead: LeadData) {
  const typeLabel = PROJECT_TYPE_LABELS[lead.project_type ?? ''] ?? lead.project_type ?? 'Sin especificar';
  const subject = `🚨 Nuevo lead: ${lead.name ?? lead.email} — ${typeLabel}`;

  const rows = [
    ['Nombre',   lead.name       ?? '—'],
    ['Email',    lead.email],
    ['Teléfono', lead.phone      ?? '—'],
    ['Tipo',     typeLabel],
    ['Sitio Web', lead.website_url ? `<a href="${lead.website_url}" style="color:#0ea5e9;">${lead.website_url}</a>` : '—'],
    ['Mensaje',  lead.message    ?? '—'],
    ['Hora',     new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })],
  ];

  const tableRows = rows
    .map(([label, value]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:bold;color:#64748b;white-space:nowrap;border-bottom:1px solid #f1f5f9;">${label}</td>
        <td style="padding:8px 12px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${value}</td>
      </tr>`)
    .join('');

  // Botones de acción rápida
  const waLeadUrl  = lead.phone
    ? buildWhatsAppUrl(lead.phone, lead.name ?? 'ahí', typeLabel)
    : null;
  const waOwnerUrl = `https://wa.me/${TECHNOVA_WA}`;
  const mailtoUrl  = `mailto:${lead.email}?subject=Tu proyecto con TechNova 🚀&body=Hola ${lead.name ?? ''},%0A%0ARecibí tu mensaje...`;

  const actionButtons = `
    <div style="padding:20px 24px;display:flex;gap:12px;flex-wrap:wrap;">
      ${lead.website_url ? `
      <a href="${lead.website_url}" target="_blank"
         style="display:inline-block;padding:12px 20px;background:#7c3aed;color:#fff;font-weight:bold;font-size:14px;text-decoration:none;border-radius:8px;">
        🔭 Abrir sitio a auditar
      </a>` : ''}
      ${waLeadUrl ? `
      <a href="${waLeadUrl}"
         style="display:inline-block;padding:12px 20px;background:#25D366;color:#fff;font-weight:bold;font-size:14px;text-decoration:none;border-radius:8px;">
        💬 WhatsApp al Lead
      </a>` : ''}
      <a href="${mailtoUrl}"
         style="display:inline-block;padding:12px 20px;background:#0ea5e9;color:#fff;font-weight:bold;font-size:14px;text-decoration:none;border-radius:8px;">
        ✉️ Responder por Email
      </a>
    </div>
  `;

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
        ${actionButtons}
        <div style="padding:12px 24px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            TechNova · <a href="https://wa.me/${TECHNOVA_WA}" style="color:#94a3b8;">+52 722 166 9672</a> · tech-nova.mx
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
