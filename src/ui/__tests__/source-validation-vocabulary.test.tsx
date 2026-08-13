// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
 * The transition suite against the only asynchronous consumer that exists.
 *
 * Heddle's `sourceValidationService.ts` ships seven statuses —
 * validating | reachable | unreachable | degraded | blocked |
 * unsupported-in-browser | unknown — and its own tone mapping
 * (`severityForStatus`: ok | info | warning | danger). `degraded` is a
 * warning-toned result that is neither success nor failure; `readable` stays
 * true under it. A pending/success/error boolean cannot express that, which is
 * why the contract takes a supplied tone, not a verdict.
 *
 * This fixture is the CONSUMER's side of the contract, written the way Heddle
 * would write it: the mapping from its vocabulary onto {pending | tone, text}
 * belongs to the consumer, exactly as validation itself does (decision 7).
 * Weft's part is presenting whatever is supplied — these tests drive the
 * presentation through the transitions the real service produces and assert
 * the exposed state at each step. Exposure, never announcement.
 */

type SourceValidationStatus =
  | 'validating'
  | 'reachable'
  | 'unreachable'
  | 'degraded'
  | 'blocked'
  | 'unsupported-in-browser'
  | 'unknown';

type Tone = 'ok' | 'info' | 'warn' | 'stop';

/**
 * The consumer's mapping. Failure statuses route to the consumer's OWN error
 * machinery (react-hook-form + FormMessage, A5) — supplying them as a
 * stop-toned status instead is equally legal; this fixture exercises both
 * arms the way SessionContextPanel's severity split suggests Heddle will.
 */
const PRESENTATION: Record<
  SourceValidationStatus,
  { pending?: true; tone?: Tone; error?: true; text: string }
> = {
  validating: { pending: true, text: 'Checking source…' },
  reachable: { tone: 'ok', text: 'Source is reachable.' },
  degraded: { tone: 'warn', text: 'Degraded — local content stays readable.' },
  'unsupported-in-browser': {
    tone: 'warn',
    text: 'Desktop Heddle is required to validate local paths.',
  },
  unknown: { tone: 'info', text: 'Not yet validated.' },
  unreachable: { error: true, text: 'Unable to reach source.' },
  blocked: { error: true, text: 'Blocked until local content is readable.' },
};

const validateSpy = vi.fn(() => true);

