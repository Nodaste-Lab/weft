import * as React from "react";

import { cn } from "./utils";

/*
 * TierGroup — urgency-toned priority tier for operator boards.
 *
 * Groups action rows by what the operator must do (blocked / awaiting / fyi),
 * not by data type. Each group is a bordered card with a color-accented header
 * that communicates urgency at a glance.
 *
 * Accessibility: the component renders a labelled `<section>` with
 * `aria-label` carrying the tier name so screen-reader users get a named
 * landmark for each urgency group.
 *
 * Empty-shell guard: if `children` is falsy/empty the component renders null.
 * Callers should not render TierGroup for empty tiers — an empty board reads as
 * "nothing needs you"; show EmptyState instead. The guard prevents an
 * empty-header shell from appearing when the tier list is conditionally built.
 *
 * Plain-CSS counterpart: `.weft-tier-group` in weft-components.css.
 */

export type TierGroupUrgency = "blocked" | "awaiting" | "fyi";

const URGENCY_CLASSES: Record<
  TierGroupUrgency,
  { border: string; head: string }
> = {
  blocked: {
    border: "border-[color-mix(in_srgb,var(--weft-stop)_45%,transparent)]",
    head: "bg-[color-mix(in_srgb,var(--weft-stop)_10%,transparent)]",
  },
  awaiting: {
    border: "border-[color-mix(in_srgb,var(--weft-warn)_40%,transparent)]",
    head: "bg-[color-mix(in_srgb,var(--weft-warn)_10%,transparent)]",
  },
  fyi: {
    border: "border-[var(--weft-rule,var(--border))]",
    head: "bg-[var(--weft-fill-soft,var(--muted))]",
  },
};

function TierGroup({
  className,
  urgency,
  label,
  count,
  subtitle,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  /** Urgency classification — drives border/header colour. */
  urgency: TierGroupUrgency;
  /** Accessible name and visible heading for this tier. */
  label: string;
  /** Optional item count shown in the header badge. */
  count?: number;
  /** Muted sub-label shown beside the heading text. */
  subtitle?: React.ReactNode;
}) {
  // D12: never render an empty shell — a blank tier reads as "all clear".
  // React.Children.toArray flattens and removes null/undefined/boolean values,
  // making it robust to {false && <Row />} patterns and mixed-falsy arrays.
  // Known boundary: an empty fragment (<></>) counts as one element here even
  // though it renders nothing — callers must not pass empty fragments as the
  // sole child and expect the guard to catch them.
  // React.Children.toArray drops null/undefined/booleans but KEEPS 0 and "",
  // so `{items.length && rows}` with zero items would render a visible "0".
  const renderable = React.Children.toArray(children).filter(
    (child) => !(child === 0 || child === "" || child === "0"),
  );
  if (renderable.length === 0) {
    return null;
  }

  const { border, head } = URGENCY_CLASSES[urgency];

  return (
    <section
      data-slot="tier-group"
      data-urgency={urgency}
      aria-label={label}
      className={cn(
        "mb-3 overflow-hidden rounded-[var(--weft-radius-chip,6px)] border",
        border,
        className,
      )}
      {...props}
    >
      <div
        data-slot="tier-group-head"
        className={cn(
          "flex items-center gap-2 border-b border-[var(--weft-rule,var(--border))] px-[11px] py-2",
          "text-[13px] font-semibold",
          head,
        )}
      >
        <span className="truncate">{label}</span>
        {subtitle ? (
          <span className="shrink-0 text-[12px] font-normal text-[var(--weft-muted,var(--muted-foreground))]">
            {subtitle}
          </span>
        ) : null}
        {count !== undefined ? (
          <span
            data-slot="tier-group-count"
            className={cn(
              "ml-auto shrink-0 rounded-[var(--weft-radius-pill,9999px)]",
              "border border-[var(--weft-rule,var(--border))]",
              "px-2 py-[1px] font-mono text-[11px]",
              "text-[var(--weft-muted,var(--muted-foreground))]",
            )}
          >
            {count}
          </span>
        ) : null}
      </div>
      <div data-slot="tier-group-body">{children}</div>
    </section>
  );
}

export { TierGroup };
