---
"@nodaste-lab/weft": minor
---

Land the input evidence and consumer-contract harness (P1 of the input design system). No component, class or token changes — this is the measurement the later phases move.

**The consumer condition is under test.** `tests/contract/consumer-iframe.spec.ts` injects `css/weft.css` and `css/weft-components.css` verbatim into a sandboxed iframe in Heddle's production load order (tokens, transitional `--hud-*` aliases, then components), alongside the CSS a panel package realistically ships: a `content-box` reset, a `.shadow` utility, a bare `input` element rule, a conflicting body font and a class colliding on the `weft-` prefix. A second frame runs the same markup and the same panel CSS with no Weft injected, so every computed-style difference between them is attributable to Weft, and "no selector escapes the namespace" is a reading rather than a claim. No iframe test existed in this repository before.

**The measured input contract.** A generated specimen page (`docs/brand-package/input-specimens.html`, from `scripts/generate-input-specimens.py`) linking only the two files a panel receives, and five Playwright suites over it: accessible names and descriptions from Chromium's accessibility tree, control geometry against each density tier, painted boundary contrast sampled from composited pixels across theme × density × ground, focus-indicator survival, and a permanent chevron guard for the `background`-shorthand regression.

**The suites fail in both directions.** `tests/contract/known-defects.ts` records the assertions expected to fail today, each with its measured value and the phase that owns the fix. A recorded defect that starts passing fails the run, so a fix cannot land without the entry coming out with it; an unrecorded assertion that fails is an ordinary regression; and a complete run fails on a recorded defect nothing measured. The reason is in that file's header: axe-core reports zero violations on this surface today, including the unlabelled search field, so a conventional gate would go green over every defect it records.

**Shipped and packed.** `tokens-snapshot.json` now ships — added to `files` and served at `@nodaste-lab/weft/tokens-snapshot.json`, which it previously was not from either. The CI pack smoke moved out of inline workflow YAML into `scripts/__tests__/packed-artifact.node.mjs`, asserts every contract file by exact path rather than by prefix, checks every literal exports-map target is packed, and joins the local gate battery.

**Gate battery** gains `test:contract`, `test:specimens` and `test:packed`; `scripts/review-gate.md` documents what each one holds. Playwright now runs two projects (`contract`, `visual`) with the snapshot path template pinned so the 78 committed pixel baselines keep their filenames.
