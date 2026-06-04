interface ActivityItem {
  email_type: string;
  sent_at: string | null;
  lead_name: string | null;
  lead_email: string | null;
  empresa: string | null;
}

const EMAIL_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  welcome_email:        { label: 'Email bienvenida',     icon: '👋' },
  audit_ready_email:    { label: 'Auditoría lista',      icon: '🔍' },
  proposal_follow_up:  { label: 'Follow-up propuesta',  icon: '📧' },
  urgent_checkout:     { label: 'Checkout urgente',     icon: '⏰' },
  checkout_reminder:   { label: 'Recordatorio checkout', icon: '🛒' },
  project_started_email: { label: 'Proyecto iniciado',  icon: '🚀' },
  proposal_sent:       { label: 'Propuesta enviada',    icon: '📋' },
  payment_confirmed:   { label: 'Pago confirmado',      icon: '💰' },
  dashboard_access:    { label: 'Dashboard enviado',    icon: '🔑' },
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '—';
  const ms = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(ms / 3600000);
  if (h < 1) return 'Hace menos de 1h';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

interface Props { activity: ActivityItem[] }

export default function LeadActivityTimeline({ activity }: Props) {
  if (!activity.length) {
    return (
      <div className="glass-card p-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">📊 Actividad reciente</h2>
        <p className="text-sm text-slate-500 text-center py-4">Sin actividad en las últimas 24h</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">📊 Actividad (24h)</h2>
      <div className="space-y-3">
        {activity.map((item, i) => {
          const cfg = EMAIL_TYPE_LABELS[item.email_type] ?? { label: item.email_type, icon: '📧' };
          return (
            <div key={i} className="flex items-start gap-3">
              <span className="text-base shrink-0 mt-0.5">{cfg.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {item.empresa ?? item.lead_name ?? item.lead_email}
                </p>
                <p className="text-xs text-slate-400">{cfg.label}</p>
              </div>
              <span className="text-xs text-slate-500 shrink-0">{timeAgo(item.sent_at)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
