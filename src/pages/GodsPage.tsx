import { motion } from 'framer-motion';
import { GODS } from '../data/gods';
import { Markdown, InlineMarkdown } from '../components/Markdown';
import type { ContentFlag } from '../types';

const ALIGNMENT_COLORS = { lawful: '#7ab5a0', neutral: '#c9a84c', chaotic: '#b52222' };
const ALIGNMENT_LABELS = { lawful: 'Lawful', neutral: 'Neutral', chaotic: 'Chaotic' };

interface Props { flags: Set<ContentFlag> }

export function GodsPage({ flags: _flags }: Props) {
  const hanacene = GODS.filter(g => g.pantheon === 'hanacene');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 px-4 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl text-codex-parchment mb-2">The Pantheon</h1>
      <p className="text-codex-parchmentDim mb-8">
        Nine deities govern the Hanacene world — three Lawful, three Neutral, three Chaotic.
      </p>

      <section className="mb-10">
        <h2 className="font-display text-2xl text-codex-gold mb-5">The Hanacene Pantheon</h2>
        <div className="grid grid-cols-1 gap-4">
          {hanacene.map((god, i) => (
            <motion.div key={god.id} id={god.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="p-5 bg-codex-surface border border-codex-border rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-display text-xl text-codex-parchment">{god.name}</h3>
                  <p className="text-codex-parchmentDim text-sm italic">
                    <InlineMarkdown>{god.tagline}</InlineMarkdown>
                  </p>
                </div>
                <span className="text-xs font-display px-2 py-0.5 rounded ml-3 flex-shrink-0"
                  style={{ color: ALIGNMENT_COLORS[god.alignment], borderColor: ALIGNMENT_COLORS[god.alignment] + '44', border: '1px solid', background: ALIGNMENT_COLORS[god.alignment] + '11' }}>
                  {ALIGNMENT_LABELS[god.alignment]}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {god.domains.map(d => (
                  <span key={d} className="text-xs bg-codex-border/50 text-codex-parchmentDim px-2 py-0.5 rounded">{d}</span>
                ))}
              </div>
              <div className="text-codex-parchment text-sm leading-relaxed mb-2">
                <Markdown>{god.description}</Markdown>
              </div>
              <p className="text-codex-parchmentDim text-xs italic">
                <InlineMarkdown>{god.worshippers}</InlineMarkdown>
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
