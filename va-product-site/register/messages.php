<?php
declare(strict_types=1);

// Ad-hoc üzenetek az appnak (message.php szolgálja ki): létrehozás, szerkesztés, be/ki, törlés, megtekintésszám.
// Felirat (caption), HTML-szöveg (az app tisztítja: _serverMessageSanitize) és opcionális kép (max 1 MB, a táblában).
// Célközönség: mindenki / támogatók (régi serial a configban) / nem támogatók. RESET SEEN: rev + 1 → új id az appnak, újra megjelenik.
define('VA_REGISTER', true);
require __DIR__ . '/lib.php';
require __DIR__ . '/admin.php';

vaAdminRequire();
$h = 'vaH';
$csrf = vaAdminCsrf();
$flash = vaAdminFlash();

const VA_MSG_IMAGE_MAX = 1048576;
const VA_MSG_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

$dt = static function (string $s): ?string {
    $t = trim($s) === '' ? false : strtotime($s);
    return $t === false ? null : date('Y-m-d H:i:s', $t);
};
$ver = static fn(string $s): string => substr(preg_replace('/[^0-9A-Za-z.\-]/', '', $s), 0, 20);

/** A feltöltött kép: [bájtok, mime] vagy null, ha nincs feltöltés. */
$upload = static function (): ?array {
    $f = $_FILES['image'] ?? null;
    if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if (in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) || $f['size'] > VA_MSG_IMAGE_MAX) {
        throw new InvalidArgumentException('THE IMAGE IS TOO LARGE: ' . round($f['size'] / 1048576, 1) . ' MB, MAX 1 MB.');
    }
    if ($f['error'] !== UPLOAD_ERR_OK) {
        throw new InvalidArgumentException('THE IMAGE COULD NOT BE UPLOADED (PHP UPLOAD ERROR ' . (int) $f['error'] . ').');
    }
    $bytes = (string) file_get_contents($f['tmp_name']);
    $info = @getimagesizefromstring($bytes);
    $mime = $info['mime'] ?? '';
    if (!in_array($mime, VA_MSG_IMAGE_TYPES, true)) {
        throw new InvalidArgumentException('THE IMAGE MUST BE PNG, JPEG, GIF OR WEBP.');
    }
    return [$bytes, $mime];
};

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    vaAdminCheckCsrf('messages.php');
    $db = vaDb();
    vaMessagesMigrate($db);
    $id = (int) ($_POST['id'] ?? 0);
    $action = (string) ($_POST['action'] ?? '');
    $back = 'messages.php';
    try {
        if ($action === 'save') {
            $f = static fn(string $k, int $max): string => mb_substr(trim((string) ($_POST[$k] ?? '')), 0, $max);
            $url = $f('url', 500);
            if ($url !== '' && !preg_match('#^https://#i', $url)) {
                throw new InvalidArgumentException('THE LINK MUST START WITH https://');
            }
            if ($f('title_en', 200) === '' || $f('body_en', 8000) === '') {
                throw new InvalidArgumentException('THE ENGLISH TITLE AND TEXT ARE REQUIRED.');
            }
            $image = $upload();
            $vals = [
                $f('caption_en', 200), $f('caption_hu', 200),
                $f('title_en', 200), $f('body_en', 8000), $f('title_hu', 200), $f('body_hu', 8000), $url,
                ($_POST['level'] ?? '') === 'warn' ? 'warn' : 'info',
                $ver((string) ($_POST['min_version'] ?? '')), $ver((string) ($_POST['max_version'] ?? '')),
                in_array($_POST['os'] ?? '', ['windows', 'macos', 'linux'], true) ? (string) $_POST['os'] : '',
                $dt((string) ($_POST['starts_at'] ?? '')), $dt((string) ($_POST['ends_at'] ?? '')),
                empty($_POST['active']) ? 0 : 1,
                in_array($_POST['audience'] ?? '', ['supporters', 'others'], true) ? (string) $_POST['audience'] : '',
            ];
            if ($id > 0) {
                $db->prepare('UPDATE va_messages SET caption_en = ?, caption_hu = ?, title_en = ?, body_en = ?, title_hu = ?, body_hu = ?,
                    url = ?, level = ?, min_version = ?, max_version = ?, os = ?, starts_at = ?, ends_at = ?, active = ?, audience = ? WHERE id = ?')
                    ->execute([...$vals, $id]);
                $_SESSION['flash'] = ['ok', "MESSAGE #$id SAVED."];
            } else {
                $db->prepare('INSERT INTO va_messages (caption_en, caption_hu, title_en, body_en, title_hu, body_hu, url, level,
                    min_version, max_version, os, starts_at, ends_at, active, audience, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())')->execute($vals);
                $id = (int) $db->lastInsertId();
                $_SESSION['flash'] = ['ok', "MESSAGE #$id CREATED."];
            }
            if ($image !== null) {
                $st = $db->prepare('UPDATE va_messages SET image = ?, image_mime = ? WHERE id = ?');
                $st->bindValue(1, $image[0], PDO::PARAM_LOB);
                $st->bindValue(2, $image[1]);
                $st->bindValue(3, $id, PDO::PARAM_INT);
                $st->execute();
            } elseif (!empty($_POST['remove_image'])) {
                $db->prepare("UPDATE va_messages SET image = NULL, image_mime = '' WHERE id = ?")->execute([$id]);
            }
            $back = 'messages.php?edit=' . $id . '#form';
        } elseif ($action === 'reset_seen') {
            // az app a látott id-ket tárolja: új id-vel (m<sorszám>-<rev>) mindenkinél újra megjelenik
            $db->prepare('UPDATE va_messages SET rev = rev + 1 WHERE id = ?')->execute([$id]);
            $db->prepare('DELETE FROM va_message_views WHERE message_id = ?')->execute([$id]);
            $_SESSION['flash'] = ['ok', "MESSAGE #$id WILL BE SHOWN AGAIN TO EVERY MATCHING INSTALL."];
        } elseif ($action === 'toggle') {
            $db->prepare('UPDATE va_messages SET active = 1 - active WHERE id = ?')->execute([$id]);
        } elseif ($action === 'delete') {
            $db->prepare('DELETE FROM va_messages WHERE id = ?')->execute([$id]);
            $db->prepare('DELETE FROM va_message_views WHERE message_id = ?')->execute([$id]);
            $_SESSION['flash'] = ['ok', "MESSAGE #$id DELETED."];
        }
    } catch (InvalidArgumentException $e) {
        $_SESSION['flash'] = ['err', $e->getMessage()];
    } catch (Throwable $e) {
        error_log('VA messages: ' . $e->getMessage());
        $_SESSION['flash'] = ['err', 'SERVER ERROR: ' . $e->getMessage()];
    }
    header('Location: ' . $back);
    exit;
}

