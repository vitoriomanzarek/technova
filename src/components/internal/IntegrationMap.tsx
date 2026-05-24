type Integration = {
  name: string;
  role: string;
  direction: 'out' | 'in' | 'both';
  accent: string;
};

const INTEGRATIONS: Integration[] = [
  { name: 'Vercel', role: 'Hosting · edge proxy · logs', direction: 'both', accent: 'border-cyan-400/40' },
  { name: 'Neon', role: 'Postgres · branching · backups', direction: 'both', accent: 'border-emerald-400/40' },
  { name: 'Stripe', role: 'Payments · webhooks firmados', direction: 'both', accent: 'border-amber-400/40' },
  { name: 'Resend', role: 'Email transaccional', direction: 'out', accent: 'border-purple-400/40' },
  { name: 'Upstash', role: 'Redis · rate limiting', direction: 'both', accent: 'border-rose-400/40' },
  { name: 'GitHub', role: 'Version control · CI/CD', direction: 'in', accent: 'border-slate-400/40' },
  { name: 'GTM + Meta Pixel', role: 'Analytics (client)', direction: 'out', accent: 'border-sky-400/40' },
];

const ARROW: Record<Integration['direction'], string> = {
  out: '→',
  in: '←',
  both: '↔',
};

export default function IntegrationMap() {
  return (
    <div className="glass-card p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_2fr] md:items-center">
        {/* Núcleo */}
        <div className="flex justify-center">
          <div className="rounded-2xl border border-cyan-400/50 bg-cyan-400/10 px-6 py-8 text-center glow-cyan">
            <p className="text-lg font-bold text-gradient">TechNova</p>
            <p className="text-xs text-slate-400">Next.js en Vercel</p>
          </div>
        </div>

        <div className="hidden text-center text-2xl text-slate-600 md:block">
          ⇄
        </div>

        {/* Servicios externos */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {INTEGRATIONS.map((s) => (
            <div
              key={s.name}
              className={`flex items-center gap-3 rounded-lg border ${s.accent} bg-black/20 p-3`}
            >
              <span className="font-mono text-sm text-slate-400">
                {ARROW[s.direction]}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{s.name}</p>
                <p className="text-[11px] text-slate-400">{s.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-[11px] text-slate-500">
        → saliente · ← entrante · ↔ bidireccional
      </p>
    </div>
  );
}
