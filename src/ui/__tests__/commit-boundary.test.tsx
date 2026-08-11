// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { useCommitBoundary, type CommitDetail } from '../use-commit-boundary';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';
import { Textarea } from '../textarea';

/**
 * P6 — the commit boundary (decision 7, decision 10, Document C's sequence
 * contracts).
 *
 * Weft standardises WHEN a field commits — blur, Enter, explicit save — and
 * nothing else. The helper never evaluates validity, never announces an error,
 * never writes the value, never touches submission state. The moment it does
 * any of those it is a form library competing with react-hook-form, so the
 * ownership line is asserted with spies rather than described in a comment.
 *
 * The unit is a TRANSACTION, not an event. Clicking Save from a focused field
 * fires blur and then the click; a per-event rule would emit two commits and a
 * consumer would validate twice. The consumer registers the explicit save
 * before focus moves (pointerdown), the helper suppresses the blur that
 * follows, and one commit reports `reason: "explicit-save"` with
 * `sources: ["blur", "explicit-save"]` so the evidence survives without a
 * second commit to carry it.
 *
 * Keyboard Save is deliberately different: focus leaves on Tab, the blur
 * transaction completes and commits, and the later save is a genuine second
 * transaction. Asserted as two rather than papered over as one.
 */

type Harness = {
  commits: CommitDetail[];
  onCommit: ReturnType<typeof vi.fn>;
};

function useHarness(): Harness & ReturnType<typeof useCommitBoundary> {
  const [commits] = React.useState<CommitDetail[]>([]);
  const onCommit = React.useMemo(
    () =>
      vi.fn((detail: CommitDetail) => {
        commits.push(detail);
      }),
    [commits],
  );
  const boundary = useCommitBoundary({ onCommit });
  return { commits, onCommit, ...boundary };
}

function SingleField(props: {
  harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null>;
  input?: React.ComponentProps<'input'>;
  fieldHandlers?: Partial<React.ComponentProps<'input'>>;
}) {
  const h = useHarness();
  props.harnessRef.current = h;
  return (
    <input
      aria-label="Specimen"
      {...h.getFieldProps({ ...(props.input ?? {}), ...(props.fieldHandlers ?? {}) })}
    />
  );
}

function renderField(
  input?: React.ComponentProps<'input'>,
  fieldHandlers?: Partial<React.ComponentProps<'input'>>,
) {
  const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
    { current: null };
  render(<SingleField harnessRef={harnessRef} input={input} fieldHandlers={fieldHandlers} />);
  const control = screen.getByLabelText('Specimen') as HTMLInputElement;
  const h = () => harnessRef.current!;
  return { control, h };
}

describe('typing is not a boundary', () => {
  it('emits no commit per keystroke, and one on blur', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: 'w' } });
    fireEvent.change(control, { target: { value: 'we' } });
    fireEvent.change(control, { target: { value: 'wef' } });
    expect(h().onCommit).not.toHaveBeenCalled();
    fireEvent.blur(control);
    expect(h().commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });

  it('emits no commit on paste', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.paste(control, { clipboardData: { getData: () => 'pasted' } });
    fireEvent.change(control, { target: { value: 'pasted' } });
    expect(h().onCommit).not.toHaveBeenCalled();
  });
});

describe('blur', () => {
  it('a plain blur with no pre-registered action emits immediately, once, as reason blur', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.blur(control);
    expect(
      h().commits,
      'one commit per blur — not zero (held back on speculation) and not two',
    ).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });

  it('still calls the consumer’s own onBlur', () => {
    const consumerBlur = vi.fn();
    const { control } = renderField(undefined, { onBlur: consumerBlur });
    fireEvent.focus(control);
    fireEvent.blur(control);
    expect(consumerBlur).toHaveBeenCalledTimes(1);
  });
});

describe('Enter', () => {
  it('emits exactly one commit in a single-line input, however much typing preceded it', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: '30' } });
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(h().commits).toEqual([{ reason: 'enter', sources: ['enter'] }]);
  });

  it('does not prevent the default, so a containing form still submits natively', () => {
    const seen: boolean[] = [];
    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form
        onSubmit={onSubmit}
        onKeyDown={(e) => {
          seen.push(e.defaultPrevented);
        }}
      >
        <SingleField harnessRef={harnessRef} />
      </form>,
    );
    const control = screen.getByLabelText('Specimen');
    fireEvent.focus(control);
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(seen, 'the helper must not call preventDefault on the Enter').toEqual([false]);
    // jsdom does not implement implicit submission, so the native step is
    // simulated; the claim under test is that the helper neither hooks nor
    // prevents it, and that the submit adds no second commit.
    fireEvent.submit(control.closest('form')!);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(harnessRef.current!.commits).toEqual([{ reason: 'enter', sources: ['enter'] }]);
  });

  it('a consumer calling commit() from onSubmit after an Enter pays with a second commit — the documented misuse', () => {
    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    render(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          harnessRef.current!.commit('explicit-save');
        }}
      >
        <SingleField harnessRef={harnessRef} />
      </form>,
    );
    const control = screen.getByLabelText('Specimen');
    fireEvent.focus(control);
    fireEvent.keyDown(control, { key: 'Enter' });
    fireEvent.submit(control.closest('form')!);
    // Two commits for one user action. The helper does not absorb this,
    // deliberately: hiding the cost would make the misuse invisible.
    expect(harnessRef.current!.commits.map((c) => c.reason)).toEqual(['enter', 'explicit-save']);
  });
});

