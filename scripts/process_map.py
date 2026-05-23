#!/usr/bin/env python3
"""
process_map.py — Convert an Azgaar Fantasy Map Generator .map export into the
ParsedMapData JSON consumed by the Chalesian Codex web app.

Approach: rather than reconstructing the pack/Voronoi geometry from grid seed
points (which would require porting Azgaar's reGraph algorithm and its coastal
interpolation), we extract Azgaar's own pre-rendered SVG paths from section 5
of the .map file. These paths are exact, computed by the source application,
and tiny enough to ship as static data.

Layers extracted:
  - featurePaths       → 15 land outlines (islands + continent)
  - provincesBody      → 50 province polygons, each `id="provinceN"`
  - rivers             → river paths with Bézier curves
  - borders.*          → state + province border strokes

Sections cross-referenced:
  S0  header (width / height)
  S5  SVG (extracted here)
  S12 features JSON (which feature ids are land)
  S14 states JSON
  S15 burgs JSON
  S30 provinces JSON (province → state mapping)
  S32 rivers JSON (widthFactor per river index)

Output schema (matches src/utils/mapParser.ts ParsedMapData):
  {
    width, height,
    landPaths:     [{ d }],
    provincePaths: [{ i, state, d }],
    rivers:        [{ d, width }],
    borderPaths:   [{ d, kind }],
    states:        [{ i, name, color }],
    burgs:         [{ i, name, x, y, state, population, capital }]
  }

Usage:
  python scripts/process_map.py                          # default paths
  python scripts/process_map.py --src foo.map --out out.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

# ── Defaults ─────────────────────────────────────────────────────────────────

DEFAULT_SRC = Path(__file__).parent.parent / "Chalesia 2026-04-19-12-33.map"
DEFAULT_OUT = Path(__file__).parent.parent / "public" / "chalesia-map.json"


# ── .map section parsing ──────────────────────────────────────────────────────

def split_sections(raw: bytes) -> list[bytes]:
    """Azgaar .map files use CRLF as section separator (40 sections in v1.114)."""
    sections = raw.split(b"\r\n")
    if len(sections) < 33:
        raise ValueError(
            f"Expected ≥33 sections (CRLF-separated); got {len(sections)}. "
            "Is this a valid Azgaar .map file?"
        )
    return sections


# ── SVG <g id="…"> extraction ─────────────────────────────────────────────────

_GROUP_OPEN_RE = re.compile(r'<g\s+id="([^"]+)"[^>]*>')


def extract_group(svg: str, gid: str) -> str | None:
    """Return the substring "<g id='gid' …>…</g>" with proper nesting, or None."""
    m = re.search(r'<g\s+id="' + re.escape(gid) + r'"[^>]*>', svg)
    if not m:
        return None
    start = m.start()
    depth = 0
    i = m.end()
    while i < len(svg):
        # Opening <g ...> (not <g/> self-close, not a different tag starting with g)
        if svg.startswith("<g", i) and (i + 2 < len(svg) and not svg[i + 2].isalnum()):
            depth += 1
            i += 2
            continue
        if svg.startswith("</g>", i):
            if depth == 0:
                return svg[start : i + 4]
            depth -= 1
            i += 4
            continue
        i += 1
    return None


def extract_paths(group_svg: str) -> list[dict]:
    """Pull all <path …/> elements; return a list of attribute dicts (d, id, fill, …)."""
    paths = []
    for m in re.finditer(r'<path\b([^/>]*)/?>', group_svg):
        attrs_str = m.group(1)
        attrs = dict(re.findall(r'(\w[\w-]*)="([^"]*)"', attrs_str))
        if "d" in attrs and attrs["d"]:
            paths.append(attrs)
    return paths


# ── Extraction per layer ──────────────────────────────────────────────────────

def extract_land_paths(svg: str, features: list) -> list[dict]:
    """Land outlines from featurePaths, filtered to features marked land=True."""
    grp = extract_group(svg, "featurePaths")
    if not grp:
        return []
    raw_paths = extract_paths(grp)

    # featurePaths has one <path id="feature_N" /> per feature. Filter to land only.
    land_feature_ids = {f["i"] for f in features if isinstance(f, dict) and f.get("land")}
    result = []
    for p in raw_paths:
        pid = p.get("id", "")
        m = re.match(r"feature_(\d+)$", pid)
        if not m:
            continue
        if int(m.group(1)) in land_feature_ids:
            result.append({"d": p["d"]})
    return result


def extract_province_paths(svg: str, provinces: list) -> list[dict]:
    """Province body paths, joined with province-> state mapping."""
    grp = extract_group(svg, "provincesBody")
    if not grp:
        return []

    # Build i → state lookup from provinces JSON
    prov_state = {}
    for prov in provinces:
        if isinstance(prov, dict) and prov.get("i") is not None:
            prov_state[prov["i"]] = prov.get("state", 0)

    raw_paths = extract_paths(grp)
    result = []
    for p in raw_paths:
        pid = p.get("id", "")
        # The body path is id="provinceN"; the "gap" stroke is id="province-gapN" — skip gaps
        m = re.match(r"province(\d+)$", pid)
        if not m:
            continue
        i = int(m.group(1))
        result.append({
            "i":     i,
            "state": prov_state.get(i, 0),
            "d":     p["d"],
        })
    return result


def extract_river_paths(svg: str, rivers_json: list) -> list[dict]:
    """River paths from SVG; width factor sourced from rivers JSON."""
    grp = extract_group(svg, "rivers")
    if not grp:
        return []

    widths_by_id = {}
    for r in rivers_json:
        if isinstance(r, dict) and r.get("i") is not None:
            widths_by_id[r["i"]] = float(r.get("widthFactor") or 1.0)

    raw_paths = extract_paths(grp)
    result = []
    for p in raw_paths:
        pid = p.get("id", "")
        m = re.match(r"river(\d+)$", pid)
        rid = int(m.group(1)) if m else None
        result.append({
            "d":     p["d"],
            "width": widths_by_id.get(rid, 1.0),
        })
    return result


def extract_border_paths(svg: str) -> list[dict]:
    """State + province border paths (each a single path element)."""
    out = []
    for kind, gid in [("state", "stateBorders"), ("province", "provinceBorders")]:
        grp = extract_group(svg, gid)
        if not grp:
            continue
        for p in extract_paths(grp):
            d = p.get("d", "")
            if d.strip():
                out.append({"d": d, "kind": kind})
    return out


# ── Main assembly ─────────────────────────────────────────────────────────────

def build_parsed_map(sections: list[bytes]) -> dict:
    h          = sections[0].split(b"|")
    width      = int(h[4])
    height     = int(h[5])

    svg        = sections[5].decode("utf-8")
    features   = json.loads(sections[12])
    states_raw = json.loads(sections[14])
    burgs_raw  = json.loads(sections[15])
    provinces  = json.loads(sections[30])
    rivers_raw = json.loads(sections[32])

    print("  Extracting layers from SVG (section 5)…", flush=True)
    land_paths     = extract_land_paths(svg, features)
    province_paths = extract_province_paths(svg, provinces)
    river_paths    = extract_river_paths(svg, rivers_raw)
    border_paths   = extract_border_paths(svg)

    print(f"    land features: {len(land_paths)}")
    print(f"    provinces    : {len(province_paths)}")
    print(f"    rivers       : {len(river_paths)}")
    print(f"    borders      : {len(border_paths)}")

    states = [
        {
            "i":     s.get("i", i),
            "name":  s.get("name", ""),
            "color": s.get("color", "#888888"),
        }
        for i, s in enumerate(states_raw)
        if isinstance(s, dict)
    ]

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
        for b in burgs_raw
        if b and isinstance(b, dict) and b.get("i") and not b.get("removed")
    ]

    return {
        "width":         width,
        "height":        height,
        "landPaths":     land_paths,
        "provincePaths": province_paths,
        "rivers":        river_paths,
        "borderPaths":   border_paths,
        "states":        states,
        "burgs":         burgs,
    }


# ── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--src", type=Path, default=DEFAULT_SRC,
                        help="Path to .map file")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT,
                        help="Output JSON path")
    args = parser.parse_args()

    if not args.src.exists():
        sys.exit(f"Error: map file not found: {args.src}")

    print(f"Source : {args.src}")
    print(f"Output : {args.out}")
    print("Parsing .map sections…")

    sections = split_sections(args.src.read_bytes())
    result   = build_parsed_map(sections)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(
        json.dumps(result, separators=(",", ":"), ensure_ascii=False),
        encoding="utf-8",
    )

    size_kb = args.out.stat().st_size / 1024
    print(f"\nDone — wrote {args.out}  ({size_kb:.0f} KB)")
    print(f"  width / height : {result['width']} x {result['height']}")
    print(f"  land paths     : {len(result['landPaths'])}")
    print(f"  province paths : {len(result['provincePaths'])}")
    print(f"  rivers         : {len(result['rivers'])}")
    print(f"  borders        : {len(result['borderPaths'])}")
    print(f"  states         : {len(result['states'])}")
    print(f"  burgs          : {len(result['burgs'])}")


if __name__ == "__main__":
    main()
