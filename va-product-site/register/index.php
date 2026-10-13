<?php
declare(strict_types=1);

// Professional sorozatszám kérése e-mailben a támogatóknak (donorlista, e-mail címenként egyszer).
// HTML űrlap, és JSON API az app számára: POST {"email": "...", "lang": "hu"} → {"ok": bool, "result": "..."}.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$isJson = stripos((string) ($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json') !== false;
$input = $_POST;
if ($isJson) {
    $input = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = [];
    }
}

$lang = strtolower(substr((string) ($input['lang'] ?? $_GET['lang'] ?? ''), 0, 2));
if ($lang === '') {
    $lang = stripos((string) ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''), 'hu') === 0 ? 'hu' : 'en';
}
if (!preg_match('/^[a-z]{2}$/', $lang)) {
    $lang = 'en';
}

$result = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (trim((string) ($input['website'] ?? '')) !== '') {
        $result = 'sent'; // honeypot: bot
    } else {
        try {
            $result = vaRequestSerial((string) ($input['email'] ?? ''), $lang);
        } catch (Throwable $e) {
            error_log('VA register error: ' . $e->getMessage());
            $result = 'server';
        }
    }
    if ($isJson) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(['sent' => 200, 'invalid_email' => 400, 'not_donor' => 403, 'exists' => 409, 'rate' => 429][$result] ?? 500);
        echo json_encode(['ok' => $result === 'sent', 'result' => $result]);
        exit;
    }
} elseif ($isJson) {
    http_response_code(405);
    exit;
}

$hu = $lang === 'hu';
$texts = $hu ? [
    'title' => 'Professional sorozatszám',
    'intro' => 'Köszönjük, hogy támogattad a C64 Visual Assemblert! Add meg azt az e-mail címet, amellyel a támogatást küldted, és elküldjük a Professional verzió sorozatszámát. E-mail címenként egy sorozatszám kérhető.',
    'email' => 'E-mail cím',
    'send' => 'Sorozatszám kérése',
    'sent' => 'Elküldtük a sorozatszámot. Ha néhány percen belül nem érkezik meg, nézd meg a spam mappát is.',
    'invalid_email' => 'Érvénytelen e-mail cím.',
    'not_donor' => 'Ez az e-mail cím nem szerepel a támogatók között. Azt a címet add meg, amellyel a támogatást küldted (a lista frissítése eltarthat egy ideig).',
    'exists' => 'Erre az e-mail címre már küldtünk sorozatszámot.',
    'rate' => 'Túl sok kérés. Próbáld újra később.',
    'mail' => 'A levelet nem sikerült elküldeni. Próbáld újra később.',
    'server' => 'Szerverhiba. Próbáld újra később.',
    'back' => 'Vissza a főoldalra',
] : [
    'title' => 'Professional serial',
    'intro' => 'Thank you for supporting C64 Visual Assembler! Enter the email address you donated with and we will send you a serial for the Professional version. One serial per email address.',
    'email' => 'Email address',
    'send' => 'Request serial',
    'sent' => 'Your serial is on its way. If it does not arrive within a few minutes, check your spam folder.',
    'invalid_email' => 'Invalid email address.',
    'not_donor' => 'This email address is not on the supporter list. Use the address you donated with (the list may take a while to update).',
    'exists' => 'A serial has already been sent to this email address.',
    'rate' => 'Too many requests. Please try again later.',
    'mail' => 'The email could not be sent. Please try again later.',
    'server' => 'Server error. Please try again later.',
    'back' => 'Back to the home page',
];
$h = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
?>
<!doctype html>
<html lang="<?= $h($lang) ?>">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>C64 Visual Assembler — <?= $h($texts['title']) ?></title>
    <link rel="icon" href="../favicon.ico">
    <style>
        :root { --bg: #1b1b3a; --card: #2a2a5a; --text: #e8e8ff; --muted: #a8a8d8; --ylw: #ffd84a; --ok: #3fbf6a; --err: #ff6b6b; }
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px;
               background: var(--bg); color: var(--text); font: 16px/1.5 system-ui, sans-serif; }
        main { width: 100%; max-width: 480px; background: var(--card); border-radius: 6px; padding: 28px 24px; }
        h1 { margin: 0 0 4px; font-size: 1.1rem; letter-spacing: .08em; text-transform: uppercase; color: var(--ylw); }
        p { color: var(--muted); }
        label { display: block; margin-top: 18px; font-weight: 600; font-size: .9rem; }
        input[type=email] { width: 100%; margin-top: 6px; padding: 10px 12px; font: inherit; border: 1px solid #55558a;
               border-radius: 4px; background: #15152e; color: var(--text); }
        button { margin-top: 18px; width: 100%; padding: 11px; font: inherit; font-weight: 700; border: 0; border-radius: 4px;
               background: var(--ylw); color: #1b1b3a; cursor: pointer; }
        .msg { padding: 10px 12px; border-radius: 4px; margin: 16px 0 0; }
        .msg.ok { background: color-mix(in srgb, var(--ok) 20%, transparent); color: var(--ok); }
        .msg.err { background: color-mix(in srgb, var(--err) 20%, transparent); color: var(--err); }
        .hp { position: absolute; left: -9999px; }
        .lang { float: right; font-size: .8rem; }
        a { color: var(--ylw); }
        .back { display: inline-block; margin-top: 18px; font-size: .85rem; }
    </style>
</head>
<body>
<main>
    <a class="lang" href="?lang=<?= $hu ? 'en' : 'hu' ?>"><?= $hu ? 'English' : 'Magyar' ?></a>
    <h1><?= $h($texts['title']) ?></h1>
    <p><?= $h($texts['intro']) ?></p>
    <?php if ($result !== null): ?>
        <p class="msg <?= $result === 'sent' ? 'ok' : 'err' ?>" role="status"><?= $h($texts[$result] ?? $texts['server']) ?></p>
    <?php endif; ?>
    <?php if ($result !== 'sent'): ?>
    <form method="post" action="?lang=<?= $h($lang) ?>">
        <input type="hidden" name="lang" value="<?= $h($lang) ?>">
        <label><?= $h($texts['email']) ?>
            <input type="email" name="email" required maxlength="254" autocomplete="email"
                   value="<?= $h((string) ($input['email'] ?? '')) ?>">
        </label>
        <label class="hp" aria-hidden="true">Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
        <button type="submit"><?= $h($texts['send']) ?></button>
    </form>
    <?php endif; ?>
    <a class="back" href="../"><?= $h($texts['back']) ?></a>
</main>
</body>
</html>
