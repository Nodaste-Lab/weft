---
"@nodaste-lab/weft": patch
---

Add three net-new theme-aware tokens the Working Threads panel migration needs:
`--weft-shadow` (resting card elevation), `--weft-fill-soft` (subtle section
wash), and `--weft-stop-soft` (danger surface tint). Defined on the light
`:root` and both dark palette blocks; additive and backward-compatible. Unblocks
heddle's `workBoard.css` from its last three legacy `--hud-*` aliases (NOD-1263).
