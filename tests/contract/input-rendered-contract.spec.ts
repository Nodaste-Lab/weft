/**
 * Is a field identifiable as a control, and does a state look like that state?
 *
 * Sampled from composited pixels, never from token pairs. A token-pair
 * calculation cannot see opacity, cannot see one layer over another, and cannot
 * see a later selector removing the border it is computing against — and the
 * last of those has already shipped a bug on this surface: a boundary added as
 * its own selector tied on specificity with `[aria-invalid="true"]` and, being
 * later, won, so every error field rendered with the ordinary border while the
 * diff looked correct.
 *
 * SCOPE OF THE FLOOR. WCAG 1.4.11 exempts inactive components, so `disabled` is
 * measured but not held to 3:1 — it is instead required to look different from
 * an editable control, below. Every other state is in scope, read-only included:
 * it is focusable and its value is exposed, so a user has to be able to find it.
 *
 * The panel surface is deliberately absent here. `hud-glass` is an overlay
 * palette designed to sit on Heddle's dark canvas; rendered standalone on this
 * page it composites over white and measures a surface no consumer has. The
 * panel condition is tested where it actually exists — consumer-iframe.spec.ts.
 */
import { expect, test } from '@playwright/test';
import {
  BOUNDARY_FLOOR,
  DENSITIES,
  GROUNDS,
  SPECIMEN_PAGE,
  THEMES,
  VISIBLE_DELTA,
  applyAxes,
  captureDocument,
  captureRegion,
  contrastRatio,
  documentRects,
  maxChannelDelta,
  readBoundary,
  rgbText,
  samplePoints,
  settle,
  type Ground,
  type Rect,
  type Rgb,
  type Theme,
} from './harness';
import { atLeast, measure } from './ratchet';

/** WCAG 1.4.11 exempts inactive components; `disabled` is held to a different rule. */
const EXEMPT_FROM_FLOOR = new Set(['disabled']);

function groundOf(id: string): Ground {
  return id.split('-')[1] as Ground;
}

function stateOf(id: string): string {
  return id.split('-').slice(3).join('-');
}

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

// ── Resting boundary, across every axis ──────────────────────────────────────
//
// One test per (theme, density, ground) rather than one per (theme, density)
// looping the grounds. A ratchet assertion throws, so a loop would abort at the
// first ground and the other two would report nothing — which is how a matrix
// silently shrinks to its first cell. The capture is shared across the three
// grounds of a combination, so the split costs tests, not screenshots.

for (const theme of THEMES) {
  for (const density of DENSITIES) {
    test.describe(`resting boundary — ${theme}, ${density}`, () => {
      let shared: import('@playwright/test').Page;
      let cellsByGround: Map<Ground, { id: string; rect: Rect }[]>;

      test.beforeAll(async ({ browser }) => {
        shared = await browser.newPage();
        await shared.goto(SPECIMEN_PAGE);
        await applyAxes(shared, { theme, density });
        const rects = await documentRects(shared, '[data-spec="boundary"]');
        await captureDocument(shared);
        cellsByGround = new Map();
        for (const [id, rect] of rects) {
          const ground = groundOf(id);
          if (!cellsByGround.has(ground)) cellsByGround.set(ground, []);
          cellsByGround.get(ground)!.push({ id, rect });
        }
      });

      test.afterAll(async () => {
        await shared?.close();
      });

      for (const ground of GROUNDS) {
        test(`on ${ground}`, async () => {
          const cells = cellsByGround.get(ground) ?? [];
          expect(cells.length, `no boundary specimens on the ${ground} ground`).toBeGreaterThan(0);

          const readings: string[] = [];
          const failures: string[] = [];
          for (const { id, rect } of cells) {
            const r = await readBoundary(shared, rect);
            const line =
              `${id}: border ${r.borderRatio.toFixed(2)}:1 ${rgbText(r.border)}, ` +
              `fill ${r.fillRatio.toFixed(2)}:1 ${rgbText(r.fill)}, on ${rgbText(r.ground)}`;
            readings.push(line);
            if (!EXEMPT_FROM_FLOOR.has(stateOf(id)) && r.best < BOUNDARY_FLOOR) failures.push(line);
          }

          await measure({
            key: `boundary/${theme}/${density}/${ground}`,
            // Shortfall is the number of cells under the floor, so a
            // combination cannot quietly deepen behind a key that is already
            // recorded as failing.
            shortfall: failures.length,
            evidence: `${cells.length} cells; ${failures.length} under ${BOUNDARY_FLOOR}:1 — ${readings[0]}`,
            failure:
              `Heuristic 2: at least one of border-against-surface or fill-against-surface has ` +
              `to reach ${BOUNDARY_FLOOR}:1. On the ${ground} ground in ${theme}/${density}, ` +
              `${failures.length} of ${cells.length} cells reach neither:\n  ` +
              failures.join('\n  '),
          });
        });
      }
    });
  }
}

