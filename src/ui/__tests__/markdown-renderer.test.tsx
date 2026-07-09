// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkDownRenderer } from '../markdown-renderer';

describe('MarkDownRenderer', () => {
  it('renders supported markdown with semantic structure', () => {
    const { container } = render(
      <MarkDownRenderer
        markdown={[
          '# Morning Summary',
          '',
          'The party found `three clues` near the east gate.',
          '',
          '- safe item',
          '- follow-up item',
        ].join('\n')}
      />,
    );

    expect(container.querySelector('[data-slot="markdown-renderer"]')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: 'Morning Summary' })).toBeInTheDocument();
    expect(screen.getByText(/The party found/)).toBeInTheDocument();
    expect(screen.getByText('three clues')).toHaveAttribute('data-slot', 'markdown-renderer-inline-code');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('safe item')).toBeInTheDocument();
    expect(screen.getByText('follow-up item')).toBeInTheDocument();
  });

  it('allows safe links and blocks unsafe URL protocols', () => {
    render(
      <MarkDownRenderer
        markdown={[
          '[safe](https://example.com)',
          '[relative](/notes/today)',
          '[bad](javascript:alert(1))',
          '[data](data:text/html,evil)',
          '[file](file://example.invalid/secret)',
        ].join('\n')}
      />,
    );

    expect(screen.getByRole('link', { name: 'safe' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByRole('link', { name: 'relative' })).toHaveAttribute('href', '/notes/today');
    expect(screen.getByText('bad')).toHaveAttribute('data-blocked-href', 'true');
    expect(screen.getByText('data')).toHaveAttribute('data-blocked-href', 'true');
    expect(screen.getByText('file')).toHaveAttribute('data-blocked-href', 'true');
  });

  it('renders fenced code through CodeBlock', () => {
    const { container } = render(
      <MarkDownRenderer markdown={'```ts\nconst answer = 42;\n```'} />,
    );

    const codeBlock = container.querySelector('[data-slot="code-block"]');
    expect(codeBlock).not.toBeNull();
    expect(codeBlock).toHaveAttribute('data-language', 'ts');
    expect(within(codeBlock as HTMLElement).getByText(/const answer = 42;/)).toBeInTheDocument();
  });

  it('preserves language-less fenced code formatting', () => {
    const { container } = render(
      <MarkDownRenderer markdown={'```\nline one\n  indented line\n```'} />,
    );

    const codeBlock = container.querySelector('[data-slot="code-block"]');
    expect(codeBlock).not.toBeNull();
    expect(codeBlock).not.toHaveAttribute('data-language');
    expect((codeBlock as HTMLElement).querySelector('[data-slot="code-block-code"]')?.textContent).toBe('line one\n  indented line');
    expect(container.querySelector('[data-slot="markdown-renderer-inline-code"]')).toBeNull();
  });

  it('preserves angle-bracket prose while skipping raw HTML content', () => {
    render(
      <MarkDownRenderer markdown="The type is Map<String, Int> and the placeholder is <your-api-key>." />,
    );

    expect(screen.getByText(/The type is Map/)).toHaveTextContent('The type is Map<String, Int> and the placeholder is <your-api-key>.');
  });

  it('preserves paired XML-like prose while removing known raw HTML pairs', () => {
    render(
      <MarkDownRenderer markdown="Use <foo>value</foo> as prose before <script>alert(1)</script>." />,
    );

    expect(screen.getByText(/Use/)).toHaveTextContent('Use <foo>value</foo> as prose before .');
    expect(screen.queryByText('alert(1)')).not.toBeInTheDocument();
  });

  it('blocks images and skips raw HTML content', () => {
    const { container } = render(
      <MarkDownRenderer
        markdown={[
          '![Map preview](https://example.com/map.png)',
          '<button onclick="alert(1)">unsafe</button>',
          '<script>',
          'alert(1)',
          '</script>',
          '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
        ].join('\n')}
      />,
    );

    expect(screen.getByText('[image: Map preview]')).toHaveAttribute('data-blocked-image', 'true');
    expect(screen.queryByText('unsafe')).not.toBeInTheDocument();
    expect(screen.queryByText('alert(1)')).not.toBeInTheDocument();
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('button')).toBeNull();
  });

  it('merges caller classes onto the renderer root', () => {
    const { container } = render(
      <MarkDownRenderer markdown="Plain body" className="rounded-md border" />,
    );

    const root = container.querySelector('[data-slot="markdown-renderer"]');
    expect(root).toHaveClass('rounded-md', 'border');
  });
});
