"use strict";

/* ============================================================
   STELLAR ASCENT v4 — a Cookie Clicker-style idle game.
   One currency (stardust), 14 escalating buildings, 100+
   upgrades, golden comets, ascension constellation.
   ============================================================ */

/* ============ NEWS ============ */
const NEWS = [
  "Astronomers detect unusually rhythmic stardust collection.",
  "Your drones have formed a union. Their demand: more drones.",
  "The Moon wants its regolith back. Request denied.",
  "A comet passes by. It waves.",
  "Number goes up. Citizens rejoice.",
  "Scientists baffled by pile of stardust that keeps growing anyway.",
  "Economists confirm: you are now 94% of the economy. They are nervous.",
  "Local asteroids report feeling 'lightly quarried'.",
  "The Galactic Union sends a form letter. You send back dust.",
  "Weather forecast: vacuum, with scattered debris.",
  "Your Warp Relay hums a tune nobody else can hear.",
  "Critics call your empire 'aggressively incremental'. You take it as praise.",
  "Someone screenshotted your stardust count. It was outdated immediately.",
  "Deep-space telescopes now mostly point back at your stuff.",
  "A wormhole opens, sneezes stardust, closes.",
  "The Continuum Engine denies being seen yesterday.",
  "Archaeologists find a drone older than recorded history. It still works.",
  "Fusion Plant overheats while trying to impress the Moon Base.",
  "Galactic news skips your empire for the third season running. Ratings dip.",
  "Black Hole Tap reports nothing. Communication described as 'heavy'.",
  "The Nebula Collector was caught stealing colors from a sunset.",
  "Dyson Panel output up 12% after being polished by a passing comet.",
  "Your rovers have started a band. The genre is industrial.",
  "Stardust prices plummet. You are the market. Prices recover.",
  "Anti-mining activists arrive. They are handed shovels.",
  "Alien civilization sends decode of your news ticker: 'lol'.",
  "The stars look closer today. Report if they get closer still.",
  "Idle Miners Union requests shorter idles. Request ignored.",
];

/* ============ DATA: 14 buildings, CC's exact cost/production ladder ============ */
const BUILDINGS = [
  { id: "drone",    name: "Scrap Drone",        base: 15,      rate: 0.1,     desc: "Picks stardust off the ground with tiny tweezers." },
  { id: "rover",    name: "Mining Rover",       base: 100,     rate: 1,       desc: "Six wheels, zero brakes, one job." },
  { id: "refinery", name: "Ore Refinery",       base: 1100,    rate: 8,       desc: "Turns boring rocks into shiny dust." },
  { id: "probe",    name: "Survey Probe",       base: 12000,   rate: 47,      desc: "Finds dust where no dust has been found before." },
  { id: "moonbase", name: "Moon Base",          base: 130000,  rate: 260,     desc: "Great views. Terrible gift shop." },
  { id: "yard",     name: "Orbital Shipyard",   base: 1.4e6,   rate: 1400,    desc: "Builds the tools that build the tools." },
  { id: "fusion",   name: "Fusion Plant",       base: 2e7,     rate: 7800,    desc: "A tiny star in a very sturdy box." },
  { id: "rig",      name: "Asteroid Rig",       base: 3.3e8,   rate: 44000,   desc: "Mines rocks that mine other rocks." },
  { id: "relay",    name: "Warp Relay",         base: 5.1e9,   rate: 260000,  desc: "Ships dust before you ordered it." },
  { id: "nebula",   name: "Nebula Collector",   base: 7.5e10,  rate: 1.6e6,   desc: "Sweeps constellations with a very large net." },
  { id: "dyson",    name: "Dyson Panel",        base: 1e12,    rate: 1e7,     desc: "A solar panel with ambitions." },
  { id: "hole",     name: "Black Hole Tap",     base: 1.4e13,  rate: 6.5e7,   desc: "Dust goes in, nothing comes out. Profit somehow." },
  { id: "lens",     name: "Galaxy Lens",        base: 1.7e14,  rate: 4.3e8,   desc: "Focuses an entire galaxy into a jar." },
  { id: "continuum",name: "Continuum Engine",   base: 2.1e15,  rate: 2.9e9,   desc: "It shouldn't exist. It disagrees." },
];
const COST_MULT = 1.15;
const MS_STEPS = [1, 10, 25, 50, 100, 200];
const MS_MULT = [10, 60, 500, 5000, 60000, 1e6];
const MS_NAMES = ["Tungsten", "Iridium", "Quantum", "Photonic", "Exotic", "Transcendent"];

/* ============ STATE ============ */
const SAVE_KEY = "stellar-ascent-v4";
let S = newState();
function newState() {
  return {
    dust: 0, lifetime: 0,
    clickCount: 0, handMade: 0,
    buildings: {}, upgrades: [], ach: [], tree: [],
    comets: 0, shards: 0, shardsEarned: 0, ascensions: 0,
    buffs: {}, nextComet: 0,
    buyMode: 1, mute: false,
    lastTick: Date.now(), started: Date.now(),
  };
}

/* ============ HELPERS ============ */
const $ = id => document.getElementById(id);
const B = id => BUILDINGS.find(b => b.id === id);
const owned = id => S.buildings[id] || 0;

