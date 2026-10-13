<?php
declare(strict_types=1);

// Hibabejelentés az apptól: POST JSON {summary, description, email?, version, os, lang, licensed,
// sysinfo{}, errors[], attachments[{name, data: base64}]} → {"ok": true, "id": N}.
// Képek: PNG / JPEG / WebP / GIF, max 4 db, egyenként max 3 MB (az app előtte kicsinyít).
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const VA_BUG_MAX_FILES = 4;
const VA_BUG_MAX_BYTES = 3 * 1024 * 1024;
const VA_BUG_MIMES = [IMAGETYPE_PNG => 'image/png', IMAGETYPE_JPEG => 'image/jpeg', IMAGETYPE_WEBP => 'image/webp', IMAGETYPE_GIF => 'image/gif'];

$fail = static function (int $code, string $error): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $error]);
    exit;
};
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $fail(405, 'method');
}
$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in)) {
    $fail(400, 'invalid');
}
$text = static fn($v, int $max): string => mb_substr(trim(str_replace("\0", '', (string) $v)), 0, $max);
$summary = $text($in['summary'] ?? '', 200);
$description = $text($in['description'] ?? '', 20000);
if ($summary === '' || $description === '') {
    $fail(400, 'empty');
}
$email = vaNormalizeEmail((string) ($in['email'] ?? ''));
if ($email !== '' && !vaValidEmail($email)) {
    $fail(400, 'invalid_email');
}

try {
    $db = vaDb();
    $ip = vaClientIp();
    $st = $db->prepare('SELECT COUNT(*) FROM va_bug_reports WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $st->execute([$ip]);
    if ((int) $st->fetchColumn() >= (int) (vaConfig()['bug_max_per_hour'] ?? 5)) {
        $fail(429, 'rate');
    }

    $files = [];
    foreach (array_slice(is_array($in['attachments'] ?? null) ? $in['attachments'] : [], 0, VA_BUG_MAX_FILES) as $att) {
        $raw = base64_decode((string) ($att['data'] ?? ''), true);
        if ($raw === false || $raw === '' || strlen($raw) > VA_BUG_MAX_BYTES) {
            continue;
        }
        // csak valódi kép mehet be, a MIME-t a tartalomból vesszük
        $info = @getimagesizefromstring($raw);
        if (!$info || !isset(VA_BUG_MIMES[$info[2]])) {
            continue;
        }
        $files[] = [$text($att['name'] ?? 'image', 200), VA_BUG_MIMES[$info[2]], (int) $info[0], (int) $info[1], $raw];
    }

    $sysinfo = is_array($in['sysinfo'] ?? null) ? $in['sysinfo'] : [];
    $errors = is_array($in['errors'] ?? null) ? array_slice($in['errors'], -30) : [];
    $db->beginTransaction();
    $db->prepare('INSERT INTO va_bug_reports (summary, description, email, version, os, lang, licensed, sysinfo, errors, ip, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())')->execute([
        $summary, $description, $email,
        $text($in['version'] ?? '', 20), $text($in['os'] ?? '', 40), $text($in['lang'] ?? '', 8),
        !empty($in['licensed']) ? 1 : 0,
        mb_substr((string) json_encode($sysinfo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT), 0, 60000),
        mb_substr(implode("\n\n", array_map(static fn($e) => (string) (is_string($e) ? $e : json_encode($e)), $errors)), 0, 200000),
        $ip,
    ]);
    $id = (int) $db->lastInsertId();
    $ins = $db->prepare('INSERT INTO va_bug_attachments (report_id, name, mime, width, height, size, data) VALUES (?, ?, ?, ?, ?, ?, ?)');
    foreach ($files as [$name, $mime, $w, $hgt, $raw]) {
        $ins->bindValue(1, $id, PDO::PARAM_INT);
        $ins->bindValue(2, $name);
        $ins->bindValue(3, $mime);
        $ins->bindValue(4, $w, PDO::PARAM_INT);
        $ins->bindValue(5, $hgt, PDO::PARAM_INT);
        $ins->bindValue(6, strlen($raw), PDO::PARAM_INT);
        $ins->bindValue(7, $raw, PDO::PARAM_LOB);
        $ins->execute();
    }
    $db->commit();
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log('VA bug report error: ' . $e->getMessage());
    $fail(500, 'server');
}

// értesítés az adminnak (opcionális, hibája nem rontja el a bejelentést)
$notify = (string) (vaConfig()['bug_notify'] ?? '');
if ($notify !== '') {
    try {
        $smtp = vaConfig()['smtp'];
        $body = "#$id  $summary\n\nVersion: " . $text($in['version'] ?? '', 20) . "  OS: " . $text($in['os'] ?? '', 40)
            . "\nFrom: " . ($email !== '' ? $email : '-') . "\nImages: " . count($files)
            . "\n\n" . mb_substr($description, 0, 2000) . "\n\nhttps://www.c64va.pro/register/bugs.php?id=$id\n";
        vaSendSmtpMail($smtp['host'], (int) $smtp['port'], $smtp['encryption'], $smtp['user'], $smtp['pass'],
            $smtp['from'], $smtp['from_name'] ?? '', $notify, "[VA bug #$id] $summary", $body);
    } catch (Throwable $e) {
        error_log('VA bug notify error: ' . $e->getMessage());
    }
}
echo json_encode(['ok' => true, 'id' => $id]);
