// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HtmlViewer, buildHtmlViewerSrcDoc } from '../html-viewer';

describe('buildHtmlViewerSrcDoc', () => {
  it('embeds the html inside a script-free CSP document', () => {
    const doc = buildHtmlViewerSrcDoc('<h1>Title</h1>');
    expect(doc).toContain('<h1>Title</h1>');
    expect(doc).toContain('Content-Security-Policy');
    expect(doc).toContain("script-src 'none'");
    expect(doc).toContain("default-src 'none'");
  });
});

describe('HtmlViewer', () => {
  it('renders a fully sandboxed, script-free iframe carrying the html', () => {
    render(<HtmlViewer html="<p>hello-html</p>" frameTitle="Preview" />);

    const frame = screen.getByTitle('Preview') as HTMLIFrameElement;
    // Empty sandbox = most restrictive: no allow-scripts, no allow-same-origin.
    expect(frame.getAttribute('sandbox')).toBe('');
    const srcdoc = frame.getAttribute('srcdoc') ?? '';
    expect(srcdoc).toContain('<p>hello-html</p>');
    expect(srcdoc).toContain("script-src 'none'");
  });

  it('exposes the raw html via the Source toggle', () => {
    render(<HtmlViewer html="<p>hello-html</p>" />);

    expect(screen.queryByText('<p>hello-html</p>')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'source' }));
    expect(screen.getByText('<p>hello-html</p>')).toBeInTheDocument();
  });

  it('shows an empty state when there is no html', () => {
    render(<HtmlViewer html="" emptyLabel="No HTML yet" />);

    expect(screen.getByText('No HTML yet')).toBeInTheDocument();
    expect(screen.queryByTitle('HTML preview')).not.toBeInTheDocument();
  });
});
