import type { ReactNode } from 'react';
import type { GatedContent } from '../types';
import type { ContentFlag } from '../types';

interface Props {
  gate: GatedContent;
  flags: Set<ContentFlag>;
  children: ReactNode;
}

export function ContentGate({ gate, flags, children }: Props) {
  const hasAccess = gate.requireAll
    ? gate.flags.every(f => flags.has(f))
    : gate.flags.some(f => flags.has(f));

  if (hasAccess) return <>{children}</>;

  return (
    <div className="border border-codex-border rounded p-4 my-4 bg-codex-surface/50 flex items-start gap-3 opacity-75">
      <span className="text-codex-parchmentDim text-xl mt-0.5">🔒</span>
      <div>
        <p className="text-codex-parchmentDim text-sm font-display">
          {gate.label ?? 'Restricted Information'}
        </p>
        {gate.hint && (
          <p className="text-codex-parchmentDim/70 text-xs mt-1">{gate.hint}</p>
        )}
        <p className="text-codex-parchmentDim/50 text-xs mt-1">
          Update your character spec to access this content.
        </p>
      </div>
    </div>
  );
}
