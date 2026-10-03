const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function loadNc() {
  const start = appJs.indexOf("function _ncParse(");
  const end = appJs.indexOf("function _ncSave(");
  assert.ok(start > 0 && end > start, "number converter helpers not found");
  const context = {};
  vm.createContext(context);
  vm.runInContext(appJs.slice(start, end) + "\nthis.nc = { parse: _ncParse, format: _ncFormat, signed: _ncSigned };", context);
  return context.nc;
}

test("parses decimal, hex and binary with the usual prefixes", () => {
  const nc = loadNc();
  const value = (kind, text, bits = 8) => nc.parse(kind, text, bits).value;
  assert.equal(value("dec", "31"), 31);
  assert.equal(value("dec", "65535", 16), 65535);
  assert.equal(value("hex", "$1F"), 31);
  assert.equal(value("hex", "0x1f"), 31);
  assert.equal(value("hex", "d020"), 0xD020);
  assert.equal(value("bin", "%0001 1111"), 31);
  assert.equal(value("bin", "0b1010_1010"), 0xAA);
  assert.equal(value("bin", "1111111111111111"), 0xFFFF);
});

test("negative decimals become two's complement in the current width", () => {
  const nc = loadNc();
  assert.equal(nc.parse("dec", "-1", 8).value, 0xFF);
  assert.equal(nc.parse("dec", "-1", 16).value, 0xFFFF);
  assert.equal(nc.parse("dec", "-128", 8).value, 0x80);
  assert.equal(nc.parse("dec", "-129", 8).value, 0xFF7F);   // does not fit 8 bits
  assert.equal(nc.parse("dec", "-32768", 16).value, 0x8000);
});

test("rejects invalid or too large input, reports empty", () => {
  const nc = loadNc();
  assert.equal(nc.parse("dec", "12a", 8).error, true);
  assert.equal(nc.parse("hex", "$G1", 8).error, true);
  assert.equal(nc.parse("bin", "102", 8).error, true);
  assert.equal(nc.parse("dec", "65536", 16).error, true);
  assert.equal(nc.parse("hex", "$10000", 16).error, true);
  assert.equal(nc.parse("dec", "-32769", 16).error, true);
  assert.equal(nc.parse("hex", "  ", 8).empty, true);
});

test("formats for the fields and for copying", () => {
  const nc = loadNc();
  assert.equal(nc.format("dec", 31, 8, true), "31");
  assert.equal(nc.format("hex", 31, 8, false), "1F");
  assert.equal(nc.format("hex", 31, 8, true), "$1F");
  assert.equal(nc.format("hex", 31, 16, true), "$001F");
  assert.equal(nc.format("bin", 31, 8, false), "0001 1111");
  assert.equal(nc.format("bin", 31, 8, true), "%00011111");
  assert.equal(nc.format("bin", 0xD020, 16, false), "1101 0000 0010 0000");
  assert.equal(nc.signed(0xFF, 8), -1);
  assert.equal(nc.signed(0x7F, 8), 127);
  assert.equal(nc.signed(0x8000, 16), -32768);
});
