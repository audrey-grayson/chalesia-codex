export interface ParsedMapData {
  width: number;
  height: number;
  cellPolygons: CellPolygon[];
  rivers: RiverPath[];
  burgs: MapBurg[];
  states: MapState[];
}

export interface CellPolygon {
  points: string;
  stateId: number;
  biome: number;
  isOcean: boolean;
}

export interface RiverPath {
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

export async function parseMapFile(file: File): Promise<ParsedMapData> {
  const buffer = await file.arrayBuffer();
  let text: string;

  const isGzip = new Uint8Array(buffer, 0, 2)[0] === 0x1f && new Uint8Array(buffer, 0, 2)[1] === 0x8b;
  if (isGzip) {
    const ds = new DecompressionStream('gzip');
    const writer = ds.writable.getWriter();
    writer.write(buffer);
    writer.close();
    const chunks: Uint8Array[] = [];
    const reader = ds.readable.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) { merged.set(c, offset); offset += c.length; }
    text = new TextDecoder().decode(merged);
  } else {
    text = new TextDecoder().decode(buffer);
  }

  const data = JSON.parse(text);
  return extractMapData(data);
}

function extractMapData(data: Record<string, unknown>): ParsedMapData {
  const info = (data.info ?? data.settings ?? {}) as Record<string, unknown>;
  const width = (info.width as number) ?? 1536;
  const height = (info.height as number) ?? 751;

  const pack = data.pack as Record<string, unknown>;
  const cells = pack.cells as Record<string, unknown[]>;
  const vertices = pack.vertices as Record<string, unknown[]>;
  const stateArr = pack.states as Record<string, unknown>[];
  const burgsArr = pack.burgs as Record<string, unknown>[];

  const cellV = cells.v as number[][];
  const cellState = (cells.state ?? cells.s) as number[];
  const cellBiome = cells.biome as number[];
  const vertexP = vertices.p as [number, number][];

  const oceanBiomes = new Set([0]);

  const cellPolygons: CellPolygon[] = [];
  for (let i = 0; i < cellV.length; i++) {
    const verts = cellV[i];
    if (!verts || verts.length < 3) continue;
    const pts = verts.map(vi => {
      const p = vertexP[vi];
      return `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
    }).join(' ');
    const stateId = cellState[i] ?? 0;
    const biome = cellBiome[i] ?? 0;
    cellPolygons.push({ points: pts, stateId, biome, isOcean: stateId === 0 && oceanBiomes.has(biome) });
  }

  const states: MapState[] = (stateArr ?? []).map((s, i) => ({
    i,
    name: (s.name as string) ?? '',
    color: (s.color as string) ?? '#888',
  }));

  const mapBurgs: MapBurg[] = (burgsArr ?? [])
    .filter((b): b is Record<string, unknown> => !!b && typeof b === 'object' && !(b as Record<string, unknown>).removed)
    .map(b => ({
      i: b.i as number,
      name: b.name as string,
      x: b.x as number,
      y: b.y as number,
      state: b.state as number,
      population: (b.population as number) ?? 0,
      capital: (b.capital as number) ?? 0,
    }));

  const packRivers = (pack.rivers as Record<string, unknown>[]) ?? [];
  const rivers: RiverPath[] = [];
  for (const r of packRivers) {
    const rCells = r.cells as number[];
    if (!rCells || rCells.length < 2) continue;
    const points = rCells.map(ci => {
      const verts = cellV[ci];
      if (!verts || verts.length === 0) return null;
      const xs = verts.map(vi => vertexP[vi][0]);
      const ys = verts.map(vi => vertexP[vi][1]);
      const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
      const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
      return `${cx.toFixed(1)},${cy.toFixed(1)}`;
    }).filter(Boolean);
    if (points.length < 2) continue;
    rivers.push({ d: `M ${points.join(' L ')}`, width: (r.widthFactor as number) ?? 1 });
  }

  return { width, height, cellPolygons, rivers, burgs: mapBurgs, states };
}
