import * as React from 'react';
import { useForm, type Control, type FieldErrors } from 'react-hook-form';
import { Input } from '../../../src/ui/input';
import { Textarea } from '../../../src/ui/textarea';
import { Button } from '../../../src/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormStatus } from '../../../src/ui/form';

type Values = { workspace: string; email: string; handle: string; password: string; website: string; telephone: string; limit: string; notes: string; confirmation: string };
const initial: Values = { workspace: '', email: '', handle: '', password: '', website: '', telephone: '', limit: '', notes: '', confirmation: '' };
const labels: Record<keyof Values, string> = { workspace: 'Workspace name', email: 'Invitation email', handle: 'Workspace address', password: 'Example password', website: 'Website (optional)', telephone: 'Telephone (optional)', limit: 'Export limit (optional)', notes: 'Invitation message (optional)', confirmation: 'Confirm workspace name' };
type ExampleFieldProps = { control: Control<Values>; name: keyof Values; helper?: string; rules?: React.ComponentProps<typeof FormField<Values>>['rules']; inputProps?: React.ComponentProps<typeof Input>; after?: React.ReactNode; multiline?: boolean; prefix?: string; suffix?: string };
function ExampleField({ control, name, helper, rules, inputProps, after, multiline, prefix, suffix }: ExampleFieldProps) {
  return <FormField control={control} name={name} rules={rules} render={({ field, fieldState }) => <FormItem className="input-system-field weft-text-field" data-treatment="cutout" data-multiline={multiline || undefined} data-invalid={!!fieldState.error || undefined}>
    <div className={`weft-text-field-group ${prefix ? 'input-system-has-prefix' : ''} ${suffix ? 'input-system-has-suffix' : ''}`}>
      <div className="weft-text-field-control"><FormControl id={`input-system-${name}`}>{multiline ? <Textarea {...field} placeholder=" " maxLength={240} /> : <Input {...field} {...inputProps} placeholder=" " />}</FormControl>
      <FormLabel htmlFor={`input-system-${name}`}>{labels[name]}</FormLabel>
      {prefix && <span className="input-system-prefix" aria-hidden="true">{prefix}</span>}
      {suffix && <span className="input-system-suffix" aria-hidden="true">{suffix}</span>}
      </div>
    </div>
    <FormMessage />
    {after}
    {helper && <FormDescription>{helper}</FormDescription>}
  </FormItem>} />;
}

