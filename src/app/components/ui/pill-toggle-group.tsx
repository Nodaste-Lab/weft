import * as React from "react";

import { cn } from "./utils";

/*
 * PillToggleGroup — gap-separated pill segmented control.
 *
 * Distinct from shadcn's <ToggleGroup> (which renders joined segments with
 * shared borders). This group uses individually-rounded pills with a small
 * gap, which matches the period selector pattern in SessionRecapPanel and
 * the recap/prep mode toggle. Wraps cleanly when options exceed the row.
 *
 * Active state: brand-blue tint with primary text. Inactive: paper surface
 * with muted text. Hover lifts inactive items toward foreground without
 * filling them in (so the active item stays the visual anchor).
 */

type PillToggleGroupContextValue<T extends string = string> = {
  value: T;
  setValue: (next: T) => void;
};

const PillToggleGroupContext = React.createContext<
  PillToggleGroupContextValue<string> | null
>(null);

function PillToggleGroup<T extends string>({
  value,
  onValueChange,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  value: T;
  onValueChange: (next: T) => void;
}) {
  const ctx = React.useMemo<PillToggleGroupContextValue<string>>(
    () => ({ value, setValue: onValueChange as (n: string) => void }),
    [value, onValueChange],
  );

  return (
    <PillToggleGroupContext.Provider value={ctx}>
      <div
        role="radiogroup"
        data-slot="pill-toggle-group"
        className={cn("flex flex-wrap items-center gap-1", className)}
        {...props}
      >
        {children}
      </div>
    </PillToggleGroupContext.Provider>
  );
}

function PillToggleGroupItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const ctx = React.useContext(PillToggleGroupContext);
  if (!ctx) {
    throw new Error("PillToggleGroupItem must render inside <PillToggleGroup>");
  }
  const active = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      data-state={active ? "on" : "off"}
      data-slot="pill-toggle-group-item"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-sm border px-2.5 py-1 text-xs transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/40 bg-primary/15 font-semibold text-primary"
          : "border-border bg-card font-normal text-muted-foreground hover:text-foreground hover:border-primary/30",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { PillToggleGroup, PillToggleGroupItem };
