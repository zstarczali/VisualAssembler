<?php
declare(strict_types=1);

// Professional vásárlás PayPallal, fix áron. JSON műveletek (POST): {"action": "create", "email", "lang"} → {"id"},
// {"action": "capture", "orderID"} → {"result": "sent" | "pending" | "mail" | "error"}.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/paypal.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    $in = json_decode((string) file_get_contents('php://input'), true);
    $in = is_array($in) ? $in : [];
    try {
        $action = (string) ($in['action'] ?? '');
        if ($action === 'create') {
            $lang = strtolower(substr((string) ($in['lang'] ?? 'en'), 0, 2));
            $res = vaCreateOrder((string) ($in['email'] ?? ''), preg_match('/^[a-z]{2}$/', $lang) ? $lang : 'en');
            http_response_code(isset($res['id']) ? 200 : 400);
            echo json_encode($res);
        } elseif ($action === 'capture') {
            echo json_encode(['result' => vaCaptureOrder((string) ($in['orderID'] ?? ''))]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'action']);
        }
    } catch (Throwable $e) {
        error_log('VA buy error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'server', 'result' => 'error']);
    }
    exit;
}

$lang = strtolower(substr((string) ($_GET['lang'] ?? ''), 0, 2));
if ($lang !== 'hu' && $lang !== 'en') {
    $lang = stripos((string) ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''), 'hu') === 0 ? 'hu' : 'en';
}
$hu = $lang === 'hu';
$pp = vaPaypalCfg();
$price = number_format((float) $pp['price'], 2, $hu ? ',' : '.', '') . ' ' . ($pp['currency'] === 'EUR' ? '€' : $pp['currency']);
$texts = $hu ? [
    'title' => 'Professional vásárlás',
    'intro' => 'A Professional verzióval minden funkciót korlátozás nélkül élvezhetsz! Egyszeri díj, a sorozatszámot fizetés után azonnal e-mailben küldjük.',
    'email' => 'Licenc e-mail cím (erre küldjük a sorozatszámot)',
    'invalid_email' => 'Érvénytelen e-mail cím.',
    'licensed' => 'Erre az e-mail címre már küldtünk sorozatszámot. Ha elveszett, írj nekünk.',
    'rate' => 'Túl sok kérés. Próbáld újra később.',
    'sent' => 'Köszönjük a vásárlást! A sorozatszámot elküldtük e-mailben. Ha néhány percen belül nem érkezik meg, nézd meg a spam mappát is.',
    'pending' => 'A fizetés feldolgozás alatt van. Jóváírás után automatikusan elküldjük a sorozatszámot e-mailben.',
    'mail' => 'A fizetés sikeres, de a levelet nem sikerült elküldeni. A sorozatszámot a Sorozatszám kérése oldalon kérheted ugyanezzel a címmel.',
    'error' => 'Hiba történt a fizetés feldolgozásakor. Ha a PayPal terhelt, írj nekünk, és pótoljuk.',
    'cancel' => 'A fizetés megszakítva.',
    'unavailable' => 'A fizetés jelenleg nem érhető el. Próbáld újra később.',
    'serial' => 'Már vásároltál vagy támogattál? Sorozatszám kérése',
    'manual' => 'Fizess PayPallal, és a megjegyzésbe írd be, melyik e-mail címre kéred a sorozatszámot. A fizetés beérkezése után elküldjük e-mailben.',
    'manual_btn' => 'Fizetés PayPallal',
    'back' => 'Vissza a főoldalra',
] : [
    'title' => 'Buy Professional',
    'intro' => 'With Professional you can enjoy every feature without limits! One-time payment; your serial is emailed right after payment.',
    'email' => 'License email address (the serial is sent here)',
    'invalid_email' => 'Invalid email address.',
    'licensed' => 'A serial has already been sent to this email address. If you lost it, contact us.',
    'rate' => 'Too many requests. Please try again later.',
    'sent' => 'Thank you for your purchase! Your serial has been emailed. If it does not arrive within a few minutes, check your spam folder.',
    'pending' => 'Your payment is being processed. The serial will be emailed automatically once it clears.',
    'mail' => 'Payment received, but the email could not be sent. Request your serial on the Request serial page with the same address.',
    'error' => 'Something went wrong while processing the payment. If PayPal charged you, contact us and we will fix it.',
    'cancel' => 'Payment cancelled.',
    'unavailable' => 'Payment is not available right now. Please try again later.',
    'serial' => 'Already purchased or donated? Request your serial',
    'manual' => 'Pay with PayPal and write the email address for your serial in the PayPal note. We email the serial once the payment arrives.',
    'manual_btn' => 'Pay with PayPal',
    'back' => 'Back to the home page',
];
$h = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
// amíg nincs élő PayPal (Business + Live kulcs), a fizetés paypal.me-n megy, a serialt az admin küldi (stats.php)
$manual = ($pp['mode'] ?? 'sandbox') !== 'live' || ($pp['client_id'] ?? '') === '';
$manualUrl = 'https://paypal.me/ZsoltTarczali/' . rawurlencode(rtrim(rtrim((string) $pp['price'], '0'), '.')) . $pp['currency'];
$sdk = 'https://www.paypal.com/sdk/js?' . http_build_query([
    'client-id' => $pp['client_id'], 'currency' => $pp['currency'], 'intent' => 'capture', 'locale' => $hu ? 'hu_HU' : 'en_US',
]);
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
        .price { font-size: 2rem; font-weight: 800; color: var(--text); margin: 8px 0 0; }
        label { display: block; margin-top: 18px; font-weight: 600; font-size: .9rem; }
        input[type=email] { width: 100%; margin-top: 6px; padding: 10px 12px; font: inherit; border: 1px solid #55558a;
               border-radius: 4px; background: #15152e; color: var(--text); }
        #paypal-buttons { margin-top: 18px; min-height: 50px; }
        .msg { padding: 10px 12px; border-radius: 4px; margin: 16px 0 0; }
        .msg.ok { background: color-mix(in srgb, var(--ok) 20%, transparent); color: var(--ok); }
        .msg.err { background: color-mix(in srgb, var(--err) 20%, transparent); color: var(--err); }
        .msg[hidden] { display: none; }
        .lang { float: right; font-size: .8rem; }
        a { color: var(--ylw); }
        .paybtn { display: block; margin-top: 18px; padding: 12px; border-radius: 4px; background: #ffc439; color: #111;
               font-weight: 700; text-align: center; text-decoration: none; }
        .links { display: flex; flex-direction: column; gap: 6px; margin-top: 18px; font-size: .85rem; }
    </style>
</head>
<body>
<main>
    <a class="lang" href="?lang=<?= $hu ? 'en' : 'hu' ?>"><?= $hu ? 'English' : 'Magyar' ?></a>
    <h1><?= $h($texts['title']) ?></h1>
    <p class="price"><?= $h($price) ?></p>
    <p><?= $h($manual ? strtok($texts['intro'], '!') . '!' : $texts['intro']) ?></p>
    <?php if ($manual): ?>
    <p class="msg ok"><?= $h($texts['manual']) ?></p>
    <p><a class="paybtn" href="<?= $h($manualUrl) ?>" target="_blank" rel="noopener"><?= $h($texts['manual_btn']) ?> — <?= $h($price) ?></a></p>
    <?php else: ?>
    <div id="buy-form">
        <label><?= $h($texts['email']) ?>
            <input id="email" type="email" required maxlength="254" autocomplete="email">
        </label>
        <div id="paypal-buttons"></div>
    </div>
    <p id="msg" class="msg" role="status" hidden></p>
    <?php endif; ?>
    <div class="links">
        <a href="./?lang=<?= $h($lang) ?>"><?= $h($texts['serial']) ?></a>
        <a href="../"><?= $h($texts['back']) ?></a>
    </div>
</main>
<?php if (!$manual): ?>
<script src="<?= $h($sdk) ?>"></script>
<script>
(function () {
  const T = <?= json_encode($texts, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>;
  const LANG = <?= json_encode($lang) ?>;
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("msg");
  const show = (key, ok) => {
    msgEl.textContent = T[key] || T.error;
    msgEl.className = "msg " + (ok ? "ok" : "err");
    msgEl.hidden = false;
  };
  const post = (body) => fetch("buy.php", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }).then((r) => r.json());
  const validEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim());
  // nincs client_id, vagy a PayPal SDK nem töltődött be
  if (typeof paypal === "undefined") {
    document.getElementById("buy-form").hidden = true;
    show("unavailable", false);
    return;
  }

  paypal.Buttons({
    style: { layout: "vertical", color: "gold", shape: "rect", label: "pay" },
    onClick: (data, actions) => {
      msgEl.hidden = true;
      if (validEmail()) return actions.resolve();
      show("invalid_email", false);
      emailEl.focus();
      return actions.reject();
    },
    createOrder: () => post({ action: "create", email: emailEl.value.trim(), lang: LANG }).then((res) => {
      if (res.id) return res.id;
      show(res.error || "error", false);
      throw new Error(res.error || "create");
    }),
    onApprove: (data) => post({ action: "capture", orderID: data.orderID }).then((res) => {
      const result = res.result || "error";
      show(result, result === "sent" || result === "pending");
      if (result === "sent" || result === "pending") document.getElementById("buy-form").hidden = true;
    }).catch(() => show("error", false)),
    onCancel: () => show("cancel", false),
    onError: () => { if (msgEl.hidden) show("error", false); }
  }).render("#paypal-buttons");
})();
</script>
<?php endif; ?>
</body>
</html>
