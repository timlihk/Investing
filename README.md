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

### [Defense Industrial Base](defense-industrial-base/)
Where the Western munitions chain physically narrows, and who gets paid at that point. 68 companies across 8 layers (US, Japan, Korea, Europe). The FY27 request puts ~$95bn into missiles and munitions -- about a tripling -- but the expansion headlines are **capex, not revenue**, for the primes announcing them.

**Top Picks (as of 2026-08-04):**
| Ticker | Chokepoint | Score | Verdict | Key Thesis |
|--------|-----------|-------|---------|------------|
| 012450.KS | 18 | 78 | BUY | Hanwha Aerospace building **US** energetics capacity (Pine Bluff ~$1.3bn + ~$1bn modular charge plant). 17.2x, +3.6% YTD after a ~9% rally on 4 Aug, unanimous Buy |
| NEU | **25** | 76 | BUY | AMPAC = **sole large-scale US ammonium perchlorate producer**. No AP, no solid rockets. Dilution caveat inside a petroleum-additives co |
| LHX | 22 | 75 | BUY | Half the US SRM duopoly at 22.1x, still -5.4% YTD. Beat-and-raised and fell 7% on +92% YTD missile capex -- which is exactly what builds 2028+ earnings |
| NOC | 22 | 75 | BUY | The other half. $178m Allegany facility doubles SRM capacity by autumn 2026. 18.8x, with B-21 fixed-price hair |
| 7013.T | 20 | 74 | BUY | IHI Aerospace = Japan's SRM house at 17.3x, +2.7% YTD. Materiality flagged as unverified |

**Key Supply Chain Discovery:**
```
AMMONIUM PERCHLORATE --> SOLID ROCKET MOTORS --> TITANIUM SPONGE --> SEEKERS
 NEU/AMPAC (25/25)        NOC + LHX (22/25)      5726/5727 JP (23/25)  Boeing (16/25)
 sole US producer         six makers -> two      US has ZERO domestic   gates allied PAC-3
```

The recursive bottleneck: Japan license-produces PAC-3 at ~30/yr and made the first-ever export of Japanese-built interceptors to the US (Nov 2025). Output can double to ~60/yr -- *once Boeing-built seekers stop being the bottleneck*. The missile bottleneck was never the missile.

**The organising observation:** companies *bearing* the capacity capex de-rated (LHX -5.4%, NOC -3.8% YTD, both after beat-and-raise) while companies *collecting* it re-rated (DCO +92%, CRS +73%, ATI +68%). The `capex_side` field in `results.tsv` tracks this split.

Dashboard: https://research.mangrove-hk.org/defense-industrial-base/

## Methodology
- Pull IR presentations, quarterly/annual filings for every company
- Focus on moats and chokepoints (monopoly positions, sole-source relationships)
- Discover upstream/downstream companies globally (US, Europe, Asia)
- Include historical and projected financials, key drivers, segment breakdowns
- Score on Business Quality (25), Financial Strength (25), Growth (20), Valuation (20), Catalyst (10)
