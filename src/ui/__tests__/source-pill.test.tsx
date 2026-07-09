// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SourcePill } from '../source-pill';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

describe('SourcePill', () => {
  it('renders source text with tokenized styles', async () => {
    const { container } = render(<SourcePill>vault/notes.md</SourcePill>);

    expect(screen.getByText('vault/notes.md')).toHaveAttribute('data-slot', 'source-pill');
    expectNoRawColors(container);
    await expectA11yClean(container);
  });
});
