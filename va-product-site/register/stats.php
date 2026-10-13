<?php
declare(strict_types=1);

// Admin statisztika + kezelés: letöltések, serialok, vásárlások, aktiválások; serial újraküldése,
// újrakérés engedélyezése, donor felvétele. Belépés, CSRF, layout: admin.php
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();

// ── Kezelés (POST + CSRF) ─────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $back = 'stats.php' . (($_POST['q'] ?? '') !== '' ? '?q=' . rawurlencode((string) $_POST['q']) : '') . '#manage';
    vaAdminCheckCsrf($back);
    $db = vaDb();
    $email = vaNormalizeEmail((string) ($_POST['email'] ?? ''));
    $lang = ($_POST['lang'] ?? '') === 'hu' ? 'hu' : 'en';
    $action = (string) ($_POST['action'] ?? '');
    try {
        if ($action === 'clear_rate') {
            $n = $db->exec('DELETE FROM va_register_attempts');
            $_SESSION['flash'] = ['ok', 'RATE LIMITS CLEARED (' . (int) $n . ' ATTEMPTS).'];
        } elseif (!vaValidEmail($email)) {
            $_SESSION['flash'] = ['err', 'INVALID EMAIL ADDRESS.'];
        } elseif ($action === 'resend') {
            // a donorlistára is felveszi, így a cím később maga is kérhet
            $db->prepare('INSERT IGNORE INTO va_donors (email, full_name, donated_at) VALUES (?, ?, ?)')
                ->execute([$email, '', gmdate('Y-m-d H:i:s') . ' UTC admin']);
            $st = $db->prepare('SELECT lang FROM va_serial_requests WHERE email = ?');
            $st->execute([$email]);
            $known = $st->fetchColumn();
            $res = vaIssueSerial($email, ($_POST['lang'] ?? '') === '' && $known ? (string) $known : $lang, true);
            $_SESSION['flash'] = $res === 'sent' ? ['ok', "SERIAL SENT: $email"] : ['err', "EMAIL COULD NOT BE SENT: $email"];
        } elseif ($action === 'reset') {
            $db->prepare('DELETE FROM va_serial_requests WHERE email = ?')->execute([$email]);
            $db->prepare('INSERT IGNORE INTO va_donors (email, full_name, donated_at) VALUES (?, ?, ?)')
                ->execute([$email, '', gmdate('Y-m-d H:i:s') . ' UTC admin']);
            $_SESSION['flash'] = ['ok', "CAN REQUEST THE SERIAL AGAIN: $email"];
        } elseif ($action === 'donor') {
            $db->prepare('INSERT IGNORE INTO va_donors (email, full_name, donated_at) VALUES (?, ?, ?)')
                ->execute([$email, substr(trim((string) ($_POST['name'] ?? '')), 0, 255), gmdate('Y-m-d H:i:s') . ' UTC admin']);
            $_SESSION['flash'] = ['ok', "DONOR ADDED: $email"];
        } elseif ($action === 'undonor') {
            $db->prepare('DELETE FROM va_donors WHERE email = ?')->execute([$email]);
            $_SESSION['flash'] = ['ok', "DONOR REMOVED: $email"];
        }
    } catch (Throwable $e) {
        error_log('VA stats action: ' . $e->getMessage());
        $_SESSION['flash'] = ['err', 'SERVER ERROR: ' . $e->getMessage()];
    }
    header('Location: ' . $back);
    exit;
}

$q = vaNormalizeEmail(substr((string) ($_GET['q'] ?? ''), 0, 254));

$db = vaDb();
$one = static fn(string $sql) => $db->query($sql)->fetchColumn() ?: 0;
$all = static fn(string $sql): array => $db->query($sql)->fetchAll();

$dlTotal = (int) $one('SELECT SUM(count) FROM va_download_counts');
$dl30 = (int) $one('SELECT SUM(count) FROM va_download_counts WHERE day > CURDATE() - INTERVAL 30 DAY');
$dlByKey = $all('SELECT file_key, SUM(count) AS n FROM va_download_counts GROUP BY file_key ORDER BY n DESC');
$dlDays = $all('SELECT day, SUM(count) AS n FROM va_download_counts WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY day ORDER BY day DESC');
$donors = (int) $one('SELECT COUNT(*) FROM va_donors');
$serials = (int) $one('SELECT COUNT(*) FROM va_serial_requests WHERE mailed_at IS NOT NULL');
$serials30 = (int) $one('SELECT COUNT(*) FROM va_serial_requests WHERE mailed_at > NOW() - INTERVAL 30 DAY');
$bought = (int) $one("SELECT COUNT(*) FROM va_purchases WHERE state = 'fulfilled'");
$revenue = $all("SELECT currency, SUM(amount) AS total, COUNT(*) AS n FROM va_purchases WHERE state = 'fulfilled' GROUP BY currency");
$problem = $all("SELECT order_id, email, state, created_at FROM va_purchases WHERE state IN ('mail', 'fulfilling') ORDER BY created_at DESC");
$act = (int) $one('SELECT COUNT(*) FROM va_activations');
$actTotal = (int) $one('SELECT SUM(activations) FROM va_activations');
$actOs = $all('SELECT os, COUNT(*) AS n FROM va_activations GROUP BY os ORDER BY n DESC');
$actVer = $all('SELECT version, COUNT(*) AS n FROM va_activations GROUP BY version ORDER BY n DESC');
$rateIps = (int) $one('SELECT COUNT(DISTINCT ip) FROM va_register_attempts WHERE created_at > NOW() - INTERVAL 1 HOUR');
$notActivated = (int) $one('SELECT COUNT(*) FROM va_serial_requests s LEFT JOIN va_activations a ON a.email = s.email WHERE s.mailed_at IS NOT NULL AND a.email IS NULL');

