import React from 'react';

export type Section = 'home' | 'guidelines' | 'tokens' | 'components' | 'patterns' | 'templates' | 'all';

export interface Route {
  section: Section;
  id?: string;
}

const SECTIONS: readonly Section[] = ['home', 'guidelines', 'tokens', 'components', 'patterns', 'templates', 'all'];

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (!path) return { section: 'home' };
  const [head, ...rest] = path.split('/');
  const section = SECTIONS.find((s) => s === head);
  if (!section) return { section: 'home' };
  const id = rest.length ? decodeURIComponent(rest.join('/')) : undefined;
  return id ? { section, id } : { section };
}

export function hrefFor(section: Section, id?: string): string {
  return id ? `#/${section}/${encodeURIComponent(id)}` : section === 'home' ? '#/' : `#/${section}`;
}

export function useRoute(): Route {
  const [route, setRoute] = React.useState<Route>(() => parseHash(window.location.hash));
  React.useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route.section, route.id]);
  return route;
}
