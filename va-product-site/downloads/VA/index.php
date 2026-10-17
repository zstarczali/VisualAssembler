<?php
declare(strict_types=1);

// Installer list for the in-app updater: C64 Visual Assembler's "Check for Update"
// fetches this directory URL and reads the version from the installer file names
// (C64 Visual Assembler_<ver>_x64-setup.exe, …). Built from the files actually
// uploaded here, but only up to the version released on the admin dashboard
// (register/release.php): newer uploads wait there until they are released.
define('VA_REGISTER', true);
require dirname(__DIR__, 2) . '/register/lib.php';

$approved = null;
try {
    $approved = vaUpdateApproved(vaDb());
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

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
echo "<!DOCTYPE html>\n<html><head><meta charset=\"utf-8\"><title>C64 Visual Assembler downloads</title></head><body>\n<ul>\n";
foreach ($names as $name) {
    $href = htmlspecialchars(rawurlencode($name), ENT_QUOTES);
    echo '<li><a href="' . $href . '">' . htmlspecialchars($name, ENT_QUOTES) . "</a></li>\n";
}
echo "</ul>\n</body></html>\n";
