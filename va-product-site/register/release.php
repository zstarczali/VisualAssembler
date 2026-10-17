<?php
declare(strict_types=1);

// App update release: the in-app updater (downloads/VA/index.php) and the website's download
// buttons (download.php) offer installers only up to the version released here. Upload a new
// version's installers to downloads/VA/ first, check them, then RELEASE it; ROLL BACK sets an
// older uploaded version again.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();
$db = vaDb();
$dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'downloads' . DIRECTORY_SEPARATOR . 'VA';

// uploaded versions: [version => [platform, …]], newest first
$versions = [];
foreach (vaInstallers($dir) as $name => $platform) {
    $v = vaInstallerVersion($name);
    if ($v !== null) {
        $versions[$v][] = $platform;
    }
}
uksort($versions, static fn(string $a, string $b): int => version_compare($b, $a));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    vaAdminCheckCsrf('release.php');
    $v = (string) ($_POST['version'] ?? '');
    if (($_POST['action'] ?? '') === 'release' && isset($versions[$v])) {
        vaSetting($db, VA_UPDATE_SETTING, $v);
        $_SESSION['flash'] = ['ok', "VERSION $v IS RELEASED: THE APP NOW OFFERS IT AS AN UPDATE."];
    } else {
        $_SESSION['flash'] = ['err', 'THIS VERSION IS NOT UPLOADED TO DOWNLOADS/VA/.'];
    }
    header('Location: release.php');
    exit;
}

$approved = vaUpdateApproved($db);
$platforms = array_keys(VA_INSTALLER_PATTERNS);
$btn = static fn(string $v, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
    . ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')">'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="version" value="' . vaH($v) . '">'
    . '<button class="btn sm ' . $cls . '" name="action" value="release" type="submit">' . $label . '</button></form>';

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">APP UPDATE <span>RELEASE</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">RELEASED TO THE APPS: <span class="yes"><?= $h($approved) ?></span></div>
        <?php if ($versions): ?><table class="wide">
            <tr><th>VERSION</th><th>STATE</th><?php foreach ($platforms as $p): ?><th><?= $h($p) ?></th><?php endforeach; ?><th></th></tr>
            <?php foreach ($versions as $v => $have): $cmp = version_compare($v, $approved); ?><tr>
                <td class="n"><?= $h($v) ?></td>
                <td class="<?= $cmp === 0 ? 'yes' : ($cmp > 0 ? 'warn' : 'no') ?>"><?= $cmp === 0 ? 'RELEASED' : ($cmp > 0 ? 'WAITING' : 'OLDER') ?></td>
                <?php foreach ($platforms as $p): ?><td><?= in_array($p, $have, true) ? '<span class="yes">✓</span>' : '<span class="no">-</span>' ?></td><?php endforeach; ?>
                <td><?php if ($cmp > 0): ?><?= $btn($v, 'RELEASE', 'pri', "Release $v? Every app will be offered this update.") ?>
                    <?php elseif ($cmp < 0): ?><?= $btn($v, 'ROLL BACK', '', "Roll back to $v? Apps will not be offered anything newer.") ?><?php endif; ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO INSTALLERS IN DOWNLOADS/VA/.</p><?php endif; ?>
        <p class="hint">UPLOAD A NEW VERSION'S INSTALLERS TO DOWNLOADS/VA/: IT STAYS WAITING, THE IN-APP UPDATE DOES NOT OFFER IT. CHECK THE FILES, THEN RELEASE IT.<br>
            THE APP READS THE NEWEST VERSION FROM DOWNLOADS/VA/ (ONLY RELEASED VERSIONS ARE LISTED THERE); A MISSING PLATFORM GETS NO UPDATE UNTIL ITS INSTALLER IS UPLOADED.<br>
            THE WEBSITE'S DOWNLOAD BUTTONS (DOWNLOAD.PHP) ALSO SERVE THE RELEASED VERSION. A WAITING FILE IS OFFERED NOWHERE, BUT ITS DIRECT URL STILL WORKS FOR WHOEVER KNOWS IT.</p>
    </div>
<?php vaAdminPage('RELEASE', (string) ob_get_clean());
