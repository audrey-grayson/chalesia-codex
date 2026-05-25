import type { GatedContent } from '../types';
import { indexContent, getSection } from '../lib/content';

export interface PlaneData {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  color: string;          // primary colour for rendering
  glow?: string;          // optional glow colour for energy planes
}

export const COSMOLOGY_GATE: GatedContent = {
  flags: ['skill:arcana', 'skill:religion', 'background:acolyte', 'background:hermit'],
  label: 'Cosmological Knowledge',
  hint: 'Reserved for those trained in Arcana or Religion, or who have lived as an acolyte or hermit.',
};

/**
 * Prose lives in `src/content/cosmology/<id>.md`. Each plane has `tagline`
 * and `description` sections. The `_afterlife.md` file holds the standalone
 * afterlife note as a `## note` section.
 */

const RAW = import.meta.glob('../content/cosmology/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const CONTENT = indexContent(RAW);

interface PlaneShell {
  id: string;
  name: string;
  shortName: string;
  color: string;
  glow?: string;
}

const SHELLS: PlaneShell[] = [
  {
    id: 'material',
    name: 'The Prime Material Plane',
    shortName: 'Material',
    color: '#c9a84c',
  },
  {
    id: 'ethereal',
    name: 'The Aethereal Plane',
    shortName: 'Aetherea',
    color: '#a8c8d8',
  },
  {
    id: 'feywild',
    name: 'Faerie',
    shortName: 'Faerie',
    color: '#92e0a4',
  },
  {
    id: 'shadowfell',
    name: 'The Shadowfell',
    shortName: 'Shadowfell',
    color: '#b09cd0',
  },
  {
    id: 'positive',
    name: 'The Plane of Life',
    shortName: 'Life',
    color: '#ffffff',
    glow: '#fff4c0',
  },
  {
    id: 'negative',
    name: 'The Plane of Death',
    shortName: 'Death',
    color: '#0a0a0a',
    glow: '#3a1a3a',
  },
  {
    id: 'astral',
    name: 'The Astral Plane',
    shortName: 'Astral',
    color: '#d8e0ff',
  },
  {
    id: 'air',
    name: 'Syrania, the Azure Sky',
    shortName: 'Syrania',
    color: '#c8e0e8',
  },
  {
    id: 'fire',
    name: 'Fernia, the Sea of Fire',
    shortName: 'Fernia',
    color: '#e87850',
  },
  {
    id: 'water',
    name: 'Risia, the Plain of Ice',
    shortName: 'Risia',
    color: '#7ab8d8',
  },
  {
    id: 'earth',
    name: 'Parvata, the Eternal Mountain',
    shortName: 'Parvata',
    color: '#a08860',
  },
];

function hydrate(shell: PlaneShell): PlaneData {
  return {
    id: shell.id,
    name: shell.name,
    shortName: shell.shortName,
    color: shell.color,
    glow: shell.glow,
    tagline: getSection(CONTENT, shell.id, 'tagline'),
    description: getSection(CONTENT, shell.id, 'description'),
  };
}

export const PLANES: Record<string, PlaneData> = Object.fromEntries(
  SHELLS.map(s => [s.id, hydrate(s)]),
);

export const AFTERLIFE_NOTE: string = getSection(CONTENT, '_afterlife', 'note');
