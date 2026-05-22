#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

git pull --ff-only
npm ci
npm run build

if pm2 describe pricvo >/dev/null 2>&1; then
  pm2 restart pricvo
else
  pm2 start ecosystem.config.js
fi
pm2 save
