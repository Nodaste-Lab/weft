import * as React from 'react';
import { Button } from '../../../src/ui/button';
import { TextField } from '../../../src/ui/text-field';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../src/ui/dialog';

type Agent = {id:string; name:string};
export function SettingsAgents() {
  const [agents,setAgents]=React.useState<Agent[]>([{id:'fixture-agent',name:'Avery’s Codex'}]);
  const [step,setStep]=React.useState<'name'|'setup'|null>(null);
  const [name,setName]=React.useState('');
  const [error,setError]=React.useState('');
  const [selected,setSelected]=React.useState<Agent|null>(null);
  const [deactivating,setDeactivating]=React.useState<Agent|null>(null);
  const [status,setStatus]=React.useState('');
  const deactivateTrigger=React.useRef<HTMLButtonElement|null>(null);
  const setupTrigger=React.useRef<HTMLButtonElement|null>(null);
  const connectRef=React.useRef<HTMLButtonElement>(null);
  const setupHeading=React.useRef<HTMLHeadingElement>(null);
  React.useEffect(()=>{if(step==='setup')setupHeading.current?.focus();},[step]);
  const nameRef=React.useRef<HTMLInputElement|HTMLTextAreaElement>(null);
  return <div className="settings-agents">
    {agents.length ? <table className="settings-agent-table"><caption className="weft-sr-only">Your agents</caption><thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>{agents.map(agent=><tr key={agent.id}>
      <td><div className="settings-agent-name"><span className="settings-lab-avatar" aria-hidden="true">{agent.name.trim().split(/\s+/).slice(0,2).map(word=>Array.from(word)[0]).join('').toLocaleUpperCase()}</span><strong>{agent.name}</strong></div></td>
      <td><span className="settings-agent-status">Active</span></td>
      <td><div className="settings-agent-actions"><Button variant="link" className="settings-agent-deactivate" onClick={event=>{deactivateTrigger.current=event.currentTarget;setDeactivating(agent);}} aria-label={`Deactivate ${agent.name}`}>Deactivate</Button><Button variant="outline" aria-haspopup="dialog" aria-label={`Edit ${agent.name}`} onClick={event=>{setupTrigger.current=event.currentTarget;setStatus('');setSelected(agent);setStep('setup');}}>Edit</Button></div></td>
    </tr>)}</tbody></table> : <p>No agents yet.</p>}
    <div className="settings-agent-connect"><h3>Connect your agent</h3><p>Give your existing AI tool access to Avalandra using your permissions.</p><Button ref={connectRef} aria-haspopup="dialog" onClick={event=>{setupTrigger.current=event.currentTarget;setName('');setError('');setStatus('');setStep('name');}}>Connect your agent</Button></div>
    <Dialog open={step!==null} onOpenChange={open=>{if(!open)setStep(null);}}><DialogContent className="settings-agent-dialog" onCloseAutoFocus={event=>{event.preventDefault();(setupTrigger.current?.isConnected ? setupTrigger.current : connectRef.current)?.focus();}}>
      <DialogHeader><DialogTitle ref={setupHeading} tabIndex={-1}>{step==='name'?'Name your agent':'Connect your agent'}</DialogTitle><DialogDescription>{step==='name'?'This helps you trace work done by your agent.':`Connection setup for ${selected?.name ?? 'your agent'}.`}</DialogDescription></DialogHeader>
      {step==='name'?<form noValidate onSubmit={event=>{event.preventDefault();if(!name.trim()){setError('Enter a name for your agent.');nameRef.current?.focus();return;}const agent={id:crypto.randomUUID(),name:name.trim()};setAgents(current=>[...current,agent]);setSelected(agent);setStep('setup');setStatus('Agent identity added to this local preview. No tool has been connected.');}}>
        <TextField ref={nameRef} label="Display name (required)" value={name} required autoComplete="off" error={error} onChange={event=>{setName(event.target.value);if(error&&event.target.value.trim())setError('');}} description="Recommendation: [Your Name] + [AI Tool]. Example: Alex’s Codex. This name appears in Settings and beside comments and changes your agent makes."/>
        <DialogFooter><Button type="button" variant="outline" onClick={()=>setStep(null)}>Cancel</Button><Button type="submit">Next</Button></DialogFooter>
      </form>:<>
        <p role="status">{status}</p>
        <div className="settings-agent-setup-placeholder"><h3>Connection prompts</h3><p>This Weft preview does not issue credentials. Avalandra provides the connection prompts here after creating the agent identity.</p></div>
        <section aria-label="Setup FAQ"><h3>Setup FAQ</h3><h4>Which agent can I connect?</h4><p>Use a coding agent such as Claude Code or Codex that can run commands on the machine you want to connect. Ordinary ChatGPT chat cannot use this setup.</p><h4>Expired or closed the setup?</h4><p>Connection prompts expire after approximately 15 minutes. Choose Edit beside your agent to generate fresh prompts. Existing secrets cannot be retrieved.</p><h4>Installation failed?</h4><p>Stop at the failing command and ask your agent to report the error without credentials.</p></section>
        <DialogFooter><Button variant="outline" onClick={()=>setStep(null)}>Done</Button></DialogFooter>
      </>}
    </DialogContent></Dialog>
    <Dialog open={deactivating!==null} onOpenChange={open=>{if(!open)setDeactivating(null);}}><DialogContent className="settings-agent-dialog" onCloseAutoFocus={event=>{event.preventDefault();(deactivateTrigger.current?.isConnected ? deactivateTrigger.current : connectRef.current)?.focus();}}><DialogHeader><DialogTitle>Deactivate agent</DialogTitle><DialogDescription>Deactivate {deactivating?.name}? This permanently removes it from your agents list, disables its credentials, and closes its sessions. It cannot be reactivated. Past comments and changes keep their attribution.</DialogDescription></DialogHeader><p>This preview removes only the fictional row.</p><DialogFooter><Button variant="outline" onClick={()=>setDeactivating(null)}>Cancel</Button><Button variant="destructive" onClick={()=>{setAgents(current=>current.filter(agent=>agent.id!==deactivating?.id));setStatus('Agent removed from this local preview.');setDeactivating(null);}}>Deactivate</Button></DialogFooter></DialogContent></Dialog>
    <p role="status">{status}</p>
  </div>;
}
