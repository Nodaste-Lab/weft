// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStatus,
} from '../form';
import { Input } from '../input';

/**
 * Asynchronous pending presentation (the weft#16 deferred follow-up).
 *
 * Amendment A4's condition: commit starts evaluation; the consumer may prevent
 * progression while pending; Weft only presents the supplied pending or result
 * state. Weft evaluates NOTHING — the consumer supplies `pending` or a result
 * tone plus its own text, exactly as it supplies errors through
 * react-hook-form (decision 7).
 *
 * The affordance is text in the hint slot: the field's right edge is taken
 * (chevron, search clear, error glyph), and Weft's reduced-motion rule freezes
 * animations, so motion at the edge would read as a hung field.
 *
 * Every accessibility claim here is EXPOSURE, never announcement: the ids
 * resolve and the order is a property of the attribute. What a screen reader
 * does with either is not claimed.
 */

type Tone = 'ok' | 'info' | 'warn' | 'stop';

function StatusField(props: {
  pending?: boolean;
  tone?: Tone;
  statusText?: string;
  withError?: boolean;
  withHelp?: boolean;
}) {
  const { pending, tone, statusText, withError, withHelp = true } = props;
  const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
  React.useEffect(() => {
    if (withError) {
      form.setError('source', { type: 'manual', message: 'Unable to reach source.' });
    } else {
      form.clearErrors('source');
    }
  }, [form, withError]);
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source path</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {statusText !== undefined ? (
              <FormStatus pending={pending} tone={tone}>
                {statusText}
              </FormStatus>
            ) : null}
            {withHelp ? <FormDescription>Must be reachable over HTTPS.</FormDescription> : null}
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function describedbyIds(control: HTMLElement): string[] {
  return (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
}

describe('FormStatus — presentation of a supplied state, nothing else', () => {
  it('renders the consumer\'s text in the hint slot with a stable status id', () => {
    render(<StatusField pending statusText="Checking source…" />);
    const status = document.querySelector('[data-slot="form-status"]')!;
    expect(status, 'the status renders in the hint slot as its own element').toBeTruthy();
    expect(status.textContent).toContain('Checking source…');
    expect(status.id).toMatch(/-form-item-status$/);
  });

  it('pending carries a dot the description does not — a shape, not only a colour', () => {
    render(<StatusField pending statusText="Checking source…" />);
    const status = document.querySelector('[data-slot="form-status"]')!;
    const dot = status.querySelector('[data-status-dot]');
    expect(dot, 'pending is text plus a pulsing dot; the dot is the non-colour signal').toBeTruthy();
    expect(dot!.getAttribute('aria-hidden'), 'the dot stays out of the description').toBe('true');
  });

  it('a settled result carries its tone as data, and no dot', () => {
    for (const tone of ['ok', 'info', 'warn', 'stop'] as const) {
      const { unmount } = render(<StatusField tone={tone} statusText={`tone ${tone}`} />);
      const status = document.querySelector('[data-slot="form-status"]')!;
      expect(status.getAttribute('data-tone'), `tone ${tone} lands on the element`).toBe(tone);
      expect(
        status.querySelector('[data-status-dot]'),
        'the dot means pending; a settled result has none',
      ).toBeNull();
      unmount();
    }
  });

  it('a stop-toned status does NOT mark the field invalid — validity stays the consumer\'s', () => {
    render(<StatusField tone="stop" statusText="Source blocked." />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });
});

describe('FormStatus — aria-busy on the control, exposure only', () => {
  it('the control carries aria-busy while pending', () => {
    render(<StatusField pending statusText="Checking source…" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
  });

  it('aria-busy leaves with the pending state, not with the status', () => {
    const { rerender } = render(<StatusField pending statusText="Checking source…" />);
    rerender(<StatusField tone="ok" statusText="Source is reachable." />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-busy');
  });

  it('a settled status never sets aria-busy', () => {
    render(<StatusField tone="warn" statusText="Degraded." />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-busy');
  });
});

describe('A5 extended — one ordered list: error, then status, then help', () => {
  it('help only: the status id does not appear when no FormStatus renders', () => {
    render(<StatusField />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(/-form-item-description$/);
  });

  it('status + help: status precedes the durable help text', () => {
    render(<StatusField pending statusText="Checking source…" />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    expect(ids, 'both ids, in order — order is the whole rule').toHaveLength(2);
    expect(ids[0], `expected the status id first, got ${ids.join(' ')}`).toMatch(/-form-item-status$/);
    expect(ids[1]).toMatch(/-form-item-description$/);
  });

  it('error + status + help: error keeps first position; status second; help third', () => {
    render(<StatusField withError tone="stop" statusText="Blocked by policy." />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    expect(ids).toHaveLength(3);
    expect(ids[0], `A5: the error stays first, got ${ids.join(' ')}`).toMatch(/-form-item-message$/);
    expect(ids[1], `the status sits between error and help, got ${ids.join(' ')}`).toMatch(
      /-form-item-status$/,
    );
    expect(ids[2]).toMatch(/-form-item-description$/);
  });

  it('error removed: status and help survive, in order, nothing stale', () => {
    const { rerender } = render(<StatusField withError tone="warn" statusText="Degraded." />);
    rerender(<StatusField tone="warn" statusText="Degraded." />);
    const control = screen.getByRole('textbox');
    const ids = describedbyIds(control);
    expect(ids).toHaveLength(2);
    expect(ids[0]).toMatch(/-form-item-status$/);
    expect(ids[1]).toMatch(/-form-item-description$/);
    expect(control).toHaveAttribute('aria-invalid', 'false');
  });

  it('status removed: its id leaves the list; help survives', () => {
    const { rerender } = render(<StatusField pending statusText="Checking source…" />);
    rerender(<StatusField />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(/-form-item-description$/);
  });

  it('names each id exactly once with all three present', () => {
    render(<StatusField withError tone="stop" statusText="Blocked." />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every listed id resolves to an element carrying the copy', () => {
    render(<StatusField withError tone="stop" statusText="Blocked by policy." />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    const text = ids.map((id) => document.getElementById(id)?.textContent ?? '');
    expect(text[0]).toContain('Unable to reach source.');
    expect(text[1]).toContain('Blocked by policy.');
    expect(text[2]).toContain('Must be reachable over HTTPS.');
  });
});

describe('FormStatus — replacement, not stacking', () => {
  it('a status change replaces the text under the same id', () => {
    const { rerender } = render(<StatusField pending statusText="Checking source…" />);
    const before = document.querySelector('[data-slot="form-status"]')!.id;
    rerender(<StatusField tone="ok" statusText="Source is reachable." />);
    const statuses = document.querySelectorAll('[data-slot="form-status"]');
    expect(statuses, 'one status element — a replacement, never a stack').toHaveLength(1);
    expect(statuses[0].id, 'the id is stable across the transition').toBe(before);
    expect(statuses[0].textContent).toContain('Source is reachable.');
    expect(statuses[0].textContent).not.toContain('Checking source…');
  });
});

describe('GUARD — supplying a status evaluates nothing (decisions 7/10)', () => {
  it('never calls validation, never submits, never touches react-hook-form state', () => {
    const validate = vi.fn(() => true);
    const submit = vi.fn((e: React.FormEvent) => e.preventDefault());
    let stateProbe: { isSubmitted: boolean; submitCount: number; errorCount: number } | null = null;

    function Consumer({ pending, tone, text }: { pending?: boolean; tone?: Tone; text: string }) {
      const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
      stateProbe = {
        isSubmitted: form.formState.isSubmitted,
        submitCount: form.formState.submitCount,
        errorCount: Object.keys(form.formState.errors).length,
      };
      return (
        <Form {...form}>
          <form onSubmit={submit}>
            <FormField
              control={form.control}
              name="source"
              rules={{ validate }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormStatus pending={pending} tone={tone}>
                    {text}
                  </FormStatus>
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
    }

    const { rerender } = render(<Consumer pending text="Checking source…" />);
    rerender(<Consumer tone="warn" text="Degraded." />);
    rerender(<Consumer tone="stop" text="Blocked." />);
    fireEvent.blur(screen.getByRole('textbox'));

    expect(validate, 'Weft never calls a validation function').not.toHaveBeenCalled();
    expect(submit, 'Weft never submits').not.toHaveBeenCalled();
    expect(stateProbe).toEqual({ isSubmitted: false, submitCount: 0, errorCount: 0 });
  });
});
