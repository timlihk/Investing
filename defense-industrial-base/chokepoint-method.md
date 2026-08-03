# Chokepoint Score Method — Defense Industrial Base

This theme uses the repo-standard five-question chokepoint framework (identical to `ai-photonics/chokepoint-method.md`), so scores are comparable across books. Each question scores `1-5`; `chokepoint_score = breakage + alternatives + qualification + cogs + capacity`.

Raw inputs live in `chokepoint_scores.tsv` and are regenerated from `dib-dashboard-data.js` by `scripts/generate-tsv.mjs`, so the dashboard and the flat files cannot drift apart.

| # | Question | 5 | 3 | 1 |
|---|----------|---|---|---|
| 1 | `breakage` — what breaks if they stop shipping? | Entire downstream chain impaired | Some products delayed | Minor inconvenience |
| 2 | `alternatives` — how many viable alternatives? | Practical monopoly | Oligopoly, several qualified | Commodity market |
| 3 | `qualification` — time to qualify a replacement? | >2 years | 6-12 months | Near-immediate |
| 4 | `cogs` — position in customer economics? | Cheap but critical | Meaningful but manageable | High-cost and replaceable |
| 5 | `capacity` — structurally constrained? | Physics, process know-how, geology, permits | Some expansion friction | Little real scarcity |

Tier mapping: `21-25` Monopoly · `16-20` Duopoly · `11-15` Oligopoly with Moat · `6-10` Competitive / Linked · `1-5` Commodity / Indirect.

## Theme-specific conventions

**1. Score at the munitions layer, not the corporation.** NewMarket scores 25/25 for AMPAC's ammonium perchlorate position, not for petroleum additives. Where corporate dilution is material — NEU, Toray, Shin-Etsu, TDK, GD, BA — it is stated explicitly in the `one_liner` and must be quantified before sizing. **A high chokepoint score is not a position size.**

**2. `capacity` carries extra weight in this theme, and the evidence is unusually hard.** In most value chains, "capacity is constrained" is a judgement call. Here there is a natural experiment: after **$6bn** invested, 155mm output was still **~56k shells/month against a 100k goal** (Feb 2026). When a layer absorbs billions and does not expand, `capacity = 5` is an observation, not a forecast.

**3. Permits and workforce count as physical constraints.** Energetics plants are gated by environmental permitting and by a specialist workforce that is ageing without replacement. Both are multi-year and neither responds to capital, so both justify `capacity = 5`.

**4. A duopoly under a hard capacity ceiling can score into the monopoly band — deliberately.** NOC and LHX score 22 with `alternatives = 4`. Two suppliers both running at their limit behave, for a customer trying to place an order, like one. The `alternatives` input keeps the duopoly visible in the raw data even where the tier label says Monopoly. Read the five-digit input string, not just the tier.

**5. Platform assembly scores low, and should.** Hyundai Rotem (12/25) and KAI (13/25) build whole systems. Assembly is the **widest** point in the chain — many nations can do it. This is why a +127% consensus target gap on Rotem is not the same investment as a +36% gap on IHI.

## The capex-side overlay

This theme adds one field that is not part of the standard framework, because it turned out to be the dominant driver of 2026 returns:

| `capex_side` | Meaning | 2026 pattern |
|---|---|---|
| `spends` | Bears the capacity capex | De-rated — LHX −5.6%, NOC −4.9% despite beat-and-raise |
| `receives` | Sells into others' expansion | Re-rated — DCO +88%, CRS +65%, ATI +63% |
| `both` | Building its own plant while supplying others | Mixed — Hanwha, Rheinmetall, MP |

A strong chokepoint on the `spends` side is a **timing** problem, not a quality problem: the capex compressing today's FCF is exactly what creates the 2028+ earnings. That is the core of the NOC/LHX thesis and the reason this book holds them as multi-year positions rather than momentum trades.

## What the score does not capture

- **Headline beta.** Rheinmetall's chokepoint (17) is unaffected by peace talks; its share price is not. Kill conditions are tracked separately in `value-chain.md`.
- **Balance sheet.** USA Rare Earth scores 19 with no earnings to speak of. Financial Strength is a separate dimension in `criteria.md`.
- **Programme risk.** Northrop's B-21 fixed-price losses (~$2.0bn cumulative LRIP, $1.0bn accrual remaining) sit outside the SRM thesis entirely but will still move the stock.
