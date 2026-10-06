---
related:
  - menubar
  - sidebar
  - tabs
  - dropdown-menu
  - sheet
---

# Navigation menu

## Purpose

A horizontal bar of top-level destinations, where some items open a panel of further links. It owns the list, the item, the trigger with its chevron, the content panel, the shared viewport, the indicator and the link. Its items are links, not menu items: it is navigation, and it is exposed as a `nav` landmark.

## When to use

- The header of a site or app with three to seven sections, where some sections expand into a grouped panel of destinations.
- A section that has both a landing page and children: the trigger opens the panel, and the landing page is the first link inside it.

## When not to use

- A list of actions. Use `dropdown-menu`.
- App commands grouped by category. Use `menubar`.
- Navigation that stays in place beside the content. Use `sidebar`.
- Views within one page. Use `tabs`.
- A narrow viewport. Collapse to a `sheet` holding a plain list of links.

## How to use

1. Render `NavigationMenu`, then `NavigationMenuList`, then one `NavigationMenuItem` per section.
2. A plain destination is a `NavigationMenuLink` with `href` (or `asChild` around a router link). Pass `active` on the current section; it sets `data-active` and `aria-current="page"`.
3. An expanding section is a `NavigationMenuTrigger` followed by `NavigationMenuContent` holding a list of `NavigationMenuLink`s. The trigger is a button, not a link.
4. `viewport` (default `true`) renders one shared panel beneath the bar, sized to the open content. `viewport={false}` renders each panel under its own trigger.
5. `NavigationMenuIndicator` draws the arrow under the open trigger; it is optional.
6. Hover timing is set on the root: `delayDuration` (200ms) before a hover opens a panel and `skipDelayDuration` (300ms) for moving between open panels. Keep the delay; it prevents panels flashing as the pointer crosses the bar.

## Heuristics

- Show the whole panel at once: two or three groups, no scrolling inside the panel.
- Labels start with the distinguishing word. "Pricing" and "Pricing plans" are not two sections.
- A trigger is not a destination. If a section has a landing page, it is the first link in its panel.
- One panel open at a time; the shared viewport makes this visible.
- Triggers are sentence case. The active trigger is drawn with the accent tint; the current section's link carries `aria-current`.
- Opening on hover is a shortcut; the panel also opens on click, Enter and Space, so it exists for touch and the keyboard.

## Content

- Trigger and link labels are nouns naming the section, one or two words, sentence case.
- A panel link may carry a one-line description beneath its title; the link lays out as a column for this.
- Group headings inside a panel name the group, not the action.

## Accessibility

- The root renders `nav` with `aria-label="Main"`. Change the label when the page has another main navigation.
- Triggers expose `aria-expanded` and `aria-controls`. Enter, Space and the arrow keys open a panel; Escape closes it and returns focus to the trigger.
- Left and Right move between items in the bar; Tab moves from the trigger into the open panel's links and then out.
- `active` links carry `aria-current="page"`.
- Trigger height is 36px and a panel link at the default padding is 36px, both above the 24px floor (`--weft-touch-target`, WCAG 2.5.8 target size).
- Panel and viewport animations collapse under the global `prefers-reduced-motion` rule (WCAG 2.3.3).
