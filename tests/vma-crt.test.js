// Save CRT: the Rust VMA CLI's `--crt` (crt.rs) = the app's buildMagicDeskCrt over the JS build.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createReference } = require("./helpers/vma-reference");
const { findRustCli, firstDiff } = require("./helpers/vma-rust");

const CASES = [
  { id: "stub", text: "* = $0801\n    lda #$01\n    sta $d020\n    rts\n" },
  { id: "no-stub", text: "* = $1000\n    inc $d020\n    jmp $1000\n", basicStub: false },
  { id: "multi-bank", text: "* = $1000\n    rts\n    .fill 30000, i & 255\n" },
  { id: "below-stub", text: "; Entry point: $0400\n* = $0400\n    rts\n" },
  { id: "named", text: "* = $C000\n    rts\n", basicStub: false, name: "my game" },
  { id: "too-large", text: "* = $0801\n    .fill 65500, 0\n", tooLarge: true }
];

test("vma build --crt gives the app's Magic Desk cartridge", { skip: !findRustCli() && "no Rust VMA CLI" }, async () => {
  const cli = findRustCli();
  const ref = createReference();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "vma-crt-"));
  try {
    for (const c of CASES) {
      const js = await ref.compile({ text: c.text, basicStub: c.basicStub !== false });
      assert.ok(js.ok, `${c.id}: ${js.error}`);
      ref.app.__crt = { bytes: js.bytes, sys: js.sysAddress, name: c.name || "VA CART" };
      const expected = ref.app.run(`(() => {
        const prg = Uint8Array.from(__crt.bytes);
        const load = prg[0] | (prg[1] << 8);
        const payload = prg.subarray(2);
        if (payload.length > MAGIC_DESK_MAX_PAYLOAD) return null;
        return Array.from(buildMagicDeskCrt(payload, load, __crt.sys > 0 ? __crt.sys : load, __crt.name));
      })()`);

      const input = path.join(tmp, c.id + ".asm");
      const out = path.join(tmp, c.id + ".crt");
      fs.writeFileSync(input, c.text);
      const args = ["build", input, "--crt", out, ...(c.basicStub === false ? ["--no-basic-stub"] : []), ...(c.name ? ["--crt-name", c.name] : [])];
      const run = spawnSync(cli, args, { encoding: "utf8" });
      if (c.tooLarge) {
        assert.equal(expected, null, `${c.id}: the JS build fits`);
        assert.equal(run.status, 1, `${c.id}: the CLI accepted it`);
        assert.match(run.stderr, /too large for a Magic Desk cartridge \(\d+ > 65408 bytes\)/);
        continue;
      }
      assert.equal(run.status, 0, `${c.id}: ${run.stderr}`);
      assert.ok(!fs.existsSync(path.join(tmp, c.id + ".prg")), `${c.id}: --crt without -o writes no PRG`);
      const got = Array.from(fs.readFileSync(out));
      assert.equal(firstDiff(got, expected), -1, `${c.id}: ${got.length} vs ${expected.length} bytes`);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
