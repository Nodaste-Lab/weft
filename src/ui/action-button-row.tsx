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
 */
function ActionButtonRow({
  className,
  align = "start",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end" | "between";
}) {
  return (
    <div
      data-slot="action-button-row"
      data-align={align}
      className={cn(
        "flex items-center gap-1.5",
        align === "end" && "justify-end",
        align === "between" && "justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { ActionButtonRow };
