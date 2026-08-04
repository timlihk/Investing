// Defense Industrial Base — Chokepoint dataset
// Market data: Bloomberg, 2026-08-04. Scores/tiers/verdicts are analyst judgement.
// Chokepoint inputs (breakage/alternatives/qualification/cogs/capacity) are 1-5 each; see chokepoint-method.md.
// `capexSide` is the theme's key discriminator:
//   "spends"   = bears the capacity capex (FCF drag now, capacity later)
//   "receives" = collects the capacity capex (revenue now)
//   "both"     = spending on its own plant while selling into others'

window.DIB_META = {
  asOf: "2026-08-04",
  priceSource: "Bloomberg (PX_LAST, CHG_PCT_YTD, BEST_PE_RATIO, BEST_TARGET_PRICE, EQY_REC_CONS)",
  liveSource: "/api/market/quotes (Yahoo, delayed)",
  universe: 68,
  note: "Prices are Bloomberg 2026-08-04. Live column, when it loads, is Yahoo delayed and will differ."
};

window.DIB_LAYERS = [
  {
    id: "energetics",
    name: "Energetic Chemicals",
    blurb: "Oxidisers, nitrocellulose, RDX/HMX, TNT, propellant. The hardest layer to relieve — permits, EPA, 5-7yr lead times, an ageing specialist workforce. Money alone does not fix it.",
    evidence: "155mm output still ~56k shells/month vs the 100k goal as of Feb 2026, after $6bn invested."
  },
  {
    id: "srm",
    name: "Solid Rocket Motors",
    blurb: "Cast, cure, case and nozzle. US domestic SRM makers went from six to two over ~30 years. Named by CSIS and the Pentagon as the binding constraint on missile output.",
    evidence: "Both US incumbents are mid-expansion: L3Harris >$1bn (Orange County VA), Northrop $178m NAVSEA (Allegany, doubling by autumn 2026)."
  },
  {
    id: "cases",
    name: "Cases, Ablatives & Nozzles",
    blurb: "Composite motor cases, ablative liners, throat/nozzle materials. Cheap relative to the missile, impossible to substitute quickly, long qualification.",
    evidence: "DoD funded 3D-printed motor-case prototyping ($25m) and nozzle insulation material testing ($12m+) in FY25."
  },
  {
    id: "metals",
    name: "Structural Metals & Forgings",
    blurb: "Aerospace-grade titanium, nickel alloys, large forgings. The bottleneck is not generic metal but qualified premium alloy and forging capacity.",
    evidence: "The US has NO domestic titanium sponge production. Japan supplied 73% of all US titanium sponge imports in 2025."
  },
  {
    id: "guidance",
    name: "Guidance, Seekers & RF",
    blurb: "Seekers, RF front-ends, rad-hard and GaN microelectronics. Relieving the motor bottleneck simply exposes this one.",
    evidence: "Japan's PAC-3 output is capped near 30/yr; doubling to ~60 is gated on Boeing-built seekers, not on missile assembly."
  },
  {
    id: "components",
    name: "Actuation, Power & Precision",
    blurb: "Control actuation, valves, bearings, gearboxes, power electronics. Fragmented but qualification-locked.",
    evidence: "This is where 2026 performance concentrated — DCO +92%, MOG/A +63%, CW +36% YTD."
  },
  {
    id: "minerals",
    name: "Magnets & Critical Minerals",
    blurb: "NdFeB magnets and the heavy rare earths (Dy, Tb, Ho) that let them survive >200C. A hard regulatory forcing function, not a demand forecast.",
    evidence: "DoD prohibits China-origin rare-earth magnet material in US military platforms from 2027. US govt RE investment $7.6bn (2025-Jun 2026), +321%."
  },
  {
    id: "primes",
    name: "Integration / Primes",
    blurb: "The systems houses. They set the demand signal and bear the capacity capex — which is exactly why they de-rate while their suppliers re-rate.",
    evidence: "FY27 request: ~$95bn missiles & munitions, roughly a tripling. Golden Dome $17.5bn — but only $400m sits in the base budget."
  }
];

