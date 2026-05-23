import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { CharacterSpecPanel } from '../CharacterSpec';
import type { CharacterSpec } from '../../types';

interface Props {
  children: ReactNode;
  spec: CharacterSpec;
  onUpdateSpec: (updates: Partial<CharacterSpec>) => void;
}

export function Layout({ children, spec, onUpdateSpec }: Props) {
  return (
    <div className="min-h-screen bg-codex-void">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4">{children}</main>
      <CharacterSpecPanel spec={spec} onUpdate={onUpdateSpec} />
    </div>
  );
}
