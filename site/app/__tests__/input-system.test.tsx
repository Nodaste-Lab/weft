// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { InputSystemExamples } from '../pages/InputSystemExamples';
afterEach(cleanup);
it('keeps helper text associated alongside a corrective error', async () => {
 render(<InputSystemExamples />);
 const field = screen.getByRole('textbox',{name:'Workspace name'});
 fireEvent.blur(field);
 await waitFor(()=>expect(field).toHaveAttribute('aria-invalid','true'));
 const refs = field.getAttribute('aria-describedby')!.split(' ');
 expect(refs.map(id=>document.getElementById(id)?.textContent)).toEqual(['Enter a workspace name.','Visible to everyone in the workspace. Use a name people will recognize.']);
 fireEvent.change(field,{target:{value:'Studio'}});
 await waitFor(()=>expect(field).toHaveAttribute('aria-invalid','false'));
 expect(document.getElementById(field.getAttribute('aria-describedby')!)).toHaveTextContent('Visible to everyone');
});
it('provides a linked error summary and keeps submitted values', async () => {
 render(<InputSystemExamples />);
 fireEvent.change(screen.getByRole('textbox',{name:'Workspace name'}),{target:{value:'Studio'}});
 fireEvent.click(screen.getByRole('button',{name:'Save example'}));
 const summary = await screen.findByRole('alert');
 expect(summary).toHaveTextContent('Invitation email');
 const link = screen.getByRole('link',{name:/Invitation email:/});
 expect(document.querySelector(link.getAttribute('href')!)).toBe(screen.getByRole('textbox',{name:'Invitation email'}));
 fireEvent.click(link);
 expect(screen.getByRole('textbox',{name:'Invitation email'})).toHaveFocus();
 expect(screen.getByRole('textbox',{name:'Workspace name'})).toHaveValue('Studio');
});
it('clears the optional website and returns focus to its input', () => {
 render(<InputSystemExamples />);
 const website = screen.getByRole('textbox',{name:'Website (optional)'});
 fireEvent.change(website,{target:{value:'https://example.com'}});
 fireEvent.click(screen.getByRole('button',{name:'Clear website'}));
 expect(website).toHaveValue('');
 expect(website).toHaveFocus();
});
it('rejects a stale availability result after the address changes', async () => {
 render(<InputSystemExamples />);
 const handle = screen.getByRole('textbox',{name:'Workspace address'});
 fireEvent.change(handle,{target:{value:'taken'}});
 fireEvent.click(screen.getByRole('button',{name:'Check address'}));
 await screen.findByText('Checking address…');
 fireEvent.change(handle,{target:{value:'studio'}});
 await new Promise(resolve=>setTimeout(resolve,550));
 expect(screen.queryByText('This address is already in use. Choose another address.')).toBeNull();
 expect(handle).toHaveAttribute('aria-invalid','false');
});

it('requires a confirmed current address before saving', async () => {
 render(<InputSystemExamples />);
 for (const [name,value] of [['Workspace name','Studio'],['Invitation email','jordan@example.com'],['Workspace address','studio'],['Example password','fictional-password'],['Confirm workspace name','Studio']]) {
  fireEvent.change(screen.getByLabelText(name),{target:{value}});
 }
 fireEvent.click(screen.getByRole('button',{name:'Save example'}));
 const summary = await screen.findByRole('alert');
 expect(summary).toHaveTextContent('Check this address and choose an available one before saving.');
 expect(screen.getByRole('textbox',{name:'Workspace name'})).toHaveValue('Studio');
});
