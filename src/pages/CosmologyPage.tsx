import { useState } from 'react';
import { motion } from 'framer-motion';
import { PLANES, COSMOLOGY_GATE, AFTERLIFE_NOTE } from '../data/cosmology';
import { hasAccess } from '../data/flags';
import { ContentGate } from '../components/ContentGate';
import type { ContentFlag } from '../types';

interface Props { flags: Set<ContentFlag> }

// ── SVG geometry (viewBox 600 × 500) ──────────────────────────────────────
// Hourglass-style "light cone" diagram. The Material/Aethereal sits at the
// pinch of the hourglass (vertical centre). Cones widen outward from the
// centre to wrap Faerie above and Shadowfell below, then narrow back down
// to single points at the Energy Planes.
const VIEW_W = 600;
const VIEW_H = 500;
const CENTER_X = 300;
const CENTER_Y = 250;
const POS_APEX_Y = 40;       // Positive Energy point
const NEG_APEX_Y = 460;      // Negative Energy point
const CONE_HALF_WIDTH = 150; // half-width of the cone at the Material level

// material/ethereal radii
const MAT_R = 20;
const ETH_R = 34;

// faerie / shadowfell offsets (positions inside their cones)
// (Faerie and Shadowfell are no longer cone-bounded ellipses — they are now
// orbital rings around the Material+Aether system, see OrbitalRing below.)

export function CosmologyPage({ flags }: Props) {
  const [hovered, setHovered] = useState<string>('material');
  const access = hasAccess(flags, COSMOLOGY_GATE);

  if (!access) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="py-16 px-4 max-w-2xl mx-auto"
      >
        <h1 className="font-display text-4xl text-codex-parchment mb-3">Cosmology</h1>
        <p className="text-codex-parchmentDim italic mb-8">
          The shape of the planes. The geometry of life and death.
        </p>
        <ContentGate gate={COSMOLOGY_GATE} flags={flags}>
          <div />
        </ContentGate>
      </motion.div>
    );
  }

  const active = PLANES[hovered] ?? PLANES.material;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="py-10 px-4 max-w-6xl mx-auto"
    >
      <h1 className="font-display text-4xl text-codex-parchment mb-3">Cosmology</h1>
      <p className="text-codex-parchmentDim italic mb-2">
        The shape of the planes. The geometry of life and death.
      </p>
      <p className="text-codex-parchmentDim/60 text-sm mb-10">
        Hover over any plane to read its description.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        <CosmologyDiagram hovered={hovered} onHover={setHovered} />

        <aside className="lg:sticky lg:top-20 bg-codex-surface border border-codex-border rounded-lg p-5">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-2xl mb-1" style={{ color: active.color }}>
              {active.name}
            </h2>
            <p className="text-codex-parchmentDim text-sm italic mb-4">{active.tagline}</p>
            <p className="text-codex-parchment text-sm leading-relaxed">{active.description}</p>
          </motion.div>
        </aside>
      </div>

      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-2xl text-codex-gold mb-4">A Note on the Afterlife</h2>
        {AFTERLIFE_NOTE.trim().split(/\n\n+/).map((p, i) => (
          <p key={i} className="text-codex-parchment leading-relaxed mb-4">{p.trim()}</p>
        ))}
      </section>
    </motion.div>
  );
}

