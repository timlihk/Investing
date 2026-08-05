#!/usr/bin/env python3
"""Generate watchlist-themes.js from the Obsidian watchlists.

Sources:
  - Obsidian Vault/03-Areas/Investments/Watchlist.md          (main list)
  - Obsidian Vault/03-Areas/Investments/Screens/*/README.md   (screen lists)

Output:
  ~/Code/Investing/watchlist/watchlist-themes.js  (window.WATCHLIST_THEMES)

Usage:
  python3 watchlist/scripts/generate-themes.py [--vault PATH] [--repo PATH]

Every ticker from every source list must land in at least one theme.
Unknown tag combos fall into the "other" theme; nothing is dropped.
"""
import argparse
import collections
import json
import os
import re
import sys

VAULT_DEFAULT = "/lzcsys/data/home/timlihk/Obsidian Vault/03-Areas/Investments"
REPO_DEFAULT = "/lzcsys/data/home/timlihk/Code/Investing"

# Yahoo symbol corrections for known watchlist mistakes (source-of-truth fix).
ALIASES = {"5243.TWO": "5243.TW"}


def canon(ticker):
    return ALIASES.get(ticker, ticker)


def parse_table(path, stop_at=None):
    """Parse a markdown table into rows of cells (ticker rows only)."""
    rows = []
    for line in open(path, encoding="utf-8"):
        if stop_at and line.strip().startswith(stop_at):
            break
        line = line.strip()
        if not line.startswith("|") or "Ticker" in line or "---" in line:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) >= 3 and re.match(r"^[A-Z0-9.\-]+$", cells[0]):
            rows.append(cells)
    return rows


