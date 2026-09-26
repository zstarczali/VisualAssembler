<?php
declare(strict_types=1);

// Installer list for the in-app updater: C64 Visual Assembler's "Check for Update"
// fetches this directory URL and reads the version from the installer file names
// (C64 Visual Assembler_<ver>_x64-setup.exe, …). Built from the files actually
// uploaded here, so a release needs no manual version edit.
$patterns = [
    'C64 Visual Assembler_*_x64-setup.exe',
    'C64 Visual Assembler_*_arm64-setup.exe',
    'C64 Visual Assembler_*_x64.dmg',
    'C64 Visual Assembler_*_aarch64.dmg',
    'C64 Visual Assembler_*_amd64.AppImage',
    'C64 Visual Assembler_*_amd64.deb',
    'C64 Visual Assembler-*-1.x86_64.rpm',
];

$names = [];
foreach ($patterns as $pattern) {
    foreach (glob(__DIR__ . DIRECTORY_SEPARATOR . $pattern) ?: [] as $file) {
        $names[] = basename($file);
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
