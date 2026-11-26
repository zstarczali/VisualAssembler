// ── Oscar64 C mode ──────────────────────────────────────────────────────────
// A C editor of its own (#osc-panel): project tree = a folder on disk, file tabs, C / inline
// asm highlighting, the Oscar64 build (Rust build_oscar64_prg: bundled or Settings path),
// listing / monitor / map views, a cycle gutter and the source map of the debuggers
// (.dbj functions[].lines → _w64DebugBuild / _w64BreakpointAddresses / _w64ShowSource).
// It runs after app.js and uses its globals (t, tf, tabs, runMode, _REV_OP, _cycleInfo …).

const _OSC_STORE = "c64va-oscar64";
const _OSC_SOURCE_EXT = /\.(c|h|cpp|hpp|cc|s|asm|inc)$/i;
// Text the editor opens; anything else (png, prg, sid, d64, bin …) goes to the system's program.
const _OSC_TEXT_FILE = /\.(c|h|cpp|hpp|cc|hh|s|asm|a65|inc|ub|txt|md|sh|bat|cmd|mk|proj|json|cfg|ini|py|js|lua|csv|xml|html?)$|^(makefile|gnumakefile|readme|license|copying)$/i;

const _OSC_KEYWORDS = new Set(("auto break case const continue default do else enum extern for goto if inline "
  + "register restrict return sizeof static struct switch typedef union volatile while "
  + "class namespace template typename public private protected new delete this operator using virtual "
  + "true false nullptr constexpr static_assert __asm __interrupt __hwinterrupt __native __zeropage "
  + "__noinline __forceinline __striped __export __dynstack __fastcall __bankof __assume __align __noexit").split(" "));
const _OSC_TYPES = new Set(("void char short int long float double signed unsigned bool size_t ptrdiff_t "
  + "int8_t int16_t int32_t uint8_t uint16_t uint32_t byte word dword sbyte").split(" "));
const _OSC_MNEMONICS = new Set(("adc and asl bcc bcs beq bit bmi bne bpl brk bvc bvs clc cld cli clv cmp cpx cpy "
  + "dec dex dey eor inc inx iny jmp jsr lda ldx ldy lsr nop ora pha php pla plp rol ror rti rts sbc sec sed sei "
  + "sta stx sty tax tay tsx txa txs tya lax sax dcp isc rla rra slo sre anc alr arr sbx").split(" "));

const _osc = {
  active: false,
  root: "",
  projPath: "",
  proj: { startupFile: "", optimize: "O2", defines: [], includeDirs: [] },
  tree: [],
  expanded: new Set(),
  selected: "",
  files: [],
  current: -1,
  hl: true,
  lines: true,
  cycles: true,
  ac: true,
  optimize: "O2",
  output: true,
  project: true,
  fontSize: 14,
  view: "log",
  last: null,
  entries: [],
  debugLine: null,
  auto: true,
  bps: new Map(),
  diags: [],
  // every project opened in this session: normalized root → { root, projPath, proj, tree }
  projects: new Map(),
  bms: new Map(),
  minimap: true,
  find: { matches: [], index: -1 },
};

const _oscEl = (id) => document.getElementById(id);
const _oscEsc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const _oscBase = (p) => String(p || "").replace(/[\\/]+$/, "").split(/[\\/]/).pop() || "";
const _oscDir = (p) => String(p || "").replace(/[\\/][^\\/]*$/, "");
const _oscSep = (p) => (String(p).includes("\\") ? "\\" : "/");
const _oscJoin = (dir, name) => `${String(dir).replace(/[\\/]+$/, "")}${_oscSep(dir)}${name}`;
const _oscNorm = (p) => String(p || "").replace(/\\/g, "/").toLowerCase();

function _oscActive() { return !!_osc.active; }

let _oscNextId = 1;
// The key a file's breakpoints, cycles and debug line go by: its path, or "untitled:<id>".
const _oscKey = (f) => (f ? (f.path ? _oscNorm(f.path) : `untitled:${f.id}`) : "");

// ── Highlighting ────────────────────────────────────────────────────────────

// One line; `state` carries what crosses lines: { comment: in a block comment, asm: brace depth of __asm { } }.
function _oscHighlightLine(line, state = { comment: false, asm: 0 }) {
  const out = [];
  const st = { comment: !!state.comment, asm: state.asm | 0, asmPending: !!state.asmPending };
  const span = (cls, text) => out.push(cls ? `<span class="${cls}">${_oscEsc(text)}</span>` : _oscEsc(text));
  let i = 0;
  const n = line.length;
  if (st.comment) {
    const end = line.indexOf("*/");
    if (end < 0) { span("osc-comment", line); return { html: out.join(""), state: st }; }
    span("osc-comment", line.slice(0, end + 2));
    st.comment = false;
    i = end + 2;
  }
  if (!st.asm && /^\s*#/.test(line.slice(i))) {
    const m = /^(\s*#\s*[A-Za-z_]+)(.*)$/.exec(line.slice(i));
    if (m) {
      span("osc-pp", m[1]);
      const rest = m[2];
      const inc = /^(\s*)(<[^>]*>|"[^"]*")(.*)$/.exec(rest);
      if (inc && /include|pragma/.test(m[1])) { span("", inc[1]); span("osc-string", inc[2]); i += m[1].length + inc[1].length + inc[2].length; }
      else i += m[1].length;
    }
  }
  while (i < n) {
    const ch = line[i];
    const rest = line.slice(i);
    if (rest.startsWith("//") || (st.asm && ch === ";")) { span("osc-comment", rest); break; }
    if (rest.startsWith("/*")) {
      const end = line.indexOf("*/", i + 2);
      if (end < 0) { span("osc-comment", rest); st.comment = true; break; }
      span("osc-comment", line.slice(i, end + 2));
      i = end + 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && line[j] !== ch) j += line[j] === "\\" ? 2 : 1;
      span("osc-string", line.slice(i, Math.min(n, j + 1)));
      i = j + 1;
      continue;
    }
    const num = /^(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\$[0-9a-fA-F]+|%[01]+(?![\w])|\d+\.?\d*(?:[eE][+-]?\d+)?)[uUlLfF]*/.exec(rest);
    if (num && (i === 0 || !/[\w$]/.test(line[i - 1])) && (ch !== "$" && ch !== "%" || st.asm)) {
      span("osc-number", num[0]);
      i += num[0].length;
      continue;
    }
    const id = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
    if (id) {
      const word = id[0];
      let cls = "";
      if (st.asm && _OSC_MNEMONICS.has(word.toLowerCase())) cls = "osc-mnem";
      else if (_OSC_KEYWORDS.has(word)) cls = "osc-kw";
      else if (_OSC_TYPES.has(word)) cls = "osc-type";
      else if (/^\s*\(/.test(line.slice(i + word.length))) cls = "osc-fn";
      else if (/^[A-Z][A-Z0-9_]{2,}$/.test(word)) cls = "osc-const";
      if (word === "__asm") st.asmPending = true;
      span(cls, word);
      i += word.length;
      continue;
    }
    if (ch === "{") {
      if (st.asmPending) { st.asm = 1; st.asmPending = false; }
      else if (st.asm) st.asm++;
    } else if (ch === "}" && st.asm) {
      st.asm--;
    } else if (ch === ";" ) {
      st.asmPending = false;
    }
    span(/[{}()[\];,]/.test(ch) ? "osc-punct" : /[-+*/%=<>!&|^~?:]/.test(ch) ? "osc-op" : "", ch);
    i++;
  }
  return { html: out.join(""), state: st };
}

function _oscHighlight(text) {
  let state = { comment: false, asm: 0 };
  return String(text).split("\n").map((line) => {
    const r = _oscHighlightLine(line, state);
    state = r.state;
    return r.html;
  });
}

// ── Build artefacts ─────────────────────────────────────────────────────────

// .dbj → source map entries { start, end (inclusive), file, line (1-based) } and the symbols.
function _oscParseDbj(text) {
  let data;
  try { data = JSON.parse(String(text || "")); } catch (_) { return { entries: [], symbols: [] }; }
  const entries = [];
  const symbols = [];
  for (const fn of data?.functions || []) {
    if (Number.isFinite(fn.start)) symbols.push({ name: fn.name, address: fn.start & 0xFFFF });
    for (const l of fn.lines || []) {
      if (!Number.isFinite(l.start) || !Number.isFinite(l.end) || l.end <= l.start) continue;
      entries.push({ start: l.start, end: l.end - 1, file: l.source || fn.source || "", line: l.line });
    }
  }
  for (const v of data?.variables || []) {
    if (Number.isFinite(v.start)) symbols.push({ name: v.name, address: v.start & 0xFFFF });
  }
  return { entries, symbols };
}

// .dbj → the debugger's variables: the program's own globals (not the library's), and per function its
// parameters and locals (Oscar64 gives them fixed addresses: zero page or a static frame), with the types.
function _oscParseDbjVars(text) {
  let data;
  try { data = JSON.parse(String(text || "")); } catch (_) { return null; }
  const types = {};
  for (const ty of data?.types || []) types[ty.typeid] = ty;
  const lib = /[\\/]oscar64[\\/]include[\\/]/i;
  const own = (v) => (v.references || []).some((r) => r.source && !lib.test(r.source));
  const item = (v) => ({ name: v.name, address: v.start & 0xFFFF, size: Math.max(0, v.end - v.start), typeid: v.typeid,
    enter: Number.isFinite(v.enter) ? v.enter : null, leave: Number.isFinite(v.leave) ? v.leave : null });
  const globals = (data?.variables || []).filter((v) => Number.isFinite(v.start) && own(v)).map(item);
  const funcs = (data?.functions || []).filter((f) => Number.isFinite(f.start) && f.variables?.length)
    .map((f) => ({ name: f.name, start: f.start, end: f.end, vars: f.variables.filter((v) => Number.isFinite(v.start)).map(item) }));
  // every function's code range: the call stack names its frames with them
  const fns = (data?.functions || []).filter((f) => Number.isFinite(f.start) && Number.isFinite(f.end)).map((f) => ({ name: f.name, start: f.start, end: f.end }));
  return { types, globals, funcs, fns };
}

// One value of a C type at an address, as text (arrays: the first elements, char arrays also as text).
function _oscFormatValue(info, typeid, address, peek, depth = 0) {
  const ty = info?.types?.[typeid];
  const size = ty?.size || 0;
  const bytes = peek(address, Math.min(Math.max(size, 1), 64));
  const le = (n) => { let v = 0; for (let i = n - 1; i >= 0; i--) v = v * 256 + bytes[i]; return v; };
  const hex = (v, n) => `$${v.toString(16).toUpperCase().padStart(n * 2, "0")}`;
  switch (ty?.type) {
    case "uint": case "enum": case "bool": {
      if (size > 4 || !size) break;
      const v = le(size);
      return size === 1 && v >= 32 && v < 127 ? `${v} (${hex(v, 1)} '${String.fromCharCode(v)}')` : `${v} (${hex(v, size)})`;
    }
    case "int": {
      if (size > 4 || !size) break;
      let v = le(size);
      if (v >= 2 ** (size * 8 - 1)) v -= 2 ** (size * 8);
      return `${v} (${hex(le(size), size)})`;
    }
    case "float": {
      if (size !== 4) break;
      const dv = new DataView(Uint8Array.from(bytes.slice(0, 4)).buffer);
      return String(+dv.getFloat32(0, true).toPrecision(7));
    }
    case "ptr": return hex(le(2), 2);
    case "array": {
      const el = info.types[ty.eid];
      const elSize = el?.size || 1;
      const count = Math.floor(size / elSize);
      if (elSize === 1 && (el?.type === "uint" || el?.type === "int")) {
        const end = bytes.indexOf(0);
        const str = Array.from(bytes.slice(0, end < 0 ? Math.min(count, 32) : end)).map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : ".")).join("");
        if (end > 0) return `"${str}"`;
      }
      if (depth > 1) return `[${count}]`;
      const shown = Math.min(count, 8);
      const parts = [];
      for (let i = 0; i < shown; i++) parts.push(_oscFormatValue(info, ty.eid, (address + i * elSize) & 0xFFFF, peek, depth + 1).replace(/ \(.*\)$/, ""));
      return `[${parts.join(", ")}${count > shown ? ", …" : ""}]`;
    }
    case "struct": case "union": {
      if (depth > 1) return "{…}";
      const parts = (ty.members || []).slice(0, 8).map((m) => `${m.name}: ${_oscFormatValue(info, m.typeid, (address + m.offset) & 0xFFFF, peek, depth + 1).replace(/ \(.*\)$/, "")}`);
      return `{ ${parts.join(", ")}${(ty.members || []).length > 8 ? ", …" : ""} }`;
    }
  }
  return Array.from(bytes.slice(0, Math.min(size || 1, 8))).map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");
}

// The debugger's variable rows at a stop: the locals of the function at PC (innermost), then the globals.
// line: the C line of the stop; a local whose .dbj line range (enter..leave) does not hold it is out of scope.
function _oscDebugVarRows(info, pc, peek, line = null) {
  if (!info) return [];
  const fn = (info.funcs || []).filter((f) => pc >= f.start && pc < f.end).sort((a, b) => (a.end - a.start) - (b.end - b.start))[0];
  const row = (v, scope) => ({ name: v.name, address: v.address, scope, value: _oscFormatValue(info, v.typeid, v.address, peek) });
  const inScope = (v) => line == null || v.enter == null || v.leave == null || (line >= v.enter && line <= v.leave);
  return [...(fn ? fn.vars.filter(inScope).map((v) => row(v, fn.name)) : []), ...(info.globals || []).map((v) => row(v, ""))];
}

// Static cycles of the C lines of one file: the instructions in the line's address ranges.
function _oscCycleMap(prg, entries, file) {
  const map = new Map();
  if (!prg || prg.length < 3) return map;
  const load = prg[0] | (prg[1] << 8);
  const norm = _oscNorm(file);
  for (const e of entries) {
    if (_oscNorm(e.file) !== norm) continue;
    let addr = e.start;
    let sum = map.get(e.line - 1) || { min: 0, max: 0, warn: false };
    while (addr <= e.end) {
      const off = addr - load + 2;
      if (off < 2 || off >= prg.length) break;
      const info = _REV_OP[prg[off]];
      const size = info && info.mode !== "unknown" ? info.size : 1;
      const c = _cycleInfo(Array.from(prg.slice(off, off + size)), addr);
      if (c) sum = { min: sum.min + c.min, max: sum.max + c.max, warn: sum.warn || c.warn };
      addr += size;
    }
    map.set(e.line - 1, sum);
  }
  return map;
}

// .map "sections": "0880 - 18f2 : DATA, code"
function _oscParseMap(text) {
  const out = [];
  let inSections = false;
  for (const raw of String(text || "").split("\n")) {
    const line = raw.trim();
    if (/^[a-z]+$/.test(line)) { inSections = line === "sections"; continue; }
    if (!inSections) continue;
    const m = /^([0-9a-f]{4}) - ([0-9a-f]{4}) : (\w+), (.+)$/i.exec(line);
    if (m) out.push({ start: parseInt(m[1], 16), end: parseInt(m[2], 16), kind: m[3], name: m[4] });
  }
  return out;
}

// The memory panel (getMemoryUsage) from the last build's sections.
function _oscMemoryUsage() {
  const occupiedRanges = [];
  const sections = _oscParseMap(_osc.last?.map);
  const type = { DATA: "code", BSS: "data", HEAP: "array", STACK: "array", ZEROPAGE: "zp" };
  for (const s of sections) {
    if (s.end <= s.start || s.kind === "SSTACK") continue;
    const kind = s.name === "data" ? "data" : type[s.kind] || "data";
    occupiedRanges.push({ start: s.start, end: Math.min(0xFFFF, s.end - 1), type: kind, label: `${s.name} ${formatAddress(s.start)}–${formatAddress(s.end - 1)}` });
  }
  const mergedOccupied = mergeMemoryRanges(occupiedRanges);
  const ram = memorySegments.filter((seg) => seg.kind === "ram");
  const totalRamBytes = ram.reduce((sum, seg) => sum + (seg.end - seg.start + 1), 0);
  const occupiedRamBytes = ram.reduce((sum, seg) => sum + countRangeBytes(mergedOccupied, seg.start, seg.end), 0);
  return { layout: { lines: [] }, deferredSections: [], occupiedRanges, mergedOccupied, totalRamBytes, occupiedRamBytes, freeRamBytes: Math.max(0, totalRamBytes - occupiedRamBytes), overlaps: [] };
}

