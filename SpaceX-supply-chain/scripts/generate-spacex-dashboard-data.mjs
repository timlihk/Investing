import fs from "node:fs/promises";
import path from "node:path";

import Papa from "papaparse";
import YahooFinance from "yahoo-finance2";

const rootDir = process.cwd();
const resultsPath = path.join(rootDir, "results.tsv");
const chokepointPath = path.join(rootDir, "chokepoint_scores.tsv");
const reportsDir = path.join(rootDir, "reports");
const exposureRankingPath = path.join(reportsDir, "spacex_exposure_ranking.md");
const outputPath = path.join(rootDir, "spacex-dashboard-data.js");

const SEGMENT_ORDER = [
  "Raw Materials & Alloys",
  "Forgings, Flow Control & Structures",
  "Additive Manufacturing",
  "Industrial Gases & Launch Ops",
  "Satellite Semiconductors",
  "Satellite RF & Connectivity",
  "PCBs, Packaging & Terminal Electronics",
  "Ground Infrastructure & Communications",
  "EDA, IP & Platforms",
  "Other"
];

const SEGMENT_BY_TICKER = {
  "014300.KS": "Raw Materials & Alloys",
  "347700.KQ": "Raw Materials & Alloys",
  "3402.T": "Raw Materials & Alloys",
  "TRYIY": "Raw Materials & Alloys",
  "ATI": "Raw Materials & Alloys",
  "CRS": "Raw Materials & Alloys",
  "HXL": "Raw Materials & Alloys",
  "MTRN": "Raw Materials & Alloys",
  "NIC.AX": "Raw Materials & Alloys",
  "STLD": "Raw Materials & Alloys",
  "ACX.MC": "Raw Materials & Alloys",
  "ATRO": "Forgings, Flow Control & Structures",
  "DCO": "Forgings, Flow Control & Structures",
  "ETN": "Forgings, Flow Control & Structures",
  "GHM": "Forgings, Flow Control & Structures",
  "GTLS": "Industrial Gases & Launch Ops",
  "HEI": "Forgings, Flow Control & Structures",
  "HWM": "Forgings, Flow Control & Structures",
  "MOG.A": "Forgings, Flow Control & Structures",
  "PH": "Forgings, Flow Control & Structures",
  "PKE": "Forgings, Flow Control & Structures",
  "SIF": "Forgings, Flow Control & Structures",
  "TDG": "Forgings, Flow Control & Structures",
  "VELO": "Additive Manufacturing",
  "AI.PA": "Industrial Gases & Launch Ops",
  "APD": "Industrial Gases & Launch Ops",
  "LIN": "Industrial Gases & Launch Ops",
  "603986.SS": "PCBs, Packaging & Terminal Electronics",
  "ADI": "Satellite Semiconductors",
  "AMD": "Satellite Semiconductors",
  "AVGO": "Satellite Semiconductors",
  "DIOD": "Satellite Semiconductors",
  "IFX.DE": "Satellite Semiconductors",
  "LSCC": "Satellite Semiconductors",
  "MCHP": "Satellite Semiconductors",
  "MPWR": "Satellite Semiconductors",
  "MU": "Satellite Semiconductors",
  "NXPI": "Satellite Semiconductors",
  "ON": "Satellite Semiconductors",
  "STM": "Satellite Semiconductors",
  "TXN": "Satellite Semiconductors",
  "3105.TW": "Satellite RF & Connectivity",
  "3138.TW": "Satellite RF & Connectivity",
  "3491.TWO": "Satellite RF & Connectivity",
  "6271.TW": "Ground Infrastructure & Communications",
  "6568.TWO": "Satellite RF & Connectivity",
  "FLTCF": "Ground Infrastructure & Communications",
  "QCOM": "Ground Infrastructure & Communications",
  "SWKS": "PCBs, Packaging & Terminal Electronics",
  "MRVL": "PCBs, Packaging & Terminal Electronics",
  "2312.TW": "Ground Infrastructure & Communications",
  "2313.TW": "PCBs, Packaging & Terminal Electronics",
  "2344.TW": "PCBs, Packaging & Terminal Electronics",
  "2355.TW": "PCBs, Packaging & Terminal Electronics",
  "2383.TW": "PCBs, Packaging & Terminal Electronics",
  "2454.TW": "PCBs, Packaging & Terminal Electronics",
  "3305.TW": "PCBs, Packaging & Terminal Electronics",
  "3481.TW": "PCBs, Packaging & Terminal Electronics",
  "4916.TW": "PCBs, Packaging & Terminal Electronics",
  "4927.TW": "PCBs, Packaging & Terminal Electronics",
  "6285.TW": "PCBs, Packaging & Terminal Electronics",
  "6412.TW": "PCBs, Packaging & Terminal Electronics",
  "CMTL": "Ground Infrastructure & Communications",
  "KULR": "Ground Infrastructure & Communications",
  "TRMB": "Ground Infrastructure & Communications",
  "ARM": "EDA, IP & Platforms",
  "CDNS": "EDA, IP & Platforms",
  "SNPS": "EDA, IP & Platforms",
  "6723.T": "Satellite Semiconductors",
  "LFUS": "PCBs, Packaging & Terminal Electronics",
  "M0YN.DE": "Ground Infrastructure & Communications"
};

