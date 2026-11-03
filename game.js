"use strict";

/* ============ DATA ============ */

const PLANETS = [
  {
    id: "terra", name: "Terra Nova", color: "#4ecdc4", ring: false, moons: 1,
    desc: "The first colony. Rich iron deposits in the northern craters.",
    res: "Metal", resIcon: "⚙️", resColor: "#9db4c0",
    unlockCost: null,
    buildings: [
      { id: "drill", name: "Auto-Drill", baseCost: 15, mult: 1.15, rate: 0.25,  desc: "A tireless robotic drill." },
      { id: "rig",   name: "Mining Rig", baseCost: 130, mult: 1.15, rate: 1,   desc: "Industrial extraction array." },
      { id: "quarry",name: "Strip Quarry", baseCost: 900, mult: 1.15, rate: 4.5, desc: "Moves mountains. Literally." },
      { id: "cannon", name: "Rail Cannon", baseCost: 6000, mult: 1.15, rate: 18, desc: "Fires ingots into orbit." },
      { id: "elevator", name: "Orbital Elevator", baseCost: 38000, mult: 1.15, rate: 70, desc: "A ribbon to the sky." },
      { id: "forge", name: "Planetary Forge", baseCost: 240000, mult: 1.15, rate: 320, desc: "The crust is raw material." },
    ],
    upgrades: [
      { id: "pick",  name: "Plasma Pickaxe", cost: 150,  type: "click",  val: 2, desc: "Mining power ×2." },
      { id: "conveyor", name: "Conveyor Network", cost: 2500, type: "prod", val: 2, desc: "Metal production ×2." },
      { id: "droids", name: "Excavation Droids", cost: 40000, type: "prod", val: 3, desc: "Metal production ×3." },
    ],
  },
  {
    id: "luna", name: "Luna", color: "#c0c0d8", ring: false, moons: 0,
    desc: "Regolith fields of helium-3. Perfect fusion fuel.",
    res: "Helium-3", resIcon: "🫧", resColor: "#b8a9e8",
    unlockCost: { Metal: 50000 },
    buildings: [
      { id: "probe", name: "Harvest Probe", baseCost: 800, mult: 1.15, rate: 4.5,   desc: "Skims He-3 from the dust." },
      { id: "scoop", name: "Regolith Scoop", baseCost: 6000, mult: 1.15, rate: 22,  desc: "Eats the surface, spits fuel." },
      { id: "ranch", name: "He-3 Refinery", baseCost: 42000, mult: 1.15, rate: 105, desc: "Bulk isotope processing." },
      { id: "driver", name: "Mass Driver", baseCost: 300000, mult: 1.15, rate: 500, desc: "Throws regolith by the ton." },
      { id: "fplant", name: "Fusion Plant", baseCost: 2100000, mult: 1.15, rate: 2400, desc: "Burns its own product." },
      { id: "breeder", name: "Helium Breeders", baseCost: 15000000, mult: 1.15, rate: 6670, desc: "Isotopes begetting isotopes." },
    ],
    upgrades: [
      { id: "lunadrill", name: "Lunar Drill Tips", cost: 12000, type: "click", val: 2, desc: "Helium-3 mining power ×2." },
      { id: "compress", name: "Isotope Compressors", cost: 90000, type: "prod", val: 2, desc: "Helium-3 production ×2." },
      { id: "fusion", name: "Fusion Feedloops", cost: 1200000, type: "prod", val: 3, desc: "Helium-3 production ×3." },
    ],
  },
  {
    id: "ceres", name: "Ceres Belt", color: "#8d6e63", ring: true, moons: 0,
    desc: "An asteroid swarm glittering with raw crystal.",
    res: "Crystal", resIcon: "💎", resColor: "#7fdbff",
    unlockCost: { Metal: 1500000, "Helium-3": 150000 },
    buildings: [
      { id: "cutter", name: "Crystal Cutter", baseCost: 20000, mult: 1.15, rate: 37,  desc: "Lasers meet rock." },
      { id: "sifter", name: "Belt Sifter", baseCost: 140000, mult: 1.15, rate: 200, desc: "Screens a thousand rocks an hour." },
      { id: "crawn",   name: "Crystal Crawler", baseCost: 1000000, mult: 1.15, rate: 1000, desc: "Walks between asteroids, mining all of them." },
      { id: "highway", name: "Belt Highway", baseCost: 7000000, mult: 1.15, rate: 5000, desc: "A road made of checkpoints." },
      { id: "foundry", name: "Crystal Foundry", baseCost: 50000000, mult: 1.15, rate: 25000, desc: "Cutting houses the size of cities." },
      { id: "lattice", name: "Zero-G Lattice", baseCost: 350000000, mult: 1.15, rate: 52000, desc: "Crystal grows in the void, untended." },
    ],
    upgrades: [
      { id: "lens", name: "Focused Lens Array", cost: 300000, type: "click", val: 2, desc: "Crystal mining power ×2." },
      { id: "sort", name: "Spectral Sorters", cost: 2500000, type: "prod", val: 2, desc: "Crystal production ×2." },
      { id: "vein", name: "Vein Scanners", cost: 40000000, type: "prod", val: 3, desc: "Crystal production ×3." },
    ],
  },
  {
    id: "aurelia", name: "Aurelia", color: "#e8b04a", ring: true, moons: 2,
    desc: "A ringed giant. Its upper clouds condense pure antimatter.",
    res: "Antimatter", resIcon: "✴️", resColor: "#ff6b9d",
    unlockCost: { Metal: 300000000, "Helium-3": 40000000, Crystal: 20000000 },
    buildings: [
      { id: "skimmer", name: "Cloud Skimmer", baseCost: 1500000, mult: 1.15, rate: 926, desc: "Balloon-drifts through the storm layers." },
      { id: "trap",   name: "Mag-Trap Station", baseCost: 11000000, mult: 1.15, rate: 4500, desc: "Catches the impossible in a bottle." },
      { id: "carrier", name: "Antimatter Carrier", baseCost: 80000000, mult: 1.15, rate: 22000, desc: "One crash = no more colony." },
      { id: "harvest", name: "Storm Harvester", baseCost: 560000000, mult: 1.15, rate: 105000, desc: "Drinks hurricanes." },
      { id: "eye", name: "Eye of Aurelia", baseCost: 4000000000, mult: 1.15, rate: 600000, desc: "A station in the calm center of the storm." },
      { id: "continuum", name: "Continuum Engine", baseCost: 30000000000, mult: 1.15, rate: 1500000, desc: "It shouldn't exist. It disagrees." },
    ],
    upgrades: [
      { id: "penn", name: "Penning Fields", cost: 8000000, type: "click", val: 2, desc: "Antimatter mining power ×2." },
      { id: "loop", name: "Storage Loops", cost: 70000000, type: "prod", val: 2, desc: "Antimatter production ×2." },
      { id: "sing", name: "Micro-Singularities", cost: 900000000, type: "prod", val: 3, desc: "Antimatter production ×3." },
    ],
  },
];

