// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { SettingsModuleShell } from './settings-module-shell';

figma.connect(
  SettingsModuleShell,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=settings-module-shell',
  {
    props: {
      title: figma.string('Title'),
      eyebrow: figma.string('Eyebrow'),
      description: figma.string('Description'),
      tone: figma.enum('Tone', { default: 'default', subtle: 'subtle', inset: 'inset' }),
      children: figma.children('*'),
    },
    example: ({ title, eyebrow, description, tone, children }) => (
      <SettingsModuleShell title={title} eyebrow={eyebrow} description={description} tone={tone}>
        {children}
      </SettingsModuleShell>
    ),
  },
);
