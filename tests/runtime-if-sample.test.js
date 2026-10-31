const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const samples = path.join(__dirname, "..", "samples");
const read = (f) => fs.readFileSync(path.join(samples, f), "utf8").replace(/\r\n/g, "\n");

test("the menu sample has the text of the .asm", () => {
  const json = JSON.parse(read("runtime-if-demo.json"));
  assert.equal(json.useExpertTextProgram, true);
  assert.equal(json.expertText, read("runtime-if-demo.asm"));
});

test("the sample is in the menu, its category and the translations", () => {
  const www = path.join(__dirname, "..", "www");
  const html = fs.readFileSync(path.join(www, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(www, "app.js"), "utf8");
  const options = [...html.slice(html.indexOf('id="sample-select"')).split("</select>")[0].matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
  // applyTranslations names the options by position
  assert.equal(options.indexOf("runtime-if-demo"), 36);
  assert.match(app, /sampleOptions\[36\]\.textContent = t\("sampleRuntimeIfDemo"\)/);
  assert.match(app, /"if-else", "runtime-if-demo"/);
  assert.match(app, /sampleSelect\.value === "runtime-if-demo"/);
});