function fmt(n) {
  if (!isFinite(n)) return "∞";
  if (n < 1000) return (n < 10 && n % 1 !== 0) ? n.toFixed(1) : Math.floor(n).toString();
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "De"];
  let i = -1;
  while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
  return n.toFixed(n < 10 ? 2 : n < 100 ? 1 : 0) + units[i];
}
function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return (d ? d + "d " : "") + (h ? h + "h " : "") + m + "m";
}
function totalBuildings() { return BUILDINGS.reduce((s, b) => s + owned(b.id), 0); }
function achMult() { return 1 + 0.01 * S.ach.length; }
function shardMult() { return 1 + 0.02 * S.shardsEarned * (treeOwned("h_amp") ? 1.5 : 1); }
function treeOwned(id) { return S.tree.includes(id); }
function buffMult() { return Date.now() < (S.buffs.rushUntil || 0) ? 7 : 1; }
function frenzyMult() { return Date.now() < (S.buffs.frenzyUntil || 0) ? 777 : 1; }

function buildingRate(b) {
  let m = achMult() * shardMult() * buffMult() * globalTreeMult();
  m *= Math.pow(2, msOwnedCount(b.id));
  return b.rate * m;
}
function msOwnedCount(bid) {
  let n = 0;
  MS_STEPS.forEach((s, i) => { if (S.upgrades.includes(`ms:${bid}:${s}`)) n++; });
  return n;
}
function globalTreeMult() {
  let m = 1;
  if (treeOwned("h1")) m += 0.05;
  if (treeOwned("h2")) m += 0.10;
  if (treeOwned("h8")) m += 0.25;
  if (treeOwned("h11")) m += 0.50;
  if (treeOwned("h12")) m *= 5;
  return m;
}
function cps() {
  return BUILDINGS.reduce((s, b) => s + owned(b.id) * buildingRate(b), 0);
}
function clickPower() {
  let m = Math.pow(2, clickUpgLevel());
  if (treeOwned("h3")) m *= 2;
  let base = 1 + cps() * 0.03;
  if (treeOwned("h9")) base += cps() * 0.01;
  return base * m * frenzyMult();
}
function ric(name) { return `<img class="ric" src="${pxIcon(name)}" alt="">`; }
function clickUpgLevel() {
  let n = 0;
  while (S.upgrades.includes("click:" + n)) n++;
  return n;
}

/* building cost for n (total), CC formula */
function bCost(b, n) {
  const have = owned(b.id);
  return Math.ceil(b.base * Math.pow(COST_MULT, have) * (Math.pow(COST_MULT, n) - 1) / (COST_MULT - 1));
}
function maxAffordable(b) {
  const have = owned(b.id);
  const n = Math.floor(Math.log(S.dust * (COST_MULT - 1) / (b.base * Math.pow(COST_MULT, have)) + 1) / Math.log(COST_MULT));
  return Math.max(0, Math.min(n, 10000));
}
function canPay(cost) { return S.dust >= cost; }

/* ============ UPGRADES ============ */
const PRE = ["Tungsten", "Iridium", "Quantum", "Photonic", "Exotic", "Transcendent"];
function allUpgrades() {
  const list = [];
  // per-building milestones
  for (const b of BUILDINGS) {
    MS_STEPS.forEach((n, i) => {
      list.push({
        id: `ms:${b.id}:${n}`,
        name: `${PRE[i]} ${b.name}`,
        desc: `${b.name}s are twice as efficient.`,
        cost: Math.ceil(b.base * MS_MULT[i]),
        icon: b.id,
        unlocked: owned(b.id) >= n,
        bought: S.upgrades.includes(`ms:${b.id}:${n}`),
        kind: "ms", ref: b,
      });
    });
  }
  // click upgrades
  for (let i = 0; i < 20; i++) {
    list.push({
      id: `click:${i}`,
      name: `Reinforced Glove ${["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX"][i]}`,
      desc: "Clicking power ×2.",
      cost: Math.ceil(100 * Math.pow(14, i)),
      icon: "click",
      unlocked: S.clickCount >= [0, 50, 200, 500, 1000, 2000, 3500, 5000, 7000, 9000, 11000, 13000, 15000, 17500, 20000, 23000, 26000, 30000, 35000, 40000][i],
      bought: S.upgrades.includes(`click:${i}`),
      kind: "click", ref: null,
    });
  }
  return list.filter(u => u.unlocked && !u.bought);
}

