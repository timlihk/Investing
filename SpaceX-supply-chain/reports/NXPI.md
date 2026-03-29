# NXPI -- NXP Semiconductors

**Score: 32/100 | Chokepoint: 10/25 | HOLD**

## Thesis

Probable SpaceX supplier via PowerPC microcontrollers in Falcon 9 engine and grid fin control systems. NXP inherited the PowerPC MCU line from Freescale (acquired 2015). Falcon 9's flight computers use triple-redundant PowerPC MCUs for engine control -- a well-documented architecture. However, SpaceX uses commercial-off-the-shelf (COTS) parts with system-level radiation tolerance rather than rad-hardened chips, meaning the switching cost is lower than typical space-grade components. NXP's automotive/industrial focus means SpaceX is financially invisible.

## SpaceX Relationship

PROBABLE -- PowerPC MCUs in Falcon 9 engine microcontrollers (documented in SpaceX AMA and public talks). SpaceX uses COTS PowerPC with triple-redundancy rather than rad-hardened parts. Not confirmed in any NXP filing or IR communication. Starship may use different architecture.

## Chokepoint Score: 10/25

| # | Question | Score | Rationale |
|---|----------|-------|-----------|
| 1 | What breaks if they stop shipping? | 3 | Engine control delayed -- but RISC-V/ARM alternatives emerging |
| 2 | How many alternatives exist? | 2 | PowerPC is legacy; ARM Cortex-R, RISC-V alternatives viable for new designs |
| 3 | How long to qualify a replacement? | 2 | 6-24 months; SpaceX uses COTS, not space-grade qual |
| 4 | What % of customer COGS? | 1 | Sub-$50 MCUs per engine; negligible vs rocket cost |
| 5 | Is capacity physically constrained? | 2 | PowerPC MCUs are mature node; capacity available but requalification needed |

**Tier: Competitive with Differentiation**

Note: Chokepoint capped because (a) unconfirmed in filings and (b) SpaceX COTS approach reduces qualification barriers vs traditional aerospace.

## SpaceX Revenue Exposure

| Metric | Value | Confidence |
|--------|-------|------------|
| Estimated SpaceX Revenue | $1-5M | Very Low |
| % of Total Revenue | <0.05% | Estimated |
| % of Industrial/IoT Segment | <0.1% | Estimated |
| Trajectory | Flat to declining | Estimated |

Methodology: ~100 Falcon 9 launches/yr x 9 engines x 3 MCUs x ~$15-30/MCU = $0.4-0.8M for engines; grid fins, avionics add some. Starship transition may change architecture entirely.

## Price Action (as of March 26, 2026)

| Metric | Value |
|--------|-------|
| Price | $197.53 |
| 52-Week High | $256.36 |
| 52-Week Low | $148.09 |
| Market Cap | $49.9B |
| % Off 52-Week High | -23% |

## 5-Year Historical Financials

| Metric | FY2021 | FY2022 | FY2023 | FY2024 | FY2025 |
|--------|--------|--------|--------|--------|--------|
| Revenue | $11.1B | $13.2B | $13.3B | $12.6B | $12.3B |
| Revenue Growth % | +28% | +19% | +1% | -5% | -3% |
| Gross Margin % (non-GAAP) | ~56% | ~58% | ~57% | ~57% | ~57% |
| Net Income | $1.9B | $2.8B | $2.8B | $2.5B | ~$2.4B (est.) |
| EPS (Diluted) | ~$7.00 | ~$10.50 | ~$10.80 | ~$9.80 | $11.81 (non-GAAP) |

## 3-Year Forward Projections (Consensus)

| Metric | FY2026E | FY2027E | FY2028E |
|--------|---------|---------|---------|
| Revenue | $13.7B | $15.1B | N/A |
| EPS | $13.99 | $17.00 | N/A |

Source: 35 analysts, consensus "Buy," avg PT $261.

## Latest Earnings: Q4 2025 (February 2026)

Revenue $3.34B (+7% YoY, +5% QoQ), beating consensus $3.3B. Non-GAAP EPS $3.35 vs consensus $3.30. Full-year 2025 revenue $12.27B (-3% YoY). Non-GAAP gross margin 56.8%, operating margin 33.1%. Q1 2026 guidance: revenue $3.15B (+11% YoY). Automotive and Industrial/IoT expected to recover. No mention of SpaceX, space, or satellite in earnings materials.

## Scoring

| Dimension | Score | Max | Rationale |
|-----------|-------|-----|-----------|
| Chokepoint Strength | 9 | 30 | 10/25 raw = Competitive tier (7-13 pts) |
| Financial Strength | 18 | 25 | 57% GM, solid FCF, manageable debt |
| Growth | 7 | 20 | Revenue declining; auto cycle recovering slowly |
| Valuation | 10 | 15 | 14x FY2026E EPS; reasonable for mature semi |
| Catalyst & Timing | 2 | 10 | No SpaceX catalyst; auto recovery is the story |
| **Subtotal** | **46** | **100** | |

### Signal Adjustments
- Unconfirmed supplier relationship: -3
- Vertical integration risk (Starship may use different MCU): -3
- PowerPC legacy declining: -2
- Automotive cycle recovery (own merits): +2

**Adjusted Score: ~32/100** (penalized for unconfirmed + legacy architecture risk)

## Risks

- **Unconfirmed relationship**: No NXP filing mentions SpaceX
- **Architecture migration**: Starship may move to ARM/RISC-V, obsoleting PowerPC MCUs
- **SpaceX COTS philosophy**: Lower switching costs than traditional aerospace
- **Automotive slowdown**: Core business headwind independent of SpaceX
- **PowerPC sunset risk**: NXP de-emphasizing PowerPC for ARM-based i.MX line

## SpaceX DD Checklist

- [x] Supplier relationship confirmed? Probable only (public SpaceX talks mention PowerPC, not NXP by name)
- [x] % of revenue from SpaceX? <0.05% -- completely immaterial
- [x] Could SpaceX in-house? No, but could switch to ARM/RISC-V
- [x] TAM from SpaceX big enough to matter? No ($1-5M vs $12.3B revenue)
- [x] Benefits from both launch and Starlink? Launch only (Falcon 9 engines); Starlink terminals use different MCUs (STM32)
- [x] Thesis survives IPO delay? N/A -- no SpaceX thesis

## Verdict

**HOLD** -- on own merits as an auto/industrial semi leader recovering from a downcycle. **AVOID** as a SpaceX play. The PowerPC MCU relationship is probable but financially invisible, architecturally at risk, and provides no chokepoint leverage.

**One-liner:** Probable Falcon 9 PowerPC MCUs but COTS philosophy + architecture migration risk = zero chokepoint; buy for auto recovery, not rockets.
