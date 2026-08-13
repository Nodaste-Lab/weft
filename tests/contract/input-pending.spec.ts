/**
 * Asynchronous pending / result status — the rendered contract
 * (amendment A4, in force).
 *
 * The affordance is TEXT IN THE HINT SLOT: the field's right edge belongs to
 * the chevron, the search clear and the error glyph (error-icon.spec.ts), so
 * pending adds nothing there — asserted, not assumed. Pending's dot reuses
 * `weft-pulse`, whose final keyframe is opacity 1; Weft's reduced-motion rule
 * freezes animations to one 0.001ms iteration, so under `reduce` the dot must
 * measure STATIC-VISIBLE — painted, full opacity — rather than reading as a
 * hung field. That freeze interaction is the reason a spinner was rejected,
 * and it is the claim this suite exists to hold.
 *
 * Every accessibility claim is EXPOSURE, never announcement: the description
 * resolves out of Chromium's own accessibility tree over CDP; what a screen
 * reader does with it is not claimed anywhere in this file.
 */
import { expect, test } from '@playwright/test';
import {
  SPECIMEN_PAGE,
  THEMES,
  VISIBLE_DELTA,
  applyAxes,
  axNode,
  captureRegion,
  maxChannelDelta,
  samplePoints,
  settle,
} from './harness';

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

const DOT_SELECTOR = '#pd-pending-status';

async function dotComputed(page: import('@playwright/test').Page) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)!;
    const s = getComputedStyle(el, '::before');
    return {
      opacity: s.opacity,
      animationName: s.animationName,
      animationDuration: s.animationDuration,
      animationIterationCount: s.animationIterationCount,
      width: s.width,
      borderRadius: s.borderRadius,
    };
  }, DOT_SELECTOR);
}

/** The dot's painted delta against the hint's own ground, sampled inside the
 * dot box (the hint's first ~6px, vertically centred on the line box). */
async function dotPaintDelta(page: import('@playwright/test').Page) {
  const box = (await page.locator(DOT_SELECTOR).boundingBox())!;
  await captureRegion(page, {
    x: box.x - 8,
    y: box.y - 8,
    width: box.width + 16,
    height: box.height + 16,
  });
  const [dot, ground] = await samplePoints(page, [
    [box.x + 3, box.y + box.height / 2 - 1],
    [box.x + 3, box.y + box.height - 2],
  ]);
  return maxChannelDelta(dot, ground);
}

