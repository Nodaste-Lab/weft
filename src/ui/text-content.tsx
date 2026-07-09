import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "./utils";

export type TextContentSize = "sm" | "default" | "lg";
export type TextContentWeight = "regular" | "medium" | "semibold";
export type TextContentTone = "default" | "muted" | "strong" | "accent" | "danger";
export type TextContentMeasure = "none" | "narrow" | "default" | "wide";

export type TextContentProps = React.ComponentPropsWithoutRef<"p"> & {
  asChild?: boolean;
  size?: TextContentSize;
  weight?: TextContentWeight;
  tone?: TextContentTone;
  measure?: TextContentMeasure;
};

const sizeClasses: Record<TextContentSize, string> = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
};

const weightClasses: Record<TextContentWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
};

const toneClasses: Record<TextContentTone, string> = {
  default: "text-[var(--hud-text-2)]",
  muted: "text-[var(--hud-text-3)]",
  strong: "text-[var(--hud-text-1)]",
  accent: "text-primary",
  danger: "text-destructive",
};

const measureClasses: Record<TextContentMeasure, string | undefined> = {
  none: undefined,
  narrow: "max-w-[48ch]",
  default: "max-w-prose",
  wide: "max-w-[72ch]",
};

/*
 * TextContent — readable generated copy and explanatory prose.
 *
 * This primitive owns typography treatment only. Consumers keep responsibility
 * for semantic structure: headings, lists, blockquotes, and captions should be
 * provided via asChild or purpose-built primitives.
 */
const TextContent = React.forwardRef<HTMLParagraphElement, TextContentProps>(
  (
    {
      asChild = false,
      className,
      size = "default",
      weight = "regular",
      tone = "default",
      measure = "default",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "p";

    return (
      <Comp
        ref={ref}
        data-slot="text-content"
        data-size={size}
        data-weight={weight}
        data-tone={tone}
        data-measure={measure}
        className={cn(
          "m-0 leading-relaxed [font-family:var(--weft-font-sans)]",
          sizeClasses[size],
          weightClasses[weight],
          toneClasses[tone],
          measureClasses[measure],
          className,
        )}
        {...props}
      />
    );
  },
);
TextContent.displayName = "TextContent";

export { TextContent };
