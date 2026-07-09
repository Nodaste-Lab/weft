// Reusable design-system assertions for component tests.
//
// These back the data-driven gallery + product-panel suites (NOD-1093) so a new
// primitive or panel is held to the same token + accessibility contract without
// hand-writing bespoke checks per component.
import { expect } from 'vitest';
import { axe, toHaveNoViolations, type JestAxeConfigureOptions } from 'jest-axe';
// The ONE canonical raw-color regex — shared with the static audit
// (scripts/audit-design-system.mjs) so the runtime and build-time gates never
// drift. Importing the package tooling keeps a single source of truth.
import { RAW_COLOR_PATTERN_GLOBAL } from '../../tooling/raw-color-pattern.js';

expect.extend(toHaveNoViolations);

export interface RawColorOffender {
  /** Tag name + any data-slot, for locating the node. */
  node: string;
  /** The offending inline-style declaration. */
  style: string;
}

/**
 * Assert that nothing in the rendered tree carries a raw color in an inline
 * `style` attribute. Tokens (`var(--hud-*)`, `var(--weft-*)`) pass; literal
 * hex / rgb / rgba / hsl — and token fallbacks like `var(--x, #fff)` that pin a
 * raw color — fail. Catches a primitive (or gallery example) that hardcodes a
 * color instead of reading a themeable token.
 *
 * Note: this inspects INLINE styles only. Color drift expressed through Tailwind
 * classes resolves in CSS (out of jsdom's reach) and is covered by the
 * visual-regression suite instead.
 */
export function expectNoRawColors(container: HTMLElement): void {
  const offenders: RawColorOffender[] = [];
  const nodes: HTMLElement[] = [container, ...Array.from(container.querySelectorAll<HTMLElement>('*'))];

  for (const el of nodes) {
    const style = el.getAttribute('style');
    if (!style) continue;
    RAW_COLOR_PATTERN_GLOBAL.lastIndex = 0;
    if (!RAW_COLOR_PATTERN_GLOBAL.test(style)) continue;
    const slot = el.getAttribute('data-slot');
    const testid = el.getAttribute('data-testid');
    const label = [el.tagName.toLowerCase(), slot && `[data-slot=${slot}]`, testid && `[data-testid=${testid}]`]
      .filter(Boolean)
      .join('');
    offenders.push({ node: label, style });
  }

  expect(
    offenders,
    offenders.length
      ? `Raw colors in inline styles (use var(--hud-*) / var(--weft-*) tokens):\n${offenders
          .map((o) => `  ${o.node}: ${o.style}`)
          .join('\n')}`
      : undefined,
  ).toEqual([]);
}

// Rules that only make sense for a whole document, not an isolated component
// fragment: they fire spuriously when axe runs on a sub-tree. Disabled by
// default for component-level checks. color-contrast is also off — jsdom has no
// layout/paint engine, so contrast is a visual-regression concern instead.
const COMPONENT_LEVEL_RULE_OVERRIDES = {
  'color-contrast': { enabled: false },
  region: { enabled: false },
  'landmark-one-main': { enabled: false },
  'page-has-heading-one': { enabled: false },
} as const;

/**
 * Assert the rendered tree has no axe accessibility violations. Document-level
 * structure rules (region/landmark/heading-one) and color-contrast are disabled
 * by default because they are not meaningful for an isolated component. Pass
 * `rules` to re-enable or tune specific checks (e.g. landmarks for a full panel).
 */
export async function expectA11yClean(
  container: HTMLElement,
  options: JestAxeConfigureOptions = {},
): Promise<void> {
  const results = await axe(container, {
    ...options,
    rules: { ...COMPONENT_LEVEL_RULE_OVERRIDES, ...(options.rules ?? {}) },
  });
  expect(results).toHaveNoViolations();
}
