interface LeadScoreInput {
  presupuesto_estimado?: number | null; // MXN
  message?: string | null;
  project_type?: string | null;
  proposal_opened_at?: Date | null;
  in_checkout_at?: Date | null;
  audit_completed_at?: Date | null;
}

export function scoreLead(lead: LeadScoreInput): number {
  let score = 0;

  // Budget (25 pts)
  const budget = lead.presupuesto_estimado ?? 0;
  if (budget >= 50000) score += 25;
  else if (budget >= 25000) score += 18;
  else if (budget >= 10000) score += 10;
  else if (budget > 0) score += 5;

  // Message clarity (25 pts)
  const msgLen = (lead.message ?? '').length;
  if (msgLen >= 200) score += 25;
  else if (msgLen >= 80) score += 15;
  else if (msgLen >= 30) score += 8;

  // Project type viability (20 pts)
  const viableTypes = ['auditoria-web', 'sitio-nuevo', 'rediseno', 'ecommerce', 'custom'];
  if (lead.project_type && viableTypes.includes(lead.project_type)) score += 20;
  else score += 10;

  // Intent signals (20 pts)
  if (lead.audit_completed_at) score += 5;
  if (lead.proposal_opened_at) score += 8;
  if (lead.in_checkout_at) score += 7;

  // Timeline clarity (10 pts) — implicit from message
  if ((lead.message ?? '').toLowerCase().match(/semana|mes|urgente|pronto|rápido|asap/)) score += 10;
  else score += 5;

  return Math.min(100, score);
}

export function routeLead(score: number): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}
