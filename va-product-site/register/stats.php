<?php
declare(strict_types=1);

// Admin statisztika: letöltések, kiküldött serialok, vásárlások, aktiválások.
// Jelszó: config 'admin_password' vagy VA_ADMIN_PASSWORD környezeti változó.
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
        $error = 'Túl sok próbálkozás, próbáld később.';
    } elseif ($password !== '' && hash_equals($password, (string) ($_POST['password'] ?? ''))) {
        session_regenerate_id(true);
        $_SESSION['va_admin'] = true;
        header('Location: stats.php');
        exit;
    } else {
        $db->prepare('INSERT INTO va_register_attempts (ip, created_at) VALUES (?, NOW())')->execute([$ip]);
        $error = $password === '' ? 'Nincs beállítva admin jelszó.' : 'Hibás jelszó.';
    }
}

if (empty($_SESSION['va_admin'])): ?>
<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>VA statisztika</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1b1b3a; color: #e8e8ff; font: 16px system-ui, sans-serif; padding: 16px; }
  form { background: #2a2a5a; padding: 24px; border-radius: 6px; width: 100%; max-width: 320px; }
  h1 { margin: 0 0 16px; font-size: 1rem; letter-spacing: .08em; text-transform: uppercase; color: #ffd84a; }
  input, button { width: 100%; box-sizing: border-box; padding: 10px; font: inherit; border-radius: 4px; }
  input { border: 1px solid #55558a; background: #15152e; color: #e8e8ff; }
  button { margin-top: 12px; border: 0; background: #ffd84a; color: #1b1b3a; font-weight: 700; cursor: pointer; }
  .err { color: #ff6b6b; font-size: .9rem; }
</style></head><body>
<form method="post">
  <h1>VA statisztika</h1>
  <?php if ($error !== ''): ?><p class="err"><?= $h($error) ?></p><?php endif; ?>
  <input type="password" name="password" placeholder="Jelszó" autofocus required autocomplete="current-password">
  <button type="submit">Belépés</button>
</form>
</body></html>
<?php exit; endif;

$db = vaDb();
$one = static function (string $sql) use ($db) {
    return $db->query($sql)->fetchColumn() ?: 0;
};
$all = static function (string $sql) use ($db): array {
    return $db->query($sql)->fetchAll();
};

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

$recent = $all('SELECT s.email, s.mailed_at, (p.order_id IS NOT NULL) AS bought, a.last_at AS activated, a.version
    FROM va_serial_requests s
    LEFT JOIN va_activations a ON a.email = s.email
    LEFT JOIN va_purchases p ON p.email = s.email AND p.state = \'fulfilled\'
    WHERE s.mailed_at IS NOT NULL ORDER BY s.mailed_at DESC LIMIT 50');

$pct = static fn(int $a, int $b): string => $b > 0 ? round($a * 100 / $b) . '%' : '–';
?>
<!doctype html>
<html lang="hu"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>VA statisztika</title>
<style>
  :root { --bg: #1b1b3a; --card: #2a2a5a; --text: #e8e8ff; --muted: #a8a8d8; --ylw: #ffd84a; --line: #3d3d70; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.45 system-ui, sans-serif; padding: 24px 16px; }
  main { max-width: 1100px; margin: 0 auto; }
  header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  h1 { margin: 0; font-size: 1.1rem; letter-spacing: .08em; text-transform: uppercase; color: var(--ylw); }
  h2 { font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 10px; }
  a { color: var(--ylw); }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .tile { background: var(--card); border-radius: 6px; padding: 14px 16px; }
  .tile b { display: block; font-size: 1.8rem; font-variant-numeric: tabular-nums; }
  .tile span { color: var(--muted); font-size: .8rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; margin-bottom: 20px; }
  section { background: var(--card); border-radius: 6px; padding: 14px 16px; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: .85rem; }
  td, th { text-align: left; padding: 5px 6px; border-bottom: 1px solid var(--line); white-space: nowrap; }
  th { color: var(--muted); font-weight: 600; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  .yes { color: #3fbf6a; } .no { color: var(--muted); } .warn { color: #ff6b6b; }
</style></head><body><main>
<header><h1>VA statisztika</h1><a href="?logout=1">Kilépés</a></header>

<div class="tiles">
  <div class="tile"><b><?= $dlTotal ?></b><span>letöltés összesen (30 nap: <?= $dl30 ?>)</span></div>
  <div class="tile"><b><?= $serials ?></b><span>kiküldött serial (30 nap: <?= $serials30 ?>)</span></div>
  <div class="tile"><b><?= $act ?></b><span>aktivált gép / e-mail (<?= $pct($act, $serials) ?> a serialokból)</span></div>
  <div class="tile"><b><?= $bought ?></b><span>PayPal vásárlás</span></div>
  <div class="tile"><b><?= $donors ?></b><span>donor a listán</span></div>
  <div class="tile"><b><?= $notActivated ?></b><span>serial, még nem aktivált</span></div>
</div>

<div class="grid">
  <section><h2>Letöltések platformonként</h2><table>
    <?php foreach ($dlByKey as $r): ?><tr><td><?= $h($r['file_key']) ?></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
  </table></section>
  <section><h2>Letöltések naponta (30 nap)</h2><table>
    <?php foreach ($dlDays as $r): ?><tr><td><?= $h($r['day']) ?></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
  </table></section>
  <section><h2>Aktiválások</h2><table>
    <tr><th>OS</th><th class="n">db</th></tr>
    <?php foreach ($actOs as $r): ?><tr><td><?= $h($r['os'] ?: '?') ?></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
    <tr><th>Verzió</th><th class="n">db</th></tr>
    <?php foreach ($actVer as $r): ?><tr><td><?= $h($r['version'] ?: '?') ?></td><td class="n"><?= (int) $r['n'] ?></td></tr><?php endforeach; ?>
    <tr><td>Aktiválás összesen (újra-aktiválással)</td><td class="n"><?= $actTotal ?></td></tr>
  </table></section>
  <section><h2>Bevétel</h2><table>
    <?php foreach ($revenue as $r): ?><tr><td><?= $h($r['currency']) ?></td><td class="n"><?= $h(number_format((float) $r['total'], 2, ',', ' ')) ?></td><td class="n"><?= (int) $r['n'] ?> db</td></tr><?php endforeach; ?>
    <?php if (!$revenue): ?><tr><td class="no">Még nincs vásárlás.</td></tr><?php endif; ?>
  </table>
  <?php if ($problem): ?><h2 style="margin-top:14px" class="warn">Kifizetett, de a levél nem ment ki</h2><table>
    <?php foreach ($problem as $r): ?><tr><td><?= $h($r['email']) ?></td><td><?= $h($r['order_id']) ?></td><td><?= $h($r['created_at']) ?></td></tr><?php endforeach; ?>
  </table><?php endif; ?></section>
</div>

<section><h2>Utolsó 50 kiküldött serial</h2><table>
  <tr><th>E-mail</th><th>Kiküldve</th><th>Forrás</th><th>Aktiválva</th><th>Verzió</th></tr>
  <?php foreach ($recent as $r): ?><tr>
    <td><?= $h($r['email']) ?></td><td><?= $h($r['mailed_at']) ?></td>
    <td><?= $r['bought'] ? 'vásárlás' : 'donor' ?></td>
    <td class="<?= $r['activated'] ? 'yes' : 'no' ?>"><?= $r['activated'] ? $h($r['activated']) : 'még nem' ?></td>
    <td><?= $h($r['version'] ?? '') ?></td>
  </tr><?php endforeach; ?>
</table></section>
</main></body></html>
