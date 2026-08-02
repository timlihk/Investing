"""
SEPA trend-template + VCP-lite screen for the TrendSpider Russell 2000
High-Volume Gappers scan (17 Apr 2026, 18:02 EST). 118 tickers.

Pipeline:
  1. Fetch 15mo OHLCV via yfinance.
  2. Apply Minervini's 8-point trend template.
  3. On passers, run VCP-lite pattern check:
       - >=3 pullbacks in last ~12 weeks with contracting depth
       - weekly-range contraction over the last 5 weeks
       - volume dry-up in the most recent week
       - distance from pivot (recent swing high) for buy-zone check
  4. Print shortlist + TradingView URLs.
"""
import sys
import warnings
warnings.filterwarnings("ignore")
import pandas as pd
import numpy as np
import yfinance as yf

TICKERS = """
ABAT ABCB ABSI ACA ACAD ACIW ACMR ADMA ADTN ALGT ALLO AMBQ AMC ANGO
ANIP AOSL APLE APPS ARDT ASC ASPI ASTH ATKR ATRC AXGN BAND BBBY BFH
BFLY BHR BOH BYND BZAI CADL CBAN CDNA CHRS CMRC COGT COHU COMP CPRX
CRDF CRI CRML CVBF CXM DAVE DDD DLX EBC ELDN ENOV FBK FELE FSS
FSUN FWRD GCT GOLF GRPN HIMS HLMN HPP HRI HTBK HZO IHRT IMVT IONQ
JCAP JOE KURA LC LCII LDI LIND LION LRN MBUU MCHB MEG MGTX MITK
MXL MYO NB NKTX NN NNOX NPWR NTST NVTS NXT OCUL OKLO ONB OPRT
PACK PAL PATK PBI PRCH PRIM PRTH PTLO QNST RBBN RDNT RDW RELY RMNI
ROAD RPAY RUM RUN RVLV SANM SGHC SHLS SLDP SLG SMR SPXC TSHA TTEC
TTGT ULCC VC VOYG WAFD WAY WEST WSBC XRX ZVRA ZWS
""".split()

BENCH = ["SPY", "QQQ", "IWM"]

def fetch(symbols, period="15mo"):
    return yf.download(symbols, period=period, auto_adjust=True,
                       progress=False, group_by="ticker", threads=True)

def pullback_sequence(close, lookback=84):
    """Walk the last `lookback` sessions and identify swing highs/lows.
    Simple zigzag: flip when price reverses >3% from running extreme.
    Return list of pullback depth percentages in chronological order."""
    c = close.iloc[-lookback:]
    if len(c) < 20:
        return []
    pullbacks = []
    direction = None
    ext = c.iloc[0]
    last_high = ext
    for v in c.iloc[1:]:
        if direction is None:
            if v > ext * 1.03:
                direction = "up"; last_high = v; ext = v
            elif v < ext * 0.97:
                direction = "down"; ext = v
        elif direction == "up":
            if v > ext:
                ext = v; last_high = v
            elif v < ext * 0.97:
                direction = "down"; ext = v
        elif direction == "down":
            if v < ext:
                ext = v
            elif v > ext * 1.03:
                depth = (last_high - ext) / last_high * 100
                pullbacks.append(depth)
                direction = "up"; last_high = v; ext = v
    # open-ended down-leg at the end: count it
    if direction == "down":
        depth = (last_high - ext) / last_high * 100
        if depth > 0:
            pullbacks.append(depth)
    return pullbacks

def weekly_range_pct(close, high, low, weeks=6):
    """Compute weekly high-low range as % of weekly close for last `weeks` weeks."""
    df = pd.DataFrame({"Close": close, "High": high, "Low": low})
    w = df.resample("W-FRI").agg({"Close": "last", "High": "max", "Low": "min"}).dropna()
    if len(w) < weeks:
        return []
    last = w.iloc[-weeks:]
    return ((last["High"] - last["Low"]) / last["Close"] * 100).tolist()

def weekly_volume(vol, weeks=6):
    w = vol.resample("W-FRI").sum().dropna()
    if len(w) < weeks:
        return []
    return w.iloc[-weeks:].tolist()

