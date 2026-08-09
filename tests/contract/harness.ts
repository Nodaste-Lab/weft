/**
 * Shared machinery for the contract suites.
 *
 * Three things live here because all of them are easy to get subtly wrong, and
 * a second copy is how the two would drift:
 *
 *  1. AXIS CONTROL. Theme, density and palette are `:root` attributes. The
 *     suites set them on <html> rather than the specimen page shipping one copy
 *     per combination.
 *
 *  2. ACCESSIBILITY-TREE READS. Names, descriptions and states come from
 *     Chromium's own accessibility tree over CDP — the same computation the
 *     audit read in DevTools. This proves EXPOSURE and nothing else. What a
 *     given screen reader announces is product- and setting-dependent, this
 *     harness tests none of them, and no assertion built on it may claim
 *     otherwise.
 *
 *  3. PAINTED-PIXEL SAMPLING. Boundary contrast is read off rendered pixels,
 *     not off token pairs. A token-pair calculation cannot see opacity, cannot
 *     see one layer composited over another, and cannot see a later selector
 *     removing the border it is calculating against — and each of those has
 *     already produced a bug on this surface once.
 */
import type { Page } from '@playwright/test';

export const SPECIMEN_PAGE = '/docs/brand-package/input-specimens.html';

export type Theme = 'light' | 'dark';
export type Density = 'marketing' | 'compact' | 'dense';
export type Palette = 'weft' | 'hud-glass';
export type Ground = 'paper' | 'cream' | 'card';

export const THEMES: Theme[] = ['light', 'dark'];
export const DENSITIES: Density[] = ['marketing', 'compact', 'dense'];
export const GROUNDS: Ground[] = ['paper', 'cream', 'card'];

/** WCAG 1.4.11 non-text contrast floor for a control boundary. */
export const BOUNDARY_FLOOR = 3;

/**
 * Smallest 8-bit channel delta this harness will call "renders differently".
 * Below it, two fills are the same colour with rounding on top; a state that
 * separates itself by less than this is not separating itself.
 */
export const VISIBLE_DELTA = 8;

export interface Axes {
  theme?: Theme;
  density?: Density;
  palette?: Palette;
}

export function axisLabel({ theme = 'light', density = 'marketing', palette = 'weft' }: Axes): string {
  return `${palette}/${theme}/${density}`;
}

/** Put the document on the requested axes. Absent attributes are the defaults. */
export async function applyAxes(page: Page, axes: Axes): Promise<void> {
  const { theme = 'light', density = 'marketing', palette = 'weft' } = axes;
  await page.evaluate(
    ({ theme: t, density: d, palette: p }) => {
      const r = document.documentElement;
      if (t === 'dark') r.setAttribute('data-theme', 'dark');
      else r.removeAttribute('data-theme');
      if (d === 'marketing') r.removeAttribute('data-density');
      else r.setAttribute('data-density', d);
      r.setAttribute('data-palette', p);
    },
    { theme, density, palette },
  );
  // weft.css transitions token-backed colours over 200ms. The audit recorded a
  // withdrawn finding caused by measuring mid-transition; this is that lesson
  // as code rather than as a paragraph.
  await settle(page);
}

/** Let colour transitions finish before anything is measured. */
export async function settle(page: Page): Promise<void> {
  await page.waitForTimeout(260);
}

// ── Accessibility tree ───────────────────────────────────────────────────────

export interface AxNode {
  role?: string;
  name?: string;
  description?: string;
  properties: Record<string, unknown>;
}

const sessions = new WeakMap<Page, Promise<import('@playwright/test').CDPSession>>();

async function cdpFor(page: Page) {
  let session = sessions.get(page);
  if (!session) {
    session = (async () => {
      const s = await page.context().newCDPSession(page);
      await s.send('DOM.enable');
      await s.send('Accessibility.enable');
      return s;
    })();
    sessions.set(page, session);
  }
  return session;
}

/**
 * The computed accessibility node for a selector, straight out of Chromium.
 *
 * Playwright's own `page.accessibility` was removed in 1.5x, and reimplementing
 * name computation in the test would mean asserting our idea of the algorithm
 * rather than the browser's — which is the whole point of measuring.
 */
