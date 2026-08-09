/**
 * Heddle's panel-iframe injection, reproduced so this repository can test
 * against it.
 *
 * SOURCE OF TRUTH
 *   Nodaste-Lab/heddle · src/app/panel-packages/weftPanelTheme.ts
 *   read at 08caa76b1 ("build(deps): consume weft 0.1.5")
 *
 * This is a COPY, and a copy can drift. It is a copy anyway because the
 * alternative is worse: reading Heddle's source at test time would make this
 * suite pass or fail depending on whether a sibling checkout happens to exist,
 * and skip silently in CI — which is the same as not testing the consumer
 * condition at all. A stale copy fails loudly the next time someone compares
 * the two; an absent test fails never.
 *
 * What matters here and is asserted downstream is the ORDER. Heddle builds one
 * `<style>` payload:
 *
 *   WEFT_PANEL_STYLE = FONT_FACES + weft.css + TRANSITIONAL_ALIASES + weft-components.css
 *
 * The alias block sits between the two Weft files, so it can read `--weft-*`
 * tokens and can itself be read by the component layer. Injecting the two Weft
 * files adjacent would be a different cascade from the one that ships.
 */

/**
 * Heddle inlines seven woff2 payloads here as data: URIs. They are Heddle's
 * files, not Weft's, and none of the numbers this suite measures — computed
 * font-family strings, control geometry, painted contrast — depends on a font
 * having loaded. The block's POSITION is what is reproduced; its bytes are not.
 */
export const FONT_FACES_PLACEHOLDER =
  '/* Heddle injects seven inlined @font-face blocks at this position. */';

/**
 * The transitional `--hud-*` and `--space-*` aliases, verbatim from
 * weftPanelTheme.ts. Deprecation clock started 2026-07-10; scheduled to drop
 * with weft 1.0.0 (AGENTS.md, Known deferred items). Trimmed to the aliases the
 * component layer can actually reach, because the point is the cascade position
 * rather than the full list.
 */
export const TRANSITIONAL_ALIASES = `:root {
  --space-1: var(--weft-space-1, 4px);
  --space-2: var(--weft-space-2, 8px);
  --space-3: var(--weft-space-3, 12px);
  --space-4: var(--weft-space-4, 16px);
  --space-5: var(--weft-space-5, 24px);
  --space-6: var(--weft-space-6, 32px);
  --weft-radius-sm: var(--weft-radius-chip);
  --hud-border: var(--weft-rule);
  --hud-border-accent: var(--weft-blue);
  --hud-surface: var(--weft-paper);
  --hud-surface-raised: var(--weft-paper);
  --hud-surface-hover: var(--weft-cream);
}`;

/** The panel iframe's CSP, verbatim. Reproduced so the frame under test is as locked down as the real one. */
export const WEFT_PANEL_CSP =
  "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; " +
  "img-src data:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'";

export interface PanelAppearance {
  palette: string;
  theme: string;
  density: string;
}

/** The `data-*` attributes Heddle puts on the frame's <html>. */
export function panelRootAttributes({ palette, theme, density }: PanelAppearance): string {
  const attrs = [`data-palette="${palette}"`];
  if (theme === 'dark') attrs.push('data-theme="dark"');
  if (density === 'compact') attrs.push('data-density="compact"');
  return attrs.join(' ');
}

/** The single `<style>` payload, in Heddle's order. */
export function weftPanelStyle(weftTokens: string, weftComponents: string): string {
  return `${FONT_FACES_PLACEHOLDER}\n${weftTokens}\n${TRANSITIONAL_ALIASES}\n${weftComponents}`;
}
