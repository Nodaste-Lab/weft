/**
 * The mode-invariant fixed tokens, measured at RUNTIME across every axis.
 *
 * scripts/__tests__/css-contract.node.mjs proves the invariance at the source
 * level — each fixed token declared once in the base block and re-declared in
 * no theme or palette block. This suite proves the same thing where a consumer
 * actually reads it: the resolved custom property on <html> under every
 * palette × theme × density the file ships. A cascade that reintroduced a
 * flip (a later block, an @import, a bridge alias) would pass the source
 * check and fail here. (Owner note on weft#27: cover both contracts.)
 */
import { expect, test } from '@playwright/test';
import { DENSITIES, PALETTES, SPECIMEN_PAGE, THEMES, applyAxes, axisLabel } from './harness';

/** Value pinned in 04-design-system § Tokens, "Mode-invariant brand fixed colors". */
const FIXED: Record<string, string> = {
  '--weft-brand-cream': '#fbf8f0',
  '--weft-fixed-white': '#ffffff',
  '--weft-fixed-ink': '#0b1020',
  '--weft-fixed-cream': '#f4f1e8',
};

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

test('the fixed tokens resolve to the same value under every palette, theme and density', async ({ page }) => {
  const problems: string[] = [];
  for (const palette of PALETTES) {
    for (const theme of THEMES) {
      for (const density of DENSITIES) {
        const axes = { palette, theme, density };
        await applyAxes(page, axes);
        const resolved = await page.evaluate((names) => {
          const cs = getComputedStyle(document.documentElement);
          return Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim().toLowerCase()]));
        }, Object.keys(FIXED));
        for (const [name, want] of Object.entries(FIXED)) {
          if (resolved[name] !== want) {
            problems.push(`${axisLabel(axes)}: ${name} resolves to "${resolved[name]}", expected ${want}`);
          }
        }
      }
    }
  }
  expect(problems, problems.join('\n')).toEqual([]);
});

test('"fixed" is a real distinction: --weft-ink flips with the theme while --weft-fixed-ink does not', async ({ page }) => {
  const read = async (theme: 'light' | 'dark') => {
    await applyAxes(page, { palette: 'weft', theme, density: 'compact' });
    return page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        ink: cs.getPropertyValue('--weft-ink').trim().toLowerCase(),
        fixedInk: cs.getPropertyValue('--weft-fixed-ink').trim().toLowerCase(),
      };
    });
  };
  const light = await read('light');
  const dark = await read('dark');
  expect(light.ink, 'light --weft-ink is the value --weft-fixed-ink holds').toBe(light.fixedInk);
  expect(dark.ink, 'dark mode moves --weft-ink').not.toBe(light.ink);
  expect(dark.fixedInk, 'dark mode leaves --weft-fixed-ink alone').toBe(light.fixedInk);
});
