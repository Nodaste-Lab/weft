import * as React from "react";

import { cn } from "./utils";

/*
 * ActionButtonRow — flex row for grouped panel actions.
 *
 * Standardizes the gap, alignment, and overflow behavior for action sets like
 * Copy / Email / Vault / Generate that recur in panel headers and toolbars.
 * Use as a slot inside <PanelHeader> or as a standalone toolbar row.
 *
 * The trailing flex-1 spacer placement is handled here so primary actions can
 * sit at the right edge with the standard gap.
 *
 * `dense` mode uses a tighter gap for operator boards that stack many controls
 * in a narrow column.
 *
 * A `trailingLink` node is pushed to the far right (margin-left: auto) whenever
 * it is supplied — it is independent of `dense`, though the operator-board
 * drawer is where the pairing shows up most. Use a Button size="dense"
 * variant="ghost", or a plain anchor styled as a link.
 */
function ActionButtonRow({
  className,
  align = "start",
  dense = false,
  trailingLink,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end" | "between";
  /** Tighter gap for operator-board drawer action rows. */
  dense?: boolean;
  /** Node pushed to the far-right trailing edge, in any density. */
  trailingLink?: React.ReactNode;
}) {
  return (
    <div
      data-slot="action-button-row"
      data-align={align}
      data-dense={dense || undefined}
      className={cn(
        "flex items-center",
        dense ? "gap-1.5 flex-wrap" : "gap-1.5",
        align === "end" && "justify-end",
        align === "between" && "justify-between",
        className,
      )}
      {...props}
    >
      {children}
      {trailingLink ? (
        <span className="ml-auto shrink-0">{trailingLink}</span>
      ) : null}
    </div>
  );
}

export { ActionButtonRow };
