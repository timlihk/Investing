# IFX.DE — Infineon Technologies AG
## Date: 2026-03-29
## Score: 30/100
## SpaceX Chokepoint Tier: Commodity
## Rating: AVOID | Target: N/A | Upside: N/A

### Thesis (2-3 sentences)

Infineon is a confirmed Starlink supplier via teardown-identified FDMS86182 power MOSFETs in the user terminal power supply, but this is a commodity relationship with zero switching costs. SpaceX exposure is estimated at <$10M out of ~€15B in revenue (<0.1%) — completely immaterial. Infineon is a world-class power semiconductor company worth owning for automotive/AI data center themes, but not as a SpaceX play.

### SpaceX Relationship: CONFIRMED (Tier 2 — Teardown)

FDMS86182 N-channel power MOSFETs identified in Starlink Rev 3 (V2) user terminal power supply via independent teardown analysis. MOSFETs operate in buck converter configuration (250 KHz switching, 11.8-12V output). These are standard catalog parts — not custom-designed for SpaceX.

**Evidence:** TechInsights teardown of SpaceX Starlink Internet Kit; Oleg Kutkov Starlink Rev 3 power architecture teardown (Dec 2024).

### Value Chain Position

```
Semiconductors → Power Supply → User Terminal → Starlink Ground Segment
    ↓                ↓              ↓                  ↓
 Infineon (MOSFET)  PSU Board    SpaceX Dish      End Users
```

- **Layer:** Power semiconductors (MOSFET) in Starlink user terminal power supply
- **Program:** Starlink user terminals only (not satellites, not launch hardware)
- **Role:** Commodity power switching component — one of many on the power board
- **In-housing risk:** Low for MOSFETs specifically (SpaceX designs ASICs, not power discretes), but SpaceX could swap to any competitor's MOSFET trivially

### Chokepoint Test (5 questions, scored 1-5)

| # | Question | Score | Rationale |
|---|----------|-------|-----------|
| 1 | What breaks if they stop shipping? | 1 | Minor inconvenience — dozens of pin-compatible alternatives exist |
| 2 | How many alternatives exist? | 1 | 5+ direct alternatives: TI, ON Semi, STMicro, Vishay, Nexperia, Alpha & Omega |
| 3 | How long to qualify a replacement? | 2 | <6 months — standard power MOSFET, no aerospace qualification needed for user terminals |
| 4 | What % of customer COGS? | 2 | Sub-$1 parts per terminal — negligible % of terminal BOM (~$200-300) |
| 5 | Is capacity physically constrained? | 1 | No — commodity MOSFET fab capacity is abundant globally |

**Chokepoint Score: 7/25 → Commodity tier (7-13 points allocated → 8/30)**

### SpaceX Revenue Exposure %

| Metric | Estimate |
|--------|----------|
| SpaceX revenue (annual) | ~$5-10M (estimated) |
| % of total revenue | <0.1% |
| % of relevant segment (PSS) | <0.2% |
| Confidence level | Low-Medium |
| Methodology | ~2-3M terminals/year × ~$1-3 MOSFET content per terminal |
| Trajectory | Stable (grows with terminal volume, but ASPs declining) |

### Price Action

| Metric | Value |
|--------|-------|
| Current Price | €37.43 |
| 52-Week High | €48.23 |
| 52-Week Low | €23.17 |
| Market Cap | ~€49B (~$53B) |
| SMA(10) | €38.66 |
| SMA(20) | €40.01 |
| SMA(50) | €41.94 |
| SMA(200) | €37.01 |
| RSI(14) | 44.3 |
| % Off 52-Week High | -22.4% |
| Volume vs 20d Avg | 103% (neutral) |
| Shares Outstanding | ~1.30B |

Price is sitting near the 200-day SMA, well off highs. RSI neutral — no overbought/oversold signal.

### 5-Year Historical Financials

Infineon fiscal year ends September 30. All figures in EUR millions unless noted.

