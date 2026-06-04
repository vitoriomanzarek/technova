'use client';

import { useState } from 'react';
import ModuleSelector from './ModuleSelector';
import type { ProposalModule } from '@/lib/schemas/proposal';

interface AuditFinding {
  item: string;
  status: 'verde' | 'amarillo' | 'rojo';
  score: number;
  recomendacion: string;
}

interface ProposalDetail {
  id: string;
  status: string;
  modulos_seleccionados: ProposalModule[];
  precio_subtotal_tecnico: number; // cents
  pm_fee_20_pct: number;           // cents
  precio_total: number;            // cents
  horas_totales: number;
  timeline_dias: number;
  fecha_entrega_estimada: string;
  justificacion_general: string;
  observaciones: string | null;
  aprobado_por: string | null;
  notas_internas_vic: string | null;
  created_at: string | null;
  lead: {
    name: string;
    email: string;
    phone?: string | null;
    empresa?: string | null;
    presupuesto_estimado?: number | null;
    timeline?: string | null;
    prioridades?: string[] | null;
    website_url?: string | null;
  } | null;
  audit: {
    score: number;
    summary: string;
    priority_areas: string[];
    findings: AuditFinding[];
    site_url: string;
  } | null;
}

const REJECT_REASONS = [
  { value: 'presupuesto_bajo', label: 'Presupuesto insuficiente' },
  { value: 'scope_poco_claro', label: 'Scope poco claro' },
  { value: 'no_viable', label: 'Proyecto no viable' },
  { value: 'lead_no_califica', label: 'Lead no califica' },
  { value: 'otro', label: 'Otro motivo' },
];

function findingColor(status: string) {
  if (status === 'verde') return 'text-green-400';
  if (status === 'amarillo') return 'text-amber-400';
  return 'text-red-400';
}

function scoreColor(score: number) {
  if (score >= 70) return 'text-green-400';
  if (score >= 45) return 'text-amber-400';
  return 'text-red-400';
}

interface Props {
  proposalId: string;
  onActionDone: () => void;
}

