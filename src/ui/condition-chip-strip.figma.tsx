// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { ConditionChipStrip } from './condition-chip-strip';

figma.connect(
  ConditionChipStrip,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=condition-chip-strip',
  {
    example: () => (
      <ConditionChipStrip>
        <span className="rounded-[var(--radius-xs)] border px-1 py-px text-[10px]">Poisoned ×</span>
      </ConditionChipStrip>
    ),
  },
);
