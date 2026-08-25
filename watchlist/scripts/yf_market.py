#!/usr/bin/env python3
"""Watchlist market data from yfinance (never Bloomberg).

Produces the same JSON shape the Cloudflare worker historically built
from Yahoo's quote/chart APIs so the watchlist page can keep its
frontend contract while refresh/charts stop depending on Bloomberg.
"""
from __future__ import annotations

import json
import sys
import threading
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timedelta, timezone
from typing import Any

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
QUOTE_WORKERS = 12
FX_CACHE_S = 12 * 60 * 60
QUOTE_CACHE_S = 45
DETAIL_CACHE_S = 5 * 60
DEFAULT_RANGE_DAYS = 365

# yfinance short exchange codes → names the watchlist tvLink() already understands.
EXCHANGE_NAMES = {
    "NMS": "NasdaqGS",
    "NGM": "NasdaqGM",
    "NCM": "NasdaqCM",
    "NASDAQ": "NasdaqGS",
    "NYQ": "NYSE",
    "NYSE": "NYSE",
    "PCX": "NYSEArca",
    "ASE": "AMEX",
    "AMEX": "AMEX",
    "KSC": "KSE",
    "KOE": "KOSDAQ",
    "KRX": "KSE",
    "TAI": "Taiwan",
    "TPE": "Taiwan",
    "TWO": "Taipei Exchange",
    "JPX": "Tokyo",
    "TYO": "Tokyo",
    "TSE": "Tokyo",
    "HKG": "Hong Kong",
    "HKSE": "Hong Kong",
    "SHH": "Shanghai",
    "SHZ": "Shenzhen",
    "LSE": "LSE",
    "LON": "LSE",
    "PAR": "Euronext Paris",
    "AMS": "Amsterdam",
    "BRU": "Brussels",
    "MIL": "Milan",
    "GER": "XETRA",
    "FRA": "Frankfurt",
    "VIE": "Vienna",
    "STO": "Stockholm",
    "HEL": "Helsinki",
    "CPH": "Copenhagen",
    "OSL": "Oslo",
    "TLV": "Tel Aviv",
    "ASX": "ASX",
    "TOR": "Toronto",
    "VAN": "TSXV",
}

_fx_lock = threading.Lock()
_fx_rates: dict[str, float] | None = None
_fx_fetched_at = 0.0
_cache_lock = threading.Lock()
_quote_cache: dict[str, tuple[float, dict[str, Any]]] = {}
_detail_cache: dict[str, tuple[float, dict[str, Any]]] = {}


def fi_get(fast_info: Any, *keys: str) -> Any:
    for key in keys:
        if hasattr(fast_info, "get"):
            value = fast_info.get(key)
            if value is not None:
                return value
        snake = "".join(["_" + ch.lower() if ch.isupper() else ch for ch in key]).lstrip("_")
        for candidate in (key, snake):
            value = getattr(fast_info, candidate, None)
            if value is not None:
                return value
    return None


def to_finite(value: Any) -> float | None:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if number == number and number not in (float("inf"), float("-inf")) else None


def positive_or_null(value: Any) -> float | None:
    number = to_finite(value)
    return number if number is not None and number > 0 else None


def parse_symbols(raw: str | None) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for part in str(raw or "").split(","):
        symbol = part.strip()
        if not symbol or symbol in seen:
            continue
        seen.add(symbol)
        out.append(symbol)
    return out


def clamp_range_days(raw: str | None) -> int:
    try:
        parsed = int(raw or "")
    except (TypeError, ValueError):
        parsed = DEFAULT_RANGE_DAYS
    return min(max(parsed, 30), 1825)


