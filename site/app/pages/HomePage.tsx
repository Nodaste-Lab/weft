import React from 'react';
import { patterns, primitives, templates } from '../nav';
import { hrefFor } from '../routes';
import { PageTitle } from './shared';
import { guidelineDocs } from '../content';
import { TOKEN_FAMILIES } from '../nav';

const LEVELS = [
  {
    section: 'tokens' as const,
    title: 'Tokens',
    body: 'The smallest unit. Every colour, type, space, radius and motion value, by family, with the value in each theme, palette and density.',
    count: TOKEN_FAMILIES.length,
    unit: 'families',
  },
  {
    section: 'components' as const,
    title: 'Components',
    body: 'Small, reused elements that carry state and change often. Each has one page: live example, purpose, when to use, how to use, heuristics, content, accessibility, API.',
    count: primitives.length,
    unit: 'components',
  },
  {
    section: 'patterns' as const,
    title: 'Patterns',
    body: 'Guidance for a recurring interaction: which components it uses and the rules for combining them.',
    count: patterns.length,
    unit: 'patterns',
  },
  {
    section: 'templates' as const,
    title: 'Templates',
    body: 'A surface ready to apply in a product, with enough documentation for a person or an agent to wire it to real infrastructure.',
    count: templates.length,
    unit: 'templates',
  },
];

export function HomePage() {
  return (
    <div>
      <PageTitle title="Weft" summary="The Nodaste design system: tokens, components, patterns and templates, with the rules for using each." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <a href={hrefFor('guidelines', guidelineDocs[0] ? guidelineDocs[0].file.split('/').pop()!.replace(/\.md$/, '') : undefined)} className="weft-card" style={cardStyle}>
          <span style={cardTitleStyle}>Guidelines</span>
          <span style={cardBodyStyle}>Brand, colour and type, accessibility, voice and copy. Read first.</span>
          <span style={cardCountStyle}>{guidelineDocs.length} documents</span>
        </a>
        {LEVELS.map((level) => (
          <a key={level.section} href={hrefFor(level.section)} className="weft-card" style={cardStyle}>
            <span style={cardTitleStyle}>{level.title}</span>
            <span style={cardBodyStyle}>{level.body}</span>
            <span style={cardCountStyle}>
              {level.count} {level.unit}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: 'grid',
  gap: 8,
  alignContent: 'start',
  padding: 16,
  textDecoration: 'none',
  color: 'var(--foreground)',
};
const cardTitleStyle: React.CSSProperties = { fontSize: 17, fontWeight: 600 };
const cardBodyStyle: React.CSSProperties = { fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 };
const cardCountStyle: React.CSSProperties = { fontFamily: 'var(--weft-font-mono)', fontSize: 11, color: 'var(--muted-foreground)' };