def atr(high, low, close, window):
    """Wilder-style ATR over `window` sessions. Returns the latest value."""
    prev_close = close.shift(1)
    tr = pd.concat([(high - low),
                    (high - prev_close).abs(),
                    (low - prev_close).abs()], axis=1).max(axis=1)
    return tr.rolling(window).mean().iloc[-1]

def analyze(tkr, df, spy_ret_1y):
    if df is None or df.empty:
        return None
    df = df.dropna(how="all")
    close = df["Close"].dropna()
    high = df["High"].dropna()
    low = df["Low"].dropna()
    vol = df["Volume"].dropna()
    if len(close) < 220:
        return None

    price = close.iloc[-1]
    ma50 = close.rolling(50).mean().iloc[-1]
    ma150 = close.rolling(150).mean().iloc[-1]
    ma200 = close.rolling(200).mean().iloc[-1]
    ma200_1m = close.rolling(200).mean().iloc[-22] if len(close) >= 222 else np.nan
    hi52 = close.iloc[-252:].max() if len(close) >= 252 else close.max()
    lo52 = close.iloc[-252:].min() if len(close) >= 252 else close.min()
    pct_from_hi = (price / hi52 - 1) * 100
    pct_above_lo = (price / lo52 - 1) * 100
    ret_1y = (price / close.iloc[-252] - 1) * 100 if len(close) >= 252 else np.nan
    rs_vs_spy = ret_1y - spy_ret_1y if not np.isnan(ret_1y) else np.nan
    avg_vol_20 = vol.iloc[-21:-1].mean()
    vol_today = vol.iloc[-1]
    vol_ratio = vol_today / avg_vol_20 if avg_vol_20 > 0 else np.nan

    # 8 trend-template conditions
    c1 = price > ma150 and price > ma200
    c2 = ma150 > ma200
    c3 = not np.isnan(ma200_1m) and ma200 > ma200_1m
    c4 = ma50 > ma150 and ma50 > ma200
    c5 = price > ma50
    c6 = pct_above_lo >= 30
    c7 = pct_from_hi >= -25
    c8 = not np.isnan(rs_vs_spy) and rs_vs_spy > 0
    passes = sum([c1, c2, c3, c4, c5, c6, c7, c8])
    all_pass = all([c1, c2, c3, c4, c5, c6, c7, c8])

    # VCP-lite pattern scoring
    pullbacks = pullback_sequence(close, lookback=84)
    wrange = weekly_range_pct(close, high, low, weeks=6)
    wvol = weekly_volume(vol, weeks=6)

    contracting_pbs = False
    pb_count = len(pullbacks)
    last_pb_depth = pullbacks[-1] if pullbacks else np.nan
    if pb_count >= 3:
        # monotonically (or near-monotonically) decreasing over last 3
        last3 = pullbacks[-3:]
        contracting_pbs = last3[0] > last3[1] > last3[2]

    contracting_range = False
    if len(wrange) >= 5:
        avg_first3 = np.mean(wrange[:3])
        avg_last2 = np.mean(wrange[-2:])
        contracting_range = avg_last2 < avg_first3 * 0.7  # at least 30% contraction

    vol_dry_up = False
    if len(wvol) >= 5:
        avg_prior = np.mean(wvol[:-1])
        vol_dry_up = wvol[-1] < avg_prior * 0.8

    # 20-day pivot: the highest close in last 15 sessions ex-today (use as proxy for recent pivot)
    pivot = close.iloc[-16:-1].max() if len(close) >= 20 else np.nan
    pct_to_pivot = (price / pivot - 1) * 100 if not np.isnan(pivot) else np.nan
    above_pivot = pct_to_pivot > 0

    vcp_score = sum([contracting_pbs, contracting_range, vol_dry_up, pb_count >= 3])

    # --- Deepvue / Minervini consensus extensions ---
    # 1) ATR compression: recent 10d ATR <= 1/3 of 50d ATR (tight coil)
    atr10 = atr(high, low, close, 10)
    atr50 = atr(high, low, close, 50)
    atr_compression = (not np.isnan(atr10) and not np.isnan(atr50)
                       and atr50 > 0 and (atr10 / atr50) <= 0.55)  # 0.55 ~ "meaningfully tight"; strict 1/3 is rare
    atr_ratio = (atr10 / atr50) if (not np.isnan(atr10) and atr50 > 0) else np.nan

    # 2) Tight-range: 5-day high-low range within +/-4% of close (Deepvue RMV proxy)
    if len(close) >= 5:
        r5_hi = high.iloc[-5:].max()
        r5_lo = low.iloc[-5:].min()
        range5_pct = (r5_hi - r5_lo) / price * 100
    else:
        range5_pct = np.nan
    tight_range = (not np.isnan(range5_pct)) and range5_pct <= 8  # ~±4% band

    # 3) Minervini Power Play: 6-month price change > +85% AND 15-day change in [-15%, +5%]
    ret_6m = (price / close.iloc[-126] - 1) * 100 if len(close) >= 126 else np.nan
    ret_15d = (price / close.iloc[-16] - 1) * 100 if len(close) >= 16 else np.nan
    power_play = (not np.isnan(ret_6m) and not np.isnan(ret_15d)
                  and ret_6m > 85 and -15 <= ret_15d <= 5)

    # 4) Breakout-day confirmation: close > 20MA AND volume >= 1.5x 20d avg AND above pivot
    ma20 = close.rolling(20).mean().iloc[-1]
    breakout_confirm = (price > ma20
                        and not np.isnan(vol_ratio) and vol_ratio >= 1.5
                        and above_pivot)

    setup_score = vcp_score + sum([atr_compression, tight_range, power_play, breakout_confirm])

    return dict(
        ticker=tkr, price=price, ma50=ma50, ma150=ma150, ma200=ma200,
        pct_from_hi=pct_from_hi, pct_above_lo=pct_above_lo,
        ret_1y=ret_1y, rs_vs_spy=rs_vs_spy, vol_ratio=vol_ratio,
        c1=c1, c2=c2, c3=c3, c4=c4, c5=c5, c6=c6, c7=c7, c8=c8,
        passes=passes, all_pass=all_pass,
        pb_count=pb_count, last_pb_depth=last_pb_depth,
        contracting_pbs=contracting_pbs, contracting_range=contracting_range,
        vol_dry_up=vol_dry_up, vcp_score=vcp_score,
        atr_ratio=atr_ratio, atr_compression=atr_compression,
        range5_pct=range5_pct, tight_range=tight_range,
        ret_6m=ret_6m, ret_15d=ret_15d, power_play=power_play,
        breakout_confirm=breakout_confirm, setup_score=setup_score,
        pivot=pivot, pct_to_pivot=pct_to_pivot, above_pivot=above_pivot,
    )

