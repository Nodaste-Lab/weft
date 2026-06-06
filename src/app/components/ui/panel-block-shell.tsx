import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "./utils";

/*
 * PanelBlockShell — outer chrome for custom panel runtime blocks.
 *
 * Used by SignalBlockRuntime, future TextOutputRuntime, signal stats /
 * filters / list runtimes, and any block-level wrapper that needs a
 * header strip + body + selection ring.
 *
 * Wraps the common shape:
 *   - bordered card with optional selection accent
 *   - header strip with title (or custom header), optional actions,
 *     optional collapse toggle, and optional active-count meta text
 *   - body padding (with `seamless` for full-bleed list runtimes)
 *
 * `headless` skips the header entirely (useful for stat tiles below
 * a list runtime or builder-mode controls).
 *
 * `seamless` removes body padding so internal scrollers/lists can
 * own their own padding (used by SignalListRuntime in HUD chrome).
 */

interface PanelBlockShellProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode;
  selected?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  headerRight?: React.ReactNode;
  activeCountText?: string;
  sectionLabel?: string;
  headless?: boolean;
  customHeader?: React.ReactNode;
  seamless?: boolean;
  bodyClassName?: string;
  headerClassName?: string;
  onSelect?: () => void;
}

const PanelBlockShell = React.forwardRef<HTMLElement, PanelBlockShellProps>(
  (
    {
      className,
      title,
      selected,
      collapsible,
      defaultCollapsed,
      headerRight,
      activeCountText,
      sectionLabel,
      headless,
      customHeader,
      seamless,
      bodyClassName,
      headerClassName,
      onSelect,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const bodyId = `${reactId}-body`;
    const [collapsed, setCollapsed] = React.useState<boolean>(defaultCollapsed ?? false);
    React.useEffect(() => {
      setCollapsed(defaultCollapsed ?? false);
    }, [defaultCollapsed]);

    const labelNoun = sectionLabel ?? (typeof title === "string" ? title : undefined);
    const toggleVerb = collapsed ? "Expand" : "Collapse";
    const toggleAriaLabel = labelNoun
      ? `${toggleVerb} ${labelNoun}${activeCountText ? `, ${activeCountText}` : ""}`
      : toggleVerb;

    const handleClick = onSelect
      ? (event: React.MouseEvent<HTMLElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) onSelect();
        }
      : onClick;

    const headerVisible = customHeader
      ? true
      : !headless && (title || headerRight || collapsible);

    return (
      <section
        ref={ref}
        data-slot="panel-block-shell"
        data-selected={selected ? "true" : undefined}
        data-collapsed={collapsed ? "true" : undefined}
        data-seamless={seamless ? "true" : undefined}
        className={cn(
          "flex w-full flex-col [font-family:var(--weft-font-sans)]",
          seamless
            ? "border-0 bg-transparent rounded-none pt-2"
            : cn(
                "rounded-[var(--radius-sm)] border bg-[var(--hud-surface-raised)]",
                selected
                  ? "border-[var(--hud-border-accent)] shadow-[0_0_0_1px_var(--hud-border-accent)]"
                  : "border-[var(--hud-border)]",
              ),
          className,
        )}
        onClick={handleClick}
        {...props}
      >
        {headerVisible ? (
          <header
            data-signal-header
            data-slot="panel-block-shell-header"
            className={cn(
              customHeader
                ? "w-full p-0"
                : cn(
                    "flex items-center gap-2 px-3 py-2",
                    "text-[length:var(--text-xs)] text-[var(--hud-text-1)]",
                    seamless
                      ? "border-b-0 flex-wrap gap-y-1"
                      : "border-b border-[var(--hud-border)]",
                  ),
              headerClassName,
            )}
          >
            {customHeader ? (
              <div className="w-full min-w-0">{customHeader}</div>
            ) : collapsible ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCollapsed((prev) => !prev);
                }}
                aria-expanded={!collapsed}
                aria-controls={bodyId}
                aria-label={toggleAriaLabel}
                className="flex min-w-0 flex-1 items-center gap-1.5 border-0 bg-transparent p-0 text-left text-[var(--hud-text-1)] cursor-pointer"
              >
                {collapsed ? (
                  <ChevronRight className="size-3 text-[var(--hud-text-3)]" aria-hidden />
                ) : (
                  <ChevronDown className="size-3 text-[var(--hud-text-3)]" aria-hidden />
                )}
                <span className="truncate font-semibold uppercase tracking-[0.06em]">
                  {title}
                </span>
                {activeCountText ? (
                  <span
                    aria-hidden
                    className="ml-0.5 text-[10px] font-medium normal-case tracking-normal text-[var(--primary)]"
                  >
                    {"\u00B7 "}
                    {activeCountText}
                  </span>
                ) : null}
              </button>
            ) : (
              <span className="min-w-0 flex-1 truncate font-semibold uppercase tracking-[0.06em]">
                {title}
              </span>
            )}
            {headerRight ? (
              <div className="flex shrink-0 items-center gap-1">{headerRight}</div>
            ) : null}
          </header>
        ) : null}
        {!collapsed ? (
          <div
            id={bodyId}
            data-slot="panel-block-shell-body"
            className={cn(
              "flex flex-col gap-2",
              seamless ? "p-0" : "px-3 py-2",
              bodyClassName,
            )}
          >
            {children}
          </div>
        ) : null}
      </section>
    );
  },
);
PanelBlockShell.displayName = "PanelBlockShell";

export { PanelBlockShell };
export type { PanelBlockShellProps };
