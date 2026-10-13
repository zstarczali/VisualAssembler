<?php
// Másold config.php névre és töltsd ki. A config.php nem kerül a repóba.
// A titkok környezeti változóból is jöhetnek (felülírják az itteni értéket), pl. a szerveren a
// webgyökér .htaccess-ében:  SetEnv VA_SMTP_PASS ...  /  SetEnv VA_SIGN_SEED ...  /  SetEnv VA_DB_PASS ...
return [
    'db' => [
        'host' => 'a068um.forpsi.com',
        'port' => 3306,
        'name' => '',
        'user' => '',
        'pass' => '',
    ],
    'smtp' => [
        'host' => 'smtp.forpsi.com',
        'port' => 587,
        'encryption' => 'tls',
        'user' => 'postmaster@c64va.pro',
        'pass' => '',
        'from' => 'postmaster@c64va.pro',
        'from_name' => 'C64 Visual Assembler',
        'bcc' => '',            // opcionális: másolat minden kiküldött serialról
    ],
    // A licenc privát kulcs 32 bájtos seedje base64-ben: node scripts/keygen.js phpkey
    'sign_seed' => '',
    // PayPal (Developer Dashboard → Apps & Credentials). A secret környezeti változóból is jöhet: VA_PAYPAL_SECRET
    'paypal' => [
        'mode' => 'sandbox',    // 'live' élesben
        'client_id' => '',
        'secret' => '',
        'webhook_id' => '',     // webhook: https://www.c64va.pro/register/webhook.php (PAYMENT.CAPTURE.COMPLETED)
        'price' => '5.00',
        'currency' => 'EUR',
        'item_name' => 'C64 Visual Assembler Professional',
    ],
    // register/stats.php jelszava (vagy VA_ADMIN_PASSWORD környezeti változó)
    'admin_password' => '',
    'max_per_ip_per_hour' => 10,
];