// c = [breakage, alternatives, qualification, cogs, capacity]
window.DIB_COMPANIES = [
  // ---------- ENERGETIC CHEMICALS ----------
  { t:"NEU US", y:"NEU", n:"NewMarket (AMPAC)", reg:"US", layer:"energetics",
    c:[5,5,5,5,5], score:76, verdict:"BUY", px:854.33, ccy:"USD", ytd:24.31, pe:null, tgt:null, up:null,
    capexSide:"receives", risk:"Medium",
    role:"Sole large-scale US producer of ammonium perchlorate — the oxidiser in every solid rocket motor.",
    cat:"$100m AMPAC expansion approved, >50% capacity increase at Cedar City, UT.",
    one:"The narrowest point in the entire Western missile chain. But AMPAC is ~170 employees inside a petroleum-additives company — the exposure is real and heavily diluted." },

  { t:"012450 KS", y:"012450.KS", n:"Hanwha Aerospace", reg:"KR", layer:"energetics",
    c:[4,3,4,3,4], score:78, verdict:"BUY", px:986000, ccy:"KRW", ytd:3.57, pe:17.2, tgt:1688333, up:71.2,
    capexSide:"both", risk:"Medium",
    role:"K9 artillery, ammunition, propellant — and now building US energetics capacity on US soil.",
    cat:"~$1.3bn Pine Bluff Arsenal plant + ~$1bn US modular-charge facility (NC, NG, NQ, triple-base propellant), construction from 2026, full production 2030.",
    one:"Still the best risk/reward in the book — 17.2x, +71% consensus gap, unanimous Buy. But it rallied ~9% on 4 Aug and is now UP 3.6% YTD: the 'down on the year' leg of the original pitch is gone, the valuation leg is not. No specific catalyst for the move was identified in available sources." },

  { t:"000880 KS", y:"000880.KS", n:"Hanwha Corporation", reg:"KR", layer:"energetics",
    c:[3,3,3,4,3], score:73, verdict:"BUY", px:83800, ccy:"KRW", ytd:2.32, pe:12.6, tgt:166975, up:99.3,
    capexSide:"both", risk:"Medium",
    role:"Holdco over the Hanwha explosives and defence complex.",
    cat:"Holdco discount to a re-rating operating chain.",
    one:"12.6x with a +99% consensus gap and 4.92 rec — but ⚠ STALE PRINT: unchanged at ₩83,800 with no volume on 4 Aug while the opco rallied 9%. Treat this mark as not fresh. The holdco route into the same energetics build-out, cheaper than the opco." },

  { t:"CHG LN", y:"CHG.L", n:"Chemring", reg:"EU", layer:"energetics",
    c:[4,4,4,4,4], score:73, verdict:"HOLD", px:604.5, ccy:"GBp", ytd:27.94, pe:23.3, tgt:633.29, up:4.8,
    capexSide:"receives", risk:"Medium",
    role:"European energetics pure-play — Chemring Nobel explosives plus countermeasures.",
    cat:"EUR66.7m of EU funding to double Chemring Nobel explosives capacity.",
    one:"The cleanest listed European energetics asset and unanimous Buy (5.00) — but +27% YTD leaves only ~5% to consensus target. Right thesis, late entry." },

  { t:"RHM GY", y:"RHM.DE", n:"Rheinmetall", reg:"EU", layer:"energetics",
    c:[4,3,3,3,4], score:71, verdict:"HOLD", px:1175, ccy:"EUR", ytd:-24.73, pe:31.4, tgt:1631.04, up:38.8,
    capexSide:"both", risk:"High",
    role:"Genuinely vertically integrated into the bottleneck: Nitrochemie propellant, the Hagedorn-NC nitrocellulose acquisition, 1,900 t/yr RDX at Unterluess.",
    cat:"Nitrocellulose vertical integration; Bundeswehr order flow.",
    one:"Owns the energetics layer, down 25%, +39% to target — and is also the single most headline-sensitive stock in the theme. F126 proved German procurement can simply be cancelled." },

  { t:"OLN US", y:"OLN", n:"Olin (Winchester)", reg:"US", layer:"energetics",
    c:[3,3,3,4,3], score:49, verdict:"AVOID", px:18.62, ccy:"USD", ytd:-10.61, pe:37.4, tgt:22.79, up:22.4,
    capexSide:"receives", risk:"High",
    role:"Winchester small-arms ammunition; operates the Lake City Army Ammunition Plant.",
    cat:"Ammunition demand; chlor-alkali cycle trough.",
    one:"The ammo optionality is real but immaterial against a $2.1bn chlor-alkali cyclical. You are buying a chemicals cycle, not a bottleneck." },

  { t:"103140 KS", y:"103140.KS", n:"Poongsan", reg:"KR", layer:"energetics",
    c:[3,2,3,3,3], score:58, verdict:"HOLD", px:69100, ccy:"KRW", ytd:-35.54, pe:null, tgt:113000, up:63.5,
    capexSide:"receives", risk:"High",
    role:"Korea's ammunition and brass cartridge-case producer.",
    cat:"None active — Hanwha halted its ~KRW1.5tn acquisition review of the ammunition business in April 2026.",
    one:"Orphaned pure-play ammo asset at -37% YTD. Either the cheapest bottleneck asset in Asia or a value trap; the broken deal removed the obvious re-rating path." },

  // ---------- SOLID ROCKET MOTORS ----------
  { t:"LHX US", y:"LHX", n:"L3Harris (Aerojet Rocketdyne)", reg:"US", layer:"srm",
    c:[5,4,5,3,5], score:75, verdict:"BUY", px:277.86, ccy:"USD", ytd:-5.35, pe:22.1, tgt:358.77, up:29.1,
    capexSide:"spends", risk:"Medium",
    role:"One of only two domestic solid rocket motor primes.",
    cat:"Missile-business separation/IPO (delayed). >$1bn Orange County VA expansion; $25m Huntsville AMF-South, +130k sqft.",
    one:"Beat and raised on 29 Jul and fell ~7% because missile capex ran +92% YTD. The capex crushing the stock is precisely what creates the 2028+ earnings." },

  { t:"NOC US", y:"NOC", n:"Northrop Grumman", reg:"US", layer:"srm",
    c:[5,4,5,3,5], score:75, verdict:"BUY", px:548.47, ccy:"USD", ytd:-3.81, pe:18.8, tgt:650.52, up:18.6,
    capexSide:"spends", risk:"Medium",
    role:"The other half of the US SRM duopoly; >$1bn invested in propulsion manufacturing since 2018.",
    cat:"$178m NAVSEA modular energetics facility at Allegany, doubling SRM capacity by autumn 2026. Sentinel restructuring added $7.6bn to backlog in Q2.",
    one:"Record $105bn backlog at 18.6x — but B-21 carries ~$2.0bn cumulative LRIP losses with $1.0bn accrual remaining. Cheaper than LHX, with fixed-price hair attached." },

  { t:"7013 JP", y:"7013.T", n:"IHI", reg:"JP", layer:"srm",
    c:[4,4,5,3,4], score:74, verdict:"BUY", px:2830, ccy:"JPY", ytd:2.74, pe:17.3, tgt:3766.54, up:33.1,
    capexSide:"spends", risk:"Medium",
    role:"Aero-engines and, through IHI Aerospace, Japan's solid rocket motor house.",
    cat:"Japanese standoff-missile build-out; allied co-production.",
    one:"The Japanese analogue of the cheap-duopoly idea: 17.3x, +2.7% YTD, +33% to consensus. NOTE: IHI Aerospace's SRM position is well established in industry but was not source-verified in this build — check segment disclosure before sizing." },

  { t:"KTOS US", y:"KTOS", n:"Kratos Defense", reg:"US", layer:"srm",
    c:[3,2,3,4,3], score:61, verdict:"HOLD", px:49.21, ccy:"USD", ytd:-35.17, pe:62.3, tgt:102.48, up:108.3,
    capexSide:"both", risk:"High",
    role:"New-entrant rocket motors, unmanned systems, space.",
    cat:"Record ~$2bn backlog; DoD funding for alternative SRM sources.",
    one:"Raised guidance and fell 35%. A de-rating on valuation and cash burn, not on demand — but 62x still asks a lot before the motor business is proven at scale." },

  // ---------- CASES, ABLATIVES & NOZZLES ----------
  { t:"PKE US", y:"PKE", n:"Park Aerospace", reg:"US", layer:"cases",
    c:[4,4,5,5,3], score:64, verdict:"HOLD", px:35.59, ccy:"USD", ytd:66.78, pe:53.1, tgt:42.5, up:19.4,
    capexSide:"receives", risk:"Medium",
    role:"Ablative and composite materials for rocket motor structures and nozzles.",
    cat:"Missile programme ramp pull-through.",
    one:"Textbook cheap-but-critical chokepoint (cogs 5/5). Already +67% YTD at 53.1x — the market found this one." },

  { t:"HXL US", y:"HXL", n:"Hexcel", reg:"US", layer:"cases",
    c:[4,4,5,3,3], score:65, verdict:"HOLD", px:102.28, ccy:"USD", ytd:38.4, pe:38.7, tgt:111.08, up:8.6,
    capexSide:"receives", risk:"Medium",
    role:"Aerospace-grade carbon fibre and prepreg; motor cases, fairings, structures.",
    cat:"Commercial aero recovery plus defence composite demand.",
    one:"+38% YTD and 9% to target. Qualification moat is genuine; the entry point is not." },

  { t:"3402 JP", y:"3402.T", n:"Toray Industries", reg:"JP", layer:"cases",
    c:[4,4,5,3,3], score:68, verdict:"HOLD", px:1139, ccy:"JPY", ytd:11.67, pe:18.5, tgt:1306.36, up:14.7,
    capexSide:"receives", risk:"Medium",
    role:"Dominant aerospace-grade carbon fibre producer.",
    cat:"Aerospace/defence composite demand; ex-China qualified supply.",
    one:"Cheapest way into the carbon-fibre duopoly at 18.5x vs Hexcel's 38.7x. Defence is a small slice of a large conglomerate — verify segment split before sizing." },

  { t:"SGL GY", y:"SGL.DE", n:"SGL Carbon", reg:"EU", layer:"cases",
    c:[3,3,4,4,2], score:56, verdict:"HOLD", px:4.025, ccy:"EUR", ytd:28.59, pe:null, tgt:4.64, up:15.3,
    capexSide:"receives", risk:"High",
    role:"Carbon and composite materials.",
    cat:"European defence composite demand.",
    one:"Small-cap optionality on European rearmament composites; weak balance sheet is the binding issue, not the thesis." },

  { t:"3401 JP", y:"3401.T", n:"Teijin", reg:"JP", layer:"cases",
    c:[4,3,4,3,3], score:56, verdict:"HOLD", px:1625, ccy:"JPY", ytd:19.88, pe:null, tgt:1634, up:0.6,
    capexSide:"receives", risk:"Medium",
    role:"Carbon fibre and aramid fibre.",
    cat:"Composite demand.",
    one:"Consensus sees ~1% upside and the rec is 2.67 — the only genuinely negative sell-side stance in this universe." },

  // ---------- STRUCTURAL METALS & FORGINGS ----------
  { t:"5726 JP", y:"5726.T", n:"Osaka Titanium", reg:"JP", layer:"metals",
    c:[5,4,5,4,5], score:68, verdict:"HOLD", px:2936, ccy:"JPY", ytd:56.09, pe:null, tgt:3350, up:14.1,
    capexSide:"receives", risk:"Medium",
    role:"World's #2 titanium sponge producer after VSMPO. The US has zero domestic sponge capacity.",
    cat:"JPY30bn expansion lifting capacity from 40kt to 50kt/yr; running near full.",
    one:"Chokepoint score 23/25 — one of the strongest in the book. Right thesis, wrong entry at +56% YTD." },

  { t:"5727 JP", y:"5727.T", n:"Toho Titanium", reg:"JP", layer:"metals",
    c:[5,4,5,4,5], score:71, verdict:"WATCH", px:null, ccy:"JPY", ytd:null, pe:null, tgt:null, up:null,
    capexSide:"receives", risk:"Medium",
    role:"The other Japanese titanium sponge producer.",
    cat:"Capacity expansion in response to loss of Russian supply.",
    one:"Same 23/25 chokepoint as Osaka Titanium and it has NOT run as hard — but the terminal returned no price for it in this build, so it is unpriced and unrated here. Verify before acting." },

  { t:"ATI US", y:"ATI", n:"ATI Inc", reg:"US", layer:"metals",
    c:[4,3,5,3,4], score:65, verdict:"HOLD", px:193.12, ccy:"USD", ytd:68.28, pe:41.6, tgt:206.56, up:7,
    capexSide:"receives", risk:"Medium",
    role:"Titanium and nickel alloys, aerospace-qualified.",
    cat:"A&D demand lifted 2026 guidance.",
    one:"+68% YTD at 41.6x with 7% to target. The trade worked; adding here is paying for it twice." },

  { t:"CRS US", y:"CRS", n:"Carpenter Technology", reg:"US", layer:"metals",
    c:[4,3,5,3,4], score:67, verdict:"HOLD", px:543.49, ccy:"USD", ytd:72.62, pe:40.7, tgt:633.89, up:16.6,
    capexSide:"receives", risk:"Medium",
    role:"Premium specialty alloys for aero and defence.",
    cat:"Qualified-alloy capacity tightness.",
    one:"Best-in-class specialty alloy franchise, +73% YTD. Quality is not in question; the multiple is." },

  { t:"HWM US", y:"HWM", n:"Howmet Aerospace", reg:"US", layer:"metals",
    c:[4,3,4,4,3], score:65, verdict:"HOLD", px:286.34, ccy:"USD", ytd:39.66, pe:54.3, tgt:313.52, up:9.5,
    capexSide:"receives", risk:"Medium",
    role:"Engineered castings, forgings and fasteners.",
    cat:"Aero build rates plus defence content.",
    one:"54.3x forward. Superb business, priced as one." },

  { t:"5631 JP", y:"5631.T", n:"Japan Steel Works", reg:"JP", layer:"metals",
    c:[4,3,4,3,4], score:73, verdict:"BUY", px:7495, ccy:"JPY", ytd:-2.4, pe:null, tgt:11570, up:54.4,
    capexSide:"receives", risk:"Medium",
    role:"Large forgings and ordnance — one of very few qualified heavy-forging houses in allied Asia.",
    cat:"Japanese defence build-out; forging capacity scarcity.",
    one:"Down on the year with a +54% consensus gap and 4.71 rec. The forging bottleneck at a price the US forging names stopped offering in January." },

  { t:"APAM NA", y:"APAM.AS", n:"Aperam", reg:"EU", layer:"metals",
    c:[2,2,3,3,2], score:58, verdict:"HOLD", px:46.42, ccy:"EUR", ytd:31.73, pe:14, tgt:51.79, up:11.6,
    capexSide:"receives", risk:"Medium",
    role:"Stainless and specialty steel.",
    cat:"European industrial demand.",
    one:"Cheap at 14.0x, but chokepoint 12/25 — this is a steel cyclical wearing a defence label." },

  // ---------- GUIDANCE, SEEKERS & RF ----------
  { t:"MTSI US", y:"MTSI", n:"MACOM Technology", reg:"US", layer:"guidance",
    c:[4,3,4,5,3], score:70, verdict:"HOLD", px:256.1, ccy:"USD", ytd:49.52, pe:42.9, tgt:399.43, up:56,
    capexSide:"receives", risk:"Medium",
    role:"RF, microwave and millimetre-wave semiconductors for radar and seekers.",
    cat:"Defence RF content growth alongside the AI optics cycle.",
    one:"Rare combination: +50% YTD and still a +56% consensus gap. Also the overlap name with the AI Photonics book — check you are not doubling the position." },

  { t:"QRVO US", y:"QRVO", n:"Qorvo", reg:"US", layer:"guidance",
    c:[3,3,4,5,2], score:61, verdict:"HOLD", px:89.49, ccy:"USD", ytd:5.89, pe:11.4, tgt:93.09, up:4,
    capexSide:"receives", risk:"Medium",
    role:"GaN and RF front-ends; defence and aerospace segment.",
    cat:"Defence RF mix shift.",
    one:"11.4x is the cheapest multiple in the universe, but the rec is 3.10 and the defence slice is small against a handset-driven P&L." },

  { t:"COHR US", y:"COHR", n:"Coherent", reg:"US", layer:"guidance",
    c:[3,3,4,4,3], score:66, verdict:"HOLD", px:288.14, ccy:"USD", ytd:56.11, pe:38.1, tgt:395.25, up:37.2,
    capexSide:"receives", risk:"Medium",
    role:"Optics, lasers and compound semiconductors; seeker and sensor materials.",
    cat:"AI optics plus defence sensing.",
    one:"+37% consensus gap after a +56% YTD run, but the driver is datacentre optics, not munitions. Overlaps the AI Photonics book." },

  { t:"TDY US", y:"TDY", n:"Teledyne", reg:"US", layer:"guidance",
    c:[3,3,4,4,3], score:67, verdict:"HOLD", px:670.56, ccy:"USD", ytd:31.29, pe:26.3, tgt:752.33, up:12.2,
    capexSide:"receives", risk:"Low",
    role:"Imaging, sensors, FLIR thermal for seekers and ISR.",
    cat:"Sensor content in precision munitions.",
    one:"Reasonably priced at 26.3x for the quality; a compounder, not a bottleneck trade." },

  { t:"MRCY US", y:"MRCY", n:"Mercury Systems", reg:"US", layer:"guidance",
    c:[3,3,4,4,2], score:51, verdict:"AVOID", px:105.79, ccy:"USD", ytd:44.9, pe:76.2, tgt:104.33, up:-1.4,
    capexSide:"receives", risk:"High",
    role:"Rad-hard and secure processing subsystems.",
    cat:"Missile and radar processing content.",
    one:"76.2x forward and now trading ABOVE consensus target after a +45% YTD run. The turnaround is more than priced." },

  { t:"6503 JP", y:"6503.T", n:"Mitsubishi Electric", reg:"JP", layer:"guidance",
    c:[3,3,4,3,3], score:68, verdict:"HOLD", px:5540, ccy:"JPY", ytd:20.83, pe:20.9, tgt:7164.29, up:29.3,
    capexSide:"receives", risk:"Low",
    role:"Radar, seeker and guidance electronics for Japanese missile programmes.",
    cat:"Japanese missile build-out.",
    one:"20.9x with +29% to target and a 4.50 rec. Sane valuation, diluted defence exposure." },

  { t:"HAG GY", y:"HAG.DE", n:"Hensoldt", reg:"EU", layer:"guidance",
    c:[3,3,4,3,2], score:58, verdict:"HOLD", px:86.34, ccy:"EUR", ytd:17.63, pe:48.8, tgt:89.72, up:3.9,
    capexSide:"receives", risk:"High",
    role:"Radar and electronic warfare sensors.",
    cat:"European air-defence sensor demand.",
    one:"48.8x for 4% upside. The European sensor premium has fully arrived." },

  { t:"HO FP", y:"HO.PA", n:"Thales", reg:"EU", layer:"guidance",
    c:[3,3,4,3,3], score:66, verdict:"HOLD", px:253.8, ccy:"EUR", ytd:10.44, pe:null, tgt:297, up:17,
    capexSide:"receives", risk:"Medium",
    role:"Sensors, avionics, air-defence electronics.",
    cat:"European air defence.",
    one:"The most reasonably valued of the large European electronics primes; still a spending-cycle bet, not a bottleneck." },

  { t:"BA US", y:"BA", n:"Boeing", reg:"US", layer:"guidance",
    c:[4,3,4,3,2], score:46, verdict:"AVOID", px:233.49, ccy:"USD", ytd:7.54, pe:189.7, tgt:274.04, up:17.4,
    capexSide:"spends", risk:"High",
    role:"Builds the PAC-3 seeker — the component gating Japanese interceptor output.",
    cat:"Seeker capacity relief would unlock allied PAC-3 volumes.",
    one:"Genuinely sits on a named bottleneck, but you cannot buy the seeker without buying all of Boeing at 190x. Wrong wrapper for the trade." },

  // ---------- ACTUATION, POWER & PRECISION ----------
  { t:"MOG/A US", y:"MOG-A", n:"Moog", reg:"US", layer:"components",
    c:[4,3,4,4,3], score:66, verdict:"HOLD", px:395.88, ccy:"USD", ytd:62.55, pe:34.8, tgt:448, up:13.2,
    capexSide:"receives", risk:"Medium",
    role:"Control actuation systems for missiles and launchers.",
    cat:"Missile actuation content growth.",
    one:"+63% YTD. Excellent qualification moat, fully discovered." },

  { t:"CW US", y:"CW", n:"Curtiss-Wright", reg:"US", layer:"components",
    c:[4,3,4,4,3], score:67, verdict:"HOLD", px:747.67, ccy:"USD", ytd:35.63, pe:47.9, tgt:822.17, up:10,
    capexSide:"receives", risk:"Low",
    role:"Naval, nuclear and defence electronics/actuation.",
    cat:"Submarine and munitions content.",
    one:"High-quality compounder at 47.9x. Own it for the franchise, not for this theme." },

  { t:"DCO US", y:"DCO", n:"Ducommun", reg:"US", layer:"components",
    c:[3,2,3,4,2], score:52, verdict:"AVOID", px:182.83, ccy:"USD", ytd:92.19, pe:40.7, tgt:181, up:-1,
    capexSide:"receives", risk:"High",
    role:"Structures and electronics subassemblies.",
    cat:"Munitions build rates.",
    one:"The best performer in the theme (+92% YTD) and now trading ABOVE consensus target with the weakest chokepoint score of the US components group. Do not chase." },

  { t:"RBC US", y:"RBC", n:"RBC Bearings", reg:"US", layer:"components",
    c:[3,3,4,4,3], score:63, verdict:"HOLD", px:570.27, ccy:"USD", ytd:27.17, pe:37.4, tgt:656.5, up:15.1,
    capexSide:"receives", risk:"Low",
    role:"Precision bearings and engineered components.",
    cat:"Aero and defence build rates.",
    one:"Quietly excellent, quietly expensive." },

  { t:"WWD US", y:"WWD", n:"Woodward", reg:"US", layer:"components",
    c:[3,3,4,4,3], score:63, verdict:"HOLD", px:363.57, ccy:"USD", ytd:20.26, pe:35.4, tgt:449.45, up:23.6,
    capexSide:"receives", risk:"Low",
    role:"Control systems, actuation and fuel systems.",
    cat:"Aero and defence actuation demand.",
    one:"+24% to target at 35.4x. Solid but not differentiated within this theme." },

  { t:"R3NK GY", y:"R3NK.DE", n:"Renk Group", reg:"EU", layer:"components",
    c:[4,3,4,4,3], score:68, verdict:"HOLD", px:49.02, ccy:"EUR", ytd:-8.58, pe:23.9, tgt:64.73, up:32,
    capexSide:"receives", risk:"High",
    role:"Tracked-vehicle transmissions and gearboxes — a genuinely narrow European supply layer.",
    cat:"European land systems ramp.",
    one:"Down 9% at 23.9x with a 4.78 rec and +32% gap. The most interesting European component name, and fully exposed to peace-deal headlines." },

  { t:"KRMN US", y:"KRMN", n:"Karman Holdings", reg:"US", layer:"components",
    c:[4,3,4,5,3], score:69, verdict:"HOLD", px:50.44, ccy:"USD", ytd:-31.06, pe:76, tgt:102, up:102.2,
    capexSide:"receives", risk:"High",
    role:"Payload fairings, propulsion structures and hypersonics components.",
    cat:"Hypersonics & Strategic Missile Defense grew 18.7% YoY in Q1 2026; FY26 guidance raised to $720-735m.",
    one:"The purest listed missile-component bottleneck play, -31% YTD with a +102% consensus gap — but still 76x. A sleeve, not a core." },

  { t:"003570 KS", y:"003570.KS", n:"SNT Dynamics", reg:"KR", layer:"components",
    c:[3,3,3,3,2], score:64, verdict:"HOLD", px:31100, ccy:"KRW", ytd:-32.76, pe:10.8, tgt:null, up:null,
    capexSide:"receives", risk:"High",
    role:"Powertrain and ordnance components for Korean land systems.",
    cat:"K2/K9 export pull-through.",
    one:"10.8x with a unanimous 5.00 rec after a 33% drawdown. Cheapest thing in the book, thinnest liquidity — and the terminal no longer returns a consensus target." },

  // ---------- MAGNETS & CRITICAL MINERALS ----------
  { t:"MP US", y:"MP", n:"MP Materials", reg:"US", layer:"minerals",
    c:[4,4,4,5,5], score:63, verdict:"HOLD", px:43.84, ccy:"USD", ytd:-13.22, pe:209.8, tgt:77.72, up:77.3,
    capexSide:"both", risk:"High",
    role:"The US rare-earth and magnet build-out.",
    cat:"DoD bans China-origin magnet material in US military platforms from 2027 — a hard regulatory forcing function.",
    one:"Chokepoint 22/25 and DOWN 13% into a legislated demand mandate. But 210x forward means you are underwriting 2028-2030 magnet volumes and nothing else." },

  { t:"USAR US", y:"USAR", n:"USA Rare Earth", reg:"US", layer:"minerals",
    c:[3,3,4,5,4], score:56, verdict:"SPEC", px:15.86, ccy:"USD", ytd:33.28, pe:null, tgt:37.14, up:134.2,
    capexSide:"spends", risk:"High",
    role:"US magnet manufacturing and heavy rare-earth resource.",
    cat:"2027 magnet-origin mandate; $7.6bn of US government RE investment since 2025.",
    one:"Unanimous 5.00 rec and +134% to target because there are no earnings to anchor on. Pure option on execution." },

  { t:"4063 JP", y:"4063.T", n:"Shin-Etsu Chemical", reg:"JP", layer:"minerals",
    c:[4,3,4,5,3], score:68, verdict:"HOLD", px:5901, ccy:"JPY", ytd:21.1, pe:18.8, tgt:7992.5, up:35.4,
    capexSide:"receives", risk:"Low",
    role:"Non-China NdFeB magnet supply.",
    cat:"2027 DoD magnet-origin mandate favours qualified ex-China producers.",
    one:"18.8x with +35% upside and a fortress balance sheet — but the magnet business is a rounding error against PVC and silicon wafers. Indirect exposure." },

  { t:"6762 JP", y:"6762.T", n:"TDK", reg:"JP", layer:"minerals",
    c:[4,3,4,5,3], score:71, verdict:"HOLD", px:3094, ccy:"JPY", ytd:39.94, pe:23, tgt:4228.33, up:36.7,
    capexSide:"receives", risk:"Medium",
    role:"Magnets and passive components; major non-China NdFeB capability.",
    cat:"Ex-China magnet qualification ahead of the 2027 mandate.",
    one:"+38% consensus gap after a +40% run. Same dilution caveat as Shin-Etsu — the magnet slice is small." },

  // ---------- INTEGRATION / PRIMES ----------
  { t:"LMT US", y:"LMT", n:"Lockheed Martin", reg:"US", layer:"primes",
    c:[5,3,5,1,4], score:69, verdict:"HOLD", px:586.29, ccy:"USD", ytd:21.22, pe:18.7, tgt:639.29, up:9,
    capexSide:"spends", risk:"Medium",
    role:"THAAD, PAC-3 MSE, PrSM, JASSM. The company issuing the headlines.",
    cat:"THAAD capacity quadrupling (Jan 2026 framework); PrSM to 550/yr; PAC-3 MSE tripled; >$9bn facility programme.",
    one:"The headline trade and the worst expression of it. +21% YTD, 9% to target, and the announcements are money leaving the building. Own the suppliers, not the spender." },

  { t:"RTX US", y:"RTX", n:"RTX", reg:"US", layer:"primes",
    c:[5,3,5,1,4], score:67, verdict:"HOLD", px:216.65, ccy:"USD", ytd:18.13, pe:29.4, tgt:234, up:8,
    capexSide:"spends", risk:"Medium",
    role:"Patriot, AMRAAM, Standard Missile, Coyote.",
    cat:"Interceptor replenishment demand.",
    one:"29.2x for 8.7% upside. Quality prime, no edge at this price." },

  { t:"GD US", y:"GD", n:"General Dynamics", reg:"US", layer:"primes",
    c:[4,3,4,2,3], score:65, verdict:"HOLD", px:382.43, ccy:"USD", ytd:13.6, pe:21.9, tgt:421.58, up:10.2,
    capexSide:"spends", risk:"Low",
    role:"GD-OTS holds real energetics and ammunition assets inside a diversified prime.",
    cat:"155mm ramp; submarine build.",
    one:"The energetics exposure is genuine but buried. If you want the bottleneck you can buy it more directly elsewhere." },

  { t:"HII US", y:"HII", n:"Huntington Ingalls", reg:"US", layer:"primes",
    c:[3,3,4,2,2], score:59, verdict:"HOLD", px:325.95, ccy:"USD", ytd:-4.15, pe:16.9, tgt:368.58, up:13.1,
    capexSide:"spends", risk:"Medium",
    role:"Naval shipbuilding.",
    cat:"Submarine industrial base funding.",
    one:"Cheap at 17x and down on the year, but shipbuilding labour is a different bottleneck from the one this theme is about." },

  { t:"7011 JP", y:"7011.T", n:"Mitsubishi Heavy Industries", reg:"JP", layer:"primes",
    c:[3,3,5,2,4], score:69, verdict:"HOLD", px:3737, ccy:"JPY", ytd:-2.68, pe:30.8, tgt:5404.75, up:44.6,
    capexSide:"both", risk:"Medium",
    role:"Licence-produces PAC-3 interceptors in Japan.",
    cat:"First-ever export of Japan-built PAC-3 to the US completed 20 Nov 2025 (~10 units per Nikkei). Output ~30/yr with scope to double to ~60 once Boeing seekers clear. PAC-3 MSE and AMRAAM co-production under discussion.",
    one:"A structural policy shift, not a war trade — which is exactly why it survives a peace deal. Expensive at 30.8x; size accordingly." },

  { t:"7012 JP", y:"7012.T", n:"Kawasaki Heavy", reg:"JP", layer:"primes",
    c:[3,2,3,2,3], score:61, verdict:"HOLD", px:2743, ccy:"JPY", ytd:32.13, pe:19.6, tgt:3895, up:42,
    capexSide:"spends", risk:"Medium",
    role:"Military aircraft and submarines.",
    cat:"Japanese defence budget growth.",
    one:"+42% to target but already +32% YTD, and platform assembly is the widest part of the chain, not the narrowest." },

  { t:"079550 KS", y:"079550.KS", n:"LIG Nex1", reg:"KR", layer:"primes",
    c:[3,3,4,2,3], score:61, verdict:"HOLD", px:780000, ccy:"KRW", ytd:83.75, pe:45.9, tgt:1096875, up:40.6,
    capexSide:"spends", risk:"High",
    role:"Korean guided missiles — Cheongung/KM-SAM.",
    cat:"Middle East and European air-defence exports.",
    one:"The Korean missile pure-play, now +84% YTD at 45.9x after ripping ~14% on 4 Aug. The one Korean name that never de-rated — so the margin of safety sits elsewhere in the complex." },

  { t:"272210 KS", y:"272210.KS", n:"Hanwha Systems", reg:"KR", layer:"guidance",
    c:[3,3,4,3,3], score:68, verdict:"HOLD", px:66300, ccy:"KRW", ytd:21.88, pe:null, tgt:112500, up:69.7,
    capexSide:"receives", risk:"High",
    role:"Radar, EO/IR and combat systems.",
    cat:"Korean and export sensor demand.",
    one:"+70% consensus gap, but corrected 64% from its peak — the widest gap between sell-side and tape in the Korean group." },

  { t:"042660 KS", y:"042660.KS", n:"Hanwha Ocean", reg:"KR", layer:"primes",
    c:[2,3,3,2,2], score:68, verdict:"HOLD", px:85300, ccy:"KRW", ytd:-24.98, pe:14.1, tgt:139600, up:63.7,
    capexSide:"both", risk:"High",
    role:"Naval shipbuilding, including US yard investment.",
    cat:"US shipbuilding cooperation; MRO work.",
    one:"14.1x with +64% upside after a 25% drawdown. A different bottleneck (yards and labour) than this theme, included for completeness." },

  { t:"064350 KS", y:"064350.KS", n:"Hyundai Rotem", reg:"KR", layer:"primes",
    c:[2,2,3,2,3], score:66, verdict:"HOLD", px:135400, ccy:"KRW", ytd:-28.28, pe:15, tgt:288250, up:112.9,
    capexSide:"spends", risk:"High",
    role:"K2 main battle tanks.",
    cat:"European and Middle East tank exports.",
    one:"The largest consensus gap in the entire universe (+113%) at 15.0x — and the weakest chokepoint score (12/25). Cheap for a reason: platform assembly has alternatives." },

  { t:"047810 KS", y:"047810.KS", n:"Korea Aerospace Industries", reg:"KR", layer:"primes",
    c:[3,2,3,2,3], score:60, verdict:"HOLD", px:134700, ccy:"KRW", ytd:17.85, pe:31.6, tgt:184166.67, up:36.7,
    capexSide:"spends", risk:"Medium",
    role:"FA-50 light fighters and aerostructures.",
    cat:"Export campaigns.",
    one:"31.6x for an assembler. The least chokepoint-like of the Korean names." },

  { t:"BA/ LN", y:"BA.L", n:"BAE Systems", reg:"EU", layer:"primes",
    c:[4,3,4,2,3], score:67, verdict:"HOLD", px:2143, ccy:"GBp", ytd:25.03, pe:24.1, tgt:2341.56, up:9.3,
    capexSide:"spends", risk:"Low",
    role:"Diversified prime with real energetics and explosives assets (Glascoed) plus the Roxel SRM JV.",
    cat:"UK and US munitions ramp.",
    one:"Owns genuine energetics capacity, but it is 9% from target after a +25% year. Quality hold, not a fresh entry." },

  { t:"LDO IM", y:"LDO.MI", n:"Leonardo", reg:"EU", layer:"primes",
    c:[3,2,3,2,3], score:61, verdict:"HOLD", px:54.71, ccy:"EUR", ytd:11.29, pe:19.8, tgt:68.6, up:25.4,
    capexSide:"spends", risk:"Medium",
    role:"Diversified Italian prime.",
    cat:"European defence budgets; MBDA stake.",
    one:"Reasonable at 19.8x with +25% upside; the MBDA stake is the interesting asset and it is not consolidated." },

  { t:"SAABB SS", y:"SAAB-B.ST", n:"Saab", reg:"EU", layer:"primes",
    c:[3,3,4,2,3], score:61, verdict:"HOLD", px:615.1, ccy:"SEK", ytd:14.42, pe:39.8, tgt:619.4, up:0.7,
    capexSide:"spends", risk:"Medium",
    role:"Missiles, Gripen, ground combat weapons.",
    cat:"Nordic and European rearmament.",
    one:"39.8x for 0.7% upside and a 3.60 rec. Fully valued." },

  { t:"KOG NO", y:"KOG.OL", n:"Kongsberg Gruppen", reg:"EU", layer:"primes",
    c:[3,3,4,3,3], score:68, verdict:"HOLD", px:302.9, ccy:"NOK", ytd:41.75, pe:30.5, tgt:392.36, up:29.5,
    capexSide:"spends", risk:"Medium",
    role:"NSM/JSM strike missiles, remote weapon stations.",
    cat:"NSM/JSM export demand; US co-production with Raytheon.",
    one:"Best operational momentum in Europe and +41% YTD to show for it. Excellent company, no discount." },

  { t:"AM FP", y:"AM.PA", n:"Dassault Aviation", reg:"EU", layer:"primes",
    c:[3,3,4,2,3], score:65, verdict:"HOLD", px:304.8, ccy:"EUR", ytd:11.32, pe:17.7, tgt:380, up:24.7,
    capexSide:"spends", risk:"Medium",
    role:"Rafale.",
    cat:"Export order flow.",
    one:"17.7x with +25% upside — cheapest European prime, but platform-level and export-order dependent." },

  { t:"RR/ LN", y:"RR.L", n:"Rolls-Royce", reg:"EU", layer:"primes",
    c:[3,3,4,3,3], score:62, verdict:"HOLD", px:1506.8, ccy:"GBp", ytd:31.03, pe:35.7, tgt:1638.39, up:8.7,
    capexSide:"receives", risk:"Medium",
    role:"Propulsion and submarine reactors.",
    cat:"AUKUS and defence propulsion.",
    one:"Superb turnaround, 35.7x, 9% to target. The re-rating already happened." },

  { t:"MTX GY", y:"MTX.DE", n:"MTU Aero Engines", reg:"EU", layer:"components",
    c:[3,3,4,3,3], score:63, verdict:"HOLD", px:369.5, ccy:"EUR", ytd:4, pe:19.2, tgt:401, up:8.5,
    capexSide:"receives", risk:"Low",
    role:"Engine modules and MRO.",
    cat:"Military engine programmes.",
    one:"Cheapest large European aero name at 19.2x, but this theme is not where its earnings come from." },

  { t:"QQ/ LN", y:"QQ.L", n:"QinetiQ", reg:"EU", layer:"components",
    c:[3,2,3,3,2], score:61, verdict:"HOLD", px:522, ccy:"GBp", ytd:18.21, pe:15.8, tgt:548.82, up:5.1,
    capexSide:"receives", risk:"Medium",
    role:"Test, evaluation and defence technology services.",
    cat:"UK and US T&E demand.",
    one:"15.8x is undemanding; services businesses do not hold chokepoints the way materials do." },

  { t:"THEON NA", y:"THEON.AS", n:"Theon International", reg:"EU", layer:"guidance",
    c:[3,3,4,2,2], score:62, verdict:"HOLD", px:34, ccy:"EUR", ytd:26.87, pe:null, tgt:39.31, up:15.6,
    capexSide:"receives", risk:"Medium",
    role:"Night vision and thermal imaging systems.",
    cat:"European soldier-modernisation programmes.",
    one:"Good growth and margins; a NATO-budget story rather than a supply-constraint story." },

  { t:"EXA FP", y:"EXA.PA", n:"Exail Technologies", reg:"EU", layer:"guidance",
    c:[3,3,4,2,2], score:58, verdict:"HOLD", px:124.9, ccy:"EUR", ytd:53.25, pe:null, tgt:138.13, up:10.6,
    capexSide:"receives", risk:"High",
    role:"Inertial navigation and autonomous maritime systems.",
    cat:"Navigation in GPS-denied environments.",
    one:"+53% YTD with a 3.50 rec. Real technology, crowded entry." },

  { t:"DRS US", y:"DRS", n:"Leonardo DRS", reg:"US", layer:"guidance",
    c:[3,3,4,3,2], score:63, verdict:"HOLD", px:45.81, ccy:"USD", ytd:34.38, pe:34.5, tgt:53.9, up:17.7,
    capexSide:"receives", risk:"Medium",
    role:"Sensing, power conversion and force protection.",
    cat:"Counter-UAS and naval power content.",
    one:"Well-run and well-owned at 34.5x. Nothing left to discover." },

  { t:"AVAV US", y:"AVAV", n:"AeroVironment", reg:"US", layer:"primes",
    c:[3,2,3,3,2], score:57, verdict:"HOLD", px:159.18, ccy:"USD", ytd:-34.19, pe:48.9, tgt:226.42, up:42.2,
    capexSide:"both", risk:"High",
    role:"Loitering munitions and unmanned systems.",
    cat:"Switchblade and counter-UAS demand.",
    one:"-34% YTD with +42% to target, but 48.9x and a chokepoint score of 13 — attritable systems are designed to be cheap and second-sourceable." },

  { t:"RKLB US", y:"RKLB", n:"Rocket Lab", reg:"US", layer:"srm",
    c:[3,2,3,3,4], score:58, verdict:"HOLD", px:70.43, ccy:"USD", ytd:0.96, pe:null, tgt:117, up:66.1,
    capexSide:"spends", risk:"High",
    role:"Launch and space systems; solid motor and composite capability.",
    cat:"Golden Dome space-layer sensors and interceptors ($17.5bn FY27, reconciliation-dependent).",
    one:"+66% to target, but the Golden Dome funding it depends on is the single most conditional line in the FY27 request. Overlaps the SpaceX book." }
];
