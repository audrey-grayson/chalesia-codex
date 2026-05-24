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
const FEY_Y = 140;
const SHA_Y = CENTER_Y + (CENTER_Y - FEY_Y); // mirror below

// width of cone at a given y (interpolate between apex and material level)
function coneHalfWidthAt(y: number): number {
  if (y <= CENTER_Y) {
    const t = (CENTER_Y - y) / (CENTER_Y - POS_APEX_Y);
    return CONE_HALF_WIDTH * (1 - t);
  } else {
    const t = (y - CENTER_Y) / (NEG_APEX_Y - CENTER_Y);
    return CONE_HALF_WIDTH * (1 - t);
  }
}

const FEY_HALF_W = coneHalfWidthAt(FEY_Y) * 0.7;
const SHA_HALF_W = coneHalfWidthAt(SHA_Y) * 0.7;

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

      {/* ─ Faint star-field backdrop ──────────────────────────────────── */}
      <Stars />

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

      {/* ─ Faerie ──────────────────────────────────────────────────────── */}
      <PlaneEllipse
        id="feywild"
        cx={CENTER_X} cy={FEY_Y}
        rx={FEY_HALF_W} ry={14}
        fill="#92e0a4"
        opacity={dim('feywild')}
        active={isActive('feywild')}
        onHover={onHover}
        label="Faerie"
        labelOffset={-26}
      />

      {/* ─ Shadowfell ──────────────────────────────────────────────────── */}
      <PlaneEllipse
        id="shadowfell"
        cx={CENTER_X} cy={SHA_Y}
        rx={SHA_HALF_W} ry={14}
        fill="#b09cd0"
        opacity={dim('shadowfell')}
        active={isActive('shadowfell')}
        onHover={onHover}
        label="Shadowfell"
        labelOffset={34}
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

function PlaneEllipse({
  id, cx, cy, rx, ry, fill, opacity, active, onHover, label, labelOffset,
}: {
  id: string; cx: number; cy: number; rx: number; ry: number;
  fill: string; opacity: number; active: boolean;
  onHover: (id: string) => void; label: string; labelOffset: number;
}) {
  return (
    <g
      style={{ cursor: 'pointer', opacity }}
      onMouseEnter={() => onHover(id)}
    >
      <motion.ellipse
        cx={cx} cy={cy} rx={rx} ry={ry}
        fill={fill}
        opacity={active ? 1 : 0.92}
        filter="url(#softGlow)"
        animate={{
          rx: active ? [rx, rx * 1.06, rx] : [rx, rx * 1.015, rx],
          ry: active ? [ry, ry * 1.15, ry] : [ry, ry * 1.06, ry],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <text
        x={cx} y={cy + labelOffset}
        textAnchor="middle"
        fontFamily="Cinzel, serif"
        fontSize="13"
        fontWeight={active ? 600 : 400}
        fill={fill}
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

// Procedurally placed faint stars in the background — purely decorative.
function Stars() {
  // Pre-computed pseudo-random positions (deterministic so it doesn't reshuffle on re-render)
  // Coordinates fit within the 600 × 500 viewBox.
  const stars: Array<[number, number, number]> = [
    [ 40,  60, 0.6], [ 90, 130, 0.4], [120, 230, 0.5], [ 60, 320, 0.7],
    [ 80, 400, 0.4], [ 40, 460, 0.5], [180,  90, 0.5], [220, 290, 0.6],
    [420,  65, 0.5], [380, 175, 0.4], [460, 220, 0.7], [510, 340, 0.5],
    [430, 430, 0.6], [560, 125, 0.4], [540, 280, 0.5], [490, 470, 0.4],
    [150,  35, 0.4], [350,  35, 0.5], [200, 485, 0.4], [400, 490, 0.5],
  ];
  return (
    <g>
      {stars.map(([x, y, o], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r={0.9}
          fill="#e8d9c0"
          opacity={o}
          animate={{ opacity: [o * 0.5, o, o * 0.5] }}
          transition={{ duration: 3 + (i % 5), repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </g>
  );
}
