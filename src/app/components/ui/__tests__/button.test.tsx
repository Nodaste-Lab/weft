// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button';

describe('Button interaction states', () => {
  it('keeps blocked buttons clickable so callers can explain the missing input', () => {
    const onClick = vi.fn();

    render(
      <Button blocked onClick={onClick}>
        Send email to support
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Send email to support' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-state', 'blocked');
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass('bg-muted/30', 'text-muted-foreground');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('uses native disabled semantics for hard-disabled buttons', () => {
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save changes' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-state', 'disabled');
    expect(button).toHaveClass('bg-muted/30', 'text-muted-foreground');

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks loading buttons busy and non-interactive with a spinner', () => {
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Preparing
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Preparing' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-state', 'loading');
    expect(button.querySelector('svg')).toHaveClass('animate-spin');

    fireEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('gives loading precedence over blocked', () => {
    render(
      <Button blocked loading>
        Exporting
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Exporting' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-state', 'loading');
    expect(button).not.toHaveAttribute('aria-disabled');
  });

  it('keeps asChild compatible with Radix Slot single-child semantics', () => {
    render(
      <Button asChild>
        <a href="/settings">Open settings</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Open settings' });
    expect(link).toHaveAttribute('href', '/settings');
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).toHaveAttribute('data-state', 'idle');
  });
});
