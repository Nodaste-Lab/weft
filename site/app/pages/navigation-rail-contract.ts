/** Lab contract shared by the foundations inspector, atoms, rows and rail.
 * Navigation tokens and reusable primitives are package contracts; responsive policy remains compositional.
 */
export const railDensities = {
  default: { row: 44, target: 44 },
  compact: { row: 36, target: 24 },
  dense: { row: 28, target: 24 },
} as const;
export const railGeometry = {
  gap: 4,
  inset: 4,
  indent: 8,
  pointerTarget: 24,
  touchTarget: 44,
} as const;
export function railPreviewTokens(density: string) {
  const tier =
    railDensities[density as keyof typeof railDensities] ??
    railDensities.default;
  return {
    "--rail-lab-row-h": `${tier.row}px`,
    "--rail-lab-target": `${tier.target}px`,
    "--rail-lab-gap": `${railGeometry.gap}px`,
    "--rail-lab-inset": `${railGeometry.inset}px`,
    "--rail-lab-indent": `${railGeometry.indent}px`,
  };
}
export const railSizingDecision =
  "Navigation has its own sizing: default 44px, compact 36px, dense 28px row minimums. Generic --weft-row-h remains 48 / 32 / 30px. These navigation values have dedicated --weft-navigation-* package tokens; generic row sizing is unchanged.";

export const railDecisions = [
  {
    title: "Navigation-list pattern",
    current:
      "Existing document-tree guidance describes one row control, arrow-key tree navigation and 14/18px nesting. This rail separates disclosure from opening, uses nested lists with Tab navigation and 8px nesting.",
    recommendation:
      "Implementation direction: keep this a distinct navigation-list pattern. Separate expand/open controls and Tab navigation are intentional; existing ARIA tree guidance remains a separate pattern.",
  },
  {
    title: "Sidebar responsibility",
    current:
      "Rail: resizable width, nested files and drawer below 1024px. Released Sidebar: fixed width defaults, collapse behavior and shared mobile breakpoint.",
    recommendation:
      "Implementation direction: compose the workspace-navigation-rail template from shared primitives. Keep resize and the configurable responsive policy in the composition to avoid changing other Sidebar consumers.",
  },
  {
    title: "Count badge contrast",
    current:
      "Badge count uses muted text. Rail counters override it with ink so pressed backgrounds retain contrast.",
    recommendation:
      "Implementation direction: retain the token-based ink treatment in rail counts. Do not change unrelated Badge consumers; publish an additive semantic treatment only with its contract update and contrast coverage.",
  },
  {
    title: "Compact identity",
    current:
      "Avatar supports class overrides but has a 40px default and inherited fallback type. Rail uses 24px Space / 28px account identities and 12px / 11px initials.",
    recommendation:
      "Implementation direction: document the compact identity composition with explicit size and type tokens. Preserve the released Avatar default; reusable named sizes can be added with a versioned contract later.",
  },
] as const;
