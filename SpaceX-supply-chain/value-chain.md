# SpaceX Supply Chain — Value Chain & Chokepoint Map

## Core Thesis

SpaceX is building two of the largest hardware supply chains in history simultaneously:
1. **Starship** — the largest and most reusable rocket ever built, driving demand for stainless steel, superalloys, carbon fiber, turbopumps, cryogenic systems, and additive manufacturing
2. **Starlink** — a 6,000+ (and growing) satellite mega-constellation requiring phased-array antennas, RF components, laser comm terminals, custom ASICs, and massive ground infrastructure

The investment question: **Which public companies control chokepoints in these supply chains that SpaceX cannot easily in-house or multi-source?**

SpaceX is famously vertical — they make their own engines, avionics, and user terminal chips. The best investments are in layers SpaceX *must* buy externally: raw materials, specialty alloys, industrial gases, certain RF components, PCBs, and equipment.

## SpaceX Hardware Flow Map

```
RAW MATERIALS & SUBSTRATES
  ATI (Ti/Ni superalloys) / CRS (specialty alloys) / STLD (stainless) / HXL+TRYIY/3402.T (carbon fiber)
  MTRN (beryllium) / SeAH Besteel (alloy near Starbase) / NIC (nickel)
  ACX.MC/Haynes (HASTELLOY superalloys, speculated) / 347700.KQ Sphere Corp (superalloy, confirmed)
                ↓
FORGINGS, MACHINED PARTS & FASTENERS
  SIF (closed-die forgings) / GHM (turbopumps?) / HEI (PMA parts)
  HWM (aerospace fasteners + superalloy castings, speculated)
                ↓
ADDITIVE MANUFACTURING
  VELO (large-format metal 3D printing for engine parts)
                ↓
SUBASSEMBLIES & STRUCTURES
  DCO (aerostructures, electronics) / ATRO (test, power) / MOG.A (valves, actuators)
                ↓
PROPULSION & FLUID SYSTEMS
  PH (cryogenic valves, seals) / TDG (pumps, valves, igniters) / MOG.A (isolation valves)
  ETN (cryogenic valves/tanks, speculated) — note: Marotta Controls (private) is confirmed primary
                ↓
PROPELLANTS & LAUNCH SUPPORT
  LIN + APD (LOX, helium, N2) / AI.PA Air Liquide (LOX at KSC, confirmed)
  GTLS (propellant storage — being acquired by Baker Hughes)
                ↓
LAUNCH
  Falcon 9 / Falcon Heavy / Starship
```

```
STARLINK SATELLITE BUILD
  STM (RF antenna ICs, CONFIRMED) / AMD Versal (adaptive SoC, CONFIRMED) / FLTCF (RF)
  3491.TWO + 6568.TWO (RF/microwave) / 3105.TW Win Semi (GaAs foundry, confirmed)
  MPWR (power) / TXN (DC/DC) / DIOD (shunt reg)
  MCHP (rad-hard MCUs, probable — Starshield/military) / NXPI (PowerPC MCUs, probable — Falcon 9)
  Laser ISL terminals — SpaceX in-house (8,000+ in orbit)
  2313.TW Compeq (PCBs, confirmed) / 2355.TW Chin-Poon (PCBs, confirmed)
  2383.TW Elite Material (HF PCB laminates, confirmed) / 3305.TW Shenmao (solder, confirmed)
                ↓
STARLINK USER TERMINAL
  Custom SpaceX ASIC (Catson/Catapult) / ARM (Cortex-A53 IP, confirmed)
  STM (phased-array antenna ICs) / 6723.T Renesas (GreenPAK + beamforming, confirmed)
  MU (eMMC flash, confirmed) / 2344.TW Winbond (NAND flash, confirmed)
  IFX.DE + ON (power MOSFETs, confirmed) / ADI (power supervisor, confirmed)
  MPWR (power ICs, confirmed) / LFUS (TVS protection, probable)
  6285.TW WNC (assembly, confirmed Vietnam) / 6412.TW Chicony Power (PSU, confirmed)
                ↓
STARLINK ROUTER
  2454.TW MediaTek (Wi-Fi SoC, confirmed) / SWKS (RF frontend, confirmed Gen1)
  MRVL (Ethernet PHY, confirmed Gen2) / 603986.SS GigaDevice (NOR flash, confirmed Gen1)
  QCOM (X105 D2C modem — handset side, confirmed)
                ↓
GROUND INFRASTRUCTURE
  FLTCF Filtronic (GaN SSPAs, CONFIRMED STRATEGIC PARTNER)
  6271.TW Tong Hsing (RF transceiver, speculated exclusive)
  2312.TW Kinpo (motherboard) / 2313.TW Compeq (PCB)
                ↓
EDA / CHIP DESIGN TOOLS (cross-cutting)
  SNPS Synopsys + CDNS Cadence (EDA duopoly, confirmed) — used for SpaceX custom ASIC design
  LSCC Lattice (rad-tolerant FPGAs, speculated — AMD Versal is confirmed choice)
```

## Where the Chokepoints Likely Are

