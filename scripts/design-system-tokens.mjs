#!/usr/bin/env node
// Token-value lockfile (the tokens analog of the prop-contract gate).
//
// tokens-snapshot.json is the committed record of every custom-property
// VALUE per selector block in css/weft.css. Changing a value is a consumer-
// visible act (Heddle injects this file into third-party panel iframes), so
// it must arrive with a designSystemVersion bump in the same change —
// reviewable as a JSON diff instead of pixel archaeology.
//
//   node scripts/design-system-tokens.mjs          # verify (CI gate)
//   node scripts/design-system-tokens.mjs --write  # re-baseline after a bump

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = join(ROOT, 'css', 'weft.css');
const SNAPSHOT = join(ROOT, 'tokens-snapshot.json');
const WRITE = process.argv.includes('--write');

export function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

export function extractTokenBlocks(rawCss) {
  const css = stripCssComments(rawCss);
  const blocks = {};
  // Top-level selector blocks only; weft.css is a pure token file so every
  // block is `selector { --token: value; ... }` with no nesting.
  const re = /(^|\n)([^{}\n][^{}]*?)\s*\{([^{}]*)\}/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    const selector = match[2].trim().replace(/\s+/g, ' ');
    const body = match[3];
    const tokens = {};
    for (const decl of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      tokens[decl[1]] = decl[2].trim().replace(/\s+/g, ' ');
    }
    if (Object.keys(tokens).length === 0) continue;
    if (!blocks[selector]) blocks[selector] = {};
    Object.assign(blocks[selector], tokens);
  }
  return blocks;
}

function currentVersion() {
  return JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
}

import { pathToFileURL } from 'node:url';
const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) main();

function main() {
const live = { designSystemVersion: currentVersion(), blocks: extractTokenBlocks(readFileSync(CSS, 'utf8')) };

if (WRITE) {
  writeFileSync(SNAPSHOT, JSON.stringify(live, null, 2) + '\n');
  const count = Object.values(live.blocks).reduce((n, b) => n + Object.keys(b).length, 0);
  console.log(`Wrote tokens-snapshot.json (${Object.keys(live.blocks).length} blocks, ${count} declarations, DS v${live.designSystemVersion}).`);
  process.exit(0);
}

if (!existsSync(SNAPSHOT)) {
  console.error('Missing tokens-snapshot.json. Run: node scripts/design-system-tokens.mjs --write');
  process.exit(1);
}
const committed = JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
const problems = [];
const allSelectors = new Set([...Object.keys(committed.blocks), ...Object.keys(live.blocks)]);
for (const selector of allSelectors) {
  const c = committed.blocks[selector] ?? {};
  const l = live.blocks[selector] ?? {};
  for (const token of new Set([...Object.keys(c), ...Object.keys(l)])) {
    if (c[token] === l[token]) continue;
    if (!(token in c)) problems.push(`  + ${selector} ${token}: ${l[token]} (new)`);
    else if (!(token in l)) problems.push(`  - ${selector} ${token} removed (was ${c[token]})`);
    else problems.push(`  ~ ${selector} ${token}: ${c[token]} -> ${l[token]}`);
  }
}

if (problems.length && committed.designSystemVersion === live.designSystemVersion) {
  console.error(
    'Token-value gate FAILED — css/weft.css changed without a designSystemVersion bump.\n'
    + 'These values are injected verbatim into third-party panel iframes; changing them is a\n'
    + 'consumer-visible release. Bump the version (package.json + manifest.json), then\n'
    + 'run: node scripts/design-system-tokens.mjs --write\n\n'
    + problems.join('\n'),
  );
  process.exit(1);
}
if (problems.length) {
  console.error(
    'tokens-snapshot.json is out of date for DS v' + live.designSystemVersion + ' — regenerate and commit it:\n'
    + '  node scripts/design-system-tokens.mjs --write\n\n' + problems.join('\n'),
  );
  process.exit(1);
}
console.log(`Token values OK (${Object.keys(live.blocks).length} blocks match snapshot, DS v${live.designSystemVersion}).`);
}