// The compiler's listing: "0880 : ad f3 18 LDA $18f3 ; (counter + 0)" and ";   9, "file"" source marks.
function _oscListingHtml(asm) {
  return String(asm || "").split("\n").map((line) => {
    const src = /^;\s*(\d+),\s*"(.*)"\s*$/.exec(line);
    if (src) return `<span class="osc-l-src" data-file="${_oscEsc(src[2])}" data-line="${src[1]}">; ${_oscEsc(_oscBase(src[2]))}:${src[1]}</span>`;
    const ins = /^([0-9a-f]{4}) : ((?:[0-9a-f_]{2} ?){3})(\S+)(.*)$/i.exec(line);
    if (ins) {
      const [operand, comment] = ins[4].split(/;(.*)/s);
      return `<span class="dsm-addr">$${ins[1].toUpperCase()}</span>  <span class="dsm-bytes">${_oscEsc(ins[2].replace(/__/g, "  "))}</span> <span class="asm-tok-mnemonic">${_oscEsc(ins[3])}</span><span class="asm-tok-operand">${_oscEsc(operand || "")}</span>${comment !== undefined ? `<span class="osc-comment">;${_oscEsc(comment)}</span>` : ""}`;
    }
    if (/^[A-Za-z_.][\w.@?]*:/.test(line)) return `<span class="asm-tok-label">${_oscEsc(line)}</span>`;
    if (/^-+$/.test(line)) return `<span class="osc-l-sep">${_oscEsc(line)}</span>`;
    return `<span class="osc-comment">${_oscEsc(line)}</span>`;
  }).join("\n");
}

function _oscMonitorText(prg) {
  if (!prg || prg.length < 3) return t("oscBuildFirst");
  const load = prg[0] | (prg[1] << 8);
  const mem = new Map();
  for (let i = 2; i < prg.length; i++) mem.set((load + i - 2) & 0xFFFF, prg[i]);
  return _formatMonitorMemory(mem, load);
}

// ── Persistence ─────────────────────────────────────────────────────────────

function _oscSave() {
  try {
    localStorage.setItem(_OSC_STORE, JSON.stringify({
      active: _osc.active, root: _osc.root, hl: _osc.hl, lines: _osc.lines, cycles: _osc.cycles, ac: _osc.ac, optimize: _osc.optimize,
      output: _osc.output, project: _osc.project, fontSize: _osc.fontSize, view: _osc.view, outputWidth: _osc.outputWidth, symbolsHeight: _osc.symbolsHeight,
      open: _osc.files.filter((f) => f.path).map((f) => f.path), current: _osc.files[_osc.current]?.path || "",
      expanded: [..._osc.expanded],
      projects: [..._osc.projects.values()].filter((pr) => pr.projPath).map((pr) => ({ root: pr.root, projPath: pr.projPath })),
      bps: [..._osc.bps].map(([file, set]) => [file, [...set]]).filter(([, l]) => l.length),
      minimap: _osc.minimap,
      bms: [..._osc.bms].filter(([file, set]) => !file.startsWith("untitled:") && set.size).map(([file, set]) => [file, [...set]]),
    }));
  } catch (_) {}
}

function _oscLoadPrefs() {
  try { return JSON.parse(localStorage.getItem(_OSC_STORE) || "{}") || {}; } catch (_) { return {}; }
}

// ── Mode ────────────────────────────────────────────────────────────────────

function _oscSetMode(on) {
  on = !!on;
  if (on === _osc.active) return;
  if (on) {
    if (ultimateBasicMode) setUltimateBasicMode(false, { restoreAssemblerMode: false });
  }
  _osc.active = on;
  document.body.classList.toggle("oscar-mode", on);
  // the shared Toolkit goes back to the block / Expert / UB view when C closes
  if (!on) globalThis._toolkitPlace?.();
  const panel = _oscEl("osc-panel");
  if (panel) panel.hidden = !on;
  const btn = _oscEl("oscar-mode-tb-btn");
  btn?.classList.toggle("main-tb-btn--active", on);
  btn?.setAttribute("aria-pressed", String(on));
  const label = _oscEl("editor-mode-indicator-label");
  if (on && label) label.textContent = t("editorModeOscar64");
  else _updateEditorModeIndicator();
  if (on) {
    _oscRenderAll();
    _oscRefreshCompilerInfo();
    _oscEl("osc-editor")?.focus();
    _oscScheduleAuto(300);
  }
  try { renderMemoryMap(); } catch (_) {}
  _oscSave();
}

// ── Studio tabs ─────────────────────────────────────────────────────────────
// Every C file is a tab of the shared tab bar (app.js `tabs`, editorMode "oscar", oscId = the file's
// id). Activating that tab shows this editor (_oscShowFile); any other tab hides it (_tabActivate).

function _oscTabOf(id) {
  return typeof tabs === "undefined" ? null : tabs.find((tb) => tb.editorMode === "oscar" && tb.oscId === id) || null;
}

// The shared tab bar after a change of the file list: new files get a tab, closed ones lose it,
// names and the unsaved dot follow. focusId: the file whose tab becomes active.
function _oscTabsSync(focusId = null) {
  if (typeof tabs === "undefined" || typeof _tabCreate !== "function") return;
  for (const f of _osc.files) {
    let tab = _oscTabOf(f.id);
    if (!tab) {
      tab = _tabCreate(f.name);
      Object.assign(tab, { editorMode: "oscar", oscId: f.id, program: [] });
      tabs.push(tab);
    }
    tab.name = f.name;
    tab.filePath = f.path || null;
    tab.dirty = !!f.dirty;
  }
  const tab = focusId != null && !_osc.restoring ? _oscTabOf(focusId) : null;
  if (tab && tab.id !== activeTabId) _tabActivate(tab.id);
  const ids = new Set(_osc.files.map((f) => f.id));
  const gone = tabs.filter((tb) => tb.editorMode === "oscar" && !ids.has(tb.oscId));
  gone.forEach((tb) => _tabDrop(tb.id));
  if (!gone.length) renderTabBar();
}

// The shared tab bar activated a C file's tab.
function _oscShowFile(id) {
  const idx = _osc.files.findIndex((f) => f.id === id);
  if (idx < 0) return;
  _oscSetMode(true);
  if (idx !== _osc.current) _oscActivate(idx);
  else _oscRefreshEditor();
  _oscEl("osc-editor")?.focus();
  _oscSave();
}

// The C toolbar button: the last C file, or a new one.
function _oscEnter() {
  const f = _oscCurrent() || _osc.files[0];
  const tab = f ? _oscTabOf(f.id) : null;
  if (tab) _tabActivate(tab.id);
  else _oscNewFile();
}

// Back to the assembler / UltimateBasic side: the tab used last there, or a new one.
function _oscLeave() {
  const other = tabs.find((tb) => tb.id === _studioLastTabId && tb.editorMode !== "oscar")
    || [...tabs].reverse().find((tb) => tb.editorMode !== "oscar");
  if (other) { _tabActivate(other.id); return; }
  _oscSetMode(false);
  _tabNew();
}

// Before a project of another kind opens: every C file closes (unsaved ones asked about), the
// C projects with them. false = the user kept a file.
async function _oscCloseAll() {
  _oscSyncFromEditor();
  for (const f of _osc.files) {
    if (f.dirty && !(await _showConfirm(tf("oscCloseUnsaved", { name: f.name })))) return false;
  }
  _osc.files = [];
  _osc.current = -1;
  _osc.projects.clear();
  _osc.root = "";
  _osc.projPath = "";
  _osc.proj = { startupFile: "", optimize: "O2", defines: [], includeDirs: [] };
  _osc.tree = [];
  if (_osc.active) _oscSetMode(false);
  _oscRenderTree();
  _oscSave();
  return true;
}

async function _oscCloseById(id) {
  const idx = _osc.files.findIndex((f) => f.id === id);
  if (idx < 0) { const tab = _oscTabOf(id); if (tab) _tabDrop(tab.id); return true; }
  return _oscCloseFile(idx);
}

// ── Files ───────────────────────────────────────────────────────────────────

function _oscCurrent() { return _osc.files[_osc.current] || null; }

function _oscSyncFromEditor() {
  const f = _oscCurrent();
  const ed = _oscEl("osc-editor");
  if (!f || !ed) return;
  f.text = ed.value;
  f.scrollTop = ed.scrollTop;
  f.sel = [ed.selectionStart, ed.selectionEnd];
}

function _oscNewFile(text = "#include <stdio.h>\n\nint main(void)\n{\n    printf(\"HELLO WORLD\\n\");\n    return 0;\n}\n") {
  _oscSyncFromEditor();
  _osc.files.push({ id: _oscNextId++, path: "", name: "untitled.c", text, saved: "", dirty: false, scrollTop: 0 });
  _oscActivate(_osc.files.length - 1);
}

async function _oscOpenPath(path, line = -1) {
  // Studio: an assembler or UltimateBasic file opens in its own editor
  const kind = typeof _studioEditorOf === "function" ? _studioEditorOf(path) : "";
  // a C project holds assembly too (its own editor); UltimateBasic is another project's language
  if (kind === "ub" && _osc.root && _oscNorm(path).startsWith(_oscNorm(_osc.root) + "/")) { globalThis._projForeignNote?.("c", path); return false; }
  if (kind === "asm" || kind === "ub") return _studioOpenForeign(path, "c");
  const norm = _oscNorm(path);
  let idx = _osc.files.findIndex((f) => _oscNorm(f.path) === norm);
  if (idx < 0) {
    const res = await window.electronAPI?.readTextFile?.(path);
    if (!res?.ok) { _oscStatus(res?.error || t("oscOpenFailed"), true); return false; }
    _oscSyncFromEditor();
    // an untouched empty "untitled" tab gives its place to the first real file
    const lone = _osc.files.length === 1 && !_osc.files[0].path && !_osc.files[0].dirty;
    const entry = { id: _oscNextId++, path, name: _oscBase(path), text: res.content.replace(/\r\n/g, "\n"), dirty: false, scrollTop: 0 };
    entry.saved = entry.text;
    if (lone) { entry.id = _osc.files[0].id; _osc.files = [entry]; _osc.current = -1; } else _osc.files.push(entry);
    idx = lone ? 0 : _osc.files.length - 1;
  }
  _oscActivate(idx);
  if (line >= 0) _oscGotoLine(line);
  _oscSave();
  return true;
}

function _oscActivate(idx) {
  if (idx !== _osc.current) _oscSyncFromEditor();
  _osc.current = Math.max(-1, Math.min(idx, _osc.files.length - 1));
  const f = _oscCurrent();
  _oscSwitchProject(_oscProjectOf(f?.path));
  const ed = _oscEl("osc-editor");
  if (ed && f) {
    ed.value = f.text;
    requestAnimationFrame(() => { ed.scrollTop = f.scrollTop || 0; _oscSyncScroll(); });
    if (f.sel) ed.setSelectionRange(f.sel[0], f.sel[1]);
  }
  _osc.selected = f?.path || _osc.selected;
  _oscTabsSync(f?.id ?? null);
  _oscRefreshEditor();
  _oscRenderTree();
  if (f && !_osc.entries.some((e) => e.key === _oscKey(f))) _oscScheduleAuto(300);
}

async function _oscCloseFile(idx) {
  const f = _osc.files[idx];
  if (!f) return false;
  if (idx === _osc.current) _oscSyncFromEditor();
  if (f.dirty && !(await _showConfirm(tf("oscCloseUnsaved", { name: f.name })))) return false;
  const shown = _osc.active && idx === _osc.current;
  _osc.files.splice(idx, 1);
  if (idx === _osc.current) _osc.current = -1;
  else if (idx < _osc.current) _osc.current--;
  // the next C file takes the closed one's place; the last one hands over to the other tabs
  if (shown && _osc.files.length) _oscActivate(Math.min(idx, _osc.files.length - 1));
  else _oscTabsSync();
  _oscSave();
  return true;
}

async function _oscSaveFile(idx = _osc.current, saveAs = false) {
  if (idx === _osc.current) _oscSyncFromEditor();
  const f = _osc.files[idx];
  if (!f) return false;
  let path = f.path;
  if (!path || saveAs) {
    const pick = await window.electronAPI?.oscarChooseFile?.(path ? _oscDir(path) : _osc.root, true, f.name);
    if (!pick || pick.canceled) return false;
    path = pick.path;
  }
  const res = await window.electronAPI?.saveTextFile?.(path, f.text);
  if (!res?.ok) { _oscStatus(res?.error || t("oscSaveFailed"), true); return false; }
  const oldKey = _oscKey(f);
  Object.assign(f, { path, name: _oscBase(path), saved: f.text, dirty: false });
  _oscAcForget(path);
  if (oldKey !== _oscKey(f) && _osc.bps.has(oldKey)) { _osc.bps.set(_oscKey(f), _osc.bps.get(oldKey)); _osc.bps.delete(oldKey); }
  _oscRenderTabs();
  _oscStatus(t("savedCheck"));
  _oscScheduleAuto(200);
  if (_osc.root && _oscNorm(path).startsWith(_oscNorm(_osc.root))) await _oscRefreshTree();
  _oscSave();
  return true;
}

async function _oscSaveAll() {
  for (let i = 0; i < _osc.files.length; i++) {
    if (_osc.files[i].dirty && _osc.files[i].path && !(await _oscSaveFile(i))) return false;
  }
  return true;
}

function _oscGotoLine(line, column = 0) {
  const ed = _oscEl("osc-editor");
  if (!ed) return;
  const lines = ed.value.split("\n");
  const l = Math.max(0, Math.min(line, lines.length - 1));
  let pos = 0;
  for (let i = 0; i < l; i++) pos += lines[i].length + 1;
  pos += Math.min(column, lines[l]?.length || 0);
  ed.focus({ preventScroll: true });
  ed.setSelectionRange(pos, pos);
  const lh = parseFloat(getComputedStyle(ed).lineHeight) || 21;
  const target = l * lh - ed.clientHeight / 3;
  if (l * lh < ed.scrollTop || l * lh > ed.scrollTop + ed.clientHeight - lh * 2) ed.scrollTop = Math.max(0, target);
  _oscSyncScroll();
  _oscUpdateCursor();
}

// ── Editor rendering ────────────────────────────────────────────────────────

function _oscBpSet(key = _oscKey(_oscCurrent())) {
  if (!_osc.bps.has(key)) _osc.bps.set(key, new Set());
  return _osc.bps.get(key);
}

function _oscRefreshEditor() {
  const ed = _oscEl("osc-editor");
  const code = _oscEl("osc-highlight-code");
  const gutter = _oscEl("osc-line-numbers-content");
  const panel = _oscEl("osc-panel");
  if (!ed || !code || !gutter) return;
  const f = _oscCurrent();
  const text = ed.value;
  const lines = text.split("\n");
  const errLines = new Map();
  for (const d of _osc.diags) {
    if (d.key === _oscKey(f)) errLines.set(d.line - 1, d.level);
  }
  const dbg = _osc.debugLine && _osc.debugLine.key === _oscKey(f) ? _osc.debugLine.line : -1;
  const html = _osc.hl ? _oscHighlight(text) : lines.map(_oscEsc);
  code.innerHTML = html.map((h, i) => {
    const cls = ["osc-line", errLines.has(i) ? `osc-line--${errLines.get(i)}` : "", i === dbg ? "osc-line--debug" : ""].filter(Boolean).join(" ");
    return `<span class="${cls}">${h || " "}</span>`;
  }).join("\n");
  const cyc = _osc.cycles && f && _osc.last?.ok ? _oscCycleMap(_osc.last.bytes, _osc.entries, _oscKey(f)) : null;
  const bps = _oscBpSet();
  const bms = _oscBmSet();
  let cycChars = 0;
  gutter.innerHTML = lines.map((_, i) => {
    const c = cyc?.get(i);
    const cText = c ? (c.min === c.max ? String(c.min) : `${c.min}-${c.max}`) : "";
    cycChars = Math.max(cycChars, cText.length);
    const cls = ["source-line-number", "bp-toggle", bps.has(i) ? "bp-active" : "", bms.has(i) ? "bm-active" : "", i === dbg ? "ub-execution-gutter-line" : ""].filter(Boolean).join(" ");
    return `<button type="button" class="${cls}" data-line="${i}">${cyc ? `<span class="osc-cyc${c?.warn ? " osc-cyc--warn" : ""}">${cText}</span>` : ""}${i + 1}</button>`;
  }).join("");
  // both columns from the gutter font's advance: a larger font must not clip the cycle text
  const digits = String(lines.length).length;
  const gst = getComputedStyle(gutter);
  const c2d = (_oscRefreshEditor.canvas ||= document.createElement("canvas")).getContext("2d");
  c2d.font = `${gst.fontSize} ${gst.fontFamily}`;
  const charW = c2d.measureText("0000000000").width / 10 || 8;
  const cycW = cyc ? Math.ceil(Math.max(3, cycChars) * charW * 0.85 + charW) : 0;
  panel?.style.setProperty("--osc-cyc-width", `${cycW}px`);
  const width = (cycW ? cycW + 8 : 0) + Math.max(48, Math.ceil(22 + digits * charW));
  panel?.style.setProperty("--ub-line-number-width", `${width}px`);
  panel?.classList.toggle("ub-show-lines", _osc.lines);
  _oscRenderSymbols();
  _oscSyncScroll();
  _oscUpdateCursor();
  _oscDrawMinimap();
}

