#!/usr/bin/env python3
"""
process_arms.py — Strip coa.to watermark footer and produce transparent-background
thumbnail PNGs from the Chalesia worldbuilding arms.

Source images (500×647 RGBA, from coa.to):
  - Already have a transparent background around the shield
  - Append a solid opaque-white footer starting at row 603 containing the
    tool URL watermark ("https://coa.to/...")

Pipeline per image:
  1. Crop footer: remove rows 603–646 (footer_row is auto-detected, falls back to 603)
  2. Auto-crop: trim transparent margins to the content bounding box
  3. Square pad: place on a square transparent canvas with a small margin
  4. Thumbnail: resize to OUTPUT_SIZE, preserving aspect ratio
  5. Save as PNG with alpha

Usage:
  python scripts/process_arms.py                    # uses default paths
  python scripts/process_arms.py --src PATH --out PATH [--size 256] [--margin 0.05]
"""

import argparse
import sys
from pathlib import Path

import numpy as np
from PIL import Image


# ── Defaults ──────────────────────────────────────────────────────────────────

DEFAULT_SRC = Path(__file__).parent.parent.parent / "Chalesia worldbuilding" / "Arms"
DEFAULT_OUT = Path(__file__).parent.parent / "public" / "arms"
FOOTER_ROW_FALLBACK = 603   # hard-coded safe crop point (consistent across all coa.to exports)
OUTPUT_SIZE = 256            # px, square
MARGIN_FRAC = 0.04           # fraction of square side added as padding around the crest


# ── Core processing ───────────────────────────────────────────────────────────

def find_footer_row(arr: np.ndarray) -> int:
    """
    Find the first row of the opaque-white footer appended by coa.to.
    Scans from the bottom upward for the last row containing any fully-transparent
    pixel (alpha == 0), then returns the next row index as the footer start.
    Falls back to FOOTER_ROW_FALLBACK if no transparent pixel is found.
    """
    h = arr.shape[0]
    for y in range(h - 1, -1, -1):
        if np.any(arr[y, :, 3] == 0):
            return y + 1
    return FOOTER_ROW_FALLBACK


def process_image(src: Path, dst: Path, size: int = OUTPUT_SIZE, margin: float = MARGIN_FRAC) -> None:
    img = Image.open(src).convert("RGBA")
    arr = np.array(img)

    # 1. Crop footer
    footer_row = find_footer_row(arr)
    img = img.crop((0, 0, img.width, footer_row))

    # 2. Auto-crop to content bounding box (non-transparent pixels only)
    bbox = img.getbbox()
    if bbox is None:
        print(f"  SKIP {src.name}: image is entirely transparent after footer crop", file=sys.stderr)
        return
    img = img.crop(bbox)

    # 3. Square pad with transparent margin
    cw, ch = img.size
    inner = max(cw, ch)
    pad = int(inner * margin)
    square = inner + 2 * pad
    canvas = Image.new("RGBA", (square, square), (0, 0, 0, 0))
    ox = (square - cw) // 2
    oy = (square - ch) // 2
    canvas.paste(img, (ox, oy), img)

    # 4. Resize to output size (high-quality downscale)
    canvas = canvas.resize((size, size), Image.LANCZOS)

    # 5. Save
    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dst, "PNG", optimize=True)


# ── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--src", type=Path, default=DEFAULT_SRC,
                        help="Source directory containing raw arm PNGs")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT,
                        help="Output directory for processed thumbnails")
    parser.add_argument("--size", type=int, default=OUTPUT_SIZE,
                        help=f"Output thumbnail side length in pixels (default: {OUTPUT_SIZE})")
    parser.add_argument("--margin", type=float, default=MARGIN_FRAC,
                        help=f"Padding fraction around crest (default: {MARGIN_FRAC})")
    parser.add_argument("--force", action="store_true",
                        help="Re-process even if output file already exists")
    args = parser.parse_args()

    src_dir: Path = args.src
    out_dir: Path = args.out

    if not src_dir.exists():
        sys.exit(f"Error: source directory not found: {src_dir}")

    pngs = sorted(src_dir.glob("*.png"))
    if not pngs:
        sys.exit(f"Error: no PNG files found in {src_dir}")

    print(f"Source : {src_dir}")
    print(f"Output : {out_dir}")
    print(f"Size   : {args.size}×{args.size}px  margin={args.margin:.0%}")
    print(f"Files  : {len(pngs)}")
    print()

    skipped = processed = errors = 0
    for src in pngs:
        dst = out_dir / src.name
        if dst.exists() and not args.force:
            print(f"  skip  {src.name}  (already exists — use --force to overwrite)")
            skipped += 1
            continue
        try:
            process_image(src, dst, size=args.size, margin=args.margin)
            print(f"  ok    {src.name}")
            processed += 1
        except Exception as exc:
            print(f"  ERROR {src.name}: {exc}", file=sys.stderr)
            errors += 1

    print()
    print(f"Done — {processed} processed, {skipped} skipped, {errors} errors")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
