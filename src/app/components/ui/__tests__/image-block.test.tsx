// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageBlock } from '../image-block';

describe('ImageBlock', () => {
  it('renders a semantic figure with composed Image and optional caption', () => {
    const { container } = render(
      <ImageBlock
        src="/images/scene.png"
        alt="Moonlit ridge above the east gate"
        caption="The ridge view used for the morning brief."
      />,
    );

    const figure = container.querySelector('[data-slot="image-block"]');
    const image = screen.getByRole('img', { name: 'Moonlit ridge above the east gate' });
    const caption = container.querySelector('[data-slot="image-block-caption"]');

    expect(figure?.tagName).toBe('FIGURE');
    expect(image).toHaveAttribute('data-slot', 'image');
    expect(image).toHaveAttribute('src', '/images/scene.png');
    expect(caption?.tagName).toBe('FIGCAPTION');
    expect(caption).toHaveTextContent('The ridge view used for the morning brief.');
  });

  it('does not render a caption when caption content is omitted', () => {
    const { container } = render(
      <ImageBlock src="/images/plain.png" alt="Plain image without caption" />,
    );

    expect(container.querySelector('[data-slot="image-block-caption"]')).toBeNull();
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('passes image variants through to the composed Image primitive', () => {
    const { container } = render(
      <ImageBlock
        src="/images/variants.png"
        alt="Variant image sample"
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
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('merges block classes and applies caption tone and alignment attributes', () => {
    const { container } = render(
      <ImageBlock
        src="/images/aligned.png"
        alt="Aligned media sample"
        caption="Muted centered caption."
        align="center"
        captionTone="muted"
        className="max-w-sm"
      />,
    );

    const figure = container.querySelector('[data-slot="image-block"]');
    const caption = container.querySelector('[data-slot="image-block-caption"]');
    expect(figure).toHaveClass('max-w-sm');
    expect(figure).toHaveAttribute('data-align', 'center');
    expect(caption).toHaveAttribute('data-tone', 'muted');
  });

  it('renders no implicit fallback, upload control, link, or gallery behavior', () => {
    const { container } = render(
      <ImageBlock
        src="/images/plain.png"
        alt="Plain media block"
        caption="A quiet caption."
      />,
    );

    expect(container.querySelector('[data-slot="image-block-fallback"]')).toBeNull();
    expect(container.querySelector('[data-slot="image-gallery"]')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
