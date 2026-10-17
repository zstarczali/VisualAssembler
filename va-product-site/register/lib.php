<?php
declare(strict_types=1);

// Pro sorozatszám a támogatóknak: csak a va_donors táblában lévő e-mail címre, címenként egyszer.
// A donorlistát a node scripts/keygen.js donors-sql <donations.csv> <out.sql> állítja elő.
// A sorozatszám ugyanaz, mint a scripts/keygen.js-é: "VA1-" + base64url(Ed25519("c64va-license-v1:<email>")).

if (!defined('VA_REGISTER')) {
    http_response_code(403);
    exit;
}

// az admin felület időpontjai (üzenetek kezdete / vége) magyar idő szerint
date_default_timezone_set('Europe/Budapest');

function vaConfig(): array
{
    static $cfg = null;
    if ($cfg === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            throw new RuntimeException('config.php hiányzik (másold a config.sample.php-t).');
        }
        $cfg = require $file;
        // titkok környezeti változóból (.htaccess SetEnv); üres változó → config.php értéke
        foreach ([['VA_SMTP_PASS', 'smtp', 'pass'], ['VA_DB_PASS', 'db', 'pass']] as [$name, $group, $key]) {
            $v = vaEnv($name);
            if ($v !== '') {
                $cfg[$group][$key] = $v;
            }
        }
        $seed = vaEnv('VA_SIGN_SEED');
        if ($seed !== '') {
            $cfg['sign_seed'] = $seed;
        }
    }
    return $cfg;
}

function vaEnv(string $name): string
{
    // CGI / FastCGI alatt a SetEnv REDIRECT_ előtaggal is érkezhet
    foreach ([getenv($name), $_SERVER[$name] ?? null, $_SERVER['REDIRECT_' . $name] ?? null] as $v) {
        if (is_string($v) && trim($v) !== '') {
            return trim($v);
        }
    }
    return '';
}

function vaNormalizeEmail(string $email): string
{
    return strtolower(trim($email));
}

