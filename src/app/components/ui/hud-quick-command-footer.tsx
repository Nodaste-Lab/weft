import * as React from "react";

import { cn } from "./utils";

export type HudQuickCommandFooterProps = React.ComponentPropsWithoutRef<"div"> & {
  /** Main column: typically eyebrow header, optional log scroller, then hint + form. */
  children: React.ReactNode;
  /** Optional full-width bar under the sticky column (e.g. Save / End Encounter). */
  footerBar?: React.ReactNode;
};

/**
 * Sticky HUD footer stack for NLP “quick command” panels — lift shadow, surface background,
 * top border. Keeps WKWebView scroll islands predictable vs ad-hoc inline stacks.
 */
function HudQuickCommandFooter({ className, children, footerBar, ...props }: HudQuickCommandFooterProps) {
  return (
    <div
      data-slot="hud-quick-command-footer"
      className={cn(
        "sticky bottom-0 z-10 border-t border-[var(--hud-border)] bg-[var(--hud-surface)] shadow-[0_-4px_12px_color-mix(in_srgb,black_30%,transparent)]",
        className,
      )}
      {...props}
    >
      {children}
      {footerBar}
    </div>
  );
}

export { HudQuickCommandFooter };
