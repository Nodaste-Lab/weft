// @vitest-environment jsdom
//
// Data-driven design-system coverage (NOD-1093). Renders the canonical primitive
// gallery and holds EVERY showcased primitive example to the same contract:
//   1. no axe accessibility violations, and
//   2. no raw colors in its rendered inline styles (tokens only).
//
// Coverage tracks the manifest automatically: a new showcase primitive added to
// manifest.json + the gallery is picked up here with zero new test code. The
// companion coverage ratchet (scripts/verify-ui-test-coverage.mjs) guarantees a
// new primitive actually lands in the gallery so this suite sees it.
//
// We re-render per test rather than share one render across `describe.each`
// because test-setup.ts runs a global afterEach(cleanup) that unmounts a
// beforeAll render; a handful of whole-gallery renders is fast and robust.
import { beforeEach, describe, expect, it } from 'vitest';
import { render, type RenderResult } from '@testing-library/react';
import {
  DesignSystemUiGallery,
  SHOWCASED_PRIMITIVE_IDS,
} from '../DesignSystemUiGallery';
import { expectA11yClean, expectNoRawColors } from '../../test-support/ds-assert';

// A handful of showcase primitives are demonstrated inline inside a composite
// example rather than as their own `#{id}-example` card (e.g. stat-row appears
// within other cards). They are still rendered + a11y/token-checked transitively
// via their host section, and the coverage ratchet asserts each has a test. This
// suite iterates the standalone example sections that are actually present.
let view: RenderResult;

beforeEach(() => {
  view = render(<DesignSystemUiGallery showCategoryLinks={false} />);
});

function presentExampleIds(): string[] {
  const ids = new Set(
    Array.from(view.container.querySelectorAll<HTMLElement>('[id$="-example"]')).map((el) =>
      el.id.replace(/-example$/, ''),
    ),
  );
  return SHOWCASED_PRIMITIVE_IDS.filter((id) => ids.has(id));
}

function sectionFor(id: string): HTMLElement {
  const section = view.container.querySelector<HTMLElement>(`#${CSS.escape(id)}-example`);
  if (!section) throw new Error(`No #${id}-example section in the rendered gallery`);
  return section;
}

describe('design-system gallery primitives', () => {
  it('renders standalone example sections for the showcased primitives', () => {
    // The vast majority of showcase primitives get their own card; guard against
    // the gallery silently losing them.
    expect(presentExampleIds().length).toBeGreaterThanOrEqual(80);
  });

  it('every primitive example is accessibility-clean', async () => {
    const failures: string[] = [];
    for (const id of presentExampleIds()) {
      try {
        await expectA11yClean(sectionFor(id));
      } catch (err) {
        const message = (err as Error).message;
        // jsdom cannot introspect <iframe> content, so axe throws on iframe-based
        // primitives (html-viewer). That is a tooling limitation, not an a11y
        // defect — skip it rather than masking real failures elsewhere.
        if (message.includes('Respondable target must be a frame')) continue;
        failures.push(`${id}: ${message.split('\n').slice(0, 4).join(' ')}`);
      }
    }
    expect(failures, `Accessibility violations:\n${failures.join('\n\n')}`).toEqual([]);
  }, 60000);

  it('every primitive example uses design tokens (no raw colors)', () => {
    const failures: string[] = [];
    for (const id of presentExampleIds()) {
      try {
        expectNoRawColors(sectionFor(id));
      } catch (err) {
        failures.push(`${id}: ${(err as Error).message}`);
      }
    }
    expect(failures, `Raw-color violations:\n${failures.join('\n')}`).toEqual([]);
  });
});
