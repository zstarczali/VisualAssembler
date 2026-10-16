<?php
declare(strict_types=1);

// Közös admin rész (stats.php, bugs.php): munkamenet, belépés, CSRF, flash üzenet, C64 layout.
// Jelszó: VA_ADMIN_PASSWORD környezeti változó vagy config 'admin_password'.

if (!defined('VA_REGISTER')) {
    http_response_code(403);
    exit;
}

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
session_set_cookie_params(['httponly' => true, 'secure' => true, 'samesite' => 'Strict']);
session_name('va_stats');
session_start();

function vaH($s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
}

/** Belépés kikényszerítése: ha nincs bejelentkezve, kirajzolja a belépő oldalt és kilép. */
function vaAdminRequire(): void
{
    $self = basename((string) ($_SERVER['SCRIPT_NAME'] ?? 'stats.php'));
    if (isset($_GET['logout'])) {
        $_SESSION = [];
        session_destroy();
        header('Location: stats.php');
        exit;
    }
    if (!empty($_SESSION['va_admin'])) {
        return;
    }
    $password = vaEnv('VA_ADMIN_PASSWORD') ?: (string) (vaConfig()['admin_password'] ?? '');
    $error = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
            header('Location: ' . $self . (($_SERVER['QUERY_STRING'] ?? '') !== '' ? '?' . $_SERVER['QUERY_STRING'] : ''));
            exit;
        } else {
            $db->prepare('INSERT INTO va_register_attempts (ip, created_at) VALUES (?, NOW())')->execute([$ip]);
            $error = $password === '' ? 'NO ADMIN PASSWORD CONFIGURED.' : 'WRONG PASSWORD.';
        }
    }
    ob_start(); ?>
    <div class="login">
        <div class="sec-s">// ADMIN</div>
        <div class="box-t">READY.<span class="cursor"></span></div>
        <?php if ($error !== ''): ?><div class="flash err"><?= vaH($error) ?></div><?php endif; ?>
        <form method="post">
            <input type="password" name="password" placeholder="PASSWORD" autofocus required autocomplete="current-password">
            <button class="btn pri" type="submit">LOAD "STATS",8,1</button>
        </form>
    </div>
    <?php vaAdminPage('LOGIN', (string) ob_get_clean());
    exit;
}

function vaAdminCsrf(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function vaAdminCheckCsrf(string $back): void
{
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) ($_POST['csrf'] ?? ''))) {
        // a post_max_size-nál nagyobb kérésnél a PHP üres $_POST-ot ad
        $tooBig = $_POST === [] && (int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0;
        $_SESSION['flash'] = ['err', $tooBig ? 'THE UPLOAD WAS TOO LARGE FOR THE SERVER (MAX ' . ini_get('post_max_size') . ').' : 'FORM EXPIRED, PLEASE RETRY.'];
        header('Location: ' . $back);
        exit;
    }
}

function vaAdminFlash(): ?array
{
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $flash;
}

/** Olvasatlan felhasználói üzenetet tartalmazó támogatási beszélgetések száma (nav, stats). */
function vaSupportUnread(): int
{
    return (int) vaDb()->query('SELECT COUNT(*) FROM va_support_threads WHERE unread_admin > 0')->fetchColumn();
}

/** A felhasználóktól érkezett támogatási üzenetek száma: az élő értesítés ennek a növekedéséből tudja, hogy új üzenet jött. */
function vaSupportUserMessages(): int
{
    return (int) vaDb()->query("SELECT COUNT(*) FROM va_support_messages WHERE sender = 'user'")->fetchColumn();
}

function vaAdminPage(string $title, string $body): void
{
    $nav = '';
    if (!empty($_SESSION['va_admin'])) {
        $open = 0;
        $support = 0;
        $supportMsgs = 0;
        try {
            $open = (int) vaDb()->query("SELECT COUNT(*) FROM va_bug_reports WHERE status IN ('new', 'open')")->fetchColumn();
            $support = vaSupportUnread();
            $supportMsgs = vaSupportUserMessages();
        } catch (Throwable $e) {
        }
        $nav = '<a class="nav-link" href="stats.php">STATS</a>'
            . '<a class="nav-link" href="messages.php">MESSAGES</a>'
            . '<a class="nav-link" href="geoip.php">GEOIP</a>'
            . '<a class="nav-link" id="nav-support" href="inbox.php" data-unread="' . $support . '" data-msgs="' . $supportMsgs . '">SUPPORT'
            . ' <span class="nav-badge"' . ($support ? '' : ' hidden') . '>' . $support . '</span></a>'
            . '<a class="nav-link" href="bugs.php">BUGS' . ($open ? ' <span style="color:var(--red)">' . $open . '</span>' : '') . '</a>'
            . '<a class="nav-link" href="stats.php?logout=1">LOG OUT</a>';
    }
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<title>Visual Assembler - ' . vaH($title) . '</title><link rel="icon" href="../favicon.ico"><style>' . VA_ADMIN_CSS . '</style></head><body>'
        . '<div class="rb"></div><nav><a class="brand" href="../"><img src="../assets/logo2.png" alt="C64VA"><span>C64 VISUAL ASSEMBLER</span></a>'
        . '<div class="sp"></div>' . $nav . '</nav><div class="screen"><main>' . $body . '</main></div>' . VA_ADMIN_JS . '</body></html>';
}

