// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { HudToggleSwitch } from './hud-toggle-switch';

figma.connect(
  HudToggleSwitch,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=hud-toggle-switch',
  {
    props: {
      active: figma.boolean('Active'),
      ariaLabel: figma.string('Aria label'),
      size: figma.enum('Size', { default: 'default', sm: 'sm' }),
      disabled: figma.boolean('Disabled'),
    },
    example: ({ active, ariaLabel, size, disabled }) => (
      <HudToggleSwitch
        active={active}
        onToggle={() => undefined}
        ariaLabel={ariaLabel}
        size={size}
        disabled={disabled}
      />
    ),
  },
);
