// .u64_palette "file" / .u64_palette_color idx, $RRGGBB / .u64_palette_reset: the Ultimate
// Command Interface routine, run on mini6502 against a model of the interface ($DF1C-$DF1F).
const test = require("node:test");
const assert = require("node:assert/strict");
const loadApp = require("./helpers/load-app");
const { compileText, loadPrg, labelOf, vmaTest } = require("./helpers/vma-cli");
const { cpu } = require("./mini6502");

const app = loadApp();
const plain = (v) => JSON.parse(JSON.stringify(v));

const VPL = "# VICE Palette file\n#\n" + Array.from({ length: 16 }, (_, i) =>
  [i * 16, 255 - i, i * 3].map((v) => v.toString(16).toUpperCase().padStart(2, "0")).join(" ") + " 4").join("\n") + "\n";
const vplBytes = [...VPL].map((ch) => ch.charCodeAt(0));

// Compiles the source with the VMA CLI (the file it names has `fileBytes`) into a 64K memory image;
// errors: the compiler's message keys.
function build(src, fileBytes, { basicStub = false, files = null } = {}) {
  const m = /"([^"]+)"/.exec(src);
  const all = { ...(files || {}), ...(m && fileBytes ? { [m[1]]: Uint8Array.from(fileBytes) } : {}) };
  const r = compileText(src, { basicStub, files: all });
  if (!r.ok) return { mem: [], errors: (r.errors || []).map(e => e.key || e.message), start: null };
  const { mem, load } = loadPrg(r.bytes);
  return { mem: Array.from(mem), errors: [], start: r.sysAddress ?? load, r };
}

// The interface: $DF1D reads $C9 (identification) and takes command bytes; $DF1C bit 0 pushes
// the command (busy for a few reads, then "last data"), bit 1 accepts the answer (back to idle).
function uci(mem, { present = true, startState = 0x00, busyReads = 3 } = {}) {
  const u = { commands: [], fifo: [], state: startState, busy: 0, acks: 0 };
  return {
    u,
    mem: new Proxy(mem, {
      get(target, key) {
        const ad = Number(key);
        if (!present || !(ad >= 0xDF1C && ad <= 0xDF1F)) return target[key];
        if (ad === 0xDF1D) return 0xC9;
        if (ad === 0xDF1C) {
          if (u.state === 0x10 && --u.busy <= 0) u.state = 0x20;
          return u.state;
        }
        return 0;
      },
      set(target, key, value) {
        const ad = Number(key);
        if (!present || !(ad >= 0xDF1C && ad <= 0xDF1F)) { target[key] = value; return true; }
        if (ad === 0xDF1D) {
          assert.equal(u.state, 0x00, "command bytes only go to an idle interface");
          u.fifo.push(value);
        } else if (ad === 0xDF1C) {
          if (value & 0x01) { u.commands.push(u.fifo); u.fifo = []; u.state = 0x10; u.busy = busyReads; }
          if (value & 0x02) { assert.ok(u.state & 0x20, "accepts only pending data"); u.state = 0x00; u.acks++; }
        }
        return true;
      },
    }),
  };
}

function run(mem, opts) {
  const { u, mem: bus } = uci(mem, opts);
  const c = cpu(bus);
  c.call(0x1000, 20000);
  return u;
}

test("the three macros parse, keep their Expert line and have a fixed size", () => {
  const src = '.u64_palette "colodore.vpl"\n.u64_palette_color 6, $3050C0\n.u64_palette_reset\n';
  const blocks = app.run(`parseExpertText(${JSON.stringify(src)}).filter(b => !b.isBlankLine).map(b => ({ m: b.mnemonic, line: _blockToExpertLine(b) }))`);
  assert.deepEqual(plain(blocks), [
    { m: "U64_PALETTE", line: '.u64_palette "colodore.vpl"' },
    { m: "U64_PALETTE_COLOR", line: ".u64_palette_color 6, $3050C0" },
    { m: "U64_PALETTE_RESET", line: ".u64_palette_reset" },
  ]);
  assert.equal(app.run(`parseExpertText(".u64_palette")[0].validationError`), app.run(`t("u64PaletteNeedsFile")`));
  assert.equal(app.run(`parseExpertText(".u64_palette_color 6")[0].validationError`), app.run(`t("u64PaletteColorSyntax")`));
});

vmaTest("the three macros have a fixed size", () => {
  const { r } = build('* = $1000\n.u64_palette "colodore.vpl"\na:\n.u64_palette_color 6, $3050C0\nb:\n.u64_palette_reset\nc:\n', vplBytes);
  assert.deepEqual([labelOf(r, "a") - 0x1000, labelOf(r, "b") - labelOf(r, "a"), labelOf(r, "c") - labelOf(r, "b")], [109, 65, 61]);
});

vmaTest(".u64_palette sends all 16 colours of a VICE palette", () => {
  const { mem, errors } = build("* = $1000\n.u64_palette \"p.vpl\"\n rts\n", vplBytes);
  assert.deepEqual(errors, []);
  const u = run(mem);
  const rgb = [];
  for (let i = 0; i < 16; i++) rgb.push(i * 16, 255 - i, i * 3);
  assert.deepEqual(u.commands, [[0x04, 0x52, ...rgb]]);
  assert.equal(u.acks, 1);
  assert.equal(u.state, 0x00);
});

