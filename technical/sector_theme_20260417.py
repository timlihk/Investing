"""
Sector/industry theme analysis for 124 R2K breakout candidates (17 Apr 2026).
Uses yfinance .info to pull sector + industry, then aggregates.
"""
import sys
import warnings
warnings.filterwarnings("ignore")
import pandas as pd
import yfinance as yf
from collections import Counter, defaultdict

TICKERS = """ACAD ACIC ALGT ALKT ALRS AMAL ANGO APLE ASUR ATRC AURA AWR BANF BATRK BBBY
BELFA BHRB BHVN BJRI BKE BOOT BSVN CCS CD CHEF CTBI CTRN CVLG DCOM DX EP
ESNT ESQ FDBC FHTX FIHL FINW FLXS FRAF GAIA GBCI GOLF HAE HAFC HCKT HG HLMN
HRTX HWBK HZO IBP ICUI IMMR INGN JAKK JBI KRNY KRT KTB KURA LE LIVN LNKB
LPG LYTS MBUU MCS MHO MIR MNSB MPB MRTN MTRN MVBF NKSH NUVL OCUL OFG OM
ONEW OOMA OPFI OSBC PACK PII PKBK POWI POWL PRCH PRTH PZZA QUAD RBB RC
RLGT RPAY RRBI RUSHA SBSI SHAK SHEN SKY SMBC SMTC SNCY SPXC SRBK SRCE STEL
STOK SUPN SXI THRM TLSI TMDX TTEC TTGT UNB UVE VAC VIRC VYGR WAFD WEST ZUMZ""".split()

rows = []
for t in TICKERS:
    try:
        info = yf.Ticker(t).info or {}
        rows.append({
            "ticker": t,
            "name": info.get("shortName") or info.get("longName"),
            "sector": info.get("sector"),
            "industry": info.get("industry"),
            "mcap": info.get("marketCap"),
        })
    except Exception as e:
        rows.append({"ticker": t, "name": None, "sector": None, "industry": None, "mcap": None})

df = pd.DataFrame(rows)
df.to_csv("/Users/timli/Code/investing/technical/sector_map_20260417.csv", index=False)

print(f"\nTotal tickers: {len(df)}")
print(f"Missing sector: {df.sector.isna().sum()}")

print("\n=== SECTOR BREAKDOWN ===")
sc = df.sector.value_counts(dropna=False)
for s, n in sc.items():
    pct = n / len(df) * 100
    print(f"  {str(s):30s}  {n:3d}  ({pct:4.1f}%)")

print("\n=== INDUSTRY BREAKDOWN (top 20) ===")
ic = df.industry.value_counts(dropna=False).head(25)
for i, n in ic.items():
    print(f"  {str(i):45s}  {n:3d}")

print("\n=== TICKERS BY SECTOR ===")
for sec in sorted(df.sector.dropna().unique()):
    sub = df[df.sector == sec]
    print(f"\n-- {sec} ({len(sub)}) --")
    by_ind = defaultdict(list)
    for _, r in sub.iterrows():
        by_ind[r.industry].append(r.ticker)
    for ind, tickers in sorted(by_ind.items(), key=lambda x: -len(x[1])):
        print(f"  {ind}: {', '.join(tickers)}")
