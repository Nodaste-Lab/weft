import * as React from "react";

import { cn } from "./utils";

export type StepsStatus = "complete" | "current" | "pending" | "error";
export type StepsOrientation = "vertical" | "horizontal";
export type StepsDensity = "compact" | "default";

export type StepsItemData = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  status?: StepsStatus;
  meta?: React.ReactNode;
};

export type StepsProps = Omit<React.ComponentPropsWithoutRef<"ol">, "children"> & {
  items: StepsItemData[];
  orientation?: StepsOrientation;
  density?: StepsDensity;
  showConnectors?: boolean;
};

const orientationClasses: Record<StepsOrientation, string> = {
  vertical: "flex flex-col",
  horizontal: "grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]",
};

const densityClasses: Record<StepsDensity, string> = {
  compact: "gap-2 text-xs",
  default: "gap-3 text-sm",
};

const itemClasses: Record<StepsOrientation, string> = {
  vertical: "grid grid-cols-[auto_minmax(0,1fr)] gap-x-3",
  horizontal: "grid grid-cols-[auto_minmax(0,1fr)] gap-x-2",
};

const markerClasses: Record<StepsStatus, string> = {
  complete: "border-[var(--hud-positive)] bg-[var(--hud-positive-bg-soft)] text-[var(--hud-positive)]",
  current: "border-[var(--primary)] bg-[var(--hud-info-bg-soft)] text-[var(--primary)]",
  pending: "border-[var(--hud-border)] bg-[var(--hud-surface-raised)] text-[var(--hud-text-3)]",
  error: "border-[var(--hud-danger)] bg-[var(--hud-danger-bg-soft)] text-[var(--hud-danger)]",
};

const titleClasses: Record<StepsStatus, string> = {
  complete: "text-[var(--hud-text-1)]",
  current: "text-[var(--hud-text-1)]",
  pending: "text-[var(--hud-text-2)]",
  error: "text-[var(--hud-danger)]",
};

const markerText: Record<StepsStatus, string> = {
  complete: "Done",
  current: "Now",
  pending: "Next",
  error: "Issue",
};

const Steps = React.forwardRef<HTMLOListElement, StepsProps>(
  (
    {
      className,
      items,
      orientation = "vertical",
      density = "default",
      showConnectors = true,
      ...props
    },
    ref,
  ) => {
    return (
      <ol
        ref={ref}
        data-slot="steps"
        data-orientation={orientation}
        data-density={density}
        data-connectors={showConnectors ? "true" : "false"}
        className={cn(
          "m-0 list-none p-0 [font-family:var(--weft-font-sans)]",
          orientationClasses[orientation],
          densityClasses[density],
          className,
        )}
        {...props}
      >
        {items.map((item, index) => {
          const status = item.status ?? "pending";
          const isCurrent = status === "current";
          const hasConnector = showConnectors && index < items.length - 1;

          return (
            <li
              key={item.id}
              data-slot="steps-item"
              data-status={status}
              data-step-id={item.id}
              aria-current={isCurrent ? "step" : undefined}
              className={cn("relative min-w-0", itemClasses[orientation])}
            >
              <div data-slot="steps-marker-column" className="flex flex-col items-center">
                <span
                  data-slot="steps-marker"
                  aria-hidden="true"
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border text-[9px] font-semibold leading-none",
                    density === "compact" ? "size-5 text-[8px]" : undefined,
                    markerClasses[status],
                  )}
                >
                  {index + 1}
                </span>
                {hasConnector ? (
                  <span
                    data-slot="steps-connector"
                    aria-hidden="true"
                    className={cn(
                      "mt-1 w-px flex-1 bg-[var(--hud-border)]",
                      orientation === "horizontal" ? "hidden" : "min-h-4",
                    )}
                  />
                ) : null}
              </div>

              <div data-slot="steps-item-body" className="min-w-0 pb-1">
                <div className="flex min-w-0 items-baseline justify-between gap-2">
                  <span
                    data-slot="steps-item-label"
                    className={cn("min-w-0 font-semibold leading-tight", titleClasses[status])}
                  >
                    {item.label}
                  </span>
                  <span
                    data-slot="steps-item-state"
                    className="shrink-0 text-[9px] font-medium uppercase tracking-[0.08em] text-[var(--hud-text-3)]"
                  >
                    {markerText[status]}
                  </span>
                </div>
                {item.description ? (
                  <p
                    data-slot="steps-item-description"
                    className="m-0 mt-1 text-[length:var(--text-xs)] leading-snug text-[var(--hud-text-2)]"
                  >
                    {item.description}
                  </p>
                ) : null}
                {item.meta ? (
                  <div
                    data-slot="steps-item-meta"
                    className="mt-1 text-[10px] font-medium text-[var(--hud-text-3)]"
                  >
                    {item.meta}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);

Steps.displayName = "Steps";

export { Steps };
