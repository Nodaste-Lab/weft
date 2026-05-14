import * as React from "react";
import { cn } from "./utils";

type HudPopoverDropdownAlign = "start" | "end";
type HudPopoverDropdownWidth = "trigger" | "auto";

interface HudPopoverDropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: HudPopoverDropdownAlign;
  width?: HudPopoverDropdownWidth;
  offset?: number;
  className?: string;
  contentClassName?: string;
  contentRole?: "dialog" | "listbox" | "menu" | "region";
  contentAriaLabel?: string;
}

const HudPopoverDropdown = React.forwardRef<HTMLDivElement, HudPopoverDropdownProps>(
  (
    {
      open,
      onOpenChange,
      trigger,
      children,
      align = "start",
      width = "auto",
      offset = 3,
      className,
      contentClassName,
      contentRole = "dialog",
      contentAriaLabel,
    },
    forwardedRef,
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (!open) return;
      const onMouseDown = (event: MouseEvent) => {
        if (localRef.current && !localRef.current.contains(event.target as Node)) {
          onOpenChange(false);
        }
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") onOpenChange(false);
      };
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [open, onOpenChange]);

    return (
      <div
        ref={localRef}
        data-slot="hud-popover-dropdown"
        data-state={open ? "open" : "closed"}
        className={cn("relative", className)}
      >
        {trigger}
        {open && (
          <div
            data-slot="hud-popover-dropdown-content"
            data-align={align}
            data-width={width}
            role={contentRole}
            aria-label={contentAriaLabel}
            className={cn(
              "absolute top-full z-[120] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hud-border-accent)] bg-[var(--hud-surface)]",
              align === "end" ? "right-0" : "left-0",
              width === "trigger" && "inset-x-0",
              contentClassName,
            )}
            style={{
              marginTop: offset,
              backdropFilter: "var(--hud-blur)",
              WebkitBackdropFilter: "var(--hud-blur)",
              boxShadow: "var(--hud-shadow-sm)",
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);
HudPopoverDropdown.displayName = "HudPopoverDropdown";

export { HudPopoverDropdown };
export type { HudPopoverDropdownProps, HudPopoverDropdownAlign, HudPopoverDropdownWidth };
