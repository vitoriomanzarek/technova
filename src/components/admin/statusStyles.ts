import type { EventStatus } from '@/lib/bitacora-parser';

type StatusStyle = {
  label: string;
  emoji: string;
  text: string;
  bar: string;
  dot: string;
  ring: string;
};

export const STATUS_STYLES: Record<EventStatus, StatusStyle> = {
  completed: {
    label: 'Completada',
    emoji: '✅',
    text: 'text-emerald-300',
    bar: 'from-emerald-400 to-cyan-400',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400/40',
  },
  'in-progress': {
    label: 'En progreso',
    emoji: '⏳',
    text: 'text-amber-300',
    bar: 'from-amber-400 to-yellow-300',
    dot: 'bg-amber-400',
    ring: 'ring-amber-400/40',
  },
  blocked: {
    label: 'Bloqueada',
    emoji: '🔴',
    text: 'text-rose-300',
    bar: 'from-rose-500 to-red-400',
    dot: 'bg-rose-500',
    ring: 'ring-rose-500/40',
  },
  pending: {
    label: 'Pendiente',
    emoji: '⚪',
    text: 'text-slate-400',
    bar: 'from-slate-500 to-slate-400',
    dot: 'bg-slate-500',
    ring: 'ring-slate-500/30',
  },
};
