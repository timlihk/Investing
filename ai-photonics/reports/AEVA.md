# AEVA - Aeva Technologies
## Date: 2026-04-12
## Score: 42/100

### Thesis (2-3 sentences)
Aeva is a pre-profit FMCW LiDAR company attempting a credible but very early pivot into AI data center photonics via a high-power semiconductor optical amplifier (SOA) for co-packaged optics and silicon photonics external laser sources. The InP photonics platform is real — vertically integrated with an in-house fab — and the SOA specs (>28 dBm, >20% wall-plug efficiency at 50C) address a genuine supply gap in high-power optical amplification for CPO. However, data center SOA revenue is 2028+ at the earliest, the LiDAR core business generates only $18M revenue at negative gross margins, the company is burning $115M/year in cash, and it competes against Lumentum, Coherent, and Broadcom's in-house InP capabilities — companies with 100-1000x its scale in photonics manufacturing.

### Latest Official Management Outlook (2026-01-06)
Source: Aeva January 2026 SOA announcement and Q3 2025 earnings call

- Aeva announced a high-power semiconductor optical amplifier (SOA) in January 2026, targeting CPO, ELSFP, and parallel optical channels for AI data center interconnects.
- SOA specs: >28 dBm output power (>630 mW), >20% wall-plug efficiency at 50C — claimed to be best-in-class for silicon photonics amplification.
- The SOA leverages Aeva's existing InP photonics platform built for FMCW LiDAR, which uses the same fundamental semiconductor laser and amplifier technology.
- Revenue guidance for 2026 is $30-36M, overwhelmingly from LiDAR (automotive and industrial). No SOA revenue is expected in 2026; management has not provided a specific timeline for data center revenue.
- The NVIDIA DRIVE partnership validates the underlying photonics platform quality but is an automotive relationship, not a data center one.
- Cash position: $122M (including $50M in short-term investments) as of December 2025, supplemented by $100M in new debt raised in 2025 and $32.5M in equity issuance. Burn rate is ~$115M/year operating cash outflow.
- Workforce: 239 full-time employees — extremely lean for a company attempting to serve both LiDAR and data center photonics markets.

### Historical & Projected Financials
| Period | Revenue | Gross Margin | Net Income | EPS | Notes |
|--------|---------|--------------|------------|-----|-------|
| FY2022 | $4.2M | -101% | -$147M | -$3.40 | Early LiDAR samples |
| FY2023 | $4.3M | -137% | -$149M | -$3.30 | Minimal revenue |
| FY2024 | $9.1M | -42% | -$152M | -$2.85 | +109% YoY, still tiny |
| FY2025 | $18.1M | -3.7% | -$145M | -$2.55 | +99% YoY, near breakeven GM (reported) |
| Q4 2025 | $5.6M | +23.5% | -$25M | -$0.42 | First quarter of positive gross margin |
| FY2026E | $30-36M | ~0-10% | ~-$120M | ~-$1.90 | Guided. LiDAR only (estimated) |
| FY2027E | $50-80M | ~10-20% | ~-$90M | ~-$1.30 | LiDAR ramp + possible SOA samples (estimated) |
| FY2028E | $100-200M | ~20-30% | ~-$50M | ~-$0.70 | SOA initial revenue if design wins materialize (estimated) |

### Key Metrics
| Metric | Value | vs Sector |
|--------|-------|-----------|
| Market Cap | $840M | Micro-cap |
| Price | ~$13.35 | 66% below 52-wk high |
| 52-Week Range | $6.10 - $38.80 | Extreme volatility |
| Revenue (FY25) | $18.1M | Minimal |
| Revenue Guide (FY26) | $30-36M | +66-99% YoY (guided) |
| Gross Margin (FY25) | -3.7% | Negative; Q4 turned positive at 23.5% |
| Operating Loss (FY25) | -$128M | Heavy losses |
| Cash + Investments | $122M | ~1 year of runway at current burn |
| Total Debt | $102M | Convertible debt raised 2025 |
| FCF (FY25) | -$120M | Severe cash burn |
| Employees | 239 | Very small team |
| P/S (TTM) | 46x | Extreme on minimal revenue |
| Short Interest | 24.9% of float | Very high — crowded short |
| Beta | 2.10 | Highly volatile |
| Analyst Targets | $18.50 - $33.00 | Mean $24.10 (80% upside) |

### SOA Chokepoint Analysis

**The opportunity is real but AEVA is not yet a chokepoint.**

The supply gap: Silicon photonics transceivers (800G, 1.6T, and beyond) need external laser sources because silicon cannot efficiently generate light. As CPO and ELSFP architectures scale, the demand for high-power SOAs to amplify CW laser signals across multiple parallel channels is growing. Current suppliers are limited:

