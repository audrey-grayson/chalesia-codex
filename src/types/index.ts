export type Faction = 'chalexis' | 'iaryx' | 'halkir' | 'neutral' | 'free' | 'foreign';

export type Species = 'human' | 'elf' | 'half-dragon' | 'orc' | 'dwarf' | 'goblinoid' | 'other';

export type Background =
  | 'noble' | 'soldier' | 'merchant' | 'scholar' | 'priest'
  | 'spy' | 'criminal' | 'sailor' | 'skyknight' | 'commoner';

export type KnowledgeSkill = 'history' | 'religion' | 'arcana' | 'nature' | 'investigation' | 'insight';

export type Region =
  | 'thyalix' | 'ylanthitar' | 'aurem' | 'enester' | 'imikiv' | 'chilix'
  | 'irdagar' | 'vorakrel' | 'karathex' | 'osothon' | 'vulerahkas'
  | 'salixvale' | 'vinat' | 'estavar' | 'shialantor' | 'shifract' | 'helior'
  | 'felevanix' | 'ilthyrion'
  | 'skeinland' | 'free-cities' | 'elven-east' | 'legia' | 'unknown';

export interface CharacterSpec {
  name: string;
  species: Species;
  background: Background;
  region: Region;
  faction: Faction;
  skills: KnowledgeSkill[];
}

export type ContentFlag =
  | `species:${Species}`
  | `background:${Background}`
  | `region:${Region}`
  | `faction:${Faction}`
  | `skill:${KnowledgeSkill}`;

export interface GatedContent {
  flags: ContentFlag[];
  requireAll?: boolean;
  label?: string;
  hint?: string;
}

export interface LoreSection {
  id: string;
  heading?: string;
  content: string;
  gate?: GatedContent;
}

export interface CityData {
  id: string;
  name: string;
  province: string;
  region: Region;
  population: number;
  faction: Faction;
  mapX: number;
  mapY: number;
  isCapital?: boolean;
  tagline: string;
  sections: LoreSection[];
  relatedLinks: Array<{ label: string; to: string }>;
}

export interface FactionData {
  id: string;
  name: string;
  type: 'civil-war-faction' | 'noble-house' | 'organization' | 'polity';
  allegiance?: Faction;
  tagline: string;
  color: string;
  crestImage?: string;
  sections: LoreSection[];
  relatedLinks: Array<{ label: string; to: string }>;
}

export interface GodData {
  id: string;
  name: string;
  alignment: 'lawful' | 'neutral' | 'chaotic';
  domains: string[];
  tagline: string;
  description: string;
  worshippers: string;
  symbol?: string;
  pantheon: 'hanacene' | 'skeinland' | 'old-gods';
}
