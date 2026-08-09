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

test('a focused control under sticky chrome is not entirely obscured', async ({ page }) => {
  // SC 2.4.11 Focus Not Obscured (Minimum), Level AA. The specimen page carries
  // a real sticky bar, which is the shape of HUD panels, sticky toolbars and
  // floating chrome — the risk heuristic 9 names.
  await page.goto(SPECIMEN_PAGE);
  await applyAxes(page, { theme: 'light' });

  const target = page.locator('#nm-visible');
  const bar = page.locator('.bar');

  // Put the control behind the bar first, then focus it, so the assertion is
  // about what focusing does rather than about where the page happened to be.
  await target.evaluate((el) => {
    el.scrollIntoView({ block: 'start' });
    window.scrollBy(0, -8);
  });
  await target.focus();
  await settle(page);

  const [t, b] = await Promise.all([target.boundingBox(), bar.boundingBox()]);
  const overlapTop = Math.max(t!.y, b!.y);
  const overlapBottom = Math.min(t!.y + t!.height, b!.y + b!.height);
  const covered = Math.max(0, overlapBottom - overlapTop);
  const fraction = covered / t!.height;

  // "Minimum" is not-entirely-hidden. The stricter AAA criterion wants none of
  // it hidden; scoping to the AA rule the heuristic actually cites. Shortfall is
  // the covered fraction once it reaches total, so a partial fix shows.
  await measure({
    key: 'focus/not-obscured-by-sticky-chrome',
    shortfall: fraction >= 1 ? fraction : 0,
    evidence: `${(fraction * 100).toFixed(0)}% of the focused control sits under the sticky bar`,
    failure:
      'Focusing the control scrolled it flush to the viewport top, entirely under the sticky ' +
      'bar. SC 2.4.11 wants it not entirely hidden; scroll-padding-top on html is the usual fix.',
  });
});