ZH_NAMES = {
 "4062.T":"Ibiden 揖斐电","3037.TW":"Unimicron 欣兴电子","8046.TW":"Nan Ya PCB 南亚电路板","3189.TW":"Kinsus 景硕",
 "009150.KS":"Samsung Electro-Mechanics 三星电机","ATS.VI":"AT&S","2802.T":"Ajinomoto 味之素 (ABF film)",
 "5706.T":"Mitsui Kinzoku 三井金属","5214.T":"Nippon Electric Glass 日本电气硝子","011790.KS":"SKC (Absolics glass)",
 "3481.TW":"Innolux 群创","002916.SZ":"Shennan Circuits 深南电路","002436.SZ":"Xingsen Tech 兴森科技",
 "600183.SS":"Shengyi Tech 生益科技","4991.TWO":"GCS Holdings","6869.HK":"YOFC 长飞光纤",
 "000660.KS":"SK hynix 海力士","005930.KS":"Samsung Electronics 三星电子","285A.T":"Kioxia 铠侠",
 "011070.KS":"LG Innotek","032580.KS":"Fidelix","080220.KS":"Jeju Semiconductor 济州半导体",
 "031330.KS":"SAMT","025560.KS":"Mirae 未来","042700.KS":"Hanmi Semiconductor",
 "6146.T":"DISCO","6315.T":"TOWA","6857.T":"Advantest 爱德万","8035.T":"Tokyo Electron 东京电子",
 "6136.T":"OSG","6863.T":"Nireco","4187.T":"Osaka Organic Chemicals 大阪有机化学",
 "8027.TWO":"E&R Engineering","3105.TWO":"WIN Semiconductors 稳懋","6787.T":"Meiko Electronics 名幸电子",
 "2313.TW":"Compeq 金像电","2392.TW":"Foxconn Interconnect 鸿海互连","6412.TW":"Chicony Power 群光电能",
 "2301.TW":"Lite-On 光宝科技","2382.TW":"Quanta 广达","2317.TW":"Hon Hai 鸿海","2383.TW":"EMC 台光电子",
 "2327.TW":"Yageo 国巨","300433.SZ":"Lens Technology 蓝思科技","5243.TW":"Eson Precision 乙盛",
 "8021.TW":"Topoint Technology 高侨","3104.T":"Fujibo 富士紡","3110.T":"Nitto Boseki 日东纺",
 "SIVE.ST":"Sivers Semiconductors","SOI.PA":"Soitec","IQE.L":"IQE plc","NXSN.TA":"NextVision",
 "VNP.TO":"5N Plus","TE":"T1 Energy","FPS":"Frontier Power Solutions","GLXY":"Galaxy Digital",
 "CRWV":"CoreWeave","NBIS":"Nebius","APLD":"Applied Digital","DOCN":"DigitalOcean","FSLY":"Fastly",
 "ICHR":"Ichor Holdings","VICR":"Vicor","LWLG":"Lightwave Logic","OPTX":"Syntec Optics","SATL":"Satellogic",
 "ENLT":"Enlight","PL":"Planet Labs","AUR":"Aurora Innovation","CNC":"Centene","USAR":"USA Rare Earth",
 "UUUU":"Energy Fuels","BE":"Bloom Energy","QCOM":"Qualcomm","CCXI":"Churchill Capital XI / Agility Robotics",
 "SKM":"SK Telecom","DXYZ":"Destiny Tech100","OSCR":"Oscar Health","DHR":"Danaher","NKTR":"Nektar",
 "ABVX":"Abivax (ADR)","RXT":"Rackspace","AMC":"AMC Entertainment","ALK":"Alaska Air","MARA":"MARA Holdings",
 "CIFR":"Cipher Mining","RIOT":"Riot Platforms","WULF":"TeraWulf","IREN":"IREN","CORZ":"Core Scientific",
 "CAVA":"Cava Group","BROS":"Dutch Bros","RIVN":"Rivian","ROKU":"Roku","VIAV":"Viavi","TTMI":"TTM Technologies",
 "LSCC":"Lattice","VSH":"Vishay","ENTG":"Entegris","TSEM":"Tower Semi","GFS":"GlobalFoundries","UMC":"UMC",
 "ALAB":"Astera Labs","TER":"Teradyne","STM":"STMicroelectronics","LITE":"Lumentum","ASX":"ASE Technology",
 "WDC":"Western Digital","SNDK":"SanDisk","KLAC":"KLA","AMAT":"Applied Materials","LRCX":"Lam Research",
 "INTC":"Intel","AMD":"AMD","ARM":"Arm Holdings","MRVL":"Marvell","CRDO":"Credo","MTSI":"MACOM",
 "AVGO":"Broadcom","COHR":"Coherent","AAOI":"AAOI","CIEN":"Ciena","SMTC":"Semtech","MXL":"MaxLinear",
 "NOK":"Nokia 诺基亚","VRT":"Vertiv","DELL":"Dell","MU":"Micron 美光","AMKR":"Amkor","AEHR":"Aehr Test",
 "TSM":"TSMC 台积电","BESI.AS":"BESI","AXTI":"AXT","WOLF":"Wolfspeed","FLNC":"Fluence","ACMR":"ACM Research",
 "AGX":"Argan","SEI":"Solaris Energy","CLF":"Cleveland-Cliffs","GOOG":"Alphabet","STX":"Seagate",
 "SIMO":"Silicon Motion","FORM":"FormFactor","0522.HK":"ASMPT","8110.TW":"Walton Advanced",
 "AVAV":"AeroVironment","KTOS":"Kratos","ONDS":"Ondas","RCAT":"Red Cat","UMAC":"Unusual Machines",
 "NEU":"NewMarket (AMPAC)","012450.KS":"Hanwha Aerospace","103140.KS":"Poongsan","LHX":"L3Harris","NOC":"Northrop",
 "7013.T":"IHI","HXL":"Hexcel","ATI":"ATI","CRS":"Carpenter","HWM":"Howmet","TDY":"Teledyne","MRCY":"Mercury Systems",
 "HO.PA":"Thales","CW":"Curtiss-Wright","KRMN":"Karman","MP":"MP Materials","LMT":"Lockheed","RTX":"RTX","GD":"GD",
 "KOG.OL":"Kongsberg","6503.T":"Mitsubishi Electric","6777.T":"Santec","5802.T":"Sumitomo Electric","6442.TW":"EZconn",
 "ACN":"Accenture",
}

