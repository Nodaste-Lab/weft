import * as React from "react";

import { cn } from "./utils";

export type HudMetaCaptionProps = React.ComponentPropsWithoutRef<"span">;

/** Muted micro-label for HUD timestamps, counts, and secondary meta (notes rows, recap rails). */
function HudMetaCaption({ className, ...props }: HudMetaCaptionProps) {
  return (
    <span
      data-slot="hud-meta-caption"
      className={cn(
        "whitespace-nowrap text-[10px] text-[var(--hud-text-3)] [font-family:var(--weft-font-sans)]",
        className,
      )}
      {...props}
    />
  );
}

export { HudMetaCaption };
