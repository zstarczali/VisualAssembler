<?php
declare(strict_types=1);

// Ad-hoc üzenetek az appnak (message.php szolgálja ki): létrehozás, szerkesztés, be/ki, törlés, megtekintésszám.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();

$dt = static function (string $s): ?string {
    $t = trim($s) === '' ? false : strtotime($s);
    return $t === false ? null : date('Y-m-d H:i:s', $t);
};
$ver = static fn(string $s): string => substr(preg_replace('/[^0-9A-Za-z.\-]/', '', $s), 0, 20);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    vaAdminCheckCsrf('messages.php');
    $db = vaDb();
    $id = (int) ($_POST['id'] ?? 0);
    $action = (string) ($_POST['action'] ?? '');
    try {
        if ($action === 'save') {
            $f = static fn(string $k, int $max): string => mb_substr(trim((string) ($_POST[$k] ?? '')), 0, $max);
            $url = $f('url', 500);
            if ($url !== '' && !preg_match('#^https://#i', $url)) {
                throw new InvalidArgumentException('THE LINK MUST START WITH https://');
            }
            if ($f('title_en', 200) === '' || $f('body_en', 4000) === '') {
                throw new InvalidArgumentException('THE ENGLISH TITLE AND TEXT ARE REQUIRED.');
            }
            $vals = [
                $f('title_en', 200), $f('body_en', 4000), $f('title_hu', 200), $f('body_hu', 4000), $url,
                ($_POST['level'] ?? '') === 'warn' ? 'warn' : 'info',
                $ver((string) ($_POST['min_version'] ?? '')), $ver((string) ($_POST['max_version'] ?? '')),
                in_array($_POST['os'] ?? '', ['windows', 'macos', 'linux'], true) ? (string) $_POST['os'] : '',
                $dt((string) ($_POST['starts_at'] ?? '')), $dt((string) ($_POST['ends_at'] ?? '')),
                empty($_POST['active']) ? 0 : 1,
            ];
            if ($id > 0) {
                $db->prepare('UPDATE va_messages SET title_en = ?, body_en = ?, title_hu = ?, body_hu = ?, url = ?, level = ?,
                    min_version = ?, max_version = ?, os = ?, starts_at = ?, ends_at = ?, active = ? WHERE id = ?')
                    ->execute([...$vals, $id]);
                $_SESSION['flash'] = ['ok', "MESSAGE #$id SAVED."];
            } else {
                $db->prepare('INSERT INTO va_messages (title_en, body_en, title_hu, body_hu, url, level, min_version, max_version, os,
                    starts_at, ends_at, active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())')->execute($vals);
                $_SESSION['flash'] = ['ok', 'MESSAGE #' . $db->lastInsertId() . ' CREATED.'];
            }
        } elseif ($action === 'toggle') {
            $db->prepare('UPDATE va_messages SET active = 1 - active WHERE id = ?')->execute([$id]);
        } elseif ($action === 'delete') {
            $db->prepare('DELETE FROM va_messages WHERE id = ?')->execute([$id]);
            $db->prepare('DELETE FROM va_message_views WHERE message_id = ?')->execute([$id]);
            $_SESSION['flash'] = ['ok', "MESSAGE #$id DELETED."];
        }
    } catch (InvalidArgumentException $e) {
        $_SESSION['flash'] = ['err', $e->getMessage()];
    } catch (Throwable $e) {
        error_log('VA messages: ' . $e->getMessage());
        $_SESSION['flash'] = ['err', 'SERVER ERROR: ' . $e->getMessage()];
    }
    header('Location: messages.php');
    exit;
}

