#!/usr/bin/env python3
"""Verify every watchlist symbol resolves on Yahoo via the deployed worker.

Reads the generated watchlist/watchlist-themes.js, batches all symbols
through https://research.mangrove-hk.org/api/market/quotes (55/batch,
matching the worker's QUOTE_MAX_SYMBOLS), and reports symbols with no
quote or a null price. Exit code 1 if any symbol is broken.

Usage:
  python3 watchlist/scripts/verify-symbols.py [--repo PATH] [--base URL]

Known workarounds applied by this check:
  - TSE Main vs TWO/OTC suffixes (e.g. Eson 5243.TW not 5243.TWO)
  - Yahoo coverage gaps (Shinko 6967.T has no Yahoo data at all — swap name)
"""
import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

REPO_DEFAULT = "/lzcsys/data/home/timlihk/Code/Investing"
BASE_DEFAULT = "https://research.mangrove-hk.org"
BATCH = 55


def _fetch_json(req):
    """Fetch + parse with retries. The worker intermittently 500s on uncached
    Yahoo upstream fetches (observed 2026-08-25: same batch 200 via curl,
    transient 500 via urllib). Retry with backoff before declaring failure."""
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except (urllib.error.HTTPError, urllib.error.URLError):
            time.sleep(3 * (attempt + 1))
    raise RuntimeError("verify worker unreachable after 4 attempts")


def load_symbols(repo):
    path = f"{repo}/watchlist/watchlist-themes.js"
    text = open(path, encoding="utf-8").read()
    syms = re.findall(r'symbol: "([^"]+)"', text)
    return sorted(set(syms))


def check(symbols, base):
    bad = []
    for i in range(0, len(symbols), BATCH):
        batch = symbols[i:i + BATCH]
        url = f"{base}/api/market/quotes?symbols=" + urllib.parse.quote(",".join(batch))
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        data = _fetch_json(req)
        got = {x["symbol"]: x["marketMetrics"].get("currentPrice") for x in data.get("results", [])}
        for s in batch:
            if s not in got or not got.get(s):
                bad.append((s, got.get(s)))
        time.sleep(0.5)
    return bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=REPO_DEFAULT)
    ap.add_argument("--base", default=BASE_DEFAULT)
    args = ap.parse_args()

    symbols = load_symbols(args.repo)
    print(f"checking {len(symbols)} symbols via {args.base} ...")
    bad = check(symbols, args.base)
    if bad:
        print("BROKEN SYMBOLS:")
        for s, price in bad:
            print(f"  {s}  (price={price})")
        print("\nFix: correct the Yahoo suffix (e.g. .TWO -> .TW) or replace the name,")
        print("then re-run generate-themes.py and this check.")
        sys.exit(1)
    print("all symbols OK")


if __name__ == "__main__":
    main()
