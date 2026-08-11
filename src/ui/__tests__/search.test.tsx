// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SearchField } from '../search-field';
import type { CommitDetail } from '../use-commit-boundary';

/**
 * Search as a stated pattern (P7, Document B §3) — not a type attribute.
 *
 * The clear control is specified BEHAVIOURALLY, because "keyboard-operable"
 * is a property a broken control can have: it is a real button, named, it
 * appears only when there is something to clear, clearing preserves focus and
 * emits exactly one change and one commit, it respects disabled and
 * read-only, and it can never submit its containing form — the classic
 * defect, called out by name in the plan.
 */

describe('naming and affordance', () => {
  it('is a searchbox named by its hidden label, never by the placeholder', () => {
    render(<SearchField label="Search projects" placeholder="e.g. weft-board" />);
    const box = screen.getByRole('searchbox', { name: 'Search projects' });
    expect(box).toHaveAttribute('placeholder', 'e.g. weft-board');
  });

  it('shows no clear control while there is nothing to clear', () => {
    render(<SearchField label="Search projects" />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('shows the named clear control once there is content', () => {
    render(<SearchField label="Search projects" defaultValue="weft" />);
    const clear = screen.getByRole('button', { name: 'Clear search' });
    expect(clear).toHaveAttribute('type', 'button');
  });
});

describe('clearing', () => {
  it('empties the field, keeps focus in it, and emits exactly one change and one commit', () => {
    const commits: CommitDetail[] = [];
    const changes: string[] = [];
    render(
      <SearchField
        label="Search projects"
        defaultValue="weft"
        onChange={(e) => changes.push(e.target.value)}
        onCommit={(d) => commits.push(d)}
      />,
    );
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    box.focus();
    const clear = screen.getByRole('button', { name: 'Clear search' });
    fireEvent.pointerDown(clear);
    fireEvent.click(clear);
    expect(box.value).toBe('');
    expect(changes, 'exactly one change event for one clear').toEqual(['']);
    expect(commits, 'exactly one commit for one clear').toHaveLength(1);
    expect(commits[0].reason).toBe('explicit-save');
    expect(document.activeElement, 'focus stays in the field after clearing').toBe(box);
    expect(screen.queryByRole('button', { name: 'Clear search' }), 'nothing left to clear').toBeNull();
  });

  it('works controlled: the consumer receives the empty change and keeps ownership of the value', () => {
    function Controlled() {
      const [value, setValue] = React.useState('weft');
      return (
        <SearchField label="Search projects" value={value} onChange={(e) => setValue(e.target.value)} />
      );
    }
    render(<Controlled />);
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Clear search' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(box.value).toBe('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('never submits the containing form — from the clear, or from anything else it renders', () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <SearchField label="Search projects" defaultValue="weft" />
      </form>,
    );
    const clear = screen.getByRole('button', { name: 'Clear search' });
    fireEvent.pointerDown(clear);
    fireEvent.click(clear);
    expect(onSubmit, 'a clear that submits is the classic defect').not.toHaveBeenCalled();
  });

  it('takes a consumer clear label', () => {
    render(<SearchField label="Search notes" defaultValue="x" clearLabel="Clear note search" />);
    expect(screen.getByRole('button', { name: 'Clear note search' })).toBeTruthy();
  });
});

describe('disabled and read-only', () => {
  it('renders no clear control when disabled, even with content', () => {
    render(<SearchField label="Search projects" defaultValue="weft" disabled />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('renders no clear control when read-only — the value is not editable, so it is not clearable', () => {
    render(<SearchField label="Search projects" defaultValue="weft" readOnly />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });
});

describe('the commit boundary rides along', () => {
  it('Enter emits one commit and does not prevent the native submit path', () => {
    const commits: CommitDetail[] = [];
    const prevented: boolean[] = [];
    render(
      <div onKeyDown={(e) => prevented.push(e.defaultPrevented)}>
        <SearchField label="Search projects" defaultValue="weft" onCommit={(d) => commits.push(d)} />
      </div>,
    );
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    expect(commits.map((c) => c.reason)).toEqual(['enter']);
    expect(prevented).toEqual([false]);
  });

  it('blur emits one commit', () => {
    const commits: CommitDetail[] = [];
    render(<SearchField label="Search projects" defaultValue="weft" onCommit={(d) => commits.push(d)} />);
    const box = screen.getByRole('searchbox');
    fireEvent.focus(box);
    fireEvent.blur(box);
    expect(commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });

  it('typing emits changes but no commit', () => {
    const commits: CommitDetail[] = [];
    const changes: string[] = [];
    render(
      <SearchField
        label="Search projects"
        onChange={(e) => changes.push(e.target.value)}
        onCommit={(d) => commits.push(d)}
      />,
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'w' } });
    expect(changes).toEqual(['w']);
    expect(commits).toHaveLength(0);
  });
});
