# SEPA Chart Review Page — Build Guideline

One-page dashboard for reviewing a shortlist of SEPA finalists: TradingView chart on the left, Yahoo Finance company description on the right, one row per ticker.

## Layout

- **Grid:** `row` per ticker, two columns `3fr : 2fr` (chart : description).
- **Responsive:** collapse to single column below 1100px.
- **Theme:** dark (`#0f1115` background, `#161a22` cards, `#262b36` borders).
- **Header on each card:** ticker + one-line SEPA note (left), market cap or rank (right).

## Chart (left card)

TradingView **Advanced Chart Widget** (`embed-widget-advanced-chart.js`), injected per-row.

Required widget config:
```js
{
  autosize: true,
  symbol: "<TICKER>",
  interval: "D",
  range: "12M",                       // 1-year daily
  theme: "dark",
  style: "1",                         // candles
  timezone: "America/New_York",
  withdateranges: true,
  allow_symbol_change: true,
  studies: [
    { id: "MASimple@tv-basicstudies", inputs: { length: 10  } },
    { id: "MASimple@tv-basicstudies", inputs: { length: 20  } },
    { id: "MASimple@tv-basicstudies", inputs: { length: 50  } },
    { id: "MASimple@tv-basicstudies", inputs: { length: 200 } }
  ],
  support_host: "https://www.tradingview.com"
}
```

Chart container height: **520px** desktop, **420px** mobile.

## Description (right card)

Source: `yfinance.Ticker(t).info`. Fields used:
- `longName` — title
- `sector` + `industry` — meta line
- `country` — appended to meta
- `marketCap` — formatted `$X.XB / $XM`
- `fullTimeEmployees` — chip
- `website` — chip link
- `longBusinessSummary` — body (may be empty for recent spinoffs; provide manual fallback)

## Per-ticker note format

Single line, SEPA-style:
```
VCP <score> · <buy-zone status> · <key signal>
```
Examples:
- `VCP 3 · at pivot · 6 contracting PBs`
- `VCP 2 · -0.9% to pivot · RS +150`
- `VCP 2 · at 52wH · +12% chase zone · 4.3x vol`

## Rebuild workflow

```bash
# 1. Run today's scan (produces /tmp/sepa-scan/results_YYYYMMDD.csv)
python3 technical/sepa_scan_YYYYMMDD.py

# 2. Pick finalists (typically 8–12) by VCP score + buy-zone proximity

# 3. Generate page
python3 technical/build_chart_page.py \
  --date 2026-04-18 \
  --tickers ASC,ACA,PRIM,JOE,GOLF,MCHB,IMVT,BFH,LION,COGT \
  --notes-file /tmp/sepa-scan/notes_20260418.txt

# 4. File opens automatically at /tmp/sepa-scan/charts_YYYYMMDD.html
```

`notes-file` format — one line per ticker, `TICKER|note`:
```
ASC|VCP 3 · at pivot · 6 contracting PBs
ACA|VCP 3 · at pivot · VDU + contracting PBs
...
```

## Output conventions

- **Artifact path:** `/tmp/sepa-scan/charts_YYYYMMDD.html` (regenerable, not in repo).
- **Descriptions cache:** `/tmp/sepa-scan/descriptions_YYYYMMDD.json`.
- Don't commit generated HTML/JSON — they're reproducible from the scan script + ticker list.

## Reference implementation

See `build_chart_page.py` — parameterized version of the 2026-04-18 build.
