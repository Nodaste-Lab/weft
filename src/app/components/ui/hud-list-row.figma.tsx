// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { HudListRow, HudListRowTitle, HudListRowMeta } from './hud-list-row';

figma.connect(
  HudListRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=hud-list-row',
  {
    props: {
      title: figma.string('Title'),
      meta: figma.string('Meta'),
      state: figma.enum('State', {
        default: 'default',
        unread: 'unread',
        overdue: 'overdue',
        resolved: 'resolved',
        active: 'active',
      }),
      density: figma.enum('Density', { default: 'default', compact: 'compact' }),
      leading: figma.children('Leading'),
      trailing: figma.children('Trailing'),
    },
    example: ({ title, meta, state, density, leading, trailing }) => (
      <HudListRow state={state} density={density} leading={leading} trailing={trailing}>
        <HudListRowTitle>{title}</HudListRowTitle>
        <HudListRowMeta>{meta}</HudListRowMeta>
      </HudListRow>
    ),
  },
);
