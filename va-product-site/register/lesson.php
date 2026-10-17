<?php
declare(strict_types=1);

// Lesson upload from the app's Lesson Editor (Rust upload_tutorial): POST JSON.
//   {"action": "submit", "id", "name", "email"?, "note"?, "lesson", "version", "os", "lang"} → {"ok", "submission"}
// The lesson waits for review on the dashboard (lessons.php); publishing writes ../lessons/<id>.vatut.
// A new upload of the same lesson from the same install replaces its waiting copy.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const VA_LESSON_PER_HOUR_IP = 10;

$fail = static function (int $code, string $error): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $error]);
    exit;
};
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $fail(405, 'method');
}
$in = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($in) || ($in['action'] ?? '') !== 'submit') {
    $fail(400, 'invalid');
}
$id = strtolower((string) ($in['id'] ?? ''));
if (!preg_match('/^[0-9a-f]{32}$/', $id)) {
    $fail(400, 'invalid');
}
$text = static fn($v, int $max): string => mb_substr(trim(str_replace("\0", '', (string) $v)), 0, $max);
$name = $text($in['name'] ?? '', 100);
if ($name === '') {
    $fail(400, 'name');
}
$email = vaNormalizeEmail((string) ($in['email'] ?? ''));
if ($email !== '' && !vaValidEmail($email)) {
    $fail(400, 'invalid_email');
}
$note = $text($in['note'] ?? '', 2000);
$lesson = vaLessonCheck($in['lesson'] ?? null);
if (!is_array($lesson)) {
    $fail(400, $lesson);
}

try {
    $db = vaDb();
    vaLessonsTable($db);
    // limit per IP and hour (the IP stays one day in va_support_rate, shared with the support chat)
    $ip = vaClientIp();
    $db->exec('DELETE FROM va_support_rate WHERE created_at < NOW() - INTERVAL 1 DAY');
    $st = $db->prepare('SELECT COUNT(*) FROM va_support_rate WHERE ip = ? AND created_at > NOW() - INTERVAL 1 HOUR');
    $st->execute([$ip]);
    if ((int) $st->fetchColumn() >= VA_LESSON_PER_HOUR_IP) {
        $fail(429, 'rate');
    }
    $db->prepare('INSERT INTO va_support_rate (ip, created_at) VALUES (?, NOW())')->execute([$ip]);

    $version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string) ($in['version'] ?? '')), 0, 20);
    $os = substr(preg_replace('/[^0-9A-Za-z_\-]/', '', (string) ($in['os'] ?? '')), 0, 20);
    $lang = preg_match('/^[a-z]{2}$/', (string) ($in['lang'] ?? '')) ? (string) $in['lang'] : '';
    $values = [(int) ($lesson['rev'] ?? 0), vaLessonTitle($lesson), count($lesson['items']), $name, $email, $note,
        (string) json_encode($lesson, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $version, $os, $lang, vaCountryForIp($db, $ip)];

    $st = $db->prepare("SELECT id FROM va_lesson_submissions WHERE lesson_id = ? AND install_id = ? AND status = 'pending' ORDER BY id DESC LIMIT 1");
    $st->execute([$lesson['id'], $id]);
    $waiting = (int) ($st->fetchColumn() ?: 0);
    if ($waiting) {
        $db->prepare('UPDATE va_lesson_submissions SET rev = ?, title = ?, steps = ?, name = ?, email = ?, note = ?, data = ?, version = ?, os = ?,
            lang = ?, country = ?, created_at = NOW() WHERE id = ?')->execute(array_merge($values, [$waiting]));
        $submission = $waiting;
    } else {
        $db->prepare("INSERT INTO va_lesson_submissions (rev, title, steps, name, email, note, data, version, os, lang, country, install_id, lesson_id, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())")->execute(array_merge($values, [$id, $lesson['id']]));
        $submission = (int) $db->lastInsertId();
    }

    $notify = (string) (vaConfig()['support_notify'] ?? '') ?: (string) (vaConfig()['bug_notify'] ?? '');
    vaNotifyMail($notify, '[VA lesson #' . $submission . '] ' . vaLessonTitle($lesson),
        "From: $name" . ($email !== '' ? " <$email>" : '') . "  Version: $version  OS: $os\nSteps: " . count($lesson['items'])
        . ($note !== '' ? "\n\n" . $note : '') . "\n\nhttps://www.c64va.pro/register/lessons.php\n");

    echo json_encode(['ok' => true, 'submission' => $submission]);
} catch (Throwable $e) {
    error_log('VA lesson upload error: ' . $e->getMessage());
    $fail(500, 'server');
}
