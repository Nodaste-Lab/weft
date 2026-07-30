// TEMPORARY visual-diff harness — renders each weft-board template part beside
// the existing Weft primitive it overlaps, so "what does this template actually
// introduce?" is answerable by looking. Not part of the shipped site.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Badge } from '../src/ui/badge';
import { Button } from '../src/ui/button';
import { Callout } from '../src/ui/callout';
import { EmptyState } from '../src/ui/empty-state';
import { SourcePill } from '../src/ui/source-pill';
import { StatRow } from '../src/ui/stat-row';
import { ActionButtonRow } from '../src/ui/action-button-row';
import { HudListRow, HudListRowTitle, HudListRowMeta } from '../src/ui/hud-list-row';
import { PanelHeader, PanelHeaderTitle, PanelHeaderActions } from '../src/ui/panel-header';
import { PillToggleGroup, PillToggleGroupItem } from '../src/ui/pill-toggle-group';
import { Input } from '../src/ui/input';
import { Textarea } from '../src/ui/textarea';
import '../css/index.css';

type Verdict = 'same-role' | 'variant' | 'novel';

const V: Record<Verdict, { label: string; tone: string }> = {
  'same-role': { label: 'Same role — swap in', tone: 'var(--weft-ok)' },
  variant: { label: 'Introduces a variant', tone: 'var(--weft-warn)' },
  novel: { label: 'Novel — nothing to compare', tone: 'var(--weft-link)' },
};

function Pair({
  name, cls, verdict, note, existing, introduced,
}: {
  name: string; cls: string; verdict: Verdict; note: React.ReactNode;
  existing: React.ReactNode; introduced: React.ReactNode;
}) {
  const v = V[verdict];
  return (
    <div data-pair={name} style={{
      border: '1px solid var(--weft-rule)', borderRadius: 'var(--weft-radius-card)',
      background: 'var(--weft-paper)', overflow: 'hidden', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '11px 14px', borderBottom: '1px solid var(--weft-rule)' }}>
        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{name}</span>
        <span style={{
          marginLeft: 'auto', fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em',
          textTransform: 'uppercase', padding: '2px 7px', borderRadius: 'var(--weft-radius-pill)',
          border: '1px solid currentColor', color: v.tone, whiteSpace: 'nowrap',
        }}>{v.label}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ borderRight: '1px solid var(--weft-rule)' }}>
          <div style={col}>Already in Weft</div>
          <div style={{ ...cell, minHeight: 92 }} data-side="existing">{existing}</div>
        </div>
        <div>
          <div style={{ ...col, color: 'var(--weft-link)' }}>Introduced by weft-board</div>
          <div style={{ ...cell, minHeight: 92 }} data-side="introduced">{introduced}</div>
        </div>
      </div>
      <div style={{ padding: '10px 14px', fontSize: 12.5, borderTop: '1px solid var(--weft-rule)' }}>
        <div style={{ fontFamily: 'var(--weft-font-mono)', fontSize: 10.5, color: 'var(--weft-muted)', marginBottom: 5 }}>{cls}</div>
        {note}
      </div>
    </div>
  );
}

const col: React.CSSProperties = {
  padding: '6px 14px', fontSize: 10, letterSpacing: '.09em', textTransform: 'uppercase',
  color: 'var(--weft-muted)', background: 'var(--weft-fill-soft)', borderBottom: '1px solid var(--weft-rule)',
};
const cell: React.CSSProperties = {
  padding: 16, background: 'var(--weft-cream)', display: 'flex',
  alignItems: 'center', justifyContent: 'center',
};

function Sec({ children }: { children: React.ReactNode }) {
  return <h2 style={{
    fontFamily: 'var(--weft-font-sans)', fontSize: 12, letterSpacing: '.11em',
    textTransform: 'uppercase', color: 'var(--weft-muted)', margin: '30px 0 12px', fontWeight: 700,
  }}>{children}</h2>;
}

