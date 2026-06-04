// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Carousel, type CarouselItemData } from '../carousel';

const carouselItems: CarouselItemData[] = [
  {
    id: 'brief',
    label: 'Briefing',
    description: 'Review the source material.',
    content: <p>Choose the transcript and verify citations.</p>,
  },
  {
    id: 'draft',
    label: 'Draft',
    description: 'Generate the first pass.',
    content: <p>Summarize decisions, risks, and next actions.</p>,
  },
  {
    id: 'share',
    label: 'Share',
    description: 'Send the handoff.',
    content: <p>Publish the reviewed summary to the client vault.</p>,
  },
];

describe('Carousel', () => {
  it('renders a labeled carousel region with active slide semantics', () => {
    const { container } = render(<Carousel aria-label="Client workflow" items={carouselItems} />);

    const carousel = screen.getByRole('region', { name: 'Client workflow' });
    const slide = screen.getByRole('group', { name: 'Slide 1 of 3: Briefing' });

    expect(carousel).toHaveAttribute('data-slot', 'carousel');
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    expect(carousel).toHaveAttribute('data-active-index', '0');
    expect(slide).toHaveAttribute('data-slot', 'carousel-slide');
    expect(slide).toHaveAttribute('aria-roledescription', 'slide');
    expect(slide).toHaveAttribute('data-slide-id', 'brief');
    expect(container.querySelectorAll('[data-slot="carousel-slide"]')).toHaveLength(1);
  });

  it('shows active content, label, description, and position text', () => {
    render(<Carousel aria-label="Client workflow" items={carouselItems} />);

    expect(screen.getByText('Briefing')).toHaveAttribute('data-slot', 'carousel-slide-label');
    expect(screen.getByText('Review the source material.')).toHaveAttribute('data-slot', 'carousel-slide-description');
    expect(screen.getByText('Choose the transcript and verify citations.')).toBeInTheDocument();
    expect(screen.getByText('1 of 3')).toHaveAttribute('data-slot', 'carousel-position');
  });

  it('uses explicit accessible slide labels for JSX labels', () => {
    render(
      <Carousel
        aria-label="JSX workflow"
        items={[
          {
            id: 'jsx-label',
            label: <span>Visual label</span>,
            ariaLabel: 'Accessible visual label',
            content: <p>Slide body.</p>,
          },
        ]}
      />,
    );

    expect(screen.getByRole('group', { name: 'Slide 1 of 1: Accessible visual label' })).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /\[object Object\]/ })).toBeNull();
  });

  it('moves with previous and next controls while disabling boundaries', () => {
    render(<Carousel aria-label="Client workflow" items={carouselItems} />);

    const previous = screen.getByRole('button', { name: 'Previous slide' });
    const next = screen.getByRole('button', { name: 'Next slide' });

    expect(previous).toBeDisabled();
    expect(next).not.toBeDisabled();

    fireEvent.click(next);
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(previous).not.toBeDisabled();

    fireEvent.click(next);
    expect(screen.getByText('3 of 3')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(next).toBeDisabled();

    fireEvent.click(previous);
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
  });

  it('supports keyboard navigation without adding unrelated interaction', () => {
    const { container } = render(<Carousel aria-label="Client workflow" items={carouselItems} />);
    const carousel = screen.getByRole('region', { name: 'Client workflow' });

    fireEvent.keyDown(carousel, { key: 'End' });
    expect(screen.getByText('3 of 3')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();

    fireEvent.keyDown(carousel, { key: 'Home' });
    expect(screen.getByText('1 of 3')).toBeInTheDocument();
    expect(screen.getByText('Briefing')).toBeInTheDocument();

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(screen.getByText('2 of 3')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="carousel-autoplay"]')).toBeNull();
  });

  it('clamps the initial index to available slide bounds', () => {
    render(<Carousel aria-label="Client workflow" items={carouselItems} initialIndex={99} />);

    expect(screen.getByText('3 of 3')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders an empty labeled carousel shell without placeholder copy', () => {
    const { container } = render(<Carousel aria-label="Empty workflow" items={[]} />);

    expect(screen.getByRole('region', { name: 'Empty workflow' })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="carousel-slide"]')).toBeNull();
    expect(screen.getByText('0 of 0')).toHaveAttribute('data-slot', 'carousel-position');
    expect(screen.queryByText(/empty|no slides/i)).not.toBeInTheDocument();
  });

  it('does not render autoplay, pagination dots, lightbox, drag handles, or links by default', () => {
    const { container } = render(<Carousel aria-label="Client workflow" items={carouselItems} />);

    expect(container.querySelector('[data-slot="carousel-autoplay"]')).toBeNull();
    expect(container.querySelector('[data-slot="carousel-pagination-dots"]')).toBeNull();
    expect(container.querySelector('[data-slot="carousel-lightbox"]')).toBeNull();
    expect(container.querySelector('[data-slot="carousel-drag-handle"]')).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
