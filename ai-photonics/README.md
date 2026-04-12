# AI Photonics / Optical Interconnects Research

Research session: 2026-03-24 | Branch: research/mar24-ai-photonics

## Thesis
The AI data center buildout is creating an insatiable demand for optical interconnects -- the photonic "nervous system" that connects GPUs, switches, and racks using light instead of copper. This research maps the full supply chain from substrate wafers to networking systems, identifying chokepoints and under-discovered beneficiaries globally.

## Scorecard

See [results.tsv](results.tsv) for the full scorecard.
The scorecard now includes `chips_status` and `chips_detail` columns from the latest official CHIPS sweep.
The scorecard also now carries `chokepoint_score` and `chokepoint_tier`, with raw 5-question inputs stored in `chokepoint_scores.tsv` and the fixed rubric documented in [chokepoint-method.md](chokepoint-method.md).

Interactive map:
- [Optics dashboard](https://timlihk.github.io/Investing/ai-photonics/optics-dashboard.html) - full repo universe grouped by segment, with Yahoo snapshot data and local 1-year charts
- [GitHub Pages map](https://timlihk.github.io/Investing/ai-photonics/supply-chain-map.html) - curated subset, synced to the main scorecard
- [Local HTML file](supply-chain-map.html)
- [Chokepoint vs economics scatter](chokepoint-economics-map.html)
- [CHIPS Act status notes](chips-act-status.md)
- [Independent IC review](ic-review.md)

### BUY Ratings
| Ticker | Score | Price | Target | Upside | Chokepoint |
|--------|-------|-------|--------|--------|------------|
| CRDO | 82 | $100 | $170 | +70% | 88% AEC monopoly + 3nm optical DSP |
| MTSI | 76 | $255 | $300 | +18% | Analog ICs inside every transceiver |
| TSEM | 75 | $164 | $200 | +22% | 85% SiPh foundry (TSMC of photonics) |

### Watch List (upgrade to BUY on pullback)
| Ticker | Score | Current | Buy At | Trigger |
|--------|-------|---------|--------|---------|
| FN | 71 | $506 | $420-450 | Fortress balance sheet, NVIDIA sole-source |
| VIAV | 69 | $34 | $28-30 | Cheapest AI photonics at 5x sales |
| SOI.PA | 65 | EUR59 | EUR45-50 | Only volume photonics-SOI supplier |

### Supply Chain Map
```
Layer 1 - Substrates:     Soitec (SOI.PA) --> photonics-SOI wafers
                          AXT (AXTI) -------> InP substrates
                                |                    |
Layer 2 - Foundry:        Tower Semi (TSEM) <-- 85% SiPh foundry
                                |
Layer 3 - Components:     Lumentum (LITE) ---> EML laser chips (50-60% share)
                          MACOM (MTSI) ------> TIAs, drivers, CDRs (57% GM)
                          Sivers (SIVE.ST) --> DFB lasers (micro-cap)
                                |
Layer 4 - Connectivity:   Credo (CRDO) ------> AEC cables (88% share) + optical DSP
                                |
Layer 5 - Modules:        Coherent (COHR) ---> optical transceivers
                          AAOI ---------------> optical transceivers (US mfg)
                          Fabrinet (FN) -----> contract manufacturing
                                |
Layer 6 - Systems:        Ciena (CIEN) ------> optical networking (WaveLogic 6)
                          VIAV ---------------> test & measurement
```

## Reports
Individual company reports with full analysis in [reports/](reports/).

## Files
- [results.tsv](results.tsv) - Running scorecard
- [chokepoint_scores.tsv](chokepoint_scores.tsv) - Canonical 5-question chokepoint dataset
- [chokepoint-method.md](chokepoint-method.md) - Fixed chokepoint scoring method
- [company-metrics.js](company-metrics.js) - Full-universe metrics dataset for the scatter chart
- [optics-dashboard.html](optics-dashboard.html) - Segment-grouped dashboard for all covered names
- [optics-dashboard-data.js](optics-dashboard-data.js) - Generated Yahoo Finance snapshot consumed by the dashboard
- [universe.txt](universe.txt) - Stock universe (expanding via discovery)
- [supply-chain-map.html](supply-chain-map.html) - Interactive chokepoint map for GitHub Pages
- [chokepoint-economics-map.html](chokepoint-economics-map.html) - Scatter view of chokepoint vs margins / growth
- [chips-act-status.md](chips-act-status.md) - Direct CHIPS incentives status for the mapped companies
- [ic-review.md](ic-review.md) - Independent committee review of every covered company
- [criteria.md](criteria.md) - Scoring rubric
- [program.md](program.md) - Research agent operating instructions

## Dashboard Refresh
The segment dashboard is a static page, so GitHub Pages can host it directly. The market snapshot is generated with Yahoo Finance on the server side and written into `optics-dashboard-data.js`.

Refresh locally:
```bash
npm install
npm run refresh:dashboard
```

Automated refresh:
- `.github/workflows/refresh-optics-dashboard.yml` refreshes the dashboard on a schedule, on manual dispatch, and when the research inputs change on `main`.

## Cloudflare Pages
This repo is ready to publish as a static Cloudflare Pages project.

Recommended Pages settings:
- Framework preset: `None`
- Production branch: `main`
- Build command: `npm ci && npm run build`
- Build output directory: `.`
- Root directory: `ai-photonics` if you connect the monorepo root, otherwise leave blank if this folder is its own repo
- Environment variable: `NODE_VERSION=20`

Notes:
- `npm run build` regenerates `optics-dashboard-data.js` before deploy.
- The output directory is the repo root because the site is plain HTML / JS, not a `dist/` app.
- If Cloudflare Pages build stability becomes an issue because Yahoo Finance is queried during build, move the data refresh upstream into GitHub Actions and let Pages publish prebuilt artifacts only.
