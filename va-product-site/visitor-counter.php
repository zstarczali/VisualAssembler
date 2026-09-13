<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$counterFile = __DIR__ . DIRECTORY_SEPARATOR . 'visitor-count.txt';
$handle = fopen($counterFile, 'c+');

if ($handle === false || !flock($handle, LOCK_EX)) {
    http_response_code(500);
    echo json_encode(['error' => 'Counter is unavailable']);
    exit;
}

$rawCount = stream_get_contents($handle);
$count = max(0, (int) trim($rawCount === false ? '0' : $rawCount));

if (empty($_COOKIE['c64va_visitor_seen'])) {
    $count++;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, (string) $count);
    fflush($handle);
    setcookie('c64va_visitor_seen', '1', [
        'expires' => time() + 31536000,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

flock($handle, LOCK_UN);
fclose($handle);

echo json_encode(['count' => $count]);
