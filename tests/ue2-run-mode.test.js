const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const www = path.join(__dirname, "..", "www");
const read = (file) => fs.readFileSync(path.join(www, file), "utf8");
const app = read("app.js");
const html = read("index.html");
const bridge = read("tauri-bridge.js");
const i18n = read("i18n.js");

test("every ue2-* element the app uses is in the page", () => {
  const ids = new Set();
  for (const match of app.matchAll(/["'#`](ue2-[a-z0-9-]+|run-ue2-[a-z0-9-]+)["'`]/g)) ids.add(match[1]);
  ["ue2-choose-exe", "ue2-choose-firmware", "ue2-choose-roms"].forEach((id) => ids.add(id));
  ["ue2", "ue2-d64", "ue2-271"].forEach((value) => ids.delete(value));
  assert.ok(ids.size > 8);
  for (const id of ids) assert.ok(html.includes(`id="${id}"`), `index.html has no #${id}`);
});

test("both run modes are accepted wherever a saved mode is checked", () => {
  const lists = [...app.matchAll(/\[("prg", "d64",[^\]]*)\]/g)].map((match) => match[1]);
  assert.ok(lists.length >= 3);
  for (const list of lists) {
    assert.ok(list.includes('"ue2"') && list.includes('"ue2-d64"'), list);
  }
});

test("the bridge reaches the commands the backend registers", () => {
  const lib = fs.readFileSync(path.join(__dirname, "..", "src-tauri", "src", "lib.rs"), "utf8");
  for (const command of ["ue2_get_config", "ue2_set_web_port", "ue2_choose", "ue2_stop", "ue2_run_prg", "ue2_ensure", "ue2_set_monitor_target"]) {
    assert.ok(bridge.includes(`invoke("${command}"`), `bridge: ${command}`);
    assert.ok(lib.includes(`ue2emu::${command}`), `lib.rs: ${command}`);
  }
});

test("every ue2 text exists in all seven languages", () => {
  const keys = new Set();
  for (const match of app.matchAll(/\b(?:t|tf)\("((?:ue2|stepUe2|workProgress\w*Ue2|runOnUe2)\w*)"/g)) keys.add(match[1]);
  for (const match of app.matchAll(/:\s*"(ue2[A-Z]\w*)"/g)) keys.add(match[1]);
  keys.add("runOnUe2D64");
  assert.ok(keys.size >= 18, [...keys].join(", "));
  for (const key of keys) {
    const count = i18n.split(`"${key}":`).length - 1;
    assert.strictEqual(count, 7, `${key}: ${count} languages`);
  }
});
