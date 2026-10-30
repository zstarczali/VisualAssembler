// Git műveletek a Verziókezelés ablakban (elvetés, ágak, merge, stash, fájlonkénti stage) valódi git-tel, ideiglenes repóban.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { spawnSync } = require("node:child_process");

const appJs = fs.readFileSync(path.join(__dirname, "..", "www", "app.js"), "utf8");
const start = appJs.indexOf("function _vcTabsUnder(");
const end = appJs.indexOf("async function _vcGitCheckout(", start);
const section = appJs.slice(start, end);

const hasGit = spawnSync("git", ["--version"]).status === 0;

function git(cwd, ...args) {
  const res = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (res.status !== 0) throw new Error(`git ${args.join(" ")}: ${res.stderr}`);
  return res.stdout.trim();
}

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "va-vc-git-")).replace(/\\/g, "/");
  git(dir, "init", "-q", "-b", "main");
  git(dir, "config", "user.name", "VA Test");
  git(dir, "config", "user.email", "va@test.invalid");
  git(dir, "config", "core.autocrlf", "false");
  fs.writeFileSync(`${dir}/main.asm`, "lda #$01\n");
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "init");
  return dir;
}

function load(dir, { answers = [], editorText = null } = {}) {
  const tab = { id: "t1", name: "main.asm", filePath: `${dir}/main.asm`, dirty: false, text: editorText ?? fs.readFileSync(`${dir}/main.asm`, "utf8") };
  const outputs = [];
  const context = {
    tabs: [tab], activeTabId: "t1", expertMode: false, ultimateBasicMode: false, _ubDirty: false,
    _vcGitState: { branch: "main" },
    _VC_PROJECT_TEXT_RE: /\.(asm|s|inc|ub|json|txt)$/i,
    t: (key) => key,
    tf: (key, values) => key + JSON.stringify(values),
    document: { getElementById: () => null },
    window: { electronAPI: { readTextFile: async (p) => (fs.existsSync(p) ? { ok: true, content: fs.readFileSync(p, "utf8") } : { ok: false }) } },
    _normFilePath: (p) => String(p || "").replace(/\\/g, "/").toLowerCase(),
    _vcUbFilePath: () => "",
    _vcIsUbTab: () => false,
    _vcTabDirty: (t) => !!t.dirty,
    _vcTabText: (t) => t.text,
    _vcApplyText: async (t, content) => { t.text = content; return true; },
    _vcTabFile: (t) => ({ dir, name: path.basename(t.filePath) }),
    _vcProjectScope: () => null,
    _vcJoinPath: (d, rel) => `${d}/${rel}`,
    _vcProjectDiff: (a, b) => JSON.stringify([a, b]),
    _vcShowDiff: (title, text) => outputs.push({ diff: title, text }),
    _vcSetOutput: (text, isError = false) => { if (text) outputs.push({ text, isError }); },
    _vcGit: async (args, cwd) => {
      const res = spawnSync("git", args, { cwd, encoding: "utf8" });
      return { ok: res.status === 0, code: res.status, stdout: res.stdout || "", stderr: res.stderr || "" };
    },
    _vcGitRoot: async (cwd) => {
      const res = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd, encoding: "utf8" });
      return res.status === 0 ? res.stdout.trim() : "";
    },
    _getActiveTab: () => tab,
    _tabActivate: () => {},
    _clearProjectSnapshotTimer: () => {},
    renderTabBar: () => {},
    _expertRenderProjectTree: () => {},
    _ubRenderProjectFiles: () => {},
    _showConfirm: async () => true,
    _renderProjectSnapshotHistory: async () => {},
    projectSnapshotDialog: { open: true },
  };
  vm.createContext(context);
  vm.runInContext(section, context);
  context._vcAsk = async () => answers.shift() ?? null;
  return { context, tab, outputs };
}

test("branch names are validated", { skip: !hasGit }, () => {
  const { context } = load(makeRepo());
  for (const ok of ["feature", "fix/sprite-x", "v2.6.9"]) assert.equal(context._vcBranchNameOk(ok), true, ok);
  for (const bad of ["", "-f", "a b", "a..b", "x.lock", "a~1", "a:b", "@{x", "dir/", "/x"]) assert.equal(context._vcBranchNameOk(bad), false, bad);
});

test("discard resets the file on disk to HEAD and reloads the clean tab", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  fs.writeFileSync(`${dir}/main.asm`, "lda #$02\n");
  const { context, tab } = load(dir);
  tab.dirty = true;
  tab.text = "lda #$03\n";
  assert.equal(await context._vcGitDiscard(tab), true);
  assert.equal(fs.readFileSync(`${dir}/main.asm`, "utf8"), "lda #$01\n");
  assert.equal(tab.text, "lda #$01\n");
  assert.equal(tab.dirty, false);
  assert.equal(git(dir, "status", "--porcelain"), "");
});

