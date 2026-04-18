"""
SEPA trend-template bulk filter for 124 Russell 2000 breakout candidates.
Data: yfinance. Reference date: 2026-04-17 close.
"""
import sys
import warnings
warnings.filterwarnings("ignore")
import pandas as pd
import numpy as np
import yfinance as yf

TICKERS = """ACAD ACIC ALGT ALKT ALRS AMAL ANGO APLE ASUR ATRC AURA AWR BANF BATRK BBBY
BELFA BHRB BHVN BJRI BKE BOOT BSVN CCS CD CHEF CTBI CTRN CVLG DCOM DX EP
ESNT ESQ FDBC FHTX FIHL FINW FLXS FRAF GAIA GBCI GOLF HAE HAFC HCKT HG HLMN
HRTX HWBK HZO IBP ICUI IMMR INGN JAKK JBI KRNY KRT KTB KURA LE LIVN LNKB
LPG LYTS MBUU MCS MHO MIR MNSB MPB MRTN MTRN MVBF NKSH NUVL OCUL OFG OM
ONEW OOMA OPFI OSBC PACK PII PKBK POWI POWL PRCH PRTH PZZA QUAD RBB RC
RLGT RPAY RRBI RUSHA SBSI SHAK SHEN SKY SMBC SMTC SNCY SPXC SRBK SRCE STEL
STOK SUPN SXI THRM TLSI TMDX TTEC TTGT UNB UVE VAC VIRC VYGR WAFD WEST ZUMZ""".split()

BENCH = ["SPY", "QQQ", "IWM"]

def fetch(symbols, period="15mo"):
    data = yf.download(symbols, period=period, auto_adjust=True, progress=False, group_by="ticker", threads=True)
    return data

def analyze(tkr, df, spy_ret_1y):
    if df is None or df.empty:
        return None
    close = df["Close"].dropna()
    vol = df["Volume"].dropna()
    if len(close) < 220:
        return None
    price = close.iloc[-1]
    ma50 = close.rolling(50).mean().iloc[-1]
    ma150 = close.rolling(150).mean().iloc[-1]
    ma200 = close.rolling(200).mean().iloc[-1]
    ma200_1m = close.rolling(200).mean().iloc[-22] if len(close) >= 222 else np.nan
    ma200_5m = close.rolling(200).mean().iloc[-110] if len(close) >= 310 else np.nan
    hi52 = close.iloc[-252:].max() if len(close) >= 252 else close.max()
    lo52 = close.iloc[-252:].min() if len(close) >= 252 else close.min()
    pct_from_hi = (price / hi52 - 1) * 100
    pct_above_lo = (price / lo52 - 1) * 100
    # 12-mo price return vs SPY for RS proxy
    ret_1y = (price / close.iloc[-252] - 1) * 100 if len(close) >= 252 else np.nan
    rs_vs_spy = ret_1y - spy_ret_1y if not np.isnan(ret_1y) else np.nan
    avg_vol_20 = vol.iloc[-21:-1].mean()
    vol_today = vol.iloc[-1]
    vol_ratio = vol_today / avg_vol_20 if avg_vol_20 > 0 else np.nan

    # 8 trend-template conditions
    c1 = price > ma150 and price > ma200
    c2 = ma150 > ma200
    c3 = not np.isnan(ma200_1m) and ma200 > ma200_1m  # rising for >=1 mo
    c4 = ma50 > ma150 and ma50 > ma200
    c5 = price > ma50
    c6 = pct_above_lo >= 30
    c7 = pct_from_hi >= -25
    # Condition 8: RS proxy — 1y outperformance of SPY by >0 = passing proxy, >+20 = strong
    c8 = not np.isnan(rs_vs_spy) and rs_vs_spy > 0

    passes = sum([c1, c2, c3, c4, c5, c6, c7, c8])
    return dict(
        ticker=tkr, price=price, ma50=ma50, ma150=ma150, ma200=ma200,
        pct_from_hi=pct_from_hi, pct_above_lo=pct_above_lo,
        ret_1y=ret_1y, rs_vs_spy=rs_vs_spy,
        vol_ratio=vol_ratio,
        c1=c1, c2=c2, c3=c3, c4=c4, c5=c5, c6=c6, c7=c7, c8=c8,
        passes=passes,
        all_pass=all([c1, c2, c3, c4, c5, c6, c7, c8]),
    )

