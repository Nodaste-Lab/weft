import * as React from "react";

import { cn } from "./utils";

/*
 * StatusIconRow — leading-icon + title + detail status row.
 *
 * Used inside SettingsModuleShell bodies (My Account device-login
 * status, CcoreRuntimeRow, agent-plugin install status) where the
 * row is dense: a small bordered icon tile on the left, a two-line
 * title/detail stack in the middle, and optional trailing actions.
 *
 * `tone` drives the icon color and the title accent without changing
 * the row chrome — so the row reads as a status communication, not as
 * its own card. For full-card emphasis, use `Callout` instead.
 *
 * `density="compact"` shrinks the leading tile to 22px (matches the
 * existing device-login + CcoreRuntimeRow chrome). `density="default"`
 * uses 26–28px tiles (matches signed-in account header avatars).
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

const TONE_ICON_BORDER: Record<StatusIconTone, string> = {
  success: "border-[var(--hud-border)]",
  warning: "border-[var(--hud-border)]",
  danger: "border-[var(--hud-border)]",
  muted: "border-[var(--hud-border)]",
  info: "border-[var(--hud-border)]",
};

const DENSITY_PADDING: Record<StatusIconDensity, string> = {
  compact: "gap-[7px]",
  default: "gap-[9px]",
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
      <div
        ref={ref}
        data-slot="status-icon-row"
        data-tone={tone}
        data-density={density}
        role="status"
        className={cn(
          "flex w-full items-center [font-family:var(--weft-font-sans)]",
          DENSITY_PADDING[density],
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          data-slot="status-icon-row-icon"
          className={cn(
            "flex shrink-0 items-center justify-center border bg-[var(--hud-surface-raised)]",
            DENSITY_ICON_SIZE[density],
            TONE_ICON_BORDER[tone],
          )}
        >
          {icon}
        </div>
        <div data-slot="status-icon-row-body" className="flex min-w-0 flex-1 flex-col gap-[1px]">
          <div
            data-slot="status-icon-row-title"
            className={cn(
              "truncate text-[10px] font-semibold leading-tight",
              TONE_TITLE_CLASS[tone],
            )}
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
        </div>
        {actions ? (
          <div
            data-slot="status-icon-row-actions"
            className="flex shrink-0 items-center gap-1.5"
          >
            {actions}
          </div>
        ) : null}
      </div>
    );
  },
);
StatusIconRow.displayName = "StatusIconRow";

export { StatusIconRow };
export type { StatusIconRowProps, StatusIconTone, StatusIconDensity };
