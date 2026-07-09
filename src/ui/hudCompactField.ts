import { cn } from "./utils";

/*
 * HUD_COMPACT_INPUT_CLASS — shared dense field styling for HUD panels.
 *
 * Use for compact in-panel inputs (source filters, inline edits, Knowledge search,
 * sheet resolution, etc.) where the workspace-grade
 * `HUD_FIELD_CLASS` from ModeWorkspaceCreatePage is too tall. Tokens come
 * from the HUD layer (--hud-input-bg, --hud-border, --radius-xs, --text-xs)
 * with the Weft sans family and HUD accent focus ring.
 *
 * Compose with cn() in the consumer for one-off width/alignment overrides:
 *   <Input className={cn(HUD_COMPACT_INPUT_CLASS, "w-9 text-center")} />
 */
export const HUD_COMPACT_INPUT_CLASS = cn(
  "box-border h-auto min-h-0 w-full rounded-[var(--radius-xs)] border border-[var(--hud-border)] bg-[var(--hud-input-bg)]",
  "px-1.5 py-0.5 text-[length:var(--text-xs)] text-[var(--hud-text-1)] shadow-none outline-none",
  "[font-family:var(--weft-font-sans)] placeholder:text-[var(--hud-text-3)]",
  "focus-visible:border-[var(--hud-border-accent)] focus-visible:ring-[3px] focus-visible:ring-[var(--hud-border-accent)]/30",
);

/*
 * HUD_COMPACT_SELECT_TRIGGER_CLASS — paired SelectTrigger styling for
 * HUD panels. Slightly taller than the input to accommodate chevrons but
 * shares the same border + focus ring vocabulary.
 */
export const HUD_COMPACT_SELECT_TRIGGER_CLASS = cn(
  "h-8 min-h-0 cursor-pointer gap-1 border-[var(--hud-border)] bg-[var(--hud-input-bg)] px-2 py-0",
  "text-[length:var(--text-xs)] text-[var(--hud-text-1)]",
  "focus-visible:border-[var(--hud-border-accent)] focus-visible:ring-[3px] focus-visible:ring-[var(--hud-border-accent)]/30",
);

/*
 * HUD_WORKSPACE_INPUT_CLASS — workspace-grade dense field for settings
 * surfaces (Session/Settings panel, ModeWorkspaceCreatePage). Use when
 * `HUD_COMPACT_INPUT_CLASS` is too tight for legibility (e.g. long
 * vault paths, source labels, role names) but the field still needs to
 * read as a HUD control. Slightly taller and uses text-sm.
 */
export const HUD_WORKSPACE_INPUT_CLASS = cn(
  "h-9 w-full min-h-9 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-input-bg)]",
  "px-2.5 py-2 text-[length:var(--text-sm)] text-[var(--hud-text-1)] shadow-none",
  "[font-family:var(--weft-font-sans)] placeholder:text-[var(--hud-text-3)]",
  "focus-visible:border-[var(--hud-border-accent)] focus-visible:ring-[var(--hud-border-accent)]/30",
);