const NAME_OVERRIDES = {
  "014300.KS": "SeAH Besteel",
  "2454.TW": "MediaTek",
  "347700.KQ": "Sphere Corp",
  "AI.PA": "Air Liquide",
  "ARM": "Arm Holdings",
  "CDNS": "Cadence Design Systems",
  "FLTCF": "Filtronic",
  "LFUS": "Littelfuse",
  "MRVL": "Marvell Technology",
  "QCOM": "Qualcomm",
  "SWKS": "Skyworks Solutions",
  "6412.TW": "Chicony Power Technology"
};

const REPORT_PATH_OVERRIDES = {
  "014300.KS": "reports/014300KS_valuation.md",
  "347700.KQ": "reports/Sphere_Corp.md",
  "6412.TW": "reports/2392_TW.md",
  "QCOM": "reports/QCOM_D2C_analysis.md"
};

const YAHOO_SYMBOL_OVERRIDES = {
  "FLTCF": "FTC.L",
  "MOG.A": "MOG-A",
  "3105.TW": "3105.TWO"
};

const TRADINGVIEW_SYMBOL_OVERRIDES = {
  "014300.KS": "KRX:014300",
  "3105.TW": "TWSE:3105",
  "3138.TW": "TWSE:3138",
  "3305.TW": "TWSE:3305",
  "347700.KQ": "KOSDAQ:347700",
  "3481.TW": "TWSE:3481",
  "3491.TWO": "TPEX:3491",
  "4916.TW": "TWSE:4916",
  "4927.TW": "TWSE:4927",
  "603986.SS": "SSE:603986",
  "6271.TW": "TWSE:6271",
  "6285.TW": "TWSE:6285",
  "6412.TW": "TWSE:6412",
  "6568.TWO": "TPEX:6568",
  "6723.T": "TSE:6723",
  "AI.PA": "EURONEXT:AI",
  "CRS": "NYSE:CRS",
  "FLTCF": "LSE:FTC",
  "IFX.DE": "XETR:IFX",
  "M0YN.DE": "XETR:M0YN",
  "MOG.A": "NYSE:MOG.A",
  "NIC.AX": "ASX:NIC",
  "PH": "NYSE:PH",
  "SNPS": "NASDAQ:SNPS",
  "STM": "NYSE:STM",
  "TDG": "NYSE:TDG",
  "TRYIY": "OTC:TRYIY"
};

const MARKET_LABELS = {
  AX: "Australia",
  DE: "Germany",
  HK: "Hong Kong",
  KQ: "Korea",
  KS: "Korea",
  MC: "Spain",
  PA: "France",
  SS: "China",
  T: "Japan",
  TWO: "Taiwan",
  TW: "Taiwan"
};

