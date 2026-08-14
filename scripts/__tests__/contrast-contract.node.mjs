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
const componentsCss = readFileSync(join(ROOT, 'css', 'weft-components.css'), 'utf8');

const AA_NORMAL = 4.5;

/**
 * Colours a consumer renders as TEXT on --weft-paper. Fills and accents are out
 * of scope — --weft-blue backs the avatar chip rather than setting text;
 * --weft-link is the text-coloured member of that family, so it IS in scope.
 */
// --weft-info is ABSENT from this list by owner decision (Katie, 2026-08-14):
// it is not an on-paper text token. Its light value (#60a5fa, 2.54:1 on
// white) stays for non-text uses (encoding, dots, callout and badge borders)
// and for dark-canvas text (the board's provenance badge, 6.8:1+ there);
// info-as-text on paper/cream rides --weft-info-text, which IS measured
// here. The split is enforced below: no field-hint rule may paint with the
// bare token.
const ON_PAPER = ['--weft-ink', '--weft-muted', '--weft-link', '--weft-ok', '--weft-stop', '--weft-warn', '--weft-danger', '--weft-info-text'];

/**
 * Pre-existing failures, recorded so this gate can land without a drive-by
 * recolour of the brand palette. It ratchets: anything NEW fails immediately,
 * and these must shrink, never grow.
 *
 * Each is a real AA failure for normal text and wants a design decision, not
 * a unilateral hex change. --weft-info's entries came OUT on 2026-08-14 when
 * the owner settled its decision as a split (see the ON_PAPER note above);
 * --weft-danger's decision remains open.
 */
const KNOWN_FAILURES = new Set([
  'light: --weft-danger',
  // The same hue on the tinted-fill surface (fill-soft over paper,
  // marginally less contrast than paper itself). Not a new failure — the
  // same open design decision, measured on a second surface.
  'light tinted: --weft-danger',
]);

function parseHex(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value.trim());
  return match ? match[1] : null;
}

function parseRgba(value) {
  const match = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0?\.\d+)\s*\)$/.exec(value.trim());
  return match ? { rgb: [+match[1], +match[2], +match[3]], alpha: +match[4] } : null;
}

