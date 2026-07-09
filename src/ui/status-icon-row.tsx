import * as React from "react";

import { cn } from "./utils";
import { HudListRow } from "./hud-list-row";

/*
 * StatusIconRow — leading-icon + title + detail status row.
 *
 * Now a thin specialization of the canonical HudListRow (frame=false, centered):
 * it supplies the bordered icon tile + the dense 10px/9px title/detail typography
 * and tone, and HudListRow owns the leading/body/trailing layout. Public API,
 * data-slots, and visual are unchanged.
 *
 * `tone` drives the icon color and the title accent without changing the row
 * chrome — so the row reads as a status communication, not its own card. For
 * full-card emphasis, use `Callout` instead. `density="compact"` shrinks the
 * leading tile to 22px; `density="default"` uses a 26px tile.
 */

type StatusIconTone = "success" | "warning" | "danger" | "muted" | "info";
type StatusIconDensity = "compact" | "default";

interface StatusIconRowProps extends Omit<React.ComponentProps<"div">, "title"> {
  tone?: StatusIconTone;
  density?: StatusIconDensity;
  icon: React.ReactNode;
  title: React.ReactNode;
  detail?: React.ReactNode;
  actions?: React.ReactNode;
}

const TONE_TITLE_CLASS: Record<StatusIconTone, string> = {
  success: "text-[var(--hud-positive)]",
  warning: "text-[var(--hud-text-2)]",
  danger: "text-[var(--hud-text-2)]",
  muted: "text-[var(--hud-text-2)]",
  info: "text-[var(--hud-text-2)]",
};

const DENSITY_ICON_SIZE: Record<StatusIconDensity, string> = {
  compact: "size-[22px] rounded-[var(--radius-sm)]",
  default: "size-[26px] rounded-[var(--radius-pill)]",
};

const StatusIconRow = React.forwardRef<HTMLDivElement, StatusIconRowProps>(
  (
    {
      className,
      tone = "info",
      density = "compact",
      icon,
      title,
      detail,
      actions,
      ...props
    },
    ref,
  ) => {
    return (
      <HudListRow
        ref={ref}
        as="div"
        frame={false}
        align="center"
        density={density}
        role="status"
        data-slot="status-icon-row"
        data-tone={tone}
        className={cn("[font-family:var(--weft-font-sans)]", density === "compact" ? "gap-[7px]" : "gap-[9px]", className)}
        leadingClassName="pt-0"
        bodyClassName="gap-[1px]"
        trailingClassName="gap-1.5"
        leading={
          <div
            aria-hidden="true"
            data-slot="status-icon-row-icon"
            className={cn(
              "flex shrink-0 items-center justify-center border border-[var(--hud-border)] bg-[var(--hud-surface-raised)]",
              DENSITY_ICON_SIZE[density],
            )}
          >
            {icon}
          </div>
        }
        trailing={actions ?? undefined}
        {...props}
      >
        <div
          data-slot="status-icon-row-title"
          className={cn("truncate text-[10px] font-semibold leading-tight", TONE_TITLE_CLASS[tone])}
        >
          {title}
        </div>
        {detail ? (
          <div
            data-slot="status-icon-row-detail"
            className="truncate text-[9px] leading-snug text-[var(--hud-text-3)]"
          >
            {detail}
          </div>
        ) : null}
      </HudListRow>
    );
  },
);
StatusIconRow.displayName = "StatusIconRow";

export { StatusIconRow };
export type { StatusIconRowProps, StatusIconTone, StatusIconDensity };
