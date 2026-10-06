// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { NavigationRail } from '../navigation-rail';
import {
  navigationRailCurrentSpaceId,
  navigationRailLabels,
  navigationRailNavigation,
  navigationRailProfile,
  navigationRailSpaces,
  navigationRailTree,
  navigationRailTreeLabel,
} from '../navigation-rail.fixture';
import { expectA11yClean } from '../../test-support/ds-assert';

function renderFixture(overrides: Partial<React.ComponentProps<typeof NavigationRail>> = {}) {
  return render(
    <NavigationRail
      spaces={navigationRailSpaces}
      currentSpaceId={navigationRailCurrentSpaceId}
      navigation={navigationRailNavigation}
      treeLabel={navigationRailTreeLabel}
      tree={navigationRailTree}
      profile={navigationRailProfile}
      labels={navigationRailLabels}
      onCreate={() => {}}
      {...overrides}
    />,
  );
}

describe('NavigationRail template', () => {
  it('renders the fixture accessibly', async () => {
    const { container } = renderFixture();
    expect(screen.getByRole('combobox', { name: 'Space' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Documents/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Create document' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Document actions for Onboarding checklist' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Avery Chen/ })).toBeInTheDocument();
    await expectA11yClean(container);
  });

  it('always carries a named trigger in the main column, so an off-canvas rail can be opened', () => {
    renderFixture();
    const trigger = screen.getByRole('button', { name: 'Toggle navigation' });
    expect(trigger.closest('[data-slot="navigation-rail-bar"]')).not.toBeNull();
  });

  it('shows a navigation count as a badge', () => {
    renderFixture();
    const signals = screen.getByRole('link', { name: /Signals/ }).closest('li');
    expect(signals).not.toBeNull();
    expect(within(signals as HTMLElement).getByText('1')).toHaveAttribute('data-sidebar', 'menu-badge');
  });

  it('expands a folder to reveal its children', () => {
    renderFixture();
    expect(screen.queryByRole('link', { name: /Acme — notes/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'CRM records' }));
    expect(screen.getByRole('link', { name: /Acme — notes/ })).toBeInTheDocument();
  });

  it('row actions are revealed on hover and on focus-within, and report the node', () => {
    const onNodeAction = vi.fn();
    renderFixture({ onNodeAction });
    const action = screen.getByRole('button', { name: 'Document actions for Legal' });
    expect(action.className).toMatch(/group-focus-within\/menu-item:opacity-100/);
    expect(action.className).toMatch(/group-hover\/menu-item:opacity-100/);
    fireEvent.click(action);
    expect(onNodeAction).toHaveBeenCalledWith(expect.objectContaining({ id: 'legal' }));
  });

  it('ships no fixture content as a default (honest empties)', () => {
    render(
      <NavigationRail
        spaces={[]}
        currentSpaceId=""
        navigation={[]}
        treeLabel=""
        tree={[]}
        profile={{ name: '', email: '', initials: '', href: '#' }}
        labels={navigationRailLabels}
      />,
    );
    expect(screen.queryByRole('button', { name: /Document actions/ })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Create document' })).toBeNull();
    expect(screen.queryByText('Private')).toBeNull();
    expect(screen.queryByText(/example\.com/)).toBeNull();
  });
});
