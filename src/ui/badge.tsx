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
        // count — mono numeral chip for tier item counts (e.g. "12 items")
        count:
          "rounded-[var(--weft-radius-pill,9999px)] border-[var(--weft-rule,var(--border))] bg-transparent font-mono text-[11px] text-[var(--weft-muted,var(--muted-foreground))] px-2 py-[1px]",
        // space — tinted chip for workspace/space attribution
        space:
          "rounded-[var(--weft-radius-chip,6px)] border-transparent bg-[color-mix(in_srgb,var(--weft-ink,var(--foreground))_8%,transparent)] text-[var(--weft-muted,var(--muted-foreground))] text-[10.5px] px-[7px] py-[1px]",
        // status — mono bordered chip for machine-state labels (e.g. "BLOCKED")
        status:
          "rounded-[var(--weft-radius-chip,6px)] border-current font-mono text-[9.5px] px-[6px] py-[1px]",
      },
      // Severity tone — pairs with variant="outline"/"status" for priority/status
      // pills (urgent/high/blocked/etc.) so they don't get hand-rolled. `none` is
      // the default and leaves the variant's own color untouched.
      tone: {
        none: "",
        info: "border-[color-mix(in_srgb,var(--hud-info)_45%,transparent)] text-[var(--hud-info)]",
        warning: "border-[color-mix(in_srgb,var(--hud-warning)_45%,transparent)] text-[var(--hud-warning)]",
        danger: "border-[color-mix(in_srgb,var(--hud-danger)_45%,transparent)] text-[var(--hud-danger)]",
        positive: "border-[color-mix(in_srgb,var(--hud-positive)_45%,transparent)] text-[var(--hud-positive)]",
        stop: "border-[color-mix(in_srgb,var(--weft-stop)_45%,transparent)] text-[var(--weft-stop)]",
        warn: "border-[color-mix(in_srgb,var(--weft-warn)_45%,transparent)] text-[var(--weft-warn)]",
        ok: "border-[color-mix(in_srgb,var(--weft-ok)_45%,transparent)] text-[var(--weft-ok)]",
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
