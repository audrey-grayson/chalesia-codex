import type { FactionData, LoreSection, GatedContent } from '../types';
import { indexContent, getSection, getFrontmatter } from '../lib/content';

/**
 * Prose AND gates live in `src/content/factions/<id>.md`:
 *  - Prose: `## tagline`, `## overview`, etc.
 *  - Frontmatter: `gates: { <section-id>: {...} }`.
 *
 * The structural shells below own only what doesn't make sense in markdown:
 * ids, type, allegiance, colors, crest images, section ordering / headings,
 * related links. To add / remove / reorder sections, edit this file AND
 * the markdown file together — the loader will throw a clear error if a
 * section id here has no matching `## <id>` heading in the markdown.
 */

const RAW = import.meta.glob('../content/factions/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const CONTENT = indexContent(RAW);

/** Section shell — only the structural fields. Gate (if any) is in markdown. */
interface SectionShell {
  id: string;
  heading?: string;
}

interface FactionShell {
  id: string;
  name: string;
  type: FactionData['type'];
  allegiance?: FactionData['allegiance'];
  color: string;
  crestImage?: string;
  sections: SectionShell[];
  relatedLinks: Array<{ label: string; to: string }>;
}

const SHELLS: FactionShell[] = [
  {
    id: 'chalexis',
    name: 'Princess Chalexis',
    type: 'civil-war-faction',
    allegiance: 'chalexis',
    color: '#c0c0c0',
    crestImage: '/chalesia-codex/arms/Imperial-chalexis-crest.png',
    sections: [
      { id: 'overview' },
      { id: 'military', heading: 'Military Assets' },
      { id: 'character', heading: 'The Person Behind the Title' },
    ],
    relatedLinks: [
      { label: 'Hanach (capital)', to: '/cities/hanach' },
      { label: 'House Karindel', to: '/factions/karindel' },
      { label: 'House Aldaine', to: '/factions/aldaine' },
    ],
  },
  {
    id: 'iaryx',
    name: 'Imperator Iaryx',
    type: 'civil-war-faction',
    allegiance: 'iaryx',
    color: '#7ab5a0',
    crestImage: '/chalesia-codex/arms/imperial-battle-crest.png',
    sections: [
      { id: 'overview' },
      { id: 'power-base', heading: 'Power Base' },
    ],
    relatedLinks: [
      { label: 'Zorlatra', to: '/cities/zorlatra' },
      { label: 'House Iventhyr', to: '/factions/iventhyr' },
    ],
  },
  {
    id: 'halkir',
    name: 'Halkir, King of Pelath',
    type: 'civil-war-faction',
    allegiance: 'halkir',
    color: '#c9a84c',
    crestImage: '/chalesia-codex/arms/pelath.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [
      { label: 'Pelath', to: '/cities/pelath' },
    ],
  },
  {
    id: 'karindel',
    name: 'House Karindel',
    type: 'noble-house',
    allegiance: 'chalexis',
    color: '#4a7ab5',
    crestImage: '/chalesia-codex/arms/karindel-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [
      { label: 'Hanach', to: '/cities/hanach' },
      { label: 'Princess Chalexis', to: '/factions/chalexis' },
    ],
  },
  {
    id: 'aldaine',
    name: 'House Aldaine',
    type: 'noble-house',
    allegiance: 'chalexis',
    color: '#c0c0c0',
    crestImage: '/chalesia-codex/arms/aldaine-crest.png',
    sections: [
      { id: 'overview' },
      { id: 'banner-men', heading: 'Bannermen & Alliances' },
    ],
    relatedLinks: [
      { label: 'Melonar (seat)', to: '/cities/melonar' },
      { label: 'House Tremaine', to: '/factions/tremaine' },
      { label: 'House Solentis', to: '/factions/solentis' },
    ],
  },
  {
    id: 'solentis',
    name: 'House Solentis',
    type: 'noble-house',
    allegiance: 'chalexis',
    color: '#7a5c3a',
    crestImage: '/chalesia-codex/arms/solentis-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [
      { label: 'Eorvar (seat)', to: '/cities/eorvar' },
      { label: 'House Aldaine', to: '/factions/aldaine' },
    ],
  },
  {
    id: 'iventhyr',
    name: 'House Iventhyr',
    type: 'noble-house',
    allegiance: 'iaryx',
    color: '#7ab5a0',
    crestImage: '/chalesia-codex/arms/iventhyr-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [
      { label: 'Zorlatra (seat)', to: '/cities/zorlatra' },
      { label: 'General Iaryx', to: '/factions/iaryx' },
    ],
  },
  {
    id: 'tremaine',
    name: 'House Tremaine',
    type: 'noble-house',
    allegiance: 'chalexis',
    color: '#b52222',
    crestImage: '/chalesia-codex/arms/house-tremaine-crest.png',
    sections: [
      { id: 'overview' },
      { id: 'civil-war-fortunes', heading: 'A Title Without a Seat' },
      { id: 'chromatic-stigma', heading: 'The Chromatic Stigma' },
    ],
    relatedLinks: [
      { label: 'House Aldaine', to: '/factions/aldaine' },
      { label: 'Gods — Calitax', to: '/gods#calitax' },
    ],
  },
  {
    id: 'mordell',
    name: 'House Mordell',
    type: 'noble-house',
    allegiance: 'chalexis',
    color: '#6a8a6a',
    crestImage: '/chalesia-codex/arms/house-mordell-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [
      { label: 'House Aldaine', to: '/factions/aldaine' },
    ],
  },
  {
    id: 'caldier',
    name: 'House Caldier',
    type: 'noble-house',
    allegiance: 'neutral',
    color: '#7a6a4a',
    crestImage: '/chalesia-codex/arms/house-caldier-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [],
  },
  {
    id: 'sentaire',
    name: 'House Sentaire',
    type: 'noble-house',
    allegiance: 'neutral',
    color: '#7a7a9a',
    crestImage: '/chalesia-codex/arms/house-sentaire-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [],
  },
  {
    id: 'karathex',
    name: 'House Karathex',
    type: 'noble-house',
    allegiance: 'chalexis',
    color: '#8a6a3a',
    crestImage: '/chalesia-codex/arms/karathex-crest.png',
    sections: [
      { id: 'overview' },
    ],
    relatedLinks: [
      { label: 'Princess Chalexis', to: '/factions/chalexis' },
    ],
  },
];

