import type { FactionData } from '../types';

export const FACTIONS: FactionData[] = [
  {
    id: 'chalexis',
    name: 'Princess Chalexis',
    type: 'civil-war-faction',
    allegiance: 'chalexis',
    color: '#c0c0c0',
    crestImage: '/chalesia-codex/arms/Imperial-chalexis-crest.png',
    tagline: 'The Silver Empress — legitimate heir, silver-dragon sorceress, ruler of Hanach.',
    sections: [
      {
        id: 'overview',
        content: `Princess Chalexis is the only surviving child of the last Emperor and holds the clearest claim to the throne under imperial succession law. She controls Hanach — the capital — and the eastern provinces, supported by the dragon-blooded noble houses (Aldaine, Tremaine) and the urban patriciate who depend on imperial trade.

Her political weakness is her perceived distance from common soldiers and provincials. Born to power, she has ruled from a position of magical and institutional strength, and this reads as arrogance to those who have lost the most in the civil war.`,
      },
      {
        id: 'military',
        heading: 'Military Assets',
        content: `Chalexis commands the largest Skyknight force — approximately 120 wyvern-riders — and the First and Second Legions (somewhat degraded). House Aldaine's sorcerers are a force multiplier without parallel; a single capable dragon-blood can turn a field engagement. Her weakness is infantry numbers; the eastern provinces are less populous than the west.`,
        gate: {
          flags: ['background:soldier', 'background:skyknight', 'skill:history'],
          label: 'Military knowledge',
        },
      },
      {
        id: 'character',
        heading: 'The Person Behind the Title',
        content: `Those who have met Chalexis in person describe a woman of remarkable composure — not cold, exactly, but precise. She listens more than she speaks. She has not yet taken consorts or named a succession, which her advisors find alarming; she seems to view the civil war as a problem to be solved before dynastics become relevant. Her silver-dragon lineage manifests in her eyes — vertical pupils in certain lighting — and occasionally in her presence, which can feel physically heavy, like pressure before a storm.`,
        gate: {
          flags: ['background:noble', 'background:spy', 'faction:chalexis'],
          label: 'Court knowledge',
          hint: 'Those with noble connections or factional access know her personally.',
        },
      },
    ],
    relatedLinks: [
      { label: 'Hanach (capital)', to: '/cities/hanach' },
      { label: 'House Karindel', to: '/factions/karindel' },
      { label: 'House Aldaine', to: '/factions/aldaine' },
    ],
  },
  {
    id: 'iaryx',
    name: 'General Iaryx',
    type: 'civil-war-faction',
    allegiance: 'iaryx',
    color: '#7ab5a0',
    tagline: 'The Iron General — commoner-born military commander rallying the west.',
    sections: [
      {
        id: 'overview',
        content: `General Iaryx has no royal blood and makes no apology for it. A career soldier who rose through merit — rare in an empire that traditionally reserves senior command for the nobility — he declared for "reform" sixteen years ago, couching a bid for power in the language of institutional grievance. His message has found a receptive audience among veterans, minor provincial lords resentful of the capital's favoritism, and anyone who has suffered for the dynasty's mistakes.`,
      },
      {
        id: 'power-base',
        heading: 'Power Base',
        content: `The western provinces — Enester (Zorlatra), Chilix (Kleover), and Irdagar — are Iaryx's heartland. He has more foot soldiers than either rival, better supply discipline, and a genuine meritocratic officer corps. His weakness is the sky: he has fewer than forty Skyknights, none from dragon-blooded houses, and this limits his options against magical opponents.`,
      },
    ],
    relatedLinks: [
      { label: 'Zorlatra', to: '/cities/zorlatra' },
      { label: 'House Iventhyr', to: '/factions/iventhyr' },
    ],
  },
  {
    id: 'halkir',
    name: 'Lord Halkir',
    type: 'civil-war-faction',
    allegiance: 'halkir',
    color: '#c9a84c',
    crestImage: '/chalesia-codex/arms/halkir.png',
    tagline: "The Merchant Lord — trader-king of Pelath, claiming descent from the First Empire's founder.",
    sections: [
      {
        id: 'overview',
        content: `Lord Halkir presents himself as the restoration candidate — a return to the values of Seneca, the First Empire's founder, from whom he claims unbroken descent. His faction is the smallest militarily, but the richest. He has cultivated the Free Cities of the eastern straits and used their merchant networks to fund mercenaries, buy intelligence, and quietly build goodwill in cities that Chalexis and Iaryx have been taxing to exhaustion.`,
      },
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
    tagline: "Lords of Thyalix and Chancellors of the Empire — the Chalexis faction's political backbone.",
    sections: [
      {
        id: 'overview',
        content: `House Karindel has served as Imperial Chancellor for two generations, administering Thyalix province and managing the day-to-day business of empire while the royal family concerns itself with higher strategy. They are pragmatic bureaucrats more than warriors — their power is in networks, records, and appointments rather than swords. When Chalexis declared her claim, the Karindels were among the first to commit, understanding that their institutional position was inseparable from imperial legitimacy.`,
      },
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
    tagline: 'The Silver Sorcerers — dragon-blooded lords of Aurem, allied to the imperial line for two centuries.',
    sections: [
      {
        id: 'overview',
        content: `House Aldaine derives its unusual power from a silver dragon ancestor several generations back — one of the last great metallics to forge a lasting bond with a mortal line. The bloodline has bred true: every generation produces at least one capable sorcerer, and in the current generation the gifts are reportedly strong. This makes Aldaine members worth more on a battlefield than a company of knights.

Their alliance with the imperial line predates the current civil war by two centuries. They have backed Chalexis without hesitation.`,
      },
      {
        id: 'banner-men',
        heading: 'Bannermen & Alliances',
        content: `House Aldaine commands several lesser houses in Aurem and the adjacent province of Ilthyrion (House Mordell). Their marriage alliance with House Tremaine — who carry red-dragon blood — is recent and somewhat uneasy. The two families share a mutual enemy (House Solentis, to the north) and mutual interest in the Chalexis victory, but their political styles are very different.`,
        gate: {
          flags: ['background:noble', 'skill:history'],
          label: 'Noble lineage knowledge',
        },
      },
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
    tagline: "Lords of Y'lanthitar — rivals to House Aldaine and guardians of the eastern approaches.",
    sections: [
      {
        id: 'overview',
        content: `House Solentis has ruled Y'lanthitar from Eorvar for five generations. They are formally Chalexis-aligned — not from love of the princess, but from calculation: a Chalexis victory preserves the imperial institutions that protect their trade interests. Their long rivalry with House Aldaine (competing for influence in the eastern provinces) means they are useful to the princess as a counterweight, even if she would prefer they be more enthusiastic.`,
      },
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
    tagline: 'Barons of Enester — controllers of Zorlatra, first grand lords to back General Iaryx.',
    sections: [
      {
        id: 'overview',
        content: `The Iventhyrs have long resented holding a barony over Zorlatra — the empire's second city — while lesser populations to the north hold earldoms. When General Iaryx offered a new order, Baron Iventhyr saw an opportunity for both ideological alignment and practical advancement. His foundries and veterans have made Enester the industrial heart of the Iaryx campaign.`,
      },
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
    tagline: 'The Red Sorcerers — dragon-blooded allies of House Aldaine, carriers of chromatic fire.',
    sections: [
      {
        id: 'overview',
        content: `House Tremaine carries red-dragon blood — an unusual and somewhat disquieting distinction in a civilization where red dragons are regarded as predators and adversaries. The family has maintained respectability through consistent imperial service and a marriage alliance with House Aldaine. Their magic runs hotter and more aggressive than Aldaine silver-blood, which creates friction but also battlefield complementarity.`,
      },
      {
        id: 'chromatic-stigma',
        heading: 'The Chromatic Stigma',
        content: `Red-dragon blood is associated with Tiamat, the Dragon Queen of the Old Gods — a destructive primordial force. This association is uncomfortable for a house seeking imperial legitimacy. The Tremaines manage it through public Calitax devotion (the lawful dragon-goddess, antithesis of Tiamat) and by being very careful about which of their bloodline's abilities they display in public. The heat-affinity and fire-resistance are acceptable; the rage is not.`,
        gate: {
          flags: ['skill:arcana', 'skill:history', 'skill:religion'],
          label: 'Arcane or religious scholarship',
        },
      },
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
    tagline: 'Lords of Ilthyrion — bannermen of House Aldaine in the eastern provinces.',
    sections: [
      {
        id: 'overview',
        content: `House Mordell holds Ilthyrion province as vassals of House Aldaine. They are a reliable but unspectacular house — their value is consistency and loyalty rather than independent power. The current lord is an Aldaine ally of long standing and has committed to the Chalexis faction without reservation.`,
      },
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
    tagline: 'Lords of Salixvale — a minor house holding a quiet earldom in the south.',
    sections: [
      {
        id: 'overview',
        content: `House Caldier governs Salixvale, one of the smaller southern provinces. They have avoided committing to any faction, a pragmatic but increasingly precarious position as the civil war demands loyalty from everyone. Their seat at Vendris is prosperous enough to matter but not prominent enough to attract unwanted attention — so far.`,
      },
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
    tagline: 'Lords of Vinat — a contested march family caught between advancing armies.',
    sections: [
      {
        id: 'overview',
        content: `House Sentaire holds Vinat County, one of the most actively contested regions of the civil war. The province carries the "wartime" designation in imperial records alongside three settlements, meaning the lord is either a hero of the resistance or a collaborator — depending entirely on which army you ask. The Sentaires have reportedly changed their stated allegiance twice already.`,
      },
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
    tagline: 'Lords of Karathex Province — a wartime Chalexis ally in the eastern interior.',
    sections: [
      {
        id: 'overview',
        content: `House Karathex governs the province that shares their name, a mid-sized eastern territory. They declared for Chalexis early in the war, apparently as a matter of conviction rather than calculation — the current lord has a reputation for blunt loyalty that has not always served him well politically. Their province has not yet seen direct military action, though this may change.`,
      },
    ],
    relatedLinks: [
      { label: 'Princess Chalexis', to: '/factions/chalexis' },
    ],
  },
];
