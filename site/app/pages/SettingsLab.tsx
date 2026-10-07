import * as React from 'react';
import { Button } from '../../../src/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '../../../src/ui/dropdown-menu';
import { NavigationSpacePicker } from '../../../src/ui/navigation-space-picker';
import { PreviewSpaceDialog } from './PreviewSpaceDialog';
import { TextField } from '../../../src/ui/text-field';
import { PageTitle } from './shared';
import { SettingsAgents } from './SettingsAgents';
import './settings-lab.css';
import previewTokens from '../../../css/weft.css?raw';

function PreferencePreview({ theme = 'light', density = 'compact', kind = 'theme' }: { theme?: string; density?: string; kind?: 'theme' | 'density' }) {
  const source = `<!doctype html><html data-palette="weft" ${theme === 'dark' ? 'data-theme="dark"' : ''} ${density !== 'default' ? `data-density="${density}"` : ''} data-fonts="system"><head><style>${previewTokens}body{margin:0;background:var(--weft-paper);color:var(--weft-navigation-fg);font:12px var(--weft-font-sans)}.bar{height:22px;background:var(--weft-control-fill-static);border-bottom:1px solid var(--weft-rule)}.rows{padding:6px}.row{box-sizing:border-box;white-space:nowrap;overflow:hidden;display:flex;align-items:center;gap:6px;padding-inline:6px;min-height:${kind === 'density' ? 'var(--weft-navigation-row-h)' : '24px'};border-bottom:1px solid var(--weft-rule)}.row:first-child{background:var(--weft-control-fill-static);border-inline-start:2px solid var(--weft-blue)}.icon{width:10px;height:10px;border:1px solid currentColor;border-radius:2px;flex-shrink:0}</style></head><body><div class="bar"></div><div class="rows"><div class="row"><span class="icon"></span>Notes</div><div class="row"><span class="icon"></span>Research</div><div class="row"><span class="icon"></span>Files</div></div></body></html>`;
  return <iframe className={`settings-lab-preference-preview settings-lab-preference-preview--${kind}`} title={`${theme} ${density} sample`} srcDoc={source} sandbox="" tabIndex={-1} aria-hidden="true" />;
}


