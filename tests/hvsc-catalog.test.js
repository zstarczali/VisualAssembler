const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadHvsc() {
  const start = appJs.indexOf("const _HVSC_RESULT_LIMIT");
  const end = appJs.indexOf("let _hvscEntries");
  assert.ok(start > 0 && end > start, "HVSC helpers not found");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end)
    + "\nthis.h = { parseLength: _hvscParseLength, parse: _hvscParseCatalog, search: _hvscSearch, random: _hvscRandom };", context);
  return context.h;
}

const SAMPLE = [
  "[Database]",
  "; /DEMOS/0-9/12th_Sector_Music.sid",
  "c7c299ce06ec5ccffb2261fb11b42a73=4:33.108",
  "; /GAMES/S-Z/Wizball.sid",
  "0123456789abcdef0123456789abcdef=3:12 0:05(G) 1:01.5",
  "; /MUSICIANS/H/Hubbard_Rob/Commando.sid",
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=4:20 0:21 0:09",
  "; /MUSICIANS/H/Hubbard_Rob/Monty_on_the_Run.sid",
  "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb=5:57",
  "; /MUSICIANS/G/Galway_Martin/Commando_Remix.sid",
  "cccccccccccccccccccccccccccccccc=2:00",
  "",
].join("\r\n");

test("lengths: minutes, seconds, optional milliseconds, markers ignored", () => {
  const h = loadHvsc();
  assert.equal(h.parseLength("4:33.108"), 273108);
  assert.equal(h.parseLength("0:05(G)"), 5000);
  assert.equal(h.parseLength("1:01.5"), 61500);
  assert.equal(h.parseLength("12:00"), 720000);
  assert.equal(h.parseLength("garbage"), 0);
});

test("catalog: paths, titles, composers and subtune lengths", () => {
  const h = loadHvsc();
  const entries = h.parse(SAMPLE);
  assert.equal(entries.length, 5);
  const commando = entries.find((e) => e.p === "/MUSICIANS/H/Hubbard_Rob/Commando.sid");
  assert.equal(commando.t, "Commando");
  assert.equal(commando.a, "Hubbard Rob");
  assert.equal(commando.s, "MUSICIANS");
  assert.deepEqual(Array.from(commando.l), [260000, 21000, 9000]);
  const wizball = entries.find((e) => e.t === "Wizball");
  assert.equal(wizball.a, "");
  assert.equal(wizball.s, "GAMES");
  assert.deepEqual(Array.from(wizball.l), [192000, 5000, 61500]);
  assert.equal(entries[0].t, "12th Sector Music");
});

test("search: every word must match, title matches rank first", () => {
  const h = loadHvsc();
  const entries = h.parse(SAMPLE);
  const titles = (q) => Array.from(h.search(entries, q).items, (e) => e.t);
  assert.deepEqual(titles("commando"), ["Commando", "Commando Remix"]);
  assert.deepEqual(titles("rob hubbard"), ["Commando", "Monty on the Run"]);
  assert.deepEqual(titles("hubbard commando"), ["Commando"]);
  assert.deepEqual(titles("monty_on"), ["Monty on the Run"]);
  assert.deepEqual(titles("games/s-z"), ["Wizball"]);
  assert.deepEqual(titles("   "), []);
  assert.deepEqual(titles("c"), [], "one character is too short to search");
  assert.equal(h.search(entries, "zzz").total, 0);
  const limited = h.search(entries, "sid", 2);
  assert.equal(limited.total, 5);
  assert.equal(limited.items.length, 2);
});

test("random: distinct entries, never more than the catalog", () => {
  const h = loadHvsc();
  const entries = h.parse(SAMPLE);
  const picked = h.random(entries, 3);
  assert.equal(picked.length, 3);
  assert.equal(new Set(picked.map((e) => e.p)).size, 3);
  assert.equal(h.random(entries, 50).length, 5);
  assert.equal(h.random([], 5).length, 0);
});

test("composer search: only the composer folder counts, sorted by composer", () => {
  const h = loadHvsc();
  const entries = h.parse([
    "; /DEMOS/UNKNOWN/Ode_to_Galway.sid", "a=1:00",
    "; /GAMES/S-Z/Wizball.sid", "b=1:00",
    "; /MUSICIANS/H/Hubbard_Rob/Commando.sid", "c=1:00",
    "; /MUSICIANS/G/Galway_Martin/Wizball.sid", "d=1:00",
    "; /MUSICIANS/G/Gray_Rob/Zoo.sid", "e=1:00",
    "; /MUSICIANS/P/Probe_Ann/Hubbard_Tribute.sid", "f=1:00",
    "; /MUSICIANS/L/Laxity/Tune.sid", "g=1:00",
    "; /MUSICIANS/D/Da-Vinci_Leo/Tune.sid", "h=1:00",
  ].join("\n"));
  const find = (q) => Array.from(h.search(entries, q, 300, "composer").items, (e) => e.a + "/" + e.t);
  assert.deepEqual(find("galway"), ["Galway Martin/Wizball"], "not the title in DEMOS, not GAMES");
  assert.deepEqual(find("hubbard"), ["Hubbard Rob/Commando"], "not the tune title of another composer");
  assert.deepEqual(find("rob"), ["Gray Rob/Zoo", "Hubbard Rob/Commando"], "by composer, and not Probe");
  assert.deepEqual(find("rob hubbard"), ["Hubbard Rob/Commando"]);
  assert.deepEqual(find("HUBBARD_ROB"), ["Hubbard Rob/Commando"]);
  assert.deepEqual(find("hubb"), ["Hubbard Rob/Commando"], "the start of a name is enough");
  assert.deepEqual(find("vinci"), ["Da-Vinci Leo/Tune"]);
  assert.deepEqual(find("commando"), [], "titles do not count");
  assert.deepEqual(find("g"), [], "one character is too short");
  assert.equal(h.search(entries, "ro", 1, "composer").total, 2);
  assert.equal(h.search(entries, "ro", 1, "composer").items.length, 1);
  assert.deepEqual(Array.from(h.search(entries, "galway").items, (e) => e.t), ["Ode to Galway", "Wizball"], "All still searches the path");
});

test("the composer field is on the page, next to the search box", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
  assert.match(html, /<select id="websid-hvsc-field"[^>]*>.*value="all".*value="composer".*<\/select>\s*<input id="websid-hvsc-search"/);
});