const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey"]
});

function normalizeToken(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function parseMaybeNumber(value) {
  if (value == null) {
    return null;
  }

  const trimmed = String(value).trim();
  if (!trimmed || trimmed === "N/A") {
    return null;
  }

  const normalized = trimmed.replace(/[%,$€£¥₩NTDHKDGBPUSDp\s,~+]/g, "");
  const number = Number.parseFloat(normalized);
  return Number.isFinite(number) ? number : null;
}

function parseMaybePercent(value) {
  const number = parseMaybeNumber(value);
  return number == null ? null : number;
}

function roundNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Number(value.toFixed(digits));
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) {
    return null;
  }
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function retry(label, task, attempts = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        break;
      }
      console.warn(`[retry] ${label} failed on attempt ${attempt}/${attempts}: ${error.message}`);
      await sleep(800 * attempt);
    }
  }

  throw lastError;
}

async function readResults() {
  const raw = await fs.readFile(resultsPath, "utf8");
  const parsed = Papa.parse(raw, {
    header: true,
    delimiter: "\t",
    skipEmptyLines: true
  });
  return parsed.data;
}

async function readChokepoints() {
  const raw = await fs.readFile(chokepointPath, "utf8");
  const parsed = Papa.parse(raw, {
    header: true,
    delimiter: "\t",
    skipEmptyLines: true
  });

  return new Map(parsed.data.map((row) => [row.ticker, row]));
}

async function readReportFiles() {
  const entries = await fs.readdir(reportsDir);
  return entries
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => ({
      file: entry,
      normalized: normalizeToken(entry.replace(/\.md$/i, ""))
    }));
}

async function readReportContents(reportFiles) {
  const pairs = await Promise.all(
    reportFiles.map(async (entry) => {
      const reportPath = path.posix.join("reports", entry.file);
      const absolutePath = path.join(rootDir, reportPath);
      const contents = await fs.readFile(absolutePath, "utf8");
      return [reportPath, contents];
    })
  );

  return new Map(pairs);
}

function findReportPath(ticker, reportFiles) {
  if (REPORT_PATH_OVERRIDES[ticker]) {
    return REPORT_PATH_OVERRIDES[ticker];
  }

  const tickerKey = normalizeToken(ticker);
  const exact = reportFiles.find((entry) => entry.normalized === tickerKey);
  if (exact) {
    return path.posix.join("reports", exact.file);
  }

  const partial = reportFiles
    .filter((entry) => tickerKey.startsWith(entry.normalized) || entry.normalized.startsWith(tickerKey))
    .sort((left, right) => right.normalized.length - left.normalized.length);

  return partial[0] ? path.posix.join("reports", partial[0].file) : null;
}

function marketLabelFromTicker(ticker) {
  const suffix = ticker.split(".")[1];
  if (suffix && MARKET_LABELS[suffix]) {
    return MARKET_LABELS[suffix];
  }

  if (ticker === "FLTCF") {
    return "United Kingdom";
  }
  if (ticker === "TRYIY") {
    return "United States ADR";
  }
  return "United States";
}

function formatTradingViewSymbol(ticker, exchangeName) {
  const [base, suffix] = ticker.split(".");
  const suffixMap = {
    AX: "ASX",
    DE: "XETR",
    HK: "HKEX",
    KQ: "KOSDAQ",
    KS: "KRX",
    MC: "BME",
    PA: "EURONEXT",
    SS: "SSE",
    T: "TSE",
    TWO: "TPEX",
    TW: "TWSE"
  };

  if (suffix && suffixMap[suffix]) {
    return `${suffixMap[suffix]}:${base}`;
  }

  if (/nasdaq/i.test(exchangeName || "")) {
    return `NASDAQ:${base}`;
  }
  if (/nyse/i.test(exchangeName || "")) {
    return `NYSE:${base}`;
  }
  if (/otc/i.test(exchangeName || "")) {
    return `OTC:${base}`;
  }

  return ticker;
}

