// @vitest-environment jsdom
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { DesignSystemUiGallery } from '../DesignSystemUiGallery';

/**
 * The two recorded gallery gaps (weft#16 owner validation, 2026-08-12; PB in
 * the async-pending plan): the visual suite photographed no FormStatus
 * specimen and no invalid/error specimen — both presentations were carried
 * entirely by contract suites against the specimen page. These tests pin the
 * gallery side of the fix: the cards exist, and they compose the states the
 * baselines are meant to photograph. Pixel truth stays with
 * tests/visual/gallery.spec.ts; exposure truth stays with the ui suites —
 * what is asserted here is that the SHOWCASE actually mounts the states.
 */

function renderCard(id: string) {
  return render(<DesignSystemUiGallery ids={[id]} showCategoryLinks={false} />);
}

describe('gallery — FormStatus showcase (the async pending presentation, 0.5.0)', () => {
  it('ships a form-status card on the Forms shelf', () => {
    const { container } = renderCard('form-status');
    const section = container.querySelector('#form-status-example');
    expect(section, 'the form-status card must render').toBeTruthy();
    expect(
      section!.getAttribute('data-component-category'),
      'showcase-only cards carry their shelf category — uncategorized is the map decaying',
    ).toBe('forms');
  });

  it('shows pending as text plus the dot, with aria-busy on the control', () => {
    const { container } = renderCard('form-status');
    const pending = container.querySelector('[data-slot="form-status"][data-pending="true"]');
    expect(pending, 'a pending specimen must be shown').toBeTruthy();
    expect(
      pending!.querySelector('[data-status-dot]'),
      'pending carries the dot — the non-colour signal',
    ).toBeTruthy();
    const item = pending!.closest('[data-slot="form-item"]')!;
    // Composed under FormControl the input's data-slot is overridden to
    // "form-control" (the Slot's props land after Input's own attribute), so
    // the control is found by tag, not by slot name.
    const control = item.querySelector('input')!;
    expect(control, 'the pending field mounts a control').toBeTruthy();
    expect(
      control.getAttribute('aria-busy'),
      'the control is busy while the supplied state is pending',
    ).toBe('true');
  });

  it('shows all four settled tones, each with its own words', () => {
    const { container } = renderCard('form-status');
    const texts = new Map<string, string>();
    for (const tone of ['ok', 'info', 'warn', 'stop']) {
      const el = container.querySelector(`[data-slot="form-status"][data-tone="${tone}"]`);
      expect(el, `a ${tone}-toned specimen must be shown`).toBeTruthy();
      expect(
        el!.querySelector('[data-status-dot]'),
        'the dot means pending; a settled result has none',
      ).toBeNull();
      texts.set(tone, (el!.textContent ?? '').trim());
    }
    // S15's rule, carried to the gallery: tone colour is never the only
    // signal distinguishing two states, so no two tones may share their text.
    const unique = new Set(texts.values());
    expect(unique.size, 'identical-text tone pairs are refused').toBe(texts.size);
    expect([...texts.values()].every((t) => t.length > 0)).toBe(true);
  });

  it('composes error + status + help as ONE ordered describedby list (A9: error, status, help)', () => {
    const { container } = renderCard('form-status');
    const invalid = container.querySelector('input[aria-invalid="true"]');
    expect(invalid, 'the composition specimen mounts an invalid control').toBeTruthy();
    const ids = (invalid!.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids.length, 'error, status and help are all referenced').toBe(3);
    const slots = ids.map((refId) => {
      const el = container.querySelector(`[id="${refId}"]`);
      expect(el, `describedby id ${refId} must resolve to a mounted element`).toBeTruthy();
      return el!.getAttribute('data-slot');
    });
    // Order asserted by POSITION — ids present in the wrong order satisfy
    // every existence and resolution check, and once did.
    expect(slots).toEqual(['form-message', 'form-status', 'form-description']);
  });
});

describe('gallery — error-state card (the 2026-08-12 recorded gap)', () => {
  it('ships an input-error-states card on the Inputs shelf', () => {
    const { container } = renderCard('input-error-states');
    const section = container.querySelector('#input-error-states-example');
    expect(section, 'the error-state card must render').toBeTruthy();
    expect(section!.getAttribute('data-component-category')).toBe('inputs');
  });

  it('mounts a standalone invalid input — the specimen the trailing-glyph selector actually matches', () => {
    const { container } = renderCard('input-error-states');
    // Composed under FormControl the input loses data-slot="input" (the
    // Slot's props override it), and with it the CSS trailing glyph — so the
    // glyph carrier here must be a standalone Input, asserted by the same
    // selector css/weft-components.css keys the glyph on.
    const input = container.querySelector(
      '#input-error-states-example [data-slot="input"][aria-invalid="true"]:not([disabled])',
    );
    expect(input, 'the invalid input is what the stop boundary and trailing glyph key on').toBeTruthy();
  });

  it('mounts a composed error field with a glyph-led message', () => {
    const { container } = renderCard('input-error-states');
    const composed = container.querySelector(
      '#input-error-states-example input[aria-invalid="true"]:not([disabled])',
    );
    expect(composed, 'the composed field mounts an invalid control').toBeTruthy();
    const message = container.querySelector('#input-error-states-example [data-slot="form-message"]');
    expect(message, 'the error message renders').toBeTruthy();
    expect(
      message!.querySelector('svg[aria-hidden="true"]'),
      'the message leads with the alert glyph — colour is never the only signal',
    ).toBeTruthy();
    expect((message!.textContent ?? '').trim().length).toBeGreaterThan(0);
  });

  it('mounts an invalid textarea — the trailing glyph rides aria-invalid', () => {
    const { container } = renderCard('input-error-states');
    expect(
      container.querySelector('#input-error-states-example [data-slot="textarea"][aria-invalid="true"]'),
    ).toBeTruthy();
  });

  it('mounts an invalid select trigger — the stated chevron-owns-the-edge exception', () => {
    const { container } = renderCard('input-error-states');
    const trigger = container.querySelector(
      '#input-error-states-example [data-slot="select-trigger"][aria-invalid="true"]',
    );
    expect(trigger, 'the invalid select trigger renders with its slot identity intact').toBeTruthy();
    // The exception is border PLUS the glyph-led message, never border alone
    // (04 § Form inputs: "its non-colour cue is the message icon plus the
    // border — asserted, not omitted"). The trigger must reference a mounted
    // glyph-led error message.
    const ids = (trigger!.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
    expect(ids.length, 'the select error message is associated, not adjacent').toBeGreaterThan(0);
    const message = container.querySelector(`[id="${ids[0]}"]`);
    expect(message, 'the referenced message resolves to a mounted element').toBeTruthy();
    expect(
      message!.classList.contains('weft-field-hint') && message!.classList.contains('is-error'),
      'the message is the glyph-led error hint — the glyph rides .is-error',
    ).toBe(true);
    expect((message!.textContent ?? '').trim().length).toBeGreaterThan(0);
  });

  it('mounts the disabled+invalid compose — dashed and stop-coloured, both states true at once', () => {
    const { container } = renderCard('input-error-states');
    expect(
      container.querySelector(
        '#input-error-states-example [data-slot="input"][aria-invalid="true"][disabled]',
      ),
    ).toBeTruthy();
  });
});