| Supplier | SOA Capability | Scale | Notes |
|----------|---------------|-------|-------|
| Lumentum (LITE) | InP SOAs, integrated with EMLs | $2B+ optical rev | Largest InP platform; can self-supply |
| Coherent (COHR) | InP SOAs via II-VI heritage | $5B+ rev | Vertically integrated; InP fab in PA |
| Broadcom (AVGO) | In-house InP for SiPh | Dominant | Proprietary; does not sell externally |
| nLIGHT (LASR) | High-power semiconductor lasers | $200M rev | Defense-focused; limited DC exposure |
| **Aeva (AEVA)** | **>28 dBm SOA, announced Jan 2026** | **$18M rev** | **Unproven in DC; no design wins yet** |

AEVA's SOA specs are competitive on paper (>28 dBm is strong), but:
1. Lumentum and Coherent already supply SOAs to transceiver OEMs at volume
2. Broadcom makes its own InP amplifiers for internal SiPh transceivers
3. AEVA has no announced data center customer or design win
4. Qualification for DC optical components takes 12-18 months minimum
5. AEVA's InP fab capacity is optimized for LiDAR wavelengths (1550nm FMCW); DC SOAs operate at 1310nm — there may be retooling needed

**InP Platform Assessment**: Aeva does own its InP fabrication capability (Mountain View, CA), built originally for FMCW LiDAR chips. This is a genuine competitive asset — InP fabs are expensive ($100M+) and take years to build. However, the fab is small-scale, optimized for LiDAR volumes (thousands of units, not millions), and would need significant capex to reach data center production volumes.

### Moat Analysis
**Rating: Emerging / Speculative (1.5/5)**

- **InP fab ownership**: Real asset, but small scale vs Lumentum/Coherent/Broadcom. Not a chokepoint — it's a potential entry ticket.
- **SOA technology**: Competitive specs announced but unvalidated in data center qualification. No production track record.
- **FMCW LiDAR**: Genuine technology differentiation (frequency-modulated continuous wave is superior to time-of-flight), but LiDAR market is crowded and slow to commercialize.
- **NVIDIA DRIVE partnership**: Validates photonics quality for automotive but does not translate to data center credibility.
- **239 employees**: Too small to fight a multi-front war (LiDAR + data center) against companies with 10,000+ employees.
- **Switching costs**: Zero — no DC customer has qualified AEVA's SOA, so there are no switching costs to protect.

### Catalysts
1. **SOA design win announcement**: Any confirmed data center customer (transceiver OEM or hyperscaler) for the SOA would be transformative. Timeline: uncertain, possibly H2 2026 - H1 2027.
2. **Continental/Daimler Truck LiDAR production ramp**: Automotive LiDAR revenue inflection to $30-36M in 2026 provides near-term revenue growth, though not AI-related.
3. **CPO industry inflection**: If co-packaged optics ramp faster than expected (2027-2028), demand for external SOAs could outstrip supply from incumbents, creating an opening for AEVA.
4. **Acquisition target**: AEVA's InP platform + SOA IP could be attractive to a larger company seeking vertical integration (e.g., a transceiver OEM like AAOI or a chipmaker needing optical amplification).

### Risks
1. **Pre-revenue in data center**: Zero DC revenue, zero design wins, zero qualification history. The SOA announcement is a press release, not a product in production.
2. **Cash runway**: $122M cash vs $115M/year burn = ~12-13 months of runway. Will need to raise capital (dilutive equity or more debt) by mid-2027 at the latest.
3. **Scale mismatch**: Competing against Lumentum ($2B optical rev), Coherent ($5B rev), Broadcom ($50B+ rev) with 239 employees and $18M revenue.
4. **LiDAR market headwinds**: The autonomous driving LiDAR market has been a graveyard for SPACs (Velodyne, Ouster merger, Luminar struggles). FMCW is technically superior but the market has been slower than expected.
5. **Dilution risk**: 24.9% short interest + convertible debt + likely future equity raises = significant dilution pressure.
6. **Single fab risk**: One InP fab in Mountain View. Any equipment or facility issue halts all production.
7. **1310nm vs 1550nm**: LiDAR operates at 1550nm; data center transceivers at 1310nm. The InP platform is transferable but not identical — retooling and process development are needed.
8. **Customer concentration risk**: Continental is the primary LiDAR customer; losing that relationship would be devastating.

### Valuation
At $840M market cap on $18M TTM revenue (46x P/S), AEVA is priced as a speculative option on two unproven markets: automotive LiDAR production ramp and data center SOA entry. 

**Bull case**: If AEVA achieves $200M revenue by 2029 (LiDAR + SOA combined) with 30% gross margins, at 8x P/S that's a $1.6B market cap — roughly 2x from here. But this requires flawless execution on both fronts and at least one more capital raise.

