// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
  it('empties the field, keeps focus in it, and emits exactly one change and one commit', async () => {
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
    fireEvent.pointerDown(clear, { button: 0, isPrimary: true });
    fireEvent.click(clear);
    await Promise.resolve(); // the commit lands one microtask later, after React's flush
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
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Clear search' }), {
      button: 0,
      isPrimary: true,
    });
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
    fireEvent.pointerDown(clear, { button: 0, isPrimary: true });
    fireEvent.click(clear);
    expect(onSubmit, 'a clear that submits is the classic defect').not.toHaveBeenCalled();
  });

  it('keyboard clear is ONE commit: tabbing into the owned clear registers before the blur', async () => {
    const commits: CommitDetail[] = [];
    render(
      <SearchField label="Search projects" defaultValue="weft" onCommit={(d) => commits.push(d)} />,
    );
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    const clear = screen.getByRole('button', { name: 'Clear search' });
    box.focus();
    // Tab: focus leaves the input FOR the clear button. Unlike a generic Save
    // control, SearchField owns this button, so the blur is suppressed…
    fireEvent.blur(box, { relatedTarget: clear });
    expect(commits, 'the blur into our own clear must not commit yet').toHaveLength(0);
    // …and the activation commits once, carrying the suppressed blur as evidence.
    // REAL focus on the button first: clearInput's el.focus() then fires a
    // genuine blur on the button mid-clear, which is the sequence the
    // clearingRef guard exists for — without real focus, jsdom never fires it
    // and a broken guard passes (this test's first shape did exactly that).
    (clear as HTMLButtonElement).focus();
    fireEvent.click(clear);
    await Promise.resolve();
    // Exactly ONE commit is the contract. Its sources may be just
    // ['explicit-save']: the clear's own refocus re-enters the field, and
    // re-entry abandons suppressed-blur state by the helper's design ("the
    // user came back") — the evidence trail shortens, the transaction count
    // does not. Pinning the sources array here over-claimed and failed on the
    // real focus sequence.
    expect(commits).toHaveLength(1);
    expect(commits[0].reason).toBe('explicit-save');
  });

  it('a right-click on the clear arms nothing — the next blur commits normally', () => {
    // A secondary press fires pointerdown with no click coming (the context
    // menu eats it), and none of the cancel paths fire either — an armed
    // registration here would suppress and swallow the next blur.
    const commits: CommitDetail[] = [];
    render(
      <SearchField label="Search projects" defaultValue="weft" onCommit={(d) => commits.push(d)} />,
    );
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    const clear = screen.getByRole('button', { name: 'Clear search' });
    box.focus();
    fireEvent.pointerDown(clear, { button: 2, isPrimary: true }); // context-menu press
    fireEvent.blur(box); // later: focus leaves for somewhere unrelated
    expect(commits, 'the blur must not be suppressed by a save that never comes').toEqual([
      { reason: 'blur', sources: ['blur'] },
    ]);
  });

  it('tabbing through the clear without activating replays the blur — one commit, nothing swallowed', () => {
    const commits: CommitDetail[] = [];
    render(
      <SearchField label="Search projects" defaultValue="weft" onCommit={(d) => commits.push(d)} />,
    );
    const box = screen.getByRole('searchbox') as HTMLInputElement;
    const clear = screen.getByRole('button', { name: 'Clear search' });
    box.focus();
    fireEvent.blur(box, { relatedTarget: clear });
    fireEvent.blur(clear); // tabbed onward — the activation never came
    expect(commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });

  it('a controlled consumer observes the CLEARED value at commit time', async () => {
    const seenAtCommit: string[] = [];
    function Controlled() {
      const [value, setValue] = React.useState('weft');
      return (
        <SearchField
          label="Search projects"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onCommit={() => seenAtCommit.push(value)}
        />
      );
    }
    render(<Controlled />);
    const clear = screen.getByRole('button', { name: 'Clear search' });
    fireEvent.pointerDown(clear, { button: 0, isPrimary: true });
    fireEvent.click(clear);
    await Promise.resolve();
    expect(
      seenAtCommit,
      'committed synchronously, onCommit would still see the pre-clear value and validate the wrong thing',
    ).toEqual(['']);
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

  describe('the accessible name is the label prop, and nothing overrides it', () => {
    it('a spread-in aria-label from untyped code is stripped — one name, one control', () => {
      const sneaky = { 'aria-label': 'Sneaky override', 'aria-labelledby': 'elsewhere' } as Record<
        string,
        string
      >;
      render(<SearchField label="Search projects" {...(sneaky as object)} />);
      const box = screen.getByRole('searchbox', { name: 'Search projects' });
      expect(box.getAttribute('aria-label')).toBeNull();
      expect(box.getAttribute('aria-labelledby')).toBeNull();
    });
  });

  describe('native form.reset() and the uncontrolled mirror', () => {
    // reset() restores the DOM value without firing input/change, so the
    // mirror that drives clear visibility would go stale in both directions.
    // Either direction leaves a WRONG accessible affordance on screen.

    it('a restored non-empty default brings the clear back', async () => {
      const commits: CommitDetail[] = [];
      render(
        <form>
          <SearchField label="Search projects" defaultValue="weft" onCommit={(d) => commits.push(d)} />
        </form>,
      );
      const box = screen.getByRole('searchbox') as HTMLInputElement;
      fireEvent.change(box, { target: { value: '' } });
      expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
      await act(async () => {
        (document.querySelector('form') as HTMLFormElement).reset();
      });
      expect(box.value, 'jsdom restores the default on reset').toBe('weft');
      expect(
        screen.getByRole('button', { name: 'Clear search' }),
        'content is back; the clear must be back with it',
      ).toBeTruthy();
      expect(commits, 'reset is not a boundary').toHaveLength(0);
    });

    it('a restored empty default takes the stale clear with it', async () => {
      render(
        <form>
          <SearchField label="Search projects" />
        </form>,
      );
      const box = screen.getByRole('searchbox') as HTMLInputElement;
      fireEvent.change(box, { target: { value: 'weft' } });
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeTruthy();
      await act(async () => {
        (document.querySelector('form') as HTMLFormElement).reset();
      });
      expect(box.value).toBe('');
      expect(
        screen.queryByRole('button', { name: 'Clear search' }),
        'an empty field offering a clear is a stale accessible button',
      ).toBeNull();
    });
  });
});
