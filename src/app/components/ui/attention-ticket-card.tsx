import * as React from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

import { Badge } from "./badge";
import { HudListRow } from "./hud-list-row";
import { cn } from "./utils";

export interface AttentionTicketCardProps {
  /** Reason pill label, e.g. "New comment". */
  reasonLabel: string;
  /** CSS color token for the reason pill (background uses color + "20" alpha in panel). */
  reasonColor: string;
  projectLabel?: string | null;
  timestampLabel: string;
  title: string;
  reasonText: string;
  snippet?: string | null;
  issueUrl?: string | null;
  expanded: boolean;
  onToggle: () => void;
  /** Shown when `expanded` — thread, reply UI, etc. */
  children?: React.ReactNode;
  openInProviderAriaLabel?: string;
}

/*
 * AttentionTicketCard — an expandable ticket row. The collapsed header is the
 * canonical HudListRow (frame=false button) carrying the reason pill / title /
 * reasonText / snippet body + a trailing open-in-provider link and chevron;
 * this component owns the expand/collapse + expanded-region chrome. Public API,
 * data-slot, and visual unchanged.
 */
const AttentionTicketCard = React.forwardRef<HTMLDivElement, AttentionTicketCardProps>(
  (
    {
      className,
      reasonLabel,
      reasonColor,
      projectLabel,
      timestampLabel,
      title,
      reasonText,
      snippet,
      issueUrl,
      expanded,
      onToggle,
      children,
      openInProviderAriaLabel = "Open in provider",
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="attention-ticket-card"
        data-state={expanded ? "expanded" : "collapsed"}
        className={cn(
          "relative border-b border-[var(--hud-border)]",
          expanded && "bg-[color-mix(in_srgb,var(--primary)_5%,transparent)]",
          className,
        )}
      >
        {/*
         * The toggle is the whole row (HudListRow as="button"). The
         * open-in-provider link is a SIBLING overlay, never nested inside the
         * button — nesting one interactive control inside another is an a11y
         * violation (axe `nested-interactive`). When the link is present the row
         * reserves right padding so its content does not run under the link.
         */}
        <HudListRow
          as="button"
          frame={false}
          onSelect={onToggle}
          className={cn("px-3 py-2.5 gap-2.5 text-foreground", issueUrl && "pr-9")}
          bodyClassName="gap-1"
          trailing={expanded ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-auto whitespace-nowrap rounded-[var(--radius-pill)] border-transparent px-1.5 py-0.5 text-[11px]"
              style={{
                background: `${reasonColor}20`,
                color: reasonColor,
              }}
            >
              {reasonLabel}
            </Badge>
            {projectLabel ? <span className="text-[11px] text-muted-foreground">{projectLabel}</span> : null}
            <span className="ml-auto text-[11px] text-muted-foreground">{timestampLabel}</span>
          </div>

          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium">{title}</div>

          <div className="text-xs text-[var(--hud-text-2)]">{reasonText}</div>

          {snippet ? (
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] italic text-muted-foreground">
              &ldquo;{snippet}&rdquo;
            </div>
          ) : null}
        </HudListRow>
        {issueUrl ? (
          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-7 top-2 z-10 flex size-6 items-center justify-center rounded-[var(--radius)] text-muted-foreground no-underline"
            title={openInProviderAriaLabel}
            aria-label={openInProviderAriaLabel}
          >
            <ExternalLink size={12} />
          </a>
        ) : null}
        {expanded ? <div className="px-3 pb-3">{children}</div> : null}
      </div>
    );
  },
);
AttentionTicketCard.displayName = "AttentionTicketCard";

export { AttentionTicketCard };
