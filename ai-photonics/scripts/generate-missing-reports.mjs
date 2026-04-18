import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

import Papa from "papaparse";
import YahooFinance from "yahoo-finance2";

const rootDir = process.cwd();
const resultsPath = path.join(rootDir, "results.tsv");
const metricsPath = path.join(rootDir, "company-metrics.js");
const reportsDir = path.join(rootDir, "reports");

const normalizeTicker = (ticker) => ticker.replace(/[^A-Za-z0-9]/g, "");

const ALIAS_REPORTS = {
  "SIVE.ST": "SIVE.md",
  "SOI.PA": "SOI.md",
  "IQE.L": "IQE.md",
  "HUBN.SW": "HUBN.md",
  "BESI.AS": "BESI.md",
  "VNP.TO": "VNP.md",
  "PRY.MI": "PRY.md",
  "AIXA.DE": "AIXA.md",
  "XFAB.PA": "XFAB.md",
  "STLTECH.NS": "STLTECH.md",
  "JEN.DE": "JEN.md",
  "5344.T": "8249T.md"
};

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

function formatMoney(value, currency = "USD") {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  const abs = Math.abs(value);
  const symbolMap = {
    USD: "$",
    JPY: "JPY ",
    TWD: "TWD ",
    CNY: "CNY ",
    EUR: "EUR ",
    KRW: "KRW ",
    CHF: "CHF ",
    SEK: "SEK ",
    CAD: "CAD ",
    GBP: "GBP "
  };
  const prefix = symbolMap[currency] || `${currency} `;
  if (abs >= 1e12) return `${prefix}${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${prefix}${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${prefix}${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${prefix}${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  return `${prefix}${value}`;
}

function formatNumber(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return "N/A";
  return Number(value).toFixed(digits);
}

function parseMetricsScript(scriptText) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(scriptText, context);
  return context.window.COMPANY_METRICS || context.COMPANY_METRICS || [];
}

function rewriteHeading(markdown, ticker, name) {
  const lines = markdown.split("\n");
  if (lines.length) lines[0] = `# ${ticker} - ${name}`;
  return lines.join("\n");
}