test("discard with nothing to discard reports it instead of doing nothing", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  const { context, outputs } = load(dir);
  assert.equal(await context._vcGitDiscard(context.tabs[0]), false);
  assert.equal(outputs.at(-1).text, "vcGitNothingToDiscard");
});

test("new branch, switch back and the tab follows the branch", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  const { context, tab } = load(dir, { answers: ["feature"] });
  await context._vcBranchNew();
  assert.equal(git(dir, "branch", "--show-current"), "feature");
  fs.writeFileSync(`${dir}/main.asm`, "lda #$05\n");
  git(dir, "commit", "-q", "-am", "feature");
  tab.text = "lda #$05\n";
  context._vcGitState = { branch: "feature" };
  await context._vcGitSwitch("main");
  assert.equal(git(dir, "branch", "--show-current"), "main");
  assert.equal(tab.text, "lda #$01\n");
});

test("switch refuses while the editor has unsaved changes", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  git(dir, "branch", "other");
  const { context, tab, outputs } = load(dir);
  tab.dirty = true;
  await context._vcGitSwitch("other");
  assert.equal(git(dir, "branch", "--show-current"), "main");
  assert.equal(outputs.at(-1).text, "vcGitSwitchUnsaved");
});

test("rename and delete (forced when not merged)", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  git(dir, "switch", "-q", "-c", "tmp");
  fs.writeFileSync(`${dir}/x.asm`, "rts\n");
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "tmp");
  git(dir, "switch", "-q", "main");
  const { context } = load(dir, { answers: ["trunk", "tmp"] });
  await context._vcBranchRename();
  assert.equal(git(dir, "branch", "--show-current"), "trunk");
  context._vcGitState = { branch: "trunk" };
  await context._vcBranchDelete();
  assert.equal(git(dir, "branch", "--list", "tmp"), "");
});

test("merge conflict is reported, abort restores the files", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  git(dir, "switch", "-q", "-c", "side");
  fs.writeFileSync(`${dir}/main.asm`, "lda #$0A\n");
  git(dir, "commit", "-q", "-am", "side");
  git(dir, "switch", "-q", "main");
  fs.writeFileSync(`${dir}/main.asm`, "lda #$0B\n");
  git(dir, "commit", "-q", "-am", "main");
  const { context, tab, outputs } = load(dir, { answers: ["side"] });
  await context._vcBranchMerge();
  assert.match(outputs.at(-1).text, /^vcMergeConflicts/);
  assert.equal(outputs.at(-1).isError, true);
  assert.match(tab.text, /<<<<<<<|=======/);
  await context._vcMergeAbort();
  assert.equal(fs.readFileSync(`${dir}/main.asm`, "utf8"), "lda #$0B\n");
  assert.equal(tab.text, "lda #$0B\n");
  assert.equal(git(dir, "status", "--porcelain"), "");
});

test("stash push, then pop restores the change", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  fs.writeFileSync(`${dir}/main.asm`, "lda #$07\n");
  const { context, tab } = load(dir, { answers: ["wip"] });
  await context._vcStashSave();
  assert.equal(fs.readFileSync(`${dir}/main.asm`, "utf8"), "lda #$01\n");
  assert.equal(tab.text, "lda #$01\n");
  assert.match(git(dir, "stash", "list"), /wip/);
  await context._vcStashAction("pop", "stash@{0}");
  assert.equal(tab.text, "lda #$07\n");
  assert.equal(git(dir, "stash", "list"), "");
});

test("file actions: stage, unstage, discard and delete untracked", { skip: !hasGit }, async () => {
  const dir = makeRepo();
  fs.writeFileSync(`${dir}/main.asm`, "lda #$09\n");
  fs.writeFileSync(`${dir}/new file.asm`, "nop\n");
  const { context } = load(dir);
  const click = (act, file, code) => context._vcFileAction({ target: { closest: () => ({ dataset: { fileAct: act, path: file, code } }) } });
  await click("stage", "main.asm", " M");
  assert.equal(git(dir, "diff", "--cached", "--name-only"), "main.asm");
  await click("unstage", "main.asm", "M ");
  assert.equal(git(dir, "diff", "--cached", "--name-only"), "");
  await click("discard", "main.asm", " M");
  assert.equal(fs.readFileSync(`${dir}/main.asm`, "utf8"), "lda #$01\n");
  await click("discard", "new file.asm", "??");
  assert.equal(fs.existsSync(`${dir}/new file.asm`), false);
});
