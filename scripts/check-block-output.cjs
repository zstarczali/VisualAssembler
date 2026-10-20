// Futtatás: node scripts/check-block-output.cjs (Playwright + Edge szükséges).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
(async () => {
  const root = path.resolve(__dirname, '../www');
  const server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    const mime = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.wasm': 'application/wasm' };
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).on('error', () => { res.statusCode = 404; res.end(); }).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();
    page.on('pageerror', error => console.log('PAGE ERROR:', error.stack));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const source = fs.readFileSync(path.resolve(__dirname, '../samples/Kick/Krakout (1987)(Gremlin Graphics)-part1.asm'), 'utf8');
    if (process.argv.includes('--modes')) {
      const modes = await page.evaluate(async source => {
        program = parseExpertText(source);
        parseUserMacros();
        const tab = _getActiveTab();
        tab.filePath = 'large.asm';
        renderProgram();
        setUltimateBasicMode(true);
        const blocked = expertMode && !ultimateBasicMode && ubPanel.hidden && ubModeTbBtn.disabled;
        tab.filePath = '';
        setUltimateBasicMode(true);
        const exclusive = ultimateBasicMode && !expertMode && expertPanel.hidden && !ubPanel.hidden
          && !document.body.classList.contains('expert-mode');
        const saved = _tabCreate('saved.ub');
        Object.assign(saved, { filePath: 'saved.ub', ubFilePath: 'saved.ub', editorMode: 'ub', ubText: 'print "SAVED FILE"' });
        const blank = _tabCreate();
        tabs.push(saved, blank);
        _tabActivate(saved.id);
        const savedText = ubEditor.value;
        _tabActivate(blank.id);
        setUltimateBasicMode(true);
        const blankText = ubEditor.value;
        const blankPath = _ubFilePath;
        ubEditor.value = 'print "UNTITLED ONLY"';
        _tabActivate(saved.id);
        const savedAfter = ubEditor.value;
        _tabActivate(blank.id);
        const blankAfter = ubEditor.value;
        setUltimateBasicMode(false);
        await _importAsmFromPath('imported.asm', '* = $c000\nlda #1\nrts', 'imported.asm');
        setExpertMode(true);
        const importedLocked = ubModeTbBtn.disabled;
        setUltimateBasicMode(true);
        const importedStaysAsm = expertMode && !ultimateBasicMode;
        return { blocked, exclusive, savedText, blankText, blankPath, savedAfter, blankAfter, importedLocked, importedStaysAsm };
      }, source);
      assert.ok(modes.blocked, 'ASM tab must reject UB mode');
      assert.ok(modes.exclusive, 'UB and Expert editors must never remain visible together');
      assert.equal(modes.blankText, '', 'Untitled must start with its own empty UB source');
      assert.equal(modes.blankPath, '', 'Untitled must not inherit the saved file path');
      assert.equal(modes.savedAfter, modes.savedText, 'Saved UB source must remain unchanged');
      assert.equal(modes.blankAfter, 'print "UNTITLED ONLY"', 'Untitled must preserve its own edits');
      assert.ok(modes.importedLocked && modes.importedStaysAsm, 'Imported ASM without a save path must reject UB');
      console.log(modes);
      return;
    }
    const report = await page.evaluate(source => {
      expertMode = false; ultimateBasicMode = false;
      program = parseExpertText(source); parseUserMacros();
      let error = '';
      try { renderAsmOutput(); } catch (e) { error = e.stack; }
      document.body.classList.remove('expert-mode', 'ub-mode');
      const views = ['asm', 'monitor', 'disasm'].map(mode => {
        setOutputMode(mode);
        const el = document.getElementById(mode === 'asm' ? 'asm-output' : mode + '-output');
        const result = [];
        const visible = el.parentElement.clientHeight > 40 && el.clientHeight > 24;
        el.scrollTop = el.scrollHeight;
        const reachesEnd = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 2;
        for (let p = el; p && p !== document.body; p = p.parentElement) {
          const style = getComputedStyle(p);
          result.push({ name: p.id || p.className, height: p.clientHeight, scroll: p.scrollHeight, display: style.display, overflow: style.overflowY, minHeight: style.minHeight });
        }
        return { mode, visible, reachesEnd, result };
      });
      return { blocks: program.length, error, asmLines: asmPlainText.split('\n').length,
        monitor: monitorOutput.textContent.length, disasm: document.getElementById('disasm-output').textContent.length, views };
    }, source);
    assert.equal(report.error, '');
    assert.ok(report.asmLines > 13000);
    assert.ok(report.monitor > 300000 && report.disasm > 600000);
    for (const view of report.views) {
      assert.ok(view.visible, `${view.mode}: collapsed output viewport`);
      assert.ok(view.reachesEnd, `${view.mode}: cannot scroll to the last line`);
    }
    console.log(JSON.stringify(report, null, 2));
  } finally { if (browser) await browser.close(); server.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