function extractHeading(markdown) {
  return markdown
    .split(/\r?\n/)
    .find((line) => /^#\s+/.test(line))
    ?.replace(/^#\s+/, "")
    .trim() ?? "";
}

function extractNameFromReport(markdown, ticker) {
  if (!markdown) {
    return NAME_OVERRIDES[ticker] || ticker;
  }

  let heading = extractHeading(markdown);
  if (!heading) {
    return NAME_OVERRIDES[ticker] || ticker;
  }

  heading = heading.replace(/^[A-Z0-9.]+\s+(?:--|-|—)\s+/, "");
  heading = heading.split(/\s+—\s+/)[0].trim();
  heading = heading.replace(/\s*\([^)]*\)\s*$/u, "").trim();

  if (!heading || normalizeToken(heading) === normalizeToken(ticker)) {
    return NAME_OVERRIDES[ticker] || ticker;
  }

  return NAME_OVERRIDES[ticker] || heading;
}

function extractSection(markdown, headings) {
  const lines = markdown.split(/\r?\n/);
  const wanted = headings.map((heading) => heading.toLowerCase());
  let start = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim().toLowerCase();
    if (wanted.includes(trimmed)) {
      start = index + 1;
      break;
    }
  }

  if (start === -1) {
    return "";
  }

  const body = [];
  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^#{1,6}\s+/.test(line.trim())) {
      break;
    }
    body.push(line);
  }

  return body.join("\n").trim();
}

function extractFirstParagraph(text) {
  const chunks = text
    .split(/\n\s*\n/)
    .map((chunk) => chunk.replace(/\n/g, " ").trim())
    .filter(Boolean);

  return chunks[0] || "";
}

function extractThesis(markdown, fallback) {
  const thesisSection = extractSection(markdown, ["## Thesis", "### Thesis"]);
  const paragraph = extractFirstParagraph(thesisSection);
  if (paragraph) {
    return paragraph;
  }
  return fallback || null;
}

function parseExposureToken(token) {
  if (!token) {
    return null;
  }

  const normalized = token.replace(/\+/g, "").trim();
  if (/majority/i.test(normalized)) {
    return { label: "Majority of revenue", value: 51 };
  }

  const rangeMatch = normalized.match(/([<>~]?\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)%/);
  if (rangeMatch) {
    const left = parseMaybeNumber(rangeMatch[1]);
    const right = parseMaybeNumber(rangeMatch[2]);
    if (left != null && right != null) {
      return {
        label: `${rangeMatch[1].replace(/^~/, "")}-${rangeMatch[2]}%`,
        value: roundNumber((left + right) / 2, 1)
      };
    }
  }

  const lessThanMatch = normalized.match(/<\s*(\d+(?:\.\d+)?)%/);
  if (lessThanMatch) {
    const value = parseMaybeNumber(lessThanMatch[1]);
    return value == null ? null : { label: `<${lessThanMatch[1]}%`, value: roundNumber(value / 2, 1) };
  }

  const singleMatch = normalized.match(/~?\s*(\d+(?:\.\d+)?)%/);
  if (singleMatch) {
    const value = parseMaybeNumber(singleMatch[1]);
    return value == null ? null : { label: `${singleMatch[1]}%`, value };
  }

  return null;
}

function buildExposureRankingMap(markdown) {
  const map = new Map();
  const lines = markdown.split(/\r?\n/);

  for (const line of lines) {
    if (!line.startsWith("|") || /Rank|---/.test(line)) {
      continue;
    }

    const cells = line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);

    if (cells.length < 6) {
      continue;
    }

    const tickerCell = cells[2];
    const exposureCell = cells[5];
    const ticker = tickerCell.split("/")[0].trim();
    const parsed = parseExposureToken(exposureCell);
    if (ticker && parsed) {
      map.set(ticker, parsed);
    }
  }

  return map;
}

