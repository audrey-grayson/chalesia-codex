import { useState, useEffect } from 'react';
import type { CharacterSpec } from '../types';
import { DEFAULT_SPEC } from '../data/flags';

const STORAGE_KEY = 'chalesia-codex-spec';

export function useCharacterSpec() {
  const [spec, setSpec] = useState<CharacterSpec>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...DEFAULT_SPEC, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SPEC;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spec));
  }, [spec]);

  const updateSpec = (updates: Partial<CharacterSpec>) => {
    setSpec(prev => ({ ...prev, ...updates }));
  };

  return { spec, updateSpec };
}
