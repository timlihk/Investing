import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

import Papa from "papaparse";
import YahooFinance from "yahoo-finance2";

const rootDir = process.cwd();
const resultsPath = path.join(rootDir, "results.tsv");
const metricsPath = path.join(rootDir, "company-metrics.js");
const reportsDir = path.join(rootDir, "reports");
const outputPath = path.join(rootDir, "optics-dashboard-data.js");

const SEGMENT_ORDER = [
  "Materials & Substrates",
  "Foundry & Platforms",
  "Components & Connectivity",
  "Modules & Transceivers",
  "Networking & Systems",
  "Context & Adjacent",
  "Fiber & Connectors",
  "Test & Infrastructure",
  "Assembly & Packaging",
  "Equipment",
  "Raw Materials"
];

const YAHOO_SYMBOL_OVERRIDES = {
  "3081.TW": "3081.TWO",
  "3105.TW": "3105.TWO",
  "4991.TW": "4991.TWO",
  "4971.TW": "4971.TWO",
  "8249.T": "5344.T"
};

const TRADINGVIEW_SYMBOL_OVERRIDES = {
  "0522.HK": "HKEX:522",
  "042700.KS": "KRX:042700",
  "300394.SZ": "SZSE:300394",
  "3711.TW": "TWSE:3711",
  "2317.TW": "TWSE:2317",
  "2382.TW": "TWSE:2382",
  "3231.TW": "TWSE:3231",
  "002475.SZ": "SZSE:002475",
  "3081.TW": "TPEX:3081",
  "6503.T": "TSE:6503",
  "6777.T": "TSE:6777",
  "5802.T": "TSE:5802",
  "4991.TW": "TPEX:4991",
  "SIVE.ST": "OMXSTO:SIVE",
  "6146.T": "TSE:6146",
  "AIXA.DE": "XETR:AIXA",
  "JEN.DE": "XETR:JEN",
  "5803.T": "TSE:5803",
  "6869.HK": "HKEX:6869",
  "600487.SS": "SSE:600487",
  "PRY.MI": "MIL:PRY",
  "STLTECH.NS": "NSE:STLTECH",
  "3105.TW": "TPEX:3105",
  "XFAB.PA": "EURONEXT:XFAB",
  "SOI.PA": "EURONEXT:SOI",
  "4971.TW": "TPEX:4971",
  "5016.T": "TSE:5016",
  "8249.T": "TSE:5344",
  "IQE.L": "LSE:IQE",
  "300308.SZ": "SZSE:300308",
  "300502.SZ": "SZSE:300502",
  "000936.SZ": "SZSE:000936",
  "002281.SZ": "SZSE:002281",
  "300548.SZ": "SZSE:300548",
  "000988.SZ": "SZSE:000988",
  "VNP.TO": "TSX:VNP",
  "4973.T": "TSE:4973",
  "6857.T": "TSE:6857",
  "HUBN.SW": "SIX:HUBN",
  "BESI.AS": "EURONEXT:BESI"
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

  const normalized = trimmed.replace(/[%,$€£¥HKDCNYUSD\s,]/g, "");
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

async function readResultsMap() {
  const raw = await fs.readFile(resultsPath, "utf8");
  const parsed = Papa.parse(raw, {
    header: true,
    delimiter: "\t",
    skipEmptyLines: true
  });

  return new Map(
    parsed.data.map((row) => [row.ticker, row])
  );
}

async function readCompanyMetrics() {
  const code = await fs.readFile(metricsPath, "utf8");
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.window.COMPANY_METRICS;
}

async function readReportFiles() {
  const entries = await fs.readdir(reportsDir);
  return Promise.all(entries
    .filter((entry) => entry.endsWith(".md"))
    .map(async (entry) => ({
      file: entry,
      base: entry.replace(/\.md$/i, ""),
      normalized: normalizeToken(entry.replace(/\.md$/i, "")),
      path: path.posix.join("reports", entry),
      markdown: await fs.readFile(path.join(reportsDir, entry), "utf8")
    })));
}

function findReportEntry(ticker, reportFiles) {
  const tickerKey = normalizeToken(ticker);

  const exact = reportFiles.find((entry) => entry.normalized === tickerKey);
  if (exact) {
    return exact;
  }

  const partialMatches = reportFiles
    .filter((entry) => tickerKey.startsWith(entry.normalized) || entry.normalized.startsWith(tickerKey))
    .sort((left, right) => right.normalized.length - left.normalized.length);

  return partialMatches[0] ?? null;
}

function formatTradingViewSymbol(ticker, exchangeName) {
  const [base, suffix] = ticker.split(".");
  const suffixMap = {
    AS: "EURONEXT",
    DE: "XETR",
    HK: "HKEX",
    KQ: "KOSDAQ",
    KS: "KRX",
    L: "LSE",
    MI: "MIL",
    NS: "NSE",
    PA: "EURONEXT",
    SS: "SSE",
    ST: "OMXSTO",
    SW: "SIX",
    SZ: "SZSE",
    T: "TSE",
    TWO: "TPEX",
    TO: "TSX",
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
  if (/arca|amex/i.test(exchangeName || "")) {
    return `AMEX:${base}`;
  }
  if (/toronto/i.test(exchangeName || "")) {
    return `TSX:${base}`;
  }

  return ticker;
}

function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  if (!valid.length) {
    return null;
  }
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function scoreStructuralControl(tier) {
  switch (tier) {
    case "Monopoly Chokepoint":
      return 12;
    case "Duopoly Chokepoint":
      return 9;
    case "Oligopoly with Moat":
      return 6;
    case "Competitive / Linked":
      return 3;
    default:
      return 4.5;
  }
}

function scoreMoat(moat) {
  switch (moat) {
    case "Exceptional":
      return 5;
    case "Very Strong":
      return 4.5;
    case "Strong":
    case "Strong Niche":
    case "Strong in EML":
      return 4;
    case "Moderate-Strong":
      return 3.5;
    case "Strong but Fragile":
    case "Strong but Eroding":
      return 3;
    case "Moderate":
      return 2.5;
    case "Emerging":
      return 1.5;
    case "Speculative":
      return 0.5;
    default:
      return 2.5;
  }
}

function scoreOpticsPurity(opticsPct) {
  if (!Number.isFinite(opticsPct)) {
    return 1.5;
  }
  if (opticsPct >= 70) {
    return 5;
  }
  if (opticsPct >= 50) {
    return 4;
  }
  if (opticsPct >= 30) {
    return 3;
  }
  if (opticsPct >= 15) {
    return 2;
  }
  if (opticsPct >= 5) {
    return 1;
  }
  return 0;
}

function scoreGrossMargin(grossMargin) {
  if (!Number.isFinite(grossMargin)) {
    return 0.5;
  }
  if (grossMargin >= 65) {
    return 1.5;
  }
  if (grossMargin >= 50) {
    return 1.2;
  }
  if (grossMargin >= 35) {
    return 0.9;
  }
  if (grossMargin >= 20) {
    return 0.6;
  }
  if (grossMargin > 0) {
    return 0.3;
  }
  return 0;
}

function scoreOperatingMargin(operatingMargin) {
  if (!Number.isFinite(operatingMargin)) {
    return 0.5;
  }
  if (operatingMargin >= 30) {
    return 1.5;
  }
  if (operatingMargin >= 20) {
    return 1.2;
  }
  if (operatingMargin >= 10) {
    return 0.9;
  }
  if (operatingMargin >= 0) {
    return 0.6;
  }
  if (operatingMargin >= -10) {
    return 0.3;
  }
  return 0;
}

function buildChokepointProfile(company, research) {
  const structuralTier = research.chokepoint_tier ?? company.chokepointTier ?? null;
  const moat = research.moat ?? null;
  const opticsPct = parseMaybeNumber(company.opticsPct);
  const structuralControl = scoreStructuralControl(structuralTier);
  const moatDurability = scoreMoat(moat);
  const opticsPurity = scoreOpticsPurity(opticsPct);
  const pricingPower = roundNumber(
    scoreGrossMargin(company.grossMargin) + scoreOperatingMargin(company.operatingMargin),
    1
  );
  const total = roundNumber(
    structuralControl + moatDurability + opticsPurity + pricingPower,
    1
  );

  return {
    score: total,
    breakdown: {
      structuralControl: roundNumber(structuralControl, 1),
      moatDurability: roundNumber(moatDurability, 1),
      opticsPurity: roundNumber(opticsPurity, 1),
      pricingPower
    },
    rubric: "12 structure + 5 moat + 5 optics purity + 3 pricing power"
  };
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

function normalizeAnnualFinancials(entries) {
  return (entries || [])
    .filter((entry) => entry?.date)
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime())
    .slice(-5)
    .map((entry) => ({
      period: String(new Date(entry.date).getUTCFullYear()),
      endDate: new Date(entry.date).toISOString().slice(0, 10),
      revenue: roundNumber(entry.totalRevenue, 0),
      ebitda: roundNumber(entry.EBITDA ?? entry.normalizedEBITDA, 0),
      netIncome: roundNumber(entry.netIncome ?? entry.netIncomeCommonStockholders, 0),
      eps: roundNumber(entry.dilutedEPS ?? entry.basicEPS, 2)
    }));
}

function normalizeForwardEstimates(trendEntries) {
  return (trendEntries || [])
    .filter((entry) => entry?.period === "0y" || entry?.period === "+1y")
    .sort((left, right) => new Date(left.endDate).getTime() - new Date(right.endDate).getTime())
    .map((entry) => ({
      period: `${new Date(entry.endDate).getUTCFullYear()}E`,
      endDate: new Date(entry.endDate).toISOString().slice(0, 10),
      revenue: roundNumber(entry.revenueEstimate?.avg, 0),
      revenueGrowth: roundNumber((entry.revenueEstimate?.growth ?? null) * 100, 1),
      eps: roundNumber(entry.earningsEstimate?.avg, 2),
      epsGrowth: roundNumber((entry.earningsEstimate?.growth ?? null) * 100, 1),
      analysts: entry.revenueEstimate?.numberOfAnalysts ?? entry.earningsEstimate?.numberOfAnalysts ?? null
    }));
}

function buildMarketMetrics(symbol, summary, chart, annualFinancials) {
  const quotes = (chart?.quotes || []).filter((quote) => Number.isFinite(quote.close));
  const closes = quotes.map((quote) => quote.close);
  const chartSeries = quotes.map((quote) => ({
    time: new Date(quote.date).toISOString().slice(0, 10),
    value: roundNumber(quote.close, 2)
  }));
  const chartCandleSeries = quotes
    .filter((quote) => [quote.open, quote.high, quote.low, quote.close].every((value) => Number.isFinite(value)))
    .map((quote) => ({
      time: new Date(quote.date).toISOString().slice(0, 10),
      open: roundNumber(quote.open, 2),
      high: roundNumber(quote.high, 2),
      low: roundNumber(quote.low, 2),
      close: roundNumber(quote.close, 2)
    }));
  const chartVolumeSeries = quotes
    .filter((quote) => Number.isFinite(quote.volume))
    .map((quote, index) => {
      const previousClose = index > 0 ? quotes[index - 1].close : quote.close;
      const rising = quote.close >= previousClose;

      return {
        time: new Date(quote.date).toISOString().slice(0, 10),
        value: Math.round(quote.volume),
        color: rising ? "rgba(15,108,75,0.45)" : "rgba(198,74,61,0.45)"
      };
    });
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
  const defaultKeyStatistics = summary?.defaultKeyStatistics || {};
  const financialData = summary?.financialData || {};
  const earningsTrend = summary?.earningsTrend || {};
  const latestPrice = summaryPrice.regularMarketPrice ?? latestClose ?? null;
  const week52High = summaryDetail.fiftyTwoWeekHigh ?? chart?.meta?.fiftyTwoWeekHigh ?? (closes.length ? Math.max(...closes) : null);
  const week52Low = summaryDetail.fiftyTwoWeekLow ?? chart?.meta?.fiftyTwoWeekLow ?? (closes.length ? Math.min(...closes) : null);
  const sma20 = movingAverage(closes, 20);
  const sma50 = movingAverage(closes, 50);
  const sma200 = movingAverage(closes, 200);
  const historicalFinancials = normalizeAnnualFinancials(annualFinancials);
  const forwardFinancials = normalizeForwardEstimates(earningsTrend.trend);

  return {
    exchangeName: summaryPrice.exchangeName ?? chart?.meta?.exchangeName ?? null,
    currency: summaryPrice.currency ?? chart?.meta?.currency ?? null,
    currentPrice: roundNumber(latestPrice, 2),
    marketCap: summaryPrice.marketCap ?? null,
    priceToSales: roundNumber(summaryDetail.priceToSalesTrailing12Months, 2),
    trailingPE: roundNumber(summaryDetail.trailingPE, 2),
    forwardPE: roundNumber(summaryDetail.forwardPE, 2),
    priceToBook: roundNumber(defaultKeyStatistics.priceToBook, 2),
    enterpriseValue: defaultKeyStatistics.enterpriseValue ?? financialData.enterpriseValue ?? null,
    enterpriseToEbitda: roundNumber(defaultKeyStatistics.enterpriseToEbitda ?? financialData.enterpriseToEbitda, 2),
    enterpriseToRevenue: roundNumber(defaultKeyStatistics.enterpriseToRevenue ?? financialData.enterpriseToRevenue, 2),
    bookValuePerShare: roundNumber(defaultKeyStatistics.bookValue, 2),
    sharesOutstanding: summaryPrice.sharesOutstanding ?? defaultKeyStatistics.sharesOutstanding ?? null,
    totalCash: financialData.totalCash ?? null,
    totalDebt: financialData.totalDebt ?? null,
    ebitdaTtm: roundNumber(financialData.ebitda, 0),
    revenueTtm: roundNumber(financialData.totalRevenue, 0),
    grossMargins: roundNumber((financialData.grossMargins ?? null) * 100, 1),
    operatingMargins: roundNumber((financialData.operatingMargins ?? null) * 100, 1),
    ebitdaMargins: roundNumber((financialData.ebitdaMargins ?? null) * 100, 1),
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
    chartSeries,
    chartCandleSeries,
    chartVolumeSeries,
    chartPoints: closes.length,
    historicalFinancials,
    forwardFinancials,
    longTermGrowth: roundNumber((earningsTrend.trend || []).find((entry) => entry?.period === "+5y")?.growth * 100, 1)
  };
}

async function fetchSymbolData(symbol) {
  const modules = ["price", "summaryDetail", "defaultKeyStatistics", "financialData", "earningsTrend"];
  const period2 = new Date();
  const period1 = new Date(period2);
  period1.setUTCFullYear(period1.getUTCFullYear() - 1);
  const fundamentalsPeriod1 = new Date(period2);
  fundamentalsPeriod1.setUTCFullYear(fundamentalsPeriod1.getUTCFullYear() - 6);

  const summary = await retry(
    `${symbol} quoteSummary`,
    () => yahooFinance.quoteSummary(symbol, { modules })
  );

  await sleep(160);

  const chart = await retry(
    `${symbol} chart`,
    () => yahooFinance.chart(symbol, { period1, period2, interval: "1d" })
  );

  await sleep(160);

  const annualFinancials = await retry(
    `${symbol} fundamentalsTimeSeries`,
    () =>
      yahooFinance.fundamentalsTimeSeries(symbol, {
        period1: fundamentalsPeriod1,
        period2,
        type: "annual",
        module: "financials"
      })
  ).catch((error) => {
    console.warn(`[fundamentals] ${symbol} annual financials unavailable: ${error.message}`);
    return [];
  });

  return { summary, chart, annualFinancials };
}

function buildRows(companies, resultsMap, reportFiles, marketMap) {
  return companies.map((company) => {
    const research = resultsMap.get(company.ticker) || {};
    const chokepointProfile = buildChokepointProfile(company, research);
    const market = marketMap.get(company.ticker);
    const yahooSymbol = YAHOO_SYMBOL_OVERRIDES[company.ticker] || company.ticker;
    const reportEntry = findReportEntry(company.ticker, reportFiles);
    const marketMetrics = market
      ? buildMarketMetrics(company.ticker, market.summary, market.chart, market.annualFinancials)
      : {
          exchangeName: null,
          currency: null,
          currentPrice: parseMaybeNumber(research.price),
          marketCap: null,
          priceToSales: null,
          trailingPE: null,
          forwardPE: null,
          priceToBook: null,
          enterpriseValue: null,
          enterpriseToEbitda: null,
          enterpriseToRevenue: null,
          bookValuePerShare: null,
          sharesOutstanding: null,
          totalCash: null,
          totalDebt: null,
          ebitdaTtm: null,
          revenueTtm: null,
          grossMargins: null,
          operatingMargins: null,
          ebitdaMargins: null,
          oneMonthReturn: null,
          ytdReturn: null,
          oneYearReturn: null,
          distanceFromHigh: null,
          week52High: null,
          week52Low: null,
          sma20: null,
          sma50: null,
          sma200: null,
          above20Sma: null,
          above50Sma: null,
          above200Sma: null,
          sparkline: [],
          chartSeries: [],
          chartCandleSeries: [],
          chartVolumeSeries: [],
          chartPoints: 0,
          historicalFinancials: [],
          forwardFinancials: [],
          longTermGrowth: null
        };

    return {
      ticker: company.ticker,
      name: company.name,
      segment: company.segment,
      market: company.market,
      opticsPct: roundNumber(company.opticsPct, 1),
      thesis: company.thesis ?? null,
      catalystShort: company.catalyst ?? null,
      share: company.share ?? null,
      reportPath: reportEntry?.path ?? null,
      reportMarkdown: reportEntry?.markdown ?? null,
      tradingViewSymbol: TRADINGVIEW_SYMBOL_OVERRIDES[company.ticker] || formatTradingViewSymbol(yahooSymbol, marketMetrics.exchangeName),
      yahooSymbol,
      verdict: research.verdict ?? company.verdict ?? null,
      score: parseMaybeNumber(research.score ?? company.chokepointScore),
      moat: research.moat ?? null,
      oneLiner: research.one_liner ?? company.oneLiner ?? null,
      targetPrice: parseMaybeNumber(research.target),
      researchPrice: parseMaybeNumber(research.price),
      upsidePct: parseMaybePercent(research.upside),
      riskLevel: research.risk_level ?? null,
      chipsStatus: research.chips_status ?? null,
      chipsDetail: research.chips_detail ?? null,
      chokepointScore: chokepointProfile.score,
      chokepointTier: chokepointProfile.score >= 20
        ? "Elite Chokepoint"
        : chokepointProfile.score >= 16
          ? "Strong Chokepoint"
          : chokepointProfile.score >= 12
            ? "Relevant Bottleneck"
            : "Linked Exposure",
      chokepointStructure: research.chokepoint_tier ?? company.chokepointTier ?? null,
      chokepointBreakdown: chokepointProfile.breakdown,
      chokepointRubric: chokepointProfile.rubric,
      marketMetrics,
      marketDataStatus: market ? "ok" : "fallback"
    };
  });
}

function assignRelativeStrength(rows) {
  const ranked = rows
    .filter((row) => row.marketMetrics.oneYearReturn != null)
    .map((row) => ({
      row,
      score:
        (row.marketMetrics.oneYearReturn ?? -1000) * 0.55 +
        (row.marketMetrics.ytdReturn ?? -1000) * 0.3 +
        (row.marketMetrics.oneMonthReturn ?? -1000) * 0.15
    }))
    .sort((left, right) => right.score - left.score);

  const total = ranked.length || 1;
  ranked.forEach((entry, index) => {
    const percentile = Math.max(1, Math.round(((total - index) / total) * 100));
    entry.row.relativeStrength = percentile;
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

async function main() {
  const [resultsMap, companies, reportFiles] = await Promise.all([
    readResultsMap(),
    readCompanyMetrics(),
    readReportFiles()
  ]);

  const marketMap = new Map();
  const failures = [];

  for (const company of companies) {
    const yahooSymbol = YAHOO_SYMBOL_OVERRIDES[company.ticker] || company.ticker;
    process.stdout.write(`Fetching ${company.ticker} via ${yahooSymbol}...\n`);
    try {
      const marketData = await fetchSymbolData(yahooSymbol);
      marketMap.set(company.ticker, marketData);
    } catch (error) {
      failures.push({
        ticker: company.ticker,
        yahooSymbol,
        error: error.message
      });
      console.warn(`[warn] ${company.ticker}: ${error.message}`);
    }
    await sleep(120);
  }

  const rows = buildRows(companies, resultsMap, reportFiles, marketMap);
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
  if (failures.length) {
    process.stdout.write(`Warnings: ${failures.length} tickers fell back to research-only values.\n`);
  }
}

await main();
