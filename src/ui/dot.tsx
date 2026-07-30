import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/**
 * Dot — the bare semantic status dot.
 *
 * Weft could already tone text and pill backgrounds, but had no standalone dot,
 * so every operator surface hand-rolled a 7px span. Promoted out of the
 * `weft-board` template (decision D13) because a tier header, a compact summary
 * row and a legend all need the same mark.
 *
 * Accessibility contract: the dot is **decorative by default**. In normal use it
 * sits beside a label that already carries the meaning, so announcing it would
 * be noise — hence `aria-hidden`. Pass `label` only when the dot is the sole
 * carrier of meaning; it then becomes an announced `img`. Colour is never
 * allowed to be the only signal, which is exactly what that choice enforces.
 */
const dotVariants = cva("inline-block shrink-0 rounded-[var(--weft-radius-dot)]", {
  variants: {
    tone: {
      muted: "bg-[var(--weft-muted)]",
      ok: "bg-[var(--weft-ok)]",
      warn: "bg-[var(--weft-warn)]",
      stop: "bg-[var(--weft-stop)]",
      info: "bg-[var(--weft-info)]",
    },
    size: {
      // 7px matches the reviewed operator-board density; `md` suits body text.
      sm: "size-[7px]",
      md: "size-[9px]",
    },
  },
  defaultVariants: {
    tone: "muted",
    size: "sm",
  },
});

function Dot({
  className,
  tone,
  size,
  label,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof dotVariants> & {
    /** Supply only when the dot alone carries the meaning; makes it announced. */
    label?: string;
  }) {
  const announced = typeof label === "string" && label.length > 0;

  return (
    <span
      data-slot="dot"
      data-tone={tone ?? "muted"}
      {...props}
      className={cn(dotVariants({ tone, size }), className)}
      {...(announced
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
    />
  );
}

export { Dot, dotVariants };
