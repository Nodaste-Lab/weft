// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sticky } from '../sticky';

describe('Sticky', () => {
  it('renders header, body and footer, with the caller colour on the header and the outline', () => {
    render(
      <Sticky
        color="var(--weft-category-1)"
        header={<span>Private · just now</span>}
        footer={<span>#session</span>}
        data-testid="card"
      >
        Session prep — the ferry captain knows the route.
      </Sticky>,
    );

    const card = screen.getByTestId('card');
    expect(card.getAttribute('data-slot')).toBe('sticky');
    // Outline carries the category colour.
    expect(card.style.borderColor).toBe('var(--weft-category-1)');

    const header = card.querySelector('[data-slot="sticky-header"]') as HTMLElement;
    expect(header).toBeTruthy();
    // Header background is the colour; text is the paired on-colour (AA-safe).
    expect(header.style.backgroundColor).toBe('var(--weft-category-1)');
    expect(header.style.color).toBe('var(--weft-on-category)');
    expect(header.textContent).toContain('Private');

    expect(screen.getByText(/ferry captain/)).toBeTruthy();
    expect(card.querySelector('[data-slot="sticky-footer"]')?.textContent).toContain('#session');
  });

  it('is outlined, not raised — no shadow', () => {
    const { getByTestId } = render(<Sticky color="#4a7bff" data-testid="s">body</Sticky>);
    expect(getByTestId('s').className).toContain('shadow-none');
    expect(getByTestId('s').className).not.toMatch(/shadow-(sm|md|lg|xl)/);
  });

  it('spans the header structurally: it is a direct child of the card root, not offset by arithmetic', () => {
    const { getByTestId } = render(
      <Sticky color="#4a7bff" header={<span>h</span>} data-testid="s">body</Sticky>,
    );
    const card = getByTestId('s');
    const header = card.querySelector('[data-slot="sticky-header"]') as HTMLElement;
    // Direct child of the zero-padding root — no negative margins / calc() offsets.
    expect(header.parentElement).toBe(card);
    expect(header.style.marginLeft).toBe('');
    expect(header.style.left).toBe('');
    expect(header.className).not.toMatch(/calc\(/);
  });

  it('omits the header and footer regions when not provided', () => {
    const { getByTestId } = render(<Sticky color="#4a7bff" data-testid="s">just a body</Sticky>);
    const card = getByTestId('s');
    expect(card.querySelector('[data-slot="sticky-header"]')).toBeNull();
    expect(card.querySelector('[data-slot="sticky-footer"]')).toBeNull();
    expect(card.querySelector('[data-slot="sticky-body"]')?.textContent).toBe('just a body');
  });
});
