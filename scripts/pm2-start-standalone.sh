#!/usr/bin/env bash
# PM2 + Next.js standalone (no Docker). Run from project root after npm ci && npm run build.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -f ".next/standalone/server.js" ]; then
  echo "Missing .next/standalone/server.js — run: npm run build"
  exit 1
fi

# Standalone bundle expects static assets beside server.js
mkdir -p .next/standalone/.next
rsync -a --delete .next/static/ .next/standalone/.next/static/
rsync -a --delete public/ .next/standalone/public/

PORT="${PORT:-3000}"
export PORT HOSTNAME="${HOSTNAME:-0.0.0.0}"

echo "Starting Secure Vista on port $PORT (standalone + PM2)..."
exec pm2 start ecosystem.config.cjs --update-env
