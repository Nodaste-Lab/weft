import * as React from "react";

import { cn } from "./utils";

type CardDensity = "default" | "compact";

/*
 * Density axis (compact|default). `Card` publishes its density to the structural
 * sub-parts (header / content / footer) via context so their padding tightens in
 * lockstep — dense dashboards and panels can pack cards without per-instance
 * className overrides. `default` keeps the original spacing, so this is additive.
 */
const CardDensityContext = React.createContext<CardDensity>("default");

const CARD_GAP: Record<CardDensity, string> = { default: "gap-6", compact: "gap-4" };
const CARD_PAD_X: Record<CardDensity, string> = { default: "px-6", compact: "px-4" };
const CARD_PAD_TOP: Record<CardDensity, string> = { default: "pt-6", compact: "pt-4" };
const CARD_PAD_BOTTOM: Record<CardDensity, string> = { default: "pb-6", compact: "pb-4" };

function Card({
  className,
  density = "default",
  ...props
}: React.ComponentProps<"div"> & { density?: CardDensity }) {
  return (
    <CardDensityContext.Provider value={density}>
      <div
        data-slot="card"
        data-density={density}
        className={cn(
          "bg-card text-card-foreground flex flex-col rounded-xl border",
          CARD_GAP[density],
          className,
        )}
        {...props}
      />
    </CardDensityContext.Provider>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const density = React.useContext(CardDensityContext);
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        CARD_PAD_X[density],
        CARD_PAD_TOP[density],
        density === "compact" ? "[.border-b]:pb-4" : "[.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const density = React.useContext(CardDensityContext);
  return (
    <div
      data-slot="card-content"
      className={cn(
        CARD_PAD_X[density],
        density === "compact" ? "[&:last-child]:pb-4" : "[&:last-child]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const density = React.useContext(CardDensityContext);
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center",
        CARD_PAD_X[density],
        CARD_PAD_BOTTOM[density],
        density === "compact" ? "[.border-t]:pt-4" : "[.border-t]:pt-6",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
export type { CardDensity };
