import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CITIES } from '../data/cities';
import type { CityData } from '../types';
import { loadMapData, type ParsedMapData } from '../utils/mapParser';

const FACTION_COLORS: Record<string, string> = {
  chalexis: '#9090b0',
  iaryx:    '#7ab5a0',
  halkir:   '#c9a84c',
  neutral:  '#8a7a6a',
  free:     '#7a6a9a',
  foreign:  '#6a7a5a',
};

const FACTION_LABELS: Record<string, string> = {
  chalexis: 'Chalexis',
  iaryx:    'Iaryx',
  halkir:   'Halkir',
  neutral:  'Neutral',
  free:     'Free Cities',
  foreign:  'Foreign',
};

function mapStateNameToFaction(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('hanacene') || n.includes('chalexis') || n.includes('empire')) return 'chalexis';
  if (n.includes('iaryx'))                                                        return 'iaryx';
  if (n.includes('halkir') || n.includes('pelath') || n.includes('imikiv'))      return 'halkir';
  if (n.includes('free') || n.includes('bellatara') || n.includes('atros'))      return 'free';
  if (n.includes('skeinland') || n.includes('legia') || n.includes('lania') || n.includes('inmoth')) return 'foreign';
  return 'neutral';
}

export function MapPage() {
  const [mapData,    setMapData]    = useState<ParsedMapData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [tooltip,    setTooltip]    = useState<CityData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadMapData()
      .then(setMapData)
      .catch(e => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const handleMouseMove = useCallback((city: CityData, e: React.MouseEvent) => {
    setTooltip(city);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const popRadius = (pop: number) => {
    if (pop >= 80000) return 7;
    if (pop >= 40000) return 5.5;
    if (pop >= 20000) return 4;
    return 3;
  };

  const w = mapData?.width  ?? 1536;
  const h = mapData?.height ?? 751;

  const stateColors: Record<number, string> = {};
  if (mapData) {
    for (const s of mapData.states) {
      stateColors[s.i] = FACTION_COLORS[mapStateNameToFaction(s.name)] ?? '#8a7a6a';
    }
  }

  const activeCities = CITIES.filter(c => c.mapX && c.mapY);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 px-4">
      <div className="mb-4">
        <h1 className="font-display text-3xl text-codex-parchment mb-1">The Hanacene Empire</h1>
        <p className="text-codex-parchmentDim text-sm">
          Click a city to view its lore page. Colour indicates faction allegiance.
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4 font-display">Map data failed to load: {error}</p>
      )}

      <div className="flex gap-4 mb-4 flex-wrap text-xs font-display">
        {Object.entries(FACTION_LABELS).map(([f, label]) => (
          <span key={f} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: FACTION_COLORS[f] }} />
            <span className="text-codex-parchmentDim">{label}</span>
          </span>
        ))}
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg border border-codex-border"
        style={{ aspectRatio: `${w}/${h}` }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1a2a] z-10">
            <span className="font-display text-codex-parchmentDim text-sm animate-pulse">Loading map…</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Ocean base */}
          <rect width={w} height={h} fill="#0d1a2a" />

          {mapData && (
            <>
              {/* Political cell polygons */}
              {mapData.cellPolygons.map((cell, i) => {
                if (cell.isOcean || cell.stateId === 0) {
                  return (
                    <polygon
                      key={i}
                      points={cell.points}
                      fill="#0d1a2a"
                      stroke="#0d1a2a"
                      strokeWidth={0.3}
                    />
                  );
                }
                const baseColor = stateColors[cell.stateId] ?? '#8a7a6a';
                return (
                  <polygon
                    key={i}
                    points={cell.points}
                    fill={baseColor + '55'}
                    stroke={baseColor + '88'}
                    strokeWidth={0.3}
                  />
                );
              })}

              {/* Rivers */}
              {mapData.rivers.map((r, i) => (
                <path
                  key={i}
                  d={r.d}
                  fill="none"
                  stroke="#3a6a9a"
                  strokeWidth={Math.max(0.5, r.width * 0.6)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.6}
                />
              ))}
            </>
          )}

          {/* City markers — always shown */}
          {activeCities.map(city => (
            <CityMarker
              key={city.id}
              city={city}
              r={popRadius(city.population)}
              onHover={handleMouseMove}
              onLeave={() => setTooltip(null)}
            />
          ))}
        </svg>

        {/* Hover tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 bg-codex-dark border border-codex-border rounded-lg p-3 shadow-xl pointer-events-none text-sm"
            style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 56, maxWidth: 220 }}
          >
            <div className="font-display text-codex-parchment">{tooltip.name}</div>
            <div className="text-codex-parchmentDim text-xs mt-0.5">
              Pop. {tooltip.population.toLocaleString()} · {tooltip.province}
            </div>
            <div
              className="text-xs mt-1 capitalize"
              style={{ color: FACTION_COLORS[tooltip.faction] }}
            >
              {FACTION_LABELS[tooltip.faction] ?? tooltip.faction} faction
            </div>
            <div className="text-codex-parchmentDim/60 text-xs mt-1.5">Click to view lore →</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── City marker component ────────────────────────────────────────────────────

interface CityMarkerProps {
  city:    CityData;
  r:       number;
  onHover: (city: CityData, e: React.MouseEvent) => void;
  onLeave: () => void;
}

function CityMarker({ city, r, onHover, onLeave }: CityMarkerProps) {
  const color = FACTION_COLORS[city.faction] ?? '#888';
  return (
    <Link to={`/cities/${city.id}?from=map`}>
      <g
        onMouseMove={e => onHover(city, e)}
        onMouseLeave={onLeave}
        className="cursor-pointer"
      >
        <circle cx={city.mapX} cy={city.mapY} r={r + 5} fill="none" stroke={color} strokeWidth={0.8} opacity={0.2} />
        {city.isCapital ? (
          <polygon
            points={`${city.mapX},${city.mapY - r * 1.4} ${city.mapX + r * 1.1},${city.mapY} ${city.mapX},${city.mapY + r * 1.4} ${city.mapX - r * 1.1},${city.mapY}`}
            fill={color}
          />
        ) : (
          <circle cx={city.mapX} cy={city.mapY} r={r} fill={color} />
        )}
        <text
          x={city.mapX + r + 5}
          y={city.mapY + 4}
          fill={color}
          fontSize={city.population >= 40000 ? 11 : 9}
          fontFamily="Cinzel, serif"
          opacity={0.95}
        >
          {city.name}
        </text>
      </g>
    </Link>
  );
}
