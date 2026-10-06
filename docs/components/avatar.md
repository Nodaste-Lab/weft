---
related:
  - hover-card
  - badge
  - dot
---

# Avatar

## Purpose

A circular image standing for a person, an agent or an entity, with a fallback that shows while the image loads or when there is no image. It owns the circle, the clipped image and the fallback ground. It does not own presence, status or identity colour; those are the job of a `badge` or `dot` beside the name.

## When to use

- Beside a name in a row, a header, a thread or a member list.
- A stacked group of participants, where each avatar after the first overlaps by 6px with a paper ring.

## When not to use

- Carrying state (working, online, away). Put a `badge` or a labelled `dot` next to the name.
- A product or app icon. Use `image`.
- Telling two people apart by colour. Colour is semantic only; two commenters are told apart by name and initials.

## How to use

1. Render `Avatar` as the root. It is 40px by default (`size-10`); pass a size class for 32px (compact) or 24px (inline in a thread or member row).
2. Put `AvatarImage` inside with `src` and `alt`. It renders an `<img>` only once the image has loaded.
3. Put `AvatarFallback` inside with the initials. It shows until the image loads, or always when there is no `src`; `delayMs` holds it back to avoid a flash on fast connections.
4. Place the name next to the avatar. The avatar is a picture of the name, not a replacement for it.

## Heuristics

- Initials are an identifier, so they stay in mono caps under the 2026-09-01 casing ruling. Two letters at most.
- The fallback ground is neutral (`bg-muted`). A per-person hue on the ground or the ring is out under the semantic colour ruling.
- The same person gets the same avatar on every surface.
- An agent's avatar uses the same component. Its "(A)" suffix lives in the name beside it, not in the initials.
- An avatar is not a tooltip trigger. A non-interactive avatar does not get a title or a hover card of its own; the name does.

## Content

- Initials come from the first letters of the given name and family name, in caps.
- `alt` is the person's or agent's name when the avatar stands alone, and empty when the name is rendered beside it.
- No fixture initials as a default. An avatar with no image and no known name renders the fallback empty or with a generic glyph.

## Accessibility

- The consumer sets `alt` on `AvatarImage`. Empty `alt=""` when the name is adjacent, because reading the name twice is noise; the name itself when the avatar is the only identifier (WCAG 1.1.1 non-text content).
- Fallback initials are read as text. When the name is adjacent, pass `aria-hidden` on the fallback so a screen reader does not hear "DM Dana Moore".
- The component is not interactive and takes no focus. When an avatar triggers a `hover-card` or a menu, the trigger is a button with the person's name as its accessible name and meets the 24px `--weft-touch-target` floor; the 24px size is exactly the floor, with no margin.
- Nothing about a person is encoded in colour, so there is nothing to lose with colour removed (WCAG 1.4.1 use of colour).