function extractExposure(markdown, oneLiner, rankingMap, ticker) {
  const ranked = rankingMap.get(ticker);
  if (ranked) {
    return ranked;
  }

  const preferredLines = markdown
    .split(/\r?\n/)
    .filter((line) => /(SpaceX exposure|Starlink exposure|SpaceX % of revenue|customer concentration)/i.test(line));

  if (oneLiner && /(SpaceX exposure|Starlink exposure|customer concentration|of rev(?:enue)?)/i.test(oneLiner)) {
    preferredLines.push(oneLiner);
  }

  const fallbackLines = markdown
    .split(/\r?\n/)
    .filter((line) => /(% of revenue|of rev(?:enue)?)/i.test(line));

  for (const line of [...preferredLines, ...fallbackLines]) {
    const anchorMatch = line.match(/(SpaceX exposure|Starlink exposure|SpaceX % of revenue|customer concentration|% of revenue|of rev(?:enue)?)/i);
    const scopedLine = !anchorMatch
      ? line
      : /% of revenue|of rev(?:enue)?/i.test(anchorMatch[1])
        ? line.slice(Math.max(0, anchorMatch.index - 16))
        : line.slice(anchorMatch.index);
    const matches = scopedLine.match(/majority|<\s*\d+(?:\.\d+)?%|~?\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?%|~?\d+(?:\.\d+)?%/ig) || [];
    for (const candidate of matches) {
      const parsed = parseExposureToken(candidate);
      if (parsed) {
        return parsed;
      }
    }
  }

  return null;
}

function inferMoat(tier) {
  switch (tier) {
    case "Monopoly Chokepoint":
      return "Very Strong";
    case "Duopoly Chokepoint":
      return "Strong";
    case "Oligopoly with Moat":
      return "Moderate-Strong";
    case "Competitive with Differentiation":
      return "Moderate";
    case "Competitive / Linked":
      return "Linked";
    case "Commodity / Indirect":
      return "Weak";
    default:
      return null;
  }
}

function calcReturn(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return null;
  }
  return ((current / previous) - 1) * 100;
}

function closeAtOrAfter(quotes, targetDate) {
  const targetTs = targetDate.getTime();
  const match = quotes.find((quote) => new Date(quote.date).getTime() >= targetTs && Number.isFinite(quote.close));
  return match?.close ?? quotes[0]?.close ?? null;
}

function movingAverage(values, days) {
  if (values.length < days) {
    return null;
  }
  return average(values.slice(-days));
}

function compressSeries(values, maxPoints = 72) {
  if (values.length <= maxPoints) {
    return values.map((value) => roundNumber(value, 2));
  }

  const sample = [];
  for (let index = 0; index < maxPoints; index += 1) {
    const position = Math.round((index * (values.length - 1)) / (maxPoints - 1));
    sample.push(roundNumber(values[position], 2));
  }
  return sample;
}