function vaValidEmail(string $email): bool
{
    return strlen($email) <= 254 && filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function vaMakeSerial(string $email): string
{
    $seed = base64_decode((string) vaConfig()['sign_seed'], true);
    if ($seed === false || strlen($seed) !== SODIUM_CRYPTO_SIGN_SEEDBYTES) {
        throw new RuntimeException('Hibás sign_seed (node scripts/keygen.js phpkey).');
    }
    $secret = sodium_crypto_sign_secretkey(sodium_crypto_sign_seed_keypair($seed));
    $sig = sodium_crypto_sign_detached('c64va-license-v1:' . vaNormalizeEmail($email), $secret);
    sodium_memzero($secret);
    return 'VA1-' . rtrim(strtr(base64_encode($sig), '+/', '-_'), '=');
}

function vaDb(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = vaConfig()['db'];
        $pdo = new PDO(
            sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $c['host'], (int) $c['port'], $c['name']),
            $c['user'],
            $c['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
        $pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
    }
    return $pdo;
}

/** A va_messages / va_installs bővítése a régi táblán; a CREATE TABLE IF NOT EXISTS nem ad hozzá oszlopot. */
function vaMessagesMigrate(PDO $db): void
{
    vaAddColumns($db, 'va_messages', [
        'rev' => 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER active',
        'audience' => "VARCHAR(12) NOT NULL DEFAULT '' AFTER rev",
        'caption_en' => "VARCHAR(200) NOT NULL DEFAULT '' AFTER level",
        'caption_hu' => "VARCHAR(200) NOT NULL DEFAULT '' AFTER caption_en",
        'image' => 'MEDIUMBLOB NULL AFTER url',
        'image_mime' => "VARCHAR(40) NOT NULL DEFAULT '' AFTER image",
    ]);
}

function vaInstallsMigrate(PDO $db): void
{
    vaAddColumns($db, 'va_installs', [
        'minutes' => 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER days',
        'supporter' => 'TINYINT(1) NOT NULL DEFAULT 0 AFTER minutes',
        'country' => "CHAR(2) NOT NULL DEFAULT '' AFTER supporter",
    ]);
    vaAddColumns($db, 'va_install_days', ['minutes' => 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER launches']);
}

/** @param array<string, string> $add oszlop => definíció; csak a hiányzókat adja hozzá */
function vaAddColumns(PDO $db, string $table, array $add): void
{
    $cols = array_column($db->query("SHOW COLUMNS FROM $table")->fetchAll(), 'Field');
    foreach ($add as $col => $def) {
        if (!in_array($col, $cols, true)) {
            $db->exec("ALTER TABLE $table ADD COLUMN $col $def");
        }
    }
}

/**
 * Az in-app üzenet HTML-je: csak az app által is engedett tagek (_serverMessageSanitize az app.js-ben), attribútum nélkül;
 * az A csak http(s) / mailto href-et tarthat. Minden más tag eltűnik (a szövege marad), a script / style / iframe tartalmával együtt.
 */
function vaCleanMessageHtml(string $html, bool &$removed = false): string
{
    $removed = false;
    if (!preg_match('/<[a-z!\/?]/i', $html)) {
        return $html;
    }
    $allowed = array_flip(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'SMALL', 'CODE', 'PRE', 'BLOCKQUOTE',
        'H3', 'H4', 'UL', 'OL', 'LI', 'HR', 'SPAN', 'A']);
    if (!class_exists('DOMDocument')) {
        // DOM kiterjesztés nélkül: csak a tagek maradnak, attribútum (így link) nélkül
        $in = $html;
        $html = preg_replace('#<(script|style|iframe|object|embed|template|svg|math|noscript|textarea|select|title)\b.*?</\1\s*>#is', '', $html);
        $html = strip_tags((string) $html, '<' . implode('><', array_map('strtolower', array_keys($allowed))) . '>');
        $html = (string) preg_replace('#<([a-z0-9]+)\b[^>]*?(/?)>#i', '<$1$2>', $html);
        $removed = $html !== $in;
        return $html;
    }
    $drop = array_flip(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'SVG', 'MATH', 'NOSCRIPT', 'TEXTAREA', 'SELECT', 'TITLE']);
    $doc = new DOMDocument();
    $prev = libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="utf-8"?><div>' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NONET);
    libxml_clear_errors();
    libxml_use_internal_errors($prev);
    // a saveHTML így UTF-8-ban adja az ékezetes betűket, nem entitásként
    $doc->encoding = 'UTF-8';
    $root = $doc->getElementsByTagName('div')->item(0);
    if (!$root) {
        return '';
    }
    $walk = static function (DOMNode $node) use (&$walk, &$removed, $allowed, $drop): void {
        foreach (iterator_to_array($node->childNodes) as $n) {
            if ($n instanceof DOMText) {
                continue;
            }
            if (!$n instanceof DOMElement) {
                $node->removeChild($n);
                $removed = true;
                continue;
            }
            $tag = strtoupper($n->nodeName);
            if (!isset($allowed[$tag])) {
                $removed = true;
                if (!isset($drop[$tag])) {
                    $walk($n);
                    while ($n->firstChild) {
                        $node->insertBefore($n->firstChild, $n);
                    }
                }
                $node->removeChild($n);
                continue;
            }
            $href = $tag === 'A' ? trim($n->getAttribute('href')) : '';
            $safeHref = preg_match('#^(https?:|mailto:)#i', $href) === 1;
            foreach (iterator_to_array($n->attributes) as $attr) {
                if (!($attr->nodeName === 'href' && $safeHref)) {
                    $removed = true;
                }
                $n->removeAttribute($attr->nodeName);
            }
            if ($safeHref) {
                $n->setAttribute('href', $href);
            }
            $walk($n);
        }
    };
    $walk($root);
    $out = '';
    foreach ($root->childNodes as $child) {
        $out .= $doc->saveHTML($child);
    }
    return $out;
}

/** IPv4 / IPv6 cím 16 bájton (az IPv4 ::ffff:a.b.c.d alakban), hogy egy BINARY(16) oszlopban sorba rendezhető legyen. */
function vaIpBin(string $ip): ?string
{
    $bin = @inet_pton(trim($ip));
    if ($bin === false) {
        return null;
    }
    return strlen($bin) === 4 ? str_repeat("\0", 10) . "\xff\xff" . $bin : $bin;
}

/** Ország a helyi GeoIP-táblából (db-ip.com IP to Country Lite, geoip.php tölti be); az IP-t nem tárolja. */
function vaCountryForIp(PDO $db, string $ip): string
{
    $bin = vaIpBin($ip);
    if ($bin === null) {
        return '';
    }
    try {
        // hexként megy át, mert a nyers bájtok az utf8mb4 kapcsolaton hibát adhatnak
        $hex = strtoupper(bin2hex($bin));
        $st = $db->prepare('SELECT HEX(ip_to) AS ip_to, country FROM va_geoip WHERE ip_from <= UNHEX(?) ORDER BY ip_from DESC LIMIT 1');
        $st->execute([$hex]);
        $row = $st->fetch();
    } catch (Throwable $e) {
        return '';
    }
    return $row && strcmp((string) $row['ip_to'], $hex) >= 0 && preg_match('/^[A-Z]{2}$/', (string) $row['country']) ? (string) $row['country'] : '';
}

function vaSetting(PDO $db, string $key, ?string $value = null): string
{
    if ($value !== null) {
        $db->prepare('INSERT INTO va_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)')->execute([$key, $value]);
        return $value;
    }
    $st = $db->prepare('SELECT v FROM va_settings WHERE k = ?');
    $st->execute([$key]);
    return (string) ($st->fetchColumn() ?: '');
}

// Frissítés-kiadás: az app frissítője (downloads/VA/index.php listája) csak a dashboardon (release.php)
// kiadott verzióig kínál telepítőt; a feltöltött újabb telepítők addig várakoznak.
const VA_UPDATE_SETTING = 'update_approved_version';
const VA_UPDATE_DEFAULT = '2.6.1'; // kiadva a jóváhagyás bevezetése előtt
const VA_INSTALLER_PATTERNS = [
    'WIN X64' => 'C64 Visual Assembler_*_x64-setup.exe',
    'WIN ARM64' => 'C64 Visual Assembler_*_arm64-setup.exe',
    'MAC X64' => 'C64 Visual Assembler_*_x64.dmg',
    'MAC ARM' => 'C64 Visual Assembler_*_aarch64.dmg',
    'APPIMAGE' => 'C64 Visual Assembler_*_amd64.AppImage',
    'DEB' => 'C64 Visual Assembler_*_amd64.deb',
    'RPM' => 'C64 Visual Assembler-*-1.x86_64.rpm',
];

function vaUpdateApproved(PDO $db): string
{
    $v = vaSetting($db, VA_UPDATE_SETTING);
    return $v !== '' ? $v : VA_UPDATE_DEFAULT;
}

/** A telepítő fájlnevéből a verzió ("2.6.2"), vagy null. */
function vaInstallerVersion(string $name): ?string
{
    return preg_match('/(?:_|-)(\d+\.\d+\.\d+)(?:_|-)/', $name, $m) ? $m[1] : null;
}

/** A downloads/VA mappa telepítői: [fájlnév => platform]. */
function vaInstallers(string $dir): array
{
    $out = [];
    foreach (VA_INSTALLER_PATTERNS as $platform => $pattern) {
        foreach (glob($dir . DIRECTORY_SEPARATOR . $pattern) ?: [] as $file) {
            $out[basename($file)] = $platform;
        }
    }
    return $out;
}

/** Országkód → angol név (intl nélkül a kód marad). */
function vaCountryName(string $cc): string
{
    if ($cc === '') {
        return 'UNKNOWN';
    }
    $name = class_exists('Locale') ? (string) Locale::getDisplayRegion('-' . $cc, 'en') : '';
    return $name !== '' && $name !== $cc ? $name : $cc;
}

/** Egy támogatási beszélgetés üzenetei (az $afterId utániak), az app és az admin oldal közös formájában. */
function vaSupportMessages(PDO $db, int $threadId, int $afterId = 0): array
{
    $st = $db->prepare('SELECT id, sender, body, created_at FROM va_support_messages WHERE thread_id = ? AND id > ? ORDER BY id');
    $st->execute([$threadId, $afterId]);
    $rows = $st->fetchAll();
    $files = [];
    if ($rows) {
        $ids = array_map(static fn($r) => (int) $r['id'], $rows);
        $fs = $db->prepare('SELECT id, message_id, name, mime, size FROM va_support_files WHERE message_id IN ('
            . implode(',', array_fill(0, count($ids), '?')) . ') ORDER BY id');
        $fs->execute($ids);
        foreach ($fs->fetchAll() as $f) {
            $files[(int) $f['message_id']][] = ['id' => (int) $f['id'], 'name' => (string) $f['name'], 'size' => (int) $f['size'],
                'image' => strpos((string) $f['mime'], 'image/') === 0];
        }
    }
    return array_map(static fn(array $r): array => [
        'id' => (int) $r['id'],
        'from' => $r['sender'] === 'admin' ? 'admin' : 'user',
        'text' => (string) $r['body'],
        'at' => date('c', (int) strtotime((string) $r['created_at'])),
        'files' => $files[(int) $r['id']] ?? [],
    ], $rows);
}

const VA_SUPPORT_MAX_FILES = 3;
const VA_SUPPORT_MAX_FILE_BYTES = 4 * 1024 * 1024;
const VA_SUPPORT_IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
const VA_SUPPORT_FILE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'txt', 'log', 'md', 'asm', 's', 'inc', 'a65', 'ub', 'bas', 'json', 'csv',
    'proj', 'prg', 'd64', 'd71', 'd81', 't64', 'crt', 'sid', 'bin', 'seq', 'koa', 'kla', 'zip', '7z'];