function buildGeneratedReport({ scorecard, metrics, quote }) {
  const date = new Date().toISOString().slice(0, 10);
  const score = scorecard?.score || "N/A";
  const priceText = quote?.regularMarketPrice != null ? formatMoney(quote.regularMarketPrice, quote.currency) : scorecard?.price || "N/A";
  const marketCapText = quote?.marketCap != null ? formatMoney(quote.marketCap, quote.currency) : "N/A";
  const peText = quote?.trailingPE != null ? `${formatNumber(quote.trailingPE, 1)}x` : "N/A";
  const pbText = quote?.priceToBook != null ? `${formatNumber(quote.priceToBook, 1)}x` : "N/A";
  const segment = metrics?.segment || "Unknown";
  const verdict = metrics?.verdict || scorecard?.verdict || "N/A";
  const chokepointScore = metrics?.chokepointScore ?? scorecard?.chokepoint_score ?? "N/A";
  const chokepointTier = metrics?.chokepointTier || scorecard?.chokepoint_tier || "N/A";
  const market = metrics?.market || "N/A";
  const growth = metrics?.revenueGrowth != null ? `${formatNumber(metrics.revenueGrowth, 1)}%` : "N/A";
  const grossMargin = metrics?.grossMargin != null ? `${formatNumber(metrics.grossMargin, 1)}%` : "N/A";
  const opMargin = metrics?.operatingMargin != null ? `${formatNumber(metrics.operatingMargin, 1)}%` : "N/A";
  const opticsPct = metrics?.opticsPct != null ? `${formatNumber(metrics.opticsPct, 1)}%` : "N/A";
  const moat = scorecard?.moat || "N/A";
  const risk = scorecard?.risk_level || "N/A";
  const catalyst = metrics?.catalyst || scorecard?.catalyst || "N/A";
  const oneLiner = metrics?.oneLiner || scorecard?.one_liner || "";
  const thesis = metrics?.thesis || oneLiner;

  return `# ${scorecard.ticker} - ${metrics.name}
## Date: ${date}
## Score: ${score}/100

### Thesis (2-3 sentences)
${thesis}

${oneLiner ? `${oneLiner}\n` : ""}

### Key Metrics
| Metric | Value | Notes |
|--------|-------|-------|
| Verdict | ${verdict} | Current scorecard stance |
| Segment | ${segment} | Optics universe classification |
| Chokepoint Score | ${chokepointScore}/25 | ${chokepointTier} |
| Market | ${market} | Primary listing / operating base |
| Share Price | ${priceText} | Yahoo Finance or scorecard snapshot |
| Market Cap | ${marketCapText} | Yahoo Finance if available |
| Trailing P/E | ${peText} | Yahoo Finance if available |
| Price / Book | ${pbText} | Yahoo Finance if available |
| Revenue Growth | ${growth} | Latest scorecard estimate |
| Gross Margin | ${grossMargin} | Latest scorecard estimate |
| Operating Margin | ${opMargin} | Latest scorecard estimate |
| Optics Exposure | ${opticsPct} | Estimated percent of revenue tied to optics |
| Moat | ${moat} | Scorecard characterization |
| Risk Level | ${risk} | Scorecard characterization |

### Why It Matters
- ${metrics.name} sits in the \`${segment}\` layer of the AI photonics stack.
- Core catalyst in current coverage: ${catalyst}.
- Current coverage view: ${oneLiner || thesis}

### Chokepoint Assessment
${metrics.name} is currently classified as \`${chokepointTier}\` with a \`${chokepointScore}/25\` choke-point score. The key question is whether the company controls a hard-to-replace bottleneck for AI optical systems, or whether it is better understood as a broader semiconductor or industrial supplier where photonics is only one small demand vector. In this case, the current house view is: ${thesis}

### Risks
- The listed vehicle may be broader than the optical niche itself, which can dilute the thesis at the stock level.
- Current scorecard risk level is \`${risk}\`, so position sizing should reflect that the photonics angle may be indirect, early, or economically minor.
- If end-market demand shifts away from AI optical buildouts, the catalyst path can take longer than current scorecard timing assumes.

### Verdict
Current verdict: \`${verdict}\`. This note is a standardized coverage card generated to fill a missing report slot in the research library. It captures the current scorecard view and market snapshot, but should be upgraded with deeper primary-source work if this name becomes a higher-conviction focus.

### Source Trail
- \`results.tsv\` scorecard entry
- \`company-metrics.js\` thesis and segment metadata
- Yahoo Finance market snapshot (${quote ? "live pull" : "not available at generation time"})
`;
}

const resultsText = await fs.readFile(resultsPath, "utf8");
const resultsRows = Papa.parse(resultsText, { header: true, delimiter: "\t", skipEmptyLines: true }).data;
const metricsScript = await fs.readFile(metricsPath, "utf8");
const metricsRows = parseMetricsScript(metricsScript);
const resultsMap = new Map(resultsRows.map((row) => [row.ticker, row]));
const metricsMap = new Map(metricsRows.map((row) => [row.ticker, row]));

const reportFiles = new Set(await fs.readdir(reportsDir));
const missingTickers = resultsRows
  .filter((row) => row.ticker)
  .map((row) => row.ticker)
  .filter((ticker) => !reportFiles.has(`${normalizeTicker(ticker)}.md`));

for (const ticker of missingTickers) {
  const targetPath = path.join(reportsDir, `${normalizeTicker(ticker)}.md`);
  const scorecard = resultsMap.get(ticker);
  const metrics = metricsMap.get(ticker);
  if (!scorecard || !metrics) continue;

  const aliasFile = ALIAS_REPORTS[ticker];
  if (aliasFile && reportFiles.has(aliasFile)) {
    const aliasMarkdown = await fs.readFile(path.join(reportsDir, aliasFile), "utf8");
    await fs.writeFile(targetPath, rewriteHeading(aliasMarkdown, ticker, metrics.name));
    continue;
  }

  let quote = null;
  try {
    quote = await yahooFinance.quote(ticker);
  } catch {
    quote = null;
  }

  const markdown = buildGeneratedReport({ scorecard, metrics, quote });
  await fs.writeFile(targetPath, markdown);
}

console.log(`Generated ${missingTickers.length} missing report files.`);
