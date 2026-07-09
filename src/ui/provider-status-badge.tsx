import * as React from "react";

import { cn } from "./utils";

/**
 * Provider availability vocabulary. Owned here (the badge renders it); the
 * app's settings/transcription.ts re-exports it for its consumers.
 */
export type ProviderStatus =
  | 'available'
  | 'unavailable'
  | 'checking'
  | 'running'
  | 'error';

const STATUS_CLASS: Record<
  ProviderStatus,
  { wrap: string; label: string }
> = {
  available: {
    wrap:
      "border border-[color-mix(in_srgb,var(--hud-positive)_25%,transparent)] bg-[color-mix(in_srgb,var(--hud-positive)_12%,transparent)] text-[var(--hud-positive)]",
    label: "Ready",
  },
  unavailable: {
    wrap:
      "border border-[color-mix(in_srgb,var(--hud-warning)_25%,transparent)] bg-[color-mix(in_srgb,var(--hud-warning)_12%,transparent)] text-[var(--hud-warning)]",
    label: "Not Found",
  },
  checking: {
    wrap: "border border-[var(--hud-border-accent)] bg-[var(--hud-primary-tint-medium)] text-primary",
    label: "Checking…",
  },
  running: {
    wrap:
      "border border-[color-mix(in_srgb,var(--hud-positive)_35%,transparent)] bg-[color-mix(in_srgb,var(--hud-positive)_18%,transparent)] text-[var(--hud-positive)]",
    label: "Running",
  },
  error: {
    wrap:
      "border border-[color-mix(in_srgb,var(--hud-danger)_25%,transparent)] bg-[color-mix(in_srgb,var(--hud-danger)_12%,transparent)] text-[var(--hud-danger)]",
    label: "Error",
  },
};

export type ProviderStatusBadgeProps = React.ComponentPropsWithoutRef<"span"> & {
  status: ProviderStatus;
};

/** Dense capsule for local transcription provider probe status (Session Context + App Settings). */
function ProviderStatusBadge({ className, status, ...props }: ProviderStatusBadgeProps) {
  const c = STATUS_CLASS[status];
  return (
    <span
      data-slot="provider-status-badge"
      className={cn(
        "whitespace-nowrap rounded-[var(--radius-pill)] px-[5px] py-0 text-[8px] font-semibold tracking-[0.03em] [font-family:var(--weft-font-sans)]",
        c.wrap,
        className,
      )}
      {...props}
    >
      {c.label}
    </span>
  );
}

export { ProviderStatusBadge };