# Explicit theme membership (curated, first-principles pass 2026-08-05).
# Principles: theme = where the company's core revenue/thesis sits, not every tag.
#  - SMTC Semtech: analog connectivity silicon -> photonics only (not compute core)
#  - TSEM Tower: SiPh specialty foundry -> photonics only
#  - VSH Vishay: discrete/passives -> other (not AI compute)
#  - WOLF Wolfspeed: SiC device maker -> other (not equipment)
#  - 011070.KS LG Innotek: FC-BGA substrates + MLCC -> substrates-packaging (not memory)
#  - 3105.TWO WIN Semi: GaAs epiwafer foundry -> photonics (consistent w/ IQE/SOI)
#  - 6136.T OSG: industrial cutting tools -> other (not semi equipment)
#  - GOOG: hyperscaler + TPU -> ai-infra (not other)
#  - NOK: AI networking/optical -> photonics
MANUAL = {
 "ai-compute": ["AMD","INTC","ARM","QCOM","TSM","GFS","UMC","STM","MRVL","LSCC","SOXX"],
 "memory-storage": ["000660.KS","005930.KS","MU","285A.T","032580.KS","080220.KS","WDC","SNDK","STX","SIMO"],
 "semi-equipment": ["AMAT","LRCX","KLAC","TER","ACMR","AEHR","6146.T","8027.TWO","025560.KS","BESI.AS","ENTG","4187.T","6863.T","AXTI","ICHR","FORM"],
 "substrates-packaging": ["4062.T","3037.TW","8046.TW","3189.TW","009150.KS","ATS.VI","2802.T","5706.T","5214.T","011790.KS","3481.TW","002916.SZ","002436.SZ","600183.SS","AMKR","ASX","2327.TW","011070.KS"],
 "ai-infra": ["VRT","DELL","2317.TW","2382.TW","2383.TW","2301.TW","6412.TW","CORZ","IREN","CRWV","NBIS","APLD","DOCN","FSLY","DDOG","RXT","VICR","GOOG"],
 "photonics": ["CRDO","MTSI","AVGO","LITE","COHR","AAOI","CIEN","SMTC","TSEM","6503.T","6777.T","5802.T","4991.TWO","6442.TW","6869.HK","SIVE.ST","SOI.PA","IQE.L","MXL","LWLG","OPTX","VIAV","3105.TWO","NOK"],
 "defense": ["NEU","012450.KS","103140.KS","LHX","NOC","7013.T","HXL","ATI","CRS","HWM","TDY","MRCY","HO.PA","CW","KRMN","MP","LMT","RTX","GD","KOG.OL","AVAV","KTOS","ONDS","RCAT","UMAC","NXSN.TA","PL","SATL","USAR","UUUU"],
 "starlink": ["5243.TW","2301.TW","6787.T","300433.SZ","2313.TW","6412.TW","2392.TW","6146.T","8027.TWO"],
 "crypto-miners": ["MARA","RIOT","CIFR","WULF","CORZ","IREN","GLXY"],
 "energy-materials": ["AGX","TE","FLNC","SEI","FPS","BE","VNP.TO","ENLT","CLF","3104.T","3110.T"],
 "other": ["GOOG","ROKU","AMC","ALK","CAVA","BROS","RIVN","OSCR","DHR","NKTR","ABVX","CCXI","8021.TW","TTMI","SKM","DXYZ","031330.KS","AUR","CNC","ACN","VSH","WOLF","6136.T"],
}

TAG_MAP = {
 "memory":"memory-storage","dram":"memory-storage","nand":"memory-storage","storage":"memory-storage",
 "semiconductor":"ai-compute","cpu":"ai-compute","gpu":"ai-compute","fpga":"ai-compute","foundry":"ai-compute",
 "equipment":"semi-equipment","test-equipment":"semi-equipment","deposition":"semi-equipment","etch":"semi-equipment",
 "inspection":"semi-equipment","hybrid-bonding":"semi-equipment","wafer-cleaning":"semi-equipment","SiC":"other",
 "GaAs-substrates":"semi-equipment","photoresist":"semi-equipment","discrete":"other","analog":"other",
 "packaging":"substrates-packaging","substrates":"substrates-packaging","MLCC":"substrates-packaging",
 "ai-infra":"ai-infra","servers":"ai-infra","power":"ai-infra","cooling":"ai-infra","liquid-cooling":"ai-infra",
 "photonics":"photonics","optical":"photonics","connectivity":"photonics","networking":"photonics","communication-equipment":"photonics",
 "defense":"defense","drones":"defense",
 "starlink":"starlink",
 "crypto":"crypto-miners","mining":"crypto-miners","data-center":"ai-infra",
 "energy":"energy-materials","solar":"energy-materials","batteries":"energy-materials","grid":"energy-materials",
 "critical-minerals":"energy-materials","gallium":"energy-materials","steel":"energy-materials","materials":"energy-materials","industrial":"energy-materials",
 "biotech":"other","pharma":"other","healthcare":"other","insurance":"other","life-sciences":"other",
 "restaurants":"other","consumer":"other","entertainment":"other","streaming":"other","airlines":"other","travel":"other",
 "ev":"other","automotive":"other","robotics":"other","humanoid-robotics":"other","spac":"other","big-tech":"other",
 "tech":"other","it-services":"other","software-infrastructure":"other","pcb":"other","electronics":"other",
 "japan":"other","taiwan":"other","korea":"other","europe":"other","france":"other","uk":"other","sweden":"other",
 "israel":"other","canada":"other","china":"other","us":"other","value":"other","speculative":"other","activist":"other",
}

