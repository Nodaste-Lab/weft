import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/*
 * EyebrowLabel — uppercase, tracked-out section label.
 *
 * Per Weft brand spec (brand-package §03), uppercase text reads in JetBrains
 * Mono — the type rule in weft.css applies that automatically when this label
 * renders under [data-palette="weft"]. The component owns the size, tracking,
 * and color so panels don't redeclare them in inline styles.
 *
 * Use for: section headers like "RECAP PERIOD", "WORKSPACE CONTEXT", "TAGS",
 * "SOURCES" — anywhere a panel needs a small, muted, all-caps label.
 */
const eyebrowVariants = cva(
  "inline-flex items-center gap-1.5 font-semibold uppercase",
  {
    variants: {
      size: {
        sm: "text-[10px] tracking-[0.10em]",
        default: "text-xs tracking-[0.06em]",
        lg: "text-sm tracking-[0.04em]",
      },
      tone: {
        muted: "text-muted-foreground",
        default: "text-foreground/80",
        accent: "text-primary",
      },
    },
    defaultVariants: {
      size: "default",
      tone: "muted",
    },
  },
);

type EyebrowLabelProps = React.ComponentProps<"span"> &
  VariantProps<typeof eyebrowVariants> & {
    asChild?: boolean;
    icon?: React.ReactNode;
  };

const EyebrowLabel = React.forwardRef<HTMLSpanElement, EyebrowLabelProps>(
  ({ className, size, tone, asChild = false, icon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        data-slot="eyebrow-label"
        className={cn(eyebrowVariants({ size, tone }), className)}
        {...props}
      >
        {icon ? (
          <span className="inline-flex shrink-0 items-center [&>svg]:size-3">{icon}</span>
        ) : null}
        {children}
      </Comp>
    );
  },
);
EyebrowLabel.displayName = "EyebrowLabel";

export { EyebrowLabel, eyebrowVariants };
