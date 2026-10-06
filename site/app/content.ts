/**
 * Content loading for the site. Every page body is Markdown on disk:
 *   docs/brand-package/*.md   guidelines (and the template registers)
 *   docs/components/<id>.md   one file per component, fixed headings
 *   docs/patterns/<id>.md     one file per pattern
 * A page whose file does not exist says so; nothing is filled in.
 */

const brandFiles = import.meta.glob('../../docs/brand-package/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const componentFiles = import.meta.glob('../../docs/components/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const patternFiles = import.meta.glob('../../docs/patterns/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface Doc {
  file: string;
  data: Record<string, string | string[]>;
  body: string;
  title: string;
}

function basename(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? path;
}

export function parseFrontmatter(src: string): { data: Record<string, string | string[]>; body: string } {
  const match = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: src };
  const data: Record<string, string | string[]> = {};
  let listKey: string | null = null;
  for (const line of match[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) {
      (data[listKey] as string[]).push(item[1].trim());
      continue;
    }
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === '') {
      listKey = kv[1];
      data[listKey] = [];
    } else {
      listKey = null;
      data[kv[1]] = kv[2].trim();
    }
  }
  return { data, body: src.slice(match[0].length) };
}

function toDoc(file: string, src: string): Doc {
  const { data, body } = parseFrontmatter(src);
  const h1 = body.match(/^#\s+(.+)$/m)?.[1];
  const title = (typeof data.title === 'string' && data.title) || h1 || basename(file);
  return { file, data, body, title };
}

/** Brand-package docs by basename, e.g. "05-accessibility". */
export const brandDocs: Record<string, Doc> = Object.fromEntries(
  Object.entries(brandFiles).map(([path, src]) => [basename(path), toDoc(path, src)]),
);

/** Guidelines: brand-package files that are guidance, not registers. */
const GUIDELINE_FILES = [
  '01-brand-overview',
  '02-logo-usage',
  '03-color-and-type',
  '04-design-system',
  '04-voice-and-tone',
  '05-accessibility',
  '05-copy-guidance',
  '06-ai-agent-style-guide',
  '07-illustration-style',
  '08-image-generation-prompts',
  '09-app-primitives',
  '10-language-index',
] as const;

export const guidelineDocs: Doc[] = GUIDELINE_FILES.filter((f) => brandDocs[f]).map((f) => brandDocs[f]);

export const componentDocs: Record<string, Doc> = Object.fromEntries(
  Object.entries(componentFiles).map(([path, src]) => [basename(path), toDoc(path, src)]),
);

export const patternDocs: Record<string, Doc> = Object.fromEntries(
  Object.entries(patternFiles).map(([path, src]) => [basename(path), toDoc(path, src)]),
);

/** Resolve a manifest `docs` path (docs/brand-package/x.md) to its loaded doc. */
export function docForPath(path: string | undefined): Doc | undefined {
  if (!path) return undefined;
  return brandDocs[basename(path)];
}

/** The `## \`id\`` section of a register doc (templates), body only. */
export function sectionFor(doc: Doc | undefined, id: string): string | undefined {
  if (!doc) return undefined;
  const parts = doc.body.split(/\n(?=## )/);
  const hit = parts.find((p) => p.startsWith('## ') && p.split('\n')[0].includes(`\`${id}\``));
  return hit;
}

/** Fixed headings every component doc carries, in this order. */
export const COMPONENT_DOC_SECTIONS = [
  'Purpose',
  'When to use',
  'When not to use',
  'How to use',
  'Heuristics',
  'Content',
  'Accessibility',
] as const;

export type ComponentDocSection = (typeof COMPONENT_DOC_SECTIONS)[number];

/** Split a doc body into its `## ` sections, keyed by heading text. */
export function splitSections(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of body.split(/\n(?=## )/)) {
    if (!part.startsWith('## ')) continue;
    const [head, ...rest] = part.split('\n');
    out[head.replace(/^##\s+/, '').trim()] = rest.join('\n').trim();
  }
  return out;
}

/** A section counts as written when it has text that is not the placeholder. */
export function isWritten(text: string | undefined): boolean {
  return Boolean(text && text.trim() && !/^not yet written\.?$/i.test(text.trim()));
}
