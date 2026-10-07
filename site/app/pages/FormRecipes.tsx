import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '../../../src/ui/form';
import { TextField } from '../../../src/ui/text-field';
import { Button } from '../../../src/ui/button';

type ProjectValues = { name: string; description: string };

/** Local fixture: replace the delayed result with the application's save API. */
export function ProjectFormExample({ failSave = false }: { failSave?: boolean }) {
  const form = useForm<ProjectValues>({
    defaultValues: { name: '', description: '' },
    mode: 'onTouched', reValidateMode: 'onChange',
  });
  const [feedback, setFeedback] = React.useState('');
  const submitting = form.formState.isSubmitting;
  const requestInFlight = React.useRef(false);
  const submit = form.handleSubmit(async values => {
    setFeedback('Saving…');
    await new Promise(resolve => setTimeout(resolve, 400));
    if (failSave) {
      setFeedback('Not saved. Your entries are still here. Try saving again.');
      return;
    }
    const current = form.getValues();
    setFeedback(current.name === values.name && current.description === values.description
      ? 'Saved in this local example.'
      : 'The earlier version was saved. Your latest edits still need saving.');
  }, () => setFeedback('Correct the highlighted field, then save again.'));
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    try { await submit(event); } finally { requestInFlight.current = false; }
  };
  return <Form {...form}>
    <form noValidate aria-label={failSave ? 'Save failure example' : 'Project example'} aria-busy={submitting || undefined} onSubmit={save} style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      <FormField control={form.control} name="name" rules={{ validate: value => !!value.trim() || 'Enter a project name.' }} render={({ field, fieldState }) =>
        <TextField {...field} label="Project name (required)" required error={fieldState.error?.message} onChange={event => { field.onChange(event); setFeedback(''); }} />
      }/>
      <FormField control={form.control} name="description" render={({ field, fieldState }) =>
        <TextField {...field} label="Description" multiline rows={3} description="Include the context people need to understand this project." error={fieldState.error?.message} onChange={event => { field.onChange(event); setFeedback(''); }} />
      }/>
      <Button className="weft-btn" type="submit" disabled={submitting} style={{ justifySelf: 'start' }}>{submitting ? 'Saving…' : 'Save project'}</Button>
    </form>
    <p role="status" style={{ minHeight: 24 }}>{feedback}</p>
  </Form>;
}
