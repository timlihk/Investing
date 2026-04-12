# Scoring Criteria — Chokepoint Edition

Total score out of 100, weighted across 5 dimensions + signal adjustments.

Scoring discipline:
- Score the 5 base dimensions first.
- Apply signal adjustments only after the base score is complete.
- Do not double-count the same fact in both `Catalyst & Timing` and `Signal Adjustments`.
- Label all inputs as `reported`, `guided`, or `estimated` in the report.
- Maintain the raw 5-question chokepoint inputs in `chokepoint_scores.tsv` so `chokepoint_score` is auditable and separable from the broader investment score.

## 1. Chokepoint Strength (30 points) — THE PRIMARY DIMENSION

This replaces generic "business quality." Score based on the 5-question chokepoint test:

| Chokepoint Score (out of 25) | Points | Tier |
|------------------------------|--------|------|
| 21-25 | 26-30 | **Monopoly Chokepoint** — only supplier, years to replicate, industry breaks without them |
| 16-20 | 20-25 | **Duopoly Chokepoint** — 2 suppliers, high switching costs, critical to chain |
| 11-15 | 14-19 | **Oligopoly with Moat** — 3-5 suppliers, leader has structural advantage |
| 6-10  | 7-13  | **Competitive with Differentiation** — many suppliers, some brand/IP moat |
| 1-5   | 1-6   | **Commodity** — easily substitutable, no structural advantage |

### The 5 Chokepoint Questions

| # | Question | 5 (strongest) | 3 (moderate) | 1 (weakest) |
|---|----------|---------------|--------------|-------------|
| 1 | What breaks if they stop shipping? | Entire downstream chain halts | Some products delayed | Minor inconvenience |
| 2 | How many alternatives exist? | 0-1 viable alternatives | 2-3 alternatives | 5+ alternatives |
| 3 | How long to qualify a replacement? | >2 years | 6-24 months | <6 months |
| 4 | What % of customer COGS? | <5% (cheap but critical) | 5-15% | >15% (expensive, customers motivated to find alternatives) |
| 5 | Is capacity physically constrained? | Yes (physics, geology, IP) | Yes (capex cycle, 2-3yr lead) | No (can scale quickly) |

**Key insight**: The best chokepoints are CHEAP but CRITICAL. A $2 component that holds up a $50,000 system gives the supplier enormous pricing power with zero customer motivation to redesign around it.

## 2. Financial Strength (25 points)

| Score | Criteria | Chokepoint Signal |
|-------|----------|-------------------|
| 21-25 | Gross margin >55%, strong FCF, low debt, ROIC >20% | **Pricing power confirmed** — the market validates the chokepoint |
| 16-20 | Gross margin 40-55%, positive FCF, manageable debt | Good pricing power, room to expand |
| 11-15 | Gross margin 30-40%, breakeven FCF, moderate debt | Some pricing power, watch trend |
| 6-10  | Gross margin 20-30%, negative FCF, high leverage | **Chokepoint without pricing power** — structural problem |
| 1-5   | Gross margin <20%, burning cash, overleveraged | Commodity economics despite market position |

**Gross margin is the single most important financial metric.** A true chokepoint should have >40% gross margins. If a company has monopoly market share but <30% gross margins, either the "chokepoint" is fake (customers have alternatives you missed) or management is leaving money on the table.

## 3. Growth (20 points)

| Score | Criteria | Chokepoint Signal |
|-------|----------|-------------------|
| 17-20 | Revenue CAGR >20%, accelerating, TAM expanding | Downstream chain growing = more tolls collected |
| 13-16 | Revenue CAGR 10-20%, steady growth | Healthy demand pull-through |
| 9-12  | Revenue CAGR 5-10%, mature but stable | Chokepoint in mature chain — still valuable if margins high |
| 5-8   | Revenue CAGR 0-5%, slow growth | Chain may be declining or chokepoint being bypassed |
| 1-4   | Declining revenue | Chokepoint is being disrupted — DANGER |

## 4. Valuation (15 points)