// ── Hover and focus, one element at a time ───────────────────────────────────
// Colour tokens do not vary with density, and the resting matrix above already
// proves that across all three. These states re-render per element, so they run
// at marketing density only rather than paying 3x for the same three numbers.

const INTERACTIVE_CONTROLS = ['input', 'textarea', 'select'] as const;

for (const theme of THEMES) {
  test(`hover and focus keep a boundary — ${theme}`, async ({ page }) => {
    await applyAxes(page, { theme });

    const failures: string[] = [];
    const readings: string[] = [];
    for (const ground of GROUNDS) {
      for (const control of INTERACTIVE_CONTROLS) {
        for (const [state, baseId] of [
          ['hover', `bnd-${ground}-${control}-default`],
          ['focus', `bnd-${ground}-${control}-default`],
          ['invalid-focus', `bnd-${ground}-${control}-invalid`],
        ] as const) {
          const locator = page.locator(`#${baseId}`);
          await locator.scrollIntoViewIfNeeded();
          if (state === 'hover') await locator.hover();
          else await locator.focus();
          await settle(page);

          const box = await locator.boundingBox();
          expect(box, `${baseId} has no box`).not.toBeNull();
          const pad = 12;
          await captureRegion(page, {
            x: box!.x - pad,
            y: box!.y - pad,
            width: box!.width + pad * 2,
            height: box!.height + pad * 2,
          });
          const r = await readBoundary(page, box!);
          const line =
            `${ground}/${control}/${state}: border ${r.borderRatio.toFixed(2)}:1, ` +
            `fill ${r.fillRatio.toFixed(2)}:1`;
          readings.push(line);
          if (r.best < BOUNDARY_FLOOR) failures.push(line);

          // Reset, so a lingering hover cannot bleed into the next reading.
          await page.mouse.move(0, 0);
          await locator.evaluate((el: HTMLElement) => el.blur());
        }
      }
    }

    await measure({
      key: `boundary/${theme}/interactive-states`,
      shortfall: failures.length,
      evidence: `${readings.length} readings; ${failures.length} under ${BOUNDARY_FLOOR}:1 — ${readings[0]}`,
      failure:
        `Hover and focus must not be the only signifier (heuristic 3) — but they must not ` +
        `lose the boundary either:\n  ${failures.join('\n  ')}`,
    });
  });
}

// ── Hover is never the only signifier ────────────────────────────────────────

test('the resting state already carries the boundary hover would add', async ({ page }) => {
  await applyAxes(page, { theme: 'light' });
  const id = 'bnd-paper-input-default';
  const locator = page.locator(`#${id}`);
  await locator.scrollIntoViewIfNeeded();

  const read = async () => {
    const box = (await locator.boundingBox())!;
    await captureRegion(page, { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 });
    return readBoundary(page, box);
  };

  await settle(page);
  const resting = await read();
  await locator.hover();
  await settle(page);
  const hovered = await read();
  await page.mouse.move(0, 0);

  // Not "hover must change nothing" — hover may reinforce. The rule is that
  // whatever the floor is, resting already meets it, so a touch or
  // keyboard-first user is not the only one who cannot see the control. The
  // shortfall is the contrast hover is carrying that rest is not.
  const restingMustReach = Math.min(hovered.best, BOUNDARY_FLOOR);
  await measure({
    key: 'boundary/hover-is-not-the-only-signifier',
    shortfall: atLeast(resting.best, restingMustReach),
    evidence: `resting best ${resting.best.toFixed(2)}:1, hovered best ${hovered.best.toFixed(2)}:1`,
    failure:
      `Hover adds ${(restingMustReach - resting.best).toFixed(2)} of the boundary the control ` +
      `needs. Hover does not exist on touch and does not exist for a keyboard-first user, so it ` +
      `may reinforce a boundary and may not carry one.`,
  });
});

// ── Disabled and read-only are visible states ────────────────────────────────

interface StateReading {
  control: string;
  state: string;
  fill: Rgb;
  border: Rgb;
}

