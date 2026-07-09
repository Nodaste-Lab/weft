import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/*
 * Toolbar — a horizontal strip of actions / controls.
 *
 * Generalizes the hand-rolled `flex … border-b bg-[var(--hud-section-fill-*)]`
 * headers in ContentViewer / CodeBlock. Renders as a `role="toolbar"` landmark —
 * always pass `aria-label` so assistive tech can name it. Compose `Button`,
 * `Toggle`, captions, etc. as children.
 */

const toolbarVariants = cva(
  "flex min-h-8 items-center gap-1.5 border-[var(--hud-border)] bg-[var(--hud-section-fill-medium)]",
  {
    variants: {
      divider: {
        top: "border-t",
        bottom: "border-b",
        none: "",
      },
      justify: {
        start: "justify-start",
        between: "justify-between",
        end: "justify-end",
        center: "justify-center",
      },
      density: {
        compact: "px-2 py-1",
        default: "px-3 py-1.5",
        spacious: "px-4 py-2",
      },
    },
    defaultVariants: { divider: "bottom", justify: "start", density: "default" },
  },
);

export interface ToolbarProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof toolbarVariants> {}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, divider, justify, density, role = "toolbar", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={role}
        data-slot="toolbar"
        data-divider={divider ?? "bottom"}
        data-justify={justify ?? "start"}
        data-density={density ?? "default"}
        className={cn(toolbarVariants({ divider, justify, density }), className)}
        {...props}
      />
    );
  },
);
Toolbar.displayName = "Toolbar";

export { Toolbar, toolbarVariants };