| Score | Criteria |
|-------|----------|
| 13-15 | Significantly undervalued vs chokepoint quality; market hasn't recognized the position |
| 10-12 | Fairly valued for a chokepoint; reasonable multiples given moat + growth |
| 7-9   | Fully valued; chokepoint recognized and priced in |
| 4-6   | Overvalued; priced beyond even the best-case chokepoint scenario |
| 1-3   | Extreme overvaluation; a good company is not a good stock at any price |

**Valuation context for chokepoints:**
- Monopoly chokepoints with >50% gross margins deserve premium multiples (20-35x earnings)
- But even the best chokepoint can be overpriced (see: LITE at 62x fwd P/E in the AI photonics research)
- The best entry point: a chokepoint where the market sees the RISK but misses the IRREPLACEABILITY

## 5. Catalyst & Timing (10 points)

| Score | Criteria |
|-------|----------|
| 9-10  | Clear demand or capacity inflection within 6 months, with evidence the market has not fully priced it |
| 7-8   | Concrete catalyst within 6-12 months (capacity expansion, new product cycle, regulatory approval, major design win) |
| 5-6   | Plausible catalyst but timing or impact is uncertain |
| 3-4   | Headwinds: demand softening, capacity coming online at competitors, unclear timing |
| 1-2   | Active demand destruction, technology displacement, regulatory threat to chokepoint |

## Signal Adjustments

These are narrow, mechanical overlays. If one is already materially embedded in the base score, do not apply it again here.

### Bullish
| Signal | Adjustment | How to Verify |
|--------|------------|---------------|
| Insider cluster buying (3+ buys, 90 days) | +3 | SEC EDGAR Form 4 |
| Earnings beat + raised guidance | +2 | News / earnings report |
| RSI < 30 (oversold) | +2 | Yahoo Finance / Twelve Data |
| StockTwits sentiment > 70% bullish | +1 | StockTwits API |
| Downstream customer capex guidance up | +2 | Customer earnings calls |

### Bearish
| Signal | Adjustment | How to Verify |
|--------|------------|---------------|
| RSI > 70 (overbought) | -2 | Yahoo Finance / Twelve Data |
| Customer concentration >50% from 1 customer | -3 | 10-K filing, earnings call |
| Manufacturing in geopolitically risky location | -3 | Company filings |
| StockTwits sentiment < 30% bullish | -1 | StockTwits API |
| Accounting red flags / restatements | -3 | SEC EDGAR / news |
| Under SEC/regulatory investigation | -5 | SEC EDGAR / news |
| Downstream customer cutting capex | -3 | Customer earnings calls |

### Flags (note in report, no auto-adjustment)
| Signal | Interpretation |
|--------|---------------|
| Unusual volume (>2x 20d avg) | Something is happening — investigate |
| Price >20% off 52wk high | Potential value or falling knife — depends on why |
| Competitor raising capacity | Chokepoint may loosen in 2-3 years — monitor |
| Customer vertical integration announced | Existential risk to chokepoint — deep research needed |

## Verdict Thresholds

| Score | Verdict | Chokepoint Context |
|-------|---------|-------------------|
| 75+   | **BUY** | High chokepoint strength + reasonable valuation + catalyst |
| 55-74 | **HOLD** | Good chokepoint but overvalued, or moderate chokepoint with ok value |
| <55   | **AVOID** | Weak chokepoint, or strong chokepoint with fatal flaw (execution, geopolitics, customer concentration) |

## Report Minimums

Every report should include:
- A `Source Trail` table with named sources and dates.
- An explicit `Score Breakdown` table that sums to the base score.
- A short explanation for every non-trivial estimate.
- A valuation method behind any stated price target.

## Self-Correction

After every 10 stocks:
- Do monopoly chokepoints (score 20+/25) outperform? If yes, weight chokepoint even higher
- Are valuation scores too generous? If BUYs are losing money, tighten the valuation dimension
- Does gross margin >50% predict positive returns? Track this correlation
- Update this file with learnings
