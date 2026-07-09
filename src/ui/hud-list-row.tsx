import * as React from "react";

import { cn } from "./utils";

/*
 * HudListRow — leading-media + title-stack + trailing-actions list row.
 *
 * CANONICAL ROW PRIMITIVE. Reach for this first for any generic list row.
 * The leading/body(children)/trailing slots cover most cases — prefer composing
 * them over hand-rolling a new row or adding another bespoke `*-row` component.
 *
 * status-icon-row, inline-edit-list-row, and attention-ticket-card are now thin
 * specializations that COMPOSE this primitive (frame={false}) — they add only
 * their unique affordance (icon tile, inline edit, expand) on top of the shared
 * leading/body/trailing layout. Build new specialized rows the same way. The
 * only standalone rows left are knowledge-search-result-row (relevance bar +
 * excerpt) and stat-row (label/value pair), whose layouts aren't row-shaped;
 * fold anything else in here rather than adding another variant.
 *
 * Used by SignalRow, MyAccount project lists, ticket update rows, and
 * any other dense list where the row chrome (border, padding, hover,
 * state accent stripe) is the same but the body content varies.
 *
 * `state` adds a left-border accent + matching subtle row background.
 * Combine slots with arbitrary children to assemble a row body. The
 * primitive intentionally avoids prescribing the title/preview text
 * styles so consumers can keep dense typography.
 *
 * Usage:
 *   <HudListRow
 *     state={isUnread ? "unread" : "default"}
 *     leading={<Avatar />}
 *     trailing={<Button size="sm">View</Button>}
 *   >
 *     <HudListRowTitle>{title}</HudListRowTitle>
 *     <HudListRowMeta>3h · {project}</HudListRowMeta>
 *   </HudListRow>
 */

type HudListRowState = "default" | "unread" | "overdue" | "resolved" | "active";
type HudListRowDensity = "compact" | "default";
type HudListRowAlign = "start" | "center";

type HudListRowOwnProps = {
  state?: HudListRowState;
  density?: HudListRowDensity;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Extra classes for the middle column wrapper (`hud-list-row-body`). */
  bodyClassName?: string;
  /** Extra classes for the leading / trailing slot wrappers. */
  leadingClassName?: string;
  trailingClassName?: string;
  divider?: boolean;
  interactive?: boolean;
  /**
   * Row chrome. `true` (default) = the card frame (left accent stripe, density
   * padding, divider, state background). `false` = a plain flex layout row (no
   * frame/padding) — for borderless rows that bring their own spacing, so this
   * primitive can host them too (status-icon, inline-edit, etc.).
   */
  frame?: boolean;
  /** Vertical alignment of the slots. `start` (default) or `center`. */
  align?: HudListRowAlign;
  /** Use native button for row-level expand / navigate actions (a11y). */
  as?: "div" | "button" | "li";
  /** When `as="button"`, forwarded to the element (default `"button"`). */
  type?: "button" | "submit" | "reset";
  onSelect?: () => void;
};

type HudListRowProps = HudListRowOwnProps &
  Omit<React.ComponentPropsWithoutRef<"div">, "children"> &
  Omit<React.ComponentPropsWithoutRef<"li">, "children"> &
  Omit<React.ComponentPropsWithoutRef<"button">, "children" | "type"> & {
    children?: React.ReactNode;
    type?: "button" | "submit" | "reset";
  };

const STATE_ACCENT: Record<HudListRowState, string> = {
  default: "border-l-transparent",
  unread: "border-l-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]",
  overdue: "border-l-[var(--hud-danger)] bg-[color-mix(in_srgb,var(--hud-danger)_5%,transparent)]",
  resolved: "border-l-[var(--hud-positive)]",
  active: "border-l-[var(--hud-border-accent)] bg-[var(--hud-surface-hover)]",
};

const DENSITY_PADDING: Record<HudListRowDensity, string> = {
  compact: "px-3 py-1.5 gap-2",
  default: "px-3 py-2.5 gap-2.5",
};

