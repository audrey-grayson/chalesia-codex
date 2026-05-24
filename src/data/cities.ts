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
    tagline: 'Capital of the Hanacene Empire and seat of Princess Chalexis.',
    sections: [
      {
        id: 'overview',
        content: `Hanach stands at the heart of the Thyalix plain — the capital that Veloth Neb, the half-silver-dragon sorcerer who founded the Second Empire nearly four centuries ago, established as the seat of his reconquest. A city of nearly a hundred thousand souls, its skyline is crowned by the **Argent Spire**, and it remains the largest settlement in the empire and the center of imperial administration, trade, and military command.

The civil war has not diminished Hanach's physical grandeur, but it has hollowed its politics. The great noble families maintain townhouses here even as their swords back different claimants, and the streets hum with rumor, espionage, and quiet desperation. Food prices have risen; the eastern granary roads are no longer fully safe.`,
      },
      {
        id: 'politics',
        heading: 'Politics & Factions',
        content: `Princess Chalexis rules from the imperial palace, supported by the Karindel family — earls of Thyalix and the Empire's chancellors, with Hector Karindel serving as her closest advisor. House Aldaine holds the eastern approaches and provides her most reliable military force. The city's patrician class, led by guild-masters and port authorities, broadly support Chalexis for the stability of trade, though their patience is not infinite.`,
      },
      {
        id: 'skyknight-presence',
        heading: 'Skyknights of Hanach',
        content: `The capital fields the empire's most prestigious Skyknight cadre. They patrol the approaches to Thyalix and serve as a deterrent against any aerial assault — and an unsubtle reminder that wyverns will only bond with riders carrying some trace of draconic blood, a privilege the empire's ruling lineages have kept very close.`,
        gate: {
          flags: ['background:skyknight', 'background:soldier', 'background:noble', 'skill:history'],
          label: 'Military knowledge',
          hint: 'A soldier, noble, or scholar of history might know these details.',
        },
      },
      {
        id: 'underworld',
        heading: 'The Undercity',
        content: `Beneath Hanach's clean civic face lies a warren of old tunnels repurposed as smuggling routes, cult gathering places, and the meeting grounds of agents working for all three factions simultaneously.`,
        gate: {
          flags: ['background:spy', 'background:criminal'],
          label: 'Criminal contacts',
          hint: 'Those with underworld ties know what official histories omit.',
        },
      },
      {
        id: 'scholars-quarter',
        heading: "The Scholar's Quarter",
        // PLACEHOLDER — locked section reserved for canonical Scholar's Quarter
        // lore (libraries, schools, priestly archives, who *actually* runs what).
        // Awaiting source material from the Sync vault.
        content: `*[Further detail on the Scholar's Quarter is yet to be written. Reserved for scholarly and arcane knowledge of the capital's libraries, schools, and priestly archives.]*`,
        gate: {
          flags: ['skill:history', 'skill:arcana', 'skill:religion', 'background:scholar', 'background:acolyte'],
          label: 'Scholarly access',
          hint: "Scholars and acolytes know the workings of the capital's archives.",
        },
      },
    ],
    // Princess Chalexis rules from the imperial palace; Karindel are earls of
    // Thyalix and Imperial Chancellors — together they constitute Hanach's
    // ruling power. Aldaine "holds the eastern approaches" militarily but
    // does not rule the capital, so they're related-but-not-ruler.
    rulers: ['chalexis', 'karindel'],
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
        content: `Zorlatra sits at the confluence of two rivers in Enester province. With a population of forty-two thousand it is the second city of the empire, yet it holds only a barony — a slight that the Iventhyr line have nursed for generations.

When Imperator Iaryx declared for reform, Baron Iventhyr was the first of the grand lords to commit fully. Zorlatra's industry and veterans form the backbone of the Iaryx war effort.`,
      },
    ],
    // Barons Iventhyr rule Zorlatra; Iaryx is the city's civil-war allegiance
    // (already shown via the faction badge), not its ruler.
    rulers: ['iventhyr'],
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

