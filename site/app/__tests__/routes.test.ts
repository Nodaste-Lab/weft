import { describe, expect, it } from 'vitest';
import { isRouteHash, parseHash } from '../routes';

describe('routes', () => {
  it('treats only "#/" hashes as app routes', () => {
    expect(isRouteHash('')).toBe(true);
    expect(isRouteHash('#/')).toBe(true);
    expect(isRouteHash('#/components/button')).toBe(true);
    expect(isRouteHash('#main')).toBe(false);
    expect(isRouteHash('#button-example')).toBe(false);
  });

  it('parses sections and ids', () => {
    expect(parseHash('#/')).toEqual({ section: 'home' });
    expect(parseHash('#/components/button')).toEqual({ section: 'components', id: 'button' });
    expect(parseHash('#/tokens/color/')).toEqual({ section: 'tokens', id: 'color' });
    expect(parseHash('#/templates/navigation-rail')).toEqual({ section: 'labs', id: 'navigation-rail', level: 'Rail' });
    expect(parseHash('#/templates/workspace-navigation-rail')).toEqual({ section: 'labs', id: 'navigation-rail', level: 'Rail' });
    expect(parseHash('#/labs/navigation-rail')).toEqual({ section: 'labs', id: 'navigation-rail' });
    expect(parseHash('#/labs/unknown')).toEqual({ section: 'labs', id: 'unknown' });
    expect(parseHash('#/nope')).toEqual({ section: 'home' });
  });
});
