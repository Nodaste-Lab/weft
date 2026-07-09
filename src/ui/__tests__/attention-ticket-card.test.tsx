// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AttentionTicketCard } from '../attention-ticket-card';

describe('AttentionTicketCard', () => {
  it('renders data-slot and toggles', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <AttentionTicketCard
        reasonLabel="Mention"
        reasonColor="var(--hud-positive)"
        timestampLabel="1m ago"
        title="Ticket A"
        reasonText="You were mentioned"
        expanded={false}
        onToggle={onToggle}
      />
    );
    expect(container.querySelector('[data-slot="attention-ticket-card"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /ticket a/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows children when expanded', () => {
    render(
      <AttentionTicketCard
        reasonLabel="Update"
        reasonColor="var(--hud-text-2)"
        timestampLabel="now"
        title="T"
        reasonText="R"
        expanded
        onToggle={() => {}}
      >
        <span data-testid="thread">inside</span>
      </AttentionTicketCard>
    );
    expect(screen.getByTestId('thread')).toBeInTheDocument();
  });
});
