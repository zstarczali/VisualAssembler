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
  ["ue2", "ue2-d64", "ue2-271", "ue2-vice-271"].forEach((value) => ids.delete(value));
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
  for (const command of ["ue2_get_config", "ue2_set_web_port", "ue2_choose", "ue2_stop", "ue2_run_prg", "ue2_ensure", "ue2_set_monitor_target", "ue2_dbg_start"]) {
    assert.ok(bridge.includes(`invoke("${command}"`), `bridge: ${command}`);
    assert.ok(lib.includes(`ue2emu::${command}`), `lib.rs: ${command}`);
  }
  for (const command of ["dbg_poll", "dbg_snapshot", "dbg_continue", "dbg_step", "dbg_break", "dbg_set_register", "dbg_end"]) {
    assert.ok(bridge.includes(`invoke("${command}"`), `bridge: ${command}`);
    assert.ok(lib.includes(`debugger::${command}`), `lib.rs: ${command}`);
  }
  assert.ok(bridge.includes('invoke("vice_dbg_start"') && /^\s*vice_dbg_start,\s*$/m.test(lib), "vice_dbg_start");
  assert.ok(!/ue2Dbg(Poll|Snapshot|Continue|Step|Break|SetRegister|End)\b/.test(fs.readFileSync(path.join(www, "app.js"), "utf8")), "no old command names");
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

test("the Debug button picks its debugger from the setting and the run mode", async () => {
  const loadApp = require("./helpers/load-app");
  const app = loadApp();
  app.run(`
    globalThis.__called = [];
    _udDebug = async (target) => { __called.push("va:" + target); };
    _w64Debug = async () => { __called.push("builtin"); };
    _ubRunDebugger = async () => { __called.push("retro-ub"); };
    isProgramEmpty = () => true;
  `);
  const pick = async (mode, choice, retroPath) => {
    app.run(`__called.length = 0; runMode = ${JSON.stringify(mode)}; debuggerPath = ${JSON.stringify(retroPath)};`);
    if (choice) app.localStorage.setItem("c64va-debugger", choice); else app.localStorage.removeItem("c64va-debugger");
    await app.run("runInDebugger()");
    return app.run("__called.join(',') || 'retro'");
  };
  // Visual Assembler: on the machine of the run mode
  assert.equal(await pick("prg", "va", "rd.exe"), "va:vice");
  assert.equal(await pick("d64", "va", ""), "va:vice");
  assert.equal(await pick("ue2", "va", ""), "va:ue2");
  assert.equal(await pick("web64", "va", ""), "builtin");
  assert.equal(await pick("ultimate", "va", "rd.exe"), "builtin");
  // RetroDebugger for VICE and the hardware; the built-in C64 and the emulator keep their own
  assert.equal(await pick("prg", "retro", "rd.exe"), "retro");
  assert.equal(await pick("ue2-d64", "retro", "rd.exe"), "va:ue2");
  assert.equal(await pick("web64", "retro", "rd.exe"), "builtin");
  // no RetroDebugger set: a stored choice of it counts as Visual Assembler
  assert.equal(await pick("prg", "retro", ""), "va:vice");
  assert.equal(await pick("ultimate", "retro", ""), "builtin");
  // unset: RetroDebugger when configured, as before; the old VICE choice means Visual Assembler
  assert.equal(await pick("prg", null, "rd.exe"), "retro");
  assert.equal(await pick("prg", null, ""), "va:vice");
  app.localStorage.setItem("c64va-debug-target", "vice");
  assert.equal(await pick("prg", null, "rd.exe"), "va:vice");
});

test("the Run menu lists only the modes whose tool is set, and a saved mode comes back with its tool", () => {
  const loadApp = require("./helpers/load-app");
  const app = loadApp();
  const state = (vice, host, port, ue2) => app.run(`
    updateVicePathPreview(${JSON.stringify(vice)});
    ultimateHost = ${JSON.stringify(host)}; kff2Port = ${JSON.stringify(port)};
    _ue2ApplyConfig(${JSON.stringify(ue2 ? { exe: "u.exe", firmware: "f.ue2", roms: "r" } : { exe: "u.exe", firmware: "", roms: "" })});
    runMode + "|" + Object.entries(_RUN_MODE_ITEMS).filter(([, id]) => !document.getElementById(id).hidden).map(([mode]) => mode).join(",");
  `);
  assert.equal(state("", "", "", false), "web64|web64", "nothing set: only the built-in C64");
  assert.equal(state("x64sc.exe", "", "", false), "prg|prg,d64,web64");
  assert.equal(state("", "192.168.1.64", "", false), "web64|ultimate,ultimate-d64,web64");
  assert.equal(state("", "", "COM5", false), "web64|kff2,web64");
  assert.equal(state("", "", "", true), "web64|ue2,ue2-d64,web64");

  app.run(`setRunMode("ue2")`);
  assert.equal(app.localStorage.getItem("runMode"), "ue2");
  assert.equal(state("x64sc.exe", "", "", false), "prg|prg,d64,web64", "falls back to VICE");
  assert.equal(state("", "", "", false), "web64|web64", "falls back to the built-in C64");
  assert.equal(app.localStorage.getItem("runMode"), "ue2", "the fallback is not saved");
  assert.equal(state("", "", "", true), "ue2|ue2,ue2-d64,web64", "the choice comes back");
  assert.equal(app.run("_runModeWanted"), "ue2");
});

test("the Run menu follows the VICE path loaded from the config at startup", async () => {
  const loadApp = require("./helpers/load-app");
  const app = loadApp();
  app.run(`window.electronAPI = { getViceConfig: async () => ({ vicePath: "C:/vice/x64sc.exe" }) };`);
  assert.equal(app.run(`document.getElementById("run-prg-mode").hidden = true; vicePath`), "");
  await app.run("loadViceConfig()");
  assert.equal(app.run(`document.getElementById("run-prg-mode").hidden`), false);
  assert.equal(app.run(`document.getElementById("run-d64-mode").hidden`), false);
  assert.equal(app.run("runMode"), "prg");
});

test("the Debugger setting shows what the Debug button does once the RetroDebugger path is known", () => {
  const loadApp = require("./helpers/load-app");
  const app = loadApp();
  const shown = (path, stored) => {
    if (stored) app.localStorage.setItem("c64va-debugger", stored); else app.localStorage.removeItem("c64va-debugger");
    app.__path = path;
    return app.run(`updateDebuggerPathPreview(__path); [document.getElementById("debugger-choice").value, _debuggerChoice()].join("|")`);
  };
  assert.equal(shown("C:/rd/retrodebugger.exe", null), "retro|retro", "configured RetroDebugger, nothing chosen");
  assert.equal(shown("", null), "va|va");
  assert.equal(shown("C:/rd/retrodebugger.exe", "va"), "va|va", "an explicit choice wins");
  const retroOption = () => app.run(`[document.getElementById("debugger-choice-retro").disabled, document.getElementById("debugger-choice-retro").textContent.includes("(")].join("|")`);
  assert.equal(shown("", "retro"), "va|va", "RetroDebugger cannot be the choice without a path");
  assert.equal(retroOption(), "true|true", "disabled, and says why");
  assert.equal(shown("C:/rd/retrodebugger.exe", "retro"), "retro|retro", "the stored choice comes back with the path");
  assert.equal(retroOption(), "false|false");
});
