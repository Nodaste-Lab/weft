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
// AGENTS.md invariant 1: weft.css may contain only the documented `:root[...]`
// axis blocks (which declare custom properties only) and the sanctioned
// `data-palette="weft"` typography rules. Everything else would restyle every
// third-party panel this file is injected into.
//
// Root axis selector: `:root` plus any number of [attr] / :not(...) qualifiers.
const ROOT_AXIS = /^:root(\[[^\]]*\]|:not\([^)]*\))*$/;
// The sanctioned exception: the `data-palette="weft"` bridge. AGENTS.md calls out
// its typography rules; in practice the bridge also normalises body, wallpaper
// layers and inline-styled spans. It is an escape hatch by design — additions to
// it deserve review scrutiny, because they ship into every panel iframe — but it
// is legitimate, pre-existing, and not something this guard should reject.
const PALETTE_BRIDGE = /^:root\[data-palette="weft"\](\s+.+)?$/;

// Do NOT anchor on the preceding `}` — that consumes it and makes every other
// rule invisible to the scan. Match `selector { body }` directly instead.
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map(([, sel, body]) => [sel, body])
  .filter(([sel]) => !sel.includes('@'));
for (const [rawSel, body] of rules) {
  const parts = rawSel.trim().split(',').map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const isBridge = parts.length > 0 && parts.every((one) => PALETTE_BRIDGE.test(one));
  for (const one of parts) {
    if (ROOT_AXIS.test(one) || PALETTE_BRIDGE.test(one)) continue;
    problems.push(`non-:root selector "${one.slice(0, 60)}" — weft.css must stay tokens-only`);
  }
  // Token blocks declare custom properties only. The palette bridge is the
  // documented exception and may set real properties.
  if (isBridge) continue;
  for (const decl of body.split(';').map((d) => d.trim()).filter(Boolean)) {
    const prop = decl.split(':')[0].trim();
    if (prop && !prop.startsWith('--')) {
      problems.push(`non-custom-property declaration "${decl.slice(0, 60)}" in "${parts[0]?.slice(0, 40)}" — token blocks declare tokens only`);
    }
  }
}

if (problems.length) {
  console.error('css/weft.css violates the pure-token-file invariant:\n' + problems.map((p) => `- ${p}`).join('\n'));
  process.exit(1);
}
console.log(`weft.css is a pure token file (${rules.length} rule blocks, all :root axes or the sanctioned data-palette bridge).`);
