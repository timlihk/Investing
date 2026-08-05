// Watchlist theme config — add/edit tickers here (Yahoo Finance symbols).
// Live prices + performance come from /api/market/quotes + /api/market/detail
// (free Yahoo Finance via the Cloudflare worker — no Bloomberg quota).
window.WATCHLIST_THEMES = [
  {
    id: "abf",
    name: "ABF Substrates 载板",
    tagline: "AI advanced packaging bottleneck — ABF/IC substrates, film & foil chokepoints, glass-substrate optionality.",
    tickers: [
      { symbol: "4062.T",   name: "Ibiden 揖斐电" },
      { symbol: "3037.TW",  name: "Unimicron 欣兴电子" },
      { symbol: "8046.TW",  name: "Nan Ya PCB 南亚电路板" },
      { symbol: "3189.TW",  name: "Kinsus 景硕" },
      { symbol: "009150.KS",name: "Samsung Electro-Mechanics 三星电机" },
      { symbol: "ATS.VI",   name: "AT&S (substrates)" },
      { symbol: "2802.T",   name: "Ajinomoto 味之素 (ABF film)" },
      { symbol: "5706.T",   name: "Mitsui Kinzoku 三井金属 (foil)" },
      { symbol: "5214.T",   name: "Nippon Electric Glass 日本电气硝子" },
      { symbol: "011790.KS",name: "SKC (Absolics glass)" },
      { symbol: "3481.TW",  name: "Innolux 群创 (glass CoWoS)" },
      { symbol: "002916.SZ",name: "Shennan Circuits 深南电路" },
      { symbol: "002436.SZ",name: "Xingsen Tech 兴森科技" },
      { symbol: "600183.SS",name: "Shengyi Tech 生益科技 (CCL)" }
    ]
  },
  {
    id: "memory",
    name: "Memory Supercycle 存储",
    tagline: "HBM leaders, TC-bonder/back-end bottlenecks, test & probe intensity, controller/storage silicon.",
    tickers: [
      { symbol: "000660.KS", name: "SK hynix" },
      { symbol: "005930.KS", name: "Samsung Electronics" },
      { symbol: "MU",        name: "Micron Technology" },
      { symbol: "285A.T",    name: "Kioxia Holdings" },
      { symbol: "042700.KS", name: "Hanmi Semiconductor" },
      { symbol: "0522.HK",   name: "ASMPT" },
      { symbol: "6857.T",    name: "Advantest" },
      { symbol: "6315.T",    name: "TOWA" },
      { symbol: "8035.T",    name: "Tokyo Electron" },
      { symbol: "FORM",      name: "FormFactor" },
      { symbol: "SIMO",      name: "Silicon Motion" },
      { symbol: "SNDK",      name: "Sandisk" },
      { symbol: "8110.TW",   name: "Walton Advanced Engineering" },
      { symbol: "AMKR",      name: "Amkor Technology" }
    ]
  },
  {
    id: "photonics",
    name: "AI Photonics 光通信",
    tagline: "Optical interconnect, silicon photonics, transceivers — the AI cluster 'connection' layer.",
    tickers: [
      { symbol: "CRDO",   name: "Credo" },
      { symbol: "MTSI",   name: "MACOM" },
      { symbol: "MRVL",   name: "Marvell" },
      { symbol: "AVGO",   name: "Broadcom" },
      { symbol: "LITE",   name: "Lumentum" },
      { symbol: "COHR",   name: "Coherent" },
      { symbol: "AAOI",   name: "AAOI" },
      { symbol: "CIEN",   name: "Ciena" },
      { symbol: "SMTC",   name: "Semtech" },
      { symbol: "TSEM",   name: "Tower Semi" },
      { symbol: "6503.T", name: "Mitsubishi Electric" },
      { symbol: "6777.T", name: "Santec" },
      { symbol: "5802.T", name: "Sumitomo Electric" },
      { symbol: "4991.TWO",name: "GCS Holdings" },
      { symbol: "6442.TW",name: "EZconn" },
      { symbol: "6869.HK",name: "YOFC 长飞光纤" }
    ]
  },
  {
    id: "defense",
    name: "Defense Industrial Base 国防",
    tagline: "Where the Western munitions chain physically narrows — energetics, SRM, specialty metals, primes.",
    tickers: [
      { symbol: "NEU",      name: "NewMarket (AMPAC)" },
      { symbol: "012450.KS",name: "Hanwha Aerospace" },
      { symbol: "103140.KS",name: "Poongsan" },
      { symbol: "LHX",      name: "L3Harris (Aerojet)" },
      { symbol: "NOC",      name: "Northrop Grumman" },
      { symbol: "7013.T",   name: "IHI" },
      { symbol: "HXL",      name: "Hexcel" },
      { symbol: "ATI",      name: "ATI Inc" },
      { symbol: "CRS",      name: "Carpenter Technology" },
      { symbol: "HWM",      name: "Howmet Aerospace" },
      { symbol: "TDY",      name: "Teledyne" },
      { symbol: "MRCY",     name: "Mercury Systems" },
      { symbol: "HO.PA",    name: "Thales" },
      { symbol: "CW",       name: "Curtiss-Wright" },
      { symbol: "KRMN",     name: "Karman Holdings" },
      { symbol: "MP",       name: "MP Materials" },
      { symbol: "LMT",      name: "Lockheed Martin" },
      { symbol: "RTX",      name: "RTX" },
      { symbol: "GD",       name: "General Dynamics" },
      { symbol: "KOG.OL",   name: "Kongsberg Gruppen" }
    ]
  }
];
