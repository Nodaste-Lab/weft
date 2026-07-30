// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TierGroup } from '../tier-group';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

describe('TierGroup', () => {
  it('renders a named region landmark with the label', async () => {
    const { container } = render(
      <TierGroup urgency="blocked" label="Act now">
        <div>row</div>
      </TierGroup>,
    );
    const section = screen.getByRole('region', { name: 'Act now' });
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-urgency', 'blocked');
    expectNoRawColors(container);
    await expectA11yClean(container);
  });

  it('renders count badge when count is provided', () => {
    const { container } = render(
      <TierGroup urgency="awaiting" label="Needs response" count={5}>
        <div>row</div>
      </TierGroup>,
    );
    const countBadge = container.querySelector('[data-slot="tier-group-count"]');
    expect(countBadge).not.toBeNull();
    expect(countBadge).toHaveTextContent('5');
  });

  it('omits count badge when count is not provided', () => {
    const { container } = render(
      <TierGroup urgency="fyi" label="Worth knowing">
        <div>row</div>
      </TierGroup>,
    );
    expect(container.querySelector('[data-slot="tier-group-count"]')).toBeNull();
  });

  it('renders subtitle when provided', () => {
    render(
      <TierGroup urgency="blocked" label="Act now" subtitle="unblocking required">
        <div>row</div>
      </TierGroup>,
    );
    expect(screen.getByText('unblocking required')).toBeInTheDocument();
  });

  it('GUARD: all urgency values set data-urgency correctly', () => {
    const urgencies = ['blocked', 'awaiting', 'fyi'] as const;
    urgencies.forEach((urgency) => {
      const { container } = render(
        <TierGroup urgency={urgency} label={urgency}>
          <div>x</div>
        </TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).toHaveAttribute(
        'data-urgency',
        urgency,
      );
    });
  });

  // ── Empty-shell guard ────────────────────────────────────────────────────────
  // The guard uses React.Children.toArray which flattens arrays and removes
  // null/undefined/boolean values. React.Children.count does NOT filter
  // these types when they appear in arrays, so toArray is the correct predicate.
  //
  // Known boundary: an empty fragment <></> is a React element and counts as
  // one node even though it renders nothing — the guard does not catch it.
  describe('empty-shell guard', () => {
    it('returns null when children is null', () => {
      const { container } = render(
        <TierGroup urgency="blocked" label="Blockers">{null}</TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
    });

    it('returns null when children is undefined', () => {
      const { container } = render(
        // @ts-expect-error — intentionally passing no children to test guard
        <TierGroup urgency="blocked" label="Blockers" />,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
    });

    it('returns null when children is false', () => {
      const { container } = render(
        <TierGroup urgency="blocked" label="Blockers">{false}</TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
    });

    it('returns null when children is an empty array', () => {
      const { container } = render(
        <TierGroup urgency="blocked" label="Blockers">{[]}</TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
    });

    it('returns null when all children are null/false/undefined in JSX', () => {
      const show = false;
      const { container } = render(
        <TierGroup urgency="blocked" label="Blockers">
          {null}
          {false}
          {show && <div>never</div>}
          {undefined}
        </TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
    });

    it('renders when at least one child is a real element', () => {
      const { container } = render(
        <TierGroup urgency="awaiting" label="Awaiting">
          {false}
          <div>real row</div>
          {null}
        </TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).not.toBeNull();
      expect(screen.getByText('real row')).toBeInTheDocument();
    });

    it('renders when children is a single element (not conditional)', () => {
      const { container } = render(
        <TierGroup urgency="fyi" label="FYI">
          <div>fyi row</div>
        </TierGroup>,
      );
      expect(container.querySelector('[data-slot="tier-group"]')).not.toBeNull();
    });
  });
});