function buildMarketMetrics(summary, chart, fallbackPrice) {
  const quotes = (chart?.quotes || []).filter((quote) => Number.isFinite(quote.close));
  const closes = quotes.map((quote) => quote.close);
  const latestClose = closes.at(-1) ?? null;
  const now = new Date();
  const oneMonthDate = new Date(now);
  oneMonthDate.setDate(oneMonthDate.getDate() - 30);
  const yearStartDate = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  const oneMonthClose = closeAtOrAfter(quotes, oneMonthDate);
  const yearStartClose = closeAtOrAfter(quotes, yearStartDate);
  const oneYearClose = closes[0] ?? null;

  const summaryPrice = summary?.price || {};
  const summaryDetail = summary?.summaryDetail || {};
  const latestPrice = summaryPrice.regularMarketPrice ?? latestClose ?? fallbackPrice ?? null;
  const week52High = summaryDetail.fiftyTwoWeekHigh ?? chart?.meta?.fiftyTwoWeekHigh ?? (closes.length ? Math.max(...closes) : null);
  const week52Low = summaryDetail.fiftyTwoWeekLow ?? chart?.meta?.fiftyTwoWeekLow ?? (closes.length ? Math.min(...closes) : null);
  const sma20 = movingAverage(closes, 20);
  const sma50 = movingAverage(closes, 50);
  const sma200 = movingAverage(closes, 200);

  return {
    exchangeName: summaryPrice.exchangeName ?? chart?.meta?.exchangeName ?? null,
    currency: summaryPrice.currency ?? chart?.meta?.currency ?? null,
    currentPrice: roundNumber(latestPrice, 2),
    marketCap: summaryPrice.marketCap ?? null,
    priceToSales: roundNumber(summaryDetail.priceToSalesTrailing12Months, 2),
    trailingPE: roundNumber(summaryDetail.trailingPE, 2),
    oneMonthReturn: roundNumber(calcReturn(latestPrice, oneMonthClose), 2),
    ytdReturn: roundNumber(calcReturn(latestPrice, yearStartClose), 2),
    oneYearReturn: roundNumber(calcReturn(latestPrice, oneYearClose), 2),
    distanceFromHigh: roundNumber(calcReturn(latestPrice, week52High), 2),
    week52High: roundNumber(week52High, 2),
    week52Low: roundNumber(week52Low, 2),
    sma20: roundNumber(sma20, 2),
    sma50: roundNumber(sma50, 2),
    sma200: roundNumber(sma200, 2),
    above20Sma: Number.isFinite(latestPrice) && Number.isFinite(sma20) ? latestPrice >= sma20 : null,
    above50Sma: Number.isFinite(latestPrice) && Number.isFinite(sma50) ? latestPrice >= sma50 : null,
    above200Sma: Number.isFinite(latestPrice) && Number.isFinite(sma200) ? latestPrice >= sma200 : null,
    sparkline: compressSeries(closes, 72),
    chartPoints: closes.length
  };
}

async function fetchSymbolData(symbol) {
  const modules = ["price", "summaryDetail"];
  const period2 = new Date();
  const period1 = new Date(period2);
  period1.setUTCFullYear(period1.getUTCFullYear() - 1);

  const summary = await retry(
    `${symbol} quoteSummary`,
    () => yahooFinance.quoteSummary(symbol, { modules })
  );

  await sleep(160);

  const chart = await retry(
    `${symbol} chart`,
    () => yahooFinance.chart(symbol, { period1, period2, interval: "1d" })
  );

  return { summary, chart };
}

function assignRelativeStrength(rows) {
  const ranked = rows
    .filter((row) => row.marketMetrics.oneYearReturn != null)
    .map((row) => ({
      row,
      score:
        (row.marketMetrics.oneYearReturn ?? -1000) * 0.55 +
        (row.marketMetrics.ytdReturn ?? -1000) * 0.30 +
        (row.marketMetrics.oneMonthReturn ?? -1000) * 0.15
    }))
    .sort((left, right) => right.score - left.score);

  const total = ranked.length || 1;
  ranked.forEach((entry, index) => {
    entry.row.relativeStrength = Math.max(1, Math.round(((total - index) / total) * 100));
  });

  rows.forEach((row) => {
    if (!("relativeStrength" in row)) {
      row.relativeStrength = null;
    }
  });
}

function buildSegments(rows) {
  return SEGMENT_ORDER.map((segment) => {
    const segmentRows = rows.filter((row) => row.segment === segment);
    return {
      name: segment,
      count: segmentRows.length,
      buys: segmentRows.filter((row) => row.verdict === "BUY").length,
      avgScore: roundNumber(average(segmentRows.map((row) => row.score)), 1),
      avgOneYear: roundNumber(average(segmentRows.map((row) => row.marketMetrics.oneYearReturn)), 1)
    };
  }).filter((segment) => segment.count > 0);
}

