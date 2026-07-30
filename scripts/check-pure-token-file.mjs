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

// CSS escape sequences are rejected outright. `@\69mport "…";` is a perfectly
// legal spelling of `@import`, and `\75 rl(…)` of `url(…)`, so any guard that
// pattern-matches on the literal keyword can be walked straight past. A pure
// token file has no legitimate need for an escape, which makes banning them the
// cheap and total answer: with no backslash in the file, every keyword below is
// spelled the only way it can be spelled.
if (/\\/.test(css)) {
  problems.push('contains a backslash escape — escapes can disguise at-keywords and function names, and a token file needs none');
}

// Blank the *contents* of string literals for the keyword scans below, so an "@"
// or "url(" quoted inside a token value can't raise a false alarm. Escapes are
// rejected above, so no backslash can escape a quote and desynchronise this.
// Only the scans use it — the rule parser keeps the real text, because selectors
// like [style*="text-transform: uppercase"] carry meaning inside their quotes.
const blanked = css.replace(/"[^"]*"|'[^']*'/g, (m) => m[0] + ' '.repeat(m.length - 2) + m[0]);

// Function names are case-insensitive in CSS, and `url ( x )` is valid too.
if (/url\s*\(/i.test(blanked)) {
  problems.push('contains url() — the opaque-origin panel iframe cannot fetch external assets');
}

// At-rules are rejected wholesale, not case by case. The rule parser below only
// ever sees `selector { ... }` pairs, so a statement at-rule — `@import "…";` —
// has no braces and would slip past it entirely, pulling external CSS into every
// sandboxed panel this file is injected into. A pure token file needs no at-rule
// of any kind: the theme/density/palette axes key off :root attributes, which is
// why @media in particular is disallowed. Anything new here is a design change
// that belongs in review, so name it rather than pattern-matching it.
const AT_RULE_NOTES = {
  media: 'token overrides must key off :root attributes instead',
  import: 'the panel iframe must not fetch external stylesheets',
};
// Any "@" in statement position is an at-rule, whatever follows it. The name is
// only used to pick a friendlier message.
for (const [, name] of blanked.matchAll(/(?:^|[;{}])\s*@([a-zA-Z-]*)/g)) {
  const note = AT_RULE_NOTES[name.toLowerCase()] ?? 'weft.css must stay a flat list of :root token blocks';
  problems.push(`contains @${name || '<escaped>'} — ${note}`);
}

// Every selector must target :root (base or attribute-scoped variants).
// AGENTS.md invariant 1: weft.css may contain only the documented `:root[...]`
// axis blocks (which declare custom properties only) and the sanctioned
// `data-palette="weft"` typography rules. Everything else would restyle every
// third-party panel this file is injected into.
//
// Root axis selector: `:root` plus any number of [attr] / :not(...) qualifiers.
const ROOT_AXIS = /^:root(\[[^\]]*\]|:not\([^)]*\))*$/;
// The sanctioned exception is an explicit ALLOWLIST, not a pattern. AGENTS.md
// permits "the data-palette=weft typography rules"; in practice the bridge also
// normalises body, the wallpaper layer and inline-styled uppercase spans. Those
// specific rules are legitimate and pre-existing.
//
// It is deliberately not a wildcard like `:root[data-palette="weft"] <anything>`:
// that would let a future `:root[data-palette="weft"] .weft-board { ... }` ship a
// component rule into every panel iframe this file is injected into. Adding a
// selector here is the review checkpoint — do it consciously, not by regex.
const PALETTE_BRIDGE_ALLOWLIST = new Set([
  ':root[data-palette="weft"] body',
  ':root[data-palette="weft"] [data-hud-layer="wallpaper"]',
  ':root[data-palette="weft"] [style*="text-transform: uppercase"]',
  ...['h1', 'h2', 'h3'].flatMap((h) => [
    `:root[data-palette="weft"] ${h}`,
    `:root[data-palette="weft"] ${h} em`,
    `:root[data-palette="weft"] ${h} i`,
  ]),
]);
const isBridgeSelector = (sel) => PALETTE_BRIDGE_ALLOWLIST.has(sel);

const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .map(([, sel, body]) => [sel, body])
  .filter(([sel]) => !sel.includes('@'));
for (const [rawSel, body] of rules) {
  const parts = rawSel.trim().split(',').map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const isBridge = parts.length > 0 && parts.every(isBridgeSelector);
  for (const one of parts) {
    if (ROOT_AXIS.test(one) || isBridgeSelector(one)) continue;
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