/* ============ ACHIEVEMENTS (30, +1% each) ============ */
const ACH = [
  { id: "c1",  name: "Calloused",        desc: "Click 100 times.",            cond: s => s.clickCount >= 100 },
  { id: "c2",  name: "Blistered",        desc: "Click 1,000 times.",          cond: s => s.clickCount >= 1000 },
  { id: "c3",  name: "Carpal Ascension", desc: "Click 10,000 times.",         cond: s => s.clickCount >= 10000 },
  { id: "b1",  name: "Foreman",          desc: "Own 10 buildings.",           cond: s => totalBuildings() >= 10 },
  { id: "b2",  name: "Governor",         desc: "Own 50 buildings.",           cond: s => totalBuildings() >= 50 },
  { id: "b3",  name: "Overlord",         desc: "Own 100 buildings.",          cond: s => totalBuildings() >= 100 },
  { id: "b4",  name: "Tycoon",           desc: "Own 250 buildings.",          cond: s => totalBuildings() >= 250 },
  { id: "b5",  name: "Singularity Boss", desc: "Own 500 buildings.",          cond: s => totalBuildings() >= 500 },
  { id: "d1",  name: "Dust Bunny",       desc: "Collect 1,000 lifetime stardust.",  cond: s => s.lifetime >= 1e3 },
  { id: "d2",  name: "Dust Devil",       desc: "Collect 1M lifetime stardust.",     cond: s => s.lifetime >= 1e6 },
  { id: "d3",  name: "Dust Storm",       desc: "Collect 1B lifetime stardust.",     cond: s => s.lifetime >= 1e9 },
  { id: "d4",  name: "Dust Galaxy",      desc: "Collect 1T lifetime stardust.",     cond: s => s.lifetime >= 1e12 },
  { id: "d5",  name: "Dust Universe",    desc: "Collect 1Qa lifetime stardust.",    cond: s => s.lifetime >= 1e15 },
  { id: "u1", name: "First Spark",   desc: "Buy your first upgrade.",   cond: s => s.upgrades.length >= 1 },
  { id: "u2", name: "Upgrade Lover", desc: "Buy 10 upgrades.",          cond: s => s.upgrades.length >= 10 },
  { id: "u3", name: "Upgrade Addict", desc: "Buy 30 upgrades.",         cond: s => s.upgrades.length >= 30 },
  { id: "m1", name: "Drone Army",   desc: "Own 100 Scrap Drones.",   cond: s => owned("drone") >= 100 },
  { id: "m2", name: "Rover Rally",  desc: "Own 100 Mining Rovers.",  cond: s => owned("rover") >= 100 },
  { id: "m3", name: "Refinery King",desc: "Own 100 Ore Refineries.", cond: s => owned("refinery") >= 100 },
  { id: "m4", name: "Fleet Admiral",desc: "Own 50 Survey Probes.",   cond: s => owned("probe") >= 50 },
  { id: "m5", name: "Lunatic",      desc: "Own 50 Moon Bases.",      cond: s => owned("moonbase") >= 50 },
  { id: "m6", name: "Star Crossed", desc: "Own 25 Fusion Plants.",   cond: s => owned("fusion") >= 25 },
  { id: "m7", name: "Rock Baron",   desc: "Own 25 Asteroid Rigs.",   cond: s => owned("rig") >= 25 },
  { id: "k1", name: "Comet Catcher",   desc: "Catch 1 Golden Comet.",  cond: s => s.comets >= 1 },
  { id: "k2", name: "Comet Whisperer", desc: "Catch 10 Golden Comets.", cond: s => s.comets >= 10 },
  { id: "k3", name: "Comet Deity",     desc: "Catch 50 Golden Comets.", cond: s => s.comets >= 50 },
  { id: "a1", name: "Reborn",        desc: "Ascend once.",       cond: s => s.ascensions >= 1 },
  { id: "a2", name: "Eternal Cycle", desc: "Ascend 5 times.",    cond: s => s.ascensions >= 5 },
  { id: "a3", name: "Shard Hoarder", desc: "Earn 10 shards total.",  cond: s => s.shardsEarned >= 10 },
  { id: "a4", name: "Shard Titan",   desc: "Earn 100 shards total.", cond: s => s.shardsEarned >= 100 },
];

/* ============ ASCENSION TREE ============ */
const TREE = [
  { id: "h1",  name: "Starter Dust",    cost: 1,   pos: {x: 50, y: 8},  req: null,      desc: "+5% all production." },
  { id: "h3",  name: "Click Precision", cost: 3,   pos: {x: 25, y: 24}, req: "h1",      desc: "Clicking power ×2." },
  { id: "h2",  name: "Legacy Dust",     cost: 3,   pos: {x: 75, y: 24}, req: "h1",      desc: "+10% all production." },
  { id: "h4",  name: "Comet Charm",     cost: 5,   pos: {x: 12, y: 40}, req: "h3",      desc: "Comets appear 2× more often." },
  { id: "h5",  name: "Shard Amplifier", cost: 10,  pos: {x: 88, y: 40}, req: "h2",      desc: "Each shard gives +3% production instead of +2%." },
  { id: "h6",  name: "Head Start",      cost: 5,   pos: {x: 30, y: 52}, req: "h4",      desc: "Begin each run with 1M stardust." },
  { id: "h7",  name: "Offline Mind",    cost: 5,   pos: {x: 70, y: 52}, req: "h5",      desc: "Offline progress at 100% instead of 60%." },
  { id: "h8",  name: "Deep Economy",    cost: 20,  pos: {x: 50, y: 60}, req: "h6",      desc: "+25% all production." },
  { id: "h9",  name: "Click Storm",     cost: 20,  pos: {x: 12, y: 72}, req: "h6",      desc: "Clicks also grant 1% of your per-second output." },
  { id: "h10", name: "Golden Age",      cost: 40,  pos: {x: 88, y: 72}, req: "h7",      desc: "Buff durations +50%." },
  { id: "h11", name: "Cosmic Legacy",   cost: 60,  pos: {x: 35, y: 86}, req: "h8",      desc: "+50% all production." },
  { id: "h12", name: "Singularity",     cost: 150, pos: {x: 65, y: 86}, req: "h8",      desc: "×5 all production. The end of the road." },
];
function shardGain() { return Math.floor(Math.sqrt(S.lifetime / 1e12)); }