/**
 * Támogatási csatolmányok ellenőrzése: [[név, bájtok], …] → [[tiszta név, mime, bájtok], …], vagy hibakód
 * ('files': túl sok / túl nagy, 'file_type': nem engedett kiterjesztés, vagy kép-kiterjesztés, ami nem kép).
 * A képek mime-ja a tartalomból jön, minden más application/octet-stream (letöltésként adjuk ki, sosem futtatva).
 */
function vaSupportCheckFiles(array $files)
{
    if (count($files) > VA_SUPPORT_MAX_FILES || array_sum(array_map(static fn($f) => strlen($f[1]), $files)) > VA_SUPPORT_MAX_FILE_BYTES) {
        return 'files';
    }
    $out = [];
    foreach ($files as [$name, $bytes]) {
        $name = trim(preg_replace('/[^\pL\pN ._()\-]+/u', '_', basename(str_replace('\\', '/', (string) $name))), ' .');
        $name = mb_substr($name !== '' ? $name : 'file', 0, 150);
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if ($bytes === '' || !in_array($ext, VA_SUPPORT_FILE_EXT, true)) {
            return 'file_type';
        }
        $mime = 'application/octet-stream';
        if (in_array($ext, VA_SUPPORT_IMAGE_EXT, true)) {
            $info = @getimagesizefromstring($bytes);
            if (!$info || !in_array($info['mime'] ?? '', ['image/png', 'image/jpeg', 'image/gif', 'image/webp'], true)) {
                return 'file_type';
            }
            $mime = $info['mime'];
        }
        $out[] = [$name, $mime, $bytes];
    }
    return $out;
}

