---
related:
  - hud-list-row
  - badge
  - collapsible
---

# Attention ticket card

## Purpose

An expandable row for one item that needs a person's attention: a ticket, a review request, a mention. It owns the collapsed header (reason pill, project label, timestamp, title, reason text, optional quoted snippet, chevron), the expanded region beneath the header, and the open-in-provider link that sits beside the header. The header is a `hud-list-row` rendered as a button with `frame={false}`; this component adds only the expand and collapse chrome.

## When to use

- A feed of items that each want a reply or a decision, where the reader needs the reason first and the thread on demand.
- A row whose detail (thread, reply field) should open in place rather than in a dialog.

## When not to use

- A list row with no expanded region. Use `hud-list-row`.
- A status label beside other content. Use `badge`.
- Arbitrary content that expands under a trigger. Use `collapsible`.

## How to use

1. Render `AttentionTicketCard` with `reasonLabel`, `reasonColor`, `timestampLabel`, `title` and `reasonText`. `projectLabel` and `snippet` are optional and render nothing when null.
2. The card is controlled. Pass `expanded` and `onToggle`, and keep the open state in the list so the list decides whether more than one card can be open.
3. Put the thread or reply field in `children`. It renders only while `expanded`.
4. Pass `issueUrl` to render the open-in-provider link. Name it with `openInProviderAriaLabel`; the default is "Open in provider".
5. `reasonColor` is a CSS colour token, for example `var(--hud-info)`. The pill paints that token at low alpha behind text in the same token.

## Heuristics

- The reason pill names a category of attention (new comment, assigned, mention) and its colour is that category's colour wherever it appears. Same reason, same token.
- The title is one line and truncates. The reason text is a sentence about why the item is here. The snippet is a quotation and is drawn as one, in italics with quotation marks.
- The whole header is the toggle. Any other control is a sibling of the button, never a child of it.
- The expanded region holds the conversation. It does not repeat the header.
- The timestamp is relative and short ("3h ago") while collapsed.

## Content

- `reasonLabel`: two or three words, sentence case, no punctuation ("New comment", "Assigned to you").
- `title`: the item's title as it exists at the source. Do not rewrite it.
- `reasonText`: one sentence, who did what, sentence case, no trailing period.
- `snippet`: the quoted text verbatim. The component adds the quotation marks and cuts it to one line.
- `projectLabel`: the project's name as the user knows it. Omit it rather than show a placeholder.
- `openInProviderAriaLabel`: "Open in" plus the provider's name, so the link says where it goes.

## Accessibility

- The header is a native `<button>`, so Enter and Space toggle it and its accessible name is the row's text. The chevrons are `aria-hidden`.
- The link is a sibling of the button and stops click propagation, so opening the provider does not toggle the card. It measures 24×24, the `--weft-touch-target` floor.
- State is exposed as `data-state="expanded"` or `"collapsed"`. The button does not carry `aria-expanded`, which the disclosure pattern expects, and the component does not forward extra props to the row. Open.
- The reason category is carried by the pill's text, so it survives with colour removed (WCAG 1.4.1 use of colour).
- When the expanded region contains a composer, the consumer decides whether to move focus into it; the component leaves focus on the toggle.