// ── Expert-style tools: bookmarks, find, format, minimap, build info ─────────────────

function _oscBmSet(key = _oscKey(_oscCurrent())) {
  if (!_osc.bms.has(key)) _osc.bms.set(key, new Set());
  return _osc.bms.get(key);
}

function _oscCaretLine() {
  const ed = _oscEl("osc-editor");
  return ed ? ed.value.slice(0, ed.selectionStart).split("\n").length - 1 : 0;
}

function _oscBmToggle(line = _oscCaretLine()) {
  const set = _oscBmSet();
  if (set.has(line)) set.delete(line); else set.add(line);
  _oscRefreshEditor();
  _oscSave();
}

function _oscBmJump(dir) {
  const lines = [..._oscBmSet()].sort((a, b) => a - b);
  if (!lines.length) return;
  const cur = _oscCaretLine();
  const target = dir > 0 ? (lines.find((l) => l > cur) ?? lines[0]) : ([...lines].reverse().find((l) => l < cur) ?? lines[lines.length - 1]);
  _oscGotoLine(target);
}

function _oscBmClear() {
  _oscBmSet().clear();
  _oscRefreshEditor();
  _oscSave();
}

// Bookmarks follow the edited text: above the change they stay, below it they shift.
function _oscBmTrack(prev, text) {
  const set = _oscBmSet();
  if (!set.size || typeof prev !== "string" || prev === text) return;
  const a = prev.split("\n"), b = text.split("\n");
  let p = 0;
  while (p < a.length && p < b.length && a[p] === b[p]) p++;
  let s = 0;
  while (s < a.length - p && s < b.length - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  const oldEnd = a.length - s, newEnd = b.length - s, delta = b.length - a.length;
  const moved = [...set].map((l) => (l < p ? l : l >= oldEnd ? l + delta : Math.min(l, Math.max(p, newEnd - 1))));
  set.clear();
  moved.forEach((l) => set.add(l));
}

// the shared Go to line dialog of the UB / Expert editors
function _oscGotoAsk() {
  _gotoLineOpen("oscar");
}

function _oscOpenFind() {
  const bar = _oscEl("osc-find-bar");
  const ed = _oscEl("osc-editor");
  if (!bar || !ed) return;
  bar.hidden = false;
  _oscEl("osc-find-btn")?.classList.add("expert-hl-toggle--on");
  const input = _oscEl("osc-find-input");
  const sel = ed.value.slice(ed.selectionStart, ed.selectionEnd);
  if (sel && sel.length < 80 && !sel.includes("\n")) input.value = sel;
  input.focus();
  input.select();
  _oscFind(0);
}

function _oscCloseFind() {
  const bar = _oscEl("osc-find-bar");
  if (bar) bar.hidden = true;
  _oscEl("osc-find-btn")?.classList.remove("expert-hl-toggle--on");
  _osc.find = { matches: [], index: -1 };
  _oscEl("osc-editor")?.focus();
}

function _oscFind(direction = 0) {
  const ed = _oscEl("osc-editor");
  const term = _oscEl("osc-find-input")?.value || "";
  if (!ed) return;
  const matches = [];
  if (term) {
    const hay = ed.value.toLowerCase(), needle = term.toLowerCase();
    for (let at = hay.indexOf(needle); at >= 0; at = hay.indexOf(needle, at + Math.max(1, needle.length))) matches.push(at);
  }
  let index = _osc.find.index;
  if (!matches.length) index = -1;
  else if (direction === 0) index = 0;
  else index = (index + direction + matches.length) % matches.length;
  _osc.find = { matches, index };
  const count = _oscEl("osc-find-count");
  if (count) {
    count.textContent = !term ? "" : index < 0 ? "0 / 0" : `${index + 1} / ${matches.length}`;
    count.style.color = term && index < 0 ? "var(--error, #f44)" : "";
  }
  if (index < 0) return;
  const start = matches[index];
  const line = ed.value.slice(0, start).split("\n").length - 1;
  _oscGotoLine(line, start - ed.value.lastIndexOf("\n", start - 1) - 1);
  ed.setSelectionRange(start, start + term.length);
  if (direction === 0) _oscEl("osc-find-input")?.focus();
}

// Re-indents C by brace depth (4 spaces): case / default one level out inside a switch, the body
// of an if / for / while / else without braces one level in; comments and strings do not count;
// lines inside a block comment and preprocessor lines keep their text.
function _oscFormat(text) {
  const out = [];
  const stack = [];
  let comment = false;
  let pending = false;
  let switchNext = false;
  for (const raw of String(text).split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (comment) {
      out.push(line);
      if (line.includes("*/")) comment = false;
      continue;
    }
    const body = line.trim();
    if (!body) { out.push(""); continue; }
    if (body.startsWith("#")) { out.push(body); continue; }
    let code = body.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""').replace(/\/\*.*?\*\//g, " ").replace(/\/\/.*$/, "");
    const open = code.indexOf("/*");
    if (open >= 0) { code = code.slice(0, open); comment = true; }
    const lead = (code.match(/^}+/) || [""])[0].length;
    let depth = stack.length - Math.min(lead, stack.length);
    const inSwitch = stack[depth - 1] === "switch";
    if (inSwitch && !/^(case\b|default\s*:)/.test(body) && !body.startsWith("}")) depth++;
    if (pending && !code.startsWith("{")) depth++;
    out.push("    ".repeat(Math.max(0, depth)) + body);
    for (const ch of code) {
      if (ch === "{") { stack.push(switchNext ? "switch" : "block"); switchNext = false; }
      else if (ch === "}") stack.pop();
    }
    if (/^switch\b/.test(code) && !code.includes("{")) switchNext = true;
    if (/^switch\b/.test(code) && code.includes("{")) stack[stack.length - 1] = "switch";
    const c = code.trim();
    pending = !pending && /^(if|for|while|else(\s+if)?)\b/.test(c) && !/[;{}]$/.test(c);
  }
  return out.join("\n");
}

function _oscFormatCurrent() {
  const ed = _oscEl("osc-editor");
  if (!ed) return;
  const formatted = _oscFormat(ed.value);
  if (formatted === ed.value) return;
  const caret = _oscCaretLine();
  ed.focus();
  ed.select();
  if (!document.execCommand?.("insertText", false, formatted)) {
    ed.value = formatted;
    ed.dispatchEvent(new Event("input"));
  }
  _oscGotoLine(caret);
}

function _oscToggleMinimap() {
  _osc.minimap = !_osc.minimap;
  _oscApplyMinimap();
  _oscSave();
}

function _oscApplyMinimap() {
  _oscEl("osc-panel")?.classList.toggle("ub-show-minimap", _osc.minimap);
  const btn = _oscEl("osc-minimap-btn");
  btn?.classList.toggle("expert-hl-toggle--on", _osc.minimap);
  btn?.setAttribute("aria-pressed", String(_osc.minimap));
  _oscDrawMinimap();
}

function _oscDrawMinimap() {
  const canvas = _oscEl("osc-minimap");
  const ed = _oscEl("osc-editor");
  if (!_osc.minimap || !canvas || !ed || !canvas.offsetWidth || !canvas.offsetHeight) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.offsetWidth, height = canvas.offsetHeight;
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const css = getComputedStyle(document.documentElement);
  const color = (name, fb) => css.getPropertyValue(name).trim() || fb;
  ctx.fillStyle = color("--expert-editor-bg", "#1a1b26");
  ctx.fillRect(0, 0, width, height);
  const lines = ed.value.split("\n");
  const linePx = 2;
  const lh = ed.scrollHeight / (lines.length || 1);
  const top = ed.scrollTop / lh, visible = ed.clientHeight / lh;
  const offset = lines.length * linePx > height ? Math.max(0, Math.min(lines.length * linePx - height, (top + visible / 2) * linePx - height / 2)) : 0;
  const first = Math.floor(offset / linePx);
  const cols = { comment: color("--hl-comment", "#6a9955"), pp: color("--hl-macro", "#c586c0"), kw: color("--hl-mnem", "#dcdcaa"), text: color("--hl-label", "#9cdcfe") };
  let comment = false;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    const isComment = comment || t.startsWith("//") || t.startsWith("/*");
    if (t.includes("/*") && !t.includes("*/")) comment = true;
    else if (comment && t.includes("*/")) comment = false;
    if (i < first || !t) continue;
    const y = i * linePx - offset;
    if (y > height) break;
    const indent = lines[i].length - lines[i].trimStart().length;
    ctx.fillStyle = isComment ? cols.comment : t.startsWith("#") ? cols.pp : /^(if|for|while|return|switch|else|do|static|const|void|int|char|unsigned)\b/.test(t) ? cols.kw : cols.text;
    ctx.globalAlpha = 0.75;
    ctx.fillRect(4 + Math.min(indent, 40) * 1.2, y, Math.min(t.length, 70) * 1.1, 1.4);
  }
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = color("--primary", "#2563eb");
  ctx.fillRect(0, top * linePx - offset, width, Math.max(6, visible * linePx));
  ctx.globalAlpha = 1;
  canvas._oscOffset = offset;
}

function _oscMinimapScroll(e) {
  const canvas = _oscEl("osc-minimap");
  const ed = _oscEl("osc-editor");
  if (!canvas || !ed) return;
  const lines = ed.value.split("\n").length || 1;
  const line = (e.clientY - canvas.getBoundingClientRect().top + (canvas._oscOffset || 0)) / 2;
  const lh = ed.scrollHeight / lines;
  ed.scrollTop = Math.max(0, line * lh - ed.clientHeight / 2);
  _oscSyncScroll();
  _oscDrawMinimap();
}

// The output panel on a view (Listing / Monitor buttons of the toolbar).
function _oscShowView(view) {
  if (!_osc.output) _oscToggle("output", true);
  _osc.view = view;
  _oscRenderOutput();
  _oscSave();
  if (!_osc.last?.ok) _oscScheduleAuto(0);
}

function _oscBuildInfo() {
  const dlg = document.getElementById("build-info-dialog");
  const content = document.getElementById("build-info-content");
  if (!dlg || !content) return;
  const title = document.getElementById("build-info-title");
  if (title) title.textContent = t("buildInfoTitle");
  const res = _osc.last;
  const hex = (v) => `$${(v & 0xFFFF).toString(16).toUpperCase().padStart(4, "0")}`;
  const file = res?.primary || _oscCurrent()?.path || "";
  let html = `<div class="build-info-path"><span class="build-info-path-key">${_oscEsc(t("buildInfoFile"))}</span><code class="build-info-path-val">${_oscEsc(file || t("buildInfoUnsaved"))}</code></div>`;
  if (!res?.ok || !res.bytes || res.bytes.length < 3) {
    const errs = _osc.diags.filter((d) => d.level === "error");
    html += errs.length
      ? `<section class="build-info-section"><div class="build-info-section-label">${_oscEsc(t("buildInfoErrors"))} <span class="build-info-count">${errs.length}</span></div><ul class="build-info-list build-info-list--err">${errs.map((d) => `<li>${_oscEsc(`${_oscBase(d.file || "")}:${d.line}: ${d.message}`)}</li>`).join("")}</ul></section>`
      : `<p>${_oscEsc(t("oscBuildFirst"))}</p>`;
  } else {
    const load = res.bytes[0] | (res.bytes[1] << 8);
    const size = res.bytes.length - 2;
    const stats = [[t("buildInfoOrigin"), hex(load)], [t("buildInfoEnd"), hex(load + size - 1)], [t("buildInfoSize"), `${size} bytes`], [t("oscOptimize"), `-${_osc.lastOptimize || _osc.optimize || "O2"}`]];
    html += `<div class="build-info-stats">${stats.map(([k, v]) => `<div class="build-info-stat"><span class="build-info-stat-key">${_oscEsc(k)}</span><span class="build-info-stat-val">${_oscEsc(v)}</span></div>`).join("")}</div>`;
    const syms = (res.symbols || []).slice().sort((a, b) => a.address - b.address);
    if (syms.length) {
      html += `<section class="build-info-section"><div class="build-info-section-label">${_oscEsc(t("buildInfoLabels"))} <span class="build-info-count">${syms.length}</span></div>`
        + `<div class="build-info-grid">${syms.map((s) => `<div class="build-info-item"><span class="build-info-item-key">${_oscEsc(s.name)}</span><span class="build-info-item-val">${hex(s.address)}</span></div>`).join("")}</div></section>`;
    }
  }
  content.innerHTML = html;
  dlg.showModal();
}

