interface ResourcesListProps {
  proposalId: string;
  repositoryUrl: string | null;
  figmaUrl: string | null;
  assetsUrl: string | null;
  documentationUrl: string | null;
}

interface Resource {
  label: string;
  url: string | null;
  icon: string;
  description: string;
}

export default function ResourcesList({ proposalId, repositoryUrl, figmaUrl, assetsUrl, documentationUrl }: ResourcesListProps) {
  const resources: Resource[] = [
    { label: 'Repositorio',    url: repositoryUrl,    icon: '🗂️', description: 'Código fuente del proyecto' },
    { label: 'Figma Design',   url: figmaUrl,         icon: '🎨', description: 'Archivos de diseño e interfaces' },
    { label: 'Assets',         url: assetsUrl,        icon: '📦', description: 'Imágenes, logos y recursos gráficos' },
    { label: 'Documentación',  url: documentationUrl, icon: '📖', description: 'Guías y documentación técnica' },
    { label: 'Contrato',       url: `/api/checkout/${proposalId}/contract`, icon: '📋', description: 'Contrato de servicios firmado' },
  ];

  return (
    <div className="glass-card p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">🔗 Recursos del proyecto</h2>
      <div className="space-y-2">
        {resources.map(r => (
          <div key={r.label} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-base">{r.icon}</span>
              <div>
                <p className="text-sm font-medium text-white">{r.label}</p>
                <p className="text-xs text-slate-500">{r.description}</p>
              </div>
            </div>
            {r.url ? (
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-lg px-3 py-1.5 font-medium transition-colors"
              >
                Abrir →
              </a>
            ) : (
              <span className="shrink-0 text-xs text-slate-500 italic">Pendiente</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-3">
        Los recursos se añaden conforme avanza el proyecto.
      </p>
    </div>
  );
}