function buildRows(results, chokepointMap, reportFiles, reportContents, rankingMap, marketMap) {
  return results.map((research) => {
    const reportPath = findReportPath(research.ticker, reportFiles);
    const markdown = reportPath ? reportContents.get(reportPath) || "" : "";
    const chokepoint = chokepointMap.get(research.ticker) || {};
    const exposure = extractExposure(markdown, research.one_liner, rankingMap, research.ticker);
    const yahooSymbol = YAHOO_SYMBOL_OVERRIDES[research.ticker] || research.ticker;
    const marketData = marketMap.get(research.ticker);
    const marketMetrics = buildMarketMetrics(
      marketData?.summary,
      marketData?.chart,
      parseMaybeNumber(research.price)
    );

    return {
      ticker: research.ticker,
      name: extractNameFromReport(markdown, research.ticker),
      segment: SEGMENT_BY_TICKER[research.ticker] || "Other",
      market: marketLabelFromTicker(research.ticker),
      opticsPct: exposure?.value ?? null,
      thesis: extractThesis(markdown, research.one_liner),
      catalystShort: research.catalyst || null,
      share: exposure?.label || research.spacex_confirmed || null,
      reportPath,
      tradingViewSymbol: TRADINGVIEW_SYMBOL_OVERRIDES[research.ticker] || formatTradingViewSymbol(yahooSymbol, marketMetrics.exchangeName),
      yahooSymbol,
      verdict: research.verdict || null,
      score: parseMaybeNumber(research.score),
      moat: inferMoat(research.chokepoint_tier),
      oneLiner: research.one_liner || null,
      targetPrice: parseMaybeNumber(research.target),
      researchPrice: parseMaybeNumber(research.price),
      upsidePct: parseMaybePercent(research.upside),
      riskLevel: research.risk_level || null,
      relationshipStatus: research.spacex_confirmed || null,
      chokepointScore: parseMaybeNumber(research.chokepoint_score),
      chokepointTier: research.chokepoint_tier || null,
      chokepointStructure: research.chokepoint_tier || null,
      chokepointBreakdown: {
        breakage: parseMaybeNumber(chokepoint.breakage),
        alternatives: parseMaybeNumber(chokepoint.alternatives),
        qualification: parseMaybeNumber(chokepoint.qualification),
        cogs: parseMaybeNumber(chokepoint.cogs),
        capacity: parseMaybeNumber(chokepoint.capacity)
      },
      chokepointRubric: "5 breakage + 5 alternatives + 5 qualification + 5 COGS + 5 capacity",
      marketMetrics,
      marketDataStatus: marketData ? "ok" : "fallback"
    };
  });
}

async function main() {
  const [results, chokepointMap, reportFiles, exposureRankingMarkdown] = await Promise.all([
    readResults(),
    readChokepoints(),
    readReportFiles(),
    fs.readFile(exposureRankingPath, "utf8")
  ]);

  const reportContents = await readReportContents(reportFiles);
  const exposureRankingMap = buildExposureRankingMap(exposureRankingMarkdown);
  const marketMap = new Map();
  const failures = [];

  for (const research of results) {
    const yahooSymbol = YAHOO_SYMBOL_OVERRIDES[research.ticker] || research.ticker;
    process.stdout.write(`Fetching ${research.ticker} via ${yahooSymbol}...\n`);
    try {
      marketMap.set(research.ticker, await fetchSymbolData(yahooSymbol));
    } catch (error) {
      failures.push({
        ticker: research.ticker,
        yahooSymbol,
        error: error.message
      });
      console.warn(`[warn] ${research.ticker}: ${error.message}`);
    }
    await sleep(120);
  }

  const rows = buildRows(results, chokepointMap, reportFiles, reportContents, exposureRankingMap, marketMap);
  assignRelativeStrength(rows);

  const payload = {
    generatedAt: new Date().toISOString(),
    totalCompanies: rows.length,
    buyCount: rows.filter((row) => row.verdict === "BUY").length,
    segmentOrder: SEGMENT_ORDER,
    segments: buildSegments(rows),
    failures,
    rows
  };

  const fileContents = `window.OPTICS_DASHBOARD_DATA = ${JSON.stringify(payload, null, 2)};\n`;
  await fs.writeFile(outputPath, fileContents, "utf8");

  process.stdout.write(`Wrote ${outputPath}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
