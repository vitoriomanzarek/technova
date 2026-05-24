'use client';

import { useState } from 'react';

type Node = {
  name: string;
  note?: string;
  children?: Node[];
};

const TREE: Node = {
  name: 'src/',
  children: [
    {
      name: 'app/',
      note: 'App Router',
      children: [
        { name: 'page.tsx', note: 'home' },
        { name: 'layout.tsx', note: 'root layout · GTM · Meta Pixel' },
        {
          name: 'api/',
          children: [
            { name: 'leads/route.ts' },
            { name: 'checkout/route.ts' },
            { name: 'checkout/webhook/route.ts' },
          ],
        },
        {
          name: 'admin/',
          note: 'privado',
          children: [{ name: 'project-status/page.tsx' }],
        },
        {
          name: 'internal/',
          note: 'privado',
          children: [{ name: 'architecture/page.tsx' }],
        },
        { name: 'services/', note: '8 verticals (EN)' },
        { name: 'servicios/', note: 'versión ES' },
      ],
    },
    {
      name: 'components/',
      children: [
        { name: 'home/' },
        { name: 'layout/', note: 'Navbar, Footer' },
        { name: 'wizard/' },
        { name: 'admin/', note: 'dashboards de status' },
        { name: 'internal/', note: 'dashboards de arquitectura' },
        { name: 'shared/' },
      ],
    },
    {
      name: 'db/',
      children: [
        { name: 'schema.ts', note: 'services · leads · orders' },
        { name: 'index.ts', note: 'cliente Neon' },
      ],
    },
    {
      name: 'lib/',
      children: [
        { name: 'bitacora-parser.ts', note: 'parser de BITACORA.md' },
        { name: 'decision-parser.ts', note: 'parser de DECISION_LOG.md' },
        { name: 'stripe.ts' },
        { name: 'emails/' },
      ],
    },
    { name: 'data/', note: 'datos estáticos (inventory)' },
    { name: 'hooks/', note: 'React hooks custom' },
    { name: 'middleware.ts', note: 'rate limit + auth dashboards' },
  ],
};

function TreeNode({ node, depth }: { node: Node; depth: number }) {
  const hasChildren = !!node.children?.length;
  const [open, setOpen] = useState(depth < 1);
  const isDir = node.name.endsWith('/');

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors ${
          hasChildren ? 'hover:bg-white/5' : 'cursor-default'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="w-3 text-xs text-slate-500">
          {hasChildren ? (open ? '▾' : '▸') : ''}
        </span>
        <span className={isDir ? 'font-medium text-cyan-200' : 'font-mono text-slate-300'}>
          {isDir ? '📁' : '📄'} {node.name}
        </span>
        {node.note && (
          <span className="text-[11px] italic text-slate-500">— {node.note}</span>
        )}
      </button>
      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.name} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FolderTree() {
  return (
    <div className="glass-card p-4">
      <TreeNode node={TREE} depth={0} />
    </div>
  );
}
