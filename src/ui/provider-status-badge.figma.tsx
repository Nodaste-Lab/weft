// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { ProviderStatusBadge } from './provider-status-badge';

figma.connect(
  ProviderStatusBadge,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=provider-status-badge',
  {
    example: () => <ProviderStatusBadge status="available" />,
  },
);
