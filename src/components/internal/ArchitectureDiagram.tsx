const LAYERS: { title: string; nodes: string[]; accent: string }[] = [
  {
    title: 'Frontend',
    nodes: ['Next.js App Router', 'React 19 + Tailwind', 'Framer Motion'],
    accent: 'border-cyan-400/40 text-cyan-200',
  },
  {
    title: 'API Routes  (src/app/api/*)',
    nodes: ['/api/leads', '/api/checkout', '/api/checkout/webhook'],
    accent: 'border-sky-400/40 text-sky-200',
  },
  {
    title: 'Capa de validación & SDKs',
    nodes: ['Zod schemas', 'Stripe SDK', 'Resend SDK', 'Upstash (proxy)'],
    accent: 'border-purple-400/40 text-purple-200',
  },
  {
    title: 'Base de datos  (Neon Postgres)',
    nodes: ['services', 'leads', 'orders'],
    accent: 'border-emerald-400/40 text-emerald-200',
  },
];

export default function ArchitectureDiagram() {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col items-stretch gap-2">
        {LAYERS.map((layer, i) => (
          <div key={layer.title}>
            <div className={`rounded-xl border ${layer.accent} bg-black/20 p-4`}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-80">
                {layer.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {layer.nodes.map((n) => (
                  <span
                    key={n}
                    className="rounded-lg bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-200"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="flex justify-center py-1 text-lg text-slate-500">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
