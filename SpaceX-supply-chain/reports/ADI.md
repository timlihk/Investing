# Analog Devices (ADI)

**Score: 27/100 | Chokepoint: 7/25 | Rating: HOLD (own merits), AVOID for Starlink**

## Thesis

ADI is a world-class analog/mixed-signal semiconductor company with premium margins and a recovering growth profile. The MAX16056 power supervisor IC is confirmed via teardown in Starlink Rev 3 terminals, but this is a sub-$1 commodity catalog part with abundant alternatives. SpaceX exposure is completely immaterial at <0.05% of revenue. Own ADI for its analog franchise, not for SpaceX.

## SpaceX Relationship: CONFIRMED (via teardown)

Confirmed via Oleg Kutkov's detailed teardown of the Starlink Rev 3 (V2) power architecture (Dec 2024):

- **MAX16056** -- ultra-low-current (125nA) microprocessor supervisory IC on the power board
- Used to soft-start the LM3751 voltage regulator after PoE power stabilizes
- Configured with a 229ms RESET delay via external resistors/capacitors
- Powered directly from the input PoE line via current-limiting resistors and 5V TL4050 shunt voltage reference

The MAX16056 is a standard catalog part (originally Maxim, now ADI post-acquisition). It monitors a single supply voltage and asserts active-low reset when VCC drops below threshold. This is a commodity function with dozens of equivalent parts from TI, Microchip, ON Semi, etc.

## Value Chain Position

| Attribute | Detail |
|-----------|--------|
| Component | MAX16056 power supervisor IC |
| Function | Voltage monitoring / reset control for power sequencing |
| Terminal Location | Power board (PoE input stage) |
| Tier | Tier 2 -- confirmed supplier |
| Relationship Type | Catalog purchase, no co-design |
| Acquired via | Maxim Integrated acquisition (Aug 2021, $21B) |

## Chokepoint Test: 7/25

| # | Question | Score | Rationale |
|---|----------|-------|-----------|
| 1 | What breaks if they stop shipping? | 2 | Minor inconvenience -- power supervisor easily replaced |
| 2 | How many alternatives exist? | 1 | 5+ alternatives (TI TPS386x, Microchip MCP130, ON Semi CAT811, etc.) |
| 3 | How long to qualify a replacement? | 2 | <6 months -- standard catalog part, minimal qualification |
| 4 | What % of customer COGS? | 1 | Sub-$1 part, negligible COGS impact |
| 5 | Is capacity physically constrained? | 1 | No -- standard CMOS, many fabs can produce |
| **Total** | | **7/25** | **Competitive / Linked** |

**Chokepoint Tier: Competitive / Linked** -- Standard catalog part with no switching costs and abundant alternatives.

## SpaceX Revenue Exposure

| Metric | Estimate | Confidence |
|--------|----------|------------|
| Estimated SpaceX $ | $1-5M | Low |
| % of Total Revenue | <0.05% | High confidence it's immaterial |
| % of Industrial Segment | <0.1% | Estimated |
| Methodology | BOM cost estimate x terminal volume |
| Trajectory | Flat -- catalog part, no content growth story |

At ~$0.50-1.00 per MAX16056 and ~2-4M terminals/year, SpaceX revenue contribution is roughly $1-4M against $11-13B total ADI revenue. Completely immaterial.

## Price Action

| Metric | Value |
|--------|-------|
| Current Price | ~$312 |
| 52-Week High | $363.20 |
| 52-Week Low | $158.65 |
| Market Cap | ~$150B |
| % Off 52-Week High | -14% |
| SMA(50) | ~$315 |
| SMA(200) | ~$329 |
| RSI(14) | ~40 (neutral-bearish) |
| Technical Signal | Below both 50-day and 200-day SMAs |

Stock has pulled back ~14% from February 2026 highs near $360. Trading below key moving averages with bearish technical signals.

## 5-Year Historical Financials

ADI fiscal year ends in late October/early November. FY2021 includes partial Maxim contribution (closed Aug 2021).

