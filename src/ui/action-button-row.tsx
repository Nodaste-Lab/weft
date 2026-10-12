import * as React from "react";

import { Button } from "./button";

import { cn } from "./utils";

/** Structured variants own hierarchy; callbacks and pending state remain host-owned.
 * Omit variant to retain the generic children/align/trailingLink composition.
 */
type RowAction = Omit<React.ComponentProps<typeof Button>, "variant" | "size" | "asChild">;
type ActionButtonRowProps = React.ComponentProps<"div"> & {
  align?: "start" | "end" | "between";
  variant?: "actions" | "form" | "navigation" | "composer";
  primaryAction?: RowAction;
  secondaryAction?: RowAction;
  auxiliaryActions?: React.ReactNode;
  dense?: boolean;
  trailingLink?: React.ReactNode;
} & ({
  variant?: "actions";
  primaryAction?: never;
  secondaryAction?: never;
  auxiliaryActions?: never;
} | {
  variant: "form" | "navigation" | "composer";
  primaryAction: RowAction;
  secondaryAction?: RowAction;
  auxiliaryActions?: React.ReactNode;
  children?: never;
  trailingLink?: never;
  align?: never;
});

function ActionButtonRow({
  className,
  align = "start",
  dense = false,
  trailingLink,
  variant = "actions",
  primaryAction,
  secondaryAction,
  auxiliaryActions,
  children,
  ...props
}: ActionButtonRowProps) {
  if (variant !== "actions") {
    return (
      <div {...props} data-slot="action-button-row" data-variant={variant}
        data-dense={dense || undefined}
        className={cn("weft-action-button-row", className)}>
        <div className="weft-action-button-row-leading">
          {secondaryAction ? <Button type="button" {...secondaryAction} size="sm"
            variant={variant === "navigation" ? "outline" : "link"} /> : null}
          {auxiliaryActions}
        </div>
        <div className="weft-action-button-row-primary">
          <Button type="button" {...primaryAction} size="sm" variant="default" />
        </div>
      </div>
    );
  }
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