const HudListRow = React.forwardRef<HTMLDivElement | HTMLButtonElement | HTMLLIElement, HudListRowProps>(
  (
    {
      className,
      state = "default",
      density = "default",
      leading,
      trailing,
      bodyClassName,
      leadingClassName,
      trailingClassName,
      divider = true,
      interactive,
      frame = true,
      align = "start",
      as = "div",
      type = "button",
      onSelect,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const handleClick = onSelect
      ? (event: React.MouseEvent<HTMLDivElement & HTMLButtonElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented) onSelect();
        }
      : onClick;

    const commonClassName = cn(
      "flex w-full transition-colors",
      align === "center" ? "items-center" : "items-start",
      frame
        ? cn(
            "border-l-2",
            DENSITY_PADDING[density],
            STATE_ACCENT[state],
            divider && "border-b border-[var(--hud-border)]",
          )
        : "gap-2",
      interactive && "cursor-pointer hover:bg-[var(--hud-surface-hover)]",
      className,
    );

    if (as === "button") {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          data-slot="hud-list-row"
          data-state={state}
          data-density={density}
          className={cn(
            commonClassName,
            "cursor-pointer bg-transparent text-left [font-family:inherit]",
            // Reset UA button chrome without clobbering Tailwind border utilities on this element.
            "[&]:appearance-none [&]:[border-style:solid]",
          )}
          onClick={handleClick}
          {...(props as React.ComponentPropsWithoutRef<"button">)}
        >
          {leading ? (
            <div data-slot="hud-list-row-leading" className={cn("flex shrink-0 items-center pt-0.5", leadingClassName)}>
              {leading}
            </div>
          ) : null}
          <div
            data-slot="hud-list-row-body"
            className={cn("flex min-w-0 flex-1 flex-col gap-0.5", bodyClassName)}
          >
            {children}
          </div>
          {trailing ? (
            <div data-slot="hud-list-row-trailing" className={cn("flex shrink-0 items-center gap-1", trailingClassName)}>
              {trailing}
            </div>
          ) : null}
        </button>
      );
    }

    if (as === "li") {
      return (
        <li
          ref={ref as React.Ref<HTMLLIElement>}
          data-slot="hud-list-row"
          data-state={state}
          data-density={density}
          className={cn(commonClassName, "list-none")}
          onClick={handleClick}
          {...(props as React.ComponentPropsWithoutRef<"li">)}
        >
          {leading ? (
            <div data-slot="hud-list-row-leading" className={cn("flex shrink-0 items-center pt-0.5", leadingClassName)}>
              {leading}
            </div>
          ) : null}
          <div
            data-slot="hud-list-row-body"
            className={cn("flex min-w-0 flex-1 flex-col gap-0.5", bodyClassName)}
          >
            {children}
          </div>
          {trailing ? (
            <div data-slot="hud-list-row-trailing" className={cn("flex shrink-0 items-center gap-1", trailingClassName)}>
              {trailing}
            </div>
          ) : null}
        </li>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="hud-list-row"
        data-state={state}
        data-density={density}
        className={commonClassName}
        onClick={handleClick}
        {...(props as React.ComponentPropsWithoutRef<"div">)}
      >
        {leading ? (
          <div data-slot="hud-list-row-leading" className={cn("flex shrink-0 items-center pt-0.5", leadingClassName)}>
            {leading}
          </div>
        ) : null}
        <div
          data-slot="hud-list-row-body"
          className={cn("flex min-w-0 flex-1 flex-col gap-0.5", bodyClassName)}
        >
          {children}
        </div>
        {trailing ? (
          <div data-slot="hud-list-row-trailing" className={cn("flex shrink-0 items-center gap-1", trailingClassName)}>
            {trailing}
          </div>
        ) : null}
      </div>
    );
  },
);
HudListRow.displayName = "HudListRow";

function HudListRowTitle({
  className,
  emphasis,
  truncate = true,
  ...props
}: React.ComponentProps<"div"> & { emphasis?: boolean; truncate?: boolean }) {
  return (
    <div
      data-slot="hud-list-row-title"
      className={cn(
        "min-w-0 text-[length:var(--text-sm)] text-[var(--hud-text-1)]",
        emphasis ? "font-semibold" : "font-normal",
        truncate && "truncate",
        className,
      )}
      {...props}
    />
  );
}

function HudListRowMeta({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="hud-list-row-meta"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-[length:var(--text-xs)] text-[var(--hud-text-3)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { HudListRow, HudListRowTitle, HudListRowMeta };
export type { HudListRowProps, HudListRowState, HudListRowDensity };
