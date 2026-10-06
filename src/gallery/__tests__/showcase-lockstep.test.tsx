// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import manifest from '../../../manifest.json';
import { DesignSystemUiGallery, SHOWCASED_PRIMITIVE_IDS } from '../DesignSystemUiGallery';

const showcase = manifest.uiPrimitives.filter((p) => p.showcase).map((p) => p.id).sort();

describe('gallery showcase lockstep', () => {
  it('lists exactly the manifest showcase ids', () => {
    expect([...SHOWCASED_PRIMITIVE_IDS].sort()).toEqual(showcase);
  });

  it('renders a section for every showcase id on the one-page gallery', () => {
    const { container } = render(<DesignSystemUiGallery />);
    const missing = showcase.filter((id) => !container.querySelector(`#${CSS.escape(id)}-example`));
    expect(missing).toEqual([]);
  });
});
