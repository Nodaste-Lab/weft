import * as React from "react";

import { cn } from "./utils";

/*
 * StatRow — label-value pair for compact readouts.
 *
 * Used in SessionContext participant stats, source status summaries, and recap
 * detail sections. Consolidates the
 * "muted label left, medium-weight value right" pattern.
 *
 * The `value` slot accepts strings, numbers, or arbitrary nodes (e.g. a Badge
 * or a paired icon + text), so this stays useful for non-numeric readouts too.
 *
 * `variant="board"` is an opt-in treatment for operator boards: the label is
 * left-aligned at full width, the value sits on the right, and a `leading`
 * slot (e.g. a Dot or icon) can sit before the label to carry semantic color.
 */
function StatRow({
  className,
  label,
  value,
  hint,
  leading,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** Icon or status dot shown before the label (board variant only). */
  leading?: React.ReactNode;
  variant?: "default" | "board";
}) {
  return (
    <div
      data-slot="stat-row"
      data-variant={variant}
      className={cn(
        "flex items-center gap-2 text-xs",
        variant === "board"
          ? "py-1.5"
          : "items-baseline justify-between gap-3 py-1",
        className,
      )}
      {...props}
    >
      {leading ? (
        <span className="inline-flex shrink-0 items-center">{leading}</span>
      ) : null}
      <span
        className={cn(
          "min-w-0 truncate text-muted-foreground",
          variant === "board" && "flex-1",
        )}
      >
        {label}
      </span>
      <span className="flex shrink-0 items-baseline gap-1.5">
        <span className="font-medium text-foreground">{value}</span>
        {hint ? (
          <span className="text-[10px] text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </div>
  );
}

export { StatRow };
