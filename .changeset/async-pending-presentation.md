---
"@nodaste-lab/weft": minor
---

Asynchronous pending presentation (the weft#16 deferred follow-up; amendment A4
now in force). `FormStatus` joins the `Form` family (component 1.1.0 → 1.2.0,
additive): the consumer supplies `pending` or a settled `tone` (`ok | info |
warn | stop`) plus its own text, and Weft presents it in the hint slot —
nothing more. The describedby list stays ONE ordered reference list with the
status id between error and help (error keeps first position per A5); the
control carries `aria-busy` while pending; pending is text with a pulsing dot
whose final keyframe is opacity 1, so the reduced-motion freeze leaves it
static-visible rather than reading as a hung field. Weft still evaluates
nothing: validity, staleness, cancellation, and whether a failed check becomes
an error belong to the consumer (decisions 7/10 — the ownership spies now also
cover the status surface). Exposure, never announcement. The plain-CSS layer
ships the same presentation as `.weft-field-hint.is-pending` / `.is-status`
with the `-status` id and `aria-busy` markup conventions gated page-wide on
the specimen surface.