export default function ProposalDetailPanel({ proposalId, onActionDone }: Props) {
  const [data, setData] = useState<ProposalDetail | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'modifying' | 'rejecting'>('view');
  const [modifiedModules, setModifiedModules] = useState<ProposalModule[]>([]);
  const [notes, setNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('presupuesto_bajo');
  const [saving, setSaving] = useState(false);
  const [showFindings, setShowFindings] = useState(false);

  // Load detail when proposalId changes
  if (proposalId !== loadedId && !loadingData) {
    setLoadingData(true);
    setMode('view');
    setLoadedId(proposalId);
    fetch(`/api/admin/proposals/${proposalId}`)
      .then(r => r.json())
      .then((d: ProposalDetail) => {
        setData(d);
        setModifiedModules(d.modulos_seleccionados ?? []);
        setNotes(d.notas_internas_vic ?? '');
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }

  if (loadingData || !data) {
    return (
      <div className="flex items-center justify-center h-full py-20 text-slate-400">
        <span className="animate-pulse">Cargando propuesta…</span>
      </div>
    );
  }

  const priceMXN = (cents: number) =>
    `$${Math.round(cents / 100).toLocaleString('es-MX')} MXN`;
  const budget = data.lead?.presupuesto_estimado ?? null;

  async function handleApprove() {
    setSaving(true);
    await fetch(`/api/admin/proposals/${data!.id}/approve`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ notas_internas: notes || undefined, aprobado_por: 'Vic' }),
    });
    setSaving(false);
    onActionDone();
  }

  async function handleModify() {
    setSaving(true);
    await fetch(`/api/admin/proposals/${data!.id}/modify`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ modulos_seleccionados: modifiedModules, notas_internas_vic: notes || undefined }),
    });
    setSaving(false);
    setMode('view');
    onActionDone();
  }

  async function handleReject() {
    setSaving(true);
    await fetch(`/api/admin/proposals/${data!.id}/reject`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ razon: rejectReason, notas_internas_vic: notes || undefined }),
    });
    setSaving(false);
    onActionDone();
  }

  const canAct = data.status !== 'rejected';

  return (
    <div className="h-full overflow-y-auto space-y-4 p-4">

      {/* Lead info */}
      <section className="glass-card p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-400">Lead</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-slate-400">Empresa</dt>
          <dd className="text-white font-medium">{data.lead?.empresa ?? '—'}</dd>
          <dt className="text-slate-400">Contacto</dt>
          <dd className="text-white">{data.lead?.name}</dd>
          <dt className="text-slate-400">Email</dt>
          <dd className="text-white truncate">{data.lead?.email}</dd>
          {data.lead?.phone && (
            <>
              <dt className="text-slate-400">Teléfono</dt>
              <dd className="text-white">{data.lead.phone}</dd>
            </>
          )}
          <dt className="text-slate-400">Sitio</dt>
          <dd>
            <a href={data.audit?.site_url} target="_blank" rel="noopener noreferrer"
              className="text-cyan-400 hover:underline truncate block">
              {data.audit?.site_url ?? '—'}
            </a>
          </dd>
          <dt className="text-slate-400">Presupuesto</dt>
          <dd className="text-white">{budget ? `$${budget.toLocaleString('es-MX')} MXN` : '—'}</dd>
          <dt className="text-slate-400">Timeline</dt>
          <dd className="text-white">{data.lead?.timeline ?? '—'}</dd>
          {data.lead?.prioridades?.length ? (
            <>
              <dt className="text-slate-400">Prioridades</dt>
              <dd className="text-white">{data.lead.prioridades.join(', ')}</dd>
            </>
          ) : null}
        </dl>
      </section>

      {/* Audit */}
      {data.audit && (
        <section className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Auditoría</h3>
            <button onClick={() => setShowFindings(v => !v)}
              className="text-xs text-slate-400 hover:text-slate-200">
              {showFindings ? 'Ocultar' : 'Ver findings'}
            </button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-3xl font-extrabold ${scoreColor(data.audit.score)}`}>
              {data.audit.score}
            </span>
            <span className="text-slate-400 text-sm">/100</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">{data.audit.summary}</p>
          <div className="flex flex-wrap gap-1">
            {data.audit.priority_areas.map(a => (
              <span key={a} className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-full px-2 py-0.5">
                {a}
              </span>
            ))}
          </div>
          {showFindings && data.audit.findings.length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-3 space-y-1.5">
              {(data.audit.findings as AuditFinding[]).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`shrink-0 font-medium ${findingColor(f.status)}`}>●</span>
                  <div>
                    <span className="text-white">{f.item}</span>
                    <span className="text-slate-400 ml-1">— {f.recomendacion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Proposal modules */}
      <section className="glass-card p-4">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-400">Propuesta IA</h3>
        <div className="space-y-2 mb-4">
          {data.modulos_seleccionados.map(m => (
            <div key={m.modulo_id} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">{m.nombre}</span>
                <span className="text-sm font-semibold text-cyan-300">${m.precio_total.toLocaleString('es-MX')}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{m.horas}h · {m.modulo_id}</p>
              <p className="text-xs text-slate-500 mt-1 italic">{m.justificacion}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal técnico</span>
            <span>{priceMXN(data.precio_subtotal_tecnico)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>PM Fee 20%</span>
            <span>{priceMXN(data.pm_fee_20_pct)}</span>
          </div>
          <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1">
            <span>Total</span>
            <span>{priceMXN(data.precio_total)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Timeline</span>
            <span>{data.timeline_dias} días</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Entrega est.</span>
            <span>{data.fecha_entrega_estimada}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400 italic border-t border-white/10 pt-3">
          {data.justificacion_general}
        </p>
        {data.observaciones && (
          <p className="mt-2 text-xs text-slate-500">💡 {data.observaciones}</p>
        )}
      </section>

      {/* Actions */}
      {canAct && mode === 'view' && (
        <section className="glass-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Acciones</h3>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Notas internas</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notas visibles solo para Vic…"
              rows={2}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={handleApprove} disabled={saving}
              className="flex-1 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 px-3 py-2 text-sm font-semibold text-white transition-colors">
              {saving ? '…' : '✅ Aprobar'}
            </button>
            <button onClick={() => setMode('modifying')} disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-3 py-2 text-sm font-semibold text-white transition-colors">
              ✏️ Modificar
            </button>
            <button onClick={() => setMode('rejecting')} disabled={saving}
              className="flex-1 rounded-lg bg-red-600/80 hover:bg-red-500 disabled:opacity-50 px-3 py-2 text-sm font-semibold text-white transition-colors">
              ❌ Rechazar
            </button>
          </div>
        </section>
      )}

      {/* Modify mode */}
      {canAct && mode === 'modifying' && (
        <section className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Modificar módulos</h3>
            <button onClick={() => setMode('view')} className="text-xs text-slate-400 hover:text-white">
              Cancelar
            </button>
          </div>

          <ModuleSelector
            selected={modifiedModules}
            onChange={setModifiedModules}
            maxPresupuesto={budget}
          />

          <div>
            <label className="text-xs text-slate-400 block mb-1">Notas internas</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Explica los cambios realizados…"
              rows={3}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>

          <button onClick={handleModify} disabled={saving || modifiedModules.length === 0}
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors">
            {saving ? 'Guardando…' : '💾 Guardar cambios'}
          </button>
        </section>
      )}

      {/* Reject mode */}
      {canAct && mode === 'rejecting' && (
        <section className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-400">Rechazar propuesta</h3>
            <button onClick={() => setMode('view')} className="text-xs text-slate-400 hover:text-white">
              Cancelar
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Razón</label>
            <select
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500/50"
            >
              {REJECT_REASONS.map(r => (
                <option key={r.value} value={r.value} className="bg-slate-800">{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Notas internas</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contexto del rechazo…"
              rows={3}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          <button onClick={handleReject} disabled={saving}
            className="w-full rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition-colors">
            {saving ? 'Procesando…' : '❌ Confirmar rechazo'}
          </button>
        </section>
      )}

      {/* Rejected notice */}
      {data.status === 'rejected' && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm font-semibold text-red-400">❌ Propuesta rechazada</p>
          {data.notas_internas_vic && (
            <p className="text-xs text-slate-400 mt-1">{data.notas_internas_vic}</p>
          )}
        </div>
      )}
    </div>
  );
}
