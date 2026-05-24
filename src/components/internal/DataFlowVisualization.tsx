type Flow = {
  title: string;
  emoji: string;
  accent: string;
  steps: { label: string; detail: string }[];
};

const FLOWS: Flow[] = [
  {
    title: 'Data Flow — Leads',
    emoji: '📨',
    accent: 'text-cyan-200',
    steps: [
      { label: 'User llena form', detail: 'LeadMagnetSection / Contacto' },
      { label: 'POST /api/leads', detail: 'rate limit 5/min · validación Zod' },
      { label: 'INSERT leads', detail: 'Neon Postgres (Drizzle)' },
      { label: 'Email async', detail: 'Resend — desacoplado del response' },
      { label: 'Response', detail: '{ success, emailSent }' },
    ],
  },
  {
    title: 'Data Flow — Checkout',
    emoji: '💳',
    accent: 'text-amber-200',
    steps: [
      { label: 'User: "Buy Plan"', detail: 'pricing / wizard' },
      { label: 'POST /api/checkout', detail: 'rate limit 3/min · validación Zod' },
      { label: 'Stripe Session', detail: 'INSERT orders status=pending' },
      { label: 'Redirect', detail: 'checkout.stripe.com (hosted)' },
      { label: 'Webhook', detail: 'firma HMAC → orders status=paid' },
    ],
  },
];

export default function DataFlowVisualization() {
  return (
    <div className="space-y-6">
      {FLOWS.map((flow) => (
        <div key={flow.title} className="glass-card p-5">
          <h3 className={`mb-4 text-sm font-semibold ${flow.accent}`}>
            {flow.emoji} {flow.title}
          </h3>
          <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
            {flow.steps.map((step, i) => (
              <div key={step.label} className="flex items-stretch md:flex-1">
                <div className="flex-1 rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="text-xs font-semibold text-white">
                    {i + 1}. {step.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-400">
                    {step.detail}
                  </p>
                </div>
                {i < flow.steps.length - 1 && (
                  <span className="flex items-center px-1 text-slate-500">
                    <span className="hidden md:inline">→</span>
                    <span className="md:hidden">↓</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