def main():
    print("Fetching benchmarks...", file=sys.stderr)
    bench = fetch(BENCH)
    spy_close = bench["SPY"]["Close"].dropna()
    qqq_close = bench["QQQ"]["Close"].dropna()
    iwm_close = bench["IWM"]["Close"].dropna()

    def env_stats(c, label):
        ma200 = c.rolling(200).mean().iloc[-1]
        ma50 = c.rolling(50).mean().iloc[-1]
        price = c.iloc[-1]
        ret_1y = (price / c.iloc[-252] - 1) * 100
        return dict(label=label, price=price, ma50=ma50, ma200=ma200,
                    above_ma200=price > ma200, above_ma50=price > ma50, ret_1y=ret_1y)

    print("\n=== MARKET ENVIRONMENT (latest close) ===")
    spy = env_stats(spy_close, "SPY")
    qqq = env_stats(qqq_close, "QQQ")
    iwm = env_stats(iwm_close, "IWM")
    for e in [spy, qqq, iwm]:
        print(f"{e['label']}: price={e['price']:.2f}  50MA={e['ma50']:.2f}  200MA={e['ma200']:.2f}  "
              f"above200={e['above_ma200']}  above50={e['above_ma50']}  1y={e['ret_1y']:+.1f}%")
    spy_ret_1y = spy["ret_1y"]

    print(f"\nFetching {len(TICKERS)} tickers...", file=sys.stderr)
    data = fetch(TICKERS)
    rows, missing = [], []
    for t in TICKERS:
        try:
            df = data[t]
            r = analyze(t, df, spy_ret_1y)
            if r is None:
                missing.append(t)
            else:
                rows.append(r)
        except Exception:
            missing.append(t)
    print(f"Analyzed {len(rows)}, missing {len(missing)}: {missing}", file=sys.stderr)

    df = pd.DataFrame(rows)
    import os
    os.makedirs("/tmp/sepa-scan", exist_ok=True)
    df.to_csv("/tmp/sepa-scan/results_20260418.csv", index=False)

    passers = df[df.all_pass].copy().sort_values("rs_vs_spy", ascending=False)

    print(f"\n=== TREND-TEMPLATE PASS RATE: {len(passers)}/{len(df)} ===\n")
    cols = ["ticker", "price", "pct_from_hi", "pct_above_lo", "ret_1y", "rs_vs_spy", "vol_ratio"]
    print("ALL PASSERS (sorted by RS vs SPY 1-yr):")
    print(passers[cols].to_string(index=False, float_format=lambda x: f"{x:.1f}"))

    print(f"\n=== NEAR-MISSES (7 of 8 passes) ===")
    near = df[(~df.all_pass) & (df.passes == 7)].copy().sort_values("rs_vs_spy", ascending=False)
    if len(near):
        cond_names = ["c1","c2","c3","c4","c5","c6","c7","c8"]
        labels = {
            "c1":"Px>150/200MA","c2":"150>200MA","c3":"200MA rising","c4":"50>150&200",
            "c5":"Px>50MA","c6":"+30% 52wL","c7":"<-25% 52wH","c8":"RS>0"}
        near["failed"] = near.apply(lambda r: ",".join(labels[c] for c in cond_names if not r[c]), axis=1)
        print(near[cols + ["failed"]].to_string(index=False, float_format=lambda x: f"{x:.1f}"))

    setup_cols = ["ticker", "price", "pct_from_hi", "pct_to_pivot",
                  "vcp_score", "atr_ratio", "range5_pct", "ret_6m", "ret_15d",
                  "contracting_pbs", "vol_dry_up",
                  "atr_compression", "tight_range", "power_play", "breakout_confirm",
                  "vol_ratio", "rs_vs_spy", "setup_score"]

    print(f"\n=== COMPOSITE SETUP SHORTLIST (all_pass + setup_score>=3) ===")
    top = passers[passers.setup_score >= 3].copy().sort_values(
        ["setup_score", "rs_vs_spy"], ascending=[False, False])
    print(top[setup_cols].to_string(index=False, float_format=lambda x: f"{x:.2f}"))

    print(f"\n=== POWER PLAY CANDIDATES (Minervini: 6mo>+85% AND 15d in [-15,+5]) ===")
    pp = df[df.power_play].copy().sort_values("ret_6m", ascending=False)
    print(pp[["ticker", "price", "ret_6m", "ret_15d", "pct_from_hi",
              "rs_vs_spy", "vcp_score", "setup_score"]].to_string(
              index=False, float_format=lambda x: f"{x:.1f}"))

    print(f"\n=== ATR-COMPRESSED COILS (atr10/atr50 <= 0.55) ===")
    coils = passers[passers.atr_compression].copy().sort_values("atr_ratio")
    print(coils[["ticker", "price", "atr_ratio", "range5_pct", "pct_from_hi",
                 "vcp_score", "setup_score", "rs_vs_spy"]].to_string(
                 index=False, float_format=lambda x: f"{x:.2f}"))

    print(f"\n=== CONFIRMED BREAKOUTS TODAY (close>20MA + vol>=1.5x + above pivot) ===")
    bo = passers[passers.breakout_confirm].copy().sort_values("vol_ratio", ascending=False)
    print(bo[["ticker", "price", "vol_ratio", "pct_to_pivot", "pct_from_hi",
              "rs_vs_spy", "vcp_score", "setup_score"]].to_string(
              index=False, float_format=lambda x: f"{x:.2f}"))

    # Final actionable shortlist: all_pass + within 15% of 52wH + setup_score>=3
    actionable = passers[(passers.pct_from_hi >= -15) & (passers.setup_score >= 3)].copy()
    actionable = actionable.sort_values(["setup_score", "rs_vs_spy"], ascending=[False, False])
    print(f"\n=== ACTIONABLE SHORTLIST (within 15% of 52wH + setup_score>=3): {len(actionable)} ===")
    print(actionable[setup_cols].to_string(index=False, float_format=lambda x: f"{x:.2f}"))

    print("\n=== TRADINGVIEW URLS (top actionable) ===")
    for t in actionable.head(12).ticker:
        print(f"https://www.tradingview.com/chart/?symbol={t}")

if __name__ == "__main__":
    main()
