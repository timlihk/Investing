const QUOTE_MAX_SYMBOLS = 60;
const MARKET_CACHE_CONTROL = "public, max-age=60, s-maxage=300";
const DEFAULT_CHART_RANGE_DAYS = 365;
const YAHOO_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Free FX rates (open.er-api.com, no key) for USD-denominated market caps.
let fxRates = null;
let fxFetchedAt = 0;
const FX_CACHE_MS = 12 * 60 * 60 * 1000;

async function getFxRates() {
  const now = Date.now();
  if (fxRates && now - fxFetchedAt < FX_CACHE_MS) return fxRates;
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      headers: { "user-agent": YAHOO_UA }
    });
    const payload = await response.json();
    if (payload && payload.result === "success" && payload.rates) {
      fxRates = payload.rates;
      fxFetchedAt = now;
    }
  } catch (error) {
    // keep last known rates on failure
  }
  return fxRates;
}

function toUsd(value, currency, rates) {
  if (!Number.isFinite(value) || !currency) return null;
  if (currency === "USD") return value;
  let rate = rates?.[currency] ?? null;
  // London stocks quote in pence but Yahoo's marketCap is already in pounds
  if (rate === null && (currency === "GBp" || currency === "GBX")) {
    rate = rates?.GBP ?? null;
  }
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return value / rate;
}

// Company Research Hub lives on the NAS behind the Cloudflare tunnel.
// research.mangrove-hk.org/company/* proxies through to it, so the hub
// appears as a tab of this app without a second hostname.
const COMPANY_HUB_ORIGIN = "https://hermes-research.mangrove-hk.org";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/market/")) {
      return handleMarketApi(url);
    }

    // Company Research Hub tab: proxy /company/* -> NAS hub (port 3101 via tunnel)
    if (url.pathname === "/company" || url.pathname.startsWith("/company/")) {
      return handleCompanyProxy(url, request);
    }

    if (url.pathname.endsWith("/")) {
      url.pathname = `${url.pathname}index.html`;
    } else if (!url.pathname.split("/").pop().includes(".")) {
      url.pathname = `${url.pathname}/index.html`;
    }

    return env.ASSETS.fetch(new Request(url.toString(), request));
  }
};

async function handleMarketApi(url) {
  try {
    if (url.pathname === "/api/market/quotes") {
      return jsonResponse(await getQuotePayload(url));
    }

    if (url.pathname === "/api/market/detail") {
      return jsonResponse(await getDetailPayload(url));
    }

    return jsonResponse({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unknown market-data error"
      },
      { status: 500 }
    );
  }
}

async function getQuotePayload(url) {
  const symbols = parseSymbols(url.searchParams.get("symbols"));
  if (!symbols.length) {
    return { results: [] };
  }

  const session = await createYahooSession();
  const response = await yahooJsonFetch(
    `/v7/finance/quote?symbols=${encodeURIComponent(symbols.slice(0, QUOTE_MAX_SYMBOLS).join(","))}`,
    session
  );
  const quotes = response?.quoteResponse?.result || [];
  const rates = await getFxRates();
  const results = quotes.map((quote) => normalizeQuotePayload(quote, rates));
  return { results };
}

async function getDetailPayload(url) {
  const symbol = String(url.searchParams.get("symbol") || "").trim();
  if (!symbol) {
    throw new Error("Missing symbol");
  }

  const rangeDays = clampNumber(url.searchParams.get("rangeDays"), 30, 1825, DEFAULT_CHART_RANGE_DAYS);
  const period2 = new Date();
  const period1 = new Date(period2);
  period1.setUTCDate(period1.getUTCDate() - rangeDays);

  // Yahoo rejects day-suffixed ranges above ~2y; use the named range for 5y.
  const rangeParam = rangeDays >= 1500 ? "5y" : `${rangeDays}d`;

  const session = await createYahooSession();
  const [summaryResponse, chartResponse] = await Promise.all([
    yahooJsonFetch(
      `/v10/finance/quoteSummary/${encodeURIComponent(
        symbol
      )}?modules=price,summaryDetail,defaultKeyStatistics,financialData`,
      session
    ),
    yahooJsonFetch(
      `/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${encodeURIComponent(
        rangeParam
      )}&events=div,splits`,
      session
    )
  ]);

  const rates = await getFxRates();
  const summary = summaryResponse?.quoteSummary?.result?.[0] || {};
  const chartResult = chartResponse?.chart?.result?.[0] || {};
  const quotes = buildQuotesFromYahooChart(chartResult);
  const chartMetrics = buildChartMetrics(quotes);
  const summaryMetrics = normalizeSummaryPayload(summary, rates);
  const quoteMetrics = normalizeQuotePayload(summary?.price || {}, rates);

  return {
    symbol,
    updatedAt: new Date().toISOString(),
    marketMetrics: {
      ...quoteMetrics.marketMetrics,
      ...summaryMetrics.marketMetrics,
      ...chartMetrics
    }
  };
}

