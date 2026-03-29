# Complete Starlink BOM & Component-Level Teardown Analysis
## Date: 2026-03-28

## Critical Chokepoint Summary

### Tier 1 — Irreplaceable Dependencies
| Supplier | What | Why It's a Chokepoint |
|----------|------|----------------------|
| **STM** | Custom SoCs (Catson/Catapult), beamformers (Shiraz), RF FEMs (Pulsar/Pulsarad), GNSS, MEMS, motor drivers, secure elements | 5B+ chips, decade co-design, custom ASICs with SpaceX codenames. THE single biggest dependency |
| **AMD** | Versal AI Core adaptive SoC in every V2+ satellite | Only source of space-grade adaptive SoCs at this performance. Handles beamforming + routing + AI |
| **Filtronic** | E-band GaN SSPAs for ground stations | Sole supplier of next-gen ground station amplifiers. $62.5M order |
| **Cadence (CDNS)** | Sierra SerDes IP in Catapult SoC + EDA tools | Replacing Xilinx PHY with Cadence IP = deep architectural lock-in |
| **ARM** | Cortex-A53 CPU IP in every terminal SoC | All Starlink SoCs are ARM-based; no alternative at this power envelope |
| **Xsight Labs** (PRIVATE) | X2 12.8Tbps switch for V3 satellites (TSMC N5) | No substitute for terabit-scale space-rated switching. Backed by AMD/Intel/Marvell |

### Tier 2 — High Volume, Confirmed
| Supplier | What | Volume/Significance |
|----------|------|-------------------|
| **MPWR** | 8+ PMICs per terminal (MP8892, MP8771, MP20073, MP8795 x5) | Every terminal = 8+ MPS chips. Massive volume |
| **MediaTek** | WiFi SoCs in Gen2/3 routers (MT7629, MT8986) | Replaced Qualcomm; in every current router |
| **Renesas** | GreenPAK PoE controller + beamforming transceivers | Dual role in both power and RF |
| **Infineon** | Power MOSFETs (FDMS86182) | In terminal power path |
| **Micron** | 4GB eMMC flash + DRAM | Memory in terminals and routers |

### Tier 3 — Confirmed but Commodity/Replaceable
TXN (DC/DC), DIOD (shunt reg), ON Semi (MOSFETs), Littelfuse (TVS), Qualcomm (Gen1 router only), Skyworks (Gen1 router RF), Marvell (Gen2 Ethernet PHY), Winbond (flash), GigaDevice (flash), Chicony Power (power supplies)

## Complete Terminal BOM (User Terminal "Dishy")
| Category | Key Components | Supplier |
|----------|---------------|----------|
| Main SoC | Catson (quad Cortex-A53) / Catapult (next-gen) | STM (custom) |
| Digital Beamformers | Shiraz (16 in Rev3, 6 in Rev4, 2 in Mini) | STM (custom) |
| RF Front-End Modules | Pulsar/Pulsarad (hundreds per terminal) | STM (custom) |
| GNSS | STA8089 Teseo receiver | STM |
| MEMS | 6-axis accel/gyro | STM |
| Motor Control | STSPIN840 dual DC motor driver | STM |
| Power (primary) | L3751 48V-to-12V buck | STM |
| Power (PMICs) | MP8892, MP8771, MP20073, MP8795 x5 | MPWR |
| Power (alternative) | LM5146, TL4050, LM7321MF | TXN |
| Power Supervisor | MAX16056 | ADI |
| PoE Controller | SLG46620 GreenPAK | Renesas |
| Power MOSFETs | FDMS86182 x2 | ON Semi |
| Protection | SMAJ10, DDZ8V2C (TVS/Zener) | DIOD |
| Protection | P6SMB (TVS) | Littelfuse |
| Memory | MTFC4GACAJCN-1M (4GB eMMC) + DDR3 | Micron |
| Clock | CADY (60MHz distribution) | SpaceX/STM custom |
| Secure Element | STSAFE-A110 | STM |
| Connectors | BM10B-ZPDSS, BM05B-ZESS, ZER-05V | JST (private) |
| PoE Transformer | 7490220126 | Wurth Elektronik (private) |

## Router BOM (Across Generations)
| Gen | WiFi SoC | Ethernet PHY | WiFi RF Frontend | Flash | Power |
|-----|----------|-------------|-----------------|-------|-------|
| Gen1 | Qualcomm IPQ4018 | Qualcomm QCA8072 | Skyworks SKY85743/8533 | GigaDevice + Winbond | TXN TPS2378/LM5116 |
| Gen2 | MediaTek MT7629 | Marvell 88E1512 | — | — | — |
| Gen3 | MediaTek MT8986 | Airoha EN8801SN | — | Micron D9PSK | — |
| All | STM STSAFE-A110 (secure element) | | | | |

## Satellite BOM (V2 Mini / V3)
| Component | Supplier | Notes |
|-----------|----------|-------|
| Main SoC/FPGA | AMD Versal AI Core | CEO-confirmed |
| Network Switch (V3) | Xsight Labs X2 (PRIVATE) | 12.8Tbps on TSMC N5 |
| Laser ISL (x3) | SpaceX IN-HOUSE | 200Gbps per link |
| Hall-effect thrusters | SpaceX IN-HOUSE | Argon-fueled (V2+) |
| Solar panels | SpaceX IN-HOUSE (silicon) | Chose Si over GaAs for cost |
| Star tracker | SpaceX IN-HOUSE | |
| Reaction wheels (x4) | SpaceX IN-HOUSE | Aluminum flywheel, demisable |

## Falcon 9 / Starship Components
| Component | Supplier | Notes |
|-----------|----------|-------|
| Flight computers | Intel or AMD (x86) | Triple-redundant, Linux |
| Engine/grid fin control | NXP (PowerPC MCUs) | Probable |
| Stainless steel | Steel Dynamics (STLD) | Starship airframe |
| Carbon fiber | Toray (3402.T) via TenCate | Falcon 9 composites |
| 3D printing | Velo3D (VELO) | 22+ Sapphire machines; Raptor parts |
| Superalloys | SpaceX in-house SX300/SX500 | Proprietary Inconel variants |
| Heat shield tiles | SpaceX in-house "Bakery" | ~18,000 ceramic hexagonal tiles per Starship |
