// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { VaultSheetMatchRow } from '../vault-sheet-match-row';

const sampleMatch = {
  characterName: 'Aboleth',
  filePath: 'monsters/aboleth.md',
  confidence: 'exact' as const,
  parsedData: { hp: 135, ac: 17 },
};

describe('VaultSheetMatchRow', () => {
  it('renders the name, confidence pill, HP/AC, and file path', () => {
    render(<VaultSheetMatchRow match={sampleMatch} onAdd={() => undefined} />);

    expect(screen.getByText('Aboleth')).toBeInTheDocument();
    expect(screen.getByText('exact')).toBeInTheDocument();
    expect(screen.getByText('135')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('monsters/aboleth.md')).toBeInTheDocument();
  });

  it('exposes data-slot and data-confidence attributes for adoption checks', () => {
    const { container } = render(
      <VaultSheetMatchRow match={sampleMatch} onAdd={() => undefined} />,
    );
    const row = container.querySelector('[data-slot="vault-sheet-match-row"]');
    expect(row).not.toBeNull();
    expect(row).toHaveAttribute('data-confidence', 'exact');
  });

  it('omits the HP/AC summary slots when parsedData is missing', () => {
    render(
      <VaultSheetMatchRow
        match={{ ...sampleMatch, parsedData: undefined }}
        onAdd={() => undefined}
      />,
    );
    expect(screen.queryByText('135')).not.toBeInTheDocument();
    expect(screen.queryByText('17')).not.toBeInTheDocument();
  });

  it('calls onAdd with the original match when the Add button is clicked', () => {
    const onAdd = vi.fn();
    render(<VaultSheetMatchRow match={sampleMatch} onAdd={onAdd} addLabel="Add" />);

    fireEvent.click(screen.getByRole('button', { name: /add aboleth/i }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(sampleMatch);
  });

  it('respects the addLabel override', () => {
    render(
      <VaultSheetMatchRow match={sampleMatch} onAdd={() => undefined} addLabel="Add to Combat" />,
    );
    expect(screen.getByRole('button', { name: /add aboleth/i })).toHaveTextContent('Add to Combat');
  });
});
