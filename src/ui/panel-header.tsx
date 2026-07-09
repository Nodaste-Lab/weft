import * as React from "react";
import { X } from "lucide-react";

import { cn } from "./utils";

/*
 * PanelHeader — top strip of a HUD panel.
 *
 * Composable: title and actions are slots so each panel composes its own
 * action set without rebuilding the strip layout. The dismiss handler
 * renders a close button on the right when provided.
 */

function PanelHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "flex items-center gap-2 border-b border-border px-3.5 py-2 bg-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function PanelHeaderTitle({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> & { icon?: React.ReactNode }) {
  return (
    <div
      data-slot="panel-header-title"
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-foreground",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="inline-flex shrink-0 items-center [&>svg]:size-3.5">{icon}</span>
      ) : null}
      <span className="truncate">{children}</span>
    </div>
  );
}

function PanelHeaderActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header-actions"
      className={cn("flex shrink-0 items-center gap-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function PanelHeaderDismiss({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="panel-header-dismiss"
      aria-label="Close panel"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <X className="size-3.5" />
    </button>
  );
}

export { PanelHeader, PanelHeaderTitle, PanelHeaderActions, PanelHeaderDismiss };
