import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

/* In-world explanations for the missing page — picked at random on each visit. */
const EXCUSES = [
  {
    deity:  'Eramane',
    text:   'The Veiled One has claimed this knowledge for their archive. Trade them a secret of equal weight and it may return.',
  },
  {
    deity:  'Soranus',
    text:   'The god of fate marked this page for severance. A century in the Plane of Death, then perhaps it filters back.',
  },
  {
    deity:  'Raxos',
    text:   'A passing bard borrowed it to flesh out a ballad. They swore to return it. They never do.',
  },
  {
    deity:  'Kaynan',
    text:   'The Maker is testing a new edition of this page in his isolated forge. He will release it when he is satisfied. Do not hold your breath.',
  },
  {
    deity:  'Syltea',
    text:   'A merchant ship carrying this scroll is presently overdue at Bellatara. The Silver Tide will surface it eventually.',
  },
  {
    deity:  'Myrai',
    text:   'It is winter. The page is hibernating. It will return in spring.',
  },
  {
    deity:  'Calitax',
    text:   'The Queen of Conquest deemed this page insufficiently lawful and has dispatched a metallic dragon to revise it.',
  },
  {
    deity:  'Tiamat',
    text:   'A chromatic dragon ate it. There were three. We cannot tell which.',
  },
  {
    deity:  'Alreth',
    text:   'The Sower planted this page in a field outside Pelath. The harvest has not yet come in.',
  },
];

export function NotFoundPage() {
  const location = useLocation();

  // Pick an excuse keyed off the missing path so the same broken link
  // produces the same excuse on every visit — feels intentional, not random.
  const excuse = useMemo(() => {
    const hash = Array.from(location.pathname).reduce((a, c) => a + c.charCodeAt(0), 0);
    return EXCUSES[hash % EXCUSES.length];
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto py-20 px-4 text-center"
    >
      {/* Sigil — an unbalanced nonagon nodding to the Hanacene pantheon */}
      <motion.svg
        initial={{ rotate: -6, opacity: 0 }}
        animate={{ rotate: 0, opacity: 0.3 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="mx-auto mb-6"
        width={120}
        height={120}
        viewBox="-60 -60 120 120"
        fill="none"
        stroke="#c9a84c"
        strokeWidth={0.8}
      >
        <Nonagon r={50} />
        <Nonagon r={36} rotation={20} />
        <circle r={4} fill="#c9a84c" />
        {/* one point pulled out of alignment — the missing god/page */}
        <circle cx={0} cy={-50} r={3} fill="#8b1a1a" />
        <line x1={0} y1={-50} x2={0} y2={-58} />
      </motion.svg>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display text-codex-gold/50 text-xs tracking-[0.3em] uppercase mb-3"
      >
        Error 404 · Page Not Found
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display text-4xl md:text-5xl text-codex-parchment mb-3"
      >
        By the Nine —<br />
        <span className="text-codex-gold">that page is missing!</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-codex-parchmentDim italic mb-2"
      >
        We searched the Argent Spire's vaults. We rifled the Veiled One's archive.
        We even asked the Skyknights to take a look from above.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-codex-parchmentDim italic mb-10"
      >
        Nothing.
      </motion.p>

      {/* Deity excuse card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="border border-codex-border bg-codex-surface/70 rounded-lg p-5 mb-10 text-left"
      >
        <p className="font-display text-codex-gold text-xs uppercase tracking-widest mb-2">
          The most likely explanation
        </p>
        <p className="text-codex-parchment leading-relaxed">
          <span className="font-display text-codex-goldLight">{excuse.deity}:</span>{' '}
          {excuse.text}
        </p>
      </motion.div>

      {/* The path that wasn't */}
      {location.pathname !== '/' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-codex-parchmentDim/50 text-xs font-mono mb-6 break-all"
        >
          attempted route: <span className="text-codex-parchmentDim">{location.pathname}</span>
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="flex gap-3 justify-center flex-wrap"
      >
        <Link
          to="/"
          className="px-5 py-2 bg-codex-gold text-codex-void font-display text-sm rounded hover:bg-codex-goldLight transition-colors"
        >
          ← Return to safer pages
        </Link>
        <Link
          to="/map"
          className="px-5 py-2 border border-codex-border text-codex-parchmentDim font-display text-sm rounded hover:border-codex-gold hover:text-codex-gold transition-colors"
        >
          Consult the map
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── A regular nonagon (9-pointed polygon) ───────────────────────────────── */
function Nonagon({ r, rotation = 0 }: { r: number; rotation?: number }) {
  const pts = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 - Math.PI / 2 + (rotation * Math.PI) / 180;
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
  }).join(' ');
  return <polygon points={pts} />;
}
