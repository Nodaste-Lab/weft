/**
 * The select chevron, as a permanent guard.
 *
 * This suite exists because the same class of bug has now been found twice, both
 * times by someone looking at a picture rather than by a gate:
 *
 *   1. A new boundary added as its own selector tied on specificity with
 *      `[aria-invalid="true"]` and, being later, won — every error field
 *      silently rendered with the ordinary border.
 *   2. The `background` shorthand reset `background-image`, `-repeat`,
 *      `-position` and `-size`. In light the chevron disappeared; in dark the
 *      theme's higher-specificity chevron rule restored the IMAGE but not the
 *      repeat, tiling a 12px glyph across the whole control.
 *
 * Two instances of one class is the signal to stop patching instances. So the
 * guard is structural rather than a lesson in a comment: whatever a phase does
 * to the field's fill, every select still reports exactly one background image,
 * `no-repeat`, the expected right-edge position, and a chevron that is actually
 * painted — in both themes and in every state.
 *
 * The painted check is the load-bearing one. `background-image` being non-none
 * says a URL is set; it does not say a glyph reached the screen.
 */
import { expect, test } from '@playwright/test';
import {
  SPECIMEN_PAGE,
  THEMES,
  VISIBLE_DELTA,
  applyAxes,
  captureRegion,
  maxChannelDelta,
  readBoundary,
  rgbText,
  samplePoints,
  type Rgb,
} from './harness';
import { measure } from './ratchet';

/** Every select on the specimen page, in each state markup can express. */
const SELECTS = ['#sc-default', '#sc-invalid', '#sc-disabled'];

interface Chrome {
  image: string;
  repeat: string;
  position: string;
  positionX: string;
  positionY: string;
  size: string;
}

/**
 * The chevron is anchored to the RIGHT edge and vertically centred. Chromium
 * computes that as `calc(100% - 14px)` / `50%`.
 *
 * Checked as two axes rather than as the combined `background-position` string,
 * because a looser test here is a false negative: an earlier version accepted
 * "any digit in the string", which `0% 0%` satisfies — the exact value a
 * `background` shorthand reset produces, and the value this whole suite exists
 * to catch.
 */
const RIGHT_ANCHORED = /^(right\b|100%|calc\(100% - \d+(\.\d+)?px\))/;
const VERTICALLY_CENTRED = new Set(['50%', 'center']);

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

for (const theme of THEMES) {
  test(`every select declares exactly one chevron — ${theme}`, async ({ page }) => {
    await applyAxes(page, { theme });

    const chrome = await page.evaluate((selectors) => {
      const out: Record<string, Chrome> = {};
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (!el) throw new Error(`fixture: ${selector} is missing from the specimen page`);
        const s = getComputedStyle(el);
        out[selector] = {
          image: s.backgroundImage,
          repeat: s.backgroundRepeat,
          position: s.backgroundPosition,
          positionX: s.backgroundPositionX,
          positionY: s.backgroundPositionY,
          size: s.backgroundSize,
        };
      }
      return out;
    }, SELECTS);

    const problems: string[] = [];
    for (const [selector, c] of Object.entries(chrome)) {
      // `background-image` is a comma-separated list. Two layers means a
      // shorthand somewhere stacked a second image rather than replacing one.
      const layers = c.image === 'none' ? 0 : c.image.split(/,(?![^(]*\))/).length;
      if (layers !== 1) problems.push(`${selector}: ${layers} background image layer(s) — ${c.image.slice(0, 80)}`);
      if (c.repeat !== 'no-repeat') problems.push(`${selector}: background-repeat is ${c.repeat}, not no-repeat`);
      if (!RIGHT_ANCHORED.test(c.positionX)) {
        problems.push(
          `${selector}: background-position-x is ${c.positionX}, which is not anchored to the ` +
            `right edge (a shorthand reset computes 0%)`,
        );
      }
      if (!VERTICALLY_CENTRED.has(c.positionY)) {
        problems.push(`${selector}: background-position-y is ${c.positionY}, not centred`);
      }
      if (c.size !== 'auto') problems.push(`${selector}: background-size is ${c.size}, not auto`);
    }

    await measure({
      key: `select-chrome/${theme}/declarations`,
      shortfall: problems.length,
      evidence: Object.entries(chrome)
        .map(([sel, c]) => `${sel} repeat=${c.repeat} x=${c.positionX} y=${c.positionY} size=${c.size}`)
        .join('; '),
      failure:
        'A `background` shorthand anywhere in the field rule resets background-image, -repeat, ' +
        "-position and -size. In dark the theme's own chevron rule restores the image and not " +
        'the repeat, which tiles a 12px glyph across the control:\n  ' +
        problems.join('\n  '),
    });
  });

  test(`every select actually paints its chevron — ${theme}`, async ({ page }) => {
    await applyAxes(page, { theme });

    const findings: string[] = [];
    const blank: string[] = [];
    for (const selector of SELECTS) {
      const locator = page.locator(selector);
      await locator.scrollIntoViewIfNeeded();
      const box = (await locator.boundingBox())!;
      await captureRegion(page, {
        x: box.x - 12,
        y: box.y - 12,
        width: box.width + 24,
        height: box.height + 24,
      });
      const fill = (await readBoundary(page, box)).fill;

      // The chevron sits at `right 14px center` and is 12px wide by 8 tall.
      // Sample that window and find the pixel furthest from the fill.
      const points: [number, number][] = [];
      for (let dx = 0; dx < 12; dx += 1) {
        for (let dy = -4; dy <= 4; dy += 1) {
          points.push([box.x + box.width - 26 + dx, box.y + box.height / 2 + dy]);
        }
      }
      const samples = await samplePoints(page, points);
      let strongest: Rgb = fill;
      for (const s of samples) {
        if (maxChannelDelta(s, fill) > maxChannelDelta(strongest, fill)) strongest = s;
      }
      const delta = maxChannelDelta(strongest, fill);
      findings.push(`${selector}: strongest chevron pixel ${rgbText(strongest)} vs fill ${rgbText(fill)} = Δ${delta}`);

      // A disabled select is allowed to be quieter, but not absent.
      if (delta < VISIBLE_DELTA) blank.push(`${selector} (Δ${delta})`);
    }

    await measure({
      key: `select-chrome/${theme}/painted`,
      shortfall: blank.length,
      evidence: findings.join('; '),
      failure:
        'A select with no painted chevron looks like a text input the user cannot type in. ' +
        `Nothing distinguishable from the fill in the chevron window: ${blank.join(', ')}`,
    });
  });
}