async function createYahooSession() {
  const landingResponse = await fetch("https://finance.yahoo.com/quote/AAPL", {
    redirect: "manual",
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml",
      "user-agent": YAHOO_UA
    }
  });

  const cookie = mergeCookieHeaders(landingResponse.headers.getSetCookie?.() || []);
  if (!cookie) {
    throw new Error("Yahoo session cookie was not returned");
  }

  const crumbResponse = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: {
      cookie,
      "user-agent": YAHOO_UA
    }
  });

  if (!crumbResponse.ok) {
    throw new Error(`Yahoo crumb request failed with status ${crumbResponse.status}`);
  }

  const crumb = (await crumbResponse.text()).trim();
  if (!crumb) {
    throw new Error("Yahoo crumb was empty");
  }

  return { cookie, crumb };
}

async function yahooJsonFetch(path, session) {
  const separator = path.includes("?") ? "&" : "?";
  const url = `https://query2.finance.yahoo.com${path}${separator}crumb=${encodeURIComponent(session.crumb)}`;
  const response = await fetch(url, {
    headers: {
      cookie: session.cookie,
      "user-agent": YAHOO_UA
    }
  });

  if (!response.ok) {
    throw new Error(`Yahoo request failed (${response.status}) for ${path}`);
  }

  return response.json();
}

function mergeCookieHeaders(setCookieHeaders) {
  const fragments = setCookieHeaders
    .map((header) => String(header || "").split(";")[0].trim())
    .filter(Boolean);
  return Array.from(new Set(fragments)).join("; ");
}

function buildQuotesFromYahooChart(chartResult) {
  const timestamps = chartResult?.timestamp || [];
  const quoteBlock = chartResult?.indicators?.quote?.[0] || {};
  const open = quoteBlock.open || [];
  const high = quoteBlock.high || [];
  const low = quoteBlock.low || [];
  const close = quoteBlock.close || [];
  const volume = quoteBlock.volume || [];

  // Drop null/zero closes (common for incomplete same-day KRX bars and bad .KS maps of KOSDAQ names).
  return timestamps
    .map((timestamp, index) => ({
      date: new Date(timestamp * 1000),
      open: toFiniteNumber(open[index] ?? close[index]),
      high: toFiniteNumber(high[index] ?? close[index]),
      low: toFiniteNumber(low[index] ?? close[index]),
      close: toFiniteNumber(close[index]),
      volume: toFiniteNumber(volume[index]) || 0
    }))
    .filter((bar) => Number.isFinite(bar.close) && bar.close > 0);
}

