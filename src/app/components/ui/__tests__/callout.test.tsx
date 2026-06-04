// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Callout } from '../callout';

describe('Callout', () => {
  it('preserves the existing inline callout shell behavior', () => {
    const { container } = render(
      <Callout title="Recap queued" className="custom-callout">
        Generation will resume next time this mode opens.
      </Callout>,
    );

    const callout = container.querySelector('[data-slot="callout"]');
    expect(callout).not.toBeNull();
    expect(callout).toHaveAttribute('data-variant', 'inline');
    expect(callout).toHaveAttribute('data-tone', 'info');
    expect(callout).toHaveAttribute('role', 'status');
    expect(callout).toHaveClass('custom-callout');
    expect(screen.getByText('Recap queued')).toBeInTheDocument();
    expect(screen.getByText(/Generation will resume/)).toBeInTheDocument();
  });

  it('renders the text variant with Weft text treatment', () => {
    const { container } = render(
      <Callout variant="text" title="Client handoff">
        Keep the summary short, cite the source note, and show the next action.
      </Callout>,
    );

    const callout = container.querySelector('[data-slot="callout"]');
    const content = container.querySelector('[data-slot="callout-text-content"]');

    expect(callout).toHaveAttribute('data-variant', 'text');
    expect(content).not.toBeNull();
    expect(content).toHaveAttribute('data-measure', 'wide');
    expect(content).toHaveTextContent('Keep the summary short');
  });

  it('renders markdown through MarkDownRenderer and inherits its safety policy', () => {
    const { container } = render(
      <Callout
        variant="text"
        tone="warning"
        title="Review generated notes"
        markdown={[
          'Check the [source note](/vault/session-12) before sharing.',
          '',
          '<button onclick="alert(1)">unsafe</button>',
          '![Map](https://example.com/map.png)',
        ].join('\n')}
      />,
    );

    const callout = screen.getByRole('alert');
    const renderer = container.querySelector('[data-slot="markdown-renderer"]');

    expect(callout).toHaveAttribute('aria-live', 'assertive');
    expect(renderer).not.toBeNull();
    expect(screen.getByRole('link', { name: 'source note' })).toHaveAttribute('href', '/vault/session-12');
    expect(screen.queryByText('unsafe')).not.toBeInTheDocument();
    expect(screen.getByText('[image: Map]')).toHaveAttribute('data-blocked-image', 'true');
  });

  it('prefers caller-owned children over markdown when both are provided', () => {
    render(
      <Callout variant="text" markdown="Markdown body">
        Caller-owned body
      </Callout>,
    );

    expect(screen.getByText('Caller-owned body')).toBeInTheDocument();
    expect(screen.queryByText('Markdown body')).not.toBeInTheDocument();
  });

  it('supports action content without making the whole callout interactive', () => {
    const { container } = render(
      <Callout
        variant="text"
        title="Add provider key"
        action={<button type="button">Open settings</button>}
      >
        Add an API key before starting transcription.
      </Callout>,
    );

    const callout = container.querySelector('[data-slot="callout"]');
    const action = container.querySelector('[data-slot="callout-action"]');

    expect(callout?.tagName).toBe('DIV');
    expect(action).not.toBeNull();
    expect(within(action as HTMLElement).getByRole('button', { name: 'Open settings' })).toBeInTheDocument();
  });
});
