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
    // adomány (donate.php): PayPal üzleti fiók, developer.paypal.com → Apps & Credentials → Live. A client ID és a secret
    // jöhet környezeti változóból is (pl. gyökér .htaccess: SetEnv VA_PAYPAL_CLIENT_ID … / SetEnv VA_PAYPAL_SECRET …), az elsőbbséget élvez.
    // Ha egyik helyen sincs megadva, a donate.php a donate_fallback_url linket mutatja.
    'paypal' => [
        'mode' => 'live',       // 'sandbox' teszteléshez (sandbox client_id / secret kell hozzá)
        'client_id' => '',
        'secret' => '',
        'currency' => 'EUR',
        'brand' => 'C64 Visual Assembler',
    ],
    'donate_fallback_url' => 'https://paypal.me/ZsoltTarczali',
    // register/stats.php jelszava (vagy VA_ADMIN_PASSWORD környezeti változó)
    'admin_password' => '',
    // hibabejelentés: értesítő e-mail cím (üres = nincs) és IP-nkénti óránkénti limit
    'bug_notify' => 'retroboij@outlook.com',
    // támogatási üzenet (support.php) értesítő e-mail címe; üres = a bug_notify címe
    'support_notify' => 'retroboij@outlook.com',
    'bug_max_per_hour' => 5,
    'max_per_ip_per_hour' => 10,
];
