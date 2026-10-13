<?php
declare(strict_types=1);

// Aktiválás-jelzés az apptól (license_activate után, háttérben): POST {"email", "serial", "version", "os"}.
// Csak érvényes e-mail / serial párt rögzít (a serial determinisztikus, így vaMakeSerial-lel összevethető).
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
try {
    $email = vaNormalizeEmail((string) ($in['email'] ?? ''));
    $serial = preg_replace('/\s+/', '', (string) ($in['serial'] ?? ''));
    if (!vaValidEmail($email) || !hash_equals(vaMakeSerial($email), $serial)) {
        http_response_code(400);
        echo json_encode(['ok' => false]);
        exit;
    }
    $version = substr(preg_replace('/[^0-9A-Za-z.\-]/', '', (string) ($in['version'] ?? '')), 0, 20);
    $os = substr(preg_replace('/[^0-9A-Za-z_\-]/', '', (string) ($in['os'] ?? '')), 0, 20);
    vaDb()->prepare('INSERT INTO va_activations (email, version, os, activations, first_at, last_at) VALUES (?, ?, ?, 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE version = VALUES(version), os = VALUES(os), activations = activations + 1, last_at = NOW()')
        ->execute([$email, $version, $os]);
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    error_log('VA activate error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false]);
}
