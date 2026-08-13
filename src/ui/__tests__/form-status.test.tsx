// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { flushSync } from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import { renderToString } from 'react-dom/server';
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

describe('exposure commits before paint — layout effects, not passive (review round 1)', () => {
  /**
   * A passive-effect registration commits the DOM one paint early: a pending
   * field paints a frame without aria-busy or the describedby reference, and
   * a settled field paints a frame still busy. flushSync is the instrument
   * that can tell the two apart — layout effects (and the re-renders they
   * schedule) flush inside the synchronous commit; passive effects run after
   * it. These assertions read the DOM the instant flushSync returns, so they
   * FAIL if the registration rides useEffect. Rendered outside RTL's act on
   * purpose — act would flush passive effects and hide the difference.
   */
  function renderSync(ui: React.ReactElement) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOMClient.createRoot(container);
    flushSync(() => root.render(ui));
    return {
      container,
      update: (next: React.ReactElement) => flushSync(() => root.render(next)),
      cleanup: () => {
        root.unmount();
        container.remove();
      },
    };
  }

  function withoutActEnvironment(run: () => void) {
    const g = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
    const prev = g.IS_REACT_ACT_ENVIRONMENT;
    g.IS_REACT_ACT_ENVIRONMENT = false;
    try {
      run();
    } finally {
      g.IS_REACT_ACT_ENVIRONMENT = prev;
    }
  }

  it('the first synchronous commit already references the status and reads busy', () => {
    withoutActEnvironment(() => {
      const r = renderSync(<StatusField pending statusText="Checking source…" />);
      const control = r.container.querySelector('input')!;
      expect(
        control.getAttribute('aria-busy'),
        'a pending field must never paint a frame that is not busy',
      ).toBe('true');
      expect(control.getAttribute('aria-describedby') ?? '').toMatch(/-form-item-status/);
      r.cleanup();
    });
  });

  it('pending → settled clears busy inside the same synchronous commit', () => {
    withoutActEnvironment(() => {
      const r = renderSync(<StatusField pending statusText="Checking source…" />);
      r.update(<StatusField tone="ok" statusText="Source is reachable." />);
      const control = r.container.querySelector('input')!;
      expect(
        control.getAttribute('aria-busy'),
        'a settled field must never paint a frame still busy',
      ).toBeNull();
      r.cleanup();
    });
  });

  it('status removal takes its id out of the list inside the same synchronous commit', () => {
    withoutActEnvironment(() => {
      const r = renderSync(<StatusField pending statusText="Checking source…" />);
      r.update(<StatusField />);
      const control = r.container.querySelector('input')!;
      expect(control.getAttribute('aria-describedby') ?? '').not.toMatch(/-form-item-status/);
      expect(control.getAttribute('aria-busy')).toBeNull();
      r.cleanup();
    });
  });
});

describe('the server boundary is stated, not discovered', () => {
  it('SSR markup renders the status element; the reference attaches at hydration', () => {
    // There is no paint and no layout effect on the server. The honest
    // contract: the status ELEMENT ships in the markup with its id, and the
    // control's describedby/aria-busy attach at hydration. This test PINS
    // that boundary so a change to it is a decision, not a drift.
    const markup = renderToString(<StatusField pending statusText="Checking source…" />);
    expect(markup).toContain('data-slot="form-status"');
    expect(markup).toMatch(/id="[^"]*-form-item-status"/);
    const describedby = markup.match(/aria-describedby="([^"]*)"/)?.[1] ?? '';
    expect(describedby, 'the hydration boundary: no status reference in server markup').not.toMatch(
      /-form-item-status/,
    );
    expect(markup).not.toContain('aria-busy="true"');
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