function App() {
  const [rel, setRel] = React.useState('expanded');
  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 24px 80px' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 0', marginBottom: 10, background: 'var(--weft-cream)',
        borderBottom: '1px solid var(--weft-rule)',
      }}>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'var(--weft-font-sans)' }}>
          Visual diff — what weft-board introduces
        </h1>
        <button id="t" className="weft-btn is-ghost" style={{ marginLeft: 'auto' }}
          onClick={() => {
            const r = document.documentElement;
            r.getAttribute('data-theme') === 'dark'
              ? r.removeAttribute('data-theme') : r.setAttribute('data-theme', 'dark');
          }}>Toggle theme</button>
      </div>

      <Sec>Pure duplication — the existing primitive already does this</Sec>

      <Pair name="Action row" cls="weft-board-item  ·vs·  HudListRow"
        verdict="same-role"
        note={<>Same anatomy: title stack, sub line, trailing chips. <b>HudListRow additionally</b> carries state accents (unread / overdue / resolved) and density variants the template has no equivalent for.</>}
        existing={
          <div style={{ width: '100%', background: 'var(--weft-paper)', border: '1px solid var(--weft-rule)', borderRadius: 4 }}>
            <HudListRow trailing={<><Badge variant="outline">signal</Badge></>}>
              <HudListRowTitle>Account Recovery dependency unresolved</HudListRowTitle>
              <HudListRowMeta>Blocked · 5d — oldest open item</HudListRowMeta>
            </HudListRow>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%' }}>
            <section className="weft-board-tier">
              <div className="weft-board-item">
                <div className="weft-board-item-col">
                  <div className="weft-board-item-title">Account Recovery dependency unresolved</div>
                  <div className="weft-board-item-sub">Blocked · 5d — oldest open item</div>
                </div>
                <span className="weft-board-type">signal</span>
              </div>
            </section>
          </div>
        } />

      <Pair name="Compact panel row" cls="weft-board-panel-row  ·vs·  StatRow"
        verdict="same-role"
        note={<>Label left, value right. <b>Identical role.</b> The template adds a leading status dot, which <code>StatRow</code> has no slot for — that is the only delta.</>}
        existing={
          <div style={{ width: '100%', background: 'var(--weft-paper)', border: '1px solid var(--weft-rule)', borderRadius: 4, padding: 10 }}>
            <StatRow label="Blockers · act now" value="1" />
            <StatRow label="Awaiting you" value="4" />
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%' }}>
            <div className="weft-board-panel"><div className="weft-board-panel-body">
              <div className="weft-board-panel-row"><span className="weft-board-dot is-stop" />Blockers · act now<span className="weft-board-panel-row-count">1</span></div>
              <div className="weft-board-panel-row"><span className="weft-board-dot is-warn" />Awaiting you<span className="weft-board-panel-row-count">4</span></div>
            </div></div>
          </div>
        } />

      <Pair name="Drawer action row" cls="weft-board-drawer-actions  ·vs·  ActionButtonRow"
        verdict="same-role"
        note={<>Same grouped-actions container. <b>ActionButtonRow</b> already supports start/end/between alignment; the template hard-codes the link button to <code>margin-left:auto</code>.</>}
        existing={
          <div style={{ width: '100%' }}>
            <ActionButtonRow align="between">
              <Button size="sm">Resolve for me</Button>
              <Button size="sm" variant="outline">Reassign</Button>
              <Button size="sm" variant="link">Open in C-Core ↗</Button>
            </ActionButtonRow>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%' }}>
            <div className="weft-board-drawer-actions">
              <button className="weft-board-btn is-primary">Resolve for me</button>
              <button className="weft-board-btn">Reassign</button>
              <button className="weft-board-btn is-link">Open in C-Core ↗</button>
            </div>
          </div>
        } />

      <Sec>Introduces a variant — same family, measurably different</Sec>

      <Pair name="Buttons" cls="weft-board-btn  ·vs·  Button size=sm / default"
        verdict="variant"
        note={<><b>Measured: <code>Button size="sm"</code> is 32px; the template's is 33px.</b> The density argument for a separate button does not hold. The only real deltas are type size (14px → 12.5px) and radius (4px → 2px) — variant-level, not a new component. <b>Delete <code>weft-board-btn</code>; use <code>Button size="sm"</code>.</b></>}
        existing={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button data-m="btn-default">Default</Button>
            <Button size="sm" data-m="btn-sm">Small</Button>
            <Button size="sm" variant="outline">Outline</Button>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="weft-board-btn is-primary" data-m="bd-primary">Primary</button>
            <button className="weft-board-btn" data-m="bd-default">Default</button>
            <button className="weft-board-btn is-link">Link ↗</button>
          </div>
        } />

      <Pair name="Count / space chips" cls="weft-board-tier-count · weft-board-space  ·vs·  Badge"
        verdict="variant"
        note={<>Both are compact count/label pills. <b>Badge ships 5 tones and 4 variants</b>; the template's two chips are a fixed outline pill and a fixed ink-tint. Strictly narrower than what exists.</>}
        existing={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant="outline">4</Badge>
            <Badge variant="secondary">Nodaste Studio</Badge>
            <Badge tone="danger">blocked</Badge>
            <Badge tone="warning">overdue</Badge>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="weft-board-tier-count">4</span>
            <span className="weft-board-space">Nodaste Studio</span>
            <span className="weft-board-status">blocked · 5d</span>
          </div>
        } />

      <Pair name="Mono chip" cls="weft-board-type  ·vs·  SourcePill"
        verdict="variant"
        note={<>Both are small mono pills. <b>Measured: SourcePill 16px tall / 10px type; template chip 19px tall / 9.5px type</b> — smaller text in a <i>taller</i> chip, i.e. just more padding. <code>SourcePill</code> also has truncation and a muted tone the template lacks. Nothing is genuinely introduced here.</>}
        existing={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <SourcePill data-m="src">signal</SourcePill>
            <SourcePill tone="muted">decision</SourcePill>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="weft-board-type" data-m="bd-type">signal</span>
            <span className="weft-board-type">decision</span>
          </div>
        } />

      <Pair name="Segmented toggle" cls="weft-board-seg  ·vs·  PillToggleGroup"
        verdict="variant"
        note={<><b>Joined vs gap-separated.</b> Weft ships the gap-separated pill group; the template introduces the <i>joined</i> segmented look (shared border, inset ring). React has <code>ToggleGroup</code> for joined — the CSS layer does not.</>}
        existing={
          <PillToggleGroup value={rel} onValueChange={setRel}>
            <PillToggleGroupItem value="direct">Direct only</PillToggleGroupItem>
            <PillToggleGroupItem value="expanded">Expanded</PillToggleGroupItem>
          </PillToggleGroup>
        }
        introduced={
          <div className="weft-board" style={{ padding: 12 }}>
            <div className="weft-board-seg" role="group" aria-label="Relatedness">
              <button>Direct only</button>
              <button className="is-on" aria-pressed="true">Expanded</button>
            </div>
          </div>
        } />

      <Pair name="Hint / provenance band" cls="weft-board-context-note · -drawer-prov  ·vs·  Callout"
        verdict="variant"
        note={<><code>Callout</code> already covers this with 5 tones, an icon slot, an action slot and a title. The template introduces only a <b>dashed</b> muted box and a <b>filled footer band</b> — two visual treatments Callout lacks.</>}
        existing={
          <div style={{ width: '100%', display: 'grid', gap: 8 }}>
            <Callout tone="muted" density="compact">Type a query and this becomes Results for ‘token’.</Callout>
            <Callout tone="info" density="compact">Why you’re seeing this: tagged to Heddle UI.</Callout>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%' }}>
            <div style={{ padding: 12 }}><div className="weft-board-context-note">Type a query and this becomes <b>Results for ‘token’</b>.</div></div>
            <div className="weft-board-drawer-prov"><b>Why you’re seeing this:</b> <span className="weft-board-evidence is-direct">direct id</span> tagged to Heddle UI</div>
          </div>
        } />

      <Pair name="Error / empty" cls="weft-board-notice  ·vs·  EmptyState"
        verdict="variant"
        note={<><code>EmptyState</code> is centered with an icon and action slot; the template's notice is a left-aligned dashed strip. <b>Different shape, same job</b> — reconcile rather than keep both.</>}
        existing={<div style={{ width: '100%' }}><EmptyState title="Couldn’t load action items" description="Connecting your account…" /></div>}
        introduced={
          <div className="weft-board" style={{ width: '100%' }}>
            <div className="weft-board-notice"><b>Couldn’t load action items.</b> Connecting your account…</div>
          </div>
        } />

      <Pair name="Panel header" cls="weft-board-head  ·vs·  PanelHeader"
        verdict="variant"
        note={<>Same slots (title + actions + dismiss). The template's title is 19px/600 against <code>PanelHeader</code>'s HUD-dense strip — a <b>larger board-scale header</b> is what's introduced.</>}
        existing={
          <div style={{ width: '100%', background: 'var(--weft-paper)', border: '1px solid var(--weft-rule)', borderRadius: 4 }}>
            <PanelHeader>
              <PanelHeaderTitle>Updates dashboard</PanelHeaderTitle>
              <PanelHeaderActions><Button size="sm" variant="ghost">⟳</Button></PanelHeaderActions>
            </PanelHeader>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%' }}>
            <header className="weft-board-head">
              <div className="weft-board-title">Updates dashboard</div>
              <button className="weft-board-refresh" aria-label="Refresh">⟳</button>
            </header>
          </div>
        } />

      <Pair name="Search + reply fields" cls="weft-board-rail-search · -drawer-reply  ·vs·  Input / Textarea"
        verdict="variant"
        note={<><b>These are not real controls.</b> The template ships display-only divs inherited from the static mock — no focus ring, no typing. The existing <code>Input</code>/<code>Textarea</code> should replace them outright.</>}
        existing={
          <div style={{ width: '100%', display: 'grid', gap: 8 }}>
            <Input placeholder="Search projects…" />
            <Textarea placeholder="Reply…" rows={2} />
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%', padding: 12, display: 'grid', gap: 8 }}>
            <div className="weft-board-rail-search">⌕ Search projects…</div>
            <div className="weft-board-drawer-reply" style={{ margin: 0 }}>↩ Reply…</div>
          </div>
        } />

      <Sec>Genuinely novel — no Weft counterpart to diff against</Sec>

      <Pair name="Urgency-toned tier group" cls="weft-board-tier .is-blocked / .is-awaiting / .is-fyi"
        verdict="novel"
        note={<>Weft can group (<code>SignalGroupCollapsible</code>) and can tone a <i>value</i> (<code>Badge</code>, <code>MetricTile</code>), but <b>nothing tones a group container by urgency</b>. Closest available is an untoned bordered group — shown left.</>}
        existing={
          <div style={{ width: '100%', border: '1px solid var(--weft-rule)', borderRadius: 4, background: 'var(--weft-paper)' }}>
            <div style={{ padding: '8px 11px', borderBottom: '1px solid var(--weft-rule)', fontSize: 13, fontWeight: 600, display: 'flex', gap: 8 }}>
              Blockers <span style={{ marginLeft: 'auto' }}><Badge variant="outline">1</Badge></span>
            </div>
            <div style={{ padding: '8px 11px', fontSize: 12.5, color: 'var(--weft-muted)' }}>no urgency tone available</div>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%', padding: 12 }}>
            <section className="weft-board-tier is-blocked"><header className="weft-board-tier-head"><span className="weft-board-dot is-stop" />Blockers <span className="weft-board-tier-sub">act now</span><span className="weft-board-tier-count">1</span></header></section>
            <section className="weft-board-tier is-awaiting"><header className="weft-board-tier-head"><span className="weft-board-dot is-warn" />Awaiting you<span className="weft-board-tier-count">4</span></header></section>
          </div>
        } />

      <Pair name="Standalone status dot" cls="weft-board-dot .is-ok / .is-warn / .is-stop / .is-info"
        verdict="novel"
        note={<>Weft tones text and pill backgrounds, but has no bare 7px semantic dot. Left shows the nearest thing — a toned <code>Badge</code>, which carries a label you may not want.</>}
        existing={<div style={{ display: 'flex', gap: 8 }}><Badge tone="positive">ok</Badge><Badge tone="warning">warn</Badge><Badge tone="danger">stop</Badge></div>}
        introduced={
          <div className="weft-board" style={{ padding: 12, display: 'flex', gap: 18, fontSize: 12, color: 'var(--weft-muted)', alignItems: 'center' }}>
            <span><span className="weft-board-dot is-ok" /> ok</span>
            <span><span className="weft-board-dot is-warn" /> warn</span>
            <span><span className="weft-board-dot is-stop" /> stop</span>
            <span><span className="weft-board-dot is-info" /> info</span>
          </div>
        } />

      <Pair name="Copyable reference row" cls="weft-board-drawer-ref · weft-board-ref-copy"
        verdict="novel"
        note={<>An ellipsised canonical id with an inline Copy control. Left is the closest assembly available today — a <code>SourcePill</code> plus a small button, which does not truncate or share a frame.</>}
        existing={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
            <SourcePill truncate style={{ flex: 1, minWidth: 0 }}>nodaste-studio/heddle-ui/sig_4c2a3f9e</SourcePill>
            <Button size="sm" variant="outline">Copy</Button>
          </div>
        }
        introduced={
          <div className="weft-board" style={{ width: '100%', padding: 12 }}>
            <div className="weft-board-drawer-ref">
              <code>nodaste-studio/heddle-ui/sig_4c2a3f9e</code>
              <button className="weft-board-ref-copy">Copy</button>
            </div>
          </div>
        } />

      <Pair name="Provenance evidence chips" cls="weft-board-evidence .is-direct / .is-alias / .is-trace"
        verdict="novel"
        note={<>Visually a toned outline chip Weft already has (left). What is introduced is the <b>meaning</b>: a fixed vocabulary for <i>why</i> a row is present, with the rule that absent evidence renders no chip.</>}
        existing={<div style={{ display: 'flex', gap: 8 }}><Badge variant="outline" tone="info">direct id</Badge><Badge variant="outline" tone="positive">alias match</Badge></div>}
        introduced={
          <div className="weft-board" style={{ padding: 12, display: 'flex', gap: 8 }}>
            <span className="weft-board-evidence is-direct">direct id</span>
            <span className="weft-board-evidence is-alias">alias match</span>
            <span className="weft-board-evidence is-trace">trace link</span>
            <span className="weft-board-evidence">no evidence</span>
          </div>
        } />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
