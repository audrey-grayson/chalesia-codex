import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import type { LoreSection } from '../types';
import type { ContentFlag } from '../types';
import { ContentGate } from './ContentGate';
import { FACTIONS } from '../data/factions';

interface Props {
  title: string;
  tagline: string;
  badge?: { label: string; color: string };
  headerCrest?: string;
  /**
   * Optional content rendered in the top-right of the header — replaces
   * `headerCrest` when both are provided. Used by city pages to show a
   * "Ruled by" panel of crested faction links.
   */
  headerAside?: ReactNode;
  backTo?: string;
  backLabel?: string; // should NOT include ← — the button renders it
  sections: LoreSection[];
  relatedLinks?: Array<{ label: string; to: string }>;
  flags: Set<ContentFlag>;
  children?: ReactNode;
}

/**
 * Lookup a faction by an internal route path like "/factions/aldaine".
 * Returns undefined for non-faction routes (e.g. "/cities/hanach", "/gods").
 */
function factionFromLink(to: string) {
  const m = to.match(/^\/factions\/([^/?#]+)/);
  if (!m) return undefined;
  return FACTIONS.find(f => f.id === m[1]);
}

export function LorePage({
  title, tagline, badge, headerCrest, headerAside, backTo, backLabel = 'Back',
  sections, relatedLinks, flags, children,
}: Props) {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto py-10 px-4"
    >
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          className="flex items-center gap-1.5 text-sm text-codex-parchmentDim hover:text-codex-gold transition-colors mb-6 font-display"
        >
          <span>←</span>
          <span>{backLabel}</span>
        </button>
      )}

      <header className="mb-8">
        <div className={(headerCrest || headerAside) ? 'flex items-start gap-5' : undefined}>
          <div className="flex-1 min-w-0">
            {badge && (
              <span
                className="inline-block px-3 py-0.5 text-xs font-display rounded-full border mb-3"
                style={{ color: badge.color, borderColor: badge.color + '66', backgroundColor: badge.color + '22' }}
              >
                {badge.label}
              </span>
            )}
            <h1 className="font-display text-4xl text-codex-parchment mb-3">{title}</h1>
            <p className="text-codex-parchmentDim text-lg italic leading-relaxed">{tagline}</p>
          </div>

          {/* headerAside takes precedence over headerCrest; LorePage only
              renders one top-right element to keep the title row clean. */}
          {headerAside ? (
            <div className="flex-shrink-0 mt-1">{headerAside}</div>
          ) : headerCrest ? (
            <img
              src={headerCrest}
              alt="House arms"
              className="w-20 h-20 object-contain flex-shrink-0 mt-1 drop-shadow-lg"
            />
          ) : null}
        </div>
        <hr className="codex-divider mt-5" />
      </header>

      <div className="space-y-8">
        {sections.map(section => (
          <section key={section.id}>
            {section.heading && (
              <h2 className="font-display text-xl text-codex-gold mb-3">{section.heading}</h2>
            )}
            {section.gate ? (
              <ContentGate gate={section.gate} flags={flags}>
                <Prose text={section.content} />
              </ContentGate>
            ) : (
              <Prose text={section.content} />
            )}
          </section>
        ))}
      </div>

      {children}

      {relatedLinks && relatedLinks.length > 0 && (
        <aside className="mt-10 pt-6 border-t border-codex-border">
          <h3 className="font-display text-sm text-codex-parchmentDim uppercase tracking-widest mb-3">
            Related Entries
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedLinks.map(link => {
              // Faction/house related links get a crest thumbnail prepended to
              // the chip. Non-faction routes (cities, gods, cosmology, etc.)
              // render as plain text chips as before.
              const faction = factionFromLink(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-codex-border rounded text-codex-parchmentDim hover:border-codex-gold hover:text-codex-gold transition-colors duration-150"
                >
                  {faction?.crestImage && (
                    <img
                      src={faction.crestImage}
                      alt=""
                      className="w-6 h-6 object-contain flex-shrink-0 drop-shadow-sm"
                    />
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </aside>
      )}
    </motion.article>
  );
}

function Prose({ text }: { text: string }) {
  const paragraphs = text.trim().split(/\n\n+/);
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-codex-parchment leading-relaxed">{p.trim()}</p>
      ))}
    </div>
  );
}
