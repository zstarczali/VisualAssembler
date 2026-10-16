<?php
declare(strict_types=1);

// Adomány PayPallal (üzleti fiók, Orders v2): GET = az oldal (?amount=5, ?lang=hu), POST JSON:
//   {"action": "create", "amount", "message"?, "lang"} → {"id"} | {"error"}
//   {"action": "capture", "orderID"}                 → {"result": "completed" | "pending" | "error"}
// A pénz csak a capture után mozdul; ha a vevő előtte bezárja az oldalt, nincs terhelés. Kimutatás: stats.php → DONATIONS.
// PayPal nélkül (nincs client_id / secret) a config donate_fallback_url linkjét mutatja.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/paypal.php';

header('X-Content-Type-Options: nosniff');
const VA_DONATE_MIN = 1;
const VA_DONATE_MAX = 500;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    $in = json_decode((string) file_get_contents('php://input'), true);
    $in = is_array($in) ? $in : [];
    try {
        if (!vaPaypalReady()) {
            throw new InvalidArgumentException('unavailable');
        }
        $db = vaDb();
        if (($in['action'] ?? '') === 'create') {
            $amount = round((float) ($in['amount'] ?? 0), 2);
            if ($amount < VA_DONATE_MIN || $amount > VA_DONATE_MAX) {
                throw new InvalidArgumentException('amount');
            }
            // korlát: IP-nként óránként 20 megkezdett adomány (az IP egy napig marad a va_support_rate-ben)
            $ip = vaClientIp();
            $db->exec('DELETE FROM va_support_rate WHERE created_at < NOW() - INTERVAL 1 DAY');
            $st = $db->prepare('SELECT COUNT(*) FROM va_support_rate WHERE ip = ? AND created_at > NOW() - INTERVAL 1 HOUR');
            $st->execute([$ip]);
            if ((int) $st->fetchColumn() >= 20) {
                throw new InvalidArgumentException('rate');
            }
            $db->prepare('INSERT INTO va_support_rate (ip, created_at) VALUES (?, NOW())')->execute([$ip]);
            $message = mb_substr(trim(str_replace("\0", '', (string) ($in['message'] ?? ''))), 0, 500);
            echo json_encode(['id' => vaDonationCreate($db, $amount, ($in['lang'] ?? '') === 'hu' ? 'hu' : 'en', $message)]);
        } elseif (($in['action'] ?? '') === 'capture') {
            $orderId = (string) ($in['orderID'] ?? '');
            echo json_encode(['result' => preg_match('/^[A-Z0-9]{6,40}$/', $orderId) ? vaDonationCapture($db, $orderId) : 'error']);
        } else {
            throw new InvalidArgumentException('invalid');
        }
    } catch (InvalidArgumentException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    } catch (Throwable $e) {
        error_log('VA donate: ' . $e->getMessage());
        // a PayPal hibakódja (pl. INSTRUMENT_DECLINED) a felületnek: kártya-elutasításnál újra felkínálja a fizetést
        echo json_encode(['error' => 'server', 'result' => 'error', 'detail' => $e instanceof PaypalError ? $e->issue : '']);
    }
    exit;
}

