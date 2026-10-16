<?php
declare(strict_types=1);

// Támogatási csevegés az appból (Rust support_api): POST JSON, a telepítés-azonosító (id) a beszélgetés kulcsa.
//   {"action": "send", "id", "text", "name", "email"?, "version", "os", "lang"} → {"ok", "messages": […]}
//   {"action": "thread", "id", "read"?: true}                                   → {"ok", "messages": […], "unread", "status"}
//   {"action": "check", "id"}                                                   → {"ok", "unread"}
//   {"action": "file", "id", "file_id"}                                         → {"ok", "name", "mime", "data" (base64)}
// "send" csatolmánnyal: "attachments": [{"name", "data" (base64)}], max 3 db / 4 MB (vaSupportCheckFiles).
// Üzenet: {id, from: "user" | "admin", text (sima szöveg), at (ISO 8601), files: [{id, name, size, image}]}. Kezelés a dashboardon: inbox.php.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const VA_SUPPORT_MAX_TEXT = 4000;
const VA_SUPPORT_PER_HOUR_THREAD = 20;
const VA_SUPPORT_PER_HOUR_IP = 40;

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
$id = strtolower((string) ($in['id'] ?? ''));
if (!preg_match('/^[0-9a-f]{32}$/', $id)) {
    $fail(400, 'invalid');
}
$text = static fn($v, int $max): string => mb_substr(trim(str_replace("\0", '', (string) $v)), 0, $max);
$action = (string) ($in['action'] ?? '');