/* ============ AUDIO (synth) ============ */
let AC = null;
function initAudio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (AC && AC.state === "suspended") AC.resume();
}
function tone(freq, dur, type, vol, when, slide) {
  if (!AC || S.mute) return;
  const t = AC.currentTime + (when || 0);
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type || "square";
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(vol || 0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(AC.destination);
  o.start(t); o.stop(t + dur + 0.02);
}
const SFX = {
  click() { tone(420 + Math.random() * 80, 0.06, "square", 0.05, 0, 180); },
  buy()   { tone(330, 0.07, "square", 0.07); tone(494, 0.09, "square", 0.07, 0.07); },
  upgrade(){ tone(392, 0.08, "triangle", 0.09); tone(523, 0.08, "triangle", 0.09, 0.08); tone(659, 0.12, "triangle", 0.09, 0.16); },
  ach()   { tone(523, 0.1, "triangle", 0.08); tone(659, 0.1, "triangle", 0.08, 0.1); tone(784, 0.1, "triangle", 0.08, 0.2); tone(1046, 0.18, "triangle", 0.08, 0.3); },
  comet() { tone(900, 0.5, "sawtooth", 0.05, 0, 200); },
  rush()  { tone(200, 0.3, "sawtooth", 0.09, 0, 800); tone(800, 0.25, "square", 0.07, 0.2, 1600); },
  ascend(){ tone(150, 0.6, "sawtooth", 0.1, 0, 1200); tone(600, 0.5, "triangle", 0.09, 0.4, 2400); },
};

/* ============ SAVE / LOAD ============ */
function save() { S.lastTick = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    S = Object.assign(newState(), JSON.parse(raw));
    const elapsed = Math.min((Date.now() - S.lastTick) / 1000, 86400);
    if (elapsed > 10) {
      const rate = treeOwned("h7") ? 1 : 0.6;
      const g = cps() * elapsed * rate;
      if (g > 1) {
        S.dust += g; S.lifetime += g;
        setTimeout(() => toast("Welcome back! Offline " + fmtTime(elapsed) + " → +" + fmt(g) + " stardust"), 500);
      }
    }
  } catch (e) { console.warn("bad save"); }
}

/* ============ ACTIONS ============ */
function clickPlanet(evt) {
  initAudio();
  const amt = clickPower();
  S.dust += amt; S.lifetime += amt; S.clickCount++;
  SFX.click();
  const bp = $("big-planet");
  bp.classList.add("pressed");
  clearTimeout(bp._pt);
  bp._pt = setTimeout(() => bp.classList.remove("pressed"), 90);
  if (evt) {
    floatNum(evt, "+" + fmt(amt));
    for (let i = 0; i < 4; i++) {
      const sp = document.createElement("div");
      sp.className = "spark";
      sp.style.left = (evt.clientX + (Math.random() * 24 - 12)) + "px";
      sp.style.top = (evt.clientY + (Math.random() * 12 - 6)) + "px";
      sp.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      sp.style.setProperty("--dy", (-30 - Math.random() * 40) + "px");
      sp.style.background = "#ffd166";
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 500);
    }
  }
}
function buyBuilding(b) {
  let n = S.buyMode === "max" ? Math.max(1, maxAffordable(b)) : S.buyMode;
  const cost = bCost(b, n);
  if (!canPay(cost)) return;
  initAudio(); SFX.buy();
  S.dust -= cost;
  S.buildings[b.id] = owned(b.id) + n;
  renderStore();
}
function buyUpgrade(u) {
  if (!canPay(u.cost)) return;
  initAudio(); SFX.upgrade();
  S.dust -= u.cost;
  S.upgrades.push(u.id);
  renderStore();
}
function ascend() {
  const g = shardGain();
  if (g < 1 || !confirm(`Ascend for ${g} heavenly shard${g > 1 ? "s" : ""}?\n\nYou lose your buildings and stardust.\nShards, tree, achievements stay. Each shard earned gives +2% production forever.`)) return;
  SFX.ascend();
  S.shards += g; S.shardsEarned += g; S.ascensions++;
  const kept = { shards: S.shards, shardsEarned: S.shardsEarned, ascensions: S.ascensions, tree: S.tree, ach: S.ach, comets: S.comets, lifetime: S.lifetime, clickCount: S.clickCount, mute: S.mute, stats: S.stats };
  S = newState();
  Object.assign(S, kept);
  if (treeOwned("h6")) S.dust = 1e6;
  renderAll(); save();
  toast(`Ascension #${S.ascensions}: +${g} shards`);
}

/* ============ TOOLTIP (anchored, CC-style) ============ */
function attachTip(el, fn) {
  el.addEventListener("mouseenter", () => {
    const t = $("tooltip");
    t.innerHTML = fn();
    t.style.display = "block";
    anchorTip(el);
  });
  el.addEventListener("mouseleave", () => { $("tooltip").style.display = "none"; });
}
function anchorTip() {
  const t = $("tooltip");
  const sp = $("store-panel");
  if (!sp) return;
  const r = sp.getBoundingClientRect();
  t.style.left = "-9999px";
  const tr = t.getBoundingClientRect();
  let left = r.left - tr.width - 12, top = r.top + 50;
  if (left < 8) left = r.right + 12;
  if (top + tr.height > innerHeight - 16) top = innerHeight - tr.height - 16;
  t.style.left = Math.max(8, left) + "px";
  t.style.top = Math.max(56, top) + "px";
}

/* ============ TOASTS / FLOATS ============ */
function toast(text) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}
function floatNum(evt, text) {
  const el = document.createElement("div");
  el.className = "float-num";
  el.textContent = text;
  el.style.left = (evt.clientX - 10 + (Math.random() * 30 - 15)) + "px";
  el.style.top = (evt.clientY - 20) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

/* ============ PIXEL ART ============ */
function shadeColor(hex, f) {
  const v = parseInt(hex.slice(1), 16);
  const ch = s => Math.min(255, Math.max(0, Math.round(((v >> s) & 255) * f)));
  return "#" + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, "0")).join("");
}
let _homeURL = null;
function homePlanetURL() {
  if (_homeURL) return _homeURL;
  const n = 26, cv = document.createElement("canvas");
  cv.width = n; cv.height = n;
  const x = cv.getContext("2d");
  let seed = 99;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const c = "#4ecdc4";
  const shade = f => shadeColor(c, f);
  const cols = [shade(1.35), c, shade(0.72), shade(0.45)];
  const R = 10.5, cx = n / 2 - 0.5, cy = n / 2 - 0.5;
  for (let y = 0; y < n; y++) for (let xx = 0; xx < n; xx++) {
    const dx = xx - cx, dy = y - cy, d = Math.sqrt(dx * dx + dy * dy);
    if (d > R) continue;
    const depth = (dx + dy) / (2 * R);
    let ci = depth < -0.45 ? 0 : depth < 0.05 ? 1 : depth < 0.5 ? 2 : 3;
    if (ci > 0 && ci < 3 && rnd() < 0.28) ci += depth > 0.1 ? -1 : 1;
    if (rnd() < 0.05) ci = Math.min(3, ci + 1);
    x.fillStyle = cols[ci]; x.fillRect(xx, y, 1, 1);
  }
  _homeURL = cv.toDataURL();
  return _homeURL;
}