test.describe('pending is motion that survives the freeze', () => {
  for (const theme of THEMES) {
    test(`under reduced motion the dot measures static-VISIBLE — ${theme}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await applyAxes(page, { theme });
      await page.locator(DOT_SELECTOR).scrollIntoViewIfNeeded();
      await settle(page);

      const dot = await dotComputed(page);
      // The freeze rule clamps duration and iterations; weft-pulse's 0%/100%
      // keyframes are opacity 1, so a frozen dot lands at full opacity.
      // Chromium serializes the 0.001ms clamp as "1e-06s".
      expect(
        parseFloat(dot.animationDuration),
        `the freeze rule owns the duration (got ${dot.animationDuration})`,
      ).toBeLessThan(0.001);
      expect(dot.animationIterationCount).toBe('1');
      expect(dot.opacity, 'the final keyframe is opacity 1 — a frozen dot is a visible dot').toBe('1');

      const delta = await dotPaintDelta(page);
      expect(
        delta,
        `the dot must PAINT under reduce (Δ${delta} against the hint ground) — ` +
          'a pending field that hides its affordance from reduced-motion users reads as hung',
      ).toBeGreaterThan(VISIBLE_DELTA);
    });
  }

  test('without the preference the dot pulses on the shared keyframes', async ({ page }) => {
    await applyAxes(page, {});
    await page.locator(DOT_SELECTOR).scrollIntoViewIfNeeded();
    const dot = await dotComputed(page);
    expect(dot.animationName, 'weft-pulse is reused, not reinvented').toBe('weft-pulse');
    expect(dot.animationDuration).toBe('2s');
    expect(dot.animationIterationCount).toBe('infinite');
  });

  test('the dot is a square wearing the dot radius, not a taper', async ({ page }) => {
    await applyAxes(page, {});
    const dot = await dotComputed(page);
    // Owner call (visual round 4): 50% is for squares; oblongs take the pill
    // token. The dot is 6×6, so the dot radius is correct here.
    expect(dot.width).toBe('6px');
    expect(dot.borderRadius).toBe('50%');
  });
});

test.describe('the right edge stays free', () => {
  test('pending changes nothing at the field edge — no padding shift, no glyph', async ({ page }) => {
    await applyAxes(page, {});
    const [pendingStyle, plainStyle] = await page.evaluate(() => {
      const read = (sel: string) => {
        const s = getComputedStyle(document.querySelector(sel)!);
        return {
          paddingRight: s.paddingRight,
          backgroundImage: s.backgroundImage,
        };
      };
      return [read('#pd-pending'), read('#pd-ok')];
    });
    expect(
      pendingStyle.paddingRight,
      'pending reserves nothing at the right edge — that edge is taken',
    ).toBe(plainStyle.paddingRight);
    expect(
      pendingStyle.backgroundImage,
      'no glyph rides the field for pending; the presentation lives in the hint slot',
    ).toBe('none');
  });
});

test.describe('tones resolve from the four tokens', () => {
  for (const theme of THEMES) {
    test(`each tone lands on its token — ${theme}`, async ({ page }) => {
      await applyAxes(page, { theme });
      const reads = await page.evaluate(() => {
        const token = (name: string) =>
          getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        const resolve = (value: string) => {
          // Normalize a token's author value through the browser's own colour
          // parser so hex and rgb() compare equal.
          const probe = document.createElement('span');
          probe.style.color = value;
          document.body.appendChild(probe);
          const out = getComputedStyle(probe).color;
          probe.remove();
          return out;
        };
        const pairs: Array<[string, string]> = [
          ['#pd-ok-status', '--weft-ok'],
          ['#pd-info-status', '--weft-info-text'],
          ['#pd-warn-status', '--weft-warn'],
          ['#pd-stop-status', '--weft-stop'],
        ];
        return pairs.map(([sel, tok]) => ({
          sel,
          tok,
          painted: getComputedStyle(document.querySelector(sel)!).color,
          expected: resolve(token(tok)),
        }));
      });
      for (const r of reads) {
        expect(r.painted, `${r.sel} carries ${r.tok}`).toBe(r.expected);
      }
    });
  }
});

test.describe('exposure, never announcement', () => {
  test('the pending field resolves its description with the status text, and reads busy', async ({ page }) => {
    await applyAxes(page, {});
    const node = await axNode(page, '#pd-pending');
    expect(node.description ?? '').toContain('Checking source…');
    expect(node.description ?? '').toContain('Must be reachable over HTTPS.');
    // The P2-era measurement read `busy: 1` — Chromium reports the property
    // as a truthy number, and that numeric shape is what this repeats.
    expect(Boolean(node.properties.busy), 'aria-busy resolves in the tree — exposure only').toBe(true);
  });

  test('the full list resolves in order: error, status, help', async ({ page }) => {
    await applyAxes(page, {});
    const node = await axNode(page, '#pd-order');
    const d = node.description ?? '';
    const at = [
      d.indexOf('Unable to reach source.'),
      d.indexOf('Last checked a minute ago.'),
      d.indexOf('Must be reachable over HTTPS.'),
    ];
    expect(at.every((i) => i >= 0), `all three texts resolve (got "${d}")`).toBe(true);
    expect(at[0], 'error text leads').toBeLessThan(at[1]);
    expect(at[1], 'status text precedes help').toBeLessThan(at[2]);
  });

  test('a settled status is not busy and not invalid — degraded is neither success nor failure', async ({ page }) => {
    await applyAxes(page, {});
    const node = await axNode(page, '#pd-warn');
    expect(Boolean(node.properties.busy)).toBe(false);
    expect(node.properties.invalid ?? 'false').toBe('false');
    expect(node.description ?? '').toContain('Degraded — local content stays readable.');
  });
});