$lang = ($_GET['lang'] ?? '') === 'hu' || (($_GET['lang'] ?? '') === '' && stripos((string) ($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? ''), 'hu') === 0) ? 'hu' : 'en';
$hu = $lang === 'hu';
$pp = vaPaypalCfg();
$ready = vaPaypalReady();
$fallback = (string) (vaConfig()['donate_fallback_url'] ?? 'https://paypal.me/ZsoltTarczali');
$preset = min(VA_DONATE_MAX, max(VA_DONATE_MIN, (int) ($_GET['amount'] ?? 5)));
$cur = $pp['currency'] === 'EUR' ? '€' : $pp['currency'];
$T = $hu ? [
    'title' => 'Támogatás',
    'intro' => 'A C64 Visual Assembler és az Ultimate Basic ingyenes. Ha hasznosnak találod, egy kis adománnyal segíted a fejlesztést. Köszönöm!',
    'amount' => 'Összeg', 'other' => 'Egyéb', 'message' => 'Üzenet (nem kötelező)',
    'thanks' => 'Köszönöm a támogatást! Az adomány megérkezett.',
    'pending' => 'Köszönöm! A PayPal még feldolgozza a fizetést.',
    'cancel' => 'A fizetés megszakadt, nem történt terhelés.',
    'error' => 'Hiba történt. Ha a PayPal terhelt, írj nekem, és rendbe teszem.',
    'amountError' => 'Az összeg ' . VA_DONATE_MIN . ' és ' . VA_DONATE_MAX . ' ' . $cur . ' között lehet.',
    'rate' => 'Túl sok próbálkozás. Próbáld újra később.',
    'unavailable' => 'A PayPal fizetés most nem érhető el.',
    'fallback' => 'Támogatás PayPallal', 'back' => 'Vissza a főoldalra', 'privacy' => 'Adatkezelés',
] : [
    'title' => 'Support development',
    'intro' => 'C64 Visual Assembler and Ultimate Basic are free. If you find them useful, a small donation helps keep the development going. Thank you!',
    'amount' => 'Amount', 'other' => 'Other', 'message' => 'Message (optional)',
    'thanks' => 'Thank you for your support! The donation has arrived.',
    'pending' => 'Thank you! PayPal is still processing the payment.',
    'cancel' => 'The payment was cancelled; nothing was charged.',
    'error' => 'Something went wrong. If PayPal charged you, write to me and I will fix it.',
    'amountError' => 'The amount must be between ' . VA_DONATE_MIN . ' and ' . VA_DONATE_MAX . ' ' . $cur . '.',
    'rate' => 'Too many attempts. Please try again later.',
    'unavailable' => 'PayPal payment is not available right now.',
    'fallback' => 'Donate with PayPal', 'back' => 'Back to the home page', 'privacy' => 'Privacy policy',
];
$h = static fn(string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$sdk = 'https://www.paypal.com/sdk/js?' . http_build_query([
    'client-id' => (string) ($pp['client_id'] ?? ''), 'currency' => $pp['currency'], 'intent' => 'capture', 'locale' => $hu ? 'hu_HU' : 'en_US',
    'disable-funding' => 'paylater',
]);
?>
<!doctype html>
<html lang="<?= $h($lang) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $h($T['title']) ?> — C64 Visual Assembler</title>
  <link rel="icon" href="../favicon.ico">
  <style>
    @font-face { font-family: 'C64Pro'; src: url('../assets/C64_Pro-STYLE.woff2') format('woff2') }
    @font-face { font-family: 'C64Mono'; src: url('../assets/C64_Pro_Mono-STYLE.woff2') format('woff2') }
    *, *::before, *::after { box-sizing: border-box }
    :root { --bg: #08081a; --scr: #2c2ca8; --scr-darker: #12126a; --txt: #8888e8; --txt-hi: #b8b8ff; --txt-dim: #6262b0;
      --ylw: #b8c76f; --grn: #9ad284; --red: #ff7777; --brd: #363690 }
    html { background: var(--bg) }
    body { margin: 0; min-height: 100vh; background: var(--scr); color: var(--txt); font-family: 'C64Mono', 'Courier New', monospace; font-size: 13px; line-height: 1.7 }
    .rb { height: 7px; background: linear-gradient(90deg, #cc2200 0 16.6%, #cc7700 16.6% 33.2%, #bbbb00 33.2% 49.8%, #00a020 49.8% 66.4%, #1133cc 66.4% 83%, #7700cc 83% 100%) }
    main { max-width: 520px; margin: 0 auto; padding: 40px 16px 64px }
    h1 { font-family: 'C64Pro', monospace; font-weight: normal; color: var(--ylw); font-size: clamp(18px, 4vw, 24px); letter-spacing: 3px; margin: 0 0 12px }
    p { margin: 0 0 14px }
    .lang { float: right; font-size: 11px; color: var(--ylw) }
    .card { border: 1px solid var(--brd); background: rgba(0, 0, 0, .22); padding: 20px }
    .label { font-size: 11px; letter-spacing: 1px; color: var(--txt-dim); margin: 0 0 6px; text-transform: uppercase }
    .amounts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px }
    .amounts button { font: inherit; cursor: pointer; padding: 8px 14px; border: 1px solid var(--brd); background: transparent; color: var(--txt-hi); min-width: 64px }
    .amounts button.on, .amounts button:hover { border-color: var(--ylw); color: var(--ylw) }
    input, textarea { width: 100%; font: inherit; font-size: 13px; background: var(--scr-darker); color: var(--txt-hi); border: 1px solid var(--brd); padding: 8px 10px }
    input:focus, textarea:focus { outline: 1px solid var(--ylw); border-color: var(--ylw) }
    .custom { display: flex; align-items: center; gap: 8px; margin-bottom: 14px }
    .custom input { width: 120px }
    textarea { min-height: 70px; resize: vertical; margin-bottom: 14px }
    #paypal-buttons { min-height: 48px; background: #fff; padding: 10px; border-radius: 4px }
    .msg { border: 1px solid; padding: 10px 12px; margin: 14px 0 0 }
    .msg.ok { border-color: var(--grn); color: var(--grn) } .msg.err { border-color: var(--red); color: var(--red) }
    .msg[hidden] { display: none }
    .fallback { display: inline-block; padding: 10px 16px; background: #ffc439; color: #111; font-weight: bold; text-decoration: none }
    .links { display: flex; gap: 16px; margin-top: 18px; font-size: 11px } .links a { color: var(--ylw) }
  </style>
</head>
<body>
<div class="rb"></div>
<main>
  <a class="lang" href="?lang=<?= $hu ? 'en' : 'hu' ?>&amp;amount=<?= $preset ?>"><?= $hu ? 'ENGLISH' : 'MAGYAR' ?></a>
  <h1>♥ <?= $h(mb_strtoupper($T['title'])) ?></h1>
  <p><?= $h($T['intro']) ?></p>
  <div class="card">
  <?php if ($ready): ?>
    <div id="form">
      <p class="label"><?= $h($T['amount']) ?></p>
      <div class="amounts" role="group">
        <?php foreach ([3, 5, 10, 20] as $a): ?><button type="button" data-amount="<?= $a ?>"<?= $a === $preset ? ' class="on"' : '' ?>><?= $a ?> <?= $h($cur) ?></button><?php endforeach; ?>
      </div>
      <div class="custom"><span class="label" style="margin:0"><?= $h($T['other']) ?></span>
        <input id="amount" type="number" min="<?= VA_DONATE_MIN ?>" max="<?= VA_DONATE_MAX ?>" step="1" value="<?= $preset ?>"> <?= $h($cur) ?></div>
      <p class="label"><?= $h($T['message']) ?></p>
      <textarea id="message" maxlength="500"></textarea>
      <div id="paypal-buttons"></div>
    </div>
    <p id="msg" class="msg" role="status" hidden></p>
  <?php else: ?>
    <p><a class="fallback" href="<?= $h($fallback) ?>" target="_blank" rel="noopener">♥ <?= $h($T['fallback']) ?></a></p>
  <?php endif; ?>
  </div>
  <div class="links"><a href="../"><?= $h($T['back']) ?></a><a href="../privacy.html"><?= $h($T['privacy']) ?></a></div>
</main>
<?php if ($ready): ?>
<script src="<?= $h($sdk) ?>"></script>
<script>
(function () {
  var T = <?= json_encode($T, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?>, LANG = <?= json_encode($lang) ?>;
  var MIN = <?= VA_DONATE_MIN ?>, MAX = <?= VA_DONATE_MAX ?>;
  var amountEl = document.getElementById('amount'), msgEl = document.getElementById('msg');
  var show = function (key, ok) { msgEl.textContent = T[key] || T.error; msgEl.className = 'msg ' + (ok ? 'ok' : 'err'); msgEl.hidden = false; };
  var post = function (body) {
    return fetch('donate.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  };
  document.querySelectorAll('[data-amount]').forEach(function (b) {
    b.addEventListener('click', function () {
      amountEl.value = b.getAttribute('data-amount');
      document.querySelectorAll('[data-amount]').forEach(function (x) { x.classList.toggle('on', x === b); });
    });
  });
  amountEl.addEventListener('input', function () {
    document.querySelectorAll('[data-amount]').forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-amount') === amountEl.value); });
  });
  var amount = function () { var v = Math.round(parseFloat(amountEl.value) * 100) / 100; return v >= MIN && v <= MAX ? v : 0; };
  if (typeof paypal === 'undefined') { document.getElementById('form').hidden = true; show('unavailable', false); return; }
  paypal.Buttons({
    style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'donate' },
    onClick: function (data, actions) {
      msgEl.hidden = true;
      if (amount()) return actions.resolve();
      show('amountError', false);
      amountEl.focus();
      return actions.reject();
    },
    createOrder: function () {
      return post({ action: 'create', amount: amount(), message: document.getElementById('message').value, lang: LANG }).then(function (r) {
        if (r.id) return r.id;
        show(r.error === 'amount' ? 'amountError' : r.error, false);
        throw new Error(r.error || 'create');
      });
    },
    onApprove: function (data, actions) {
      return post({ action: 'capture', orderID: data.orderID }).then(function (r) {
        // elutasított kártya / forrás: a PayPal ablak újra felkínálja a fizetést
        if (r.detail === 'INSTRUMENT_DECLINED') return actions.restart();
        if (r.detail) console.warn('PayPal: ' + r.detail);
        var res = r.result || 'error';
        show(res === 'completed' ? 'thanks' : res, res !== 'error');
        if (res !== 'error') document.getElementById('form').hidden = true;
      }).catch(function () { show('error', false); });
    },
    onCancel: function () { show('cancel', false); },
    onError: function () { if (msgEl.hidden) show('error', false); }
  }).render('#paypal-buttons');
})();
</script>
<?php endif; ?>
</body>
</html>
