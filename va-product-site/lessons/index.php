<?php
declare(strict_types=1);

// Lesson list for C64 Visual Assembler (Tutorials → Online lessons): every
// .vatut file in this folder (a "va-tutorial" lesson exported from the app's
// Lesson Editor) as JSON. Uploading a file publishes it, deleting it removes it.
const LESSON_MAX_BYTES = 1048576;
const LESSON_TEXT_FIELD = '/^(title|desc)(Hu|En|Es|De|Nl|Pl|It)$/';

$lessons = [];
foreach (glob(__DIR__ . DIRECTORY_SEPARATOR . '*.vatut') ?: [] as $path) {
    $file = basename($path);
    if (!preg_match('/^[A-Za-z0-9_-]{1,80}\.vatut$/', $file) || filesize($path) > LESSON_MAX_BYTES) {
        continue;
    }
    $data = json_decode((string)file_get_contents($path), true);
    if (!is_array($data) || ($data['format'] ?? '') !== 'va-tutorial' || !is_array($data['items'] ?? null)
        || !preg_match('/^[A-Za-z0-9_-]{1,64}$/', (string)($data['id'] ?? ''))) {
        continue;
    }
    $entry = [
        'file' => $file,
        'id' => $data['id'],
        'rev' => (int)($data['rev'] ?? 0),
        'category' => is_string($data['category'] ?? null) ? $data['category'] : 'custom',
        'difficulty' => (int)($data['difficulty'] ?? 1),
        'steps' => count($data['items']),
        'size' => filesize($path),
        'updated' => gmdate('Y-m-d', (int)filemtime($path)),
        'author' => is_string($data['author'] ?? null) ? mb_substr($data['author'], 0, 100) : '',
    ];
    foreach ($data as $key => $value) {
        if (is_string($key) && preg_match(LESSON_TEXT_FIELD, $key) && is_string($value)) {
            $entry[$key] = mb_substr($value, 0, 600);
        }
    }
    $lessons[] = $entry;
}
usort($lessons, static fn(array $a, array $b): int => strcmp($a['file'], $b['file']));

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
echo json_encode(['format' => 'va-lesson-index', 'lessons' => $lessons], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