// egy e-mail összes állapota: donor, serial, vásárlás, aktiválás
$emailRows = static function (string $where, array $args, int $limit) use ($db): array {
    $st = $db->prepare("SELECT e.email, d.email IS NOT NULL AS donor, d.full_name, s.mailed_at, s.lang,
            (SELECT COUNT(*) FROM va_purchases p WHERE p.email = e.email AND p.state = 'fulfilled') AS bought,
            a.last_at AS activated, a.version, a.os, a.activations
        FROM (SELECT email FROM va_donors UNION SELECT email FROM va_serial_requests UNION SELECT email FROM va_activations) e
        LEFT JOIN va_donors d ON d.email = e.email
        LEFT JOIN va_serial_requests s ON s.email = e.email
        LEFT JOIN va_activations a ON a.email = e.email
        WHERE $where ORDER BY COALESCE(s.mailed_at, a.last_at, d.added_at) DESC LIMIT $limit");
    $st->execute($args);
    return $st->fetchAll();
};
$found = $q !== '' ? $emailRows('e.email LIKE ?', ['%' . addcslashes($q, '%_\\') . '%'], 100) : [];
$recent = $emailRows('s.mailed_at IS NOT NULL', [], 50);

$pct = static fn(int $a, int $b): string => $b > 0 ? round($a * 100 / $b) . '%' : '-';
$maxDl = max(1, ...array_map(static fn($r) => (int) $r['n'], $dlByKey ?: [['n' => 1]]));
$maxDay = max(1, ...array_map(static fn($r) => (int) $r['n'], $dlDays ?: [['n' => 1]]));

$rowActions = static function (array $r) use ($h, $csrf, $q): string {
    $f = static fn(string $action, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
        . ($confirm !== '' ? ' onsubmit="return confirm(' . $h(json_encode($confirm)) . ')"' : '') . '>'
        . '<input type="hidden" name="csrf" value="' . $h($csrf) . '"><input type="hidden" name="q" value="' . $h($q) . '">'
        . '<input type="hidden" name="email" value="' . $h($r['email']) . '"><input type="hidden" name="action" value="' . $action . '">'
        . '<button class="btn sm ' . $cls . '" type="submit">' . $label . '</button></form> ';
    return $f('resend', 'RESEND', 'pri', 'Resend serial to ' . $r['email'] . '?')
        . ($r['mailed_at'] ? $f('reset', 'ALLOW AGAIN', '', 'Allow a new request for ' . $r['email'] . '?') : '')
        . ($r['donor'] ? '' : $f('donor', '+DONOR', '', ''));
};

$emailTable = static function (array $rows) use ($h, $rowActions): string {
    if (!$rows) {
        return '<p class="no">NO MATCHES.</p>';
    }
    $out = '<table class="wide"><tr><th>EMAIL</th><th>DONOR</th><th>SERIAL SENT</th><th>SOURCE</th><th>ACTIVATED</th><th>VERSION / OS</th><th></th></tr>';
    foreach ($rows as $r) {
        $out .= '<tr><td class="e">' . $h($r['email']) . '</td>'
            . '<td class="' . ($r['donor'] ? 'yes' : 'no') . '">' . ($r['donor'] ? 'YES' : 'NO') . '</td>'
            . '<td class="' . ($r['mailed_at'] ? 'yes' : 'no') . '">' . ($r['mailed_at'] ? $h($r['mailed_at']) : 'NOT YET') . '</td>'
            . '<td>' . ($r['bought'] ? 'PURCHASE' : ($r['donor'] ? 'DONOR' : '-')) . '</td>'
            . '<td class="' . ($r['activated'] ? 'yes' : 'no') . '">' . ($r['activated'] ? $h($r['activated']) . ($r['activations'] > 1 ? ' (' . (int) $r['activations'] . 'X)' : '') : 'NOT YET') . '</td>'
            . '<td>' . $h(trim(($r['version'] ?? '') . ' ' . ($r['os'] ?? ''))) . '</td>'
            . '<td>' . $rowActions($r) . '</td></tr>';
    }
    return $out . '</table>';
};

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">VISUAL ASSEMBLER <span>STATS</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="tiles">
        <div class="tile"><b><?= $dlTotal ?></b><span>DOWNLOADS / LAST 30 DAYS: <?= $dl30 ?></span></div>
        <div class="tile"><b><?= $serials ?></b><span>SERIALS SENT / LAST 30 DAYS: <?= $serials30 ?></span></div>
        <div class="tile"><b><?= $act ?></b><span>ACTIVATED / <?= $pct($act, $serials) ?> OF SERIALS</span></div>
        <div class="tile"><b><?= $notActivated ?></b><span>SERIALS NOT ACTIVATED YET</span></div>
        <div class="tile"><b><?= $bought ?></b><span>PAYPAL PURCHASES</span></div>
        <div class="tile"><b><?= $donors ?></b><span>DONORS ON THE LIST</span></div>
    </div>

    <div class="grid">
        <div class="box"><div class="box-t">DOWNLOADS BY PLATFORM</div><table>
            <?php foreach ($dlByKey as $r): ?><tr><td><?= $h(str_replace('va-', '', $r['file_key'])) ?><span class="bar" style="width:<?= round((int) $r['n'] * 90 / $maxDl) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$dlByKey): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">DOWNLOADS PER DAY / 30 DAYS</div><table>
            <?php foreach ($dlDays as $r): ?><tr><td><?= $h($r['day']) ?><span class="bar" style="width:<?= round((int) $r['n'] * 120 / $maxDay) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$dlDays): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">ACTIVATIONS</div><table>
            <tr><th>OS</th><th></th></tr>
            <?php foreach ($actOs as $r): ?><tr><td><?= $h($r['os'] ?: '?') ?></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <tr><th>VERSION</th><th></th></tr>
            <?php foreach ($actVer as $r): ?><tr><td><?= $h($r['version'] ?: '?') ?></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <tr><td>ALL ACTIVATIONS (INCL. REPEATS)</td><td class="n"><?= $actTotal ?></td></tr>
        </table></div>
        <div class="box"><div class="box-t">REVENUE</div><table>
            <?php foreach ($revenue as $r): ?><tr><td><?= $h($r['currency']) ?></td><td class="n"><?= $h(number_format((float) $r['total'], 2, ',', ' ')) ?></td><td class="n"><?= (int) $r['n'] ?> PCS</td></tr><?php endforeach; ?>
            <?php if (!$revenue): ?><tr><td class="no">NO PURCHASES YET.</td></tr><?php endif; ?>
        </table>
        <?php if ($problem): ?><div class="box-t warn" style="margin-top:18px">PAID, BUT THE EMAIL WAS NOT SENT</div><table>
            <?php foreach ($problem as $r): ?><tr><td class="e"><?= $h($r['email']) ?></td><td><?= $h($r['order_id']) ?></td><td><?= $h($r['created_at']) ?></td></tr><?php endforeach; ?>
        </table><?php endif; ?></div>
    </div>

    <div class="box" id="manage" style="margin-bottom:18px">
        <div class="box-t">MANAGE</div>
        <form method="get" class="row" action="stats.php#manage">
            <input type="search" name="q" value="<?= $h($q) ?>" placeholder="SEARCH EMAIL (PARTIAL OK)">
            <button class="btn" type="submit">SEARCH</button>
        </form>
        <form method="post" class="row" style="margin-top:10px">
            <input type="hidden" name="csrf" value="<?= $h($csrf) ?>"><input type="hidden" name="q" value="<?= $h($q) ?>">
            <input type="email" name="email" required placeholder="EMAIL ADDRESS" value="<?= $h(vaValidEmail($q) ? $q : '') ?>">
            <select name="lang" aria-label="Email language"><option value="en">EN</option><option value="hu">HU</option></select>
            <button class="btn pri" name="action" value="resend" type="submit">SEND SERIAL</button>
            <button class="btn" name="action" value="reset" type="submit">ALLOW NEW REQUEST</button>
            <button class="btn" name="action" value="donor" type="submit">+ DONOR</button>
            <button class="btn dng" name="action" value="undonor" type="submit" onclick="return confirm('Remove donor?')">- DONOR</button>
        </form>
        <p class="hint">SEND SERIAL: (RE)SENDS THE SERIAL RIGHT AWAY AND ADDS THE ADDRESS TO THE DONORS.<br>
            ALLOW NEW REQUEST: CLEARS THE "ALREADY REQUESTED" FLAG, THE ADDRESS CAN REQUEST AGAIN ON THE REGISTER PAGE.<br>
            THE SERIAL IS DERIVED FROM THE EMAIL, SO A RESEND IS ALWAYS THE SAME SERIAL.</p>
        <form method="post" class="row" style="margin-top:12px">
            <input type="hidden" name="csrf" value="<?= $h($csrf) ?>"><input type="hidden" name="q" value="<?= $h($q) ?>">
            <input type="hidden" name="action" value="clear_rate">
            <button class="btn" type="submit">CLEAR RATE LIMITS</button>
            <span class="hint" style="margin:0">IPS WITH FAILED ATTEMPTS IN THE LAST HOUR: <?= $rateIps ?></span>
        </form>
        <?php if ($q !== ''): ?><div style="margin-top:18px"><?= $emailTable($found) ?></div><?php endif; ?>
    </div>

    <div class="box"><div class="box-t">LAST 50 SERIALS SENT</div><?= $emailTable($recent) ?></div>
<?php vaAdminPage('STATS', (string) ob_get_clean());
