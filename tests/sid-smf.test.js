// SID editor: Standard MIDI File (.mid) export and import (parser, writer, quantize, round trip).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SOURCE = "app.js";
const source = fs.readFileSync(path.join(__dirname, "..", "www", SOURCE), "utf8");

function fn(name) {
  const start = source.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.notEqual(start, -1, name);
  let depth = 0;
  for (let i = source.indexOf(") {", start) + 2; ; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
}

const NAMES = ["_sidSmfError", "_sidSmfVlq", "_sidSmfMeta", "_sidSmfText", "_sidSmfDecode", "_sidSmfWrite",
  "_sidSmfParseTrack", "_sidSmfParse", "_sidSmfParts", "_sidSmfTempos", "_sidSmfRowSpeed", "_sidSmfQuantize",
  "_sidSmfToSid", "_sidSmfPartName", "_sidSmfPartLabel", "_sidSmfDefaultParts", "_sidSmfTrackInst",
  "_sidSmfBuildTune", "_sidSmfVoiceEvents", "_sidSmfFromTune", "_sidNewInst"];

function setup() {
  const ctx = {
    TextEncoder, TextDecoder, Uint8Array,
    t: k => k,
    tf: (k, v) => k + JSON.stringify(v),
  };
  vm.createContext(ctx);
  vm.runInContext(`
    const _SID_ROWS = 32, _SID_ROWS_PER_BEAT = 4, _SID_SMF_VEL = 100;
    ${NAMES.map(fn).join("\n")}
    this.api = { ${NAMES.join(", ")} };
  `, ctx);
  return ctx.api;
}

const plain = x => JSON.parse(JSON.stringify(x));
const empty = () => ({ note: null, inst: 0, fx: null, fxval: 0 });
function pattern(voices, cells) {
  const p = [];
  for (let v = 0; v < voices; v++) { const col = []; for (let r = 0; r < 32; r++) col.push(empty()); p.push(col); }
  cells.forEach(([v, r, cell]) => { p[v][r] = Object.assign(empty(), cell); });
  return p;
}
// note / note-off per voice and row of the song, as the tracker plays it
function flatRows(patterns, song) {
  const out = [];
  let base = 0;
  song.forEach(idx => {
    const pat = patterns[idx];
    for (let r = 0; r < 32; r++) pat.forEach((col, v) => {
      const c = col[r];
      if (c.note != null) out.push(`${v}:${base + r}:n${c.note}`);
      else if (c.fx === "C") out.push(`${v}:${base + r}:off`);
    });
    base += 32;
  });
  return out;
}

test("VLQ: 7-bit groups, high bit on all but the last byte", () => {
  const api = setup();
  assert.deepEqual(plain(api._sidSmfVlq(0)), [0]);
  assert.deepEqual(plain(api._sidSmfVlq(127)), [0x7F]);
  assert.deepEqual(plain(api._sidSmfVlq(128)), [0x81, 0x00]);
  assert.deepEqual(plain(api._sidSmfVlq(0x3FFF)), [0xFF, 0x7F]);
  assert.deepEqual(plain(api._sidSmfVlq(0x0FFFFFFF)), [0xFF, 0xFF, 0xFF, 0x7F]);
});

test("Parser: running status, tempo change, time signature, track name, SysEx skipped", () => {
  const api = setup();
  const trk = [
    0x00, 0xFF, 0x03, 0x04, 0x4C, 0x65, 0x61, 0x64,          // track name "Lead"
    0x00, 0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20,                // tempo 500000
    0x00, 0xFF, 0x58, 0x04, 0x03, 0x02, 0x18, 0x08,          // 3/4
    0x00, 0x90, 0x3C, 0x64,                                  // note on 60
    0x00, 0x40, 0x50,                                        // running status: note on 64
    0x60, 0x3C, 0x00,                                        // running status, vel 0: note off 60 at 96
    0x00, 0xF0, 0x05, 0x7E, 0x7F, 0x09, 0x01, 0xF7,          // SysEx (cancels running status)
    0x00, 0x80, 0x40, 0x40,                                  // note off 64 at 96
    0x81, 0x40, 0xFF, 0x51, 0x03, 0x03, 0xD0, 0x90,          // tempo 250000 at 96 + 192
    0x00, 0xC1, 0x05,                                        // program change ch 2
    0x00, 0x91, 0x43, 0x50,                                  // note on 67 ch 2 at 288
    0x83, 0x00, 0x43, 0x00,                                  // running status note off at 288 + 384
    0x00, 0xFF, 0x2F, 0x00,
  ];
  const bytes = [0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0, 96,
    0x4D, 0x54, 0x72, 0x6B, 0, 0, 0, trk.length, ...trk];
  const smf = api._sidSmfParse(Uint8Array.from(bytes));
  assert.equal(smf.format, 0);
  assert.equal(smf.division, 96);
  assert.equal(smf.tracks.length, 1);
  assert.equal(smf.tracks[0].name, "Lead");
  const ev = plain(smf.tracks[0].events);
  assert.deepEqual(ev.filter(e => e.kind === "tempo"), [{ t: 0, kind: "tempo", us: 500000 }, { t: 288, kind: "tempo", us: 250000 }]);
  assert.deepEqual(ev.find(e => e.kind === "timesig"), { t: 0, kind: "timesig", num: 3, den: 4 });
  assert.deepEqual(ev.filter(e => e.kind === "on" || e.kind === "off").map(e => [e.t, e.kind, e.ch, e.note]),
    [[0, "on", 0, 60], [0, "on", 0, 64], [96, "off", 0, 60], [96, "off", 0, 64], [288, "on", 1, 67], [672, "off", 1, 67]]);
  assert.deepEqual(ev.find(e => e.kind === "prog"), { t: 288, kind: "prog", ch: 1, prog: 5 });
  const parts = plain(api._sidSmfParts(smf));
  assert.equal(parts.length, 2);
  assert.deepEqual(parts[0].notes.map(n => [n.t, n.end, n.note]), [[0, 96, 60], [0, 96, 64]]);
  assert.deepEqual(parts[1].notes.map(n => [n.t, n.end, n.note]), [[288, 672, 67]]);
  assert.deepEqual(plain(api._sidSmfTempos(smf)), [{ t: 0, us: 500000 }, { t: 288, us: 250000 }]);
});

test("Parser: clear errors for SMPTE division, other files, format 2 and truncated data", () => {
  const api = setup();
  const head = (format, division) => [0x4D, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, format, 0, 1, division >> 8, division & 255];
  const code = bytes => { try { api._sidSmfParse(Uint8Array.from(bytes)); return "ok"; } catch (e) { return e.i18nKey; } };
  assert.equal(code([...head(1, 0xE728), 0x4D, 0x54, 0x72, 0x6B, 0, 0, 0, 4, 0, 0xFF, 0x2F, 0]), "sidSmfErrSmpte");
  assert.equal(code([0x50, 0x53, 0x49, 0x44, 0, 2, 0, 0x7C, 0, 0, 0, 0, 0, 0]), "sidSmfErrNotMidi");
  assert.equal(code(head(2, 96)), "sidSmfErrFormat");
  assert.equal(code([...head(0, 96), 0x4D, 0x54, 0x72, 0x6B, 0, 0, 0, 40, 0, 0x90]), "sidSmfErrTruncated");
  assert.equal(code([...head(0, 96), 0x4D, 0x54, 0x72, 0x6B, 0, 0, 0, 3, 0, 0x3C, 0x40]), "sidSmfErrTruncated");
  assert.equal(code([...head(0, 96), 0x4D, 0x54, 0x72, 0x6B, 0, 0, 0, 4, 0, 0xFF, 0x2F, 0]), "ok");
});

test("Quantize: ticks to the nearest row, a note lasts at least one row", () => {
  const api = setup();
  // 96 ticks per quarter, 4 rows per beat: 24 ticks per row
  assert.deepEqual(plain(api._sidSmfQuantize([{ t: 23, end: 50, note: 60, vel: 90 }, { t: 0, end: 5, note: 62, vel: 90 },
    { t: 36, end: 120, note: 64, vel: 90 }], 24)).map(n => [n.s, n.e]), [[1, 2], [0, 1], [2, 5]]);
  assert.equal(api._sidSmfToSid(60), 48);
  assert.equal(api._sidSmfToSid(5), 5);       // below SID note 0: an octave up
  assert.equal(api._sidSmfToSid(127), 91);   // above SID note 95: octaves down
  // 120 BPM, 4 rows per beat, PAL: 0.125 s per row = 6.25 frames
  assert.equal(api._sidSmfRowSpeed([{ t: 0, us: 500000 }], 0, 4, 50), 6);
  assert.equal(api._sidSmfRowSpeed([{ t: 0, us: 500000 }, { t: 96, us: 1000000 }], 100, 4, 50), 13);
});

function smfOf(api, tracks, division = 96) {
  // tracks: [[name, ch, [[t, end, note]...]]] → parsed SMF via the writer
  const out = tracks.map(([name, ch, notes]) => {
    const tr = [{ t: 0, d: api._sidSmfMeta(3, api._sidSmfText(name)) }];
    notes.forEach(([t, end, note]) => { tr.push({ t, d: [0x90 | ch, note, 100] }); tr.push({ t: end, d: [0x80 | ch, note, 0] }); });
    return tr;
  });
  return api._sidSmfParse(api._sidSmfWrite({ format: 1, division, tracks: out }));
}

test("Import: highest note of a chord, a higher note cuts a held one, note-offs, drums skipped by default", () => {
  const api = setup();
  const smf = smfOf(api, [
    ["Piano", 0, [[0, 48, 60], [0, 48, 64], [96, 192, 67], [120, 192, 72], [144, 168, 55]]],
    ["Drums", 9, [[0, 24, 36]]],
    ["Bass", 1, [[0, 96, 36]]],
  ]);
  const parts = api._sidSmfParts(smf);
  assert.deepEqual(plain(parts.map(p => [p.name, p.ch, p.drum])), [["Piano", 0, false], ["Drums", 9, true], ["Bass", 1, false]]);
  assert.deepEqual(plain(api._sidSmfDefaultParts(parts, 3)), [0, 2]);
  const picked = [parts[0], parts[2]];
  const res = api._sidSmfBuildTune(smf, picked, { voices: 3, rowsPerBeat: 4, fps: 50, perTrack: true });
  assert.equal(res.speed, 6);
  assert.equal(res.insts.length, 2);
  assert.equal(res.insts[0].name, "Piano");
  const rows = flatRows(res.patterns, res.song);
  // chord at 0: 64 (SID 52) wins over 60; 72 cuts 67 at row 5; 55 (lower, under the held 72) is dropped
  assert.deepEqual(rows.filter(x => x.startsWith("0:")), ["0:0:n52", "0:2:off", "0:4:n55", "0:5:n60", "0:8:off"]);
  assert.deepEqual(rows.filter(x => x.startsWith("1:")), ["1:0:n24", "1:4:off"]);
  assert.equal(res.dropped, 2);
  assert.equal(res.patterns[0][0][4].inst, 0);
  assert.equal(res.patterns[0][1][0].inst, 1);
  // spread: the dropped notes go to the voice no part uses
  const spread = api._sidSmfBuildTune(smf, picked, { voices: 3, rowsPerBeat: 4, fps: 50, perTrack: false, inst: 2, insts: ["keep"], spread: true });
  assert.deepEqual(plain(spread.insts), ["keep"]);
  assert.equal(spread.dropped, 0);
  assert.deepEqual(flatRows(spread.patterns, spread.song).filter(x => x.startsWith("2:")), ["2:0:n48", "2:2:off", "2:6:n43", "2:7:off"]);
  assert.equal(spread.patterns[0][2][0].inst, 2);
});

test("Import: a tempo change becomes an F effect one row ahead", () => {
  const api = setup();
  const tracks = [[{ t: 0, d: api._sidSmfMeta(0x51, [0x07, 0xA1, 0x20]) }, { t: 192, d: api._sidSmfMeta(0x51, [0x0F, 0x42, 0x40]) }],
    [{ t: 0, d: [0x90, 60, 100] }, { t: 400, d: [0x80, 60, 0] }]];
  const smf = api._sidSmfParse(api._sidSmfWrite({ format: 1, division: 96, tracks }));
  const res = api._sidSmfBuildTune(smf, api._sidSmfParts(smf), { voices: 3, rowsPerBeat: 4, fps: 50, perTrack: true });
  assert.equal(res.speed, 6);
  // tick 192 = row 8: the F effect is on row 7, 1 s per beat = 12.5 → 13 frames per row
  const fx = [];
  res.patterns[res.song[0]].forEach((col, v) => col.forEach((c, r) => { if (c.fx === "F") fx.push([v, r, c.fxval]); }));
  assert.deepEqual(fx, [[0, 7, 13]]);
});

test("Export: one track per voice, MIDI note = SID note + 12, tempo from speed and PAL/NTSC, gate timer", () => {
  const api = setup();
  const insts = [{ name: "Lead", gateTimer: 0 }, { name: "Bass", gateTimer: 2 }];
  const pat = pattern(3, [[0, 0, { note: 48, inst: 0 }], [0, 2, { fx: "C" }], [0, 4, { note: 50, inst: 1 }],
    [1, 0, { note: 24, inst: 1 }], [1, 1, { note: 26, inst: 1 }]]);
  const smfOut = api._sidSmfFromTune({ patterns: [pat], song: [0], speed: 6, insts, fps: 50, title: "Song" });
  assert.equal(smfOut.notes, 4);
  const smf = api._sidSmfParse(api._sidSmfWrite(smfOut));
  assert.equal(smf.format, 1);
  assert.equal(smf.tracks.length, 4);
  assert.equal(smf.division, 24);
  assert.equal(smf.tracks[0].name, "Song");
  assert.deepEqual(plain(api._sidSmfTempos(smf)), [{ t: 0, us: 480000 }]);  // 24 frames per beat at 50 Hz
  assert.deepEqual(plain(smf.tracks.slice(1).map(tr => tr.name)), ["Lead", "Bass", 'sidSmfVoiceName{"n":3}']);
  const v0 = smf.tracks[1].events.filter(e => e.kind !== "timesig").map(e => [e.t, e.kind, e.note ?? e.prog]);
  assert.deepEqual(plain(v0), [[0, "prog", 0], [0, "on", 60], [12, "off", 60], [24, "prog", 1], [24, "on", 62], [192, "off", 62]]);
  // gate timer 2: the gate drops 2 frames before the next note
  const v1 = smf.tracks[2].events.map(e => [e.t, e.kind, e.ch, e.note ?? e.prog]);
  assert.deepEqual(plain(v1), [[0, "prog", 1, 1], [0, "on", 1, 36], [4, "off", 1, 36], [6, "on", 1, 38], [192, "off", 1, 38]]);
  const ntsc = api._sidSmfParse(api._sidSmfWrite(api._sidSmfFromTune({ patterns: [pat], song: [0], speed: 6, insts, fps: 60 })));
  assert.deepEqual(plain(api._sidSmfTempos(ntsc)), [{ t: 0, us: 400000 }]);
  // an empty song has nothing to export
  assert.equal(api._sidSmfFromTune({ patterns: [pattern(3, [])], song: [0], speed: 6, insts, fps: 50 }).notes, 0);
});

test("Round trip: export then import gives the same notes and note-offs", () => {
  const api = setup();
  const insts = [{ name: "A" }, { name: "B" }, { name: "C" }];
  for (const voices of [3, 6]) {
    const cells0 = [], cells1 = [];
    for (let v = 0; v < voices; v++) {
      cells0.push([v, 0, { note: 30 + v, inst: 0 }], [v, 3, { note: 40 + v, inst: 0 }], [v, 6, { fx: "C" }], [v, 9, { note: 95 - v, inst: 0 }], [v, 31, { note: v, inst: 0 }]);
      cells1.push([v, 2, { note: 60 + v, inst: 0 }], [v, 10, { fx: "C" }], [v, 16, { note: 12 + v, inst: 0 }], [v, 20, { fx: "C" }]);
    }
    const patterns = [pattern(voices, cells0), pattern(voices, cells1)];
    const song = [0, 1, 0, 1];
    const bytes = api._sidSmfWrite(api._sidSmfFromTune({ patterns, song, speed: 5, insts, fps: 50 }));
    const smf = api._sidSmfParse(bytes);
    const parts = api._sidSmfParts(smf);
    assert.equal(parts.length, voices);
    const res = api._sidSmfBuildTune(smf, parts, { voices, rowsPerBeat: 4, fps: 50, perTrack: false, inst: 0, insts });
    assert.equal(res.speed, 5);
    assert.equal(res.dropped, 0);
    assert.deepEqual(plain(res.song), [0, 1, 0, 1]);
    assert.deepEqual(flatRows(res.patterns, res.song), flatRows(patterns, song));
  }
});

test("i18n: every MIDI file string exists in all 7 languages", () => {
  const i18n = fs.readFileSync(path.join(__dirname, "..", "www", "i18n.js"), "utf8");
  const tr = vm.runInNewContext(i18n + "; translations;");
  const keys = new Set(["sidImportMidi", "sidExportMidi"]);
  for (const m of source.matchAll(/\bt?f?\("(sidSmf\w+)"/g)) keys.add(m[1]);
  for (const m of source.matchAll(/i18nKey\) \|\| "(sidSmf\w+)"|_sidSmfError\("(sidSmf\w+)"\)/g)) keys.add(m[1] || m[2]);
  assert.ok(keys.size >= 25, `found ${keys.size} keys`);
  for (const lang of ["hu", "en", "es", "de", "nl", "pl", "it"]) {
    for (const key of keys) assert.ok(typeof tr[lang][key] === "string" && tr[lang][key].trim(), `${lang}.${key}`);
  }
  for (const key of ["sidSmfParts", "sidSmfTrack", "sidSmfChannel", "sidSmfNotes", "sidSmfVoiceName", "sidSmfDropped"]) {
    for (const lang of Object.keys(tr)) assert.ok(tr[lang][key].includes("{n}"), `${lang}.${key} {n}`);
  }
  const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");
  for (const id of ["sid-import-midi", "sid-export-midi", "sid-mid-file", "sid-import-midi-dialog", "sid-import-midi-parts",
    "sid-import-midi-rpb", "sid-import-midi-chips", "sid-import-midi-inst", "sid-import-midi-spread", "sid-import-midi-go"]) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
});