const TECHS = [
  { id: "lab",   name: "Research Lab",     cost: { Metal: 400, Crystal: 120 },            desc: "Build labs that generate Science.", repeat: true, effect: "building" },
  { id: "t_auto1", name: "Automation I",   cost: { Science: 100 },  desc: "All production +25%.", effect: "global", val: 0.25 },
  { id: "t_auto2", name: "Automation II",  cost: { Science: 800 }, desc: "All production +50%.", req: "t_auto1", effect: "global", val: 0.5 },
  { id: "t_auto3", name: "Automation III", cost: { Science: 5000 }, desc: "All production +100%.", req: "t_auto2", effect: "global", val: 1.0 },
  { id: "t_mine1", name: "Mining I",       cost: { Science: 150 },  desc: "All mining power ×2.", effect: "click", val: 2 },
  { id: "t_mine2", name: "Mining II",      cost: { Science: 1200 }, desc: "All mining power ×3.", req: "t_mine1", effect: "click", val: 3 },
  { id: "t_mine3", name: "Mining III",     cost: { Science: 8000 }, desc: "All mining power ×4.", req: "t_mine2", effect: "click", val: 4 },
  { id: "t_sci1",  name: "Institutes",     cost: { Science: 400 },  desc: "Science output ×2.", req: "t_auto1", effect: "sci", val: 2 },
  { id: "t_sci2",  name: "Academy Worlds", cost: { Science: 3000 }, desc: "Science output ×3.", req: "t_sci1", effect: "sci", val: 3 },
  { id: "t_off",   name: "Deep-Space Logs", cost: { Science: 250 }, desc: "Offline progress at 75% instead of 50%.", effect: "offline" },
  { id: "t_click_yield", name: "Resonant Mining", cost: { Science: 1500 }, desc: "Each colony click also yields Metal.", req: "t_mine1", effect: "resonant" },
];

const MASTERY = [
  { id: "m_prod1",  name: "Galactic Legacy I",   cost: 1,  desc: "+25% all production.", },
  { id: "m_prod2",  name: "Galactic Legacy II",  cost: 3,  req: "m_prod1", desc: "+50% all production." },
  { id: "m_prod3",  name: "Singularity Engine",  cost: 15, req: "m_prod2", desc: "×5 all production." },
  { id: "m_start",  name: "Head Start Protocol", cost: 2,  desc: "Every run starts with 2,500 Metal." },
  { id: "m_click",  name: "Gravity Gloves",      cost: 3,  req: "m_prod1", desc: "All mining power ×3." },
  { id: "m_sci",    name: "Cosmic Consciousness",cost: 3,  req: "m_prod1", desc: "Science output ×2." },
  { id: "m_travel", name: "Wormhole Charts",     cost: 4,  req: "m_start", desc: "Colonization costs −50%." },
  { id: "m_off",    name: "Ascended Rest",       cost: 5,  req: "m_sci",   desc: "Offline progress at 100%." },
  { id: "m_shard",  name: "Shard Resonance",     cost: 6,  req: "m_prod2", desc: "+50% Ascendancy Shards on ascend." },
  { id: "m_auto",   name: "Drone Overmind",      cost: 8,  req: "m_prod2", desc: "Runs start with 10 free tier-1 buildings per colonized planet." },
  { id: "m_memory", name: "Stellar Memory",      cost: 10, req: "m_travel", desc: "Keep discovered planets when ascending." },
];

const ACH = [
  { id: "a_click1", name: "Hands Dirty",     desc: "Mine 100 times.",            cond: s => s.stats.clicks >= 100 },
  { id: "a_click2", name: "Blistered",       desc: "Mine 1,000 times.",          cond: s => s.stats.clicks >= 1000 },
  { id: "a_click3", name: "Carpal Ascension",desc: "Mine 10,000 times.",         cond: s => s.stats.clicks >= 10000 },
  { id: "a_b1", name: "Foreman",        desc: "Own 10 colonists.",    cond: s => totalBuildings() >= 10 },
  { id: "a_b2", name: "Governor",       desc: "Own 50 colonists.",    cond: s => totalBuildings() >= 50 },
  { id: "a_b3", name: "Overlord",       desc: "Own 150 colonists.",   cond: s => totalBuildings() >= 150 },
  { id: "a_b4", name: "Singularity Boss", desc: "Own 400 colonists.", cond: s => totalBuildings() >= 400 },
  { id: "a_luna",   name: "One Small Step",  desc: "Colonize Luna.",      cond: s => s.unlocked.includes("luna") },
  { id: "a_ceres",  name: "Belt Explorer",   desc: "Colonize Ceres.",     cond: s => s.unlocked.includes("ceres") },
  { id: "a_aurelia",name: "Storm Rider",     desc: "Colonize Aurelia.",   cond: s => s.unlocked.includes("aurelia") },
  { id: "a_lab1", name: "Peer Reviewed",  desc: "Own 1 Research Lab.",  cond: s => s.labs >= 1 },
  { id: "a_lab2", name: "R&D Division",   desc: "Own 10 Research Labs.",cond: s => s.labs >= 10 },
  { id: "a_lab3", name: "Science Empire", desc: "Own 25 Research Labs.",cond: s => s.labs >= 25 },
  { id: "a_sci1", name: "Curious",   desc: "Earn 100 lifetime Science.",    cond: s => (s.lifetime.Science||0) >= 100 },
  { id: "a_sci2", name: "Enlightened", desc: "Earn 1,000 lifetime Science.", cond: s => (s.lifetime.Science||0) >= 1000 },
  { id: "a_sci3", name: "Omniscient", desc: "Earn 10,000 lifetime Science.", cond: s => (s.lifetime.Science||0) >= 10000 },
  { id: "a_m1", name: "Industrialist", desc: "Earn 1M lifetime Metal.",   cond: s => (s.lifetime.Metal||0) >= 1e6 },
  { id: "a_m2", name: "Metal Tycoon",  desc: "Earn 1B lifetime Metal.",   cond: s => (s.lifetime.Metal||0) >= 1e9 },
  { id: "a_am1", name: "Antimatter Touch", desc: "Earn 10K lifetime Antimatter.", cond: s => (s.lifetime.Antimatter||0) >= 1e4 },
  { id: "a_am2", name: "Annihilation Baron", desc: "Earn 1M lifetime Antimatter.", cond: s => (s.lifetime.Antimatter||0) >= 1e6 },
  { id: "a_c1", name: "Comet Catcher", desc: "Catch 1 Golden Comet.",  cond: s => s.stats.comets >= 1 },
  { id: "a_c2", name: "Comet Whisperer", desc: "Catch 10 Golden Comets.", cond: s => s.stats.comets >= 10 },
  { id: "a_asc1", name: "Reborn",     desc: "Ascend once.",   cond: s => s.ascensions >= 1 },
  { id: "a_asc2", name: "Eternal Cycle", desc: "Ascend 5 times.", cond: s => s.ascensions >= 5 },
];

