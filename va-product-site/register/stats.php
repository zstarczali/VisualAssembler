<?php
declare(strict_types=1);

// Admin statisztika + kezelés: letöltések, serialok, vásárlások, aktiválások; serial újraküldése,
// újrakérés engedélyezése, donor felvétele. Jelszó: config 'admin_password' vagy VA_ADMIN_PASSWORD.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
session_set_cookie_params(['httponly' => true, 'secure' => true, 'samesite' => 'Strict']);
session_name('va_stats');
session_start();

$h = static fn($s): string => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
$password = vaEnv('VA_ADMIN_PASSWORD') ?: (string) (vaConfig()['admin_password'] ?? '');
$error = '';

if (isset($_GET['logout'])) {
    $_SESSION = [];
    session_destroy();
    header('Location: stats.php');
    exit;
}
if (empty($_SESSION['va_admin']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = vaDb();
    $ip = vaClientIp();
    $st = $db->prepare('SELECT COUNT(*) FROM va_register_attempts WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $st->execute([$ip]);
    if ((int) $st->fetchColumn() >= 10) {
        $error = 'TOO MANY ATTEMPTS, TRY AGAIN LATER.';
    } elseif ($password !== '' && hash_equals($password, (string) ($_POST['password'] ?? ''))) {
        session_regenerate_id(true);
        $_SESSION['va_admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
        header('Location: stats.php');
        exit;
    } else {
        $db->prepare('INSERT INTO va_register_attempts (ip, created_at) VALUES (?, NOW())')->execute([$ip]);
        $error = $password === '' ? 'NO ADMIN PASSWORD CONFIGURED.' : 'WRONG PASSWORD.';
    }
}

// ── Kezelés (POST + CSRF) ─────────────────────────────────────────────────────
if (!empty($_SESSION['va_admin']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $back = 'stats.php' . (($_POST['q'] ?? '') !== '' ? '?q=' . rawurlencode((string) $_POST['q']) : '') . '#manage';
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) ($_POST['csrf'] ?? ''))) {
        $_SESSION['flash'] = ['err', 'FORM EXPIRED, PLEASE RETRY.'];
        header('Location: ' . $back);
        exit;
    }
    $db = vaDb();
    $email = vaNormalizeEmail((string) ($_POST['email'] ?? ''));
    $lang = ($_POST['lang'] ?? '') === 'hu' ? 'hu' : 'en';
    $action = (string) ($_POST['action'] ?? '');
    try {
        if (!vaValidEmail($email)) {
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

$css = <<<'CSS'
@font-face { font-family: 'C64Pro'; src: url('../assets/C64_Pro-STYLE.woff2') format('woff2') }
@font-face { font-family: 'C64Mono'; src: url('../assets/C64_Pro_Mono-STYLE.woff2') format('woff2') }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
:root {
  --bg: #08081a; --scr: #2c2ca8; --scr-dark: #1c1c80; --scr-darker: #12126a;
  --txt: #8888e8; --txt-hi: #b8b8ff; --txt-dim: #6262b0;
  --ylw: #b8c76f; --grn: #9ad284; --cyn: #70a4b2; --red: #ff7777;
  --brd: #363690; --brd-hi: #6868c8;
}
body { background: var(--bg); color: var(--txt); font-family: 'C64Mono', 'Courier New', monospace; font-size: 13px;
  line-height: 1.7; text-transform: uppercase; min-height: 100vh }
body::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9999;
  background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 0, 0, .06) 3px, rgba(0, 0, 0, .06) 4px) }
a { color: var(--txt); text-decoration: none } a:hover { color: var(--txt-hi) }
.rb { height: 7px; position: sticky; top: 0; z-index: 1000;
  background: linear-gradient(90deg, #cc2200 0 16.6%, #cc7700 16.6% 33.2%, #bbbb00 33.2% 49.8%, #00a020 49.8% 66.4%, #1133cc 66.4% 83%, #7700cc 83% 100%) }
nav { background: #0d0d22; border-bottom: 2px solid var(--brd); display: flex; align-items: center; gap: 12px; padding: 0 32px; height: 54px }
.brand { display: flex; align-items: center; gap: 12px; color: var(--txt-hi); font-family: 'C64Pro', monospace; font-size: 13px; letter-spacing: 2px; white-space: nowrap }
.brand img { width: 28px; height: 28px; border-radius: 3px; image-rendering: pixelated }
nav .sp { flex: 1 }
.nav-link { font-size: 11px; letter-spacing: 1px; border: 1px solid var(--brd); padding: 6px 12px }
.nav-link:hover { border-color: var(--ylw); color: var(--ylw) }
.screen { background: var(--scr); min-height: calc(100vh - 61px); padding: 40px 32px 64px }
main { max-width: 1180px; margin: 0 auto }
.sec-s { font-size: 11px; letter-spacing: 4px; color: var(--cyn); margin-bottom: 8px }
.sec-t { font-family: 'C64Pro', monospace; font-size: clamp(18px, 2.4vw, 30px); color: var(--txt-hi); letter-spacing: 3px; margin-bottom: 28px; line-height: 1.3 }
.sec-t span { color: var(--ylw) }
.tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 18px }
.tile { border: 1px solid var(--brd); background: rgba(0, 0, 0, .22); padding: 16px 18px }
.tile b { display: block; font-family: 'C64Pro', monospace; font-weight: normal; font-size: 30px; color: var(--ylw); line-height: 1.2; font-variant-numeric: tabular-nums }
.tile span { font-size: 10px; letter-spacing: 1px; color: var(--txt) }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 12px; margin-bottom: 18px }
.box { border: 1px solid var(--brd); background: rgba(0, 0, 0, .22); padding: 20px 22px; overflow-x: auto }
.box-t { color: var(--txt-hi); font-family: 'C64Pro', monospace; font-size: 12px; letter-spacing: 2px; margin-bottom: 14px }
table { width: 100%; border-collapse: collapse; font-size: 11px }
td, th { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--brd); vertical-align: middle }
.wide td, .wide th { white-space: nowrap }
th { color: var(--txt-dim); font-weight: normal; letter-spacing: 1px }
td.n { text-align: right; font-variant-numeric: tabular-nums; color: var(--txt-hi) }
td.e { text-transform: none; color: var(--txt-hi) }
.bar { display: inline-block; height: 8px; background: var(--ylw); vertical-align: middle; margin-left: 8px; opacity: .7 }
.yes { color: var(--grn) } .no { color: var(--txt-dim) } .warn { color: var(--red) }
form.inline { display: inline }
.btn { font-family: 'C64Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
  background: transparent; color: var(--txt); border: 1px solid var(--brd); padding: 6px 10px; min-height: 30px }
.btn:hover { border-color: var(--ylw); color: var(--ylw); background: rgba(184, 199, 111, .08) }
.btn.pri { border-color: var(--ylw); color: var(--ylw) }
.btn.dng:hover { border-color: var(--red); color: var(--red); background: rgba(255, 119, 119, .08) }
.btn.sm { padding: 3px 8px; min-height: 0; font-size: 9px }
input[type=email], input[type=text], input[type=password], input[type=search], select {
  font-family: 'C64Mono', monospace; font-size: 12px; background: var(--scr-darker); color: var(--txt-hi);
  border: 1px solid var(--brd); padding: 7px 10px; min-height: 34px; text-transform: none }
input:focus, select:focus { outline: 1px solid var(--ylw); border-color: var(--ylw) }
.row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center }
.row input[type=email], .row input[type=search] { flex: 1 1 260px }
.hint { font-size: 10px; color: var(--txt-dim); margin-top: 10px; letter-spacing: 1px; line-height: 1.8 }
.flash { border: 1px solid; padding: 10px 14px; margin-bottom: 18px; font-size: 11px; letter-spacing: 1px; text-transform: none }
.flash.ok { border-color: var(--grn); color: var(--grn); background: rgba(154, 210, 132, .08) }
.flash.err { border-color: var(--red); color: var(--red); background: rgba(255, 119, 119, .08) }
.login { max-width: 380px; margin: 60px auto 0; border: 1px solid var(--brd); background: rgba(0, 0, 0, .22); padding: 28px }
.login input { width: 100%; margin: 14px 0 }
.login .btn { width: 100% }
.cursor { display: inline-block; width: .6em; height: 1em; background: var(--txt-hi); vertical-align: text-bottom; animation: blink 1s steps(1) infinite }
@keyframes blink { 50% { opacity: 0 } }
@media (max-width: 640px) { nav { padding: 0 16px } .screen { padding: 24px 16px 48px } .brand span { display: none } }
CSS;

