// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { SettingsLab } from '../pages/SettingsLab';
afterEach(() => { cleanup(); document.documentElement.removeAttribute('data-density'); });
it('marks section links and focuses the new section while keeping the return link', () => {
 const { rerender } = render(<SettingsLab path="settings/profile" />);
 expect(screen.getByRole('heading',{name:'Profile',exact:true})).toHaveFocus();
 expect(screen.getByRole('link', { name: 'General', exact: true })).toHaveAttribute('aria-current','page');
 expect(screen.getByRole('link', { name: /Back to workspace/ })).toHaveAttribute('href','#/labs/navigation-rail');
 rerender(<SettingsLab path="settings/members" />);
 expect(screen.getByRole('heading',{name:'Space sharing',exact:true})).toHaveFocus();
 expect(screen.getByRole('link',{name:'Space sharing',exact:true})).toHaveAttribute('aria-current','page');
});
it('shows private-Space restrictions and preserves a truthful local save', () => {
 const { rerender }=render(<SettingsLab path="settings/profile" />);
 fireEvent.change(screen.getByLabelText('Display name (required)'),{target:{value:'Avery Example'}});
 fireEvent.click(screen.getByRole('button',{name:'Save changes'}));
 expect(screen.getByRole('status')).toHaveTextContent('Profile saved for this preview');
 rerender(<SettingsLab path="settings/members" />);
 fireEvent.keyDown(screen.getByRole('combobox',{name:'Selected Space'}), {key:'ArrowDown'});
 fireEvent.click(screen.getByRole('option',{name:'Private',exact:true}));
 expect(screen.queryByRole('button',{name:'Add someone'})).toBeNull();
 expect(screen.getByText('Private Spaces cannot be shared. Only you have access.')).toBeVisible();
});

it('does not silently render Profile for an unknown section', () => {
 render(<SettingsLab path="settings/not-real" />);
 expect(screen.getByRole('heading',{name:'Settings section not found'})).toHaveFocus();
 expect(screen.queryByLabelText('Display name (required)')).toBeNull();
});

it('shows identity and organization together in the account menu trigger', () => {
 render(<SettingsLab path="settings/organization" />);
 fireEvent.change(screen.getByLabelText('Organization', {exact:true}), {target:{value:'Example organization'}});
 expect(screen.getByRole('button', {name:'Account menu for Avery Chen, Example organization'})).toHaveTextContent('Avery ChenExample organization');
});

it('offers supported densities and restores the previous density on exit', () => {
 document.documentElement.setAttribute('data-density', 'compact');
 const { unmount } = render(<SettingsLab path="settings/appearance" />);
 expect(screen.queryByRole('radio', {name:'High contrast'})).toBeNull();
 expect(screen.getByRole('group', {name:'Color mode'}).querySelectorAll('iframe')).toHaveLength(4);
 expect(screen.getByRole('group', {name:'Information density'}).querySelectorAll('iframe')).toHaveLength(3);
 fireEvent.click(screen.getByRole('radio', {name:/^Dense/}));
 expect(document.documentElement).toHaveAttribute('data-density', 'dense');
 expect(screen.getByRole('status')).toHaveTextContent('Dense density selected');
 unmount();
 expect(document.documentElement).toHaveAttribute('data-density', 'compact');
 document.documentElement.removeAttribute('data-density');
});

it('uses shared cutout fields and recovers from an empty profile name', () => {
 render(<SettingsLab path="settings/profile"/>);
 const name=screen.getByLabelText('Display name (required)');
 expect(name.closest('.weft-text-field')).toHaveAttribute('data-treatment','cutout');
 expect(name).not.toHaveAttribute('aria-describedby');
 expect(screen.getByLabelText('Email')).toHaveAttribute('readonly');
 expect(screen.getByText('Read only')).toBeVisible();
 expect(screen.getByLabelText('Review notes').tagName).toBe('TEXTAREA');
 fireEvent.change(name,{target:{value:'   '}});
 fireEvent.click(screen.getByRole('button',{name:'Save changes'}));
 expect(name).toHaveFocus();expect(name).toHaveAttribute('aria-invalid','true');
 expect(document.getElementById(name.getAttribute('aria-describedby')!)).toHaveTextContent('Enter a display name.');
 fireEvent.change(name,{target:{value:'Avery Updated'}});
 expect(name).not.toHaveAttribute('aria-invalid');
});

