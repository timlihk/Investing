import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


GENERATOR = Path(__file__).parents[1] / "scripts" / "generate-themes.py"


class GenerateThemesTests(unittest.TestCase):
    def run_generator(self, ticker, tags):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            vault = root / "vault"
            repo = root / "repo"
            (vault / "Screens").mkdir(parents=True)
            (repo / "watchlist").mkdir(parents=True)
            (vault / "Watchlist.md").write_text(
                "| Ticker | Company | Tags | Added | Notes |\n"
                "|---|---|---|---|---|\n"
                f"| {ticker} | Test Company | {tags} | 2026-08-16 | |\n"
                "## Tags in Use\n",
                encoding="utf-8",
            )
            result = subprocess.run(
                [sys.executable, str(GENERATOR), "--vault", str(vault), "--repo", str(repo)],
                text=True,
                capture_output=True,
                check=False,
            )
            output = (repo / "watchlist" / "watchlist-themes.js")
            return result, output.read_text(encoding="utf-8") if output.exists() else ""

    def test_known_financial_is_allocated(self):
        result, output = self.run_generator("JXN", "financials, insurance, annuities, us")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('id: "financials"', output)
        self.assertIn('symbol: "JXN"', output)
        self.assertNotIn('id: "other"', output)

    def test_unknown_ticker_fails_closed(self):
        result, output = self.run_generator("ZZZZ", "unknown-tag")
        self.assertEqual(result.returncode, 1)
        self.assertIn("UNALLOCATED SOURCE TICKERS: ZZZZ", result.stderr)
        self.assertEqual(output, "")


if __name__ == "__main__":
    unittest.main()
