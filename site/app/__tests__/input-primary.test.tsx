// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { Playground } from '../pages/Playground';
afterEach(cleanup);
it('uses the shared labelled component and exposes cutout in the playground',()=>{render(<Playground id="text-field"/>);const input=screen.getByRole('textbox',{name:'Display name'});expect(input.closest('.weft-text-field')).toHaveAttribute('data-treatment','cutout');expect(screen.getByRole('radio',{name:'treatment cutout'})).toBeInTheDocument();expect(screen.getByText(/<TextField label="Display name"/)).toBeInTheDocument();});
