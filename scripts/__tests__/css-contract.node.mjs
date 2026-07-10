import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractTokenBlocks, stripCssComments } from '../design-system-tokens.mjs';

// CSS semantics that consumers build on. These are the behaviors the 0.1.1
// multi-consumer patch introduced (see AGENTS.md); reverting any of them is a
// breaking change even though every pixel-test that sets data-theme="dark"
// exactly would stay green.

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const weft = readFileSync(join(ROOT, 'css', 'weft.css'), 'utf8');
const components = readFileSync(join(ROOT, 'css', 'weft-components.css'), 'utf8');

test('dark-mode selectors accept any dark-prefixed theme (doct dark-high-contrast)', () => {
  for (const [name, css] of [['weft.css', weft], ['weft-components.css', components]]) {
    const exact = [...stripCssComments(css).matchAll(/\[data-theme="dark"\]/g)];
    assert.equal(
      exact.length,
      0,
      `${name} has ${exact.length} exact [data-theme="dark"] selector(s) — use [data-theme^="dark"] so `
      + 'presets like dark-high-contrast activate dark styling',
    );
    assert.ok(/\[data-theme\^="dark"\]/.test(css) || !/data-theme/.test(css),
      `${name} should key dark styling off [data-theme^="dark"]`);
  }
});

test('the weft body rule consumes the bridged flat tokens (host customizer contract)', () => {
  const body = weft.match(/:root\[data-palette="weft"\] body \{([^}]*)\}/);
  assert.ok(body, 'weft.css must keep the [data-palette="weft"] body rule');
  assert.match(body[1], /background:\s*var\(--background,\s*var\(--weft-cream\)\)/,
    'body background must read var(--background, var(--weft-cream)) so host inline overrides win');
  assert.match(body[1], /color:\s*var\(--foreground,\s*var\(--weft-ink\)\)/,
    'body color must read var(--foreground, var(--weft-ink))');
});

test('the bridge exposes flat success/warning tokens', () => {
  const blocks = extractTokenBlocks(weft);
  const bridge = blocks[':root[data-palette="weft"]'];
  assert.ok(bridge, 'bridge block must exist');
  for (const token of ['--success', '--success-foreground', '--warning', '--warning-foreground']) {
    assert.ok(bridge[token], `bridge must define ${token}`);
  }
});

test('weft tokens resolve WITHOUT the palette attribute (vendored-CSS hosts)', () => {
  // plan-reviewer links the raw token file with no data-palette on <html>;
  // the base block must therefore carry the --weft-* namespace at bare :root.
  assert.match(weft, /:root,\s*\n:root\[data-palette="weft"\]\s*\{/,
    'base token block must match plain :root as well as the weft palette');
});

// ---------------------------------------------------------------------------
// Contrast contract: the AA claims in weft.css comments, made executable.
// A token value change must keep these pairs ≥ their floors (and the
// token-value lockfile makes any change explicit in review).

const luminance = (hex) => {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('token pairs hold their documented contrast floors', () => {
  const blocks = extractTokenBlocks(weft);
  const base = blocks[':root, :root[data-palette="weft"]'] ?? blocks[':root'];
  const dark = blocks[':root[data-theme^="dark"][data-palette="weft"], :root[data-theme^="dark"]:not([data-palette])'];
  assert.ok(base && dark, 'base and weft dark blocks must be extractable');
  const hex = (block, token) => {
    const value = block[token];
    assert.ok(value, `token ${token} must exist`);
    const m = value.match(/#[0-9a-fA-F]{6}/);
    assert.ok(m, `token ${token} must be a hex color (got: ${value})`);
    return m[0];
  };
  const pairs = [
    ['ink on cream (light)', hex(base, '--weft-ink'), hex(base, '--weft-cream'), 7],
    ['ink on cream (dark)', hex(dark, '--weft-ink'), hex(dark, '--weft-cream'), 7],
    ['warn text on cream', hex(base, '--weft-warn'), hex(base, '--weft-cream'), 4.5],
    ['warn text on white', hex(base, '--weft-warn'), hex(base, '--weft-fixed-white'), 4.5],
    ['ok text on cream', hex(base, '--weft-ok'), hex(base, '--weft-cream'), 4.5],
    ['white on warn (badge)', hex(base, '--weft-fixed-white'), hex(base, '--weft-warn'), 4.5],
    ['white on ok (badge)', hex(base, '--weft-fixed-white'), hex(base, '--weft-ok'), 4.5],
    ['white on blue (primary)', hex(base, '--weft-fixed-white'), hex(base, '--weft-blue'), 4.5],
  ];
  const failures = pairs
    .map(([name, fg, bg, floor]) => ({ name, r: ratio(fg, bg), floor }))
    .filter(({ r, floor }) => r < floor);
  assert.equal(
    failures.length,
    0,
    'contrast floors broken:\n' + failures.map((f) => `  ${f.name}: ${f.r.toFixed(2)} < ${f.floor}`).join('\n'),
  );
});
