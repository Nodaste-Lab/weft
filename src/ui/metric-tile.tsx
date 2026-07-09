import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/*
 * MetricTile — small label-over-value tile.
 *
 * Used in SignalBlockRuntime stats (`Urgent / Overdue / Open / Total`),
 * any future battle-tracker stat clusters, and dashboard-style HUD
 * surfaces. Differs from `StatRow` (label-on-left, value-on-right
 * vertical row) by stacking the label on top and emphasizing the value.
 *
 * `valueTone`:
 *   - default  → primary text color
 *   - danger   → urgent / threat / overdue
 *   - warning  → caution / due-soon
 *   - positive → completed / under control
 *   - muted    → "no value" / placeholder
 *
 * `density`:
 *   - default  → 6px 8px padding (HUD-dense)
 *   - compact  → 4px 6px padding (signal-stats density)
 */

const metricTileVariants = cva(
  "flex min-w-0 flex-col gap-0.5 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-section-fill-strong)] [font-family:var(--weft-font-sans)]",
  {
    variants: {
      density: {
        default: "px-2 py-1.5",
        compact: "px-1.5 py-1",
        relaxed: "px-3 py-2",
      },
      orientation: {
        column: "flex-col",
        row: "flex-row items-baseline gap-2",
      },
    },
    defaultVariants: {
      density: "default",
      orientation: "column",
    },
  },
);

const metricTileValueVariants = cva("font-bold leading-none tabular-nums", {
  variants: {
    tone: {
      default: "text-[var(--hud-text-1)]",
      danger: "text-[var(--hud-danger)]",
      warning: "text-[var(--hud-warning)]",
      positive: "text-[var(--hud-positive)]",
      muted: "text-[var(--hud-text-3)]",
      info: "text-[var(--hud-info,var(--primary))]",
    },
    size: {
      sm: "text-[length:var(--text-sm)]",
      md: "text-[length:var(--text-base)]",
      lg: "text-[length:var(--text-lg)]",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "md",
  },
});

type MetricValueTone = NonNullable<VariantProps<typeof metricTileValueVariants>["tone"]>;
type MetricValueSize = NonNullable<VariantProps<typeof metricTileValueVariants>["size"]>;

interface MetricTileProps
  extends Omit<React.ComponentProps<"div">, "children">,
    VariantProps<typeof metricTileVariants> {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  valueTone?: MetricValueTone;
  valueSize?: MetricValueSize;
  fullWidth?: boolean;
}

const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(
  (
    {
      className,
      density,
      orientation,
      label,
      value,
      hint,
      valueTone = "default",
      valueSize = "md",
      fullWidth = true,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="metric-tile"
        data-tone={valueTone}
        className={cn(
          metricTileVariants({ density, orientation }),
          fullWidth && "flex-1",
          className,
        )}
        {...props}
      >
        <span
          data-slot="metric-tile-label"
          className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--hud-text-3)]"
        >
          {label}
        </span>
        <span
          data-slot="metric-tile-value"
          className={cn(metricTileValueVariants({ tone: valueTone, size: valueSize }))}
        >
          {value}
        </span>
        {hint ? (
          <span
            data-slot="metric-tile-hint"
            className="text-[10px] text-[var(--hud-text-3)]"
          >
            {hint}
          </span>
        ) : null}
      </div>
    );
  },
);
MetricTile.displayName = "MetricTile";

export { MetricTile, metricTileVariants, metricTileValueVariants };
export type { MetricTileProps, MetricValueTone, MetricValueSize };
