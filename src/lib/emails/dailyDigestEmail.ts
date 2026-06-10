import type { SystemCheck, ActivityData, DigestInsights } from '@/lib/jobs/daily-digest';

interface DigestEmailData {
  systems: SystemCheck[];
  activity: ActivityData;
  insights: DigestInsights | null;
  baseUrl: string;
}

const SALUD_COLOR = { verde: '#22c55e', amarillo: '#f59e0b', rojo: '#ef4444' } as const;
const SALUD_EMOJI = { verde: '🟢', amarillo: '🟡', rojo: '🔴' } as const;

function row(label: string, value: string, highlight = false): string {
  return `
    <tr>
      <td style="padding:8px 12px;color:#64748b;font-size:14px;border-bottom:1px solid #f1f5f9;">${label}</td>
      <td style="padding:8px 12px;color:${highlight ? '#dc2626' : '#1e293b'};font-size:14px;font-weight:${highlight ? 'bold' : 'normal'};border-bottom:1px solid #f1f5f9;text-align:right;">${value}</td>
    </tr>`;
}

function list(items: string[], color: string): string {
  return items
    .map(item => `
      <tr>
        <td style="padding:4px 12px 4px 0;vertical-align:top;color:${color};font-size:14px;">•</td>
        <td style="padding:4px 0;color:#1e293b;font-size:14px;">${item}</td>
      </tr>`)
    .join('');
}

