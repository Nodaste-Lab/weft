/**
 * Resting tiers (P7, heuristic 1 as amended by A3/A6).
 *
 * Quiet — trigger-then-field — is the default and is enforced by the
 * visibility-reasons gate, not here. This suite holds the two field-shaped
 * tiers to their contracts:
 *
 *  - Tier 2, `.is-underline`: a REAL native control whose underline is
 *    appearance only. The underline IS its boundary, so the painted bottom
 *    edge must clear 3:1 at rest in both themes — the "3:1 underline fixed
 *    visibility and nothing else" settlement. Behaviour stays native: normal
 *    tab order, native overflow scrolling, direction inherited for RTL, and
 *    an error keeps the field visible with the message attached.
 *  - Tier 3, `.is-low`: a bordered field with quieter colour — never the
 *    borderless form the original heuristic drew, which A3 rules out because
 *    a 3:1 fill costs the placeholder its text contrast. Its border must
 *    still clear the floor at rest.
 *
 * Hover reinforces and never carries (heuristic 3): both tiers pass at REST,
 * with no pseudo-class applied anywhere in this file.
 */
import { expect, test } from '@playwright/test';
import {
  BOUNDARY_FLOOR,
  SPECIMEN_PAGE,
  applyAxes,
  captureRegion,
  contrastRatio,
  rgbText,
  samplePoints,
  type Theme,
} from './harness';

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

async function bottomEdgeContrast(page: import('@playwright/test').Page, id: string) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  const box = (await el.boundingBox())!;
  await captureRegion(page, {
    x: box.x - 12,
    y: box.y - 12,
    width: box.width + 24,
    height: box.height + 24,
  });
  const midX = box.x + box.width / 2;
  const [edge, ground] = await samplePoints(page, [
    [midX, box.y + box.height - 1],
    [midX, box.y + box.height + 6],
  ]);
  return { ratio: contrastRatio(edge, ground), edge: rgbText(edge), ground: rgbText(ground) };
}

async function topEdgeContrast(page: import('@playwright/test').Page, id: string) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  const box = (await el.boundingBox())!;
  await captureRegion(page, {
    x: box.x - 12,
    y: box.y - 12,
    width: box.width + 24,
    height: box.height + 24,
  });
  const midX = box.x + box.width / 2;
  const [edge, ground] = await samplePoints(page, [
    [midX, box.y + 1],
    [midX, box.y - 6],
  ]);
  return contrastRatio(edge, ground);
}

for (const theme of ['light', 'dark'] as Theme[]) {
  test(`tier 2: the painted underline carries 3:1 at rest — ${theme}`, async ({ page }) => {
    await applyAxes(page, { theme });
    const { ratio, edge, ground } = await bottomEdgeContrast(page, 'tier2-underline');
    expect(
      ratio,
      `underline ${edge} on ${ground} reads ${ratio.toFixed(2)}:1 — the underline IS this tier's boundary`,
    ).toBeGreaterThanOrEqual(BOUNDARY_FLOOR);
  });

  test(`tier 2 is actually the underline tier — no boundary paints on the top edge — ${theme}`, async ({ page }) => {
    // The distinguishing assertion this suite first shipped without: every
    // other check here also passes on a DEFAULT field, so a page whose
    // .is-underline rule silently vanished passed the whole suite (observed —
    // an external reset removed the rule and nothing failed). Tier 2 exists
    // by NOT painting three of its sides; the top edge is where that is
    // cheapest to prove.
    await applyAxes(page, { theme });
    const top = await topEdgeContrast(page, 'tier2-underline');
    const defaultTop = await topEdgeContrast(page, 'geo-input');
    expect(
      top,
      `tier-2 top edge reads ${top.toFixed(2)}:1 — a painted top border means the underline modifier is not applying`,
    ).toBeLessThan(1.8);
    expect(
      defaultTop,
      'the default field keeps its full boundary; if this fails the comparison itself is broken',
    ).toBeGreaterThanOrEqual(BOUNDARY_FLOOR);
  });

  test(`tier 2 in error: the underline deepens and the field stays visible — ${theme}`, async ({ page }) => {
    await applyAxes(page, { theme });
    const invalid = page.locator('#tier2-invalid');
    await expect(invalid).toBeVisible();
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    const described = await invalid.getAttribute('aria-describedby');
    expect(described, 'the message attaches to the field').toContain('tier2-invalid-error');
    const { ratio } = await bottomEdgeContrast(page, 'tier2-invalid');
    expect(ratio).toBeGreaterThanOrEqual(BOUNDARY_FLOOR);
  });

  test(`tier 3: the quieter field keeps its full border at the floor — ${theme}`, async ({ page }) => {
    await applyAxes(page, { theme });
    const { ratio, edge, ground } = await bottomEdgeContrast(page, 'tier3-low');
    expect(
      ratio,
      `border ${edge} on ${ground} reads ${ratio.toFixed(2)}:1 — quieter type, never a quieter boundary`,
    ).toBeGreaterThanOrEqual(BOUNDARY_FLOOR);
  });
}

test('tier 2 is a real control: tab order, native overflow, inherited direction', async ({ page }) => {
  const el = page.locator('#tier2-overflow'); // carries a value longer than its box
  await el.scrollIntoViewIfNeeded();

  // Normal tab order — focusable like any input, no tabindex games.
  await el.focus();
  await expect(el).toBeFocused();
  const tabindex = await el.getAttribute('tabindex');
  expect(tabindex, 'a real control needs no tabindex').toBeNull();

  // Native overflow: the value scrolls inside the control, never truncated
  // into a different value.
  const overflow = await el.evaluate((node: HTMLInputElement) => {
    node.scrollLeft = 9999;
    return {
      scrollable: node.scrollWidth > node.clientWidth,
      scrolled: node.scrollLeft > 0,
      value: node.value,
    };
  });
  expect(overflow.scrollable, 'the long value must overflow the box').toBe(true);
  expect(overflow.scrolled, 'and native scrolling must reach it').toBe(true);
  expect(overflow.value.length).toBeGreaterThan(40);

  // Direction inherits: the RTL specimen computes rtl with no per-control work.
  const dir = await page
    .locator('#tier2-rtl')
    .evaluate((node) => getComputedStyle(node).direction);
  expect(dir).toBe('rtl');
});

test('the tier modifiers change no behaviour-bearing attribute', async ({ page }) => {
  // The underline is APPEARANCE only. Same tag, same type, same absence of
  // ARIA the base field would not carry.
  const attrs = await page.evaluate(() => {
    const tier2 = document.querySelector('#tier2-underline')!;
    const base = document.querySelector('#geo-input')!;
    const names = (el: Element) =>
      el
        .getAttributeNames()
        .filter((n) => n.startsWith('aria-') || n === 'role' || n === 'tabindex')
        .sort();
    return { tier2: names(tier2), base: names(base), tag: tier2.tagName };
  });
  expect(attrs.tag).toBe('INPUT');
  expect(attrs.tier2).toEqual(attrs.base);
});
