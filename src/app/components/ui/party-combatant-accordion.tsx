import * as React from "react";

import { cn } from "./utils";

export type PartyCombatantAccordionProps = React.ComponentPropsWithoutRef<"div"> & {
  expanded: boolean;
  /** Optional id for the expanded region (link with header control `aria-controls`). */
  expandRegionId?: string;
  header: React.ReactNode;
  /** Rendered below the header when `expanded` (border-top panel). */
  children?: React.ReactNode;
};

const PartyCombatantAccordion = React.forwardRef<HTMLDivElement, PartyCombatantAccordionProps>(
  ({ className, expanded, expandRegionId, header, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="party-combatant-accordion"
        data-state={expanded ? "open" : "closed"}
        className={cn("border-b border-[var(--hud-border)]", className)}
        {...props}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">{header}</div>
        {expanded && children ? (
          <div
            id={expandRegionId}
            role="region"
            className="flex flex-col gap-2.5 border-t border-[var(--hud-border)] bg-[var(--hud-section-fill-strong)] px-3.5 pb-3"
          >
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);
PartyCombatantAccordion.displayName = "PartyCombatantAccordion";

export { PartyCombatantAccordion };
