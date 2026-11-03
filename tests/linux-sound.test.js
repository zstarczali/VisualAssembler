const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const conf = JSON.parse(fs.readFileSync(path.join(root, "src-tauri", "tauri.conf.json"), "utf8"));
const dir = path.join(root, ".github", "workflows");
const workflow = fs.readFileSync(path.join(dir, fs.existsSync(path.join(dir, "build-installers.yml")) ? "build-installers.yml" : "build.yml"), "utf8");

// WebKitGTK plays Web Audio through GStreamer: appsrc is in plugins-base, autoaudiosink in plugins-good.
test("the AppImage carries GStreamer", () => {
  assert.equal(conf.bundle.linux.appimage.bundleMediaFramework, true);
});

test("the packages depend on it", () => {
  const deb = conf.bundle.linux.deb.depends, rpm = conf.bundle.linux.rpm.depends;
  ["gstreamer1.0-plugins-base", "gstreamer1.0-plugins-good"].forEach((p) => assert.ok(deb.includes(p), p));
  ["gstreamer1-plugins-base", "gstreamer1-plugins-good"].forEach((p) => assert.ok(rpm.includes(p), p));
});

test("the build machine has the plugins to bundle, and the build checks they arrived", () => {
  ["gstreamer1.0-plugins-base", "gstreamer1.0-plugins-good"].forEach((p) => assert.ok(workflow.includes(p), p));
  ["libgstapp.so", "libgstautodetect.so"].forEach((p) => assert.ok(workflow.includes(p), p));
  assert.ok(workflow.includes("--appimage-extract"));
});

test("the Linux packages are built on the oldest supported Ubuntu, for its glibc", () => {
  assert.match(workflow, /(runner|os): ubuntu-22\.04/);
  assert.doesNotMatch(workflow, /(runner|os): ubuntu-latest\s*\n\s*(arch|target|bundles)/);
});
