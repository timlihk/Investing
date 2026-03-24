# AI Photonics - CHIPS Act Sweep

As of 2026-03-24. This note summarizes the latest official CHIPS incentives and CHIPS R&D / hub announcements that overlap with the `ai-photonics` scorecard.

Scope of the sweep:
- Department of Commerce CHIPS incentives final awards and preliminary memoranda of terms
- CHIPS NAPMP advanced-packaging awards
- CHIPS-linked hub / Microelectronics Commons disclosures from companies when those directly touched a scorecard name

The full per-company status now lives in [results.tsv](results.tsv) under `chips_status` and `chips_detail`.

## Positive matches

| Ticker | Company | Status | Why it counts | Sources |
|---|---|---|---|---|
| GFS | GlobalFoundries | FINAL+AMENDED | Final CHIPS incentives award plus amended Malta advanced-packaging funding tied to photonic integrated circuit packaging. | [GF award agreement](https://investors.gf.com/node/9451/pdf), [Commerce amendment](https://www.commerce.gov/news/press-releases/2025/01/us-department-commerce-announces-chips-incentives-awards-corning) |
| GLW | Corning | FINAL | Final CHIPS award for ULE / fused-silica lithography materials, relevant to the fab-tool chain. | [Commerce final awards](https://www.commerce.gov/news/press-releases/2025/01/us-department-commerce-announces-chips-incentives-awards-corning) |
| INTC | Intel | FINAL | Final CHIPS incentives award for U.S. fab and packaging expansion. | [Commerce Intel award](https://www.commerce.gov/news/press-releases/2024/11/biden-harris-administration-announces-chips-incentives-award-intel) |
| AMKR | Amkor | FINAL | Final CHIPS award for Arizona advanced packaging and test. | [Commerce Amkor award](https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-incentives-award-amkor) |
| MTSI | MACOM | PROPOSED | Commerce announced up to $70M in proposed direct funding for Lowell and Durham manufacturing expansion. | [Commerce MACOM PMT](https://www.commerce.gov/news/press-releases/2025/01/us-department-commerce-announces-preliminary-terms-macom-help) |
| COHR | Coherent | PROPOSED+R&D | Commerce PMT for Easton plus company-disclosed CHIPS-backed CLAWS funding and Sherman InP PMT support. | [Commerce Coherent PMT](https://www.commerce.gov/news/press-releases/2025/01/department-commerce-announces-preliminary-terms-analog-devices-coherent), [Coherent CHIPS funding](https://www.coherent.com/news/press-releases/coherent-secures-chips-act-funding), [Coherent Sherman InP PMT](https://www.coherent.com/news/press-releases/pmt-for-expansion-of-worlds-first-150mm-inp-mfg-line) |
| AMAT | Applied Materials | R&D_FINAL | Final CHIPS NAPMP award for silicon-core substrate packaging R&D. | [Commerce NAPMP awards](https://www.commerce.gov/news/press-releases/2025/01/us-department-commerce-announces-14-billion-final-awards-support-next) |
| SIVE.ST | Sivers Semiconductors | R&D | CHIPS / Microelectronics Commons-backed NEMC awards. Important nuance: this funding sits in the `Wireless` division, not directly in the optical unit. | [Sivers annual report 2024](https://www.sivers-semiconductors.com/wp-content/uploads/2025/04/Sivers_arsredovisning_2024.pdf), [Sivers Q1 2025 interim report](https://www.sivers-semiconductors.com/wp-content/uploads/2025/05/Sivers-Interim-report-Q125_FINAL.pdf), [Sivers Q4 2025 interim report](https://www.sivers-semiconductors.com/wp-content/uploads/2026/02/Sivers-Interim-report-Q425_Final.pdf) |
| NOK | Nokia | INDIRECT_FINAL | Nokia itself did not receive the award, but its acquired asset Infinera received a final CHIPS award before the February 2025 close. | [Commerce Infinera award](https://www.commerce.gov/news/press-releases/2025/01/us-department-commerce-announces-chips-incentives-awards-corning), [Nokia 2025 Q4 slides](https://www.nokia.com/system/files/2026-01/nokia_slides_2025_q4.pdf) |

## Interpretation

- `FINAL` and `FINAL+AMENDED` are the strongest labels. These are actual awarded CHIPS dollars, not just negotiations.
- `PROPOSED` means the company has a signed PMT or equivalent but the award was not final in the latest official sweep I found.
- `R&D` and `R&D_FINAL` are real CHIPS-linked support, but they are not the same as commercial-facility incentives.
- `INDIRECT_FINAL` means the public company in the scorecard benefits through an acquired asset or inherited operating platform, not because the listed parent was the original direct awardee.

## Important correction

`SIVE.ST` should not have been omitted from the CHIPS-linked set. It does have CHIPS-backed funding via the NEMC / Microelectronics Commons pathway. The reason it was easy to miss is that the disclosed awards are tied to Sivers' wireless programs rather than the photonics unit used in this research project.

## Everything else

All other rows in [results.tsv](results.tsv) are currently marked `NONE`, meaning I did not find a direct or CHIPS-linked award in the latest official sweep through 2026-03-24.
