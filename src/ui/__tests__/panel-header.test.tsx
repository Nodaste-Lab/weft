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
});
