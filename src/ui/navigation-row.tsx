import * as React from "react";
import { NavigationIcon } from "./navigation-icon";
import { cn } from "./utils";

export type NavigationRowProps = React.ComponentProps<"div"> & {
  current?: boolean;
  disabled?: boolean;
  /** Zero-based hierarchy depth. The row is a layout, not an ARIA treeitem. */
  depth?: number;
  hierarchical?: boolean;
  density?: "default" | "compact" | "dense";
  /** Use touch geometry for an explicitly simulated narrow drawer. */
  touch?: boolean;
};
export const NavigationRow = React.forwardRef<HTMLDivElement, NavigationRowProps>(function NavigationRow(
  { current = false, disabled = false, depth = 0, hierarchical = false, density, touch, className, style, ...props }, ref
) {
  const level = Number.isFinite(depth) ? Math.max(0, Math.floor(depth)) : 0;
  return <div {...props} ref={ref} className={cn("weft-navigation-row", className)} data-current={current} data-disabled={disabled} data-navigation-density={density} data-touch={touch || undefined}
    style={{ ...(hierarchical ? { paddingInlineStart: `calc(var(--weft-navigation-inset) + ${level} * var(--weft-navigation-indent))` } : {}), ...style }} />;
});
export const NavigationRowButton = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(function NavigationRowButton({ className, type = "button", ...props }, ref) {
  return <button {...props} ref={ref} type={type} className={cn("weft-navigation-label", className)} />;
});
/** Destinations use native anchors for history, new tabs and copied URLs. */
export type NavigationRowLinkProps = React.ComponentProps<"a"> & { href: string };
export const NavigationRowLink = React.forwardRef<HTMLAnchorElement, NavigationRowLinkProps>(function NavigationRowLink({ className, ...props }, ref) {
  return <a {...props} ref={ref} className={cn("weft-navigation-label", className)} />;
});
export type NavigationRowDisclosureProps = Omit<React.ComponentProps<"button">, "children" | "aria-label" | "aria-expanded"> & {
  expanded: boolean;
  name: string;
};
export const NavigationRowDisclosure = React.forwardRef<HTMLButtonElement, NavigationRowDisclosureProps>(function NavigationRowDisclosure({ expanded, name, className, type = "button", ...props }, ref) {
  return <button {...props} ref={ref} type={type} className={cn("weft-navigation-disclosure", className)} aria-expanded={expanded} aria-label={`${expanded ? "Collapse" : "Expand"} ${name}`}>
    <NavigationIcon purpose={expanded ? "collapse" : "expand"} size={14} />
  </button>;
});
