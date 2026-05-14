import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "./utils";

/*
 * SignalGroupCollapsible — header toggle + body for grouped signal lists.
 *
 * Used inside SignalListRuntime to render each grouped section
 * (e.g. project, priority, source, sender). The header is a full-width
 * button with a chevron, uppercase label, and an `(N)` count meta.
 *
 * Slots:
 *   - `groupKey` adds `data-signal-group` + `data-testid` markers used
 *     by tests + selectors that target a specific group.
 *   - `headerActions` renders an action cluster (e.g. group bulk
 *     acknowledge / resolve buttons) right of the header button.
 *   - `inlinePaddingX` lets the consumer align the header label with
 *     the surrounding chrome (defaults to the SignalListRuntime
 *     inline-pad token of 12px).
 *
 * The primitive does not own collapse state — pass `collapsed` and an
 * `onToggle` callback so the consumer can coordinate group memory.
 */

interface SignalGroupCollapsibleProps {
  groupKey: string;
  label: React.ReactNode;
  count?: number;
  collapsed: boolean;
  onToggle: () => void;
  bodyId?: string;
  headerActions?: React.ReactNode;
  inlinePaddingX?: number;
  testId?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

const SignalGroupCollapsible = React.forwardRef<HTMLDivElement, SignalGroupCollapsibleProps>(
  (
    {
      groupKey,
      label,
      count,
      collapsed,
      onToggle,
      bodyId: providedBodyId,
      headerActions,
      inlinePaddingX = 12,
      testId,
      className,
      headerClassName,
      bodyClassName,
      children,
    },
    ref,
  ) => {
    const reactId = React.useId();
    const bodyId = providedBodyId ?? `${reactId}-body`;
    const finalTestId = testId ?? `signal-group-${groupKey}`;
    const labelText = typeof label === "string" ? label : undefined;
    const toggleVerb = collapsed ? "Expand" : "Collapse";
    const toggleAriaLabel = labelText
      ? `${toggleVerb} ${labelText} group`
      : `${toggleVerb} group`;

    return (
      <div
        ref={ref}
        data-slot="signal-group-collapsible"
        data-signal-group={groupKey}
        data-testid={finalTestId}
        data-collapsed={collapsed ? "true" : undefined}
        className={className}
      >
        <div
          data-slot="signal-group-collapsible-header"
          className={cn(
            "flex w-full flex-wrap items-center gap-1",
            "min-w-0",
            headerClassName,
          )}
          style={{ rowGap: 4 }}
        >
          <h4 className="m-0 flex-1 min-w-0">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggle();
              }}
              aria-expanded={!collapsed}
              aria-controls={bodyId}
              aria-label={toggleAriaLabel}
              className={cn(
                "flex w-full cursor-pointer items-center gap-1.5",
                "border-0 border-b border-[var(--hud-border)] bg-[var(--hud-surface-raised)]",
                "text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--hud-text-1)]",
              )}
              style={{ padding: `6px ${inlinePaddingX}px` }}
            >
              {collapsed ? (
                <ChevronRight size={10} aria-hidden />
              ) : (
                <ChevronDown size={10} aria-hidden />
              )}
              <span data-slot="signal-group-collapsible-label">{label}</span>
              {typeof count === "number" ? (
                <span
                  aria-hidden
                  className="font-normal text-[var(--hud-text-3)]"
                >
                  ({count})
                </span>
              ) : null}
            </button>
          </h4>
          {!collapsed && headerActions ? (
            <div
              data-slot="signal-group-collapsible-actions"
              className="flex shrink-0 items-center gap-1"
            >
              {headerActions}
            </div>
          ) : null}
        </div>
        {!collapsed ? (
          <div
            id={bodyId}
            data-slot="signal-group-collapsible-body"
            className={bodyClassName}
          >
            {children}
          </div>
        ) : null}
      </div>
    );
  },
);
SignalGroupCollapsible.displayName = "SignalGroupCollapsible";

export { SignalGroupCollapsible };
export type { SignalGroupCollapsibleProps };
