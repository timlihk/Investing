# Memory Supercycle — Value Chain & Chokepoint Map

## Core Thesis

AI changed memory from a background component into a system limiter.

The important shift is not just higher DRAM prices. It is that:
- HBM is required for frontier AI accelerators
- Server DRAM and enterprise SSD demand are rising with inference and storage tiers
- Packaging, probe, and test now constrain how fast bits become usable product

Micron said in its March 18, 2026 fiscal Q2 prepared remarks that data-center DRAM and NAND bit TAM will exceed 50% of industry TAM for the first time in calendar 2026, and that both DRAM and NAND supply should remain tight beyond 2026. SK hynix said on January 28, 2026 that it had already secured full customer demand for its DRAM and NAND production for 2026. That is the supercycle setup.

## Memory Flow Map

```
EQUIPMENT / MATERIALS
  ASML / Tokyo Electron / Lam / Advantest / FormFactor / Hanmi / ASMPT / substrates / wafers
                ↓
DRAM / NAND FABRICATION
  SK hynix / Micron / Samsung / Kioxia / Sandisk
                ↓
CONTROLLERS / FIRMWARE / PACKAGING / TEST
  Silicon Motion / HBM bonders / probe cards / testers / advanced packaging lines
                ↓
MODULES / SSD / SERVER MEMORY
  HBM cubes / DDR5 RDIMMs / LP modules / enterprise SSDs / boot drives
                ↓
AI SYSTEMS
  NVIDIA / AMD / hyperscalers / server OEMs / storage OEMs / edge AI devices
```

## Where the Chokepoints Are

| Layer | Key Players | Chokepoint Assessment | Why It Matters |
|------|-------------|-----------------------|----------------|
| HBM supply | SK hynix, Micron, Samsung | Tight oligopoly | Only a few companies can ship qualified HBM at scale |
| HBM bonding tools | Hanmi, Hanwha, ASMPT | Chokepoint inside the chokepoint | HBM die must be stacked and bonded with high yield |
| Memory test systems | Advantest | Tight oligopoly | High-performance DRAM and AI memory need more test intensity |
| Probe cards | FormFactor | Tight oligopoly | Wafer sort and advanced DRAM / HBM test become harder as stacks and speeds rise |
| SSD controllers | Silicon Motion, Phison, in-house NAND vendors | Merchant bottleneck | AI SSDs still need qualified controller and firmware stacks |
| Server DRAM / enterprise SSD | Micron, SK hynix, Samsung, Kioxia, SanDisk | AI levered but more competitive | Inference growth broadens the cycle beyond HBM |

## What Breaks If These Layers Tighten

### 1. HBM supply

If HBM supply misses, GPU and accelerator shipments slow even if the compute die is ready. That is why HBM is the first bottleneck to own.

### 2. Packaging and bonding

Making HBM dies is not enough. The stack must be bonded, packaged, and yield-qualified. This creates a second bottleneck in TC bonders and advanced packaging lines.

### 3. Test and probe

As memory speed, density, and thermal complexity increase, test time and probe complexity rise. That is why Advantest and FormFactor can outperform broader semi-cap names in the same cycle.

### 4. Enterprise SSD and server DRAM

Inference pushes more data into fast storage and higher-capacity memory tiers. The next winners after HBM are often server DRAM and eSSD suppliers.

## Company Map

### Direct memory leaders

- **SK hynix (000660.KS)**: HBM leader, strong conventional server DRAM and eSSD tailwind
- **Micron (MU)**: Pure-play U.S. memory beneficiary with HBM4, 1-gamma DRAM, and AI SSD leverage
- **Samsung Electronics (005930.KS)**: Scale leader with HBM4, enterprise SSD, and balance-sheet optionality, but lower execution credibility today

### HBM packaging / test chokepoints

- **Hanmi Semiconductor (042700.KS)**: TC bonder bottleneck for HBM stacks
- **ASMPT (0522.HK)**: TCB leader pushing into HBM4 and advanced packaging
- **TOWA (6315.T)**: compression and singulation equipment leveraged to memory and advanced packaging
- **Advantest (6857.T)**: Memory tester demand tied to high-performance DRAM and AI memory
- **FormFactor (FORM)**: Probe-card enabler shipping to all three major HBM makers

### Second-wave beneficiaries

- **Kioxia (285A.T)**: NAND / eSSD leverage if AI storage tightens further
- **SanDisk (SNDK)**: Flash and enterprise SSD optionality
- **Silicon Motion (SIMO)**: Merchant SSD controller leader with AI boot-drive and enterprise ramp
- **Walton Advanced Engineering (8110.TW)**: memory packaging and test specialist with concentrated backend know-how
- **Tokyo Electron (8035.T)** / **Lam Research (LRCX)**: Memory capex and cleanroom expansion leverage
- **Amkor (AMKR)**: outsourced advanced packaging and test capacity with U.S. AI supply-chain optionality

## Key Risks To The Theme

1. AI capex slows faster than memory suppliers expect
2. HBM pricing normalizes before capacity expansions are absorbed
3. Samsung closes the HBM execution gap faster than expected, compressing leader economics
4. Packaging and test bottlenecks loosen quicker than wafer supply
5. A broad semiconductor selloff overwhelms the still-correct memory thesis
