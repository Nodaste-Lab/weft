---
"@nodaste-lab/weft": patch
---

Make the focus-not-obscured mitigation reach the scrollport that actually scrolls.

`scroll-padding` applies to the scrollport, so putting it on `html` covers only surfaces where the *document* scrolls. Inside a HUD panel the panel **body** usually scrolls, and padding on `html` does nothing there — measured at **100% of the control covered** in the injected panel frame.

Weft ships no scroll container of its own, so it cannot guess which element is one. The surface marks it: `.weft-scrollport` or `[data-weft-scrollport]`, either of which now takes `scroll-padding-top: var(--weft-sticky-chrome-h)` alongside `html`. With the marker, 0% covered.

Proved on a panel-body scrollport under sticky chrome inside the consumer-iframe condition, not only on a scrolling document.