// Functions, types and macros of the current file (the panel under the project tree).
function _oscSymbols(text) {
  const out = { functions: [], types: [], macros: [] };
  const lines = String(text).split("\n");
  let depth = 0;
  let comment = false;
  for (let i = 0; i < lines.length; i++) {
    // comments and strings out, so their braces do not count
    let line = lines[i];
    if (comment) {
      const end = line.indexOf("*/");
      if (end < 0) continue;
      line = line.slice(end + 2);
      comment = false;
    }
    line = line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""').replace(/\/\*.*?\*\//g, " ").replace(/\/\/.*$/, "");
    const open = line.indexOf("/*");
    if (open >= 0) { line = line.slice(0, open); comment = true; }
    if (depth === 0) {
      const def = /^\s*#\s*define\s+([A-Za-z_]\w*)/.exec(line);
      if (def) { out.macros.push({ name: def[1], line: i }); continue; }
      const type = /^\s*(?:typedef\s+)?(struct|union|enum)\s+([A-Za-z_]\w*)\s*(\{|$)/.exec(line);
      if (type) out.types.push({ name: type[2], line: i });
      const fn = /^(?!\s*(?:if|for|while|switch|return|else|do|sizeof)\b)[\w\s*&:<>,]*?\b([A-Za-z_]\w*)\s*\(([^;]*)$/.exec(line);
      if (fn && !/^\s*#/.test(line) && !/=/.test(line.slice(0, line.indexOf(fn[1])))) {
        // a definition: "{" on this line or on the next non-empty one
        let next = line.slice(line.indexOf("(")).includes("{");
        for (let j = i + 1; !next && j < Math.min(lines.length, i + 6); j++) {
          const l = lines[j].trim();
          if (!l) continue;
          if (l.startsWith("{")) next = true;
          if (/[;{}]/.test(l)) break;
        }
        if (next) out.functions.push({ name: fn[1], line: i });
      }
    }
    for (const ch of line) {
      if (ch === "{") depth++;
      else if (ch === "}") depth = Math.max(0, depth - 1);
    }
  }
  const typedefEnd = /^\s*\}\s*([A-Za-z_]\w*)\s*;/;
  lines.forEach((l, i) => { const m = typedefEnd.exec(l); if (m && !out.types.some((x) => x.name === m[1])) out.types.push({ name: m[1], line: i }); });
  out.types.sort((a, b) => a.line - b.line);
  return out;
}

function _oscRenderSymbols() {
  const host = _oscEl("osc-project-symbols");
  if (!host) return;
  const f = _oscCurrent();
  const groups = _oscSymbols(f?.text || "");
  const icons = {
    functions: '<svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M3 11c2-1 2-7 4-8M4 6h5M8.5 8.5l2.5 2.5M11 8.5 8.5 11" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
    types: '<svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M3 2.5h8v9H3z" stroke="currentColor" stroke-width="1.1"/><path d="M5 5h4M5 7h4M5 9h2" stroke="currentColor" stroke-width="1"/></svg>',
    macros: '<svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M4 2.5 3 11.5M10 2.5l-1 9M2 5h10M1.5 9h10" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>',
  };
  const titles = { functions: t("ubFunctions"), types: t("oscTypes"), macros: t("oscMacros") };
  const html = [];
  for (const [kind, list] of Object.entries(groups)) {
    if (!list.length) continue;
    html.push(`<div class="expert-project-symbols-label">${_oscEsc(titles[kind])}</div>`);
    for (const e of list) {
      html.push(`<div class="expert-project-item expert-project-item--file osc-symbol" data-line="${e.line}"><span class="expert-project-item-icon">${icons[kind]}</span>`
        + `<span class="expert-project-item-name" aria-label="${_oscEsc(`${e.name} · ${t("ubLine")} ${e.line + 1}`)}">${_oscEsc(e.name)}</span></div>`);
    }
  }
  const key = html.join("") || `<div class="expert-project-empty">${_oscEsc(t("oscNoSymbols"))}</div>`;
  if (host._html !== key) { host._html = key; host.innerHTML = key; }
}

function _oscSyncScroll() {
  const ed = _oscEl("osc-editor");
  const hl = _oscEl("osc-highlight");
  const gutter = _oscEl("osc-line-numbers-content");
  if (!ed) return;
  if (hl) { hl.scrollTop = ed.scrollTop; hl.scrollLeft = ed.scrollLeft; }
  if (gutter) gutter.style.transform = `translateY(${-ed.scrollTop}px)`;
}

function _oscUpdateCursor() {
  const ed = _oscEl("osc-editor");
  const el = _oscEl("osc-cursor-pos");
  if (!ed || !el) return;
  const before = ed.value.slice(0, ed.selectionStart);
  const line = before.split("\n").length;
  const col = before.length - before.lastIndexOf("\n");
  let text = tf("oscCursor", { line, col });
  // cycles of the selected lines
  if (ed.selectionEnd > ed.selectionStart && _osc.cycles && _osc.last?.ok && _oscCurrent()) {
    const last = ed.value.slice(0, ed.selectionEnd).split("\n").length;
    const map = _oscCycleMap(_osc.last.bytes, _osc.entries, _oscKey(_oscCurrent()));
    let min = 0, max = 0;
    for (let l = line - 1; l < last; l++) { const c = map.get(l); if (c) { min += c.min; max += c.max; } }
    if (max) text += " · " + tf("oscSelCycles", { cycles: min === max ? min : `${min}-${max}`, lines: (max / 63).toFixed(1) });
  }
  el.textContent = text;
}

function _oscRenderTabs() {
  _oscTabsSync();
  const host = _oscEl("osc-tabs");
  if (!host || host.hidden) return;
  host.innerHTML = _osc.files.map((f, i) => {
    const startup = _osc.proj.startupFile && _oscNorm(f.path) === _oscNorm(_oscProjAbs(_osc.proj.startupFile));
    return `<div class="osc-tab${i === _osc.current ? " osc-tab--active" : ""}" role="tab" data-index="${i}" title="${_oscEsc(f.path || f.name)}">`
      + `${startup ? '<span class="osc-tab-star">★</span>' : ""}<span class="osc-tab-name">${_oscEsc(f.name)}${f.dirty ? " ●" : ""}</span>`
      + `<button type="button" class="osc-tab-close" data-close="${i}" aria-label="${_oscEsc(t("oscCloseFile"))}">×</button></div>`;
  }).join("");
}

// ── Project ─────────────────────────────────────────────────────────────────

function _oscProjAbs(rel) {
  if (!rel) return "";
  if (/^([a-z]:)?[\\/]/i.test(rel)) return rel;
  return _osc.root ? _oscJoin(_osc.root, rel.replace(/\//g, _oscSep(_osc.root))) : rel;
}

function _oscProjRel(abs) {
  const root = _oscNorm(_osc.root).replace(/\/+$/, "") + "/";
  const n = _oscNorm(abs);
  return n.startsWith(root) ? String(abs).replace(/\\/g, "/").slice(root.length) : abs;
}

async function _oscWriteProj() {
  if (!_osc.root) return;
  if (!_osc.projPath) _osc.projPath = _oscJoin(_osc.root, `${_oscBase(_osc.root)}.proj`);
  const data = { app: "oscar64", name: _oscBase(_osc.root), ..._osc.proj };
  await window.electronAPI?.saveTextFile?.(_osc.projPath, JSON.stringify(data, null, 2) + "\n");
}

function _oscRegisterProject() {
  if (!_osc.root) return;
  _osc.projects.set(_oscNorm(_osc.root).replace(/\/+$/, ""), { root: _osc.root, projPath: _osc.projPath, proj: _osc.proj, tree: _osc.tree });
}

// The project a file belongs to: the deepest opened project folder that holds it.
function _oscProjectOf(path) {
  const n = _oscNorm(path);
  if (!n) return null;
  let best = null;
  for (const [key, pr] of _osc.projects) {
    if (n.startsWith(key + "/") && (!best || key.length > best.key.length)) best = { key, pr };
  }
  return best?.pr || null;
}

// The tree, the startup file, the targets and the switches follow the project of the open file.
function _oscSwitchProject(pr) {
  if (!pr || _oscNorm(pr.root) === _oscNorm(_osc.root)) return;
  _oscRegisterProject();
  Object.assign(_osc, { root: pr.root, projPath: pr.projPath, proj: pr.proj, tree: pr.tree || [] });
  _oscRenderTree();
  _oscRenderTabs();
  if (!pr.tree) _oscRefreshTree();
  _oscSave();
}

// A project of an earlier session, without opening its files (its .proj only).
async function _oscLoadProjectMeta(root, projPath) {
  if (!root || !projPath || _osc.projects.has(_oscNorm(root).replace(/\/+$/, ""))) return;
  const res = await window.electronAPI?.readTextFile?.(projPath);
  try {
    const data = JSON.parse(res?.content || "");
    if (data?.app !== "oscar64") return;
    _osc.projects.set(_oscNorm(root).replace(/\/+$/, ""), { root, projPath, proj: { startupFile: "", optimize: "O2", defines: [], includeDirs: [], ...data }, tree: null });
  } catch (_) {}
}

async function _oscOpenProject(root) {
  if (!root) {
    const pick = await window.electronAPI?.oscarChooseFolder?.(_osc.root);
    if (!pick || pick.canceled) return;
    root = pick.path;
  }
  _osc.root = root;
  _osc.projPath = "";
  _osc.proj = { startupFile: "", optimize: "O2", defines: [], includeDirs: [] };
  await _oscRefreshTree();
  for (const e of _osc.tree.filter((x) => !x.dir && /\.proj$/i.test(x.name))) {
    const res = await window.electronAPI?.readTextFile?.(e.path);
    try {
      const data = JSON.parse(res?.content || "");
      if (data?.app === "oscar64") {
        _osc.projPath = e.path;
        _osc.proj = { ..._osc.proj, ...data };
        break;
      }
    } catch (_) {}
  }
  if (!_osc.projPath) {
    // a folder with a build script but no project: the script's programs become the targets
    const script = ["build.sh", "make.bat", "makefile", "Makefile", "build.bat"].map((n) => _osc.tree.find((x) => !x.dir && x.name === n)).find(Boolean);
    if (script) { await _oscImportBuildScript(script.path); return; }
  }
  if (!_osc.proj.startupFile) {
    const main = _osc.tree.find((x) => !x.dir && /^main\.c$/i.test(x.name)) || _osc.tree.find((x) => !x.dir && /\.c$/i.test(x.name));
    if (main) _osc.proj.startupFile = main.name;
  }
  _oscRegisterProject();
  if (!_osc.restoring) globalThis._studioRememberProject?.(root, _osc.proj.name || _oscBase(root), "c");
  // the saved session (.proj.user) first; without it the C sources of the project folder open as tabs
  // (not its subfolders), the startup file is the active one
  if (!(await globalThis._projUserRestore?.("c", _oscProjUserTarget().projPath))) {
    const startupAbs = _osc.proj.startupFile ? _oscNorm(_oscProjAbs(_osc.proj.startupFile)) : "";
    for (const e of _osc.tree.filter((x) => !x.dir && /\.(c|h)$/i.test(x.name)).slice(0, 24)) {
      if (_oscNorm(e.path) !== startupAbs) await _oscOpenPath(e.path);
    }
    if (_osc.proj.startupFile) await _oscOpenPath(_oscProjAbs(_osc.proj.startupFile));
  }
  _oscRenderAll();
  _oscSave();
}

// The C project for app.js's session file (<name>.proj.user next to the .proj, or where it will be).
function _oscProjUserTarget() {
  if (!_osc.root) return null;
  return { kind: "c", projPath: _osc.projPath || _oscJoin(_osc.root, `${_oscBase(_osc.root)}.proj`) };
}
function _oscTabPath(id) {
  return _osc.files.find((f) => f.id === id)?.path || "";
}

async function _oscNewProject() {
  const pick = await window.electronAPI?.oscarChooseFolder?.(_osc.root ? _oscDir(_osc.root) : "");
  if (!pick || pick.canceled) return;
  const name = (await _oscAsk(t("oscProjectName"), "c64-project"))?.trim();
  if (!name || /[\\/:*?"<>|]/.test(name)) return;
  const root = _oscJoin(pick.path, name);
  const main = _oscJoin(root, "main.c");
  const listed = await window.electronAPI?.oscarListDir?.(root);
  if (listed?.ok && listed.entries.length) { _oscStatus(t("oscProjectExists"), true); return; }
  const source = `// ${name} — Oscar64\n#include <stdio.h>\n#include <c64/vic.h>\n\nint main(void)\n{\n    vic.color_border = VCOL_BLACK;\n    vic.color_back = VCOL_BLUE;\n    printf("HELLO FROM OSCAR64\\n");\n    return 0;\n}\n`;
  // one project at a time: the open one closes (before anything is written)
  if (typeof _studioCloseAll === "function" && !await _studioCloseAll()) return;
  const res = await window.electronAPI?.saveTextFile?.(main, source);
  if (!res?.ok) { _oscStatus(res?.error || t("oscSaveFailed"), true); return; }
  _osc.root = root;
  _osc.proj = { startupFile: "main.c", optimize: "O2", defines: [], includeDirs: [] };
  _osc.projPath = "";
  await _oscWriteProj();
  await _oscOpenProject(root);
  _oscEnter();
}

async function _oscRefreshTree() {
  if (!_osc.root) { _osc.tree = []; _oscRenderTree(); return; }
  const root = _osc.root;
  const res = await window.electronAPI?.oscarListDir?.(root);
  if (root !== _osc.root) return; // switched to another project meanwhile
  _osc.tree = res?.ok ? res.entries : [];
  const pr = _osc.projects.get(_oscNorm(root).replace(/\/+$/, ""));
  if (pr) pr.tree = _osc.tree;
  _oscRenderTree();
}

// The open file in the tree: its project, its folders opened, the row selected and scrolled to.
async function _oscRevealCurrent() {
  const f = _oscCurrent();
  if (!f?.path) { _oscStatus(t("oscRevealNotInProject"), true); return; }
  _oscSwitchProject(_oscProjectOf(f.path));
  const root = _oscNorm(_osc.root).replace(/\/+$/, "");
  const n = _oscNorm(f.path);
  if (!root || !n.startsWith(root + "/")) { _oscStatus(t("oscRevealNotInProject"), true); return; }
  if (!_oscFindEntry(f.path)) await _oscRefreshTree();
  if (!_oscFindEntry(f.path)) { _oscStatus(t("oscRevealNotInProject"), true); return; }
  if (!_osc.project) _oscToggle("project", true);
  // every folder between the root and the file
  const parts = n.slice(root.length + 1).split("/");
  for (let i = 1; i < parts.length; i++) _osc.expanded.add(`${root}/${parts.slice(0, i).join("/")}`);
  _osc.selected = f.path;
  _oscRenderTree();
  _oscSave();
  const row = [..._oscEl("osc-project-files")?.querySelectorAll(".osc-tree-item") || []].find((r) => _oscNorm(r.dataset.path) === n);
  if (!row) return;
  row.scrollIntoView({ block: "center" });
  row.classList.remove("osc-tree-item--flash");
  void row.offsetWidth;
  row.classList.add("osc-tree-item--flash");
}

function _oscRenderTree() {
  const host = _oscEl("osc-project-files");
  const nameEl = _oscEl("osc-project-name");
  if (nameEl) nameEl.textContent = _osc.root ? _oscBase(_osc.root) : t("oscNoProject");
  if (!host) return;
  if (!_osc.root) { host.innerHTML = `<p class="osc-tree-empty">${_oscEsc(t("oscTreeHint"))}</p>`; return; }
  const startup = _oscNorm(_oscProjAbs(_osc.proj.startupFile));
  const open = new Map(_osc.files.map((f) => [_oscNorm(f.path), f]));
  const rows = [];
  const walk = (entries, depth) => {
    for (const e of entries) {
      const n = _oscNorm(e.path);
      const exp = _osc.expanded.has(n);
      const f = open.get(n);
      const cls = ["expert-project-item", "osc-tree-item", e.dir ? "osc-tree-dir" : "osc-tree-file",
        n === _oscNorm(_osc.selected) ? "osc-tree-item--selected" : "", f?.dirty ? "ub-project-file-dirty" : "",
        !e.dir && !_OSC_SOURCE_EXT.test(e.name) ? "osc-tree-other" : ""].filter(Boolean).join(" ");
      const icon = e.dir ? (exp ? "▾" : "▸") : n === startup ? "★" : _oscTargetIndex(e.path) >= 0 ? "◆" : "·";
      rows.push(`<div class="${cls}" data-path="${_oscEsc(e.path)}" data-dir="${e.dir ? 1 : 0}" style="padding-left:${8 + depth * 14}px">`
        + `<span class="osc-tree-icon">${icon}</span><span class="expert-project-item-name">${_oscEsc(e.name)}</span></div>`);
      if (e.dir && exp) walk(e.children || [], depth + 1);
    }
  };
  walk(_osc.tree, 0);
  host.innerHTML = rows.join("") || `<p class="osc-tree-empty">${_oscEsc(t("oscTreeEmpty"))}</p>`;
}

function _oscFindEntry(path, list = _osc.tree) {
  const n = _oscNorm(path);
  for (const e of list) {
    if (_oscNorm(e.path) === n) return e;
    const c = e.dir && _oscFindEntry(path, e.children || []);
    if (c) return c;
  }
  return null;
}

// Where a new file / folder goes: the selected folder, the folder of the selected file, else the root.
function _oscTargetDir() {
  const e = _osc.selected ? _oscFindEntry(_osc.selected) : null;
  if (e?.dir) return e.path;
  if (e) return _oscDir(e.path);
  return _osc.root;
}

async function _oscCreateFile(dir = _oscTargetDir()) {
  if (!_osc.root) { _oscNewFile(""); return; }
  const name = (await _oscAsk(t("oscFileName"), "new.c"))?.trim();
  if (!name || /[\\/:*?"<>|]/.test(name)) return;
  const path = _oscJoin(dir, name);
  if (_oscFindEntry(path)) { _oscStatus(t("oscExists"), true); return; }
  const guard = /\.h$/i.test(name) ? name.replace(/\W/g, "_").toUpperCase() : "";
  const text = guard ? `#ifndef ${guard}\n#define ${guard}\n\n\n#endif\n` : "";
  const res = await window.electronAPI?.saveTextFile?.(path, text);
  if (!res?.ok) { _oscStatus(res?.error || t("oscSaveFailed"), true); return; }
  _osc.expanded.add(_oscNorm(dir));
  await _oscRefreshTree();
  await _oscOpenPath(path);
}

async function _oscCreateFolder(dir = _oscTargetDir()) {
  if (!_osc.root) return;
  const name = (await _oscAsk(t("oscFolderName"), "src"))?.trim();
  if (!name || /[\\/:*?"<>|]/.test(name)) return;
  const res = await window.electronAPI?.oscarCreateDir?.(_osc.root, _oscJoin(dir, name));
  if (!res?.ok) { _oscStatus(res?.error || t("oscSaveFailed"), true); return; }
  _osc.expanded.add(_oscNorm(dir));
  await _oscRefreshTree();
}

async function _oscRename(entry) {
  const name = (await _oscAsk(t("oscRenameTo"), entry.name))?.trim();
  if (!name || name === entry.name || /[\\/:*?"<>|]/.test(name)) return;
  const to = _oscJoin(_oscDir(entry.path), name);
  const res = await window.electronAPI?.oscarRenamePath?.(_osc.root, entry.path, to);
  if (!res?.ok) { _oscStatus(res?.error || t("oscSaveFailed"), true); return; }
  const from = _oscNorm(entry.path);
  for (const f of _osc.files) {
    const n = _oscNorm(f.path);
    if (n === from || n.startsWith(from + "/")) { f.path = to + f.path.slice(entry.path.length); f.name = _oscBase(f.path); }
  }
  if (_oscNorm(_oscProjAbs(_osc.proj.startupFile)) === from) { _osc.proj.startupFile = _oscProjRel(to); await _oscWriteProj(); }
  await _oscRefreshTree();
  _oscRenderTabs();
  _oscSave();
}

async function _oscDelete(entry) {
  if (!(await _showConfirm(tf(entry.dir ? "oscDeleteFolderConfirm" : "oscDeleteFileConfirm", { name: entry.name })))) return;
  const res = await window.electronAPI?.oscarDeletePath?.(_osc.root, entry.path);
  if (!res?.ok) { _oscStatus(res?.error || t("oscSaveFailed"), true); return; }
  const gone = _oscNorm(entry.path);
  _osc.files = _osc.files.filter((f) => { const n = _oscNorm(f.path); return !(n === gone || n.startsWith(gone + "/")); });
  _osc.current = -1;
  if (!_osc.files.length) _oscNewFile(""); else _oscActivate(0);
  await _oscRefreshTree();
  _oscSave();
}

async function _oscSetStartup(entry) {
  const ti = _oscTargetIndex(entry.path);
  if (ti >= 0) { await _oscSelectTarget(ti); return; }
  _osc.proj.startupFile = _oscProjRel(entry.path);
  await _oscWriteProj();
  _oscRenderTree();
  _oscRenderTabs();
  _oscStatus(tf("oscStartupSet", { name: entry.name }));
  _oscScheduleAuto(0);
}

function _oscTreeMenu(e, entry) {
  const items = [];
  if (entry && !entry.dir) {
    if (_OSC_TEXT_FILE.test(entry.name)) items.push({ label: t("oscOpen"), run: () => _oscOpenPath(entry.path) });
    items.push({ label: t("projOpenSystem"), run: () => _projOpenInSystem(entry.path) });
    if (/\.(c|cpp)$/i.test(entry.name)) items.push({ label: t("oscSetStartup"), run: () => _oscSetStartup(entry) });
    if (_OSC_SCRIPT_NAMES.test(entry.name) || /\.(sh|bat|cmd|mk)$/i.test(entry.name)) items.push({ label: t("oscImportScript"), run: () => _oscImportBuildScript(entry.path) });
  }
  items.push({ label: t("oscNewFile"), run: () => _oscCreateFile(entry ? (entry.dir ? entry.path : _oscDir(entry.path)) : _osc.root) });
  items.push({ label: t("oscNewFolder"), run: () => _oscCreateFolder(entry ? (entry.dir ? entry.path : _oscDir(entry.path)) : _osc.root) });
  if (entry) {
    items.push({ label: t("oscRename"), run: () => _oscRename(entry) });
    items.push({ label: t("oscDelete"), run: () => _oscDelete(entry) });
    items.push({ label: t("projRevealFileManager"), run: () => window.electronAPI?.revealInFileManager?.(entry.path) });
  }
  _edShowCtxMenu(e, document.body, items);
}

// A one-line question in the project panel (name of a file, folder, project).
function _oscAsk(label, value = "") {
  const form = _oscEl("osc-ask");
  const input = _oscEl("osc-ask-input");
  const lab = _oscEl("osc-ask-label");
  if (!form || !input) return Promise.resolve(null);
  if (!_osc.project) _oscToggle("project", true);
  _oscAsk.resolve?.(null);
  lab.textContent = label;
  input.value = value;
  form.hidden = false;
  input.focus();
  const dot = value.lastIndexOf(".");
  input.setSelectionRange(0, dot > 0 ? dot : value.length);
  return new Promise((resolve) => { _oscAsk.resolve = resolve; });
}

function _oscAskClose(ok) {
  const form = _oscEl("osc-ask");
  const input = _oscEl("osc-ask-input");
  if (!form || form.hidden) return;
  form.hidden = true;
  const resolve = _oscAsk.resolve;
  _oscAsk.resolve = null;
  resolve?.(ok ? input.value : null);
  _oscEl("osc-editor")?.focus();
}

// ── Build scripts (build.sh / make.bat / makefile) ──────────────────────────
// The Oscar64 samples build one program per compiler call, each with its own switches. A script
// becomes the project's targets: { name, source (relative to the root), args }.

const _OSC_SCRIPT_NAMES = /^(build\.sh|make\.bat|build\.bat|make\.cmd|build\.cmd|makefile|gnumakefile)$/i;
const _OSC_COMPILER = /(^|[\\/])oscar64(\.exe)?$/i;

// a/b/../c → a/c; absolute paths stay absolute
function _oscResolve(dir, rel) {
  rel = String(rel || "").replace(/^["']|["']$/g, "");
  const abs = /^([a-z]:)?[\\/]/i.test(rel);
  const parts = (abs ? rel : `${dir}/${rel}`).replace(/\\/g, "/").split("/");
  const out = [];
  for (const p of parts) {
    if (p === "." || (p === "" && out.length)) continue;
    if (p === ".." && out.length && out[out.length - 1] !== "..") out.pop();
    else out.push(p);
  }
  return out.join("/");
}

// A command line → words (quotes kept together, removed)
function _oscWords(line) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  for (let m; (m = re.exec(line));) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

// One script → { targets: [{ dir, source, args }], calls: [{ dir, script }] }; dir = "." relative
// to the script's folder. sh / bat: compiler calls, "cd", nested scripts (( cd x ; ./build.sh ),
// call make.bat). makefile: the "all" prerequisites through their explicit or %.prg: %.c rules.
function _oscParseBuildScript(text, name = "build.sh") {
  const targets = [];
  const calls = [];
  const src = String(text || "").replace(/\r\n?/g, "\n");
  if (/makefile$|\.mk$/i.test(name)) {
    const vars = {};
    const rules = new Map();
    let rule = null;
    for (const raw of src.replace(/\\\n/g, " ").split("\n")) {
      if (/^\t/.test(raw)) { if (rule) rule.recipe.push(raw.trim()); continue; }
      const line = raw.replace(/#.*$/, "").trim();
      if (!line) continue;
      const v = /^([A-Za-z_][\w.]*)\s*[:?+]?=\s*(.*)$/.exec(line);
      if (v) { vars[v[1]] = v[2]; rule = null; continue; }
      const r = /^([^:=]+):(?!=)\s*(.*)$/.exec(line);
      if (r) {
        rule = { deps: r[2].split(/\s+/).filter(Boolean), recipe: [] };
        for (const tgt of r[1].trim().split(/\s+/)) rules.set(tgt, rule);
      } else rule = null;
    }
    const expand = (s, depth = 0) => s.replace(/\$\(([^)]+)\)/g, (_, k) => {
      if (/(^|_)CC$|OSCAR64/i.test(k) && !/FLAGS/i.test(k)) return "oscar64";
      return depth < 8 ? expand(vars[k] ?? "", depth + 1) : "";
    });
    const wanted = rules.get("all")?.deps || [...rules.keys()].filter((k) => /\.(prg|crt|bin)$/i.test(k));
    const seen = new Set();
    for (const goal of wanted) {
      if (seen.has(goal)) continue;
      seen.add(goal);
      let r = rules.get(goal);
      let dep = r?.deps.find((d) => /\.(c|cpp|cc)$/i.test(d));
      if (!r?.recipe.length) {
        const m = /^(.*)\.(\w+)$/.exec(goal);
        const pattern = m && rules.get(`%.${m[2]}`);
        if (!pattern) continue;
        const pd = pattern.deps.find((d) => d.startsWith("%."));
        dep = pd ? pd.replace("%", m[1]) : dep;
        r = pattern;
      }
      for (const cmd of r.recipe) {
        const words = _oscWords(expand(cmd.replace(/^[@+-]+/, "")).replace(/\$</g, dep || "").replace(/\$@/g, goal));
        const at = words.findIndex((w) => _OSC_COMPILER.test(w));
        if (at < 0) continue;
        const args = words.slice(at + 1);
        const source = args.find((a) => !a.startsWith("-") && /\.(c|cpp|cc)$/i.test(a)) || dep;
        if (source) targets.push({ dir: ".", source, args: args.filter((a) => a !== source) });
      }
    }
    return { targets, calls };
  }
  const bat = /\.(bat|cmd)$/i.test(name);
  let cwd = ".";
  const lines = src.replace(bat ? /\^\n/g : /\\\n/g, " ").split("\n");
  for (const raw of lines) {
    let line = raw.trim();
    if (!line || (bat ? /^(@?rem\b|::)/i.test(line) : line.startsWith("#"))) continue;
    if (!bat) line = line.replace(/\s#.*$/, "");
    // ( cd dir ; ./build.sh ) runs in a subshell: the folder change stays inside
    const group = /^\((.*)\)$/.exec(line);
    const saved = cwd;
    for (let cmd of (group ? group[1] : line).split(/\s*(?:;|&&|\|\|)\s*/)) {
      cmd = cmd.replace(/^@/, "").replace(/^call\s+/i, "").trim();
      const words = _oscWords(cmd);
      if (!words.length) continue;
      const head = words[0];
      if (/^(cd|pushd|chdir)$/i.test(head)) {
        const dir = words.find((w, i) => i > 0 && !/^\/d$/i.test(w));
        if (dir) cwd = _oscResolve(cwd, dir);
        continue;
      }
      if (_OSC_COMPILER.test(head)) {
        const args = words.slice(1);
        const source = args.find((a) => !a.startsWith("-") && /\.(c|cpp|cc)$/i.test(a));
        if (source) targets.push({ dir: cwd, source, args: args.filter((a) => a !== source) });
        continue;
      }
      const script = /^(sh|bash)$/i.test(head) ? words[1] : head;
      if (script && /(^|[\\/])[\w.-]+\.(sh|bat|cmd)$/i.test(script)) calls.push({ dir: cwd, script });
      else if (/^make$/i.test(head)) calls.push({ dir: cwd, script: "makefile" });
    }
    if (group) cwd = saved;
  }
  return { targets, calls };
}

// A script and the ones it calls → absolute targets.
async function _oscCollectTargets(scriptPath, depth = 0, seen = new Set()) {
  const key = _oscNorm(scriptPath);
  if (depth > 4 || seen.has(key)) return [];
  seen.add(key);
  const res = await window.electronAPI?.readTextFile?.(scriptPath);
  if (!res?.ok) return [];
  const dir = _oscDir(scriptPath).replace(/\\/g, "/");
  const { targets, calls } = _oscParseBuildScript(res.content, _oscBase(scriptPath));
  const out = targets.map((tg) => ({ source: _oscResolve(_oscResolve(dir, tg.dir), tg.source), args: tg.args, dir: _oscResolve(dir, tg.dir) }));
  for (const c of calls) out.push(...(await _oscCollectTargets(_oscResolve(_oscResolve(dir, c.dir), c.script), depth + 1, seen)));
  return out;
}

// The switches of a target → build payload parts. Output switches (-o, -tf, -d64, -fz, -e, -g, -v)
// are the app's business; they are listed in `skipped`.
function _oscTargetOptions(target, dir = "") {
  const o = { optimize: null, native: false, defines: [], includeDirs: [], extra: [], skipped: [] };
  for (const a of target?.args || []) {
    if (/^-O([0-3s])?$/.test(a)) o.optimize = a === "-O" ? "O1" : a.slice(1);
    else if (a === "-n") o.native = true;
    else if (/^-d64=|^-tf=|^-fz=|^-o=|^-e$|^-ep$|^-g$|^-gp$|^-v\d*$/.test(a)) o.skipped.push(a);
    else if (/^-d[A-Za-z_]/.test(a)) o.defines.push(a.slice(2));
    else if (/^-i=/.test(a)) o.includeDirs.push(dir ? _oscResolve(dir, a.slice(3)) : a.slice(3));
    else o.extra.push(a);
  }
  return o;
}

// The build script target of a program file (its switches), if the file is one.
function _oscTarget(path = _oscBuildTarget()?.path) {
  const i = path ? _oscTargetIndex(path) : -1;
  return i >= 0 ? _osc.proj.targets[i] : null;
}

// A file with a main(): a program of its own.
const _oscHasMain = (text) => /(^|[\s*])main\s*\([^;]*$/m.test(String(text).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ""));

// The programs of a build script are marked in the tree (◆); the active one has the star.
function _oscTargetIndex(path) {
  return (_osc.proj.targets || []).findIndex((tg) => _oscNorm(_oscProjAbs(tg.source)) === _oscNorm(path));
}

async function _oscSelectTarget(i) {
  const tg = (_osc.proj.targets || [])[i];
  if (!tg) return;
  _osc.proj.target = i;
  _osc.proj.startupFile = tg.source;
  await _oscWriteProj();
  await _oscOpenPath(_oscProjAbs(tg.source));
  _oscRenderTabs();
  _oscRenderTree();
  _oscStatus(tf("oscStartupSet", { name: _oscBase(tg.source) }));
  _oscScheduleAuto(0);
}

async function _oscImportBuildScript(scriptPath) {
  if (!scriptPath) {
    const pick = await window.electronAPI?.oscarChooseFile?.(_osc.root, false, "", "script");
    if (!pick || pick.canceled) return;
    scriptPath = pick.path;
  }
  const found = await _oscCollectTargets(scriptPath);
  if (!found.length) { _oscStatus(t("oscScriptNoTargets"), true); return; }
  const root = _oscDir(scriptPath);
  const rootFwd = root.replace(/\\/g, "/");
  const rel = (p) => (_oscNorm(p) === _oscNorm(rootFwd) ? "." : _oscNorm(p).startsWith(_oscNorm(rootFwd) + "/") ? p.slice(rootFwd.length + 1) : p);
  const seen = new Set();
  const targets = [];
  for (const f of found) {
    const source = rel(f.source);
    const name = source.replace(/\.(c|cpp|cc)$/i, "");
    // the same program built twice (makefile "all: a.prg a.prg") is one target
    const k = `${name}\u0000${f.args.join(" ")}`;
    if (seen.has(k)) continue;
    seen.add(k);
    targets.push({ name, source, dir: rel(f.dir), args: f.args });
  }
  _osc.root = root;
  _osc.projPath = _oscJoin(root, `${_oscBase(root)}.proj`);
  _osc.proj = { startupFile: targets[0].source, optimize: "O2", defines: [], includeDirs: [], targets, target: 0, buildScript: _oscBase(scriptPath) };
  await _oscWriteProj();
  await _oscOpenProject(root);
  _oscStatus(tf("oscScriptImported", { count: targets.length, script: _oscBase(scriptPath) }));
}

// ── Build ───────────────────────────────────────────────────────────────────

function _oscStatus(text, error = false) {
  const el = _oscEl("osc-status");
  if (!el) return;
  el.textContent = text;
  el.classList.toggle("osc-status--error", !!error);
}

// What a build compiles: the project's startup file, or the current file. `source` = the editor
// text (an unsaved or changed file), compiled from a temp file with the file's folder on the include path.
function _oscBuildTarget({ live = false } = {}) {
  _oscSyncFromEditor();
  // in a project its startup file (★); a file outside every open project builds itself
  const cur = _oscCurrent();
  const outside = !!cur?.path && !_oscProjectOf(cur.path);
  if (_osc.proj.startupFile && !outside) {
    const path = _oscProjAbs(_osc.proj.startupFile);
    const f = _osc.files.find((x) => _oscNorm(x.path) === _oscNorm(path));
    if (live && _osc.files.some((x) => x.dirty && x !== f)) return null; // an included file is not saved
    return live && f?.dirty ? { path, file: f, source: f.text } : { path, file: f };
  }
  const f = cur;
  if (!f) return null;
  if (live && _osc.files.some((x) => x.dirty && x !== f && x.path)) return null;
  return (live || !f.path) && (f.dirty || !f.path) ? { path: f.path, file: f, source: f.text } : { path: f.path, file: f };
}

function _oscHasSource() {
  _oscSyncFromEditor();
  if (_osc.proj.startupFile) return true;
  return !!_oscCurrent()?.text.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "").trim();
}

let _oscBuildSeq = 0;
let _oscAutoTimer = 0;

// quiet = the background build after an edit: nothing is saved, the cursor and the panels stay.
// debug: the Debug button's build, -O0: only then does Oscar64 describe the locals in the .dbj (an
// optimized build keeps them in zero page / registers without debug information).
async function _oscBuild({ quiet = false, debug = false } = {}) {
  if (!window.electronAPI?.buildOscar64Prg) return { ok: false, error: t("vmaNeedsDesktop") };
  if (!quiet && !(await _oscSaveAll())) return { ok: false, error: t("oscSaveFailed") };
  const target = _oscBuildTarget({ live: quiet });
  if (!target || (!target.path && target.source === undefined)) return { ok: false, error: t("oscNothingToBuild") };
  const seq = ++_oscBuildSeq;
  clearTimeout(_oscAutoTimer);
  const name = _oscBase(target.path) || target.file?.name || "untitled.c";
  if (!quiet) {
    _oscStatus(tf("oscBuilding", { file: name }));
    if (typeof setWorkStep === "function") { try { setWorkStep("stepOscar64", { file: name }); } catch (_) {} }
  }
  const tg = _oscTarget(target.path);
  const topt = tg ? _oscTargetOptions(tg, tg.dir && tg.dir !== "." ? _oscProjAbs(tg.dir) : _osc.root) : null;
  const includeDirs = (_osc.proj.includeDirs || []).map(_oscProjAbs);
  if (_osc.root) includeDirs.unshift(_osc.root);
  if (target.source !== undefined && target.path) includeDirs.unshift(_oscDir(target.path));
  if (topt) includeDirs.push(...topt.includeDirs);
  let res;
  try {
    res = await window.electronAPI.buildOscar64Prg({
      sourcePath: target.source === undefined ? target.path : null,
      source: target.source ?? null,
      includeDirs,
      defines: [...(_osc.proj.defines || []), ...(topt?.defines || [])],
      // a build script's own -O wins; otherwise Settings → Compilers
      optimize: (_osc.lastOptimize = debug ? "O0" : topt?.optimize || _osc.optimize || "O2"),
      debug: true,
      native: topt ? topt.native : true,
      extraArgs: topt?.extra || [],
    });
  } catch (error) {
    res = { ok: false, error: error?.message || String(error) };
  }
  if (seq !== _oscBuildSeq) return { ok: false, error: t("oscBuildFailed") }; // a newer build took over
  if (res?.error === "oscar64NotConfigured") res.error = t("oscar64NotConfigured");
  // a temp file stands for the buffer it was written from
  const tempFile = target.source !== undefined ? _oscNorm(res?.sourceFile) : "";
  const mainKey = target.file ? _oscKey(target.file) : _oscNorm(target.path);
  const keyOf = (file) => (tempFile && _oscNorm(file) === tempFile ? mainKey : _oscNorm(file));
  _osc.diags = (res?.diagnostics || []).map((d) => ({ ...d, key: keyOf(d.file), temp: !!tempFile && keyOf(d.file) === mainKey }));
  if (res?.ok) {
    const bytes = Uint8Array.from(res.bytes || []);
    const { entries, symbols } = _oscParseDbj(res.dbj);
    _osc.last = { ...res, bytes, symbols, primary: target.path || res.sourceFile, vars: _oscParseDbjVars(res.dbj) };
    _osc.entries = entries.map((e) => ({ ...e, key: keyOf(e.file), file: tempFile && _oscNorm(e.file) === tempFile ? (target.path || `untitled:${target.file?.id}`) : e.file }));
    const load = bytes[0] | (bytes[1] << 8);
    const warnings = _osc.diags.filter((d) => d.level === "warning").length;
    _oscStatus(tf("oscBuildOk", { bytes: bytes.length - 2, from: formatAddress(load), to: formatAddress(load + bytes.length - 3) })
      + (warnings ? " · " + tf("oscWarnings", { count: warnings }) : "")
      + (topt?.skipped.length ? " · " + tf("oscSkippedArgs", { args: topt.skipped.join(" ") }) : ""));
  } else {
    _osc.last = res?.asm ? { ...res, ok: false, bytes: new Uint8Array() } : _osc.last && { ..._osc.last, ok: false };
    const errors = _osc.diags.filter((d) => d.level === "error").length;
    _oscStatus(errors ? tf("oscBuildErrors", { count: errors }) : (res?.error || t("oscBuildFailed")), true);
  }
  _oscRenderOutput(res);
  _oscRefreshEditor();
  try { renderMemoryMap(); } catch (_) {}
  if (!res?.ok && !quiet) {
    _oscToggle("output", true);
    const first = _osc.diags.find((d) => d.level === "error");
    if (first) _oscGotoDiag(first);
  }
  return res?.ok
    ? { ok: true, bytes: _osc.last.bytes, sysAddress: undefined }
    : { ok: false, error: _osc.diags.find((d) => d.level === "error")?.message || res?.error || t("oscBuildFailed") };
}

// The cycle gutter and the views follow the text: a quiet build a moment after the last edit.
function _oscScheduleAuto(delay = 900) {
  clearTimeout(_oscAutoTimer);
  if (!_osc.active || !_osc.auto) return;
  _oscAutoTimer = setTimeout(() => { if (_osc.active) _oscBuild({ quiet: true }); }, delay);
}

async function _oscGotoDiag(d) {
  const open = _osc.files.findIndex((x) => _oscKey(x) === d.key);
  if (open >= 0) { _oscActivate(open); _oscGotoLine(d.line - 1, Math.max(0, d.column - 1)); return; }
  if (d.file && !d.temp && /[\\/]/.test(d.file)) await _oscOpenPath(d.file.replace(/\//g, _oscSep(_osc.root || d.file)), d.line - 1);
  else _oscGotoLine(d.line - 1, Math.max(0, d.column - 1));
}

function _oscRenderOutput(res = _osc.last) {
  const out = _oscEl("osc-output");
  const list = _oscEl("osc-diagnostics");
  if (!out || !list) return;
  document.querySelectorAll(".osc-out-tab").forEach((b) => b.classList.toggle("osc-out-tab--active", b.dataset.view === _osc.view));
  // Toolkit (the C64 palette, a click copies the colour number): the shared #toolkit-output moves here
  const tk = _oscEl("osc-toolkit-host");
  if (tk) tk.hidden = _osc.view !== "tk";
  out.hidden = _osc.view === "tk";
  _oscEl("osc-toolkit-btn")?.classList.toggle("expert-hl-toggle--on", _osc.view === "tk");
  if (_osc.view === "tk") { globalThis._toolkitPlace?.(); list.hidden = true; return; }
  list.hidden = _osc.view !== "log" || !_osc.diags.length;
  list.innerHTML = _osc.diags.map((d, i) => `<li class="osc-diag osc-diag--${d.level}" data-index="${i}" tabindex="0">`
    + `<span class="osc-diag-loc">${_oscEsc(d.file ? `${_oscBase(d.file)}:${d.line}:${d.column}` : "oscar64")}</span> `
    + `<span class="osc-diag-msg">${_oscEsc(d.message)}</span></li>`).join("");
  out.classList.toggle("ub-build-output--error", _osc.view === "log" && !!res && !res.ok);
  // the Monitor view looks like the Expert mode's monitor panel
  out.classList.toggle("osc-output--monitor", _osc.view === "mon");
  if (_osc.view === "asm") { out.innerHTML = res?.asm ? _oscListingHtml(res.asm) : _oscEsc(t("oscBuildFirst")); return; }
  if (_osc.view === "mon") { out.textContent = _oscMonitorText(_osc.last?.ok ? _osc.last.bytes : null); return; }
  if (_osc.view === "map") { out.textContent = res?.map || t("oscBuildFirst"); return; }
  if (!res) { out.textContent = t("oscReady"); return; }
  const log = [res.ok ? t("oscBuildSucceeded") : (res.error || t("oscBuildFailed"))];
  if (res.compiler) log.push(`${res.compiler}`);
  const raw = [res.stdout, res.stderr].filter(Boolean).join("\n").trim();
  if (raw) log.push("", raw);
  out.textContent = log.join("\n");
}

// The run modes (buildRunPrgForCurrentMode) take this build.
async function _oscBuildForRun() {
  const prg = await _oscBuild();
  if (!prg.ok) return prg;
  return _applyExomizerToPrg({ ...prg, bytes: prg.bytes });
}

// ── Debugger source map ─────────────────────────────────────────────────────

async function _oscDebugSession() {
  let prg = await _oscBuild({ debug: true });
  // an -O0 build that no longer fits: the optimized one, without the locals
  if (!prg.ok) prg = await _oscBuild();
  if (!prg.ok) { showViceToast(prg.error, true); return null; }
  return { bytes: _osc.last.bytes, entries: _osc.entries, symbols: _osc.last.symbols || [], blockBps: [], blockAt: null, kind: "oscar", primary: _osc.last.primary || "", vars: _osc.last.vars || null };
}

function _oscBreakpointAddresses(session) {
  const out = new Set();
  const byFile = new Map();
  for (const e of session?.entries || []) {
    const f = e.key || _oscNorm(e.file);
    if (!byFile.has(f)) byFile.set(f, []);
    byFile.get(f).push(e);
  }
  for (const list of byFile.values()) list.sort((a, b) => a.line - b.line || a.start - b.start);
  for (const [file, lines] of _osc.bps) {
    const list = byFile.get(file);
    if (!list) continue;
    for (const line of lines) {
      const hit = list.find((e) => e.line === line + 1) || list.find((e) => e.line > line + 1);
      if (hit) out.add(hit.start & 0xFFFF);
    }
  }
  return out;
}

async function _oscShowDebugLine(src) {
  _osc.debugLine = src ? { key: src.key || _oscNorm(src.file), line: src.line - 1 } : null;
  const open = src ? _osc.files.findIndex((f) => _oscKey(f) === _osc.debugLine.key) : -1;
  if (open >= 0) {
    if (open !== _osc.current) _oscActivate(open);
    _oscGotoLine(src.line - 1);
    _oscRefreshEditor();
  } else if (src?.file && /[\\/]/.test(src.file)) {
    const ok = await _oscOpenPath(src.file.replace(/\//g, _oscSep(_osc.root || src.file)), src.line - 1);
    if (!ok) _oscRefreshEditor();
  } else {
    _oscRefreshEditor();
  }
}

function _oscClearDebugLine() {
  if (!_osc.debugLine) return;
  _osc.debugLine = null;
  _oscRefreshEditor();
}

// ── Compiler info (toolbar, Settings, About) ────────────────────────────────

async function _oscToolsInfo() {
  try { return (await window.electronAPI?.getToolsInfo?.()) || null; } catch (_) { return null; }
}

function _oscToolLine(info) {
  if (!info?.path) return t(info?.customMissing ? "oscToolMissing" : "oscToolNone");
  return tf(info.usesBundled ? "oscToolBundled" : "oscToolCustom", { version: info.version || "?", path: info.path });
}

async function _oscRefreshCompilerInfo() {
  const info = await _oscToolsInfo();
  const el = _oscEl("osc-compiler")?.querySelector(".expert-working-folder__text");
  if (el) el.textContent = info?.oscar64?.path ? `Oscar64 ${info.oscar64.version || ""}`.trim() : t("oscToolNone");
  const setTool = (tool) => {
    const i = info?.[tool];
    const input = _oscEl(`${tool}-path`);
    if (input && tool === "oscar64") input.value = i?.custom || "";
    const status = _oscEl(`${tool}-tool-status`);
    if (status) status.textContent = _oscToolLine(i);
    const bundled = _oscEl(`${tool}-use-bundled`);
    if (bundled) bundled.disabled = !i?.custom || !i?.bundled;
  };
  setTool("acme");
  setTool("oscar64");
  const about = (tool) => {
    const v = _oscEl(`about-${tool}-version-value`);
    if (v) v.textContent = info?.[tool]?.version ? `v${info[tool].version}` : "–";
  };
  about("oscar64");
  about("acme");
  return info;
}

// ── UI ──────────────────────────────────────────────────────────────────────

function _oscToggle(name, value) {
  _osc[name] = value === undefined ? !_osc[name] : !!value;
  const panel = _oscEl("osc-panel");
  const ids = { project: "osc-project-btn", output: "osc-output-btn", hl: "osc-hl-btn", lines: "osc-lines-btn", cycles: "osc-cycles-btn", ac: "osc-ac-btn" };
  const btn = _oscEl(ids[name]);
  btn?.classList.toggle("expert-hl-toggle--on", _osc[name]);
  btn?.setAttribute("aria-pressed", String(_osc[name]));
  panel?.classList.toggle("ub-show-project", _osc.project);
  panel?.classList.toggle("ub-hide-output", !_osc.output);
  if (name === "hl" || name === "lines" || name === "cycles") _oscRefreshEditor();
  if (name === "cycles" && _osc.cycles && !_osc.last?.ok) _oscScheduleAuto(0);
  if (name === "ac" && !_osc.ac) _oscAcHide();
  _oscSave();
}

function _oscApplyFont() {
  const panel = _oscEl("osc-panel");
  panel?.querySelectorAll(".osc-editor, .osc-highlight, #osc-line-numbers").forEach((el) => { el.style.fontSize = `${_osc.fontSize}px`; });
  _oscRefreshEditor();
}

function _oscZoom(step) {
  _osc.fontSize = Math.max(8, Math.min(28, _osc.fontSize + step));
  _oscApplyFont();
  _oscSave();
}

function _oscRenderAll() {
  ["project", "output", "hl", "lines", "cycles", "ac"].forEach((n) => _oscToggle(n, _osc[n]));
  _oscApplyMinimap();
  _oscRenderTabs();
  _oscRenderTree();
  _oscRenderOutput();
  _oscApplyFont();
}

function _oscApplyTranslations() {
  const set = (id, key) => { const el = _oscEl(id); if (el) el.setAttribute("aria-label", t(key)); };
  set("oscar-mode-tb-btn", "oscModeButton");
  set("osc-project-btn", "oscProjectFiles");
  set("osc-new-btn", "oscNewFile");
  set("osc-open-btn", "oscOpenFile");
  set("osc-save-btn", "oscSaveFile");
  set("osc-save-as-btn", "oscSaveFileAs");
  set("osc-build-btn", "oscBuild");
  set("osc-optimize", "oscOptimize");
  set("osc-output-btn", "oscOutput");
  set("osc-hl-btn", "oscHighlight");
  set("osc-lines-btn", "oscLineNumbers");
  set("osc-cycles-btn", "oscCycles");
  set("osc-ac-btn", "expertAutocomplete");
  set("osc-format-btn", "oscFormat");
  set("osc-build-info-btn", "buildInfoBtn");
  set("osc-listing-btn", "expertDisasm");
  set("osc-monitor-btn", "monitorOutputLabel");
  set("osc-minimap-btn", "ubMinimap");
  set("osc-find-btn", "ubFind");
  set("osc-goto-btn", "gotoLineBtn");
  set("osc-bm-toggle-btn", "bmToggle");
  set("osc-bm-prev-btn", "bmPrev");
  set("osc-bm-next-btn", "bmNext");
  set("osc-bm-clear-btn", "bmClear");
  const optLabel = _oscEl("osc-optimize-label");
  if (optLabel) optLabel.textContent = t("oscOptimize");
  const optNote = _oscEl("osc-optimize-note");
  if (optNote) optNote.textContent = t("oscOptimizeNote");
  set("osc-zoom-out-btn", "oscZoomOut");
  set("osc-zoom-in-btn", "oscZoomIn");
  set("osc-project-open-btn", "oscOpenProject");
  set("osc-project-new-btn", "oscNewProject");
  set("osc-project-add-btn", "oscNewFile");
  set("osc-project-add-folder-btn", "oscNewFolder");
  set("osc-project-refresh-btn", "oscRefresh");
  set("osc-project-reveal-btn", "oscRevealCurrent");
  set("osc-project-import-btn", "oscImportScript");
  const text = (id, key) => { const el = _oscEl(id); if (el) el.textContent = t(key); };
  text("osc-out-tab-log", "oscViewOutput");
  text("osc-out-tab-asm", "oscViewListing");
  text("osc-out-tab-mon", "oscViewMonitor");
  text("osc-out-tab-map", "oscViewMap");
  set("osc-toolkit-btn", "expertToolkit");
  text("choose-oscar64", "chooseOscar64");
  text("oscar64-path-label", "oscar64Executable");
  text("acme-use-bundled", "toolUseBundled");
  text("oscar64-use-bundled", "toolUseBundled");
  const p = _oscEl("oscar64-path");
  if (p) p.placeholder = t("toolBundledPlaceholder");
  if (_osc.active) {
    const label = _oscEl("editor-mode-indicator-label");
    if (label) label.textContent = t("editorModeOscar64");
  }
  _oscRenderTree();
  _oscUpdateCursor();
}

function _oscOnInput(e) {
  const f = _oscCurrent();
  const ed = _oscEl("osc-editor");
  if (!f || !ed) return;
  _oscBmTrack(f.text, ed.value);
  f.text = ed.value;
  const dirty = f.text !== (f.saved ?? "");
  if (dirty !== f.dirty) { f.dirty = dirty; _oscRenderTabs(); _oscRenderTree(); }
  _oscRefreshEditor();
  _oscScheduleAuto();
  // only typing opens the completion list, not a text change made by the app
  if (e && e.isTrusted === false) _oscAcHide(); else _oscAcUpdate();
}

// ── Code completion ─────────────────────────────────────────────────────────────
// Keywords, types, the symbols of the open file and of the headers it includes (the project's
// and Oscar64's own include folder, followed to their own includes).

// Declarations of a header or source: functions (with their parameter list), macros, types,
// enum constants and file-level variables.
function _oscDeclarations(text) {
  const out = [];
  const seen = new Set();
  const add = (name, kind, sig = "") => {
    if (!name || seen.has(name) || _OSC_KEYWORDS.has(name) || _OSC_TYPES.has(name)) return;
    seen.add(name);
    out.push({ name, kind, sig });
  };
  const src = String(text).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/.*$/gm, "").replace(/"(?:\\.|[^"\\\n])*"/g, '""');
  for (const m of src.matchAll(/^[ \t]*#[ \t]*define[ \t]+([A-Za-z_]\w*)(\([^)]*\))?[ \t]*(.*)$/gm)) {
    if (!m[2] && !m[3].trim() && /_H(?:PP)?_*$/.test(m[1])) continue; // include guard
    add(m[1], "macro", m[2] || m[3].trim().slice(0, 40));
  }
  // the file level only: function bodies and initialisers out
  let flat = "";
  let depth = 0;
  for (const line of src.split("\n")) {
    if (/^\s*#/.test(line)) { flat += "\n"; continue; }
    for (const ch of line) {
      if (ch === "{") { depth++; if (depth === 1) flat += "{"; continue; }
      if (ch === "}") { depth = Math.max(0, depth - 1); if (depth === 0) flat += "}"; continue; }
      if (depth === 0) flat += ch;
    }
    flat += "\n";
  }
  for (const m of src.matchAll(/\benum\b[^{;]*\{([^}]*)\}/g)) {
    for (const c of m[1].matchAll(/([A-Za-z_]\w*)\s*(?:=[^,]*)?(?:,|$)/g)) add(c[1], "const");
  }
  for (const m of src.matchAll(/\b(struct|union|enum)\s+([A-Za-z_]\w*)/g)) add(m[2], "type");
  for (const m of flat.matchAll(/\btypedef\b[^;]*?\b([A-Za-z_]\w*)\s*(?:\[[^\]]*\])?\s*;/g)) add(m[1], "type");
  for (const m of flat.matchAll(/(?:^|[;}\n])\s*((?:[A-Za-z_]\w*[\s*&]+)+?)\b([A-Za-z_]\w*)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)\s*(?:;|\{)/g)) {
    if (/\b(?:return|typedef|if|while|for|switch|sizeof)\b/.test(m[1])) continue;
    add(m[2], "function", `${m[1].replace(/\s+/g, " ").trim()} ${m[2]}(${m[3].replace(/\s+/g, " ").trim()})`);
  }
  // file-level variables, also "sbyte joyx[2], joyy[2];" (function bodies are already out)
  for (const stmt of flat.replace(/\{\}/g, " ").split(/[;}]/)) {
    const st = stmt.replace(/\s+/g, " ").trim();
    if (!st || /[(){]/.test(st) || /^(?:typedef|return|goto)\b/.test(st)) continue;
    const parts = st.split(",").map((x) => x.replace(/=.*$/, "").replace(/\[[^\]]*\]/g, "").trim());
    const head = /^((?:[A-Za-z_]\w*\s+)+[*\s]*|(?:[A-Za-z_]\w*\s*)+\*+\s*)([A-Za-z_]\w*)$/.exec(parts[0]);
    if (!head) continue;
    const type = head[1].replace(/\b(?:extern|static)\b/g, "").replace(/\s+/g, " ").trim();
    if (!type || /^(?:struct|union|enum) \w+$/.test(st)) continue;
    add(head[2], "variable", `${type} ${head[2]}`);
    for (const extra of parts.slice(1)) {
      const n = /^\**\s*([A-Za-z_]\w*)$/.exec(extra);
      if (n) add(n[1], "variable", `${type} ${n[1]}`);
    }
  }
  return out;
}

const _oscAc = { active: -1, items: [], headers: new Map(), sysInclude: null, fileList: null, pending: new Set() };

async function _oscAcSysInclude() {
  if (_oscAc.sysInclude !== null) return _oscAc.sysInclude;
  const info = await _oscToolsInfo();
  const bin = info?.oscar64?.path || "";
  _oscAc.sysInclude = bin ? _oscJoin(_oscDir(_oscDir(bin)), "include") : "";
  return _oscAc.sysInclude;
}

// Header file → { decls, includes }, or null while it is not read / not found.
function _oscAcHeader(path) {
  const key = _oscNorm(path);
  if (_oscAc.headers.has(key)) return _oscAc.headers.get(key);
  if (!_oscAc.pending.has(key)) {
    _oscAc.pending.add(key);
    Promise.resolve(window.electronAPI?.readTextFile?.(path)).then((res) => {
      const text = res?.ok ? res.content : null;
      _oscAc.headers.set(key, text === null ? { decls: [], includes: [], missing: true }
        : { decls: _oscDeclarations(text), includes: _oscIncludes(text), dir: _oscDir(path) });
      _oscAc.pending.delete(key);
      if (_oscAcVisible()) _oscAcUpdate();
    }).catch(() => _oscAc.pending.delete(key));
  }
  return null;
}

const _oscIncludes = (text) => [...String(text).matchAll(/^[ \t]*#[ \t]*include[ \t]*([<"])([^>"]+)[>"]/gm)].map((m) => ({ sys: m[1] === "<", name: m[2].trim() }));

// The header an include line names: the including file's folder, the project include folders,
// Oscar64's include folder; the first one already read wins.
function _oscAcResolve(inc, fromDir, sys) {
  const dirs = [];
  if (!inc.sys) dirs.push(fromDir);
  dirs.push(...(_osc.proj.includeDirs || []).map(_oscProjAbs));
  if (_osc.root) dirs.push(_osc.root);
  if (sys) dirs.push(sys);
  for (const d of dirs.filter(Boolean)) {
    const h = _oscAcHeader(_oscJoin(d, inc.name));
    if (h && !h.missing) return h;
    if (!h) return null; // still reading
  }
  return null;
}

function _oscAcIncludedDecls(text, dir, sys) {
  const out = [];
  const seen = new Set();
  const walk = (incs, from, depth) => {
    for (const inc of incs) {
      const h = _oscAcResolve(inc, from, sys);
      if (!h || seen.has(h)) continue;
      seen.add(h);
      out.push(...h.decls);
      if (depth < 3) walk(h.includes, h.dir, depth + 1);
    }
  };
  walk(_oscIncludes(text), dir, 0);
  return out;
}

// Header names for "#include <…" / "#include "…": Oscar64's include folder and the project.
async function _oscAcFileList() {
  if (_oscAc.fileList) return _oscAc.fileList;
  const flat = (entries, base, out) => {
    for (const e of entries || []) {
      const rel = base ? `${base}/${e.name}` : e.name;
      if (e.dir) flat(e.children, rel, out);
      else if (/\.(h|hpp)$/i.test(e.name)) out.push(rel);
    }
    return out;
  };
  const sys = await _oscAcSysInclude();
  const res = sys ? await window.electronAPI?.oscarListDir?.(sys) : null;
  _oscAc.fileList = { sys: res?.ok ? flat(res.entries, "", []) : [] };
  return _oscAc.fileList;
}

function _oscAcEl() {
  let el = document.getElementById("osc-ac");
  if (!el) { el = document.createElement("div"); el.id = "osc-ac"; el.className = "expert-autocomplete"; el.hidden = true; document.body.appendChild(el); }
  return el;
}
function _oscAcVisible() { const el = document.getElementById("osc-ac"); return !!el && !el.hidden; }
function _oscAcHide() { const el = document.getElementById("osc-ac"); if (el) el.hidden = true; _oscAc.active = -1; }
function _oscAcMove(dir) {
  const items = _oscAcEl().querySelectorAll(".expert-ac-item");
  if (!items.length) return;
  items[_oscAc.active]?.classList.remove("active");
  _oscAc.active = _oscAc.active < 0 ? (dir > 0 ? 0 : items.length - 1) : (_oscAc.active + dir + items.length) % items.length;
  items[_oscAc.active].classList.add("active");
  items[_oscAc.active].scrollIntoView({ block: "nearest" });
}
function _oscAcCommit() {
  const ed = _oscEl("osc-editor");
  const el = _oscAcEl();
  const item = el.querySelector(".expert-ac-item.active") || el.querySelector(".expert-ac-item");
  if (!item || !ed) return false;
  const pos = ed.selectionStart;
  const len = Number(item.dataset.len) || 0;
  ed.setSelectionRange(pos - len, pos);
  document.execCommand("insertText", false, item.dataset.value);
  _oscAcHide();
  return true;
}

// The word before the caret and what kind of completion it wants; null in a comment or a string.
function _oscAcContext(value, pos) {
  const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
  const line = value.slice(lineStart, pos);
  const inc = /^\s*#\s*include\s*([<"])([\w./-]*)$/.exec(line);
  if (inc) return { kind: "include", sys: inc[1] === "<", word: inc[2] };
  const before = value.slice(0, pos);
  if (before.lastIndexOf("/*") > before.lastIndexOf("*/")) return null;
  let quote = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) { if (ch === "\\") i++; else if (ch === quote) quote = ""; continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "/" && line[i + 1] === "/") return null;
  }
  if (quote) return null;
  const m = /[A-Za-z_]\w*$/.exec(line);
  if (/^\s*#\s*\w*$/.test(line)) return { kind: "directive", word: m ? m[0] : "" };
  return m ? { kind: "word", word: m[0] } : null;
}

const _OSC_DIRECTIVES = ["include", "define", "undef", "if", "ifdef", "ifndef", "elif", "else", "endif", "pragma", "error", "warning", "embed", "assign", "repeat", "until", "for"];

async function _oscAcUpdate(force = false) {
  const ed = _oscEl("osc-editor");
  if (!_osc.ac || !ed || document.activeElement !== ed || ed.selectionStart !== ed.selectionEnd) { _oscAcHide(); return; }
  const value = ed.value;
  const pos = ed.selectionStart;
  const ctx = _oscAcContext(value, pos);
  if (!ctx || (!force && ctx.kind === "word" && ctx.word.length < 2)) { _oscAcHide(); return; }
  const word = ctx.word;
  const low = word.toLowerCase();
  let list = [];
  if (ctx.kind === "include") {
    const files = await _oscAcFileList();
    const proj = [];
    const walk = (entries, base) => (entries || []).forEach((e) => {
      const rel = base ? `${base}/${e.name}` : e.name;
      if (e.dir) walk(e.children, rel); else if (/\.(h|hpp)$/i.test(e.name)) proj.push(rel);
    });
    walk(_osc.tree, "");
    const names = ctx.sys ? files.sys : [...proj, ...files.sys];
    list = [...new Set(names)].filter((n) => n.toLowerCase().includes(low)).sort((a, b) => (b.toLowerCase().startsWith(low) - a.toLowerCase().startsWith(low)) || a.localeCompare(b))
      .slice(0, 40).map((n) => ({ name: n, kind: "header", sig: "", value: n + (ctx.sys ? ">" : '"') }));
    if (_oscAcContext(ed.value, ed.selectionStart)?.word !== word) return; // typed on meanwhile
  } else if (ctx.kind === "directive") {
    list = _OSC_DIRECTIVES.filter((d) => d.startsWith(low) && d !== low).map((d) => ({ name: d, kind: "directive", sig: "" }));
  } else {
    const f = _oscCurrent();
    const sys = await _oscAcSysInclude();
    if (_oscAcContext(ed.value, ed.selectionStart)?.word !== word) return;
    const all = new Map();
    const put = (d) => { if (!all.has(d.name)) all.set(d.name, d); };
    _oscDeclarations(value).forEach(put);
    _oscAcIncludedDecls(value, f?.path ? _oscDir(f.path) : _osc.root, sys).forEach(put);
    [..._OSC_KEYWORDS].forEach((k) => put({ name: k, kind: "keyword", sig: "" }));
    [..._OSC_TYPES].forEach((k) => put({ name: k, kind: "type", sig: "" }));
    // the other names of the file (locals, parameters)
    for (const m of value.matchAll(/\b[A-Za-z_]\w{2,}\b/g)) if (m.index + m[0].length !== pos) put({ name: m[0], kind: "name", sig: "" });
    const rank = { variable: 0, function: 0, const: 1, macro: 1, name: 2, type: 3, keyword: 4 };
    list = [...all.values()].filter((d) => d.name !== word && (d.name.startsWith(word) || (d.name.toLowerCase().startsWith(low))))
      .sort((a, b) => (b.name.startsWith(word) - a.name.startsWith(word)) || (rank[a.kind] - rank[b.kind]) || a.name.length - b.name.length || a.name.localeCompare(b.name))
      .slice(0, 40);
  }
  if (!list.length) { _oscAcHide(); return; }
  const el = _oscAcEl();
  _oscAc.active = -1;
  const kindText = { function: "function", macro: "#define", type: "type", const: "const", variable: "var", keyword: "keyword", name: "", header: "header", directive: "#" };
  el.innerHTML = list.map((d) => `<div class="expert-ac-item" data-value="${_oscEsc(d.value || d.name)}" data-len="${word.length}">`
    + `<span class="expert-ac-item-kw">${_oscEsc(d.name)}</span><span class="expert-ac-item-desc">${_oscEsc(d.sig || kindText[d.kind] || "")}</span></div>`).join("");
  el.querySelectorAll(".expert-ac-item").forEach((item, i) => item.addEventListener("mousedown", (e) => { e.preventDefault(); _oscAc.active = i; _oscAcCommit(); }));
  // under the caret: the line from the line height, the column from the font's advance
  const rect = ed.getBoundingClientRect();
  const st = getComputedStyle(ed);
  const lineHeight = parseFloat(st.lineHeight) || 20;
  const before = value.slice(0, pos);
  const lineIdx = before.split("\n").length - 1;
  const col = pos - (before.lastIndexOf("\n") + 1) - word.length;
  const canvas = _oscAc.canvas || (_oscAc.canvas = document.createElement("canvas"));
  const c2d = canvas.getContext("2d");
  c2d.font = `${st.fontSize} ${st.fontFamily}`;
  const charW = c2d.measureText("MMMMMMMMMM").width / 10 || 8;
  const lineTop = rect.top + (parseFloat(st.paddingTop) || 0) + lineIdx * lineHeight - ed.scrollTop;
  const lineBottom = lineTop + lineHeight;
  const below = Math.max(32, Math.min(window.innerHeight - 8, rect.bottom - 8) - lineBottom - 4);
  const above = Math.max(32, lineTop - Math.max(8, rect.top + 8) - 4);
  const x = rect.left + (parseFloat(st.paddingLeft) || 0) + col * charW - ed.scrollLeft;
  el.style.left = `${Math.max(8, Math.min(window.innerWidth - 340, x))}px`;
  el.style.maxHeight = "260px";
  el.hidden = false;
  const openBelow = below >= Math.min(el.offsetHeight, 120) || below >= above;
  el.style.maxHeight = `${Math.min(260, openBelow ? below : above)}px`;
  el.style.top = `${openBelow ? lineBottom + 4 : lineTop - el.offsetHeight - 4}px`;
}

// Saved headers change what they declare: read them again.
function _oscAcForget(path) {
  if (path) _oscAc.headers.delete(_oscNorm(path));
}

// Tab / Shift+Tab indent, Enter keeps the indent (+1 level after "{").
function _oscKeydown(e) {
  const ed = e.currentTarget;
  const mod = e.ctrlKey || e.metaKey;
  if (_oscAcVisible()) {
    if (e.key === "ArrowDown") { e.preventDefault(); _oscAcMove(1); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); _oscAcMove(-1); return; }
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); _oscAcHide(); return; }
    if ((e.key === "Enter" && _oscAc.active >= 0 && !mod) || (e.key === "Tab" && !e.shiftKey && !mod)) {
      if (_oscAcCommit()) { e.preventDefault(); return; }
    }
  }
  if (mod && e.code === "Space") { e.preventDefault(); _oscAcUpdate(true); return; }
  if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); e.stopPropagation(); _oscSaveFile(_osc.current, e.shiftKey); return; }
  if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); e.stopPropagation(); _oscBuild(); return; }
  if (mod && e.key.toLowerCase() === "g") { e.preventDefault(); e.stopPropagation(); _oscGotoAsk(); return; }
  if (mod && e.key.toLowerCase() === "f") { e.preventDefault(); e.stopPropagation(); _oscOpenFind(); return; }
  if (e.key === "F2" && !e.altKey) { e.preventDefault(); if (mod) _oscBmToggle(); else _oscBmJump(e.shiftKey ? -1 : 1); return; }
  if (e.key === "Escape" && !_oscEl("osc-find-bar")?.hidden) { e.preventDefault(); _oscCloseFind(); return; }
  if (e.key === "Tab" && !mod && !e.altKey) {
    e.preventDefault();
    const { selectionStart: s, selectionEnd: en, value } = ed;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    if (s === en && !e.shiftKey) { document.execCommand("insertText", false, "    "); return; }
    const block = value.slice(lineStart, en);
    const changed = e.shiftKey ? block.replace(/^( {1,4}|\t)/gm, "") : block.replace(/^/gm, "    ");
    ed.setSelectionRange(lineStart, en);
    document.execCommand("insertText", false, changed);
    ed.setSelectionRange(lineStart, lineStart + changed.length);
    return;
  }
  if (e.key === "Enter" && !mod && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const { selectionStart: s, value } = ed;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const before = value.slice(lineStart, s);
    let indent = /^\s*/.exec(before)[0];
    if (/\{\s*$/.test(before)) indent += "    ";
    document.execCommand("insertText", false, "\n" + indent);
    return;
  }
  if (e.key === "}" && !mod) {
    const { selectionStart: s, value } = ed;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    if (/^ {4,}$/.test(value.slice(lineStart, s))) {
      e.preventDefault();
      ed.setSelectionRange(s - 4, s);
      document.execCommand("insertText", false, "}");
    }
  }
}

function setupOscar64() {
  const prefs = _oscLoadPrefs();
  Object.assign(_osc, {
    hl: prefs.hl !== false, lines: prefs.lines !== false, cycles: prefs.cycles !== false, ac: prefs.ac !== false, optimize: /^O[0-3s]$/.test(prefs.optimize) ? prefs.optimize : "O2",
    output: prefs.output !== false, project: prefs.project !== false, minimap: prefs.minimap !== false,
    outputWidth: Number(prefs.outputWidth) || 0, symbolsHeight: Number(prefs.symbolsHeight) || 0, fontSize: Number(prefs.fontSize) || 14, view: ["log", "asm", "mon", "map", "tk"].includes(prefs.view) ? prefs.view : "log",
  });
  (prefs.expanded || []).forEach((p) => _osc.expanded.add(p));
  (prefs.bps || []).forEach(([file, lines]) => _osc.bps.set(file, new Set(lines)));
  (prefs.bms || []).forEach(([file, lines]) => _osc.bms.set(file, new Set(lines)));

  const ed = _oscEl("osc-editor");
  _oscEl("oscar-mode-tb-btn")?.addEventListener("click", () => (_osc.active ? _oscLeave() : _oscEnter()));
  _oscEl("osc-project-btn")?.addEventListener("click", () => _oscToggle("project"));
  _oscEl("osc-output-btn")?.addEventListener("click", () => _oscToggle("output"));
  _oscEl("osc-hl-btn")?.addEventListener("click", () => _oscToggle("hl"));
  _oscEl("osc-lines-btn")?.addEventListener("click", () => _oscToggle("lines"));
  _oscEl("osc-format-btn")?.addEventListener("click", _oscFormatCurrent);
  _oscEl("osc-build-info-btn")?.addEventListener("click", _oscBuildInfo);
  _oscEl("osc-listing-btn")?.addEventListener("click", () => _oscShowView("asm"));
  _oscEl("osc-monitor-btn")?.addEventListener("click", () => _oscShowView("mon"));
  _oscEl("osc-toolkit-btn")?.addEventListener("click", () => _oscShowView(_osc.view === "tk" ? "log" : "tk"));
  _oscEl("osc-minimap-btn")?.addEventListener("click", _oscToggleMinimap);
  _oscEl("osc-find-btn")?.addEventListener("click", () => (_oscEl("osc-find-bar")?.hidden ? _oscOpenFind() : _oscCloseFind()));
  _oscEl("osc-goto-btn")?.addEventListener("click", _oscGotoAsk);
  _oscEl("osc-bm-toggle-btn")?.addEventListener("click", () => _oscBmToggle());
  _oscEl("osc-bm-prev-btn")?.addEventListener("click", () => _oscBmJump(-1));
  _oscEl("osc-bm-next-btn")?.addEventListener("click", () => _oscBmJump(1));
  _oscEl("osc-bm-clear-btn")?.addEventListener("click", _oscBmClear);
  _oscEl("osc-find-input")?.addEventListener("input", () => _oscFind(0));
  _oscEl("osc-find-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); _oscFind(e.shiftKey ? -1 : 1); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); _oscCloseFind(); }
  });
  _oscEl("osc-find-prev")?.addEventListener("click", () => _oscFind(-1));
  _oscEl("osc-find-next")?.addEventListener("click", () => _oscFind(1));
  _oscEl("osc-find-close")?.addEventListener("click", _oscCloseFind);
  _oscEl("osc-minimap")?.addEventListener("mousedown", (e) => {
    e.preventDefault();
    _oscMinimapScroll(e);
    const move = (ev) => _oscMinimapScroll(ev);
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  });
  window.addEventListener("resize", () => { if (_osc.active) _oscDrawMinimap(); });
  _oscEl("osc-cycles-btn")?.addEventListener("click", () => _oscToggle("cycles"));
  _oscEl("osc-ac-btn")?.addEventListener("click", () => _oscToggle("ac"));
  _oscEl("osc-zoom-in-btn")?.addEventListener("click", () => _oscZoom(1));
  _oscEl("osc-zoom-out-btn")?.addEventListener("click", () => _oscZoom(-1));
  _oscEl("osc-new-btn")?.addEventListener("click", () => (_osc.root ? _oscCreateFile() : _oscNewFile("")));
  _oscEl("osc-open-btn")?.addEventListener("click", async () => {
    const pick = await window.electronAPI?.oscarChooseFile?.(_osc.root, false, "");
    if (pick && !pick.canceled) _oscOpenPath(pick.path);
  });
  _oscEl("osc-save-btn")?.addEventListener("click", () => _oscSaveFile());
  _oscEl("osc-save-as-btn")?.addEventListener("click", () => _oscSaveFile(_osc.current, true));
  _oscEl("osc-build-btn")?.addEventListener("click", () => _oscBuild());
  const optSel = _oscEl("osc-optimize");
  if (optSel) optSel.value = _osc.optimize;
  optSel?.addEventListener("change", (e) => {
    _osc.optimize = e.target.value;
    _oscSave();
    if (_osc.active) _oscScheduleAuto(0);
  });
  _oscEl("osc-project-import-btn")?.addEventListener("click", () => _oscImportBuildScript());
  _oscEl("osc-project-open-btn")?.addEventListener("click", () => (typeof _studioOpenCFolder === "function" ? _studioOpenCFolder() : _oscOpenProject()));
  _oscEl("osc-project-new-btn")?.addEventListener("click", () => _oscNewProject());
  _oscEl("osc-project-add-btn")?.addEventListener("click", () => _oscCreateFile());
  _oscEl("osc-project-add-folder-btn")?.addEventListener("click", () => _oscCreateFolder());
  _oscEl("osc-project-refresh-btn")?.addEventListener("click", () => _oscRefreshTree());
  _oscEl("osc-project-reveal-btn")?.addEventListener("click", () => _oscRevealCurrent());

  _oscEl("osc-ask")?.addEventListener("submit", (e) => { e.preventDefault(); _oscAskClose(true); });
  _oscEl("osc-ask-input")?.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); _oscAskClose(false); } });
  _oscEl("osc-ask-input")?.addEventListener("blur", () => setTimeout(() => _oscAskClose(false), 120));

  const tree = _oscEl("osc-project-files");
  tree?.addEventListener("click", (e) => {
    const row = e.target.closest(".osc-tree-item");
    if (!row) return;
    const path = row.dataset.path;
    _osc.selected = path;
    if (row.dataset.dir === "1") {
      const n = _oscNorm(path);
      if (_osc.expanded.has(n)) _osc.expanded.delete(n); else _osc.expanded.add(n);
      _oscRenderTree();
      _oscSave();
    } else if (_OSC_TEXT_FILE.test(_oscBase(path)) || _osc.files.some((f) => _oscNorm(f.path) === _oscNorm(path))) {
      _oscOpenPath(path);
    } else {
      _oscRenderTree();
      _oscStatus(tf("projDblClickToOpen", { name: _oscBase(path) }));
    }
  });
  tree?.addEventListener("dblclick", (e) => {
    const row = e.target.closest(".osc-tree-item");
    if (!row || row.dataset.dir === "1") return;
    const path = row.dataset.path;
    if (!_OSC_TEXT_FILE.test(_oscBase(path))) { _projOpenInSystem(path); return; }
    if (_oscTargetIndex(path) >= 0) _oscSelectTarget(_oscTargetIndex(path));
  });
  _oscEl("osc-project-symbols")?.addEventListener("click", (e) => {
    const row = e.target.closest(".osc-symbol");
    if (row) _oscGotoLine(+row.dataset.line);
  });
  const symbolsSplitter = _oscEl("osc-symbols-splitter");
  const applySymbolsHeight = () => _oscEl("osc-panel")?.style.setProperty("--ub-project-symbols-height", `${_osc.symbolsHeight || 190}px`);
  applySymbolsHeight();
  symbolsSplitter?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    symbolsSplitter.setPointerCapture(e.pointerId);
    symbolsSplitter.classList.add("dragging");
    const view = _oscEl("osc-project-view");
    const startY = e.clientY;
    const start = _oscEl("osc-project-symbols")?.getBoundingClientRect().height || 190;
    const move = (ev) => {
      _osc.symbolsHeight = Math.round(Math.max(48, Math.min((view?.clientHeight || 420) - 96, start + startY - ev.clientY)));
      applySymbolsHeight();
    };
    const up = () => {
      symbolsSplitter.classList.remove("dragging");
      symbolsSplitter.removeEventListener("pointermove", move);
      symbolsSplitter.removeEventListener("pointerup", up);
      _oscSave();
    };
    symbolsSplitter.addEventListener("pointermove", move);
    symbolsSplitter.addEventListener("pointerup", up);
  });
  tree?.addEventListener("contextmenu", (e) => {
    const row = e.target.closest(".osc-tree-item");
    const entry = row ? _oscFindEntry(row.dataset.path) : null;
    if (entry) { _osc.selected = entry.path; _oscRenderTree(); }
    if (_osc.root) _oscTreeMenu(e, entry);
  });

  _oscEl("osc-tabs")?.addEventListener("click", (e) => {
    const close = e.target.closest("[data-close]");
    if (close) { e.stopPropagation(); _oscCloseFile(+close.dataset.close); return; }
    const tab = e.target.closest(".osc-tab");
    if (tab) _oscActivate(+tab.dataset.index);
  });
  _oscEl("osc-tabs")?.addEventListener("auxclick", (e) => {
    const tab = e.target.closest(".osc-tab");
    if (tab && e.button === 1) _oscCloseFile(+tab.dataset.index);
  });

  document.querySelectorAll(".osc-out-tab").forEach((b) => b.addEventListener("click", () => {
    _osc.view = b.dataset.view;
    _oscRenderOutput();
    _oscSave();
  }));
  _oscEl("osc-diagnostics")?.addEventListener("click", (e) => {
    const li = e.target.closest(".osc-diag");
    if (li) _oscGotoDiag(_osc.diags[+li.dataset.index]);
  });
  _oscEl("osc-output")?.addEventListener("click", (e) => {
    const src = e.target.closest(".osc-l-src");
    if (src?.dataset.file) _oscOpenPath(src.dataset.file.replace(/\//g, _oscSep(_osc.root || src.dataset.file)), +src.dataset.line - 1);
  });

  _oscEl("osc-line-numbers")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".source-line-number");
    if (!btn) return;
    const line = +btn.dataset.line;
    const set = _oscBpSet();
    if (set.has(line)) set.delete(line); else set.add(line);
    _oscRefreshEditor();
    _oscSave();
    // a running built-in C64 debug session picks the change up now
    try { if (_w64S().session?.kind === "oscar") { _w64ApplyBreakpoints(); _w64RenderBreakpoints(); } } catch (_) {}
  });

  if (ed) {
    ed.addEventListener("input", _oscOnInput);
    ed.addEventListener("scroll", () => { _oscSyncScroll(); _oscAcHide(); _oscDrawMinimap(); });
    ed.addEventListener("blur", () => setTimeout(() => { if (document.activeElement !== ed) _oscAcHide(); }, 100));
    ed.addEventListener("mousedown", _oscAcHide);
    ed.addEventListener("keydown", _oscKeydown);
    ["keyup", "click", "select"].forEach((ev) => ed.addEventListener(ev, _oscUpdateCursor));
    ed.addEventListener("contextmenu", (e) => _edShowCtxMenu(e, document.body, _editorCtxItems(ed, () => {})));
  }
  _bindCtrlWheelZoom(document.querySelector(".osc-editor-wrap"), _oscZoom);

  // width of the output column
  const panel = _oscEl("osc-panel");
  if (Number(prefs.outputWidth) > 0) panel?.style.setProperty("--ub-disasm-width", `${prefs.outputWidth}px`);
  _oscEl("osc-resizer")?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    handle.classList.add("dragging");
    const right = panel.getBoundingClientRect().right;
    const move = (ev) => {
      _osc.outputWidth = Math.round(Math.max(200, Math.min(right - ev.clientX, panel.clientWidth - 420)));
      panel.style.setProperty("--ub-disasm-width", `${_osc.outputWidth}px`);
    };
    const up = () => {
      handle.classList.remove("dragging");
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      _oscSave();
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });

  // Settings
  _oscEl("choose-oscar64")?.addEventListener("click", async () => {
    const res = await window.electronAPI?.chooseOscar64Executable?.();
    if (res && !res.canceled) _oscRefreshCompilerInfo();
  });
  _oscEl("oscar64-use-bundled")?.addEventListener("click", async () => {
    await window.electronAPI?.clearToolPath?.("oscar64");
    _oscRefreshCompilerInfo();
  });
  _oscEl("acme-use-bundled")?.addEventListener("click", async () => {
    await window.electronAPI?.clearToolPath?.("acme");
    acmePath = "";
    const input = _oscEl("acme-path");
    if (input) input.value = "";
    saveUiSettings();
    _acmeAvailabilitySync();
    _oscRefreshCompilerInfo();
  });
  _oscEl("choose-acme")?.addEventListener("click", () => setTimeout(_oscRefreshCompilerInfo, 400));
  _oscEl("hardware-settings-btn")?.addEventListener("click", () => _oscRefreshCompilerInfo());
  _oscEl("about-btn")?.addEventListener("click", () => _oscRefreshCompilerInfo());
  document.addEventListener("click", (e) => {
    if (e.target.closest?.("#about-btn, #menu-about, [data-open='about'], #hardware-settings-btn, #menu-settings")) _oscRefreshCompilerInfo();
  }, true);

  window.addEventListener("beforeunload", () => { _oscSyncFromEditor(); _oscSave(); });
  _oscApplyTranslations();
  _oscRefreshCompilerInfo();

  // the last C project comes back with the Studio's own restore (app.js _studioContinueLast, its
  // tabs from the .proj.user), not from here
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setupOscar64);
else setupOscar64();
