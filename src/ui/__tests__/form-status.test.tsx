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
  it('a second FormStatus in one FormItem throws — the singleton is enforced, not described', () => {
    // Review round 4: two simultaneous statuses would render duplicate ids
    // and leave aria-busy to layout-effect order. The registry keys on the
    // instance and refuses a second live registration outright, the same way
    // useFormField refuses to run outside FormField.
    function Doubled() {
      const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
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
                <FormStatus pending>Checking source…</FormStatus>
                <FormStatus tone="ok">Also here.</FormStatus>
              </FormItem>
            )}
          />
        </Form>
      );
    }
    // React re-throws commit-phase errors through the console as well; keep
    // the test output clean without asserting on the noise.
    const quiet = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      expect(() => render(<Doubled />)).toThrow(/one status per FormItem/);
    } finally {
      quiet.mockRestore();
    }
  });

  it('a pending flip on the ONE status re-registers without tripping the singleton guard', () => {
    const { rerender } = render(<StatusField pending statusText="Checking source…" />);
    rerender(<StatusField tone="warn" statusText="Degraded." />);
    rerender(<StatusField pending statusText="Checking again…" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
    expect(document.querySelectorAll('[data-slot="form-status"]')).toHaveLength(1);
  });

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

describe('no id dangles — an id is listed only while its element is mounted (board probe)', () => {
  /**
   * The antagonistic board's hard finding: status-without-help left the
   * DESCRIPTION id dangling, because the FormControl rewrite taught
   * conditional inclusion for the status id and left the description id
   * unconditional beside it — and every fixture in the original matrix
   * mounted FormDescription, so "every listed id resolves" never saw the
   * hole. The class is bigger than the instance: the message id was
   * conditioned on ERROR STATE, not on a mounted FormMessage, so an error
   * presented outside the message slot dangled the same way. The rule now:
   * an id appears in the ONE ordered list only while its element is mounted
   * (and, for the message, carrying content).
   */
  it('status without help: the description id is ABSENT and nothing dangles', () => {
    // The board's probe, verbatim in shape.
    render(<StatusField pending statusText="Checking source…" withHelp={false} />);
    const ids = describedbyIds(screen.getByRole('textbox'));
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(/-form-item-status$/);
    const dangling = ids.filter((id) => !document.getElementById(id));
    expect(dangling, `dangling references: ${dangling.join(' ')}`).toHaveLength(0);
  });

  it('an error with no FormMessage mounted lists no message id — same class, other arm', () => {
    function ErrorNoMessage() {
      const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
      React.useEffect(() => {
        form.setError('source', { type: 'manual', message: 'Unable to reach source.' });
      }, [form]);
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
                {/* the consumer presents the error elsewhere — its call */}
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<ErrorNoMessage />);
    const control = screen.getByRole('textbox');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    const ids = describedbyIds(control);
    const dangling = ids.filter((id) => !document.getElementById(id));
    expect(dangling, `dangling references: ${dangling.join(' ')}`).toHaveLength(0);
    expect(ids.some((id) => /-form-item-message$/.test(id))).toBe(false);
  });

  it('a bare control with nothing mounted carries no aria-describedby at all', () => {
    function Bare() {
      const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
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
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<Bare />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-describedby');
  });

  it('the whole composition matrix resolves with zero dangling ids', () => {
    const cases: Array<[string, React.ReactElement]> = [
      ['help only', <StatusField key="a" />],
      ['status only', <StatusField key="b" tone="warn" statusText="Degraded." withHelp={false} />],
      ['error + status, no help', <StatusField key="c" withError tone="stop" statusText="Blocked." withHelp={false} />],
      ['all three', <StatusField key="d" withError tone="stop" statusText="Blocked." />],
    ];
    for (const [label, ui] of cases) {
      const { unmount } = render(ui);
      const ids = describedbyIds(screen.getByRole('textbox'));
      const dangling = ids.filter((id) => !document.getElementById(id));
      expect(dangling, `${label}: dangling references: ${dangling.join(' ')}`).toHaveLength(0);
      unmount();
    }
  });
});

describe('stated boundaries — pinned, not discovered (board soft findings)', () => {
  it('a consumer prop on FormControl wins over the wired ARIA — the Slot escape hatch, stated', () => {
    // Board soft finding 1: {...props} spreads after the wired attributes,
    // so a consumer's own aria-describedby or aria-busy REPLACES Weft's.
    // That is the shadcn Slot convention across this repo — consumer wins —
    // and this pin makes it a stated escape hatch rather than a surprise:
    // a consumer who overrides owns the whole contract (order, resolution,
    // busy pairing) for that control.
    function Overridden() {
      const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source path</FormLabel>
                <FormControl aria-describedby="consumer-own" aria-busy={false}>
                  <Input {...field} />
                </FormControl>
                <FormStatus pending>Checking source…</FormStatus>
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<Overridden />);
    const control = screen.getByRole('textbox');
    expect(control.getAttribute('aria-describedby')).toBe('consumer-own');
    expect(control.getAttribute('aria-busy')).toBe('false');
  });

  it('the React dot rides the same weft-pulse keyframes with no fill-mode of its own', () => {
    // Board soft finding 2: the rendered freeze measurement runs on the
    // plain-CSS ::before dot. The React dot is COVERED BY COMPOSITION: the
    // freeze rule is `*, *::before, *::after` with !important, which beats
    // an inline animation's duration and iteration count, and weft-pulse's
    // final keyframe is opacity 1 — so the frozen React dot lands at the
    // same static-visible state PROVIDED it names the same keyframes and
    // adds no fill-mode that could hold a different end state. Those two
    // facts are what this pins; the keyframe semantics under freeze are the
    // rendered measurement in input-pending.spec.ts.
    render(<StatusField pending statusText="Checking source…" />);
    const dot = document.querySelector('[data-status-dot]') as HTMLElement;
    const style = dot.getAttribute('style') ?? '';
    expect(style).toContain('weft-pulse');
    expect(style).not.toMatch(/forwards|backwards|both/);
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
    // The boundary widened with the dangling-id fix: EVERY reference is
    // element-tracked now, so server markup carries the elements themselves
    // (status, help) and NO aria-describedby at all — references and
    // aria-busy attach at hydration, symmetrically, which is what keeps
    // hydration mismatch-free. A server-side reader gets the visible text;
    // the programmatic association is a client fact.
    expect(markup).toContain('data-slot="form-description"');
    expect(markup, 'the hydration boundary: no references in server markup').not.toContain(
      'aria-describedby',
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
