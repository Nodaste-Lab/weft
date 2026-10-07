// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NavigationRailLayout } from '../navigation-rail-layout';
import { NavigationActions } from '../navigation-actions';
import { NavigationAccount } from '../navigation-account';
import { WorkspaceNavigationRail } from '../../templates/workspace-navigation-rail';
import { expectA11yClean } from '../../test-support/ds-assert';
afterEach(cleanup);
const layout = { railId: 'files', label: 'Navigation', openLabel: 'Open navigation', resizeLabel: 'Resize navigation', description: 'Browse files', rail: <nav id="files" aria-label="Files">Files</nav>, children: <p>Workspace</p> };
describe('Workspace navigation compositions', () => {
 it('keeps a controlled drawer open on first measurement', async () => {
   const change = vi.fn();
   vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
   const { unmount } = render(<NavigationRailLayout {...layout} mode="drawer" open onOpenChange={change} />);
   expect(screen.getByRole('dialog')).toBeVisible();
   expect(change).not.toHaveBeenCalled();
   unmount(); vi.unstubAllGlobals();
 });
 it('focuses Back when compact groups replace their contents under React 18', async () => {
   const select = vi.fn();
   render(<NavigationActions compact name="Research" items={[{ id: 'more', label: 'More', children: [{ id: 'copy', label: 'Copy link', onSelect: select }] }]} />);
   fireEvent.click(screen.getByRole('button', { name: 'Actions for Research' }));
   fireEvent.click(await screen.findByRole('menuitem', { name: 'More' }));
   await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Back' })).toHaveFocus());
   expect(screen.getByRole('menu')).toHaveAccessibleName('File actions: More');
   fireEvent.click(screen.getByRole('menuitem', { name: 'Back' }));
   await waitFor(() => expect(screen.getByRole('menuitem', { name: 'More' })).toHaveFocus());
   expect(screen.getByRole('menuitem', { name: 'More' })).toHaveAttribute('aria-haspopup', 'menu');
   expect(screen.getByRole('menu')).toHaveAccessibleName('File actions');
   fireEvent.click(screen.getByRole('menuitem', { name: 'More' }));
   fireEvent.click(screen.getByRole('menuitem', { name: 'Copy link' }));
   expect(select).toHaveBeenCalledOnce();
 });

 it('restores desktop width without writing a container clamp, and supports resize keys', async () => {
   localStorage.setItem('navigation-test', '400');
   let callback: ResizeObserverCallback;
   vi.stubGlobal('ResizeObserver', class { constructor(cb: ResizeObserverCallback) { callback = cb; } observe() {} disconnect() {} });
   const change = vi.fn();
   render(<NavigationRailLayout {...layout} storageKey="navigation-test" onWidthChange={change} />);
   const separator = screen.getByRole('separator');
   await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '400'));
   React.act(() => callback!([{ contentRect: { width: 324 } } as ResizeObserverEntry], {} as ResizeObserver));
   expect(separator).toHaveAttribute('aria-valuenow', '300');
   expect(localStorage.getItem('navigation-test')).toBe('400');
   expect(change).not.toHaveBeenCalled();
   fireEvent.keyDown(separator, { key: 'Home' }); fireEvent.keyDown(separator, { key: 'ArrowRight', shiftKey: true });
   expect(separator).toHaveAttribute('aria-valuenow', '264');
   expect(localStorage.getItem('navigation-test')).toBe('264');
   vi.unstubAllGlobals();
 });
 it('renders native Settings links and exposes no email field', async () => {
   const { container } = render(<NavigationAccount name="Avery Chen" initials="AC" settingsLabel="Account settings" settingsHref="/settings" />);
   expect(screen.getByRole('link', { name: 'Account settings' })).toHaveAttribute('href', '/settings');
   expect(container.textContent).not.toContain('@');
   await expectA11yClean(container);
 });
 it('keeps files mounted across Signals/board and replaces the panel only for destinations with subsections', async () => {
   const props = { id: 'workspace', label: 'Space navigation', spaceLabel: 'Space', filesLabel: 'Files', filesHref: '/files', spacePicker: { label: 'Space', spaces: [{ id: 'studio', name: 'Studio', signals: 3 }], value: 'studio', onValueChange: vi.fn() }, search: { label: 'Search in Studio', placeholder: 'Search' }, destinations: [{ id: 'signals', label: 'Signals', href: '/signals', icon: 'signals' as const }, { id: 'board', label: 'Kanban board', href: '/board', signals: 999, notifications: 999, icon: 'board' as const }, { id: 'future', label: 'Future', href: '/future', icon: 'explorer' as const, panel: <p>Future subsections</p> }], files: <a href="/files/research">Research</a>, account: { name: 'Avery Chen', initials: 'AC', settingsLabel: 'Account settings', settingsHref: '/settings' }, layout: { openLabel: 'Open navigation', resizeLabel: 'Resize navigation', description: 'Browse files' }, children: <p>Workspace</p> };
   const { rerender, container } = render(<WorkspaceNavigationRail {...props} currentDestination="signals" />);
   expect(screen.getByRole('link', { name: 'Signals' })).toHaveAttribute('aria-current', 'page');
   expect(screen.getByRole('link', { name: 'Research' })).toBeVisible();
   expect(container.textContent).not.toContain('999');
   rerender(<WorkspaceNavigationRail {...props} currentDestination="board" />);
   expect(screen.getByRole('link', { name: 'Research' })).toBeVisible();
   rerender(<WorkspaceNavigationRail {...props} currentDestination="future" />);
   expect(screen.queryByRole('link', { name: 'Research' })).toBeNull();
   expect(screen.getByText('Future subsections')).toBeVisible();
   expect(screen.getByRole('link', { name: 'Files' })).toHaveAttribute('href', '/files');
   rerender(<WorkspaceNavigationRail {...props} currentDestination="signals" />);
   expect(screen.getByRole('link', { name: 'Research' })).toBeVisible();
   rerender(<WorkspaceNavigationRail {...props} currentDestination="files" />);
   expect(screen.getByRole('link', { name: 'Files' })).toHaveAttribute('aria-current', 'page');
   expect(screen.getByRole('link', { name: 'Files' }).closest('.weft-navigation-row')).toHaveAttribute('data-current', 'true');
   await expectA11yClean(container);
 });
});
