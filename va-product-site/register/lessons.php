<?php
declare(strict_types=1);

// Lessons uploaded from the app's Lesson Editor (lesson.php): review, download to try in the app
// (Lesson Editor → Files → Import), PUBLISH to ../lessons/<id>.vatut (the app's Online lessons list),
// REJECT, DELETE; published lessons can be UNPUBLISHED. The author's name is published, the email is not.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();
$db = vaDb();
vaLessonsTable($db);

$row = static function (int $id) use ($db): ?array {
    $st = $db->prepare('SELECT * FROM va_lesson_submissions WHERE id = ?');
    $st->execute([$id]);
    return $st->fetch() ?: null;
};

if (isset($_GET['download'])) {
    $r = $row((int) $_GET['download']);
    if (!$r) {
        http_response_code(404);
        exit('Not found.');
    }
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $r['lesson_id'] . '.vatut"');
    echo $r['data'];
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    vaAdminCheckCsrf('lessons.php');
    $action = (string) ($_POST['action'] ?? '');
    $id = (int) ($_POST['id'] ?? 0);
    try {
        if ($action === 'publish' && ($r = $row($id))) {
            $lesson = vaLessonCheck(json_decode((string) $r['data'], true));
            if (!is_array($lesson)) {
                throw new InvalidArgumentException('THE STORED LESSON IS NOT VALID.');
            }
            // the same id from another author must not overwrite a published lesson
            $st = $db->prepare("SELECT COUNT(*) FROM va_lesson_submissions WHERE lesson_id = ? AND install_id <> ? AND status = 'published'");
            $st->execute([$r['lesson_id'], $r['install_id']]);
            $fileId = (int) $st->fetchColumn() > 0 ? substr($r['lesson_id'], 0, 54) . '-' . $id : $r['lesson_id'];
            $lesson['id'] = $fileId;
            $lesson['author'] = $r['name'];
            if (!is_dir(VA_LESSON_DIR) && !mkdir(VA_LESSON_DIR, 0755, true)) {
                throw new RuntimeException('THE LESSONS FOLDER CANNOT BE CREATED.');
            }
            $file = $fileId . '.vatut';
            if (file_put_contents(VA_LESSON_DIR . '/' . $file, json_encode($lesson, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) === false) {
                throw new RuntimeException('THE LESSON FILE CANNOT BE WRITTEN.');
            }
            $db->prepare("UPDATE va_lesson_submissions SET status = 'replaced' WHERE file = ? AND status = 'published'")->execute([$file]);
            $db->prepare("UPDATE va_lesson_submissions SET status = 'published', file = ?, decided_at = NOW() WHERE id = ?")->execute([$file, $id]);
            $_SESSION['flash'] = ['ok', "LESSON #$id IS PUBLISHED AS LESSONS/$file."];
        } elseif ($action === 'reject' && $row($id)) {
            $db->prepare("UPDATE va_lesson_submissions SET status = 'rejected', decided_at = NOW() WHERE id = ?")->execute([$id]);
            $_SESSION['flash'] = ['ok', "LESSON #$id REJECTED."];
        } elseif ($action === 'delete' && $row($id)) {
            $db->prepare('DELETE FROM va_lesson_submissions WHERE id = ?')->execute([$id]);
            $_SESSION['flash'] = ['ok', "SUBMISSION #$id DELETED."];
        } elseif ($action === 'unpublish' && preg_match('/^[A-Za-z0-9_-]{1,80}\.vatut$/', $file = (string) ($_POST['file'] ?? ''))) {
            if (is_file(VA_LESSON_DIR . '/' . $file)) {
                unlink(VA_LESSON_DIR . '/' . $file);
            }
            $db->prepare("UPDATE va_lesson_submissions SET status = 'unpublished' WHERE file = ? AND status = 'published'")->execute([$file]);
            $_SESSION['flash'] = ['ok', "LESSONS/$file IS NO LONGER PUBLISHED."];
        }
    } catch (Throwable $e) {
        $_SESSION['flash'] = ['err', $e->getMessage()];
    }
    header('Location: lessons.php');
    exit;
}

