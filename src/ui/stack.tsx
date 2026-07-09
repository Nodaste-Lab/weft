import * as React from "react";

import { cn } from "./utils";

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

export type StackProps = React.ComponentPropsWithoutRef<"div"> & {
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
};

const directionClasses: Record<StackDirection, string> = {
  vertical: "flex-col",
  horizontal: "flex-row",
};

const gapClasses: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
  xl: "gap-6",
};

const alignClasses: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClasses: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/*
 * Stack — generic flex composition primitive.
 *
 * Use for neutral child layout when a domain shell (PanelHeader,
 * SettingsModuleShell, RecapSectionShell, etc.) would add the wrong semantics
 * or chrome. DOM order remains the reading and keyboard order.
 */
function Stack({
  className,
  direction = "vertical",
  gap = "md",
  align,
  justify,
  wrap = false,
  ...props
}: StackProps) {
  return (
    <div
      data-slot="stack"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? "true" : undefined}
      className={cn(
        "flex",
        directionClasses[direction],
        gapClasses[gap],
        align ? alignClasses[align] : undefined,
        justify ? justifyClasses[justify] : undefined,
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  );
}

export { Stack };
