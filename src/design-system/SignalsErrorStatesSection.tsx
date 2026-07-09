import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { HudIssueCallout } from '@nodaste-lab/weft/src/ui/HudIssueCallout';
import {
  buildProviderNotRegisteredIssue,
  buildSignalAgentIssue,
  buildSignalConnectionIssue,
  buildSignalProviderIssue,
  type HudIssue,
  type SignalProviderOperation,
} from '../app/runtime/hudIssue';
import { SignalRow } from '../app/components/panels/signals/SignalRow';
import { HudIssueError } from '../app/components/panels/signals/useSignals';
import {
  SignalBlockProvider,
  SignalListRuntime,
  SignalStatsRuntime,
} from '../app/panel-builder/SignalBlockRuntime';
import {
  createDefaultSignalPanelConfig,
  type SignalPanelConfig,
} from '../app/panel-builder/signalPanelConfig';
import {
  globalSignalProviderRegistry,
  type SignalProvider,
} from '../app/integrations/signals/SignalProvider';
import type {
  Signal,
  SignalConnectionState,
  SignalListFilters,
  SignalListResult,
} from '../app/integrations/signals/types';
import { CustomPanelRuntime } from '../app/panel-builder/CustomPanelRuntime';
import {
  createBlockId,
  createDefaultCustomPanelDefinition,
  type CustomPanelBlock,
  type CustomPanelDefinition,
} from '../app/panel-builder/types';

/* ------------------------------------------------------------------ */
/* Docs-only SignalProvider implementations                            */
/* ------------------------------------------------------------------ */

const SAMPLE_SIGNAL: Signal = {
  id: 'docs-sample-signal',
  title: 'Review Q3 roadmap',
  body: 'Draft of the Q3 roadmap is ready for one more pass before we publish to the team.',
  status: 'new',
  priority: 'high',
  source: { kind: 'slack', label: 'Product channel' },
  sender: { id: 'u-avery', name: 'Avery Chen', kind: 'human' },
  updatedAt: new Date().toISOString(),
  responseCount: 0,
  currentVersionId: 'v-1',
};

class DocsHappyProvider implements SignalProvider {
  readonly id = 'docs-signals-happy';
  readonly displayName = 'Docs · Happy';
  async listSignals(_filters?: SignalListFilters): Promise<SignalListResult> {
    return { items: [SAMPLE_SIGNAL], hasMore: false, nextCursor: null };
  }
  async acknowledge() {}
  async resolve() {}
  async appendResponse() {}
  async startWork() {}
  async block() {}
  async requestInfo() {}
  async cancel() {}
  async agentAction() {}
  async generateReply() {
    return '';
  }
  async getAgentPlan() {
    return '';
  }
  getConnectionState(): SignalConnectionState {
    return { status: 'connected' };
  }
  async refreshConnection() {}
}

class DocsFailingListProvider implements SignalProvider {
  readonly id = 'docs-signals-failing-list';
  readonly displayName = 'Docs · Failing list';
  async listSignals(): Promise<SignalListResult> {
    throw new Error('Network unreachable');
  }
  async acknowledge() {}
  async resolve() {}
  async appendResponse() {}
  async startWork() {}
  async block() {}
  async requestInfo() {}
  async cancel() {}
  async agentAction() {}
  async generateReply() {
    return '';
  }
  async getAgentPlan() {
    return '';
  }
  getConnectionState(): SignalConnectionState {
    return { status: 'connected' };
  }
  async refreshConnection() {}
}

class DocsDisconnectedCcoreProvider implements SignalProvider {
  readonly id = 'ccore';
  readonly displayName = 'Docs · Disconnected C-Core';
  async listSignals(): Promise<SignalListResult> {
    return { items: [], hasMore: false, nextCursor: null };
  }
  async acknowledge() {}
  async resolve() {}
  async appendResponse() {}
  async startWork() {}
  async block() {}
  async requestInfo() {}
  async cancel() {}
  async agentAction() {}
  async generateReply() {
    return '';
  }
  async getAgentPlan() {
    return '';
  }
  getConnectionState(): SignalConnectionState {
    return { status: 'error', error: 'Health check failed: 503' };
  }
  async refreshConnection() {}
}

