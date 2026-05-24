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
    color: '#92e0a4',
  },
  shadowfell: {
    id: 'shadowfell',
    name: 'The Shadowfell',
    shortName: 'Shadowfell',
    tagline: 'A reflection of the Material, dimmer and quieter — the realm of shadow and grief.',
    description:
      'The mirror to Faerie below. Colours bleach to grey, sound dulls, joy thins. The Shadowfell is closer to the Negative Plane — life essence drains slowly from those who linger. Some Eramane shadow-rites brush its edges. The deeply grief-stricken sometimes report dreams of a grey landscape: that is the Shadowfell calling.',
    color: '#b09cd0',
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
  astral: {
    id: 'astral',
    name: 'The Astral Plane',
    shortName: 'Astral',
    tagline: 'The silver sea between the planes — the medium of thought itself.',
    description:
      'A starlit ocean of pure thought through which all the other planes are suspended. Travelers project into it via the silver cord — sever the cord and the body dies, the consciousness drifts forever. Eramane initiates speak of "reading the Astral" to glimpse distant minds or events. Time is meaningless here; thought is geography. The colour palette of the Astral is the colour palette of dreams.',
    color: '#d8e0ff',
  },
  air: {
    id: 'air',
    name: 'Syrania, the Azure Sky',
    shortName: 'Syrania',
    tagline: 'A boundless vault of clear blue air — the realm of pure sky and contemplative peace.',
    description:
      'An endless cloudless blue, where the air itself sings if you listen long enough. Floating spires of pale stone hang in nothing, and the beings who dwell here — sylphs, archons, and stranger things — drift among them on currents that follow no compass. The plane is associated with wisdom and patience as much as with the elemental power of air; Eramane initiates report that prolonged scrying brushes against its edges.',
    color: '#c8e0e8',
  },
  fire: {
    id: 'fire',
    name: 'Fernia, the Sea of Fire',
    shortName: 'Fernia',
    tagline: 'An ocean of living flame — the forge that Kaynan envies.',
    description:
      'Endless rolling seas of liquid flame, with islands of obsidian, brass, and slowly drifting basalt. Efreet cities glitter on the larger islands. The plane is hostile to mortal life by an absurd margin, but its forges produce metals impossible anywhere else. Tremaine red-dragon blood resonates faintly with Fernia; the family\'s sorcerers occasionally dream of flame-cities they have never seen.',
    color: '#e87850',
  },
  water: {
    id: 'water',
    name: 'Risia, the Plain of Ice',
    shortName: 'Risia',
    tagline: 'An infinite frozen waste — water made still, motion made cold.',
    description:
      'Not a sea but a frozen one — Risia is the elemental aspect of water as preserved, slowed, eternal. Glaciers stretch beyond any horizon, crevasses descend into pale blue dark, and frostfell creatures move with patience that mocks mortal time. Syltea\'s priests recognise Risia as the sister-state of the tides she rules: water held still and remembered, rather than flowing and forgotten.',
    color: '#7ab8d8',
  },
  earth: {
    id: 'earth',
    name: 'Lamannia, the Twilight Forest',
    shortName: 'Lamannia',
    tagline: 'The primordial wild — endless forest, mountain, and storm, the source of all elemental essence.',
    description:
      'An untamed reflection of the world before civilisation: vast forests under perpetual twilight, mountains older than the gods, rivers that have never been named. Lamannia is the primordial source from which the elemental aspects of the material world were drawn — not "earth" alone but earth-as-wilderness, the substance of the natural world before it was carved into kingdoms. Druids and devout Myrai followers occasionally walk its edges; few who go deep ever truly return.',
    color: '#7a9a60',
  },
};

export const AFTERLIFE_NOTE = `Souls do not travel intact to their respective aligned planes. At the moment of death they are split in two — the life-essence returns to the Positive Plane almost immediately, while the consciousness falls to rest on the Negative Plane. There, souls are winnowed down to the very essence of their words and deeds, their personhood bleeding away back into the Elemental Planes over roughly a century (hence the resurrection time limit). Only that purest essence eventually joins the Outer Planes, once it has passed through the filtering process.

This is why mortals can follow "evil" gods without fear of eternal damnation: the reward of such worship is in life, not in any afterlife. Chalesia operates on a mythic, Nietzschean morality more like the ancient world than a Christian one.`;
