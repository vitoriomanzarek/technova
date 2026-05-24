'use client';

import { useState } from 'react';
import type { BitacoraEvent } from '@/lib/bitacora-parser';
import { STATUS_STYLES } from './statusStyles';

export default function TimelineView({
  events,
  limit = 10,
}: {
  events: BitacoraEvent[];
  limit?: number;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const shown = events.slice(0, limit);

  return (
    <ol className="relative space-y-1 border-l border-white/10 pl-6">
      {shown.map((ev, i) => {
        const s = STATUS_STYLES[ev.status];
        const isOpen = openIdx === i;
        return (
          <li key={`${ev.date}-${i}`} className="relative pb-4">
            <span
              className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full ${s.dot} ring-4 ring-black/30`}
            />
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full rounded-lg px-2 py-1 text-left transition-colors hover:bg-white/5"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-slate-400">
                  {ev.date}
                </span>
                <span className={`text-xs font-semibold ${s.text}`}>
                  {s.emoji}
                </span>
                <span className="text-sm font-medium text-white">
                  {ev.title}
                </span>
              </div>
              {ev.statusLabel && (
                <p className={`mt-0.5 text-xs ${s.text}`}>{ev.statusLabel}</p>
              )}
            </button>
            {isOpen && ev.description && (
              <p className="mt-2 whitespace-pre-line rounded-lg bg-black/30 px-3 py-2 text-xs leading-relaxed text-slate-300">
                {ev.description}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
