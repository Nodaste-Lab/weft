// @vitest-environment jsdom
import * as React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ProjectFormExample } from '../pages/FormRecipes';
import { FormSpecimen } from '../../../src/gallery/specimens/forms';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

it('keeps fixture errors associated with the invalid native control', () => {
  render(<FormSpecimen message="Choose a handle." withoutStatus/>);
  const input = screen.getByRole('textbox', {name:'Player handle'});
  expect(input).toHaveAttribute('aria-invalid', 'true');
  const descriptions = input.getAttribute('aria-describedby')!.split(' ').map(id => document.getElementById(id)?.textContent);
  expect(descriptions[0]).toContain('Choose a handle.');
  expect(descriptions[1]).toBe('Shown in session headers.');
});

it('starts only one save when native submit fires twice', async () => {
  vi.useFakeTimers();
  const timeout = vi.spyOn(globalThis, 'setTimeout');
  render(<ProjectFormExample/>);
  fireEvent.change(screen.getByRole('textbox', {name:'Project name (required)'}), {target:{value:'Research'}});
  await act(async () => {
    const form = screen.getByRole('form', {name:'Project example'});
    fireEvent.submit(form);
    fireEvent.submit(form);
  });
  expect(timeout.mock.calls.filter(call => call[1] === 400)).toHaveLength(1);
  await act(async () => { await vi.advanceTimersByTimeAsync(400); });
  expect(screen.getByRole('status')).toHaveTextContent('Saved in this local example.');
});
