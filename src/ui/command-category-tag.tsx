import * as React from "react";

import { cn } from "./utils";

const TONE_CLASS = {
  danger: "text-[var(--hud-danger)]",
  positive: "text-[var(--hud-positive)]",
  warning: "text-[var(--hud-warning)]",
  info: "text-[var(--hud-info)]",
  bulk: "text-[var(--weft-encoding-bulk)]",
  muted: "text-[var(--hud-text-2)]",
} as const;

export type CommandCategoryTagTone = keyof typeof TONE_CLASS;

export type CommandCategoryTagProps = React.ComponentPropsWithoutRef<"span"> & {
  tone: CommandCategoryTagTone;
};

/** Small colored label for NLP / quick-command reference categories (5e). */
function CommandCategoryTag({ className, tone, ...props }: CommandCategoryTagProps) {
  return (
    <span
      data-slot="command-category-tag"
      className={cn("font-[family-name:var(--weft-font-sans)] font-semibold", TONE_CLASS[tone], className)}
      {...props}
    />
  );
}

export { CommandCategoryTag };
