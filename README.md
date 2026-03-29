# Investing

Autonomous equity research - sector deep dives, supply chain analysis, and chokepoint mapping.

Independent committee review:
- [Repo-wide IC review index](ic-review.md)
- [AI Photonics IC review](ai-photonics/ic-review.md)
- [Memory Supercycle IC review](memory-supercycle/ic-review.md)

## Sectors

### [AI Photonics / Optical Interconnects](ai-photonics/)
Under-discovered photonics stocks benefiting from the AI data center buildout. Covers the full supply chain from substrate wafers to optical networking systems, globally (US, Europe, Japan).

**Top Picks (as of 2026-03-24):**
| Ticker | Score | Verdict | Key Thesis |
|--------|-------|---------|------------|
| CRDO | 82 | BUY | 88% AEC monopoly, 68% GM, 53% pullback from ATH |
| MTSI | 76 | BUY | Analog IC moat inside every transceiver, 57% GM |
| TSEM | 75 | BUY | 85% SiPh foundry share, TSMC of photonics |

**Key Supply Chain Discovery:**
```
Soitec (SOI.PA) --> Tower Semi (TSEM) --> SiPh transceiver ICs --> modules --> AI clusters
  70% SOI share       85% SiPh foundry     Broadcom/Coherent/Intel
```

Interactive map:
- https://timlihk.github.io/Investing/ai-photonics/supply-chain-map.html
- CHIPS status notes: https://github.com/timlihk/Investing/blob/main/ai-photonics/chips-act-status.md

### [Memory Supercycle](memory-supercycle/)
Under-covered memory, packaging, test, and storage names benefiting from the AI memory supercycle. Focused on HBM supply, HBM packaging bottlenecks, memory test/probe intensity, and enterprise SSD expansion.

**Top Picks (as of 2026-03-24):**
| Ticker | Score | Verdict | Key Thesis |
|--------|-------|---------|------------|
| 000660.KS | 88 | BUY | HBM leader with fully committed 2026 supply and record margins |
| MU | 86 | BUY | U.S. pure-play memory winner with HBM4 and AI SSD leverage |
| 042700.KS | 83 | BUY | TC bonder bottleneck inside HBM stacking |
| 0522.HK | 81 | BUY | Underfollowed HBM4 packaging / TCB leader |

**Key Supply Chain Discovery:**
```
HBM supply --> HBM bonding --> test / probe --> SSD controller --> AI storage
 SK hynix        Hanmi/ASMPT      Advantest/FORM    SIMO            SNDK/Kioxia
```

Interactive map:
- https://timlihk.github.io/Investing/memory-supercycle/supply-chain-map.html

### [SpaceX Supply Chain](SpaceX-supply-chain/)
75 companies in universe, 54 scored, 56 reports/analyses. 29 confirmed suppliers. SpaceX IPO expected June 2026 at $1.75T. Most "SpaceX supplier" claims are speculation — vertical integration is the #1 risk.

**Top Picks — Valuation-Adjusted (as of 2026-03-29):**
| Ticker | Score | Verdict | SpaceX % | Target | Key Thesis |
|--------|-------|---------|----------|--------|------------|
| STM | 82 | BUY | 5-8% ($600-950M) | $40 | Crown jewel RFOC at 23.4% OM (5x company avg). Trough auto masks Starlink growth |
| FLTCF | 74 | BUY | 83% ($60M) | 220-240p | Best risk/reward. GaN SSPAs. Min $10M/yr + 15% equity warrants. £200M capacity |
| 014300.KS | 62 | BUY | <1% rising | N/A | Cheapest confirmed supplier. Temple TX plant Q1 2026. 6% yield |
| 3491.TWO | 72 | HOLD | 60-70% | TWD 550 | Great but 101x P/E. Accumulate at TWD 450-550 |
| 2313.TW | 60 | HOLD | 15-22% ($280-440M) | TWD 160 | 80% LEO PCB share but 42x fwd P/E. SpaceX building own PCB factory |

**Key Supply Chain Discovery (Confirmed Only):**
```
STM (5B+ custom co-designed RF chips) → Every Starlink terminal + satellite
FLTCF (GaN SSPAs, strategic partner) → Ground station RF amplifiers
AMD Versal (CEO-confirmed) → Every Starlink V2+ satellite SoC
QCOM X105 (D2C modem) → Every future smartphone gets native Starlink connectivity
3491.TWO (RF modules) → Satellite comms, expanding in Vietnam at SpaceX request
Compeq 2313.TW (80% LEO PCB share) → Satellite bodies + ground stations
SeAH Besteel (Ni-Cr-Ti alloys) → Raptor engines
Sphere Corp ($1.05B/10yr deal) → Superalloys for engines/nozzles
```

Interactive dashboard:
- https://timlihk.github.io/Investing/SpaceX-supply-chain/
- Direct dashboard page: https://timlihk.github.io/Investing/SpaceX-supply-chain/spacex-dashboard.html

## Methodology
- Pull IR presentations, quarterly/annual filings for every company
- Focus on moats and chokepoints (monopoly positions, sole-source relationships)
- Discover upstream/downstream companies globally (US, Europe, Asia)
- Include historical and projected financials, key drivers, segment breakdowns
- Score on Business Quality (25), Financial Strength (25), Growth (20), Valuation (20), Catalyst (10)
