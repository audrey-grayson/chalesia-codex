import type { CityData } from '../types';

export const CITIES: CityData[] = [
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
    tagline: 'The Silver Seat — capital of the Hanacene Empire and throne of Princess Chalexis.',
    sections: [
      {
        id: 'overview',
        content: `Hanach stands at the heart of the Thyalix plain, its skyline crowned by the Argent Spire — a tower of spell-hardened silver stone raised by the first Empress three centuries ago. A city of nearly a hundred thousand souls, it is the largest settlement in the known world and the center of imperial administration, trade, and military command.

The civil war has not diminished Hanach's physical grandeur, but it has hollowed its politics. The great noble families maintain townhouses here even as their swords back different claimants, and the streets hum with rumor, espionage, and quiet desperation. Food prices have risen; the eastern granary roads are no longer fully safe.`,
      },
      {
        id: 'politics',
        heading: 'Politics & Factions',
        content: `Princess Chalexis rules from the Spire, supported by the Karindel family — the lords of Thyalix province and her chancellors for two generations. House Aldaine holds the eastern approaches and provides her most reliable military force. The city's patrician class, led by guild-masters and port authorities, broadly support Chalexis for the stability of trade, though their patience is not infinite.`,
      },
      {
        id: 'skyknight-presence',
        heading: 'Skyknights of Hanach',
        content: `The capital fields the empire's most prestigious Skyknight cadre — approximately eighty riders and their wyverns. They patrol the approaches to Thyalix and serve as a deterrent against any aerial assault. The wyvern pens beneath the Argent Spire are a source of civic pride; tours are occasionally granted to honored guests.`,
        gate: {
          flags: ['background:skyknight', 'background:soldier', 'background:noble', 'skill:history'],
          label: 'Military knowledge',
          hint: 'A soldier, noble, or scholar of history might know these details.',
        },
      },
      {
        id: 'underworld',
        heading: 'The Undercity',
        content: `Beneath Hanach's clean civic face lies a warren of old tunnels — some dating to the Fractured Kingdoms era — repurposed as smuggling routes, cult gathering places, and the meeting grounds of agents working for all three factions simultaneously. The Eramane priesthood runs an intelligence network from a supposedly legitimate archive in the Scholar's Quarter.`,
        gate: {
          flags: ['background:spy', 'background:criminal'],
          label: 'Criminal contacts',
          hint: 'Those with underworld ties know what official histories omit.',
        },
      },
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
    tagline: 'The Iron City — second largest in the empire, seat of the Iventhyr barons and loyal to General Iaryx.',
    sections: [
      {
        id: 'overview',
        content: `Zorlatra grew from a military fort into the empire's industrial heart — it sits at the confluence of two rivers with access to iron deposits in the Enester hills. Its population of forty-two thousand makes it the second city of the empire, yet it holds only a barony, a slight that its lords have nursed for generations.

When General Iaryx declared for reform, Baron Iventhyr was the first of the grand lords to commit fully. The city's smiths, miners, and legionary veterans form the backbone of the Iaryx war effort.`,
      },
      {
        id: 'industry',
        heading: 'Industry & Economy',
        content: `Zorlatra's foundries produce the empire's finest plate and mail. Three major guild-houses compete for contracts: the Hammers of Enester (smithing), the River Toll Brotherhood (transport), and the Assay House (banking and ore valuation). The city's prosperity has been tested by the civil war cutting trade routes to the capital.`,
      },
      {
        id: 'military',
        heading: 'Military Strength',
        content: `The Third and Sixth Legions historically garrisoned Enester. Their remnants — approximately four thousand effectives between them — now serve Iaryx directly. The city's citadel holds stockpiles of arms sufficient to equip twice that number.`,
        gate: {
          flags: ['background:soldier', 'background:skyknight', 'skill:history'],
          label: 'Military intelligence',
        },
      },
    ],
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
    tagline: "Lord Halkir's seat — an ancient trading city with deep claims to imperial legitimacy.",
    sections: [
      {
        id: 'overview',
        content: `Pelath is among the oldest cities in the empire — its predecessor settlement was founded during the Fractured Kingdoms era, and Lord Halkir claims unbroken lineage back to Seneca, founder of the First Empire. Whether or not that genealogy survives scrutiny, it has proven politically effective.

The city is a natural trading hub, positioned between the empire's western coast and the interior. Halkir has used this to build alliances with Free City merchants and fund his faction through commerce rather than conquest.`,
      },
      {
        id: 'legitimacy',
        heading: 'The Question of Legitimacy',
        content: `Halkir's claim rests on lineage, not military power or magic. His genealogists have produced documentation — disputed by Chalexis's court but not definitively disproved — tracing his family to Seneca's younger son. Many in the empire view this as politically convenient history. Others believe it. The difference determines who they fight for.`,
        gate: {
          flags: ['skill:history', 'background:noble', 'background:scholar'],
          label: 'Scholarly knowledge',
          hint: 'A noble or historian understands the genealogical arguments.',
        },
      },
    ],
    relatedLinks: [
      { label: 'Lord Halkir (faction)', to: '/factions/halkir' },
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
    tagline: "The contested eastern city — controlled by House Solentis, formally Chalexis-aligned but coveted by Iaryx.",
    sections: [
      {
        id: 'overview',
        content: `Eorvar guards the eastern coastal approaches and serves as the main port connecting the Hanacene mainland with the elven-influenced islands to the east. House Solentis has ruled Y'lanthitar for five generations and currently backs Princess Chalexis — though their long rivalry with House Aldaine means that loyalty is contingent on continued imperial favor.`,
      },
    ],
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
    tagline: 'Seat of House Aldaine — the dragon-blooded eastern lords who anchor the Chalexis faction.',
    sections: [
      {
        id: 'overview',
        content: `Melonar is a city built on silver and dragon-blood. House Aldaine has held Aurem province for two centuries through an unbroken alliance with the imperial line, and their dragon-sorcerer lineage — traced to a silver dragon ancestor — gives them military power no amount of foot soldiers can match. The city itself is prosperous and quiet, more administrative seat than military hub.`,
      },
      {
        id: 'dragon-blood',
        heading: 'The Aldaine Bloodline',
        content: `House Aldaine's sorcerous power derives from a silver dragon ancestor several generations back — one of the last of the great metallics to take a mortal consort. The current lord is a capable sorcerer; his children, reportedly, are stronger still. House Tremaine, allied by marriage, carries red-dragon blood. The two houses are allied but wary of each other.`,
        gate: {
          flags: ['skill:arcana', 'skill:history', 'background:noble'],
          label: 'Arcane or noble knowledge',
        },
      },
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
    tagline: 'Northwestern frontier city — a rough garrison town on the edge of the Iaryx-controlled west.',
    sections: [
      {
        id: 'overview',
        content: `Kleover sits on Chilix's northern frontier, where the imperial heartland gives way to the wildlands — territory inhabited by independent communities, remnant goblinoid clans, and occasional Skeinland raiders. It is a garrison city first, a trade post second, and a comfortable home third. General Iaryx has invested heavily in Chilix's defenses, knowing that losing the north would expose his flank.`,
      },
    ],
    relatedLinks: [
      { label: 'General Iaryx (faction)', to: '/factions/iaryx' },
    ],
  },
];
