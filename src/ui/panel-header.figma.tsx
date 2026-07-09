// @ts-nocheck
import figma from '@figma/code-connect';
import {
  PanelHeader,
  PanelHeaderTitle,
  PanelHeaderActions,
  PanelHeaderDismiss,
} from './panel-header';

figma.connect(
  PanelHeader,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=92-15',
  {
    props: {
      title: figma.string('Title'),
    },
    example: ({ title }) => (
      <PanelHeader>
        <PanelHeaderTitle>{title}</PanelHeaderTitle>
        <PanelHeaderActions>{/* slot — drop in <Button>s here */}</PanelHeaderActions>
        <PanelHeaderDismiss onClick={() => {}} />
      </PanelHeader>
    ),
  },
);