vmaTest(".u64_palette_color takes expressions, .u64_palette_reset has no parameters", () => {
  const { mem, errors } = build("BLUE = 6\n* = $1000\n.u64_palette_color BLUE, $3050C0\n.u64_palette_reset\n rts\n");
  assert.deepEqual(errors, []);
  assert.deepEqual(run(mem).commands, [[0x04, 0x53, 6, 0x30, 0x50, 0xC0], [0x04, 0x54]]);
});

vmaTest("data left over from an earlier command is accepted first", () => {
  const { mem } = build("* = $1000\n.u64_palette_reset\n rts\n");
  const u = run(mem, { startState: 0x20 });
  assert.deepEqual(u.commands, [[0x04, 0x54]]);
  assert.equal(u.acks, 2);
});

vmaTest("without a Command Interface the routine does nothing", () => {
  const { mem } = build("* = $1000\n.u64_palette_reset\n rts\n");
  const before = mem.slice(0xDF00, 0xDF20);
  run(mem, { present: false });
  assert.deepEqual(mem.slice(0xDF00, 0xDF20), before);
});

vmaTest("bad parameters and files are errors", () => {
  assert.deepEqual(build("* = $1000\n.u64_palette_color 16, $FFFFFF\n").errors, ["u64PaletteColorRange"]);
  assert.deepEqual(build("* = $1000\n.u64_palette_color 1, $1000000\n").errors, ["u64PaletteColorRange"]);
  assert.deepEqual(build('* = $1000\n.u64_palette "x.vpl"\n', [0x41, 0x42]).errors, ["u64PaletteBadFile"]);
  // a Photoshop .act is read too
  const act = new Array(772).fill(0);
  act[0] = 0x11; act[1] = 0x22; act[2] = 0x33;
  const { mem, errors } = build('* = $1000\n.u64_palette "x.act"\n rts\n', act);
  assert.deepEqual(errors, []);
  assert.deepEqual(run(mem).commands[0].slice(0, 5), [0x04, 0x52, 0x11, 0x22, 0x33]);
});

vmaTest("the sample: keys 1, 2, 3, 0 send the two files, two colours and the reset", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const dir = path.join(__dirname, "..", "samples");
  const src = fs.readFileSync(path.join(dir, "u64-palette-demo.asm"), "utf8");
  const files = ["u64-palette-sunset.vpl", "u64-palette-green.vpl"].map((f) => [...fs.readFileSync(path.join(dir, f))]);
  const r = build(src, null, { basicStub: true, files: { "u64-palette-sunset.vpl": Uint8Array.from(files[0]), "u64-palette-green.vpl": Uint8Array.from(files[1]) } });
  assert.deepEqual(r.errors, []);
  const mem = r.mem;
  mem[0xE544] = 0x60;                                   // clear screen: RTS
  mem[0xFFE4] = 0xAD; mem[0xFFE5] = 0xF0; mem[0xFFE6] = 0xCF; mem[0xFFE7] = 0x60; // GETIN: LDA $CFF0 / RTS
  const keys = [0x31, 0x32, 0x33, 0x30];
  const { u, mem: bus } = uci(mem);
  const host = new Proxy(bus, {
    get(target, key) {
      if (Number(key) === 0xCFF0) {
        if (!keys.length) throw new Error("done");
        return keys.shift();
      }
      return target[key];
    },
  });
  const c = cpu(host);
  c.pc = r.start;
  assert.throws(() => { for (let i = 0; i < 200000; i++) c.step(); }, /done/);
  const vpl = (i) => [...files[i]].map((b) => String.fromCharCode(b)).join("");
  const rgb = (text) => app.run(`_palParseText(${JSON.stringify(text)})`).flatMap((v) => [v >> 16, (v >> 8) & 255, v & 255]);
  assert.deepEqual(u.commands, [
    [0x04, 0x52, ...rgb(vpl(0))], [0x04, 0x52, ...rgb(vpl(1))],
    [0x04, 0x53, 6, 0x50, 0x00, 0xA0], [0x04, 0x53, 14, 0xFF, 0x70, 0xC0], [0x04, 0x54],
  ]);
  // the bars: colour RAM of row 9 from column 4, two columns per colour
  for (let x = 0; x < 32; x++) assert.equal(mem[0xD800 + 9 * 40 + 4 + x], x >> 1);
  assert.equal(mem[0x0400 + 20 * 40 + 4], 0xA0);
});

test("the sample is in the menu with the text of the .asm", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const read = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8").replace(/\r\n/g, "\n");
  assert.equal(JSON.parse(read("samples/u64-palette-demo.vas")).expertText, read("samples/u64-palette-demo.asm"));
  const html = read("www/index.html");
  const src = read("www/app.js");
  const options = [...html.slice(html.indexOf('id="sample-select"')).split("</select>")[0].matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(options.indexOf("u64-palette-demo"), 39);
  assert.match(src, /sampleOptions\[39\]\.textContent = t\("sampleU64PaletteDemo"\)/);
  assert.match(src, /sampleSelect\.value === "u64-palette-demo"/);
  assert.equal(read("www/i18n.js").split('"sampleU64PaletteDemo":').length - 1, 7);
});
