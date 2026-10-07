# Navigation rail accessibility

Audit date: 2026-10-06. Scope: the Weft navigation rail lab, its Atoms and Rows,
shared primitive playgrounds, desktop rail, responsive drawer, controls and
feedback workflow. This is a prototype audit, not certification of Avalandra
or all possible combinations of Weft components.

The target is **WCAG 2.2 AA**. The acceptance criteria below apply to every
density. Automated scanning and keyboard checks provide evidence for tested
states; they cannot verify all assistive technology or production behavior.

## Find the guide

Open `http://127.0.0.1:5179/#/labs/navigation-rail` and expand
**Accessibility requirements and verification** near the top. It includes the
keyboard reference, composition requirements and acceptance work still needed.

## Reproduce verification

From this checkout, start the dedicated site:

```sh
npm run site:dev
```

In another terminal:

```sh
npm run test:rail-a11y
# For another dedicated site port or a saved evidence file:
npm run test:rail-a11y -- --url http://127.0.0.1:5179/#/labs/navigation-rail --output /tmp/weft-navigation-rail-accessibility.json
npx vitest run site/app/__tests__/navigation-rail-lab.test.tsx site/app/__tests__/routes.test.ts
npm run site:build
node scripts/check-raw-colors.mjs
```

The browser suite uses headless Chromium and the pinned `axe-core` development
dependency. Install Playwright Chromium if the machine has not run browser tests:
`npx playwright install chromium`. It uses a fresh browser context and does not
change any product data. The JSON report contains browser/scanner versions,
timestamp, scenario names, violations, review-required rules, workflow results
and runtime errors. A failing assertion or any scanner violation returns a
nonzero exit code. No WCAG rule is suppressed.

## Verified result on 2026-10-06

- **78 axe scans: zero automated violations.**
- **27 keyboard/geometry workflow checks passed.**
- **12 targeted contrast measurements passed** across both themes and all
  densities; lowest sampled row/rail text contrast **5.23:1**.
- **18 focused unit tests**, **306 site documentation contract tests**, site
  build, raw-color gate and diff whitespace checks passed.
- Browser/scanner versions, scenarios and review-required scanner findings are
  retained in [the evidence JSON](navigation-rail-accessibility-results.json).
- Independent review identified retry focus, count association, misleading total
  wording and an overstated feedback test. Each was fixed and reverified.

These results cover the tested combinations. Review-required output and human
acceptance remain open; they are not evidence of full WCAG conformance.

## Acceptance contract

| Area | Required behavior | WCAG 2.2 references |
| --- | --- | --- |
| Names and relationships | Named controls, named navigation and file region, nested lists for hierarchy; file type and status described on the file button | 1.1.1, 1.3.1, 4.1.2 |
| Current location | `aria-current`, visual marker and stronger text; color is supplementary | 1.4.1, 4.1.2 |
| Keyboard | Every control operable with Tab/Shift+Tab and native activation; arrow keys for menus/selects, not tree navigation | 2.1.1, 2.1.2, 2.4.3 |
| Focus | Visible focus on the full row when its title is focused, independent focus on disclosure/actions; focus not hidden by scrolling or pinned controls | 2.4.7, 2.4.11 |
| Disclosure | Named expand/collapse action with correct `aria-expanded`; hidden descendants leave the focus order | 4.1.2 |
| Menus | Actions revealed on keyboard focus; Arrow keys, Enter, Escape and submenu navigation; disabled choices cannot activate | 2.1.1, 4.1.2 |
| Counts | Each positive signal/notification count has a specific name; individual file scope and Signals-only Space totals; zeros absent | 1.3.1, 4.1.2 |
| Status sub-icons | Listening and lock have text equivalents and are associated with the file; no color-only meaning | 1.1.1, 1.4.1 |
| Resize | Pointer drag, keyboard arrows/Home/End and range slider; bounds exposed through separator values | 2.1.1, 2.5.7, 4.1.2 |
| Forms and feedback | Named fields, useful errors, blank rename rejection, focus return, live status announcements, export works | 3.3.1, 3.3.2, 4.1.3 |
| Drawer | Named dialog, focus contained while open, Escape/Close, return focus, independent file scrolling | 2.1.2, 2.4.3 |
| Target size | 24×24 CSS px minimum; 44×44 CSS px for drawer/touch controls; default density target may be larger | 2.5.8; 44px additionally supports 2.5.5 AAA |
| Contrast | Text at least 4.5:1 (large text 3:1), meaningful graphics/focus 3:1 in light/dark | 1.4.3, 1.4.11 |
| Responsive | No page-level horizontal scrolling at 320px; narrow controls may wrap; footer and files remain reachable on short screens | 1.4.10 |
| Motion and system modes | Respect reduced motion; preserve selection/focus under forced colors | 1.4.1, 2.4.7; reduced motion also supports 2.3.3 AAA |