const NEWS = [
  "Astronomers detect unusually rhythmic mining coming from Terra Nova.",
  "Breaking: Luna confirmed still made of cheese. Experts disappointed.",
  "The Ceres Belt files a complaint about strip mining. Complaint shredded into confetti.",
  "Aurelia's storms go quiet for a moment. Everyone agrees not to talk about it.",
  "The Galactic Union sends a form letter. You send back Metal.",
  "Scientists baffled by pile of Metal that keeps growing anyway.",
  "Helium-3 futures soar as your refineries cough politely.",
  "A comet passes by. It waves.",
  "Anti-mining activists arrive on Terra Nova. They are handed shovels.",
  "The Moon called. It wants its regolith back.",
  "Your economy is now 94% you. Economists are nervous.",
  "Local asteroids report feeling 'lightly quarryed'.",
  "Your Planetary Forge is visible from orbit. Tourists love it.",
  "A mysterious voice whispers 'buy more drills'. You feel it is right.",
  "A shard-based religion is founded in your honor. Tithes accepted in Antimatter.",
  "Space smells like burnt steak, according to your returning carriers.",
  "The Continuum Engine hums a tune nobody else can hear.",
  "Interstellar post: 'STOP MINING' scratched into a passing meteor.",
  "Number goes up. Citizens rejoice.",
  "Your colonies have started a band. The genre is industrial.",
  "Deep-space telescopes now mostly point back at your stuff.",
  "Someone screenshotted your Metal count. It was outdated immediately.",
  "The Union of Idle Miners requests shorter idles. Request ignored.",
  "A wormhole opens, sneezes Metal, closes.",
  "Critics call your empire 'aggressively incremental'. You take it as praise.",
  "Weather forecast: vacuum, with scattered debris.",
  "Archaeologists find a drill older than recorded history. It still works.",
  "Galactic news skips your empire for the third season running. Ratings dip.",
];

/* ============ STATE ============ */

const SAVE_KEY = "stellar-ascent-save";
let S = newState();

function newState() {
  return {
    res: { Metal: 0, "Helium-3": 0, Crystal: 0, Antimatter: 0, Science: 0 },
    lifetime: { Metal: 0, "Helium-3": 0, Crystal: 0, Antimatter: 0, Science: 0 },
    buildings: {},     // "planetId:buildingId" -> count
    labs: 0,
    upgrades: {},      // upgrade id -> level (repeatable)
    techs: [],         // tech ids owned
    masteries: [],     // mastery ids owned (persist through ascension)
    shards: 0,
    unlocked: ["terra"],
    current: "terra",
    buyMode: 1,
    stats: { clicks: 0, comets: 0 },
    ach: [],           // achievement ids owned
    buffs: {},         // { rushUntil, frenzyUntil }
    nextComet: 0,
    lastTick: Date.now(),
    started: Date.now(),
    ascensions: 0,
  };
}

/* ============ HELPERS ============ */

const $ = id => document.getElementById(id);
const PLANET = id => PLANETS.find(p => p.id === id);

function fmt(n) {
  if (n < 1000) return (n < 10 && n % 1 !== 0) ? n.toFixed(1) : Math.floor(n).toString();
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"];
  let i = -1;
  while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
  return n.toFixed(n < 10 ? 2 : n < 100 ? 1 : 0) + units[i];
}

function globalProdMult() {
  let m = 1;
  for (const t of S.techs) {
    const def = TECHS.find(x => x.id === t);
    if (def && def.effect === "global") m += def.val;
  }
  if (mOwned("m_prod1")) m += 0.25;
  if (mOwned("m_prod2")) m += 0.5;
  if (mOwned("m_prod3")) m *= 5;
  return m;
}

function mOwned(id) { return S.masteries.includes(id); }

function totalBuildings() {
  let n = S.labs;
  for (const k in S.buildings) n += S.buildings[k];
  return n;
}

function achMult() { return 1 + 0.01 * S.ach.length; }
function buffMult() { return Date.now() < (S.buffs.rushUntil || 0) ? 7 : 1; }
function frenzyMult() { return Date.now() < (S.buffs.frenzyUntil || 0) ? 777 : 1; }

function clickMult(planet) {
  let m = 1;
  for (const u of PLANET(planet).upgrades) if (u.type === "click") m *= Math.pow(u.val, upgLevel(u.id));
  for (const t of S.techs) {
    const def = TECHS.find(x => x.id === t);
    if (def && def.effect === "click") m *= def.val;
  }
  if (mOwned("m_click")) m *= 3;
  return m;
}

function upgLevel(id) { return S.upgrades[id] || 0; }
function upgCost(u) { return Math.ceil(u.cost * Math.pow(3.5, upgLevel(u.id))); }

function prodMult(planet) {
  let m = globalProdMult();
  for (const u of PLANET(planet).upgrades) if (u.type === "prod") m *= Math.pow(u.val, upgLevel(u.id));
  return m;
}

function sciMult() {
  let m = 1;
  for (const t of S.techs) {
    const def = TECHS.find(x => x.id === t);
    if (def && def.effect === "sci") m *= def.val;
  }
  if (mOwned("m_sci")) m *= 2;
  return m;
}

function clickPower(planet) {
  // 1 + 2% of per-second production, times click multipliers
  return (1 + 0.02 * planetRate(planet)) * clickMult(planet) * frenzyMult();
}

function planetRate(planet) {
  let sum = 0;
  for (const b of PLANET(planet).buildings) {
    sum += (S.buildings[planet + ":" + b.id] || 0) * b.rate;
  }
  return sum * prodMult(planet) * achMult() * buffMult();
}

function labRate() {
  return S.labs * 0.5 * sciMult() * achMult();
}

function techOwned(id) { return S.techs.includes(id); }
function techAvailable(t) {
  return !techOwned(t.id) && (!t.req || techOwned(t.req));
}

function bCost(planet, b, n) {
  // total cost for buying n (already-owned count = current)
  const have = S.buildings[planet + ":" + b.id] || 0;
  const r = b.mult;
  return Math.ceil(b.baseCost * Math.pow(r, have) * (Math.pow(r, n) - 1) / (r - 1));
}

function maxAffordable(planet, b) {
  const metal = S.res.Metal;
  const have = S.buildings[planet + ":" + b.id] || 0;
  const r = b.mult;
  let n = Math.floor(Math.log(metal * (r - 1) / (b.baseCost * Math.pow(r, have)) + 1) / Math.log(r));
  return Math.max(0, Math.min(n, 5000));
}

function canPay(cost) {
  for (const k in cost) if ((S.res[k] || 0) < cost[k]) return false;
  return true;
}

function pay(cost) {
  for (const k in cost) S.res[k] -= cost[k];
}

function costStr(cost) {
  return Object.entries(cost).map(([k, v]) => `${fmt(v)} ${k}`).join(", ");
}

function unlockCost(p) {
  if (!p.unlockCost) return null;
  if (!mOwned("m_travel")) return p.unlockCost;
  const c = {};
  for (const k in p.unlockCost) c[k] = Math.ceil(p.unlockCost[k] / 2);
  return c;
}

/* ============ ACHIEVEMENTS & COMETS ============ */

function toast(text) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

function checkAchievements() {
  let newly = 0;
  for (const a of ACH) {
    if (S.ach.includes(a.id)) continue;
    if (a.cond(S)) { S.ach.push(a.id); newly++; }
  }
  if (newly) {
    toast(`🏆 Achievement${newly > 1 ? "s" : ""} unlocked! +${newly}% production`);
    renderAch();
  }
}

function renderAch() {
  const grid = $("ach-grid");
  if (!grid) return;
  $("ach-count").textContent = `${S.ach.length}/${ACH.length} (+${S.ach.length}%)`;
  grid.innerHTML = "";
  for (const a of ACH) {
    const owned = S.ach.includes(a.id);
    const d = document.createElement("div");
    d.className = "ach" + (owned ? " owned" : "");
    d.textContent = owned ? "🏆" : "?";
    d.title = owned ? `${a.name} — ${a.desc}` : `??? — ${a.desc}`;
    grid.appendChild(d);
  }
}

