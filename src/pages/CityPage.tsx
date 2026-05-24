import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CITIES } from '../data/cities';
import { FACTIONS } from '../data/factions';
import { LorePage } from '../components/LorePage';
import { NotFoundPage } from './NotFoundPage';
import type { ContentFlag } from '../types';

interface Props { flags: Set<ContentFlag> }

const FACTION_COLORS: Record<string, string> = {
  chalexis: '#9090b0', iaryx: '#7ab5a0', halkir: '#c9a84c', neutral: '#8a7a6a',
};
const FACTION_LABELS: Record<string, string> = {
  chalexis: 'Chalexis Faction', iaryx: 'Iaryx Faction', halkir: 'Halkir Faction', neutral: 'Neutral',
};

/**
 * Resolve a city's `rulers` field (faction ids) into full faction records,
 * preserving declaration order. Silently skips ids that don't match a known
 * faction — flag these in code review rather than letting them throw at
 * runtime. Returns an empty array if `rulers` is undefined or empty.
 */
function resolveRulers(rulers: string[] | undefined) {
  if (!rulers || rulers.length === 0) return [];
  return rulers
    .map(id => FACTIONS.find(f => f.id === id))
    .filter((f): f is typeof FACTIONS[number] => f !== undefined);
}

export function CityPage({ flags }: Props) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const fromMap = searchParams.get('from') === 'map';

  const city = CITIES.find(c => c.id === id);
  if (!city) return <NotFoundPage />;

  const rulers = resolveRulers(city.rulers);

  // Only render the headerAside box when the city has explicitly recorded
  // rulers. Cities governed by councils (Bellatara), small frontier towns,
  // and unassigned settlements omit the panel entirely.
  const rulersPanel = rulers.length > 0 ? (
    <div className="w-56 border border-codex-border rounded-lg bg-codex-surface/60 p-3">
      <div className="font-display text-xs text-codex-parchmentDim uppercase tracking-widest mb-2">
        Ruled by
      </div>
      <ul className="space-y-1.5">
        {rulers.map(faction => (
          <li key={faction.id}>
            <Link
              to={`/factions/${faction.id}`}
              className="flex items-center gap-2 text-sm text-codex-parchment hover:text-codex-gold transition-colors group"
            >
              {faction.crestImage && (
                <img
                  src={faction.crestImage}
                  alt=""
                  className="w-7 h-7 object-contain flex-shrink-0 drop-shadow-sm"
                />
              )}
              <span className="leading-tight group-hover:underline">{faction.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  ) : undefined;

  return (
    <LorePage
      title={city.name + (city.isCapital ? ' ★' : '')}
      tagline={city.tagline}
      badge={{ label: FACTION_LABELS[city.faction] ?? city.faction, color: FACTION_COLORS[city.faction] ?? '#888' }}
      backTo={fromMap ? '/map' : '/cities'}
      backLabel={fromMap ? 'Back to Map' : 'Back to Cities'}
      sections={city.sections}
      relatedLinks={city.relatedLinks}
      headerAside={rulersPanel}
      flags={flags}
    />
  );
}
