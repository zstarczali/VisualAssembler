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
    'max_per_ip_per_hour' => 10,
];
