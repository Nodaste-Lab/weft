import React from 'react';
import manifest from '../../../manifest.json';
import { DesignSystemUiGallery } from '../../../src/gallery/DesignSystemUiGallery';
import { hrefFor } from '../routes';

/**
 * The one-page gallery at #/all: full width, no rail. The visual suite
 * captures each component section here, so the shell keeps the geometry the
 * site had before navigation (1080px column, 32/24 padding).
 */
export function AllGalleryPage() {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 96px' }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>
            Weft <em>design system</em>
          </h1>
          <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            v{manifest.designSystemVersion} · all components on one page ·{' '}
            <a href={hrefFor('home')}>Back to the site</a>
          </p>
        </div>
      </header>
      <DesignSystemUiGallery />
    </div>
  );
}