| Metric | FY2021 | FY2022 | FY2023 | FY2024 | FY2025 |
|--------|--------|--------|--------|--------|--------|
| Revenue ($B) | $7.32 | $12.01 | $12.31 | $9.43 | $11.02 |
| Revenue Growth % | +72%* | +64%* | +2.4% | -23.4% | +16.9% |
| Gross Margin % (GAAP) | ~62% | ~65% | ~67% | ~57% | ~64% |
| Gross Margin % (Non-GAAP) | ~68% | ~72% | ~73% | ~64% | ~69% |
| Operating Margin % (GAAP) | ~23% | ~28% | ~31% | ~22% | ~35% |
| Operating Margin % (Non-GAAP) | ~42% | ~50% | ~52% | ~41% | ~44% |
| Net Income ($B) | $1.39 | $2.75 | $3.31 | $1.64 | ~$3.8 |
| Diluted EPS | $2.61 | $5.26 | $6.42 | $6.38 | $7.79 |
| Free Cash Flow ($B) | ~$2.2 | ~$4.0 | ~$4.5 | ~$3.1 | $4.3 |
| FCF Margin % | ~30% | ~33% | ~37% | ~33% | ~39% |
| Operating Cash Flow ($B) | ~$2.8 | ~$4.6 | ~$5.2 | ~$3.9 | $4.8 |
| CapEx ($B) | ~$0.6 | ~$0.6 | ~$0.7 | ~$0.8 | ~$0.5 |
| Total Debt ($B) | ~$6.5 | ~$6.5 | ~$6.7 | ~$8.2 | ~$8.7 |
| Net Debt ($B) | ~$5.0 | ~$4.5 | ~$4.5 | ~$6.5 | ~$5.2 |
| Cash ($B) | ~$1.5 | ~$2.0 | ~$2.2 | ~$1.7 | ~$3.5 |
| Shares Outstanding (M) | ~530 | ~520 | ~500 | ~497 | ~495 |

*FY2021 and FY2022 growth rates reflect Maxim acquisition (closed Aug 2021). Organic growth was ~20-25%.

Sources: ADI investor relations, SEC filings, MacroTrends. Some figures are estimated/rounded.

## 3-Year Forward Projections

| Metric | FY2026E | FY2027E | FY2028E |
|--------|---------|---------|---------|
| Revenue ($B) | $13.0-13.5 | $14.5-15.0 | $15.5-16.5 |
| Revenue Growth % | +18-22% | +10-12% | +7-10% |
| Adj. EPS | ~$11.40 | ~$13.00 | ~$14.50 |
| Free Cash Flow ($B) | ~$5.3 | ~$6.0 | ~$6.5 |
| Adj. Operating Margin % | ~47-48% | ~48-50% | ~49-51% |

Source: Wall Street consensus (~32 analysts). Mean price target $385 (21 Buy, 7 Outperform, 7 Hold). Q2 FY2026 guided to $3.5B revenue (+/- $100M) and adj. EPS of $2.88 (+/- $0.15), well above prior consensus.

## Latest IR / Earnings Call Highlights

**Q1 FY2026 (Feb 18, 2026):**

- Revenue $3.16B, up 30% YoY and 3% QoQ, near high end of guidance
- Non-GAAP EPS $2.46 vs. $2.33 consensus (beat by $0.13)
- **Aerospace & Defense:** New records. A&D now >$1B annualized run rate (>10% of revenue), grew "strong double digits" in FY2025 and continuing in FY2026
- A&D growth driven by Hittite acquisition RF/microwave portfolio for defense systems and satellite communications
- Company expects "further growth" in A&D driven by sensor, mixed-signal, and power solutions
- Mentioned "increasingly strong opportunity pipeline" in LEO satellite market
- Industrial up 38% YoY, Communications up 63% YoY (data center + wireless)
- Q2 FY2026 guided well above consensus: $3.5B revenue, $2.88 EPS
- 11% dividend increase announced
- $4.1B returned to shareholders in FY2025 (dividends + buybacks)

**Key quote on space:** ADI expects to "maintain strong presence in the growing low Earth orbit satellite market" -- but no specific SpaceX mention. The A&D commentary is broadly about defense primes and satellite communications, not specifically about Starlink power supervisor ICs.

## Supply Chain Map

