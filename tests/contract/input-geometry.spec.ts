/**
 * Does a control render at the height its density tier declares?
 *
 * The tier is read from the live `--weft-control-h` at the root, not restated
 * here — a test that hardcodes 44/36/34 passes after someone changes the token
 * and the control does not follow.
 *
 * P1 covers density. P5 widens this to every size the sizing model admits and
 * to search, switch, slider and the affordance slots, none of which exist yet.
 */
import { expect, test, type Page } from '@playwright/test';
import { DENSITIES, SPECIMEN_PAGE, applyAxes, type Density } from './harness';
import { atLeast, binary, measure, measureAll, within } from './ratchet';

/** One pixel. Sub-pixel layout is normal; a whole pixel of drift is a defect. */
const TOLERANCE = 1;

/**
 * Controls that answer to `--weft-control-h`. The textarea is deliberately
 * absent: it is multi-line and has its own floor, checked separately below.
 */
const TIER_CONTROLS = ['input', 'select', 'button', 'checkbox-row', 'radio-row'] as const;

interface Measured {
  tier: number;
  heights: Record<string, number>;
  rowHeights: Record<string, number>;
}

async function measureDensity(page: Page, density: Density): Promise<Measured> {
  await applyAxes(page, { density });
  return page.evaluate(() => {
    const tier = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--weft-control-h'),
    );
    const read = (scope: ParentNode, spec: string) => {
      const out: Record<string, number> = {};
      for (const el of scope.querySelectorAll<HTMLElement>(`[data-spec="${spec}"]`)) {
        out[el.dataset.control!] = Number(el.getBoundingClientRect().height.toFixed(2));
      }
      return out;
    };
    const row = document.querySelector('[data-spec="geometry-row"]')!;
    return { tier, heights: read(document, 'geometry'), rowHeights: read(row, 'geometry') };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(SPECIMEN_PAGE);
});

for (const density of DENSITIES) {
  test.describe(`${density} density`, () => {
    test('every control matches the tier it declares', async ({ page }) => {
      const { tier, heights } = await measureDensity(page, density);
      for (const control of TIER_CONTROLS) {
        expect(heights[control], `no ${control} specimen at ${density}`).toBeGreaterThan(0);
      }
      // measureAll, not a loop of measure: every control in the row has to be
      // measured even when an earlier one fails, or the run that flips the first
      // key is the run that stops checking the rest.
      await measureAll(
        TIER_CONTROLS.map((control) => {
          const actual = heights[control];
          return {
            key: `geometry/${density}/${control}`,
            shortfall: within(actual, tier, TOLERANCE),
            evidence: `${actual}px against a ${tier}px tier`,
            failure: `The ${control} misses its own tier by ${Math.abs(actual - tier).toFixed(2)}px.`,
          };
        }),
      );
    });

    test('controls in one toolbar row agree on their height', async ({ page }) => {
      const { tier, rowHeights } = await measureDensity(page, density);
      const values = Object.values(rowHeights);
      const spread = Math.max(...values) - Math.min(...values);
      await measure({
        key: `geometry/${density}/row-heights-agree`,
        shortfall: Math.max(0, spread - TOLERANCE),
        evidence: `spread ${spread.toFixed(2)}px across ${JSON.stringify(rowHeights)} at a ${tier}px tier`,
        failure: `Controls sharing one row differ in height by ${spread.toFixed(2)}px.`,
      });
    });

    test('every control clears the 24px target-size floor', async ({ page }) => {
      // SC 2.5.8 Target Size (Minimum), Level AA, and the floor decision 1
      // settled: 24px for the control itself, 44px as a clearance rule about
      // what may sit beside it. Clearance is P5's adversarial-geometry suite.
      const { heights } = await measureDensity(page, density);
      const smallest = Math.min(...Object.values(heights));
      await measure({
        key: `geometry/${density}/target-size-floor`,
        shortfall: atLeast(smallest, 24),
        evidence: `smallest control ${smallest}px`,
        failure: `The smallest control is ${smallest}px, under the 24px floor.`,
      });
    });
  });
}

test('the textarea floor tracks the density tier', async ({ page }) => {
  const seen: Record<string, number> = {};
  for (const density of DENSITIES) {
    const { heights } = await measureDensity(page, density);
    seen[density] = heights.textarea;
  }
  const distinct = new Set(Object.values(seen));
  await measure({
    key: 'geometry/textarea/tracks-density',
    shortfall: binary(distinct.size > 1),
    evidence: `heights ${JSON.stringify(seen)}`,
    failure:
      'The textarea min-height is the same at every tier, so it tracks no token — a compact ' +
      'surface gets a marketing-sized textarea.',
  });
});