describe('Enter in a textarea is a newline, never a boundary', () => {
  function TextareaField(props: {
    harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null>;
  }) {
    const h = useHarness();
    props.harnessRef.current = h;
    return <Textarea aria-label="Notes" {...h.getFieldProps()} />;
  }

  it('emits nothing on Enter and still commits on blur', () => {
    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    render(<TextareaField harnessRef={harnessRef} />);
    const control = screen.getByLabelText('Notes');
    fireEvent.focus(control);
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(harnessRef.current!.onCommit).not.toHaveBeenCalled();
    fireEvent.blur(control);
    expect(harnessRef.current!.commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });
});

describe('Escape', () => {
  it('emits no commit and writes nothing — the value stays exactly as typed', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: 'half-typed' } });
    fireEvent.keyDown(control, { key: 'Escape' });
    expect(h().onCommit).not.toHaveBeenCalled();
    expect(
      control.value,
      'Escape must not revert: a revert on the user’s work is a silent revert by another name',
    ).toBe('half-typed');
  });
});

describe('input-method composition', () => {
  it('the Enter that ends a composition does not commit; the next real Enter does', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.compositionStart(control);
    fireEvent.change(control, { target: { value: 'かん' } });
    // The confirming Enter arrives as a keydown flagged as part of the
    // composition (isComposing / keyCode 229, per browser).
    fireEvent.keyDown(control, { key: 'Enter', isComposing: true });
    fireEvent.compositionEnd(control);
    expect(h().onCommit, 'a keydown inside composition is candidate selection, not a boundary').not.toHaveBeenCalled();
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(h().commits).toEqual([{ reason: 'enter', sources: ['enter'] }]);
  });

  it('keyCode 229 alone marks the keydown as composition', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.compositionStart(control);
    fireEvent.keyDown(control, { key: 'Enter', keyCode: 229 });
    fireEvent.compositionEnd(control);
    expect(h().onCommit).not.toHaveBeenCalled();
  });

  it('a blur after composition ends commits normally', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    fireEvent.compositionStart(control);
    fireEvent.change(control, { target: { value: '漢字' } });
    fireEvent.compositionEnd(control);
    fireEvent.blur(control);
    expect(h().commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });
});

describe('the explicit-save transaction', () => {
  it('pointer Save: registration before focus moves suppresses the blur — one commit, reason explicit-save, sources [blur, explicit-save]', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    // The Save control's pointerdown fires before the field's blur.
    h().registerExplicitSave();
    fireEvent.blur(control);
    expect(h().onCommit, 'the registered blur must be suppressed, not emitted').not.toHaveBeenCalled();
    h().commit('explicit-save');
    expect(h().commits).toEqual([
      { reason: 'explicit-save', sources: ['blur', 'explicit-save'] },
    ]);
  });

  it('keyboard Save: blur commits first and the save is a second transaction — two commits, not one', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    // Tab moves focus before any activation can register.
    fireEvent.blur(control);
    h().commit('explicit-save');
    expect(
      h().commits,
      'inherent to the event order: there is nothing left to suppress once the blur committed',
    ).toEqual([
      { reason: 'blur', sources: ['blur'] },
      { reason: 'explicit-save', sources: ['explicit-save'] },
    ]);
  });

  it('commit() with no suppressed blur reports only itself', () => {
    const { h } = renderField();
    h().commit('explicit-save');
    expect(h().commits).toEqual([{ reason: 'explicit-save', sources: ['explicit-save'] }]);
  });

  it('an Enter commit ends the transaction: a pre-registered save does not survive to suppress the next blur', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    h().registerExplicitSave(); // a save shortcut armed while focus stayed put…
    fireEvent.keyDown(control, { key: 'Enter' }); // …but Enter commits first
    expect(h().commits).toEqual([{ reason: 'enter', sources: ['enter'] }]);
    fireEvent.blur(control);
    expect(
      h().commits[1],
      'the stale registration must not suppress a boundary in the NEXT transaction',
    ).toEqual({ reason: 'blur', sources: ['blur'] });
  });

  it('a canceled pointer Save replays the suppressed blur — the boundary is never swallowed', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    h().registerExplicitSave();
    fireEvent.blur(control); // suppressed for the save…
    expect(h().onCommit).not.toHaveBeenCalled();
    h().cancelExplicitSave(); // …which will not complete (drag-off, pointercancel)
    expect(
      h().commits,
      'the user DID leave the field; only the save fell through',
    ).toEqual([{ reason: 'blur', sources: ['blur'] }]);
    // Nothing stale: a later save is its own clean transaction.
    h().commit('explicit-save');
    expect(h().commits[1]).toEqual({ reason: 'explicit-save', sources: ['explicit-save'] });
  });

  it('cancel with nothing suppressed only clears the registration', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    h().registerExplicitSave();
    h().cancelExplicitSave();
    expect(h().onCommit).not.toHaveBeenCalled();
    fireEvent.blur(control);
    expect(h().commits, 'the canceled registration must not suppress this blur').toEqual([
      { reason: 'blur', sources: ['blur'] },
    ]);
  });

  it('drag off Save and back: replayed blur then explicit save — two transactions, the keyboard-Save shape', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    h().registerExplicitSave();
    fireEvent.blur(control);
    h().cancelExplicitSave(); // pointerleave on the way off
    h().commit('explicit-save'); // released back on the control after all
    expect(h().commits.map((c) => c.reason)).toEqual(['blur', 'explicit-save']);
  });

  it('an abandoned registration is cleared when focus returns — no stale suppression, no phantom sources', () => {
    const { control, h } = renderField();
    fireEvent.focus(control);
    h().registerExplicitSave();
    fireEvent.blur(control); // suppressed
    fireEvent.focus(control); // the user came back; the transaction is abandoned
    fireEvent.blur(control);
    expect(h().commits, 'the second blur is an ordinary transaction').toEqual([
      { reason: 'blur', sources: ['blur'] },
    ]);
  });
});

