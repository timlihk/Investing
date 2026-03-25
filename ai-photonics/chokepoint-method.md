# Chokepoint Score Method

This project now tracks a dedicated `chokepoint_score` separate from the broader investment score.

The chokepoint score is a fixed 5-question framework scored on a `1-5` scale for each question:

1. `breakage`
What breaks if this company stops shipping?
- `5`: entire downstream chain or category is materially impaired
- `4`: a major product class or customer program breaks
- `3`: some products are delayed or repriced
- `2`: localized disruption only
- `1`: minor inconvenience

2. `alternatives`
How many viable alternatives exist at the relevant layer?
- `5`: no meaningful alternative or practical monopoly
- `4`: duopoly / very thin field
- `3`: oligopoly with several qualified options
- `2`: competitive field with multiple substitutes
- `1`: commodity market

3. `qualification`
How long does it take to qualify a replacement?
- `5`: more than 2 years
- `4`: roughly 1-2 years
- `3`: 6-12 months
- `2`: under 6 months but still non-trivial
- `1`: near-immediate substitution

4. `cogs`
How attractive is the supplier position in customer economics?
- `5`: cheap but critical, usually a very small share of customer COGS
- `4`: still low-cost relative to system value
- `3`: meaningful but manageable cost line
- `2`: customers are strongly motivated to redesign around it
- `1`: high-cost and replaceable

5. `capacity`
Is supply structurally constrained?
- `5`: constrained by physics, process know-how, geology, or unique installed base
- `4`: long-cycle specialized capex or scarce expertise
- `3`: some expansion friction but capacity can grow
- `2`: capacity can scale with normal investment
- `1`: little real scarcity

## Output

`chokepoint_score = breakage + alternatives + qualification + cogs + capacity`

Tier mapping:
- `21-25`: `Monopoly Chokepoint`
- `16-20`: `Duopoly Chokepoint`
- `11-15`: `Oligopoly with Moat`
- `6-10`: `Competitive / Linked`
- `1-5`: `Commodity / Indirect`

## Project Conventions

- Score the company at the most relevant optical / AI-infrastructure layer, not on total corporate diversification alone.
- Conglomerates can still score highly if they control a narrow critical layer, but diversification may reduce conviction in the broader investment score.
- The chokepoint score is meant to answer structural bottleneck strength, not valuation or management quality.
- The canonical per-company dataset lives in `chokepoint_scores.tsv`.
