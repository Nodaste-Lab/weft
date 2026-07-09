// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from '../code-block';

describe('CodeBlock', () => {
  it('renders plain text code with pre and code semantics by default', () => {
    const { container } = render(<CodeBlock code={'const answer = 42;'} />);

    const block = container.querySelector('[data-slot="code-block"]');
    const pre = container.querySelector('[data-slot="code-block-pre"]');
    const code = container.querySelector('[data-slot="code-block-code"]');

    expect(block).not.toBeNull();
    expect(pre?.tagName).toBe('PRE');
    expect(code?.tagName).toBe('CODE');
    expect(code).toHaveTextContent('const answer = 42;');
    expect(block).toHaveAttribute('data-density', 'default');
    expect(block).toHaveAttribute('data-wrap', 'false');
    expect(pre).toHaveClass('overflow-x-auto', 'whitespace-pre');
  });

  it('renders optional label and language metadata', () => {
    const { container } = render(
      <CodeBlock label="Install command" language="shell" code="npm run dev" />,
    );

    expect(screen.getByText('Install command')).toBeInTheDocument();
    expect(screen.getByText('shell')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="code-block"]')).toHaveAttribute('data-language', 'shell');
    expect(container.querySelector('[data-slot="code-block-label"]')).toHaveTextContent('Install command');
    expect(container.querySelector('[data-slot="code-block-language"]')).toHaveTextContent('shell');
  });

  it('supports bounded wrapping and density variants', () => {
    const { container } = render(
      <CodeBlock code="long line" wrap density="compact" className="rounded-md" />,
    );

    const block = container.querySelector('[data-slot="code-block"]');
    const pre = container.querySelector('[data-slot="code-block-pre"]');
    expect(block).toHaveAttribute('data-density', 'compact');
    expect(block).toHaveAttribute('data-wrap', 'true');
    expect(block).toHaveClass('rounded-md');
    expect(pre).toHaveClass('whitespace-pre-wrap', 'break-words', 'p-2');
  });

  it('renders no implicit interactive control when no copy handler is provided', () => {
    const { container } = render(<CodeBlock code="readonly" />);

    expect(container.querySelector('[data-slot="code-block-copy"]')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders an accessible copy affordance when requested', () => {
    const onCopy = vi.fn();
    render(<CodeBlock code="copy me" onCopy={onCopy} copyLabel="Copy snippet" />);

    const button = screen.getByRole('button', { name: 'Copy snippet' });
    expect(button).toHaveAttribute('data-slot', 'code-block-copy');
    fireEvent.click(button);
    expect(onCopy).toHaveBeenCalledWith('copy me');
  });
});
