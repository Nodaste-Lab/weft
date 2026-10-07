import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormStatus } from '../../ui/form';
import { Input } from '../../ui/input';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

type FormSpecimenProps = React.ComponentProps<typeof FormStatus> & {
  /** Rendered through FormMessage below the control. */
  message?: string;
  /** Leave the status slot out altogether. */
  withoutStatus?: boolean;
};

const useFixtureLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/** One field wired to react-hook-form, with the status slot driven by props. */
export function FormSpecimen({ message, withoutStatus, ...status }: FormSpecimenProps) {
  const form = useForm<{ handle: string }>({ defaultValues: { handle: 'northstar' } });
  useFixtureLayoutEffect(() => { if (message) form.setError('handle', {message}); else form.clearErrors('handle'); }, [message, form]);
  return (
    <Form {...form}>
      <form className="space-y-3" style={{ width: 260 }} onSubmit={(e) => e.preventDefault()}>
        <FormField
          control={form.control}
          name="handle"
          render={({ field, fieldState }) => (
            <FormItem className="weft-text-field" data-treatment="cutout" data-invalid={!!fieldState.error || undefined}>
              <div className="weft-text-field-group"><div className="weft-text-field-control">
                <FormControl><Input placeholder=" " {...field} /></FormControl>
                <FormLabel>Player handle</FormLabel>
              </div></div>
              <FormMessage/>
              {withoutStatus ? null : <FormStatus {...status} />}
              <FormDescription>Shown in session headers.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" size="sm">Save</Button>
      </form>
    </Form>
  );
}

/** Specimens for the forms category. One entry per component id; see ../specimen-types.ts. */
export const formsSpecimens: Record<string, Specimen> = {
  form: {
    component: 'FormStatus',
    module: 'form',
    base: { children: 'This example check passed.' },
    axisBase: { tone: { children: 'This example check passed.' } },
    states: [
      { label: 'Field only', props: { withoutStatus: true }, code: '<FormSpecimen withoutStatus />', note: 'The description is wired to the control through aria-describedby.' },
      { label: 'Pending', props: { pending: true, children: 'Checking the handle…' }, code: '<FormStatus pending>Checking the handle…</FormStatus>', note: 'The pulsing dot is the non-colour signal; the control reads aria-busy while it shows.' },
      { label: 'Settled', props: { tone: 'ok', children: 'This example check passed.' }, code: '<FormStatus tone="ok">This example check passed.</FormStatus>', note: 'The words carry the meaning; the tone only reinforces them.' },
      { label: 'With message', props: { withoutStatus: true, message: 'Choose a handle to continue.' }, code: '<FormSpecimen withoutStatus message="Choose a handle to continue." />', note: 'A validation error from the resolver renders the same way, led by the alert glyph.' },
    ],
    render: (p: P) => <FormSpecimen {...(p as FormSpecimenProps)} />,
  },
};
