import React from 'react';
import { createRoot } from 'react-dom/client';
import { DesignSystemUiGallery } from '../src/gallery/DesignSystemUiGallery';
import manifest from '../manifest.json';
import '../css/index.css';

function ThemeToggle() {
  const [dark, setDark] = React.useState(
    () => document.documentElement.getAttribute('data-theme') === 'dark',
  );
  React.useEffect(() => {
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }, [dark]);
  return (
    <button type="button" className="weft-btn weft-btn--secondary" onClick={() => setDark(!dark)}>
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}

function Site() {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 24px 96px' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 8,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 4 }}>
            Weft <em>design system</em>
          </h1>
          <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>
            v{manifest.designSystemVersion} · {manifest.uiPrimitives.filter((p) => p.showcase).length}{' '}
            components · tokens-first, light/dark/density aware ·{' '}
            <code>@nodaste-lab/weft</code>
          </p>
        </div>
        <ThemeToggle />
      </header>
      <DesignSystemUiGallery />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Site />);
