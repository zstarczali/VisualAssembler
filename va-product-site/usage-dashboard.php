<?php
declare(strict_types=1);

// Simple usage dashboard for the C64 Visual Assembler desktop app.
// Reads the SQLite database written by usage-ping.php.
//
// !!! CHANGE THIS BEFORE UPLOADING !!!
// Access is gated by a shared-secret query key: usage-dashboard.php?key=...
define('DASH_KEY', 'change-me-please');

$key = isset($_GET['key']) ? (string) $_GET['key'] : '';
if (!hash_equals(DASH_KEY, $key)) {
    http_response_code(403);
    echo 'Forbidden';
    exit;
}

function country_flag(string $code): string
{
    $code = strtoupper($code);
    if (strlen($code) !== 2 || $code === 'XX') {
        return '🏳️';
    }
    $out = '';
    foreach (str_split($code) as $ch) {
        $out .= mb_chr(127397 + ord($ch), 'UTF-8');
    }
    return $out;
}

$rows = [
    'total' => 0,
    'today' => 0,
    'last7' => 0,
    'last30' => 0,
    'newToday' => 0,
    'countries' => [],
    'os' => [],
    'versions' => [],
    'dbError' => null,
];

try {
    $db = new PDO('sqlite:' . __DIR__ . '/usage.sqlite3');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $today = gmdate('Y-m-d');
    $since7 = gmdate('Y-m-d', strtotime('-6 days'));
    $since30 = gmdate('Y-m-d', strtotime('-29 days'));

    $rows['total'] = (int) $db->query('SELECT COUNT(DISTINCT install_id) FROM pings')->fetchColumn();

    $stmt = $db->prepare('SELECT COUNT(DISTINCT install_id) FROM pings WHERE day = ?');
    $stmt->execute([$today]);
    $rows['today'] = (int) $stmt->fetchColumn();

    $stmt = $db->prepare('SELECT COUNT(DISTINCT install_id) FROM pings WHERE day >= ?');
    $stmt->execute([$since7]);
    $rows['last7'] = (int) $stmt->fetchColumn();

    $stmt = $db->prepare('SELECT COUNT(DISTINCT install_id) FROM pings WHERE day >= ?');
    $stmt->execute([$since30]);
    $rows['last30'] = (int) $stmt->fetchColumn();

    $stmt = $db->prepare(
        'SELECT COUNT(*) FROM (
            SELECT install_id, MIN(day) AS first_day FROM pings GROUP BY install_id
        ) t WHERE first_day = ?'
    );
    $stmt->execute([$today]);
    $rows['newToday'] = (int) $stmt->fetchColumn();

    $stmt = $db->prepare(
        "SELECT country, COUNT(DISTINCT install_id) AS n
         FROM pings WHERE day >= ?
         GROUP BY country ORDER BY n DESC LIMIT 20"
    );
    $stmt->execute([$since30]);
    $rows['countries'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $db->prepare(
        "SELECT os, COUNT(DISTINCT install_id) AS n
         FROM pings WHERE day >= ?
         GROUP BY os ORDER BY n DESC"
    );
    $stmt->execute([$since30]);
    $rows['os'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $db->prepare(
        "SELECT version, COUNT(DISTINCT install_id) AS n
         FROM pings WHERE day >= ?
         GROUP BY version ORDER BY n DESC"
    );
    $stmt->execute([$since30]);
    $rows['versions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) {
    $rows['dbError'] = 'No usage data yet (database not created, or no pings received).';
}

$maxCountry = 1;
foreach ($rows['countries'] as $c) {
    $maxCountry = max($maxCountry, (int) $c['n']);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>C64 Visual Assembler — Usage Dashboard</title>
<meta name="robots" content="noindex, nofollow">
<style>
  :root { color-scheme: dark; }
  body { margin: 0; padding: 32px; background: #0b0b14; color: #e7e7f0; font: 14px/1.5 -apple-system, Segoe UI, sans-serif; }
  h1 { font-size: 1.3rem; margin: 0 0 4px; }
  .sub { color: #8a8aa0; margin-bottom: 28px; }
  .cards { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
  .card { background: #15151f; border: 1px solid #26263a; border-radius: 8px; padding: 16px 20px; min-width: 140px; }
  .card .n { font-size: 1.8rem; font-weight: 700; }
  .card .l { color: #8a8aa0; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #22222e; font-size: 0.85rem; }
  th { color: #8a8aa0; font-weight: 600; text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em; }
  .bar { display: inline-block; height: 8px; background: #6f6fe0; border-radius: 4px; vertical-align: middle; margin-right: 8px; }
  .section { background: #15151f; border: 1px solid #26263a; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; }
  .section h2 { font-size: 0.9rem; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #a0a0c0; }
  .err { color: #e08a8a; }
</style>
</head>
<body>
  <h1>C64 Visual Assembler — Usage Dashboard</h1>
  <div class="sub">Anonymous install pings, last refreshed <?= htmlspecialchars(gmdate('Y-m-d H:i')) ?> UTC</div>

  <?php if ($rows['dbError']): ?>
    <p class="err"><?= htmlspecialchars($rows['dbError']) ?></p>
  <?php else: ?>

  <div class="cards">
    <div class="card"><div class="n"><?= $rows['total'] ?></div><div class="l">Total installs</div></div>
    <div class="card"><div class="n"><?= $rows['today'] ?></div><div class="l">Active today</div></div>
    <div class="card"><div class="n"><?= $rows['last7'] ?></div><div class="l">Active 7 days</div></div>
    <div class="card"><div class="n"><?= $rows['last30'] ?></div><div class="l">Active 30 days</div></div>
    <div class="card"><div class="n"><?= $rows['newToday'] ?></div><div class="l">New today</div></div>
  </div>

  <div class="grid">
    <div class="section">
      <h2>Top countries (30 days)</h2>
      <table>
        <thead><tr><th>Country</th><th>Users</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($rows['countries'] as $c): ?>
          <tr>
            <td><?= country_flag((string) $c['country']) ?> <?= htmlspecialchars((string) $c['country']) ?></td>
            <td><?= (int) $c['n'] ?></td>
            <td style="width:50%"><span class="bar" style="width:<?= max(4, (int) round(((int) $c['n'] / $maxCountry) * 100)) ?>%"></span></td>
          </tr>
        <?php endforeach; ?>
        <?php if (!$rows['countries']): ?><tr><td colspan="3">No data yet.</td></tr><?php endif; ?>
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>OS (30 days)</h2>
      <table>
        <thead><tr><th>OS</th><th>Users</th></tr></thead>
        <tbody>
        <?php foreach ($rows['os'] as $o): ?>
          <tr><td><?= htmlspecialchars((string) $o['os']) ?></td><td><?= (int) $o['n'] ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$rows['os']): ?><tr><td colspan="2">No data yet.</td></tr><?php endif; ?>
        </tbody>
      </table>

      <h2 style="margin-top:20px">Versions (30 days)</h2>
      <table>
        <thead><tr><th>Version</th><th>Users</th></tr></thead>
        <tbody>
        <?php foreach ($rows['versions'] as $v): ?>
          <tr><td><?= htmlspecialchars((string) $v['version']) ?></td><td><?= (int) $v['n'] ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$rows['versions']): ?><tr><td colspan="2">No data yet.</td></tr><?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>

  <?php endif; ?>
</body>
</html>
