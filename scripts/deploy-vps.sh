#!/usr/bin/env bash
# VPS deploy helper for Secure Vista Solutions (standalone + PM2)
# Usage (on VPS): bash scripts/deploy-vps.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${PORT:-3005}"
APP_NAME="${APP_NAME:-securevista}"

echo "==> Pulling latest"
git pull --ff-only origin main

echo "==> Installing dependencies"
if ! npm ci; then
  echo "npm ci failed (lock out of sync). Falling back to npm install..."
  rm -rf node_modules
  npm install
fi

echo "==> Building (standalone)"
npm run build

echo "==> Syncing static + public into standalone"
node -e "import('./scripts/lib/sync-standalone-assets.mjs').then(m => m.syncStandaloneAssets())"

echo "==> Starting / reloading PM2 on PORT=${PORT}"
export PORT HOSTNAME="${HOSTNAME:-0.0.0.0}"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT="$PORT" pm2 reload ecosystem.config.cjs --update-env
else
  PORT="$PORT" pm2 start ecosystem.config.cjs --update-env
fi

pm2 save
pm2 status
echo "==> Done. App should listen on :${PORT}"
