<?php
declare(strict_types=1);

// Egyszerű SMTP-teszt Forpsihoz, külső könyvtár nélkül.
// Használat: töltsd fel a fájlt PHP-t futtató tárhelyre, nyisd meg HTTPS-en,
// add meg a címzetteket és a postmaster jelszavát, majd küldd el a tesztlevelet.

$defaultFrom = 'postmaster@c64va.pro';
$smtpHost = 'smtp.forpsi.com';
$smtpPort = 587;
$smtpEncryption = 'tls';

$result = null;
$error = null;

function smtpRead($socket): string
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

function smtpExpect($socket, array $allowedCodes): string
{
    $response = smtpRead($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $allowedCodes, true)) {
        throw new RuntimeException('SMTP hiba (' . $code . '): ' . trim($response));
    }
    return $response;
}

function smtpCommand($socket, string $command, array $allowedCodes): string
{
    fwrite($socket, $command . "\r\n");
    return smtpExpect($socket, $allowedCodes);
}

function sendSmtpMail(
    string $host,
    int $port,
    string $encryption,
    string $username,
    string $password,
    string $from,
    string $to,
    string $subject,
    string $body
): void {
    $transport = $encryption === 'ssl' ? 'ssl://' . $host : $host;
    $socket = @stream_socket_client(
        $transport . ':' . $port,
        $errno,
        $errstr,
        20,
        STREAM_CLIENT_CONNECT,
        stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]])
    );
    if (!$socket) {
        throw new RuntimeException("Nem sikerült kapcsolódni az SMTP szerverhez: $errstr ($errno)");
    }
    stream_set_timeout($socket, 20);

    try {
        smtpExpect($socket, [220]);
        smtpCommand($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), [250]);

        if ($encryption === 'tls') {
            smtpCommand($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('A TLS titkosítás bekapcsolása sikertelen.');
            }
            smtpCommand($socket, 'EHLO ' . ($_SERVER['SERVER_NAME'] ?? 'localhost'), [250]);
        }

        smtpCommand($socket, 'AUTH LOGIN', [334]);
        smtpCommand($socket, base64_encode($username), [334]);
        smtpCommand($socket, base64_encode($password), [235]);
        smtpCommand($socket, 'MAIL FROM:<' . $from . '>', [250]);

        $recipients = array_filter(array_map('trim', explode(',', $to)));
        if (!$recipients) {
            throw new RuntimeException('Legalább egy címzett szükséges.');
        }
        foreach ($recipients as $recipient) {
            if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
                throw new RuntimeException('Hibás címzett: ' . $recipient);
            }
            smtpCommand($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        }

        smtpCommand($socket, 'DATA', [354]);
        $safeSubject = trim(preg_replace('/[\r\n]+/', ' ', $subject) ?? 'SMTP teszt');
        $headers = [
            'From: ' . $from,
            'To: ' . implode(', ', $recipients),
            'Subject: ' . $safeSubject,
            'Date: ' . date(DATE_RFC2822),
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        $message = implode("\r\n", $headers) . "\r\n\r\n" . str_replace(["\r\n", "\r", "\n"], "\r\n", $body);
        $message = preg_replace('/^\./m', '..', $message) ?? $message;
        fwrite($socket, $message . "\r\n.\r\n");
        smtpExpect($socket, [250]);
        smtpCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? $defaultFrom));
    $password = (string) ($_POST['password'] ?? '');
    $to = trim((string) ($_POST['to'] ?? ''));
    $subject = trim((string) ($_POST['subject'] ?? 'PHP SMTP teszt'));
    $body = (string) ($_POST['body'] ?? 'Ez egy PHP SMTP tesztlevél.');

    try {
        if (!filter_var($username, FILTER_VALIDATE_EMAIL) || $password === '') {
            throw new RuntimeException('A felhasználónévnek érvényes e-mail címnek, a jelszónak pedig kitöltöttnek kell lennie.');
        }
        sendSmtpMail($smtpHost, $smtpPort, $smtpEncryption, $username, $password, $username, $to, $subject, $body);
        $result = 'A levelet az SMTP szerver elfogadta.';
    } catch (Throwable $exception) {
        $error = $exception->getMessage();
    }
}
?>
<!doctype html>
<html lang="hu">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>PHP SMTP teszt</title>
    <style>
        body { max-width: 620px; margin: 2rem auto; padding: 0 1rem; font: 16px system-ui, sans-serif; }
        label { display: block; margin-top: 1rem; font-weight: 600; }
        input, textarea { box-sizing: border-box; width: 100%; padding: .65rem; margin-top: .35rem; font: inherit; }
        textarea { min-height: 140px; }
        button { margin-top: 1.25rem; padding: .7rem 1.2rem; cursor: pointer; }
        .ok, .err { padding: .8rem; margin: 1rem 0; border-radius: 4px; }
        .ok { background: #d9f7df; color: #145c22; }
        .err { background: #ffe0e0; color: #8b1111; }
        small { color: #555; }
    </style>
</head>
<body>
    <h1>PHP SMTP teszt</h1>
    <p><small>SMTP: <?= htmlspecialchars($smtpHost, ENT_QUOTES, 'UTF-8') ?>:<?= $smtpPort ?> (STARTTLS)</small></p>
    <?php if ($result !== null): ?><div class="ok"><?= htmlspecialchars($result, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
    <?php if ($error !== null): ?><div class="err">Hiba: <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
    <form method="post">
        <label>SMTP felhasználónév
            <input type="email" name="username" value="<?= htmlspecialchars((string) ($_POST['username'] ?? $defaultFrom), ENT_QUOTES, 'UTF-8') ?>" required>
        </label>
        <label>SMTP jelszó
            <input type="password" name="password" required autocomplete="off">
        </label>
        <label>Címzett(ek) <small>(több cím vesszővel elválasztva)</small>
            <input type="text" name="to" value="<?= htmlspecialchars((string) ($_POST['to'] ?? ''), ENT_QUOTES, 'UTF-8') ?>" required>
        </label>
        <label>Tárgy
            <input type="text" name="subject" value="<?= htmlspecialchars((string) ($_POST['subject'] ?? 'PHP SMTP teszt'), ENT_QUOTES, 'UTF-8') ?>" required>
        </label>
        <label>Üzenet
            <textarea name="body" required><?= htmlspecialchars((string) ($_POST['body'] ?? 'Ez egy PHP SMTP tesztlevél.'), ENT_QUOTES, 'UTF-8') ?></textarea>
        </label>
        <button type="submit">Tesztlevél küldése</button>
    </form>
</body>
</html>