| Metric | FY2021 | FY2022 | FY2023 | FY2024 | FY2025 |
|--------|--------|--------|--------|--------|--------|
| Revenue | 11,060 | 14,218 | 16,309 | 14,955 | 14,662 |
| Revenue Growth % | +28.6% | +28.6% | +14.7% | -8.3% | -2.0% |
| Gross Profit (est.) | 4,090 | 5,830 | 7,240 | 6,370 | 6,190 |
| Gross Margin % | ~37.0% | ~41.0% | ~44.4% | ~42.6% | ~42.2% |
| Segment Result | 1,720 | 3,378 | 4,399 | 2,821 | 2,560 |
| Segment Result Margin % | 15.6% | 23.8% | 27.0% | 18.9% | 17.5% |
| EBITDA (est.) | 3,200 | 4,800 | 5,900 | 4,500 | 4,300 |
| EBITDA Margin % | ~29% | ~34% | ~36% | ~30% | ~29% |
| Net Income | 1,170 | 2,150 | 3,108 | 1,272 | 997 |
| EPS (diluted, €) | 0.90 | 1.65 | 2.39 | 0.97 | 0.77 |
| Adj. EPS (€) | 1.22 | 2.17 | 2.90 | 1.66 | 1.39 |
| Free Cash Flow | 1,200 | 1,500 | 1,400 | 380 | -1,051 |
| Adj. Free Cash Flow | — | — | — | — | 1,803 |
| CapEx | ~1,600 | ~2,400 | ~3,200 | ~3,000 | ~2,800 |
| Total Debt | ~5,500 | ~6,000 | ~6,500 | ~6,800 | ~6,800 |
| Net Debt | ~2,500 | ~3,000 | ~3,500 | ~4,300 | ~4,700 |
| Cash & Equivalents | ~3,000 | ~3,000 | ~3,000 | ~2,500 | ~2,100 |
| Shares Outstanding (M) | 1,303 | 1,303 | 1,304 | 1,305 | 1,306 |

**Segment Revenue Breakdown (FY2025):**
- Automotive (ATV): ~€8.4B (~57% of revenue) — #1 globally in automotive semiconductors
- Green Industrial Power (GIP): ~€2.1B (~14%)
- Power & Sensor Systems (PSS): ~€2.8B (~19%) — where Starlink MOSFETs sit
- Connected Secure Systems (CSS): ~€1.4B (~10%)

*Note: FY2025 reported FCF was negative due to Marvell Automotive Ethernet acquisition. Adjusted FCF of €1.8B strips out M&A. Historical financials compiled from Infineon press releases, annual reports, and MacroTrends data. Some figures are estimates where exact EUR breakdowns were not directly available.*

### 3-Year Forward Projections

| Metric | FY2026E | FY2027E | FY2028E |
|--------|---------|---------|---------|
| Revenue (€B) | 15.5-16.4 | 17.0-18.0 | 18.5-19.5 |
| Revenue Growth % | +6-12% | +8-10% | +8-9% |
| Segment Result Margin % | ~18-19% | ~20-22% | ~22-24% |
| EBITDA (€B) | ~4.6 | ~5.3 | ~5.8 |
| Adj. EPS (€) | ~1.61 | ~2.00 | ~2.30 |
| FCF (€B) | ~1.0-1.4 | ~1.8-2.2 | ~2.2-2.6 |
| Analyst Consensus PT | €49.30 (avg), €40-65 range | — | — |
| Number of Analysts | 24 (21 Buy, 3 Hold, 0 Sell) | — | — |

**Sources:** Q1 FY2026 earnings call (Feb 2026), company guidance (moderate revenue growth FY2026), analyst consensus (Yahoo Finance, TipRanks, MarketScreener). AI data center revenue target: €1.5B FY2026, €2.5B FY2027. FY2026 CapEx guided at €2.7B (includes €500M accelerated AI investment).

### Latest IR / Earnings Call Highlights

**Q1 FY2026 Results (Feb 4, 2026):**
- Revenue €3,662M, +7% YoY (+14% currency-adjusted)
- Segment result margin 17.9%; adjusted gross margin 43%
- Order backlog increased by €1B to €21B
- Q2 FY2026 guided at ~€3.8B revenue
- Full-year FY2026: moderate revenue growth reaffirmed
- Adjusted FCF guidance revised to ~€1.4B (from €1.6B) due to accelerated AI capex

**Key Strategic Themes:**
- **AI Data Centers:** Primary growth engine. Targeting €1.5B AI-related revenue in FY2026, €2.5B in FY2027 (10x increase over 3 years). Dresden smart power fab opening summer 2026.
- **Automotive:** Still 57% of revenue. Growth modest — customers ordering short-term, cautious. Focus shifting to silicon carbide, 48V architectures, software-defined vehicles. +4% YoY in Q1 (10% at constant FX).
- **Space/Satellite/Starlink:** No mentions whatsoever in Q1 FY2026 earnings call, investor presentation, or press release. Zero management commentary on space or satellite markets.
- **ams OSRAM acquisition:** €570M sensor business acquisition, fully debt-financed.

### Supply Chain Map

```
Upstream:
  Silicon wafers (Siltronic, SUMCO, Shin-Etsu)
  → Infineon fabs (Dresden, Villach, Kulim)
  → MOSFET/IGBT/SiC power devices

Company: Infineon Technologies AG
  - Global #1 in power semiconductors
  - Global #1 in automotive semiconductors
  - Key products: MOSFETs, IGBTs, SiC devices, MCUs, sensors

Downstream:
  → Automotive OEMs (50%+ of revenue)
  → Industrial / AI data centers (growing rapidly)
  → Consumer electronics / IoT
  → SpaceX Starlink terminals (immaterial, <0.1%)
```