// details[data-keep] nyitott / csukott állapota böngészőnként megmarad
const VA_ADMIN_JS = <<<'JS'
<script>
document.querySelectorAll('details[data-keep]').forEach(function (d) {
  var key = 'va-admin-open-' + d.dataset.keep;
  try { var v = localStorage.getItem(key); if (v !== null) d.open = v === '1'; } catch (e) {}
  // ha a cím rá mutat (pl. stats.php#manage keresés / művelet után), mindig nyitva
  if (d.id && location.hash === '#' + d.id) d.open = true;
  d.addEventListener('toggle', function () { try { localStorage.setItem(key, d.open ? '1' : '0'); } catch (e) {} });
});
// támogatás: élő olvasatlan-szám (nav, fül címe) és csipogás új felhasználói üzenetnél, minden admin oldalon;
// a böngésző csak egy kattintás után enged hangot. Új üzenetnél 'va-support-change' esemény (inbox.php lista újratöltése).
(function () {
  var link = document.getElementById('nav-support');
  if (!link) return;
  var badge = link.querySelector('.nav-badge');
  var baseTitle = document.title;
  var unread = +link.getAttribute('data-unread') || 0, msgs = +link.getAttribute('data-msgs') || 0;
  var ctx = null;
  var soundOn = function () { try { return localStorage.getItem('va-admin-sound') !== '0'; } catch (e) { return true; } };
  var unlock = function () {
    try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); } catch (e) {}
  };
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
  window.vaBeep = function () {
    if (!soundOn() || !ctx || ctx.state !== 'running') return;
    [[880, 0], [1320, 0.13]].forEach(function (n) {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + n[1];
      o.type = 'square';
      o.frequency.value = n[0];
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.12);
    });
  };
  var show = function () {
    badge.textContent = unread;
    badge.hidden = unread <= 0;
    document.title = (unread > 0 ? '(' + unread + ') ' : '') + baseTitle;
  };
  show();
  setInterval(function () {
    fetch('inbox.php?poll=1', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (r) {
      var newMsg = (+r.msgs || 0) > msgs;
      unread = +r.unread || 0;
      msgs = +r.msgs || 0;
      show();
      if (newMsg) {
        window.vaBeep();
        document.dispatchEvent(new CustomEvent('va-support-change'));
      }
    }).catch(function () {});
  }, 15000);
})();
// diagram-tooltip: [data-tip] elemek (vaColumnChart oszlopai) fölött
(function () {
  var tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.hidden = true;
  document.body.appendChild(tip);
  var cur = null;
  document.addEventListener('mousemove', function (e) {
    var t = e.target.closest ? e.target.closest('[data-tip]') : null;
    if (cur && cur !== t) cur.classList.remove('on');
    cur = t;
    if (!t) { tip.hidden = true; return; }
    t.classList.add('on');
    tip.textContent = t.getAttribute('data-tip');
    tip.hidden = false;
    var x = e.clientX + 14, y = e.clientY + 14, w = tip.offsetWidth, h = tip.offsetHeight;
    if (x + w > innerWidth - 8) x = e.clientX - w - 14;
    if (y + h > innerHeight - 8) y = e.clientY - h - 14;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  });
})();
</script>
JS;

/**
 * Oszlopdiagram (SVG, egy sorozat) napi adatokra; $points: [['label' => '2026-10-16', 'value' => 12, 'tip' => '…'], …]
 * időrendben. Az oszlop fölött a teljes magasságú, átlátszó sáv a rámutatási terület.
 */
