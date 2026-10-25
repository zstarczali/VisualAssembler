<?php
declare(strict_types=1);

// App update release: the in-app updater (downloads/VA/index.php) and the website's download
// buttons (download.php) offer installers only up to the version released here — to supporters
// first if you like (TO SUPPORTERS), then TO EVERYONE; the website always serves the everyone release. Upload a new
// version's installers to downloads/VA/ first, check them, then RELEASE it; ROLL BACK sets an
// older uploaded version again. HOTFIX: re-upload a released version's installers under the same
// names, then press HOTFIX — apps already on that version are offered it again, marked "hotfix".
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
    $action = (string) ($_POST['action'] ?? '');
    if (!isset($versions[$v])) {
        $_SESSION['flash'] = ['err', 'THIS VERSION IS NOT UPLOADED TO DOWNLOADS/VA/.'];
    } elseif ($action === 'hotfix') {
        $level = vaUpdateHotfix($db, $v, true);
        $_SESSION['flash'] = ['ok', "VERSION $v HOTFIX $level: APPS ALREADY ON $v ARE OFFERED IT AGAIN AS A HOTFIX."];
    } elseif ($action === 'supporters') {
        vaSetting($db, VA_UPDATE_SUPPORTER_SETTING, $v);
        $_SESSION['flash'] = ['ok', "VERSION $v IS RELEASED TO SUPPORTERS: ONLY THEIR APPS OFFER IT AS AN UPDATE."];
    } elseif ($action === 'release' || $action === 'rollback') {
        // everyone gets $v; the supporters' release never stays behind it
        vaSetting($db, VA_UPDATE_SETTING, $v);
        if ($action === 'rollback' || version_compare(vaUpdateApproved($db, true), $v, '<')) {
            vaSetting($db, VA_UPDATE_SUPPORTER_SETTING, $v);
        }
        $_SESSION['flash'] = ['ok', $action === 'rollback'
            ? "ROLLED BACK TO $v FOR EVERYONE."
            : "VERSION $v IS RELEASED: EVERY APP NOW OFFERS IT AS AN UPDATE."];
    }
    header('Location: release.php');
    exit;
}

$approved = vaUpdateApproved($db);
$supporters = vaUpdateApproved($db, true);
$platforms = array_keys(VA_INSTALLER_PATTERNS);
$btn = static fn(string $v, string $action, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
    . ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')">'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="version" value="' . vaH($v) . '">'
    . '<button class="btn sm ' . $cls . '" name="action" value="' . vaH($action) . '" type="submit">' . $label . '</button></form>';

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">APP UPDATE <span>RELEASE</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">RELEASED TO EVERYONE: <span class="yes"><?= $h($approved) ?></span>
            &nbsp; TO SUPPORTERS: <span class="<?= $supporters === $approved ? 'yes' : 'warn' ?>"><?= $h($supporters) ?></span></div>
        <?php if ($versions): ?><table class="wide">
            <tr><th>VERSION</th><th>STATE</th><?php foreach ($platforms as $p): ?><th><?= $h($p) ?></th><?php endforeach; ?><th></th></tr>
            <?php foreach ($versions as $v => $have):
                $cmp = version_compare($v, $approved);
                $sup = $cmp > 0 && version_compare($v, $supporters, '<=');
                [$cls, $state] = $cmp === 0 ? ['yes', 'RELEASED'] : ($sup ? ['warn', version_compare($v, $supporters) === 0 ? 'SUPPORTERS' : 'SUPPORTERS (OLDER)'] : ($cmp > 0 ? ['warn', 'WAITING'] : ['no', 'OLDER'])); ?><tr>
                <td class="n"><?= $h($v) ?></td>
                <?php $hotfix = vaUpdateHotfix($db, $v); ?>
                <td class="<?= $cls ?>"><?= $state ?><?= $hotfix > 0 ? ' <span class="warn">HOTFIX ' . $hotfix . '</span>' : '' ?></td>
                <?php foreach ($platforms as $p): ?><td><?= in_array($p, $have, true) ? '<span class="yes">✓</span>' : '<span class="no">-</span>' ?></td><?php endforeach; ?>
                <td><?php if ($cmp === 0 || version_compare($v, $supporters) === 0): ?><?= $btn($v, 'hotfix', 'HOTFIX', '', "Mark the uploaded $v installers as hotfix " . ($hotfix + 1) . "? Apps already on $v will download $v again.") ?><?php endif; ?>
                    <?php if ($cmp > 0): ?>
                    <?php if (version_compare($v, $supporters) !== 0): ?><?= $btn($v, 'supporters', 'TO SUPPORTERS', '', "Release $v to supporters only? Their apps will be offered this update.") ?><?php endif; ?>
                    <?= $btn($v, 'release', 'TO EVERYONE', 'pri', "Release $v to everyone? Every app will be offered this update.") ?>
                    <?php elseif ($cmp < 0): ?><?= $btn($v, 'rollback', 'ROLL BACK', '', "Roll back to $v for everyone (supporters too)? Apps will not be offered anything newer.") ?><?php endif; ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO INSTALLERS IN DOWNLOADS/VA/.</p><?php endif; ?>
        <p class="hint">UPLOAD A NEW VERSION'S INSTALLERS TO DOWNLOADS/VA/: IT STAYS WAITING, THE IN-APP UPDATE DOES NOT OFFER IT. CHECK THE FILES, THEN RELEASE IT TO SUPPORTERS OR TO EVERYONE.<br>
            SUPPORTERS = APPS THAT STILL HAVE A 2.5.6–2.5.9 SUPPORTER SERIAL IN THEIR CONFIG (THEY ASK DOWNLOADS/VA/?SUP=1). THIS IS A FLAG FROM THE APP, NOT A LOCK.<br>
            THE APP READS THE NEWEST VERSION FROM DOWNLOADS/VA/ (ONLY RELEASED VERSIONS ARE LISTED THERE); A MISSING PLATFORM GETS NO UPDATE UNTIL ITS INSTALLER IS UPLOADED.<br>
            HOTFIX: OVERWRITE A RELEASED VERSION'S INSTALLERS IN DOWNLOADS/VA/ (SAME FILE NAMES), THEN PRESS HOTFIX: APPS ALREADY ON THAT VERSION ARE OFFERED IT AGAIN, MARKED "HOTFIX". UPLOAD FIRST — THE APPS DOWNLOAD WHATEVER FILE IS THERE.<br>
            THE WEBSITE'S DOWNLOAD BUTTONS (DOWNLOAD.PHP) ALSO SERVE THE RELEASED VERSION. A WAITING FILE IS OFFERED NOWHERE, BUT ITS DIRECT URL STILL WORKS FOR WHOEVER KNOWS IT.</p>
    </div>
<?php vaAdminPage('RELEASE', (string) ob_get_clean());
