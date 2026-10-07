---
"@nodaste-lab/weft": patch
---

Required marker is plain text. The plain-CSS field pattern marks a required field with "(required)" inside the label in the label's own colour, plus the native `required` attribute (owner ruling 2026-10-07). The `.weft-field-label .weft-req` stop-colour rule is removed from `css/weft-components.css`; the span stays as an unstyled hook. Form, brand-package and specimen docs say the same thing.