async function readStateBlock(page: import('@playwright/test').Page, theme: Theme): Promise<StateReading[]> {
  await applyAxes(page, { theme });
  const rects = await documentRects(page, '[data-spec="state"]');
  await captureDocument(page);
  const out: StateReading[] = [];
  for (const [id, rect] of rects) {
    const [, control, state] = id.split('-');
    const r = await readBoundary(page, rect);
    out.push({ control, state, fill: r.fill, border: r.border });
  }
  return out;
}

function pick(readings: StateReading[], control: string, state: string) {
  return readings.find((r) => r.control === control && r.state === state);
}

/** How far apart two renderings of the same control are, over fill and border together. */
function separation(a: StateReading, b: StateReading): number {
  return Math.max(maxChannelDelta(a.fill, b.fill), maxChannelDelta(a.border, b.border));
}

for (const [key, left, right, why] of [
  [
    'states/invalid-renders-distinctly',
    'invalid',
    'default',
    'The permanent guard for the first cascade trap. A boundary added as its own selector ties ' +
      'on specificity with [aria-invalid="true"] and, being later, wins — every error field ' +
      'renders with the ordinary border while the diff looks correct. Nothing but a painted ' +
      'reading catches that.',
  ],
  [
    'states/disabled-renders-distinctly',
    'disabled',
    'default',
    'A disabled field that renders identically to an editable one invites the user to type ' +
      'into it. The React Input styles both; the plain-CSS layer a panel iframe reaches does not.',
  ],
  [
    'states/readonly-renders-distinctly',
    'readonly',
    'default',
    'Read-only reads as filled but static — present, valued, not editable.',
  ],
  [
    'states/disabled-differs-from-readonly',
    'disabled',
    'readonly',
    'Dimmed-and-unavailable and static-but-present are different promises to the user.',
  ],
] as const) {
  test(`${left} renders distinctly from ${right}`, async ({ page }) => {
    const readings = await readStateBlock(page, 'light');
    const controls = [...new Set(readings.map((r) => r.control))].sort();

    const lines: string[] = [];
    const failures: string[] = [];
    for (const control of controls) {
      const a = pick(readings, control, left);
      const b = pick(readings, control, right);
      // <select> has no read-only in its content model, so the pair does not
      // exist for it. Absent, not skipped quietly.
      if (!a || !b) continue;
      const delta = separation(a, b);
      const line = `${control}: Δ${delta} (fill ${rgbText(a.fill)} vs ${rgbText(b.fill)}, border ${rgbText(a.border)} vs ${rgbText(b.border)})`;
      lines.push(line);
      if (delta < VISIBLE_DELTA) failures.push(line);
    }
    expect(lines.length, `no ${left}/${right} pairs on the specimen page`).toBeGreaterThan(0);

    await measure({
      key,
      // Shortfall counts the controls whose two renderings did not separate, so
      // fixing two of three and leaving one is visible as progress rather than
      // as an unchanged red.
      shortfall: failures.length,
      evidence: lines.join('; '),
      failure: `${why}\n  ${failures.join('\n  ')}`,
    });
  });
}

// ── Text stays legible in every state ────────────────────────────────────────

test('a read-only value stays readable', async ({ page }) => {
  // Guards the shape of the eventual fix: dimming read-only the way disabled is
  // dimmed would make a value the user is meant to read fail text contrast.
  await applyAxes(page, { theme: 'light' });
  const locator = page.locator('#st-input-readonly');
  await locator.scrollIntoViewIfNeeded();
  const box = (await locator.boundingBox())!;
  // Pad by more than readBoundary's ±6 gutter sample, or the ground read falls
  // outside the capture.
  await captureRegion(page, { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 });

  // Scan the text band for the darkest pixel — the glyph core — and read it
  // against the control's own fill.
  const pts: [number, number][] = [];
  for (let dx = 4; dx < Math.min(box.width - 4, 160); dx += 1) pts.push([box.x + dx, box.y + box.height / 2]);
  const samples = await samplePoints(page, pts);
  const fill = (await readBoundary(page, box)).fill;
  let darkest = samples[0];
  for (const s of samples) if (s[0] + s[1] + s[2] < darkest[0] + darkest[1] + darkest[2]) darkest = s;
  const ratio = contrastRatio(darkest, fill);

  await measure({
    key: 'states/readonly-value-stays-legible',
    shortfall: atLeast(ratio, 4.5),
    evidence: `darkest glyph ${rgbText(darkest)} on fill ${rgbText(fill)} = ${ratio.toFixed(2)}:1`,
    failure:
      'A read-only value is meant to be read. Dimming it the way disabled is dimmed would drop ' +
      'it under the 4.5:1 text floor.',
  });
});