```
SpaceX Starlink Rev 3 Terminal -- Power Board
    |
    +-- PoE Input Stage
    |     |
    |     +-- TL4050 Shunt Voltage Reference (TI)
    |     +-- MAX16056 Power Supervisor (ADI/Maxim) <-- THIS REPORT
    |     +-- LM3751 Voltage Regulator (controlled by MAX16056)
    |     +-- DC/DC Converters (TI, others)
    |
    +-- Main Board
          +-- Custom ASIC (SpaceX)
          +-- RF Beamforming ICs (STM)
          +-- Power Management ICs (MPS, others)
          +-- Memory, passives, connectors
```

ADI's MAX16056 sits on the power input stage -- a commodity position in the bill of materials. The critical/high-value components are the custom ASIC and STM RF chips on the main board.

## Moat Analysis

| Moat Factor | Rating | Notes |
|-------------|--------|-------|
| Analog IP Portfolio | Very Strong | 75,000+ products, decades of analog design expertise |
| Customer Switching Costs | Strong | Sticky in industrial/auto design cycles (NOT in Starlink context) |
| Scale Economics | Strong | $11B+ revenue, industry-leading R&D efficiency |
| Pricing Power | Strong | Non-GAAP GM ~69%, premium analog margins |
| Maxim Synergies | Moderate | Integration expanding power/automotive portfolio |
| SpaceX-Specific Moat | None | Catalog part, zero switching costs |

ADI has an exceptional analog semiconductor moat -- but none of it applies to the Starlink relationship. The MAX16056 is a generic supervisory IC that any competitor can replace.

## Catalysts

**Bullish (company-level, NOT SpaceX-related):**
- Broad-based analog recovery after FY2024 inventory correction
- Data center / AI power management growing rapidly (Communications +63% YoY)
- A&D segment at record levels, >$1B run rate
- Q2 FY2026 guidance well above consensus signals accelerating demand
- FCF generation supports growing dividend + buybacks

**Bearish:**
- SpaceX exposure is completely immaterial (<0.05%)
- No pricing power or content growth in Starlink
- Stock trades at ~27x forward EPS -- premium valuation
- Below 50-day and 200-day SMAs; bearish technical setup
- $8.7B total debt from Maxim acquisition

## Risks

| Risk | Impact | Probability |
|------|--------|-------------|
| SpaceX switches to alternative supervisor IC | Zero impact on ADI | Moderate |
| Analog cycle downturn (inventory correction repeat) | High -- FY2024 showed -23% revenue decline | Low near-term |
| China/trade exposure | Moderate -- significant Asia revenue | Moderate |
| Automotive slowdown | Moderate -- 25% of revenue | Low-Moderate |
| Interest rate / debt service | Low -- manageable at 1.1x net debt/EBITDA | Low |

## Scoring

| Dimension | Score | Max | Rationale |
|-----------|-------|-----|-----------|
| Chokepoint Strength | 8 | 30 | 7/25 chokepoint = Competitive/Linked tier. Catalog part, zero switching costs. |
| Financial Strength | 9 | 25 | Premium analog margins (~69% non-GAAP GM), strong FCF ($4.3B), but high debt. Score limited by SpaceX irrelevance. |
| Growth | 5 | 20 | Company growing well (+17-30% YoY), but SpaceX exposure too small to matter. |
| Valuation | 4 | 15 | ~27x forward EPS is full. SpaceX narrative is zero -- no hidden value. |
| Catalyst & Timing | 1 | 10 | SpaceX relationship is confirmed but completely immaterial. No catalyst. |
| **Total** | **27** | **100** | |

**Signal Adjustments:** +0 (confirmed supplier status doesn't help when exposure is <0.05%)

## Verdict: HOLD (own merits), AVOID for Starlink

**Score: 27/100**

ADI is an outstanding analog semiconductor franchise with premium margins, accelerating growth, and a strong competitive position across industrial, automotive, and communications markets. The A&D segment is at record levels and the data center opportunity is compelling.

However, as a SpaceX supply chain investment, ADI scores poorly. The MAX16056 power supervisor is a sub-$1 commodity catalog part with zero switching costs and abundant alternatives. SpaceX revenue is estimated at $1-5M out of $11B+ total revenue -- less than 0.05%. Even if Starlink terminal volumes tripled, it would remain a rounding error.

**Bottom line:** Great company, immaterial SpaceX exposure. If you own ADI, own it for the analog recovery and AI/data center power story -- not Starlink.

**One-liner:** World-class analog franchise with a confirmed but invisible Starlink footprint -- own the company, ignore the SpaceX angle.