it('opens General with local preferences and separates Organization administration from Space permission', () => {
 render(<SettingsLab/>);
 expect(screen.getByRole('heading',{name:'General',exact:true})).toHaveFocus();
 expect(screen.getByText('Sign-in method',{exact:true})).toBeVisible();
 expect(screen.getByText('Google',{exact:true})).toBeVisible();
 expect(screen.getByText('Sign out ends your Avalandra session in this browser.')).toBeVisible();
 expect(screen.getByLabelText('Email notifications')).toBeChecked();
 fireEvent.click(screen.getByLabelText('Email notifications'));
 expect(screen.getByLabelText('Email notifications')).not.toBeChecked();
 expect(screen.queryByRole('link',{name:'User management',exact:true})).toBeNull();
 fireEvent.click(screen.getByLabelText('Organization admin'));
 expect(screen.getByRole('link',{name:'User management',exact:true})).toBeVisible();
 expect(screen.getByRole('link',{name:'Your connectors',exact:true})).toBeVisible();
 expect(screen.getAllByRole('button',{name:'Sign out',exact:true})).toHaveLength(1);
 fireEvent.click(screen.getByRole('button',{name:'Sign out',exact:true}));
 expect(screen.getByRole('status')).toHaveTextContent('Preview only: Sign out');
});

it('aliases legacy sharing and guards direct Organization routes', () => {
 const {rerender}=render(<SettingsLab path="settings/sharing"/>);
 expect(screen.getByRole('link',{name:'Space sharing',exact:true})).toHaveAttribute('aria-current','page');
 rerender(<SettingsLab path="settings/users"/>);
 expect(screen.getByRole('alert')).toHaveTextContent('Organization administration is required.');
 expect(screen.queryByRole('button',{name:'Invite a user'})).toBeNull();
 fireEvent.click(screen.getByLabelText('Organization admin'));
 expect(screen.getByRole('button',{name:'Invite a user'})).toBeEnabled();
});

it('places the account above Settings and ends the menu with Sign out', () => {
 render(<SettingsLab path="settings/profile"/>);
 const trigger=screen.getByRole('button',{name:'Account menu for Avery Chen, Nodaste'});
 const settings=screen.getByRole('heading',{name:'Settings',exact:true});
 expect(trigger.compareDocumentPosition(settings) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
 expect(screen.queryByRole('button',{name:/Sign out/})).toBeNull();
 fireEvent.keyDown(trigger,{key:'Enter'});
 const signOut=screen.getByRole('menuitem',{name:'Sign out',exact:true});
 const items=screen.getAllByRole('menuitem');
 expect(items[items.length-1]).toBe(signOut);
 fireEvent.click(signOut);
 expect(screen.getByRole('status')).toHaveTextContent('Preview only: Sign out');
});

it('uses the rail picker and creates a uniquely named local Space', () => {
 render(<SettingsLab path="settings/space"/>);
 const picker=screen.getByRole('combobox',{name:'Selected Space'});
 expect(picker).toHaveClass('weft-navigation-space-trigger');
 fireEvent.keyDown(picker,{key:'ArrowDown'});
 fireEvent.click(screen.getByRole('option',{name:'Add new',exact:true}));
 const name=screen.getByLabelText('Space name (required)');
 fireEvent.change(name,{target:{value:'Studio'}});
 fireEvent.click(screen.getByRole('button',{name:'Create Space'}));
 expect(name).toHaveFocus();expect(name).toHaveAttribute('aria-invalid','true');
 fireEvent.change(name,{target:{value:'Research'}});
 fireEvent.click(screen.getByRole('button',{name:'Create Space'}));
 expect(screen.queryByRole('dialog')).toBeNull();
 expect(screen.getByLabelText('Space name',{exact:true})).toHaveValue('Research');
 expect(screen.getByRole('combobox',{name:'Selected Space'})).toHaveTextContent('Research');
 expect(screen.getByRole('status')).toHaveTextContent('local preview only');
});
