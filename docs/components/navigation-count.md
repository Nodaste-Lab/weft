# Navigation count

## Purpose

A read-only, scoped awaiting-action signal count. Notifications are permitted only on the Signals destination.
## When to use

Positive signal counts on files, Spaces and the Signals destination.

## When not to use

No per-file notifications, severity badges, all-signal totals or interactive actions.

## How to use

Pass count as a positive safe integer, full name, and scope file, space or signals-destination. kind defaults to signals; notifications requires signals-destination. Invalid and zero counts render nothing. Use the actual scoped service count; the component does not calculate totals.

## Heuristics

Preserve contrast on current, hover and pressed backgrounds with --weft-ink. Keep counts right-aligned after the name; Space-picker counts precede its chevron/check. Do not change generic Badge defaults.

## Content

Signals means awaiting action. A Space count covers that Space; the Signals row covers the selected Space. Zero is hidden.

## Accessibility

The badge is a named read-only image; its decorative icon is hidden. The name includes count, meaning and full file/Space name. If the owning row repeats that description, avoid duplicate announcements. Consumers decide whether updates require a live status announcement.
