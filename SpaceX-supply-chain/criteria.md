# Scoring Criteria — SpaceX Supply Chain Chokepoint Edition

Total score out of 100, weighted across 5 dimensions + signal adjustments.

Inherits the chokepoint-economics framework from [AI Photonics](../ai-photonics/criteria.md) with SpaceX-specific adaptations.

Scoring discipline:
- Score the 5 base dimensions first.
- Apply signal adjustments only after the base score is complete.
- Do not double-count the same fact in both `Catalyst & Timing` and `Signal Adjustments`.
- Label all inputs as `reported`, `guided`, or `estimated` in the report.
- Maintain the raw 5-question chokepoint inputs in `chokepoint_scores.tsv` so `chokepoint_score` is auditable.

## 1. Chokepoint Strength (30 points) — THE PRIMARY DIMENSION

Score based on the 5-question chokepoint test:

| Chokepoint Score (out of 25) | Points | Tier |
|------------------------------|--------|------|
| 21-25 | 26-30 | **Monopoly Chokepoint** — only supplier, years to replicate, SpaceX breaks without them |
| 16-20 | 20-25 | **Duopoly Chokepoint** — 2 suppliers, high switching costs, critical to chain |
| 11-15 | 14-19 | **Oligopoly with Moat** — 3-5 suppliers, leader has structural advantage |
| 6-10  | 7-13  | **Competitive with Differentiation** — many suppliers, some brand/IP moat |
| 1-5   | 1-6   | **Commodity** — easily substitutable, no structural advantage |

### The 5 Chokepoint Questions

| # | Question | 5 (strongest) | 3 (moderate) | 1 (weakest) |
|---|----------|---------------|--------------|-------------|
| 1 | What breaks if they stop shipping? | Rocket/satellite production halts | Some programs delayed | Minor inconvenience |
| 2 | How many alternatives exist? | 0-1 viable alternatives | 2-3 alternatives | 5+ alternatives |
| 3 | How long to qualify a replacement? | >2 years (aerospace qual) | 6-24 months | <6 months |
| 4 | What % of customer COGS? | <5% (cheap but critical) | 5-15% | >15% (expensive, customers motivated to find alternatives) |
| 5 | Is capacity physically constrained? | Yes (physics, geology, IP, aerospace cert) | Yes (capex cycle, 2-3yr lead) | No (can scale quickly) |

### SpaceX-Specific Scoring Notes

- **Aerospace qualification** is extremely long (often 2-5 years) — this naturally inflates Q3 scores
- **Vertical integration risk** — SpaceX famously in-houses; if they *can* make it themselves, discount Q2
- **Confirmed vs. speculated supplier** — unconfirmed relationships should cap chokepoint score at 15 until verified
- **Launch cadence leverage** — suppliers benefit from both launch rate increases AND Starlink constellation growth

## 2. Financial Strength (25 points)

| Score | Criteria | Chokepoint Signal |
|-------|----------|-------------------|
| 21-25 | Gross margin >55%, strong FCF, low debt, ROIC >20% | **Pricing power confirmed** |
| 16-20 | Gross margin 40-55%, positive FCF, manageable debt | Good pricing power |
| 11-15 | Gross margin 30-40%, breakeven FCF, moderate debt | Some pricing power |
| 6-10  | Gross margin 20-30%, negative FCF, high leverage | Chokepoint without pricing power |
| 1-5   | Gross margin <20%, burning cash, overleveraged | Commodity economics |

## 3. Growth (20 points)

| Score | Criteria | SpaceX Signal |
|-------|----------|---------------|
| 17-20 | Revenue CAGR >20%, accelerating | Starlink ramp / launch cadence driving growth |
| 13-16 | Revenue CAGR 10-20%, steady | Healthy aerospace demand pull |
| 9-12  | Revenue CAGR 5-10%, mature but stable | Stable defense/aero, SpaceX is incremental |
| 5-8   | Revenue CAGR 0-5%, slow | SpaceX exposure too small to move needle |
| 1-4   | Declining revenue | Secular decline, SpaceX can't save it |

