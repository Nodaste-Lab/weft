// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { PeriodChipRow } from './period-chip-row';

figma.connect(
  PeriodChipRow,
  'https://www.figma.com/design/q58dgHZAnhampton7wlnjXpgcT/Weft-Design-System?node-id=period-chip-row',
  {
    example: () => (
      <PeriodChipRow>
        <span className="rounded-full border px-2 py-0.5 text-[10px]">Last 7 days</span>
      </PeriodChipRow>
    ),
  },
);
