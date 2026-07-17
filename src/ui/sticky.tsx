import * as React from "react";

import { cn } from "./utils";

/*
 * Sticky — an outlined, colour-keyed note card.
 *
 * A header / body / footer / outline surface for multi-note boards (the
 * Scratchpad sticky view). Distinct from Card (a neutral container): Sticky is
 * keyed to a caller-supplied category colour that drives BOTH the header
 * background and the card's outline, so a board of them reads as colour-grouped
 * at a glance.
 *
 * Outlined, NOT raised — a 1px border in the caller's colour and no shadow;
 * these cards sit *in* a panel, not above it. The header spans the card
 * STRUCTURALLY: it is a direct child of a zero-padding root, so it reaches every
 * inner edge without any calc() cancelling a parent's padding (a sanitising
 * renderer drops such arithmetic and the header falls short — see the header-gap
 * regression this pattern exists to prevent). The body text never sits on the
 * colour (it stays on --weft-paper), and the footer clears the body by a fixed
 * spacing floor even when the body fills the card. Pair the colour with
 * --weft-on-category for AA-safe header text — one dark on-colour clears AA on
 * every value of the --weft-category-* palette.
 */

type StickyDensity = "comfortable" | "compact";

const HEADER_PAD: Record<StickyDensity, string> = {
  comfortable: "px-2.5 py-1.5",
  compact: "px-2.5 py-1",
};
const BODY_PAD: Record<StickyDensity, string> = {
  comfortable: "px-2.5 py-2",
  compact: "px-2.5 py-1.5",
};

export interface StickyProps extends React.ComponentProps<"div"> {
  /** Category colour driving the header background and the card outline. */
  color: string;
  /** Header content — sits on the colour; pair with --weft-on-category text. */
  header?: React.ReactNode;
  /** Footer content — clears the body by a fixed floor, even when the body fills the card. */
  footer?: React.ReactNode;
  density?: StickyDensity;
}

const Sticky = React.forwardRef<HTMLDivElement, StickyProps>(
  ({ className, color, header, footer, children, density = "comfortable", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="sticky"
        data-density={density}
        // Outlined in the category colour; the body surface is the panel paper.
        // No shadow — this is a framed card, not a raised one.
        className={cn(
          "flex flex-col overflow-hidden rounded-[var(--radius-sm)] border bg-[var(--weft-paper)] shadow-none [font-family:var(--weft-font-sans)]",
          className,
        )}
        style={{ borderColor: color, ...style }}
        {...props}
      >
        {header !== undefined ? (
          <div
            data-slot="sticky-header"
            // Direct child of the zero-padding root → spans structurally.
            className={cn(
              "flex items-center gap-2 text-[length:var(--text-xs)]",
              HEADER_PAD[density],
            )}
            style={{ backgroundColor: color, color: "var(--weft-on-category)" }}
          >
            {header}
          </div>
        ) : null}
        <div
          data-slot="sticky-body"
          className={cn(
            "min-w-0 flex-1 text-[length:var(--text-sm)] leading-relaxed text-[var(--weft-ink)]",
            BODY_PAD[density],
          )}
        >
          {children}
        </div>
        {footer !== undefined ? (
          <div
            data-slot="sticky-footer"
            // padding-top (not margin-top:auto) so the chips clear the body text
            // by a fixed floor even when a long body fills the card.
            className="flex flex-wrap items-center gap-1 px-2.5 pt-2.5 pb-2"
          >
            {footer}
          </div>
        ) : null}
      </div>
    );
  },
);
Sticky.displayName = "Sticky";

export { Sticky };
