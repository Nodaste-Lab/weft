import * as React from "react";

import { cn } from "./utils";

/*
 * EmptyState — centered icon + heading + description placeholder.
 *
 * Used by Session Recap before generation, Notes before any note exists,
 * Knowledge Search before a query, and other "nothing to show yet" surfaces.
 *
 * The description is optional. The `tone` variant covers the common cases:
 *   - "default" → neutral muted message ("Click Generate to build a recap")
 *   - "warning" → soft amber tint for blocked/required-config states
 *     (e.g. "Add an OpenAI API key in App Settings to enable generation")
 *
 * Pass action nodes (a primary <Button>, etc.) through the `action` slot so
 * empty states can prompt the user toward the unblocking action without
 * each panel rebuilding its own button strip.
 */
export type EmptyStateTone = "default" | "info" | "warning" | "danger" | "positive";

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
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  tone?: EmptyStateTone;
}) {
  const toneClass = TONE_CLASS[tone];
  return (
    <div
      data-slot="empty-state"
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
            toneClass,
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
            toneClass,
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
