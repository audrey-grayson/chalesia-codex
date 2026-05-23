import { motion } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CITIES } from '../data/cities';
import type { CityData } from '../types';
import { parseMapFile, type ParsedMapData } from '../utils/mapParser';

const FACTION_COLORS: Record<string, string> = {
  chalexis: '#9090b0',
  iaryx: '#7ab5a0',
  halkir: '#c9a84c',
  neutral: '#8a7a6a',
  free: '#7a6a9a',
  foreign: '#6a7a5a',
};

const FACTION_LABELS: Record<string, string> = {
  chalexis: 'Chalexis',
  iaryx: 'Iaryx',
  halkir: 'Halkir',
  neutral: 'Neutral',
  free: 'Free Cities',
  foreign: 'Foreign',
};

const FALLBACK_W = 1536;
const FALLBACK_H = 751;

function mapStateNameToFaction(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('hanacene') || n.includes('chalexis') || n.includes('empire')) return 'chalexis';
  if (n.includes('iaryx')) return 'iaryx';
  if (n.includes('halkir') || n.includes('pelath') || n.includes('imikiv')) return 'halkir';
  if (n.includes('free') || n.includes('bellatara') || n.includes('atros')) return 'free';
  if (n.includes('skeinland') || n.includes('legia') || n.includes('lania') || n.includes('inmoth')) return 'foreign';
  return 'neutral';
}

const SESSION_KEY = 'chalesia-map-data';

export function MapPage() {
  const [mapData, setMapData] = useState<ParsedMapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<CityData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try { setMapData(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseMapFile(file);
      setMapData(parsed);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
    } catch (e) {
      setError(`Could not parse map file: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleMouseMove = useCallback((city: CityData, e: React.MouseEvent) => {
    setTooltip(city);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const unload = () => {
    setMapData(null);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const popRadius = (pop: number) => {
    if (pop >= 80000) return 7;
    if (pop >= 40000) return 5.5;
    if (pop >= 20000) return 4;
    return 3;
  };

  const w = mapData?.width ?? FALLBACK_W;
  const h = mapData?.height ?? FALLBACK_H;
  const activeCities = CITIES.filter(c => c.mapX && c.mapY);

  const stateColors: Record<number, string> = {};
  if (mapData) {
    for (const s of mapData.states) {
      const faction = mapStateNameToFaction(s.name);
      stateColors[s.i] = FACTION_COLORS[faction] ?? '#8a7a6a';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 px-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-3xl text-codex-parchment mb-1">The Hanacene Empire</h1>
          <p className="text-codex-parchmentDim text-sm">
            Click a city to view its lore page. Colour indicates faction allegiance.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {mapData ? (
            <button
              onClick={unload}
              className="text-xs font-display px-3 py-1.5 border border-codex-border rounded text-codex-parchmentDim hover:border-red-600 hover:text-red-400 transition-colors"
            >
              ✕ Unload Map
            </button>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="text-xs font-display px-3 py-1.5 border border-codex-gold rounded text-codex-gold hover:bg-codex-gold hover:text-codex-void transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading…' : '↑ Load .map File'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".map,.json"
                className="hidden"
                onChange={handleInputChange}
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4 font-display">{error}</p>
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
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full"
          onMouseLeave={() => setTooltip(null)}
        >
          {mapData ? (
            <>
              {/* Ocean base */}
              <rect width={w} height={h} fill="#0d1a2a" />

              {/* Political cell polygons */}
              {mapData.cellPolygons.map((cell, i) => {
                if (cell.isOcean || cell.stateId === 0) {
                  return <polygon key={i} points={cell.points} fill="#0d1a2a" stroke="#0d1a2a" strokeWidth={0.3} />;
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

              {/* State border outlines — drawn as thicker edges between different states */}
              {/* City markers from lore data */}
              {activeCities.map(city => <CityMarker key={city.id} city={city} r={popRadius(city.population)} onHover={handleMouseMove} onLeave={() => setTooltip(null)} />)}
            </>
          ) : (
            <>
              {/* Placeholder: dark ocean + grid */}
              <rect width={w} height={h} fill="#0d1a2a" />
              {Array.from({ length: 8 }, (_, i) => (
                <line key={`h${i}`} x1={0} y1={(i + 1) * (h / 9)} x2={w} y2={(i + 1) * (h / 9)} stroke="#1a2535" strokeWidth={0.5} />
              ))}
              {Array.from({ length: 16 }, (_, i) => (
                <line key={`v${i}`} x1={(i + 1) * (w / 17)} y1={0} x2={(i + 1) * (w / 17)} y2={h} stroke="#1a2535" strokeWidth={0.5} />
              ))}
              {activeCities.map(city => <CityMarker key={city.id} city={city} r={popRadius(city.population)} onHover={handleMouseMove} onLeave={() => setTooltip(null)} />)}

              {/* Upload prompt overlay */}
              <foreignObject x={w / 2 - 180} y={h / 2 - 48} width={360} height={96}>
                <div className="bg-codex-dark/80 border border-codex-border rounded-lg p-4 text-center backdrop-blur pointer-events-none">
                  <p className="font-display text-codex-gold text-sm mb-1">Map Not Loaded</p>
                  <p className="text-codex-parchmentDim text-xs leading-relaxed">
                    Export your .map file from Azgaar and click <span className="text-codex-gold">↑ Load .map File</span> above to see political regions and terrain.
                  </p>
                </div>
              </foreignObject>
            </>
          )}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 bg-codex-dark border border-codex-border rounded-lg p-3 shadow-xl pointer-events-none text-sm"
            style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 56, maxWidth: 220 }}
          >
            <div className="font-display text-codex-parchment">{tooltip.name}</div>
            <div className="text-codex-parchmentDim text-xs mt-0.5">
              Pop. {tooltip.population.toLocaleString()} · {tooltip.province}
            </div>
            <div className="text-xs mt-1 capitalize" style={{ color: FACTION_COLORS[tooltip.faction] }}>
              {FACTION_LABELS[tooltip.faction] ?? tooltip.faction} faction
            </div>
            <div className="text-codex-parchmentDim/60 text-xs mt-1.5">Click to view lore →</div>
          </div>
        )}
      </div>

      {!mapData && (
        <p className="text-codex-parchmentDim/60 text-xs mt-3 text-center">
          In Azgaar: <span className="text-codex-parchmentDim">Tools → Save Map</span> → upload the .map file here. City positions shown above are approximate.
        </p>
      )}
    </motion.div>
  );
}

interface CityMarkerProps {
  city: CityData;
  r: number;
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
        {/* Glow ring */}
        <circle cx={city.mapX} cy={city.mapY} r={r + 5} fill="none" stroke={color} strokeWidth={0.8} opacity={0.2} />
        {/* Capital = diamond, regular = circle */}
        {city.isCapital ? (
          <polygon
            points={`${city.mapX},${city.mapY - r * 1.4} ${city.mapX + r * 1.1},${city.mapY} ${city.mapX},${city.mapY + r * 1.4} ${city.mapX - r * 1.1},${city.mapY}`}
            fill={color}
          />
        ) : (
          <circle cx={city.mapX} cy={city.mapY} r={r} fill={color} />
        )}
        {/* Label */}
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