**Competitors (for power MOSFETs):** Texas Instruments, ON Semiconductor, STMicroelectronics, Vishay, Nexperia, Renesas, Alpha & Omega, Rohm. Highly competitive market with 10+ qualified suppliers.

### Moat Analysis

Infineon has a strong moat in aggregate — #1 market share in power semiconductors, automotive semis, and automotive MCUs. However, the moat is NOT relevant to the SpaceX thesis:

- **For SpaceX:** The FDMS MOSFETs used in Starlink are commodity catalog parts. Zero switching cost, zero co-design, zero lock-in. Any power MOSFET manufacturer can supply equivalent parts.
- **For the broader business:** Strong moat in automotive (design wins locked in for 5-7 year vehicle platforms), SiC technology leadership, massive fab scale. But this is an automotive/industrial semiconductor thesis, not a space thesis.

### Catalysts

1. **AI data center ramp** — €1.5B FY2026, €2.5B FY2027 (THIS is the real growth story)
2. **Automotive recovery** — if European/Chinese auto production inflects
3. **Dresden fab opening** — summer 2026, adds smart power capacity
4. **SiC adoption** — structural shift in EV powertrains benefits Infineon's leadership position
5. **SpaceX IPO** — minimal impact given immaterial exposure; no narrative bid expected

### Risks

1. **Automotive cyclicality** — 57% of revenue tied to auto production, which is currently weak
2. **China competition** — Chinese power semiconductor fabs ramping capacity aggressively
3. **Heavy capex cycle** — €2.7B FY2026 investment depresses near-term FCF
4. **Euro/USD exposure** — strong EUR headwind (Q1 FY2026 growth was 7% reported vs 14% constant currency)
5. **Vertical integration risk (SpaceX):** Irrelevant — SpaceX would never in-house commodity MOSFETs, but they could trivially switch to another supplier
6. **No SpaceX narrative value:** Company does not mention SpaceX or space in any investor materials

### Valuation (Brief — score <55, no detailed valuation required)

| Metric | Value |
|--------|-------|
| P/E (TTM, IFRS) | ~49x |
| P/E (Adj. TTM) | ~27x |
| P/E (FY2026E Adj.) | ~23x |
| EV/EBITDA (TTM) | ~12.5x |
| EV/Revenue | ~3.5x |
| P/B | ~2.5x |
| Dividend Yield | ~0.9% |

Valuation is fair-to-rich for a cyclical semi. 23x forward adj. P/E is reasonable for a #1 power semi franchise with AI data center optionality, but expensive if the auto cycle disappoints. Not cheap enough to buy for SpaceX exposure that doesn't exist in any meaningful way.

### Scoring Breakdown

| Dimension | Score | Max | Rationale |
|-----------|-------|-----|-----------|
| Chokepoint Strength | 8 | 30 | Commodity MOSFET, 5+ alternatives, zero switching cost |
| Financial Strength | 16 | 25 | ~42% GM, positive adj. FCF, manageable debt, good ROIC |
| Growth | 7 | 20 | Revenue CAGR ~2% over 5 years; auto-dependent, AI helps |
| Valuation | 8 | 15 | Fair at 23x fwd P/E for quality franchise |
| Catalyst & Timing | 2 | 10 | SpaceX relationship immaterial; no space narrative |
| **Signal: Confirmed supplier** | **-1** | — | Confirmed but so immaterial it adds no value |
| **TOTAL** | **30** | **100** | |

*Signal adjustment: +3 for confirmed supplier, but -4 because SpaceX exposure is <0.1% and company never mentions it — net -1.*

### Verdict & One-liner

**AVOID** as a SpaceX supply chain play. Confirmed but completely immaterial — commodity MOSFETs worth <$10M in a €15B company.

Infineon is a high-quality power semiconductor leader worth researching for automotive electrification and AI data center themes, but it has zero SpaceX investment relevance.

**One-liner:** Confirmed commodity MOSFET in Starlink terminal power supply — sub-$10M exposure in a €49B market cap company. Not a SpaceX play.

### Source Trail

- TechInsights Starlink Internet Kit Teardown — Electronics360 (confirmed FDMS MOSFETs)
- Oleg Kutkov, "Starlink Rev 3 (V2) Power Architecture" blog post (Dec 2024) — FDMS86182 identification
- Infineon Q1 FY2026 Earnings Call Transcript (Feb 4, 2026) — via Investing.com
- Infineon FY2025 Annual Results Press Release (Nov 2025) — infineon.com
- Infineon Q4 FY2025 Investor Presentation (Nov 2025) — infineon.com
- Infineon Financial Data 2021-2025 — infineon.com investor relations
- Yahoo Finance IFX.DE — price data, analyst estimates (Mar 2026)
- TipRanks / MarketScreener — analyst consensus (24 analysts, avg PT €49.30)
- MacroTrends IFNNY — historical revenue, net income data
- CompaniesMarketCap — revenue history
