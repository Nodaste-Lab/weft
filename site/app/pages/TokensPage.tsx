import React from 'react';
import { TOKEN_FAMILIES, tokenBlockLabel, tokenBlockNames, tokensForFamily } from '../nav';
import { hrefFor } from '../routes';
import { Code, PageTitle, Table } from './shared';

const COLOR_RE = /^(#|rgb|hsl|oklch|color-mix)/;

function Swatch({ value }: { value: string }) {
  if (!COLOR_RE.test(value.trim())) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        borderRadius: 'var(--radius-xs)',
        border: '1px solid var(--border)',
        background: value,
        verticalAlign: 'middle',
        marginRight: 6,
      }}
    />
  );
}

export function TokensPage({ id }: { id?: string }) {
  const family = TOKEN_FAMILIES.find((f) => f.id === id) ?? TOKEN_FAMILIES[0];
  if (!id) {
    return (
      <div>
        <PageTitle eyebrow="Tokens" title="Tokens" summary="The smallest unit. Every value the components read, by family, with its value in each theme, palette and density block of css/weft.css." />
        <ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
          {TOKEN_FAMILIES.map((f) => (
            <li key={f.id}>
              <a href={hrefFor('tokens', f.id)}>{f.label}</a>{' '}
              <span style={{ color: 'var(--muted-foreground)', fontSize: 12 }}>{tokensForFamily(f.id).length} tokens</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const rows = tokensForFamily(family.id);
  const blocks = tokenBlockNames.filter((b) => rows.some((r) => b in r.values));
  return (
    <div>
      <PageTitle eyebrow="Tokens" title={family.label} summary={`${rows.length} tokens. Columns are the blocks in css/weft.css that set them; an empty cell inherits the base value.`} />
      <div style={{ overflowX: 'auto' }}>
        <Table
          head={['Token', ...blocks.map(tokenBlockLabel)]}
          rows={rows.map((r) => [
            <span key="n" style={{ whiteSpace: 'nowrap' }}><Code>{r.name}</Code></span>,
            ...blocks.map((b) =>
              r.values[b] ? (
                <span key={b} style={{ fontFamily: 'var(--weft-font-mono)', fontSize: 12, whiteSpace: 'nowrap' }}>
                  <Swatch value={r.values[b]} />
                  {r.values[b]}
                </span>
              ) : (
                ''
              ),
            ),
          ])}
        />
      </div>
    </div>
  );
}
