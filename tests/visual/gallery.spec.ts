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
  'dot',
  // D2–D4, D7, D10, D12, D14 additions
  'stat-row',
  'action-button-row',
  'toggle-group',
  'panel-header',
  'tier-group',
  'copyable-ref',
  // The two recorded gallery gaps: the async status presentation and the
  // error-state card — the baselines these ids add are the point of the cards
  // (error rendering was carried entirely by the contract suites before).
  'form-status',
  'input-error-states',
];

for (const theme of ['light', 'dark', 'compact', 'dense'] as const) {
  test(`gallery key primitives — ${theme}`, async ({ page }) => {
    await page.goto('/');
    if (theme === 'dark') {
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    }
    if (theme === 'compact') {
      await page.evaluate(() => document.documentElement.setAttribute('data-density', 'compact'));
    }
    if (theme === 'dense') {
      await page.evaluate(() => document.documentElement.setAttribute('data-density', 'dense'));
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
