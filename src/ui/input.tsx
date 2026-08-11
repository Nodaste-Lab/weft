import * as React from "react";

import { cn } from "./utils";

type InputState = "default" | "error" | "disabled" | "readonly";
// The compose size axis (P5): density sets the tier, `sm` steps one down,
// both resolving through the same tokens the plain-CSS `.is-sm` reads.
type InputSize = "default" | "sm";
// `default` is the standard form field; `inline` is a chromeless in-place editor
// (tab/row rename, etc.) that inherits the surrounding typography and shows only a
// focus ring — no height floor, border, fill, or padding. `underline` and `low`
// are the resting tiers (P7, heuristic 1 as amended): underline is a real field
// whose bottom border alone carries the 3:1 boundary; low is a bordered field
// with quieter colour — the borderless filled tier is ruled out by A2/A3.
type InputVariant = "default" | "inline" | "underline" | "low";

// Named (not inline in the forwardRef generic) so the prop-contract extractor's
// *Props-alias scan captures the surface — keeps Input's contract gate-guarded.
// Native `size` (a legacy width-in-characters attribute) is omitted so the
// compose axis can carry the name D4 already gave it: `size="sm"`. A consumer
// needing the character width sets a width; the attribute was never part of
// Weft's sizing story and keeping both would make one prop mean two things.
export type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  state?: InputState;
  variant?: InputVariant;
  size?: InputSize;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, state, variant = "default", size = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        data-state={state}
        data-variant={variant}
        data-size={size}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input text-foreground flex h-[var(--weft-control-h,36px)] w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // The sm step of the current tier — the same token .is-sm reads.
          size === "sm" && "h-[var(--weft-control-h-sm,32px)] px-2",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          // inline: strip the form chrome (twMerge drops h-9/border/px-3/bg/etc.)
          // and inherit the host's font; keep a Weft focus ring for affordance.
          variant === "inline" &&
            "h-auto rounded border-0 bg-transparent px-1 py-px text-[length:inherit] font-[inherit] text-inherit shadow-none focus-visible:border-transparent focus-visible:ring-0 focus-visible:[box-shadow:var(--weft-focus-ring)]",
          // Tier 2: the underline is appearance only — same height, same
          // behaviour, the bottom border alone carries the boundary.
          variant === "underline" && "rounded-none border-x-0 border-t-0 bg-transparent px-0.5",
          // Tier 3: quieter colour, never a quieter boundary.
          variant === "low" && "bg-transparent text-muted-foreground",
          // readonly reads as filled-but-static, distinct from disabled's dimming.
          state === "readonly" && "cursor-default bg-muted/40",
          className,
        )}
        {...props}
        aria-invalid={state === "error" ? true : props["aria-invalid"]}
        disabled={state === "disabled" ? true : props.disabled}
        readOnly={state === "readonly" ? true : props.readOnly}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
