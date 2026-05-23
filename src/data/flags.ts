import type { CharacterSpec, ContentFlag } from '../types';

export function getFlags(spec: CharacterSpec): Set<ContentFlag> {
  const flags = new Set<ContentFlag>();
  flags.add(`species:${spec.species}`);
  flags.add(`background:${spec.background}`);
  flags.add(`region:${spec.region}`);
  flags.add(`faction:${spec.faction}`);
  for (const skill of spec.skills) {
    flags.add(`skill:${skill}`);
  }
  return flags;
}

export function hasAccess(
  flags: Set<ContentFlag>,
  gate: { flags: ContentFlag[]; requireAll?: boolean }
): boolean {
  if (gate.requireAll) {
    return gate.flags.every(f => flags.has(f));
  }
  return gate.flags.some(f => flags.has(f));
}

export const DEFAULT_SPEC: CharacterSpec = {
  name: '',
  species: 'human',
  background: 'commoner',
  region: 'unknown',
  faction: 'neutral',
  skills: [],
};