function vaSupportStoreFiles(PDO $db, int $messageId, array $files): void
{
    $ins = $db->prepare('INSERT INTO va_support_files (message_id, name, mime, size, data) VALUES (?, ?, ?, ?, ?)');
    foreach ($files as [$name, $mime, $bytes]) {
        $ins->bindValue(1, $messageId, PDO::PARAM_INT);
        $ins->bindValue(2, $name);
        $ins->bindValue(3, $mime);
        $ins->bindValue(4, strlen($bytes), PDO::PARAM_INT);
        $ins->bindValue(5, $bytes, PDO::PARAM_LOB);
        $ins->execute();
    }
}

/** Egy üzenet törlése a csatolmányaival; utána az olvasatlan-számlálók a megmaradt üzenetekhez igazodnak. */
function vaSupportDeleteMessage(PDO $db, int $threadId, int $messageId): bool
{
    $st = $db->prepare('SELECT sender FROM va_support_messages WHERE id = ? AND thread_id = ?');
    $st->execute([$messageId, $threadId]);
    if ($st->fetchColumn() === false) {
        return false;
    }
    $db->prepare('DELETE FROM va_support_files WHERE message_id = ?')->execute([$messageId]);
    $db->prepare('DELETE FROM va_support_messages WHERE id = ?')->execute([$messageId]);
    $db->prepare("UPDATE va_support_threads t SET
        unread_admin = LEAST(unread_admin, (SELECT COUNT(*) FROM va_support_messages m WHERE m.thread_id = t.id AND m.sender = 'user')),
        unread_user = LEAST(unread_user, (SELECT COUNT(*) FROM va_support_messages m WHERE m.thread_id = t.id AND m.sender = 'admin'))
        WHERE t.id = ?")->execute([$threadId]);
    return true;
}

/** A teljes beszélgetés törlése (üzenetek, csatolmányok, maga a beszélgetés). */
function vaSupportDeleteThread(PDO $db, int $threadId): void
{
    $db->prepare('DELETE f FROM va_support_files f JOIN va_support_messages m ON m.id = f.message_id WHERE m.thread_id = ?')->execute([$threadId]);
    $db->prepare('DELETE FROM va_support_messages WHERE thread_id = ?')->execute([$threadId]);
    $db->prepare('DELETE FROM va_support_threads WHERE id = ?')->execute([$threadId]);
}

/** Egy csatolmány letöltése / megjelenítése: a képek inline (nosniff), minden más letöltésként. */
function vaSupportSendFile(array $f, bool $inline): void
{
    $image = strpos((string) $f['mime'], 'image/') === 0;
    header('Content-Type: ' . ($image ? $f['mime'] : 'application/octet-stream'));
    header('X-Content-Type-Options: nosniff');
    header("Content-Security-Policy: default-src 'none'; sandbox");
    header('Content-Disposition: ' . ($inline && $image ? 'inline' : 'attachment') . "; filename*=UTF-8''" . rawurlencode((string) $f['name']));
    header('Content-Length: ' . strlen((string) $f['data']));
    echo $f['data'];
}

/** Értesítő e-mail (hibája nem rontja el a hívót). */
function vaNotifyMail(string $to, string $subject, string $body): void
{
    if ($to === '') {
        return;
    }
    try {
        $smtp = vaConfig()['smtp'];
        vaSendSmtpMail($smtp['host'], (int) $smtp['port'], $smtp['encryption'], $smtp['user'], $smtp['pass'],
            $smtp['from'], $smtp['from_name'] ?? '', $to, $subject, $body);
    } catch (Throwable $e) {
        error_log('VA notify mail error: ' . $e->getMessage());
    }
}

function vaClientIp(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
}

/**
 * Sorozatszám igénylése. Eredmény: 'sent' | 'invalid_email' | 'not_donor' | 'exists' | 'rate' | 'mail' | 'server'.
 */
function vaRequestSerial(string $rawEmail, string $lang): string
{
    $email = vaNormalizeEmail($rawEmail);
    if (!vaValidEmail($email)) {
        return 'invalid_email';
    }
    $cfg = vaConfig();
    $db = vaDb();
    $ip = vaClientIp();

    // csak a sikertelen próbálkozások számítanak: a donorlista így sem pásztázható,
    // a sikeres kérést pedig úgyis korlátozza az e-mail címenként egy serial
    $db->exec('DELETE FROM va_register_attempts WHERE created_at < (NOW() - INTERVAL 1 DAY)');
    $st = $db->prepare('SELECT COUNT(*) FROM va_register_attempts WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $st->execute([$ip]);
    if ((int) $st->fetchColumn() >= (int) ($cfg['max_per_ip_per_hour'] ?? 10)) {
        return 'rate';
    }

    $st = $db->prepare('SELECT 1 FROM va_donors WHERE email = ?');
    $st->execute([$email]);
    $result = $st->fetchColumn() === false ? 'not_donor' : vaIssueSerial($email, $lang, false);
    if ($result === 'not_donor' || $result === 'exists') {
        $db->prepare('INSERT INTO va_register_attempts (ip, created_at) VALUES (?, NOW())')->execute([$ip]);
    }
    return $result;
}

/**
 * Serial kiadása és kiküldése (a donor-ellenőrzés után). Eredmény: 'sent' | 'exists' | 'mail'.
 * $resend: ha már kapott serialt, újra elküldi (vásárlásnál), különben 'exists'.
 */
function vaIssueSerial(string $email, string $lang, bool $resend): string
{
    $cfg = vaConfig();
    $db = vaDb();
    $serial = vaMakeSerial($email);
    $isNew = true;
    try {
        $db->prepare('INSERT INTO va_serial_requests (email, serial, lang, ip, user_agent, created_at) VALUES (?, ?, ?, ?, ?, NOW())')
            ->execute([$email, $serial, $lang, vaClientIp(), substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255)]);
    } catch (PDOException $e) {
        // 1062: duplikált e-mail (UNIQUE) — már kért
        if ((int) ($e->errorInfo[1] ?? 0) !== 1062) {
            throw $e;
        }
        if (!$resend) {
            return 'exists';
        }
        $isNew = false;
    }

    try {
        [$subject, $body] = vaMailText($lang, $email, $serial);
        $smtp = $cfg['smtp'];
        vaSendSmtpMail($smtp['host'], (int) $smtp['port'], $smtp['encryption'], $smtp['user'], $smtp['pass'],
            $smtp['from'], $smtp['from_name'] ?? '', $email, $subject, $body, $smtp['bcc'] ?? '');
    } catch (Throwable $e) {
        // a levél nem ment ki: a cím újra próbálkozhat
        if ($isNew) {
            $db->prepare('DELETE FROM va_serial_requests WHERE email = ? AND mailed_at IS NULL')->execute([$email]);
        }
        error_log('VA register mail error: ' . $e->getMessage());
        return 'mail';
    }
    $db->prepare('UPDATE va_serial_requests SET mailed_at = NOW() WHERE email = ?')->execute([$email]);
    return 'sent';
}

function vaMailText(string $lang, string $email, string $serial): array
{
    if ($lang === 'hu') {
        return ['C64 Visual Assembler Professional sorozatszám', "Szia!\n\nKöszönjük, hogy regisztráltál. A C64 Visual Assembler teljes verziójának adatai:\n\n"
            . "E-mail:      $email\nSorozatszám: $serial\n\n"
            . "Aktiválás: Menü → Regisztráció…, add meg a fenti e-mail címet és sorozatszámot, majd Aktiválás.\n\n"
            . "Jó kódolást!\nC64 Visual Assembler\nhttps://www.c64va.pro/\n"];
    }
    return ['C64 Visual Assembler Professional serial', "Hi,\n\nThank you for registering. Your C64 Visual Assembler full version details:\n\n"
        . "Email:  $email\nSerial: $serial\n\n"
        . "To activate: Menu → Register…, enter the email address and serial above, then Activate.\n\n"
        . "Happy coding!\nC64 Visual Assembler\nhttps://www.c64va.pro/\n"];
}

function vaSmtpRead($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }
    return $response;
}

