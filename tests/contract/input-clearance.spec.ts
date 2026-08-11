/**
 * Clearance under adversarial geometry (P5).
 *
 * The equal-height stacked-row case is proved in input-geometry.spec.ts and
 * is exactly why it is not sufficient: it is the case that cannot fail once
 * the two tokens are right. These fixtures are the shapes that break naive
 * centre-to-centre reads — wrapped rows, a label three lines long with a
 * trailing action, a 258px rail, the same rail RTL, diagonal neighbours,
 * a control flush against an overflow-hidden edge, and a hidden control
 * sitting in the middle of a visible set.
 *
 * What is asserted, computationally and never by screenshot:
 *
 *  1. NO OVERLAP — two interactive targets never intersect.
 *  2. TARGET SPACING — every visible target either measures 24×24 itself or
 *     clears SC 2.5.8's spacing test: a 24px-diameter circle centred on the
 *     target intersects no other target's rectangle. This is the normative
 *     Level AA shape of the rule; the 44px band is the house clearance rule
 *     on top of it, proved where it binds (the stacked rows, in geometry).
 *  3. HIDDEN IS NOT A TARGET — a display:none control contributes nothing:
 *     the scanner must skip it rather than measure a zero-size rectangle at
 *     the origin, and the fixture exists to catch a scanner that does not.
 *
 * Direction matters: the RTL rail runs the same assertions mirrored, because
 * clearance that only holds LTR is layout luck, not clearance.
 */
import { expect, test } from '@playwright/test';
import { DENSITIES, SPECIMEN_PAGE, applyAxes } from './harness';
import { measureAll } from './ratchet';

const INTERACTIVE = 'input, select, textarea, button, a[href], [tabindex]';

interface TargetRect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FixtureRead {
  fixture: string;
  targets: TargetRect[];
  skippedHidden: number;
}

async function readFixtures(page: import('@playwright/test').Page): Promise<FixtureRead[]> {
  return page.evaluate((selector) => {
    const out: FixtureRead[] = [];
    for (const scope of document.querySelectorAll<HTMLElement>('[data-clearance]')) {
      const targets: TargetRect[] = [];
      let skippedHidden = 0;
      scope.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) {
          skippedHidden += 1;
          return;
        }
        targets.push({
          id: `${el.tagName.toLowerCase()}#${el.id || i}`,
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
        });
      });
      out.push({ fixture: scope.dataset.clearance!, targets, skippedHidden });
    }
    return out;
  }, INTERACTIVE);
}

const intersects = (a: TargetRect, b: TargetRect) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Distance from a rect's centre to the nearest point of another rect. */
function centreToRect(a: TargetRect, b: TargetRect): number {
  const cx = a.x + a.w / 2;
  const cy = a.y + a.h / 2;
  const nx = Math.max(b.x, Math.min(cx, b.x + b.w));
  const ny = Math.max(b.y, Math.min(cy, b.y + b.h));
  return Math.hypot(cx - nx, cy - ny);
}

for (const density of DENSITIES) {
  test(`adversarial clearance holds at ${density}`, async ({ page }) => {
    await page.goto(SPECIMEN_PAGE);
    await applyAxes(page, { density });
    const fixtures = await readFixtures(page);

    expect(fixtures.length, 'the clearance fixtures must exist on the page').toBeGreaterThanOrEqual(7);
    const hiddenFixture = fixtures.find((f) => f.fixture === 'hidden');
    expect(hiddenFixture?.skippedHidden, 'the hidden fixture must exercise the skip path').toBe(1);
    expect(hiddenFixture?.targets.length, 'both visible controls still measured').toBe(2);

    const claims = [];
    for (const { fixture, targets } of fixtures) {
      for (let i = 0; i < targets.length; i += 1) {
        for (let j = i + 1; j < targets.length; j += 1) {
          const a = targets[i];
          const b = targets[j];
          claims.push({
            key: `clearance/${density}/${fixture}/overlap/${a.id}~${b.id}`,
            shortfall: intersects(a, b) ? 1 : 0,
            evidence: `${a.id} at ${a.x},${a.y} ${a.w}×${a.h}; ${b.id} at ${b.x},${b.y} ${b.w}×${b.h}`,
            failure: `Interactive targets ${a.id} and ${b.id} overlap in ${fixture}.`,
          });
        }
        const t = targets[i];
        const big = t.w >= 24 && t.h >= 24;
        const worstIntrusion = big
          ? 0
          : Math.max(
              0,
              ...targets
                .filter((_, j) => j !== i)
                .map((other) => Math.max(0, 12 - centreToRect(t, other))),
            );
        claims.push({
          key: `clearance/${density}/${fixture}/target/${t.id}`,
          shortfall: worstIntrusion,
          evidence: big
            ? `${t.id} measures ${t.w}×${t.h} — clears 24×24 on its own`
            : `${t.id} measures ${t.w}×${t.h}; nearest neighbour edge ` +
              `${(12 - worstIntrusion).toFixed(2)}px from its centre (needs 12)`,
          failure:
            `${t.id} in ${fixture} is under 24×24 and another target intrudes into its ` +
            '24px spacing circle (SC 2.5.8).',
        });
      }
    }
    await measureAll(claims);
  });
}
