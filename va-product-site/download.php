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
    // VMA CLI: the newest uploaded version (vma-<ver>-<platform>.*), no dashboard release; name = the file's own
    'vma-windows-x64' => ['downloads/VMA/vma-*-windows-x64.zip', null],
    'vma-windows-arm64' => ['downloads/VMA/vma-*-windows-arm64.zip', null],
    'vma-macos-x64' => ['downloads/VMA/vma-*-macos-x64.tar.gz', null],
    'vma-macos-arm64' => ['downloads/VMA/vma-*-macos-arm64.tar.gz', null],
    'vma-linux-x64' => ['downloads/VMA/vma-*-linux-x64.tar.gz', null],
];

$key = $_GET['file'] ?? '';
if (!isset($downloads[$key])) {
    http_response_code(404);
    exit('Download not found.');
}

[$pattern, $downloadName] = $downloads[$key];
define('VA_REGISTER', true);
require __DIR__ . '/register/lib.php';

// only up to the version released on the dashboard (register/release.php); without the
// database the last version released before the approval existed
$approved = null;
if (strncmp($key, 'va-', 3) === 0) {
    try {
        $approved = vaUpdateApproved(vaDb());
    } catch (Throwable $e) {
        $approved = VA_UPDATE_DEFAULT;
    }
}
$files = array_values(array_filter(
    glob(__DIR__ . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $pattern)) ?: [],
    static function (string $file) use ($approved): bool {
        $version = vaInstallerVersion(basename($file));
        return $version !== null && ($approved === null || version_compare($version, $approved, '<='));
    }
));
if ($files === []) {
    http_response_code(404);
    exit('Download is not available yet.');
}

// letöltésszámlálás (register/stats.php); hiba esetén a letöltés akkor is megy
try {
    vaDb()->prepare('INSERT INTO va_download_counts (day, file_key, count) VALUES (CURDATE(), ?, 1) ON DUPLICATE KEY UPDATE count = count + 1')
        ->execute([$key]);
} catch (Throwable $e) {
    error_log('VA download count: ' . $e->getMessage());
}

usort($files, static fn(string $a, string $b): int => version_compare((string) vaInstallerVersion(basename($b)), (string) vaInstallerVersion(basename($a))));
$file = $files[0];
$downloadName ??= basename($file);

header('Content-Type: application/octet-stream');
header('Content-Length: ' . (string) filesize($file));
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Cache-Control: no-store');
readfile($file);