export function InputSystemExamples() {
  const form = useForm<Values>({ defaultValues: initial, mode: 'onTouched', reValidateMode: 'onChange', shouldFocusError: false });
  const [showPassword, setShowPassword] = React.useState(false);
  const [outcome, setOutcome] = React.useState('success');
  const [check, setCheck] = React.useState<{ state: 'idle' | 'pending' | 'available' | 'taken' | 'failed'; value: string }>({ state: 'idle', value: '' });
  const [feedback, setFeedback] = React.useState('');
  const [failedSave, setFailedSave] = React.useState(false);
  const [summary, setSummary] = React.useState<(keyof Values)[]>([]);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const request = React.useRef(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handle = form.watch('handle');
  const notes = form.watch('notes');
  const visibleSummary = summary.filter(name => !!form.formState.errors[name]);
  React.useEffect(() => {
    request.current++;
    setCheck({ state: 'idle', value: '' });
    if (timer.current) clearTimeout(timer.current);
    if (form.getFieldState('handle').error?.type === 'availability') form.clearErrors('handle');
  }, [handle, form]);
  React.useEffect(() => () => { request.current++; if (timer.current) clearTimeout(timer.current); }, []);
  const checkAddress = async () => {
    if (!await form.trigger('handle')) { form.setFocus('handle'); return; }
    const value = form.getValues('handle');
    const current = ++request.current;
    setCheck({ state: 'pending', value });
    timer.current = setTimeout(() => {
      if (current !== request.current || form.getValues('handle') !== value) return;
      if (value === 'taken') { setCheck({ state: 'taken', value }); form.setError('handle', { type: 'availability', message: 'This address is already in use. Choose another address.' }); }
      else if (value === 'offline') setCheck({ state: 'failed', value });
      else { setCheck({ state: 'available', value }); form.clearErrors('handle'); }
    }, 500);
  };
  const save = async (submitted: Values) => {
    if (check.state !== 'available' || check.value !== submitted.handle) { form.setError('handle', { type: 'availability', message: 'Check this address and choose an available one before saving.' }); setSummary(['handle']); requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    setFeedback('Saving example…');
    await new Promise(resolve => setTimeout(resolve, 500));
    if (JSON.stringify(submitted) !== JSON.stringify(form.getValues())) { setFeedback('Your entries changed while saving. Review them and save again.'); return; }
    setSummary([]);
    if (outcome === 'server') { form.setError('email', { type: 'server', message: 'This invitation was rejected. Check the address or choose another recipient.' }); setSummary(['email']); setFailedSave(false); requestAnimationFrame(() => summaryRef.current?.focus()); return; }
    if (outcome === 'offline') { setFailedSave(true); setFeedback('Unable to save. Your entries are still here. Retry when the connection is restored.'); return; }
    setFailedSave(false); setFeedback('Example saved. No invitation was sent and no workspace was changed.');
  };
  const invalid = (errors: FieldErrors<Values>) => { setSummary(Object.keys(errors) as (keyof Values)[]); setFeedback(''); requestAnimationFrame(() => summaryRef.current?.focus()); };
  return <>
    <section className="input-lab-section" aria-labelledby="input-compositions-heading">
      <h2 id="input-compositions-heading">Helper text and feedback</h2>
      <p>Instructions stay visible when an error appears. Required fields validate after leaving the field or submitting; corrections are checked while editing.</p>
      <div className="input-system-samples">
        <div><div className="input-lab-cutout"><Input id="helper-only" placeholder=" " /><label htmlFor="helper-only">Team name (optional)</label></div><small>Helper text is optional; labels always remain.</small></div>
        <div><div className="input-lab-cutout"><Input id="helper-format" placeholder=" " aria-describedby="helper-format-help" /><label htmlFor="helper-format">Reference code</label></div><small id="helper-format-help">Use the code from your invitation.<br />Example: TEAM-2048.</small></div>
        <div><div className="input-lab-cutout"><Input id="helper-error" placeholder=" " defaultValue="x" state="error" aria-describedby="helper-error-message helper-error-help" /><label htmlFor="helper-error">Project code</label></div><small id="helper-error-message" className="input-lab-error">Use at least three characters.</small><small id="helper-error-help">This code identifies your project in exports.</small></div>
      </div>
    </section>
    <section className="input-lab-section" aria-labelledby="input-system-heading">
      <h2 id="input-system-heading">A complete field workflow</h2>
      <p>Fictional examples combine the patterns used in Settings, invitations, exports, and confirmations. Required fields are identified in the instructions below; optional fields say “optional”.</p>
      <label className="input-system-scenario">Simulated save response<select value={outcome} onChange={e => { setOutcome(e.target.value); setFeedback(''); setFailedSave(false); }}> <option value="success">Success</option><option value="server">Field rejection</option><option value="offline">Connection failure</option></select></label>
      <Form {...form}><form className="input-system-form" aria-busy={form.formState.isSubmitting || undefined} noValidate onSubmit={form.handleSubmit(save, invalid)}>
        {visibleSummary.length > 0 && <div className="input-system-summary" ref={summaryRef} tabIndex={-1} role="alert"><strong>Check {visibleSummary.length === 1 ? 'this field' : 'these fields'}</strong><ul>{visibleSummary.map(name => <li key={name}><a href={`#input-system-${name}`} onClick={e => { e.preventDefault(); form.setFocus(name); }}>{labels[name]}: {form.formState.errors[name]?.message}</a></li>)}</ul></div>}
        <p className="input-system-instructions">Workspace name, invitation email, workspace address, example password, and the demonstration confirmation are required. No real credentials are needed.</p>
        <ExampleField control={form.control} name="workspace" helper="Visible to everyone in the workspace. Use a name people will recognize." rules={{ required: 'Enter a workspace name.', validate: value => !!value.trim() || 'Enter a workspace name.' }} inputProps={{ required: true, autoComplete: 'off', maxLength: 100 }} />
        <ExampleField control={form.control} name="email" helper="The recipient will receive access to the selected workspace. Example: jordan@example.com." rules={{ required: 'Enter an invitation email.', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter an email address such as jordan@example.com.' } }} inputProps={{ required: true, type: 'email', autoComplete: 'off', inputMode: 'email', spellCheck: false, autoCapitalize: 'none' }} />
        <ExampleField control={form.control} name="handle" prefix="/spaces/" helper={`Workspace path: /spaces/${handle || 'workspace-address'}. Check availability before saving. Use lowercase letters, numbers, and hyphens. Try “taken” or “offline” to explore a failed check.`} rules={{ required: 'Enter a workspace address.', pattern: { value: /^[a-z0-9-]+$/, message: 'Use lowercase letters, numbers, and hyphens.' } }} inputProps={{ required: true, autoComplete: 'off', spellCheck: false, autoCapitalize: 'none' }} after={<>{check.state !== 'idle' && <FormStatus role="status" pending={check.state === 'pending'} tone={check.state === 'available' ? 'ok' : check.state === 'failed' ? 'warn' : undefined}>{check.state === 'pending' ? 'Checking address…' : check.state === 'available' ? 'Address is available.' : check.state === 'failed' ? 'Unable to check. Your address has not been confirmed. Try again.' : 'Choose another address.'}</FormStatus>}</>} />
        <Button type="button" variant="outline" disabled={check.state === 'pending'} onClick={checkAddress}>{check.state === 'failed' ? 'Retry address check' : 'Check address'}</Button>
        <ExampleField control={form.control} name="password" helper="Use at least 12 characters for this example. Pasting and password managers are allowed." rules={{ required: 'Enter an example password.', minLength: { value: 12, message: 'Use at least 12 characters.' } }} inputProps={{ required: true, type: showPassword ? 'text' : 'password', autoComplete: 'new-password', spellCheck: false, autoCapitalize: 'none' }} />
        <Button type="button" variant="outline" pressed={showPassword} onClick={() => setShowPassword(v => !v)}>{showPassword ? 'Hide example password' : 'Show example password'}</Button>
        <ExampleField control={form.control} name="website" helper="Include https://, for example https://example.com." rules={{ validate: value => !value || /^https?:\/\/[^\s]+$/.test(value) || 'Enter a website beginning with https:// or http://.' }} inputProps={{ type: 'url', autoComplete: 'url', inputMode: 'url', spellCheck: false, autoCapitalize: 'none' }} />
        <Button type="button" variant="outline" onClick={() => { form.setValue('website', '', { shouldValidate: true, shouldDirty: true }); form.setFocus('website'); }}>Clear website</Button>
        <ExampleField control={form.control} name="telephone" helper="Include the country code when needed. Spaces and punctuation are allowed." inputProps={{ type: 'tel', autoComplete: 'tel', inputMode: 'tel' }} />
        <ExampleField control={form.control} name="limit" suffix="docs" helper="Maximum number of documents to include in this example export. Leave blank for no limit." rules={{ validate: value => !value || /^\d+$/.test(value) && Number(value) > 0 || 'Enter a whole number greater than zero.' }} inputProps={{ inputMode: 'numeric', autoComplete: 'off' }} after={<small>Unit: documents</small>} />
        <ExampleField control={form.control} name="notes" multiline rules={{ maxLength: { value: 240, message: 'Use 240 characters or fewer.' } }} helper="Optional context for the invitation. Do not include secrets." after={<FormStatus>{240 - notes.length} characters remaining.</FormStatus>} />
        <fieldset className="input-system-confirmation"><legend>Destructive confirmation example</legend><p>Type Studio to confirm the target. This example does not delete anything.</p><ExampleField control={form.control} name="confirmation" helper="Required only for this demonstration of a destructive action." rules={{ validate: value => value === 'Studio' || 'Type Studio exactly to confirm the target.' }} inputProps={{ autoComplete: 'off', spellCheck: false, autoCapitalize: 'none', required: true }} /></fieldset>
        <div className="input-system-actions"><Button className="weft-btn" type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Saving…' : failedSave ? 'Retry save' : 'Save example'}</Button><Button type="button" variant="outline" disabled={form.formState.isSubmitting} onClick={() => { form.reset(initial); request.current++; setCheck({ state: 'idle', value: '' }); setSummary([]); setFeedback('Example reset.'); setFailedSave(false); }}>Reset example</Button></div>
        <p role="status">{feedback}</p>
      </form></Form>
    </section>
    <section className="input-lab-section" aria-labelledby="input-avalandra-heading"><h2 id="input-avalandra-heading">Where these fields belong in Avalandra</h2><table className="input-system-table"><thead><tr><th>Surface</th><th>Pattern</th></tr></thead><tbody>
      <tr><td>Settings and creation dialogs</td><td>Cutout labels, clear editable surfaces, durable help, explicit Save/Create, preserved entries on failure.</td></tr>
      <tr><td>Document rename in the tree</td><td>Keep the inline editor. Enter commits, Escape cancels, focus returns to the row. A full floating field would crowd navigation.</td></tr>
      <tr><td>Invitations and permissions</td><td>Show the Organization/Space, recipient, and resulting access before submission. Email for another person must not autofill the current user’s address.</td></tr>
      <tr><td>Agent credentials</td><td>Separate secrets from ordinary text. Reveal/copy controls need explicit labels; never reuse real tokens in this lab or log their values.</td></tr>
      <tr><td>Delete, transfer, or elevated access</td><td>Name the target and consequence, require deliberate confirmation where needed, preserve existing authorization rules.</td></tr>
      <tr><td>Search and filters</td><td>Use the existing SearchField and selection primitives. Search is not a required form field and should not display validation errors for an empty query.</td></tr>
    </tbody></table><p>These are local interaction fixtures. Production validation, authorization, asynchronous services, and account persistence remain Avalandra responsibilities. Cutout composition is still lab-local pending contract and package work.</p></section>
  </>;
}
