import yaml from 'js-yaml';

/**
 * Markdown content loader with optional YAML frontmatter.
 *
 * Hand-edited prose for cities, factions, gods, and cosmology lives in
 * `src/content/<kind>/<entity-id>.md`. Each file is:
 *
 *   1. (Optional) YAML frontmatter between `---` fences at the very top,
 *      holding entity-level metadata that benefits from hand-editing
 *      (rulers, per-section gate definitions, etc.).
 *   2. A flat list of sections separated by `## <section-id>` headings.
 *      Section bodies are plain markdown — paragraph breaks preserved.
 *
 * Example city file:
 *
 *   ---
 *   rulers:
 *     - chalexis
 *     - karindel
 *   gates:
 *     skyknight-presence:
 *       flags:
 *         - background:skyknight
 *         - skill:history
 *       label: Military knowledge
 *       hint: A soldier or scholar knows.
 *   ---
 *
 *   ## tagline
 *   Capital of the Hanacene Empire.
 *
 *   ## overview
 *   First paragraph...
 *
 *   Second paragraph.
 *
 * The TS data file owns the *structural list* of sections (which exist, in
 * what order, with what headings) and references prose by entity id +
 * section id. Authors editing prose only touch the .md file. Authors
 * editing gates or rulers also only touch the .md file.
 */

export interface ParsedContent {
  /** Parsed YAML frontmatter as a generic object. Empty {} if absent. */
  frontmatter: Record<string, unknown>;
  /** Section id → trimmed markdown body, in file order. */
  sections: Map<string, string>;
}

/**
 * Split a markdown document into frontmatter + section map.
 *
 * Frontmatter rules:
 *  - Must begin on line 1 with `---`.
 *  - Closed by a line containing only `---`.
 *  - Body between is parsed as YAML via js-yaml.
 *  - Files without frontmatter are fine — `frontmatter` is `{}`.
 *
 * Section rules (unchanged):
 *  - A section starts at `## <id>` on its own line.
 *  - Section id is whatever follows `## `, trimmed.
 *  - Section body runs until the next `## ` or end of file.
 *  - Bodies are trimmed of outer whitespace, but internal blank lines
 *    (paragraph breaks) are preserved verbatim.
 *  - Text appearing before the first `## ` (after frontmatter) is silently
 *    discarded — use it for author comments invisible to readers.
 */
export function parseContent(markdown: string): ParsedContent {
  let body = markdown;
  let frontmatter: Record<string, unknown> = {};

  // Frontmatter must be at the very start; allow a UTF-8 BOM.
  const fmStart = body.startsWith('﻿') ? body.slice(1) : body;
  const fmMatch = fmStart.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (fmMatch) {
    const parsed = yaml.load(fmMatch[1]);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      frontmatter = parsed as Record<string, unknown>;
    }
    body = fmStart.slice(fmMatch[0].length);
  }

  const sections = new Map<string, string>();
  const parts = body.split(/^## (.+)$/m);
  // parts is ["preamble", id1, body1, id2, body2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const id = parts[i].trim();
    const sectionBody = (parts[i + 1] ?? '').trim();
    sections.set(id, sectionBody);
  }
  return { frontmatter, sections };
}

/**
 * Build an `entity-id → ParsedContent` index from a Vite glob of markdown.
 *
 * Use with `import.meta.glob(<pattern>, { eager: true, query: '?raw', import: 'default' })`.
 * Keys of the glob are file paths; we extract the basename (sans .md) as the
 * entity id.
 */
export function indexContent(glob: Record<string, string>): Map<string, ParsedContent> {
  const index = new Map<string, ParsedContent>();
  for (const [path, raw] of Object.entries(glob)) {
    const match = path.match(/([^/\\]+)\.md$/);
    if (!match) continue;
    index.set(match[1], parseContent(raw));
  }
  return index;
}

/**
 * Resolve a prose section, throwing a clear error if the markdown file or
 * section is missing. Loud failures are intentional: silently rendering
 * empty sections would let typos in section ids ship to users.
 */
export function getSection(
  index: Map<string, ParsedContent>,
  entityId: string,
  sectionId: string,
): string {
  const entity = index.get(entityId);
  if (!entity) {
    throw new Error(`Content missing: no markdown file for entity '${entityId}'`);
  }
  const body = entity.sections.get(sectionId);
  if (body === undefined) {
    throw new Error(`Content missing: '${entityId}.md' has no '## ${sectionId}' section`);
  }
  return body;
}

/**
 * Get the parsed frontmatter for an entity, or {} if the file has none.
 * Returns `unknown`-typed values; callers are responsible for shape-checking.
 */
export function getFrontmatter(
  index: Map<string, ParsedContent>,
  entityId: string,
): Record<string, unknown> {
  const entity = index.get(entityId);
  if (!entity) {
    throw new Error(`Content missing: no markdown file for entity '${entityId}'`);
  }
  return entity.frontmatter;
}
