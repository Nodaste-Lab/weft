import React from 'react';

export type Section = 'home' | 'guidelines' | 'tokens' | 'components' | 'patterns' | 'templates' | 'all' | 'labs';

export interface Route {
  section: Section;
  id?: string;
}

const SECTIONS: readonly Section[] = ['home', 'guidelines', 'tokens', 'components', 'patterns', 'templates', 'all', 'labs'];

/** True for an app route (`#/…`); false for a plain fragment such as `#main`, which the browser owns. */
export function isRouteHash(hash: string): boolean {
  return hash === '' || hash === '#' || hash.startsWith('#/');
}

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (!path) return { section: 'home' };
  const [head, ...rest] = path.split('/');
  const section = SECTIONS.find((s) => s === head);
  if (!section) return { section: 'home' };
  const requestedId = rest.length ? decodeURIComponent(rest.join('/')) : undefined;
  const id = section === 'templates' && requestedId === 'navigation-rail' ? 'workspace-navigation-rail' : requestedId;
  return id ? { section, id } : { section };
}

export function hrefFor(section: Section, id?: string): string {
  return id ? `#/${section}/${encodeURIComponent(id)}` : section === 'home' ? '#/' : `#/${section}`;
}

export function useRoute(): Route {
  const [route, setRoute] = React.useState<Route>(() => (isRouteHash(window.location.hash) ? parseHash(window.location.hash) : { section: 'home' }));
  React.useEffect(() => {
    const onChange = () => {
      // A fragment link (skip link, in-page anchor) is not a navigation: keep
      // the route and let the browser move to the target.
      if (!isRouteHash(window.location.hash)) return;
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route.section, route.id]);
  return route;
}
