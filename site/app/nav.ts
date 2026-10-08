import manifest from '../../manifest.json';
import tokens from '../../tokens-snapshot.json';
import { COMPONENT_DOC_SECTIONS, componentDocs, guidelineDocs, isWritten, splitSections } from './content';
import type { Section } from './routes';

export interface NavItem {
  id: string;
  label: string;
  section: Section;
  /** For components: written sections out of the fixed set. */
  written?: number;
  total?: number;
}

export interface NavGroup {
  id: string;
  label: string;
  section: Section;
  items: NavItem[];
}

type Primitive = { id: string; category: string; summary: string; version?: string; showcase?: boolean };
type Pattern = { id: string; title: string; summary: string; uses: string[]; docs?: string };
type Template = { id: string; title?: string; kind?: string; summary: string; composes?: string[]; docs: string; version: string };

export const primitives: Primitive[] = (manifest.uiPrimitives as Primitive[]).filter((p) => !p.id.endsWith('.figma'));
export const primitiveById = new Map(primitives.map((p) => [p.id, p]));
export const patterns: Pattern[] = ((manifest as { patterns?: Pattern[] }).patterns ?? []);
// Settings is a site preview, not yet a published package template.
export const templates: Template[] = [...manifest.templates as Template[], { id: 'settings', kind: 'prototype', summary: 'Full-page Settings preview with fictional data; integration work remains.', docs: '', version: '0.0.0' }];

export const categoryLabels: Record<string, string> = {
  actions: 'Actions',
  'data-display': 'Data display',
  disclosure: 'Disclosure',
  feedback: 'Feedback',
  forms: 'Forms',
  inputs: 'Inputs',
  layout: 'Layout',
  media: 'Media',
  menus: 'Menus',
  navigation: 'Navigation',
  overlay: 'Overlays',
  toggles: 'Toggles',
  typography: 'Typography',
};

export const categoryOrder = [
  'actions',
  'inputs',
  'forms',
  'toggles',
  'navigation',
  'menus',
  'overlay',
  'disclosure',
  'feedback',
  'data-display',
  'layout',
  'typography',
  'media',
];

export function displayTitle(id: string): string {
  if (/^[A-Z]/.test(id)) return id.replace(/([a-z])([A-Z])/g, '$1 $2');
  return id
    .split('-')
    .map((part, i) => (i === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(' ');
}

export function componentDocProgress(id: string): { written: number; total: number } {
  const doc = componentDocs[id];
  const total = COMPONENT_DOC_SECTIONS.length;
  if (!doc) return { written: 0, total };
  const sections = splitSections(doc.body);
  const written = COMPONENT_DOC_SECTIONS.filter((h) => isWritten(sections[h])).length;
  return { written, total };
}

/** Token families: the second segment of --weft-<family>-… with colour as the fallback. */
export const TOKEN_FAMILIES: { id: string; label: string; test: (name: string) => boolean }[] = [
  { id: 'font', label: 'Type', test: (n) => /^--(weft-)?(font|text|leading|tracking)/.test(n) },
  { id: 'space', label: 'Space', test: (n) => /^--(weft-)?(space|spacing|gap|pad|inset)/.test(n) },
  { id: 'radius', label: 'Radius', test: (n) => /^--(weft-)?radius/.test(n) },
  { id: 'control', label: 'Controls and targets', test: (n) => /^--(weft-)?(control|touch|focus|ring)/.test(n) },
  { id: 'motion', label: 'Motion', test: (n) => /^--(weft-)?(duration|ease|motion|animate)/.test(n) },
  { id: 'chart', label: 'Charts and categories', test: (n) => /^--(weft-)?(chart|category)/.test(n) },
  { id: 'color', label: 'Colour', test: () => true },
];

/** Short label for a css/weft.css block: its axis values, e.g. "dark · heritage-purple". */
export function tokenBlockLabel(name: string): string {
  if (name === baseBlockName) return 'Base';
  const values = [...name.matchAll(/data-(theme|palette|density)(?:\^?=)"([^"]+)"/g)].map((m) => m[2]);
  const unique = [...new Set(values)];
  return unique.length ? unique.join(' · ') : name;
}

const tokenBlocks = (tokens as { blocks: Record<string, Record<string, string>> }).blocks;
export const tokenBlockNames = Object.keys(tokenBlocks);
export const baseBlockName = tokenBlockNames.find((n) => n.startsWith(':root, :root[data-palette="weft"]')) ?? tokenBlockNames[0];

export function tokensForFamily(familyId: string): { name: string; values: Record<string, string> }[] {
  const family = TOKEN_FAMILIES.find((f) => f.id === familyId);
  if (!family) return [];
  const names = new Set<string>();
  for (const block of Object.values(tokenBlocks)) for (const name of Object.keys(block)) names.add(name);
  const earlier = TOKEN_FAMILIES.slice(0, TOKEN_FAMILIES.indexOf(family));
  return [...names]
    .filter((n) => family.test(n) && !earlier.some((f) => f.test(n)))
    .sort()
    .map((name) => ({
      name,
      values: Object.fromEntries(
        Object.entries(tokenBlocks)
          .filter(([, block]) => name in block)
          .map(([blockName, block]) => [blockName, block[name]]),
      ),
    }));
}

export function buildNav(): NavGroup[] {
  const groups: NavGroup[] = [];
  groups.push({
    id: 'guidelines',
    label: 'Guidelines',
    section: 'guidelines',
    items: guidelineDocs.map((d) => ({ id: d.file.split('/').pop()!.replace(/\.md$/, ''), label: d.title, section: 'guidelines' })),
  });
  groups.push({
    id: 'tokens',
    label: 'Tokens',
    section: 'tokens',
    items: TOKEN_FAMILIES.map((f) => ({ id: f.id, label: f.label, section: 'tokens' })),
  });
  for (const category of categoryOrder) {
    const items = primitives
      .filter((p) => p.category === category)
      .sort((a, b) => displayTitle(a.id).localeCompare(displayTitle(b.id), undefined, { sensitivity: 'base' }))
      .map((p) => ({ id: p.id, label: displayTitle(p.id), section: 'components' as const, ...componentDocProgress(p.id) }));
    if (items.length) groups.push({ id: `components-${category}`, label: categoryLabels[category] ?? category, section: 'components', items });
  }
  groups.push({
    id: 'patterns',
    label: 'Patterns',
    section: 'patterns',
    items: patterns.map((p) => ({ id: p.id, label: p.title, section: 'patterns' })),
  });
  groups.push({
    id: 'templates',
    label: 'Templates',
    section: 'templates',
    items: templates.map((t) => ({ id: t.id, label: t.title ?? displayTitle(t.id), section: 'templates' })),
  });
  return groups;
}

export function patternsUsing(id: string): Pattern[] {
  return patterns.filter((p) => p.uses.includes(id));
}

export function templatesUsing(id: string): Template[] {
  return templates.filter((t) => (t.composes ?? []).includes(id));
}
