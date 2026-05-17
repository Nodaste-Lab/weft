import * as React from "react";
import { ArrowDown, ArrowUp, Shield, Skull, X } from "lucide-react";

import type { CombatantType } from "../../settings/battleTypes";
import { Badge } from "./badge";
import { Button } from "./button";
import { CombatantTypeDot } from "./combatant-type-dot";
import { cn } from "./utils";

export type BattleCombatantSummaryRowProps = {
  initiative: number;
  name: string;
  combatantType: CombatantType;
  isActive: boolean;
  isOnDeck: boolean;
  isDead: boolean;
  ac: number;
  onReorderUp: () => void;
  onReorderDown: () => void;
  onRemove: (e: React.MouseEvent) => void;
  disableReorderUp: boolean;
  disableReorderDown: boolean;
  className?: string;
};

/** Initiative badge + name + type + AC + reorder + remove — row 1 of an active combatant card. */
function BattleCombatantSummaryRow({
  className,
  initiative,
  name,
  combatantType,
  isActive,
  isOnDeck,
  isDead,
  ac,
  onReorderUp,
  onReorderDown,
  onRemove,
  disableReorderUp,
  disableReorderDown,
}: BattleCombatantSummaryRowProps) {
  return (
    <div data-slot="battle-combatant-summary-row" className={cn("flex items-center gap-[7px]", className)}>
      <Badge
        variant={isActive ? "default" : "outline"}
        className={cn(
          "h-[22px] min-w-[22px] shrink-0 justify-center rounded-[var(--radius-xs)] px-0 text-[length:var(--text-xs)] font-semibold tabular-nums",
          !isActive && "border-[var(--hud-border)] bg-[var(--hud-surface-hover)] font-semibold text-[var(--hud-text-3)]",
        )}
      >
        {initiative}
      </Badge>
      <div className="flex min-w-0 flex-1 items-center gap-[5px]">
        <span
          className={cn(
            "text-[length:var(--text-sm)]",
            isActive ? "font-semibold text-[var(--hud-text-1)]" : "font-normal text-[var(--hud-text-2)]",
          )}
        >
          {name}
        </span>
        <CombatantTypeDot type={combatantType} />
        {isOnDeck ? (
          <span className="text-[9px] font-medium italic text-primary/70">on deck</span>
        ) : null}
        {isDead ? <Skull size={11} className="shrink-0 text-[var(--hud-danger)]" aria-hidden /> : null}
      </div>
      <div className="flex shrink-0 items-center gap-1 text-[var(--hud-text-3)]">
        <Shield size={11} aria-hidden />
        <span className="text-[length:var(--text-xs)] font-medium text-[var(--hud-text-2)]">{ac}</span>
      </div>
      <div className="flex shrink-0 flex-col gap-0" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReorderUp}
          disabled={disableReorderUp}
          aria-label={`Move ${name} up in initiative`}
          className={disableReorderUp ? "text-muted-foreground/30" : "text-muted-foreground"}
        >
          <ArrowUp size={9} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReorderDown}
          disabled={disableReorderDown}
          aria-label={`Move ${name} down in initiative`}
          className={disableReorderDown ? "text-muted-foreground/30" : "text-muted-foreground"}
        >
          <ArrowDown size={9} />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        aria-label={`Remove ${name} from combat`}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <X size={11} />
      </Button>
    </div>
  );
}

export { BattleCombatantSummaryRow };
