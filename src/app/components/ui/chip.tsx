import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/*
 * Chip — a compact, tone-aware tag that can be removed (and optionally toggled).
 *
 * Distinct from Badge (immutable label): Chip owns the removable-tag affordance —
 * filter tags, applied conditions, token inputs. The root is a NON-interactive
 * <span>; the remove ✕ and the optional toggle are SIBLING <button>s, never
 * nested inside one another (nested interactive controls are an a11y violation).
 *
 * Selectable *groups* already exist (SignalFilterChipGroup, Button-based); reach
 * for those for exclusive/multi-select rails. Chip's `onSelect` is for a single
 * standalone toggle-able tag.
 */

const chipVariants = cva(
  "inline-flex w-fit max-w-full items-center gap-1 whitespace-nowrap rounded-[var(--radius-sm)] border align-middle [font-family:var(--weft-font-sans)]",
  {
    variants: {
      tone: {
        none: "border-[var(--hud-border)] bg-[var(--hud-surface-hover)] text-[var(--hud-text-2)]",
        info: "border-[color-mix(in_srgb,var(--hud-info)_45%,transparent)] bg-[color-mix(in_srgb,var(--hud-info)_10%,transparent)] text-[var(--hud-info)]",
        warning:
          "border-[color-mix(in_srgb,var(--hud-warning)_45%,transparent)] bg-[color-mix(in_srgb,var(--hud-warning)_12%,transparent)] text-[var(--hud-warning)]",
        danger:
          "border-[color-mix(in_srgb,var(--hud-danger)_45%,transparent)] bg-[color-mix(in_srgb,var(--hud-danger)_10%,transparent)] text-[var(--hud-danger)]",
        positive:
          "border-[color-mix(in_srgb,var(--hud-positive)_45%,transparent)] bg-[color-mix(in_srgb,var(--hud-positive)_10%,transparent)] text-[var(--hud-positive)]",
      },
      size: {
        sm: "gap-0.5 px-1.5 py-px text-[10px]",
        md: "gap-1 px-2 py-0.5 text-[length:var(--text-xs)]",
      },
      selected: {
        true: "ring-1 ring-inset ring-[var(--primary)]",
        false: "",
      },
    },
    defaultVariants: { tone: "none", size: "md", selected: false },
  },
);

const focusRing =
  "outline-none rounded-[2px] focus-visible:ring-2 focus-visible:ring-[var(--weft-focus-ring)]";

export interface ChipProps
  extends Omit<React.ComponentProps<"span">, "onSelect">,
    VariantProps<typeof chipVariants> {
  /** When set, renders a ✕ button (a sibling, not nested) to remove the chip. */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Override the ✕ button's aria-label (defaults to "Remove {label}"). */
  removeLabel?: string;
  /** When set, the label becomes a toggle button reflecting `selected`. */
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, tone, size, selected, onRemove, removeLabel, onSelect, children, ...props }, ref) => {
    const labelText = typeof children === "string" ? children : undefined;
    return (
      <span
        ref={ref}
        data-slot="chip"
        data-tone={tone ?? "none"}
        data-size={size ?? "md"}
        data-selected={selected ? true : undefined}
        className={cn(chipVariants({ tone, size, selected }), className)}
        {...props}
      >
        {onSelect ? (
          <button
            type="button"
            data-slot="chip-toggle"
            aria-pressed={selected ?? false}
            onClick={onSelect}
            className={cn("inline-flex min-w-0 items-center bg-transparent text-inherit", focusRing)}
          >
            <span className="truncate">{children}</span>
          </button>
        ) : (
          <span className="min-w-0 truncate">{children}</span>
        )}
        {onRemove ? (
          <button
            type="button"
            data-slot="chip-remove"
            aria-label={removeLabel ?? (labelText ? `Remove ${labelText}` : "Remove")}
            onClick={onRemove}
            className={cn(
              "inline-flex shrink-0 items-center justify-center text-current opacity-70 transition-opacity hover:opacity-100",
              focusRing,
            )}
          >
            <X className="size-3" aria-hidden="true" focusable="false" />
          </button>
        ) : null}
      </span>
    );
  },
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