const ICON_CACHE = {};
function iconFor(bid) {
  const key = bid;
  if (ICON_CACHE[key]) return ICON_CACHE[key];
  const b = BUILDINGS.find(x => x.id === bid);
  const hi = "#e8fbff", A = "#5ee6d0", A2 = "#2f9cc4", G = "#9aa3c4", G2 = "#565e85", W = "#e8e3ff", D = "#20263f", Y = "#ffd166";
  const cv = document.createElement("canvas");
  cv.width = 12; cv.height = 12;
  const x = cv.getContext("2d");
  const px = (a, b2, w, h, c) => { x.fillStyle = c; x.fillRect(a, b2, w, h); };
  switch (bid) {
    case "drone": px(5,1,2,1,G); px(3,2,6,1,G); px(4,3,4,2,A); px(5,5,2,3,A2); px(4,8,4,1,G2); px(5,9,2,2,Y); break;
    case "rover": px(1,9,3,2,D); px(8,9,3,2,D); px(3,6,6,3,A); px(2,4,8,2,G); px(4,2,4,2,Y); px(5,1,2,1,W); break;
    case "refinery": px(1,3,10,2,G2); px(2,5,8,6,G); px(3,6,2,2,A); px(6,6,2,2,A2); px(4,9,4,1,Y); px(5,1,2,2,G2); break;
    case "probe": px(5,0,2,2,G2); px(2,2,8,3,A); px(1,3,2,1,W); px(9,3,2,1,W); px(4,5,4,2,A2); px(5,7,2,4,G2); break;
    case "moonbase": px(2,4,8,7,G); px(3,3,6,1,W); px(3,5,2,2,A); px(6,5,2,2,Y); px(2,11,8,1,G2); px(1,2,3,2,G2); break;
    case "yard": px(1,8,10,3,G2); px(2,5,3,3,G); px(7,5,3,3,G); px(4,2,4,3,A); px(5,1,2,1,W); px(5,6,2,2,Y); break;
    case "fusion": px(2,2,8,8,G2); px(3,3,6,6,G); px(4,4,4,4,A); px(5,5,2,2,W); px(5,0,2,2,Y); px(5,10,2,1,Y); break;
    case "rig": px(2,2,1,9,G2); px(9,2,1,9,G2); px(1,1,10,1,G); px(4,3,4,3,A); px(4,7,4,2,Y); px(3,10,6,1,G2); break;
    case "relay": px(5,0,2,3,A2); px(3,3,6,2,A); px(1,5,10,2,G); px(3,7,6,2,A2); px(5,9,2,2,Y); px(1,2,2,1,W); break;
    case "nebula": px(3,1,2,2,"#b8a9e8"); px(7,2,2,2,"#7fdbff"); px(5,4,3,2,"#ff8fb8"); px(3,6,3,3,A2); px(7,7,2,3,"#b8a9e8"); px(2,10,8,1,G); break;
    case "dyson": px(5,1,2,10,G2); px(2,2,8,2,A); px(2,5,8,2,A2); px(2,8,8,2,A); px(4,4,4,1,W); break;
    case "hole": px(1,1,10,10,"#2d2440"); px(3,3,6,6,"#000000"); px(4,4,4,4,"#0a0a12"); px(5,2,2,1,Y); px(8,4,2,1,"#ff8fb8"); px(2,8,2,1,"#7fdbff"); break;
    case "lens": px(5,0,2,2,W); px(3,2,6,1,G); px(2,3,8,6,G2); px(4,4,4,4,A); px(5,5,2,2,W); px(5,9,2,2,G); break;
    case "continuum": px(5,0,2,3,Y); px(3,2,6,3,A); px(1,4,10,2,A2); px(3,6,6,3,A); px(5,9,2,2,Y); px(4,5,4,2,W); break;
    default: px(3,3,6,6,A);
  }
  ICON_CACHE[key] = cv.toDataURL();
  return ICON_CACHE[key];
}

