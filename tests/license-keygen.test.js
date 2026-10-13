const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const keygen = require("../scripts/keygen.js");

test("serials verify for the normalized email only", () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
  const serial = keygen.makeSerial(privateKey, "  Some.One@Example.com ");
  assert.match(serial, /^VA1-[A-Za-z0-9_-]{86}$/);
  assert.equal(keygen.verifySerial(publicKey, "some.one@example.com", serial), true);
  assert.equal(keygen.verifySerial(publicKey, "SOME.ONE@EXAMPLE.COM", serial.replace("VA1-", "VA1- ")), true);
  assert.equal(keygen.verifySerial(publicKey, "other@example.com", serial), false);
  const other = crypto.generateKeyPairSync("ed25519").publicKey;
  assert.equal(keygen.verifySerial(other, "some.one@example.com", serial), false);
});

test("the app's embedded public key is a valid Ed25519 key", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "src-tauri", "src", "license.rs"), "utf8");
  const m = /LICENSE_PUBLIC_KEY: \[u8; 32\] = \[([^\]]+)\]/.exec(src);
  assert.ok(m);
  const raw = Buffer.from(m[1].split(",").map((x) => x.trim()).filter(Boolean).map((x) => parseInt(x, 16)));
  assert.equal(raw.length, 32);
  const key = crypto.createPublicKey({ key: Buffer.concat([Buffer.from("302a300506032b6570032100", "hex"), raw]), format: "der", type: "spki" });
  assert.equal(key.asymmetricKeyType, "ed25519");
});

test("the PHP seed rebuilds the same signing key", () => {
  const { privateKey } = crypto.generateKeyPairSync("ed25519");
  const seed = keygen.privateKeySeed(privateKey);
  assert.equal(seed.length, 32);
  const rebuilt = crypto.createPrivateKey({ key: Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]), format: "der", type: "pkcs8" });
  assert.equal(keygen.makeSerial(rebuilt, "a@b.c"), keygen.makeSerial(privateKey, "a@b.c"));
});

test("donor CSV becomes an escaped, de-duplicated SQL import", () => {
  const { count, sql } = keygen.donorsSql("﻿email,full_name,created_at\r\n A@B.c ,\"O'Neil\",2026-10-01\r\na@b.c,dup,\r\nnope,,\r\n");
  assert.equal(count, 1);
  assert.equal(sql, "INSERT IGNORE INTO va_donors (email, full_name, donated_at) VALUES\n('a@b.c', 'O''Neil', '2026-10-01');\n");
});

test("CSV reader handles quoted fields", () => {
  const rows = keygen.parseCsv('email,full_name\r\n"a@b.c","Doe, ""J"""\r\nx@y.z,\r\n');
  assert.deepEqual(rows, [["email", "full_name"], ["a@b.c", 'Doe, "J"'], ["x@y.z", ""]]);
});
