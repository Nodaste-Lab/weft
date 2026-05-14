// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { RepeatListFieldColumn } from './repeat-list-field-column';

figma.connect(
  RepeatListFieldColumn,
  'https://www.figma.com/design/q58dgHZAnhampton7wlnjXpgcT/Weft-Design-System?node-id=repeat-list-field-column',
  {
    example: () => (
      <RepeatListFieldColumn label="Field">
        <input className="h-8 rounded-[var(--radius-xs)] border px-2 text-xs" />
      </RepeatListFieldColumn>
    ),
  },
);
