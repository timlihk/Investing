#!/bin/bash
# Daily watchlist → website sync (deterministic part of the cron job).
# 1. regenerate themes from Obsidian   2. verify symbols on live Yahoo API
# 3. deploy + commit IF themes changed 4. report status on stdout
set -u
cd "$(dirname "$0")/../.." || exit 1   # repo root = Code/Investing

echo "== STEP generate =="
python3 watchlist/scripts/generate-themes.py || { echo "GENERATE_FAILED"; exit 1; }

echo "== STEP verify =="
if ! python3 watchlist/scripts/verify-symbols.py; then
  echo "VERIFY_FAILED — fix broken symbols in the Obsidian Watchlist.md (Yahoo suffix),"
  echo "then re-run this script. Do not deploy with broken symbols."
  exit 1
fi

echo "== STEP diff =="
if git diff --quiet watchlist/watchlist-themes.js; then
  echo "NO_CHANGES — themes.js identical, skipping deploy/commit"
  exit 0
fi

echo "== STEP deploy =="
if ! wrangler deploy 2>&1 | tail -3; then
  echo "DEPLOY_FAILED"
  exit 1
fi

echo "== STEP commit =="
git add -A
git commit -m "watchlist: daily sync $(date +%F)" >/dev/null 2>&1 || true
git push origin main >/dev/null 2>&1 && echo "PUSHED" || {
  # 127.0.0.1:8888 proxy dies periodically — retry direct if the proxied push failed
  env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
    git push origin main >/dev/null 2>&1 && echo "PUSHED (direct)" || echo "PUSH_FAILED"
}
echo "SYNC_OK"
