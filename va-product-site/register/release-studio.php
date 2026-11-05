<?php
declare(strict_types=1);

// VA SID Studio update release: the app's "Check for update" (downloads/SIDS/index.php) offers installers
// only up to the version released here. Upload a new version's installers to downloads/SIDS/ first, check
// them, then RELEASE it; ROLL BACK sets an older uploaded version again. HOTFIX: re-upload a released
// version's installers under the same names, then press HOTFIX: apps already on it are offered it again.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();
$db = vaDb();
$dir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'downloads' . DIRECTORY_SEPARATOR . 'SIDS';

// uploaded versions: [version => [platform, …]], newest first
$versions = [];
foreach (vaInstallers($dir, VA_STUDIO_INSTALLER_PATTERNS) as $name => $platform) {
    $v = vaInstallerVersion($name);
    if ($v !== null) {
        $versions[$v][] = $platform;
    }
}
uksort($versions, static fn(string $a, string $b): int => version_compare($b, $a));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    vaAdminCheckCsrf('release-studio.php');
    $v = (string) ($_POST['version'] ?? '');
    $action = (string) ($_POST['action'] ?? '');
    if (!isset($versions[$v])) {
        $_SESSION['flash'] = ['err', 'THIS VERSION IS NOT UPLOADED TO DOWNLOADS/SIDS/.'];
    } elseif ($action === 'hotfix') {
        $level = vaUpdateHotfix($db, $v, true, VA_STUDIO_HOTFIX_SETTING_PREFIX);
        $_SESSION['flash'] = ['ok', "VERSION $v HOTFIX $level: APPS ALREADY ON $v ARE OFFERED IT AGAIN AS A HOTFIX."];
    } elseif ($action === 'release' || $action === 'rollback') {
        vaSetting($db, VA_STUDIO_UPDATE_SETTING, $v);
        $_SESSION['flash'] = ['ok', $action === 'rollback'
            ? "ROLLED BACK TO $v."
            : "VERSION $v IS RELEASED: EVERY VA SID STUDIO NOW OFFERS IT AS AN UPDATE."];
    }
    header('Location: release-studio.php');
    exit;
}

$approved = vaStudioUpdateApproved($db);
$released = $approved !== VA_STUDIO_UPDATE_DEFAULT;
$platforms = array_keys(VA_STUDIO_INSTALLER_PATTERNS);
$btn = static fn(string $v, string $action, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
    . ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')">'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="version" value="' . vaH($v) . '">'
    . '<button class="btn sm ' . $cls . '" name="action" value="' . vaH($action) . '" type="submit">' . $label . '</button></form>';

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">VA SID STUDIO <span>RELEASE</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">RELEASED: <span class="<?= $released ? 'yes' : 'warn' ?>"><?= $released ? $h($approved) : 'NOTHING YET' ?></span></div>
        <?php if ($versions): ?><table class="wide">
            <tr><th>VERSION</th><th>STATE</th><?php foreach ($platforms as $p): ?><th><?= $h($p) ?></th><?php endforeach; ?><th></th></tr>
            <?php foreach ($versions as $v => $have):
                $cmp = version_compare($v, $approved);
                [$cls, $state] = $cmp === 0 ? ['yes', 'RELEASED'] : ($cmp > 0 ? ['warn', 'WAITING'] : ['no', 'OLDER']);
                $hotfix = vaUpdateHotfix($db, $v, false, VA_STUDIO_HOTFIX_SETTING_PREFIX); ?><tr>
                <td class="n"><?= $h($v) ?></td>
                <td class="<?= $cls ?>"><?= $state ?><?= $hotfix > 0 ? ' <span class="warn">HOTFIX ' . $hotfix . '</span>' : '' ?></td>
                <?php foreach ($platforms as $p): ?><td><?= in_array($p, $have, true) ? '<span class="yes">✓</span>' : '<span class="no">-</span>' ?></td><?php endforeach; ?>
                <td><?php if ($cmp === 0): ?><?= $btn($v, 'hotfix', 'HOTFIX', '', "Mark the uploaded $v installers as hotfix " . ($hotfix + 1) . "? Apps already on $v will download $v again.") ?><?php endif; ?>
                    <?php if ($cmp > 0): ?><?= $btn($v, 'release', 'RELEASE', 'pri', "Release VA SID Studio $v? Every app will be offered this update.") ?>
                    <?php elseif ($cmp < 0): ?><?= $btn($v, 'rollback', 'ROLL BACK', '', "Roll back to $v? Apps will not be offered anything newer.") ?><?php endif; ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO VA SID STUDIO INSTALLERS IN DOWNLOADS/SIDS/.</p><?php endif; ?>
        <p class="hint">UPLOAD A NEW VERSION'S INSTALLERS (VA SID STUDIO_&lt;VERSION&gt;_…) TO DOWNLOADS/SIDS/: IT STAYS WAITING UNTIL YOU RELEASE IT HERE.<br>
            THE APP READS THE NEWEST VERSION FROM DOWNLOADS/SIDS/; A MISSING PLATFORM GETS NO UPDATE UNTIL ITS INSTALLER IS UPLOADED.<br>
            HOTFIX: OVERWRITE A RELEASED VERSION'S INSTALLERS (SAME FILE NAMES), THEN PRESS HOTFIX. UPLOAD FIRST — THE APPS DOWNLOAD WHATEVER FILE IS THERE.</p>
    </div>
<?php vaAdminPage('STUDIO RELEASE', (string) ob_get_clean());
