"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

const PROGRESS_HEIGHT = {
  sm: "h-1",
  default: "h-2",
  lg: "h-3",
} as const;

function Progress({
  className,
  value,
  size = "default",
  indeterminate = false,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  size?: "sm" | "default" | "lg";
  /** Show an animated bar when there is no known value (loading). */
  indeterminate?: boolean;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      className={cn(
        "bg-primary/20 relative w-full overflow-hidden rounded-full",
        PROGRESS_HEIGHT[size],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "bg-primary h-full w-full flex-1 transition-all",
          indeterminate && "animate-pulse motion-reduce:animate-none",
        )}
        style={indeterminate ? undefined : { transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
