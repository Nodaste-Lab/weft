// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stack } from '../stack';

describe('Stack', () => {
  it('renders children in a vertical stack by default', () => {
    const { container } = render(
      <Stack>
        <span>First</span>
        <span>Second</span>
      </Stack>,
    );

    const stack = container.querySelector('[data-slot="stack"]');
    expect(stack).not.toBeNull();
    expect(stack).toHaveAttribute('data-direction', 'vertical');
    expect(stack).toHaveAttribute('data-gap', 'md');
    expect(stack).toHaveClass('flex', 'flex-col', 'gap-3');
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('supports bounded horizontal layout props', () => {
    const { container } = render(
      <Stack direction="horizontal" gap="lg" align="center" justify="between" wrap>
        <span>A</span>
        <span>B</span>
      </Stack>,
    );

    const stack = container.querySelector('[data-slot="stack"]');
    expect(stack).toHaveAttribute('data-direction', 'horizontal');
    expect(stack).toHaveAttribute('data-gap', 'lg');
    expect(stack).toHaveAttribute('data-align', 'center');
    expect(stack).toHaveAttribute('data-justify', 'between');
    expect(stack).toHaveAttribute('data-wrap', 'true');
    expect(stack).toHaveClass('flex-row', 'gap-4', 'items-center', 'justify-between', 'flex-wrap');
  });

  it('merges caller classes without dropping stack classes', () => {
    const { container } = render(<Stack className="rounded-md border">Content</Stack>);

    const stack = container.querySelector('[data-slot="stack"]');
    expect(stack).toHaveClass('flex', 'flex-col', 'rounded-md', 'border');
  });

  it('stays semantically neutral unless consumers pass semantics through', () => {
    const { container } = render(
      <Stack aria-label="Grouped controls">
        <button type="button">One</button>
        <button type="button">Two</button>
      </Stack>,
    );

    const stack = container.querySelector('[data-slot="stack"]');
    expect(stack).not.toHaveAttribute('role');
    expect(stack).not.toHaveAttribute('tabindex');
    expect(stack).toHaveAttribute('aria-label', 'Grouped controls');
  });

  it('preserves DOM order independent of visual layout props', () => {
    const { container } = render(
      <Stack direction="horizontal" justify="end" align="end" wrap>
        <button type="button">Alpha</button>
        <button type="button">Beta</button>
        <button type="button">Gamma</button>
      </Stack>,
    );

    const labels = Array.from(container.querySelectorAll('button')).map(
      (button) => button.textContent,
    );
    expect(labels).toEqual(['Alpha', 'Beta', 'Gamma']);
  });
});
