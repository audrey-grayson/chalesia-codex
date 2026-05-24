/**
 * mapParser.ts
 *
 * Types and loader for the pre-processed Azgaar map data.
 *
 * The raw .map file is converted to this format by scripts/process_map.py,
 * which extracts the pre-rendered SVG layers (provincesBody, featurePaths,
 * rivers, borders) directly out of the file rather than reconstructing the
 * Voronoi tessellation. This is exact, much simpler, and an order of
 * magnitude smaller than per-cell polygon data.
 *
 * Output lives at /public/chalesia-map.json (served as a static asset).
 * To regenerate after a new Azgaar export:
 *   python scripts/process_map.py --src "New Export.map" --out public/chalesia-map.json
 */

export interface ParsedMapData {
  width: number;
  height: number;
  /** Coastline outlines for each land feature (continents + islands). */
  landPaths: PathRef[];
  /** State-coloured province polygons. */
  provincePaths: ProvincePath[];
  /** River strokes. */
  rivers: RiverPath[];
  /** Optional state/province border strokes. */
  borderPaths: BorderPath[];
  /** State metadata (id, name, original Azgaar colour). */
  states: MapState[];
  /** Burg data — currently informational; the visual markers come from src/data/cities.ts. */
  burgs: MapBurg[];
}

export interface PathRef {
  d: string;
}

export interface ProvincePath {
  /** Province id (1-based, matches provinces JSON). */
  i: number;
  /** State id this province belongs to. */
  state: number;
  /** Province name in the source map (may differ slightly from lore naming). */
  name: string;
  /** Burg id of the province seat — 0 if the province has no urban center. */
  burg: number;
  d: string;
}

export interface RiverPath {
  d: string;
  /** Width factor from Azgaar; multiply by a stroke base when rendering. */
  width: number;
}

export interface BorderPath {
  d: string;
  /** "state" or "province" — borders may render differently. */
  kind: string;
}

export interface MapState {
  i: number;
  name: string;
  color: string;
}

export interface MapBurg {
  i: number;
  name: string;
  x: number;
  y: number;
  state: number;
  population: number;
  capital: number;
}

const MAP_DATA_URL = `${import.meta.env.BASE_URL}chalesia-map.json`;

let cached: ParsedMapData | null = null;

/** Fetch the pre-processed map JSON. Cached per session. */
export async function loadMapData(): Promise<ParsedMapData> {
  if (cached) return cached;
  const res = await fetch(MAP_DATA_URL);
  if (!res.ok) throw new Error(`Failed to load map data: ${res.status} ${res.statusText}`);
  cached = (await res.json()) as ParsedMapData;
  return cached;
}
