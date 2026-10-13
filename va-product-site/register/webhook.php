<?php
declare(strict_types=1);

// PayPal webhook (PAYMENT.CAPTURE.COMPLETED): tartalék teljesítés, ha a vevő a capture előtt bezárta az oldalt.
// PayPal Developer → App → Webhooks: https://www.c64va.pro/register/webhook.php, a webhook ID a config paypal.webhook_id-be.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/paypal.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
$raw = (string) file_get_contents('php://input');
try {
    if (!vaVerifyWebhook($raw)) {
        http_response_code(400);
        exit;
    }
    $event = json_decode($raw, true);
    if (($event['event_type'] ?? '') === 'PAYMENT.CAPTURE.COMPLETED') {
        $orderId = (string) ($event['resource']['supplementary_data']['related_ids']['order_id'] ?? '');
        if ($orderId !== '' && vaFulfillOrder($orderId) === 'mail') {
            // 5xx → a PayPal később újraküldi az eseményt
            http_response_code(503);
            exit;
        }
    }
    http_response_code(200);
} catch (Throwable $e) {
    error_log('VA webhook error: ' . $e->getMessage());
    http_response_code(500);
}
