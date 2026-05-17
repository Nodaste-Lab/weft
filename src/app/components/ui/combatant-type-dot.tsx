import * as React from "react";

import { cn } from "./utils";

/*
 * CombatantTypeDot — round dot that color-codes a combatant's type.
 *
 * Replaces the inline 7×7 dots that appear in BattleTrackerPanel
 * across multiple sites (staging row, summary, active-turn header,
 * in-combat row). Default size is 7px to match the existing chrome.
 *
 * `pulsing` wraps the dot in a relative 8×8 box and draws the
 * pulsing inset used by the TPK warning banner — the dot itself
 * still keeps its color tokens.
 */

type CombatantTypeKind = "enemy" | "ally" | "player";
type CombatantTypeDotSize = "xs" | "sm";

interface CombatantTypeDotProps extends React.ComponentProps<"span"> {
  type: CombatantTypeKind;
  size?: CombatantTypeDotSize;
  pulsing?: boolean;
}

const SIZE_CLASS: Record<CombatantTypeDotSize, string> = {
  xs: "size-[7px]",
  sm: "size-[8px]",
};

function colorFor(type: CombatantTypeKind): string {
  switch (type) {
    case "enemy":
      return "var(--hud-danger)";
    case "ally":
      return "var(--hud-positive)";
    case "player":
    default:
      return "var(--primary)";
  }
}

const CombatantTypeDot = React.forwardRef<HTMLSpanElement, CombatantTypeDotProps>(
  ({ className, type, size = "xs", pulsing = false, ...props }, ref) => {
    if (pulsing) {
      return (
        <span
          ref={ref}
          data-slot="combatant-type-dot"
          data-type={type}
          data-pulsing="true"
          aria-hidden="true"
          className={cn("relative inline-block size-[8px] shrink-0", className)}
          {...props}
        >
          <span
            className="absolute inset-0 rounded-[var(--radius-pill)]"
            style={{ background: colorFor(type), animation: "tpkPulse 1.4s ease-in-out infinite" }}
          />
        </span>
      );
    }
    return (
      <span
        ref={ref}
        data-slot="combatant-type-dot"
        data-type={type}
        aria-hidden="true"
        className={cn(
          "inline-block shrink-0 rounded-[var(--radius-pill)]",
          SIZE_CLASS[size],
          className,
        )}
        style={{ background: colorFor(type) }}
        {...props}
      />
    );
  },
);
CombatantTypeDot.displayName = "CombatantTypeDot";

export { CombatantTypeDot };
export type { CombatantTypeDotProps, CombatantTypeKind, CombatantTypeDotSize };
