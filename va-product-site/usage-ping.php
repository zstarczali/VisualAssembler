<?php
declare(strict_types=1);

// Anonymous usage ping receiver for the C64 Visual Assembler desktop app.
// Called by the app itself (src-tauri/src/lib.rs: send_usage_ping), at most
// once per 12h per install. No personal data is stored — only a random
// per-install id, app version/OS/arch, and a country code derived from the
// request IP (the IP itself is never written to the database).

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$installId = isset($_GET['id']) ? trim((string) $_GET['id']) : '';
$version   = isset($_GET['v']) ? trim((string) $_GET['v']) : '';
$os        = isset($_GET['os']) ? trim((string) $_GET['os']) : '';
$arch      = isset($_GET['arch']) ? trim((string) $_GET['arch']) : '';

if ($installId === '' || strlen($installId) > 64 || !preg_match('/^[a-zA-Z0-9-]+$/', $installId)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid id']);
    exit;
}
$version = substr($version, 0, 32);
$os      = substr($os, 0, 32);
$arch    = substr($arch, 0, 32);

function client_ip(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = trim(explode(',', (string) $_SERVER[$key])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return '';
}

function is_public_ip(string $ip): bool
{
    return $ip !== '' && filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
}

function lookup_country(PDO $db, string $ip): string
{
    if (!is_public_ip($ip)) {
        return 'XX';
    }

    $stmt = $db->prepare('SELECT country, ts FROM geo_cache WHERE ip = ?');
    $stmt->execute([$ip]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && (time() - (int) $row['ts']) < 30 * 86400) {
        return (string) $row['country'];
    }

    $country = 'XX';
    $ctx = stream_context_create(['http' => ['timeout' => 3]]);
    $resp = @file_get_contents('http://ip-api.com/json/' . rawurlencode($ip) . '?fields=status,countryCode', false, $ctx);
    if ($resp !== false) {
        $data = json_decode($resp, true);
        if (is_array($data) && ($data['status'] ?? '') === 'success' && !empty($data['countryCode'])) {
            $country = strtoupper(substr((string) $data['countryCode'], 0, 2));
        }
    }

    $stmt = $db->prepare(
        'INSERT INTO geo_cache (ip, country, ts) VALUES (:ip, :country, :ts)
         ON CONFLICT(ip) DO UPDATE SET country = excluded.country, ts = excluded.ts'
    );
    $stmt->execute([':ip' => $ip, ':country' => $country, ':ts' => time()]);

    return $country;
}

try {
    $db = new PDO('sqlite:' . __DIR__ . '/usage.sqlite3');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec(
        'CREATE TABLE IF NOT EXISTS pings (
            install_id TEXT NOT NULL,
            day        TEXT NOT NULL,
            ts         INTEGER NOT NULL,
            version    TEXT,
            os         TEXT,
            arch       TEXT,
            country    TEXT,
            PRIMARY KEY (install_id, day)
        )'
    );
    $db->exec('CREATE INDEX IF NOT EXISTS idx_pings_day ON pings(day)');
    $db->exec(
        'CREATE TABLE IF NOT EXISTS geo_cache (
            ip      TEXT PRIMARY KEY,
            country TEXT,
            ts      INTEGER
        )'
    );

    $country = lookup_country($db, client_ip());
    $day = gmdate('Y-m-d');

    $stmt = $db->prepare(
        'INSERT INTO pings (install_id, day, ts, version, os, arch, country)
         VALUES (:id, :day, :ts, :v, :os, :arch, :country)
         ON CONFLICT(install_id, day) DO UPDATE SET
            ts = excluded.ts, version = excluded.version, os = excluded.os,
            arch = excluded.arch, country = excluded.country'
    );
    $stmt->execute([
        ':id' => $installId,
        ':day' => $day,
        ':ts' => time(),
        ':v' => $version,
        ':os' => $os,
        ':arch' => $arch,
        ':country' => $country,
    ]);

    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
