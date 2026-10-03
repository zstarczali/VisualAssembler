const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const appJs = fs.readFileSync(path.join(root, "www", "app.js"), "utf8");
const templatesDir = path.join(root, "templates");

function extractFunctionSource(name) {
  const start = appJs.indexOf(`function ${name}(`);
  assert.notStrictEqual(start, -1, `Missing function ${name}`);
  let depth = 0, seen = false;
  for (let i = start; i < appJs.length; i++) {
    if (appJs[i] === "{") { depth++; seen = true; }
    else if (appJs[i] === "}" && seen && --depth === 0) return appJs.slice(start, i + 1);
  }
  throw new Error(`Could not parse ${name}`);
}

function run(code, language = "en") {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`
    let currentLanguage = ${JSON.stringify(language)};
    ${extractFunctionSource("_parseTemplateSource")}
    ${extractFunctionSource("_templateText")}
    ${extractFunctionSource("_templateSanitizeName")}
    ${extractFunctionSource("_templateJoinPath")}
    ${extractFunctionSource("_templateTargetPaths")}
    ${code}
  `, ctx);
  return JSON.parse(JSON.stringify(ctx.out));
}

test("template header is parsed and stripped from the body", () => {
  const out = run(`
    const tpl = _parseTemplateSource("game.asm",
      "; @name Empty game\\r\\n; @name.hu Üres játék\\r\\n; @category Game\\r\\n; @order 20\\r\\n\\r\\n; first real line\\r\\n* = $0801\\r\\n    RTS\\r\\n\\r\\n", "builtin");
    this.out = { tpl, en: _templateText(tpl, "name", "en"), hu: _templateText(tpl, "name", "hu"), de: _templateText(tpl, "name", "de"), missing: _templateText(tpl, "desc", "hu") };
  `);
  assert.equal(out.tpl.id, "builtin:game.asm");
  assert.equal(out.tpl.order, 20);
  assert.equal(out.tpl.body, "; first real line\n* = $0801\n    RTS\n");
  assert.equal(out.en, "Empty game");
  assert.equal(out.hu, "Üres játék");
  assert.equal(out.de, "Empty game");
  assert.equal(out.missing, "");
});

test("a template without a header keeps its whole source and gets a default order", () => {
  const out = run(`this.out = _parseTemplateSource("plain.asm", "* = $0801\\n; @name not a header\\n    RTS", "user");`);
  assert.equal(out.id, "user:plain.asm");
  assert.equal(out.order, 1000);
  assert.deepEqual(out.meta, {});
  assert.equal(out.body, "* = $0801\n; @name not a header\n    RTS\n");
});

test("project name is sanitised and the target paths live in their own folder", () => {
  const out = run(`
    this.out = {
      name: _templateSanitizeName('  My: Game?*  '),
      dots: _templateSanitizeName(' ..demo.. '),
      empty: _templateSanitizeName(' <>:"/\\\\|?* '),
      win: _templateTargetPaths("My Game", "D:\\\\Work\\\\"),
      unix: _templateTargetPaths("demo", "/home/user/c64"),
      noName: _templateTargetPaths("  ", "D:/Work"),
      noLocation: _templateTargetPaths("demo", "  ")
    };
  `);
  assert.equal(out.name, "My Game");
  assert.equal(out.dots, "demo");
  assert.equal(out.empty, "");
  assert.deepEqual(out.win, { name: "My Game", dir: "D:/Work/My Game", projPath: "D:/Work/My Game/My Game.proj", mainPath: "D:/Work/My Game/main.asm" });
  assert.equal(out.unix.projPath, "/home/user/c64/demo/demo.proj");
  assert.equal(out.noName, null);
  assert.equal(out.noLocation, null);
});

test("UltimateBasic templates use # headers and create main.ub", () => {
  const out = run(`
    const tpl = _parseTemplateSource("ub-game.ub", "# @name Game\\n# @name.hu Játék\\n# @order 5\\n\\n# {{PROJECT}}\\ncls\\n", "builtin");
    this.out = { tpl, paths: _templateTargetPaths("demo", "D:/Work", tpl.kind), asm: _parseTemplateSource("x.asm", "; @name X", "user").kind };
  `);
  assert.equal(out.tpl.kind, "ub");
  assert.equal(out.tpl.meta.name.hu, "Játék");
  assert.equal(out.tpl.order, 5);
  assert.equal(out.tpl.body, "# {{PROJECT}}\ncls\n");
  assert.equal(out.paths.mainPath, "D:/Work/demo/main.ub");
  assert.equal(out.asm, "asm");
});

test("every built-in template has a name, category and description in EN and HU", () => {
  const all = fs.readdirSync(templatesDir);
  const files = all.filter(f => /\.(asm|ub)$/i.test(f));
  assert.ok(all.filter(f => /\.asm$/i.test(f)).length >= 4, "Expected at least 4 assembler templates");
  assert.ok(all.filter(f => /\.ub$/i.test(f)).length >= 3, "Expected at least 3 UltimateBasic templates");
  for (const file of files) {
    const out = run(`
      const tpl = _parseTemplateSource(${JSON.stringify(file)}, ${JSON.stringify(fs.readFileSync(path.join(templatesDir, file), "utf8"))}, "builtin");
      this.out = { tpl, texts: ["name", "category", "desc"].flatMap(key => ["en", "hu"].map(lang => _templateText(tpl, key, lang))) };
    `);
    assert.ok(out.texts.every(Boolean), `${file}: missing @name / @category / @desc`);
    assert.ok(out.tpl.meta.name.hu && out.tpl.meta.desc.hu && out.tpl.meta.category.hu, `${file}: missing Hungarian header`);
    assert.ok(out.tpl.order < 1000, `${file}: missing @order`);
    assert.ok(!/^\s*[;#]\s*@/m.test(out.tpl.body), `${file}: header line left in the body`);
    if (out.tpl.kind === "asm") assert.ok(out.tpl.body.includes("* = $0801"), `${file}: no origin`);
  }
});

test("template menu item, dialog and backend commands are wired up", () => {
  const html = fs.readFileSync(path.join(root, "www", "index.html"), "utf8");
  const bridge = fs.readFileSync(path.join(root, "www", "tauri-bridge.js"), "utf8");
  const rust = fs.readFileSync(path.join(root, "src-tauri", "src", "lib.rs"), "utf8");
  const conf = JSON.parse(fs.readFileSync(path.join(root, "src-tauri", "tauri.conf.json"), "utf8"));
  for (const id of ["menu-new-from-template", "template-dialog", "template-list", "template-preview", "template-project-name", "template-location", "template-create", "template-kinds", "template-kind-asm", "template-kind-ub", "new-project-btn"]) {
    assert.ok(html.includes(`id="${id}"`), `index.html is missing #${id}`);
  }
  assert.ok(appJs.includes('getElementById("menu-new-from-template")?.addEventListener'));
  assert.ok(bridge.includes('invoke("list_templates")'));
  assert.ok(bridge.includes('invoke("open_templates_folder")'));
  assert.ok(/fn list_templates\(/.test(rust) && /^\s*list_templates,\s*$/m.test(rust));
  assert.ok(/fn open_templates_folder\(/.test(rust) && /^\s*open_templates_folder,\s*$/m.test(rust));
  assert.ok(bridge.includes('invoke("create_template_project"'));
  assert.ok(/fn create_template_project\(/.test(rust) && /^\s*create_template_project,\s*$/m.test(rust));
  assert.ok(appJs.includes("api.createTemplateProject("), "project creation must go through the atomic backend call");
  assert.equal(conf.bundle.resources["../templates/*"], "templates/");
});
