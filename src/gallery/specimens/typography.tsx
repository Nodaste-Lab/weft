import * as React from 'react';
import { TextContent } from '../../ui/text-content';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Specimens for the typography category. One entry per component id; see ../specimen-types.ts. */
export const typographySpecimens: Record<string, Specimen> = {
  'text-content': {
    component: 'TextContent',
    module: 'text-content',
    base: { children: 'The export runs in the background and emails you when it is done.' },
    render: ({ children, ...p }: P) => <TextContent {...(p as React.ComponentProps<typeof TextContent>)}>{children as React.ReactNode}</TextContent>,
  },
};
