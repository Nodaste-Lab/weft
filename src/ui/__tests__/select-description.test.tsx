// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { it, expect } from 'vitest';
import { axe } from 'jest-axe';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../select';

it('describes options without copying details into the selected value', async () => {
  const { container } = render(<><label htmlFor="scope">Key type</label><p id="external">Available to members.</p><Select defaultValue="personal"><SelectTrigger id="scope"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="personal">Personal API key</SelectItem><SelectItem value="workspace" description="Shared with your workspace" aria-describedby="external">Workspace API key</SelectItem></SelectContent></Select></>);
  const trigger = screen.getByRole('combobox');
  fireEvent.keyDown(trigger, { key: 'ArrowDown' });
  const option = await screen.findByRole('option', { name: 'Workspace API key' });
  expect(option).toHaveAccessibleDescription('Available to members. Shared with your workspace');
  expect((await axe(container)).violations).toEqual([]);
  option.focus();
  fireEvent.keyDown(option, { key: 'Enter' });
  await waitFor(() => expect(trigger).toHaveTextContent('Workspace API key'));
  expect(trigger).not.toHaveTextContent('Shared with your workspace');
});

it('omits absent description ids and retains zero as visible content', async () => {
  render(<Select defaultOpen><SelectTrigger aria-label="Choice"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="plain">Plain</SelectItem><SelectItem value="zero" description={0}>Zero</SelectItem></SelectContent></Select>);
  expect(await screen.findByRole('option', { name: 'Plain' })).not.toHaveAttribute('aria-describedby');
  expect(screen.getByRole('option', { name: 'Zero' })).toHaveAccessibleDescription('0');
});
