<?php
declare(strict_types=1);

// Ad-hoc üzenet az appnak: GET ?version=&os=&lang=&id= → {"message": null | {id, title, body, url, level}}.
// A legújabb aktív, időablakon belüli, verzióra / OS-re illő üzenet; az app id-nként egyszer mutatja. Kezelés: messages.php
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string) ($_GET['version'] ?? '')), 0, 20);
$os = substr(preg_replace('/[^0-9A-Za-z_\-]/', '', (string) ($_GET['os'] ?? '')), 0, 20);
$hu = ($_GET['lang'] ?? '') === 'hu';
$installId = strtolower((string) ($_GET['id'] ?? ''));
try {
    $db = vaDb();
    $rows = $db->query('SELECT * FROM va_messages WHERE active = 1 AND (starts_at IS NULL OR starts_at <= NOW())
        AND (ends_at IS NULL OR ends_at > NOW()) ORDER BY id DESC')->fetchAll();
    $msg = null;
    foreach ($rows as $r) {
        if ($r['os'] !== '' && $r['os'] !== $os) {
            continue;
        }
        if ($version !== '' && (($r['min_version'] !== '' && version_compare($version, $r['min_version'], '<'))
            || ($r['max_version'] !== '' && version_compare($version, $r['max_version'], '>')))) {
            continue;
        }
        $msg = $r;
        break;
    }
    if ($msg === null) {
        echo json_encode(['message' => null]);
        exit;
    }
    if (preg_match('/^[0-9a-f]{32}$/', $installId)) {
        $db->prepare('INSERT IGNORE INTO va_message_views (message_id, install_id, seen_at) VALUES (?, ?, NOW())')
            ->execute([(int) $msg['id'], $installId]);
    }
    $useHu = $hu && $msg['title_hu'] !== '';
    echo json_encode(['message' => [
        'id' => 'm' . $msg['id'],
        'title' => $useHu ? $msg['title_hu'] : $msg['title_en'],
        'body' => $useHu ? $msg['body_hu'] : $msg['body_en'],
        'url' => $msg['url'],
        'level' => $msg['level'],
    ]], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    error_log('VA message error: ' . $e->getMessage());
    echo json_encode(['message' => null]);
}
