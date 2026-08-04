# Defense Industrial Base — Munitions Chokepoints

Where the Western munitions chain physically narrows, and who gets paid at that point.

**Live:** https://research.mangrove-hk.org/defense-industrial-base/

68 companies · 8 layers · US / Japan / Korea / Europe · market data as of **2026-08-04** (Bloomberg)

---

## The setup

The US is quadrupling THAAD and PrSM capacity and has tripled PAC-3 MSE. The FY2027 request puts roughly **$95bn** into missiles and munitions — about a tripling. Golden Dome adds $17.5bn, though **only $400m sits in the base budget** with the rest dependent on reconciliation.

## Three findings

**1. The expansion headlines are capex, not revenue — for the announcer.** L3Harris beat and raised on 29 July 2026 and fell ~7% (missile capex **+92% YTD**, IPO delayed). Northrop beat with a **record $105bn backlog** and fell on capital intensity. Meanwhile the suppliers collecting that spend re-rated violently: Ducommun **+92%**, Carpenter **+73%**, ATI **+68%** YTD. Buying the prime on the announcement is the worst expression of the trade.

**2. Money is not the binding constraint.** After **$6bn** invested, 155mm output was still **~56k shells/month against a 100k goal** (Feb 2026). The blockers are energetics, tooling and trained people. This is a natural experiment: when a layer absorbs billions and does not expand, its capacity constraint is an observation rather than a forecast.

**3. The international complex has decoupled.** Europe and Korea de-rated on **war-consumption** risk — peace-deal expectations, Germany's F126 cancellation (Rheinmetall −18% on the day), Korean Q2 misses (Hanwha OP ₩947.3bn vs ₩1.02tn consensus). The US bottleneck is a **stockpile-rebuild and capacity** story that survives a ceasefire. These are being priced as one trade. They are not.

## Top picks (as of 2026-08-04)

| Ticker | Chokepoint | Score | Verdict | YTD | Fwd P/E | Key thesis |
|--------|-----------|-------|---------|-----|---------|------------|
| 012450 KS | 18 | **78** | BUY | **+3.6%** | 17.2x | Building **US** energetics capacity — Pine Bluff (~$1.3bn) + modular charge plant (~$1bn, NC/NG/NQ/triple-base). Unanimous Buy, +71% target gap. **Rallied ~9% on 4 Aug — no longer down on the year** |
| NEU US | **25** | 76 | BUY | +24.3% | n/a | **AMPAC — sole large-scale US ammonium perchlorate producer.** No AP, no solid rockets. $100m expansion, >50% capacity |
| LHX US | 22 | 75 | BUY | −5.4% | 22.1x | Half the US SRM duopoly. The capex crushing the stock is what creates 2028+ earnings. Missile-business separation is the catalyst |
| NOC US | 22 | 75 | BUY | −3.8% | 18.8x | The other half. $178m Allegany facility doubles SRM capacity by autumn 2026. Cheaper than LHX, with B-21 fixed-price hair |
| 7013 JP | 20 | 74 | BUY | +2.7% | 17.3x | IHI Aerospace = Japan's SRM house. The cheap-duopoly idea in yen |
| 5631 JP | 18 | 73 | BUY | −2.4% | n/a | Large forgings + ordnance. +54% consensus gap, 4.71 rec — the forging bottleneck at a price US names stopped offering in January |
| 000880 KS | 16 | 73 | BUY | +2.3% | 12.6x | Holdco route into the Hanwha energetics build-out, +99% target gap. **Stale print — no volume on 4 Aug while the opco rallied 9%** |

## Key chokepoint discovery

```
AMMONIUM PERCHLORATE          NEU/AMPAC — SOLE large-scale US producer          25/25
        ↓
SOLID ROCKET MOTORS           NOC + LHX — six domestic makers became two        22/25
        ↓
TITANIUM SPONGE               5726 JP / 5727 JP — US has ZERO domestic          23/25
                              Japan = 73% of all US sponge imports (2025)
        ↓
SEEKERS                       Boeing (inside BA) — gates allied PAC-3 output     16/25
```

**The recursive bottleneck.** Japan license-produces PAC-3 at ~30/yr and completed the **first-ever export of Japanese-built PAC-3 to the US on 20 Nov 2025** to refill American stockpiles. Output can double to ~60/yr — *once Boeing-built seekers stop being the bottleneck.* The missile bottleneck was never the missile: it was the motor, then the oxidiser, then the seeker.

## Files

| File | What it is |
|---|---|
| `value-chain.md` | The layer map, chokepoint assessment, kill conditions, full source list |
| `universe.txt` | The 68-name universe, organised by layer, with Yahoo symbols |
| `chokepoint-method.md` | The 5-question framework + theme-specific conventions |
| `criteria.md` | 100-point scoring and verdict bands |
| `chokepoint_scores.tsv` | Raw auditable 5-question inputs |
| `results.tsv` | Full scored table |
| `dib-dashboard-data.js` | Single source of truth — the TSVs are generated from it |
| `scripts/generate-tsv.mjs` | `node scripts/generate-tsv.mjs` regenerates both TSVs |
| `reports/` | Per-company notes for the BUY list |

Dashboard views: **Chokepoint Dashboard** (`dib-dashboard.html`) · **Value Chain Layers** (`supply-chain-map.html`) · **Economics Scatter** (`chokepoint-economics.html`).

## Kill conditions

- **A Ukraine and/or Middle East settlement** — already the dominant driver of European and Korean prices. Rheinmetall and Poongsan take the war-continuation side; Hanwha's US plants and Japanese titanium do not.
- **Golden Dome fails reconciliation** — $17.5bn becomes $400m.
- **The capex cycle extends** — if LHX/NOC keep guiding capex up, cheap stays cheap. This is a 2–3 year position, not a quarter.
- **SRM new entrants qualify at volume** — Anduril, X-Bow, Ursa Major and Mach Energetics all have DoD money. This is the main structural risk to the highest-conviction US idea.
- **FX** — JPY/KRW/EUR assets against a USD-funded thesis.

## Provenance

Price, YTD, forward P/E, consensus target and recommendation are **Bloomberg**, dated above. Capacity, contract and policy figures are from company releases, CRS/CSIS and trade press — full list in `value-chain.md`. **Chokepoint scores, investment scores, verdicts and one-liners are analyst judgement, not sourced data**, and the raw inputs are kept in `chokepoint_scores.tsv` so they can be argued with.

Explicitly unverified in this build: IHI Aerospace's SRM position; the defence-revenue split at Toray, Shin-Etsu and TDK. Toho Titanium returned no price on the terminal and is `WATCH`, not rated. Not investment advice.