The hierarchy is **disclosure navigation with nested lists**, not an ARIA tree.
It intentionally uses ordinary sequential keyboard navigation. Do not add
`role="tree"` without implementing the full tree keyboard and focus model.
Preview destinations use buttons because they perform local demonstrations;
production destinations must become real links with meaningful URLs.

## Coverage

The repeatable suite covers:

- Every atom and its embedded primitive playground in light and dark.
- Rows, including rest/hover/pressed/focus/current/disabled state examples,
  across default, compact and dense, with listening and lock indicators enabled.
- Desktop rail across the three densities and both themes.
- Writable, read-only, connector-protected and extra-capability file menus.
- Empty/loading/error file lists, retry, inline creation and Add Space dialog.
- Keyboard actions, rename/cancel/blank input, Space creation flow, feedback
  save/export and resize controls.
- Auto drawers at 320×710, 390×844, 800×600 and 320×320; focus containment,
  Escape/focus return, page overflow and target geometry.
- Forced colors, reduced motion, and browser runtime errors.

## Fixes made during this audit

- Restored Files heading CSS hooks and feedback export after the terminology
  rename inadvertently changed implementation identifiers.
- Added a named navigation landmark, list hierarchy and file/status descriptions.
- Added explicit focus outlines to local lab controls and retained keyboard
  access to hover-revealed actions.
- Preserved informational counter contrast in pressed/disabled row examples.
- Removed opacity dilution from step numbers and primary hover fills; changed
  lab link/code text to theme-aware ink for dark-mode readability.
- Added nonblank rename validation, file loading/error announcements and Space
  name requirements.
- Kept touch targets large across densities and prevented narrow file targets
  from collapsing by allowing secondary controls to wrap.
- Added forced-color current markers and contained scroll chaining.

## Review-required scanner output

Axe distinguishes violations from `incomplete` checks. The report retains both.
Review-required output is **not a pass** for the associated criterion:

- Off-screen, truncated or overlapping text may prevent contrast measurement.
  Inspect visible equivalents in each theme, and scroll/focus every truncated
  row to check readability and visibility. Browser colors and visual focus
  still need human review.
- Closed Radix submenus mount lazily, so their `aria-controls` references can
  need interpretation. Open each submenu and verify it resolves, is named and
  returns focus correctly.
- Modal dialogs hide background content with Radix focus guards. Verify forward
  and reverse focus containment and return; test actual screen-reader isolation.

## Human acceptance before migration sign-off

These checks remain required. No human screen-reader acceptance was performed
by the automated suite.

1. **VoiceOver + Safari on macOS**: landmarks and nested list levels, file names
   and types, listening/lock state, current page, counts, expanded/collapsed
   announcements, errors/status changes and full menu interaction.
2. **NVDA + Firefox or Chrome on Windows**: repeat the same flows and verify
   browse/focus mode transitions and modal background isolation.
3. **Touch and switch input**: real iOS/Android and a switch or keyboard scanning
   configuration; reach actions without hover, operate menus and dismiss drawers.
4. **Zoom and text**: actual 200% text resize and 400% browser zoom, text-spacing
   overrides, portrait/landscape, long localized names, all density tiers;
   preserve reading order and visible focused controls. A 320px viewport is
   useful reflow evidence, but does not substitute for browser zoom testing.
5. **Appearance**: light/dark, Windows High Contrast, actual reduced-motion
   preference, every selected/hover/focus combination; manually inspect scanner
   review items and sub-icon legibility.
6. **Production integration**: real links, async error/retry announcements,
   loading/empty states, permission changes, real listening/lock data, file
   transfer/removal dialogs, and focus after destinations mount. Service actions
   in this lab are explicitly previews, so they cannot verify these behaviors.

Use the lab's per-element notes to record each result with browser/OS,
assistive-technology version, density, theme, steps and expected/actual behavior.
Keep sign-off pending while any required acceptance check remains untested.

## References

- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Disclosure navigation pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
- [Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Dragging movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
