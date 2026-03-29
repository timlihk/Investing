# ON — ON Semiconductor (onsemi)
## Date: 2026-03-29
## Score: 27/100
## Chokepoint Tier: Commodity / Indirect

### Thesis
Confirmed via teardown: FDMS86182 power MOSFETs found on Starlink Rev 3 (V2) terminal power board. However, these are commodity power semiconductors with abundant alternatives from Infineon, Vishay, Nexperia, and others. onsemi is a large-cap analog/power semi company undergoing a strategic pivot toward SiC automotive, but Starlink is an afterthought in a $6B revenue base.

### SpaceX Relationship: CONFIRMED (teardown)
- **Source**: Oleg Kutkov teardown of Starlink Rev 3 (V2) power architecture (Dec 2024)
- **Part**: FDMS86182 — 100V N-channel MOSFET in SO-8 package
- **Function**: Power switching on terminal power board, 250 KHz switching frequency, 12V output
- **Volume**: Two MOSFETs per terminal. At ~2M terminals/year, ~4M units = ~$2-4M revenue
- **Catalog part**: Not co-designed, standard catalog component available from distributors

### Chokepoint Test

| Question | Score | Rationale |
|----------|-------|-----------|
| Breakage | 1 | Terminal production continues with trivial BOM swap. No disruption |
| Alternatives | 1 | 10+ viable MOSFET suppliers (Infineon, Vishay, Nexperia, TI, Toshiba, etc.) |
| Qualification | 2 | Consumer-grade terminal, not space-grade. Qualification <6 months |
| COGS | 1 | Sub-$1 part on a $400-600 terminal BOM. Irrelevant cost |
| Capacity | 1 | Massive global MOSFET capacity. No constraints |
| **Total** | **6/25** | |

### SpaceX Revenue Exposure

| Metric | Value | Confidence |
|--------|-------|------------|
| Estimated SpaceX Revenue | $2-4M/yr | Low-Medium |
| % of Total Revenue | <0.07% | Estimated |
| % of Power Solutions Segment | <0.1% | Estimated |
| Trajectory | Flat to declining (BOM cost pressure) | Estimated |

Methodology: ~2M Starlink terminals/year x 2 MOSFETs x $0.50-1.00 ASP. Immaterial by any measure.

### Price Action

| Metric | Value |
|--------|-------|
| Current Price | ~$63.10 |
| 52-Week Range | $31.04 - $73.76 |
| Market Cap | ~$24.9B |
| % Off 52-Week High | -14.5% |
| Analyst Consensus Target | $67.28 (12 Buy, 22 Hold) |

### 5-Year Historical Financials

| Metric | FY2021 | FY2022 | FY2023 | FY2024 | FY2025 |
|--------|--------|--------|--------|--------|--------|
| Revenue ($B) | 6.74 | 8.33 | 8.25 | 7.08 | 6.00 |
| Revenue Growth % | +28% | +24% | -1% | -14% | -15% |
| Gross Margin % | 38.3% | 48.5% | 47.3% | 45.1% | 38.4% |
| Operating Margin % | 20.5% | 32.8% | 31.5% | 26.1% | 16.1% |
| Net Income ($B) | 1.01 | 1.90 | 2.19 | 1.59 | 0.97 (est) |
| EPS | $2.30 | $4.26 | $4.89 | $3.66 | $2.30 (est) |
| FCF ($B) | 1.4 | 2.3 | 2.7 | 1.8 | 1.4 |

Note: Revenue and margins peaked in 2022-2023 semiconductor cycle. Now in cyclical downturn with strategic pivot to SiC/automotive.

### 3-Year Forward Projections

| Metric | FY2026E | FY2027E | FY2028E |
|--------|---------|---------|---------|
| Revenue ($B) | 6.0-6.3 | 6.5-7.0 | 7.0-7.5 |
| EPS | $2.40-2.70 | $3.00-3.50 | $3.50-4.00 |

Source: Q1 2026 guidance $1.44-1.54B implies ~$6B run rate. 24 analysts, consensus "Buy." Recovery driven by automotive SiC and AI data center, not Starlink.

### Latest IR / Earnings Call Review (Q4 2025)
- Revenue $1.53B, EPS $0.64 (beat by $0.02)
- Full year 2025: $6.0B revenue, 38.4% non-GAAP gross margin
- Record FCF of $1.4B (24% of revenue)
- **No mention of SpaceX or Starlink** in Q4 2025 call
- Launched "Treo Platform" for AI data center power
- Exiting $300M of non-core revenue in 2026 to focus on SiC/automotive
- Q1 2026 guidance: $1.44-1.54B revenue, first Y/Y growth since downturn

### Scoring

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Chokepoint Strength (30) | 6 | Commodity MOSFET, 10+ alternatives, zero switching cost |
| Financial Strength (25) | 13 | GM 38%, good FCF, but declining from peak |
| Growth (20) | 6 | Revenue declining 15% Y/Y, recovery nascent |
| Valuation (15) | 7 | ~26x forward PE, fair for cyclical semi in trough |
| Catalyst & Timing (10) | 2 | Zero SpaceX catalyst. SiC/auto story irrelevant to thesis |
| **Subtotal** | **34** | |
| Bearish: Commodity part, zero leverage | -3 | |
| Bearish: SpaceX <0.1% of revenue | -4 | |
| **Total** | **27/100** | |

### Risks
- **Irrelevance risk**: SpaceX exposure so small it literally does not matter
- Cyclical downturn in automotive/industrial continues
- SiC competition from Wolfspeed, Infineon, STM
- SpaceX actively reducing terminal BOM cost — may switch to cheaper MOSFETs

### Verdict: AVOID for Starlink
Confirmed supplier but completely irrelevant to investment thesis. Sub-$1 commodity MOSFET in a $25B company. Own onsemi for the SiC/automotive pivot, not for SpaceX.

**One-liner:** Confirmed but irrelevant — a fifty-cent MOSFET does not make a space thesis in a $25B semiconductor company.

### Source Trail
| Source | Date |
|--------|------|
| Oleg Kutkov Starlink Rev 3 Power Architecture Teardown | 2024-12 |
| onsemi Q4 2025 Earnings Call | 2026-02 |
| onsemi Q1 2026 Guidance | 2026-02 |
| MacroTrends ON Semiconductor Financials | 2026 |
| Yahoo Finance ON Price Data | 2026-03 |
