<?php
declare(strict_types=1);

// Névtelen „app indult” jelzés (a 2.6.0-s verziótól, naponta legfeljebb egyszer):
// POST {"id", "version", "os", "lang"?, "launches"?, "minutes"?, "supporter"?}; minutes = aktív használati percek az előző
// sikeres ping óta (a napi sorba a beérkezés napjára kerül), supporter = régi (2.5.6–2.5.9) serial a configban.
// Az id egy véletlen telepítés-azonosító (32 hex) az app configjából;
// e-mail és IP nem kerül tárolásra. Kimutatás: stats.php → USAGE.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
$in = json_decode((string) file_get_contents('php://input'), true);
$in = is_array($in) ? $in : [];
$id = strtolower((string) ($in['id'] ?? ''));
if (!preg_match('/^[0-9a-f]{32}$/', $id)) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}
$version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string) ($in['version'] ?? '')), 0, 20);
$os = substr(preg_replace('/[^0-9A-Za-z_\-]/', '', (string) ($in['os'] ?? '')), 0, 20);
$lang = preg_match('/^[a-z]{2}$/', (string) ($in['lang'] ?? '')) ? (string) $in['lang'] : '';
// appindítások száma az előző sikeres ping óta (régebbi buildek nem küldik → 1)
$launches = max(1, min(1000, (int) ($in['launches'] ?? 1)));
$supporter = ($in['supporter'] ?? false) === true ? 1 : 0;
$minutes = max(0, min(60 * 24 * 60, (int) ($in['minutes'] ?? 0)));
try {
    $db = vaDb();
    vaInstallsMigrate($db);
    $st = $db->prepare('INSERT IGNORE INTO va_install_days (day, id, version, os, launches, minutes) VALUES (CURDATE(), ?, ?, ?, ?, ?)');
    $st->execute([$id, $version, $os, $launches, $minutes]);
    $newDay = $st->rowCount() === 1 ? 1 : 0;
    if (!$newDay) {
        $db->prepare('UPDATE va_install_days SET version = ?, os = ?, launches = launches + ?, minutes = minutes + ? WHERE day = CURDATE() AND id = ?')
            ->execute([$version, $os, $launches, $minutes, $id]);
    }
    $db->prepare("INSERT INTO va_installs (id, version, os, lang, launches, days, minutes, supporter, first_at, last_at) VALUES (?, ?, ?, ?, ?, 1, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE version = VALUES(version), os = VALUES(os), lang = IF(VALUES(lang) = '', lang, VALUES(lang)),
        launches = launches + VALUES(launches), days = days + ?, minutes = minutes + VALUES(minutes), supporter = VALUES(supporter), last_at = NOW()")
        ->execute([$id, $version, $os, $lang, $launches, $minutes, $supporter, $newDay]);
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    error_log('VA ping error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
