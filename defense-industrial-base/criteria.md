# Scoring Criteria — Defense Industrial Base

Total score out of 100, using the repo-standard chokepoint weighting so results are comparable with `ai-photonics` and `memory-supercycle`.

| Dimension | Points | Source |
|---|---|---|
| **Chokepoint Strength** | 30 | Derived from `chokepoint_score` — see `chokepoint-method.md` |
| **Financial Strength** | 25 | Margins, FCF, leverage, ROIC |
| **Growth** | 20 | Revenue CAGR, backlog, TAM direction |
| **Valuation** | 15 | Forward P/E vs growth, distance to consensus target, YTD move |
| **Catalyst & Timing** | 10 | Dated, identifiable events |

Chokepoint mapping: `21-25` → 26-30 pts · `16-20` → 20-25 · `11-15` → 14-19 · `6-10` → 7-13 · `1-5` → 1-6.

Verdict bands: **BUY** ≥ 72 · **HOLD** 55-71 · **AVOID** < 55 · **SPEC** (option-like, no earnings anchor) · **WATCH** (insufficient data to rate).

## Scoring discipline

- Score the five chokepoint dimensions first; apply nothing else until the base score is complete.
- Do not double-count a fact in both `Catalyst & Timing` and `Chokepoint Strength`.
- Label every input `reported`, `guided` or `estimated`.
- Keep the raw five-question inputs in `chokepoint_scores.tsv` so `chokepoint_score` stays auditable and separable from the investment score.
- **Never mix sourced market data with judgement.** Price, YTD, forward P/E and consensus target are Bloomberg. Scores, tiers, verdicts and one-liners are judgement. The dashboard states this on every view.

## Theme-specific rules

**1. Valuation is scored against the 2026 dispersion, not against history.** This sector bifurcated violently: input suppliers ran +37% to +88% while the primes doing the spending fell. A 40x forward multiple on a supplier that has already doubled scores *worse* than 22x on a capacity owner that is down on the year, even where the supplier's chokepoint is stronger. `PKE` (chokepoint 21) scores 66; `LHX` (chokepoint 22) scores 75 — almost entirely on this.

**2. Catalyst points require a date or a decision.** Qualifying: L3Harris's missile-business separation; Northrop's Allegany capacity doubling (autumn 2026); the 2027 DoD China-magnet prohibition; MHI's PAC-3 MSE co-production decision. Not qualifying: "rising geopolitical tension", "elevated defence budgets".

**3. Penalise conditional funding explicitly.** Golden Dome is $17.5bn in FY27 — with **$400m in the base budget** and the balance dependent on reconciliation. Any thesis leaning on it (RKLB most directly) takes a Catalyst haircut until the money is appropriated, not requested.

**4. Corporate dilution caps the score.** Where the chokepoint sits inside a much larger unrelated business, the Chokepoint points are earned but Growth and Catalyst are capped, because the bottleneck cannot move the consolidated P&L. This is why NEU scores 76 rather than the ~85 its 25/25 chokepoint would otherwise imply, and why Shin-Etsu is a HOLD at 18.6x.

**5. Headline beta is a Risk field, not a score deduction.** Rheinmetall's peace-deal sensitivity does not reduce its Financial Strength. It is captured in `risk_level` and in the kill conditions, so position sizing — not the score — carries it.

**6. Platform assemblers face a hard ceiling.** Anything scoring below 14 on chokepoint cannot exceed 68 overall regardless of how cheap it looks. A wide consensus target gap on a weak chokepoint is a forecast about orders; a wide gap on a strong one is a claim about mispriced scarcity. Only the second is this book's edge.

## Data conventions

- Market data: Bloomberg `PX_LAST`, `CHG_PCT_YTD`, `BEST_PE_RATIO`, `BEST_TARGET_PRICE`, `EQY_REC_CONS`, dated in `DIB_META.asOf`.
- Prices are local currency; `ccy` is carried per row and never silently converted. FX is a named kill condition, not a rounding step.
- Live overlay on the dashboard is Yahoo (delayed) via the worker's `/api/market/quotes` proxy and will differ from the Bloomberg close. It is labelled `live` and never overwrites the sourced figure.
- Unverified claims are marked inline in the row text. Currently: IHI Aerospace's SRM position; defence-revenue split at Toray, Shin-Etsu, TDK. Toho Titanium returned no price and is `WATCH`, not rated.
