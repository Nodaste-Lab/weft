// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContentViewer } from '../content-viewer';

describe('ContentViewer', () => {
  it('renders the Rendered view by default and toggles to Source', () => {
    render(
      <ContentViewer source={'# Heading\n\nbody'} sourceLanguage="markdown">
        <p>rendered-output</p>
      </ContentViewer>,
    );

    // Rendered view is shown first; the raw source is not.
    expect(screen.getByText('rendered-output')).toBeInTheDocument();
    expect(screen.queryByText(/# Heading/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'source' }));

    // Source view shows the raw text and hides the rendered output.
    expect(screen.getByText(/# Heading/)).toBeInTheDocument();
    expect(screen.queryByText('rendered-output')).not.toBeInTheDocument();
  });

  it('honors defaultView="source"', () => {
    render(
      <ContentViewer source="raw-source-text" defaultView="source">
        <p>rendered-output</p>
      </ContentViewer>,
    );

    expect(screen.getByText('raw-source-text')).toBeInTheDocument();
    expect(screen.queryByText('rendered-output')).not.toBeInTheDocument();
  });

  it('shows an empty state (and hides the toolbar) for blank source', () => {
    render(
      <ContentViewer source="   " emptyLabel="Nothing here">
        <p>rendered-output</p>
      </ContentViewer>,
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.queryByText('rendered-output')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'source' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy source' })).not.toBeInTheDocument();
  });

  it('copies the source and fires onCopySource', () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopySource = vi.fn();

    render(
      <ContentViewer source="copy-me" onCopySource={onCopySource}>
        <p>rendered-output</p>
      </ContentViewer>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy source' }));

    expect(onCopySource).toHaveBeenCalledWith('copy-me');
    expect(writeText).toHaveBeenCalledWith('copy-me');
  });

  it('can hide the toggle and copy actions', () => {
    render(
      <ContentViewer source="x" showSourceToggle={false} showCopy={false}>
        <p>rendered-output</p>
      </ContentViewer>,
    );

    expect(screen.queryByRole('button', { name: 'source' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copy source' })).not.toBeInTheDocument();
    expect(screen.getByText('rendered-output')).toBeInTheDocument();
  });
});
