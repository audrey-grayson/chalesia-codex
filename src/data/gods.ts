import type { GodData } from '../types';
import { indexContent, getSection } from '../lib/content';

/**
 * Prose lives in `src/content/gods/<id>.md`. Each god markdown file has three
 * sections: `## tagline`, `## description`, and `## worshippers`. Structural
 * metadata (alignment, domains, symbol, pantheon) lives in the shells here.
 */

const RAW = import.meta.glob('../content/gods/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const CONTENT = indexContent(RAW);

interface GodShell {
  id: string;
  name: string;
  alignment: GodData['alignment'];
  domains: string[];
  symbol?: string;
  pantheon: GodData['pantheon'];
}

const SHELLS: GodShell[] = [
  {
    id: 'myrai',
    name: 'Myrai',
    alignment: 'chaotic',
    domains: ['Nature', 'Wilderness', 'Fertility', 'Sea'],
    pantheon: 'hanacene',
  },
  {
    id: 'alreth',
    name: 'Alreth',
    alignment: 'lawful',
    domains: ['Harvest', 'Civilization', 'Protection', 'Home'],
    pantheon: 'hanacene',
  },
  {
    id: 'eramane',
    name: 'Eramane',
    alignment: 'neutral',
    domains: ['Knowledge', 'Secrets', 'Shadow', 'Spies'],
    symbol: 'A single open eye wreathed in shadow.',
    pantheon: 'hanacene',
  },
  {
    id: 'raxos',
    name: 'Raxos',
    alignment: 'chaotic',
    domains: ['Love', 'Art', 'Trickery', 'Fey', 'Luck'],
    symbol: 'The comedy-tragedy mask.',
    pantheon: 'hanacene',
  },
  {
    id: 'calitax',
    name: 'Calitax',
    alignment: 'lawful',
    domains: ['Conquest', 'Order', 'Law', 'Dragons'],
    symbol: 'A silver crown set with dragon horns.',
    pantheon: 'hanacene',
  },
  {
    id: 'iriyal',
    name: 'Iriyal',
    alignment: 'lawful',
    domains: ['Sun', 'Sky', 'Seasons', 'Agriculture'],
    pantheon: 'hanacene',
  },
  {
    id: 'syltea',
    name: 'Syltea',
    alignment: 'neutral',
    domains: ['Moon', 'Trade', 'Dreams', 'Tides', 'Sailors'],
    symbol: 'A crescent moon, often appearing on one face of coins.',
    pantheon: 'hanacene',
  },
  {
    id: 'kaynan',
    name: 'Kaynan',
    alignment: 'neutral',
    domains: ['Invention', 'Forge', 'Creation', 'Craft'],
    pantheon: 'hanacene',
  },
  {
    id: 'soranus',
    name: 'Soranus',
    alignment: 'chaotic',
    domains: ['Death', 'Fate', 'Undead', 'Fear'],
    pantheon: 'hanacene',
  },
  {
    id: 'strithos',
    name: 'Strithos',
    alignment: 'chaotic',
    domains: ['War', 'Glory', 'Honor', 'Battle'],
    symbol: 'A broken sword (contested between orc and dwarf interpretations).',
    pantheon: 'skeinland',
  },
  {
    id: 'tiamat',
    name: 'Tiamat',
    alignment: 'chaotic',
    domains: ['Chaos', 'Destruction', 'Chromatic Dragons', 'Entropy'],
    symbol: 'A five-headed dragon silhouette.',
    pantheon: 'old-gods',
  },
];

function hydrate(shell: GodShell): GodData {
  return {
    id: shell.id,
    name: shell.name,
    alignment: shell.alignment,
    domains: shell.domains,
    symbol: shell.symbol,
    pantheon: shell.pantheon,
    tagline: getSection(CONTENT, shell.id, 'tagline'),
    description: getSection(CONTENT, shell.id, 'description'),
    worshippers: getSection(CONTENT, shell.id, 'worshippers'),
  };
}

export const GODS: GodData[] = SHELLS.map(hydrate);
