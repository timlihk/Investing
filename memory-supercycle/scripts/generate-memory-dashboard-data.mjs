import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const resultsPath = path.join(rootDir, "results.tsv");
const reportsDir = path.join(rootDir, "reports");
const outputPath = path.join(rootDir, "memory-dashboard-data.js");

const SEGMENT_ORDER = [
  "Memory Makers",
  "Equipment, Test & Packaging",
  "Controllers & Storage Silicon"
];

const SEGMENT_BY_TICKER = {
  "000660.KS": "Memory Makers",
  "005930.KS": "Memory Makers",
  "MU": "Memory Makers",
  "SNDK": "Memory Makers",
  "285A.T": "Memory Makers",
  "042700.KS": "Equipment, Test & Packaging",
  "0522.HK": "Equipment, Test & Packaging",
  "6315.T": "Equipment, Test & Packaging",
  "6857.T": "Equipment, Test & Packaging",
  "8035.T": "Equipment, Test & Packaging",
  "8110.TW": "Equipment, Test & Packaging",
  "AMKR": "Equipment, Test & Packaging",
  "FORM": "Equipment, Test & Packaging",
  "SIMO": "Controllers & Storage Silicon"
};

const THEME_EXPOSURE_BY_TICKER = {
  "000660.KS": 100,
  "005930.KS": 95,
  MU: 100,
  SNDK: 90,
  "285A.T": 88,
  "042700.KS": 85,
  "0522.HK": 82,
  "6315.T": 78,
  "6857.T": 76,
  "8035.T": 80,
  "8110.TW": 72,
  AMKR: 68,
  FORM: 79,
  SIMO: 83
};

const MARKET_BY_SUFFIX = {
  HK: "Hong Kong",
  KS: "Korea",
  KQ: "Korea",
  T: "Japan",
  TW: "Taiwan",
  TWO: "Taiwan"
};

const CURRENCY_BY_SUFFIX = {
  HK: "HKD",
  KS: "KRW",
  KQ: "KRW",
  T: "JPY",
  TW: "TWD",
  TWO: "TWD"
};

const TV_PREFIX_BY_SUFFIX = {
  HK: "HKEX",
  KS: "KRX",
  KQ: "KOSDAQ",
  T: "TSE",
  TW: "TWSE",
  TWO: "TPEX"
};

function splitLines(text) {
  return text.split(/\r?\n/);
}

function normalizeTickerToken(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function parseNumber(value) {
  const raw = String(value || "")
    .replace(/[,~%+$]/g, "")
    .trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function loadReportPathMap(entries) {
  const map = new Map();
  entries.forEach((entry) => {
    const token = normalizeTickerToken(path.basename(entry.name, ".md"));
    map.set(token, entry.name);
  });
  return map;
}

function extractCompanyName(markdown, ticker) {
  const heading = splitLines(markdown).find((line) => line.startsWith("# "));
  if (!heading) {
    return ticker;
  }
  const content = heading.replace(/^#\s*/, "");
  const parts = content.split(" - ");
  return parts[1] ? parts[1].trim() : content.trim();
}

function marketFromTicker(ticker) {
  const suffix = ticker.includes(".") ? ticker.split(".").pop() : "";
  return MARKET_BY_SUFFIX[suffix] || "United States";
}

function currencyFromTicker(ticker) {
  const suffix = ticker.includes(".") ? ticker.split(".").pop() : "";
  return CURRENCY_BY_SUFFIX[suffix] || "USD";
}

function tradingViewSymbolFromTicker(ticker) {
  const [base, suffix] = ticker.includes(".") ? ticker.split(".") : [ticker, ""];
  if (!suffix) {
    const defaultExchange = ticker === "AMKR" || ticker === "FORM" || ticker === "MU" || ticker === "SNDK" || ticker === "SIMO"
      ? "NASDAQ"
      : "NYSE";
    return `${defaultExchange}:${base}`;
  }

  const exchange = TV_PREFIX_BY_SUFFIX[suffix] || "NASDAQ";
  const normalizedBase = suffix === "HK" ? String(Number(base)) : base;
  return `${exchange}:${normalizedBase}`;
}

async function main() {
  const [resultsRaw, reportEntries] = await Promise.all([
    fs.readFile(resultsPath, "utf8"),
    fs.readdir(reportsDir, { withFileTypes: true })
  ]);

  const reportPathMap = loadReportPathMap(reportEntries.filter((entry) => entry.isFile()));
  const [headerLine, ...rows] = splitLines(resultsRaw).filter(Boolean);
  const headers = headerLine.split("\t");

  const rowObjects = await Promise.all(
    rows.map(async (line) => {
      const values = line.split("\t");
      const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
      const ticker = record.ticker;
      const reportToken = normalizeTickerToken(ticker);
      const reportFile = reportPathMap.get(reportToken);
      const reportPath = reportFile ? `reports/${reportFile}` : null;
      const reportMarkdown = reportFile ? await fs.readFile(path.join(reportsDir, reportFile), "utf8") : null;
      const name = reportMarkdown ? extractCompanyName(reportMarkdown, ticker) : ticker;
      const segment = SEGMENT_BY_TICKER[ticker] || "Equipment, Test & Packaging";
      const currentPrice = parseNumber(record.price);
      const targetPrice = parseNumber(record.target);
      const upsidePct = parseNumber(record.upside);

      return {
        ticker,
        name,
        segment,
        market: marketFromTicker(ticker),
        verdict: record.verdict || null,
        score: parseNumber(record.score),
        opticsPct: THEME_EXPOSURE_BY_TICKER[ticker] ?? null,
        oneLiner: record.one_liner || null,
        thesis: record.one_liner || null,
        riskLevel: record.risk_level || null,
        catalystShort: record.catalyst || null,
        share: [record.tier, record.upside].filter(Boolean).join(" / "),
        targetPrice,
        researchPrice: currentPrice,
        upsidePct,
        relationshipStatus: record.tier || null,
        reportPath,
        reportMarkdown,
        yahooSymbol: ticker,
        tradingViewSymbol: tradingViewSymbolFromTicker(ticker),
        marketDataStatus: currentPrice == null ? "fallback" : "ok",
        relativeStrength: null,
        chokepointScore: null,
        chokepointTier: record.tier || null,
        chokepointStructure: null,
        moat: null,
        marketMetrics: {
          currency: currencyFromTicker(ticker),
          currentPrice,
          marketCap: null,
          trailingPE: null,
          priceToSales: null,
          oneMonthReturn: null,
          ytdReturn: null,
          oneYearReturn: null,
          distanceFromHigh: null,
          above20Sma: null,
          above50Sma: null,
          above200Sma: null,
          sparkline: []
        }
      };
    })
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    totalCompanies: rowObjects.length,
    buyCount: rowObjects.filter((row) => row.verdict === "BUY").length,
    segmentOrder: SEGMENT_ORDER,
    rows: rowObjects
  };

  await fs.writeFile(outputPath, `window.OPTICS_DASHBOARD_DATA = ${JSON.stringify(payload, null, 2)};\n`);
}

await main();
