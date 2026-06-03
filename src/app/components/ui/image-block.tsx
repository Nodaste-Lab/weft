import * as React from "react";

import {
  Image,
  type ImageAspectRatio,
  type ImageFit,
  type ImageProps,
  type ImageRadius,
} from "./image";
import { cn } from "./utils";

export type ImageBlockAlign = "start" | "center" | "stretch";
export type ImageBlockCaptionTone = "default" | "muted" | "strong";

export type ImageBlockProps = Omit<React.ComponentPropsWithoutRef<"figure">, "children"> & {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  fit?: ImageFit;
  radius?: ImageRadius;
  bordered?: boolean;
  aspectRatio?: ImageAspectRatio;
  align?: ImageBlockAlign;
  captionTone?: ImageBlockCaptionTone;
  imageClassName?: string;
  captionClassName?: string;
  imageProps?: Omit<
    ImageProps,
    "src" | "alt" | "fit" | "radius" | "bordered" | "aspectRatio" | "className"
  >;
};

const alignClasses: Record<ImageBlockAlign, string> = {
  start: "items-start",
  center: "items-center",
  stretch: "items-stretch",
};

const captionToneClasses: Record<ImageBlockCaptionTone, string> = {
  default: "text-[var(--hud-text-2)]",
  muted: "text-[var(--hud-text-3)]",
  strong: "text-[var(--hud-text-1)]",
};

/*
 * ImageBlock — semantic single-image media block.
 *
 * Galleries, upload handling, fallback/error UI, lightboxes, and interactive
 * wrappers belong to composed surfaces. This primitive owns figure/caption shape.
 */
function ImageBlock({
  className,
  src,
  alt,
  caption,
  fit = "cover",
  radius = "md",
  bordered = false,
  aspectRatio = "auto",
  align = "stretch",
  captionTone = "default",
  imageClassName,
  captionClassName,
  imageProps,
  ...props
}: ImageBlockProps) {
  return (
    <figure
      data-slot="image-block"
      data-align={align}
      className={cn("m-0 flex max-w-full flex-col gap-2", alignClasses[align], className)}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fit={fit}
        radius={radius}
        bordered={bordered}
        aspectRatio={aspectRatio}
        className={cn(align === "stretch" && "w-full", imageClassName)}
        {...imageProps}
      />
      {caption ? (
        <figcaption
          data-slot="image-block-caption"
          data-tone={captionTone}
          className={cn(
            "max-w-prose text-xs leading-relaxed [font-family:var(--weft-font-sans)]",
            captionToneClasses[captionTone],
            captionClassName,
          )}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export { ImageBlock };
