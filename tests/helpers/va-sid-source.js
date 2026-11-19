// The va-sid crate's source file at the rev Cargo.lock pins: VA_SID_DIR, the cargo git
// checkout, or ../VA-SID. null when none is there (the test is skipped).
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function vaSidSource(file) {
  const root = path.join(__dirname, "..", "..");
  const lock = fs.readFileSync(path.join(root, "src-tauri", "Cargo.lock"), "utf8");
  const rev = lock.match(/source = "git\+https:\/\/github\.com\/zstarczali\/VA-SID\.git\?rev=[0-9a-f]+#([0-9a-f]+)"/)?.[1];
  const dirs = [];
  if (process.env.VA_SID_DIR) dirs.push(process.env.VA_SID_DIR);
  const checkouts = path.join(process.env.CARGO_HOME || path.join(os.homedir(), ".cargo"), "git", "checkouts");
  if (rev && fs.existsSync(checkouts)) {
    for (const name of fs.readdirSync(checkouts).filter((n) => n.startsWith("va-sid-"))) {
      dirs.push(path.join(checkouts, name, rev.slice(0, 7)));
    }
  }
  dirs.push(path.join(root, "..", "VA-SID"));
  for (const dir of dirs) {
    const full = path.join(dir, "src", file);
    if (fs.existsSync(full)) return fs.readFileSync(full, "utf8");
  }
  return null;
}

module.exports = { vaSidSource };
