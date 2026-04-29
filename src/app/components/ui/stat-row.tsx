import * as React from "react";

import { cn } from "./utils";

/*
 * StatRow — label-value pair for compact readouts.
 *
 * Used in PartyStats (HP / AC / temp HP), SessionContext (participant stats),
 * BattleTracker (threat levels), and recap detail sections. Consolidates the
 * "muted label left, medium-weight value right" pattern.
 *
 * The `value` slot accepts strings, numbers, or arbitrary nodes (e.g. a Badge
 * or a paired icon + text), so this stays useful for non-numeric readouts too.
 */
function StatRow({
  className,
  label,
  value,
  hint,
  ...props
}: React.ComponentProps<"div"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div
      data-slot="stat-row"
      className={cn(
        "flex items-baseline justify-between gap-3 py-1 text-xs",
        className,
      )}
      {...props}
    >
      <span className="min-w-0 truncate text-muted-foreground">{label}</span>
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
