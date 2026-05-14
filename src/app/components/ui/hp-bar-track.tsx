import * as React from "react";

import { cn } from "./utils";

/*
 * HpBarTrack — HP / temp-HP / max readout bar.
 *
 * Used in PartyStatsPanel and BattleTrackerPanel. Owns the rail geometry,
 * fill-color tone (positive / warning / danger via percentage), the temp-HP
 * sliver, and the trailing numeric readout. Width is the only piece that
 * stays an inline `style` because percentages are dynamic.
 *
 * `variant`:
 *   - rail   → thin (h-1) rail used in compact party rows
 *   - track  → mid (h-1.5) for default battle/party usage
 *   - thick  → bigger (h-2) for emphasized situations
 *
 * Pass `tone="explicit"` to override the auto-tone (positive/warning/danger
 * derived from `hp / maxHp`).
 */

type HpBarTone = "auto" | "positive" | "warning" | "danger" | "muted";
type HpBarVariant = "rail" | "track" | "thick";

interface HpBarTrackProps extends React.ComponentProps<"div"> {
  hp: number;
  maxHp: number;
  tempHp?: number;
  tone?: HpBarTone;
  variant?: HpBarVariant;
  showReadout?: boolean;
  readoutPosition?: "trailing" | "none";
  /** Override the inner track chrome (height, background, etc.). When provided,
   *  the variant default is dropped; pass complete h-/bg-/rounded- classes. */
  trackClassName?: string;
}

const HEIGHT_BY_VARIANT: Record<HpBarVariant, string> = {
  rail: "h-1",
  track: "h-1.5",
  thick: "h-2",
};

const TRACK_BG_BY_VARIANT: Record<HpBarVariant, string> = {
  rail: "bg-[var(--hud-tint-3)]",
  track: "bg-[var(--hud-tint-3)]",
  thick: "bg-[var(--hud-tint-3)]",
};

function autoTone(hp: number, maxHp: number): HpBarTone {
  if (maxHp <= 0) return "muted";
  const pct = hp / maxHp;
  if (pct > 0.6) return "positive";
  if (pct > 0.3) return "warning";
  return "danger";
}

function toneToColor(tone: Exclude<HpBarTone, "auto">): string {
  switch (tone) {
    case "positive":
      return "var(--hud-positive)";
    case "warning":
      return "var(--hud-warning)";
    case "danger":
      return "var(--hud-danger)";
    case "muted":
    default:
      return "var(--hud-text-3)";
  }
}

const HpBarTrack = React.forwardRef<HTMLDivElement, HpBarTrackProps>(
  (
    {
      className,
      hp,
      maxHp,
      tempHp = 0,
      tone = "auto",
      variant = "rail",
      showReadout = true,
      readoutPosition = "trailing",
      trackClassName,
      ...props
    },
    ref,
  ) => {
    const safeMax = Math.max(maxHp, 0);
    const clampedHp = Math.max(0, Math.min(safeMax || hp, hp));
    const hpPct = safeMax > 0 ? Math.min(clampedHp / safeMax, 1) : 0;
    const tempPct =
      safeMax > 0 && tempHp > 0
        ? Math.min(tempHp / safeMax, Math.max(0, 1 - hpPct))
        : 0;

    const resolvedTone: Exclude<HpBarTone, "auto"> =
      tone === "auto" ? (autoTone(hp, safeMax) as Exclude<HpBarTone, "auto">) : tone;
    const fillColor = toneToColor(resolvedTone);

    const includeReadout = showReadout && readoutPosition === "trailing";

    return (
      <div
        ref={ref}
        data-slot="hp-bar-track"
        data-tone={resolvedTone}
        className={cn("flex items-center gap-1.5", className)}
        {...props}
      >
        <div
          className={cn(
            "relative flex-1 overflow-hidden rounded-[var(--radius-pill)]",
            trackClassName ?? cn(HEIGHT_BY_VARIANT[variant], TRACK_BG_BY_VARIANT[variant]),
          )}
        >
          <div
            data-slot="hp-bar-fill"
            className="h-full rounded-[var(--radius-pill)] transition-[width] duration-300"
            style={{ width: `${hpPct * 100}%`, background: fillColor }}
            aria-hidden
          />
          {tempPct > 0 ? (
            <div
              data-slot="hp-bar-temp"
              className="absolute top-0 h-full bg-[var(--hud-attention-bg-strong)] transition-[width] duration-300"
              style={{
                left: `${hpPct * 100}%`,
                width: `${tempPct * 100}%`,
                borderRadius: "0 var(--radius-pill) var(--radius-pill) 0",
              }}
              aria-hidden
            />
          ) : null}
        </div>
        {includeReadout ? (
          <span
            data-slot="hp-bar-readout"
            className="whitespace-nowrap text-xs font-semibold"
            style={{ color: fillColor }}
          >
            {hp}/{safeMax || "—"}
          </span>
        ) : null}
      </div>
    );
  },
);
HpBarTrack.displayName = "HpBarTrack";

export { HpBarTrack };
export type { HpBarTrackProps, HpBarTone, HpBarVariant };