The city is a natural trading hub, sitting to the north along the Bay of Diamonds — controlling the inland sea trade that the bay funnels through it. Halkir has used this to build alliances with Free City merchants and fund his faction through commerce rather than conquest.`,
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
    rulers: ['halkir'],
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
    // House Solentis has ruled Y'lanthitar from Eorvar for generations.
    rulers: ['solentis'],
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
        content: `Melonar is a city built on silver and dragon-blood. House Aldaine has held Aurem for generations on the strength of an ancestral silver-dragon line — sorcerers reliable enough that one Aldaine on a battlefield is worth a company of knights. The city itself is prosperous and quiet, more administrative seat than military hub.`,
      },
      {
        id: 'dragon-blood',
        heading: 'The Aldaine Bloodline',
        content: `House Aldaine's sorcerous power runs ancestral — silver-dragon blood old enough that every generation produces at least one capable sorcerer. Lord Maverick Aldaine holds the seat; Lady Salix, his wife, is Tremaine-born and carries the red-dragon blood of that house. Their two-centuries-old marriage alliance with Tremaine has produced the most consistent silver-and-red intermarriage in the empire, though the Tremaines' loss of their seat in Irdagar early in the war has made the alliance less politically useful than it once was.`,
        gate: {
          flags: ['skill:arcana', 'skill:history', 'background:noble'],
          label: 'Arcane or noble knowledge',
        },
      },
    ],
    // Melonar is the seat of House Aldaine. Tremaine is a related allied
    // house (Salix Aldaine née Tremaine) but rules Irdagar, not Aurem.
    rulers: ['aldaine'],
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
  {
    id: 'krylanth',
    name: 'Krylanth',
    province: 'Vorakrel',
    region: 'vorakrel',
    population: 4500,
    faction: 'iaryx',
    mapX: 362,
    mapY: 449,
    tagline: 'A small southern port town in Vorakrel province — wind-bitten, war-thinned, and watched over by an old soldier with too few hands.',
    sections: [
      {
        id: 'overview',
        content: `Krylanth is a small coastal town of perhaps four and a half thousand souls, perched where the southern hills give way to the sea. It is not the seat of Vorakrel province (that is Firkrel, further inland) and answers to that seat only loosely — for practical purposes Krylanth runs itself, or fails to. Once an unremarkable fishing port, it has lately taken on the strained air of every settlement that the civil war has noticed but not fully consumed — the garrison is undermanned, the harbour traffic has thinned, and the magistrate looks more harried each season.

It is the kind of town where strangers are watched but not turned away. There is honest work for those willing to take it, and dishonest work for those who know where to ask.`,
      },
      {
        id: 'authorities',
        heading: 'Town Authorities',
        content: `**Magistrate Elazar Dalton** holds nominal authority — an LN bureaucrat, bald, perpetually mopping his brow, and visibly aware that he is in over his head. He has of late been posting rewards for solving problems he has no resources to handle himself.

**Ser Volus** captains the dozen-strong town guard from a small headquarters off the northern square. Forty-odd years old, gruff, eyepatched, a veteran of the Acenian campaign two decades back. She is the only real fighter in the town and knows it; she will not lead a sally into the countryside, because if she dies Krylanth is defenceless. She respects military discipline and despises sellswords who play loose.`,
      },
      {
        id: 'inns-and-temple',
        heading: 'Inns & the Temple',
        content: `Two taverns serve the town. **The Dancing Rose** — "the Rose" to locals — is the respectable one: farmers and small merchants, talkative, theory-prone, just shy of comfortable lodgings at 7sp the night. **The Sea Skald** down on the docks is the other thing: dive prices (1sp), dive clientele, and fights that begin before the singing stops.

The **Temple of the Nine** is one of the few stone buildings in town, with a shrine to each major god of the Hanacene pantheon. Its head priestess is a young cleric of Alreth, the sun god — earnest, undertrained, and grateful for visitors who know the prayers.`,
      },
      {
        id: 'old-ruins',
        heading: 'The Ruins on the Hill',
        content: `Outside the town walls, on a rise overlooking the sea, stand the broken bones of a temple that pre-dates the Hanacene pantheon entirely — a place of the Old Gods. Locals avoid it; the priestess at the Temple of the Nine will not discuss it. There have been... reports, lately. The kind of reports a magistrate would post a reward to make stop.

