<?php
declare(strict_types=1);

// PayPal Orders v2 (REST) az adományokhoz (donate.php): token, order létrehozás, capture.
// Beállítás: config.php 'paypal' => [mode, client_id, secret, currency, brand]; a client ID és a secret jöhet környezeti
// változóból is (pl. a gyökér .htaccess SetEnv VA_PAYPAL_CLIENT_ID / VA_PAYPAL_SECRET), az elsőbbséget élvez.

if (!defined('VA_REGISTER')) {
    http_response_code(403);
    exit;
}

final class PaypalError extends RuntimeException
{
    public string $issue;

    public function __construct(string $message, string $issue)
    {
        parent::__construct($message);
        $this->issue = preg_replace('/[^A-Z0-9_]/', '', strtoupper($issue));
    }
}

function vaPaypalCfg(): array
{
    $p = vaConfig()['paypal'] ?? [];
    foreach (['client_id' => 'VA_PAYPAL_CLIENT_ID', 'secret' => 'VA_PAYPAL_SECRET'] as $key => $env) {
        $v = vaEnv($env);
        if ($v !== '') {
            $p[$key] = $v;
        }
    }
    $p['mode'] = ($p['mode'] ?? 'live') === 'sandbox' ? 'sandbox' : 'live';
    $p['currency'] = strtoupper((string) ($p['currency'] ?? 'EUR'));
    $p['base'] = $p['mode'] === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    return $p;
}

/** Van-e használható PayPal-beállítás (különben a donate.php a tartalék linket mutatja). */
function vaPaypalReady(): bool
{
    $p = vaPaypalCfg();
    return ($p['client_id'] ?? '') !== '' && ($p['secret'] ?? '') !== '' && function_exists('curl_init');
}

function vaPaypalRequest(string $method, string $path, ?array $body = null, ?string $token = null): array
{
    $p = vaPaypalCfg();
    $ch = curl_init($p['base'] . $path);
    $headers = ['Accept: application/json'];
    if ($token === null) {
        curl_setopt($ch, CURLOPT_USERPWD, $p['client_id'] . ':' . $p['secret']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
    } else {
        $headers[] = 'Authorization: Bearer ' . $token;
        $headers[] = 'Content-Type: application/json';
        if ($body !== null) {
            // üres törzs: a PayPal JSON-objektumot vár ({}), az üres tömb ([]) MALFORMED_REQUEST_JSON hibát ad
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body === [] ? '{}' : json_encode($body, JSON_UNESCAPED_SLASHES));
        }
    }
    curl_setopt_array($ch, [CURLOPT_CUSTOMREQUEST => $method, CURLOPT_HTTPHEADER => $headers, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30]);
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($raw === false) {
        throw new RuntimeException('PayPal connection: ' . $err);
    }
    $data = json_decode((string) $raw, true);
    if ($code < 200 || $code >= 300 || !is_array($data)) {
        // a PayPal hibakód (pl. INSTRUMENT_DECLINED) a kivétel kódjában is megy tovább a felületnek
        $issue = (string) ($data['details'][0]['issue'] ?? $data['name'] ?? '');
        throw new PaypalError("PayPal $method $path ($code): " . substr((string) $raw, 0, 500), $issue);
    }
    return $data;
}

function vaPaypalToken(): string
{
    static $token = null;
    if ($token === null) {
        $token = (string) (vaPaypalRequest('POST', '/v1/oauth2/token')['access_token'] ?? '');
        if ($token === '') {
            throw new RuntimeException('PayPal: no access token.');
        }
    }
    return $token;
}

/** Adomány-order: az összeg a szerveren ellenőrzött, a va_donations-be 'created' állapotban kerül. */
function vaDonationCreate(PDO $db, float $amount, string $lang, string $message): string
{
    $p = vaPaypalCfg();
    $value = number_format($amount, 2, '.', '');
    $order = vaPaypalRequest('POST', '/v2/checkout/orders', [
        'intent' => 'CAPTURE',
        'purchase_units' => [[
            'description' => 'Donation - ' . (string) ($p['brand'] ?? 'C64 Visual Assembler'),
            'amount' => ['currency_code' => $p['currency'], 'value' => $value],
        ]],
        'application_context' => ['brand_name' => (string) ($p['brand'] ?? 'C64 Visual Assembler'), 'shipping_preference' => 'NO_SHIPPING',
            'user_action' => 'PAY_NOW', 'locale' => $lang === 'hu' ? 'hu-HU' : 'en-US'],
    ], vaPaypalToken());
    $id = (string) ($order['id'] ?? '');
    if (!preg_match('/^[A-Z0-9]{6,40}$/', $id)) {
        throw new RuntimeException('PayPal: no order id.');
    }
    $db->prepare("INSERT INTO va_donations (order_id, amount, currency, state, lang, message, created_at) VALUES (?, ?, ?, 'created', ?, ?, NOW())")
        ->execute([$id, $value, $p['currency'], $lang, $message]);
    return $id;
}

/**
 * Capture és rögzítés: 'completed' | 'pending' (a PayPal még ellenőrzi) | 'error'. Csak a saját (va_donations-ben lévő)
 * order fogadható el, és az összeg / pénznem egyezzen.
 */
function vaDonationCapture(PDO $db, string $orderId): string
{
    $st = $db->prepare('SELECT * FROM va_donations WHERE order_id = ?');
    $st->execute([$orderId]);
    $row = $st->fetch();
    if (!$row) {
        return 'error';
    }
    if ($row['state'] === 'completed') {
        return 'completed';
    }
    $res = vaPaypalRequest('POST', '/v2/checkout/orders/' . $orderId . '/capture', [], vaPaypalToken());
    $cap = $res['purchase_units'][0]['payments']['captures'][0] ?? [];
    $amount = (string) ($cap['amount']['value'] ?? '');
    $currency = (string) ($cap['amount']['currency_code'] ?? '');
    if ($amount !== '' && (abs((float) $amount - (float) $row['amount']) > 0.001 || $currency !== $row['currency'])) {
        error_log("VA donation $orderId amount mismatch: $amount $currency");
        return 'error';
    }
    $status = (string) ($cap['status'] ?? $res['status'] ?? '');
    $payer = $res['payer'] ?? [];
    $name = trim((string) ($payer['name']['given_name'] ?? '') . ' ' . (string) ($payer['name']['surname'] ?? ''));
    $state = $status === 'COMPLETED' ? 'completed' : ($status === 'PENDING' ? 'pending' : 'error');
    $db->prepare('UPDATE va_donations SET state = ?, capture_id = ?, payer_email = ?, payer_name = ?, payer_country = ?, completed_at = NOW() WHERE order_id = ?')
        ->execute([$state, (string) ($cap['id'] ?? ''), (string) ($payer['email_address'] ?? ''), mb_substr($name, 0, 120),
            substr((string) ($payer['address']['country_code'] ?? ''), 0, 2), $orderId]);
    if ($state !== 'error') {
        $notify = (string) (vaConfig()['support_notify'] ?? '') ?: (string) (vaConfig()['bug_notify'] ?? '');
        vaNotifyMail($notify, '[VA donation] ' . $row['amount'] . ' ' . $row['currency'] . ($state === 'pending' ? ' (pending)' : ''),
            'From: ' . ($name !== '' ? $name : '-') . ' <' . ($payer['email_address'] ?? '-') . ">\n\n" . (string) $row['message']
            . "\n\nhttps://www.c64va.pro/register/stats.php#donations\n");
    }
    return $state;
}