$page = static function (string $body) use ($css): void {
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<title>C64VA — STATS</title><link rel="icon" href="../favicon.ico"><style>' . $css . '</style></head><body>'
        . '<div class="rb"></div><nav><a class="brand" href="../"><img src="../assets/logo2.png" alt="C64VA"><span>C64 VISUAL ASSEMBLER</span></a>'
        . '<div class="sp"></div>' . (!empty($_SESSION['va_admin']) ? '<a class="nav-link" href="#manage">MANAGE</a><a class="nav-link" href="?logout=1">LOG OUT</a>' : '')
        . '</nav><div class="screen"><main>' . $body . '</main></div></body></html>';
};

if (empty($_SESSION['va_admin'])) {
    ob_start(); ?>
    <div class="login">
        <div class="sec-s">// ADMIN</div>
        <div class="box-t">READY.<span class="cursor"></span></div>
        <?php if ($error !== ''): ?><div class="flash err"><?= $h($error) ?></div><?php endif; ?>
        <form method="post">
            <input type="password" name="password" placeholder="PASSWORD" autofocus required autocomplete="current-password">
            <button class="btn pri" type="submit">LOAD "STATS",8,1</button>
        </form>
    </div>
    <?php $page((string) ob_get_clean());
    exit;
}

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
}
$csrf = $_SESSION['csrf'];
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);
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
        <?php if ($q !== ''): ?><div style="margin-top:18px"><?= $emailTable($found) ?></div><?php endif; ?>
    </div>

    <div class="box"><div class="box-t">LAST 50 SERIALS SENT</div><?= $emailTable($recent) ?></div>
<?php $page((string) ob_get_clean());
