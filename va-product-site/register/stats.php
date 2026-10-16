<?php
declare(strict_types=1);

// Admin statisztika + kezelés: letöltések, használat (ping.php), serialok, aktiválások; serial újraküldése,
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
vaInstallsMigrate($db);
$one = static fn(string $sql) => $db->query($sql)->fetchColumn() ?: 0;
$all = static fn(string $sql): array => $db->query($sql)->fetchAll();

$dlTotal = (int) $one('SELECT SUM(count) FROM va_download_counts');
$dl30 = (int) $one('SELECT SUM(count) FROM va_download_counts WHERE day > CURDATE() - INTERVAL 30 DAY');
$dlByKey = $all('SELECT file_key, SUM(count) AS n FROM va_download_counts GROUP BY file_key ORDER BY n DESC');
$dlDays = $all('SELECT day, SUM(count) AS n FROM va_download_counts WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY day ORDER BY day DESC');
$donors = (int) $one('SELECT COUNT(*) FROM va_donors');
$serials = (int) $one('SELECT COUNT(*) FROM va_serial_requests WHERE mailed_at IS NOT NULL');
$serials30 = (int) $one('SELECT COUNT(*) FROM va_serial_requests WHERE mailed_at > NOW() - INTERVAL 30 DAY');
$act = (int) $one('SELECT COUNT(*) FROM va_activations');
$actTotal = (int) $one('SELECT SUM(activations) FROM va_activations');
$actOs = $all('SELECT os, COUNT(*) AS n FROM va_activations GROUP BY os ORDER BY n DESC');
$actVer = $all('SELECT version, COUNT(*) AS n FROM va_activations GROUP BY version ORDER BY n DESC');
// használat (ping.php): telepítésenként napi egy sor a va_install_days-ben
$inst = (int) $one('SELECT COUNT(*) FROM va_installs');
$instNew30 = (int) $one('SELECT COUNT(*) FROM va_installs WHERE first_at > NOW() - INTERVAL 30 DAY');
$sup30 = (int) $one('SELECT COUNT(*) FROM va_installs WHERE supporter = 1 AND last_at > NOW() - INTERVAL 30 DAY');
// aktív használati percek (az app a következő pingben küldi, ezért a beérkezés napjára kerülnek)
$min30 = (int) $one('SELECT SUM(minutes) FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY');
$minAll = (int) $one('SELECT SUM(minutes) FROM va_installs');
$useTime = $all("SELECT CASE WHEN m < 10 THEN 'UNDER 10 MIN' WHEN m < 60 THEN '10-60 MIN' WHEN m < 300 THEN '1-5 HOURS' WHEN m < 1200 THEN '5-20 HOURS' ELSE '20+ HOURS' END AS k,
    COUNT(*) AS n, MIN(m) AS o FROM (SELECT id, SUM(minutes) AS m FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY id) t
    GROUP BY k ORDER BY o");
$dau = (int) $one('SELECT COUNT(*) FROM va_install_days WHERE day = CURDATE()');
$wau = (int) $one('SELECT COUNT(DISTINCT id) FROM va_install_days WHERE day > CURDATE() - INTERVAL 7 DAY');
$mau = (int) $one('SELECT COUNT(DISTINCT id) FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY');
$launches30 = (int) $one('SELECT SUM(launches) FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY');
$returning7 = (int) $one('SELECT COUNT(DISTINCT d.id) FROM va_install_days d JOIN va_installs i ON i.id = d.id
    WHERE d.day > CURDATE() - INTERVAL 7 DAY AND i.first_at < NOW() - INTERVAL 7 DAY');
$useDays = $all('SELECT day, COUNT(*) AS n, SUM(launches) AS l, SUM(minutes) AS m FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY day ORDER BY day DESC');
$useBy = static fn(string $col): array => $all("SELECT $col AS k, COUNT(*) AS n FROM va_installs
    WHERE last_at > NOW() - INTERVAL 30 DAY GROUP BY $col ORDER BY n DESC");
$useOs = $useBy('os');
$useVer = $useBy('version');
$useLang = $useBy('lang');
// hány napon használták az elmúlt 30 napban
$useFreq = $all("SELECT CASE WHEN c = 1 THEN '1 DAY' WHEN c <= 4 THEN '2-4 DAYS' WHEN c <= 14 THEN '5-14 DAYS' ELSE '15+ DAYS' END AS k,
    COUNT(*) AS n, MIN(c) AS o FROM (SELECT id, COUNT(*) AS c FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY id) t
    GROUP BY k ORDER BY o");
$topInstalls = $all('SELECT i.*, COALESCE(t.d30, 0) AS d30, COALESCE(t.l30, 0) AS l30, COALESCE(t.m30, 0) AS m30 FROM va_installs i
    LEFT JOIN (SELECT id, COUNT(*) AS d30, SUM(launches) AS l30, SUM(minutes) AS m30 FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY id) t ON t.id = i.id
    ORDER BY m30 DESC, d30 DESC, i.last_at DESC LIMIT 50');
$hm = static fn(int $m): string => intdiv($m, 60) . ':' . str_pad((string) ($m % 60), 2, '0', STR_PAD_LEFT);
// diagramok: az utolsó 30 nap (ma is), a hiányzó napok 0-val
$chartDays = [];
for ($i = 29; $i >= 0; $i--) {
    $chartDays[] = date('Y-m-d', strtotime("-$i day"));
}
$byDay = static function (array $rows, string $key = 'day'): array {
    $out = [];
    foreach ($rows as $r) {
        $out[(string) $r[$key]] = $r;
    }
    return $out;
};
$useByDay = $byDay($useDays);
$dlByDay = $byDay($dlDays);
$newByDay = $byDay($all('SELECT DATE(first_at) AS day, COUNT(*) AS n FROM va_installs WHERE first_at > CURDATE() - INTERVAL 30 DAY GROUP BY DATE(first_at)'));
$series = static function (callable $point) use ($chartDays): array {
    return array_map($point, $chartDays);
};
$chartActive = $series(static function ($d) use ($useByDay, $hm) {
    $r = $useByDay[$d] ?? ['n' => 0, 'l' => 0, 'm' => 0];
    return ['label' => $d, 'value' => (int) $r['n'], 'tip' => "$d: " . (int) $r['n'] . ' INSTALLS, ' . (int) $r['l'] . ' LAUNCHES, ' . $hm((int) $r['m']) . ' USE'];
});
$chartUse = $series(static function ($d) use ($useByDay, $hm) {
    $m = (int) ($useByDay[$d]['m'] ?? 0);
    return ['label' => $d, 'value' => $m, 'tip' => "$d: " . $hm($m) . ' ACTIVE USE (REPORTED THAT DAY)'];
});
$chartDl = $series(static function ($d) use ($dlByDay) {
    $n = (int) ($dlByDay[$d]['n'] ?? 0);
    return ['label' => $d, 'value' => $n, 'tip' => "$d: $n DOWNLOADS"];
});
$chartNew = $series(static function ($d) use ($newByDay) {
    $n = (int) ($newByDay[$d]['n'] ?? 0);
    return ['label' => $d, 'value' => $n, 'tip' => "$d: $n NEW INSTALLS"];
});
// országok (helyi GeoIP, ping.php): aktív (30 nap) és összes telepítés, támogatók, használati idő
$countries = $all("SELECT i.country AS k, SUM(i.last_at > NOW() - INTERVAL 30 DAY) AS active, COUNT(*) AS total,
        SUM(i.supporter = 1 AND i.last_at > NOW() - INTERVAL 30 DAY) AS sup, COALESCE(SUM(t.m30), 0) AS m
    FROM va_installs i
    LEFT JOIN (SELECT id, SUM(minutes) AS m30 FROM va_install_days WHERE day > CURDATE() - INTERVAL 30 DAY GROUP BY id) t ON t.id = i.id
    GROUP BY i.country ORDER BY active DESC, total DESC");
$maxCountry = max(1, ...array_map(static fn($r) => (int) $r['active'], $countries ?: [['active' => 1]]));
$geoRows = (int) ($one('SELECT COUNT(*) FROM va_geoip') ?: 0);
$top10 = array_values(array_filter(array_slice($topInstalls, 0, 10), static fn($r) => (int) $r['m30'] > 0));
$maxTop = max(1, ...array_map(static fn($r) => (int) $r['m30'], $top10 ?: [['m30' => 1]]));
$rateIps = (int) $one('SELECT COUNT(DISTINCT ip) FROM va_register_attempts WHERE created_at > NOW() - INTERVAL 1 HOUR');
$notActivated = (int) $one('SELECT COUNT(*) FROM va_serial_requests s LEFT JOIN va_activations a ON a.email = s.email WHERE s.mailed_at IS NOT NULL AND a.email IS NULL');

// egy e-mail összes állapota: donor, serial, vásárlás, aktiválás
$emailRows = static function (string $where, array $args, int $limit) use ($db): array {
    $st = $db->prepare("SELECT e.email, d.email IS NOT NULL AS donor, d.full_name, s.mailed_at, s.lang,
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
$maxUseDay = max(1, ...array_map(static fn($r) => (int) $r['n'], $useDays ?: [['n' => 1]]));
$maxUse = max(1, $mau);

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
    $out = '<table class="wide"><tr><th>EMAIL</th><th>DONOR</th><th>SERIAL SENT</th><th>ACTIVATED</th><th>VERSION / OS</th><th></th></tr>';
    foreach ($rows as $r) {
        $out .= '<tr><td class="e">' . $h($r['email']) . '</td>'
            . '<td class="' . ($r['donor'] ? 'yes' : 'no') . '">' . ($r['donor'] ? 'YES' : 'NO') . '</td>'
            . '<td class="' . ($r['mailed_at'] ? 'yes' : 'no') . '">' . ($r['mailed_at'] ? $h($r['mailed_at']) : 'NOT YET') . '</td>'
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
    <?php if ($supportUnread = vaSupportUnread()): ?><div class="flash err"><a href="inbox.php" style="color:inherit"><?= $supportUnread ?> SUPPORT CONVERSATION<?= $supportUnread > 1 ? 'S' : '' ?> WITH NEW MESSAGES -></a></div><?php endif; ?>

    <div class="tiles">
        <div class="tile"><b><?= $dlTotal ?></b><span>DOWNLOADS / LAST 30 DAYS: <?= $dl30 ?></span></div>
        <div class="tile"><b><?= $mau ?></b><span>ACTIVE INSTALLS / 30 DAYS (7 DAYS: <?= $wau ?>, TODAY: <?= $dau ?>)</span></div>
        <div class="tile"><b><?= $serials ?></b><span>SERIALS SENT / LAST 30 DAYS: <?= $serials30 ?></span></div>
        <div class="tile"><b><?= $act ?></b><span>ACTIVATED / <?= $pct($act, $serials) ?> OF SERIALS</span></div>
        <div class="tile"><b><?= $notActivated ?></b><span>SERIALS NOT ACTIVATED YET</span></div>
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
    </div>

    <div class="sec-s" id="usage" style="margin-top:28px">// USAGE</div>
    <p class="hint" style="margin:0 0 14px">ANONYMOUS: EVERY INSTALL (APPS FROM 2.6.0) SENDS ONE PING A DAY WITH A RANDOM ID, VERSION, OS, UI LANGUAGE, NUMBER OF LAUNCHES, ACTIVE MINUTES (WINDOW VISIBLE, INPUT IN THE LAST 5 MINUTES) AND WHETHER A 2.5.6-2.5.9 SERIAL IS STORED (SUP = SUPPORTER). NO EMAIL, NO IP (THE COUNTRY IS LOOKED UP IN THE LOCAL GEOIP TABLE, ONLY THE CODE IS KEPT). USE TIME ARRIVES WITH THE NEXT DAY'S PING; LAST SEEN UPDATES AT EVERY START.<br>
        <a href="https://db-ip.com" target="_blank" rel="noopener">IP GEOLOCATION BY DB-IP</a></p>
    <div class="tiles">
        <div class="tile"><b><?= $dau ?></b><span>ACTIVE TODAY</span></div>
        <div class="tile"><b><?= $wau ?></b><span>ACTIVE / 7 DAYS (RETURNING: <?= $returning7 ?>)</span></div>
        <div class="tile"><b><?= $mau ?></b><span>ACTIVE / 30 DAYS (<?= $pct($mau, $inst) ?> OF ALL)</span></div>
        <div class="tile"><b><?= $inst ?></b><span>INSTALLS SEEN / NEW IN 30 DAYS: <?= $instNew30 ?></span></div>
        <div class="tile"><b><?= $launches30 ?></b><span>LAUNCHES / 30 DAYS (<?= $mau ? round($launches30 / $mau, 1) : 0 ?> PER INSTALL)</span></div>
        <div class="tile"><b><?= round($min30 / 60) ?> H</b><span>ACTIVE USE / 30 DAYS (<?= $mau ? $hm(intdiv($min30, $mau)) : '0:00' ?> PER INSTALL, ALL TIME <?= round($minAll / 60) ?> H)</span></div>
        <div class="tile"><b><?= $sup30 ?></b><span>SUPPORTERS ACTIVE / 30 DAYS (<?= $pct($sup30, $mau) ?>)</span></div>
    </div>
    <div class="grid">
        <div class="box"><div class="box-t">ACTIVE INSTALLS PER DAY</div><?= vaColumnChart($chartActive, static fn($v) => (string) (int) $v) ?></div>
        <div class="box"><div class="box-t">ACTIVE USE PER DAY (H:MM)</div><?= vaColumnChart($chartUse, static fn($v) => $hm((int) $v)) ?></div>
        <div class="box"><div class="box-t">NEW INSTALLS PER DAY</div><?= vaColumnChart($chartNew, static fn($v) => (string) (int) $v) ?></div>
        <div class="box"><div class="box-t">DOWNLOADS PER DAY</div><?= vaColumnChart($chartDl, static fn($v) => (string) (int) $v) ?></div>
    </div>
    <div class="grid">
        <div class="box"><div class="box-t">COUNTRIES</div>
            <?php if ($countries): ?><table class="wide">
                <tr><th>COUNTRY</th><th>ACTIVE 30D</th><th>ALL</th><th>SUP</th><th>USE 30D</th></tr>
                <?php foreach ($countries as $r): ?><tr><td><?= $h($r['k'] !== '' ? $r['k'] . ' ' . vaCountryName($r['k']) : 'UNKNOWN') ?><span class="bar" style="width:<?= round((int) $r['active'] * 90 / $maxCountry) ?>px"></span></td>
                    <td class="n"><?= (int) $r['active'] ?></td><td class="n"><?= (int) $r['total'] ?></td><td class="n"><?= (int) $r['sup'] ?></td><td class="n"><?= $hm((int) $r['m']) ?></td></tr><?php endforeach; ?>
            </table><?php else: ?><p class="no">NO DATA YET.</p><?php endif; ?>
            <?php if (!$geoRows): ?><p class="hint">NO GEOIP DATA: LOAD IT ON THE <a href="geoip.php">GEOIP</a> PAGE.</p><?php endif; ?>
        </div>
        <div class="box"><div class="box-t">TOP 10 BY ACTIVE USE / 30 DAYS</div>
            <?php if ($top10): ?><table class="wide">
                <?php foreach ($top10 as $r): ?><tr><td class="id"><?= $h(substr($r['id'], 0, 8)) ?> <?= $h($r['country'] ?: '--') ?><?= $r['supporter'] ? ' <span class="yes">SUP</span>' : '' ?><span class="bar" style="width:<?= round((int) $r['m30'] * 110 / $maxTop) ?>px"></span></td>
                    <td class="n"><?= $hm((int) $r['m30']) ?></td></tr><?php endforeach; ?>
            </table><?php else: ?><p class="no">NO DATA YET.</p><?php endif; ?>
        </div>
    </div>
    <div class="grid">
        <div class="box"><div class="box-t">ACTIVE INSTALLS PER DAY / 30 DAYS</div><table>
            <tr><th>DAY</th><th>INSTALLS</th><th>LAUNCHES</th><th>USE H:MM</th></tr>
            <?php foreach ($useDays as $r): ?><tr><td><?= $h($r['day']) ?><span class="bar" style="width:<?= round((int) $r['n'] * 120 / $maxUseDay) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td><td class="n"><?= (int) $r['l'] ?></td><td class="n"><?= $hm((int) $r['m']) ?></td></tr><?php endforeach; ?>
            <?php if (!$useDays): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">ACTIVE USE PER INSTALL / 30 DAYS</div><table>
            <?php foreach ($useTime as $r): ?><tr><td><?= $h($r['k']) ?><span class="bar" style="width:<?= round((int) $r['n'] * 90 / $maxUse) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$useTime): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">DAYS USED / LAST 30 DAYS</div><table>
            <?php foreach ($useFreq as $r): ?><tr><td><?= $h($r['k']) ?><span class="bar" style="width:<?= round((int) $r['n'] * 90 / $maxUse) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$useFreq): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">VERSION / ACTIVE 30 DAYS</div><table>
            <?php foreach ($useVer as $r): ?><tr><td><?= $h($r['k'] ?: '?') ?><span class="bar" style="width:<?= round((int) $r['n'] * 90 / $maxUse) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$useVer): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">OS / ACTIVE 30 DAYS</div><table>
            <?php foreach ($useOs as $r): ?><tr><td><?= $h($r['k'] ?: '?') ?><span class="bar" style="width:<?= round((int) $r['n'] * 90 / $maxUse) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$useOs): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
        <div class="box"><div class="box-t">UI LANGUAGE / ACTIVE 30 DAYS</div><table>
            <?php foreach ($useLang as $r): ?><tr><td><?= $h($r['k'] !== '' ? strtoupper($r['k']) : '?') ?><span class="bar" style="width:<?= round((int) $r['n'] * 90 / $maxUse) ?>px"></span></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
            <?php if (!$useLang): ?><tr><td class="no">NO DATA YET.</td></tr><?php endif; ?>
        </table></div>
    </div>
    <div class="box" style="margin-bottom:18px"><div class="box-t">MOST ACTIVE INSTALLS / 30 DAYS</div>
        <?php if ($topInstalls): ?><table class="wide">
            <tr><th>INSTALL</th><th>USE 30D</th><th>DAYS 30D</th><th>LAUNCHES 30D</th><th>USE ALL</th><th>DAYS ALL</th><th>LAUNCHES ALL</th><th>FIRST SEEN</th><th>LAST SEEN</th><th>COUNTRY</th><th>VERSION / OS / LANG</th></tr>
            <?php foreach ($topInstalls as $r): ?><tr><td class="id" title="<?= $h($r['id']) ?>"><?= $h(substr($r['id'], 0, 8)) ?><?= $r['supporter'] ? ' <span class="yes">SUP</span>' : '' ?></td>
                <td class="n"><?= $hm((int) $r['m30']) ?></td><td class="n"><?= (int) $r['d30'] ?></td><td class="n"><?= (int) $r['l30'] ?></td><td class="n"><?= $hm((int) $r['minutes']) ?></td><td class="n"><?= (int) $r['days'] ?></td><td class="n"><?= (int) $r['launches'] ?></td>
                <td><?= $h(substr($r['first_at'], 0, 10)) ?></td><td><?= $h(substr($r['last_at'], 0, 16)) ?></td><td><?= $h($r['country'] ?: '--') ?></td>
                <td><?= $h(trim($r['version'] . ' / ' . $r['os'] . ' / ' . strtoupper($r['lang']), ' /')) ?></td></tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO DATA YET.</p><?php endif; ?>
    </div>

    <details class="box" id="manage" data-keep="manage" style="margin-bottom:18px" open>
        <summary class="box-t">MANAGE</summary>
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
    </details>

    <details class="box" data-keep="recent-serials" open><summary class="box-t">LAST 50 SERIALS SENT</summary><?= $emailTable($recent) ?></details>
<?php vaAdminPage('STATS', (string) ob_get_clean());