Scholars of the Old Faith would recognise the architecture as belonging to one of the Old Gods cults that the First Empire pushed out of the settled lands long ago. Which Old God is harder to say without going inside and looking. Most such ruins are empty. Most.`,
        gate: {
          flags: ['skill:history', 'skill:religion', 'background:acolyte', 'background:scholar'],
          label: 'Religious or scholarly knowledge',
          hint: 'Those who study old faiths recognise what stood here.',
        },
      },
      {
        id: 'docks-underworld',
        heading: 'The Cove and the Sea Skald',
        content: `The Sea Skald is more than a bad inn — its dockside regulars include smugglers running goods past imperial tariffs, retired pirates who know which captains still ply the southern coast, and the occasional information-broker passing through. A patron there will, with the right encouragement, mention a strange ship recently sighted at anchor in a hidden cove down the coast. No flag. No hailing.

Ser Volus knows the dock underworld exists and tolerates it. She lacks the men to root it out, and a controlled criminal economy is, in her judgment, safer than an uncontrolled one. She will not interfere with you unless you give her cause.`,
        gate: {
          flags: ['skill:investigation', 'background:criminal', 'background:spy', 'background:sailor'],
          label: 'Underworld or investigative knowledge',
          hint: 'Smugglers, sailors, and investigators know how to listen at the Sea Skald.',
        },
      },
      {
        id: 'acenian-veterans',
        heading: 'Veterans of the Acenian Campaign',
        content: `Ser Volus is one of perhaps a hundred Krylanthi who fought in the Acenian Campaign of two decades ago — General Iaryx's celebrated victories against Acenia, fought across the eastern straits. The campaign made Iaryx's reputation and is remembered fondly by its survivors, who form the backbone of more than one southern town's guard. They tend to be older, scarred, and unimpressed by the current war's slow rot.`,
        gate: {
          flags: ['background:soldier', 'background:skyknight', 'skill:history'],
          label: 'Military history',
        },
      },
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
    tagline: 'Queen of the Free Cities — a wealthy, lawless, gloriously inventive port-state that answers to no crown.',
    sections: [
      {
        id: 'overview',
        content: `Bellatara is the most preeminent of the southern city-states — a port of some eighteen thousand souls perched at the eastern straits, controlling a stretch of coast that every imperial cartographer secretly wishes was theirs. It is the capital of a loose league of independent ports often grouped as the Free Cities, though Bellatara is by far the largest and richest of them, and the "league" is in practice whatever Bellatara says it is in any given decade.

