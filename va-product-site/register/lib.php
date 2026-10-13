<?php
declare(strict_types=1);

// Pro sorozatszám a támogatóknak: csak a va_donors táblában lévő e-mail címre, címenként egyszer.
// A donorlistát a node scripts/keygen.js donors-sql <donations.csv> <out.sql> állítja elő.
// A sorozatszám ugyanaz, mint a scripts/keygen.js-é: "VA1-" + base64url(Ed25519("c64va-license-v1:<email>")).

if (!defined('VA_REGISTER')) {
    http_response_code(403);
    exit;
}

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

    // minden próbálkozás számít, így a donorlista nem pásztázható
    $db->exec('DELETE FROM va_register_attempts WHERE created_at < (NOW() - INTERVAL 1 DAY)');
    $st = $db->prepare('SELECT COUNT(*) FROM va_register_attempts WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $st->execute([$ip]);
    if ((int) $st->fetchColumn() >= (int) ($cfg['max_per_ip_per_hour'] ?? 10)) {
        return 'rate';
    }
    $db->prepare('INSERT INTO va_register_attempts (ip, created_at) VALUES (?, NOW())')->execute([$ip]);

    $st = $db->prepare('SELECT 1 FROM va_donors WHERE email = ?');
    $st->execute([$email]);
    if ($st->fetchColumn() === false) {
        return 'not_donor';
    }

    return vaIssueSerial($email, $lang, false);
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
