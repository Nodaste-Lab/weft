import * as React from 'react';
import { Image } from '../../ui/image';
import { ImageBlock } from '../../ui/image-block';
import { ImageGallery, type ImageGalleryItem } from '../../ui/image-gallery';
import type { Specimen } from '../specimen-types';

type P = Record<string, unknown>;

/** Every landmark on one page needs a distinct name, so a region's cell joins its variant to the base name. */
const landmarkName = (base: string, p: P, keys: readonly string[]) => {
  const parts = keys.filter((k) => p[k] !== undefined).map((k) => `${k} ${String(p[k])}`);
  return parts.length ? `${base}, ${parts.join(', ')}` : base;
};

/*
 * Inline SVG data URLs (160×90, pre-encoded) so the specimens never reach the
 * network. Colours are URL-encoded inside the data URL, not design tokens: these
 * are the pictures' own pixels, not UI chrome.
 */
const RIDGE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='90'%20viewBox='0%200%20160%2090'%3E%3Crect%20width='160'%20height='90'%20fill='%23233443'/%3E%3Cpath%20d='M0%2078%20L52%2044%20L84%2062%20L120%2032%20L160%2078%20L160%2090%20L0%2090Z'%20fill='%23c8df72'/%3E%3C/svg%3E";
const MOON =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='90'%20viewBox='0%200%20160%2090'%3E%3Crect%20width='160'%20height='90'%20fill='%231f2937'/%3E%3Ccircle%20cx='80'%20cy='45'%20r='24'%20fill='%237cc4ff'/%3E%3C/svg%3E";
const SUN =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='90'%20viewBox='0%200%20160%2090'%3E%3Crect%20width='160'%20height='90'%20fill='%23212b38'/%3E%3Ccircle%20cx='52'%20cy='33'%20r='16'%20fill='%23f3d36b'/%3E%3Cpath%20d='M0%2075%20L45%2052%20L85%2070%20L130%2046%20L160%2062%20L160%2090%20L0%2090Z'%20fill='%2389d37f'/%3E%3C/svg%3E";
const TALL_MOON =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='90'%20height='160'%20viewBox='0%200%2090%20160'%3E%3Crect%20width='90'%20height='160'%20fill='%231f2937'/%3E%3Ccircle%20cx='45'%20cy='48'%20r='21'%20fill='%237cc4ff'/%3E%3Cpath%20d='M10%20135%20L45%2080%20L80%20135Z'%20fill='%2389d37f'/%3E%3C/svg%3E";

const GALLERY_ITEMS: ImageGalleryItem[] = [
  { id: 'ridge', src: RIDGE, alt: 'Green ridge on a dark field', caption: 'Ridge study', aspectRatio: 'video', bordered: true },
  { id: 'moon', src: MOON, alt: 'Blue moon on a dark field', aspectRatio: 'video', bordered: true },
  { id: 'sun', src: SUN, alt: 'Yellow sun over a green valley', caption: 'Valley study', aspectRatio: 'video', bordered: true },
];

const MASONRY_ITEMS: ImageGalleryItem[] = [
  { id: 'wide', src: RIDGE, alt: 'Wide green ridge study', caption: 'Wide item', aspectRatio: 'video', bordered: true, span: 'wide' },
  { id: 'tall', src: TALL_MOON, alt: 'Tall blue moon study', aspectRatio: 'portrait', bordered: true, span: 'tall' },
  { id: 'plain', src: SUN, alt: 'Yellow sun over a green valley', caption: 'Default item', aspectRatio: 'video', bordered: true },
];

/** Specimens for the media category. One entry per component id; see ../specimen-types.ts. */
export const mediaSpecimens: Record<string, Specimen> = {
  image: {
    component: 'Image',
    module: 'image',
    axes: ['aspectRatio', 'fit', 'radius'],
    axisBase: { fit: { className: 'h-24 w-full' }, radius: { aspectRatio: 'square' } },
    base: { src: RIDGE, alt: 'Green ridge on a dark field' },
    states: [
      { label: 'Bordered', props: { bordered: true }, code: '<Image bordered>', note: 'A hairline keeps a light picture off a light surface.' },
      { label: 'Decorative', props: { alt: '' }, code: '<Image alt="">', note: 'Only when the picture carries no information a reader would miss.' },
    ],
    render: (p: P) => (
      <div style={{ width: 160 }}>
        <Image {...(p as React.ComponentProps<typeof Image>)} className={['w-full', p.className].filter(Boolean).join(' ')} />
      </div>
    ),
  },
  'image-block': {
    component: 'ImageBlock',
    module: 'image-block',
    axes: ['align', 'captionTone'],
    base: { src: RIDGE, alt: 'Green ridge on a dark field', caption: 'Ridge study, generated for the session recap.' },
    states: [
      { label: 'Without caption', props: { caption: undefined }, code: '<ImageBlock src="…" alt="…" />', note: 'Still a figure; use Image when there will never be a caption.' },
      { label: 'Framed video ratio', props: { aspectRatio: 'video', bordered: true, radius: 'lg' }, code: '<ImageBlock aspectRatio="video" bordered radius="lg">' },
    ],
    render: (p: P) => (
      <div style={{ width: 240 }}>
        <ImageBlock {...(p as React.ComponentProps<typeof ImageBlock>)} />
      </div>
    ),
  },
  'image-gallery': {
    component: 'ImageGallery',
    module: 'image-gallery',
    axes: ['layout', 'columns', 'gap', 'density'],
    base: { 'aria-label': 'Reference images', items: GALLERY_ITEMS },
    states: [
      { label: 'Masonry spans', props: { layout: 'masonry', columns: '3', items: MASONRY_ITEMS }, code: '<ImageGallery layout="masonry" items={[{ span: "wide" }, { span: "tall" }, …]}>', note: 'Items declare their own span; DOM order is the reading order.' },
      { label: 'Single item', props: { items: GALLERY_ITEMS.slice(0, 1) }, code: '<ImageGallery items={[one]}>', note: 'In the carousel layout both controls are disabled and the position reads 1 of 1.' },
    ],
    render: (p: P) => (
      <div style={{ width: 280 }}>
        {/* Every landmark on one page needs a distinct name, so the cell's variant joins the base name. */}
        <ImageGallery {...(p as React.ComponentProps<typeof ImageGallery>)} aria-label={landmarkName(String(p['aria-label']), p, ['layout', 'columns', 'gap', 'density'])} />
      </div>
    ),
  },
};
