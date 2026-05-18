import * as React from "react";

import { cn } from "./utils";

/*
 * HudListRow — leading-media + title-stack + trailing-actions list row.
 *
 * Used by SignalRow, MyAccount campaign lists, ticket update rows, and
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

type HudListRowOwnProps = {
  state?: HudListRowState;
  density?: HudListRowDensity;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Extra classes for the middle column wrapper (`hud-list-row-body`). */
  bodyClassName?: string;
  divider?: boolean;
  interactive?: boolean;
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
      divider = true,
      interactive,
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
      "flex w-full items-start border-l-2 transition-colors",
      DENSITY_PADDING[density],
      STATE_ACCENT[state],
      divider && "border-b border-[var(--hud-border)]",
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
            <div data-slot="hud-list-row-leading" className="flex shrink-0 items-center pt-0.5">
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
            <div data-slot="hud-list-row-trailing" className="flex shrink-0 items-center gap-1">
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
            <div data-slot="hud-list-row-leading" className="flex shrink-0 items-center pt-0.5">
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
            <div data-slot="hud-list-row-trailing" className="flex shrink-0 items-center gap-1">
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
          <div data-slot="hud-list-row-leading" className="flex shrink-0 items-center pt-0.5">
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
          <div data-slot="hud-list-row-trailing" className="flex shrink-0 items-center gap-1">
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
