import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "./utils";

/*
 * AddItemButton — dashed-border "Add item" trigger.
 *
 * Used inline at the foot of editable lists (beats, decisions, tags, etc.).
 * Consolidates the dashed border + Plus icon + hover-color treatment that
 * was duplicated across SessionRecapPanel, NoteCard, and others.
 */
const AddItemButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { icon?: React.ReactNode }
>(({ className, children = "Add item", icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      data-slot="add-item-button"
      className={cn(
        "flex w-full items-center gap-1.5 rounded-sm border border-dashed border-border bg-transparent px-2.5 py-1.5",
        "text-xs text-muted-foreground transition-colors",
        "hover:border-primary/50 hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {icon ?? <Plus className="size-2.5 shrink-0" />}
      <span className="truncate">{children}</span>
    </button>
  );
});
AddItemButton.displayName = "AddItemButton";

export { AddItemButton };
