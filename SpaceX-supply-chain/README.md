# SpaceX Supply Chain Research

Research session: 2026-03-29 | 71 companies scored | 71 in universe | 38 confirmed suppliers

## Thesis
SpaceX is building two of the largest hardware supply chains in history — Starship (the biggest rocket ever) and Starlink (6,000+ satellite mega-constellation). While SpaceX itself is private, its public supply chain offers investable chokepoints in specialty alloys, carbon fiber, cryogenic systems, RF components, and semiconductor ICs. This research maps the full supply chain, verifies supplier relationships, and identifies under-discovered public-market beneficiaries ahead of a potential SpaceX IPO.

## Dashboard

- GitHub Pages landing page: https://timlihk.github.io/Investing/SpaceX-supply-chain/
- Direct dashboard page: https://timlihk.github.io/Investing/SpaceX-supply-chain/spacex-dashboard.html
- Local refresh command: `npm run refresh:dashboard`

## The Key Metric: SpaceX Revenue Exposure %

Only 9 companies have SpaceX exposure >5% of revenue. See [spacex_exposure_ranking.md](reports/spacex_exposure_ranking.md).

| Rank | Company | Ticker | SpaceX % of Rev | SpaceX Rev | Trend |
|------|---------|--------|----------------|------------|-------|
| 1 | Filtronic | FLTCF | **~83%** | ~$60M | GROWING |
| 2 | Sphere Corp | 347700.KQ | **~80%** | ~$55M/yr | GROWING |
| 3 | Universal Microwave | 3491.TWO | **~50%** | ~$30-37M | GROWING |
| 4 | Compeq Mfg | 2313.TW | **~15-20%** | ~$350-460M | GROWING |
| 5 | Velo3D | VELO | **~17%** | ~$8M | DECLINING |
| 6 | Tong Hsing | 6271.TW | **~10-20%** | ~$37-75M | GROWING (unconfirmed) |
| 7 | Wistron NeWeb | 6285.TW | **~10-15%** | ~$340-510M | GROWING |
| 8 | STMicroelectronics | STM | **~5-8%** | ~$600-950M | GROWING |
| 9 | Chin-Poon | 2355.TW | **~5-10%** | ~$26-52M | GROWING |

## Scorecard

See [results.tsv](results.tsv) for the full scorecard with 53 companies scored.

### BUY Ratings — Valuation-Adjusted (Post Deep DD, Updated 2026-03-29)
| Ticker | Score | SpaceX % | Price | Target | Key Thesis |
|--------|-------|----------|-------|--------|------------|
| **STM** | 82 | **5-8%** ($600-950M) | $32.75 | **$40** (+22%) | **#1 PICK.** RFOC at 23.4% OM = 5x company avg. Crown jewel buried in auto trough. BUY aggressively below $28 |
| **FLTCF** | 74 | **83%** ($60M) | 187p | **220-240p** (+18-28%) | Best pure-play. GaN ramp FY2027. £200M capacity. Min $10M/yr + 15% warrants. 4yr CAGR 38% |

### Watch List — Great Company, Stretched Valuation
| Ticker | Score | SpaceX % | Price | Issue |
|--------|-------|----------|-------|-------|
| **014300.KS** | 52 | **<1% rising** | KRW 70,000+ | **DOWNGRADED from BUY.** Stock 4x'd, now 27% above consensus at 44-48x P/E. Wait for KRW 45-55K |
| **3491.TWO** | 72 | **60-70%** | TWD 686 | **101x P/E, 24% above analyst avg target.** Accumulate at TWD 450-550 |
| **6271.TW** | 68 | **8-15%** | TWD 134 | Unconfirmed "exclusive" RF packaging rumor. High upside IF true |
| **Sphere Corp** | 52 | **~80%** | KRW 46,150 | $1.05B/10yr deal but ex-healthcare shell; 670% run; KOSDAQ only |

### Watch List — High Chokepoint, Low SpaceX Exposure
| Ticker | Score | Chokepoint | SpaceX % | Issue |
|--------|-------|-----------|----------|-------|
| MTRN | 72 | 22/25 | Probable but small | Beryllium monopoly; only $120M of $1.79B is Be |
| ATI | 72 | 20/25 | <1% | Aerospace alloy duopolist; stock already 4x'd |
| GHM | 68 | 18/25 | Historical only | Merlin turbopump was past; 85% of backlog is Navy |
| CRS | 65 | 19/25 | <1% | Superalloys + AM powder; 50x+ earnings |
| AMD | 58 | 16/25 | ~0.1-0.2% | Versal in every V2 satellite; strategically iconic but financially tiny |

### Key Discoveries
- **STM is THE Starlink chip partner** — custom co-designed ASICs with SpaceX codenames (Catson, Shiraz, Pulsar). NOT Broadcom
- **Marotta Controls** (private) is SpaceX's primary valve supplier, NOT Moog
- **AMD Versal AI Core** powers every Starlink V2 satellite (CEO-confirmed)
- **Xsight Labs** (private, backed by AMD/Intel/Marvell) — X2 12.8Tbps switch for V3 satellites. Stealth chokepoint
- **SpaceX building own PCB factory + FOPLP chip packaging plant in Texas** — medium-term headwind for suppliers
- **Helium is an active crisis** — Qatar shutdown removed 1/3 of global supply; 40-100% price surge
- **SpaceX switched from krypton to argon** for satellite thrusters — engineered around rare gas problem
- **Compeq holds 80% global market share** in LEO satellite PCBs
- **Mynaric (M0YN.DE)** went bankrupt — cautionary tale; SpaceX builds own laser links
- Most "SpaceX supplier" claims are speculation — only 38 of 71 companies have confirmed relationships

