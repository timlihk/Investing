#!/usr/bin/env python3
"""Local HTTP server for watchlist yfinance quotes/charts.

Binds 127.0.0.1 only. The company-research hub proxies /api/yf-market/*
here so the Investing Cloudflare worker can reach NAS yfinance without
a new hostname and without Bloomberg.
"""
from __future__ import annotations

import json
import os
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from yf_market import build_detail_payload, build_quote_payload, clamp_range_days, parse_symbols

HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "3102"))


def _strip_prefix(path: str) -> str:
    for prefix in ("/api/yf-market", "/api/market"):
        if path == prefix or path.startswith(prefix + "/"):
            return path[len(prefix) :] or "/"
    return path


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _json(self, payload: dict, status: int = 200, cache: str = "public, max-age=45") -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", cache)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = _strip_prefix(parsed.path)
        query = parse_qs(parsed.query)
        fresh = path.endswith("/fresh") or query.get("fresh", ["0"])[0] in ("1", "true")
        cache = "no-store, max-age=0, must-revalidate" if fresh else "public, max-age=45"

        try:
            if path in ("/healthz", "/health"):
                self._json({"ok": True, "source": "yfinance"}, cache="no-store")
                return
            if path in ("/quotes", "/quotes/fresh"):
                symbols = parse_symbols((query.get("symbols") or [""])[0])
                self._json(build_quote_payload(symbols, fresh=fresh), cache=cache)
                return
            if path in ("/detail", "/detail/fresh"):
                symbol = str((query.get("symbol") or [""])[0]).strip()
                if not symbol:
                    self._json({"error": "Missing symbol"}, status=400, cache="no-store")
                    return
                range_days = clamp_range_days((query.get("rangeDays") or [""])[0])
                self._json(build_detail_payload(symbol, range_days, fresh=fresh), cache=cache)
                return
            self._json({"error": "Not found"}, status=404, cache="no-store")
        except Exception as exc:
            self._json({"error": str(exc), "source": "yfinance"}, status=500, cache="no-store")


def main() -> int:
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"[watchlist-yf] listening on http://{HOST}:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
