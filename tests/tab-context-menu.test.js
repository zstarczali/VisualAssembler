const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");

function fnSource(name) {
  const marker = `function ${name}(`;
  const start = appJs.indexOf(marker);
  assert.notStrictEqual(start, -1, `missing ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}") { depth--; if (seen && depth === 0) return appJs.slice(start, i + 1); }
  }
  throw new Error(`unbalanced ${name}`);
}

test("tab bar right-click menu is wired into the global contextmenu handler", () => {
  // The document-level contextmenu listener routes .tab-item / #tab-bar clicks to the menu.
  assert.match(appJs, /contextmenu"[\s\S]{0,400}?closest\("\.tab-item"\)[\s\S]{0,200}?_showTabCtxMenu\(e,/);
  // Outside-click closes it, alongside the block and SID menus.
  assert.match(appJs, /!e\.target\.closest\("#tab-ctx-menu"\)\)\s*_hideTabCtxMenu\(\)/);
});

test("_showTabCtxMenu offers new / close / close-others / close-right / close-all", () => {
  const src = fnSource("_showTabCtxMenu");
  for (const action of ["new", "close", "others", "right", "all"]) {
    assert.match(src, new RegExp(`data-action="${action}"`), `menu item ${action}`);
  }
  // close-others needs >1 tab; close-right needs a tab that isn't last.
  assert.match(src, /const multi = tabs\.length > 1/);
  assert.match(src, /hasRight = idx >= 0 && idx < tabs\.length - 1/);
  // dataset ids are strings; tab.id may be numeric — comparison must be string-safe.
  assert.match(src, /String\(t\.id\) === String\(tabId\)/);
});

test("_handleTabCtxAction maps every action to tab operations", () => {
  const src = fnSource("_handleTabCtxAction");
  assert.match(src, /action === "new"[\s\S]{0,40}_tabNew\(\)/);
  assert.match(src, /action === "close"[\s\S]{0,80}_tabClose\(realId\)/);
  assert.match(src, /action === "others"[\s\S]{0,120}filter\(t => t\.id !== realId\)/);
  assert.match(src, /action === "right"[\s\S]{0,160}slice\(idx \+ 1\)/);
  assert.match(src, /action === "all"[\s\S]{0,60}tabs\.map\(t => t\.id\)/);
  // batch close stops if the user cancels an unsaved-tab confirm
  assert.match(src, /if \(!\(await _tabClose\(id\)\)\) break/);
});
