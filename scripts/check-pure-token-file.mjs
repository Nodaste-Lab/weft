#!/usr/bin/env node
// Guards the invariant the panel iframe injection depends on: css/weft.css is
// a PURE token file — custom-property definitions on :root[...] selectors
// only. If it ever gains @media blocks, url() references, or component-level
// selectors, injecting it into a sandboxed panel could restyle panel content
// (or break under the iframe's data:-only CSP).
import { readFileSync } from 'node:fs';

const raw = readFileSync(new URL('../css/weft.css', import.meta.url), 'utf8');
const css = raw.replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments before parsing
const problems = [];

if (/@media/.test(css)) problems.push('contains @media — token overrides must key off :root attributes instead');
if (/url\(/.test(css)) problems.push('contains url() — the opaque-origin panel iframe cannot fetch external assets');

// Every selector must target :root (base or attribute-scoped variants).
const selectors = [...css.matchAll(/(^|\})([^{}@]+?)\{/g)].map((m) => m[2].trim());
for (const sel of selectors) {
  if (!sel.startsWith(':root')) problems.push(`non-:root selector "${sel.slice(0, 60)}" — weft.css must stay tokens-only`);
}

if (problems.length) {
  console.error('css/weft.css violates the pure-token-file invariant:\n' + problems.map((p) => `- ${p}`).join('\n'));
  process.exit(1);
}
console.log(`weft.css is a pure token file (${selectors.length} :root selector blocks).`);
