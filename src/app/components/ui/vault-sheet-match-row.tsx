import * as React from "react";
import { Heart, Plus, Shield } from "lucide-react";

import { Button } from "./button";
import { cn } from "./utils";

/*
 * VaultSheetMatchRow — sheet match row used by the BattleTracker vault
 * search results (both staging and in-combat phases).
 *
 * Renders the match name, confidence pill, HP/AC summary, file path,
 * and an "Add" button that calls back with the original `match` value.
 *
 * Confidence tone tokens:
 *   - exact   → var(--hud-positive)
 *   - partial → var(--hud-warning)
 *   - other   → muted via var(--hud-tint-2) / var(--hud-text-3)
 */

type SheetMatchConfidence = "exact" | "partial" | string;

interface VaultSheetMatchValue {
  characterName: string;
  filePath: string;
  confidence: SheetMatchConfidence;
  parsedData?: {
    hp?: number;
    ac?: number;
    cls?: string;
    level?: number | string;
  };
}

interface VaultSheetMatchRowProps<T extends VaultSheetMatchValue>
  extends Omit<React.ComponentProps<"div">, "onSelect"> {
  match: T;
  onAdd: (match: T) => void;
  addLabel?: string;
  ariaLabel?: string;
  /** Replaces default Plus icon in the action button. */
  actionIcon?: React.ReactNode;
  actionVariant?: React.ComponentProps<typeof Button>["variant"];
}

const CONFIDENCE_BG: Record<SheetMatchConfidence, string> = {
  exact: "color-mix(in srgb, var(--hud-positive) 15%, transparent)",
  partial: "color-mix(in srgb, var(--hud-warning) 15%, transparent)",
};

const CONFIDENCE_BORDER: Record<SheetMatchConfidence, string> = {
  exact: "color-mix(in srgb, var(--hud-positive) 30%, transparent)",
  partial: "color-mix(in srgb, var(--hud-warning) 30%, transparent)",
};

const CONFIDENCE_COLOR: Record<SheetMatchConfidence, string> = {
  exact: "var(--hud-positive)",
  partial: "var(--hud-warning)",
};

function VaultSheetMatchRowInner<T extends VaultSheetMatchValue>(
  {
    className,
    match,
    onAdd,
    addLabel = "Add",
    ariaLabel,
    actionIcon,
    actionVariant = "default",
    ...props
  }: VaultSheetMatchRowProps<T>,
  ref: React.Ref<HTMLDivElement>,
) {
  const isExactOrPartial = match.confidence === "exact" || match.confidence === "partial";
  const background = isExactOrPartial ? CONFIDENCE_BG[match.confidence] : "var(--hud-tint-2)";
  const border = isExactOrPartial ? CONFIDENCE_BORDER[match.confidence] : "var(--hud-border)";
  const color = isExactOrPartial ? CONFIDENCE_COLOR[match.confidence] : "var(--hud-text-3)";

  return (
    <div
      ref={ref}
      data-slot="vault-sheet-match-row"
      data-confidence={match.confidence}
      className={cn(
        "flex items-center gap-[7px] border-b border-[var(--hud-border)] px-1 py-1.5",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col [font-family:var(--weft-font-sans)]">
        <div className="flex items-center gap-1.5">
          <span className="text-[length:var(--text-xs)] font-semibold text-[var(--hud-text-1)]">
            {match.characterName}
          </span>
          <span
            data-slot="vault-sheet-match-confidence"
            className="rounded-[var(--radius-xs)] border px-1 text-[9px] font-medium [font-family:var(--weft-font-sans)]"
            style={{ background, borderColor: border, color }}
          >
            {match.confidence}
          </span>
        </div>
        {(match.parsedData?.cls ||
          match.parsedData?.level != null ||
          match.parsedData?.hp !== undefined ||
          match.parsedData?.ac !== undefined) && (
          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] text-[var(--hud-text-3)]">
            {(match.parsedData.cls || match.parsedData.level != null) && (
              <span>
                {match.parsedData.cls}
                {match.parsedData.cls && match.parsedData.level != null ? ' ' : ''}
                {match.parsedData.level ?? ''}
              </span>
            )}
            {match.parsedData?.hp !== undefined && (
              <span className="inline-flex items-center gap-0.5">
                <Heart size={8} /> {match.parsedData.hp}
              </span>
            )}
            {match.parsedData?.ac !== undefined && (
              <span className="inline-flex items-center gap-0.5">
                <Shield size={8} /> {match.parsedData.ac}
              </span>
            )}
          </div>
        )}
        <div className="mt-px truncate text-[9px] text-[var(--hud-text-3)] [font-family:var(--weft-font-mono)]">
          {match.filePath}
        </div>
      </div>
      <Button
        variant={actionVariant}
        size="sm"
        onClick={() => onAdd(match)}
        aria-label={ariaLabel ?? `Add ${match.characterName}`}
        className="flex-shrink-0"
      >
        {actionIcon ?? <Plus size={10} />} {addLabel}
      </Button>
    </div>
  );
}

const VaultSheetMatchRow = React.forwardRef(VaultSheetMatchRowInner) as <T extends VaultSheetMatchValue>(
  props: VaultSheetMatchRowProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

(VaultSheetMatchRow as unknown as { displayName: string }).displayName = "VaultSheetMatchRow";

export { VaultSheetMatchRow };
export type { VaultSheetMatchRowProps, VaultSheetMatchValue, SheetMatchConfidence };
