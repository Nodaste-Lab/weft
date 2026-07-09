import * as React from "react";

import { Button } from "./button";
import { cn } from "./utils";

/*
 * SignalFilterChipGroup — label + flex-wrap row of toggle chips.
 *
 * Used by SignalFiltersRuntime for the timeframe / priority / source /
 * sender chip groups (4× repeated). The shape is:
 *   - small uppercase caption label
 *   - role="group" wrapper with aria-labelledby + aria-label
 *   - one Button (variant=outline, size=sm, aria-pressed) per option
 *
 * The default chip styling matches the consumer's toggle chrome
 * (pressed = primary tint + semibold; idle = border + text-2). Override
 * `chipClassName` for tone variants.
 *
 * The primitive does not own toggle state — pass `isActive` / `onToggle`
 * callbacks so single-select (timeframe) and multi-select (priorities,
 * sources, senders) callers share one rendering.
 */

interface SignalFilterChipOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  ariaLabel?: string;
}

interface SignalFilterChipGroupProps<T extends string = string>
  extends Omit<React.ComponentProps<"div">, "onToggle"> {
  label: React.ReactNode;
  options: readonly SignalFilterChipOption<T>[];
  isActive: (value: T) => boolean;
  onToggle: (value: T) => void;
  groupAriaLabel?: string;
  labelId?: string;
  chipClassName?: (active: boolean) => string;
}

const defaultChipClass = (active: boolean): string =>
  cn(
    "h-auto min-h-0 rounded-[var(--radius-sm)] px-2 py-[3px] text-[10px]",
    active
      ? "border-primary bg-[var(--hud-primary-tint-strong)] font-semibold text-primary"
      : "border-[var(--hud-border)] bg-transparent font-normal text-[var(--hud-text-2)]",
  );

function SignalFilterChipGroup<T extends string = string>({
  className,
  label,
  options,
  isActive,
  onToggle,
  groupAriaLabel,
  labelId: providedLabelId,
  chipClassName = defaultChipClass,
  ...props
}: SignalFilterChipGroupProps<T>) {
  const reactId = React.useId();
  const labelId = providedLabelId ?? `${reactId}-label`;
  const ariaLabel =
    groupAriaLabel ?? (typeof label === "string" ? label : undefined);

  return (
    <div
      data-slot="signal-filter-chip-group"
      className={cn("flex flex-col", className)}
      {...props}
    >
      <div
        id={labelId}
        data-slot="signal-filter-chip-group-label"
        className="mb-1 text-[9px] font-normal uppercase tracking-[0.05em] text-[var(--hud-text-3)]"
      >
        {label}
      </div>
      <div
        role="group"
        aria-labelledby={labelId}
        aria-label={ariaLabel}
        data-slot="signal-filter-chip-group-rail"
        className="flex flex-wrap gap-1"
      >
        {options.map((option) => {
          const active = isActive(option.value);
          return (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={active}
              aria-label={option.ariaLabel}
              onClick={(event) => {
                event.stopPropagation();
                onToggle(option.value);
              }}
              className={chipClassName(active)}
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export { SignalFilterChipGroup };
export type { SignalFilterChipGroupProps, SignalFilterChipOption };
