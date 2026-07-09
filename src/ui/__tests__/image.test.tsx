// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Image } from '../image';

describe('Image', () => {
  it('renders a semantic image with safe loading defaults', () => {
    const { container } = render(
      <Image src="/images/map.png" alt="Annotated map of the east gate" />,
    );

    const image = screen.getByRole('img', { name: 'Annotated map of the east gate' });
    expect(image.tagName).toBe('IMG');
    expect(image).toHaveAttribute('data-slot', 'image');
    expect(image).toHaveAttribute('src', '/images/map.png');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(container.querySelector('[data-slot="image"]')).toBe(image);
  });

  it('allows callers to override native image loading behavior', () => {
    render(
      <Image
        src="/images/hero.png"
        alt="Hero artwork"
        loading="eager"
        decoding="sync"
      />,
    );

    const image = screen.getByRole('img', { name: 'Hero artwork' });
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('decoding', 'sync');
  });

  it('applies tokenized fit, radius, border, and aspect variants', () => {
    const { container } = render(
      <Image
        src="/images/tokenized.png"
        alt="Tokenized image sample"
        fit="contain"
        radius="lg"
        bordered
        aspectRatio="video"
      />,
    );

    const image = container.querySelector('[data-slot="image"]');
    expect(image).toHaveAttribute('data-fit', 'contain');
    expect(image).toHaveAttribute('data-radius', 'lg');
    expect(image).toHaveAttribute('data-bordered', 'true');
    expect(image).toHaveAttribute('data-aspect-ratio', 'video');
    expect(image).toHaveClass('object-contain', 'rounded-[var(--radius-lg)]', 'border', 'aspect-video');
  });

  it('merges caller classes and passes through native image props', () => {
    const onLoad = vi.fn();
    render(
      <Image
        src="/images/pass-through.png"
        alt="Pass-through sample"
        className="shadow-sm"
        width={320}
        height={180}
        draggable={false}
        onLoad={onLoad}
      />,
    );

    const image = screen.getByRole('img', { name: 'Pass-through sample' });
    expect(image).toHaveClass('shadow-sm');
    expect(image).toHaveAttribute('width', '320');
    expect(image).toHaveAttribute('height', '180');
    expect(image).toHaveAttribute('draggable', 'false');
  });

  it('renders no implicit caption, empty-state, or interactive control', () => {
    const { container } = render(
      <Image src="/images/plain.png" alt="Plain content image" />,
    );

    expect(container.querySelector('figcaption')).toBeNull();
    expect(container.querySelector('[data-slot="image-empty-state"]')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
