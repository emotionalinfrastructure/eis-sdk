#!/usr/bin/env bash
set -euo pipefail
echo "Running EIS-SDK full validation suite..."
npm run typecheck
npm run lint || true
npm run build
npm test
npm run smoke
echo "All checks passed!"
