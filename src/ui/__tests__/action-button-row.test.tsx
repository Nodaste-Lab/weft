// @vitest-environment jsdom
// D3 GUARD: dense mode and trailingLink slot
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import { ActionButtonRow } from '../action-button-row';
import { Button } from '../button';
import { expectA11yClean } from '../../test-support/ds-assert';

describe('ActionButtonRow', () => {
  it('renders accessible grouped actions', async () => {
    const { container } = render(
      <ActionButtonRow aria-label="Panel actions">
        <Button type="button">Copy</Button>
        <Button type="button" variant="secondary">Email</Button>
      </ActionButtonRow>,
    );

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    await expectA11yClean(container);
  });

  it('GUARD D3: dense prop sets data-dense attribute', () => {
    const { container } = render(
      <ActionButtonRow dense>
        <Button type="button">Act</Button>
      </ActionButtonRow>,
    );
    expect(container.querySelector('[data-slot="action-button-row"]')).toHaveAttribute('data-dense', 'true');
  });

  it('GUARD D3: trailingLink is pushed to trailing edge', () => {
    const { container } = render(
      <ActionButtonRow dense trailingLink={<a href="#">View all</a>}>
        <Button type="button">Primary</Button>
      </ActionButtonRow>,
    );
    const row = container.querySelector('[data-slot="action-button-row"]');
    // trailingLink wraps in ml-auto span as the last child
    const lastChild = row?.lastElementChild;
    expect(lastChild?.className).toContain('ml-auto');
    expect(screen.getByRole('link', { name: 'View all' })).toBeInTheDocument();
  });
});

// Structured rows retain button semantics and host-owned behavior.
describe('structured action hierarchy', () => {
  it('uses link-styled cancellation without submitting the form', async () => {
    cleanup();
    const cancel = vi.fn(); const save = vi.fn();
    const { container } = render(<form onSubmit={(event) => { event.preventDefault(); save(); }}>
      <ActionButtonRow variant="form" role="group" aria-label="Edit actions"
        secondaryAction={{ children: 'Cancel', onClick: cancel }}
        primaryAction={{ children: 'Save', type: 'submit' }} />
    </form>);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    expect(cancelButton.className).toContain('hover:underline');
    fireEvent.click(cancelButton); expect(cancel).toHaveBeenCalledOnce(); expect(save).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Save' })); expect(save).toHaveBeenCalledOnce();
    await expectA11yClean(container);
  });
  it('keeps composer DOM order and prevents sending while pending', () => {
    cleanup(); const send = vi.fn();
    render(<ActionButtonRow variant="composer" secondaryAction={{ children: 'Cancel' }}
      auxiliaryActions={<Button type="button" variant="outline">Attach</Button>}
      primaryAction={{ children: 'Send', loading: true, onClick: send }} />);
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Cancel', 'Attach', 'Send']);
    fireEvent.click(screen.getByRole('button', { name: 'Send' })); expect(send).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });
  it('keeps Back before Continue and dispatches their separate callbacks', () => {
    cleanup(); const back = vi.fn(); const next = vi.fn();
    render(<ActionButtonRow variant="navigation" secondaryAction={{ children: 'Back', onClick: back }} primaryAction={{ children: 'Continue', onClick: next }} />);
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Back', 'Continue']);
    fireEvent.click(screen.getByRole('button', { name: 'Back' })); expect(back).toHaveBeenCalledOnce(); expect(next).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' })); expect(next).toHaveBeenCalledOnce();
  });
});
