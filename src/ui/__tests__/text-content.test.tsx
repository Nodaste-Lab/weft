// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextContent } from '../text-content';

describe('TextContent', () => {
  it('renders readable body copy by default', () => {
    const { container } = render(<TextContent>Generated briefing copy</TextContent>);

    const text = container.querySelector('[data-slot="text-content"]');
    expect(text).not.toBeNull();
    expect(text?.tagName).toBe('P');
    expect(text).toHaveAttribute('data-size', 'default');
    expect(text).toHaveAttribute('data-weight', 'regular');
    expect(text).toHaveAttribute('data-tone', 'default');
    expect(text).toHaveAttribute('data-measure', 'default');
    expect(text).toHaveClass('text-sm', 'font-normal', 'max-w-prose');
    expect(screen.getByText('Generated briefing copy')).toBeInTheDocument();
  });

  it('supports bounded typography variants', () => {
    const { container } = render(
      <TextContent size="lg" weight="semibold" tone="strong" measure="narrow">
        Important generated copy
      </TextContent>,
    );

    const text = container.querySelector('[data-slot="text-content"]');
    expect(text).toHaveAttribute('data-size', 'lg');
    expect(text).toHaveAttribute('data-weight', 'semibold');
    expect(text).toHaveAttribute('data-tone', 'strong');
    expect(text).toHaveAttribute('data-measure', 'narrow');
    expect(text).toHaveClass('text-base', 'font-semibold', 'text-[var(--hud-text-1)]', 'max-w-[48ch]');
  });

  it('merges caller classes without dropping text content classes', () => {
    const { container } = render(
      <TextContent className="rounded-md border">Copy with custom chrome</TextContent>,
    );

    const text = container.querySelector('[data-slot="text-content"]');
    expect(text).toHaveClass('text-sm', 'rounded-md', 'border');
  });

  it('stays semantically neutral and passes consumer semantics through', () => {
    const { container } = render(
      <TextContent aria-label="Generated summary">Summary text</TextContent>,
    );

    const text = container.querySelector('[data-slot="text-content"]');
    expect(text).not.toHaveAttribute('role');
    expect(text).not.toHaveAttribute('tabindex');
    expect(text).toHaveAttribute('aria-label', 'Generated summary');
  });

  it('allows consumers to provide semantic elements without choosing heading levels', () => {
    render(
      <TextContent asChild size="lg" weight="semibold">
        <h2>Session summary</h2>
      </TextContent>,
    );

    const heading = screen.getByRole('heading', { level: 2, name: 'Session summary' });
    expect(heading).toHaveAttribute('data-slot', 'text-content');
    expect(heading).toHaveAttribute('data-size', 'lg');
  });
});