/* pixel UI glyphs */
const PXI = {};
function pxIcon(name) {
  if (PXI[name]) return PXI[name];
  const cv = document.createElement("canvas");
  cv.width = 12; cv.height = 12;
  const x = cv.getContext("2d");
  const px = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
  switch (name) {
    case "shard":
      px(5,0,2,2,"#f0dcff"); px(3,2,6,2,"#d29bff"); px(2,4,8,4,"#8a5ec4"); px(3,8,6,2,"#6a3fa0"); px(5,10,2,2,"#5a3590");
      px(4,3,4,4,"#b678ff"); px(5,4,2,2,"#f0dcff"); break;
    case "trophy":
      px(3,1,6,1,"#ffd166"); px(2,2,8,3,"#ffd166"); px(1,3,1,2,"#e8a53a"); px(10,3,1,2,"#e8a53a");
      px(3,5,6,1,"#e8a53a"); px(5,6,2,3,"#e8a53a"); px(3,9,6,2,"#a06a1f"); px(4,3,2,2,"#fff3c4"); break;
    case "news":
      px(1,1,10,10,"#e8e3ff"); px(2,2,6,1,"#565e85"); px(2,4,8,1,"#8a94b8"); px(2,6,8,1,"#8a94b8");
      px(2,8,5,1,"#8a94b8"); px(8,3,2,4,"#5ee6d0"); break;
    case "colonist":
      px(1,1,2,1,"#8a94b8"); px(3,2,2,1,"#8a94b8"); px(5,3,2,1,"#8a94b8"); px(7,4,2,1,"#8a94b8"); px(9,5,2,1,"#8a94b8");
      px(7,6,1,1,"#ffd166"); px(6,7,1,2,"#c8a048"); px(5,9,1,2,"#c8a048"); px(3,11,2,1,"#8a94b8"); break;
    case "stats":
      px(2,8,2,3,"#5ee6d0"); px(5,5,2,6,"#ffd166"); px(8,2,2,9,"#ef476f"); px(1,11,10,1,"#565e85"); break;
    case "metal":
      px(3,2,6,7,"#9aa3c4"); px(4,3,4,5,"#565e85"); px(3,1,6,1,"#c8d0e8"); px(2,9,8,2,"#565e85"); break;
  }
  PXI[name] = cv.toDataURL();
  return PXI[name];
}

/* ============ COMETS ============ */
let _cometURL = null;
function pixelCometURL() {
  if (_cometURL) return _cometURL;
  const cv = document.createElement("canvas");
  cv.width = 16; cv.height = 16;
  const x = cv.getContext("2d");
  const px = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
  const T = "#5ee6d0", T2 = "#9ffbe8", H = "#ffd166", W = "#fff3c4";
  px(2,1,1,1,T); px(1,2,1,1,T); px(3,2,1,1,T2); px(2,3,1,1,T);
  px(4,3,1,1,T); px(3,4,1,1,T2); px(1,4,1,1,T); px(4,5,1,1,T);
  px(3,6,1,1,T2); px(5,5,1,1,T); px(5,7,1,1,T); px(6,6,1,1,T2);
  px(8,6,4,1,H); px(7,7,6,3,H); px(8,10,4,1,H);
  px(8,7,3,2,W); px(9,8,2,1,W); px(11,7,2,3,"#e8a53a");
  _cometURL = cv.toDataURL();
  return _cometURL;
}
function scheduleComet() {
  const freq = treeOwned("h4") ? 0.5 : 1;
  S.nextComet = Date.now() + (3 + Math.random() * 4) * 60000 * freq;
}
function spawnComet() {
  SFX.comet();
  const el = document.createElement("img");
  el.className = "comet";
  el.src = pixelCometURL();
  el.style.setProperty("--y0", 10 + Math.random() * 50 + "vh");
  document.body.appendChild(el);
  const life = 11000 * (treeOwned("h10") ? 1.5 : 1);
  const done = setTimeout(() => el.remove(), life);
  el.onclick = e => { clearTimeout(done); el.remove(); catchComet(e); };
}
function catchComet(evt) {
  initAudio();
  S.comets++;
  const roll = Math.random();
  const durMult = treeOwned("h10") ? 1.5 : 1;
  if (roll < 0.45) {
    S.buffs.rushUntil = Date.now() + 30000 * durMult;
    toast("COMET RUSH! Production ×7 for 30s");
  } else if (roll < 0.8) {
    const gain = Math.max(cps() * 90, Math.min(S.dust * 0.15, cps() * 900), 20);
    S.dust += gain; S.lifetime += gain;
    toast("STARDUST SHOWER! +" + fmt(gain) + " stardust");
  } else {
    S.buffs.frenzyUntil = Date.now() + 15000 * durMult;
    toast("CLICK FRENZY! Clicking ×777 for 15s");
  }
  SFX.rush();
  floatNum(evt, "COMET!");
  renderTick();
  checkAch();
  save();
}
function tickComets() {
  if (!S.nextComet) scheduleComet();
  if (Date.now() >= S.nextComet && !document.querySelector(".comet")) {
    spawnComet();
    scheduleComet();
  }
}

/* ============ ACHIEVEMENTS ============ */
function checkAch() {
  let newly = 0;
  for (const a of ACH) {
    if (S.ach.includes(a.id)) continue;
    if (a.cond(S)) { S.ach.push(a.id); newly++; }
  }
  if (newly) { SFX.ach(); toast(`Achievement${newly > 1 ? "s" : ""} unlocked! +${newly}% production`); renderAch(); }
}
function renderAch() {
  const grid = $("ach-grid");
  const c = `${S.ach.length}/${ACH.length} (+${S.ach.length}%)`;
  $("ach-count").textContent = c;
  const c2 = $("ach-count2");
  if (c2) c2.textContent = `You have ${c}.`;
  grid.innerHTML = "";
  for (const a of ACH) {
    const ownedA = S.ach.includes(a.id);
    const d = document.createElement("div");
    d.className = "ach" + (ownedA ? " owned" : "");
    if (ownedA) d.innerHTML = pxIcon("trophy") ? `<img src="${pxIcon("trophy")}">` : "";
    else d.textContent = "?";
    d.title = ownedA ? `${a.name} — ${a.desc}` : `??? — ${a.desc}`;
    grid.appendChild(d);
  }
}

