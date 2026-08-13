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
 * The choice rows are absent too, since P7: they answer to
 * `--weft-choice-row-h` — decision 1's clearance reading (b), where the row
 * stays 32px clearing the 24px control floor and the stack gap makes adjacent
 * rows sit exactly 44px apart. A choice row only matches the control tier
 * where a flex row stretches it (the toolbar case, asserted separately).
 */
const TIER_CONTROLS = ['input', 'select', 'button'] as const;

interface Measured {
  tier: number;
  choiceRowH: number;
  choiceGap: number;
  heights: Record<string, number>;
  rowHeights: Record<string, number>;
  stackTops: number[];
}

async function measureDensity(page: Page, density: Density): Promise<Measured> {
  await applyAxes(page, { density });
  return page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const tier = parseFloat(rootStyle.getPropertyValue('--weft-control-h'));
    const choiceRowH = parseFloat(rootStyle.getPropertyValue('--weft-choice-row-h'));
    const choiceGap = parseFloat(rootStyle.getPropertyValue('--weft-choice-gap'));
    const read = (scope: ParentNode, spec: string) => {
      const out: Record<string, number> = {};
      for (const el of scope.querySelectorAll<HTMLElement>(`[data-spec="${spec}"]`)) {
        out[el.dataset.control!] = Number(el.getBoundingClientRect().height.toFixed(2));
      }
      return out;
    };
    const row = document.querySelector('[data-spec="geometry-row"]')!;
    const stackTops = [
      ...document.querySelectorAll<HTMLElement>('[data-spec="choice-stack"] .weft-checkbox-wrap'),
    ].map((el) => Number(el.getBoundingClientRect().top.toFixed(2)));
    return {
      tier,
      choiceRowH,
      choiceGap,
      heights: read(document, 'geometry'),
      rowHeights: read(row, 'geometry'),
      stackTops,
    };
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

    test('choice rows take the choice-row height, not the control tier', async ({ page }) => {
      // The cause the board hand-rolled .weft-board-check: the wrap took the
      // full control height — 44px at marketing — which no 258px rail can
      // afford. Decision 1 settled the row model instead: the row is
      // --weft-choice-row-h, clearing the 24px floor on its own.
      const { choiceRowH, heights } = await measureDensity(page, density);
      expect(choiceRowH, 'the --weft-choice-row-h token must exist').toBeGreaterThanOrEqual(24);
      await measureAll(
        (['checkbox-row', 'radio-row'] as const).map((control) => {
          const actual = heights[control];
          return {
            key: `geometry/${density}/${control}`,
            shortfall: within(actual, choiceRowH, TOLERANCE),
            evidence: `${actual}px against a ${choiceRowH}px choice row`,
            failure: `The ${control} misses the choice-row height by ${Math.abs(actual - choiceRowH).toFixed(2)}px.`,
          };
        }),
      );
    });

    test('stacked choice rows sit exactly 44px apart — the clearance rule as geometry', async ({ page }) => {
      // Clearance reading (b): an undisturbed 44px band measured outward where
      // a neighbour exists. For equal-height stacked rows that is row height
      // plus stack gap, and 32 + 12 = 44 by construction of the two tokens —
      // measured here rather than trusted, at every density.
      const { choiceRowH, choiceGap, stackTops } = await measureDensity(page, density);
      expect(stackTops.length, 'the choice-stack specimen must hold at least two rows').toBeGreaterThanOrEqual(2);
      const spacing = Number((stackTops[1] - stackTops[0]).toFixed(2));
      await measure({
        key: `geometry/${density}/choice-stack-clearance`,
        shortfall: within(spacing, 44, TOLERANCE),
        evidence: `row spacing ${spacing}px (row ${choiceRowH}px + gap ${choiceGap}px)`,
        failure: `Adjacent choice rows sit ${spacing}px apart; the clearance rule wants 44px.`,
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

/**
 * The compose model (P5, decision 1's D4/T2 reconciliation, owner call
 * 2026-08-11): density sets the tier, size steps within it. The step map is
 * DECIDED, not derived, so it is pinned here by value — reading the token
 * alone would let the map drift by token edit:
 *
 *   tier 44 (marketing) → sm 36
 *   tier 36 (compact)   → sm 32   — matches React's shipped fixed-pixel sm
 *   tier 34 (dense)     → sm 32   — D4's board buttons stay exactly 32px
 */
const SM_STEP: Record<Density, number> = { marketing: 36, compact: 32, dense: 32 };

/** Katie's call, 2026-08-10: density-scaled search trailing padding. */
const SEARCH_PAD_END: Record<Density, number> = { marketing: 36, compact: 32, dense: 30 };

/**
 * The two regression pins P5 must not move, hardcoded DELIBERATELY where every
 * other height test reads the live token: compact stays 36 (T2 chose path (a)
 * over tightening compact — that was the entire basis of the decision) and
 * dense stays 34 (Heddle's board depends on it). A token edit that moves
 * either should fail a test that does not follow the token.
 */
for (const [density, pinned] of [['compact', 36], ['dense', 34]] as const) {
  test(`REGRESSION PIN — the ${density} tier stays ${pinned}px`, async ({ page }) => {
    await applyAxes(page, { density });
    const tier = await page.evaluate(
      () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--weft-control-h')),
    );
    expect(tier, `${density} is pinned by decision, not by token`).toBe(pinned);
  });
}

for (const density of DENSITIES) {
  test.describe(`${density} density — the size step`, () => {
    test('the sm step token carries the decided map', async ({ page }) => {
      await applyAxes(page, { density });
      const step = await page.evaluate(
        () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--weft-control-h-sm')),
      );
      await measure({
        key: `geometry/${density}/sm-step-token`,
        shortfall: Number.isFinite(step) ? within(step, SM_STEP[density], 0) : SM_STEP[density],
        evidence: `--weft-control-h-sm resolves to ${step}px; the decided step is ${SM_STEP[density]}px`,
        failure: `The ${density} sm step token is ${step}px, not the decided ${SM_STEP[density]}px.`,
      });
    });

    test('is-sm controls render the step, and agree with each other', async ({ page }) => {
      await applyAxes(page, { density });
      const heights = await page.evaluate(() => {
        const out: Record<string, number> = {};
        for (const el of document.querySelectorAll<HTMLElement>('[data-spec="geometry-sm"]')) {
          out[el.dataset.control!] = Number(el.getBoundingClientRect().height.toFixed(2));
        }
        return out;
      });
      for (const control of TIER_CONTROLS) {
        expect(heights[control], `no is-sm ${control} specimen at ${density}`).toBeGreaterThan(0);
      }
      await measureAll(
        TIER_CONTROLS.map((control) => {
          const actual = heights[control];
          return {
            key: `geometry/${density}/sm-${control}`,
            shortfall: within(actual, SM_STEP[density], TOLERANCE),
            evidence: `${actual}px against the decided ${SM_STEP[density]}px step`,
            failure: `The is-sm ${control} misses the ${density} step by ${Math.abs(actual - SM_STEP[density]).toFixed(2)}px.`,
          };
        }),
      );
    });

    test('the search input reserves the decided trailing padding for its clear', async ({ page }) => {
      await applyAxes(page, { density });
      const measured = await page.evaluate(() => {
        const el = document.querySelector<HTMLInputElement>('[data-search-case="search-empty"] .weft-input')!;
        return {
          token: parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--weft-search-pad-end'),
          ),
          padRight: Number(parseFloat(getComputedStyle(el).paddingRight).toFixed(2)),
        };
      });
      await measureAll([
        {
          key: `geometry/${density}/search-pad-token`,
          shortfall: Number.isFinite(measured.token)
            ? within(measured.token, SEARCH_PAD_END[density], 0)
            : SEARCH_PAD_END[density],
          evidence: `--weft-search-pad-end resolves to ${measured.token}px; decided ${SEARCH_PAD_END[density]}px`,
          failure: `The ${density} search pad token is ${measured.token}px, not the decided ${SEARCH_PAD_END[density]}px.`,
        },
        {
          key: `geometry/${density}/search-pad-rendered`,
          shortfall: within(measured.padRight, SEARCH_PAD_END[density], TOLERANCE),
          evidence: `padding-right ${measured.padRight}px against the decided ${SEARCH_PAD_END[density]}px`,
          failure: `The search input reserves ${measured.padRight}px trailing, not the decided ${SEARCH_PAD_END[density]}px.`,
        },
      ]);
    });
  });
}

test('the textarea floor is a token, and the floor governs', async ({ page }) => {
  // Beyond tracks-density below (which counts distinct tiers), the fix is a
  // TOKEN: --weft-textarea-min-h declared per density block, with the rendered
  // floor following it. A hand-tuned per-tier pixel would satisfy the distinct
  // count and reintroduce exactly the class of fix P2 refused.
  for (const density of DENSITIES) {
    await applyAxes(page, { density });
    const m = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[data-spec="geometry"][data-control="textarea"]')!;
      return {
        token: parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--weft-textarea-min-h'),
        ),
        rendered: Number(el.getBoundingClientRect().height.toFixed(2)),
      };
    });
    await measure({
      key: `geometry/${density}/textarea-floor-token`,
      shortfall: Number.isFinite(m.token) ? within(m.rendered, m.token, TOLERANCE) : 1,
      evidence: `--weft-textarea-min-h ${m.token}px, rendered ${m.rendered}px at ${density}`,
      failure: `The ${density} textarea floor does not follow --weft-textarea-min-h.`,
    });
  }
});

test('the textarea floor tracks the density tier', async ({ page }) => {
  const seen: Record<string, number> = {};
  for (const density of DENSITIES) {
    const { heights } = await measureDensity(page, density);
    seen[density] = heights.textarea;
  }
  // Shortfall counts the tiers that FAIL to differ, not merely whether any two
  // do. `distinct.size > 1` would have been satisfied by 96/96/80 — a fix that
  // moved dense and left compact still wearing the marketing floor. The three
  // control tiers are all different, so a textarea tracking them has three
  // distinct floors; anything less is a partial fix and the number says how
  // partial.
  const distinct = new Set(Object.values(seen));
  await measure({
    key: 'geometry/textarea/tracks-density',
    shortfall: DENSITIES.length - distinct.size,
    evidence: `heights ${JSON.stringify(seen)}; ${distinct.size} distinct of ${DENSITIES.length} tiers`,
    failure:
      `The textarea floor takes ${distinct.size} distinct values across ${DENSITIES.length} ` +
      'density tiers, so it does not track them — a compact surface gets a marketing-sized ' +
      'textarea.',
  });
});
