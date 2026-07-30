// @vitest-environment jsdom
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { CopyableRef } from '../copyable-ref';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

const mockClipboard = (resolves = true) => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: resolves
        ? vi.fn().mockResolvedValue(undefined)
        : vi.fn().mockRejectedValue(new Error('denied')),
    },
    configurable: true,
    writable: true,
  });
};

describe('CopyableRef', () => {
  it('renders the full value in a code element', async () => {
    const { container } = render(<CopyableRef value="nod://ticket/1234" label="ticket" />);
    const code = container.querySelector('code');
    expect(code).not.toBeNull();
    expect(code).toHaveTextContent('nod://ticket/1234');
    expectNoRawColors(container);
    await expectA11yClean(container);
  });

  it('renders children override instead of value when provided', () => {
    render(
      <CopyableRef value="nod://ticket/1234">
        <span>Ticket #1234</span>
      </CopyableRef>,
    );
    expect(screen.getByText('Ticket #1234')).toBeInTheDocument();
  });

  it('copy button has accessible label including the label prop', () => {
    render(<CopyableRef value="nod://ticket/1234" label="ticket ID" />);
    expect(screen.getByRole('button', { name: 'Copy ticket ID' })).toBeInTheDocument();
  });

  it('button is type=button so keyboard Enter does not submit forms', () => {
    render(<CopyableRef value="nod://ticket/1234" label="ref" />);
    expect(screen.getByRole('button', { name: 'Copy ref' })).toHaveAttribute('type', 'button');
  });

  it('code element displays the full value string (not truncated in the DOM)', () => {
    const longVal = 'nod://ticket/NOD-99999-very-long-canonical-ref';
    const { container } = render(<CopyableRef value={longVal} label="ref" />);
    expect(container.querySelector('code')).toHaveTextContent(longVal);
  });

  describe('clipboard interactions', () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('shows Copied after successful copy and reverts to idle after 1.5s', async () => {
      mockClipboard(true);
      vi.useFakeTimers();
      render(<CopyableRef value="nod://ticket/1234" label="ref" />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Copy ref' }));
      });
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(1500); });
      expect(screen.getByRole('button', { name: 'Copy ref' })).toBeInTheDocument();
    });

    it('shows Failed when clipboard write rejects and reverts after 1.5s', async () => {
      mockClipboard(false);
      vi.useFakeTimers();
      render(<CopyableRef value="nod://ticket/1234" label="ref" />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Copy ref' }));
      });
      expect(screen.getByRole('button', { name: 'Failed' })).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(1500); });
      expect(screen.getByRole('button', { name: 'Copy ref' })).toBeInTheDocument();
    });

    it('data-copy-state reflects idle → success → idle lifecycle', async () => {
      mockClipboard(true);
      vi.useFakeTimers();
      const { container } = render(<CopyableRef value="abc" label="ref" />);
      const root = container.querySelector('[data-slot="copyable-ref"]');
      expect(root).toHaveAttribute('data-copy-state', 'idle');

      await act(async () => { fireEvent.click(screen.getByRole('button')); });
      expect(root).toHaveAttribute('data-copy-state', 'success');

      act(() => { vi.advanceTimersByTime(1500); });
      expect(root).toHaveAttribute('data-copy-state', 'idle');
    });

    it('repeat click before revert restarts the 1.5s window from the second click', async () => {
      mockClipboard(true);
      vi.useFakeTimers();
      render(<CopyableRef value="abc" label="ref" />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Copy ref' }));
      });
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

      // 800ms in, click again — resets the 1.5s window
      act(() => { vi.advanceTimersByTime(800); });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Copied' }));
      });

      // 800ms after the second click: still Copied (window not expired)
      act(() => { vi.advanceTimersByTime(800); });
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

      // 700ms more (total 1500ms from second click): reverts
      act(() => { vi.advanceTimersByTime(700); });
      expect(screen.getByRole('button', { name: 'Copy ref' })).toBeInTheDocument();
    });

    it('overlapping rapid clicks: only the last generation result is committed', async () => {
      // First write is slow; second write resolves immediately.
      // The first write's result must be suppressed by the generation check.
      let resolveFirst!: () => void;
      const firstWrite = new Promise<void>((res) => { resolveFirst = res; });
      let callCount = 0;
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockImplementation(() => {
            callCount++;
            return callCount === 1 ? firstWrite : Promise.resolve();
          }),
        },
        configurable: true,
        writable: true,
      });

      vi.useFakeTimers();
      render(<CopyableRef value="abc" label="ref" />);

      // First click — write is pending
      fireEvent.click(screen.getByRole('button', { name: 'Copy ref' }));

      // Second click while first is still pending — resolves immediately
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Copy ref' }));
      });
      // Second write resolved → Copied is showing
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

      // Now resolve the first write — its generation is stale, result must be suppressed
      await act(async () => { resolveFirst(); });
      // Still Copied (first write suppressed), not re-triggered to Copied again
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(1500); });
      expect(screen.getByRole('button', { name: 'Copy ref' })).toBeInTheDocument();
    });

    it('unmount during pending write: cleanup invalidates the generation so no revert timer is scheduled', async () => {
      // Observable invariant: if the generation check passes, setTimeout is called
      // to schedule the revert. If the generation was invalidated by unmount cleanup,
      // setTimeout is NOT called. We spy on setTimeout to distinguish the two cases.
      let resolveWrite!: () => void;
      const pendingWrite = new Promise<void>((res) => { resolveWrite = res; });
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: vi.fn().mockReturnValue(pendingWrite) },
        configurable: true,
        writable: true,
      });

      vi.useFakeTimers();
      const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
      const { unmount } = render(<CopyableRef value="abc" label="ref" />);

      // Click — starts the async write
      fireEvent.click(screen.getByRole('button', { name: 'Copy ref' }));
      const callsAfterClick = setTimeoutSpy.mock.calls.length;

      // Unmount — should increment genRef, invalidating the in-flight generation
      unmount();

      // Resolve the write — the generation check must fail → no setState → no setTimeout
      await act(async () => { resolveWrite(); });

      // setTimeout must not have been called again after click and unmount
      expect(setTimeoutSpy.mock.calls.length).toBe(callsAfterClick);
    });
  });
});
