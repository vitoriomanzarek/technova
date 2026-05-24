type Tech = {
  name: string;
  version: string;
  category: string;
  description: string;
  decision?: string; // id de DECISION_LOG, ej. "D-001"
  accent: 'cyan' | 'purple' | 'emerald' | 'amber';
};

// Versiones verificadas contra package.json.
const STACK: Tech[] = [
  {
    name: 'Next.js',
    version: '16.2.4',
    category: 'Framework',
    description: 'App Router, Server Components, Route Handlers, Proxy.',
    decision: 'D-001',
    accent: 'cyan',
  },
  {
    name: 'React',
    version: '19.2.4',
    category: 'UI',
    description: 'Server + Client Components, transitions.',
    accent: 'cyan',
  },
  {
    name: 'TypeScript',
    version: '5.x',
    category: 'Lenguaje',
    description: 'Strict mode, sin any en el código de la app.',
    accent: 'cyan',
  },
  {
    name: 'Tailwind CSS',
    version: 'v4',
    category: 'Styling',
    description: 'Utility-first, JIT, vía @tailwindcss/postcss.',
    decision: 'D-003',
    accent: 'purple',
  },
  {
    name: 'Framer Motion',
    version: '12.38.0',
    category: 'Animación',
    description: 'Motion primitives para Hero y transiciones.',
    accent: 'purple',
  },
  {
    name: 'Drizzle ORM',
    version: '0.45.2',
    category: 'ORM',
    description: 'Type-safe SQL, zero-runtime, drizzle-kit push.',
    decision: 'D-002',
    accent: 'emerald',
  },
  {
    name: 'Neon Postgres',
    version: 'serverless',
    category: 'Base de datos',
    description: 'Postgres puro, scale-to-zero, branching por PR.',
    decision: 'D-011',
    accent: 'emerald',
  },
  {
    name: 'Zod',
    version: '4.4.3',
    category: 'Validación',
    description: 'Schemas de input en /api/leads y /api/checkout.',
    accent: 'emerald',
  },
  {
    name: 'Stripe',
    version: '22.1.1',
    category: 'Pagos',
    description: 'Checkout Sessions + webhooks firmados (HMAC).',
    decision: 'D-007',
    accent: 'amber',
  },
  {
    name: 'Resend',
    version: '6.12.2',
    category: 'Email',
    description: 'Email transaccional, dominio tech-nova.mx.',
    decision: 'D-012',
    accent: 'amber',
  },
  {
    name: 'Upstash Redis',
    version: 'ratelimit 2.0.8',
    category: 'Rate limiting',
    description: 'Sliding window por IP en endpoints de API.',
    accent: 'amber',
  },
  {
    name: 'Vercel',
    version: 'edge',
    category: 'Hosting',
    description: 'Deploy desde GitHub, edge proxy, env vars, logs.',
    accent: 'cyan',
  },
];

const ACCENT: Record<Tech['accent'], string> = {
  cyan: 'border-cyan-400/30 hover:border-cyan-400/60',
  purple: 'border-purple-400/30 hover:border-purple-400/60',
  emerald: 'border-emerald-400/30 hover:border-emerald-400/60',
  amber: 'border-amber-400/30 hover:border-amber-400/60',
};

export default function TechStackGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {STACK.map((t) => (
        <div
          key={t.name}
          className={`glass-card border ${ACCENT[t.accent]} p-4 transition-all duration-300 hover:-translate-y-1`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-bold text-white">{t.name}</h3>
            <span className="font-mono text-xs text-cyan-300">{t.version}</span>
          </div>
          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">
            {t.category}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {t.description}
          </p>
          {t.decision && (
            <a
              href={`#${t.decision}`}
              className="mt-2 inline-block text-[11px] font-medium text-purple-300 hover:text-purple-200"
            >
              ↳ {t.decision}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
