"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & { joined?: boolean }
>({
  size: "default",
  variant: "default",
  joined: false,
});

function ToggleGroup({
  className,
  variant,
  size,
  joined = false,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    /**
     * Joined variant — items share a single outer border rather than having
     * individual borders with gaps. Use for segmented controls (e.g. "Direct /
     * Expanded" relatedness toggles on the operator board).
     */
    joined?: boolean;
  }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-joined={joined || undefined}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        joined && "overflow-hidden rounded-[var(--weft-radius-chip,6px)] border border-[var(--weft-rule,var(--border))]",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, joined }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        context.joined
          ? [
              "min-w-0 flex-1 shrink-0 rounded-none shadow-none",
              "border-0 border-l border-[var(--weft-rule,var(--border))] first:border-l-0",
              "focus:z-10 focus-visible:z-10",
              "data-[state=on]:bg-[color-mix(in_srgb,var(--weft-blue,var(--primary))_15%,transparent)]",
              "data-[state=on]:text-[var(--weft-ink,var(--foreground))]",
              "data-[state=on]:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--weft-blue,var(--primary))_40%,transparent)]",
            ]
          : "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
