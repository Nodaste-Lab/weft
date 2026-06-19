import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      // Severity tone — pairs with variant="outline" for priority/status pills
      // (urgent/high/etc.) so they don't get hand-rolled. `none` is the default
      // and leaves the variant's own color untouched.
      tone: {
        none: "",
        info: "border-[color-mix(in_srgb,var(--hud-info)_45%,transparent)] text-[var(--hud-info)]",
        warning: "border-[color-mix(in_srgb,var(--hud-warning)_45%,transparent)] text-[var(--hud-warning)]",
        danger: "border-[color-mix(in_srgb,var(--hud-danger)_45%,transparent)] text-[var(--hud-danger)]",
        positive: "border-[color-mix(in_srgb,var(--hud-positive)_45%,transparent)] text-[var(--hud-positive)]",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "none",
    },
  },
);

function Badge({
  className,
  variant,
  tone,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