/* ============ RENDER: STORE ============ */
function renderStore() {
  // upgrades shelf
  const ul = $("upgrades");
  ul.innerHTML = "";
  const ups = allUpgrades();
  $("upg-count").textContent = `${S.upgrades.length} bought`;
  for (const u of ups.slice(0, 24)) {
    const can = canPay(u.cost);
    const tile = document.createElement("div");
    tile.className = "upg-tile" + (can ? "" : " grayed");
    const icon = u.icon === "click" ? "colonist" : u.icon;
    tile.innerHTML = `<img src="${iconFor(icon)}" width="30" height="30" alt="">`;
    tile.onclick = () => buyUpgrade(u);
    attachTip(tile, () => `<div class="tt-name">${u.name}</div>
      <div class="tt-sub">${u.desc}</div>
      <div class="tt-cost">Cost: ${fmt(u.cost)} stardust</div>`);
    ul.appendChild(tile);
  }
  if (!ups.length) ul.innerHTML = `<div class="dim-note">No upgrades available. Buy more buildings to unlock them.</div>`;

  // buildings
  const bl = $("buildings");
  bl.innerHTML = "";
  for (const b of BUILDINGS) {
    // reveal buildings progressively (CC-style): previous owned or lifetime past half cost
    const prev = BUILDINGS[BUILDINGS.indexOf(b) - 1];
    if (prev && owned(prev.id) < 1 && S.lifetime < b.base * 0.35) break;
    const have = owned(b.id);
    const n = S.buyMode === "max" ? Math.max(1, maxAffordable(b)) : S.buyMode;
    const cost = bCost(b, n);
    const can = canPay(cost);
    const each = buildingRate(b);
    const strip = document.createElement("div");
    strip.className = "store-strip" + (can ? " can" : "") + (have > 0 ? " owned-b" : "");
    strip.innerHTML = `
      <img class="strip-icon" src="${iconFor(b.id)}" width="52" height="52" alt="">
      <div class="strip-info">
        <div class="strip-name">${b.name} <span class="own-count">${have > 0 ? "×" + have : ""}</span></div>
        <div class="strip-sub">${have > 0 ? fmt(each * have) + "/s (" + (cps() > 0 ? Math.round(100 * each * have / cps()) : 0) + "%) · " : ""}${fmt(each)}/s each</div>
      </div>
      <div class="strip-price">Buy ${S.buyMode === "max" ? maxAffordable(b) : n}<br><b>${fmt(cost)}</b></div>`;
    strip.onclick = () => buyBuilding(b);
    attachTip(strip, () => tipBuilding(b));
    bl.appendChild(strip);
  }
}
function tipBuilding(b) {
  const have = owned(b.id);
  const each = buildingRate(b);
  const total = each * have;
  const share = cps() > 0 ? Math.round(100 * total / cps()) : 0;
  const ms = msOwnedCount(b.id);
  const nextMs = MS_STEPS[ms] ? `Next upgrade at ${MS_STEPS[ms]} owned (you have ${have}).` : "Fully upgraded.";
  return `<div class="tt-name">${b.name} ${have ? `<span style="color:var(--dim)">×${have}</span>` : ""}</div>
    <div class="tt-sub">${b.desc}</div>
    <div class="tt-line">Each produces <b>${fmt(each)}/s</b>${have ? ` — <b>${fmt(total)}/s</b> total (${share}% of output)` : ""}</div>
    <div class="tt-sub">${nextMs}</div>
    <div class="tt-cost">Buy 1: ${fmt(bCost(b, 1))} · Buy 10: ${fmt(bCost(b, 10))} · Buy 100: ${fmt(bCost(b, 100))}</div>`;
}

/* ============ RENDER: ASCENSION TREE ============ */
function renderTree() {
  const g = shardGain();
  $("shard-info").innerHTML =
    `${ric("shard")} <span class="shards">${S.shards}</span> spacetime shards` +
    ` <span style="color:var(--dim)">(+${Math.round((shardMult() - 1) * 100)}% production, forever)</span><br>` +
    `<span style="color:var(--dim)">Ascending now: +${g} shards` +
    (g < 1 ? ` — need ${fmt(1e12)} lifetime stardust (have ${fmt(S.lifetime)})` : "") + `</span>`;
  const btn = $("ascend-btn");
  btn.disabled = g < 1;
  btn.textContent = g < 1 ? "ASCEND (LOCKED)" : `ASCEND +${g} shards`;

  const W = 100, H = 100;
  let lines = "";
  for (const m of TREE) {
    if (!m.req) continue;
    const from = TREE.find(x => x.id === m.req);
    const on = treeOwned(m.id) || treeOwned(m.req);
    lines += `<line x1="${from.pos.x}" y1="${from.pos.y}" x2="${m.pos.x}" y2="${m.pos.y}" stroke="${on ? "#8a5ec4" : "#39315a"}" stroke-width="0.5"/>`;
  }
  let nodes = "";
  TREE.forEach((m, i) => {
    const ownedT = treeOwned(m.id);
    const avail = !ownedT && (!m.req || treeOwned(m.req));
    const cls = ownedT ? "owned" : avail ? "avail" : "locked2";
    nodes += `<div class="mnode ${cls}" data-i="${i}" style="left:calc(${m.pos.x}% - 24px);top:calc(${m.pos.y}% - 24px)">${ric("shard")}</div>`;
  });
  $("tree").innerHTML = `<div class="tree-wrap"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${lines}</svg>${nodes}</div>`;
  const els = $("tree").querySelectorAll(".mnode");
  TREE.forEach((m, i) => {
    const ownedT = treeOwned(m.id);
    const avail = !ownedT && (!m.req || treeOwned(m.req));
    const el = els[i];
    attachTip(el, () => `<div class="tt-name">${m.name}</div><div class="tt-sub">${m.desc}</div>
      ${ownedT ? "" : `<div class="tt-cost">${m.cost} shards — ${avail ? (S.shards >= m.cost ? "CLICK TO BUY" : "not enough shards") : "LOCKED (requires " + (TREE.find(x => x.id === m.req) || {}).name + ")"}</div>`}`);
    if (avail) el.onclick = () => {
      if (S.shards < m.cost) return;
      SFX.upgrade();
      S.shards -= m.cost;
      S.tree.push(m.id);
      renderTree(); save();
    };
  });
}

