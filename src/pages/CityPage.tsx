import { useParams, useSearchParams } from 'react-router-dom';
import { CITIES } from '../data/cities';
import { LorePage } from '../components/LorePage';
import type { ContentFlag } from '../types';

interface Props { flags: Set<ContentFlag> }

const FACTION_COLORS: Record<string, string> = {
  chalexis: '#9090b0', iaryx: '#7ab5a0', halkir: '#c9a84c', neutral: '#8a7a6a',
};
const FACTION_LABELS: Record<string, string> = {
  chalexis: 'Chalexis Faction', iaryx: 'Iaryx Faction', halkir: 'Halkir Faction', neutral: 'Neutral',
};

export function CityPage({ flags }: Props) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const fromMap = searchParams.get('from') === 'map';

  const city = CITIES.find(c => c.id === id);
  if (!city) return <div className="py-20 text-center text-codex-parchmentDim font-display">City not found.</div>;

  return (
    <LorePage
      title={city.name + (city.isCapital ? ' ★' : '')}
      tagline={city.tagline}
      badge={{ label: FACTION_LABELS[city.faction] ?? city.faction, color: FACTION_COLORS[city.faction] ?? '#888' }}
      backTo={fromMap ? '/map' : undefined}
      backLabel="← Back to Map"
      sections={city.sections}
      relatedLinks={city.relatedLinks}
      flags={flags}
    />
  );
}
