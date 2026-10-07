---
related:
  - select
  - combobox
  - multi-select
  - search-field
  - command
  - form
---

# MultiSelect

## Purpose

Choose several known values in a searchable checkbox picker. The default field uses a persistent border-cutout label and an editable paper surface.

## When to use

Use for assigning several people, tags or filter values when the list needs search.

## When not to use

Use Select for a compact single-choice list that does not need search. Use visible radio buttons for a few single choices and visible checkboxes for a short multiple-choice list. Use SearchField to find content without committing an option; use Command for actions. These controls do not accept arbitrary new values.

## How to use

```tsx
import * as React from 'react';
import { MultiSelect } from '@nodaste-lab/weft';
const options = [{ value: 'studio', label: 'Studio' }, { value: 'research', label: 'Research' }, { value: 'archive', label: 'Archive', disabled: true }];
export function Example() {
  const [value, setValue] = React.useState<string[]>([]);
  return <MultiSelect label="Space" options={options} value={value} onValueChange={setValue} name="space" />;
}
```

Supply optional description only for useful help. Supply error after consumer validation; help remains visible alongside it. Pass disabled for unavailable fields, loading while options load, and emptyMessage for meaningful no-result copy. Retain selected options in the supplied data so their labels remain available. Values must be unique stable identifiers. Search is local; server querying, permissions and validation belong to the consuming application.

## Heuristics

Selection and active-option highlights use the theme accent, never gray. Keep a check or checked control so color is not the only signal.

Choose by selection intent, then by need for search. Checking applies immediately and keeps the picker open. Done closes it; Escape closes without rolling back choices. Search never clears selections. Clear selection removes all values. Use a static labelled value when users may view but cannot change a selection. Do not substitute disabled for read-only information.

## Content

While closed, loading shows an accent spinner and a status beneath the field, preserving any selected value. Opening reveals the animated loading preview. Loading reserves a results area, shows an accent spinner and quiet placeholder lines after 200ms, and returns results immediately when ready. That delay is a design choice to avoid flashing on very fast requests, not a research-mandated threshold. After 10 seconds, the message acknowledges the longer wait and suggests closing and trying again. Do not invent percentages, deadlines, or processing stages. Consumers own real timeouts, recovery and cancellation; closing dismisses the popup and does not cancel a request. Reduced-motion mode shows a static indicator and the same status text.

Timing context: [NN/g on waits and interruptions](https://www.nngroup.com/articles/designing-for-waits-and-interruptions/) recommends useful progress information during longer waits. [W3C C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html) describes honoring reduced-motion preferences.

Use a noun label and recognizable option names. Optional descriptions distinguish similar options. Loading and empty results are different states. An error explains how to recover. Do not add redundant helper text.

## Accessibility

The visible label names the trigger. Error and help IDs are associated in that order. The popup restores focus on dismissal. Search receives focus. Tab reaches native checkboxes; Space toggles them. Counts announce result and selection changes. Each checkbox exposes its checked state independently of focus. Disabled options cannot be selected. Hidden named inputs submit committed IDs; disabled fields are excluded. Test keyboard and screen-reader behavior in the consuming form, including validation focus and asynchronous updates.
