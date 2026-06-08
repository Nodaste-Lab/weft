// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KnowledgeSearchResultRow } from '../knowledge-search-result-row';

const result = {
  id: '1',
  title: 'Tomb Notes',
  path: 'session/tomb.md',
  excerpt: 'The party found a seal…',
  relevance: 82,
  categories: ['session'],
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
    expect(screen.getByRole('link', { name: /open tomb notes in obsidian/i })).toHaveAttribute(
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

  it('renders display labels for preserved category ids', () => {
    render(
      <KnowledgeSearchResultRow
        result={{ ...result, categories: ['lore'] }}
        obsidianHref="#"
        isBrowseMode
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    );
    expect(screen.getByText('Knowledge')).toBeInTheDocument();
    expect(screen.queryByText('lore')).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: /copy path session\/tomb/i }));
    expect(onCopyPath).toHaveBeenCalled();
  });
});
