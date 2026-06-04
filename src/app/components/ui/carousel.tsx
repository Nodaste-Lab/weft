import * as React from "react";

import { Button } from "./button";
import { cn } from "./utils";

export type CarouselDensity = "compact" | "default";

export type CarouselItemData = {
  id: string;
  content: React.ReactNode;
  label?: React.ReactNode;
  ariaLabel?: string;
  description?: React.ReactNode;
};

export type CarouselProps = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  items: CarouselItemData[];
  initialIndex?: number;
  density?: CarouselDensity;
  showPosition?: boolean;
};

const densityClasses: Record<CarouselDensity, string> = {
  compact: "gap-2 p-2 text-xs",
  default: "gap-3 p-3 text-sm",
};

function clampIndex(index: number, itemCount: number) {
  if (itemCount <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), itemCount - 1);
}

function labelText(label: React.ReactNode): string | undefined {
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }
  return undefined;
}

function slideLabel(item: CarouselItemData | undefined, activeIndex: number, itemCount: number) {
  const position = `Slide ${itemCount ? activeIndex + 1 : 0} of ${itemCount}`;
  const accessibleLabel = item?.ariaLabel ?? labelText(item?.label);
  if (!accessibleLabel) {
    return position;
  }

  return `${position}: ${accessibleLabel}`;
}

const Carousel = React.forwardRef<HTMLElement, CarouselProps>(
  (
    {
      className,
      items,
      initialIndex = 0,
      density = "default",
      showPosition = true,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = React.useState(() => clampIndex(initialIndex, items.length));
    const safeActiveIndex = clampIndex(activeIndex, items.length);
    const activeItem = items[safeActiveIndex];
    const canGoPrevious = items.length > 0 && safeActiveIndex > 0;
    const canGoNext = items.length > 0 && safeActiveIndex < items.length - 1;

    React.useEffect(() => {
      setActiveIndex((current) => clampIndex(current, items.length));
    }, [items.length]);

    const goToIndex = React.useCallback(
      (index: number) => {
        setActiveIndex(clampIndex(index, items.length));
      },
      [items.length],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goToIndex(safeActiveIndex - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          goToIndex(safeActiveIndex + 1);
        } else if (event.key === "Home") {
          event.preventDefault();
          goToIndex(0);
        } else if (event.key === "End") {
          event.preventDefault();
          goToIndex(items.length - 1);
        }
      },
      [goToIndex, items.length, onKeyDown, safeActiveIndex],
    );

    return (
      <section
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-density={density}
        data-active-index={safeActiveIndex}
        tabIndex={0}
        className={cn(
          "flex max-w-full flex-col rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface-raised)] [font-family:var(--weft-font-sans)]",
          densityClasses[density],
          className,
        )}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <div data-slot="carousel-viewport" className="min-w-0">
          {activeItem ? (
            <div
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel(activeItem, safeActiveIndex, items.length)}
              data-slot="carousel-slide"
              data-slide-id={activeItem.id}
              className="min-w-0 rounded-[var(--radius-sm)] border border-[var(--hud-border)] bg-[var(--hud-surface)] p-3"
            >
              {activeItem.label ? (
                <div
                  data-slot="carousel-slide-label"
                  className="text-sm font-semibold leading-tight text-[var(--hud-text-1)]"
                >
                  {activeItem.label}
                </div>
              ) : null}
              {activeItem.description ? (
                <p
                  data-slot="carousel-slide-description"
                  className="m-0 mt-1 text-xs leading-snug text-[var(--hud-text-2)]"
                >
                  {activeItem.description}
                </p>
              ) : null}
              <div data-slot="carousel-slide-content" className="mt-3 text-[var(--hud-text-2)]">
                {activeItem.content}
              </div>
            </div>
          ) : null}
        </div>

        <div data-slot="carousel-controls" className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-slot="carousel-previous"
            aria-label="Previous slide"
            disabled={!canGoPrevious}
            onClick={() => goToIndex(safeActiveIndex - 1)}
          >
            Previous
          </Button>
          {showPosition ? (
            <span
              data-slot="carousel-position"
              className="text-xs font-medium text-[var(--hud-text-3)]"
            >
              {items.length ? `${safeActiveIndex + 1} of ${items.length}` : "0 of 0"}
            </span>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-slot="carousel-next"
            aria-label="Next slide"
            disabled={!canGoNext}
            onClick={() => goToIndex(safeActiveIndex + 1)}
          >
            Next
          </Button>
        </div>
      </section>
    );
  },
);

Carousel.displayName = "Carousel";

export { Carousel };
