import type { SubItem } from '@/lib/backlog-parser';
import { STATUS_META } from '@/components/internal/PhaseProgressCard';

/**
 * Lista colapsable de sub-items con punto de status por color.
 * Usa <details>/<summary> nativos → colapsable sin JS de cliente.
 */
export default function BacklogItemList({
  items,
  summaryLabel,
  defaultOpen = false,
}: {
  items: SubItem[];
  summaryLabel?: string;
  defaultOpen?: boolean;
}) {
  if (!items.length) return null;

  const doneCount = items.filter((i) => i.status === 'done').length;

  return (
    <details open={defaultOpen} className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-slate-400 hover:text-slate-200">
        <span className="transition-transform group-open:rotate-90">▸</span>
        {summaryLabel ?? `${doneCount}/${items.length} items`}
      </summary>
      <ul className="mt-2 space-y-1.5 border-l border-white/10 pl-3">
        {items.map((item) => {
          const meta = STATUS_META[item.status];
          return (
            <li key={item.id} className="flex items-start gap-2 text-xs">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
              <span className="text-slate-300">
                <span className="font-mono text-[11px] text-cyan-200">{item.id}</span>{' '}
                {item.title}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
