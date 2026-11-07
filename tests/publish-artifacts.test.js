const test = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const workflow = fs.readFileSync(path.join(root, ".github", "workflows", "publish.yml"), "utf8");

test("FTP publishing: installers, the four documents, TLS, target folder, nothing removed, source build validation", () => {
  execFileSync(process.platform === "win32" ? "python" : "python3", [path.join(__dirname, "publish_artifacts_test.py")], { encoding: "utf8", stdio: "pipe" });
});

test("the workflow checks out exactly the published documents, which exist in the repository", () => {
  const script = fs.readFileSync(path.join(root, "scripts", "publish-artifacts.py"), "utf8");
  const documents = [...script.match(/DOCUMENTS = \(([\s\S]*?)\n\)/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.equal(documents.length, 4);
  for (const document of documents) {
    assert.ok(workflow.includes(`            ${document}`), document);
    assert.ok(fs.existsSync(path.join(root, document)), document);
  }
});

test("the workflow checks out the samples folder that goes into va-samples.zip", () => {
  assert.ok(workflow.includes("            samples/\n") || workflow.includes("            samples/\r\n"));
  assert.ok(fs.existsSync(path.join(root, "samples")));
});

test("the workflow publishes to the VA folder, from the validated build's commit", () => {
  assert.ok(workflow.includes("FTP_DIRECTORY: /www/downloads/VA/"));
  assert.ok(workflow.includes("ref: ${{ steps.source.outputs.head_sha }}"));
  assert.ok(workflow.includes("run-id: ${{ inputs.run_id }}"));
  assert.ok(workflow.includes("persist-credentials: false"));
});

test("the build workflow the publisher accepts exists and uploads its installers", () => {
  const build = fs.readFileSync(path.join(root, ".github", "workflows", "build.yml"), "utf8");
  for (const name of ["windows-${{ matrix.arch }}", "macos-${{ matrix.arch }}", "linux-${{ matrix.arch }}"]) {
    assert.ok(build.includes(`name: ${name}`), name);
  }
});
