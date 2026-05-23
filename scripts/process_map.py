#!/usr/bin/env python3
"""
process_map.py — Convert an Azgaar Fantasy Map Generator .map export into the
ParsedMapData JSON format expected by the Chalesian Codex web app.

The .map file is a 40-section custom text format using \\r\\n as the section
separator. Sections that contain embedded \\n (notably the SVG, S5) are fine
because we never split on bare \\n.

Section index reference (v1.114.x):
  S0  header pipe-delimited (version|desc|date|seed|width|height|id)
  S5  SVG (discarded)
  S6  gridGeneral JSON  — has "points": [[x,y], ...] (Voronoi seed positions)
  S14 states JSON
  S15 burgs JSON        — first entry is always {}
  S16 pack.cells.biome  (comma-separated ints, indexed by cell id)
  S25 pack.cells.state  (comma-separated ints)
  S32 rivers JSON

Output schema (TypeScript interface in src/utils/mapParser.ts):
  {
    width:        number
    height:       number
    cellPolygons: { points: string; stateId: number; biome: number; isOcean: boolean }[]
    rivers:       { d: string; width: number }[]
    burgs:        { i: number; name: string; x: number; y: number;
                    state: number; population: number; capital: number }[]
    states:       { i: number; name: string; color: string }[]
  }

Usage:
  python scripts/process_map.py                            # default paths
  python scripts/process_map.py --src path/to/file.map \\
                                --out public/chalesia-map.json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from scipy.spatial import Voronoi
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union

# ── Defaults ─────────────────────────────────────────────────────────────────

DEFAULT_SRC = Path(__file__).parent.parent / "Chalesia 2026-04-19-12-33.map"
DEFAULT_OUT = Path(__file__).parent.parent / "public" / "chalesia-map.json"

# ── Parsing ───────────────────────────────────────────────────────────────────

def split_ints(s: bytes) -> list[int]:
    if not s:
        return []
    return [int(x) for x in s.split(b",")]


def parse_map(path: Path) -> dict:
    """Parse a .map file into a dict of the sections we need."""
    raw = path.read_bytes()
    sections = raw.split(b"\r\n")
    if len(sections) < 33:
        raise ValueError(
            f"Expected ≥33 sections (CRLF-separated), got {len(sections)}. "
            "Is this a valid Azgaar .map file?"
        )

    # S0 header
    h = sections[0].split(b"|")
    width  = int(h[4])
    height = int(h[5])

    # S6 gridGeneral — Voronoi seed positions
    grid = json.loads(sections[6])
    points = np.array(grid["points"], dtype=np.float64)           # shape (N, 2)
    boundary_pts = np.array(grid["boundary"], dtype=np.float64)   # map boundary polygon

    # S14 states
    states_raw = json.loads(sections[14])

    # S15 burgs (index 0 is always a placeholder {})
    burgs_raw = json.loads(sections[15])

    # S16 per-cell biome
    cell_biome = split_ints(sections[16])

    # S25 per-cell state  (section index confirmed from chalesia-map parse.py)
    cell_state = split_ints(sections[25])

    # S32 rivers
    rivers_raw = json.loads(sections[32])

    return {
        "width":        width,
        "height":       height,
        "points":       points,
        "boundary":     boundary_pts,
        "cell_biome":   cell_biome,
        "cell_state":   cell_state,
        "states_raw":   states_raw,
        "burgs_raw":    burgs_raw,
        "rivers_raw":   rivers_raw,
    }


# ── Voronoi + polygon clipping ────────────────────────────────────────────────

def build_clipped_polygons(
    points: np.ndarray,
    boundary: np.ndarray,
    cell_state: list[int],
    cell_biome:  list[int],
) -> list[dict]:
    """
    Compute Voronoi tessellation from seed points, clip each region to the map
    boundary, and return a list of CellPolygon dicts.

    Cells that lie outside the boundary or have degenerate geometry are omitted.
    """
    w  = boundary[:, 0].max()
    h  = boundary[:, 1].max()

    # Add mirror / far-field sentinel points so every real cell is bounded.
    margin = max(w, h) * 1.5
    sentinels = np.array([
        [-margin, -margin], [w / 2, -margin], [w + margin, -margin],
        [-margin, h / 2],                     [w + margin, h / 2],
        [-margin, h + margin], [w / 2, h + margin], [w + margin, h + margin],
    ])
    all_points = np.vstack([points, sentinels])
    n_real = len(points)

    vor = Voronoi(all_points)

    # Build a Shapely polygon for the map boundary (for clipping).
    # buffer(0) repairs any self-intersections the boundary path may have.
    clip_poly = Polygon(boundary).buffer(0)
    if not clip_poly.is_valid:
        # Last resort: use a tight bounding box instead
        clip_poly = Polygon([(0, 0), (w, 0), (w, h), (0, h)])

    cell_polygons: list[dict] = []

    for cell_idx in range(n_real):
        region_idx = vor.point_region[cell_idx]
        region     = vor.regions[region_idx]

        # -1 in region means an infinite vertex — skip (only sentinels should have these)
        if not region or -1 in region:
            continue

        verts = vor.vertices[region]
        if len(verts) < 3:
            continue

        poly = Polygon(verts)
        if not poly.is_valid:
            poly = poly.buffer(0)  # attempt repair

        try:
            clipped = poly.intersection(clip_poly)
        except Exception:
            # Degenerate cell — skip
            continue
        if clipped is None or clipped.is_empty:
            continue

        # Collapse MultiPolygon to largest constituent (edge artefacts)
        if isinstance(clipped, MultiPolygon):
            clipped = max(clipped.geoms, key=lambda g: g.area)

        coords = list(clipped.exterior.coords)
        if len(coords) < 3:
            continue

        points_str = " ".join(f"{x:.1f},{y:.1f}" for x, y in coords[:-1])  # drop closing duplicate

        state_id = cell_state[cell_idx] if cell_idx < len(cell_state) else 0
        biome    = cell_biome[cell_idx]  if cell_idx < len(cell_biome)  else 0

        cell_polygons.append({
            "points":  points_str,
            "stateId": state_id,
            "biome":   biome,
            "isOcean": state_id == 0,
        })

    return cell_polygons


# ── River paths ───────────────────────────────────────────────────────────────

def build_river_paths(rivers_raw: list[dict], points: np.ndarray) -> list[dict]:
    """Convert river cell-index lists to SVG path strings using cell centroids."""
    river_paths = []
    for r in rivers_raw:
        cells = r.get("cells") or r.get("path") or []
        if len(cells) < 2:
            continue
        coords = []
        for ci in cells:
            if ci < len(points):
                x, y = points[ci]
                coords.append(f"{x:.1f},{y:.1f}")
        if len(coords) < 2:
            continue
        d = "M " + " L ".join(coords)
        width_factor = float(r.get("widthFactor") or r.get("width") or 1)
        river_paths.append({"d": d, "width": width_factor})
    return river_paths


# ── Main output assembly ──────────────────────────────────────────────────────

def build_parsed_map(data: dict) -> dict:
    print("  Computing Voronoi tessellation…", flush=True)
    cell_polygons = build_clipped_polygons(
        data["points"],
        data["boundary"],
        data["cell_state"],
        data["cell_biome"],
    )
    print(f"    done: {len(cell_polygons):,} polygons", flush=True)

    print("  Building river paths…", flush=True)
    rivers = build_river_paths(data["rivers_raw"], data["points"])
    print(f"    done: {len(rivers)} rivers", flush=True)

    # States: filter out index-0 placeholder ("Neutrals") but keep it for id mapping
    states = [
        {
            "i":     s.get("i", i),
            "name":  s.get("name", ""),
            "color": s.get("color", "#888888"),
        }
        for i, s in enumerate(data["states_raw"])
    ]

    # Burgs: skip placeholder (index 0) and removed burgs
    burgs = [
        {
            "i":          b["i"],
            "name":       b["name"],
            "x":          b["x"],
            "y":          b["y"],
            "state":      b.get("state", 0),
            "population": b.get("population", 0),
            "capital":    b.get("capital", 0),
        }
        for b in data["burgs_raw"]
        if b and b.get("i") and not b.get("removed")
    ]

    return {
        "width":        data["width"],
        "height":       data["height"],
        "cellPolygons": cell_polygons,
        "rivers":       rivers,
        "burgs":        burgs,
        "states":       states,
    }


# ── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--src", type=Path, default=DEFAULT_SRC,
        help=f"Path to .map file (default: {DEFAULT_SRC.name})",
    )
    parser.add_argument(
        "--out", type=Path, default=DEFAULT_OUT,
        help=f"Output JSON path (default: {DEFAULT_OUT})",
    )
    args = parser.parse_args()

    if not args.src.exists():
        sys.exit(f"Error: map file not found: {args.src}")

    print(f"Source : {args.src}")
    print(f"Output : {args.out}")

    print("Parsing .map sections…")
    data = parse_map(args.src)
    print(f"  {data['width']}×{data['height']}  "
          f"{len(data['points']):,} cells  "
          f"{len(data['states_raw'])-1} states  "
          f"{len([b for b in data['burgs_raw'] if b and not b.get('removed')])} burgs  "
          f"{len(data['rivers_raw'])} rivers")

    print("Building ParsedMapData…")
    result = build_parsed_map(data)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    out_str = json.dumps(result, separators=(",", ":"), ensure_ascii=False)
    args.out.write_text(out_str, encoding="utf-8")

    size_kb = args.out.stat().st_size / 1024
    print(f"\nDone — wrote {args.out}  ({size_kb:.0f} KB)")
    print(f"  {len(result['cellPolygons']):,} cell polygons")
    print(f"  {len(result['rivers'])} river paths")
    print(f"  {len(result['burgs'])} burgs")
    print(f"  {len(result['states'])} states")


if __name__ == "__main__":
    main()