function scheduleComet() {
  S.nextComet = Date.now() + (2 + Math.random() * 4) * 60000; // every 2–6 min
}

function spawnComet() {
  const el = document.createElement("div");
  el.className = "comet";
  el.textContent = "☄";
  el.style.setProperty("--y0", 10 + Math.random() * 50 + "vh");
  document.body.appendChild(el);
  const done = setTimeout(() => el.remove(), 11000);
  el.onclick = e => {
    clearTimeout(done);
    el.remove();
    catchComet(e);
  };
}

function catchComet(evt) {
  S.stats.comets++;
  const roll = Math.random();
  if (roll < 0.45) {
    S.buffs.rushUntil = Date.now() + 30000;
    toast("☄ COMET RUSH! All production ×7 for 30s");
  } else if (roll < 0.8) {
    let gained = [];
    for (const pid of S.unlocked) {
      const p = PLANET(pid);
      const amt = Math.max(planetRate(pid) * 120, 25 * clickPower(pid) / frenzyMult());
      S.res[p.res] += amt;
      S.lifetime[p.res] += amt;
      gained.push(`+${fmt(amt)} ${p.res}`);
    }
    toast("☄ STARDUST SHOWER! " + gained.join(", "));
  } else {
    S.buffs.frenzyUntil = Date.now() + 15000;
    toast("✦ CLICK FRENZY! Mining power ×777 for 15s");
  }
  floatNum(evt, "☄!");
  renderChips();
  checkAchievements();
  save();
}

function tickBuffs() {
  if (!S.nextComet) scheduleComet();
  if (Date.now() >= S.nextComet && !document.querySelector(".comet")) {
    spawnComet();
    scheduleComet();
  }
}

/* ============ NEWS TICKER & STATS ============ */

let newsIdx = Math.floor(Math.random() * NEWS.length);

function rotateNews(manual) {
  const el = $("news-text");
  if (!el) return;
  newsIdx = manual ? (newsIdx + 1) % NEWS.length : (newsIdx + 1 + Math.floor(Math.random() * 3)) % NEWS.length;
  el.classList.remove("news-fade");
  void el.offsetWidth; // restart animation
  el.classList.add("news-fade");
  el.textContent = NEWS[newsIdx];
}

function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return (d ? d + "d " : "") + (h ? h + "h " : "") + m + "m";
}

function renderStats() {
  const el = $("stats-list");
  if (!el) return;
  const rows = [
    ["Time played", fmtTime(Date.now() - S.started)],
    ["Ascensions", S.ascensions],
    ["Shards earned", `✦ ${S.shards}`],
    ["Mine clicks", fmt(S.stats.clicks)],
    ["Comets caught", S.stats.comets],
    ["Colonists", totalBuildings()],
    ["Research Labs", S.labs],
    ["Masteries", `${S.masteries.length}/${MASTERY.length}`],
    ["Techs", `${S.techs.length}/${TECHS.length - 1}`],
  ];
  for (const p of PLANETS) {
    if (S.unlocked.includes(p.id)) rows.push([`Lifetime ${p.res}`, fmt(S.lifetime[p.res] || 0)]);
  }
  el.innerHTML = rows.map(([k, v]) =>
    `<div class="stat-row"><span class="stat-k">${k}</span><span class="stat-v">${v}</span></div>`).join("");
}

function save() {
  S.lastTick = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(S));
}

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data.upgrades)) data.upgrades = {}; // v0.5→v0.6 migration: repeatable upgrades restart
    S = Object.assign(newState(), data);
    const elapsed = Math.min((Date.now() - S.lastTick) / 1000, 86400);
    if (elapsed > 10) {
      const rate = mOwned("m_off") ? 1 : techOwned("t_off") ? 0.75 : 0.5;
      const gained = {};
      let total = 0;
      for (const p of S.unlocked) {
        const g = planetRate(p) * elapsed * rate;
        if (g > 0) { gained[PLANET(p).res] = (gained[PLANET(p).res] || 0) + g; total += g; }
      }
      const sg = labRate() * elapsed * rate;
      if (sg > 0) { gained.Science = sg; total += sg; }
      for (const k in gained) S.res[k] += gained[k];
      if (total > 1) {
        const note = $("offline-note");
        note.textContent = "Welcome back! Offline " +
          Math.floor(elapsed / 3600) + "h " + Math.floor((elapsed % 3600) / 60) + "m → " +
          Object.entries(gained).map(([k, v]) => "+" + fmt(v) + " " + k).join(", ");
      }
    }
  } catch (e) { console.warn("bad save", e); }
}

/* ============ ACTIONS ============ */

function mine(planet, evt, btn) {
  if (!planet || !PLANET(planet)) planet = S.unlocked.includes(S.current) ? S.current : "terra";
  const p = PLANET(planet);
  const amt = clickPower(planet);
  S.res[p.res] += amt;
  S.lifetime[p.res] += amt;
  S.stats.clicks++;
  if (techOwned("t_click_yield")) S.res.Metal += amt;
  if (btn) {
    btn.classList.add("pressed");
    clearTimeout(btn._pt);
    btn._pt = setTimeout(() => btn.classList.remove("pressed"), 110);
  }
  if (evt) floatNum(evt, "+" + fmt(amt) + " " + p.resIcon);
}