### Key Supply Chain Map (Confirmed Only)
```
LAUNCH MATERIALS:
  ATI/CRS (superalloys, probable) → GHM/Barber-Nichols (turbopumps, confirmed historical)
  014300.KS SeAH Besteel (Ni-Cr-Ti alloys, confirmed) → Raptor engines
  LIN Linde (LOX, confirmed) → Launch operations
  VELO Velo3D (3D printing, confirmed) → 5 Raptor parts qualified

STARLINK SEMICONDUCTORS:
  STM (5B+ RF chips, CONFIRMED) → Phased-array antennas (terminals + satellites)
  AMD Versal (adaptive SoC, CONFIRMED) → Every Starlink V2 satellite
  MPWR (power ICs, confirmed) → Terminal power management
  TXN/DIOD (DC-DC, shunt regs, confirmed) → Terminal power board (commodity)
  IFX.DE/ON (power MOSFETs, confirmed teardown) → Terminal power supply (commodity)
  ADI (power supervisor, confirmed teardown) → Terminal PoE board (commodity)
  6723.T Renesas (GreenPAK + beamforming, confirmed teardown) → Terminal antenna array
  3105.TW Win Semi (GaAs foundry, confirmed) → Satellite RF front-ends

STARLINK RF & INFRASTRUCTURE:
  FLTCF Filtronic (GaN SSPAs, CONFIRMED STRATEGIC PARTNER) → Ground station RF
  3491.TWO Universal Microwave (RF modules, CONFIRMED) → Satellite RF components
  2313.TW Compeq (PCBs, CONFIRMED since 2017) → Satellite + ground station boards
  6285.TW WNC (routers, CONFIRMED) → Ground terminal assembly
  2355.TW Chin-Poon (PCBs, CONFIRMED) → Satellite components
```

## Method
Using the same chokepoint-economics framework as [AI Photonics](../ai-photonics/chokepoint-method.md):
1. Map full supply chain from raw materials to launch/constellation
2. **Verify** each supplier relationship (filing, IR, news — not speculation)
3. Score each company on chokepoint (market share, switching cost, IP moat)
4. Overlay financial metrics (GM, revenue growth, valuation)
5. Identify BUY / HOLD / AVOID ratings
6. Special focus: vertical integration risk (SpaceX in-houses aggressively)

## SpaceX IPO Playbook

SpaceX IPO expected **June 2026** at **$1.75T valuation** (~$75B raise, largest IPO ever). See [spacex_ipo_playbook.md](reports/spacex_ipo_playbook.md).

**Key tactical insight:** The filing rally already happened (March 25-26). The real alpha is in the S-1 disclosures — SpaceX has been a black box. Read the Risk Factors section for named suppliers.

**Actions:**
- FLTCF: HOLD through IPO (likely named in S-1)
- STM: HOLD/ADD below $28 (buy on auto trough, not IPO hype)
- 3491.TWO: TRIM to half (101x P/E prices in IPO)
- 2313.TW: TRIM to half (42x P/E, 114% above consensus)
- 014300.KS: HOLD (cheap enough that IPO is optionality)

## Key Reports & Analysis

- [SpaceX Exposure % Ranking](reports/spacex_exposure_ranking.md) — THE key analysis: only 9 companies have >5% SpaceX revenue
- [SpaceX IPO Playbook](reports/spacex_ipo_playbook.md) — Tactical positioning for June 2026 IPO
- [BOM Teardown Analysis](reports/BOM_teardown_analysis.md) — Complete Starlink terminal/router/satellite component map
- [Propellant Gas Analysis](reports/propellant_gas_analysis.md) — Helium crisis, methane, krypton→argon switch
- [FLTCF Valuation](reports/FLTCF_valuation.md) — Target 220-240p, best risk/reward in the portfolio
- [STM Segment Analysis](reports/STM_segment_analysis.md) — RFOC at 23.4% OM = crown jewel buried in auto trough
- [3491.TWO Valuation](reports/3491_TWO_valuation.md) — Great company at 101x P/E, wait for TWD 450-550
- [2313.TW Valuation](reports/2313_TW_valuation.md) — 80% LEO PCB share but 42x fwd P/E, wait for TWD 140-160
- [014300.KS Valuation](reports/014300KS_valuation.md) — 0.39x P/B, 5.7% yield, Temple TX plant +22-47% EBITDA. Target KRW 34,500 (+64%)
- [Direct-to-Cell Analysis](reports/direct_to_cell_analysis.md) — D2C could be bigger than traditional Starlink. STM is biggest beneficiary
- [Qualcomm X105 D2C Analysis](reports/QCOM_D2C_analysis.md) — NR-NTN modem in every phone. $1.6-1.9B by 2028
- [Insider Activity Scan](reports/insider_activity_scan.md) — SpaceX vesting 10% Filtronic warrants is strongest signal
- [Filing Hunt Summary](reports/filing_hunt_summary.md) — SEC/earnings transcript supplier search results
- [Remaining Names Screening](reports/remaining_names_screening.md) — 8 dismissed, QCOM flagged for D2C

## Interactive Maps

- Dashboard: https://timlihk.github.io/Investing/SpaceX-supply-chain/