function SourceField({ status }: { status: SourceValidationStatus }) {
  const form = useForm<{ source: string }>({ defaultValues: { source: 'vault' } });
  const p = PRESENTATION[status];
  React.useEffect(() => {
    // The consumer's call, through the consumer's own API. Weft evaluates
    // nothing; it is handed either an error or a status, never a question.
    if (p.error) {
      form.setError('source', { type: 'manual', message: p.text });
    } else {
      form.clearErrors('source');
    }
  }, [form, p]);
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="source"
        rules={{ validate: validateSpy }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source path</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            {!p.error ? (
              <FormStatus pending={p.pending} tone={p.tone}>
                {p.text}
              </FormStatus>
            ) : null}
            <FormDescription>Must be reachable over HTTPS.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

function exposed(control: HTMLElement) {
  const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
  const resolving = ids.filter((id) => document.getElementById(id));
  return {
    ids,
    resolvingText: resolving.map((id) => document.getElementById(id)!.textContent ?? ''),
    busy: control.getAttribute('aria-busy'),
    invalid: control.getAttribute('aria-invalid'),
  };
}

describe('the seven-state vocabulary, presented', () => {
  it('validating: pending exposure — busy control, status resolving, not invalid', () => {
    render(<SourceField status="validating" />);
    const state = exposed(screen.getByRole('textbox'));
    expect(state.busy).toBe('true');
    expect(state.invalid).toBe('false');
    expect(state.resolvingText.some((t) => t.includes('Checking source…'))).toBe(true);
  });

  it('degraded: a warning-toned RESULT — not invalid, not busy, not success (status-not-boolean)', () => {
    render(<SourceField status="degraded" />);
    const control = screen.getByRole('textbox');
    const state = exposed(control);
    expect(state.invalid, 'degraded is not a failure; the field is not invalid').toBe('false');
    expect(state.busy, 'degraded is settled; nothing is pending').toBeNull();
    const status = document.querySelector('[data-slot="form-status"]')!;
    expect(status.getAttribute('data-tone'), 'and it is not success either').toBe('warn');
    expect(state.resolvingText.some((t) => t.includes('local content stays readable'))).toBe(true);
  });

  it('unsupported-in-browser and unknown present as settled advisory tones', () => {
    for (const [status, tone] of [
      ['unsupported-in-browser', 'warn'],
      ['unknown', 'info'],
    ] as const) {
      const { unmount } = render(<SourceField status={status} />);
      const el = document.querySelector('[data-slot="form-status"]')!;
      expect(el.getAttribute('data-tone')).toBe(tone);
      expect(screen.getByRole('textbox').getAttribute('aria-busy')).toBeNull();
      unmount();
    }
  });
});

describe('the transitions the real service produces', () => {
  it('validating → reachable: pending resolves to ok; busy leaves; the id is stable', () => {
    const { rerender } = render(<SourceField status="validating" />);
    const beforeId = document.querySelector('[data-slot="form-status"]')!.id;
    rerender(<SourceField status="reachable" />);
    const control = screen.getByRole('textbox');
    const status = document.querySelector('[data-slot="form-status"]')!;
    expect(status.id).toBe(beforeId);
    expect(status.getAttribute('data-tone')).toBe('ok');
    expect(status.textContent).toContain('Source is reachable.');
    expect(control.getAttribute('aria-busy')).toBeNull();
  });

  it('validating → degraded: pending resolves to a warning that is neither success nor failure', () => {
    const { rerender } = render(<SourceField status="validating" />);
    rerender(<SourceField status="degraded" />);
    const control = screen.getByRole('textbox');
    expect(control).toHaveAttribute('aria-invalid', 'false');
    expect(control.getAttribute('aria-busy')).toBeNull();
    expect(document.querySelector('[data-slot="form-status"]')!.getAttribute('data-tone')).toBe(
      'warn',
    );
  });

  it('validating → unreachable: the consumer routes to error machinery; A5 order holds; status yields', () => {
    const { rerender } = render(<SourceField status="validating" />);
    rerender(<SourceField status="unreachable" />);
    const control = screen.getByRole('textbox');
    const state = exposed(control);
    expect(state.invalid).toBe('true');
    expect(state.busy, 'settled, even though it settled badly').toBeNull();
    // Error first (A5), and no status id in the list — the consumer removed
    // the status when it chose the error arm.
    const resolving = state.ids.filter((id) => document.getElementById(id));
    expect(resolving[0]).toMatch(/-form-item-message$/);
    expect(state.ids.some((id) => /-form-item-status$/.test(id))).toBe(false);
    expect(state.resolvingText[0]).toContain('Unable to reach source.');
  });

  it('reachable → validating: revalidation returns to pending exposure', () => {
    const { rerender } = render(<SourceField status="reachable" />);
    rerender(<SourceField status="validating" />);
    const control = screen.getByRole('textbox');
    expect(control.getAttribute('aria-busy')).toBe('true');
    const status = document.querySelector('[data-slot="form-status"]')!;
    expect(status.textContent).toContain('Checking source…');
    expect(status.querySelector('[data-status-dot]')).toBeTruthy();
  });

  it('blocked → validating → reachable: recovery leaves nothing stale behind', () => {
    const { rerender } = render(<SourceField status="blocked" />);
    rerender(<SourceField status="validating" />);
    rerender(<SourceField status="reachable" />);
    const control = screen.getByRole('textbox');
    const state = exposed(control);
    expect(state.invalid).toBe('false');
    expect(state.busy).toBeNull();
    expect(state.resolvingText.some((t) => t.includes('Blocked'))).toBe(false);
    expect(state.resolvingText.some((t) => t.includes('Source is reachable.'))).toBe(true);
  });
});

describe('GUARD — the whole vocabulary crosses no ownership line', () => {
  it('driving every status and transition calls no validation', () => {
    const statuses = Object.keys(PRESENTATION) as SourceValidationStatus[];
    const { rerender } = render(<SourceField status="unknown" />);
    for (const status of statuses) {
      rerender(<SourceField status={status} />);
    }
    expect(validateSpy, 'Weft presented seven states and evaluated none of them').not.toHaveBeenCalled();
  });
});