try {
    $db = vaDb();
    $st = $db->prepare('SELECT * FROM va_support_threads WHERE install_id = ?');
    $st->execute([$id]);
    $thread = $st->fetch() ?: null;

    if ($action === 'check') {
        echo json_encode(['ok' => true, 'unread' => $thread ? (int) $thread['unread_user'] : 0]);
        exit;
    }

    if ($action === 'file') {
        // csak a saját beszélgetés csatolmánya
        $st = $db->prepare('SELECT f.name, f.mime, f.data FROM va_support_files f JOIN va_support_messages m ON m.id = f.message_id
            JOIN va_support_threads t ON t.id = m.thread_id WHERE f.id = ? AND t.install_id = ?');
        $st->execute([(int) ($in['file_id'] ?? 0), $id]);
        $f = $st->fetch();
        if (!$f) {
            $fail(404, 'not_found');
        }
        echo json_encode(['ok' => true, 'name' => $f['name'], 'mime' => $f['mime'], 'data' => base64_encode((string) $f['data'])],
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($action === 'thread') {
        if (!$thread) {
            echo json_encode(['ok' => true, 'messages' => [], 'unread' => 0, 'status' => 'none']);
            exit;
        }
        $unread = (int) $thread['unread_user'];
        if (!empty($in['read']) && $unread > 0) {
            $db->prepare('UPDATE va_support_threads SET unread_user = 0 WHERE id = ?')->execute([(int) $thread['id']]);
        }
        echo json_encode(['ok' => true, 'messages' => vaSupportMessages($db, (int) $thread['id']), 'unread' => $unread,
            'status' => $thread['status']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($action !== 'send') {
        $fail(400, 'invalid');
    }
    $body = $text($in['text'] ?? '', VA_SUPPORT_MAX_TEXT);
    $raw = [];
    foreach (is_array($in['attachments'] ?? null) ? $in['attachments'] : [] as $att) {
        $bytes = base64_decode((string) ($att['data'] ?? ''), true);
        $raw[] = [(string) ($att['name'] ?? ''), $bytes === false ? '' : $bytes];
    }
    $files = vaSupportCheckFiles($raw);
    if (!is_array($files)) {
        $fail(400, $files);
    }
    if ($body === '' && !$files) {
        $fail(400, 'empty');
    }
    $name = $text($in['name'] ?? '', 100);
    if ($name === '') {
        $fail(400, 'name');
    }
    $email = vaNormalizeEmail((string) ($in['email'] ?? ''));
    if ($email !== '' && !vaValidEmail($email)) {
        $fail(400, 'invalid_email');
    }
    // korlát: beszélgetésenként és IP-nként óránként (az IP csak egy napig marad a va_support_rate-ben)
    $ip = vaClientIp();
    $db->exec('DELETE FROM va_support_rate WHERE created_at < NOW() - INTERVAL 1 DAY');
    $st = $db->prepare('SELECT COUNT(*) FROM va_support_rate WHERE ip = ? AND created_at > NOW() - INTERVAL 1 HOUR');
    $st->execute([$ip]);
    $byIp = (int) $st->fetchColumn();
    $byThread = 0;
    if ($thread) {
        $st = $db->prepare("SELECT COUNT(*) FROM va_support_messages WHERE thread_id = ? AND sender = 'user' AND created_at > NOW() - INTERVAL 1 HOUR");
        $st->execute([(int) $thread['id']]);
        $byThread = (int) $st->fetchColumn();
    }
    if ($byIp >= VA_SUPPORT_PER_HOUR_IP || $byThread >= VA_SUPPORT_PER_HOUR_THREAD) {
        $fail(429, 'rate');
    }
    $db->prepare('INSERT INTO va_support_rate (ip, created_at) VALUES (?, NOW())')->execute([$ip]);

    $version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string) ($in['version'] ?? '')), 0, 20);
    $os = substr(preg_replace('/[^0-9A-Za-z_\-]/', '', (string) ($in['os'] ?? '')), 0, 20);
    $lang = preg_match('/^[a-z]{2}$/', (string) ($in['lang'] ?? '')) ? (string) $in['lang'] : '';
    $country = vaCountryForIp($db, $ip);
    $db->beginTransaction();
    $db->prepare("INSERT INTO va_support_threads (install_id, email, name, status, version, os, lang, country, unread_admin, created_at, updated_at)
        VALUES (?, ?, ?, 'open', ?, ?, ?, ?, 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE email = IF(VALUES(email) = '', email, VALUES(email)), name = IF(VALUES(name) = '', name, VALUES(name)),
        status = 'open', version = VALUES(version), os = VALUES(os), lang = IF(VALUES(lang) = '', lang, VALUES(lang)),
        country = IF(VALUES(country) = '', country, VALUES(country)), unread_admin = unread_admin + 1, updated_at = NOW()")
        ->execute([$id, $email, $name, $version, $os, $lang, $country]);
    $st = $db->prepare('SELECT id, email FROM va_support_threads WHERE install_id = ?');
    $st->execute([$id]);
    $row = $st->fetch();
    $threadId = (int) $row['id'];
    $db->prepare("INSERT INTO va_support_messages (thread_id, sender, body, created_at) VALUES (?, 'user', ?, NOW())")->execute([$threadId, $body]);
    vaSupportStoreFiles($db, (int) $db->lastInsertId(), $files);
    $db->commit();

    $notify = (string) (vaConfig()['support_notify'] ?? '') ?: (string) (vaConfig()['bug_notify'] ?? '');
    vaNotifyMail($notify, "[VA support #$threadId] " . mb_substr(preg_replace('/\s+/', ' ', $body !== '' ? $body : '(attachment)'), 0, 60),
        'From: ' . ($row['email'] !== '' ? $row['email'] : '-') . "  Version: $version  OS: $os  Country: " . ($country ?: '-')
        . "\n\n" . mb_substr($body, 0, 3000) . ($files ? "\n\nAttachments: " . implode(', ', array_map(static fn($f) => $f[0], $files)) : '')
        . "\n\nhttps://www.c64va.pro/register/inbox.php?id=$threadId\n");

    echo json_encode(['ok' => true, 'messages' => vaSupportMessages($db, $threadId)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log('VA support error: ' . $e->getMessage());
    $fail(500, 'server');
}
