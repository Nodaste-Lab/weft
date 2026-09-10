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
  // The guard walks children with countRenderable rather than a bare
  // React.Children.count: count does not filter null/undefined/booleans inside
  // arrays, keeps the numeric zero from `{items.length && rows}`, and treats a
  // fragment as one node however empty it is. Each of those shapes is covered
  // below, because each of them previously rendered a headed, rowless tier.
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

  // Regression (review round 4): React.Children.toArray keeps 0 and "", so the
  // common `{items.length && rows}` idiom rendered a visible "0" inside an
  // otherwise-empty tier — exactly the "all clear" misread D12 forbids.
  it('GUARD D12: renders null for numeric-zero children', () => {
    const items: string[] = [];
    const { container } = render(
      <TierGroup urgency="blocked" label="Blockers">{items.length && <div>row</div>}</TierGroup>,
    );
    expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
    expect(container.textContent).toBe('');
  });

  it('GUARD D12: renders null for empty-string children', () => {
    const { container } = render(
      <TierGroup urgency="fyi" label="FYI">{''}</TierGroup>,
    );
    expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
  });

  // Regression (review round 5): an empty fragment is one child to
  // React.Children, so <>{items.map(...)}</> with no items rendered a headed
  // tier with no rows — the exact "all clear" misread D12 forbids.
  it('GUARD D12: renders null for an empty fragment of mapped rows', () => {
    const items: string[] = [];
    const { container } = render(
      <TierGroup urgency="awaiting" label="Awaiting you">
        <>{items.map((i) => <div key={i}>{i}</div>)}</>
      </TierGroup>,
    );
    expect(container.querySelector('[data-slot="tier-group"]')).toBeNull();
  });

  it('still renders when a fragment contains real rows', () => {
    const items = ['a'];
    const { container } = render(
      <TierGroup urgency="awaiting" label="Awaiting you">
        <>{items.map((i) => <div key={i}>{i}</div>)}</>
      </TierGroup>,
    );
    expect(container.querySelector('[data-slot="tier-group"]')).not.toBeNull();
    expect(container.textContent).toContain('a');
  });

  it("derives the tier dot from urgency, matching the plain-CSS contract", () => {
    // The pairing blocked/stop, awaiting/warn, fyi/info is enforced for
    // plain-CSS markup by test:template-contract. Before this, <TierGroup>
    // rendered no dot at all and offered no slot for one, so a React consumer
    // could not satisfy the documented rule without rebuilding the header.
    // Deriving it from `urgency` makes the two surfaces agree by construction.
    for (const [urgency, tone] of [["blocked", "stop"], ["awaiting", "warn"], ["fyi", "info"]] as const) {
      const { container, unmount } = render(
        <TierGroup urgency={urgency} label="Tier">
          <div>row</div>
        </TierGroup>,
      );
      const dot = container.querySelector('[data-slot="dot"]');
      expect(dot, `${urgency} tier must render its own dot`).not.toBeNull();
      expect(dot).toHaveAttribute("data-tone", tone);
      // Decorative: the tier already carries an accessible name via aria-label.
      expect(dot).toHaveAttribute("aria-hidden");
      unmount();
    }
  });
});
