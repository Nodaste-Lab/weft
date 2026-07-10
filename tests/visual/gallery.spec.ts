import { expect, test } from '@playwright/test';

// A representative, render-stable subset of showcase primitives. Every id maps
// to the gallery's `<section id="${id}-example">` cards. Broad enough to catch
// token/theming regressions; small enough to keep CI fast.
const SECTIONS = [
  'button',
  'badge',
  'callout',
  'card',
  'chip',
  'input',
  'select',
  'switch',
  'table',
  'tabs',
  'empty-state',
  'hud-list-row',
];

for (const theme of ['light', 'dark'] as const) {
  test(`gallery key primitives — ${theme}`, async ({ page }) => {
    await page.goto('/');
    if (theme === 'dark') {
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    }
    await page.waitForFunction(() => document.fonts.status === 'loaded');
    for (const id of SECTIONS) {
      const section = page.locator(`#${id}-example`);
      await expect(section, `${id} must have a stable visual target`).toHaveCount(1);
      await section.scrollIntoViewIfNeeded();
      await expect(section).toHaveScreenshot(`gallery-${id}-${theme}.png`);
    }
  });
}
