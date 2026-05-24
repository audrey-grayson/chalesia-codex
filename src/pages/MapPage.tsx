import { motion } from 'framer-motion';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CITIES } from '../data/cities';
import type { CityData } from '../types';
import { loadMapData, type ParsedMapData } from '../utils/mapParser';
import { usePanZoom } from '../hooks/usePanZoom';

/* ── Faction colour palette ─────────────────────────────────────────────── */

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
  neutral:  'Wildlands',
  free:     'Free Cities',
  foreign:  'Foreign Powers',
};

/* The map's "states" are large polities (Hanacene Empire, Skeinland, Legia…).
 * The Hanacene civil-war factions are subdivisions inside the Empire — they
 * aren't separate states on the map. We tint the whole Empire one colour and
 * use city markers (already tagged by faction in cities.ts) to convey faction
 * detail at the city level. */
function stateToFaction(stateName: string): string {
  const n = stateName.toLowerCase();
  if (n.includes('hanacene') || n.includes('empire')) return 'chalexis';   // imperial
  if (n.includes('skeinland') || n.includes('legia') || n.includes('lania') ||
      n.includes('inmoth')    || n.includes('atho')   || n.includes('intilea') ||
      n.includes('acenia')    || n.includes('avonia') || n.includes('sandfair') ||
      n.includes('abergoria') || n.includes('galta')  || n.includes('gravadalia')) {
    return 'foreign';
  }
  if (n.includes('atros')) return 'free';
  if (n === 'neutrals') return 'neutral';
  return 'neutral';
}

/* ── Component ──────────────────────────────────────────────────────────── */

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

  const handleHover = useCallback((city: CityData, e: React.MouseEvent) => {
    setTooltip(city);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  /* Map state-id → faction colour, computed once per map load. */
  const stateFactionColor = useMemo(() => {
    const m: Record<number, string> = {};
    if (mapData) {
      for (const s of mapData.states) {
        m[s.i] = FACTION_COLORS[stateToFaction(s.name)] ?? FACTION_COLORS.neutral;
      }
    }
    return m;
  }, [mapData]);

  const popRadius = (pop: number) =>
    pop >= 80000 ? 7
    : pop >= 40000 ? 5.5
    : pop >= 20000 ? 4
    : 3;

  const w = mapData?.width  ?? 1536;
  const h = mapData?.height ?? 751;

  /* Resolve city → map position by name lookup against the .map burgs.
   * The hardcoded mapX/mapY in cities.ts are a fallback for when no burg
   * matches (or before the map JSON loads). This keeps the map authoritative
   * for positioning while cities.ts stays authoritative for narrative data. */
  const burgsByName = useMemo(() => {
    const m: Record<string, { x: number; y: number }> = {};
    if (mapData) {
      for (const b of mapData.burgs) {
        m[b.name.toLowerCase()] = { x: b.x, y: b.y };
      }
    }
    return m;
  }, [mapData]);

  const activeCities = CITIES
    .map(c => {
      const matched = burgsByName[c.name.toLowerCase()];
      return matched
        ? { ...c, mapX: matched.x, mapY: matched.y }
        : c;
    })
    .filter(c => c.mapX && c.mapY);

  /* Pan + zoom — drives the SVG viewBox. Zoom level also scales markers
   * inversely so they stay roughly the same on-screen size as you zoom in. */
  const { viewBoxStr, zoom, reset, zoomBy, containerProps } = usePanZoom({
    width: w,
    height: h,
    minZoom: 1,
    maxZoom: 12,
  });
  // Inverse-scale factor — passed to markers so they stay constant on-screen size as zoom changes.
  const inv = 1 / zoom;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 px-4">
      <div className="mb-4">
        <h1 className="font-display text-3xl text-codex-parchment mb-1">The Hanacene Empire</h1>
        <p className="text-codex-parchmentDim text-sm">
          Scroll to zoom, drag to pan. Click a city to view its lore. Colour indicates faction allegiance.
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
        {...containerProps}
        className="relative w-full overflow-hidden rounded-lg border border-codex-border"
        style={{ ...containerProps.style, aspectRatio: `${w}/${h}` }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0d1a2a] z-10">
            <span className="font-display text-codex-parchmentDim text-sm animate-pulse">Loading map…</span>
          </div>
        )}

        {/* Zoom controls — sit above the SVG and consume their own pointer events */}
        {!loading && (
          <div
            className="absolute top-3 right-3 z-20 flex flex-col gap-1.5"
            onPointerDown={e => e.stopPropagation()}
            onWheel={e => e.stopPropagation()}
          >
            <ZoomButton onClick={() => zoomBy(1.5)} label="Zoom in"   glyph="+" />
            <ZoomButton onClick={() => zoomBy(1 / 1.5)} label="Zoom out" glyph="−" />
            <ZoomButton onClick={reset} label="Reset view" glyph="⤾" />
            <div className="mt-1 px-1.5 py-0.5 rounded bg-codex-dark/85 border border-codex-border text-[10px] font-display text-codex-parchmentDim text-center">
              {zoom.toFixed(1)}×
            </div>
          </div>
        )}

        <svg
          viewBox={viewBoxStr}
          className="w-full h-full block"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* 1. Ocean fill */}
          <rect x={0} y={0} width={w} height={h} fill="#0d1a2a" />

          {mapData && (
            <>
              {/* 2. Land mass base colour (the wildlands / unclaimed land underneath) */}
              <g fill="#3a3528" stroke="#5a4f38" strokeWidth={0.6} fillRule="evenodd">
                {mapData.landPaths.map((p, i) => (
                  <path key={i} d={p.d} />
                ))}
              </g>

              {/* 3. State-coloured province polygons (only claimed regions) */}
              <g>
                {mapData.provincePaths.map((p, i) => {
                  const color = stateFactionColor[p.state] ?? FACTION_COLORS.neutral;
                  return (
                    <path
                      key={i}
                      d={p.d}
                      fill={color}
                      fillOpacity={0.55}
                      stroke={color}
                      strokeOpacity={0.75}
                      strokeWidth={0.4}
                    />
                  );
                })}
              </g>

              {/* 4. Borders */}
              <g fill="none" stroke="#1a1a14" strokeWidth={0.8} strokeOpacity={0.7}>
                {mapData.borderPaths.map((p, i) => (
                  <path key={i} d={p.d} />
                ))}
              </g>

              {/* 5. Rivers */}
              <g fill="none" stroke="#3a6a9a" strokeLinecap="round" strokeLinejoin="round" opacity={0.7}>
                {mapData.rivers.map((r, i) => (
                  <path key={i} d={r.d} strokeWidth={Math.max(0.4, r.width * 0.5)} />
                ))}
              </g>
            </>
          )}

          {/* 6. City markers (lore-driven, always rendered).
             * Inverse-scaled so they stay constant on-screen size at any zoom. */}
          {activeCities.map(city => (
            <CityMarker
              key={city.id}
              city={city}
              r={popRadius(city.population) * inv}
              labelSize={(city.population >= 40000 ? 11 : 9) * inv}
              strokeBase={inv}
              onHover={handleHover}
              onLeave={() => setTooltip(null)}
            />
          ))}
        </svg>

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
    </motion.div>
  );
}