| Layer | Key Players | Chokepoint Assessment | Why It Matters |
|-------|-------------|-----------------------|----------------|
| Titanium & superalloys | ATI, CRS | Duopoly for aerospace-grade | Raptor engines need specialty Ti and Ni alloys; long qualification |
| Carbon fiber (aerospace) | Hexcel, Toray | Tight duopoly | Fairings, interstages, payload adapters; aerospace-qual takes years |
| Closed-die forgings | SIF, others | Niche chokepoint | Turbine disks and rings for Merlin/Raptor; few qualified forgers |
| Cryogenic fluid systems | PH, MOG.A, TDG | Oligopoly with moat | Rocket plumbing is life-critical; qualification is extreme |
| Industrial gases (LOX) | LIN, APD | Duopoly | Every launch needs LOX; proximity to launch site matters |
| Propellant handling | GTLS | Niche leader | Cryogenic storage at launch complexes |
| Metal 3D printing | VELO | Early mover | SuperDraco chambers, engine parts; but SpaceX also prints in-house |
| Laser ISL terminals | SpaceX in-house | NOT a chokepoint | SpaceX builds own laser links; Mynaric was never a supplier (bankrupt) |
| RF SSPAs (ground station) | FLTCF (Filtronic) | **HIGH chokepoint** | Strategic partner; GaN E-band SSPAs; min $10M/yr contract; few alternatives |
| RF modules (satellite) | 3491.TWO (UMT) | **HIGH chokepoint** | Confirmed direct supplier; Vietnam expansion at SpaceX request |
| Starlink RF antenna ICs | STM | **HIGHEST chokepoint** | 5B+ co-designed BiCMOS chips; decade partnership; doubling by 2027 |
| Satellite SoC | AMD (Versal) | Duopoly chokepoint | CEO-confirmed; every V2 satellite; ASIC risk in 3-5yr |
| **HELIUM** | **APD, LIN** | **ACTIVE CRISIS** | **Qatar shutdown = 1/3 global supply offline; 40-100% price surge; no substitute; essential for launch ops** |
| Satellite PCBs | 2313.TW (Compeq) | Moderate chokepoint | Main supplier since 2017; but SpaceX building own PCB factory in Texas |
| HF PCB laminates | 2383.TW (Elite Material) | Oligopoly with moat | Specialty high-freq laminates for satellite; qualification barriers |
| Beryllium | MTRN (Materion) | Monopoly chokepoint | Sole US producer; govt-backed; but small $ content per satellite |
| Rad-hard semiconductors | MCHP (Microchip) | Oligopoly with moat | 19% space-grade share; relevant for Starshield, less for commercial Starlink |
| Aerospace fasteners | HWM (Howmet) | Oligopoly with moat | #1 global fastener supplier; every rocket needs fasteners; unconfirmed SpaceX |
| D2C handset modem | QCOM (Qualcomm) | Duopoly chokepoint | X105 NR-NTN modem = native Starlink in every flagship phone; 12-18mo lead |
| GaAs RF foundry | 3105.TW (Win Semi) | Monopoly chokepoint | 65-79% global GaAs foundry share; confirmed Starlink RF front-ends |

## CRITICAL: SpaceX Vertical Integration Map (Updated 2026-03-28)

SpaceX is aggressively in-housing. Key findings from deep DD:

| Component | SpaceX In-House Status | Impact on Suppliers |
|-----------|----------------------|---------------------|
| Raptor engines + turbopumps | Fully in-house (3D printed, SX500 alloy) | GHM/Barber-Nichols historical only |
| Rocket valves | Mostly in-house; Marotta Controls for CoRe valves | MOG.A/PH not primary |
| Avionics | Fully in-house | No external play |
| Custom SoC/ASIC | In-house design (fabbed by STM) | STM is fab partner |
| Laser ISL terminals | Fully in-house (8,000+ in orbit) | Mynaric was NEVER supplier |
| GSE tanks | In-house (Starship-derived hardware) | GTLS bypassed |
| PCB factory | **Operational in Texas** | Headwind for Compeq/Chin-Poon long-term |
| FOPLP chip packaging | **Building in Texas, Q3 2026 start** | Headwind for STM packaging + Innolux |
| User terminal assembly | Outsourced to WNC (Vietnam) | Still external |
| RF SSPAs (ground station) | Outsourced to Filtronic | Still external |
| RF antenna chips | Outsourced to STM (co-designed) | Still external but packaging at risk |
| Specialty alloys | Buy externally (SeAH, Sphere Corp, ATI) | Still external |

**Key risk**: SpaceX's Texas FOPLP plant (700mm x 700mm substrates, largest in industry) starts limited production Q3 2026. This directly competes with STM's Panel Level Packaging for Starlink RF chips. STM's co-design moat remains but packaging revenue is at risk medium-term.

## Key Research Questions

1. **SpaceX is building its own PCB factory and FOPLP chip packaging plant in Texas** — confirmed suppliers should expect eventual in-housing pressure
2. **Which suppliers are confirmed vs. speculated?** 38 of 71 companies researched have confirmed relationships
3. **Geopolitical migration**: SpaceX systematically moving Taiwan suppliers to Vietnam/Thailand (WNC, UMT, Chin-Poon, Shenmao)
4. **IPO catalyst timing?** SpaceX IPO reportedly filing soon (Bloomberg, March 2026). Confirmed suppliers get narrative bid
5. **Customer concentration risk?** Filtronic at 83%, Sphere Corp majority, UMT >50% — high reward but binary risk
