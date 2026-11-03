"use strict";

/* ============ DATA ============ */

const PLANETS = [
  {
    id: "terra", name: "Terra Nova", color: "#4ecdc4", ring: false, moons: 1,
    desc: "The first colony. Rich iron deposits in the northern craters.",
    res: "Metal", resIcon: "⚙️", resColor: "#9db4c0",
    unlockCost: null,
    buildings: [
      { id: "drill", name: "Auto-Drill", baseCost: 15, mult: 1.15, rate: 0.5,  desc: "A tireless robotic drill." },
      { id: "rig",   name: "Mining Rig", baseCost: 220, mult: 1.15, rate: 4,   desc: "Industrial extraction array." },
      { id: "quarry",name: "Strip Quarry", baseCost: 3200, mult: 1.15, rate: 28, desc: "Moves mountains. Literally." },
    ],
    upgrades: [
      { id: "pick",  name: "Plasma Pickaxe", cost: 100,  type: "click",  val: 2, desc: "Mining power ×2." },
      { id: "conveyor", name: "Conveyor Network", cost: 1200, type: "prod", val: 2, desc: "Metal production ×2." },
      { id: "droids", name: "Excavation Droids", cost: 15000, type: "prod", val: 3, desc: "Metal production ×3." },
    ],
  },
  {
    id: "luna", name: "Luna", color: "#c0c0d8", ring: false, moons: 0,
    desc: "Regolith fields of helium-3. Perfect fusion fuel.",
    res: "Helium-3", resIcon: "🫧", resColor: "#b8a9e8",
    unlockCost: { Metal: 800 },
    buildings: [
      { id: "probe", name: "Harvest Probe", baseCost: 500, mult: 1.15, rate: 1,   desc: "Skims He-3 from the dust." },
      { id: "scoop", name: "Regolith Scoop", baseCost: 4500, mult: 1.15, rate: 8,  desc: "Eats the surface, spits fuel." },
      { id: "ranch", name: "He-3 Refinery", baseCost: 60000, mult: 1.15, rate: 60, desc: "Bulk isotope processing." },
    ],
    upgrades: [
      { id: "lunadrill", name: "Lunar Drill Tips", cost: 3000, type: "click", val: 2, desc: "Helium-3 mining power ×2." },
      { id: "compress", name: "Isotope Compressors", cost: 20000, type: "prod", val: 2, desc: "Helium-3 production ×2." },
      { id: "fusion", name: "Fusion Feedloops", cost: 250000, type: "prod", val: 3, desc: "Helium-3 production ×3." },
    ],
  },
  {
    id: "ceres", name: "Ceres Belt", color: "#8d6e63", ring: true, moons: 0,
    desc: "An asteroid swarm glittering with raw crystal.",
    res: "Crystal", resIcon: "💎", resColor: "#7fdbff",
    unlockCost: { Metal: 25000, "Helium-3": 2000 },
    buildings: [
      { id: "cutter", name: "Crystal Cutter", baseCost: 5000, mult: 1.15, rate: 1,  desc: "Lasers meet rock." },
      { id: "sifter", name: "Belt Sifter", baseCost: 48000, mult: 1.15, rate: 8, desc: "Screens a thousand rocks an hour." },
      { id: "crawn",   name: "Crystal Crawler", baseCost: 620000, mult: 1.15, rate: 60, desc: "Walks between asteroids, mining all of them." },
    ],
    upgrades: [
      { id: "lens", name: "Focused Lens Array", cost: 60000, type: "click", val: 2, desc: "Crystal mining power ×2." },
      { id: "sort", name: "Spectral Sorters", cost: 350000, type: "prod", val: 2, desc: "Crystal production ×2." },
      { id: "vein", name: "Vein Scanners", cost: 4000000, type: "prod", val: 3, desc: "Crystal production ×3." },
    ],
  },
  {
    id: "aurelia", name: "Aurelia", color: "#e8b04a", ring: true, moons: 2,
    desc: "A ringed giant. Its upper clouds condense pure antimatter.",
    res: "Antimatter", resIcon: "✴️", resColor: "#ff6b9d",
    unlockCost: { Metal: 500000, Crystal: 40000, "Helium-3": 60000 },
    buildings: [
      { id: "skimmer", name: "Cloud Skimmer", baseCost: 80000, mult: 1.15, rate: 2, desc: "Balloon-drifts through the storm layers." },
      { id: "trap",   name: "Mag-Trap Station", baseCost: 900000, mult: 1.15, rate: 18, desc: "Catches the impossible in a bottle." },
      { id: "carrier", name: "Antimatter Carrier", baseCost: 12000000, mult: 1.15, rate: 150, desc: "One crash = no more colony." },
    ],
    upgrades: [
      { id: "penn", name: "Penning Fields", cost: 900000, type: "click", val: 2, desc: "Antimatter mining power ×2." },
      { id: "loop", name: "Storage Loops", cost: 6000000, type: "prod", val: 2, desc: "Antimatter production ×2." },
      { id: "sing", name: "Micro-Singularities", cost: 80000000, type: "prod", val: 3, desc: "Antimatter production ×3." },
    ],
  },
];