/**
 * Returns happy data on the first list, then throws on subsequent calls —
 * used to show the preservedStateNote copy.
 */
class DocsCachedThenFailProvider implements SignalProvider {
  readonly id = 'docs-signals-cached-then-fail';
  readonly displayName = 'Docs · Cached then fail';
  private calls = 0;
  async listSignals(): Promise<SignalListResult> {
    this.calls += 1;
    if (this.calls === 1) {
      return { items: [SAMPLE_SIGNAL], hasMore: false, nextCursor: null };
    }
    throw new Error('Network unreachable');
  }
  async acknowledge() {}
  async resolve() {}
  async appendResponse() {}
  async startWork() {}
  async block() {}
  async requestInfo() {}
  async cancel() {}
  async agentAction() {}
  async generateReply() {
    return '';
  }
  async getAgentPlan() {
    return '';
  }
  getConnectionState(): SignalConnectionState {
    return { status: 'connected' };
  }
  async refreshConnection() {}
}

let docsProvidersRegistered = false;
function registerDocsProviders(): void {
  if (docsProvidersRegistered) return;
  globalSignalProviderRegistry.register(
    'docs-signals-happy',
    () => new DocsHappyProvider()
  );
  globalSignalProviderRegistry.register(
    'docs-signals-failing-list',
    () => new DocsFailingListProvider()
  );
  globalSignalProviderRegistry.register(
    'docs-signals-cached-then-fail',
    () => new DocsCachedThenFailProvider()
  );
  docsProvidersRegistered = true;
}

/* ------------------------------------------------------------------ */
/* Layout primitives reused by every card                              */
/* ------------------------------------------------------------------ */

const cardStyle: CSSProperties = {
  border: '1px solid var(--hud-border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--hud-surface-raised)',
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const metaGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  rowGap: 4,
  columnGap: 10,
  fontFamily: "'Inter', sans-serif",
  fontSize: 10,
  color: 'var(--hud-text-2)',
};

const metaKeyStyle: CSSProperties = {
  color: 'var(--hud-text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  fontWeight: 600,
};

const metaValueStyle: CSSProperties = {
  color: 'var(--hud-text-1)',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 10,
};

const simulateButtonStyle: CSSProperties = {
  padding: '4px 10px',
  fontSize: 10,
  fontFamily: "'Inter', sans-serif",
  color: 'var(--hud-text-1)',
  background: 'var(--hud-surface-hover)',
  border: '1px solid var(--hud-border)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  alignSelf: 'flex-start',
};

const partTitleStyle: CSSProperties = {
  margin: '24px 0 8px',
  color: 'var(--hud-text-1)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 'var(--text-md)',
  fontWeight: 600,
};

const partDescStyle: CSSProperties = {
  margin: '0 0 14px',
  color: 'var(--hud-text-2)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 'var(--text-xs)',
  lineHeight: 1.6,
};

const sandboxShellStyle: CSSProperties = {
  marginTop: 10,
  padding: 12,
  border: '1px dashed var(--hud-border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--hud-section-fill-strong)',
};

const sandboxLabelStyle: CSSProperties = {
  fontSize: 9,
  color: 'var(--hud-text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 8,
};

interface MetadataRowsProps {
  issue: HudIssue;
  builderLabel: string;
  triggerDescription: string;
  surface: string;
}

function MetadataGrid({
  issue,
  builderLabel,
  triggerDescription,
  surface,
}: MetadataRowsProps) {
  const rows: Array<[string, string]> = [
    ['reason', issue.reason],
    ['source', issue.source],
    ['severity', issue.severity],
    ['scope', issue.scope],
    ['surface', surface],
    ['builder', builderLabel],
    ['trigger', triggerDescription],
  ];
  return (
    <div style={metaGridStyle}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <div style={metaKeyStyle}>{k}</div>
          <div style={metaValueStyle}>{v}</div>
        </div>
      ))}
    </div>
  );
}

interface ErrorStateCardProps {
  name: string;
  description: string;
  issue: HudIssue;
  builderLabel: string;
  triggerDescription: string;
  surface: string;
  simulate?: () => ReactNode;
}