// ── The diagram itself ─────────────────────────────────────────────────────
function CosmologyDiagram({
  hovered, onHover,
}: { hovered: string; onHover: (id: string) => void }) {
  const isActive = (id: string) => hovered === id;
  // Non-hovered planes stay clearly readable (0.6) but visibly recede behind the active one.
  const dim = (id: string) => (hovered && hovered !== id ? 0.6 : 1);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="w-full max-w-[600px] mx-auto block"
      style={{ height: 'auto', maxHeight: '70vh' }}
    >
      <defs>
        <radialGradient id="positiveGlow">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="40%" stopColor="#fff4c0" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff4c0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="negativeGlow">
          <stop offset="0%" stopColor="#000000" stopOpacity="1" />
          <stop offset="40%" stopColor="#3a1a3a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3a1a3a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="materialFill">
          <stop offset="0%" stopColor="#e8c96a" />
          <stop offset="80%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#7a5c1a" />
        </radialGradient>
        <radialGradient id="etherealFill">
          <stop offset="0%" stopColor="#a8c8d8" stopOpacity="0" />
          <stop offset="60%" stopColor="#a8c8d8" stopOpacity="0.12" />
          <stop offset="82%" stopColor="#c0dceb" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a8c8d8" stopOpacity="0" />
        </radialGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ─ Astral Plane: the silver-starred medium that suspends everything else.
         The background rect catches hover events on "empty" space → Astral. */}
      <rect
        x={0} y={0} width={VIEW_W} height={VIEW_H}
        fill="transparent"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover('astral')}
      />
      <Stars dimmed={hovered !== 'astral'} active={isActive('astral')} />
      {/* Astral label tucked into the top-left corner — out of the way of
          the Positive Energy point at the apex. */}
      <text
        x={14} y={18}
        textAnchor="start"
        fontFamily="Cinzel, serif"
        fontSize="9"
        letterSpacing="3"
        fill="#d8e0ff"
        opacity={isActive('astral') ? 1 : 0.55}
        style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
      >
        The Astral Plane
      </text>

      {/* ─ Elemental Planes (outside the cones) ─────────────────────────
         Cones span x = 150…450 at y = 250 and narrow toward y = 40 and y = 460.
         The four elementals sit comfortably outside the cone walls in each corner.
         Names follow Eberron canon (Syrania/Fernia/Risia/Lamannia). */}
      <Elemental id="air"   cx={55}  cy={130} fill="#c8e0e8" shape="ring"  label="Syrania"  active={isActive('air')}   opacity={dim('air')}   onHover={onHover} />
      <Elemental id="fire"  cx={545} cy={130} fill="#e87850" shape="flame" label="Fernia"   active={isActive('fire')}  opacity={dim('fire')}  onHover={onHover} />
      <Elemental id="water" cx={55}  cy={370} fill="#7ab8d8" shape="drop"  label="Risia"    active={isActive('water')} opacity={dim('water')} onHover={onHover} />
      <Elemental id="earth" cx={545} cy={370} fill="#a08860" shape="cube"  label="Parvata"  active={isActive('earth')} opacity={dim('earth')} onHover={onHover} />

      {/* ─ Dashed light-cone lines ────────────────────────────────────── */}
      {/* Upper cone */}
      <ConeLine
        x1={CENTER_X - CONE_HALF_WIDTH} y1={CENTER_Y}
        x2={CENTER_X} y2={POS_APEX_Y}
        active={isActive('positive')}
      />
      <ConeLine
        x1={CENTER_X + CONE_HALF_WIDTH} y1={CENTER_Y}
        x2={CENTER_X} y2={POS_APEX_Y}
        active={isActive('positive')}
      />
      {/* Lower cone */}
      <ConeLine
        x1={CENTER_X - CONE_HALF_WIDTH} y1={CENTER_Y}
        x2={CENTER_X} y2={NEG_APEX_Y}
        active={isActive('negative')}
      />
      <ConeLine
        x1={CENTER_X + CONE_HALF_WIDTH} y1={CENTER_Y}
        x2={CENTER_X} y2={NEG_APEX_Y}
        active={isActive('negative')}
      />
      {/* Horizontal "Material plane" reference line */}
      <line
        x1={CENTER_X - CONE_HALF_WIDTH} y1={CENTER_Y}
        x2={CENTER_X + CONE_HALF_WIDTH} y2={CENTER_Y}
        stroke="#c9a84c"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeDasharray="2 6"
      />

      {/* ─ Faerie & Shadowfell — orbital rings around the Material+Aether.
         Both ellipses are large enough to fully enclose the central system;
         Faerie's centre sits slightly above the Material (peaking upward),
         Shadowfell's mirrors below. They cross at two points either side of
         the Aether, giving a layered Bohr-atom-style cosmological picture. */}
      <OrbitalRing
        id="feywild"
        cx={CENTER_X} cy={215}
        rx={130} ry={85}
        color="#92e0a4"
        label="Faerie"
        labelDy={-95}
        active={isActive('feywild')}
        opacity={dim('feywild')}
        onHover={onHover}
      />
      <OrbitalRing
        id="shadowfell"
        cx={CENTER_X} cy={285}
        rx={130} ry={85}
        color="#b09cd0"
        label="Shadowfell"
        labelDy={95}
        active={isActive('shadowfell')}
        opacity={dim('shadowfell')}
        onHover={onHover}
      />

      {/* ─ Aethereal shell (drawn before Material so Material overlays) ─ */}
      <g
        style={{ cursor: 'pointer', opacity: dim('ethereal') }}
        onMouseEnter={() => onHover('ethereal')}
      >
        {/* Outer haze */}
        <motion.circle
          cx={CENTER_X} cy={CENTER_Y} r={ETH_R + 4}
          fill="url(#etherealFill)"
          animate={{ opacity: isActive('ethereal') ? [0.85, 1, 0.85] : [0.65, 0.9, 0.65] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Thin ring outline */}
        <circle
          cx={CENTER_X} cy={CENTER_Y} r={ETH_R}
          fill="none"
          stroke="#c0dceb"
          strokeOpacity={isActive('ethereal') ? 1 : 0.75}
          strokeWidth={isActive('ethereal') ? 1.8 : 1.2}
          strokeDasharray="2 3"
        />
        <text
          x={CENTER_X + ETH_R + 12}
          y={CENTER_Y + 4}
          fontFamily="Cinzel, serif"
          fontSize="11"
          fill="#c0dceb"
          opacity={isActive('ethereal') ? 1 : 0.95}
        >
          Aetherea
        </text>
      </g>

      {/* ─ Material plane ──────────────────────────────────────────────── */}
      <g
        style={{ cursor: 'pointer', opacity: dim('material') }}
        onMouseEnter={() => onHover('material')}
      >
        <motion.circle
          cx={CENTER_X} cy={CENTER_Y} r={MAT_R}
          fill="url(#materialFill)"
          animate={{ scale: isActive('material') ? [1, 1.06, 1] : [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: `${CENTER_X}px ${CENTER_Y}px`, transformBox: 'fill-box' as never }}
        />
        <text
          x={CENTER_X} y={CENTER_Y + 4}
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="9"
          fill="#3a2810"
          style={{ pointerEvents: 'none' }}
        >
          Material
        </text>
      </g>

      {/* ─ Positive Energy Plane (top, white) ──────────────────────────── */}
      <EnergyPoint
        id="positive"
        cx={CENTER_X} cy={POS_APEX_Y}
        fill="#ffffff"
        glowId="positiveGlow"
        active={isActive('positive')}
        opacity={dim('positive')}
        onHover={onHover}
        label="Positive Energy"
        labelDy={-22}
      />

      {/* ─ Negative Energy Plane (bottom, black) ───────────────────────── */}
      <EnergyPoint
        id="negative"
        cx={CENTER_X} cy={NEG_APEX_Y}
        fill="#0a0a0a"
        glowId="negativeGlow"
        active={isActive('negative')}
        opacity={dim('negative')}
        onHover={onHover}
        label="Negative Energy"
        labelDy={28}
      />
    </svg>
  );
}

