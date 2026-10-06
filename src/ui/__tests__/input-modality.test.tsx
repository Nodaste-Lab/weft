// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { INPUT_MODALITY_ATTRIBUTE, bindInputModality } from '../input-modality';

const modality = () => document.documentElement.getAttribute(INPUT_MODALITY_ATTRIBUTE);

describe('input modality tracker', () => {
  it.each([
    ['select', async () => {
      const { Select, SelectTrigger } = await import('../select');
      return (
        <Select>
          <SelectTrigger aria-label="Space" />
        </Select>
      );
    }],
    ['dropdown-menu', async () => {
      const { DropdownMenu, DropdownMenuTrigger } = await import('../dropdown-menu');
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>Create</DropdownMenuTrigger>
        </DropdownMenu>
      );
    }],
    ['context-menu', async () => {
      const { ContextMenu, ContextMenuTrigger } = await import('../context-menu');
      return (
        <ContextMenu>
          <ContextMenuTrigger>Row</ContextMenuTrigger>
        </ContextMenu>
      );
    }],
  ])('a %s trigger starts the tracker without any setup', async (_name, load) => {
    vi.resetModules();
    const element = await load();
    const listen = vi.spyOn(document, 'addEventListener');
    render(element);
    expect(listen.mock.calls.map(([type]) => type)).toEqual(expect.arrayContaining(['pointerdown', 'keydown']));
    listen.mockRestore();
  });

  it('follows pointer presses and navigation keys, ignoring chords, modifiers and Escape', () => {
    document.documentElement.removeAttribute(INPUT_MODALITY_ATTRIBUTE);
    bindInputModality();
    bindInputModality();
    expect(modality()).toBeNull();

    fireEvent.pointerDown(document.body);
    expect(modality()).toBe('pointer');

    fireEvent.keyDown(document.body, { key: 'Shift' });
    fireEvent.keyDown(document.body, { key: '4', metaKey: true, shiftKey: true });
    fireEvent.keyDown(document.body, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(modality()).toBe('pointer');

    fireEvent.keyDown(document.body, { key: 'Tab' });
    expect(modality()).toBe('keyboard');

    fireEvent.pointerDown(document.body);
    expect(modality()).toBe('pointer');
    fireEvent.keyDown(document.body, { key: 'ArrowDown' });
    expect(modality()).toBe('keyboard');
  });
});
