// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { StatusIconRow } from './status-icon-row';

figma.connect(
  StatusIconRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=status-icon-row',
  {
    props: {
      tone: figma.enum('Tone', {
        success: 'success',
        warning: 'warning',
        danger: 'danger',
        muted: 'muted',
        info: 'info',
      }),
      density: figma.enum('Density', { compact: 'compact', default: 'default' }),
      title: figma.string('Title'),
      detail: figma.string('Detail'),
    },
    example: ({ tone, density, title, detail }) => (
      <StatusIconRow
        tone={tone}
        density={density}
        title={title}
        detail={detail}
        icon={<span />}
      />
    ),
  },
);
