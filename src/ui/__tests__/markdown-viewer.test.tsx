// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownViewer } from '../markdown-viewer';

describe('MarkdownViewer', () => {
  it('renders Markdown to HTML in the Rendered view', () => {
    render(<MarkdownViewer markdown={'# Release notes\n\nShip it.'} />);

    expect(screen.getByRole('heading', { name: 'Release notes' })).toBeInTheDocument();
    expect(screen.getByText('Ship it.')).toBeInTheDocument();
  });

  it('exposes the raw Markdown via the Source toggle', () => {
    render(<MarkdownViewer markdown="# Release notes" />);

    // Rendered view strips the heading marker.
    expect(screen.queryByText('# Release notes')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'source' }));
    expect(screen.getByText('# Release notes')).toBeInTheDocument();
  });

  it('shows an empty state when there is no Markdown', () => {
    render(<MarkdownViewer markdown="" emptyLabel="No notes yet" />);

    expect(screen.getByText('No notes yet')).toBeInTheDocument();
  });
});
