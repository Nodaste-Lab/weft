/**
 * React template contract guard — fails closed for every manifest template
 * with `kind: "react"`.
 *
 *   R1  Registry: path is src/templates/<id>.tsx and exists; fixture exists
 *       beside it; docs exist and name the template; no classPrefix (that is
 *       the CSS-template field); composes[] names real manifest primitives.
 *   R2  Composition only: the template imports react, lucide-react and
 *       ../ui/* — nothing else. No gallery, no app code, no CSS, no fixture.
 *   R3  Token-only: no raw colour literals, no --hud-* references.
 *   R4  Honest empties: the template never imports its fixture, and the
 *       fixture imports only types from the template.
 *   R5  Displayed: the gallery imports the template and its fixture.
 *   R6  Shipped: src/index.ts re-exports the template (dist parity).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAW_COLOR_PATTERN } from '../../tooling/raw-color-pattern.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest.json'), 'utf8'));
const reactTemplates = (manifest.templates ?? []).filter((t) => t.kind === 'react');
const primitiveIds = new Set(manifest.uiPrimitives.map((p) => p.id));
const gallerySrc = readFileSync(join(ROOT, 'src', 'gallery', 'DesignSystemUiGallery.tsx'), 'utf8');
const barrel = readFileSync(join(ROOT, 'src', 'index.ts'), 'utf8');

const IMPORT_RE = /^import\s[^;]*?from\s+['"]([^'"]+)['"]/gm;
const ALLOWED_BARE = new Set(['react', 'lucide-react']);

function importsOf(src) {
  return [...src.matchAll(IMPORT_RE)].map((m) => m[1]);
}

test('at least one react template is registered', () => {
  assert.ok(reactTemplates.length > 0, 'manifest.templates has no entry with kind "react"');
});

for (const t of reactTemplates) {
  const where = `template "${t.id}"`;
  const templatePath = join(ROOT, t.path ?? '');
  const fixturePath = join(ROOT, t.fixture ?? '');

  test(`R1 ${where}: registry fields`, () => {
    assert.equal(t.path, `src/templates/${t.id}.tsx`, `${where} path must be src/templates/${t.id}.tsx`);
    assert.ok(existsSync(templatePath), `${where} path does not exist`);
    assert.equal(t.fixture, `src/templates/${t.id}.fixture.ts`, `${where} fixture must sit beside the template`);
    assert.ok(existsSync(fixturePath), `${where} fixture does not exist`);
    assert.ok(t.docs && existsSync(join(ROOT, t.docs)), `${where} docs missing`);
    const docs = readFileSync(join(ROOT, t.docs), 'utf8');
    assert.ok(docs.includes(`\`${t.id}\``), `${where} docs never name \`${t.id}\``);
    assert.equal(t.classPrefix, undefined, `${where} must not carry classPrefix (CSS-template field)`);
    assert.ok(Array.isArray(t.composes) && t.composes.length > 0, `${where} composes[] is empty`);
    for (const id of t.composes) {
      assert.ok(primitiveIds.has(id), `${where} composes unknown primitive "${id}"`);
    }
  });

  const src = existsSync(templatePath) ? readFileSync(templatePath, 'utf8') : '';
  const fixture = existsSync(fixturePath) ? readFileSync(fixturePath, 'utf8') : '';

  test(`R2 ${where}: imports only react, lucide-react and ../ui/*`, () => {
    for (const spec of importsOf(src)) {
      const ok = ALLOWED_BARE.has(spec) || /^\.\.\/ui\/[\w-]+$/.test(spec);
      assert.ok(ok, `${where} imports "${spec}", which is outside the composition surface`);
    }
    const used = new Set(importsOf(src).filter((s) => s.startsWith('../ui/')).map((s) => s.slice('../ui/'.length)));
    for (const id of t.composes) {
      assert.ok(used.has(id), `${where} declares composes "${id}" but never imports ../ui/${id}`);
    }
    for (const id of used) {
      assert.ok(t.composes.includes(id), `${where} imports ../ui/${id} but composes[] does not list it — the list must name every component used`);
    }
  });

  test(`R3 ${where}: token-only`, () => {
    const hits = src.match(RAW_COLOR_PATTERN) ?? [];
    assert.deepEqual(hits, [], `${where} has raw colour literals: ${hits.join(', ')}`);
    assert.ok(!/--hud-/.test(src), `${where} references --hud-* (deprecated alias layer)`);
  });

  test(`R4 ${where}: template never imports its fixture; fixture imports only types`, () => {
    const fixtureImport = importsOf(src).find((spec) => spec.includes('.fixture'));
    assert.equal(fixtureImport, undefined, `${where} imports its fixture ("${fixtureImport}") — fixture values must not be defaults`);
    const fixtureImports = [...fixture.matchAll(/^import\s+(type\s+)?[^;]*?from\s+['"]([^'"]+)['"]/gm)];
    for (const m of fixtureImports) {
      assert.equal(m[1]?.trim(), 'type', `${where} fixture imports a value from "${m[2]}"; only types are allowed`);
    }
  });

  test(`R5 ${where}: the gallery displays it with its fixture`, () => {
    assert.ok(gallerySrc.includes(`'../templates/${t.id}'`), `gallery does not import ../templates/${t.id}`);
    assert.ok(gallerySrc.includes(`'../templates/${t.id}.fixture'`), `gallery does not import the ${t.id} fixture`);
  });

  test(`R6 ${where}: src/index.ts re-exports it`, () => {
    assert.ok(barrel.includes(`export * from './templates/${t.id}';`), `src/index.ts missing export * from './templates/${t.id}'`);
  });
}
