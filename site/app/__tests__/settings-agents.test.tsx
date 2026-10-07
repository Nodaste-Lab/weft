// @vitest-environment jsdom
import * as React from 'react';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {SettingsAgents} from '../pages/SettingsAgents';
afterEach(cleanup);
it('names before setup, associates help/errors, and does not claim a live connection',()=>{
 render(<SettingsAgents/>);fireEvent.click(screen.getByRole('button',{name:'Connect your agent'}));
 const field=screen.getByLabelText('Display name (required)');expect(field.closest('.weft-text-field')).toHaveAttribute('data-treatment','cutout');
 expect(field).toHaveAccessibleDescription('Recommendation: [Your Name] + [AI Tool]. Example: Alex’s Codex. This name appears in Settings and beside comments and changes your agent makes.');
 expect(screen.queryByRole('region',{name:'Setup FAQ'})).toBeNull();
 fireEvent.submit(field.closest('form')!);expect(field).toHaveFocus();expect(field).toHaveAttribute('aria-invalid','true');
 fireEvent.change(field,{target:{value:'Alex’s Claude Code'}});fireEvent.submit(field.closest('form')!);
 expect(screen.getByRole('heading',{name:'Connect your agent',level:2})).toHaveFocus();
 expect(screen.getByRole('region',{name:'Setup FAQ'})).toBeVisible();
 expect(screen.getByRole('status')).toHaveTextContent('No tool has been connected.');
 expect(screen.getByText(/This Weft preview does not issue credentials/)).toBeVisible();
});
it('opens setup directly from Edit and confirms permanent deactivation',async()=>{
 render(<SettingsAgents/>);fireEvent.click(screen.getByRole('button',{name:'Edit Avery’s Codex'}));
 expect(screen.queryByLabelText('Display name (required)')).toBeNull();
 expect(screen.getByRole('heading',{name:'Connection prompts'})).toBeVisible();
 fireEvent.click(screen.getByRole('button',{name:'Done'}));
 fireEvent.click(screen.getByRole('button',{name:'Deactivate Avery’s Codex'}));
 expect(screen.getByText(/Past comments and changes keep their attribution/)).toBeVisible();
 fireEvent.click(screen.getByRole('button',{name:'Cancel',exact:true}));
 await waitFor(()=>expect(screen.getByRole('button',{name:'Deactivate Avery’s Codex'})).toHaveFocus());
 fireEvent.click(screen.getByRole('button',{name:'Deactivate Avery’s Codex'}));
 fireEvent.click(screen.getByRole('button',{name:'Deactivate',exact:true}));
 expect(screen.queryByRole('button',{name:'Edit Avery’s Codex'})).toBeNull();
 await waitFor(()=>expect(screen.getByRole('button',{name:'Connect your agent'})).toHaveFocus());
 expect(screen.queryByRole('button',{name:/Reactivate/})).toBeNull();
});
it('rejects duplicate names and focuses setup on direct Edit',()=>{
 render(<SettingsAgents/>);
 fireEvent.click(screen.getByRole('button',{name:'Edit Avery’s Codex'}));
 expect(screen.getByRole('heading',{name:'Connect your agent',level:2})).toHaveFocus();
 fireEvent.click(screen.getByRole('button',{name:'Done'}));
 fireEvent.click(screen.getByRole('button',{name:'Connect your agent'}));
 const field=screen.getByLabelText('Display name (required)');
 fireEvent.change(field,{target:{value:'  AVERY’S CODEX  '}});fireEvent.submit(field.closest('form')!);
 expect(field).toHaveFocus();expect(field).toHaveAttribute('aria-invalid','true');
 expect(field).toHaveAccessibleDescription(expect.stringContaining('Enter a unique agent name.'));
});
