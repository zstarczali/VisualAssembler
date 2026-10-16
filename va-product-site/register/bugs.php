<?php
declare(strict_types=1);

// Hibajegyek az admin felületen: lista státuszszűrővel, részletek képekkel, státusz / megjegyzés / törlés.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$db = vaDb();
const VA_BUG_STATUSES = ['new', 'open', 'fixed', 'wontfix', 'closed'];

// csatolt kép kiszolgálása (csak bejelentkezve)
if (isset($_GET['att'])) {
    $st = $db->prepare('SELECT mime, data FROM va_bug_attachments WHERE id = ?');
    $st->execute([(int) $_GET['att']]);
    $row = $st->fetch();
    if (!$row) {
        http_response_code(404);
        exit;
    }
    header('Content-Type: ' . $row['mime']);
    header('Content-Disposition: inline');
    header("Content-Security-Policy: default-src 'none'");
    echo $row['data'];
    exit;
}

$id = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $back = 'bugs.php' . ($id ? '?id=' . $id : '');
    vaAdminCheckCsrf($back);
    $action = (string) ($_POST['action'] ?? '');
    try {
        if ($action === 'status' && in_array($_POST['status'] ?? '', VA_BUG_STATUSES, true)) {
            $db->prepare('UPDATE va_bug_reports SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$_POST['status'], $id]);
            $_SESSION['flash'] = ['ok', 'STATUS: ' . strtoupper((string) $_POST['status'])];
        } elseif ($action === 'note') {
            $db->prepare('UPDATE va_bug_reports SET note = ?, updated_at = NOW() WHERE id = ?')
                ->execute([mb_substr((string) ($_POST['note'] ?? ''), 0, 20000), $id]);
            $_SESSION['flash'] = ['ok', 'NOTE SAVED.'];
        } elseif ($action === 'delete') {
            $db->prepare('DELETE FROM va_bug_attachments WHERE report_id = ?')->execute([$id]);
            $db->prepare('DELETE FROM va_bug_reports WHERE id = ?')->execute([$id]);
            $_SESSION['flash'] = ['ok', "BUG #$id DELETED."];
            $back = 'bugs.php';
        }
    } catch (Throwable $e) {
        error_log('VA bugs action: ' . $e->getMessage());
        $_SESSION['flash'] = ['err', 'SERVER ERROR: ' . $e->getMessage()];
    }
    header('Location: ' . $back);
    exit;
}

$csrf = vaAdminCsrf();
$flash = vaAdminFlash();
$status = static fn(string $s): string => '<span class="status st-' . vaH($s) . '">' . vaH(strtoupper($s)) . '</span>';
$hidden = static fn(string $action) => '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="id" value="' . $id . '">'
    . '<input type="hidden" name="action" value="' . $action . '">';

ob_start();
if ($id) {
    $st = $db->prepare('SELECT * FROM va_bug_reports WHERE id = ?');
    $st->execute([$id]);
    $bug = $st->fetch();
    $st = $db->prepare('SELECT id, name, mime, width, height, size FROM va_bug_attachments WHERE report_id = ? ORDER BY id');
    $st->execute([$id]);
    $atts = $st->fetchAll();
    if (!$bug): ?>
        <div class="flash err">BUG #<?= $id ?> NOT FOUND.</div><a class="btn" href="bugs.php">← BACK</a>
    <?php else: ?>
        <div class="sec-s"><a href="bugs.php">// BUGS</a> / #<?= $id ?></div>
        <h1 class="sec-t" style="text-transform:none"><?= vaH($bug['summary']) ?></h1>
        <?php if ($flash): ?><div class="flash <?= vaH($flash[0]) ?>"><?= vaH($flash[1]) ?></div><?php endif; ?>
        <div class="grid">
            <div class="box"><div class="box-t">DETAILS</div><table class="kv">
                <tr><td>STATUS</td><td><?= $status($bug['status']) ?></td></tr>
                <tr><td>REPORTED</td><td><?= vaH($bug['created_at']) ?><?= $bug['updated_at'] ? ' · UPDATED ' . vaH($bug['updated_at']) : '' ?></td></tr>
                <tr><td>FROM</td><td><?= $bug['email'] !== '' ? '<a href="mailto:' . vaH($bug['email']) . '?subject=' . rawurlencode('Re: [VA bug #' . $id . '] ' . $bug['summary']) . '">' . vaH($bug['email']) . '</a>' : '-' ?></td></tr>
                <tr><td>VERSION</td><td><?= vaH($bug['version']) ?> / <?= vaH($bug['os']) ?> / <?= vaH(strtoupper((string) $bug['lang'])) ?> / <?= $bug['licensed'] ? 'PROFESSIONAL' : '-' ?></td></tr>
            </table>
            <form method="post" class="row" style="margin-top:14px"><?= $hidden('status') ?>
                <?php foreach (VA_BUG_STATUSES as $s): ?>
                    <button class="btn sm<?= $s === $bug['status'] ? ' pri' : '' ?>" name="status" value="<?= $s ?>" type="submit"><?= strtoupper($s) ?></button>
                <?php endforeach; ?>
            </form></div>
            <div class="box"><div class="box-t">ADMIN NOTE</div>
                <form method="post"><?= $hidden('note') ?>
                    <textarea class="note" name="note" placeholder="INTERNAL NOTE…"><?= vaH($bug['note'] ?? '') ?></textarea>
                    <div class="row" style="margin-top:8px">
                        <button class="btn pri" type="submit">SAVE NOTE</button>
                    </div>
                </form>
                <form method="post" style="margin-top:14px" onsubmit="return confirm('Delete bug #<?= $id ?>?')"><?= $hidden('delete') ?>
                    <button class="btn dng" type="submit">DELETE REPORT</button>
                </form>
            </div>
        </div>
        <div class="box" style="margin-bottom:18px"><div class="box-t">DESCRIPTION</div>
            <div class="bug-text"><?= vaH($bug['description']) ?></div></div>
        <?php if ($atts): ?><div class="box" style="margin-bottom:18px"><div class="box-t">ATTACHMENTS (<?= count($atts) ?>)</div><div class="shots">
            <?php foreach ($atts as $a): ?>
                <a href="bugs.php?att=<?= (int) $a['id'] ?>" target="_blank" rel="noopener"><img src="bugs.php?att=<?= (int) $a['id'] ?>" alt="<?= vaH($a['name']) ?>" loading="lazy">
                <span class="hint" style="display:block;padding:4px 8px;margin:0;text-transform:none"><?= vaH($a['name']) ?> · <?= (int) $a['width'] ?>×<?= (int) $a['height'] ?> · <?= round($a['size'] / 1024) ?> KB</span></a>
            <?php endforeach; ?></div></div><?php endif; ?>
        <?php if (trim((string) $bug['errors']) !== ''): ?><div class="box" style="margin-bottom:18px"><div class="box-t">RECENT APP ERRORS</div>
            <pre class="bug-text"><?= vaH($bug['errors']) ?></pre></div><?php endif; ?>
        <?php if (trim((string) $bug['sysinfo']) !== '' && $bug['sysinfo'] !== '[]'): ?><div class="box"><div class="box-t">SYSTEM INFO</div>
            <pre class="bug-text"><?= vaH($bug['sysinfo']) ?></pre></div><?php endif; ?>
    <?php endif;
    vaAdminPage('BUG #' . $id, (string) ob_get_clean());
    exit;
}

