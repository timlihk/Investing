# AMD — Advanced Micro Devices (Starlink Exposure)
## Date: 2026-03-28
## Score: 58/100
## Chokepoint Tier: Duopoly Chokepoint

### Thesis
AMD has a confirmed design win inside every Starlink V2 Mini satellite via its Versal AI Core adaptive SoC (from Xilinx acquisition). CEO Lisa Su named SpaceX on the Q3 2024 earnings call. The Versal handles digital beamforming, inter-satellite laser link routing, direct-to-cell processing, and on-board AI. Strategically significant but financially modest (~1% of Embedded segment, est. $25-35M/yr).

### SpaceX Relationship: CONFIRMED
- **Q3 2024 earnings call**: Lisa Su stated "SpaceX recently launched their latest generation broadband satellites powered by Versal AI Core adaptive SoCs"
- **Chip**: Commercial-grade XCVC1902 (lists at $32K-$37K single-unit on DigiKey; SpaceX likely pays $8K-$12K at volume)
- **What it does**: Heterogeneous SoC with 400 AI Engine tiles (133 TOPS INT8) + ~2,000 DSP58 engines + ARM processors + FPGA fabric. Handles beamforming, laser link routing, D2C signal processing, dynamic spectrum allocation
- **Volume**: ~2,822+ V2 Mini satellites use Versal; SpaceX launching 3,000+ sats/year
- **Revenue est.**: $25-35M/year base case; bull case $50-75M if V3 also uses Versal
- **Space-grade pipeline**: XQR VC1902 (7nm rad-hard) sampling 2026, flight-qualified 2027

### Chokepoint Test

| Question | Score | Rationale |
|----------|-------|-----------|
| Breakage | 4 | Satellite avionics redesign = 12-18 months minimum |
| Alternatives | 3 | Microchip RT PolarFire has far less compute. Intel/Altera in turmoil. Lattice too small. Switch possible but painful |
| Qualification | 4 | Vitis/Vivado toolchain deeply embedded in SpaceX design flow. Multi-year switching effort |
| COGS | 2 | ~$8K-12K per satellite on $250K-$800K BOM = 2-5% of cost |
| Capacity | 3 | TSMC 7nm. No reported constraints. SpaceX volume small vs total TSMC capacity |
| **Total** | **16/25** | |

### Quantitative Snapshot

| Metric | Value |
|--------|-------|
| Stock Price | ~$115 |
| Market Cap | ~$185B |
| FY2025 Revenue | ~$23B+ |
| Embedded Segment | $3.45B |
| SpaceX Revenue Est. | $25-35M/yr (~1% of Embedded) |
| Q4 2025 | Cited "strength with aerospace customers" |

### Moat
- **Strong**: 30+ years Xilinx space FPGA heritage. Versal AI Core has NO direct equivalent (AI Engines + DSPs + FPGA + ARM in one SoC). Vitis/Vivado toolchain lock-in
- **Weak**: SpaceX could develop custom ASIC in 3-5 years if volumes justify it. Microchip RT PolarFire improving

### Catalysts
- V3 satellite ramp (if also Versal)
- Space-grade XQR Versal shipping 2027 — opens military/GEO market
- Constellation expansion beyond 12,000 sats
- Validates Versal for other LEO operators (Kuiper, OneWeb, Telesat)

### Risks
- **#1: SpaceX custom ASIC** — if volumes justify, SpaceX could design their own chip (3-5yr timeline)
- V3 may use different architecture
- AMD Embedded segment cyclicality
- Pricing pressure — SpaceX driving sat costs from $800K toward $250K

### Verdict: HOLD
Confirmed, strategically valuable, but financially small (~1% of Embedded). Better framed as positive optionality within AMD's Embedded recovery than a standalone thesis. Moderate chokepoint — embedded but not irreplaceable.

**One-liner:** Versal AI Core powers every new Starlink satellite — strategically iconic but ~$30M/yr is a rounding error on a $185B company.

### Source Trail
| Source | Date |
|--------|------|
| AMD Q3 2024 Earnings Call (Lisa Su SpaceX quote) | 2024-10 |
| AMD Versal Space-Grade page | 2026 |
| Starlink V2 Mini satellite count (planet4589.org) | 2026-03 |
| AMD Q4 2025 Earnings Call ("aerospace strength") | 2026-02 |
| XCVC1902 DigiKey listing | 2026 |
