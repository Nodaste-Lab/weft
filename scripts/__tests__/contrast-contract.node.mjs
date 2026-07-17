import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractTokenBlocks } from '../design-system-tokens.mjs';

/**
 * Contrast contract.
 *
 * A palette is not just a list of hexes — every colour we tell consumers to put
 * on paper has to stay legible on that paper, in EVERY theme. Weft flips its
 * surfaces for dark mode, so a semantic hue that does not flip with them
 * silently becomes unreadable.
 *
 * This exists because exactly that happened: --weft-ok and --weft-stop were
 * omitted from the dark block while warn/danger/info were included. They kept
 * their light-mode values on dark paper and measured 3.34:1 and 2.68:1 — well
 * under the 4.5:1 AA floor — and it took a human noticing "the green looks
 * wrong" to catch it. A palette bug should fail here, not in review.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const css = readFileSync(join(ROOT, 'css', 'weft.css'), 'utf8');

const AA_NORMAL = 4.5;

/**
 * Colours a consumer renders as TEXT on --weft-paper. Fills and accents are out
 * of scope — --weft-blue backs the avatar chip rather than setting text, and
 * --weft-link is the text-coloured member of that family.
 */
const ON_PAPER = ['--weft-ink', '--weft-muted', '--weft-ok', '--weft-stop', '--weft-warn', '--weft-danger', '--weft-info'];

/**
 * Pre-existing failures, recorded so this gate can land without a drive-by
 * recolour of the brand palette. It ratchets: anything NEW fails immediately,
 * and these must shrink, never grow.
 *
 * Each is a real AA failure for normal text and wants a design decision, not a
 * unilateral hex change — --weft-info in particular is badly under (2.54:1).
 */
const KNOWN_FAILURES = new Set([
  'light: --weft-danger',
  'light: --weft-info',
]);

function parseHex(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  return match ? match[1] : null;
}

function relativeLuminance(hex) {
  const channels = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The blocks that make up the default Weft palette: the base :root and the dark
 * override. Selected by exact intent — matching on "dark" alone also catches
 * the heritage-purple and hud-glass dark blocks, which are separate palettes
 * with their own rules.
 */
function weftBlocks(blocks) {
  const names = Object.keys(blocks);
  const base = names.find((n) => n.includes(':root,') || n === ':root[data-palette="weft"]' || /^:root(?!\[data-(theme|density|fonts))/.test(n) && n.includes('weft'));
  const dark = names.find((n) => n.includes('data-theme^="dark"') && n.includes('data-palette="weft"'));
  return { base: blocks[base] ?? {}, dark: blocks[dark] ?? {}, baseName: base, darkName: dark };
}

/** Resolve a token in a theme, falling back to the base palette. */
function resolve(base, theme, token) {
  return theme[token] ?? base[token] ?? null;
}

test('every on-paper colour meets WCAG AA against the paper it sits on, in both themes', () => {
  const { base, dark, baseName, darkName } = weftBlocks(extractTokenBlocks(css));
  assert.ok(baseName, 'could not find the base Weft palette block');
  assert.ok(darkName, 'could not find the dark Weft palette block');

  const failures = [];
  for (const [label, theme] of [['light', base], ['dark', dark]]) {
    const paper = parseHex(resolve(base, theme, '--weft-paper') ?? '');
    if (!paper) continue;
    for (const token of ON_PAPER) {
      const raw = resolve(base, theme, token);
      const hex = raw ? parseHex(raw) : null;
      // Non-hex (var()/rgba()) values are out of scope for this static check.
      if (!hex) continue;
      const ratio = contrast(hex, paper);
      if (ratio >= AA_NORMAL) {
        // A known failure that now passes: drop it from the baseline.
        assert.ok(
          !KNOWN_FAILURES.has(`${label}: ${token}`),
          `${label}: ${token} now meets AA — remove it from KNOWN_FAILURES so it stays fixed.`,
        );
        continue;
      }
      if (KNOWN_FAILURES.has(`${label}: ${token}`)) continue;
      failures.push(`${label}: ${token} (#${hex}) on --weft-paper (#${paper}) = ${ratio.toFixed(2)}:1, needs ${AA_NORMAL}`);
    }
  }

  assert.deepEqual(
    failures,
    [],
    `Colours below the AA floor on their own paper:\n  ${failures.join('\n  ')}\n\n` +
      'A semantic hue that does not flip with the surface goes unreadable in dark mode. ' +
      'Add a dark-mode value in the dark block alongside warn/danger/info.',
  );
});

test('semantic status colours all flip for dark mode, or none do', () => {
  const { dark, darkName } = weftBlocks(extractTokenBlocks(css));
  assert.ok(darkName, 'could not find the dark Weft palette block');

  // ok/stop were missed while warn/danger/info were flipped. Treating the set
  // as all-or-nothing makes the omission loud instead of invisible.
  const status = ['--weft-ok', '--weft-stop', '--weft-warn', '--weft-danger', '--weft-info'];
  const flipped = status.filter((token) => dark[token]);
  const missing = status.filter((token) => !dark[token]);

  assert.equal(
    missing.length,
    0,
    `These semantic colours have no dark-mode value while ${flipped.join(', ')} do: ${missing.join(', ')}. ` +
      'Partial flipping is how --weft-ok ended up dark-green on dark paper.',
  );
});
