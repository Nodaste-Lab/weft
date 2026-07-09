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
 * Layout: up to 3 options share the row width with centered labels; more than
 * 3 options hug each pill's text and wrap as needed.
 *
 * Active state: brand-blue tint with primary text. Inactive: paper surface
 * with muted text. Hover lifts inactive items toward foreground without
 * filling them in (so the active item stays the visual anchor).
 */

type PillToggleItemLayout = "equal" | "hug";

type PillToggleGroupContextValue<T extends string = string> = {
  value: T;
  setValue: (next: T) => void;
  itemLayout: PillToggleItemLayout;
};

const PillToggleGroupContext = React.createContext<
  PillToggleGroupContextValue<string> | null
>(null);

function countToggleItems(children: React.ReactNode): number {
  return React.Children.toArray(children).filter(React.isValidElement).length;
}

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
  const itemCount = countToggleItems(children);
  const itemLayout: PillToggleItemLayout = itemCount > 3 ? "hug" : "equal";

  const ctx = React.useMemo<PillToggleGroupContextValue<string>>(
    () => ({
      value,
      setValue: onValueChange as (n: string) => void,
      itemLayout,
    }),
    [value, onValueChange, itemLayout],
  );

  return (
    <PillToggleGroupContext.Provider value={ctx}>
      <div
        role="radiogroup"
        data-slot="pill-toggle-group"
        data-item-layout={itemLayout}
        className={cn(
          "flex flex-wrap items-center gap-1",
          itemLayout === "equal" && "w-full",
          className,
        )}
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
  const equalLayout = ctx.itemLayout === "equal";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      data-state={active ? "on" : "off"}
      data-slot="pill-toggle-group-item"
      onClick={() => ctx.setValue(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm border px-2.5 py-1 text-center text-xs transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/70 bg-primary font-semibold text-primary-foreground"
          : "border-border bg-card font-normal text-muted-foreground hover:text-foreground hover:border-primary/30",
        className,
        equalLayout ? "min-w-0 flex-1" : "w-auto shrink-0",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { PillToggleGroup, PillToggleGroupItem };
