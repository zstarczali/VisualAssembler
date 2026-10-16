<?php
declare(strict_types=1);

// Ad-hoc üzenet az appnak: GET ?version=&os=&lang=&id=&sup= → {"message": null | {id, caption, title, body, url, level, image}}.
// body = HTML (az app tisztítja), image = a kép címe (?image=<id>) vagy üres. sup=1: a configban régi (2.5.6–2.5.9) serial van;
// audience '' = mindenki, 'supporters' / 'others'. Az id 'm<sorszám>' + '-<rev>', ha a látott állapotot törölték (messages.php RESET SEEN).
// A legújabb aktív, időablakon belüli, verzióra / OS-re illő üzenet; az app id-nként egyszer mutatja. Kezelés: messages.php
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string) ($_GET['version'] ?? '')), 0, 20);
$os = substr(preg_replace('/[^0-9A-Za-z_\-]/', '', (string) ($_GET['os'] ?? '')), 0, 20);
$hu = ($_GET['lang'] ?? '') === 'hu';
$installId = strtolower((string) ($_GET['id'] ?? ''));
$supporter = ($_GET['sup'] ?? '') === '1';
try {
    $db = vaDb();
    vaMessagesMigrate($db);
    // kép: csak aktív üzenethez
    if (isset($_GET['image'])) {
        $st = $db->prepare('SELECT image, image_mime FROM va_messages WHERE id = ? AND active = 1 AND image IS NOT NULL');
        $st->execute([(int) $_GET['image']]);
        $img = $st->fetch();
        if (!$img || !in_array($img['image_mime'], ['image/png', 'image/jpeg', 'image/gif', 'image/webp'], true)) {
            http_response_code(404);
            exit;
        }
        header('Content-Type: ' . $img['image_mime']);
        header('Cache-Control: public, max-age=86400');
        header('X-Content-Type-Options: nosniff');
        echo $img['image'];
        exit;
    }
    // az időablakot PHP-ban nézi, ugyanabban az időzónában, ahogy a messages.php elmentette
    $rows = $db->query('SELECT id, rev, audience, level, caption_en, caption_hu, title_en, body_en, title_hu, body_hu, url, image IS NOT NULL AS has_image,
        min_version, max_version, os, starts_at, ends_at FROM va_messages WHERE active = 1 ORDER BY id DESC')->fetchAll();
    $now = time();
    $msg = null;
    foreach ($rows as $r) {
        if (($r['starts_at'] && strtotime($r['starts_at']) > $now) || ($r['ends_at'] && strtotime($r['ends_at']) <= $now)) {
            continue;
        }
        if ($r['os'] !== '' && $r['os'] !== $os) {
            continue;
        }
        if (($r['audience'] === 'supporters' && !$supporter) || ($r['audience'] === 'others' && $supporter)) {
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
    $useHu = $hu && $msg['title_hu'] !== '' && $msg['body_hu'] !== '';
    echo json_encode(['message' => [
        'id' => 'm' . $msg['id'] . ((int) $msg['rev'] > 0 ? '-' . (int) $msg['rev'] : ''),
        'caption' => $useHu && $msg['caption_hu'] !== '' ? $msg['caption_hu'] : $msg['caption_en'],
        'title' => $useHu ? $msg['title_hu'] : $msg['title_en'],
        'body' => $useHu ? $msg['body_hu'] : $msg['body_en'],
        'url' => $msg['url'],
        'level' => $msg['level'],
        'image' => $msg['has_image'] ? 'https://www.c64va.pro/register/message.php?image=' . $msg['id'] : '',
    ]], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    error_log('VA message error: ' . $e->getMessage());
    echo json_encode(['message' => null]);
}