/** Alpha-composite an rgb triple over an opaque hex surface → hex. */
function composite(rgb, alpha, underHex) {
  const under = [0, 2, 4].map((i) => parseInt(underHex.slice(i, i + 2), 16));
  return rgb
    .map((v, i) => Math.round(alpha * v + (1 - alpha) * under[i]))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');
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

/** Resolve a token in a theme, falling back to the base palette. Follows
 *  var() indirection (light --weft-link is var(--weft-blue)). */
function resolve(base, theme, token, depth = 0) {
  const raw = theme[token] ?? base[token] ?? null;
  if (raw === null || depth > 4) return raw;
  const ref = /^var\((--[\w-]+)\)$/.exec(raw.trim());
  return ref ? resolve(base, theme, ref[1], depth + 1) : raw;
}

test('every on-paper colour meets WCAG AA against the surfaces it sits on, in both themes', () => {
  const { base, dark, baseName, darkName } = weftBlocks(extractTokenBlocks(css));
  assert.ok(baseName, 'could not find the base Weft palette block');
  assert.ok(darkName, 'could not find the dark Weft palette block');

  const failures = [];
  for (const [themeLabel, theme] of [['light', base], ['dark', dark]]) {
    const paper = parseHex(resolve(base, theme, '--weft-paper') ?? '');
    if (!paper) continue;
    // Text also sits on --weft-fill-soft washes (section backgrounds, drawer
    // rows). Composite the wash over paper: that tinted surface always sits
    // slightly closer to the text colour than paper itself, and it is where
    // --weft-link first dipped under AA in the wild (4.27:1 on the tint while
    // still 4.58:1 on paper — caught by an axe pass in Heddle, not here).
    const fill = parseRgba(resolve(base, theme, '--weft-fill-soft') ?? '');
    const surfaces = [['', '--weft-paper', paper]];
    if (fill) surfaces.push([' tinted', '--weft-fill-soft over paper', composite(fill.rgb, fill.alpha, paper)]);
    for (const [surfaceLabel, surfaceName, surface] of surfaces) {
      const label = `${themeLabel}${surfaceLabel}`;
      for (const token of ON_PAPER) {
        const raw = resolve(base, theme, token);
        const hex = raw ? parseHex(raw) : null;
        // Non-hex (unresolved var()/rgba()) values are out of scope for this static check.
        if (!hex) continue;
        const ratio = contrast(hex, surface);
        if (ratio >= AA_NORMAL) {
          // A known failure that now passes: drop it from the baseline.
          assert.ok(
            !KNOWN_FAILURES.has(`${label}: ${token}`),
            `${label}: ${token} now meets AA — remove it from KNOWN_FAILURES so it stays fixed.`,
          );
          continue;
        }
        if (KNOWN_FAILURES.has(`${label}: ${token}`)) continue;
        failures.push(`${label}: ${token} (#${hex}) on ${surfaceName} (#${surface}) = ${ratio.toFixed(2)}:1, needs ${AA_NORMAL}`);
      }
    }
  }

  assert.deepEqual(
    failures,
    [],
    `Colours below the AA floor on the surfaces they sit on:\n  ${failures.join('\n  ')}\n\n` +
      'A semantic hue that does not flip with the surface goes unreadable in dark mode, ' +
      'and a hue that only just clears paper can still fail on the fill-soft tint. ' +
      'Add or lift the dark-mode value in the dark block alongside warn/danger/info.',
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

/** Redmean colour separation — a cheap perceptual distance for "are these two
 *  distinguishable". Used to keep the category palette from collapsing the way
 *  --weft-chart-* does (chart-2 vs chart-5 separate by only 69). */
function redmeanDistance(a, b) {
  const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const rm = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db);
}

test('the category palette encodes on the dark panel canvas — visible, separated, AA on-colour, never a status hue', () => {
  // NOD-1287 (D-24). The category palette is a fixed, theme-independent set of
  // hue-spread encoders (per-space colour on Scratchpad notes). It must not
  // repeat --weft-chart-*'s failures on the dark panel: an invisible strip
  // (chart-2 at 2.68:1), indistinguishable pairs, or a danger-red category.
  const { base, dark } = weftBlocks(extractTokenBlocks(css));
  const canvas = parseHex(resolve(base, dark, '--weft-paper') ?? ''); // Weft Dark panel paper
  assert.ok(canvas, 'need a dark --weft-paper canvas to test the category palette against');

  const cats = [1, 2, 3, 4, 5, 6].map((n) => {
    const hex = parseHex(base[`--weft-category-${n}`] ?? '');
    assert.ok(hex, `--weft-category-${n} must be a plain hex token`);
    return hex;
  });
  const onCategory = parseHex(base['--weft-on-category'] ?? '');
  assert.ok(onCategory, '--weft-on-category must be a plain hex token');

  const UI_FLOOR = 3; // WCAG non-text UI contrast floor
  const SEPARATION_FLOOR = 120; // redmean; the six spread to ~170 min

  // 1) Every value is visible against the panel canvas.
  for (let i = 0; i < cats.length; i += 1) {
    const ratio = contrast(cats[i], canvas);
    assert.ok(
      ratio >= UI_FLOOR,
      `--weft-category-${i + 1} (#${cats[i]}) is ${ratio.toFixed(2)}:1 on the panel (#${canvas}) — below the ${UI_FLOOR}:1 UI floor.`,
    );
  }

  // 2) One dark on-colour clears AA on every category (D-23 puts header text on these).
  for (let i = 0; i < cats.length; i += 1) {
    const ratio = contrast(onCategory, cats[i]);
    assert.ok(
      ratio >= AA_NORMAL,
      `--weft-on-category (#${onCategory}) on --weft-category-${i + 1} (#${cats[i]}) is ${ratio.toFixed(2)}:1 — below AA ${AA_NORMAL}.`,
    );
  }

  // 3) No two categories are indistinguishable.
  for (let i = 0; i < cats.length; i += 1) {
    for (let j = i + 1; j < cats.length; j += 1) {
      const d = redmeanDistance(cats[i], cats[j]);
      assert.ok(
        d >= SEPARATION_FLOOR,
        `--weft-category-${i + 1} and --weft-category-${j + 1} separate by only ${d.toFixed(0)} (floor ${SEPARATION_FLOOR}).`,
      );
    }
  }

  // 4) Never built from a semantically loaded status hue.
  const stop = parseHex(resolve(base, dark, '--weft-stop') ?? '') ?? parseHex(base['--weft-stop'] ?? '');
  const warn = parseHex(resolve(base, dark, '--weft-warn') ?? '') ?? parseHex(base['--weft-warn'] ?? '');
  for (let i = 0; i < cats.length; i += 1) {
    assert.notEqual(cats[i], stop, `--weft-category-${i + 1} must not be --weft-stop (a danger-red category reads as an error).`);
    assert.notEqual(cats[i], warn, `--weft-category-${i + 1} must not be --weft-warn.`);
  }
});

/**
 * On-primary marks must contrast with the primary they sit on, IN EVERY PALETTE.
 *
 * This exists because dark heritage-purple shipped without it. That block lifts
 * --weft-blue to violet-300 (#c4b5fd) and correctly sets --primary-foreground to
 * dark ink — the flat shadcn token the React primitives read — while the whole
 * --weft-on-blue tier, which is what the plain-CSS component layer reads, went on
 * inheriting white from the light block. So the same palette rendered a React
 * button at 9.9:1 and a `.weft-btn` at 1.85:1, with the plain-CSS layer that a
 * sandboxed panel iframe receives being the broken half. The palette's own
 * comment already stated the correct value.
 *
 * Checked over every palette block that declares a primary, so a new palette
 * cannot repeat it by being forgotten. `--weft-on-blue` carries text and is held
 * to AA; the rule and dot tiers are decorative and are not checked here.
 */
test('the info split holds: no field-hint rule paints with the bare info token', () => {
  // The owner decision (2026-08-14) that closed --weft-info's open contrast
  // entry is a SPLIT, and a split needs a counter-guard on each side: the
  // paper-surface text this stage owns must ride --weft-info-text, never the
  // bare token — a future hint rule reaching for var(--weft-info) would
  // reopen the 2.54:1 failure while every declaration gate stayed green.
  const offenders = [...componentsCss.matchAll(/\.weft-field-hint[^{]*\{[^}]*var\(--weft-info\)/g)].map(
    (m) => m[0].slice(0, 60),
  );
  assert.deepEqual(
    offenders,
    [],
    `field-hint rules painting with bare --weft-info (2.54:1 as light text):\n  ${offenders.join('\n  ')}`,
  );
});

test('the text-grade info token is defined in every block whose canvas flips', () => {
  // --weft-info-text exists because light --weft-info fails AA as text and its
  // lift is an open design decision. The trap is inheritance: hud-glass is a
  // dark palette IN ITS OWN RIGHT (the chevron lesson) and the dark theme
  // blocks flip the canvas — any of them inheriting the light text blue would
  // paint a near-invisible status. So every block that flips the canvas must
  // declare its own value; the base declaration alone is not coverage.
  const blocks = extractTokenBlocks(css);
  const mustDeclare = Object.keys(blocks).filter(
    (name) => name.includes('data-theme^="dark"') || name.includes('hud-glass'),
  );
  assert.ok(mustDeclare.length >= 3, `expected the dark and hud-glass blocks, found ${mustDeclare.length}`);
  const missing = mustDeclare.filter((name) => !blocks[name]['--weft-info-text']);
  assert.deepEqual(
    missing,
    [],
    `--weft-info-text is inherited from the LIGHT palette here, onto a dark canvas:\n  ${missing.join('\n  ')}`,
  );
  // And the base block must declare it at all: ON_PAPER silently skips a
  // token that does not resolve to a hex, so WITHOUT this assertion, deleting
  // the declaration entirely would leave every contrast check green while the
  // status hint fell back to inherited text colour. Found by a probe whose
  // restore step had quietly reverted the uncommitted declaration — the gate
  // passed on a token that did not exist.
  const { base, baseName } = weftBlocks(blocks);
  assert.ok(baseName, 'could not find the base Weft palette block');
  assert.ok(
    base['--weft-info-text'],
    'the base Weft palette does not declare --weft-info-text — the AA status text has no colour',
  );
});

test('--weft-on-blue meets AA against --weft-blue in every palette that sets one', () => {
  const blocks = extractTokenBlocks(css);
  const base = blocks[Object.keys(blocks).find((n) => n.includes(':root,'))] ?? {};

  const failures = [];
  const checked = [];
  for (const [selector, tokens] of Object.entries(blocks)) {
    // Only blocks that redefine the primary can break the pairing.
    if (!('--weft-blue' in tokens)) continue;
    const primary = parseHex(tokens['--weft-blue'] ?? '');
    if (!primary) continue;  // translucent primaries are out of scope for a static check

    const onBlueRaw = tokens['--weft-on-blue'] ?? base['--weft-on-blue'];
    const onBlue = parseRgba(onBlueRaw ?? '');
    if (!onBlue) continue;
    // The tier is alpha over the primary, so composite before measuring.
    const ratio = contrast(composite(onBlue.rgb, onBlue.alpha, primary), primary);
    checked.push(`${selector}: ${ratio.toFixed(2)}:1`);
    if (ratio < AA_NORMAL) {
      failures.push(
        `${selector}: --weft-on-blue on --weft-blue #${primary} = ${ratio.toFixed(2)}:1 ` +
          `(needs ${AA_NORMAL}:1). A palette that redefines --weft-blue has to redefine the ` +
          `--weft-on-blue tier with it, or the plain-CSS layer paints white on a light primary.`,
      );
    }
  }

  assert.ok(checked.length >= 2, `expected several palettes with a primary, checked ${checked.length}`);
  assert.deepEqual(failures, [], failures.join('\n'));
});
