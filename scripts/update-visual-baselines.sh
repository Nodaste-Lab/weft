#!/usr/bin/env bash
# Regenerate the Linux visual baselines in the same pinned container CI uses.
# Run from the repo root on any host with Docker.
set -euo pipefail
docker run --rm -v "$PWD":/work -v weft-gallery-nm:/work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.61.1-jammy \
  bash -c "npm ci --no-audit --no-fund && npm run test:visual:update"
echo "Review the updated tests/visual/*-snapshots/ diffs before committing."