describe('programmatic changes and reset', () => {
  it('a programmatically set value emits nothing', () => {
    const { control, h } = renderField();
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )!.set!;
    nativeSetter.call(control, 'from-code');
    control.dispatchEvent(new Event('input', { bubbles: true }));
    expect(h().onCommit).not.toHaveBeenCalled();
  });

  it('a native form.reset() emits nothing and leaves no helper state behind', () => {
    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    render(
      <form>
        <SingleField harnessRef={harnessRef} input={{ defaultValue: '30' }} />
      </form>,
    );
    const control = screen.getByLabelText('Specimen') as HTMLInputElement;
    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: '0' } });
    control.closest('form')!.reset();
    expect(control.value).toBe('30');
    expect(harnessRef.current!.onCommit, 'reset is not a boundary').not.toHaveBeenCalled();
    // Nothing left behind: the next transaction is ordinary.
    fireEvent.focus(control);
    fireEvent.blur(control);
    expect(harnessRef.current!.commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
  });
});

describe('controlled and uncontrolled fields', () => {
  it('controlled: every boundary works and the helper never writes — onChange fires only for typing', () => {
    const changes: string[] = [];
    function Controlled(props: {
      harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null>;
    }) {
      const h = useHarness();
      props.harnessRef.current = h;
      const [value, setValue] = React.useState('a');
      return (
        <input
          aria-label="Specimen"
          {...h.getFieldProps({
            value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              changes.push(e.target.value);
              setValue(e.target.value);
            },
          })}
        />
      );
    }
    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    render(<Controlled harnessRef={harnessRef} />);
    const control = screen.getByLabelText('Specimen') as HTMLInputElement;
    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: 'ab' } });
    fireEvent.keyDown(control, { key: 'Enter' });
    fireEvent.blur(control);
    harnessRef.current!.commit('explicit-save');
    expect(harnessRef.current!.commits.map((c) => c.reason)).toEqual([
      'enter',
      'blur',
      'explicit-save',
    ]);
    expect(changes, 'the helper never writes the value').toEqual(['ab']);
    expect(control.value).toBe('ab');
  });

  it('uncontrolled: every boundary works and the value stays what the user typed', () => {
    const { control, h } = renderField({ defaultValue: 'a' });
    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: 'ab' } });
    fireEvent.keyDown(control, { key: 'Enter' });
    fireEvent.blur(control);
    h().commit('explicit-save');
    expect(h().commits.map((c) => c.reason)).toEqual(['enter', 'blur', 'explicit-save']);
    expect(control.value).toBe('ab');
  });
});

