// @vitest-environment jsdom
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageGallery } from '../image-gallery';

const galleryItems = [
  {
    id: 'ridge',
    src: '/images/ridge.png',
    alt: 'Green ridge at sunrise',
    caption: 'Ridge study',
  },
  {
    id: 'gate',
    src: '/images/gate.png',
    alt: 'Stone gate under moonlight',
  },
  {
    id: 'river',
    src: '/images/river.png',
    alt: 'River crossing marker',
    caption: 'River crossing',
    span: 'wide' as const,
  },
];

describe('ImageGallery', () => {
  it('renders a labeled gallery with items in DOM order', () => {
    const { container } = render(
      <ImageGallery aria-label="Session image references" items={galleryItems} />,
    );

    const gallery = screen.getByRole('region', { name: 'Session image references' });
    expect(gallery).toHaveAttribute('data-slot', 'image-gallery');

    const itemNodes = container.querySelectorAll('[data-slot="image-gallery-item"]');
    expect(itemNodes).toHaveLength(3);
    expect(within(itemNodes[0] as HTMLElement).getByRole('img')).toHaveAttribute('alt', 'Green ridge at sunrise');
    expect(within(itemNodes[1] as HTMLElement).getByRole('img')).toHaveAttribute('alt', 'Stone gate under moonlight');
    expect(within(itemNodes[2] as HTMLElement).getByRole('img')).toHaveAttribute('alt', 'River crossing marker');
  });

  it('composes ImageBlock for captioned items and Image for bare items', () => {
    const { container } = render(
      <ImageGallery aria-label="Mixed media" items={galleryItems} />,
    );

    expect(screen.getByText('Ridge study')).toBeInTheDocument();
    expect(screen.getByText('River crossing')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="image-block"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-slot="image"]')).toHaveLength(3);
  });

  it('applies simple grid layout variants through data attributes and fixed classes', () => {
    const { container } = render(
      <ImageGallery
        aria-label="Compact gallery"
        items={galleryItems}
        layout="simple-grid"
        columns="3"
        gap="lg"
        density="compact"
        className="rounded-md"
      />,
    );

    const gallery = container.querySelector('[data-slot="image-gallery"]');
    const grid = container.querySelector('[data-slot="image-gallery-grid"]');
    expect(gallery).toHaveAttribute('data-layout', 'simple-grid');
    expect(gallery).toHaveAttribute('data-columns', '3');
    expect(gallery).toHaveAttribute('data-gap', 'lg');
    expect(gallery).toHaveAttribute('data-density', 'compact');
    expect(gallery).toHaveClass('rounded-md');
    expect(grid).toHaveClass('gap-4', 'sm:grid-cols-2', 'lg:grid-cols-3');
  });

  it('renders masonry layout with item span classes while preserving DOM order', () => {
    const { container } = render(
      <ImageGallery
        aria-label="Masonry gallery"
        items={galleryItems}
        layout="masonry"
        columns="3"
      />,
    );

    const gallery = container.querySelector('[data-slot="image-gallery"]');
    const grid = container.querySelector('[data-slot="image-gallery-grid"]');
    const itemNodes = container.querySelectorAll('[data-slot="image-gallery-item"]');

    expect(gallery).toHaveAttribute('data-layout', 'masonry');
    expect(grid).toHaveAttribute('data-layout', 'masonry');
    expect(grid).toHaveClass('auto-rows-[minmax(0,theme(spacing.16))]');
    expect(itemNodes[0]).toHaveAttribute('data-span', 'default');
    expect(itemNodes[2]).toHaveAttribute('data-span', 'wide');
    expect(itemNodes[2]).toHaveClass('sm:col-span-2');
    expect(within(itemNodes[0] as HTMLElement).getByRole('img')).toHaveAttribute('alt', 'Green ridge at sunrise');
    expect(within(itemNodes[1] as HTMLElement).getByRole('img')).toHaveAttribute('alt', 'Stone gate under moonlight');
    expect(within(itemNodes[2] as HTMLElement).getByRole('img')).toHaveAttribute('alt', 'River crossing marker');
  });

  it('renders carousel layout with accessible controls and visible position text', () => {
    const { container } = render(
      <ImageGallery aria-label="Carousel gallery" items={galleryItems} layout="carousel" />,
    );

    const gallery = screen.getByRole('region', { name: 'Carousel gallery' });
    expect(gallery).toHaveAttribute('data-layout', 'carousel');
    expect(container.querySelector('[data-slot="image-gallery-carousel"]')).not.toBeNull();

    const previous = screen.getByRole('button', { name: 'Previous image' });
    const next = screen.getByRole('button', { name: 'Next image' });
    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();
    expect(screen.getByText('1 of 3')).toHaveAttribute('data-slot', 'image-gallery-position');
    expect(screen.getByRole('img', { name: 'Green ridge at sunrise' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Stone gate under moonlight' })).not.toBeInTheDocument();

    fireEvent.click(next);

    expect(previous).not.toBeDisabled();
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Stone gate under moonlight' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="image-gallery-autoplay"]')).toBeNull();
  });

  it('clamps carousel position when items shrink', () => {
    const { rerender } = render(
      <ImageGallery aria-label="Dynamic carousel gallery" items={galleryItems} layout="carousel" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByText('3 of 3')).toBeInTheDocument();

    rerender(
      <ImageGallery aria-label="Dynamic carousel gallery" items={galleryItems.slice(0, 2)} layout="carousel" />,
    );

    expect(screen.getByText('2 of 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }));
    expect(screen.getByText('1 of 2')).toBeInTheDocument();
  });

  it('renders an empty labeled gallery without implicit placeholder text', () => {
    const { container } = render(
      <ImageGallery aria-label="Empty gallery" items={[]} />,
    );

    expect(screen.getByRole('region', { name: 'Empty gallery' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="image-gallery-item"]')).toHaveLength(0);
    expect(screen.queryByText(/empty/i)).not.toBeInTheDocument();
  });

  it('renders no implicit interactive, empty-state, lightbox, or carousel controls for static layouts', () => {
    const { container } = render(
      <ImageGallery aria-label="Static gallery" items={galleryItems} layout="simple-grid" />,
    );

    expect(container.querySelector('[data-slot="image-gallery-empty-state"]')).toBeNull();
    expect(container.querySelector('[data-slot="image-gallery-lightbox"]')).toBeNull();
    expect(container.querySelector('[data-slot="image-gallery-carousel"]')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