def get_fx_rates() -> dict[str, float]:
    global _fx_rates, _fx_fetched_at
    now = time.time()
    with _fx_lock:
        if _fx_rates and now - _fx_fetched_at < FX_CACHE_S:
            return _fx_rates
        try:
            req = urllib.request.Request(
                "https://open.er-api.com/v6/latest/USD",
                headers={"User-Agent": UA},
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                payload = json.loads(response.read().decode())
            if payload.get("result") == "success" and isinstance(payload.get("rates"), dict):
                _fx_rates = {str(k): float(v) for k, v in payload["rates"].items() if to_finite(v)}
                _fx_fetched_at = now
        except Exception:
            pass
        return _fx_rates or {}


def to_usd(value: float | None, currency: str | None, rates: dict[str, float]) -> float | None:
    if value is None or not currency:
        return None
    if currency == "USD":
        return value
    rate = rates.get(currency)
    if rate is None and currency in ("GBp", "GBX"):
        rate = rates.get("GBP")
    if rate is None or rate <= 0:
        return None
    return value / rate


def exchange_name(code: Any) -> str | None:
    raw = str(code or "").strip()
    if not raw:
        return None
    return EXCHANGE_NAMES.get(raw.upper(), raw)


def _cache_get(store: dict[str, tuple[float, dict[str, Any]]], key: str) -> dict[str, Any] | None:
    now = time.time()
    with _cache_lock:
        item = store.get(key)
        if not item:
            return None
        expires, payload = item
        if now > expires:
            store.pop(key, None)
            return None
        return payload


def _cache_set(store: dict[str, tuple[float, dict[str, Any]]], key: str, payload: dict[str, Any], ttl: float) -> None:
    with _cache_lock:
        store[key] = (time.time() + ttl, payload)


def quote_one(symbol: str, rates: dict[str, float]) -> dict[str, Any] | None:
    import yfinance as yf

    ticker = yf.Ticker(symbol)
    fast = ticker.fast_info
    price = to_finite(fi_get(fast, "lastPrice", "regularMarketPrice"))
    prev = to_finite(fi_get(fast, "previousClose", "regularMarketPreviousClose"))
    change = (price - prev) if price is not None and prev is not None else None
    change_pct = ((change / prev) * 100) if change is not None and prev not in (None, 0) else None
    currency = fi_get(fast, "currency") or None
    market_cap = positive_or_null(fi_get(fast, "marketCap"))
    if market_cap is None and price is not None and price > 0:
        shares = positive_or_null(fi_get(fast, "shares", "sharesOutstanding"))
        if shares:
            market_cap = shares * price
    return {
        "symbol": symbol,
        "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": "yfinance",
        "marketMetrics": {
            "currency": currency,
            "exchangeName": exchange_name(fi_get(fast, "exchange")),
            "marketState": None,
            "currentPrice": price,
            "marketCap": market_cap,
            "marketCapUsd": to_usd(market_cap, currency, rates),
            "trailingPE": None,
            "forwardPE": None,
            "priceToBook": None,
            "regularMarketChange": change,
            "regularMarketChangePercent": change_pct,
        },
    }


def build_quote_payload(symbols: list[str], *, fresh: bool = False) -> dict[str, Any]:
    symbols = symbols[:60]
    cache_key = ",".join(symbols)
    if not fresh:
        cached = _cache_get(_quote_cache, cache_key)
        if cached is not None:
            return cached
    rates = get_fx_rates()
    results: list[dict[str, Any]] = []
    if symbols:
        with ThreadPoolExecutor(max_workers=min(QUOTE_WORKERS, len(symbols))) as pool:
            futures = {pool.submit(quote_one, symbol, rates): symbol for symbol in symbols}
            by_symbol: dict[str, dict[str, Any]] = {}
            for future in as_completed(futures):
                symbol = futures[future]
                try:
                    row = future.result()
                except Exception as exc:
                    sys.stderr.write(f"yfinance quote failed for {symbol}: {exc}\n")
                    row = None
                if row:
                    by_symbol[symbol] = row
            results = [by_symbol[symbol] for symbol in symbols if symbol in by_symbol]
    payload = {
        "source": "yfinance",
        "fetchedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "results": results,
    }
    _cache_set(_quote_cache, cache_key, payload, QUOTE_CACHE_S)
    return payload


def _bars_from_history(frame: Any) -> list[dict[str, Any]]:
    if frame is None or getattr(frame, "empty", True):
        return []
    frame = frame.dropna(subset=["Open", "High", "Low", "Close"])
    bars: list[dict[str, Any]] = []
    for timestamp, row in frame.iterrows():
        close = to_finite(row.get("Close"))
        if close is None or close <= 0:
            continue
        if hasattr(timestamp, "to_pydatetime"):
            dt = timestamp.to_pydatetime()
        else:
            dt = timestamp
        if getattr(dt, "tzinfo", None) is not None:
            dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
        day = dt.strftime("%Y-%m-%d")
        bars.append(
            {
                "date": day,
                "open": to_finite(row.get("Open")) or close,
                "high": to_finite(row.get("High")) or close,
                "low": to_finite(row.get("Low")) or close,
                "close": close,
                "volume": to_finite(row.get("Volume")) or 0,
            }
        )
    return bars


def _bars_from_chartapi(symbol: str, range_days: int) -> list[dict[str, Any]]:
    range_param = "5y" if range_days >= 1500 else f"{range_days}d"
    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
        f"?interval=1d&range={range_param}&events=div,splits"
    )
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode())
    result = ((payload.get("chart") or {}).get("result") or [None])[0] or {}
    timestamps = result.get("timestamp") or []
    quote = ((result.get("indicators") or {}).get("quote") or [{}])[0]
    opens = quote.get("open") or []
    highs = quote.get("high") or []
    lows = quote.get("low") or []
    closes = quote.get("close") or []
    volumes = quote.get("volume") or []
    bars: list[dict[str, Any]] = []
    for index, ts in enumerate(timestamps):
        close = to_finite(closes[index] if index < len(closes) else None)
        if close is None or close <= 0:
            continue
        day = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
        bars.append(
            {
                "date": day,
                "open": to_finite(opens[index] if index < len(opens) else None) or close,
                "high": to_finite(highs[index] if index < len(highs) else None) or close,
                "low": to_finite(lows[index] if index < len(lows) else None) or close,
                "close": close,
                "volume": to_finite(volumes[index] if index < len(volumes) else None) or 0,
            }
        )
    return bars


