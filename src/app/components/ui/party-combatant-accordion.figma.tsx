// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { PartyCombatantAccordion } from './party-combatant-accordion';

figma.connect(
  PartyCombatantAccordion,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=party-combatant-accordion',
  {
    props: {
      expanded: figma.boolean('Expanded'),
    },
    example: ({ expanded }) => (
      <PartyCombatantAccordion
        expanded={expanded}
        expandRegionId="figma-party-row"
        header={
          <button type="button" className="flex w-full items-center gap-2 border-0 bg-transparent p-0 text-left">
            <div className="size-2 shrink-0 rounded-full bg-[var(--hud-info)]" aria-hidden />
            <div className="min-w-0 flex-1 text-sm font-semibold">Aldric</div>
            <span className="text-xs text-muted-foreground">▾</span>
          </button>
        }
      >
        {expanded ? <p className="text-xs text-muted-foreground">Detail body</p> : null}
      </PartyCombatantAccordion>
    ),
  },
);
