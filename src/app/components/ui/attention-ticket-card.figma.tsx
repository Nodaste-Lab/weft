// @ts-nocheck — Code Connect maps live in @figma/code-connect's TS context.
import figma from '@figma/code-connect';
import { AttentionTicketCard } from './attention-ticket-card';

figma.connect(
  AttentionTicketCard,
  'https://www.figma.com/design/q58dgHZAnham7wlnjXpgcT/Weft-Design-System?node-id=attention-ticket-card',
  {
    props: {
      expanded: figma.boolean('Expanded'),
    },
    example: ({ expanded }) => (
      <AttentionTicketCard
        reasonLabel="New comment"
        reasonColor="var(--hud-info)"
        projectLabel="Core"
        timestampLabel="2h ago"
        title="Fix login redirect loop"
        reasonText="Alex mentioned you in a comment"
        snippet="Can we repro on staging?"
        issueUrl="https://linear.app"
        expanded={expanded}
        onToggle={() => {}}
      >
        {expanded ? <div className="text-xs text-muted-foreground">Thread content…</div> : null}
      </AttentionTicketCard>
    ),
  },
);
