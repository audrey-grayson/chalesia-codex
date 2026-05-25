import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

/**
 * Shared markdown renderer for codex prose.
 *
 * Two variants:
 *  - `<Markdown>`: block layout. Paragraphs become `<p>` with body styling,
 *    spaced with mb-4. Use for section bodies, descriptions, the afterlife
 *    note, etc.
 *  - `<InlineMarkdown>`: single-line layout. The outer paragraph wrapper
 *    is stripped (renders as a fragment) so inline formatting like
 *    `*italic*` and `**bold**` works in a tagline or short label without
 *    introducing a block-level element. Use for taglines, worshippers,
 *    short metadata lines.
 *
 * Both support `**bold**`, `*italic*`, `[text](url)`, and inline `` `code` ``
 * via react-markdown's default GFM-lite parser. We don't enable lists,
 * headings, or images on purpose — section structure lives in the TS shell,
 * not in inline markdown.
 *
 * Internal codex links (e.g. `/cities/hanach`) keep working as plain
 * anchors; the full-page reload they trigger inside a hash router is
 * acceptable for prose links, which are rare. External links open in a
 * new tab.
 */

interface Props {
  children: string;
  /** Extra classes applied to the outermost wrapper. */
  className?: string;
}

/** Anchor renderer shared by both variants — themes links to gold and handles target. */
function MdAnchor({ href, children }: { href?: string; children?: React.ReactNode }) {
  const isExternal = !!href && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="text-codex-gold hover:text-codex-goldLight underline underline-offset-2"
    >
      {children}
    </a>
  );
}

const BLOCK_COMPONENTS: Components = {
  // Paragraphs in body prose. mb-4 between them — last paragraph's margin
  // is harmless because the parent containers don't rely on tight spacing.
  p: ({ children }) => (
    <p className="text-codex-parchment leading-relaxed mb-4 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-codex-parchment">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: MdAnchor,
};

const INLINE_COMPONENTS: Components = {
  // Strip the paragraph wrapper so inline markdown doesn't introduce a
  // block-level element in tagline/label slots. Children render as a
  // fragment, inheriting the parent's text styling.
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: MdAnchor,
};

export function Markdown({ children, className }: Props) {
  // The outer div takes any caller-provided classes (rare — most callers
  // wrap externally and pass nothing).
  return (
    <div className={className}>
      <ReactMarkdown components={BLOCK_COMPONENTS}>{children}</ReactMarkdown>
    </div>
  );
}

export function InlineMarkdown({ children, className }: Props) {
  // Render into a <span> so the result can sit inside any inline context
  // (a <p>, a <li>, a tagline div, etc.) without breaking layout.
  return (
    <span className={className}>
      <ReactMarkdown components={INLINE_COMPONENTS}>{children}</ReactMarkdown>
    </span>
  );
}
