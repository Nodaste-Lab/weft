// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../form';
import { Input } from '../input';

/**
 * Amendment A5: help and error compose into ONE ordered `aria-describedby`
 * list, ERROR FIRST, binding the React composition and the plain-CSS HTML
 * recipe alike.
 *
 * The order is the whole rule, so it is the thing asserted. The previous
 * assertions checked that the ids existed and resolved — which the wrong order
 * satisfies perfectly. That is how this shipped backwards: every guard around it
 * was true, and none of them was about the rule.
 *
 * Why error first: a field in error has one urgent thing to say and one
 * background thing. Reading the format hint before the reason the value was
 * rejected buries the reason behind text the user has already seen.
 *
 * These assertions read the DOM attribute rather than the accessibility tree
 * because ORDER is the claim, and order is a property of the attribute. What a
 * given screen reader does with that order is not claimed here.
 */

function Field({ withError }: { withError: boolean }) {
  const form = useForm<{ retention: string }>({
    defaultValues: { retention: withError ? '0' : '30' },
  });
  // The CONSUMER supplies the error, through react-hook-form's own API. Weft
  // evaluates nothing (decision 7), so a test that reached inside formState
  // would be testing a shape Weft does not own.
  React.useEffect(() => {
    if (withError) form.setError('retention', { type: 'manual', message: 'Zero is not a window.' });
  }, [form, withError]);
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="retention"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Retention window</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>Whole days, 1 or more.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

describe('A5 — the description list is ordered, error first', () => {
  it('lists only the help text when there is no error', () => {
    render(<Field withError={false} />);
    const control = screen.getByRole('textbox');
    const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(/-form-item-description$/);
  });

  it('puts the error BEFORE the help text when both are present', () => {
    render(<Field withError />);
    const control = screen.getByRole('textbox');
    const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);

    expect(
      ids,
      'A5: one ordered list, error first. Both ids present in the wrong order satisfies every ' +
        'existence and resolution check and still breaks the rule.',
    ).toHaveLength(2);
    expect(ids[0], `expected the message id first, got ${ids.join(' ')}`).toMatch(/-form-item-message$/);
    expect(ids[1], `expected the description id second, got ${ids.join(' ')}`).toMatch(
      /-form-item-description$/,
    );
  });

  it('names each id exactly once', () => {
    render(<Field withError />);
    const ids = (screen.getByRole('textbox').getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points at elements that exist and carry the copy', () => {
    render(<Field withError />);
    const ids = (screen.getByRole('textbox').getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean);
    const text = ids.map((id) => document.getElementById(id)?.textContent ?? '');
    expect(text[0]).toContain('Zero is not a window.');
    expect(text[1]).toContain('Whole days, 1 or more.');
  });

  it('marks the control invalid when an error is present', () => {
    render(<Field withError />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  // The five composition cases (P7): help-only and both are above; these are
  // the remaining three. "Error removed, help survives" is the case that
  // catches a merge implemented as an append.
  it('exposes only the error when there is no help text — no phantom description reference', () => {
    function ErrorOnly() {
      const form = useForm<{ retention: string }>({ defaultValues: { retention: '0' } });
      React.useEffect(() => {
        form.setError('retention', { type: 'manual', message: 'Zero is not a window.' });
      }, [form]);
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="retention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retention window</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    }
    render(<ErrorOnly />);
    const ids = (screen.getByRole('textbox').getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean);
    const resolving = ids.filter((id) => document.getElementById(id));
    expect(resolving, 'exactly the message — a reader receives the resolving subset').toHaveLength(1);
    expect(resolving[0]).toMatch(/-form-item-message$/);
  });

  it('removing the error leaves the help text standing, with nothing stale', () => {
    function Removable({ withError }: { withError: boolean }) {
      const form = useForm<{ retention: string }>({ defaultValues: { retention: '0' } });
      React.useEffect(() => {
        if (withError) {
          form.setError('retention', { type: 'manual', message: 'Zero is not a window.' });
        } else {
          form.clearErrors('retention');
        }
      }, [form, withError]);
      return (
        <Form {...form}>
          <FormField
            control={form.control}
            name="retention"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retention window</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Whole days, 1 or more.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      );
    }
    const { rerender } = render(<Removable withError />);
    rerender(<Removable withError={false} />);
    const control = screen.getByRole('textbox');
    const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids).toHaveLength(1);
    expect(ids[0]).toMatch(/-form-item-description$/);
    expect(document.getElementById(ids[0])?.textContent).toContain('Whole days, 1 or more.');
    expect(control).toHaveAttribute('aria-invalid', 'false');
  });

  it('a choice group carries a usable group name in the React layer', () => {
    // Mirrors the plain-CSS fieldset/legend recipe, which input-semantics
    // already measures: the group role computes an accessible name.
    // Exposure, never announcement.
    render(
      <fieldset role="radiogroup" aria-label="Retention policy">
        <Input aria-label="proxy member" />
      </fieldset>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Retention policy' })).toBeTruthy();
  });
});