/* ============ RENDER: STATS ============ */
function renderStats() {
  const rows = [
    ["Time played", fmtTime(Date.now() - S.started)],
    ["Stardust", fmt(S.dust)],
    ["Lifetime stardust", fmt(S.lifetime)],
    ["Per second", fmt(cps())],
    ["Clicks", fmt(S.clickCount)],
    ["Buildings", totalBuildings()],
    ["Upgrades", S.upgrades.length],
    ["Achievements", `${S.ach.length} (+${S.ach.length}%)`],
    ["Comets caught", S.comets],
    ["Ascensions", S.ascensions],
    ["Heavenly shards", `${S.shards} (+${Math.round((shardMult()-1)*100)}%)`],
  ];
  $("stats-list").innerHTML = rows.map(([k, v]) =>
    `<div class="stat-row"><span class="stat-k">${k}</span><span class="stat-v">${v}</span></div>`).join("");
}

/* ============ TICK ============ */
function tick() {
  const now = Date.now();
  const dt = Math.min((now - S.lastTick) / 1000, 60);
  S.lastTick = now;
  const g = cps() * dt;
  S.dust += g; S.lifetime += g;
}
function renderTick() {
  $("res-big").innerHTML = fmt(S.dust) + " stardust";
  $("res-rate").textContent = "per second: " + fmt(cps());
  const bs = $("buff-strip");
  const now = Date.now();
  const rush = Math.max(0, (S.buffs.rushUntil || 0) - now);
  const frenzy = Math.max(0, (S.buffs.frenzyUntil || 0) - now);
  let buffHtml = "";
  if (rush > 0) buffHtml += `<span class="buff-tag">FRENZY ×7 ${Math.ceil(rush / 1000)}s</span>`;
  if (frenzy > 0) buffHtml += `<span class="buff-tag click">CLICK ×777 ${Math.ceil(frenzy / 1000)}s</span>`;
  bs.innerHTML = buffHtml;
}

/* ============ NEWS ============ */
let newsIdx = Math.floor(Math.random() * NEWS.length);
function rotateNews(manual) {
  const el = $("news-text");
  if (!el) return;
  newsIdx = manual ? (newsIdx + 1) % NEWS.length : (newsIdx + 1 + Math.floor(Math.random() * 3)) % NEWS.length;
  el.classList.remove("news-fade");
  void el.offsetWidth;
  el.classList.add("news-fade");
  el.textContent = NEWS[newsIdx];
}

/* ============ INIT ============ */
function renderAll() { renderStore(); renderTree(); renderAch(); renderStats(); renderTick(); }
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
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const s of stars) {
      s.tw += 0.02;
      ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(s.tw));
      ctx.fillStyle = "#dfe6ff";
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
    }
    requestAnimationFrame(draw);
  })();
  document.querySelectorAll(".hicon[data-px]").forEach(img => img.src = pxIcon(img.dataset.px));
  $("planet-art-img").src = homePlanetURL();

  load();
  renderAll(); rotateNews();

  $("big-planet").onclick = clickPlanet;
  $("ascend-btn").onclick = ascend;
  $("ascend-open").onclick = () => {
    initAudio();
    $("ascend-overlay").style.display = "flex";
    renderTree();
  };
  $("ascend-close").onclick = () => { $("ascend-overlay").style.display = "none"; };
  $("ach-open").onclick = () => { renderAch(); $("ach-overlay").style.display = "flex"; };
  $("ach-close").onclick = () => { $("ach-overlay").style.display = "none"; };
  $("stats-open").onclick = () => { renderStats(); $("stats-overlay").style.display = "flex"; };
  $("stats-close").onclick = () => { $("stats-overlay").style.display = "none"; };
  $("save-btn").onclick = () => { save(); $("save-btn").textContent = "Saved!"; setTimeout(() => $("save-btn").textContent = "Save", 800); };
  $("reset-btn").onclick = () => { if (confirm("Wipe ALL progress?")) { localStorage.removeItem(SAVE_KEY); S = newState(); renderAll(); } };
  $("mute-btn").onclick = () => {
    S.mute = !S.mute;
    $("mute-btn").textContent = S.mute ? "Sound: OFF" : "Sound: ON";
    save();
  };
  if (S.mute) $("mute-btn").textContent = "Sound: OFF";
  addEventListener("pointerdown", initAudio, { once: true });
  document.querySelectorAll(".buy").forEach(b => {
    b.onclick = () => {
      S.buyMode = b.dataset.buy === "max" ? "max" : parseInt(b.dataset.buy);
      document.querySelectorAll(".buy").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderStore();
    };
  });

  setInterval(tick, 100);
  setInterval(renderTick, 200);
  setInterval(renderStore, 1000);
  setInterval(renderStats, 3000);
  setInterval(checkAch, 2000);
  setInterval(tickComets, 1000);
  setInterval(rotateNews, 9000);
  setInterval(save, 10000);
  addEventListener("beforeunload", save);
}
init();