/* ── Zoom button ───────────────────────────────────────────────────────── */

interface ZoomButtonProps { onClick: () => void; label: string; glyph: string }
function ZoomButton({ onClick, label, glyph }: ZoomButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-8 h-8 flex items-center justify-center rounded bg-codex-dark/85 border border-codex-border text-codex-parchment hover:border-codex-gold hover:text-codex-gold transition-colors font-display text-base leading-none"
    >
      {glyph}
    </button>
  );
}

/* ── City marker ────────────────────────────────────────────────────────── */

interface CityMarkerProps {
  city:       CityData;
  r:          number;
  labelSize:  number;
  strokeBase: number;
  onHover:    (city: CityData, e: React.MouseEvent) => void;
  onLeave:    () => void;
}

function CityMarker({ city, r, labelSize, strokeBase, onHover, onLeave }: CityMarkerProps) {
  const color = FACTION_COLORS[city.faction] ?? '#888';
  // Suppress click navigation if the user was actually dragging (panning).
  // We detect this by tracking pointerdown position vs pointerup position.
  return (
    <Link
      to={`/cities/${city.id}?from=map`}
      onPointerDown={e => { (e.currentTarget as unknown as { _downAt?: { x: number; y: number } })._downAt = { x: e.clientX, y: e.clientY }; }}
      onClick={e => {
        const tgt = e.currentTarget as unknown as { _downAt?: { x: number; y: number } };
        const d = tgt._downAt;
        if (d && (Math.abs(e.clientX - d.x) > 4 || Math.abs(e.clientY - d.y) > 4)) {
          e.preventDefault();   // it was a pan, not a click
        }
      }}
    >
      <g
        onMouseMove={e => onHover(city, e)}
        onMouseLeave={onLeave}
        className="cursor-pointer"
      >
        <circle cx={city.mapX} cy={city.mapY} r={r + 5 * strokeBase} fill="none" stroke={color} strokeWidth={0.8 * strokeBase} opacity={0.2} />
        {city.isCapital ? (
          <polygon
            points={`${city.mapX},${city.mapY - r * 1.4} ${city.mapX + r * 1.1},${city.mapY} ${city.mapX},${city.mapY + r * 1.4} ${city.mapX - r * 1.1},${city.mapY}`}
            fill={color}
            stroke="#0a0d14"
            strokeWidth={0.4 * strokeBase}
          />
        ) : (
          <circle cx={city.mapX} cy={city.mapY} r={r} fill={color} stroke="#0a0d14" strokeWidth={0.4 * strokeBase} />
        )}
        <text
          x={city.mapX + r + 5 * strokeBase}
          y={city.mapY + 4 * strokeBase}
          fill={color}
          fontSize={labelSize}
          fontFamily="Cinzel, serif"
          opacity={0.95}
          style={{ paintOrder: 'stroke', stroke: '#0a0d14', strokeWidth: 2 * strokeBase }}
        >
          {city.name}
        </text>
      </g>
    </Link>
  );
}
