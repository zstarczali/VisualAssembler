<?php
declare(strict_types=1);

// PayPal Orders v2: fix áras Professional vásárlás. A teljesítés (vaFulfillOrder) a capture válaszból
// és a webhookból is lefut; a va_purchases.state miatt csak egyszer küld serialt.

if (!defined('VA_REGISTER')) {
    http_response_code(403);
    exit;
}

function vaPaypalCfg(): array
{
    $p = vaConfig()['paypal'] ?? [];
    $secret = vaEnv('VA_PAYPAL_SECRET');
    if ($secret !== '') {
        $p['secret'] = $secret;
    }
    $p['base'] = ($p['mode'] ?? 'sandbox') === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    return $p;
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
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_SLASHES));
        }
    }
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($raw === false) {
        throw new RuntimeException('PayPal kapcsolat: ' . $err);
    }
    $data = json_decode((string) $raw, true);
    if ($code < 200 || $code >= 300 || !is_array($data)) {
        throw new RuntimeException("PayPal $method $path ($code): " . substr((string) $raw, 0, 500));
    }
    return $data;
}

function vaPaypalToken(): string
{
    static $token = null;
    if ($token === null) {
        $token = (string) (vaPaypalRequest('POST', '/v1/oauth2/token')['access_token'] ?? '');
        if ($token === '') {
            throw new RuntimeException('PayPal: nincs access token.');
        }
    }
    return $token;
}

/**
 * Order létrehozása a licenc e-mail címre. Eredmény: ['id' => ...] vagy ['error' => 'invalid_email' | 'licensed' | 'rate'].
 */
function vaCreateOrder(string $rawEmail, string $lang): array
{
    $email = vaNormalizeEmail($rawEmail);
    if (!vaValidEmail($email)) {
        return ['error' => 'invalid_email'];
    }
    $db = vaDb();
    $ip = vaClientIp();
    $st = $db->prepare('SELECT COUNT(*) FROM va_register_attempts WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)');
    $st->execute([$ip]);
    if ((int) $st->fetchColumn() >= (int) (vaConfig()['max_per_ip_per_hour'] ?? 10)) {
        return ['error' => 'rate'];
    }
    $db->prepare('INSERT INTO va_register_attempts (ip, created_at) VALUES (?, NOW())')->execute([$ip]);

    // akinek már van serialja, ne fizessen kétszer
    $st = $db->prepare('SELECT 1 FROM va_serial_requests WHERE email = ? AND mailed_at IS NOT NULL');
    $st->execute([$email]);
    if ($st->fetchColumn() !== false) {
        return ['error' => 'licensed'];
    }

    $p = vaPaypalCfg();
    $order = vaPaypalRequest('POST', '/v2/checkout/orders', [
        'intent' => 'CAPTURE',
        'purchase_units' => [[
            'description' => $p['item_name'],
            'custom_id' => $email,
            'amount' => ['currency_code' => $p['currency'], 'value' => $p['price']],
        ]],
        'application_context' => [
            'brand_name' => 'C64 Visual Assembler',
            'shipping_preference' => 'NO_SHIPPING',
            'user_action' => 'PAY_NOW',
        ],
    ], vaPaypalToken());
    $db->prepare('INSERT INTO va_purchases (order_id, email, lang, amount, currency, state, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())')
        ->execute([$order['id'], $email, $lang, $p['price'], $p['currency'], 'created']);
    return ['id' => $order['id']];
}

/** Capture a vevő jóváhagyása után. Eredmény: lásd vaFulfillOrder. */
function vaCaptureOrder(string $orderId): string
{
    if (!preg_match('/^[A-Z0-9]{6,40}$/', $orderId)) {
        return 'error';
    }
    try {
        vaPaypalRequest('POST', '/v2/checkout/orders/' . $orderId . '/capture', [], vaPaypalToken());
    } catch (RuntimeException $e) {
        // ORDER_ALREADY_CAPTURED: a webhook vagy egy ismételt kérés megelőzött — a teljesítés alább dönt
        if (strpos($e->getMessage(), 'ORDER_ALREADY_CAPTURED') === false) {
            throw $e;
        }
    }
    return vaFulfillOrder($orderId);
}

