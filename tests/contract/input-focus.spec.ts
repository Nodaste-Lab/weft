/**
 * Does the focus indicator survive the page around it?
 *
 * The global rule is `:where(a, button, [tabindex], input, select, textarea):focus-visible`,
 * delivering the ring as a `box-shadow`. `:where()` contributes nothing to
 * specificity, so the whole selector weighs (0,1,0) — the same as any author
 * `.shadow { box-shadow: … }` — and a later author rule replaces the ring
 * outright, with no error, no warning and, until this file, no gate.
 *
 * Detection is by pixels, not by computed style. `box-shadow` and `outline`
 * are different properties with different geometry, and P2's open question is
 * whether the ring should move from one to the other; a test that reads
 * `box-shadow` would have to be rewritten by the fix it exists to verify. What
 * matters to a user is whether something is painted around the control, so
 * that is what is measured.
 */
import { expect, test } from '@playwright/test';
import {
  SPECIMEN_PAGE,
  VISIBLE_DELTA,
  applyAxes,
  captureRegion,
  maxChannelDelta,
  samplePoints,
  settle,
  type Rgb,
} from './harness';
import { atLeast, measure } from './ratchet';

/** Ring band: 1–4px outside the border box, which is where the two-layer ring lands. */
function ringPoints(box: { x: number; y: number; width: number; height: number }): [number, number][] {
  const pts: [number, number][] = [];
  for (const d of [1, 2, 3, 4]) {
    for (const fx of [0.25, 0.5, 0.75]) {
      pts.push([box.x + box.width * fx, box.y - d]);
      pts.push([box.x + box.width * fx, box.y + box.height + d - 1]);
    }
    for (const fy of [0.35, 0.65]) {
      pts.push([box.x - d, box.y + box.height * fy]);
      pts.push([box.x + box.width + d - 1, box.y + box.height * fy]);
    }
  }
  return pts;
}

const SPECIMENS = [
  ['plain', '#fc-plain', 'the baseline — nothing competing with the ring'],
  ['author-shadow-class', '#fc-shadow-class', 'an author box-shadow at class specificity'],
  ['author-shadow-inline', '#fc-shadow-inline', 'an author box-shadow in an inline style'],
  ['author-outline-none', '#fc-outline-none', 'an author outline: none'],
  ['wrapper-shadow', '#fc-wrapper', 'a wrapper carrying its own shadow'],
] as const;

for (const [id, selector, why] of SPECIMENS) {
  test(`a focus indicator renders with ${why}`, async ({ page }) => {
    await page.goto(SPECIMEN_PAGE);
    await applyAxes(page, { theme: 'light' });

    const locator = page.locator(selector);
    await locator.scrollIntoViewIfNeeded();
    await settle(page);

    const box = (await locator.boundingBox())!;
    const clip = { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 };
    const points = ringPoints(box);

    await captureRegion(page, clip);
    const before = await samplePoints(page, points);

    // A text input matches :focus-visible whenever it is focused, however focus
    // arrived, so programmatic focus is the real state here rather than a
    // stand-in for keyboard focus.
    await locator.focus();
    await settle(page);
    await captureRegion(page, clip);
    const after = await samplePoints(page, points);

    const changed = before.filter((b: Rgb, i: number) => maxChannelDelta(b, after[i]) >= VISIBLE_DELTA).length;
    // A ring that paints a quarter of the perimeter is a ring. Shortfall counts
    // the pixels short of that, so a partly-surviving indicator reads as partly
    // fixed rather than as unchanged.
    const needed = points.length / 4;
    await measure({
      key: `focus/${id}/indicator-survives`,
      shortfall: atLeast(changed, needed),
      evidence: `${changed} of ${points.length} ring pixels changed on focus`,
      failure:
        `Focusing ${selector} painted ${changed} of the ${needed} ring pixels a visible ` +
        `indicator needs. The ring is delivered by a zero-specificity :where() rule as a ` +
        `box-shadow, so ${why} replaces it silently.`,
    });
  });
}

test('a control navigated to is not left under sticky chrome', async ({ page }) => {
  // SC 2.4.11 Focus Not Obscured — heuristic 9. The specimen page carries a real
  // sticky bar, which is the shape of HUD panels, sticky toolbars and floating
  // chrome.
  //
  // THE ORIGINAL VERSION OF THIS ASSERTION WAS MIS-SPECIFIED, and the correction
  // matters more than the fix. It scrolled the control to just under the bar by
  // hand and then called focus(). The browser considered the control visible, so
  // focus() did not scroll at all, and the 100%-covered reading it produced was
  // the fixture's own scroll position rather than anything the page does. Proved
  // by removing scroll-padding-top and getting the identical number.
  //
  // What actually happens here, measured: focus() on an off-screen control
  // CENTRES it (top 428 of a 900px viewport), so focusing alone never puts a
  // control under the bar on this page. The operation that does is a scroll-to —
  // a fragment link, a skip link, `scrollIntoView({ block: "start" })` — which
  // top-aligns. Without scroll-padding the control lands at top 0 and is 99%
  // covered; with it, 0%. That is the difference this measures.
  await page.goto(SPECIMEN_PAGE);
  await applyAxes(page, { theme: 'light' });

  const target = page.locator('#nm-visible');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.location.hash = '#nm-visible';
  });
  await settle(page);

  const reading = await page.evaluate(() => {
    const el = document.getElementById('nm-visible')!;
    const bar = document.querySelector('.bar')!;
    const t = el.getBoundingClientRect();
    const b = bar.getBoundingClientRect();
    const covered = Math.max(0, Math.min(t.bottom, b.bottom) - Math.max(t.top, b.top));
    return {
      fraction: covered / t.height,
      top: Math.round(t.top),
      barHeight: Math.round(b.height),
    };
  });
  expect(await target.count(), 'the target specimen is missing').toBe(1);

  await measure({
    key: 'focus/not-obscured-by-sticky-chrome',
    // Asserting NONE of it is covered, which is SC 2.4.12 (Enhanced, AAA). The
    // AA Minimum only requires the control not be ENTIRELY hidden, and 99%
    // covered would satisfy that letter while being useless in practice. The
    // fix delivers the stricter reading at no extra cost, so that is what is
    // held.
    shortfall: reading.fraction,
    evidence:
      `${(reading.fraction * 100).toFixed(0)}% covered; control top ${reading.top}px, ` +
      `sticky bar ${reading.barHeight}px tall`,
    failure:
      'A control scrolled to by an in-page navigation landed under the sticky bar. The surface ' +
      'declares its chrome height in --weft-sticky-chrome-h and the component layer turns that ' +
      'into scroll-padding-top; either the token is unset or the rule is not applying.',
  });
});
