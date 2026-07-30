import * as React from "react";
import { X } from "lucide-react";

import { cn } from "./utils";

/*
 * PanelHeader — top strip of a HUD panel.
 *
 * Composable: title and actions are slots so each panel composes its own
 * action set without rebuilding the strip layout. The dismiss handler
 * renders a close button on the right when provided.
 *
 * `size="board"` is an opt-in treatment for operator boards: a slightly
 * taller strip with larger title font and standard board padding. Use it
 * on the outer `.weft-board` header instead of rolling a bespoke header.
 *
 * Auto-composition: PanelHeader provides a context so PanelHeaderTitle
 * inherits the board size automatically — callers do NOT need to pass
 * `size="board"` to both PanelHeader and PanelHeaderTitle.
 *
 *   <PanelHeader size="board">
 *     <PanelHeaderTitle>Operator Board</PanelHeaderTitle>  ← auto board-sized
 *   </PanelHeader>
 */

type PanelHeaderSize = "default" | "board";

const PanelHeaderSizeContext = React.createContext<PanelHeaderSize>("default");

function PanelHeader({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Layout size. `"board"` uses board-density padding and title scale. */
  size?: PanelHeaderSize;
}) {
  return (
    <PanelHeaderSizeContext.Provider value={size}>
      <div
        data-slot="panel-header"
        data-size={size !== "default" ? size : undefined}
        className={cn(
          "flex items-center gap-2 border-b border-border bg-card",
          size === "board"
            ? "min-h-[46px] px-3.5 py-2.5"
            : "px-3.5 py-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </PanelHeaderSizeContext.Provider>
  );
}

function PanelHeaderTitle({
  className,
  icon,
  size: sizeProp,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ReactNode;
  /** Explicit size override. When omitted, inherits from the parent PanelHeader. */
  size?: PanelHeaderSize;
}) {
  const contextSize = React.useContext(PanelHeaderSizeContext);
  const size = sizeProp ?? contextSize;

  return (
    <div
      data-slot="panel-header-title"
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 font-semibold text-foreground",
        size === "board" ? "text-[19px] leading-tight" : "text-sm",
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