/**
 * Fizetett order teljesítése: donor felvétele + serial kiküldése, egyszer.
 * Eredmény: 'sent' | 'pending' (a fizetés még nincs jóváírva) | 'mail' | 'error'.
 */
function vaFulfillOrder(string $orderId): string
{
    $p = vaPaypalCfg();
    $order = vaPaypalRequest('GET', '/v2/checkout/orders/' . $orderId, null, vaPaypalToken());
    $pu = $order['purchase_units'][0] ?? [];
    $capture = $pu['payments']['captures'][0] ?? [];
    $email = vaNormalizeEmail((string) ($pu['custom_id'] ?? $capture['custom_id'] ?? ''));
    $amount = $capture['amount'] ?? $pu['amount'] ?? [];
    if (!vaValidEmail($email) || ($amount['currency_code'] ?? '') !== $p['currency']
        || (float) ($amount['value'] ?? 0) + 0.001 < (float) $p['price']) {
        error_log('VA purchase mismatch: ' . $orderId);
        return 'error';
    }
    if (($order['status'] ?? '') !== 'COMPLETED' || ($capture['status'] ?? '') !== 'COMPLETED') {
        return 'pending';
    }

    $db = vaDb();
    $db->prepare('INSERT IGNORE INTO va_purchases (order_id, email, lang, amount, currency, state, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())')
        ->execute([$orderId, $email, 'en', $amount['value'], $amount['currency_code'], 'created']);
    $st = $db->prepare('SELECT lang, state FROM va_purchases WHERE order_id = ?');
    $st->execute([$orderId]);
    $row = $st->fetch();
    if (($row['state'] ?? '') === 'fulfilled') {
        return 'sent';
    }
    // atomi „foglalás”: a párhuzamos capture / webhook közül csak egy küld levelet
    $claim = $db->prepare("UPDATE va_purchases SET state = 'fulfilling', capture_id = ?, payer_email = ? WHERE order_id = ? AND state IN ('created', 'mail')");
    $claim->execute([(string) ($capture['id'] ?? ''), substr((string) ($order['payer']['email_address'] ?? ''), 0, 254), $orderId]);
    if ($claim->rowCount() !== 1) {
        return 'sent';
    }

    $name = trim(($order['payer']['name']['given_name'] ?? '') . ' ' . ($order['payer']['name']['surname'] ?? ''));
    $db->prepare('INSERT IGNORE INTO va_donors (email, full_name, donated_at) VALUES (?, ?, ?)')
        ->execute([$email, $name, gmdate('Y-m-d H:i:s') . ' UTC paypal']);
    try {
        $result = vaIssueSerial($email, (string) $row['lang'], true);
    } catch (Throwable $e) {
        $db->prepare("UPDATE va_purchases SET state = 'mail' WHERE order_id = ?")->execute([$orderId]);
        throw $e;
    }
    $db->prepare('UPDATE va_purchases SET state = ?, fulfilled_at = IF(? = \'fulfilled\', NOW(), NULL) WHERE order_id = ?')
        ->execute([$result === 'sent' ? 'fulfilled' : 'mail', $result === 'sent' ? 'fulfilled' : 'mail', $orderId]);
    return $result === 'sent' ? 'sent' : 'mail';
}

/** Webhook aláírás ellenőrzése a PayPal API-val. */
function vaVerifyWebhook(string $rawBody): bool
{
    $p = vaPaypalCfg();
    $h = static fn(string $n): string => (string) ($_SERVER['HTTP_' . str_replace('-', '_', strtoupper($n))] ?? '');
    $event = json_decode($rawBody, true);
    if (!is_array($event) || empty($p['webhook_id'])) {
        return false;
    }
    $res = vaPaypalRequest('POST', '/v1/notifications/verify-webhook-signature', [
        'auth_algo' => $h('PAYPAL-AUTH-ALGO'),
        'cert_url' => $h('PAYPAL-CERT-URL'),
        'transmission_id' => $h('PAYPAL-TRANSMISSION-ID'),
        'transmission_sig' => $h('PAYPAL-TRANSMISSION-SIG'),
        'transmission_time' => $h('PAYPAL-TRANSMISSION-TIME'),
        'webhook_id' => $p['webhook_id'],
        'webhook_event' => $event,
    ], vaPaypalToken());
    return ($res['verification_status'] ?? '') === 'SUCCESS';
}
