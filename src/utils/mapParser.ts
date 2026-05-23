/**
 * mapParser.ts
 *
 * Types and loader for the pre-processed Azgaar map data.
 *
 * The raw .map file is converted to this format by scripts/process_map.py.
 * The output lives at public/chalesia-map.json and is served as a static asset.
 *
 * To regenerate after a new Azgaar export:
 *   python scripts/process_map.py --src "New Export.map" --out public/chalesia-map.json
 */

export interface ParsedMapData {
  width: number;
  height: number;
  cellPolygons: CellPolygon[];
  rivers: RiverPath[];
  burgs: MapBurg[];
  states: MapState[];
}

export interface CellPolygon {
  /** Space-separated "x,y" pairs — SVG polygon points attribute value */
  points: string;
  stateId: number;
  biome: number;
  isOcean: boolean;
}

export interface RiverPath {
  /** SVG path d attribute value, e.g. "M x,y L x,y …" */
  d: string;
  width: number;
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

export interface MapState {
  i: number;
  name: string;
  color: string;
}

const MAP_DATA_URL = `${import.meta.env.BASE_URL}chalesia-map.json`;

let cached: ParsedMapData | null = null;

/** Load the pre-processed map JSON. Result is cached for the session. */
export async function loadMapData(): Promise<ParsedMapData> {
  if (cached) return cached;
  const res = await fetch(MAP_DATA_URL);
  if (!res.ok) throw new Error(`Failed to load map data: ${res.status} ${res.statusText}`);
  cached = (await res.json()) as ParsedMapData;
  return cached;
}