def fetch_bars(symbol: str, range_days: int) -> list[dict[str, Any]]:
    import yfinance as yf

    end = datetime.now(timezone.utc)
    start = end - timedelta(days=range_days)
    try:
        hist = yf.Ticker(symbol).history(
            start=start.strftime("%Y-%m-%d"),
            end=(end + timedelta(days=1)).strftime("%Y-%m-%d"),
            interval="1d",
            auto_adjust=False,
        )
        bars = _bars_from_history(hist)
        if bars:
            return bars
    except Exception:
        pass
    try:
        return _bars_from_chartapi(symbol, range_days)
    except Exception:
        return []


def _info_metrics(symbol: str) -> dict[str, Any]:
    import yfinance as yf

    try:
        info = yf.Ticker(symbol).get_info() or {}
    except Exception:
        return {}
    return {
        "trailingPE": positive_or_null(info.get("trailingPE")),
        "forwardPE": positive_or_null(info.get("forwardPE")),
        "priceToBook": positive_or_null(info.get("priceToBook")),
        "enterpriseValue": positive_or_null(info.get("enterpriseValue")),
        "enterpriseToEbitda": to_finite(info.get("enterpriseToEbitda")),
        "enterpriseToRevenue": to_finite(info.get("enterpriseToRevenue")),
        "totalCash": to_finite(info.get("totalCash")),
        "totalDebt": to_finite(info.get("totalDebt")),
        "grossMargins": _ratio_to_percent(info.get("grossMargins")),
        "operatingMargins": _ratio_to_percent(info.get("operatingMargins")),
        "revenueTtm": to_finite(info.get("totalRevenue")),
        "ebitdaTtm": to_finite(info.get("ebitda")),
    }


def _ratio_to_percent(value: Any) -> float | None:
    number = to_finite(value)
    if number is None:
        return None
    return round(number * 100, 1)


def build_chart_metrics(bars: list[dict[str, Any]]) -> dict[str, Any]:
    clean = [bar for bar in bars if bar.get("date") and to_finite(bar.get("close"))]
    chart_series = [{"time": bar["date"], "value": bar["close"]} for bar in clean]
    chart_candles = [
        {
            "time": bar["date"],
            "open": bar["open"],
            "high": bar["high"],
            "low": bar["low"],
            "close": bar["close"],
        }
        for bar in clean
    ]
    chart_volume = []
    for index, bar in enumerate(clean):
        previous = clean[index - 1]["close"] if index else bar["open"]
        chart_volume.append(
            {
                "time": bar["date"],
                "value": bar["volume"],
                "color": "rgba(15,108,75,0.35)" if bar["close"] >= previous else "rgba(198,74,61,0.35)",
            }
        )
    closes = [bar["close"] for bar in clean]
    latest = closes[-1] if closes else None
    highest = max(closes) if closes else None
    year = datetime.now(timezone.utc).year
    ytd_base = next((bar["close"] for bar in clean if str(bar["date"]).startswith(str(year))), None)
    one_month_base = closes[-22] if len(closes) >= 22 else None
    one_year_base = closes[0] if closes else None

    def pct(current: float | None, base: float | None) -> float | None:
        if current is None or base in (None, 0):
            return None
        return round(((current - base) / base) * 100, 2)

    def above_sma(period: int) -> bool | None:
        if len(closes) < period:
            return None
        average = sum(closes[-period:]) / period
        return latest >= average if latest is not None else None

    return {
        "chartSeries": chart_series,
        "chartCandleSeries": chart_candles,
        "chartVolumeSeries": chart_volume,
        "sparkline": [point["value"] for point in chart_series[-30:]],
        "oneMonthReturn": pct(latest, one_month_base),
        "ytdReturn": pct(latest, ytd_base),
        "oneYearReturn": pct(latest, one_year_base),
        "distanceFromHigh": pct(latest, highest),
        "above20Sma": above_sma(20),
        "above50Sma": above_sma(50),
        "above200Sma": above_sma(200),
    }


def build_detail_payload(symbol: str, range_days: int, *, fresh: bool = False) -> dict[str, Any]:
    cache_key = f"{symbol}:{range_days}"
    if not fresh:
        cached = _cache_get(_detail_cache, cache_key)
        if cached is not None:
            return cached
    rates = get_fx_rates()
    quote = quote_one(symbol, rates) or {
        "symbol": symbol,
        "updatedAt": None,
        "marketMetrics": {},
    }
    extra = _info_metrics(symbol)
    bars = fetch_bars(symbol, range_days)
    chart = build_chart_metrics(bars)
    latest_bar = bars[-1]["date"] if bars else None
    payload = {
        "source": "yfinance",
        "symbol": symbol,
        "fetchedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "quoteUpdatedAt": quote.get("updatedAt"),
        "latestBarAt": f"{latest_bar}T00:00:00.000Z" if latest_bar else None,
        "marketMetrics": {
            **(quote.get("marketMetrics") or {}),
            **{k: v for k, v in extra.items() if v is not None},
            **chart,
        },
    }
    _cache_set(_detail_cache, cache_key, payload, DETAIL_CACHE_S)
    return payload