$db = vaDb();
vaMessagesMigrate($db);
$list = $db->query('SELECT m.id, m.active, m.rev, m.audience, m.level, m.caption_en, m.caption_hu, m.title_en, m.body_en, m.title_hu, m.body_hu, m.url,
        m.image_mime, LENGTH(m.image) AS image_size, m.min_version, m.max_version, m.os, m.starts_at, m.ends_at, m.created_at,
        (SELECT COUNT(*) FROM va_message_views v WHERE v.message_id = m.id) AS views
    FROM va_messages m ORDER BY m.id DESC')->fetchAll();
$active30 = (int) $db->query('SELECT COUNT(*) FROM va_installs WHERE last_at > NOW() - INTERVAL 30 DAY')->fetchColumn();
$edit = ['id' => 0, 'active' => 1, 'audience' => '', 'level' => 'info', 'caption_en' => '', 'caption_hu' => '', 'title_en' => '', 'body_en' => '',
    'title_hu' => '', 'body_hu' => '', 'url' => '', 'image_size' => 0, 'min_version' => '', 'max_version' => '', 'os' => '',
    'starts_at' => null, 'ends_at' => null];
foreach ($list as $m) {
    if ((int) ($_GET['edit'] ?? 0) === (int) $m['id']) {
        $edit = $m;
    }
}
$local = static fn(?string $s): string => $s ? date('Y-m-d\TH:i', strtotime($s)) : '';
$state = static function (array $m): array {
    if (!$m['active']) {
        return ['OFF', 'no'];
    }
    if ($m['starts_at'] && strtotime($m['starts_at']) > time()) {
        return ['SCHEDULED', 'warn'];
    }
    if ($m['ends_at'] && strtotime($m['ends_at']) <= time()) {
        return ['EXPIRED', 'no'];
    }
    return ['LIVE', 'yes'];
};
$btn = static fn(int $id, string $action, string $label, string $cls, string $confirm) => '<form class="inline" method="post"'
    . ($confirm !== '' ? ' onsubmit="return confirm(' . vaH(json_encode($confirm)) . ')"' : '') . '>'
    . '<input type="hidden" name="csrf" value="' . vaH($csrf) . '"><input type="hidden" name="id" value="' . $id . '">'
    . '<button class="btn sm ' . $cls . '" name="action" value="' . $action . '" type="submit">' . $label . '</button></form> ';
$target = static function (array $m): string {
    $v = $m['min_version'] !== '' || $m['max_version'] !== '' ? ' ' . ($m['min_version'] ?: '*') . ' – ' . ($m['max_version'] ?: '*') : '';
    $aud = ['supporters' => ' / SUPPORTERS', 'others' => ' / NON-SUPPORTERS'][$m['audience']] ?? '';
    return ($m['os'] ?: 'ALL OS') . $v . $aud;
};
// a mentett kép data URL-ként (a sandboxolt előnézet nem kapja meg a belépési sütit)
$imgUrl = '';
if ($edit['id'] && (int) $edit['image_size'] > 0) {
    $st = $db->prepare('SELECT image, image_mime FROM va_messages WHERE id = ?');
    $st->execute([(int) $edit['id']]);
    $img = $st->fetch();
    if ($img && in_array($img['image_mime'], VA_MSG_IMAGE_TYPES, true)) {
        $imgUrl = 'data:' . $img['image_mime'] . ';base64,' . base64_encode((string) $img['image']);
    }
}

ob_start(); ?>
    <div class="sec-s">// ADMIN</div>
    <h1 class="sec-t">IN-APP <span>MESSAGES</span></h1>
    <?php if ($flash): ?><div class="flash <?= $h($flash[0]) ?>"><?= $h($flash[1]) ?></div><?php endif; ?>

    <div class="box" style="margin-bottom:18px">
        <div class="box-t">MESSAGES</div>
        <?php if ($list): ?><table class="wide">
            <tr><th>#</th><th>STATE</th><th>TITLE</th><th>TARGET</th><th>FROM → UNTIL</th><th>RECEIVED BY</th><th></th></tr>
            <?php foreach ($list as $m): [$st, $cls] = $state($m); ?><tr>
                <td class="n"><?= (int) $m['id'] ?></td>
                <td class="<?= $cls ?>"><?= $st ?><?= $m['level'] === 'warn' ? ' / WARN' : '' ?></td>
                <td class="e clip"><?= $h($m['title_en']) ?><?= $m['title_hu'] !== '' ? ' <span class="no">+HU</span>' : '' ?><?= (int) $m['image_size'] > 0 ? ' <span class="no">+IMG</span>' : '' ?></td>
                <td><?= $h($target($m)) ?></td>
                <td><?= $h(($m['starts_at'] ? substr($m['starts_at'], 0, 16) : '-') . ' → ' . ($m['ends_at'] ? substr($m['ends_at'], 0, 16) : '-')) ?></td>
                <td class="n"><?= (int) $m['views'] ?><?= (int) $m['rev'] > 0 ? ' <span class="no">(RESET ' . (int) $m['rev'] . 'X)</span>' : '' ?></td>
                <td><a class="btn sm" href="messages.php?edit=<?= (int) $m['id'] ?>#form">EDIT</a>
                    <?= $btn((int) $m['id'], 'toggle', $m['active'] ? 'TURN OFF' : 'TURN ON', '', '') ?>
                    <?= $btn((int) $m['id'], 'reset_seen', 'RESET SEEN', '', 'Show message #' . $m['id'] . ' again to every matching install, also to those who already closed it?') ?>
                    <?= $btn((int) $m['id'], 'delete', 'DELETE', 'dng', 'Delete message #' . $m['id'] . '?') ?></td>
            </tr><?php endforeach; ?>
        </table><?php else: ?><p class="no">NO MESSAGES YET.</p><?php endif; ?>
        <p class="hint">THE APP ASKS FOR A MESSAGE AT START-UP AND SHOWS THE NEWEST LIVE ONE THAT MATCHES ITS OS AND VERSION, ONCE PER INSTALL.<br>
            RECEIVED BY = INSTALLS THAT GOT IT (<?= $active30 ?> INSTALLS WERE ACTIVE IN THE LAST 30 DAYS). AN EDITED MESSAGE IS NOT SHOWN AGAIN; USE RESET SEEN TO SHOW IT TO EVERYONE AGAIN.<br>
            SUPPORTERS = INSTALLS THAT STILL HAVE A SERIAL FROM 2.5.6–2.5.9 IN THEIR CONFIG (DONORS AND BUYERS WHO REGISTERED THE APP). A DONOR WHO NEVER ENTERED THE SERIAL COUNTS AS A NON-SUPPORTER.</p>
    </div>

    <div class="box" id="form">
        <div class="box-t"><?= $edit['id'] ? 'EDIT MESSAGE #' . (int) $edit['id'] : 'NEW MESSAGE' ?></div>
        <div class="msg-edit">
        <form method="post" class="msg-form" enctype="multipart/form-data">
            <input type="hidden" name="csrf" value="<?= $h($csrf) ?>"><input type="hidden" name="id" value="<?= (int) $edit['id'] ?>">
            <label>CAPTION (EN)<input type="text" name="caption_en" maxlength="200" placeholder="NEW IN 2.6.1" value="<?= $h($edit['caption_en']) ?>"></label>
            <label>TITLE (EN) *<input type="text" name="title_en" maxlength="200" required value="<?= $h($edit['title_en']) ?>"></label>
            <label>TEXT (EN, HTML) *<textarea class="note" name="body_en" maxlength="8000" required><?= $h($edit['body_en']) ?></textarea></label>
            <label>CAPTION (HU)<input type="text" name="caption_hu" maxlength="200" value="<?= $h($edit['caption_hu']) ?>"></label>
            <label>TITLE (HU)<input type="text" name="title_hu" maxlength="200" value="<?= $h($edit['title_hu']) ?>"></label>
            <label>TEXT (HU, HTML)<textarea class="note" name="body_hu" maxlength="8000"><?= $h($edit['body_hu']) ?></textarea></label>
            <label>IMAGE (OPTIONAL, PNG / JPEG / GIF / WEBP; LARGER THAN 1 MB OR 1600 PX IS SCALED DOWN AUTOMATICALLY)<input type="file" name="image" accept="image/png,image/jpeg,image/gif,image/webp">
                <span class="img-note" id="img-note"></span></label>
            <?php if ($imgUrl !== ''): ?><div class="row msg-img-row"><img class="msg-thumb" src="<?= $h($imgUrl) ?>" alt="">
                <label class="chk"><input type="checkbox" name="remove_image" value="1"> REMOVE IMAGE</label></div><?php endif; ?>
            <label>LINK BUTTON (OPTIONAL, HTTPS)<input type="text" name="url" maxlength="500" placeholder="https://www.c64va.pro/" value="<?= $h($edit['url']) ?>"></label>
            <div class="row">
                <label>LEVEL<select name="level"><option value="info">INFO</option><option value="warn"<?= $edit['level'] === 'warn' ? ' selected' : '' ?>>WARN</option></select></label>
                <label>AUDIENCE<select name="audience"><?php foreach (['' => 'EVERYONE', 'supporters' => 'SUPPORTERS', 'others' => 'NON-SUPPORTERS'] as $k => $v): ?><option value="<?= $k ?>"<?= $edit['audience'] === $k ? ' selected' : '' ?>><?= $v ?></option><?php endforeach; ?></select></label>
                <label>OS<select name="os"><?php foreach (['' => 'ALL', 'windows' => 'WINDOWS', 'macos' => 'MACOS', 'linux' => 'LINUX'] as $k => $v): ?><option value="<?= $k ?>"<?= $edit['os'] === $k ? ' selected' : '' ?>><?= $v ?></option><?php endforeach; ?></select></label>
                <label>MIN VERSION<input type="text" name="min_version" size="8" placeholder="2.6.0" value="<?= $h($edit['min_version']) ?>"></label>
                <label>MAX VERSION<input type="text" name="max_version" size="8" value="<?= $h($edit['max_version']) ?>"></label>
                <label>FROM (DATE AND TIME)<span class="dt"><input type="datetime-local" name="starts_at" step="60" value="<?= $h($local($edit['starts_at'])) ?>">
                    <button class="btn sm" type="button" data-dt="now">NOW</button><button class="btn sm" type="button" data-dt="clear">CLEAR</button></span></label>
                <label>UNTIL (DATE AND TIME)<span class="dt"><input type="datetime-local" name="ends_at" step="60" value="<?= $h($local($edit['ends_at'])) ?>">
                    <button class="btn sm" type="button" data-dt="+1">+1 DAY</button><button class="btn sm" type="button" data-dt="+7">+7 DAYS</button><button class="btn sm" type="button" data-dt="+30">+30 DAYS</button><button class="btn sm" type="button" data-dt="clear">CLEAR</button></span></label>
                <label class="chk"><input type="checkbox" name="active" value="1"<?= $edit['active'] ? ' checked' : '' ?>> ACTIVE</label>
            </div>
            <div class="row" style="margin-top:14px">
                <button class="btn pri" name="action" value="save" type="submit"><?= $edit['id'] ? 'SAVE' : 'CREATE' ?></button>
                <?php if ($edit['id']): ?><a class="btn" href="messages.php#form">CANCEL</a><?php endif; ?>
            </div>
        </form>
        <div class="msg-preview">
            <div class="row" style="margin-bottom:8px"><span class="box-t" style="margin:0">PREVIEW</span>
                <button class="btn sm" type="button" data-pv="en">EN</button><button class="btn sm" type="button" data-pv="hu">HU</button></div>
            <iframe id="msg-preview" sandbox="" title="Message preview"></iframe>
        </div>
        </div>
        <p class="hint">CAPTION = SMALL LINE ABOVE THE TITLE. TEXT IS HTML; THE APP KEEPS ONLY P, BR, B, STRONG, I, EM, U, S, SMALL, CODE, PRE, BLOCKQUOTE,
            H3, H4, UL, OL, LI, HR, SPAN AND A (HTTPS / MAILTO LINKS, OPENED IN THE BROWSER). TEXT WITHOUT TAGS KEEPS ITS LINE BREAKS.<br>
            OTHER UI LANGUAGES GET THE ENGLISH TEXT. CLICK A DATE FIELD FOR THE CALENDAR.
            TIMES ARE HUNGARIAN TIME (NOW: <?= date('Y-m-d H:i') ?>); EMPTY FROM = RIGHT AWAY, EMPTY UNTIL = NO END.</p>
    </div>
    <script>
    (function () {
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var fmt = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); };
      var from = document.querySelector('input[name=starts_at]');
      document.querySelectorAll('.msg-form input[type=datetime-local]').forEach(function (inp) {
        inp.addEventListener('click', function () { try { inp.showPicker(); } catch (e) {} });
      });
      document.querySelectorAll('[data-dt]').forEach(function (b) {
        b.addEventListener('click', function () {
          var inp = b.parentNode.querySelector('input'), a = b.getAttribute('data-dt');
          if (a === 'clear') { inp.value = ''; return; }
          if (a === 'now') { inp.value = fmt(new Date()); return; }
          var base = from.value ? new Date(from.value) : new Date();
          base.setDate(base.getDate() + parseInt(a, 10));
          inp.value = fmt(base);
        });
      });

      // előnézet: ugyanaz a szűrés, mint az appban (_serverMessageSanitize); a sandboxolt iframe nem futtat scriptet
      var form = document.querySelector('.msg-form'), frame = document.getElementById('msg-preview');
      var lang = 'en', imgUrl = <?= json_encode($imgUrl) ?>, fileUrl = '';
      var TAGS = { P: 1, BR: 1, B: 1, STRONG: 1, I: 1, EM: 1, U: 1, S: 1, SMALL: 1, CODE: 1, PRE: 1, BLOCKQUOTE: 1, H3: 1, H4: 1, UL: 1, OL: 1, LI: 1, HR: 1, SPAN: 1, A: 1 };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      function clean(html) {
        if (!/<[a-z!\/]/i.test(html)) return esc(html).replace(/\n/g, '<br>');
        var tpl = document.createElement('template');
        tpl.innerHTML = html;
        (function walk(node) {
          Array.prototype.slice.call(node.childNodes).forEach(function (n) {
            if (n.nodeType === 3) return;
            var tag = n.nodeType === 1 ? n.tagName.toUpperCase() : '';
            if (!TAGS[tag] || n.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
              if (tag && !/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|SVG|MATH|NOSCRIPT|TEXTAREA|SELECT|TITLE)$/.test(tag)) {
                walk(n);
                while (n.firstChild) node.insertBefore(n.firstChild, n);
              }
              n.remove();
              return;
            }
            var href = tag === 'A' ? (n.getAttribute('href') || '').trim() : '';
            Array.prototype.slice.call(n.attributes).forEach(function (a) { n.removeAttribute(a.name); });
            if (/^(https?:|mailto:)/i.test(href)) n.setAttribute('href', href);
            walk(n);
          });
        })(tpl.content);
        return tpl.innerHTML;
      }
      function render() {
        var v = function (k) { var el = form.elements[k + '_' + lang]; var s = el ? el.value.trim() : ''; return s || (form.elements[k + '_en'] || {}).value || ''; };
        var img = fileUrl || (form.elements.remove_image && form.elements.remove_image.checked ? '' : imgUrl);
        var warn = form.elements.level.value === 'warn';
        frame.srcdoc = '<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:18px;background:#1d1d3a;color:#c9c9e2;font:14px/1.55 system-ui,sans-serif}' +
          '.cap{color:#8f8fd0;font:600 11px/1.3 monospace;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px}' +
          'h2{margin:0 0 10px;font-size:18px;color:' + (warn ? '#e05555' : '#e2e2ff') + '}img{display:block;max-width:100%;max-height:220px;margin:0 auto 12px;border-radius:6px}' +
          'a{color:#dce78f}pre,code{font-family:monospace}</style>' +
          (v('caption') ? '<div class="cap">' + esc(v('caption')) + '</div>' : '') + '<h2>' + esc(v('title')) + '</h2>' +
          (img ? '<img src="' + esc(img) + '" alt="">' : '') + '<div>' + clean(v('body')) + '</div>';
      }
      document.querySelectorAll('[data-pv]').forEach(function (b) { b.addEventListener('click', function () { lang = b.getAttribute('data-pv'); render(); }); });
      // 1 MB / 1600 px fölött a böngésző kicsinyíti (canvas → WebP vagy JPEG), és a kisebb fájl kerül az inputba
      var MAX_BYTES = 1048576, MAX_SIDE = 1600, note = document.getElementById('img-note'), fileInput = form.elements.image;
      var mb = function (n) { return (n / 1048576).toFixed(2) + ' MB'; };
      var setNote = function (text, err) { note.textContent = text; note.className = 'img-note' + (err ? ' err' : ''); };
      function showFile(file) {
        var rd = new FileReader();
        rd.onload = function () { fileUrl = String(rd.result); render(); };
        rd.readAsDataURL(file);
      }
      function shrink(file, done) {
        var img = new Image(), src = URL.createObjectURL(file);
        img.onload = function () {
          URL.revokeObjectURL(src);
          var type = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'image/webp' : 'image/jpeg';
          var side = Math.min(MAX_SIDE, Math.max(img.naturalWidth, img.naturalHeight));
          // minőség 0.9 → 0.5, ha az sem elég, 75%-os méret, legfeljebb 240 px-ig
          var attempt = function (q) {
            var scale = side / Math.max(img.naturalWidth, img.naturalHeight);
            var w = Math.max(1, Math.round(img.naturalWidth * scale)), h = Math.max(1, Math.round(img.naturalHeight * scale));
            var c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            c.toBlob(function (blob) {
              if (!blob) { done(null); return; }
              if (blob.size <= MAX_BYTES) { done(blob, w, h); return; }
              if (q > 0.55) { attempt(q - 0.1); return; }
              side = Math.round(side * 0.75);
              if (side < 240) { done(null); return; }
              attempt(0.85);
            }, type, q);
          };
          attempt(0.9);
        };
        img.onerror = function () { URL.revokeObjectURL(src); done(null); };
        img.src = src;
      }
      fileInput.addEventListener('change', function () {
        var file = this.files[0];
        fileUrl = '';
        setNote('', false);
        if (!file) { render(); return; }
        var probe = new Image(), src = URL.createObjectURL(file);
        probe.onload = function () {
          URL.revokeObjectURL(src);
          var big = file.size > MAX_BYTES || Math.max(probe.naturalWidth, probe.naturalHeight) > MAX_SIDE;
          if (!big) { setNote(probe.naturalWidth + ' x ' + probe.naturalHeight + ' px, ' + mb(file.size), false); showFile(file); return; }
          setNote('Scaling down...', false);
          shrink(file, function (blob, w, h) {
            if (!blob) { fileInput.value = ''; setNote('This image could not be scaled under 1 MB.', true); render(); return; }
            var ext = blob.type === 'image/webp' ? '.webp' : '.jpg';
            var out = new File([blob], file.name.replace(/\.[^.]+$/, '') + ext, { type: blob.type });
            var dt = new DataTransfer();
            dt.items.add(out);
            fileInput.files = dt.files;
            setNote('Scaled down: ' + mb(file.size) + ' -> ' + w + ' x ' + h + ' px, ' + mb(out.size), false);
            showFile(out);
          });
        };
        probe.onerror = function () { URL.revokeObjectURL(src); fileInput.value = ''; setNote('This file is not an image the browser can read.', true); render(); };
        probe.src = src;
      });
      form.addEventListener('input', render);
      form.addEventListener('change', render);
      render();
    })();
    </script>
<?php vaAdminPage('MESSAGES', (string) ob_get_clean());
