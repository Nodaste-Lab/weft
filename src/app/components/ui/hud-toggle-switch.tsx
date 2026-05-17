import * as React from "react";

import { cn } from "./utils";

/*
 * HudToggleSwitch — HUD-density binary toggle.
 *
 * Differs from `Switch` (the Radix-backed primitive) in that it owns the
 * compact 34×18 geometry, HUD glass tokens, and inline shadow so settings
 * surfaces (Session Context, App Settings, agent plugins) all render the
 * same affordance without each panel re-deriving the styles.
 *
 * `Switch` from `ui/switch.tsx` should still be used in workspace and
 * dialog contexts where shadcn-grade spacing is appropriate. This primitive
 * is for HUD chrome where every pixel of vertical space matters.
 *
 * `size`:
 *   - default → 34×18 (matches the original SessionContext footprint)
 *   - sm     → 28×16 (used in dense list rows)
 */

type HudToggleSwitchSize = "default" | "sm";

interface HudToggleSwitchProps {
  active: boolean;
  onToggle: () => void;
  ariaLabel: string;
  size?: HudToggleSwitchSize;
  disabled?: boolean;
  className?: string;
  id?: string;
}

const TRACK_BY_SIZE: Record<HudToggleSwitchSize, string> = {
  default: "h-[18px] w-[34px]",
  sm: "h-4 w-7",
};

const THUMB_BY_SIZE: Record<HudToggleSwitchSize, string> = {
  default: "size-3 top-0.5",
  sm: "size-2.5 top-[3px]",
};

const THUMB_OFFSETS: Record<HudToggleSwitchSize, { on: string; off: string }> = {
  default: { on: "left-4", off: "left-0.5" },
  sm: { on: "left-[14px]", off: "left-[3px]" },
};

const HudToggleSwitch = React.forwardRef<HTMLButtonElement, HudToggleSwitchProps>(
  ({ active, onToggle, ariaLabel, size = "default", disabled, className, id }, ref) => {
    const offsets = THUMB_OFFSETS[size];
    return (
      <button
        ref={ref}
        id={id}
        type="button"
        aria-pressed={active}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onToggle}
        data-slot="hud-toggle-switch"
        data-state={active ? "on" : "off"}
        className={cn(
          "relative shrink-0 cursor-pointer rounded-[var(--radius-pill)] border p-0 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hud-border-accent)]/40 focus-visible:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-60",
          TRACK_BY_SIZE[size],
          active
            ? "border-[var(--primary)] bg-[var(--primary)]"
            : "border-[var(--hud-border)] bg-[var(--hud-surface-hover)]",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute rounded-[var(--radius-pill)] bg-white transition-[left] duration-200 shadow-[0_1px_3px_color-mix(in_srgb,black_40%,transparent)]",
            THUMB_BY_SIZE[size],
            active ? offsets.on : offsets.off,
          )}
        />
      </button>
    );
  },
);
HudToggleSwitch.displayName = "HudToggleSwitch";

export { HudToggleSwitch };
export type { HudToggleSwitchProps, HudToggleSwitchSize };