const sections = [
  { group: 'Personal', items: [['general', 'General'], ['agents', 'Personal agents'], ['connectors', 'Your connectors']] },
  { group: 'Spaces', items: [['space', 'Space settings'], ['members', 'Space sharing']] },
  { group: 'Organization', items: [['users', 'User management'], ['organization-connectors', 'Organization connectors']] },
];
const known = [...sections.flatMap(group => group.items.map(([id]) => id)), 'profile', 'appearance', 'organization', 'sharing', 'exports', 'lifecycle'];
export function SettingsLab({ path = 'settings' }: { path?: string }) {
  const requested = path.split('/')[1] ?? 'general';
  const validSection = known.includes(requested) && path.split('/').length <= 2;
  const section = validSection ? (requested === 'sharing' ? 'members' : requested) : 'not-found';
  const [space, setSpace] = React.useState('Studio');
  const [organizationAdmin, setOrganizationAdmin] = React.useState(false);
  const [commentEmails, setCommentEmails] = React.useState(true);
  const [extraSpaces, setExtraSpaces] = React.useState<string[]>([]);
  const [newSpaceOpen, setNewSpaceOpen] = React.useState(false);
  const [role, setRole] = React.useState('Owner');
  const [name, setName] = React.useState('Avery Chen');
  const [nameError, setNameError] = React.useState('');
  const nameField = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [savedName, setSavedName] = React.useState('Avery Chen');
  const [appearance, setAppearance] = React.useState('System');
  const [siteTheme, setSiteTheme] = React.useState(() => document.documentElement.getAttribute('data-theme')?.startsWith('dark') ? 'dark' : 'light');
  React.useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setSiteTheme(root.getAttribute('data-theme')?.startsWith('dark') ? 'dark' : 'light'));
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const profileNavigation = React.useRef(false);
  const [density, setDensity] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (density === null) return;
    const root = document.documentElement;
    const original = root.getAttribute('data-density');
    if (density === 'default') root.removeAttribute('data-density'); else root.setAttribute('data-density', density);
    return () => { if (original === null) root.removeAttribute('data-density'); else root.setAttribute('data-density', original); };
  }, [density]);
  const [organization, setOrganization] = React.useState('Nodaste');
  const [status, setStatus] = React.useState('');
  const [note, setNote] = React.useState('');
  const heading = React.useRef<HTMLHeadingElement>(null);
  const previous = React.useRef(section);
  React.useEffect(() => {
    if (previous.current !== section) { heading.current?.focus(); setStatus(''); previous.current = section; }
  }, [section]);
  const title = sections.flatMap(group => group.items).find(([id]) => id === section)?.[1] ?? (({profile:'Profile', appearance:'Appearance', organization:'Switch organization', sharing:'Sharing', exports:'Exports', lifecycle:'Archive and delete'} as Record<string, string>)[section] ?? 'General');
  const privateSpace = space === 'Private';
  const canManage = role === 'Owner' && !privateSpace;
  const preview = (action: string) => setStatus(`Preview only: ${action}. No Avalandra service is connected.`);
  const switchOrganization = (value: string) => { setOrganization(value); setStatus(`Switched to ${value} in the preview. Live routing is not connected.`); };
  const scoped = ['space', 'members', 'sharing', 'exports', 'lifecycle'].includes(section);
  if (!validSection) return <div className="settings-lab"><h1 ref={heading} tabIndex={-1}>Settings section not found</h1><a href="#/templates/settings">Return to Settings</a></div>;
  return <div className="settings-lab">
    <PageTitle eyebrow="Settings template" title="A place for each kind of setting" summary="Review the full-page Settings experience. Personal, Spaces and Organization follow the onboarding foundation; navigation and scope changes work with fictional data." />
    <div className="settings-lab-toolbar">
      <span>Prototype · fictional data · not connected to Avalandra</span>
      <label><input type="checkbox" checked={organizationAdmin} onChange={event => setOrganizationAdmin(event.target.checked)} /> Organization admin</label><label>Preview permission<select value={role} onChange={event => { setRole(event.target.value); setStatus(''); }}><option>Owner</option><option>Write</option><option>Read</option></select></label>
    </div>
    <div className="settings-lab-shell">
      <nav aria-label="Settings preview" className="settings-lab-nav">
        <a href="#/labs/navigation-rail" className="settings-lab-back">← Back to workspace</a>
        <div className="settings-lab-identity"><DropdownMenu>
          <DropdownMenuTrigger asChild><button type="button" className="settings-lab-account-trigger" aria-label={`Account menu for ${savedName}, ${organization}`}><span aria-hidden="true" className="settings-lab-avatar">{savedName.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><span className="settings-lab-account-text"><strong>{savedName}</strong><small>{organization}</small></span><span aria-hidden="true">⌄</span></button></DropdownMenuTrigger>
          <DropdownMenuContent onCloseAutoFocus={event => { if (profileNavigation.current) { event.preventDefault(); profileNavigation.current = false; heading.current?.focus(); } }} side="bottom" align="start" className="settings-lab-account-menu">
            <DropdownMenuLabel>{savedName}</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => { profileNavigation.current = true; }} asChild><a href="#/templates/settings/profile">Profile</a></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Working organization</DropdownMenuLabel>
            <DropdownMenuRadioGroup aria-label="Working organization" value={organization} onValueChange={switchOrganization}>{['Nodaste', 'Example organization'].map(value => <DropdownMenuRadioItem key={value} value={value}>{value}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => preview('Sign out')}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu></div>
        <h2 className="settings-lab-wordmark">Settings</h2>
        {sections.filter(group => organizationAdmin || group.group !== 'Organization').map(group => <div key={group.group} className="settings-lab-nav-group">
          <h3>{group.group}</h3>
          {group.items.filter(([id]) => organizationAdmin || !['users', 'organization-connectors'].includes(id)).map(([id, label]) => <a key={id} href={`#/templates/settings/${id}`} aria-current={(section === id || (id === 'general' && ['profile', 'appearance'].includes(section))) ? 'page' : undefined}>{label}</a>)}
        </div>)}

      </nav>
      <section aria-labelledby="settings-preview-title" className="settings-lab-main">
        <div className="settings-lab-context">{scoped ? 'Space' : ['organization', 'users', 'organization-connectors'].includes(section) ? 'Organization' : 'Personal'} settings</div>
        <h2 id="settings-preview-title" ref={heading} tabIndex={-1}>{title}</h2>
        {scoped && <div className="settings-lab-scope"><div className="settings-lab-space-picker"><label htmlFor="settings-space">Selected Space</label><NavigationSpacePicker id="settings-space" label="Selected Space" value={space} spaces={[{id:'Studio',name:'Studio'}, {id:'Private',name:'Private',private:true}, ...extraSpaces.map(name => ({id:name,name}))]} onValueChange={value => { setSpace(value); setStatus(''); }} onAdd={() => { setNewSpaceOpen(true); }} contentClassName="settings-lab-space-options" /></div><span>{privateSpace ? 'Only you have access' : `${role} access`}</span></div>}
        {['general', 'profile'].includes(section) && <>

          <form noValidate onSubmit={event => { event.preventDefault(); if (!name.trim()) { setNameError('Enter a display name.'); nameField.current?.focus(); return; } setNameError(''); setSavedName(name.trim()); nameField.current?.focus(); setStatus('Profile saved for this preview. Refresh resets fictional data.'); }}>
            <TextField className="settings-lab-field" ref={nameField} id="settings-display-name" name="displayName" label="Display name (required)" autoComplete="nickname" value={name} required error={nameError} onBlur={event => { if (event.relatedTarget instanceof HTMLButtonElement && event.relatedTarget.type === 'submit' && event.relatedTarget.form === event.currentTarget.form) return; if (!name.trim()) setNameError('Enter a display name.'); }} onChange={event => { setName(event.target.value); setStatus(''); if (nameError && event.target.value.trim()) setNameError(''); }} />
            <TextField className="settings-lab-field" id="settings-email" name="email" label="Email" type="email" autoComplete="email" value="avery@example.com" readOnly />
            <Button type="submit" disabled={name.trim() === savedName}>Save changes</Button>
          </form>
        </>}
        {['general', 'appearance'].includes(section) && <>
          <p className="settings-lab-lede">Choose how your workspace looks and how much information fits on screen.</p>
          <fieldset className="settings-lab-options settings-lab-preference-options"><legend>Color mode</legend>{['System', 'Light', 'Dark'].map(value => <label key={value} className="settings-lab-preference-card">
            <span className="settings-lab-preference-art" aria-hidden="true">{value === 'System' ? <><PreferencePreview theme="light" /><PreferencePreview theme="dark" /></> : <PreferencePreview theme={value.toLowerCase()} />}</span>
            <span className="settings-lab-preference-caption"><input type="radio" name="settings-appearance" value={value} checked={appearance === value} onChange={() => { setAppearance(value); setStatus(`${value} selected in this preview; the site theme control changes the page.`); }} /><span><strong>{value}</strong><small>{value === 'System' ? 'Follow your device' : `${value} workspace`}</small></span></span>
          </label>)}</fieldset>
          <fieldset className="settings-lab-options settings-lab-preference-options"><legend>Information density</legend>{[['default', 'Default', 'More breathing room'], ['compact', 'Compact', 'Balanced spacing'], ['dense', 'Dense', 'More visible at once']].map(([value, label, description]) => <label key={value} className="settings-lab-preference-card">
            <span className="settings-lab-preference-art" aria-hidden="true"><PreferencePreview kind="density" density={value} theme={appearance === 'System' ? siteTheme : appearance.toLowerCase()} /></span>
            <span className="settings-lab-preference-caption"><input type="radio" name="settings-density" value={value} checked={(density ?? document.documentElement.getAttribute('data-density') ?? 'default') === value} onChange={() => { setDensity(value); setStatus(`${label} density selected.`); }} /><span><strong>{label}</strong><small>{description}</small></span></span>
          </label>)}</fieldset>
        </>}

        {section === 'general' && <>
          <div className="settings-lab-line"><div><h3>Comment emails</h3><p>Email me about unread comments, replies and mentions. Notifications in Avalandra remain on.</p></div><label><input type="checkbox" checked={commentEmails} onChange={event => { setCommentEmails(event.target.checked); setStatus('Comment email preference changed in this preview.'); }} /> Email notifications</label></div>
          <h3>Session</h3><dl><dt>Sign-in method</dt><dd>Google</dd><dt>Account</dt><dd>avery@example.com</dd></dl><p>Sign out ends your Avalandra session in this browser.</p><Button type="button" variant="outline" onClick={() => preview('Sign out')}>Sign out</Button>
        </>}
        {['connectors', 'organization-connectors'].includes(section) && <>
          <p className="settings-lab-lede">{section === 'connectors' ? 'Connect your own accounts and choose where imported content is saved.' : 'Manage shared connections for your Organization.'}</p>
          {section === 'organization-connectors' && !organizationAdmin ? <p role="alert">Organization administration is required.</p> : <><h3>No connections in this preview</h3><Button onClick={() => preview('Add connector — provider-specific setup')}>Add connector</Button><p>Allowed providers and connected accounts are separate. No provider has been authorized in this preview.</p></>}
        </>}
        {section === 'space' && <>
          <TextField label="Space name" value={space} readOnly />
          <TextField label="Slug" value={space.toLowerCase()} readOnly />
          <p>Name and slug editing, including permanent redirects from old slugs, remain to be represented.</p>
          <ul><li><a href="#/templates/settings/exports">Exports and import eligibility</a></li><li><a href="#/templates/settings/lifecycle">Archive, restore and delete</a></li></ul>
        </>}
        {section === 'agents' && <SettingsAgents/>}
        {section === 'members' && <><p className="settings-lab-lede">See who can access {space} and what they can do.</p>{privateSpace ? <p className="settings-lab-notice">Private Spaces cannot be shared. Only you have access.</p> : <><div className="settings-lab-line"><div><strong>{savedName}</strong><p>Owner · Active</p></div><span>You</span></div><div className="settings-lab-line"><div><strong>Jordan Lee</strong><p>Write · Active</p></div><Button variant="outline" disabled={!canManage} onClick={() => preview('Change access')}>Change access</Button></div><Button variant="outline" disabled={!canManage} onClick={() => preview(`Add someone to ${space}`)}>Add someone</Button>{!canManage && <p className="settings-lab-notice">You can view access. An eligible administrator manages membership.</p>}</>}</>}
        {section === 'sharing' && <><p className="settings-lab-lede">Control access to {space}.</p><p className="settings-lab-notice">{privateSpace ? 'Private Spaces cannot be shared.' : 'Only people with access can open this Space.'}</p>{!privateSpace && <Button variant="outline" disabled={!canManage} onClick={() => preview('Change Space sharing')}>Manage sharing</Button>}</>}
        {section === 'exports' && <><p className="settings-lab-lede">Download a copy of the selected Space.</p><div className="settings-lab-line"><div><strong>Space archive</strong><p>Review included content before starting an export.</p></div><Button variant="outline" onClick={() => preview(`Review export for ${space}`)}>Review export</Button></div><h3>Recent exports</h3><p>No exports in this preview.</p></>}
        {section === 'lifecycle' && <><p className="settings-lab-lede">Manage whether {space} stays available.</p>{privateSpace ? <p className="settings-lab-notice">Private Spaces cannot be shared or deleted.</p> : <><div className="settings-lab-line"><div><strong>Archive Space</strong><p>Make this Space read-only. It can be restored later.</p></div><Button variant="outline" disabled={!canManage} onClick={() => preview(`Archive ${space}`)}>Archive Space</Button></div><div className="settings-lab-line"><div><strong>Restore Space</strong><p>Reopen an archived Space.</p></div><Button variant="outline" disabled={!canManage} onClick={() => preview(`Restore ${space}`)}>Restore Space</Button></div><div className="settings-lab-line"><div><strong>Delete Space</strong><p>Production requires an explicit confirmation.</p></div><Button variant="destructive" disabled={!canManage} onClick={() => preview(`Delete ${space}`)}>Delete Space</Button></div></>}</>}
        {section === 'organization' && <><p className="settings-lab-lede">Legacy organization switching preview. Use the account menu above Settings to choose your working organization.</p><div className="settings-lab-field"><label htmlFor="settings-org">Organization</label><select id="settings-org" value={organization} onChange={event => switchOrganization(event.target.value)}><option>Nodaste</option><option>Example organization</option></select></div><p className="settings-lab-notice">Switching must restore an eligible workspace and preserve a clear return destination.</p></>}
        {section === 'users' && !organizationAdmin && <p role="alert">Organization administration is required.</p>}
        {section === 'users' && organizationAdmin && <><p className="settings-lab-lede">Manage Organization accounts separately from Space membership.</p><div className="settings-lab-line"><div><strong>Organization users</strong><p>Named accounts, account status and invitations.</p></div><Button variant="outline" disabled={!organizationAdmin} onClick={() => preview('Invite an Organization user')}>Invite a user</Button></div><p>Organization administration requires its own authority. The preview permission control is a simplified scenario, not an authorization rule.</p></>}
        <p className="settings-lab-status" role="status">{status}</p>
      </section>
    </div>
    <PreviewSpaceDialog open={newSpaceOpen} onOpenChange={setNewSpaceOpen} existingNames={extraSpaces} triggerId="settings-space" onCreate={next=>{setExtraSpaces(current=>[...current,next]);setSpace(next);setStatus(`Created Space “${next}” in the local preview only.`);}} />
    <details open className="settings-lab-review"><summary>Design decisions and coverage</summary>
      <h3>Sign-in foundation</h3><p>This fictional account represents Google sign-in. Avalandra configures Google OAuth when the deployment enables it; password sign-in is limited to lab fixtures. The live Settings view must derive the sign-in method from verified session/provider data rather than assume every account uses Google. Broader enterprise SSO is not claimed.</p>
      <h3>Next decision</h3><p>Review General as the default Settings destination. Contextual Space links should open the relevant Space section directly.</p>
      <h3>Honesty pass · 7 October 2026</h3>
      <p>Source comparison: Avalandra checkout at 7cd12967 and the separate onboarding / Lab007 checkout. This is a code audit, not verification of the deployed production service.</p>
      <ul>
        <li>Existing Avalandra coverage to preserve: saved Light and Dark preferences (Dark High Contrast is excluded by scope) (including remote-save failure); Organization users and invitation delivery/status/actions; existing-user Space membership; separate Organization and Space administration authority; typed lifecycle confirmations; export confirmation, progress, background continuation, verification, download, expiry and recovery; import eligibility in a new empty Space.</li>
        <li>Onboarding foundation to carry forward: Personal / Spaces / Organization navigation; General, Agents and Your connectors; Space settings and Space sharing; User management and Organization connectors; comment emails and session controls; Sign out in the account menu and General Session; Space name / slug and redirects; connector scope, permissions and provider-specific setup.</li>
        <li>Preview gaps: most membership, invitation, export and lifecycle controls currently announce an action rather than model the workflow. Profile editing, System appearance and density are proposals, not proof of an existing Avalandra service contract. Organization administration and Space access have separate preview controls; authoritative service authorization remains integration work.</li>
        <li>Ready for visual review: navigation and General preferences. Remaining workflow coverage: then Space sharing and administration, then personal / Organization connectors. Review real empty, loading, error, pending and success states before integration testing.</li>
      </ul>
      <h3>Personal agents foundation</h3><p>Follows <a href="https://nodaste.hub.avalandra.com/d/318f6f45-fd79-49b1-b3b4-6dd7314c983a">onboarding and Settings UX decisions</a>: connect an existing tool, name before connection, attribution guidance, FAQ at setup, Edit opens setup, permanent Deactivate with preserved attribution. Live credentials and connection verification remain integration work.</p>
      <h3>Placement to review</h3><p>Personal: General, personal agents and Your connectors. Spaces: Space settings and Space sharing. Organization: User management and Organization connectors. Organization switching stays in the account menu. Legacy preview links remain reachable.</p>
      <h3>Confirmed</h3><ul><li>Full-page Settings replaces workspace navigation.</li><li>A clear Back to workspace link restores the previous Space and destination in production.</li><li>Space management, Organization switching and email belong in Settings.</li><li>The account area in Settings lets members of multiple Organizations choose the Organization they want to work in.</li></ul>
      <h3>Appearance prototype boundaries</h3><p>Color cards show Weft’s current light and dark tokens; System is a proposed Weft choice; the inspected Avalandra implementation offers Light, Dark and Dark High Contrast. Color selection currently updates the sample cards; the site theme control changes the surrounding lab. Density applies while Settings is mounted and restores the prior site density on exit. Preferences are not saved to Avalandra. Dark High Contrast is explicitly out of scope for this pass. Density is proposed here and has not been verified as a saved Avalandra preference.</p><h3>Integration and accessibility checks</h3><p>This lab uses local fictional state. Service actions announce previews; navigation return currently opens the rail lab. Existing permissions, membership selection, invitations, agent setup/revocation, export progress/recovery, private-Space protection and typed lifecycle confirmations must be preserved during migration. Native section links expose the current page; focus follows a section change. Settings responsive testing is deferred. Human screen-reader testing and real routing remain pending.</p>
      <TextField className="settings-lab-field" label="Review notes" multiline rows={4} value={note} onChange={event => setNote(event.target.value)} description="Notes last for this page session; copy them before refreshing." />
    </details>
  </div>;
}
