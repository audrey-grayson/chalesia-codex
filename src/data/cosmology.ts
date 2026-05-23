import type { GatedContent } from '../types';

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

export const PLANES: Record<string, PlaneData> = {
  material: {
    id: 'material',
    name: 'The Prime Material Plane',
    shortName: 'Material',
    tagline: 'The mundane world — earth, sea, and sky.',
    description:
      'The world where mortals live and die. The world of forests and cities, of harvest and war. From every other plane, the Material is what is being looked at: it is the reference, the centre, the place where stories happen. Magic touches it but does not originate here.',
    color: '#c9a84c',
  },
  ethereal: {
    id: 'ethereal',
    name: 'The Aethereal Plane',
    shortName: 'Aetherea',
    tagline: 'A thin shell wrapped around the Material — the home of ghosts and dreams.',
    description:
      'A translucent layer of silvered mist that overlaps the Material plane entirely. Ghosts walk here, watching the living world they cannot quite touch. Dreams unfold in its currents. Mediums and certain Eramane initiates can briefly perceive into the Aethereal; the dying sometimes drift through it before passing on.',
    color: '#a8c8d8',
  },
  feywild: {
    id: 'feywild',
    name: 'Faerie',
    shortName: 'Faerie',
    tagline: 'A reflection of the Material, brighter and stranger — the realm of fey and elves.',
    description:
      'A parallel of the Material where colour saturates, beauty intensifies, and meaning runs closer to the surface. Time runs strange here. Faerie sits "above" the Material in cosmological terms, closer to the Positive Plane — life-essence is abundant, growth runs riot. Raxos is queen here. Elves and fey-blooded mortals can sometimes feel its pull.',
    color: '#7ac88a',
  },
  shadowfell: {
    id: 'shadowfell',
    name: 'The Shadowfell',
    shortName: 'Shadowfell',
    tagline: 'A reflection of the Material, dimmer and quieter — the realm of shadow and grief.',
    description:
      'The mirror to Faerie below. Colours bleach to grey, sound dulls, joy thins. The Shadowfell is closer to the Negative Plane — life essence drains slowly from those who linger. Some Eramane shadow-rites brush its edges. The deeply grief-stricken sometimes report dreams of a grey landscape: that is the Shadowfell calling.',
    color: '#7a6a8a',
  },
  positive: {
    id: 'positive',
    name: 'The Positive Energy Plane',
    shortName: 'Positive',
    tagline: 'A point of pure life-energy — the source of all growth and animation.',
    description:
      'Not a place but a singularity. Life-essence floods outward from this point and into every living thing on every plane. At death, that essence returns here almost instantly; this is why resurrection magic must work quickly. Direct exposure would unmake a mortal in an instant — too much life cannot be contained.',
    color: '#ffffff',
    glow: '#fff4c0',
  },
  negative: {
    id: 'negative',
    name: 'The Negative Energy Plane',
    shortName: 'Negative',
    tagline: 'A point of pure stillness — the resting place of mortal consciousness.',
    description:
      'The mirror to the Positive. Consciousness falls here at death and rests in an Asphodel-like limbo for roughly a century, slowly winnowed down to its essential deeds and words. Only that purest essence eventually filters to the Outer Planes. Necromancy taps power that leaks from this point. Soranus claims dominion here, though even he treads carefully.',
    color: '#0a0a0a',
    glow: '#3a1a3a',
  },
};

export const AFTERLIFE_NOTE = `Souls do not travel intact to their respective aligned planes. At the moment of death they are split in two — the life-essence returns to the Positive Plane almost immediately, while the consciousness falls to rest on the Negative Plane. There, souls are winnowed down to the very essence of their words and deeds, their personhood bleeding away back into the Elemental Planes over roughly a century (hence the resurrection time limit). Only that purest essence eventually joins the Outer Planes, once it has passed through the filtering process.

This is why mortals can follow "evil" gods without fear of eternal damnation: the reward of such worship is in life, not in any afterlife. Chalesia operates on a mythic, Nietzschean morality more like the ancient world than a Christian one.`;
