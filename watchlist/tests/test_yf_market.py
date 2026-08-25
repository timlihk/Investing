import sys
import unittest
from pathlib import Path
from unittest.mock import patch

SCRIPTS = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS))

import yf_market  # noqa: E402


class FakeFastInfo(dict):
    def __getattr__(self, name):
        try:
            return self[name]
        except KeyError as exc:
            raise AttributeError(name) from exc


class FakeTicker:
    def __init__(self, symbol):
        self.symbol = symbol
        self.fast_info = FakeFastInfo(
            lastPrice=100.0,
            previousClose=95.0,
            currency="USD",
            exchange="NMS",
            marketCap=1_000_000_000,
        )

    def get_info(self):
        return {"trailingPE": 18.5, "forwardPE": 16.2, "priceToBook": 4.1}

    def history(self, **kwargs):
        import pandas as pd

        idx = pd.date_range("2026-08-20", periods=3, freq="D")
        return pd.DataFrame(
            {
                "Open": [90.0, 96.0, 99.0],
                "High": [92.0, 101.0, 102.0],
                "Low": [89.0, 95.0, 98.0],
                "Close": [91.0, 100.0, 101.0],
                "Volume": [1_000, 1_200, 1_400],
            },
            index=idx,
        )


class YfMarketTests(unittest.TestCase):
    def test_parse_symbols_dedupes(self):
        self.assertEqual(yf_market.parse_symbols("AAPL, MU, AAPL"), ["AAPL", "MU"])

    def test_quote_payload_shape_from_yfinance(self):
        with patch.object(yf_market, "get_fx_rates", return_value={"USD": 1.0}), patch(
            "yfinance.Ticker", FakeTicker
        ):
            payload = yf_market.build_quote_payload(["AAPL"], fresh=True)
        self.assertEqual(payload["source"], "yfinance")
        row = payload["results"][0]
        self.assertEqual(row["symbol"], "AAPL")
        self.assertEqual(row["source"], "yfinance")
        mm = row["marketMetrics"]
        self.assertEqual(mm["currentPrice"], 100.0)
        self.assertAlmostEqual(mm["regularMarketChangePercent"], (100 - 95) / 95 * 100)
        self.assertEqual(mm["exchangeName"], "NasdaqGS")
        self.assertEqual(mm["marketCapUsd"], 1_000_000_000)

    def test_detail_payload_has_candles_and_no_bloomberg(self):
        with patch.object(yf_market, "get_fx_rates", return_value={"USD": 1.0}), patch(
            "yfinance.Ticker", FakeTicker
        ):
            payload = yf_market.build_detail_payload("AAPL", 365, fresh=True)
        self.assertEqual(payload["source"], "yfinance")
        mm = payload["marketMetrics"]
        self.assertGreaterEqual(len(mm["chartCandleSeries"]), 3)
        self.assertEqual(mm["chartCandleSeries"][-1]["close"], 101.0)
        self.assertEqual(mm["trailingPE"], 18.5)
        blob = str(payload).lower()
        self.assertNotIn("bloomberg", blob)


if __name__ == "__main__":
    unittest.main()