function vaColumnChart(array $points, callable $fmt): string
{
    $w = 600;
    $h = 150;
    $top = 16;
    $bottom = 20;
    $plot = $h - $top - $bottom;
    $n = max(1, count($points));
    $slot = $w / $n;
    $bar = max(2, $slot - 2);
    $max = max(1, ...array_map(static fn($p) => (float) $p['value'], $points ?: [['value' => 1]]));
    $svg = '<svg class="chart" viewBox="0 0 ' . $w . ' ' . $h . '" preserveAspectRatio="none" role="img">';
    // vízszintes segédvonalak: 0, fél, max
    foreach ([0, 0.5, 1] as $f) {
        $y = round($top + $plot * (1 - $f), 1);
        $svg .= '<line class="grid" x1="0" x2="' . $w . '" y1="' . $y . '" y2="' . $y . '"/>';
    }
    foreach (array_values($points) as $i => $p) {
        $x = round($i * $slot + 1, 2);
        $bh = $p['value'] > 0 ? max(2, $plot * $p['value'] / $max) : 0;
        $y = $top + $plot - $bh;
        $svg .= '<g data-tip="' . vaH($p['tip']) . '"><rect class="hit" x="' . $x . '" y="0" width="' . round($bar, 2) . '" height="' . ($h - $bottom) . '"/>';
        if ($bh > 0) {
            // a felső sarkok kerekítettek, az alap egyenes
            $r = min(3, $bar / 2, $bh);
            $svg .= '<path class="bar" d="M' . $x . ',' . ($top + $plot) . 'V' . round($y + $r, 2) . 'Q' . $x . ',' . round($y, 2) . ' ' . round($x + $r, 2) . ',' . round($y, 2)
                . 'H' . round($x + $bar - $r, 2) . 'Q' . round($x + $bar, 2) . ',' . round($y, 2) . ' ' . round($x + $bar, 2) . ',' . round($y + $r, 2)
                . 'V' . ($top + $plot) . 'Z"/>';
        }
        $svg .= '</g>';
    }
    $svg .= '</svg>';
    $labels = array_values($points);
    $first = $labels[0]['label'] ?? '';
    $last = $labels[count($labels) - 1]['label'] ?? '';
    return '<div class="chart-wrap"><div class="chart-max">' . vaH($fmt($max)) . '</div>' . $svg
        . '<div class="chart-x"><span>' . vaH(substr($first, 5)) . '</span><span>' . vaH(substr($last, 5)) . '</span></div></div>';
}

const VA_ADMIN_CSS = <<<'CSS'
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
.nav-badge { color: var(--red) }
.nav-badge[hidden] { display: none }
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
input[type=email], input[type=text], input[type=password], input[type=search], input[type=datetime-local], select {
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
/* hibajegyek */
.status { display: inline-block; padding: 1px 8px; border: 1px solid; font-size: 10px; letter-spacing: 1px }
.st-new { color: var(--red); border-color: var(--red) } .st-open { color: var(--ylw); border-color: var(--ylw) }
.st-fixed { color: var(--grn); border-color: var(--grn) } .st-closed, .st-wontfix { color: var(--txt-dim); border-color: var(--txt-dim) }
.tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px }
.tabs a { border: 1px solid var(--brd); padding: 4px 10px; font-size: 10px; letter-spacing: 1px }
.tabs a.on, .tabs a:hover { border-color: var(--ylw); color: var(--ylw) }
.bug-text { text-transform: none; white-space: pre-wrap; word-break: break-word; color: var(--txt-hi); font-size: 12px; line-height: 1.6 }
pre.bug-text { font-family: 'C64Mono', monospace; background: var(--scr-darker); border: 1px solid var(--brd); padding: 10px 12px; max-height: 360px; overflow: auto }
.kv td:first-child { color: var(--txt-dim); width: 1%; white-space: nowrap }
.kv td { text-transform: none }
.shots { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px }
.shots a { display: block; border: 1px solid var(--brd); background: var(--scr-darker) }
.shots a:hover { border-color: var(--ylw) }
.shots img { display: block; width: 100%; height: 160px; object-fit: contain }
textarea.note { width: 100%; min-height: 90px; font-family: 'C64Mono', monospace; font-size: 12px; background: var(--scr-darker);
  color: var(--txt-hi); border: 1px solid var(--brd); padding: 8px 10px; text-transform: none; resize: vertical }
.clip { max-width: 420px; overflow: hidden; text-overflow: ellipsis }
/* becsukható doboz (details[data-keep]), állapot localStorage-ban */
details.box > summary.box-t { cursor: pointer; list-style: none; margin-bottom: 0 }
details.box > summary.box-t::-webkit-details-marker { display: none }
details.box > summary.box-t { display: flex; align-items: center; gap: 10px }
details.box > summary.box-t::before { content: ''; flex: none; width: 0; height: 0; border-style: solid; border-width: 5px 0 5px 8px;
  border-color: transparent transparent transparent var(--ylw); transition: transform .15s }
