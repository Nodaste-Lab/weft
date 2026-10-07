import * as React from "react";
import { Badge } from "./badge";
import { NavigationIcon } from "./navigation-icon";
import { cn } from "./utils";

export type NavigationCountProps = Omit<React.ComponentProps<"span">, "children"> & {
  count: number;
  /** Full file or Space name, included in the accessible description. */
  name: string;
  scope: "file" | "space" | "signals-destination";
  kind?: "signals" | "notifications";
} & (
  | { scope: "file" | "space"; kind?: "signals" }
  | { scope: "signals-destination"; kind?: "signals" | "notifications" }
);

/** Read-only awaiting-action signal count; notifications only on Signals. */
export function NavigationCount({ count, name, scope, kind = "signals", className, ...props }: NavigationCountProps) {
  if (!Number.isSafeInteger(count) || count <= 0 || (kind === "notifications" && scope !== "signals-destination")) return null;
  const label = kind === "signals"
    ? `${count} signals awaiting action ${scope === "file" ? "for" : "in"} ${name}`
    : `${count} total notifications in ${name}`;
  return <Badge {...props} variant="count" className={cn("weft-navigation-count", className)} role="img" aria-label={label}>
    <NavigationIcon purpose={kind} size={12} />{count}
  </Badge>;
}
