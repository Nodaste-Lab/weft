import * as React from "react";

import { cn } from "./utils";

export type ImageFit = "cover" | "contain" | "fill" | "none";
export type ImageRadius = "none" | "sm" | "md" | "lg" | "full";
export type ImageAspectRatio = "auto" | "square" | "video" | "portrait";

export type ImageProps = Omit<React.ComponentPropsWithoutRef<"img">, "alt"> & {
  alt: string;
  fit?: ImageFit;
  radius?: ImageRadius;
  bordered?: boolean;
  aspectRatio?: ImageAspectRatio;
};

const fitClasses: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
};

const radiusClasses: Record<ImageRadius, string | undefined> = {
  none: undefined,
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
};

const aspectRatioClasses: Record<ImageAspectRatio, string | undefined> = {
  auto: undefined,
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

/*
 * Image — display-only content image primitive.
 *
 * Captions, fallbacks, uploads, galleries, and interactive media behavior belong
 * to composed primitives. This component only owns the tokenized image surface.
 */
function Image({
  alt,
  className,
  fit = "cover",
  radius = "md",
  bordered = false,
  aspectRatio = "auto",
  loading = "lazy",
  decoding = "async",
  ...props
}: ImageProps) {
  return (
    <img
      data-slot="image"
      data-fit={fit}
      data-radius={radius}
      data-bordered={bordered ? "true" : "false"}
      data-aspect-ratio={aspectRatio}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn(
        "block max-w-full bg-[var(--hud-surface-raised)]",
        fitClasses[fit],
        radiusClasses[radius],
        bordered && "border border-[var(--hud-border)]",
        aspectRatioClasses[aspectRatio],
        className,
      )}
      {...props}
    />
  );
}

export { Image };
