/**
 * Site documentation contract — the design-system site is navigable only if
 * every page has a known source and every doc follows the fixed shape.
 *
 *   S1  docs/components/<id>.md names a manifest primitive.
 *   S2  Every component doc carries the fixed `## ` headings, in order:
 *       Purpose, When to use, When not to use, How to use, Heuristics,
 *       Content, Accessibility. A section may say "Not yet written."; it may
 *       not be missing.
 *   S3  Component doc frontmatter `related` names manifest primitives.
 *   S4  docs/patterns/<id>.md names a manifest pattern.
 *   S5  Every manifest pattern has a doc (own file or register) or is
 *       explicitly unwritten (no docs field); a docs field must resolve.
 *   S6  Every react template's register doc has a `## \`<id>\`` entry.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));
const primitiveIds = new Set(manifest.uiPrimitives.map((p) => p.id).filter((id) => !id.endsWith('.figma')));
const patternIds = new Set((manifest.patterns ?? []).map((p) => p.id));

export const COMPONENT_DOC_SECTIONS = ['Purpose', 'When to use', 'When not to use', 'How to use', 'Heuristics', 'Content', 'Accessibility'];

function mdFiles(dir) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full).filter((f) => f.endsWith('.md')).sort();
}

function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { data: {}, body: src };
  const data = {};
  let listKey = null;
  for (const line of m[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { data[listKey].push(item[1].trim()); continue; }
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    if (kv[2] === '') { listKey = kv[1]; data[listKey] = []; } else { listKey = null; data[kv[1]] = kv[2].trim(); }
  }
  return { data, body: src.slice(m[0].length) };
}

for (const file of mdFiles('docs/components')) {
  const id = file.replace(/\.md$/, '');
  const src = readFileSync(join(ROOT, 'docs', 'components', file), 'utf8');
  const { data, body } = frontmatter(src);

  test(`S1 docs/components/${file} names a primitive`, () => {
    assert.ok(primitiveIds.has(id), `"${id}" is not a manifest primitive`);
  });

  test(`S2 docs/components/${file} carries the fixed headings in order`, () => {
    const headings = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
    assert.deepEqual(headings, COMPONENT_DOC_SECTIONS, `headings are ${JSON.stringify(headings)}`);
  });

  test(`S3 docs/components/${file} related[] names primitives`, () => {
    for (const rel of data.related ?? []) {
      assert.ok(primitiveIds.has(rel), `related "${rel}" is not a manifest primitive`);
    }
  });
}

for (const file of mdFiles('docs/patterns')) {
  const id = file.replace(/\.md$/, '');
  test(`S4 docs/patterns/${file} names a pattern`, () => {
    assert.ok(patternIds.has(id), `"${id}" is not a manifest pattern`);
  });
}

for (const p of manifest.patterns ?? []) {
  test(`S5 pattern "${p.id}" doc resolves when set`, () => {
    if (p.docs) assert.ok(existsSync(join(ROOT, p.docs)), `${p.docs} does not exist`);
  });
}

for (const t of (manifest.templates ?? []).filter((t) => t.kind === 'react')) {
  test(`S6 template "${t.id}" has a register entry`, () => {
    const doc = readFileSync(join(ROOT, t.docs), 'utf8');
    assert.ok(new RegExp(`^## \`${t.id}\``, 'm').test(doc), `${t.docs} has no "## \`${t.id}\`" entry`);
  });
}
