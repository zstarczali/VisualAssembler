<?php
declare(strict_types=1);

// Installer list for the in-app updater: C64 Visual Assembler's "Check for Update"
// fetches this directory URL and reads the version from the installer file names
// (C64 Visual Assembler_<ver>_x64-setup.exe, …). Built from the files actually
// uploaded here, but only up to the version released on the admin dashboard
// (register/release.php): newer uploads wait there until they are released.
// ?sup=1 (sent by apps of supporters) lists up to the version released to supporters.
define('VA_REGISTER', true);
require dirname(__DIR__, 2) . '/register/lib.php';

$approved = null;
try {
    $approved = vaUpdateApproved(vaDb(), ($_GET['sup'] ?? '') === '1');
} catch (Throwable $e) {
    // without the database the release is unknown: offer no update rather than an unreleased one
    error_log('VA update list: ' . $e->getMessage());
}

$names = [];
foreach (array_keys(vaInstallers(__DIR__)) as $name) {
    $version = vaInstallerVersion($name);
    if ($approved !== null && $version !== null && version_compare($version, $approved, '<=')) {
        $names[] = $name;
    }
}
sort($names, SORT_NATURAL);

// the hotfix number of every listed version (register/release.php HOTFIX): an app already on that
// version offers it again, marked "hotfix", when its own hotfix number is lower
$hotfixes = '';
try {
    $db = vaDb();
    foreach (array_unique(array_filter(array_map('vaInstallerVersion', $names))) as $version) {
        $level = vaUpdateHotfix($db, $version);
        if ($level > 0) {
            $hotfixes .= '<meta name="va-hotfix" content="' . htmlspecialchars("$version $level", ENT_QUOTES) . "\">\n";
        }
    }
} catch (Throwable $e) {
    error_log('VA hotfix list: ' . $e->getMessage());
}

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
echo "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>C64 Visual Assembler downloads</title>\n" . $hotfixes . "</head><body>\n<ul>\n";
foreach ($names as $name) {
    $href = htmlspecialchars(rawurlencode($name), ENT_QUOTES);
    echo '<li><a href="' . $href . '">' . htmlspecialchars($name, ENT_QUOTES) . "</a></li>\n";
}
echo "</ul>\n</body></html>\n";