## 4. Valuation (15 points)

| Score | Criteria |
|-------|----------|
| 13-15 | Significantly undervalued vs chokepoint quality; market hasn't priced SpaceX exposure |
| 10-12 | Fairly valued; reasonable multiples given moat + growth |
| 7-9   | Fully valued; SpaceX narrative already priced in |
| 4-6   | Overvalued; priced beyond best-case SpaceX scenario |
| 1-3   | Extreme overvaluation |

## 5. Catalyst & Timing (10 points)

| Score | Criteria |
|-------|----------|
| 9-10  | SpaceX IPO filing imminent + confirmed supplier + revenue inflection |
| 7-8   | Concrete catalyst within 6-12 months (Starship operational, Starlink Gen2, IPO rumors) |
| 5-6   | Plausible catalyst but timing uncertain |
| 3-4   | Headwinds: SpaceX in-housing, competitor emerging |
| 1-2   | SpaceX relationship speculative or immaterial |

## Signal Adjustments

### Bullish
| Signal | Adjustment | How to Verify |
|--------|------------|---------------|
| Confirmed SpaceX supplier (IR/filing) | +3 | 10-K customer disclosure, IR confirmation |
| Insider cluster buying (3+ buys, 90 days) | +3 | SEC EDGAR Form 4 |
| Earnings beat + raised guidance | +2 | Earnings report |
| SpaceX IPO filing / S-1 | +3 | SEC EDGAR |
| Starlink subscriber inflection | +2 | SpaceX announcements |
| Launch cadence acceleration | +2 | Public launch manifests |

### Bearish
| Signal | Adjustment | How to Verify |
|--------|------------|---------------|
| SpaceX vertical integration announced | -5 | News, SpaceX job postings |
| Customer concentration >50% from SpaceX | -3 | 10-K filing |
| Unconfirmed supplier relationship | -3 | Cannot verify in filings |
| RSI > 70 (overbought) | -2 | Yahoo Finance |
| Geopolitical risk in manufacturing | -3 | Company filings |

## Verdict Thresholds

| Score | Verdict | Context |
|-------|---------|---------|
| 75+   | **BUY** | High chokepoint + reasonable valuation + catalyst |
| 55-74 | **HOLD / DD** | Promising but needs more verification or better entry |
| <55   | **AVOID** | Weak chokepoint, or speculative SpaceX link, or fatal flaw |

## SpaceX-Specific DD Checklist

Every report must address:
- [ ] Is the SpaceX supplier relationship **confirmed** (filing, IR, news) or **speculated**?
- [ ] What % of the company's revenue comes from SpaceX / aerospace?
- [ ] Could SpaceX realistically in-house this component?
- [ ] Is the TAM from SpaceX alone big enough to matter?
- [ ] Does the company benefit from *both* launch and Starlink, or just one?
- [ ] What happens to the thesis if SpaceX IPO is delayed 2+ years?

## Report Data Requirements (MANDATORY)

### 5-Year Historical Financials (FY2021-FY2025)
Every report must include a full 5-year table with:
Revenue, Revenue Growth %, Gross Margin %, Operating Margin %, EBITDA, EBITDA Margin %, Net Income, EPS, FCF, CapEx, Total Debt, Net Debt, Cash, Shares Outstanding.

For segment companies: also break out aerospace/space segment revenue + margins.

### 3-Year Forward Projections (FY2026E-FY2028E)
Revenue, EBITDA, EPS, FCF from analyst consensus or own model. Note source and # of analysts.

### Price Action
Current price, 52-week range, market cap, SMA(10), SMA(20), SMA(50), SMA(200), RSI(14), % off 52-week high, volume vs 20-day average.

### Latest IR / Earnings Call Review
Must review latest earnings call transcript + IR presentation for every profiled company. Document key quotes on SpaceX/satellite/space, capacity, guidance, risks.

### SpaceX Revenue Exposure %
For every confirmed supplier: $ amount, % of total revenue, % of relevant segment, confidence level, methodology, trajectory.
