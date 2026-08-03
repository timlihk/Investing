// Regenerates chokepoint_scores.tsv and results.tsv from dib-dashboard-data.js
// so the dashboard and the flat files can never drift apart.
//   node scripts/generate-tsv.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'dib-dashboard-data.js'), 'utf8');
const window = {};
new Function('window', src)(window);

const { DIB_COMPANIES: CO, DIB_LAYERS: L, DIB_META: M } = window;
const sum = c => c.reduce((a, b) => a + b, 0);
const tier = s => s >= 21 ? 'Monopoly Chokepoint' : s >= 16 ? 'Duopoly Chokepoint'
  : s >= 11 ? 'Oligopoly with Moat' : s >= 6 ? 'Competitive / Linked' : 'Commodity / Indirect';
const layerName = id => (L.find(x => x.id === id) || {}).name || id;
const num = (v, d = 1) => v == null ? '' : v.toFixed(d);
const clean = s => String(s ?? '').replace(/[\t\n\r]+/g, ' ').trim();

const order = [...CO].sort((a, b) => sum(b.c) - sum(a.c) || b.score - a.score);

writeFileSync(join(root, 'chokepoint_scores.tsv'),
  ['ticker\tbreakage\talternatives\tqualification\tcogs\tcapacity\tchokepoint_score\tchokepoint_tier',
    ...order.map(c => [c.t, ...c.c, sum(c.c), tier(sum(c.c))].join('\t'))].join('\n') + '\n');

writeFileSync(join(root, 'results.tsv'),
  ['ticker\tname\tregion\tlayer\tchokepoint_score\tchokepoint_tier\tscore\tverdict\tprice\tccy\tytd_pct\tfwd_pe\ttarget\tupside_pct\tcapex_side\trisk_level\tcatalyst\tone_liner',
    ...order.map(c => [
      c.t, clean(c.n), c.reg, layerName(c.layer), sum(c.c), tier(sum(c.c)), c.score, c.verdict,
      c.px ?? '', c.ccy, num(c.ytd), num(c.pe), c.tgt ?? '', num(c.up),
      c.capexSide, c.risk, clean(c.cat), clean(c.one)
    ].join('\t'))].join('\n') + '\n');

console.log(`as of ${M.asOf}: wrote ${order.length} rows to chokepoint_scores.tsv and results.tsv`);
