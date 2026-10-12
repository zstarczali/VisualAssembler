# License-mailer telepítés

1. Töltsd fel a `license-mailer.php`, `license-mailer.config.php.example` és `.htaccess` fájlt a webhely HTTPS-es gyökerébe.
2. A szerveren másold át az utóbbit `license-mailer.config.php` névre, töltsd ki az adatbázis-adatokat és egy hosszú, véletlen API tokennel.
3. A `license-mailer.config.php` fájlt ne commitold és ne tedd publikusan elérhetővé.
4. A helyi küldő scripthez állítsd be a `LICENSE_MAIL_API_URL` és `LICENSE_MAIL_API_TOKEN` környezeti változókat.

A PHP-végpont csak HTTPS POST kérést fogad, Bearer tokennel hitelesít, majd elküldi a licenclevelet és naplózza az eredményt a `license_email_log` táblába.