THEMES = [
 {"id":"ai-compute","name":"AI Compute & Silicon 半导体核心","tagline":"CPUs, GPUs, foundries, FPGAs, analog — the compute core of the AI stack."},
 {"id":"memory-storage","name":"Memory & Storage 存储","tagline":"HBM/DRAM/NAND makers, controllers, HDD — the AI memory supercycle."},
 {"id":"semi-equipment","name":"Semi Equipment & Materials 设备材料","tagline":"Wafer tools, test, bonding, substrates materials — pick-and-shovel layer."},
 {"id":"substrates-packaging","name":"Substrates & Packaging 载板封装","tagline":"ABF/IC substrate makers, film & foil chokepoints, OSAT packaging, MLCC."},
 {"id":"ai-infra","name":"AI Infrastructure 算力基建","tagline":"Servers, power & cooling, data-center builders, AI clouds."},
 {"id":"photonics","name":"AI Photonics & Optical 光通信","tagline":"Optical interconnect, silicon photonics, transceivers, epiwafers."},
 {"id":"defense","name":"Defense & Drones 国防无人机","tagline":"Western munitions chokepoints, primes, loitering munitions, ISR."},
 {"id":"starlink","name":"Starlink Supply Chain 星链","tagline":"Satellite direct suppliers — PCB, power, connectors, glass, tools."},
 {"id":"crypto-miners","name":"Crypto & AI Miners 矿企","tagline":"Bitcoin miners pivoting to AI data centers, crypto capital markets."},
 {"id":"energy-materials","name":"Energy & Materials 能源材料","tagline":"Energy storage, solar, power infrastructure, rare earths, steel."},
 {"id":"other","name":"Watchlist Other 其他","tagline":"Consumer, biotech, mobility, proxies — everything else being tracked."},
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vault", default=VAULT_DEFAULT)
    ap.add_argument("--repo", default=REPO_DEFAULT)
    args = ap.parse_args()

    vault, repo = args.vault, args.repo

    # 1. parse sources
    watch = parse_table(os.path.join(vault, "Watchlist.md"), stop_at="## Tags in Use")
    screens = {}
    for name in sorted(os.listdir(os.path.join(vault, "Screens"))):
        readme = os.path.join(vault, "Screens", name, "README.md")
        if os.path.exists(readme):
            screens[name] = parse_table(readme)
    print(f"main watchlist: {len(watch)} tickers; screens: "
          + ", ".join(f"{k}={len(v)}" for k, v in screens.items()) or "none")

    name_of = {r[0]: r[1] for r in watch}
    for rows in screens.values():
        for r in rows:
            name_of.setdefault(r[0], r[1])
    watch = [[canon(r[0]), r[1], r[2], *r[3:]] for r in watch]
    screens = {k: [[canon(r[0]), *r[1:]] for r in v] for k, v in screens.items()}
    name_of = {canon(k): v for k, v in name_of.items()}

    # 2. assign themes
    theme_tickers = collections.defaultdict(list)
    seen = set()
    for tid, tickers in MANUAL.items():
        for t in tickers:
            seen.add(t)
            theme_tickers[tid].append(t)
    for r in watch:
        ticker, tags = r[0], r[2]
        if ticker in seen:
            continue
        target = "other"
        for tag in [x.strip() for x in tags.split(",")]:
            if tag in TAG_MAP:
                target = TAG_MAP[tag]
                break
        seen.add(ticker)
        theme_tickers[target].append(ticker)
    for rows in screens.values():
        for r in rows:
            if r[0] not in seen:
                seen.add(r[0])
                theme_tickers["other"].append(r[0])

    # 3. emit js
    out = []
    for th in THEMES:
        tickers = theme_tickers.get(th["id"], [])
        out.append({
            "id": th["id"], "name": th["name"], "tagline": th["tagline"],
            "tickers": [{"symbol": t, "name": ZH_NAMES.get(t, name_of.get(t, t))}
                        for t in sorted(set(tickers))],
        })

    lines = [
        "// Watchlist theme config — GENERATED by watchlist/scripts/generate-themes.py.",
        "// Sources: Obsidian Watchlist.md + Screens/*/README.md. Do not hand-edit.",
        "// Live prices + performance come from /api/market/quotes + /api/market/detail",
        "// (free Yahoo Finance via the Cloudflare worker — no Bloomberg quota).",
        "window.WATCHLIST_THEMES = [",
    ]
    for th in out:
        lines.append("  {")
        lines.append(f'    id: "{th["id"]}",')
        lines.append(f'    name: "{th["name"]}",')
        lines.append(f'    tagline: "{th["tagline"]}",')
        lines.append("    tickers: [")
        for t in th["tickers"]:
            lines.append(f'      {{ symbol: "{t["symbol"]}", name: "{t["name"]}" }},')
        lines.append("    ]")
        lines.append("  },")
    lines.append("];")

    target = os.path.join(repo, "watchlist", "watchlist-themes.js")
    with open(target, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    # 4. coverage report
    all_mapped = {t["symbol"] for th in out for t in th["tickers"]}
    missing_main = [r[0] for r in watch if r[0] not in all_mapped]
    missing_screens = [r[0] for rows in screens.values() for r in rows if r[0] not in all_mapped]
    print(f"\nwrote {target}")
    for th in out:
        print(f"  {th['name']}: {len(th['tickers'])}")
    print("unmapped (main):", missing_main if missing_main else "none")
    print("unmapped (screens):", missing_screens if missing_screens else "none")
    if missing_main or missing_screens:
        sys.exit(1)


if __name__ == "__main__":
    main()
