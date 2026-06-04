import { MODULES, calcModuleCost } from '@/data/catalog';

export interface CartModule {
  modulo_id: string;
  nombre: string;
  componentes: string[];
  precio_total: number; // MXN
  horas: number;
  justificacion: string;
}

export interface ProposalCalculation {
  modulos: CartModule[];
  subtotal: number;   // MXN
  pmFee: number;      // MXN
  total: number;      // MXN
  horas: number;
  diasEstimados: number;
  exceedsBudget: boolean;
  budgetOverage: number;
}

export function calculateProposal(
  modulos: CartModule[],
  presupuestoMax?: number | null
): ProposalCalculation {
  const subtotal = modulos.reduce((s, m) => s + m.precio_total, 0);
  const pmFee = Math.round(subtotal * 0.20);
  const total = subtotal + pmFee;
  const horas = modulos.reduce((s, m) => s + m.horas, 0);
  const diasEstimados = Math.ceil(horas / 7);
  const exceedsBudget = presupuestoMax != null && total > presupuestoMax;
  const budgetOverage = presupuestoMax != null ? Math.max(0, total - presupuestoMax) : 0;

  return { modulos, subtotal, pmFee, total, horas, diasEstimados, exceedsBudget, budgetOverage };
}

/** Returns catalog modules NOT already in cart */
export function getAvailableModules(cartModuleIds: string[]): CartModule[] {
  const selected = new Set(cartModuleIds);
  return MODULES
    .filter(m => !selected.has(m.id))
    .map(m => {
      const { cost, hours } = calcModuleCost(m.id);
      return {
        modulo_id: m.id,
        nombre: m.name,
        componentes: m.components,
        precio_total: Math.round(cost),
        horas: hours,
        justificacion: m.description,
      };
    });
}

/** Converts a DB ProposalModule (cents) into a CartModule (MXN) */
export function dbModuleToCart(m: Record<string, unknown>): CartModule {
  return {
    modulo_id: m.modulo_id as string,
    nombre: m.nombre as string,
    componentes: (m.componentes as string[]) ?? [],
    precio_total: typeof m.precio_total === 'number' ? m.precio_total : 0,
    horas: typeof m.horas === 'number' ? m.horas : 0,
    justificacion: (m.justificacion as string) ?? '',
  };
}
