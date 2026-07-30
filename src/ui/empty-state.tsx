import * as React from "react";

import { cn } from "./utils";

/*
 * EmptyState — placeholder for surfaces with nothing to show yet.
 *
 * Two variants:
 *
 * - `"centered"` (default) — centered icon + title + description for genuine
 *   empty states: "nothing here yet", "no results", "click Generate to start".
 *   Used by Session Recap, Notes, Knowledge Search, etc.
 *
 * - `"notice"` — left-aligned inline notice for failures and transient errors.
 *   Renders inside the content area rather than filling it. Use when the board
 *   cannot load, a partial fetch failed, or a prerequisite is missing — states
 *   where a centered "empty" treatment would mislead ("nothing here" vs "fetch
 *   failed"). Has a dashed border and aligns left.
 *
 * The `tone` variant covers the common cases:
 *   - "default" → neutral muted message
 *   - "warning" → soft amber tint for blocked/required-config states
 *
 * Pass action nodes (a primary <Button>, etc.) through the `action` slot.
 */
export type EmptyStateTone = "default" | "info" | "warning" | "danger" | "positive";
export type EmptyStateVariant = "centered" | "notice";

const TONE_CLASS: Record<EmptyStateTone, string | undefined> = {
  default: undefined,
  info: "text-[var(--hud-info)]",
  warning: "text-[var(--hud-warning)]",
  danger: "text-[var(--hud-danger)]",
  positive: "text-[var(--hud-positive)]",
};

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  tone = "default",
  variant = "centered",
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  tone?: EmptyStateTone;
  /**
   * Layout variant:
   * - `"centered"` (default) — full-area centered empty state.
   * - `"notice"` — left-aligned inline notice for failures/errors; does not
   *   imply the content area is empty, just that something went wrong.
   */
  variant?: EmptyStateVariant;
}) {
  const toneClass = TONE_CLASS[tone];

  if (variant === "notice") {
    return (
      <div
        data-slot="empty-state"
        data-variant="notice"
        data-tone={tone}
        className={cn(
          "flex items-start gap-2.5 rounded-[var(--radius-sm)] border border-dashed",
          "border-[var(--weft-rule-strong,var(--border))] p-3 text-xs",
          "text-[var(--weft-muted,var(--muted-foreground))]",
          className,
        )}
        {...props}
      >
        {icon ? (
          <span
            className={cn(
              "mt-0.5 inline-flex shrink-0 items-center justify-center [&>svg]:size-4",
              toneClass ?? "text-muted-foreground/60",
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="m-0 font-medium text-foreground leading-snug">{title}</p>
          {description ? (
            <p className={cn("m-0 leading-snug text-muted-foreground", toneClass)}>
              {description}
            </p>
          ) : null}
          {action ? <div className="mt-1">{action}</div> : null}
        </div>
      </div>
    );
  }

  const toneClass2 = TONE_CLASS[tone];
  return (
    <div
      data-slot="empty-state"
      data-variant="centered"
      data-tone={tone}
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-3.5 py-7 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          className={cn(
            "inline-flex items-center justify-center text-muted-foreground/60 [&>svg]:size-7",
            toneClass2,
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <p className="m-0 text-sm text-foreground">{title}</p>
      {description ? (
        <p
          className={cn(
            "m-0 max-w-sm text-xs text-muted-foreground",
            toneClass2,
          )}
        >
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-1.5">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
