// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { PanelBlockShell } from './panel-block-shell';

figma.connect(
  PanelBlockShell,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=panel-block-shell',
  {
    props: {
      title: figma.string('Title'),
      selected: figma.boolean('Selected'),
      collapsible: figma.boolean('Collapsible'),
      defaultCollapsed: figma.boolean('Default collapsed'),
      activeCountText: figma.string('Active count text'),
      headless: figma.boolean('Headless'),
      seamless: figma.boolean('Seamless'),
      children: figma.children('*'),
    },
    example: ({ title, selected, collapsible, defaultCollapsed, activeCountText, headless, seamless, children }) => (
      <PanelBlockShell
        title={title}
        selected={selected}
        collapsible={collapsible}
        defaultCollapsed={defaultCollapsed}
        activeCountText={activeCountText}
        headless={headless}
        seamless={seamless}
      >
        {children}
      </PanelBlockShell>
    ),
  },
);
