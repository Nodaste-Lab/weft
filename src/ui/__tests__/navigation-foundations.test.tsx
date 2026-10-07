// @vitest-environment jsdom
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavigationRow, NavigationRowLink, NavigationRowDisclosure } from '../navigation-row';
import { NavigationIcon, NavigationItemIcon } from '../navigation-icon';
import { NavigationCount } from '../navigation-count';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('Navigation foundations', () => {
  it('keeps disclosure separate from a native current-page destination', async () => {
    const expand = vi.fn();
    const { container } = render(<nav aria-label="Files"><NavigationRow current hierarchical depth={2} density="compact">
      <NavigationRowDisclosure name="Research" expanded={false} onClick={expand} />
      <NavigationRowLink href="/files/research" aria-current="page">Research</NavigationRowLink>
    </NavigationRow></nav>);
    fireEvent.click(screen.getByRole('button', { name: 'Expand Research' }));
    expect(expand).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Research' })).toHaveAttribute('href', '/files/research');
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('[role="treeitem"]')).toBeNull();
    expect(container.querySelector('.weft-navigation-row')?.getAttribute('style')).toContain('2 * var(--weft-navigation-indent)');
    await expectA11yClean(container);
  });
  it('hides invalid counts and restricts notifications even for JavaScript callers', () => {
    const { container } = render(<><NavigationCount count={0} name="Zero" scope="file" />
      <NavigationCount count={NaN} name="Bad" scope="file" />
      <NavigationCount count={2.5} name="Fraction" scope="file" />
      <NavigationCount {...({ count: 4, name: 'Forbidden', scope: 'file', kind: 'notifications' } as any)} />
      <NavigationCount count={3} name="Research" scope="file" />
      <NavigationCount count={5} name="Studio" scope="signals-destination" kind="notifications" /></>);
    expect(container.querySelectorAll('[role="img"]')).toHaveLength(2);
    expect(screen.getByRole('img', { name: '3 signals awaiting action for Research' })).toBeVisible();
    expect(screen.getByRole('img', { name: '5 total notifications in Studio' })).toBeVisible();
  });
  it('uses singular signal and notification labels', () => {
    render(<><NavigationCount count={1} name="Research" scope="file" /><NavigationCount count={1} name="Studio" scope="signals-destination" kind="notifications" /></>);
    expect(screen.getByRole('img', { name: '1 signal awaiting action for Research' })).toBeVisible();
    expect(screen.getByRole('img', { name: '1 total notification in Studio' })).toBeVisible();
  });
  it('suppresses unsupported statuses and keeps base glyphs decorative', () => {
    const { rerender, container } = render(<NavigationItemIcon purpose="folder" listening locked />);
    expect(screen.queryByRole('img', { name: 'Listening' })).toBeNull();
    expect(screen.getByRole('img', { name: 'Locked' })).toBeVisible();
    rerender(<NavigationItemIcon purpose="text" listening locked />);
    expect(screen.getByRole('img', { name: 'Listening' })).toBeVisible();
    rerender(<NavigationIcon purpose="board" />);
    expect(container.querySelectorAll('rect')).toHaveLength(3);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden','true');
  });
});