const TECHS = [
  { id: "lab",   name: "Research Lab",     cost: { Metal: 150, Crystal: 0 },            desc: "Build labs that generate Science.", repeat: true, effect: "building" },
  { id: "t_auto1", name: "Automation I",   cost: { Science: 10 },  desc: "All production +25%.", effect: "global", val: 0.25 },
  { id: "t_auto2", name: "Automation II",  cost: { Science: 120 }, desc: "All production +50%.", req: "t_auto1", effect: "global", val: 0.5 },
  { id: "t_auto3", name: "Automation III", cost: { Science: 1500 }, desc: "All production +100%.", req: "t_auto2", effect: "global", val: 1.0 },
  { id: "t_mine1", name: "Mining I",       cost: { Science: 25 },  desc: "All mining power ×2.", effect: "click", val: 2 },
  { id: "t_mine2", name: "Mining II",      cost: { Science: 250 }, desc: "All mining power ×3.", req: "t_mine1", effect: "click", val: 3 },
  { id: "t_mine3", name: "Mining III",     cost: { Science: 3000 }, desc: "All mining power ×4.", req: "t_mine2", effect: "click", val: 4 },
  { id: "t_sci1",  name: "Institutes",     cost: { Science: 50 },  desc: "Science output ×2.", req: "t_auto1", effect: "sci", val: 2 },
  { id: "t_sci2",  name: "Academy Worlds", cost: { Science: 800 }, desc: "Science output ×3.", req: "t_sci1", effect: "sci", val: 3 },
  { id: "t_off",   name: "Deep-Space Logs", cost: { Science: 40 }, desc: "Offline progress at 75% instead of 50%.", effect: "offline" },
  { id: "t_click_yield", name: "Resonant Mining", cost: { Science: 400 }, desc: "Each colony click also yields Metal.", req: "t_mine1", effect: "resonant" },
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

/* ============ STATE ============ */

const SAVE_KEY = "stellar-ascent-save";
let S = newState();

function newState() {
  return {
    res: { Metal: 0, "Helium-3": 0, Crystal: 0, Antimatter: 0, Science: 0 },
    lifetime: { Metal: 0, "Helium-3": 0, Crystal: 0, Antimatter: 0, Science: 0 },
    buildings: {},     // "planetId:buildingId" -> count
    labs: 0,
    upgrades: [],      // upgrade ids owned
    techs: [],         // tech ids owned
    masteries: [],     // mastery ids owned (persist through ascension)
    shards: 0,
    unlocked: ["terra"],
    current: "terra",
    buyMode: 1,
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

function clickMult(planet) {
  let m = 1;
  for (const u of PLANET(planet).upgrades) if (S.upgrades.includes(u.id) && u.type === "click") m *= u.val;
  for (const t of S.techs) {
    const def = TECHS.find(x => x.id === t);
    if (def && def.effect === "click") m *= def.val;
  }
  if (mOwned("m_click")) m *= 3;
  return m;
}

function prodMult(planet) {
  let m = globalProdMult();
  for (const u of PLANET(planet).upgrades) if (S.upgrades.includes(u.id) && u.type === "prod") m *= u.val;
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
  return (1 + 0.02 * planetRate(planet)) * clickMult(planet);
}

function planetRate(planet) {
  let sum = 0;
  for (const b of PLANET(planet).buildings) {
    sum += (S.buildings[planet + ":" + b.id] || 0) * b.rate;
  }
  return sum * prodMult(planet);
}

function labRate() {
  return S.labs * 0.5 * sciMult();
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

/* ============ SAVE / LOAD ============ */

function save() {
  S.lastTick = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(S));
}

function load() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
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

function mine(planet, evt) {
  if (!planet || !PLANET(planet)) planet = S.unlocked.includes(S.current) ? S.current : "terra";
  const p = PLANET(planet);
  const amt = clickPower(planet);
  S.res[p.res] += amt;
  S.lifetime[p.res] += amt;
  if (techOwned("t_click_yield")) S.res.Metal += amt;
  if (evt) floatNum(evt, "+" + fmt(amt) + " " + p.resIcon);
}

function floatNum(evt, text) {
  const el = document.createElement("div");
  el.className = "float-num";
  el.textContent = text;
  el.style.left = (evt.clientX - 10) + "px";
  el.style.top = (evt.clientY - 20) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
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
  if (S.upgrades.includes(u.id) || !canPay({ Metal: u.cost })) return;
  pay({ Metal: u.cost });
  S.upgrades.push(u.id);
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
  return { Metal: Math.ceil(150 * Math.pow(1.6, S.labs)), Crystal: Math.ceil(40 * Math.pow(1.6, S.labs)) };
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
  let g = Math.floor(Math.sqrt(am / 1000));
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
    (g < 1 ? ` — needs more lifetime Antimatter (have ${fmt(S.lifetime.Antimatter || 0)}, need ${fmt(1000)})` : "") +
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
    if (!owned) div.querySelector("button").onclick = () => {
      if (S.shards < m.cost) return;
      S.shards -= m.cost;
      S.masteries.push(m.id);
      renderPrestige(); renderNav(); renderPlanet(); renderResearch(); save();
    };
    ml.appendChild(div);
  }
}

/* ============ RENDER ============ */

/* pixel-art planet sprites, generated per planet */
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

  $("planet-art-img").src = pixelPlanetURL(p, 120);
  $("planet-art-img").style.width = "120px";
  $("planet-art-img").style.height = "120px";
  $("planet-name").textContent = p.name;
  $("planet-desc").textContent = p.desc;

  const view = $("planet-view");
  const resLine = $("planet-resource");
  const minePanel = $("mine-panel");
  const bPanel = $("buildings-panel");
  const uPanel = $("upgrades-panel");

  if (!unlocked) {
    resLine.innerHTML = `<span style="color:var(--danger)">LOCKED — travel requires: ${costStr(unlockCost(p))}</span>`;
    minePanel.style.display = "none";
    bPanel.style.display = "none";
    uPanel.style.display = "none";
    return;
  }
  minePanel.style.display = ""; bPanel.style.display = ""; uPanel.style.display = "";

  const rate = planetRate(pid);
  resLine.innerHTML = `${p.resIcon} ${p.res}: <span style="color:${p.resColor}">${fmt(S.res[p.res])}</span><span class="rate">+${fmt(rate)}/s</span>`;
  $("mine-info").textContent = `+${fmt(clickPower(pid))} ${p.res} per click${techOwned("t_click_yield") && p.res !== "Metal" ? " (+ Metal)" : ""}`;

  // buildings
  const bl = $("buildings");
  bl.innerHTML = "";
  for (const b of p.buildings) {
    const have = S.buildings[pid + ":" + b.id] || 0;
    const n = S.buyMode === "max" ? Math.max(1, maxAffordable(pid, b)) : S.buyMode;
    const cost = bCost(pid, b, n);
    const can = canPay({ Metal: cost });
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="info">
        <div class="name">${b.name} <span class="sub">×${have}</span></div>
        <div class="sub">${b.desc} — +${fmt(b.rate * prodMult(pid))}/s each</div>
      </div>
      <button class="${can ? "can" : ""}">
        Buy ${S.buyMode === "max" ? maxAffordable(pid, b) : n} — ${fmt(cost)} Metal
        <span class="cost">produces ${fmt(b.rate * prodMult(pid) * (S.buyMode === "max" ? Math.max(1, maxAffordable(pid, b)) : n))}/s total</span>
      </button>`;
    row.querySelector("button").onclick = () => { buyBuilding(pid, b); renderPlanet(); renderNav(); };
    bl.appendChild(row);
  }

  // upgrades
  const ul = $("upgrades");
  ul.innerHTML = "";
  let anyUpg = false;
  for (const u of p.upgrades) {
    const owned = S.upgrades.includes(u.id);
    if (owned) {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `<div class="info"><div class="name">${u.name} ✔</div><div class="sub">${u.desc}</div></div>`;
      ul.appendChild(row);
      continue;
    }
    anyUpg = true;
    const can = canPay({ Metal: u.cost });
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="info"><div class="name">${u.name}</div><div class="sub">${u.desc}</div></div>
      <button class="${can ? "can" : ""}">Buy — ${fmt(u.cost)} Metal</button>`;
    row.querySelector("button").onclick = () => { buyUpgrade(u); renderPlanet(); };
    ul.appendChild(row);
  }
  if (!anyUpg) {
    const d = document.createElement("div");
    d.className = "sub";
    d.textContent = "All upgrades on this planet are owned.";
    ul.appendChild(d);
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
  labRow.querySelector("button").onclick = () => { buyLab(); renderResearch(); };
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
    if (!owned) row.querySelector("button").onclick = () => { buyTech(t); renderResearch(); };
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
  np.querySelector("button").onclick = () => { travel(next.id); renderNav(); renderPlanet(); renderResearch(); };
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
  const cur = S.current && S.unlocked.includes(S.current) ? S.current : null;
  if (cur) {
    const p = PLANET(cur);
    const rl = $("planet-resource");
    if (rl) rl.innerHTML = `${p.resIcon} ${p.res}: <span style="color:${p.resColor}">${fmt(S.res[p.res])}</span><span class="rate">+${fmt(planetRate(cur))}/s</span>`;
    $("mine-info").textContent = `+${fmt(clickPower(cur))} ${p.res} per click`;
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
  renderNav(); renderPlanet(); renderResearch(); renderPrestige();

  $("mine-btn").onclick = e => mine(S.current, e);
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
  setInterval(renderTick, 200);
  setInterval(() => { renderPlanet(); renderResearch(); renderPrestige(); }, 1500); // refresh affordability
  setInterval(save, 10000);
  addEventListener("beforeunload", save);
}

init();
