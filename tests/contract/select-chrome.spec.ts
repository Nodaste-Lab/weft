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
  PALETTES,
  SPECIMEN_PAGE,
  THEMES,
  VISIBLE_DELTA,
  applyAxes,
  captureRegion,
  contrastRatio,
  maxChannelDelta,
  readBoundary,
  relativeLuminance,
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

// ── The chevron must track the foreground, in every palette ──────────────────

/** Pull an `#rrggbb` out of whatever form a computed colour or data URI takes. */
function hexOf(value: string): Rgb | null {
  const uri = decodeURIComponent(value);
  const hex = /(?:%23|#)([0-9A-Fa-f]{6})/.exec(uri)?.[1];
  if (hex) return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
  const rgb = /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(value);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
}

/**
 * Palette and theme are INDEPENDENT axes, and the chevron used to key on the
 * theme alone. `hud-glass` is a dark palette in its own right — dark paper,
 * near-white ink, whatever data-theme says — so anyone using it without dark
 * mode got a near-black glyph on a dark control: stroke #0B1020 against ink
 * #f5f8ff. The painted check below cannot catch it, because on this page the
 * body is light and the translucent hud-glass fill composites light too; the
 * failure needs the dark canvas hud-glass is designed to overlay.
 *
 * So the invariant is asserted instead of the instance, and asserted against
 * the palette's own foreground rather than a list of dark palettes: the
 * chevron's stroke has to be the same TONE as --weft-ink. A future palette that
 * forgets the override fails here without anyone remembering to add it.
 */
for (const palette of PALETTES) {
  for (const theme of THEMES) {
    test(`the chevron tracks the foreground — ${palette}, ${theme}`, async ({ page }) => {
      await page.goto(SPECIMEN_PAGE);
      await applyAxes(page, { palette, theme });

      const read = await page.evaluate(() => {
        const el = document.getElementById('sc-default')!;
        return {
          image: getComputedStyle(el).backgroundImage,
          ink: getComputedStyle(document.documentElement).getPropertyValue('--weft-ink').trim(),
        };
      });

      const stroke = hexOf(read.image);
      const ink = hexOf(read.ink);
      expect(stroke, `no stroke colour in the chevron image for ${palette}/${theme}`).not.toBeNull();
      expect(ink, `no --weft-ink for ${palette}/${theme}`).not.toBeNull();

      const gap = Math.abs(relativeLuminance(stroke!) - relativeLuminance(ink!));
      await measure({
        key: `select-chrome/${palette}/${theme}/chevron-tracks-foreground`,
        // 0.25 of relative luminance is far wider than any legitimate tuning and
        // far narrower than the 0.9 an inverted chevron produces.
        shortfall: Math.max(0, gap - 0.25),
        evidence: `chevron ${rgbText(stroke!)} against --weft-ink ${rgbText(ink!)}; luminance gap ${gap.toFixed(3)}`,
        failure:
          `The chevron is the opposite tone to the palette's own foreground, so it is painted ` +
          `into the control's fill rather than on top of it. Palette and theme are independent ` +
          `axes — a dark palette needs the chevron override whether or not data-theme is set.`,
      });
    });
  }
}

/**
 * The checked tick and dot, held to the same invariant as the chevron.
 *
 * The tick is a data URI with a hardcoded `stroke='white'`, so its colour cannot
 * read a token at all; the dot reads --weft-on-blue. Both are painted onto
 * --weft-blue by `:checked`. The token-pair guard in contrast-contract checks
 * --weft-on-blue against --weft-blue and therefore covers the dot — but NOT the
 * tick, which is exactly the hole review found: a future palette could set
 * --weft-on-blue correctly and still ship an invisible tick.
 *
 * Measured in the real cascade rather than reasoned about from the stylesheet,
 * because whether a palette-scoped override applies is a cascade question.
 */
for (const palette of PALETTES) {
  for (const theme of THEMES) {
    test(`checked marks stay visible on the primary — ${palette}, ${theme}`, async ({ page }) => {
      await page.goto(SPECIMEN_PAGE);
      await applyAxes(page, { palette, theme });

      const read = await page.evaluate(() => {
        const box = document.getElementById('sc-checkbox-checked')!;
        const dot = document.getElementById('sc-radio-checked')!;
        const boxStyle = getComputedStyle(box);

        // The stroke may be a hex OR a bare CSS keyword — the shipped tick uses
        // `white`, which is itself part of the problem: a keyword cannot track a
        // token by any means. Resolve whatever it is through the browser rather
        // than keeping a colour-name table here.
        const raw = decodeURIComponent(boxStyle.backgroundImage);
        const stroke = /stroke='([^']+)'/.exec(raw)?.[1] ?? null;
        let strokeRgb: string | null = null;
        if (stroke) {
          const probe = document.createElement('span');
          probe.style.color = stroke;
          document.body.appendChild(probe);
          strokeRgb = getComputedStyle(probe).color;
          probe.remove();
        }
        return {
          strokeRgb,
          // :checked sets background-color: var(--weft-blue) on both.
          primary: boxStyle.backgroundColor,
          dotMark: getComputedStyle(dot, '::after').backgroundColor,
        };
      });

      const tick = read.strokeRgb ? hexOf(read.strokeRgb) : null;
      const primary = hexOf(read.primary);
      const dot = hexOf(read.dotMark);
      expect(tick, 'no stroke colour in the tick image').not.toBeNull();
      expect(primary, 'the checked control has no primary fill').not.toBeNull();
      expect(dot, 'the checked radio has no dot colour').not.toBeNull();

      const tickRatio = contrastRatio(tick!, primary!);
      const dotRatio = contrastRatio(dot!, primary!);
      // 3:1 — these are non-text marks (WCAG 1.4.11), not body copy.
      const failures: string[] = [];
      if (tickRatio < 3) failures.push(`tick ${rgbText(tick!)} on ${rgbText(primary!)} = ${tickRatio.toFixed(2)}:1`);
      if (dotRatio < 3) failures.push(`dot ${rgbText(dot!)} on ${rgbText(primary!)} = ${dotRatio.toFixed(2)}:1`);

      await measure({
        key: `select-chrome/${palette}/${theme}/checked-marks-visible`,
        shortfall: failures.length,
        evidence: `tick ${tickRatio.toFixed(2)}:1, dot ${dotRatio.toFixed(2)}:1 on ${rgbText(primary!)}`,
        failure:
          `A checked control's mark has to be visible on the primary it is painted onto. ` +
          `The tick is a data URI whose stroke cannot read a token, so a palette that lifts ` +
          `--weft-blue needs a scoped override for it as well as a corrected --weft-on-blue:\n  ` +
          failures.join('\n  '),
      });
    });
  }
}