$db = vaDb();
$list = $db->query('SELECT m.*, (SELECT COUNT(*) FROM va_message_views v WHERE v.message_id = m.id) AS views
    FROM va_messages m ORDER BY m.id DESC')->fetchAll();
$active30 = (int) $db->query('SELECT COUNT(*) FROM va_installs WHERE last_at > NOW() - INTERVAL 30 DAY')->fetchColumn();
$edit = ['id' => 0, 'active' => 1, 'level' => 'info', 'title_en' => '', 'body_en' => '', 'title_hu' => '', 'body_hu' => '',
    'url' => '', 'min_version' => '', 'max_version' => '', 'os' => '', 'starts_at' => null, 'ends_at' => null];
foreach ($list as $m) {
    if ((int) ($_GET['edit'] ?? 0) === (int) $m['id']) {
        $edit = $m;
    }
}
$local = static fn(?string $s): string => $s ? date('Y-m-d\TH:i', strtotime($s)) : '';
$state = static function (array $m): array {
    if (!$m['active']) {
        return ['OFF', 'no'];
    }
    if ($m['starts_at'] && strtotime($m['starts_at']) > time()) {
        return ['SCHEDULED', 'warn'];
    }
    if ($m['ends_at'] && strtotime($m['ends_at']) <= time()) {
        return ['EXPIRED', 'no'];
    }
    return ['LIVE', 'yes'];
};
$btn = static fn(int $id, string $action, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
    . ($confirm !== '' ? ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')"' : '') . '>'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="id" value="' . $id . '">'
    . '<button class="btn sm ' . $cls . '" name="action" value="' . $action . '" type="submit">' . $label . '</button></form> ';
$target = static function (array $m): string {
    $v = $m['min_version'] !== '' || $m['max_version'] !== '' ? ' ' . ($m['min_version'] ?: '*') . ' – ' . ($m['max_version'] ?: '*') : '';
    return ($m['os'] ?: 'ALL OS') . $v;
};

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">IN-APP <span>MESSAGES</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">MESSAGES</div>
        <?php if ($list): ?><table class="wide">
            <tr><th>#</th><th>STATE</th><th>TITLE</th><th>TARGET</th><th>FROM → UNTIL</th><th>RECEIVED BY</th><th></th></tr>
            <?php foreach ($list as $m): [$st, $cls] = $state($m); ?><tr>
                <td class="n"><?= (int) $m['id'] ?></td>
                <td class="<?= $cls ?>"><?= $st ?><?= $m['level'] === 'warn' ? ' / WARN' : '' ?></td>
                <td class="e clip"><?= $h($m['title_en']) ?><?= $m['title_hu'] !== '' ? ' <span class="no">+HU</span>' : '' ?></td>
                <td><?= $h($target($m)) ?></td>
                <td><?= $h(($m['starts_at'] ? substr($m['starts_at'], 0, 16) : '-') . ' → ' . ($m['ends_at'] ? substr($m['ends_at'], 0, 16) : '-')) ?></td>
                <td class="n"><?= (int) $m['views'] ?></td>
                <td><a class="btn sm" href="messages.php?edit=<?= (int) $m['id'] ?>#form">EDIT</a>
                    <?= $btn((int) $m['id'], 'toggle', $m['active'] ? 'TURN OFF' : 'TURN ON', '', '') ?>
                    <?= $btn((int) $m['id'], 'delete', 'DELETE', 'dng', 'Delete message #' . $m['id'] . '?') ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO MESSAGES YET.</p><?php endif; ?>
        <p class="hint">THE APP ASKS FOR A MESSAGE AT START-UP AND SHOWS THE NEWEST LIVE ONE THAT MATCHES ITS OS AND VERSION, ONCE PER MESSAGE.<br>
            RECEIVED BY = INSTALLS THAT GOT IT (<?= $active30 ?> INSTALLS WERE ACTIVE IN THE LAST 30 DAYS). AN EDITED MESSAGE IS NOT SHOWN AGAIN; FOR THAT, CREATE A NEW ONE.</p>
    </div>

    <div class="box" id="form">
        <div class="box-t"><?= $edit['id'] ? 'EDIT MESSAGE #' . (int) $edit['id'] : 'NEW MESSAGE' ?></div>
        <form method="post" class="msg-form">
            <input type="hidden" name="csrf" value="<?= $h($csrf) ?>"><input type="hidden" name="id" value="<?= (int) $edit['id'] ?>">
            <label>TITLE (EN) *<input type="text" name="title_en" maxlength="200" required value="<?= $h($edit['title_en']) ?>"></label>
            <label>TEXT (EN) *<textarea class="note" name="body_en" maxlength="4000" required><?= $h($edit['body_en']) ?></textarea></label>
            <label>TITLE (HU)<input type="text" name="title_hu" maxlength="200" value="<?= $h($edit['title_hu']) ?>"></label>
            <label>TEXT (HU)<textarea class="note" name="body_hu" maxlength="4000"><?= $h($edit['body_hu']) ?></textarea></label>
            <label>LINK (OPTIONAL, HTTPS)<input type="text" name="url" maxlength="500" placeholder="https://www.c64va.pro/" value="<?= $h($edit['url']) ?>"></label>
            <div class="row">
                <label>LEVEL<select name="level"><option value="info">INFO</option><option value="warn"<?= $edit['level'] === 'warn' ? ' selected' : '' ?>>WARN</option></select></label>
                <label>OS<select name="os"><?php foreach (['' => 'ALL', 'windows' => 'WINDOWS', 'macos' => 'MACOS', 'linux' => 'LINUX'] as $k => $v): ?><option value="<?= $k ?>"<?= $edit['os'] === $k ? ' selected' : '' ?>><?= $v ?></option><?php endforeach; ?></select></label>
                <label>MIN VERSION<input type="text" name="min_version" size="8" placeholder="2.6.0" value="<?= $h($edit['min_version']) ?>"></label>
                <label>MAX VERSION<input type="text" name="max_version" size="8" value="<?= $h($edit['max_version']) ?>"></label>
                <label>FROM<input type="datetime-local" name="starts_at" value="<?= $h($local($edit['starts_at'])) ?>"></label>
                <label>UNTIL<input type="datetime-local" name="ends_at" value="<?= $h($local($edit['ends_at'])) ?>"></label>
                <label class="chk"><input type="checkbox" name="active" value="1"<?= $edit['active'] ? ' checked' : '' ?>> ACTIVE</label>
            </div>
            <div class="row" style="margin-top:14px">
                <button class="btn pri" name="action" value="save" type="submit"><?= $edit['id'] ? 'SAVE' : 'CREATE' ?></button>
                <?php if ($edit['id']): ?><a class="btn" href="messages.php#form">CANCEL</a><?php endif; ?>
            </div>
        </form>
        <p class="hint">PLAIN TEXT, LINE BREAKS ARE KEPT. OTHER UI LANGUAGES GET THE ENGLISH TEXT. TIMES ARE SERVER TIME (NOW: <?= date('Y-m-d H:i') ?>).</p>
    </div>
<?php vaAdminPage('MESSAGES', (string) ob_get_clean());
