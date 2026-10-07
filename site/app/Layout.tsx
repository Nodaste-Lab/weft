import React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import manifest from '../../manifest.json';
import { buildNav, categoryOrder } from './nav';
import { hrefFor, type Route } from './routes';

function ThemeToggle() {
  const [dark, setDark] = React.useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
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

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  React.useEffect(() => setMobileNavOpen(false), [route.section, route.id]);
  const nav = React.useMemo(() => buildNav(), []);
  const componentGroups = nav.filter((g) => g.section === 'components');
  const componentCount = componentGroups.reduce((n, g) => n + g.items.length, 0);
  const documented = componentGroups.reduce((n, g) => n + g.items.filter((i) => (i.written ?? 0) > 0).length, 0);

  return (
    <div className="weft-site-shell" style={shellStyle}>
      <a className="weft-sr-only weft-sr-only-focusable" href="#main">
        Skip to content
      </a>
      <button className="weft-site-mobile-menu weft-btn weft-btn--secondary" aria-expanded={mobileNavOpen} aria-controls="weft-site-nav" onClick={() => setMobileNavOpen(!mobileNavOpen)}>Weft site menu</button>
      <nav id="weft-site-nav" className="weft-site-nav" data-mobile-open={mobileNavOpen} aria-label="Design system" style={navStyle}>
        <a href={hrefFor('home')} style={brandStyle} aria-current={route.section === 'home' ? 'page' : undefined}>
          Weft <span style={brandVersionStyle}>v{manifest.designSystemVersion}</span>
        </a>
        <div style={navScrollStyle}>
          <div style={levelHeadingStyle}>Labs</div>
          <a href="#/labs/navigation-rail" style={linkStyle} aria-current={route.section === 'labs' && route.id === 'navigation-rail' ? 'page' : undefined}>Navigation rail lab</a>
          <a href="#/labs/inputs" style={linkStyle} aria-current={route.section === 'labs' && route.id === 'inputs' ? 'page' : undefined}>Input lab</a>
          {nav.map((group, index) => {
            const isFirstComponentGroup = group.section === 'components' && nav.findIndex((g) => g.section === 'components') === index;
            return (
              <React.Fragment key={group.id}>
                {isFirstComponentGroup ? (
                  <div style={levelHeadingStyle}>
                    <span>Components</span>
                    <span style={countStyle}>
                      {documented}/{componentCount} documented
                    </span>
                  </div>
                ) : null}
                {group.section !== 'components' ? (
                  <div style={levelHeadingStyle}>
                    <span>{group.label}</span>
                  </div>
                ) : (
                  <div style={groupLabelStyle}>{group.label}</div>
                )}
                <ul style={listStyle}>
                  {group.items.map((item) => {
                    const current = route.section === item.section && route.id === item.id;
                    return (
                      <li key={item.id}>
                        <a
                          href={hrefFor(item.section, item.id)}
                          aria-current={current ? 'page' : undefined}
                          style={{ ...linkStyle, ...(current ? currentLinkStyle : null) }}
                        >
                          <span>{item.label}</span>
                          {typeof item.written === 'number' ? (
                            <span
                              style={progressStyle}
                              aria-label={`${item.written} of ${item.total} sections written`}
                              title={`${item.written} of ${item.total} sections written`}
                            >
                              {item.written}/{item.total}
                            </span>
                          ) : null}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </React.Fragment>
            );
          })}
          <div style={levelHeadingStyle}>
            <span>Reference</span>
          </div>
          <ul style={listStyle}>
            <li>
              <a href={hrefFor('all')} style={linkStyle} aria-current={route.section === 'all' ? 'page' : undefined}>
                All components on one page
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div style={mainColumnStyle}>
        <header style={headerStyle}>
          <span style={crumbStyle}>{crumb(route)}</span>
          <ThemeToggle />
        </header>
        <main className="weft-site-main" id="main" tabIndex={-1} style={mainStyle}>
          {children}
        </main>
      </div>
    </div>
  );
}

function crumb(route: Route): string {
  const labels: Record<string, string> = {
    home: 'Overview',
    guidelines: 'Guidelines',
    tokens: 'Tokens',
    components: 'Components',
    patterns: 'Patterns',
    templates: 'Templates',
    all: 'Reference',
    labs: route.id === 'navigation-rail' ? 'Navigation rail lab' : 'Labs',
  };
  return labels[route.section] ?? '';
}

export { categoryOrder };

const shellStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '264px minmax(0, 1fr)',
  minHeight: '100vh',
  background: 'var(--background)',
  color: 'var(--foreground)',
  fontFamily: 'var(--weft-font-sans)',
};

const navStyle: CSSProperties = {
  position: 'sticky',
  top: 0,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--border)',
  background: 'var(--card)',
};

const navScrollStyle: CSSProperties = {
  overflowY: 'auto',
  padding: '8px 12px 32px',
};

const brandStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
  padding: '16px 20px 12px',
  color: 'var(--foreground)',
  fontFamily: 'var(--weft-font-serif)',
  fontSize: 22,
  textDecoration: 'none',
  borderBottom: '1px solid var(--border)',
};

const brandVersionStyle: CSSProperties = {
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 11,
  color: 'var(--muted-foreground)',
};

const levelHeadingStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 8,
  margin: '18px 8px 6px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--foreground)',
};

const groupLabelStyle: CSSProperties = {
  margin: '12px 8px 4px',
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 11,
  letterSpacing: '0.04em',
  color: 'var(--muted-foreground)',
};

const countStyle: CSSProperties = {
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 11,
  fontWeight: 400,
  color: 'var(--muted-foreground)',
};

const listStyle: CSSProperties = { listStyle: 'none', margin: 0, padding: 0 };

const linkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minHeight: 'var(--weft-touch-target, 24px)',
  padding: '4px 8px',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--foreground)',
  fontSize: 13,
  textDecoration: 'none',
};

const currentLinkStyle: CSSProperties = {
  background: 'var(--accent)',
  color: 'var(--accent-foreground)',
  fontWeight: 600,
};

const progressStyle: CSSProperties = {
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 10,
  color: 'var(--muted-foreground)',
};

const mainColumnStyle: CSSProperties = { minWidth: 0, display: 'flex', flexDirection: 'column' };

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '12px 32px',
  borderBottom: '1px solid var(--border)',
};

const crumbStyle: CSSProperties = {
  fontFamily: 'var(--weft-font-mono)',
  fontSize: 12,
  color: 'var(--muted-foreground)',
};

const mainStyle: CSSProperties = {
  maxWidth: 1080,
  width: '100%',
  padding: '32px 32px 96px',
  boxSizing: 'border-box',
};
