// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PanelHeader, PanelHeaderActions, PanelHeaderDismiss, PanelHeaderTitle } from '../panel-header';
import { Button } from '../button';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('PanelHeader', () => {
  it('renders title, actions, and dismiss control accessibly', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <PanelHeader>
        <PanelHeaderTitle>Brief</PanelHeaderTitle>
        <PanelHeaderActions>
          <Button type="button" variant="secondary">Refresh</Button>
          <PanelHeaderDismiss onClick={onDismiss} />
        </PanelHeaderActions>
      </PanelHeader>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    await expectA11yClean(container);
  });

  it('GUARD D10: board size sets data-size="board"', () => {
    const { container } = render(
      <PanelHeader size="board">
        <PanelHeaderTitle size="board">Operator Board</PanelHeaderTitle>
      </PanelHeader>,
    );
    expect(container.querySelector('[data-slot="panel-header"]')).toHaveAttribute('data-size', 'board');
  });

  it('GUARD D10: default size does not set data-size', () => {
    const { container } = render(<PanelHeader><PanelHeaderTitle>Title</PanelHeaderTitle></PanelHeader>);
    expect(container.querySelector('[data-slot="panel-header"]')).not.toHaveAttribute('data-size');
  });
});