function ErrorStateCard({
  name,
  description,
  issue,
  builderLabel,
  triggerDescription,
  surface,
  simulate,
}: ErrorStateCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={cardStyle}>
      <div>
        <div
          style={{
            color: 'var(--hud-text-1)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 2,
            color: 'var(--hud-text-2)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-xs)',
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>

      <HudIssueCallout issue={issue} variant="compact" />

      <MetadataGrid
        issue={issue}
        builderLabel={builderLabel}
        triggerDescription={triggerDescription}
        surface={surface}
      />

      {simulate ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={simulateButtonStyle}
          >
            {open ? 'Hide simulation' : 'Simulate in real surface'}
          </button>
          {open ? (
            <div style={sandboxShellStyle}>
              <div style={sandboxLabelStyle}>Live surface · {surface}</div>
              {simulate()}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sandboxes                                                           */
/* ------------------------------------------------------------------ */

interface PanelSandboxProps {
  providerId: string;
  kind: 'list' | 'stats';
}

function SignalsPanelSandbox({ providerId, kind }: PanelSandboxProps) {
  const config: SignalPanelConfig = useMemo(
    () => ({
      ...createDefaultSignalPanelConfig(),
      provider: providerId as SignalPanelConfig['provider'],
      collapsedGroups: [],
    }),
    [providerId]
  );
  return (
    <SignalBlockProvider>
      {kind === 'list' ? (
        <SignalListRuntime config={config} title="Signals" />
      ) : (
        <SignalStatsRuntime config={config} title="Signal stats" />
      )}
    </SignalBlockProvider>
  );
}

type RowOperation =
  | 'reply'
  | 'delegate'
  | 'generate_reply'
  | 'get_agent_plan';

type RowReason = 'mutation_failed' | 'unsupported_feature';

interface RowSandboxProps {
  operation: RowOperation;
  reason: RowReason;
}

function unsupportedMessageFor(operation: RowOperation): string {
  switch (operation) {
    case 'delegate':
      return 'Agent actions are not supported on this backend.';
    case 'generate_reply':
      return 'Reply generation is not supported on this backend.';
    case 'get_agent_plan':
      return 'Agent plans are not supported on this backend.';
    default:
      return '';
  }
}

function buildRowIssue(operation: RowOperation, reason: RowReason): HudIssue {
  if (reason === 'unsupported_feature') {
    const message = unsupportedMessageFor(operation);
    return buildSignalProviderIssue({
      error: new Error(message),
      providerId: 'ccore',
      operation: operation as SignalProviderOperation,
    });
  }
  return buildSignalProviderIssue({
    error: new Error('HTTP 500: internal error'),
    providerId: 'mock',
    operation: operation as SignalProviderOperation,
  });
}

function SignalRowSandbox({ operation, reason }: RowSandboxProps) {
  const handlerThatThrows = async () => {
    throw new HudIssueError(buildRowIssue(operation, reason));
  };
  const generateThatThrows = async (): Promise<string> => {
    throw new HudIssueError(buildRowIssue(operation, reason));
  };
  const getPlanThatThrows = async (): Promise<string> => {
    throw new HudIssueError(buildRowIssue(operation, reason));
  };

  return (
    <SignalRow
      signal={SAMPLE_SIGNAL}
      onAppendResponse={
        operation === 'reply' ? handlerThatThrows : undefined
      }
      onAgentAction={
        operation === 'delegate' ? handlerThatThrows : undefined
      }
      onGenerateReply={
        operation === 'generate_reply' ? generateThatThrows : undefined
      }
      onGetAgentPlan={
        operation === 'get_agent_plan' ? getPlanThatThrows : undefined
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Custom panel submit sandbox — scoped fetch shim                     */
/* ------------------------------------------------------------------ */

type SubmitSimKind =
  | 'missing_api_key'
  | 'openai_request_failed'
  | 'openai_empty_response'
  | 'invalid_agent_response'
  | 'unknown';

function buildSubmitIssue(kind: SubmitSimKind): HudIssue {
  switch (kind) {
    case 'missing_api_key':
      return buildSignalAgentIssue({
        kind: 'missing_api_key',
        rawMessage: 'Add an OpenAI API key in App Settings.',
      });
    case 'openai_request_failed':
      return buildSignalAgentIssue({
        kind: 'openai_request_failed',
        rawMessage: 'Rate limit exceeded',
      });
    case 'openai_empty_response':
      return buildSignalAgentIssue({
        kind: 'openai_empty_response',
        rawMessage: 'OpenAI returned an empty response.',
      });
    case 'invalid_agent_response':
      return buildSignalAgentIssue({
        kind: 'invalid_agent_response',
        rawMessage: 'Invalid JSON: unexpected token',
      });
    case 'unknown':
    default:
      return buildSignalAgentIssue({
        kind: 'unknown',
        rawMessage: 'Unexpected agent error',
      });
  }
}

/**
 * Builds a stand-in `fetch` that produces the exact kind of response needed
 * to exercise each `classifySignalAgentError` branch. Scoped to a single
 * submission, then restored.
 */
function buildShimFetch(kind: SubmitSimKind): typeof fetch {
  const jsonResponse = (status: number, body: unknown): Response =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });

  const fn: typeof fetch = async () => {
    switch (kind) {
      case 'openai_request_failed':
        return jsonResponse(429, { error: { message: 'Rate limit exceeded' } });
      case 'openai_empty_response':
        return jsonResponse(200, { choices: [{ message: { content: '' } }] });
      case 'invalid_agent_response':
        return jsonResponse(200, {
          choices: [{ message: { content: 'not a json object' } }],
        });
      case 'unknown':
        return jsonResponse(418, { error: { message: 'Teapot' } });
      default:
        return jsonResponse(200, { choices: [{ message: { content: 'ok' } }] });
    }
  };
  return fn;
}

function buildSubmitDefinition(actionKind: 'openai_prompt' | 'signal_agent_prompt'): CustomPanelDefinition {
  const def = createDefaultCustomPanelDefinition('mode-docs');
  const submitId = createBlockId('submit');
  const submit: Extract<CustomPanelBlock, { type: 'submit-button' }> = {
    id: submitId,
    type: 'submit-button',
    pane: 'input',
    label: 'Run',
    actionLabel: 'Run',
    actionKind,
    promptInstructions: 'Produce a concise response.',
  };
  return {
    ...def,
    uiBlocks: [
      ...def.uiBlocks.filter((b) => b.type !== 'submit-button'),
      submit,
    ],
  };
}

function CustomPanelSubmitSandbox({ kind }: { kind: SubmitSimKind }) {
  const actionKind =
    kind === 'invalid_agent_response' ? 'signal_agent_prompt' : 'openai_prompt';
  const definition = useMemo(() => buildSubmitDefinition(actionKind), [actionKind]);

  const [simulating, setSimulating] = useState(false);

  const runSim = () => {
    if (kind === 'missing_api_key') {
      setSimulating(true);
      return;
    }
    const original = window.fetch;
    const shim = buildShimFetch(kind);
    window.fetch = shim as typeof window.fetch;
    setSimulating(true);
    window.setTimeout(() => {
      window.fetch = original;
    }, 250);
  };

  useEffect(() => {
    if (!simulating) return;
    const target = document.querySelector<HTMLButtonElement>(
      `[data-docs-submit-kind="${kind}"] button`
    );
    target?.click();
    const t = window.setTimeout(() => setSimulating(false), 500);
    return () => window.clearTimeout(t);
  }, [simulating, kind]);

  return (
    <div>
      <button
        type="button"
        onClick={runSim}
        style={{ ...simulateButtonStyle, marginBottom: 8 }}
        title="Installs a doc-only window.fetch shim for this single click, then restores it."
      >
        Trigger submit
      </button>
      <div data-docs-submit-kind={kind}>
        <CustomPanelRuntime definition={definition} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview + section glue                                             */
/* ------------------------------------------------------------------ */

function Overview() {
  return (
    <div
      style={{
        padding: 14,
        border: '1px solid var(--hud-border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--hud-surface)',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          color: 'var(--hud-text-1)',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        How HUD issues are rendered in the signals panel
      </div>
      <div
        style={{
          color: 'var(--hud-text-2)',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'var(--text-xs)',
          lineHeight: 1.6,
        }}
      >
        Every error the signals panel can produce is represented as a
        structured <code>HudIssue</code> and rendered through the shared{' '}
        <code>HudIssueCallout</code> primitive. Each callout surfaces four
        pieces of information in a fixed order: what failed (<em>title</em>),
        where the failure came from (<em>source</em> attribution), the safe
        next step (<em>nextAction</em>), and an optional note that preserved
        state was not discarded. The cards below map every state this system
        can produce today, grouped by which part of the signals panel
        surfaces it.
      </div>
    </div>
  );
}

function Part({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 style={partTitleStyle}>{title}</h3>
      <p style={partDescStyle}>{description}</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 12,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card catalogs                                                       */
/* ------------------------------------------------------------------ */

function PanelListCards() {
  return (
    <>
      <ErrorStateCard
        name="Provider not registered"
        description="The configured provider id has no registered factory in this build."
        issue={buildProviderNotRegisteredIssue({ providerId: 'atlas-signals' })}
        builderLabel="buildProviderNotRegisteredIssue"
        triggerDescription="SignalPanelConfig.provider points to an id not in globalSignalProviderRegistry."
        surface="SignalListRuntime · panel banner"
        simulate={() => (
          <SignalsPanelSandbox
            providerId="docs-signals-not-registered"
            kind="list"
          />
        )}
      />
      <ErrorStateCard
        name="Provider unreachable"
        description="Provider.getConnectionState() reports an error — the backend is not responding."
        issue={buildSignalConnectionIssue({
          providerId: 'ccore',
          rawMessage: 'Health check failed: 503',
        })}
        builderLabel="buildSignalConnectionIssue"
        triggerDescription="connectionState.status === 'error' after a failed health check."
        surface="SignalListRuntime · panel banner"
        simulate={() => (
          <SignalsPanelSandbox providerId="ccore" kind="list" />
        )}
      />
      <ErrorStateCard
        name="List fetch failed (first load)"
        description="listSignals() rejected and there is no cached data to fall back on."
        issue={buildSignalProviderIssue({
          error: new Error('Network unreachable'),
          providerId: 'mock',
          operation: 'list',
        })}
        builderLabel="buildSignalProviderIssue({ operation: 'list' })"
        triggerDescription="First call to provider.listSignals() threw a network error."
        surface="SignalListRuntime · panel banner"
        simulate={() => (
          <SignalsPanelSandbox
            providerId="docs-signals-failing-list"
            kind="list"
          />
        )}
      />
      <ErrorStateCard
        name="List refresh failed (cached state preserved)"
        description="A subsequent refresh failed but previously-loaded signals remain visible."
        issue={buildSignalProviderIssue({
          error: new Error('Network unreachable'),
          providerId: 'mock',
          operation: 'list',
          hadExistingData: true,
        })}
        builderLabel="buildSignalProviderIssue({ operation: 'list', hadExistingData: true })"
        triggerDescription="Refresh after a successful initial load; listSignals() threw but the UI keeps the last snapshot."
        surface="SignalListRuntime · panel banner"
        simulate={() => (
          <SignalsPanelSandbox
            providerId="docs-signals-cached-then-fail"
            kind="list"
          />
        )}
      />
    </>
  );
}

function PanelStatsCards() {
  return (
    <>
      <ErrorStateCard
        name="Provider unreachable (stats)"
        description="Stats panel shows the compact connection-failed callout instead of a generic 'Disconnected' label."
        issue={buildSignalConnectionIssue({
          providerId: 'ccore',
          rawMessage: 'Health check failed: 503',
        })}
        builderLabel="buildSignalConnectionIssue"
        triggerDescription="connectionState.status === 'error' while rendering SignalStatsRuntime."
        surface="SignalStatsRuntime · compact callout"
        simulate={() => (
          <SignalsPanelSandbox providerId="ccore" kind="stats" />
        )}
      />
      <ErrorStateCard
        name="Provider not registered (stats)"
        description="Stats panel renders the compact HUD-config callout when no provider factory is available."
        issue={buildProviderNotRegisteredIssue({ providerId: 'atlas-signals' })}
        builderLabel="buildProviderNotRegisteredIssue"
        triggerDescription="SignalPanelConfig.provider points to an id not in globalSignalProviderRegistry."
        surface="SignalStatsRuntime · compact callout"
        simulate={() => (
          <SignalsPanelSandbox
            providerId="docs-signals-not-registered-stats"
            kind="stats"
          />
        )}
      />
    </>
  );
}

const ROW_OPS: Array<{ id: RowOperation; label: string; supportsUnsupported: boolean }> = [
  { id: 'reply', label: 'Send reply', supportsUnsupported: false },
  { id: 'delegate', label: 'Delegate to agent', supportsUnsupported: true },
  { id: 'generate_reply', label: 'Generate draft reply', supportsUnsupported: true },
  { id: 'get_agent_plan', label: 'Load agent plan', supportsUnsupported: true },
];

function RowActionsCards() {
  const [selectedOp, setSelectedOp] = useState<RowOperation>('reply');
  const selected = ROW_OPS.find((o) => o.id === selectedOp) ?? ROW_OPS[0];

  const mutationIssue = buildRowIssue(selected.id, 'mutation_failed');
  const unsupportedIssue = selected.supportsUnsupported
    ? buildRowIssue(selected.id, 'unsupported_feature')
    : null;

  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: 12,
        }}
      >
        {ROW_OPS.map((op) => {
          const active = op.id === selectedOp;
          return (
            <button
              key={op.id}
              type="button"
              onClick={() => setSelectedOp(op.id)}
              style={{
                padding: '4px 10px',
                fontSize: 10,
                fontFamily: "'Inter', sans-serif",
                color: active ? 'var(--hud-text-1)' : 'var(--hud-text-2)',
                background: active
                  ? 'var(--hud-surface-hover)'
                  : 'var(--hud-surface-raised)',
                border: `1px solid ${
                  active ? 'var(--hud-border-accent)' : 'var(--hud-border)'
                }`,
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
              }}
            >
              {op.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 12,
        }}
      >
        <ErrorStateCard
          key={`${selected.id}-mutation`}
          name={`${selected.label} · mutation_failed`}
          description="Provider rejected the action with a generic error (e.g. HTTP 500)."
          issue={mutationIssue}
          builderLabel={`buildSignalProviderIssue({ operation: '${selected.id}' })`}
          triggerDescription={`provider.${selected.id === 'reply' ? 'appendResponse' : selected.id === 'delegate' ? 'agentAction' : selected.id === 'generate_reply' ? 'generateReply' : 'getAgentPlan'}() threw an error from useSignals.runRowAction.`}
          surface="SignalRow · compact callout in expanded detail"
          simulate={() => (
            <SignalRowSandbox operation={selected.id} reason="mutation_failed" />
          )}
        />
        {unsupportedIssue ? (
          <ErrorStateCard
            key={`${selected.id}-unsupported`}
            name={`${selected.label} · unsupported_feature`}
            description="C-Core does not expose this capability yet; the HUD explains the gap and attributes it to the backend."
            issue={unsupportedIssue}
            builderLabel={`buildSignalProviderIssue({ operation: '${selected.id}' }) // matched CCORE_UNSUPPORTED_MATCHERS`}
            triggerDescription={`C-Core threw '${unsupportedMessageFor(selected.id)}' — recognized as a capability gap.`}
            surface="SignalRow · compact callout in expanded detail"
            simulate={() => (
              <SignalRowSandbox
                operation={selected.id}
                reason="unsupported_feature"
              />
            )}
          />
        ) : null}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 10,
          border: '1px solid var(--hud-border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--hud-surface)',
          color: 'var(--hud-text-2)',
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--hud-text-1)' }}>
          Status mutations (acknowledge, resolve, startWork, block,
          requestInfo, cancel)
        </strong>{' '}
        also flow through <code>useSignals.runRowAction</code> and throw the
        same <code>HudIssueError</code> on failure — including{' '}
        <code>data_unavailable_for_platform</code> when the backend omits{' '}
        <code>current_version_id</code>. <code>SignalRow</code> currently
        invokes these handlers without awaiting them, so their issues are
        captured by the hook but not rendered inline today. The callout copy
        is identical to the mutation_failed card above with
        operation-specific verbs.
      </div>
    </div>
  );
}

function CustomPanelSubmitCards() {
  const kinds: Array<{ id: SubmitSimKind; name: string; description: string }> = [
    {
      id: 'missing_api_key',
      name: 'Missing OpenAI API key',
      description: 'Attempted to run an OpenAI- or signal-agent-backed submit with no API key configured.',
    },
    {
      id: 'openai_request_failed',
      name: 'OpenAI request failed',
      description: 'OpenAI responded with a non-2xx status (e.g. rate limit, auth rejection).',
    },
    {
      id: 'openai_empty_response',
      name: 'OpenAI returned empty content',
      description: 'OpenAI returned 200 but the assistant message was empty, so no answer could be rendered.',
    },
    {
      id: 'invalid_agent_response',
      name: 'Invalid agent response',
      description: 'The signal-agent parser could not interpret the response as a SignalPanelConfig.',
    },
    {
      id: 'unknown',
      name: 'Unknown agent failure',
      description: 'Something outside the known categories — the HUD falls back to the generic signal-agent callout.',
    },
  ];
  return (
    <>
      {kinds.map((k) => (
        <ErrorStateCard
          key={k.id}
          name={k.name}
          description={k.description}
          issue={buildSubmitIssue(k.id)}
          builderLabel={
            k.id === 'missing_api_key' || k.id === 'openai_request_failed' ||
            k.id === 'openai_empty_response' || k.id === 'invalid_agent_response'
              ? `buildSignalAgentIssue({ kind: '${k.id}' })`
              : `buildSignalAgentIssue({ kind: 'unknown' })`
          }
          triggerDescription={
            k.id === 'missing_api_key'
              ? 'runCustomPanelSubmitAction threw \'OpenAI API key is required\' before calling fetch.'
              : k.id === 'openai_request_failed'
                ? 'fetch(openai) resolved with !ok — message contained "OpenAI error".'
                : k.id === 'openai_empty_response'
                  ? 'fetch(openai) returned 200 with empty content — message contained "empty response".'
                  : k.id === 'invalid_agent_response'
                    ? 'signal_agent_prompt parser threw "invalid json".'
                    : 'Any throw that did not match the above classifier patterns.'
          }
          surface="CustomPanelRuntime · submit-button callout"
          simulate={() => <CustomPanelSubmitSandbox kind={k.id} />}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Public section                                                      */
/* ------------------------------------------------------------------ */

export function SignalsErrorStatesSection() {
  useEffect(() => {
    registerDocsProviders();
  }, []);

  return (
    <section id="signals-error-states" style={{ marginTop: 48 }}>
      <div style={{ marginBottom: 8 }}>
        <h2
          style={{
            margin: 0,
            color: 'var(--hud-text-1)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
          }}
        >
          Signals error states
        </h2>
        <div
          style={{
            marginTop: 4,
            color: 'var(--hud-text-2)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-xs)',
            lineHeight: 1.6,
          }}
        >
          Visual mapping of every HUD issue the signals panel can produce
          today, grouped by the surface that renders it.
        </div>
      </div>

      <Overview />

      <Part
        title="Panel · List"
        description="Banner-level issues rendered at the top of SignalListRuntime. These explain why the list cannot load or refresh."
      >
        <PanelListCards />
      </Part>

      <Part
        title="Panel · Stats"
        description="Compact callouts rendered inside SignalStatsRuntime for the same connection and configuration failures as the list panel."
      >
        <PanelStatsCards />
      </Part>

      <Part
        title="Row actions"
        description="Per-row HudIssueError surfaces that appear inside an expanded SignalRow when a provider rejects a row-level action. Pick an operation below to see its mapped states."
      >
        <RowActionsCards />
      </Part>

      <Part
        title="Custom panel submit"
        description="Issues rendered below a submit button when an OpenAI- or signal-agent-backed action fails. The classifySignalAgentError helper routes each thrown error to the matching builder."
      >
        <CustomPanelSubmitCards />
      </Part>
    </section>
  );
}