$list = $db->query("SELECT id, lesson_id, rev, title, steps, name, email, note, version, os, country, status, file, created_at, data
    FROM va_lesson_submissions ORDER BY status = 'pending' DESC, id DESC LIMIT 150")->fetchAll();
$published = [];
foreach (glob(VA_LESSON_DIR . '/*.vatut') ?: [] as $path) {
    $data = json_decode((string) file_get_contents($path), true);
    $published[] = ['file' => basename($path), 'title' => is_array($data) ? vaLessonTitle($data) : '?',
        'author' => is_array($data) ? (string) ($data['author'] ?? '') : '', 'date' => date('Y-m-d', (int) filemtime($path))];
}
$stateCls = ['pending' => 'warn', 'published' => 'yes'];
$btn = static fn(int $id, string $action, string $label, string $cls, string $confirm, string $file = '') => '<form class="inline" method="post"'
    . ($confirm !== '' ? ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')"' : '') . '>'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="id" value="' . $id . '">'
    . '<input type="hidden" name="file" value="' . vaH($file) . '">'
    . '<button class="btn sm ' . $cls . '" name="action" value="' . $action . '" type="submit">' . $label . '</button></form> ';
// the steps in short: text steps by title, instructions by mnemonic and operand
$steps = static function (string $json): string {
    $lesson = json_decode($json, true);
    $out = [];
    foreach ((array) ($lesson['items'] ?? []) as $i => $item) {
        $out[] = ($i + 1) . '. ' . (($item['kind'] ?? '') === 'instr'
            ? trim(($item['block']['mnemonic'] ?? '?') . ' ' . ($item['block']['rawOperand'] ?? ''))
            : 'TEXT: ' . vaLessonTitle(['titleEn' => $item['titleEn'] ?? '', 'titleHu' => $item['titleHu'] ?? ''] + $item));
    }
    return implode("\n", $out);
};

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">UPLOADED <span>LESSONS</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">SUBMISSIONS</div>
        <?php if ($list): ?><table class="wide">
            <tr><th>#</th><th>STATE</th><th>LESSON</th><th>AUTHOR</th><th>STEPS</th><th>APP</th><th>SENT</th><th></th></tr>
            <?php foreach ($list as $r): ?><tr>
                <td class="n"><?= (int) $r['id'] ?></td>
                <td class="<?= $stateCls[$r['status']] ?? 'no' ?>"><?= $h(strtoupper($r['status'])) ?></td>
                <td class="e"><?= $h($r['title']) ?> <span class="no">(<?= $h($r['lesson_id']) ?>, REV <?= (int) $r['rev'] ?>)</span>
                    <?php if ($r['note'] !== ''): ?><br><span class="no"><?= $h($r['note']) ?></span><?php endif; ?>
                    <details><summary class="no">STEPS</summary><pre style="white-space:pre-wrap;margin:6px 0"><?= $h($steps((string) $r['data'])) ?></pre></details></td>
                <td><?= $h($r['name']) ?><?= $r['email'] !== '' ? '<br><span class="no">' . $h($r['email']) . '</span>' : '' ?></td>
                <td class="n"><?= (int) $r['steps'] ?></td>
                <td><?= $h($r['version'] . ' ' . $r['os'] . ($r['country'] !== '' ? ' ' . $r['country'] : '')) ?></td>
                <td><?= $h(substr((string) $r['created_at'], 0, 16)) ?></td>
                <td><a class="btn sm" href="lessons.php?download=<?= (int) $r['id'] ?>">DOWNLOAD</a>
                    <?php if ($r['status'] !== 'published'): ?><?= $btn((int) $r['id'], 'publish', 'PUBLISH', 'pri', 'Publish lesson #' . $r['id'] . '? It appears in every app\'s Online lessons list.') ?><?php endif; ?>
                    <?php if ($r['status'] === 'pending'): ?><?= $btn((int) $r['id'], 'reject', 'REJECT', '', '') ?><?php endif; ?>
                    <?= $btn((int) $r['id'], 'delete', 'DELETE', 'dng', 'Delete submission #' . $r['id'] . '? A published file stays.') ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO LESSONS UPLOADED YET.</p><?php endif; ?>
        <p class="hint">DOWNLOAD A LESSON AND IMPORT IT IN THE APP (LESSON EDITOR → FILES → IMPORT) TO TRY IT BEFORE PUBLISHING.<br>
            PUBLISH WRITES LESSONS/&lt;ID&gt;.VATUT WITH THE AUTHOR'S NAME (NOT THE EMAIL); A NEWER UPLOAD OF THE SAME LESSON REPLACES IT WHEN PUBLISHED.
            IF ANOTHER AUTHOR ALREADY PUBLISHED THE SAME ID, THE NEW ONE GETS ITS OWN ID.</p>
    </div>

    <div class="box">
        <div class="box-t">PUBLISHED (LESSONS/)</div>
        <?php if ($published): ?><table class="wide">
            <tr><th>FILE</th><th>LESSON</th><th>AUTHOR</th><th>DATE</th><th></th></tr>
            <?php foreach ($published as $p): ?><tr>
                <td><?= $h($p['file']) ?></td><td class="e"><?= $h($p['title']) ?></td><td><?= $h($p['author'] ?: '-') ?></td><td><?= $h($p['date']) ?></td>
                <td><?= $btn(0, 'unpublish', 'UNPUBLISH', 'dng', 'Remove ' . $p['file'] . ' from the online lessons?', $p['file']) ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NOTHING PUBLISHED.</p><?php endif; ?>
    </div>
<?php vaAdminPage('LESSONS', (string) ob_get_clean());