function parseSymbols(raw) {
  return Array.from(
    new Set(
      String(raw || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function clampNumber(raw, min, max, fallback) {
  const parsed = Number.parseInt(raw || "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
}

function normalizeQuotePayload(quote, rates) {
  const currency = unwrapYahooValue(quote.currency) || unwrapYahooValue(quote.financialCurrency) || null;
  const currentPrice = toFiniteNumber(
    unwrapYahooValue(quote.regularMarketPrice) ??
      unwrapYahooValue(quote.postMarketPrice) ??
      unwrapYahooValue(quote.preMarketPrice) ??
      unwrapYahooValue(quote.currentPrice) ??
      null
  );
  let marketCap = toFiniteNumber(unwrapYahooValue(quote.marketCap));
  if (!Number.isFinite(marketCap) || marketCap <= 0) {
    const shares =
      toFiniteNumber(unwrapYahooValue(quote.sharesOutstanding)) ??
      toFiniteNumber(unwrapYahooValue(quote.impliedSharesOutstanding));
    if (Number.isFinite(shares) && shares > 0 && Number.isFinite(currentPrice) && currentPrice > 0) {
      marketCap = shares * currentPrice;
    } else {
      marketCap = null;
    }
  }

  const epsTtm = toFiniteNumber(unwrapYahooValue(quote.epsTrailingTwelveMonths));
  const epsFwd = toFiniteNumber(unwrapYahooValue(quote.epsForward));
  let trailingPE = toFiniteNumber(unwrapYahooValue(quote.trailingPE));
  if (!Number.isFinite(trailingPE) || trailingPE <= 0) {
    trailingPE =
      Number.isFinite(epsTtm) && epsTtm > 0 && Number.isFinite(currentPrice)
        ? currentPrice / epsTtm
        : null;
  }
  let forwardPE = toFiniteNumber(unwrapYahooValue(quote.forwardPE));
  if (!Number.isFinite(forwardPE) || forwardPE <= 0) {
    forwardPE =
      Number.isFinite(epsFwd) && epsFwd > 0 && Number.isFinite(currentPrice) ? currentPrice / epsFwd : null;
  }

  return {
    symbol: unwrapYahooValue(quote.symbol) || unwrapYahooValue(quote.shortName) || null,
    updatedAt: toIsoString(
      unwrapYahooValue(quote.regularMarketTime) ||
        unwrapYahooValue(quote.postMarketTime) ||
        unwrapYahooValue(quote.preMarketTime)
    ),
    marketMetrics: {
      currency,
      exchangeName: unwrapYahooValue(quote.fullExchangeName) || unwrapYahooValue(quote.exchange) || null,
      marketState: unwrapYahooValue(quote.marketState) || null,
      currentPrice,
      marketCap: marketCap,
      marketCapUsd: toUsd(marketCap, currency, rates),
      trailingPE,
      forwardPE,
      priceToBook: positiveOrNull(unwrapYahooValue(quote.priceToBook)),
      regularMarketChange: toFiniteNumber(unwrapYahooValue(quote.regularMarketChange)),
      regularMarketChangePercent: toFiniteNumber(unwrapYahooValue(quote.regularMarketChangePercent))
    }
  };
}

function normalizeSummaryPayload(summary, rates) {
  const price = summary?.price || {};
  const detail = summary?.summaryDetail || {};
  const statistics = summary?.defaultKeyStatistics || {};
  const financial = summary?.financialData || {};
  const currency = unwrapYahooValue(price.currency) || unwrapYahooValue(price.financialCurrency) || null;
  const currentPrice = toFiniteNumber(unwrapYahooValue(price.regularMarketPrice));
  let marketCap = toFiniteNumber(unwrapYahooValue(price.marketCap));
  // Small-cap KOSDAQ names often omit marketCap; reconstruct from shares * last.
  if (!Number.isFinite(marketCap) || marketCap <= 0) {
    const shares =
      toFiniteNumber(unwrapYahooValue(statistics.sharesOutstanding)) ??
      toFiniteNumber(unwrapYahooValue(statistics.impliedSharesOutstanding));
    if (Number.isFinite(shares) && shares > 0 && Number.isFinite(currentPrice) && currentPrice > 0) {
      marketCap = shares * currentPrice;
    } else {
      marketCap = null;
    }
  }

  return {
    marketMetrics: {
      currency,
      currentPrice,
      marketCap: marketCap,
      marketCapUsd: toUsd(marketCap, currency, rates),
      exchangeName: unwrapYahooValue(price.fullExchangeName) || unwrapYahooValue(price.exchangeName) || null,
      enterpriseValue: positiveOrNull(unwrapYahooValue(statistics.enterpriseValue)),
      trailingPE: positiveOrNull(unwrapYahooValue(detail.trailingPE)),
      forwardPE: positiveOrNull(unwrapYahooValue(detail.forwardPE)),
      priceToBook: positiveOrNull(unwrapYahooValue(statistics.priceToBook)),
      enterpriseToEbitda: toFiniteNumber(unwrapYahooValue(statistics.enterpriseToEbitda)),
      enterpriseToRevenue: toFiniteNumber(unwrapYahooValue(statistics.enterpriseToRevenue)),
      totalCash: toFiniteNumber(unwrapYahooValue(financial.totalCash)),
      totalDebt: toFiniteNumber(unwrapYahooValue(financial.totalDebt)),
      grossMargins: ratioToPercent(unwrapYahooValue(financial.grossMargins)),
      operatingMargins: ratioToPercent(unwrapYahooValue(financial.operatingMargins)),
      revenueTtm: toFiniteNumber(unwrapYahooValue(financial.totalRevenue)),
      ebitdaTtm: toFiniteNumber(unwrapYahooValue(financial.ebitda))
    }
  };
}

/** Treat non-positive Yahoo ratios as missing (0 PE / 0 EV is almost always a null payload). */
function positiveOrNull(value) {
  const n = toFiniteNumber(unwrapYahooValue(value));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function buildChartMetrics(quotes) {
  const cleanQuotes = quotes
    .filter((quote) => quote?.date && Number.isFinite(quote.close) && quote.close > 0)
    .map((quote) => ({
      date: new Date(quote.date),
      open: toFiniteNumber(quote.open ?? quote.close),
      high: toFiniteNumber(quote.high ?? quote.close),
      low: toFiniteNumber(quote.low ?? quote.close),
      close: toFiniteNumber(quote.close),
      volume: toFiniteNumber(quote.volume) || 0
    }))
    .sort((left, right) => left.date - right.date);

  const chartSeries = cleanQuotes.map((quote) => ({
    time: toChartDate(quote.date),
    value: quote.close
  }));

  const chartCandleSeries = cleanQuotes.map((quote) => ({
    time: toChartDate(quote.date),
    open: quote.open,
    high: quote.high,
    low: quote.low,
    close: quote.close
  }));

  const chartVolumeSeries = cleanQuotes.map((quote, index) => {
    const previousClose = index > 0 ? cleanQuotes[index - 1].close : quote.open;
    return {
      time: toChartDate(quote.date),
      value: quote.volume,
      color: quote.close >= previousClose ? "rgba(15,108,75,0.35)" : "rgba(198,74,61,0.35)"
    };
  });

  const closes = cleanQuotes.map((quote) => quote.close);
  const latestClose = closes.at(-1) ?? null;
  const highestClose = closes.length ? Math.max(...closes) : null;
  const ytdBase = findFirstQuoteInYear(cleanQuotes, new Date().getUTCFullYear());
  const oneMonthBase = findNthFromEnd(closes, 22);
  const oneYearBase = closes[0] ?? null;

  return {
    chartSeries,
    chartCandleSeries,
    chartVolumeSeries,
    sparkline: chartSeries.slice(-30).map((point) => point.value),
    oneMonthReturn: computePercentChange(latestClose, oneMonthBase),
    ytdReturn: computePercentChange(latestClose, ytdBase?.close ?? null),
    oneYearReturn: computePercentChange(latestClose, oneYearBase),
    distanceFromHigh: computePercentChange(latestClose, highestClose),
    above20Sma: compareToSma(closes, 20),
    above50Sma: compareToSma(closes, 50),
    above200Sma: compareToSma(closes, 200)
  };
}

function findNthFromEnd(values, nth) {
  if (values.length < nth) {
    return null;
  }
  return values[values.length - nth];
}

function findFirstQuoteInYear(quotes, year) {
  return quotes.find((quote) => quote.date.getUTCFullYear() === year) || null;
}

function compareToSma(values, period) {
  if (values.length < period) {
    return null;
  }
  const window = values.slice(-period);
  const average = window.reduce((sum, value) => sum + value, 0) / period;
  const latest = values.at(-1);
  if (!Number.isFinite(latest) || !Number.isFinite(average)) {
    return null;
  }
  return latest >= average;
}

function computePercentChange(current, base) {
  if (!Number.isFinite(current) || !Number.isFinite(base) || base === 0) {
    return null;
  }
  return Number((((current - base) / base) * 100).toFixed(2));
}

function toChartDate(date) {
  return date.toISOString().slice(0, 10);
}

function ratioToPercent(value) {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Number((value * 100).toFixed(1));
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function unwrapYahooValue(value) {
  if (value && typeof value === "object" && "raw" in value) {
    return value.raw;
  }
  return value ?? null;
}

function toIsoString(value) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

async function handleCompanyProxy(url, request) {
  try {
    const rest = url.pathname === "/company" ? "/" : url.pathname.slice("/company".length);
    const target = new URL(rest, COMPANY_HUB_ORIGIN);
    if (url.search) target.search = url.search;

    const proxied = await fetch(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow",
    });

    const response = new Response(proxied.body, proxied);
    // Hub pages/JSON are dynamic — never cache at the edge.
    response.headers.set("cache-control", "no-store, must-revalidate");
    response.headers.set("CDN-Cache-Control", "no-store");
    return response;
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Company hub proxy error"
      },
      { status: 502 }
    );
  }
}

function jsonResponse(payload, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", MARKET_CACHE_CONTROL);

  return new Response(JSON.stringify(payload), {
    ...init,
    headers
  });
}