// ── Subcomponents ───────────────────────────────────────────────────────────

function ConeLine({
  x1, y1, x2, y2, active,
}: { x1: number; y1: number; x2: number; y2: number; active: boolean }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={active ? '#ffe8a0' : '#e8c96a'}
      strokeOpacity={active ? 1 : 0.85}
      strokeWidth={active ? 2.2 : 1.5}
      strokeDasharray="4 6"
      animate={{ strokeDashoffset: [0, -20] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// ── Orbital ring (for Faerie / Shadowfell) ─────────────────────────────────
// A stroke-only ellipse that wraps around the central Material+Aether system,
// reminiscent of an electron orbital or planetary orbit. Flowing dash offset
// gives a sense of motion; a small "particle" traces the ring.
function OrbitalRing({
  id, cx, cy, rx, ry, color, label, labelDy, active, opacity, onHover,
}: {
  id: string; cx: number; cy: number; rx: number; ry: number;
  color: string; label: string; labelDy: number;
  active: boolean; opacity: number; onHover: (id: string) => void;
}) {
  // Pre-compute 33 evenly-spaced points around the ellipse for the orbiting
  // particle (32 segments + return to start). 32 is enough for smooth motion.
  const STEPS = 32;
  const orbitXs: number[] = [];
  const orbitYs: number[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const theta = (2 * Math.PI * i) / STEPS;
    orbitXs.push(cx + rx * Math.cos(theta));
    orbitYs.push(cy + ry * Math.sin(theta));
  }

  return (
    <g style={{ opacity }}>
      {/* Visible orbital ring — stroke only, dashed, with flowing offset */}
      <motion.ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none"
        stroke={color}
        strokeWidth={active ? 2.4 : 1.7}
        strokeOpacity={active ? 1 : 0.75}
        strokeDasharray="3 5"
        filter="url(#softGlow)"
        animate={{ strokeDashoffset: [0, -16] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        style={{ pointerEvents: 'none' }}
      />
      {/* Invisible thick stroke for hovering — easier hit target */}
      <ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill="none"
        stroke="transparent"
        strokeWidth={14}
        pointerEvents="stroke"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover(id)}
      />
      {/* Orbiting particle — a small glowing dot that traces the ring */}
      <motion.circle
        r={active ? 3.5 : 2.5}
        fill={color}
        filter="url(#softGlow)"
        animate={{ cx: orbitXs, cy: orbitYs }}
        transition={{
          duration: active ? 8 : 14,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ pointerEvents: 'none' }}
      />
      {/* Label sits outside the ring, at its vertical "peak" */}
      <text
        x={cx} y={cy + labelDy}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="13"
        fontWeight={active ? 600 : 500}
        fill={color}
        opacity={1}
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  );
}

function EnergyPoint({
  id, cx, cy, fill, glowId, active, opacity, onHover, label, labelDy,
}: {
  id: string; cx: number; cy: number; fill: string; glowId: string;
  active: boolean; opacity: number;
  onHover: (id: string) => void; label: string; labelDy: number;
}) {
  return (
    <g
      style={{ cursor: 'pointer', opacity }}
      onMouseEnter={() => onHover(id)}
    >
      {/* Outer pulsing aura */}
      <motion.circle
        cx={cx} cy={cy} r={40}
        fill={`url(#${glowId})`}
        animate={{
          r: active ? [40, 60, 40] : [35, 48, 35],
          opacity: active ? [0.9, 1, 0.9] : [0.5, 0.75, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Core dot */}
      <motion.circle
        cx={cx} cy={cy} r={active ? 8 : 6}
        fill={fill}
        stroke={fill === '#ffffff' ? '#c9a84c' : '#4a2a4a'}
        strokeWidth="0.5"
        animate={{ scale: active ? [1, 1.18, 1] : [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'fill-box' as never }}
      />
      <text
        x={cx} y={cy + labelDy}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="12"
        fontWeight={active ? 600 : 500}
        fill={fill === '#ffffff' ? '#fff4c0' : '#c8b8d8'}
        opacity={1}
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  );
}

// The Astral Plane itself — a dense starfield that becomes the cosmological
// "medium" in which all other planes are suspended. Pre-computed deterministic
// positions, sized over the 600 × 500 viewBox. `dimmed` slightly fades when
// another plane is focused so the Astral doesn't fight for attention;
// `active` blazes it up when the Astral itself is hovered.
function Stars({ dimmed, active }: { dimmed: boolean; active: boolean }) {
  // [x, y, sizeRel, brightness]
  const stars: Array<[number, number, number, number]> = [
    // Far-left column
    [15,  35, 1.2, 0.9],  [30,  90, 0.8, 0.55], [10, 160, 1.5, 0.95], [40, 215, 0.9, 0.6],
    [20, 280, 1.1, 0.8],  [45, 340, 0.7, 0.5],  [15, 400, 1.3, 0.85], [35, 455, 0.9, 0.65], [50, 485, 0.8, 0.55],
    // Inner left margin (just outside upper-left cone wall)
    [70, 70, 1.4, 0.95],  [90, 195, 0.9, 0.6], [60, 305, 1.0, 0.7],   [100, 380, 1.2, 0.85], [80, 445, 0.8, 0.55], [105, 475, 1.1, 0.75],
    // Top edge, between/around upper cone apex
    [165, 25, 0.9, 0.6],  [220, 15, 1.3, 0.85], [275, 12, 0.8, 0.5], [330, 14, 1.1, 0.75], [380, 20, 0.9, 0.6], [435, 30, 1.2, 0.8],
    // Bottom edge
    [170, 485, 1.0, 0.7], [225, 492, 0.8, 0.5],[285, 488, 1.3, 0.85],[355, 490, 0.9, 0.6], [405, 482, 1.1, 0.75],
    // Inner right margin
    [495, 80, 0.9, 0.6],  [510, 180, 1.4, 0.95],[490, 290, 1.0, 0.7],[520, 360, 0.8, 0.55],[505, 425, 1.2, 0.85],[495, 470, 0.9, 0.6],
    // Far-right column
    [570, 50, 1.1, 0.75], [585, 115, 0.9, 0.6],[555, 175, 1.3, 0.9], [580, 235, 0.8, 0.55],[565, 295, 1.5, 0.95],
    [585, 350, 1.0, 0.7], [555, 405, 0.9, 0.6],[580, 450, 1.2, 0.8], [565, 485, 0.8, 0.55],
    // Sparse accents in the interior gaps (avoid stepping on planes)
    [125, 130, 0.7, 0.45],[140, 370, 0.8, 0.5],[455, 150, 0.7, 0.45],[445, 365, 0.8, 0.5],
  ];

  // When Astral is active, intensify; when something else is hovered, soften.
  const mult = active ? 1.3 : dimmed ? 0.6 : 1;

  return (
    <g style={{ pointerEvents: 'none' }}>
      {stars.map(([x, y, size, brightness], i) => {
        const b = Math.min(1, brightness * mult);
        const r = size * (active ? 1.2 : 1);
        return (
          <motion.circle
            key={i}
            cx={x} cy={y} r={r}
            fill="#e8d9c0"
            animate={{ opacity: [b * 0.4, b, b * 0.4] }}
            transition={{ duration: 2.5 + (i % 7) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
      {/* A few larger "lantern" stars, with soft glow — anchors the eye in the
          starfield and gives the Astral something to "blaze" when hovered. */}
      {[[100, 250], [500, 250], [300, 30], [300, 470]].map(([x, y], i) => (
        <motion.circle
          key={`l${i}`}
          cx={x} cy={y}
          r={active ? 2.6 : 1.8}
          fill="#fff4c0"
          filter="url(#softGlow)"
          animate={{ opacity: active ? [0.8, 1, 0.8] : [0.4, 0.6, 0.4] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}

// ── Elemental Planes ───────────────────────────────────────────────────────
type ElementalShape = 'ring' | 'flame' | 'drop' | 'cube';

function Elemental({
  id, cx, cy, fill, shape, label, active, opacity, onHover,
}: {
  id: string; cx: number; cy: number; fill: string;
  shape: ElementalShape; label: string;
  active: boolean; opacity: number; onHover: (id: string) => void;
}) {
  const baseSize = 14;
  const size = active ? baseSize * 1.2 : baseSize;

  return (
    <g
      style={{ cursor: 'pointer', opacity }}
      onMouseEnter={() => onHover(id)}
    >
      {/* Outer aura */}
      <motion.circle
        cx={cx} cy={cy} r={baseSize + 10}
        fill={fill}
        opacity={active ? 0.2 : 0.08}
        animate={{
          r: active
            ? [baseSize + 10, baseSize + 16, baseSize + 10]
            : [baseSize + 8,  baseSize + 12, baseSize + 8],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Glyph */}
      <g filter="url(#softGlow)">
        {shape === 'ring' && (
          <>
            <circle cx={cx} cy={cy} r={size}        fill="none" stroke={fill} strokeWidth={2.2} />
            <circle cx={cx} cy={cy} r={size * 0.5}  fill={fill} opacity={0.6} />
          </>
        )}
        {shape === 'flame' && (
          // Teardrop-flame pointing up
          <path
            d={`M ${cx} ${cy - size}
                C ${cx + size * 0.9} ${cy - size * 0.2}, ${cx + size * 0.8} ${cy + size * 0.7}, ${cx} ${cy + size * 0.9}
                C ${cx - size * 0.8} ${cy + size * 0.7}, ${cx - size * 0.9} ${cy - size * 0.2}, ${cx} ${cy - size} Z`}
            fill={fill}
          />
        )}
        {shape === 'drop' && (
          // Inverted teardrop (pointing down)
          <path
            d={`M ${cx} ${cy + size}
                C ${cx + size * 0.9} ${cy + size * 0.2}, ${cx + size * 0.8} ${cy - size * 0.7}, ${cx} ${cy - size * 0.9}
                C ${cx - size * 0.8} ${cy - size * 0.7}, ${cx - size * 0.9} ${cy + size * 0.2}, ${cx} ${cy + size} Z`}
            fill={fill}
          />
        )}
        {shape === 'cube' && (
          // Diamond — solidity without a literal cube
          <rect
            x={cx - size * 0.85} y={cy - size * 0.85}
            width={size * 1.7} height={size * 1.7}
            fill={fill}
            stroke="#4a3820"
            strokeWidth={1}
            transform={`rotate(45 ${cx} ${cy})`}
          />
        )}
      </g>
      <text
        x={cx} y={cy + baseSize + 18}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="11"
        fontWeight={active ? 600 : 500}
        fill={fill}
        opacity={1}
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </g>
  );
}
