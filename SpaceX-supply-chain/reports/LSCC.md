# LSCC - Lattice Semiconductor

## Date: 2026-03-29
## Score: 30/100
## Chokepoint Tier: Competitive with Differentiation

### Thesis
Lattice Semiconductor makes low-power, small-form-factor FPGAs that are genuinely well-suited for LEO satellite subsystems. The Certus-NX-RT is radiation-tolerant, consumes 4x less power than competitors, and costs 1/10th of traditional rad-hard FPGAs ($10K vs $100K). Frontgrade (formerly CAES) distributes Lattice FPGAs with radiation-tolerant packaging for satellite applications. However, there is zero confirmed SpaceX/Starlink usage -- Starlink V2 satellites use AMD Versal AI Core FPGAs (CEO-confirmed), not Lattice. Lattice's niche is power-efficient control-plane FPGAs, not the high-performance compute FPGAs SpaceX needs for phased-array beamforming.

### SpaceX Relationship: SPECULATED (Low Probability)
- No confirmed Starlink or SpaceX usage in any filing, teardown, or earnings call
- AMD Versal AI Core is the confirmed Starlink V2 satellite FPGA (AMD CEO confirmed)
- Lattice Certus-NX-RT targets LEO satellite control-plane tasks (housekeeping, I/O bridging), not beamforming compute
- Frontgrade/Lattice collaboration targets "distributed satellite computing" for defense/government constellations, not commercial mega-constellations
- **Estimate: SpaceX revenue = $0. Possible use in other LEO constellations (Kuiper, SDA) but unconfirmed**

### Value Chain Position
Lattice is a FABLESS semiconductor company designing low-power FPGAs.
- **Communications & Computing**: Record revenue in FY2025, driven by AI/data center (server FPGA revenue +85% YoY)
- **Industrial & Automotive**: Bread-and-butter markets
- **Space/Defense**: Niche via Frontgrade partnership; Certus-NX-RT is shipping flight-grade units since 2023

### Chokepoint Test

| Question | Score | Rationale |
|----------|-------|-----------|
| Breakage | 2 | SpaceX uses AMD FPGAs, not Lattice; other satellite makers may use Lattice but not critical |
| Alternatives | 2 | AMD/Xilinx, Microchip (PolarFire), Intel/Altera all make space-grade FPGAs |
| Qualification | 3 | Radiation qualification is genuinely hard and long (2+ years); Certus-NX-RT is qualified |
| COGS | 1 | Control-plane FPGAs are small cost items per satellite |
| Capacity | 2 | Fabless; depends on foundry (TSMC 28nm FD-SOI); not uniquely constrained |
| **Total** | **10/25** | |

### Quantitative Snapshot

| Metric | Value |
|--------|-------|
| Stock Price | ~$90.39 |
| Market Cap | ~$12.4B |
| 52-Week Range | ~$42 - $108 |
| FY2025 Revenue | $523.3M (+2.7% YoY) |
| GAAP Gross Margin | 68.2% |
| Non-GAAP Gross Margin | 69.3% |
| Non-GAAP EPS | $1.05 |
| P/E (Non-GAAP) | ~86x |
| Server Revenue Growth | +85% YoY |
| Analyst Consensus | Strong Buy, PT $102 |

### Scoring

| Dimension | Score | Notes |
|-----------|-------|-------|
| Chokepoint Strength (30) | 8 | 10/25 raw; no confirmed SpaceX usage; AMD is the satellite FPGA supplier |
| Financial Strength (25) | 18 | Excellent: 69% gross margin, fabless model, but revenue only $523M and barely growing |
| Growth (20) | 7 | Total revenue +2.7% -- cyclical trough recovery; server segment strong but space is tiny |
| Valuation (15) | 3 | 86x P/E for a company growing <3%; priced for AI FPGA narrative |
| Catalyst & Timing (10) | 2 | Certus-NX-RT shipping but no SpaceX design win; Frontgrade partnership is defense-focused |
| **Subtotal** | **38** | |

### Signal Adjustments
- Unconfirmed SpaceX relationship: **-3**
- AMD confirmed as Starlink satellite FPGA: **-3** (competitor owns the relationship)
- Strong gross margins signal IP quality: **+1**
- RSI near 70 after run from $42 to $90: **-1**

### Bearish Signals
- SpaceX uses AMD Versal, not Lattice, for satellite FPGAs
- Lattice FPGAs are too small for beamforming compute workloads
- 86x P/E on 2.7% revenue growth is extreme
- Space/defense FPGA revenue is likely <5% of total and not disclosed separately

### Final Score: 30/100 (after adjustments from 38, reduced by confirmed competitor ownership of SpaceX FPGA socket)

### Verdict: AVOID
Lattice makes genuinely good low-power FPGAs and the Certus-NX-RT is a real radiation-tolerant product. But SpaceX uses AMD for satellite FPGAs, and Lattice's space revenue is undisclosed and likely tiny. At 86x earnings with sub-3% growth, the stock is priced for an AI FPGA story, not a space story. The SpaceX thesis here is a non-starter.

**One-liner:** Right technology, wrong customer -- SpaceX chose AMD for satellite brains, and 86x P/E leaves no room for speculative space exposure.

### Source Trail
| Source | Date |
|--------|------|
| Lattice FY2025 Results Press Release | 2026-02 |
| Frontgrade/Lattice Certus-NX-RT Collaboration | 2022-01 |
| Certus-NX-RT Radiation Qualification | 2023-03 |
| AMD Versal in Starlink V2 (CEO confirmed) | 2024 |
| StockAnalysis LSCC Data | 2026-03 |
