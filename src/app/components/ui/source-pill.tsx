import * as React from "react";

import { cn } from "./utils";

/*
 * SourcePill — small monospace pill for file paths and origin tags.
 *
 * Used in SignalRow (file references), Session Context (configured sources),
 * Lore Search (result origins). The mono font is bound by the Weft type
 * rule for any text under [data-palette="weft"], but this primitive owns the
 * pill geometry — small, bordered, paper background, minimal padding — so
 * source attribution is visually consistent everywhere it appears.
 *
 * `truncate` is enabled by default; pass `truncate={false}` for full-width
 * file paths inside scrollable lists.
 */
const SourcePill = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span"> & { truncate?: boolean; tone?: "default" | "muted" }
>(({ className, truncate = true, tone = "default", children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot="source-pill"
      className={cn(
        "inline-flex items-center rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] leading-none",
        tone === "default" ? "text-muted-foreground" : "text-foreground/60",
        truncate && "max-w-full truncate",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});
SourcePill.displayName = "SourcePill";

export { SourcePill };
