import type { CityData, LoreSection, GatedContent } from '../types';
import { indexContent, getSection, getFrontmatter } from '../lib/content';

/**
 * Prose AND gates AND rulers all live in `src/content/cities/<id>.md`:
 *  - Prose: `## tagline`, `## overview`, etc.
 *  - Frontmatter: `rulers: [...]` and `gates: { <section-id>: {...} }`.
 *
 * The structural shells below own only what doesn't make sense in markdown:
 * ids, faction allegiance, map coords, the section ordering / headings,
 * related links. To add / remove / reorder sections, edit this file AND
 * the markdown file together — the loader will throw a clear error if a
 * section id here has no matching `## <id>` heading in the markdown.
 */

const RAW = import.meta.glob('../content/cities/*.md', {
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

/** City shell — structural fields only. Tagline, sections, rulers, gates → markdown. */
interface CityShell {
  id: string;
  name: string;
  province: string;
  region: CityData['region'];
  population: number;
  faction: CityData['faction'];
  mapX: number;
  mapY: number;
  isCapital?: boolean;
  sections: SectionShell[];
  relatedLinks: Array<{ label: string; to: string }>;
}

const SHELLS: CityShell[] = [
  {
    id: 'hanach',
    name: 'Hanach',
    province: 'Thyalix',
    region: 'thyalix',
    population: 95000,
    faction: 'chalexis',
    mapX: 614,
    mapY: 322,
    isCapital: true,
    sections: [
      { id: 'overview' },
      { id: 'politics', heading: 'Politics & Factions' },
      { id: 'skyknight-presence', heading: 'Skyknights of Hanach' },
      { id: 'underworld', heading: 'The Undercity' },
      { id: 'scholars-quarter', heading: "The Scholar's Quarter" },
    ],
    relatedLinks: [
      { label: 'House Karindel', to: '/factions/karindel' },
      { label: 'House Aldaine', to: '/factions/aldaine' },
      { label: 'Princess Chalexis (faction)', to: '/factions/chalexis' },
      { label: 'Thyalix Province', to: '/provinces/thyalix' },
    ],
  },
  {
    id: 'zorlatra',
    name: 'Zorlatra',
    province: 'Enester',
    region: 'enester',
    population: 42000,
    faction: 'iaryx',
    mapX: 511,
    mapY: 390,
    sections: [{ id: 'overview' }],
    relatedLinks: [
      { label: 'House Iventhyr', to: '/factions/iventhyr' },
      { label: 'General Iaryx (faction)', to: '/factions/iaryx' },
    ],
  },
  {
    id: 'pelath',
    name: 'Pelath',
    province: 'Imikiv',
    region: 'imikiv',
    population: 35000,
    faction: 'halkir',
    mapX: 469,
    mapY: 312,
    sections: [
      { id: 'overview' },
      { id: 'legitimacy', heading: 'The Question of Legitimacy' },
    ],
    relatedLinks: [
      { label: 'King Halkir (faction)', to: '/factions/halkir' },
    ],
  },
  {
    id: 'eorvar',
    name: 'Eorvar',
    province: "Y'lanthitar",
    region: 'ylanthitar',
    population: 25000,
    faction: 'chalexis',
    mapX: 688,
    mapY: 289,
    sections: [{ id: 'overview' }],
    relatedLinks: [
      { label: 'House Solentis', to: '/factions/solentis' },
      { label: 'Hanach', to: '/cities/hanach' },
    ],
  },
  {
    id: 'melonar',
    name: 'Melonar',
    province: 'Aurem',
    region: 'aurem',
    population: 22000,
    faction: 'chalexis',
    mapX: 665,
    mapY: 360,
    sections: [
      { id: 'overview' },
      { id: 'dragon-blood', heading: 'The Aldaine Bloodline' },
    ],
    relatedLinks: [
      { label: 'House Aldaine', to: '/factions/aldaine' },
      { label: 'House Tremaine', to: '/factions/tremaine' },
    ],
  },
  {
    id: 'kleover',
    name: 'Kleover',
    province: 'Chilix',
    region: 'chilix',
    population: 18000,
    faction: 'iaryx',
    mapX: 452,
    mapY: 250,
    sections: [{ id: 'overview' }],
    relatedLinks: [
      { label: 'General Iaryx (faction)', to: '/factions/iaryx' },
    ],
  },
  {
    id: 'krylanth',
    name: 'Krylanth',
    province: 'Vorakrel',
    region: 'vorakrel',
    population: 4500,
    faction: 'iaryx',
    mapX: 362,
    mapY: 449,
    sections: [
      { id: 'overview' },
      { id: 'authorities', heading: 'Town Authorities' },
      { id: 'inns-and-temple', heading: 'Inns & the Temple' },
      { id: 'old-ruins', heading: 'The Ruins on the Hill' },
      { id: 'docks-underworld', heading: 'The Cove and the Sea Skald' },
      { id: 'acenian-veterans', heading: 'Veterans of the Acenian Campaign' },
    ],
    relatedLinks: [
      { label: 'Imperator Iaryx (faction)', to: '/factions/iaryx' },
      { label: 'The Pantheon', to: '/gods' },
      { label: 'Cosmology — the Old Gods', to: '/cosmology' },
    ],
  },
  {
    id: 'bellatara',
    name: 'Bellatara',
    province: 'Free City',
    region: 'free-cities',
    population: 18000,
    faction: 'free',
    mapX: 159,
    mapY: 689,
    sections: [
      { id: 'overview' },
      { id: 'government', heading: 'Government & Patriciate' },
      { id: 'trade', heading: 'Trade & the Straits' },
      { id: 'culture', heading: 'Culture, Glass, and Light' },
      { id: 'pirates', heading: 'Pirates, Privateers, and the Hidden Coast' },
      { id: 'imperial-relations', heading: 'The Empire and the Civil War' },
    ],
    relatedLinks: [
      { label: 'Pelath', to: '/cities/pelath' },
      { label: 'King Halkir (faction)', to: '/factions/halkir' },
      { label: 'Zorlatra', to: '/cities/zorlatra' },
    ],
  },
  {
    id: 'morikiv',
    name: 'Morikiv',
    province: 'Chilix',
    region: 'chilix',
    population: 4100,
    faction: 'iaryx',
    mapX: 435,
    mapY: 250,
    sections: [{ id: 'overview' }],
    relatedLinks: [
      { label: 'Kleover', to: '/cities/kleover' },
      { label: 'General Iaryx (faction)', to: '/factions/iaryx' },
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

/** Extract `rulers` (array of faction ids) from frontmatter. */
function rulersFor(entityId: string): string[] | undefined {
  const fm = getFrontmatter(CONTENT, entityId);
  const raw = fm.rulers;
  if (!Array.isArray(raw)) return undefined;
  return raw.filter((x): x is string => typeof x === 'string');
}

/** Merge a shell with markdown content (prose + gates + rulers) into a full CityData. */
function hydrate(shell: CityShell): CityData {
  const gates = gatesFor(shell.id);
  const sections: LoreSection[] = shell.sections.flatMap(s => {
    const content = getSection(CONTENT, shell.id, s.id);
    if (content === undefined) return [];
    return [{ id: s.id, heading: s.heading, gate: gates[s.id], content }];
  });
  return {
    id: shell.id,
    name: shell.name,
    province: shell.province,
    region: shell.region,
    population: shell.population,
    faction: shell.faction,
    mapX: shell.mapX,
    mapY: shell.mapY,
    isCapital: shell.isCapital,
    tagline: getSection(CONTENT, shell.id, 'tagline') ?? '',
    sections,
    rulers: rulersFor(shell.id),
    relatedLinks: shell.relatedLinks,
  };
}

export const CITIES: CityData[] = SHELLS.map(hydrate);
