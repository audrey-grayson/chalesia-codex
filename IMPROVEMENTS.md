# Chalesian Codex — Improvements Plan

## 1. Map: Full Voronoi rendering from .map file

**Problem:** The intermediate JSON files extracted by chalesia-map do *not* contain cell geometry
(`pack.cells.v` vertex indices or `pack.vertices.p` coordinate pairs). The map currently shows
only city markers on a dark ocean with grid lines — no land masses, no political regions.

**Cause:** The Python parser in chalesia-map extracted per-cell attribute arrays (state, biome,
culture…) but dropped the geometric arrays. The full vertex data lives only in the original
Azgaar `.map` export file.

**Fix:**
- Add a "Load Map" button that accepts a user's exported `.map` file (plain JSON or gzip).
- Parse the file in the browser: decompress if gzip, extract `pack.vertices.p` (vertex [x,y]
  pairs), `pack.cells.v` (per-cell vertex-ID arrays), `pack.cells.state` (state per cell), and
  `pack.states` (state colour/name).
- Render SVG `<polygon>` elements: one per cell, coloured by faction (mapped from state name).
- Persist the loaded file in sessionStorage so the map survives navigation without re-uploading.
- Overlay city markers and labels from `cities.ts` (same positions as before, scaled to the
  SVG viewBox from the map header width/height).
- Rivers: optional overlay from `pack.rivers` using cell-centre line segments.
- After upload the "Load Map" prompt becomes a "×  Unload" control.

**Files changed:** `src/pages/MapPage.tsx`, new `src/hooks/useMapData.ts`, new
`src/utils/mapParser.ts`.

---

## 2. Map → City back button

**Problem:** Clicking a city on the map navigates to `/cities/:id` with no way back to the map
without using browser back (which players may not think of).

**Fix:**
- Pass `?from=map` query param from city SVG links in `MapPage.tsx`.
- In `CityPage.tsx` (and `FactionPage.tsx`), read the `from` param via `useSearchParams`.
  If present, render a `← Back to Map` button using `useNavigate(-1)` (preserving scroll and
  state) above the page title.
- For generic navigation (e.g. from the cities list) the button is hidden.

**Files changed:** `src/pages/MapPage.tsx`, `src/pages/CityPage.tsx`,
`src/components/LorePage.tsx`.

---

## 3. Home-page invisible hint text

**Problem:** The "Use the ⚔ Character button…" footer text uses `text-codex-parchmentDim/40`
(40% opacity on already-dim text), making it nearly invisible on the dark background.

**Audit:** grep for `/[0-9]+` Tailwind opacity modifiers on text-codex-parchmentDim and similar
classes across the project — fix any that fall below ~60% legibility.

**Fix:** Raise the hint line to `text-codex-parchmentDim/70` and add a very subtle glow border
or icon so it reads as intentionally muted rather than broken.

**Files changed:** `src/pages/Home.tsx`, audit `src/components/CharacterSpec.tsx`,
`src/components/ContentGate.tsx`.

---

## 4. House arms thumbnails

**Problem:** Noble-house cards on the Factions page use small coloured circles and the `⚔` emoji
as placeholders. Actual PNG crest files exist at
`C:\Users\jmand\Sync\Chalesia worldbuilding\Arms\`.

**Fix:**
- Copy relevant PNGs to `public/arms/` with normalised names matching faction IDs.
- Add an optional `crestImage?: string` field to `FactionData` in `src/types/index.ts`.
- Populate the field for houses that have art: aldaine, karindel, solentis, iventhyr, tremaine,
  chalexis (Imperial crest for the faction card), pelath (for Halkir).
- In `FactionsPage.tsx` — noble-house cards: replace the `<span>` colour dot with a 40×40
  `<img>` thumbnail rendered in a rounded frame; fallback to the colour dot if no image.
- In `FactionsPage.tsx` — claimant cards: replace the emoji with the crest image where available.
- The crest also appears in `FactionPage.tsx` detail view (right-floated, larger).

**Files changed:** `src/types/index.ts`, `src/data/factions.ts`, `src/pages/FactionsPage.tsx`,
`src/pages/FactionPage.tsx`.

---

## 5. Pantheon: remove "Other Powers" section

**Problem:** "Other Powers" (Strithos and Tiamat) is present but the user wants to plan its
gating carefully before publishing it.

**Fix:**
- Remove the second `<section>` block from `GodsPage.tsx` entirely.
- Update the intro paragraph to remove the clause "The Old Gods sleep beneath the present age."
- The god data itself stays in `gods.ts` (so it's easy to restore); the page simply filters
  to `pantheon === 'hanacene'` only.

**Files changed:** `src/pages/GodsPage.tsx`.

---

## Implementation order

1. Quick wins first (30–60 min): items 3, 4 (text), 5 (pantheon)
2. Back button (15 min): item 2
3. Crest images (30 min): item 4 (images)
4. Map rendering (2–3 h): item 1 — most complex, touches a new utility module