export async function axNode(page: Page, selector: string): Promise<AxNode> {
  const cdp = await cdpFor(page);
  const doc = await cdp.send('DOM.getDocument', { depth: 0 });
  const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.root.nodeId, selector });
  if (!nodeId) throw new Error(`harness: no element matches ${selector} on the specimen page`);
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false });
  const node = nodes[0];
  if (!node) throw new Error(`harness: ${selector} has no accessibility node`);
  return {
    role: node.role?.value as string | undefined,
    name: node.name?.value as string | undefined,
    description: node.description?.value as string | undefined,
    properties: Object.fromEntries((node.properties ?? []).map((p) => [p.name, p.value.value])),
  };
}

// ── Painted-pixel sampling ───────────────────────────────────────────────────

export type Rgb = [number, number, number];

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare global {
  interface Window {
    __weftBitmap?: {
      data: Uint8ClampedArray;
      width: number;
      height: number;
      originX: number;
      originY: number;
    };
  }
}

/**
 * The coordinate space a capture reads in. Every sample point and every rect
 * handed to the sampler must be in the space its capture recorded, and the
 * capture carries its own origin so the sampler can convert — passing document
 * coordinates against a clipped capture is the mistake this makes impossible.
 */
type CaptureOrigin = { originX: number; originY: number };

async function decodeInto(page: Page, png: Buffer, { originX, originY }: CaptureOrigin) {
  await page.evaluate(
    async ({ b64, ox, oy }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      // Detached canvas — nothing is appended, so capturing cannot perturb the
      // layout the next capture measures.
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      window.__weftBitmap = { data, width: img.width, height: img.height, originX: ox, originY: oy };
    },
    { b64: png.toString('base64'), ox: originX, oy: originY },
  );
}

/**
 * Capture the whole document once and decode it inside the page. Sample points
 * are then in DOCUMENT coordinates.
 *
 * One capture per axis combination rather than one per specimen: the boundary
 * matrix runs to a hundred-odd cells, and a screenshot each would make the
 * suite too slow to keep in the gate battery — which is the same as not having
 * it. Chromium decodes its own PNG, so no image codec enters this repository's
 * dependency graph.
 */
export async function captureDocument(page: Page): Promise<void> {
  const png = await page.screenshot({ fullPage: true });
  await decodeInto(page, png, { originX: 0, originY: 0 });
}

/**
 * Capture one region. Sample points are then in VIEWPORT coordinates.
 *
 * Used for the states a capture cannot batch — hover and focus apply to one
 * element at a time, so the whole-document capture has nothing to offer them.
 */
export async function captureRegion(page: Page, clip: Rect): Promise<void> {
  const safe = {
    x: Math.max(0, Math.floor(clip.x)),
    y: Math.max(0, Math.floor(clip.y)),
    width: Math.ceil(clip.width),
    height: Math.ceil(clip.height),
  };
  const png = await page.screenshot({ clip: safe });
  await decodeInto(page, png, { originX: safe.x, originY: safe.y });
}

/** Document-space rects for every element matching a selector, keyed by element id. */
export async function documentRects(page: Page, selector: string): Promise<Map<string, Rect>> {
  const entries = await page.evaluate((sel) => {
    const out: [string, { x: number; y: number; width: number; height: number }][] = [];
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      const r = el.getBoundingClientRect();
      out.push([
        el.id,
        { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height },
      ]);
    }
    return out;
  }, selector);
  return new Map(entries);
}

/** Read points out of the captured bitmap. Out-of-bounds points throw rather than clamp. */
export async function samplePoints(page: Page, points: [number, number][]): Promise<Rgb[]> {
  return page.evaluate((pts) => {
    const bmp = window.__weftBitmap;
    if (!bmp) throw new Error('harness: no capture has run for this axis combination');
    return pts.map(([x, y]) => {
      const px = Math.round(x - bmp.originX);
      const py = Math.round(y - bmp.originY);
      if (px < 0 || py < 0 || px >= bmp.width || py >= bmp.height) {
        throw new Error(
          `harness: sample point ${x},${y} falls outside the capture ` +
            `(${bmp.width}x${bmp.height} at ${bmp.originX},${bmp.originY})`,
        );
      }
      const i = (py * bmp.width + px) * 4;
      return [bmp.data[i], bmp.data[i + 1], bmp.data[i + 2]] as [number, number, number];
    });
  }, points);
}