def main():
    print("Fetching benchmarks...", file=sys.stderr)
    bench = fetch(BENCH)
    spy_close = bench["SPY"]["Close"].dropna()
    qqq_close = bench["QQQ"]["Close"].dropna()
    iwm_close = bench["IWM"]["Close"].dropna()

    def env_stats(c, label):
        ma200 = c.rolling(200).mean().iloc[-1]
        price = c.iloc[-1]
        ret_1y = (price / c.iloc[-252] - 1) * 100
        above = price > ma200
        return dict(label=label, price=price, ma200=ma200, above_ma200=above, ret_1y=ret_1y)

    spy = env_stats(spy_close, "SPY")
    qqq = env_stats(qqq_close, "QQQ")
    iwm = env_stats(iwm_close, "IWM")
    print("\n=== MARKET ENVIRONMENT (as of latest close) ===")
    for e in [spy, qqq, iwm]:
        print(f"{e['label']}: price={e['price']:.2f}  200MA={e['ma200']:.2f}  above200MA={e['above_ma200']}  1y={e['ret_1y']:+.1f}%")
    spy_ret_1y = spy["ret_1y"]

    print(f"\nFetching {len(TICKERS)} tickers...", file=sys.stderr)
    data = fetch(TICKERS)
    rows = []
    missing = []
    for t in TICKERS:
        try:
            df = data[t].dropna(how="all")
            r = analyze(t, df, spy_ret_1y)
            if r is None:
                missing.append(t)
            else:
                rows.append(r)
        except Exception as e:
            missing.append(t)
    print(f"Analyzed {len(rows)}, missing {len(missing)}: {missing}", file=sys.stderr)

    df = pd.DataFrame(rows)
    df.to_csv("/tmp/sepa-scan/results.csv", index=False)

    passers = df[df.all_pass].copy()
    passers = passers.sort_values("rs_vs_spy", ascending=False)

    print(f"\n=== TREND-TEMPLATE PASS RATE: {len(passers)}/{len(df)} ===\n")

    cols = ["ticker", "price", "pct_from_hi", "pct_above_lo", "ret_1y", "rs_vs_spy", "vol_ratio"]
    print("TOP PASSERS (sorted by RS vs SPY 1-yr):")
    print(passers[cols].head(25).to_string(index=False, float_format=lambda x: f"{x:.1f}"))

    print(f"\n=== NEAR-MISSES (7 of 8 passes) ===")
    near = df[(~df.all_pass) & (df.passes == 7)].copy()
    near = near.sort_values("rs_vs_spy", ascending=False)
    if len(near):
        # identify which condition failed
        cond_names = ["c1","c2","c3","c4","c5","c6","c7","c8"]
        cond_labels = {
            "c1":"Px>150/200MA","c2":"150>200MA","c3":"200MA rising","c4":"50>150&200",
            "c5":"Px>50MA","c6":"+30% above 52wL","c7":"within 25% of 52wH","c8":"RS>0 vs SPY",
        }
        def failed(row):
            return ",".join(cond_labels[c] for c in cond_names if not row[c])
        near["failed"] = near.apply(failed, axis=1)
        print(near[cols + ["failed"]].head(15).to_string(index=False, float_format=lambda x: f"{x:.1f}"))

    print(f"\n=== VOLUME SURGE LEADERS (today vs 20d avg, passers only) ===")
    vol_rank = passers.sort_values("vol_ratio", ascending=False)
    print(vol_rank[["ticker", "vol_ratio", "rs_vs_spy", "pct_from_hi"]].head(15).to_string(index=False, float_format=lambda x: f"{x:.2f}"))

    print(f"\n=== CLOSEST TO 52-WEEK HIGH (passers only) ===")
    near_hi = passers.sort_values("pct_from_hi", ascending=False)
    print(near_hi[["ticker", "pct_from_hi", "rs_vs_spy", "vol_ratio"]].head(15).to_string(index=False, float_format=lambda x: f"{x:.2f}"))

if __name__ == "__main__":
    main()
