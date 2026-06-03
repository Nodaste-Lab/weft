import * as React from "react";

import {
  Image,
  type ImageAspectRatio,
  type ImageFit,
  type ImageProps,
  type ImageRadius,
} from "./image";
import { ImageBlock, type ImageBlockCaptionTone } from "./image-block";
import { Button } from "./button";
import { cn } from "./utils";

export type ImageGalleryLayout = "simple-grid" | "masonry" | "carousel";
export type ImageGalleryColumns = "auto" | "1" | "2" | "3";
export type ImageGalleryGap = "sm" | "md" | "lg";
export type ImageGalleryDensity = "default" | "compact";
export type ImageGalleryItemSpan = "default" | "tall" | "wide" | "hero";

export type ImageGalleryItem = {
  id?: string;
  src: string;
  alt: string;
  caption?: React.ReactNode;
  fit?: ImageFit;
  radius?: ImageRadius;
  bordered?: boolean;
  aspectRatio?: ImageAspectRatio;
  imageProps?: Omit<
    ImageProps,
    "src" | "alt" | "fit" | "radius" | "bordered" | "aspectRatio" | "className"
  >;
  imageClassName?: string;
  itemClassName?: string;
  span?: ImageGalleryItemSpan;
};

export type ImageGalleryProps = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  items: ImageGalleryItem[];
  layout?: ImageGalleryLayout;
  columns?: ImageGalleryColumns;
  gap?: ImageGalleryGap;
  density?: ImageGalleryDensity;
  captionTone?: ImageBlockCaptionTone;
  itemClassName?: string;
  imageClassName?: string;
};

const columnsClasses: Record<ImageGalleryColumns, string> = {
  auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "1": "grid-cols-1",
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

const gapClasses: Record<ImageGalleryGap, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

const densityClasses: Record<ImageGalleryDensity, string> = {
  default: "p-0",
  compact: "text-xs",
};

const masonrySpanClasses: Record<ImageGalleryItemSpan, string | undefined> = {
  default: undefined,
  tall: "row-span-2",
  wide: "sm:col-span-2",
  hero: "row-span-2 sm:col-span-2",
};

function renderGalleryMedia({
  item,
  captionTone,
  imageClassName,
}: {
  item: ImageGalleryItem;
  captionTone: ImageBlockCaptionTone;
  imageClassName?: string;
}) {
  if (item.caption) {
    return (
      <ImageBlock
        src={item.src}
        alt={item.alt}
        caption={item.caption}
        fit={item.fit}
        radius={item.radius}
        bordered={item.bordered}
        aspectRatio={item.aspectRatio}
        captionTone={captionTone}
        imageClassName={cn(imageClassName, item.imageClassName)}
        imageProps={item.imageProps}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fit={item.fit}
      radius={item.radius}
      bordered={item.bordered}
      aspectRatio={item.aspectRatio}
      className={cn("w-full", imageClassName, item.imageClassName)}
      {...item.imageProps}
    />
  );
}

/*
 * ImageGallery — display-only image collection primitive.
 *
 * Lightboxes, upload controls, carousel movement, selection, and reordering
 * belong to richer composed surfaces. This primitive owns labeled collection layout.
 */
function ImageGallery({
  className,
  items,
  layout = "simple-grid",
  columns = "auto",
  gap = "md",
  density = "default",
  captionTone = "default",
  itemClassName,
  imageClassName,
  ...props
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const safeActiveIndex = items.length > 0 ? Math.min(activeIndex, items.length - 1) : 0;
  const activeItem = items[safeActiveIndex];
  const isCarousel = layout === "carousel";
  const isMasonry = layout === "masonry";

  return (
    <section
      role="region"
      data-slot="image-gallery"
      data-layout={layout}
      data-columns={columns}
      data-gap={gap}
      data-density={density}
      className={cn("max-w-full", densityClasses[density], className)}
      {...props}
    >
      {isCarousel ? (
        <div data-slot="image-gallery-carousel" className="flex max-w-full flex-col gap-2">
          {activeItem ? (
            <div
              data-slot="image-gallery-item"
              data-item-id={activeItem.id}
              data-active="true"
              className={cn("min-w-0", itemClassName, activeItem.itemClassName)}
            >
              {renderGalleryMedia({
                item: activeItem,
                captionTone,
                imageClassName,
              })}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-slot="image-gallery-previous"
              aria-label="Previous image"
              disabled={safeActiveIndex === 0}
              onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
            >
              Previous
            </Button>
            <span
              data-slot="image-gallery-position"
              className="text-xs text-[var(--hud-text-3)] [font-family:var(--weft-font-sans)]"
            >
              {items.length ? `${safeActiveIndex + 1} of ${items.length}` : "0 of 0"}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-slot="image-gallery-next"
              aria-label="Next image"
              disabled={safeActiveIndex >= items.length - 1}
              onClick={() => setActiveIndex((current) => Math.min(items.length - 1, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div
          data-slot="image-gallery-grid"
          data-layout={layout}
          className={cn(
            "grid max-w-full",
            columnsClasses[columns],
            gapClasses[gap],
            isMasonry && "auto-rows-[minmax(0,theme(spacing.16))]",
          )}
        >
          {items.map((item, index) => {
            const key = item.id ?? `${item.src}-${index}`;
            const span = item.span ?? "default";
            return (
              <div
                key={key}
                data-slot="image-gallery-item"
                data-item-id={item.id}
                data-span={span}
                className={cn(
                  "min-w-0",
                  isMasonry && masonrySpanClasses[span],
                  itemClassName,
                  item.itemClassName,
                )}
              >
                {renderGalleryMedia({
                  item,
                  captionTone,
                  imageClassName,
                })}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export { ImageGallery };