// ── Contrast maths ───────────────────────────────────────────────────────────
// Deliberately duplicated in shape but not in source from
// scripts/__tests__/contrast-contract.node.mjs: that gate reads token STRINGS
// out of the stylesheet and composites them arithmetically, this one reads
// pixels the compositor already produced. Sharing an implementation would mean
// sharing an input model the two do not share.

export function relativeLuminance([r, g, b]: Rgb): number {
  const [rl, gl, bl] = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function maxChannelDelta(a: Rgb, b: Rgb): number {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
}

export function rgbText([r, g, b]: Rgb): string {
  return `rgb(${r},${g},${b})`;
}

function sameColour(a: Rgb, b: Rgb): boolean {
  return maxChannelDelta(a, b) <= 2;
}

/** The colour occurring most often in a set of samples — the control's fill, not a glyph. */
function modal(samples: Rgb[]): Rgb {
  let best = samples[0];
  let bestCount = 0;
  for (const candidate of samples) {
    const count = samples.filter((s) => sameColour(s, candidate)).length;
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }
  return best;
}

export interface BoundaryReading {
  ground: Rgb;
  fill: Rgb;
  border: Rgb;
  borderRatio: number;
  fillRatio: number;
  best: number;
}

/**
 * Read a control's boundary against what it sits on.
 *
 * GROUND is sampled in the gutter either side of the control at mid-height, and
 * the two must agree — if they do not, the specimen is sitting on something the
 * harness cannot name and it says so instead of guessing.
 *
 * FILL is the modal colour of five interior points, so a glyph, a caret or the
 * select chevron cannot be mistaken for the fill.
 *
 * BORDER is the pixel in a short vertical strip through the top edge with the
 * highest contrast against the ground — the strongest edge cue the control
 * actually offers. Anti-aliasing only ever weakens the pixels either side of
 * it, so taking the strongest is the reading most generous to the code, which
 * is the right direction for a floor.
 */
export async function readBoundary(page: Page, rect: Rect): Promise<BoundaryReading> {
  const { x, y, width: w, height: h } = rect;
  const midY = y + h / 2;

  const groundPoints: [number, number][] = [
    [x + w + 6, midY],
    [x - 6, midY],
  ];
  const fillPoints: [number, number][] = [
    [x + w * 0.3, midY],
    [x + w * 0.5, midY],
    [x + w * 0.7, midY],
    [x + w * 0.5, y + h * 0.3],
    [x + w * 0.5, y + h * 0.7],
  ];
  // -4 .. +4 around the top edge: wide enough to include a 4px focus ring
  // spreading outward, narrow enough not to reach the fill's interior.
  const edgePoints: [number, number][] = [];
  for (let dy = -4; dy <= 4; dy += 1) edgePoints.push([x + w / 2, y + dy]);

  const all = await samplePoints(page, [...groundPoints, ...fillPoints, ...edgePoints]);
  const [groundRight, groundLeft] = all.slice(0, 2);
  const fillSamples = all.slice(2, 2 + fillPoints.length);
  const edgeSamples = all.slice(2 + fillPoints.length);

  if (!sameColour(groundRight, groundLeft)) {
    throw new Error(
      `harness: the ground either side of the control disagrees ` +
        `(${rgbText(groundLeft)} left, ${rgbText(groundRight)} right). ` +
        `The specimen is overlapping something — fix the fixture, do not average it.`,
    );
  }

  const ground = groundRight;
  const fill = modal(fillSamples);
  let border = edgeSamples[0];
  for (const candidate of edgeSamples) {
    if (contrastRatio(candidate, ground) > contrastRatio(border, ground)) border = candidate;
  }

  const borderRatio = contrastRatio(border, ground);
  const fillRatio = contrastRatio(fill, ground);
  return { ground, fill, border, borderRatio, fillRatio, best: Math.max(borderRatio, fillRatio) };
}
