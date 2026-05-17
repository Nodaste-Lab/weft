import * as React from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

import { Badge } from "./badge";
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
          "border-b border-[var(--hud-border)]",
          expanded && "bg-[color-mix(in_srgb,var(--primary)_5%,transparent)]",
          className,
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-start gap-2.5 border-0 bg-transparent px-3 py-2.5 text-left text-foreground"
        >
          <div className="flex min-w-0 flex-1 flex-col gap-1">
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
              {projectLabel ? (
                <span className="text-[11px] text-muted-foreground">{projectLabel}</span>
              ) : null}
              <span className="ml-auto text-[11px] text-muted-foreground">{timestampLabel}</span>
            </div>

            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium">{title}</div>

            <div className="text-xs text-[var(--hud-text-2)]">{reasonText}</div>

            {snippet ? (
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] italic text-muted-foreground">
                &ldquo;{snippet}&rdquo;
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {issueUrl ? (
              <a
                href={issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex size-6 items-center justify-center rounded-[var(--radius)] text-muted-foreground no-underline"
                title={openInProviderAriaLabel}
                aria-label={openInProviderAriaLabel}
              >
                <ExternalLink size={12} />
              </a>
            ) : null}
            {expanded ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
          </div>
        </button>
        {expanded ? <div className="px-3 pb-3">{children}</div> : null}
      </div>
    );
  },
);
AttentionTicketCard.displayName = "AttentionTicketCard";

export { AttentionTicketCard };
