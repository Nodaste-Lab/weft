// @ts-nocheck
import figma from '@figma/code-connect';
import { ActionButtonRow } from './action-button-row';
import { Button } from './button';

figma.connect(
  ActionButtonRow,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=91-6',
  {
    example: () => (
      <ActionButtonRow>
        <Button variant="outline">Copy</Button>
        <Button variant="outline">Email</Button>
        <Button variant="outline">Vault</Button>
      </ActionButtonRow>
    ),
  },
);
