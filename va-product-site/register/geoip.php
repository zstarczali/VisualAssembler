<?php
declare(strict_types=1);

// GeoIP-adatbázis (db-ip.com IP to Country Lite, CC BY 4.0) betöltése a va_geoip táblába, lépésenként (JSON POST),
// hogy egy kérés se fusson bele a tárhely időkorlátjába: download → unpack → import (darabonként) → finish.
// Ha a tárhely nem tudja letölteni (kimenő kapcsolat tiltva, Cloudflare), a böngésző tölti fel a fájlt 1 MB-os
// darabokban (upload_start → upload_chunk …), majd ugyanúgy unpack → import → finish; a .csv is mehet tömörítés nélkül.
// Az import a va_geoip_new táblába megy, a végén RENAME cseréli, így a ping közben is a régi tábla él.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$dir = __DIR__ . '/geoip-data';
$gz = $dir . '/dbip-country-lite.csv.gz';
$csv = $dir . '/dbip-country-lite.csv';

/** A db-ip havonta új fájlt ad ki; a hónap eleji napokban még az előző hónapé az utolsó. */
$sources = static function (): array {
    $now = new DateTimeImmutable('first day of this month');
    return array_map(static fn(DateTimeImmutable $d) => 'https://download.db-ip.com/free/dbip-country-lite-' . $d->format('Y-m') . '.csv.gz',
        [$now, $now->modify('-1 month')]);
};

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $in = json_decode((string) file_get_contents('php://input'), true);
    $in = is_array($in) ? $in : [];
    if (!hash_equals((string) ($_SESSION['csrf'] ?? ''), (string) ($in['csrf'] ?? ''))) {
        echo json_encode(['ok' => false, 'error' => 'FORM EXPIRED, RELOAD THE PAGE.']);
        exit;
    }
    session_write_close();
    @set_time_limit(120);
    $db = vaDb();
    $out = static function (array $r): void {
        echo json_encode(['ok' => true] + $r);
        exit;
    };
    try {
        $step = (string) ($in['step'] ?? '');
        $prepareDir = static function () use ($dir): void {
            if (!is_dir($dir) && !mkdir($dir, 0750, true)) {
                throw new RuntimeException('CANNOT CREATE ' . $dir);
            }
            // a letöltött fájlok ne legyenek elérhetők a webről
            file_put_contents($dir . '/.htaccess', "Require all denied\n");
        };
        if ($step === 'upload_start') {
            $prepareDir();
            @unlink($gz);
            @unlink($csv);
            $name = basename((string) ($in['name'] ?? ''));
            vaSetting($db, 'geoip_pending_source', $name !== '' ? $name : 'uploaded file');
            $out(['note' => 'UPLOADING ' . ($name !== '' ? $name : 'FILE') . '...']);
        }
        if ($step === 'upload_chunk') {
            $data = base64_decode((string) ($in['data'] ?? ''), true);
            $target = !empty($in['csv']) ? $csv : $gz;
            if ($data === false || (int) ($in['offset'] ?? -1) !== (is_file($target) ? (int) filesize($target) : 0)) {
                throw new RuntimeException('UPLOAD OUT OF SYNC, START AGAIN.');
            }
            if (file_put_contents($target, $data, FILE_APPEND) === false) {
                throw new RuntimeException('CANNOT WRITE ' . $target);
            }
            clearstatcache();
            $out(['size' => (int) filesize($target)]);
        }
        if ($step === 'download') {
            $prepareDir();
            $got = '';
            $errors = [];
            foreach ($sources() as $url) {
                $fh = fopen($gz, 'wb');
                if (function_exists('curl_init')) {
                    $ch = curl_init($url);
                    // böngészős UA: a db-ip Cloudflare mögött van; 45 mp, hogy a tárhely proxyja előbb ne vágja el
                    curl_setopt_array($ch, [CURLOPT_FILE => $fh, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 45,
                        CURLOPT_CONNECTTIMEOUT => 10, CURLOPT_FAILONERROR => true,
                        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36']);
                    $okDl = curl_exec($ch);
                    $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
                    $err = curl_error($ch);
                    curl_close($ch);
                } else {
                    $ctx = stream_context_create(['http' => ['timeout' => 45, 'header' => "User-Agent: Mozilla/5.0\r\n"]]);
                    $src = @fopen($url, 'rb', false, $ctx);
                    $okDl = $src !== false && stream_copy_to_stream($src, $fh) > 0;
                    $code = $okDl ? 200 : 0;
                    $err = $src === false ? 'NO CURL AND allow_url_fopen FAILED' : '';
                    if ($src) {
                        fclose($src);
                    }
                }
                fclose($fh);
                clearstatcache();
                $size = is_file($gz) ? (int) filesize($gz) : 0;
                $magic = $size > 2 ? (string) file_get_contents($gz, false, null, 0, 2) : '';
                if ($okDl && $code === 200 && $size > 100000 && $magic === "\x1f\x8b") {
                    $got = $url;
                    break;
                }
                $errors[] = basename($url) . ': HTTP ' . $code . ($err !== '' ? ', ' . $err : '') . ', ' . $size . ' BYTES';
            }
            if ($got === '') {
                @unlink($gz);
                throw new RuntimeException('THE SERVER COULD NOT DOWNLOAD FROM DB-IP.COM (' . implode('; ', $errors) . '). '
                    . 'USE "UPLOAD FILE": DOWNLOAD THE CSV.GZ IN YOUR BROWSER AND UPLOAD IT HERE.');
            }
            vaSetting($db, 'geoip_pending_source', basename($got));
            $out(['next' => 'unpack', 'note' => 'DOWNLOADED ' . basename($got) . ' (' . round(filesize($gz) / 1048576, 1) . ' MB)']);
        }
        if ($step === 'unpack') {
            // tömörítetlen .csv feltöltésénél nincs mit kicsomagolni
            if (!is_file($gz) && is_file($csv)) {
                $db->exec('DROP TABLE IF EXISTS va_geoip_new');
                $db->exec('CREATE TABLE va_geoip_new LIKE va_geoip');
                $out(['next' => 'import', 'offset' => 0, 'size' => filesize($csv), 'note' => 'CSV ' . round(filesize($csv) / 1048576, 1) . ' MB']);
            }
            if (!is_file($gz)) {
                throw new RuntimeException('NO DOWNLOADED FILE. START AGAIN.');
            }
            $src = gzopen($gz, 'rb');
            $dst = fopen($csv, 'wb');
            if (!$src || !$dst) {
                throw new RuntimeException('CANNOT UNPACK THE FILE.');
            }
            while (!gzeof($src)) {
                fwrite($dst, (string) gzread($src, 1 << 20));
            }
            gzclose($src);
            fclose($dst);
            @unlink($gz);
            $db->exec('DROP TABLE IF EXISTS va_geoip_new');
            $db->exec('CREATE TABLE va_geoip_new LIKE va_geoip');
            $out(['next' => 'import', 'offset' => 0, 'size' => filesize($csv), 'note' => 'UNPACKED ' . round(filesize($csv) / 1048576, 1) . ' MB']);
        }
        if ($step === 'import') {
            $offset = max(0, (int) ($in['offset'] ?? 0));
            $fh = fopen($csv, 'rb');
            if (!$fh) {
                throw new RuntimeException('NO UNPACKED FILE. START AGAIN.');
            }
            fseek($fh, $offset);
            $start = microtime(true);
            $rows = [];
            $flush = static function () use ($db, &$rows): void {
                if (!$rows) {
                    return;
                }
                $db->prepare('INSERT IGNORE INTO va_geoip_new (ip_from, ip_to, country) VALUES '
                    . implode(',', array_fill(0, count($rows), '(UNHEX(?), UNHEX(?), ?)')))->execute(array_merge(...$rows));
                $rows = [];
            };
            $n = 0;
            while (microtime(true) - $start < 12 && ($line = fgets($fh)) !== false) {
                $f = str_getcsv(trim($line), ',', '"', '');
                if (count($f) < 3 || !preg_match('/^[A-Z]{2}$/', $f[2]) || $f[2] === 'ZZ') {
                    continue;
                }
                $a = vaIpBin($f[0]);
                $b = vaIpBin($f[1]);
                if ($a === null || $b === null) {
                    continue;
                }
                $rows[] = [bin2hex($a), bin2hex($b), $f[2]];
                $n++;
                if (count($rows) >= 500) {
                    $flush();
                }
            }
            $flush();
            $pos = (int) ftell($fh);
            $done = feof($fh);
            fclose($fh);
            $size = (int) filesize($csv);
            $out(['next' => $done ? 'finish' : 'import', 'offset' => $pos, 'size' => $size, 'rows' => $n]);
        }
        if ($step === 'finish') {
            $count = (int) $db->query('SELECT COUNT(*) FROM va_geoip_new')->fetchColumn();
            if ($count < 100000) {
                throw new RuntimeException("ONLY $count RANGES WERE IMPORTED; THE OLD TABLE IS KEPT.");
            }
            $db->exec('DROP TABLE IF EXISTS va_geoip_old');
            $db->exec('RENAME TABLE va_geoip TO va_geoip_old, va_geoip_new TO va_geoip');
            $db->exec('DROP TABLE va_geoip_old');
            @unlink($csv);
            vaSetting($db, 'geoip_source', vaSetting($db, 'geoip_pending_source') ?: 'uploaded file');
            vaSetting($db, 'geoip_updated', date('Y-m-d H:i'));
            vaSetting($db, 'geoip_rows', (string) $count);
            $out(['next' => '', 'note' => "DONE: $count IP RANGES."]);
        }
        throw new RuntimeException('UNKNOWN STEP.');
    } catch (Throwable $e) {
        error_log('VA geoip: ' . $e->getMessage());
        echo json_encode(['ok' => false, 'error' => $e instanceof RuntimeException ? $e->getMessage() : 'SERVER ERROR: ' . $e->getMessage()]);
    }
    exit;
}

$db = vaDb();
vaInstallsMigrate($db);
$rows = (int) ($db->query('SELECT COUNT(*) FROM va_geoip')->fetchColumn() ?: 0);
$withCountry = (int) $db->query("SELECT COUNT(*) FROM va_installs WHERE country <> '' AND last_at > NOW() - INTERVAL 30 DAY")->fetchColumn();
$active30 = (int) $db->query('SELECT COUNT(*) FROM va_installs WHERE last_at > NOW() - INTERVAL 30 DAY')->fetchColumn();
$updated = vaSetting($db, 'geoip_updated');
$uploaded = is_file($gz);

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">GEOIP <span>COUNTRIES</span></h1>

    <div class="tiles">
        <div class="tile"><b><?= number_format($rows, 0, '.', ' ') ?></b><span>IP RANGES IN THE DATABASE</span></div>
        <div class="tile"><b><?= $h($updated ?: 'NEVER') ?></b><span>LAST UPDATE<?= $updated ? ' / ' . $h(vaSetting($db, 'geoip_source')) : '' ?></span></div>
        <div class="tile"><b><?= $withCountry ?> / <?= $active30 ?></b><span>ACTIVE INSTALLS (30 DAYS) WITH A COUNTRY</span></div>
    </div>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">UPDATE</div>
        <div class="row">
            <button class="btn pri" type="button" id="geo-run" data-from="download">UPDATE FROM DB-IP.COM</button>
            <button class="btn" type="button" id="geo-upload">UPLOAD FILE...</button>
            <input type="file" id="geo-file" accept=".gz,.csv" hidden>
            <?php if ($uploaded): ?><button class="btn" type="button" id="geo-run-upload" data-from="unpack">IMPORT FILE ON THE SERVER</button><?php endif; ?>
        </div>
        <pre class="bug-text" id="geo-log" style="margin-top:14px;min-height:60px"><?= $rows ? '' : 'NO GEOIP DATA YET: COUNTRIES STAY EMPTY UNTIL THE FIRST UPDATE.' ?></pre>
        <p class="hint">THE PING LOOKS UP THE COUNTRY OF THE IP ADDRESS IN THIS LOCAL TABLE AND STORES ONLY THE TWO-LETTER CODE; THE IP IS NOT STORED
            AND NOT SENT ANYWHERE. DB-IP PUBLISHES A NEW FILE EVERY MONTH, SO UPDATE ABOUT MONTHLY. THE IMPORT TAKES A FEW MINUTES; KEEP THIS PAGE OPEN.<br>
            COUNTRIES APPEAR FOR AN INSTALL AT ITS NEXT DAILY PING.<br>
            IF THE SERVER CANNOT DOWNLOAD: GET <a href="https://db-ip.com/db/download/ip-to-country-lite" target="_blank" rel="noopener">IP TO COUNTRY LITE (CSV)</a>
            IN YOUR BROWSER, THEN UPLOAD IT WITH "UPLOAD FILE" (.CSV.GZ OR .CSV).<br>
            <a href="https://db-ip.com" target="_blank" rel="noopener">IP GEOLOCATION BY DB-IP</a> (CC BY 4.0)</p>
    </div>
    <script>
    (function () {
      var log = document.getElementById('geo-log'), csrf = <?= json_encode($csrf) ?>;
      var say = function (t) { log.textContent += (log.textContent ? '\n' : '') + t; };
      var buttons = function (on) { document.querySelectorAll('#geo-run, #geo-run-upload, #geo-upload').forEach(function (b) { b.disabled = !on; }); };
      // a válasz nem mindig JSON (PHP-hiba, a tárhely proxyjának időtúllépése): akkor a HTTP-kód és a szöveg eleje látszik
      function step(name, extra) {
        return fetch('geoip.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
          body: JSON.stringify(Object.assign({ csrf: csrf, step: name }, extra || {})) }).then(function (r) {
            return r.text().then(function (t) {
              try { return JSON.parse(t); } catch (e) {
                return { ok: false, error: 'HTTP ' + r.status + ' ' + t.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) };
              }
            });
          });
      }
      var fail = function (msg) { say('ERROR: ' + msg); buttons(true); };
      function run(from) {
        buttons(false);
        if (from !== 'unpack-after-upload') log.textContent = '';
        say(from === 'download' ? 'DOWNLOADING (UP TO A MINUTE)...' : 'UNPACKING...');
        if (from === 'unpack-after-upload') from = 'unpack';
        var go = function (name, extra) {
          step(name, extra).then(function (r) {
            if (!r.ok) { fail(r.error); return; }
            if (r.note) say(r.note);
            if (r.next === 'import') {
              var pct = r.size ? Math.floor(r.offset * 100 / r.size) : 0;
              if (name === 'import') log.textContent = log.textContent.replace(/\nIMPORTING .*$/, '') + '\nIMPORTING ' + pct + '%';
              else say('IMPORTING 0%');
              go('import', { offset: r.offset });
            } else if (r.next) {
              go(r.next);
            } else {
              say('RELOADING...');
              buttons(true);
              setTimeout(function () { location.reload(); }, 1500);
            }
          }).catch(function (e) { fail(String(e)); });
        };
        go(from);
      }
      document.querySelectorAll('#geo-run, #geo-run-upload').forEach(function (b) {
        b.addEventListener('click', function () { run(b.getAttribute('data-from')); });
      });
      // feltöltés a böngészőből 1 MB-os darabokban (a tárhely feltöltési korlátja nem számít)
      var fileInput = document.getElementById('geo-file');
      document.getElementById('geo-upload').addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];
        fileInput.value = '';
        if (!file) return;
        var isCsv = /\.csv$/i.test(file.name);
        if (!isCsv && !/\.gz$/i.test(file.name)) { log.textContent = ''; fail('CHOOSE THE .CSV.GZ (OR .CSV) FILE FROM DB-IP.'); return; }
        buttons(false);
        log.textContent = '';
        var CHUNK = 1024 * 1024, offset = 0;
        var readChunk = function (blob) {
          return new Promise(function (res, rej) {
            var rd = new FileReader();
            rd.onload = function () { res(String(rd.result).split(',')[1] || ''); };
            rd.onerror = function () { rej(rd.error); };
            rd.readAsDataURL(blob);
          });
        };
        var next = function () {
          if (offset >= file.size) { say('UPLOADED.'); run('unpack-after-upload'); return; }
          readChunk(file.slice(offset, offset + CHUNK)).then(function (data) {
            return step('upload_chunk', { offset: offset, data: data, csv: isCsv });
          }).then(function (r) {
            if (!r.ok) { fail(r.error); return; }
            offset = r.size;
            log.textContent = log.textContent.replace(/\nUPLOADING \d+%$/, '') + '\nUPLOADING ' + Math.floor(offset * 100 / file.size) + '%';
            next();
          }).catch(function (e) { fail(String(e)); });
        };
        step('upload_start', { name: file.name }).then(function (r) {
          if (!r.ok) { fail(r.error); return; }
          say(r.note);
          next();
        }).catch(function (e) { fail(String(e)); });
      });
    })();
    </script>
<?php vaAdminPage('GEOIP', (string) ob_get_clean());
