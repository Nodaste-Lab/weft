/**
 * The plain-CSS search recipe's clear-visibility mechanics (P7, document B §3).
 *
 * The clear control appears only when there is something to clear, and never
 * on a field that cannot be edited — keyed on native state (:placeholder-shown,
 * :disabled, [readonly]) so a bare-markup iframe author gets the behaviour
 * without knowing a modifier class exists. Asserted on computed style against
 * the specimen page, in both themes: :has() support regressing in the pinned
 * browser, or a refactor replacing the native-state keys with a class an
 * author has no reason to know, both fail here.
 */
import { expect, test } from '@playwright/test';
import { SPECIMEN_PAGE, applyAxes } from './harness';

const CASES = [
  { id: 'search-empty', visible: false, why: 'nothing to clear while the placeholder shows' },
  { id: 'search-filled', visible: true, why: 'content present — the clear appears' },
  { id: 'search-disabled', visible: false, why: 'a disabled field cannot be edited, so not cleared' },
  { id: 'search-readonly', visible: false, why: 'a read-only field cannot be edited, so not cleared' },
] as const;

for (const theme of ['light', 'dark'] as const) {
  test(`clear visibility follows native state — ${theme}`, async ({ page }) => {
    await page.goto(SPECIMEN_PAGE);
    await applyAxes(page, { theme });
    for (const c of CASES) {
      const display = await page
        .locator(`[data-search-case="${c.id}"] .weft-search-clear`)
        .evaluate((el) => getComputedStyle(el).display);
      expect(display !== 'none', `${c.id} (${theme}): ${c.why}`).toBe(c.visible);
    }
  });
}

test('the clear control clears the 24px target floor bare', async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
  const box = await page
    .locator('[data-search-case="search-filled"] .weft-search-clear')
    .boundingBox();
  expect(box, 'the filled specimen must render its clear').toBeTruthy();
  expect(box!.width, 'SC 2.5.8: 24px in both dimensions, with no wrapper doing the work').toBeGreaterThanOrEqual(24);
  expect(box!.height).toBeGreaterThanOrEqual(24);
});

test('the recipe strips the UA cancel affordance in favour of the named one', async ({ page }) => {
  // getComputedStyle cannot resolve vendor pseudo-elements, so the check reads
  // the parsed CSSOM instead: a vendor-pseudo rule that fails to parse is
  // DROPPED silently by the browser, which is exactly how this rule would
  // regress — a refactor mangles the selector, nothing errors, and the UA's
  // unnamed cancel button quietly returns beside the named one.
  await page.goto(SPECIMEN_PAGE);
  const rule = await page.evaluate(() => {
    for (const sheet of document.styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const r of rules) {
        if (
          r instanceof CSSStyleRule &&
          r.selectorText.includes('::-webkit-search-cancel-button') &&
          r.selectorText.includes('.weft-search')
        ) {
          return { appearance: r.style.getPropertyValue('appearance') };
        }
      }
    }
    return null;
  });
  expect(rule, 'the cancel-button rule must survive parsing in the pinned browser').not.toBeNull();
  expect(rule!.appearance).toBe('none');
});
