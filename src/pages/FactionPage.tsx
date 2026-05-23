import { useParams } from 'react-router-dom';
import { FACTIONS } from '../data/factions';
import { LorePage } from '../components/LorePage';
import type { ContentFlag } from '../types';

interface Props { flags: Set<ContentFlag> }

const TYPE_LABELS: Record<string, string> = {
  'civil-war-faction': 'Civil War Faction',
  'noble-house': 'Noble House',
  'organization': 'Organization',
  'polity': 'Polity',
};

export function FactionPage({ flags }: Props) {
  const { id } = useParams<{ id: string }>();
  const faction = FACTIONS.find(f => f.id === id);
  if (!faction) return <div className="py-20 text-center text-codex-parchmentDim font-display">Entry not found.</div>;

  return (
    <LorePage
      title={faction.name}
      tagline={faction.tagline}
      badge={{ label: TYPE_LABELS[faction.type] ?? faction.type, color: faction.color }}
      headerCrest={faction.crestImage}
      backTo="/factions"
      backLabel="Back to Factions"
      sections={faction.sections}
      relatedLinks={faction.relatedLinks}
      flags={flags}
    />
  );
}
