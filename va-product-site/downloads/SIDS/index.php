<?php
declare(strict_types=1);

// Installer list for VA SID Studio's "Check for update": the app reads the newest version from the
// file names (VA SID Studio_<ver>_x64-setup.exe, …). Only versions released on the dashboard
// (register/release-studio.php) are listed; newer uploads wait until they are released.
define('VA_REGISTER', true);
require dirname(__DIR__, 2) . '/register/lib.php';

$names = [];
$hotfixes = '';
try {
    $db = vaDb();
    $approved = vaStudioUpdateApproved($db);
    foreach (array_keys(vaInstallers(__DIR__, VA_STUDIO_INSTALLER_PATTERNS)) as $name) {
        $version = vaInstallerVersion($name);
        if ($version !== null && version_compare($version, $approved, '<=')) {
            $names[] = $name;
        }
    }
    sort($names, SORT_NATURAL);
    foreach (array_unique(array_filter(array_map('vaInstallerVersion', $names))) as $version) {
        $level = vaUpdateHotfix($db, $version, false, VA_STUDIO_HOTFIX_SETTING_PREFIX);
        if ($level > 0) {
            $hotfixes .= '<meta name="va-hotfix" content="' . htmlspecialchars("$version $level", ENT_QUOTES) . "\">\n";
        }
    }
} catch (Throwable $e) {
    // without the database the release is unknown: offer no update rather than an unreleased one
    $names = [];
    $hotfixes = '';
    error_log('VA SID Studio update list: ' . $e->getMessage());
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
echo "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>VA SID Studio downloads</title>\n" . $hotfixes . "</head><body>\n<ul>\n";
foreach ($names as $name) {
    $href = htmlspecialchars(rawurlencode($name), ENT_QUOTES);
    echo '<li><a href="' . $href . '">' . htmlspecialchars($name, ENT_QUOTES) . "</a></li>\n";
}
echo "</ul>\n</body></html>\n";