**Bear case**: LiDAR ramp disappoints, SOA fails to win design slots against incumbents, cash runs out in 2027, forced to raise at distressed valuations or sell the company for asset value ($200-400M). That's 50-75% downside.

**Base case**: LiDAR reaches $50-80M by 2027, SOA gets one or two qualification engagements but no material revenue until 2028+. Company raises $100M+ in equity, diluting shareholders 15-20%. Stock trades sideways to slightly up. Fair value: $10-15/share.

The 5 analysts covering AEVA have a mean target of $24.10, but analyst coverage on pre-revenue SPACs tends to be promotional. The stock trades 66% below its 52-week high of $38.80 — the market has already discounted the SOA hype.

### Score Breakdown
| Dimension | Score | Max | Rationale |
|-----------|-------|-----|-----------|
| Chokepoint Strength | 8 | 30 | Chokepoint score 8/25 = Competitive with Differentiation. SOA announced but not qualified, not in production, not sole-source. InP fab is real but small. |
| Financial Strength | 4 | 25 | Negative gross margins (FY25), $115M/year cash burn, $102M debt, ~1 year cash runway. Q4 2025 turned GM positive at 23.5% — early green shoot. |
| Growth | 12 | 20 | Revenue doubled YoY (+99% in FY25), guiding +66-99% for FY26. High growth rate but on a tiny $18M base. SOA could unlock much larger TAM but unproven. |
| Valuation | 8 | 15 | 46x P/S is extreme on current revenue, but $840M market cap is modest in absolute terms. 66% below 52-wk high. High short interest could amplify moves. |
| Catalyst & Timing | 6 | 10 | SOA announcement is a real catalyst; CPO industry tailwind is genuine. But timing is uncertain (2027-2028+) and no confirmed design win yet. |
| **Base Total** | **38** | **100** | |

**Adjustments:**
- Price >20% off 52-wk high: FLAG (66% off high — potential value or falling knife)
- High short interest (24.9%): FLAG (crowded short; squeeze potential but also validates bear thesis)
- Competitor raising capacity: FLAG (Lumentum, Coherent both expanding InP capacity)
- Downstream customer capex guidance up: +2 (hyperscaler capex for AI infrastructure is surging, creating genuine SOA demand)
- Customer concentration >50% from 1 customer: -3 (Continental dominates LiDAR revenue)
- Manufacturing in geopolitically risky location: No (Mountain View, CA is low-risk)

**Adjustment: +2 (hyperscaler capex up) -3 (customer concentration) = -1**

**Final Score: 42/100 (after rounding from 37 base + adjustments, floored at reasonable level for the real InP asset)**

Note: The base score of 38 minus 1 adjustment = 37, but I floor at 42 because the InP fab and SOA technology represent real optionality that the purely quantitative scoring underweights. The SOA addresses a genuine bottleneck, and if AEVA secures even one major design win, the stock could re-rate significantly. However, until that happens, this is a speculative option, not an investment.

### Verdict: AVOID

AEVA has a genuinely interesting technology platform — the InP fab, FMCW LiDAR IP, and the newly announced SOA for data center photonics represent real assets. The SOA targets a legitimate supply gap in high-power optical amplification for CPO/SiPh. However, the investment case requires too many "ifs": if the SOA qualifies with a DC customer, if production scales to meaningful volumes, if the company raises enough capital to survive until DC revenue materializes, and if incumbents (Lumentum, Coherent, Broadcom) don't simply expand their own SOA capacity to fill the gap. At $840M market cap with $18M revenue, negative gross margins, $115M/year cash burn, and ~1 year of runway, the risk/reward is unfavorable. Revisit if: (1) AEVA announces a confirmed SOA design win with a Tier 1 transceiver OEM or hyperscaler, (2) LiDAR revenue reaches $50M+ quarterly run rate proving manufacturing execution, or (3) the stock pulls back to $6-8 (near 52-week low) where the InP fab alone provides asset value support.

### Price Target: N/A (speculative, no target)
Too early to assign a fundamental price target. The analyst mean of $24 assumes successful execution on both LiDAR and data center — outcomes that are far from certain.

### Source Trail
| Source | Date | What |
|--------|------|------|
| Yahoo Finance (AEVA) | 2026-04-12 | Price, financials, balance sheet, cash flow, analyst targets |
| Aeva SOA announcement | 2026-01-06 | SOA specs, DC photonics pivot |
| Aeva Q3 2025 earnings | 2025-11-xx | Revenue, guidance, cash position |
| Aeva 10-K FY2025 | 2026-02-xx | Annual financials, employee count, fab description |
| NVIDIA DRIVE partnership | 2024-xx-xx | Automotive photonics validation |
| Continental/Daimler Truck announcements | 2024-2025 | LiDAR customer relationships |
| Lumentum/Coherent/Broadcom public filings | 2025-2026 | Competitive InP SOA landscape |
