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

/* ── Component ──────────────────────────────────────────────────────────── */

export function MapPage() {
  const [mapData,    setMapData]    = useState<ParsedMapData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [tooltip,    setTooltip]    = useState<CityData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [stateHover, setStateHover] = useState<{ name: string; x: number; y: number } | null>(null);

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

  /* Lookups indexed by state id, computed once per map load.
   * - `stateColor`:  the original Azgaar political-map colour (state.color)
   * - `stateName`:   for hover tooltips on region polygons */
  const { stateColor, stateName } = useMemo(() => {
    const color: Record<number, string> = {};
    const name:  Record<number, string> = {};
    if (mapData) {
      for (const s of mapData.states) {
        color[s.i] = s.color || '#888';
        name[s.i]  = s.name  || '';
      }
    }
    return { stateColor: color, stateName: name };
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
    const m: Record<string, { i: number; x: number; y: number }> = {};
    if (mapData) {
      for (const b of mapData.burgs) {
        m[b.name.toLowerCase()] = { i: b.i, x: b.x, y: b.y };
      }
    }
    return m;
  }, [mapData]);

  /* Tag each lore city with its full burg record (carries burg id + coords). */
  const enrichedCities = CITIES
    .map(c => {
      const matched = burgsByName[c.name.toLowerCase()];
      return matched
        ? { ...c, mapX: matched.x, mapY: matched.y, burgId: matched.i }
        : { ...c, burgId: 0 };
    })
    .filter(c => c.mapX && c.mapY);

  /* Province id → civil-war faction for Empire provinces.
   *
   * Two-pass match per lore city:
   *   1. burg-id match — only works when the city is recorded as the
   *      province seat in Azgaar (e.g. Hanach is the seat of Thylalix).
   *   2. province-name fallback — match city.province (lore string) to
   *      mapData.provincePaths[].name, case-insensitive, ignoring spaces.
   *      Catches cases where the seat city in lore isn't the one Azgaar
   *      tagged as the seat (e.g. Eorvar lives in Y'lanthitar but the
   *      Azgaar seat is Ciravaar).
   *
   * Names are normalised by stripping whitespace + punctuation so minor
   * variants ("Thyalix" vs "Thylalix") still match if close enough. */
  const provinceFaction = useMemo(() => {
    const m: Record<number, string> = {};
    if (!mapData) return m;
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

    // index map provinces by normalised name (with a few near-misses)
    const byName: Record<string, typeof mapData.provincePaths[number]> = {};
    for (const p of mapData.provincePaths) {
      if (p.name) byName[norm(p.name)] = p;
    }

    for (const city of enrichedCities) {
      // Pass 1: burg-id
      let prov = city.burgId
        ? mapData.provincePaths.find(p => p.burg === city.burgId)
        : undefined;

      // Pass 2: name fallback — try the lore province name; if no exact hit
      // try a few minor edits (drop doubled letters, add common variants).
      if (!prov && city.province) {
        const target = norm(city.province);
        prov = byName[target];
        if (!prov) {
          // Try near-matches (one-letter difference)
          for (const [k, v] of Object.entries(byName)) {
            if (Math.abs(k.length - target.length) <= 1 && (k.includes(target) || target.includes(k))) {
              prov = v;
              break;
            }
          }
        }
      }

      if (prov) m[prov.i] = city.faction;
    }
    return m;
  }, [mapData, enrichedCities]);

  /* Polities that actually have rendered provinces on the map. */
  const presentStates = useMemo(() => {
    if (!mapData) return [];
    const ids = new Set(mapData.provincePaths.map(p => p.state));
    return mapData.states.filter(
      s => ids.has(s.i) && s.name && s.name !== 'Neutrals'
    );
  }, [mapData]);

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
          Scroll to zoom, drag to pan. Regions are coloured by political polity; city markers by civil-war faction.
          Click a city to view its lore.
        </p>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4 font-display">Map data failed to load: {error}</p>
      )}

      <div className="space-y-1.5 mb-4">
        {/* Polities — original Azgaar state colours */}
        {mapData && (
          <div className="flex gap-x-3 gap-y-1 flex-wrap text-[11px] font-display">
            <span className="text-codex-parchmentDim/60 uppercase tracking-widest">Polities:</span>
            {presentStates.map(s => (
              <span key={s.i} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: s.color }} />
                <span className="text-codex-parchmentDim">{s.name}</span>
              </span>
            ))}
          </div>
        )}

        {/* Civil-war factions — city marker colours */}
        <div className="flex gap-x-3 gap-y-1 flex-wrap text-[11px] font-display">
          <span className="text-codex-parchmentDim/60 uppercase tracking-widest">Cities:</span>
          {Object.entries(FACTION_LABELS).map(([f, label]) => (
            <span key={f} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: FACTION_COLORS[f] }} />
              <span className="text-codex-parchmentDim">{label}</span>
            </span>
          ))}
        </div>
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

              {/* Diagonal-stripe patterns for civil-war factions. Each pattern
                 * lays the state colour over alternating bands of the faction's
                 * colour, so an Empire province visually reads as both
                 * "Hanacene blue" and "Iaryx green" (or whatever). */}
              <defs>
                {Object.entries(FACTION_COLORS).map(([fac, fColor]) => {
                  // Stripes only apply to civil-war factions inside the Empire.
                  // Skip neutral/free/foreign — they never overlay the Empire base.
                  if (!['chalexis','iaryx','halkir'].includes(fac)) return null;
                  return (
                    <pattern
                      key={fac}
                      id={`stripes-${fac}`}
                      patternUnits="userSpaceOnUse"
                      width={8}
                      height={8}
                      patternTransform="rotate(45)"
                    >
                      <rect width={8} height={8} fill="#8ea7e5" fillOpacity={0.55} />
                      <rect width={4} height={8} fill={fColor} fillOpacity={0.75} />
                    </pattern>
                  );
                })}
              </defs>

              {/* 3. Province polygons. Empire provinces with a known civil-war
                 *    allegiance get a striped fill (state colour + faction
                 *    colour); everything else gets a flat state colour. */}
              <g>
                {mapData.provincePaths.map((p, i) => {
                  const stateCol = stateColor[p.state] ?? '#888';
                  const sname    = stateName[p.state] ?? '';
                  const faction  = provinceFaction[p.i];
                  const striped  = !!faction;
                  return (
                    <path
                      key={i}
                      d={p.d}
                      fill={striped ? `url(#stripes-${faction})` : stateCol}
                      fillOpacity={striped ? 1 : 0.45}
                      stroke={stateCol}
                      strokeOpacity={0.85}
                      strokeWidth={0.4}
                      onMouseMove={e => sname && setStateHover({
                        name: faction ? `${sname} — ${FACTION_LABELS[faction]}` : sname,
                        x: e.clientX,
                        y: e.clientY,
                      })}
                      onMouseLeave={() => setStateHover(null)}
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
          {enrichedCities.map(city => (
            <CityMarker
              key={city.id}
              city={city}
              r={popRadius(city.population) * inv}
              labelSize={(city.population >= 40000 ? 18 : 15) * inv}
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

        {/* State / polity hover label — only when not hovering a city */}
        {stateHover && !tooltip && (
          <div
            className="fixed z-40 bg-codex-dark/90 border border-codex-border rounded px-2 py-1 shadow pointer-events-none font-display text-xs text-codex-parchment"
            style={{ left: stateHover.x + 12, top: stateHover.y + 12 }}
          >
            {stateHover.name}
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