/**
 * Extract the `gates` map from frontmatter — { sectionId → GatedContent }.
 * Tolerates a missing key (returns empty object). Does not deeply validate
 * gate shape; YAML errors throw clearly at parse time so structural typos
 * surface there.
 */
function gatesFor(entityId: string): Record<string, GatedContent> {
  const fm = getFrontmatter(CONTENT, entityId);
  const raw = fm.gates;
  if (!raw || typeof raw !== 'object') return {};
  return raw as Record<string, GatedContent>;
}

/** Merge a shell with markdown content (prose + gates) into a full FactionData. */
function hydrate(shell: FactionShell): FactionData {
  const gates = gatesFor(shell.id);
  const sections: LoreSection[] = shell.sections.flatMap(s => {
    const content = getSection(CONTENT, shell.id, s.id);
    if (content === undefined) return [];
    return [{ id: s.id, heading: s.heading, gate: gates[s.id], content }];
  });
  return {
    id: shell.id,
    name: shell.name,
    type: shell.type,
    allegiance: shell.allegiance,
    color: shell.color,
    crestImage: shell.crestImage,
    tagline: getSection(CONTENT, shell.id, 'tagline') ?? '',
    sections,
    relatedLinks: shell.relatedLinks,
  };
}

export const FACTIONS: FactionData[] = SHELLS.map(hydrate);
