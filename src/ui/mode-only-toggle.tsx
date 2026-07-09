import * as React from "react";

import { cn } from "./utils";

export type ModeOnlyToggleProps = Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "children" | "type"> & {
  active: boolean;
  label: string;
  onToggle: () => void;
};

/**
 * Compact “use only in {mode} mode” control — Session Context vault paths, OpenAI key, transcription.
 * Visual rhythm matches HUD density (26×14 track); prefer `className` for layout offsets (replacing legacy `style` props).
 */
function ModeOnlyToggle({ active, className, label, onToggle, ...props }: ModeOnlyToggleProps) {
  return (
    <button
      data-slot="mode-only-toggle"
      type="button"
      className={cn(
        "flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      onClick={onToggle}
      {...props}
    >
      <span
        className="relative h-3.5 w-[26px] shrink-0 rounded-[var(--radius-pill)] border transition-[background-color,border-color] duration-200"
        style={{
          background: active ? "var(--primary)" : "var(--hud-surface-hover)",
          borderColor: active ? "var(--primary)" : "var(--hud-border)",
        }}
      >
        <span
          className="absolute top-0.5 size-2 rounded-[var(--radius-pill)] bg-white shadow-sm transition-[left] duration-[180ms]"
          style={{ left: active ? 12 : 2, boxShadow: "0 1px 2px color-mix(in srgb, black 40%, transparent)" }}
        />
      </span>
      <span
        className={cn(
          "text-[9px] transition-colors duration-150 [font-family:var(--weft-font-sans)]",
          active ? "text-primary" : "text-[var(--hud-text-3)]",
        )}
      >
        {label}
      </span>
    </button>
  );
}

export { ModeOnlyToggle };
