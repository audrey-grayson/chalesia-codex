import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { CharacterSpecPanel } from '../CharacterSpec';
import type { CharacterSpec } from '../../types';
import { usePreloadImages } from '../../hooks/usePreloadImages';
import { FACTIONS } from '../../data/factions';

interface Props {
  children: ReactNode;
  spec: CharacterSpec;
  onUpdateSpec: (updates: Partial<CharacterSpec>) => void;
}

// Collect every crest URL at module load time — static, never changes.
const CREST_URLS = FACTIONS
  .map(f => f.crestImage)
  .filter((url): url is string => Boolean(url));

export function Layout({ children, spec, onUpdateSpec }: Props) {
  // Kick off background preloads during browser idle time so crests are
  // already cached before the user clicks into a faction/house page.
  usePreloadImages(CREST_URLS);

  return (
    <div className="min-h-screen bg-codex-void">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4">{children}</main>
      <CharacterSpecPanel spec={spec} onUpdate={onUpdateSpec} />
    </div>
  );
}
