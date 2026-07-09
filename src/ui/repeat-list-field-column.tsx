import * as React from "react";

import { cn } from "./utils";

export type RepeatListFieldColumnProps = Omit<React.ComponentPropsWithoutRef<"label">, "children"> & {
  label: string;
  children: React.ReactNode;
};

/** Label + control column for repeat-list grid rows in CustomPanelRuntime. */
function RepeatListFieldColumn({
  label,
  children,
  className,
  ...props
}: RepeatListFieldColumnProps) {
  return (
    <label
      data-slot="repeat-list-field-column"
      className={cn("m-0 grid gap-1", className)}
      {...props}
    >
      <span className="text-[9px] text-[var(--hud-text-3)]">{label}</span>
      {children}
    </label>
  );
}

export { RepeatListFieldColumn };