Where Hanach has lineage, Zorlatra has iron, and Pelath has tradition, Bellatara has money. A great deal of money. The city's defining philosophy can be summarised in three words: anything goes, profitably.`,
      },
      {
        id: 'government',
        heading: 'Government & Patriciate',
        content: `Bellatara has no king, no count, no inherited seat. The city is governed by a council of merchant patricians drawn from its great trading houses, who spend most of their political energy ensuring no one member grows too powerful. There are no nobles by blood here. There are people with enough money to be treated as nobles, which the Bellatarans find a tidier arrangement.

By imperial reckoning Bellatara is technically part of Galta — the southern coast state that nominally encompasses the Free City coast — but Galta has not enforced a tax claim on Bellatara in living memory, and the city's patricians refer to Galtan officials with the careful politeness usually reserved for embarrassing relatives.`,
      },
      {
        id: 'trade',
        heading: 'Trade & the Straits',
        content: `Every ship that wishes to move cargo between the eastern islands and the imperial mainland passes within sight of Bellatara's harbour. The city does not levy a transit tax — that would be crude — but Bellataran warehouses, brokers, and money-changers offer services so convenient that the equivalent of a transit tax accrues anyway, voluntarily, profitably. The patriciate considers this elegant.

The city's docks are continuously busy. Imperial grain ships from Aurem ride at anchor beside Skeinland reaver-galleys and elven trade-junks from the eastern isles. The harbour-master's office maintains, with weary professionalism, the fiction that nothing untoward ever happens.`,
      },
      {
        id: 'culture',
        heading: 'Culture, Glass, and Light',
        content: `Bellatara's streets are crowded with every species and dialect known to the archipelago. Temples to all nine Hanacene gods stand near temples to Strithos, shrines to obscure Skeinland ancestor-spirits, and at least one structure that the wise simply call "the Old Place." Citizens dress to display wealth, not status — there are no sumptuary laws here.

The city's craftsmen are famous across the archipelago for two things above all: **glasswork** of a fineness no imperial workshop can match, and the **flameless lights** that hang in Bellataran ballrooms, salons, and the better merchant houses. The technique behind both is closely guarded by the glassblowers' families on the inner harbour, who have intermarried with the patriciate for generations and treat their trade secrets as a form of property more sacred than land.

The arts flourish on the back of all this money. The Bellataran opera is internationally famous; its plays are scandalous, its music is bewildering, and its leading singers are paid more than imperial generals.`,
      },
      {
        id: 'pirates',
        heading: 'Pirates, Privateers, and the Hidden Coast',
        content: `Bellatara does not officially harbour pirates. Bellatara does, however, freely permit *privateers* — ship-captains operating under "letters of marque" issued by foreign powers, the patriciate, or, in some cases, just letters. The distinction between a Bellataran privateer and a pirate is largely a matter of paperwork, and the paperwork is for sale.

Several coves and inlets along the coast south of the city are known to the patriciate as discreet anchorages where ships of inconvenient registry might rest, refit, and dispose of cargo. The city's harbour-master maintains a list of such places, which she has been known to share with selected captains for what one might generously call a consultation fee.`,
        gate: {
          flags: ['background:criminal', 'background:sailor', 'background:spy', 'skill:investigation'],
          label: 'Maritime or criminal knowledge',
          hint: 'Sailors, smugglers, and investigators know what the harbour-master does not record.',
        },
      },
      {
        id: 'imperial-relations',
        heading: 'The Empire and the Civil War',
        content: `The empire has never seriously moved on Bellatara. The combined economic damage of a campaign — disrupted trade, devastated merchant networks, exiled patricians taking their wealth elsewhere — would cost more than any reasonable governor could justify, and the patriciate has historically been adept at funding sympathetic factions at court.

The civil war has been *very* good for Bellatara. The city has done business, openly or quietly, with all three claimants. Lord Halkir in particular owes a significant debt to Bellataran merchant houses, which his enemies enjoy mentioning. Chalexis's court has consoled itself with the observation that Bellatara also funds Iaryx; the patriciate finds this observation amusing, because they also fund Chalexis. Whoever wins the war will inherit a great deal of Bellataran paper.`,
        gate: {
          flags: ['background:noble', 'background:scholar', 'skill:history', 'skill:insight'],
          label: 'Political knowledge',
          hint: 'Those familiar with imperial politics know who really pays for the war.',
        },
      },
    ],
    relatedLinks: [
      { label: 'Pelath', to: '/cities/pelath' },
      { label: 'Lord Halkir (faction)', to: '/factions/halkir' },
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
    tagline: 'A small inland settlement in northern Chilix — Iaryx-aligned by province, otherwise unremarked.',
    sections: [
      {
        id: 'overview',
        content: `Morikiv is a small village of roughly four thousand souls in the northern reaches of Chilix province, west of Kleover. The town is administratively part of Iaryx's domain by virtue of Chilix's faction allegiance, but in practice it sits far enough from the war's front lines to be left mostly to its own affairs.

Further lore for this settlement is yet to be written.`,
      },
    ],
    relatedLinks: [
      { label: 'Kleover', to: '/cities/kleover' },
      { label: 'General Iaryx (faction)', to: '/factions/iaryx' },
    ],
  },
];