function vaSmtpCommand($socket, ?string $command, array $allowedCodes): string
{
    if ($command !== null) {
        fwrite($socket, $command . "\r\n");
    }
    $response = vaSmtpRead($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $allowedCodes, true)) {
        throw new RuntimeException('SMTP (' . $code . '): ' . trim($response));
    }
    return $response;
}

function vaMimeHeader(string $text): string
{
    return preg_match('/[^\x20-\x7E]/', $text) ? '=?UTF-8?B?' . base64_encode($text) . '?=' : $text;
}

function vaSendSmtpMail(string $host, int $port, string $encryption, string $user, string $pass,
    string $from, string $fromName, string $to, string $subject, string $body, string $bcc = ''): void
{
    $transport = $encryption === 'ssl' ? 'ssl://' . $host : $host;
    $socket = @stream_socket_client($transport . ':' . $port, $errno, $errstr, 20, STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]));
    if (!$socket) {
        throw new RuntimeException("SMTP kapcsolódás: $errstr ($errno)");
    }
    stream_set_timeout($socket, 20);
    $helo = 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
    try {
        vaSmtpCommand($socket, null, [220]);
        vaSmtpCommand($socket, $helo, [250]);
        if ($encryption === 'tls') {
            vaSmtpCommand($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS sikertelen.');
            }
            vaSmtpCommand($socket, $helo, [250]);
        }
        vaSmtpCommand($socket, 'AUTH LOGIN', [334]);
        vaSmtpCommand($socket, base64_encode($user), [334]);
        vaSmtpCommand($socket, base64_encode($pass), [235]);
        vaSmtpCommand($socket, 'MAIL FROM:<' . $from . '>', [250]);
        vaSmtpCommand($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        if ($bcc !== '') {
            vaSmtpCommand($socket, 'RCPT TO:<' . $bcc . '>', [250, 251]);
        }
        vaSmtpCommand($socket, 'DATA', [354]);
        $domain = substr(strrchr($from, '@') ?: '@localhost', 1);
        $headers = [
            'From: ' . ($fromName !== '' ? vaMimeHeader($fromName) . ' <' . $from . '>' : $from),
            'To: ' . $to,
            'Subject: ' . vaMimeHeader($subject),
            'Date: ' . date(DATE_RFC2822),
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace(["\r\n", "\r", "\n"], "\r\n", $body);
        $message = preg_replace('/^\./m', '..', $message) ?? $message;
        fwrite($socket, $message . "\r\n.\r\n");
        vaSmtpCommand($socket, null, [250]);
        vaSmtpCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}
