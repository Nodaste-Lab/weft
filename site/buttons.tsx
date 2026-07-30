// TEMPORARY — D4 review surface: every Weft Button variant/size, with the
// board drawer's actual action-row need built from them, so the link variant can
// be judged in context. Not part of the shipped site.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../src/ui/button';
import { ActionButtonRow } from '../src/ui/action-button-row';
import '../css/index.css';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'] as const;
const SIZES = ['lg', 'default', 'sm'] as const;

function Card({ title, note, children }: { title: string; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid var(--weft-rule)', borderRadius: 'var(--weft-radius-card)',
      background: 'var(--weft-paper)', overflow: 'hidden', marginBottom: 14,
    }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--weft-rule)', fontWeight: 700, fontSize: 13 }}>{title}</div>
      <div style={{ padding: 16, background: 'var(--weft-cream)' }}>{children}</div>
      {note ? <div style={{ padding: '10px 14px', borderTop: '1px solid var(--weft-rule)', fontSize: 12.5 }}>{note}</div> : null}
    </div>
  );
}

function App() {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '20px 24px 70px' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 0', marginBottom: 12, background: 'var(--weft-cream)',
        borderBottom: '1px solid var(--weft-rule)',
      }}>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'var(--weft-font-sans)' }}>
          D4 — Weft Button coverage, incl. the link variant
        </h1>
        <button id="t" className="weft-btn is-ghost" style={{ marginLeft: 'auto' }} onClick={() => {
          const r = document.documentElement;
          r.getAttribute('data-theme') === 'dark' ? r.removeAttribute('data-theme') : r.setAttribute('data-theme', 'dark');
        }}>Toggle theme</button>
      </div>

      <Card title="Every variant × size that exists today"
        note={<>Six variants, three text sizes (plus <code>icon</code>). <b>The <code>link</code> column is what D4 asked about</b> — it is <code>text-primary</code> with <code>underline-offset-4</code>, underlining on hover, and it carries no border or fill.</>}>
        <div style={{ display: 'grid', gridTemplateColumns: `90px repeat(${VARIANTS.length}, 1fr)`, gap: 10, alignItems: 'center' }}>
          <div />
          {VARIANTS.map((v) => (
            <div key={v} style={{ fontFamily: 'var(--weft-font-mono)', fontSize: 10.5, color: 'var(--weft-muted)' }}>{v}</div>
          ))}
          {SIZES.map((s) => (
            <React.Fragment key={s}>
              <div style={{ fontFamily: 'var(--weft-font-mono)', fontSize: 10.5, color: 'var(--weft-muted)' }}>size={s}</div>
              {VARIANTS.map((v) => (
                <div key={v + s}><Button variant={v} size={s}>Open</Button></div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <Card title="The drawer's actual need, built only from existing Button"
        note={<><b>This is the D4 question answered in context.</b> Primary action, secondary action, and a trailing link — all <code>size="sm"</code>, no template-local button. The link is pushed to the end by <code>ActionButtonRow align="between"</code>, which is the D3 layout decision, not a button concern.</>}>
        <div style={{ background: 'var(--weft-paper)', border: '1px solid var(--weft-rule-strong)', borderRadius: 4, padding: '10px 12px' }}>
          <ActionButtonRow align="between">
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm">Resolve for me</Button>
              <Button size="sm" variant="outline">Reassign</Button>
            </div>
            <Button size="sm" variant="link">Open in C-Core ↗</Button>
          </ActionButtonRow>
        </div>
      </Card>

      <Card title="Link variant in the other board contexts that need it"
        note={<>The board uses a link-styled control in three more places. All three are covered by <code>variant="link"</code> — no gap. <b>Caveat:</b> a link-styled <i>button</i> is not a link; keep it a <code>&lt;button&gt;</code> for actions and reserve <code>&lt;a&gt;</code> for navigation, or screen readers announce the wrong role.</>}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5 }}>
            <span style={{ color: 'var(--weft-muted)', minWidth: 150 }}>Degradation toast retry</span>
            <Button size="sm" variant="link">Retry</Button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5 }}>
            <span style={{ color: 'var(--weft-muted)', minWidth: 150 }}>Reference-list "more"</span>
            <Button size="sm" variant="link">Show 4 more</Button>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12.5 }}>
            <span style={{ color: 'var(--weft-muted)', minWidth: 150 }}>Copy control (has state)</span>
            <Button size="sm" variant="outline" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <span style={{ fontSize: 11.5, color: 'var(--weft-muted)' }}>
              outline, not link — it is an action with feedback, not navigation
            </span>
          </div>
        </div>
      </Card>

      <Card title="What the plain-CSS layer has, for comparison"
        note={<><b>The gap.</b> React is complete; the CSS layer that panel iframes use has only the blue slab and <code>.is-ghost</code>. No link, no outline, no size scale — which is exactly why the template invented <code>.weft-board-btn.is-link</code>. One <code>.weft-btn.is-link</code> would close it.</>}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="weft-btn">.weft-btn</button>
          <button className="weft-btn is-ghost">.is-ghost</button>
          <span style={{ fontSize: 12, color: 'var(--weft-muted)' }}>— that is all there is</span>
        </div>
      </Card>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