details.box[open] > summary.box-t { margin-bottom: 14px }
details.box[open] > summary.box-t::before { transform: rotate(90deg) }
details.box > summary.box-t:hover { color: var(--ylw) }
/* támogatási beszélgetés (inbox.php) */
.chat { display: flex; flex-direction: column; gap: 10px; max-height: 520px; overflow-y: auto; padding: 4px 2px }
.msg { max-width: 78%; border: 1px solid var(--brd); padding: 8px 12px; background: var(--scr-darker) }
.msg-user { align-self: flex-start }
.msg-admin { align-self: flex-end; border-color: rgba(184, 199, 111, .55); background: rgba(184, 199, 111, .08) }
.msg-new { border-color: var(--ylw) }
.msg-meta { font-size: 10px; letter-spacing: 1px; color: var(--txt-dim); margin-bottom: 4px }
.msg-text { white-space: pre-wrap; word-break: break-word; text-transform: none; color: var(--txt-hi); font-size: 12px; line-height: 1.6 }
tr.unread td { background: rgba(255, 119, 119, .06) }
.atts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px }
.att { display: inline-block; border: 1px solid var(--brd); padding: 4px 8px; font-size: 11px; text-transform: none; color: var(--ylw) }
.att:hover { border-color: var(--ylw) }
.att-img { padding: 2px }
.att-img img { display: block; max-width: 220px; max-height: 160px }
/* diagramok (vaColumnChart) */
.chart-wrap { position: relative }
.chart { display: block; width: 100%; height: 150px; overflow: visible }
.chart .grid { stroke: var(--brd); stroke-width: 1; vector-effect: non-scaling-stroke }
.chart .bar { fill: var(--ylw); opacity: .85 }
.chart .hit { fill: transparent }
.chart g.on .bar { opacity: 1 }
.chart g.on .hit { fill: rgba(184, 199, 111, .08) }
.chart-max { position: absolute; top: -4px; left: 0; font-size: 10px; color: var(--txt-dim); letter-spacing: 1px }
.chart-x { display: flex; justify-content: space-between; font-size: 10px; color: var(--txt-dim); letter-spacing: 1px; margin-top: -14px }
.chart-tip { position: fixed; z-index: 50; pointer-events: none; background: #0d0d22; color: var(--txt-hi); border: 1px solid var(--ylw);
  padding: 6px 10px; font-size: 11px; letter-spacing: 1px; white-space: nowrap }
.chart-tip[hidden] { display: none }
/* üzenetek, használat */
.msg-form label { display: flex; flex-direction: column; gap: 4px; font-size: 10px; letter-spacing: 1px; color: var(--txt-dim); margin-bottom: 10px }
.msg-form > label input, .msg-form > label textarea { width: 100% }
.msg-form .row label { margin-bottom: 0 }
.msg-form label.chk { flex-direction: row; align-items: center; gap: 6px; color: var(--txt) }
.msg-form .dt { display: flex; flex-wrap: wrap; gap: 4px; align-items: center }
.msg-edit { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; align-items: start }
@media (max-width: 900px) { .msg-edit { grid-template-columns: 1fr } }
.msg-preview { position: sticky; top: 16px }
#msg-preview { width: 100%; height: 460px; border: 1px solid var(--brd); background: #1d1d3a }
.msg-img-row { margin-bottom: 10px }
.msg-thumb { max-width: 160px; max-height: 90px; border: 1px solid var(--brd) }
input[type=file] { font-family: 'C64Mono', monospace; font-size: 11px; color: var(--txt-hi); text-transform: none; max-width: 100% }
input[type=file]::file-selector-button { font-family: 'C64Mono', monospace; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer;
  background: transparent; color: var(--ylw); border: 1px solid var(--ylw); padding: 6px 10px; margin-right: 10px }
input[type=file]::file-selector-button:hover { background: rgba(184, 199, 111, .12) }
.img-note { font-size: 10px; letter-spacing: 1px; color: var(--txt-dim); text-transform: none }
.img-note.err { color: var(--red) }
input[type=datetime-local] { color-scheme: dark; cursor: pointer; min-width: 210px }
input[type=datetime-local]::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(.8) sepia(1) hue-rotate(20deg) saturate(3) }
td.id { text-transform: none; font-variant-numeric: tabular-nums; color: var(--txt-hi) }
CSS;