$filter = (string) ($_GET['status'] ?? 'active');
$where = $filter === 'all' ? '1' : ($filter === 'active' ? "status IN ('new', 'open')" : (in_array($filter, VA_BUG_STATUSES, true) ? 'status = ' . $db->quote($filter) : '1'));
$counts = [];
foreach ($db->query('SELECT status, COUNT(*) AS n FROM va_bug_reports GROUP BY status')->fetchAll() as $r) {
    $counts[$r['status']] = (int) $r['n'];
}
$bugs = $db->query("SELECT r.id, r.status, r.summary, r.email, r.version, r.os, r.created_at,
        (SELECT COUNT(*) FROM va_bug_attachments a WHERE a.report_id = r.id) AS images
    FROM va_bug_reports r WHERE $where ORDER BY r.created_at DESC LIMIT 200")->fetchAll();
$tab = static function (string $key, string $label, int $n) use ($filter): string {
    return '<a class="' . ($filter === $key ? 'on' : '') . '" href="bugs.php?status=' . $key . '">' . $label . ' (' . $n . ')</a>';
};
?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">VISUAL ASSEMBLER <span>BUGS</span></h1>
    <?php if ($flash): ?><div class="flash <?= vaH($flash[0]) ?>"><?= vaH($flash[1]) ?></div><?php endif; ?>
    <div class="tabs">
        <?= $tab('active', 'NEW + OPEN', ($counts['new'] ?? 0) + ($counts['open'] ?? 0)) ?>
        <?php foreach (VA_BUG_STATUSES as $s): ?><?= $tab($s, strtoupper($s), $counts[$s] ?? 0) ?><?php endforeach; ?>
        <?= $tab('all', 'ALL', array_sum($counts)) ?>
    </div>
    <div class="box">
        <?php if (!$bugs): ?><p class="no">NO BUG REPORTS HERE.</p><?php else: ?>
        <table class="wide"><tr><th>#</th><th>STATUS</th><th>SUMMARY</th><th>VERSION / OS</th><th>FROM</th><th>IMG</th><th>REPORTED</th></tr>
            <?php foreach ($bugs as $b): ?><tr>
                <td class="n"><a href="bugs.php?id=<?= (int) $b['id'] ?>"><?= (int) $b['id'] ?></a></td>
                <td><?= $status($b['status']) ?></td>
                <td class="e clip"><a href="bugs.php?id=<?= (int) $b['id'] ?>"><?= vaH($b['summary']) ?></a></td>
                <td><?= vaH($b['version']) ?> <?= vaH($b['os']) ?></td>
                <td class="e"><?= vaH($b['email'] ?: '-') ?></td>
                <td class="n"><?= (int) $b['images'] ?: '' ?></td>
                <td><?= vaH($b['created_at']) ?></td>
            </tr><?php endforeach; ?>
        </table><?php endif; ?>
    </div>
<?php vaAdminPage('BUGS', (string) ob_get_clean());