describe('GUARD — the ownership line, asserted with spies', () => {
  /**
   * The helper says WHEN a field committed and nothing else. The consumer
   * holds the value, the rule, the error state, and the submission. These
   * spies are the consumer's own callbacks: if any of them fires from a
   * boundary the helper crossed the line, and this is the case that stops it
   * drifting into a form library.
   */
  it('never calls validation and never mutates submission state, across every boundary', () => {
    const validate = vi.fn(() => true);
    const submit = vi.fn((e: React.FormEvent) => e.preventDefault());
    let stateProbe: { isSubmitted: boolean; submitCount: number; errorCount: number } | null = null;

    function Consumer(props: {
      harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null>;
    }) {
      const h = useHarness();
      props.harnessRef.current = h;
      const form = useForm<{ retention: string }>({ defaultValues: { retention: '30' } });
      stateProbe = {
        isSubmitted: form.formState.isSubmitted,
        submitCount: form.formState.submitCount,
        errorCount: Object.keys(form.formState.errors).length,
      };
      return (
        <form onSubmit={submit}>
          <input
            aria-label="Specimen"
            {...h.getFieldProps(form.register('retention', { validate }))}
          />
        </form>
      );
    }

    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    render(<Consumer harnessRef={harnessRef} />);
    const control = screen.getByLabelText('Specimen') as HTMLInputElement;

    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: '60' } });
    fireEvent.keyDown(control, { key: 'Enter' });
    fireEvent.blur(control);
    harnessRef.current!.registerExplicitSave();
    harnessRef.current!.commit('explicit-save');

    expect(harnessRef.current!.commits.length).toBeGreaterThanOrEqual(3);
    expect(validate, 'Weft never calls a validation function').not.toHaveBeenCalled();
    expect(submit, 'Weft never submits').not.toHaveBeenCalled();
    expect(stateProbe).toEqual({ isSubmitted: false, submitCount: 0, errorCount: 0 });
  });
});

describe('react-hook-form integration', () => {
  function RhfField(props: {
    harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null>;
    probe: { getValues: (() => Record<string, unknown>) | null };
  }) {
    const h = useHarness();
    props.harnessRef.current = h;
    const form = useForm<{ retention: string }>({ defaultValues: { retention: '30' } });
    props.probe.getValues = () => form.getValues();
    return (
      <Form {...form}>
        <FormField
          control={form.control}
          name="retention"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retention window</FormLabel>
              <FormControl>
                <Input {...h.getFieldProps(field)} />
              </FormControl>
              <FormDescription>Whole days, 1 or more.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    );
  }

  it('a field wired to react-hook-form receives exactly one commit per boundary, and RHF keeps its own state', () => {
    const harnessRef: React.MutableRefObject<(Harness & ReturnType<typeof useCommitBoundary>) | null> =
      { current: null };
    const probe: { getValues: (() => Record<string, unknown>) | null } = { getValues: null };
    render(<RhfField harnessRef={harnessRef} probe={probe} />);
    const control = screen.getByRole('textbox');

    fireEvent.focus(control);
    fireEvent.change(control, { target: { value: '90' } });
    expect(probe.getValues!()).toEqual({ retention: '90' });

    fireEvent.blur(control);
    expect(harnessRef.current!.commits).toEqual([{ reason: 'blur', sources: ['blur'] }]);
    expect(probe.getValues!(), 'the value RHF holds is the one RHF wrote').toEqual({
      retention: '90',
    });

    fireEvent.focus(control);
    fireEvent.keyDown(control, { key: 'Enter' });
    expect(harnessRef.current!.commits).toHaveLength(2);
  });
});

describe('the presentation route is unchanged', () => {
  /**
   * Once the consumer supplies an error, the P2/A5 description wiring exposes
   * it — error id first, exactly once — and removing it removes it. The helper
   * plays no part in this; the case is here to prove wiring the helper onto a
   * field changes nothing about how a supplied error presents.
   */
  function Presented(props: { withError: boolean }) {
    const boundary = useCommitBoundary({ onCommit: () => {} });
    const form = useForm<{ retention: string }>({ defaultValues: { retention: '0' } });
    React.useEffect(() => {
      if (props.withError) {
        form.setError('retention', { type: 'manual', message: 'Zero is not a window.' });
      } else {
        form.clearErrors('retention');
      }
    }, [form, props.withError]);
    return (
      <Form {...form}>
        <FormField
          control={form.control}
          name="retention"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Retention window</FormLabel>
              <FormControl>
                <Input {...boundary.getFieldProps(field)} />
              </FormControl>
              <FormDescription>Whole days, 1 or more.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>
    );
  }

  it('a consumer-supplied error is exposed exactly once, error id first, with the helper wired', () => {
    render(<Presented withError />);
    const control = screen.getByRole('textbox');
    const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids).toHaveLength(2);
    expect(ids[0]).toMatch(/-form-item-message$/);
    expect(new Set(ids).size).toBe(ids.length);
    expect(control).toHaveAttribute('aria-invalid', 'true');
  });

  it('removing the error removes it from the description', () => {
    const { rerender } = render(<Presented withError />);
    rerender(<Presented withError={false} />);
    const control = screen.getByRole('textbox');
    const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(/-form-item-description$/);
  });
});
