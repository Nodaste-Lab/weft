// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoreSearchResultRow } from '../lore-search-result-row';

const result = {
  id: '1',
  title: 'Tomb Notes',
  path: 'session/tomb.md',
  excerpt: 'The party found a seal…',
  relevance: 82,
  categories: ['session'],
};

describe('LoreSearchResultRow', () => {
  it('renders data-slot and open link', () => {
    const { container } = render(
      <LoreSearchResultRow
        result={result}
        obsidianHref="obsidian://open"
        isBrowseMode={false}
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    );
    expect(container.querySelector('[data-slot="lore-search-result-row"]')).toBeTruthy();
    expect(screen.getByRole('link', { name: /open tomb notes in obsidian/i })).toHaveAttribute(
      'href',
      'obsidian://open',
    );
  });

  it('hides relevance bar in browse mode', () => {
    render(
      <LoreSearchResultRow
        result={result}
        obsidianHref="#"
        isBrowseMode
        copiedPath={null}
        onCopyPath={() => undefined}
      />
    );
    expect(screen.queryByText('82%')).not.toBeInTheDocument();
  });

  it('calls onCopyPath when copy is clicked', () => {
    const onCopyPath = vi.fn();
    render(
      <LoreSearchResultRow
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