function floatNum(evt, text) {
  const el = document.createElement("div");
  el.className = "float-num";
  el.textContent = text;
  el.style.left = (evt.clientX - 10 + (Math.random() * 24 - 12)) + "px";
  el.style.top = (evt.clientY - 20) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function buyBuilding(planet, b) {
  let n = S.buyMode === "max" ? maxAffordable(planet, b) : S.buyMode;
  if (n <= 0) return;
  const cost = { Metal: bCost(planet, b, n) };
  if (!canPay(cost)) return;
  pay(cost);
  S.buildings[planet + ":" + b.id] = (S.buildings[planet + ":" + b.id] || 0) + n;
}

function buyUpgrade(u) {
  const lvl = upgLevel(u.id);
  const cost = upgCost(u);
  if (!canPay({ Metal: cost })) return;
  pay({ Metal: cost });
  S.upgrades[u.id] = lvl + 1;
}

function buyTech(t) {
  if (!techAvailable(t)) return;
  const cost = { ...t.cost };
  if (!canPay(cost)) return;
  pay(cost);
  S.techs.push(t.id);
  if (t.effect === "building") S.labs++;
}

function buyLab() {
  const cost = labCost();
  if (!canPay(cost)) return;
  pay(cost);
  S.labs++;
}

function labCost() {
  return { Metal: Math.ceil(400 * Math.pow(1.7, S.labs)), Crystal: Math.ceil(120 * Math.pow(1.7, S.labs)) };
}

function travel(planet) {
  const p = PLANET(planet);
  const cost = unlockCost(p);
  if (!cost || !canPay(cost) || S.unlocked.includes(planet)) return;
  pay(cost);
  S.unlocked.push(planet);
  S.current = planet;
  renderNav();
  renderPlanet();
}

/* ============ ASCENDANCY ============ */

function shardGain() {
  const am = S.lifetime.Antimatter || 0;
  let g = Math.floor(Math.sqrt(am / 100000));
  if (mOwned("m_shard")) g = Math.floor(g * 1.5);
  return g;
}

function ascend() {
  const g = shardGain();
  if (g < 1 || !confirm(`Ascend now for ${g} Ascendancy Shard${g > 1 ? "s" : ""}?\n\nThis resets: resources, buildings, upgrades and techs.\nMasteries and shards are permanent.`)) return;
  const kept = { shards: S.shards + g, masteries: S.masteries, lifetime: S.lifetime, ascensions: S.ascensions + 1 };
  const keepPlanets = mOwned("m_memory");
  const unlocked = keepPlanets ? S.unlocked : ["terra"];
  const current = keepPlanets ? S.current : "terra";
  const autoStart = mOwned("m_auto");
  const headStart = mOwned("m_start");
  S = newState();
  Object.assign(S, kept, { unlocked, current });
  if (headStart) S.res.Metal = 2500;
  if (autoStart) for (const pid of unlocked) S.buildings[pid + ":" + PLANET(pid).buildings[0].id] = 10;
  renderNav(); renderPlanet(); renderResearch(); renderPrestige();
  save();
  alert(`Ascension #${S.ascensions} complete! +${g} shards.`);
}

function renderPrestige() {
  const g = shardGain();
  $("shard-info").innerHTML =
    `<span class="shards">✦ ${S.shards}</span> Ascendancy Shards` +
    (S.ascensions ? ` · ${S.ascensions} ascension${S.ascensions > 1 ? "s" : ""}` : "") +
    `<br><span style="color:var(--dim)">Ascending now: +${g} shards` +
    (g < 1 ? ` — needs more lifetime Antimatter (have ${fmt(S.lifetime.Antimatter || 0)}, need ${fmt(100000)})` : "") +
    `</span>`;
  const btn = $("ascend-btn");
  btn.disabled = g < 1;
  btn.textContent = g < 1 ? "ASCEND (LOCKED)" : `ASCEND +${g} ✦`;

  const ml = $("masteries");
  ml.innerHTML = "";
  for (const m of MASTERY) {
    const owned = mOwned(m.id);
    const avail = !owned && (!m.req || mOwned(m.req));
    if (!owned && !avail) continue;
    const div = document.createElement("div");
    div.className = "mastery" + (owned ? " owned" : "");
    div.innerHTML = `
      <div class="m-info">
        <div class="m-name">${owned ? "✦ " : ""}${m.name}</div>
        <div class="m-sub">${m.desc}</div>
      </div>
      ${owned ? "" : `<button class="${S.shards >= m.cost ? "can" : ""}">${m.cost} ✦</button>`}`;
    if (!owned) {
      const mb = div.querySelector("button");
      mb.disabled = S.shards < m.cost;
      mb.onclick = () => {
        if (S.shards < m.cost) return;
        S.shards -= m.cost;
        S.masteries.push(m.id);
        renderPrestige(); renderNav(); renderPlanet(); renderResearch(); save();
      };
    }
    ml.appendChild(div);
  }
}

/* ============ RENDER ============ */

/* ============ TOOLTIPS ============ */

function moveTip(e) {
  const t = $("tooltip");
  if (!t || t.style.display !== "block") return;
  const pad = 14;
  let left = e.clientX + pad, top = e.clientY + pad;
  const r = t.getBoundingClientRect();
  if (left + r.width > innerWidth - 8) left = e.clientX - r.width - pad;
  if (top + r.height > innerHeight - 8) top = e.clientY - r.height - pad;
  t.style.left = left + "px";
  t.style.top = top + "px";
}

function attachTip(el, fn) {
  el.addEventListener("mouseenter", e => {
    const t = $("tooltip");
    t.innerHTML = fn();
    t.style.display = "block";
    moveTip(e);
  });
  el.addEventListener("mousemove", moveTip);
  el.addEventListener("mouseleave", () => { $("tooltip").style.display = "none"; });
}

function tipBuilding(pid, b) {
  const have = S.buildings[pid + ":" + b.id] || 0;
  const each = b.rate * prodMult(pid) * achMult() * buffMult();
  const total = each * have;
  const share = planetRate(pid) > 0 ? Math.round(100 * total / planetRate(pid)) : 0;
  const c1 = bCost(pid, b, 1);
  return `<div class="tt-name">${b.name} <span style="color:var(--dim)">×${have}</span></div>
    <div class="tt-sub">${b.desc}</div>
    <div class="tt-line">Each produces <b>${fmt(each)}/s</b></div>
    ${have ? `<div class="tt-line">You own <b>${have}</b>, producing <b>${fmt(total)}/s</b> (${share}% of this planet's output)</div>` : ""}
    <div class="tt-cost">Buy 1: ${fmt(c1)} Metal · next 10: ${fmt(bCost(pid, b, 10))} Metal</div>`;
}

function tipUpgrade(u) {
  const lvl = upgLevel(u.id);
  return `<div class="tt-name">${u.name} ${lvl ? `<span style="color:var(--accent2)">Lv ${lvl}</span>` : ""}</div>
    <div class="tt-sub">${u.desc}</div>
    <div class="tt-line">Current effect: <b>×${fmt(Math.pow(u.val, lvl))}</b></div>
    <div class="tt-line">Next level: <b>×${fmt(Math.pow(u.val, lvl + 1))}</b></div>
    <div class="tt-cost">Cost: ${fmt(upgCost(u))} Metal (×3.5 per level)</div>`;
}

/* pixel-art planet sprites, generated per planet */
function shadeColor(hex, f) {
  const v = parseInt(hex.slice(1), 16);
  const ch = s => Math.min(255, Math.max(0, Math.round(((v >> s) & 255) * f)));
  return "#" + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, "0")).join("");
}

/* unique 12x12 pixel icon per building */
const ICON_CACHE = {};
function iconFor(pid, bid) {
  const key = pid + ":" + bid;
  if (ICON_CACHE[key]) return ICON_CACHE[key];
  const p = PLANET(pid);
  const c = p.color, hi = shadeColor(c, 1.45), lo = shadeColor(c, 0.5);
  const gr = "#9aa3c4", gd = "#565e85", wl = "#e8e3ff", dk = "#20263f";
  const cv = document.createElement("canvas");
  cv.width = 12; cv.height = 12;
  const x = cv.getContext("2d");
  const px = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  switch (bid) {
    case "drill": px(5,0,2,1,gd); px(3,1,6,1,gr); px(3,2,6,2,c); px(4,4,4,1,lo); px(5,5,2,3,c); px(4,8,4,1,lo); px(5,9,2,2,hi); break;
    case "rig": px(2,2,2,9,gd); px(8,2,2,9,gd); px(1,1,10,1,gr); px(4,3,4,2,c); px(4,6,4,2,lo); px(4,9,4,2,hi); break;
    case "quarry": px(1,2,10,2,gr); px(2,4,8,2,c); px(3,6,6,2,lo); px(4,8,4,2,hi); px(5,10,2,1,dk); break;
    case "cannon": px(1,7,3,4,gd); px(3,5,3,2,gr); px(5,4,6,2,c); px(5,6,4,1,lo); px(10,4,1,2,wl); break;
    case "elevator": px(5,0,2,11,gd); px(4,1,4,1,gr); px(4,10,4,1,gr); px(5,3,2,3,c); px(5,6,2,2,hi); break;
    case "forge": px(1,6,10,5,gd); px(2,4,8,2,gr); px(4,2,4,2,c); px(3,1,2,1,hi); px(7,1,2,1,hi); px(5,7,2,2,lo); break;
    case "probe": px(5,0,2,2,gd); px(2,2,8,3,c); px(1,3,2,1,wl); px(9,3,2,1,wl); px(4,5,4,2,lo); px(5,7,2,4,gd); break;
    case "scoop": px(1,1,10,2,gr); px(2,3,8,2,c); px(3,5,6,3,lo); px(4,8,4,1,hi); px(5,9,2,2,gd); break;
    case "ranch": px(1,3,10,2,gd); px(2,5,8,6,gr); px(3,6,2,2,hi); px(6,6,2,2,c); px(9,6,1,3,wl); px(4,9,4,1,lo); break;
    case "driver": px(1,9,10,2,gd); px(2,7,3,2,gr); px(4,5,3,2,c); px(6,3,3,2,lo); px(9,2,2,1,wl); break;
    case "fplant": px(2,2,8,8,gd); px(3,3,6,6,gr); px(4,4,4,4,c); px(5,5,2,2,hi); px(5,0,2,2,gd); px(5,10,2,1,gd); break;
    case "breeder": px(3,0,6,1,lo); px(1,1,10,2,c); px(0,3,12,2,lo); px(1,5,10,2,c); px(3,7,6,2,lo); px(5,9,2,2,hi); break;
    case "cutter": px(1,10,3,1,gd); px(2,7,2,3,gr); px(4,1,1,8,wl); px(5,0,2,2,c); px(6,2,4,2,hi); px(7,4,3,1,lo); break;
    case "sifter": px(1,1,10,2,gd); px(2,3,8,7,gr); px(3,4,2,1,c); px(6,4,2,1,c); px(9,4,1,1,c); px(3,6,2,1,lo); px(6,6,2,1,lo); px(3,8,2,1,hi); px(6,8,2,1,hi); break;
    case "crawn": px(1,9,3,2,gd); px(8,9,3,2,gd); px(3,6,6,3,c); px(2,4,8,2,lo); px(4,2,4,2,hi); px(5,1,2,1,wl); break;
    case "highway": px(1,8,10,3,gd); px(1,6,10,1,gr); px(2,4,2,1,c); px(6,4,2,1,c); px(9,3,2,2,wl); px(4,1,1,2,lo); break;
    case "foundry": px(1,2,10,9,gd); px(2,3,8,2,gr); px(3,5,3,2,c); px(7,5,2,2,lo); px(3,8,6,2,hi); px(5,0,2,2,gd); break;
    case "lattice": px(5,0,2,2,hi); px(2,2,2,2,c); px(8,2,2,2,c); px(5,3,2,2,lo); px(2,6,2,2,c); px(8,6,2,2,c); px(5,6,2,2,hi); px(5,9,2,2,lo); px(0,4,1,1,gd); px(11,7,1,1,gd); break;
    case "skimmer": px(4,0,4,4,c); px(3,1,6,2,c); px(3,4,6,2,lo); px(5,6,2,3,gd); px(3,9,6,1,gr); px(5,10,2,1,gd); break;
    case "trap": px(2,1,3,5,hi); px(7,1,3,5,hi); px(2,6,8,2,c); px(4,8,4,2,lo); px(5,10,2,1,wl); break;
    case "carrier": px(3,1,6,2,gr); px(2,3,8,4,c); px(1,5,10,2,lo); px(3,7,6,1,hi); px(4,8,1,2,gd); px(7,8,1,2,gd); px(9,4,2,1,wl); break;
    case "harvest": px(2,0,8,2,c); px(3,2,6,2,lo); px(4,4,4,2,hi); px(5,6,2,3,c); px(4,9,4,2,gd); break;
    case "eye": px(3,2,6,6,c); px(2,3,8,4,c); px(4,4,4,2,wl); px(5,4,2,2,dk); px(5,8,2,2,gd); px(2,9,8,1,gd); break;
    case "continuum": px(5,0,2,3,hi); px(3,2,6,3,c); px(1,4,10,2,lo); px(3,6,6,3,c); px(5,9,2,2,hi); px(4,5,4,2,wl); break;
    default: px(3,3,6,6,c);
  }
  ICON_CACHE[key] = cv.toDataURL();
  return ICON_CACHE[key];
}

function iconForUpg(type) {
  const key = "upg:" + type;
  if (ICON_CACHE[key]) return ICON_CACHE[key];
  const cv = document.createElement("canvas");
  cv.width = 12; cv.height = 12;
  const x = cv.getContext("2d");
  const px = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
  const A = "#ffd166", B = "#b5892e", W = "#e8e3ff";
  if (type === "click") { px(4,1,2,6,A); px(3,2,4,1,A); px(2,7,5,2,B); px(7,6,3,3,W); px(9,9,2,2,B); }
  else { px(5,0,2,2,W); px(2,2,8,2,A); px(1,4,10,4,B); px(2,8,8,2,A); px(5,10,2,1,W); px(5,4,2,4,W); }
  ICON_CACHE[key] = cv.toDataURL();
  return ICON_CACHE[key];
}
function pixelPlanetURL(p, size) {
  const n = 26; // logical pixel grid
  const cv = document.createElement("canvas");
  cv.width = n; cv.height = n;
  const ctx = cv.getContext("2d");
  const idx = PLANETS.indexOf(p);
  let seed = 1234 + idx * 777;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const c = p.color;
  // shades: hi / base / mid / dark
  const shade = (hex, f) => {
    const v = parseInt(hex.slice(1), 16);
    const ch = s => Math.min(255, Math.max(0, Math.round(((v >> s) & 255) * f)));
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
  };
  const cols = [shade(c, 1.35), c, shade(c, 0.72), shade(c, 0.45)];
  const R = 10.5, cx = n / 2 - 0.5, cy = n / 2 - 0.5;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = x - cx, dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > R) continue;
      // light from top-left: shade by depth + noise dithering
      const depth = (dx + dy) / (2 * R);           // -1..1
      let ci = depth < -0.45 ? 0 : depth < 0.05 ? 1 : depth < 0.5 ? 2 : 3;
      if (ci > 0 && ci < 3 && rnd() < 0.28) ci += depth > 0.1 ? -1 : 1; // dither edges
      // blotch terrain
      if (rnd() < 0.05) ci = Math.min(3, ci + 1);
      ctx.fillStyle = cols[ci];
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // ring: diagonal band crossing the planet
  if (p.ring) {
    ctx.fillStyle = shade(c, 1.6);
    for (let x = 1; x < n - 1; x++) {
      const y = Math.round(0.5 * (x - cx) + cy + 3);
      const dx = x - cx;
      if (Math.abs(dx) > R + 3 || rnd() < 0.15) continue;
      const behind = dx < -2; // hidden by planet on left side? draw anyway over dark side, classic look
      ctx.fillRect(x, y, 1, 1);
      if (rnd() < 0.5) ctx.fillRect(x, y + 1, 1, 1);
    }
  }
  // moons: single bright pixels with orbit distance
  for (let i = 0; i < p.moons; i++) {
    const a = i * 2.3 + 0.7;
    ctx.fillStyle = "#e8e3ff";
    ctx.fillRect(Math.round(cx + Math.cos(a) * 12), Math.round(cy + Math.sin(a) * 12), 1, 1);
  }
  return cv.toDataURL();
}

function planetSVG(p, size) {
  const uid = "g" + p.id + (size || "");
  let s = `<defs>
    <radialGradient id="${uid}" cx="0.35" cy="0.3" r="0.9">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="25%" stop-color="${p.color}"/>
      <stop offset="100%" stop-color="${p.color}" stop-opacity="0.45"/>
    </radialGradient>
  </defs>`;
  if (p.ring) s += `<ellipse cx="48" cy="48" rx="45" ry="11" fill="none" stroke="${p.color}" stroke-width="5" opacity="0.35" transform="rotate(-18 48 48)"/>`;
  s += `<circle cx="48" cy="48" r="31" fill="url(#${uid})"/>`;
  // surface details
  s += `<circle cx="38" cy="38" r="9" fill="rgba(255,255,255,0.18)"/>`;
  s += `<circle cx="57" cy="61" r="6" fill="rgba(0,0,0,0.18)"/>`;
  s += `<circle cx="61" cy="36" r="4" fill="rgba(0,0,0,0.12)"/>`;
  s += `<path d="M 25 55 Q 40 62 58 56" stroke="rgba(0,0,0,0.15)" stroke-width="3" fill="none"/>`;
  if (p.ring) s += `<path d="M 8 58 A 45 11 0 0 0 88 40" stroke="${p.color}" stroke-width="5" fill="none" opacity="0.55" transform="rotate(-18 48 48)"/>`;
  for (let i = 0; i < p.moons; i++) {
    const a = i * 2.4 + 0.6;
    s += `<circle cx="${48 + Math.cos(a) * 41}" cy="${48 + Math.sin(a) * 41}" r="4.5" fill="#cdd6f4"><circle cx="${47 + Math.cos(a) * 41}" cy="${46.5 + Math.sin(a) * 41}" r="2" fill="rgba(0,0,0,0.2)"/></circle>`;
  }
  return s;
}

function renderChips() {
  const box = $("res-chips");
  box.innerHTML = "";
  for (const pid of S.unlocked) {
    const p = PLANET(pid);
    box.insertAdjacentHTML("beforeend",
      `<div class="chip" style="color:${p.resColor}" title="${p.res} — from ${p.name}">
        <span>${p.resIcon}</span><span class="val" id="chip-${p.res}">0</span><span class="rate" id="chiprate-${p.res}"></span>
      </div>`);
  }
  box.insertAdjacentHTML("beforeend",
    `<div class="chip" style="color:var(--accent2)" title="Science — from Research Labs">
      <span>🧪</span><span class="val" id="chip-Science">0</span><span class="rate" id="chiprate-Science"></span>
    </div>`);
  box.insertAdjacentHTML("beforeend",
    `<div class="chip buff-chip" id="chip-buff" style="display:none"></div>`);
}

function renderNav() {
  const nav = $("planet-nav");
  nav.innerHTML = "";
  for (const p of PLANETS) {
    const b = document.createElement("button");
    const unlocked = S.unlocked.includes(p.id);
    b.innerHTML = unlocked
      ? `<span class="dot" style="background:${p.color};color:${p.color}"></span>${p.name}`
      : `❔ Unknown`;
    b.className = (unlocked ? "" : "locked") + (S.current === p.id ? " active" : "");
    b.onclick = () => {
      if (unlocked) { S.current = p.id; renderNav(); renderPlanet(); renderResearch(); }
      else { renderNav(); renderPlanet(p.id); }
    };
    nav.appendChild(b);
  }
  renderChips();
}

function renderPlanet(forced) {
  const pid = forced || S.current || "terra";
  const p = PLANET(pid);
  const unlocked = S.unlocked.includes(pid);

  $("planet-art-img").src = pixelPlanetURL(p, 190);
  $("planet-art-img").style.width = "190px";
  $("planet-art-img").style.height = "190px";
  const glow = $("world-glow");
  if (glow) glow.style.background =
    `radial-gradient(55vw 45vh at 15% 15%, ${p.color}26, transparent 60%),` +
    `radial-gradient(50vw 40vh at 85% 75%, ${shadeColor(p.color, 0.6)}1f, transparent 60%)`;
  $("planet-name").textContent = p.name;
  $("planet-desc").textContent = p.desc;

  const resLine = $("planet-resource");
  const lockedNote = $("locked-note");
  const bl = $("buildings");
  const ul = $("upgrades");

  if (!unlocked) {
    resLine.innerHTML = `<span style="color:var(--danger)">\u26D4 LOCKED \u2014 colonization requires: ${costStr(unlockCost(p))}</span>`;
    $("mine-info").textContent = "";
    lockedNote.style.display = "";
    lockedNote.innerHTML = `<span style="color:var(--dim)">Colonists, upgrades and mining unlock on this planet once colonized.</span>`;
    bl.innerHTML = "";
    ul.innerHTML = "";
    return;
  }
  lockedNote.style.display = "none";

  const rate = planetRate(pid);
  resLine.innerHTML = `${p.resIcon} ${p.res}: <span style="color:${p.resColor}">${fmt(S.res[p.res])}</span><span class="rate">+${fmt(rate)}/s</span>`;
  $("mine-info").innerHTML = `<span style="color:var(--dim)">click the planet to mine \u00B7 </span>+${fmt(clickPower(pid))} ${p.res} per click`;

  // buildings: compact CC strips - the whole row buys
  bl.innerHTML = "";
  p.buildings.forEach((b) => {
    const have = S.buildings[pid + ":" + b.id] || 0;
    const n = S.buyMode === "max" ? Math.max(1, maxAffordable(pid, b)) : S.buyMode;
    const cost = bCost(pid, b, n);
    const can = canPay({ Metal: cost });
    const each = b.rate * prodMult(pid) * achMult() * buffMult();
    const strip = document.createElement("div");
    strip.className = "store-strip" + (can ? " can" : "") + (have > 0 ? " owned-b" : "");
    strip.innerHTML = `
      <img class="strip-icon" src="${iconFor(pid, b.id)}" width="44" height="44" alt="">
      <div class="strip-info">
        <div class="strip-name">${b.name} <span class="own-count">\u00D7${have}</span></div>
        <div class="strip-sub">+${fmt(each)}/s each</div>
      </div>
      <div class="strip-price">Buy ${S.buyMode === "max" ? maxAffordable(pid, b) : n}<br><b>${fmt(cost)}</b> \u2699</div>`;
    strip.onclick = () => { if (canPay({ Metal: bCost(pid, b, n) })) { buyBuilding(pid, b); renderPlanet(); } };
    attachTip(strip, () => tipBuilding(pid, b));
    bl.appendChild(strip);
  });

  // upgrades as Cookie-Clicker style icon tiles
  ul.innerHTML = "";
  ul.className = "upg-tiles";
  for (const u of p.upgrades) {
    const lvl = upgLevel(u.id);
    const cost = upgCost(u);
    const can = canPay({ Metal: cost });
    const tile = document.createElement("div");
    tile.className = "upg-tile" + (can ? "" : " grayed");
    tile.innerHTML = `<img src="${iconForUpg(u.type)}" width="26" height="26" alt="">${lvl > 0 ? `<span class="tile-lv">Lv${lvl}</span>` : ""}`;
    tile.onclick = () => { if (canPay({ Metal: upgCost(u) })) { buyUpgrade(u); renderPlanet(); } };
    attachTip(tile, () => tipUpgrade(u));
    ul.appendChild(tile);
  }
}

function renderResearch() {
  const tl = $("techs");
  tl.innerHTML = "";

  // Lab building row
  const lc = labCost();
  const labRow = document.createElement("div");
  labRow.className = "row";
  labRow.innerHTML = `
    <div class="info"><div class="name">Research Lab <span class="sub">×${S.labs}</span></div>
    <div class="sub">+${fmt(labRate())}/s Science — Metal & Crystal cost</div></div>
    <button class="${canPay(lc) ? "can" : ""}">Buy 1 — ${fmt(lc.Metal)} Metal, ${fmt(lc.Crystal)} Crystal</button>`;
  const labBtn = labRow.querySelector("button");
  labBtn.disabled = !canPay(lc);
  labBtn.onclick = () => { buyLab(); renderResearch(); };
  tl.appendChild(labRow);

  for (const t of TECHS) {
    if (t.effect === "building") continue;
    const owned = techOwned(t.id);
    const avail = techAvailable(t);
    if (!owned && !avail) continue;
    const row = document.createElement("div");
    row.className = "row";
    const cstr = costStr(t.cost);
    row.innerHTML = owned
      ? `<div class="info"><div class="name">${t.name} ✔</div><div class="sub">${t.desc}</div></div>`
      : `<div class="info"><div class="name">${t.name}</div><div class="sub">${t.desc}</div></div>
         <button class="${canPay(t.cost) ? "can" : ""}">${cstr}</button>`;
    if (!owned) {
      const tb = row.querySelector("button");
      tb.disabled = !canPay(t.cost);
      tb.onclick = () => { buyTech(t); renderResearch(); };
    }
    tl.appendChild(row);
  }

  // next planet
  const np = $("next-planet");
  np.innerHTML = "";
  const next = PLANETS.find(p => !S.unlocked.includes(p.id));
  if (!next) {
    np.innerHTML = `<div class="name">🌌 All planets colonized. You have transcended the system.</div>`;
    return;
  }
  const can = canPay(unlockCost(next));
  np.innerHTML = `
    <div style="display:flex;gap:14px;align-items:center">
      <img src="${pixelPlanetURL(next, 48)}" width="48" height="48" style="image-rendering:pixelated">
      <div class="info">
        <div class="name">🚀 Colonize: ${next.name}</div>
        <div class="sub">${next.desc} — produces ${next.resIcon} ${next.res}</div>
      </div>
      <button class="${can ? "can" : ""}">Travel — ${costStr(unlockCost(next))}</button>
    </div>`;
  const travelBtn = np.querySelector("button");
  travelBtn.disabled = !can;
  travelBtn.onclick = () => { travel(next.id); renderNav(); renderPlanet(); renderResearch(); };
}

/* ============ TICK ============ */

function tick() {
  const now = Date.now();
  const dt = Math.min((now - S.lastTick) / 1000, 60); // clamp long tab sleeps; offline handled on load
  S.lastTick = now;
  for (const pid of S.unlocked) {
    const g = planetRate(pid) * dt;
    S.res[PLANET(pid).res] += g;
    S.lifetime[PLANET(pid).res] += g;
  }
  const sg = labRate() * dt;
  S.res.Science += sg;
  S.lifetime.Science += sg;
}

function renderTick() {
  for (const pid of S.unlocked) {
    const p = PLANET(pid);
    const v = $("chip-" + p.res), r = $("chiprate-" + p.res);
    if (v) v.textContent = fmt(S.res[p.res]);
    if (r) r.textContent = "+" + fmt(planetRate(pid)) + "/s";
  }
  const sv = $("chip-Science"), sr = $("chiprate-Science");
  if (sv) sv.textContent = fmt(S.res.Science);
  if (sr) sr.textContent = "+" + fmt(labRate()) + "/s";
  const bc = $("chip-buff");
  if (bc) {
    const now = Date.now();
    const rush = Math.max(0, (S.buffs.rushUntil || 0) - now);
    const frenzy = Math.max(0, (S.buffs.frenzyUntil || 0) - now);
    if (rush > 0) { bc.style.display = ""; bc.textContent = `☄ RUSH ×7 ${Math.ceil(rush / 1000)}s`; }
    else if (frenzy > 0) { bc.style.display = ""; bc.textContent = `✦ FRENZY ×777 ${Math.ceil(frenzy / 1000)}s`; }
    else bc.style.display = "none";
  }
  const cur = S.current && S.unlocked.includes(S.current) ? S.current : null;
  if (cur) {
    const p = PLANET(cur);
    const rl = $("planet-resource");
    if (rl) rl.innerHTML = `${p.resIcon} ${p.res}: <span style="color:${p.resColor}">${fmt(S.res[p.res])}</span><span class="rate">+${fmt(planetRate(cur))}/s</span>`;
    $("mine-info").innerHTML = `<span style="color:var(--dim)">click the planet to mine · </span>+${fmt(clickPower(cur))} ${p.res} per click`;
  }
}

/* ============ INIT ============ */

function init() {
  // starfield
  const cv = $("starfield"), ctx = cv.getContext("2d");
  let stars = [];
  function resize() {
    cv.width = innerWidth; cv.height = innerHeight;
    stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: Math.random() * 1.4 + 0.3, tw: Math.random() * Math.PI * 2,
    }));
  }
  resize(); addEventListener("resize", resize);
  (function drawStars() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const s of stars) {
      s.tw += 0.02;
      ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(s.tw));
      ctx.fillStyle = "#dfe6ff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    requestAnimationFrame(drawStars);
  })();

  load();
  renderNav(); renderPlanet(); renderResearch(); renderPrestige(); renderAch(); renderStats();
  rotateNews();

  $("big-planet").onclick = e => mine(S.current, e, $("big-planet"));
  $("ascend-btn").onclick = ascend;
  document.querySelectorAll(".buy").forEach(b => {
    b.onclick = () => {
      S.buyMode = b.dataset.buy === "max" ? "max" : parseInt(b.dataset.buy);
      document.querySelectorAll(".buy").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderPlanet();
    };
  });
  $("save-btn").onclick = () => { save(); $("save-btn").textContent = "Saved ✓"; setTimeout(() => $("save-btn").textContent = "Save", 800); };
  $("reset-btn").onclick = () => {
    if (confirm("Wipe ALL progress? This cannot be undone.")) {
      localStorage.removeItem(SAVE_KEY);
      S = newState(); renderNav(); renderPlanet(); renderResearch();
    }
  };

  setInterval(tick, 100);
  setInterval(tickBuffs, 1000);
  setInterval(checkAchievements, 2000);
  setInterval(rotateNews, 9000);
  setInterval(renderStats, 3000);
  $("news-ticker").onclick = () => rotateNews(true);
  document.querySelectorAll(".store-tab").forEach(t => {
    t.onclick = () => {
      document.querySelectorAll(".store-tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      document.querySelectorAll(".tab-content").forEach(c => c.style.display = "none");
      $("tab-" + t.dataset.tab).style.display = "";
    };
  });
  setInterval(renderTick, 200);
  setInterval(() => { renderPlanet(); renderResearch(); renderPrestige(); }, 1500); // refresh affordability
  setInterval(save, 10000);
  addEventListener("beforeunload", save);
}

init();
