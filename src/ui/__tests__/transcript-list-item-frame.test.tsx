// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TranscriptListItemFrame } from '../transcript-list-item-frame';

describe('TranscriptListItemFrame', () => {
  it('exposes list item data-slot and renders header/body/footer', () => {
    render(
      <TranscriptListItemFrame
        header={<span data-testid="h">H</span>}
        body={<span data-testid="b">Body</span>}
        footer={<span data-testid="f">F</span>}
      />,
    );
    const root = document.querySelector('[data-slot="transcript-list-item-frame"]');
    expect(root).not.toBeNull();
    expect(screen.getByTestId('h')).toBeInTheDocument();
    expect(screen.getByTestId('b')).toBeInTheDocument();
    expect(screen.getByTestId('f')).toBeInTheDocument();
  });
});
