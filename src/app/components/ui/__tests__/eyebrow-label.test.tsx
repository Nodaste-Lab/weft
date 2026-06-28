// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EyebrowLabel } from '../eyebrow-label';
import { expectA11yClean } from '../../../../test-support/ds-assert';

describe('EyebrowLabel', () => {
  it('renders an accessible section label', async () => {
    const { container } = render(<EyebrowLabel>Workspace context</EyebrowLabel>);

    expect(screen.getByText('Workspace context')).toHaveAttribute('data-slot', 'eyebrow-label');
    await expectA11yClean(container);
  });
});
