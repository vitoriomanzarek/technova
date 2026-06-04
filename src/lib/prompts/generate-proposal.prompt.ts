import { MODULES, calcModuleCost } from '@/data/catalog';
import type { AuditFinding, AuditReport } from '@/lib/jobs/audit-website';

export interface ProposalLeadData {
  nombre: string;
  empresa?: string | null;
  presupuesto_estimado?: number | null; // MXN, whole pesos
  timeline?: string | null;
  prioridades?: string[] | null;
}

function buildCatalogSummary(): string {
  return MODULES.map(mod => {
    const { cost, hours } = calcModuleCost(mod.id);
    return `- ${mod.id}: "${mod.name}" | $${Math.round(cost).toLocaleString('es-MX')} MXN | ${hours}h | ${mod.description}`;
  }).join('\n');
}

export function generateProposalPrompt(data: {
  lead: ProposalLeadData;
  audit: AuditReport;
}): string {
  const { lead, audit } = data;
  const criticalFindings = audit.findings.filter((f: AuditFinding) => f.status === 'rojo');
  const budgetLine = lead.presupuesto_estimado
    ? `$${lead.presupuesto_estimado.toLocaleString('es-MX')} MXN`
    : 'No especificado (usa criterio profesional para MIPyME mexicana)';

  return `
Eres un asesor experto en proyectos web para MIPyMEs mexicanas. Genera una propuesta comercial realista y de alto impacto.

CLIENTE:
- Nombre: ${lead.nombre}
- Empresa: ${lead.empresa ?? 'No especificado'}
- Presupuesto máximo: ${budgetLine}
- Timeline deseado: ${lead.timeline ?? 'Flexible'}
- Prioridades declaradas: ${lead.prioridades?.join(', ') ?? 'No especificadas'}

AUDITORÍA DEL SITIO (score ${audit.score}/100):
${audit.summary}

Áreas críticas identificadas:
${audit.priority_areas.map((a: string) => `- ${a}`).join('\n')}

Hallazgos críticos (requieren acción inmediata):
${criticalFindings.length > 0
  ? criticalFindings.map((f: AuditFinding) => `- ${f.item}: ${f.recomendacion}`).join('\n')
  : '(ningún hallazgo crítico — sitio en buen estado)'}

CATÁLOGO DE MÓDULOS DISPONIBLES:
${buildCatalogSummary()}

INSTRUCCIONES:
1. Selecciona 3-5 módulos que resuelvan directamente las áreas críticas del audit.
2. Ordena por impacto de negocio (lo que genera más conversión primero).
3. Respeta el presupuesto máximo en precio_total (incluye PM fee del 20%).
4. pm_fee_20_pct = precio_subtotal_tecnico × 0.20
5. precio_total = precio_subtotal_tecnico + pm_fee_20_pct

MÓDULOS VÁLIDOS (usa SOLO estos IDs): ${MODULES.map(m => m.id).join(', ')}

Responde EXACTAMENTE con este JSON (sin comentarios, sin markdown, sin texto extra):
{
  "modulos_seleccionados": [
    {
      "modulo_id": "MOD-XX",
      "nombre": "nombre del módulo",
      "componentes": ["VI-01", "VI-02"],
      "precio_total": 12345,
      "horas": 30,
      "justificacion": "Por qué este módulo resuelve el problema identificado en el audit"
    }
  ],
  "precio_subtotal_tecnico": 38900,
  "pm_fee_20_pct": 7780,
  "precio_total": 46680,
  "horas_totales": 92,
  "timeline_dias": 21,
  "justificacion_general": "Resumen ejecutivo: por qué esta selección es el balance óptimo para este cliente",
  "observaciones": "Scope fuera de propuesta u opciones adicionales que el cliente puede considerar"
}

RESTRICCIONES ABSOLUTAS:
${lead.presupuesto_estimado ? `- precio_total NUNCA debe superar $${lead.presupuesto_estimado.toLocaleString('es-MX')} MXN` : '- precio_total debe ser razonable para el tamaño del proyecto'}
- timeline_dias máximo: 120
- Módulos: mínimo 3, máximo 5
- Sólo usar IDs del catálogo listados arriba

RESPONDE SOLO CON JSON VÁLIDO. SIN TEXTO ANTES NI DESPUÉS.
`.trim();
}
