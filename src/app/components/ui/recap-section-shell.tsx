import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "./utils";

type RecapSectionShellDensity = "compact" | "default";

interface RecapSectionShellProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  count?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  density?: RecapSectionShellDensity;
  headerId?: string;
  panelId?: string;
}

const DENSITY_HEADER_PAD: Record<RecapSectionShellDensity, string> = {
  compact: "px-3.5 py-1.5",
  default: "px-3.5 py-2",
};

const DENSITY_BODY_PAD: Record<RecapSectionShellDensity, string> = {
  compact: "px-3.5 pt-1.5 pb-2",
  default: "px-3.5 pt-2 pb-2.5",
};

const RecapSectionShell = React.forwardRef<HTMLDivElement, RecapSectionShellProps>(
  (
    {
      className,
      icon,
      title,
      count,
      open,
      onToggle,
      density = "default",
      headerId,
      panelId,
      children,
      ...props
    },
    ref,
  ) => {
    const autoPanelId = React.useId();
    const autoHeaderId = React.useId();
    const finalPanelId = panelId ?? `recap-section-${autoPanelId}`;
    const finalHeaderId = headerId ?? `recap-section-header-${autoHeaderId}`;

    return (
      <div
        ref={ref}
        data-slot="recap-section-shell"
        data-state={open ? "open" : "closed"}
        data-density={density}
        className={cn("border-b border-[var(--hud-border)]", className)}
        {...props}
      >
        <button
          type="button"
          id={finalHeaderId}
          data-slot="recap-section-header"
          aria-expanded={open}
          aria-controls={finalPanelId}
          onClick={onToggle}
          className={cn(
            "flex w-full items-center gap-[7px] bg-transparent text-left text-[var(--hud-text-2)]",
            "[font-family:var(--weft-font-sans)] transition-colors duration-150 hover:bg-[var(--hud-tint-1)]",
            DENSITY_HEADER_PAD[density],
            open ? "border-b border-[var(--hud-border)]" : "",
          )}
        >
          {icon}
          <span
            data-slot="recap-section-title"
            className="flex-1 text-left text-[length:var(--text-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[0.06em] text-[var(--hud-text-2)]"
          >
            {title}
          </span>
          {count !== undefined && count !== null && (
            <span
              data-slot="recap-section-count"
              className="rounded-[var(--radius-pill)] border border-[var(--hud-border)] bg-[var(--hud-surface-hover)] px-[7px] py-px text-[10px] text-[var(--hud-text-3)]"
            >
              {count}
            </span>
          )}
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {open && (
          <div
            id={finalPanelId}
            role="region"
            aria-labelledby={finalHeaderId}
            data-slot="recap-section-body"
            className={cn(
              "flex flex-col gap-[7px]",
              DENSITY_BODY_PAD[density],
            )}
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);
RecapSectionShell.displayName = "RecapSectionShell";

export { RecapSectionShell };
export type { RecapSectionShellProps, RecapSectionShellDensity };