export function dailyDigestEmail(data: DigestEmailData) {
  const { systems, activity, insights, baseUrl } = data;

  const systemsDown = systems.filter(s => !s.ok);
  const salud = insights?.salud ?? (systemsDown.length > 0 ? 'rojo' : 'verde');
  const color = SALUD_COLOR[salud];
  const emoji = SALUD_EMOJI[salud];

  const fecha = new Date().toLocaleDateString('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const subject = `${emoji} Morning Brief TechNova — ${activity.newLeads24h} leads, ${activity.ordersPaid24h.count} pagos${systemsDown.length ? ` · ${systemsDown.length} sistema(s) caído(s)` : ''}`;

  const systemsHtml = systems
    .map(s => `
      <tr>
        <td style="padding:6px 12px;color:#1e293b;font-size:14px;border-bottom:1px solid #f1f5f9;">${s.ok ? '✅' : '🔴'} ${s.name}</td>
        <td style="padding:6px 12px;color:${s.ok ? '#64748b' : '#dc2626'};font-size:13px;border-bottom:1px solid #f1f5f9;text-align:right;font-family:monospace;">${s.detail}</td>
      </tr>`)
    .join('');

  const funnelHtml = Object.entries(activity.funnelByStatus)
    .map(([status, n]) => row(status, String(n)))
    .join('');

  const failedAuditsHtml = activity.auditsFailed24h.length
    ? `<div style="padding:12px 20px;background:#fef2f2;border-radius:8px;margin:0 20px 16px;">
        <p style="margin:0 0 6px;font-weight:bold;color:#dc2626;font-size:13px;">Auditorías fallidas (24h):</p>
        ${activity.auditsFailed24h.map(a => `<p style="margin:2px 0;font-size:12px;color:#7f1d1d;font-family:monospace;">${a.url} — ${a.error}</p>`).join('')}
      </div>`
    : '';

  const insightsHtml = insights
    ? `
      <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
        <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:14px;">📋 Resumen</p>
        <p style="margin:0;color:#334155;font-size:14px;line-height:1.5;">${insights.resumen}</p>
      </div>
      ${insights.alertas.length ? `
      <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
        <p style="margin:0 0 8px;font-weight:bold;color:#dc2626;font-size:14px;">⚠️ Acción hoy</p>
        <table style="border-collapse:collapse;">${list(insights.alertas, '#dc2626')}</table>
      </div>` : ''}
      ${insights.recomendaciones.length ? `
      <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
        <p style="margin:0 0 8px;font-weight:bold;color:#7c3aed;font-size:14px;">💡 Recomendaciones</p>
        <table style="border-collapse:collapse;">${list(insights.recomendaciones, '#7c3aed')}</table>
      </div>` : ''}`
    : `<div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
        <p style="margin:0;color:#94a3b8;font-size:13px;">⚠️ Insights de IA no disponibles esta mañana (Claude falló) — datos crudos abajo.</p>
      </div>`;

  const openRate = activity.emails7d.sent > 0
    ? Math.round((activity.emails7d.opened / activity.emails7d.sent) * 100)
    : null;

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:auto;color:#1e293b;">
      <div style="background:linear-gradient(135deg,#0ea5e9,#8b5cf6);padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:20px;">${emoji} Morning Brief</h1>
        <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;text-transform:capitalize;">${fecha}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">

        <!-- Salud general -->
        <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;background:${color}10;">
          <p style="margin:0;font-size:15px;font-weight:bold;color:${color};">
            Salud general: ${salud.toUpperCase()}
          </p>
        </div>

        <!-- Insights de Claude -->
        ${insightsHtml}

        <!-- Sistemas -->
        <div style="padding:16px 20px 8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:14px;">🚦 Sistemas</p>
          <table style="width:100%;border-collapse:collapse;">${systemsHtml}</table>
        </div>

        <!-- Actividad 24h -->
        <div style="padding:16px 20px 8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:14px;">📊 Últimas 24 horas</p>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Leads nuevos', String(activity.newLeads24h))}
            ${row('Auditorías completadas', String(activity.auditsCompleted24h))}
            ${row('Auditorías fallidas', String(activity.auditsFailed24h.length), activity.auditsFailed24h.length > 0)}
            ${row('Propuestas generadas', String(activity.proposalsGenerated24h))}
            ${row('Pagos recibidos', `${activity.ordersPaid24h.count} · $${activity.ordersPaid24h.totalMxn.toLocaleString('es-MX')} MXN`)}
            ${row('Checkouts abandonados (>24h)', String(activity.abandonedCheckouts), activity.abandonedCheckouts > 0)}
          </table>
        </div>

        ${failedAuditsHtml}

        <!-- Pendientes de Vic -->
        ${activity.proposalsPendingVic.count > 0 ? `
        <div style="padding:12px 20px;background:#fffbeb;border-radius:8px;margin:0 20px 16px;">
          <p style="margin:0;font-size:14px;color:#92400e;">
            <strong>📥 ${activity.proposalsPendingVic.count} propuesta(s) esperando tu revisión</strong>
            — la más antigua lleva ${activity.proposalsPendingVic.oldestHours}h.
            <a href="${baseUrl}/admin/proposals-review" style="color:#0ea5e9;">Revisar →</a>
          </p>
        </div>` : ''}

        <!-- Funnel + emails -->
        <div style="padding:16px 20px 8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:14px;">🔻 Funnel (todos los leads)</p>
          <table style="width:100%;border-collapse:collapse;">
            ${funnelHtml}
            ${row('Leads sin avanzar (>3 días en "new")', String(activity.staleLeads), activity.staleLeads > 0)}
          </table>
        </div>

        <div style="padding:16px 20px 8px;">
          <p style="margin:0 0 8px;font-weight:bold;color:#1e293b;font-size:14px;">📧 Emails (7 días)</p>
          <table style="width:100%;border-collapse:collapse;">
            ${row('Enviados', String(activity.emails7d.sent))}
            ${row('Tasa de apertura', openRate !== null ? `${openRate}%` : 'sin datos')}
            ${row('Bounces', String(activity.emails7d.bounced), activity.emails7d.bounced > 0)}
          </table>
        </div>

        <div style="padding:12px 24px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            TechNova · Morning Brief automático · <a href="${baseUrl}/admin/crm" style="color:#94a3b8;">CRM</a> · <a href="${baseUrl}/admin/project-status" style="color:#94a3b8;">Project Status</a>
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
