const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("splash screen swaps to the Commodore 77 image only for that theme", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "www", "index.html"), "utf8");

  // Default splash image is still logo0.
  assert.ok(
    /id="splash-image"[^>]*src="assets\/logo0\.PNG"/.test(html),
    "default splash <img> should point at assets/logo0.PNG"
  );

  // A gate runs right after the <img> that swaps the src for the commodore77 theme.
  const gate = html.match(/id="splash-image"[\s\S]{0,600}?<\/script>/);
  assert.ok(gate, "expected an inline script after the splash <img>");
  const g = gate[0];
  assert.ok(g.includes('dataset.theme === "commodore77"'), "swap must be gated on the commodore77 theme");
  assert.ok(g.includes("assets/logo1.png"), "swap target image must be referenced");

  // The Commodore 77 splash asset exists.
  assert.ok(
    fs.existsSync(path.join(__dirname, "..", "www", "assets", "logo1.png")),
    "www/assets/logo1.png must exist"
  );

  // The early theme script pre-paints a dark background for commodore77 (no light flash).
  assert.ok(/'commodore77'\s*:\s*'#[0-9a-fA-F]{6}'/.test(html), "head theme script must cover commodore77");
});

test("Commodore 77 splash panel matches the customer-message card and shrinks the logo", () => {
  const css = fs.readFileSync(path.join(__dirname, "..", "www", "style.css"), "utf8");
  const block = css.match(/html\[data-theme="commodore77"\] \.splash-panel \{[^}]*\}/);
  assert.ok(block, "expected a commodore77 .splash-panel override");
  // Same tokens the .customer-message-dialog uses.
  assert.ok(/background:\s*var\(--panel\)/.test(block[0]), "panel background must be var(--panel)");
  assert.ok(/color:\s*var\(--text\)/.test(block[0]), "panel text must be var(--text)");

  assert.ok(
    /html\[data-theme="commodore77"\] \.splash-image \{[^}]*width:\s*min\(/.test(css),
    "expected a commodore77 .splash-image size override"
  );
});
