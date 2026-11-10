const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { compileText, vmaTest } = require("./helpers/vma-cli");
const { cpu } = require("./mini6502");

const samples = path.join(__dirname, "..", "samples");
const read = (f) => fs.readFileSync(path.join(samples, f), "utf8").replace(/\r\n/g, "\n");

for (const name of ["ultimate-turbo-demo", "ultimate-box-demo"]) {
  test(`${name}: the menu sample has the text of the .asm`, () => {
    const json = JSON.parse(read(`${name}.json`));
    assert.equal(json.useExpertTextProgram, true);
    assert.equal(json.expertText, read(`${name}.asm`));
  });
}

test("the sample is in the menu, its category and the translations", () => {
  const www = path.join(__dirname, "..", "www");
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(www, "app.js"), "utf8");
  const options = [...html.slice(html.indexOf('id="sample-select"')).split("</select>")[0].matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
  // applyTranslations names the options by position
  assert.equal(options.indexOf("ultimate-turbo-demo"), 37);
  assert.equal(options.indexOf("ultimate-box-demo"), 38);
  assert.match(app, /sampleOptions\[37\]\.textContent = t\("sampleUltimateTurboDemo"\)/);
  assert.match(app, /sampleOptions\[38\]\.textContent = t\("sampleUltimateBoxDemo"\)/);
  assert.match(app, /"reu-demo", "ultimate-turbo-demo", "ultimate-box-demo", "u64-palette-demo"]/);
  assert.match(app, /sampleSelect\.value === "ultimate-turbo-demo"/);
  assert.match(app, /sampleSelect\.value === "ultimate-box-demo"/);
});

// Builds the sample and runs it in the 6502 model until it waits; the model has no $D031.
for (const name of ["ultimate-turbo-demo", "ultimate-box-demo"]) vmaTest(`${name}: without the turbo registers it only shows the message and waits`, () => {
  const r = compileText(read(`${name}.asm`), { baseDir: path.join(__dirname, "..", "samples") });
  if (!r.ok) throw new Error(r.error);
  const bytes = Array.from(r.bytes);
  const ram = new Uint8Array(0x10000);
  ram.set(bytes.slice(2), bytes[0] | (bytes[1] << 8));
  for (let a = 0xE544; a < 0xE548; a++) ram[a] = 0x60;
  // an unused VIC register: reads $FF whatever is written to it
  const mem = new Proxy(ram, {
    get: (t, k) => (k === String(0xD031) ? 0xFF : t[k]),
    set: (t, k, v) => { if (k !== String(0xD031)) t[k] = v; return true; },
  });
  const c = cpu(mem);
  assert.throws(() => c.call(0x080D, 200000), /did not return/);
  const screen = String.fromCharCode(...ram.slice(0x0400 + 9 * 40 + 5, 0x0400 + 9 * 40 + 35).map((b) => (b >= 1 && b <= 26 ? b + 64 : b)));
  assert.equal(screen, "THIS DEMO NEEDS A C64 ULTIMATE");
  assert.equal(ram[0xD015], 0, "no sprites switched on");
});
