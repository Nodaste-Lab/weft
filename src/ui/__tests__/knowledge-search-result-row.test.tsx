// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KnowledgeSearchResultRow } from '../knowledge-search-result-row';

const result = {
  id: '1',
  title: 'Launch Notes',
  path: 'meetings/launch.md',
  excerpt: 'The team confirmed the launch plan…',
  relevance: 82,
  categories: ['meetings'],
};

describe('KnowledgeSearchResultRow', () => {
  it('renders data-slot and open link', () => {
    const { container } = render(
      <KnowledgeSearchResultRow
        result={result}
        obsidianHref="obsidian://open"
        isBrowseMode={false}
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    );
    expect(container.querySelector('[data-slot="knowledge-search-result-row"]')).toBeTruthy();
    expect(screen.getByRole('link', { name: /open launch notes in obsidian/i })).toHaveAttribute(
      'href',
      'obsidian://open',
    );
  });

  it('hides relevance bar in browse mode', () => {
    render(
      <KnowledgeSearchResultRow
        result={result}
        obsidianHref="#"
        isBrowseMode
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    );
    expect(screen.queryByText('82%')).not.toBeInTheDocument();
  });

  it('renders display labels for category ids', () => {
    render(
      <KnowledgeSearchResultRow
        result={{ ...result, categories: ['reference'] }}
        obsidianHref="#"
        isBrowseMode
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    );
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.queryByText('reference')).not.toBeInTheDocument();
  });

  it('calls onCopyPath when copy is clicked', () => {
    const onCopyPath = vi.fn();
    render(
      <KnowledgeSearchResultRow
        result={result}
        obsidianHref="#"
        isBrowseMode={false}
        copiedPath={null}
        onCopyPath={onCopyPath}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /copy path meetings\/launch/i }));
    expect(onCopyPath).toHaveBeenCalled();
  });
});
