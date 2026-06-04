import { z } from 'zod';
import { MODULES } from '@/data/catalog';

const validModuleIds = MODULES.map(m => m.id) as [string, ...string[]];

export const proposalModuleSchema = z.object({
  modulo_id: z.enum(validModuleIds),
  nombre: z.string(),
  componentes: z.array(z.string()),
  precio_total: z.number().positive(),
  horas: z.number().positive(),
  justificacion: z.string().min(10).max(600),
});

export const proposalSchema = z.object({
  modulos_seleccionados: z.array(proposalModuleSchema).min(3).max(5),
  precio_subtotal_tecnico: z.number().positive(),
  pm_fee_20_pct: z.number().positive(),
  precio_total: z.number().positive(),
  horas_totales: z.number().positive(),
  timeline_dias: z.number().positive().max(120),
  justificacion_general: z.string().min(20).max(1200),
  observaciones: z.string().optional(),
});

export type ProposalJSON = z.infer<typeof proposalSchema>;
export type ProposalModule = z.infer<typeof proposalModuleSchema>;
