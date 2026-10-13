<?php
declare(strict_types=1);

$downloads = [
    'va-windows-x64' => ['downloads/VA/C64 Visual Assembler_*_x64-setup.exe', 'c64-visual-assembler-windows-x64-setup.exe'],
    'va-windows-arm64' => ['downloads/VA/C64 Visual Assembler_*_arm64-setup.exe', 'c64-visual-assembler-windows-arm64-setup.exe'],
    'va-macos-x64' => ['downloads/VA/C64 Visual Assembler_*_x64.dmg', 'c64-visual-assembler-macos-intel.dmg'],
    'va-macos-arm64' => ['downloads/VA/C64 Visual Assembler_*_aarch64.dmg', 'c64-visual-assembler-macos-apple-silicon.dmg'],
    'va-linux-appimage' => ['downloads/VA/C64 Visual Assembler_*_amd64.AppImage', 'c64-visual-assembler-linux-x64.AppImage'],
    'va-linux-deb' => ['downloads/VA/C64 Visual Assembler_*_amd64.deb', 'c64-visual-assembler-linux-x64.deb'],
    'va-linux-rpm' => ['downloads/VA/C64 Visual Assembler-*-1.x86_64.rpm', 'c64-visual-assembler-linux-x64.rpm'],
];

$key = $_GET['file'] ?? '';
if (!isset($downloads[$key])) {
    http_response_code(404);
    exit('Download not found.');
}

[$pattern, $downloadName] = $downloads[$key];
$files = glob(__DIR__ . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $pattern));
if ($files === false || $files === []) {
    http_response_code(404);
    exit('Download is not available yet.');
}

// letöltésszámlálás (register/stats.php); hiba esetén a letöltés akkor is megy
try {
    define('VA_REGISTER', true);
    require __DIR__ . '/register/lib.php';
    vaDb()->prepare('INSERT INTO va_download_counts (day, file_key, count) VALUES (CURDATE(), ?, 1) ON DUPLICATE KEY UPDATE count = count + 1')
        ->execute([$key]);
} catch (Throwable $e) {
    error_log('VA download count: ' . $e->getMessage());
}

usort($files, static fn(string $a, string $b): int => filemtime($b) <=> filemtime($a));
$file = $files[0];

header('Content-Type: application/octet-stream');
header('Content-Length: ' . (string) filesize($file));
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Cache-Control: no-store');
readfile($file);
