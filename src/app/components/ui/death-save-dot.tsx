import * as React from "react";

import { cn } from "./utils";

/*
 * DeathSaveDot — 8×8 dot used inside the death-save row for downed PCs.
 *
 * Three success dots and three failure dots render per downed-PC alert in
 * BattleTrackerPanel. The dot color/border follows the slot's `kind`
 * (success/fail) and `filled` state.
 */

type DeathSaveKind = "success" | "fail";

interface DeathSaveDotProps extends React.ComponentProps<"span"> {
  kind: DeathSaveKind;
  filled: boolean;
}

function backgroundFor(kind: DeathSaveKind, filled: boolean): string {
  if (!filled) return "var(--hud-surface-hover)";
  return kind === "success" ? "var(--hud-positive)" : "var(--hud-danger)";
}

function borderFor(kind: DeathSaveKind, filled: boolean): string {
  if (!filled) return "var(--hud-border)";
  return kind === "success" ? "var(--hud-positive)" : "var(--hud-danger)";
}

const DeathSaveDot = React.forwardRef<HTMLSpanElement, DeathSaveDotProps>(
  ({ className, kind, filled, ...props }, ref) => {
    return (
      <span
        ref={ref}
        data-slot="death-save-dot"
        data-kind={kind}
        data-state={filled ? "filled" : "empty"}
        aria-hidden="true"
        className={cn(
          "block size-[8px] rounded-[var(--radius-pill)] border",
          className,
        )}
        style={{
          background: backgroundFor(kind, filled),
          borderColor: borderFor(kind, filled),
        }}
        {...props}
      />
    );
  },
);
DeathSaveDot.displayName = "DeathSaveDot";

export { DeathSaveDot };
export type { DeathSaveDotProps, DeathSaveKind };
