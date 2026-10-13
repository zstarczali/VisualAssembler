#!/usr/bin/env node
// Visual Assembler license key generator (Ed25519).
// The serial is the Ed25519 signature of "c64va-license-v1:<email>" (email
// trimmed, lower case), written as "VA1-" + base64url. The app only holds the
// public key (src-tauri/src/license.rs), so serials cannot be made from the
// sources. The private key stays outside the repository.
//
//   node scripts/keygen.js init                       new key pair (once), prints the public key
//   node scripts/keygen.js pubkey                     public key of the existing private key
//   node scripts/keygen.js <email>                    serial for one address
//   node scripts/keygen.js csv <in.csv> <out.csv>     serials for every email in a purchases CSV
//   node scripts/keygen.js donors-sql <in.csv> <out.sql>  donor list import (INSERT IGNORE INTO va_donors)
//                                                     for the register page (phpMyAdmin → SQL)
//   node scripts/keygen.js phpkey                     base64 seed of the private key for the
//                                                     va-product-site/register config.php (sign_seed)
//
// Private key: $C64VA_LICENSE_KEY or ~/.c64va/license-private.pem
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const KEY_PATH = process.env.C64VA_LICENSE_KEY || path.join(os.homedir(), ".c64va", "license-private.pem");

function licenseMessage(email) {
  return Buffer.from("c64va-license-v1:" + String(email).trim().toLowerCase(), "utf8");
}

function makeSerial(privateKey, email) {
  return "VA1-" + crypto.sign(null, licenseMessage(email), privateKey).toString("base64url");
}

function verifySerial(publicKey, email, serial) {
  const m = /^VA1-([A-Za-z0-9_-]{86})$/.exec(String(serial).replace(/\s+/g, ""));
  if (!m) return false;
  return crypto.verify(null, licenseMessage(email), publicKey, Buffer.from(m[1], "base64url"));
}

function publicKeyBytes(key) {
  // raw 32-byte Ed25519 public key = the last 32 bytes of the SPKI DER
  const pub = key.type === "public" ? key : crypto.createPublicKey(key);
  return pub.export({ type: "spki", format: "der" }).subarray(-32);
}

// raw 32-byte Ed25519 seed = the last 32 bytes of the PKCS#8 DER (PHP: sodium_crypto_sign_seed_keypair)
function privateKeySeed(key) {
  return key.export({ type: "pkcs8", format: "der" }).subarray(-32);
}

function loadPrivateKey() {
  if (!fs.existsSync(KEY_PATH)) {
    console.error("No private key at " + KEY_PATH + " (run: node scripts/keygen.js init)");
    process.exit(1);
  }
  return crypto.createPrivateKey(fs.readFileSync(KEY_PATH));
}

// Minimal RFC 4180 CSV reader (quoted fields, embedded commas / quotes).
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

function printPublicKey(key) {
  console.log("Public key for src-tauri/src/license.rs:");
  console.log("[" + Array.from(publicKeyBytes(key), (x) => "0x" + x.toString(16).padStart(2, "0")).join(", ") + "]");
}

const sqlStr = (v) => "'" + String(v).replace(/\\/g, "\\\\").replace(/'/g, "''") + "'";

// Donation CSV → SQL for va-product-site/register (email, full_name, created_at columns).
function donorsSql(text) {
  const rows = parseCsv(text.replace(/^﻿/, ""));
  const head = rows.shift() || [];
  const col = (name) => head.findIndex((h) => h.trim().toLowerCase() === name);
  const ei = col("email"), ni = col("full_name"), di = col("created_at");
  if (ei < 0) throw new Error("No 'email' column");
  const seen = new Set();
  const values = [];
  rows.forEach((r) => {
    const email = (r[ei] || "").trim().toLowerCase();
    if (!email.includes("@") || seen.has(email)) return;
    seen.add(email);
    values.push("(" + [email, ni >= 0 ? r[ni] || "" : "", di >= 0 ? r[di] || "" : ""].map(sqlStr).join(", ") + ")");
  });
  return { count: seen.size, sql: values.length
    ? "INSERT IGNORE INTO va_donors (email, full_name, donated_at) VALUES\n" + values.join(",\n") + ";\n" : "" };
}

const csvCell = (v) => (/[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);

function main(argv) {
  const [cmd, a, b] = argv;
  if (cmd === "init") {
    if (fs.existsSync(KEY_PATH)) { console.error("Key already exists: " + KEY_PATH); process.exit(1); }
    const { privateKey, publicKey } = crypto.generateKeyPairSync("ed25519");
    fs.mkdirSync(path.dirname(KEY_PATH), { recursive: true });
    fs.writeFileSync(KEY_PATH, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
    console.log("Private key: " + KEY_PATH + "  (back it up, never commit it)");
    printPublicKey(publicKey);
    return;
  }
  if (cmd === "pubkey") { printPublicKey(loadPrivateKey()); return; }
  if (cmd === "phpkey") { console.log(privateKeySeed(loadPrivateKey()).toString("base64")); return; }
  if (cmd === "csv") {
    if (!a || !b) { console.error("usage: node scripts/keygen.js csv <in.csv> <out.csv>"); process.exit(1); }
    const key = loadPrivateKey();
    const rows = parseCsv(fs.readFileSync(a, "utf8").replace(/^﻿/, ""));
    const head = rows.shift() || [];
    const col = (name) => head.findIndex((h) => h.trim().toLowerCase() === name);
    const ei = col("email"), ni = col("full_name"), di = col("created_at");
    if (ei < 0) { console.error("No 'email' column in " + a); process.exit(1); }
    const seen = new Set();
    const out = [["email", "full_name", "created_at", "serial"].join(",")];
    rows.forEach((r) => {
      const email = (r[ei] || "").trim().toLowerCase();
      if (!email || seen.has(email)) return;
      seen.add(email);
      out.push([email, ni >= 0 ? r[ni] || "" : "", di >= 0 ? r[di] || "" : "", makeSerial(key, email)].map(csvCell).join(","));
    });
    fs.writeFileSync(b, out.join("\r\n") + "\r\n");
    console.log(seen.size + " serials → " + b);
    return;
  }
  if (cmd === "donors-sql") {
    if (!a || !b) { console.error("usage: node scripts/keygen.js donors-sql <in.csv> <out.sql>"); process.exit(1); }
    const { count, sql } = donorsSql(fs.readFileSync(a, "utf8"));
    fs.writeFileSync(b, sql);
    console.log(count + " donors → " + b);
    return;
  }
  if (cmd && cmd.includes("@")) {
    console.log(makeSerial(loadPrivateKey(), cmd));
    return;
  }
  console.error("usage: node scripts/keygen.js init | pubkey | phpkey | <email> | donors-sql <in.csv> <out.sql> | csv <in.csv> <out.csv>");
  process.exit(1);
}

if (require.main === module) main(process.argv.slice(2));
module.exports = { licenseMessage, makeSerial, verifySerial, publicKeyBytes, privateKeySeed, parseCsv, donorsSql };
